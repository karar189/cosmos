//! PoolManager — Soroban v25 ZK privacy payment pool.
//! Stores Poseidon commitments over BN254 and enforces nullifier uniqueness on withdrawal.

#![cfg_attr(target_family = "wasm", no_std)]

use soroban_poseidon::poseidon_hash;
use soroban_sdk::{
    contract, contractimpl, contracttype, crypto::BnScalar, symbol_short, vec, Env,
    Map, Symbol, U256,
};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Commitment {
    pub leaf: U256,
    pub nullifier: U256,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PoolState {
    pub root: U256,
    pub size: u32,
}

const POOL_KEY: Symbol = symbol_short!("POOL");
const COMMITMENTS_KEY: Symbol = symbol_short!("COMMITS");
/// nullifier -> leaf: lets withdraw verify the nullifier was previously committed.
const NULLIFIER_REGISTRY: Symbol = symbol_short!("NULLREG");
/// nullifiers already spent — prevents double withdrawal.
const USED_NULLIFIERS: Symbol = symbol_short!("USEDNF");

#[contract]
pub struct PoolManager;

#[contractimpl]
impl PoolManager {
    /// Initialize pool with empty root (Poseidon of zero).
    pub fn initialize(env: Env, admin: soroban_sdk::Address) -> PoolState {
        admin.require_auth();
        let inputs = vec![&env, U256::from_u32(&env, 0)];
        let root = poseidon_hash::<3, BnScalar>(&env, &inputs);
        let state = PoolState { root, size: 0 };
        env.storage().instance().set(&POOL_KEY, &state);
        state
    }

    /// Add a commitment: leaf = Poseidon(secret, nullifier). Returns new pool root.
    pub fn commit(env: Env, secret: U256, nullifier: U256) -> Result<U256, soroban_sdk::Error> {
        let inputs = vec![&env, secret, nullifier.clone()];
        let leaf = poseidon_hash::<3, BnScalar>(&env, &inputs);

        let mut state: PoolState = env
            .storage()
            .instance()
            .get(&POOL_KEY)
            .expect("not initialized");

        let mut commits: Map<U256, Commitment> = env
            .storage()
            .instance()
            .get(&COMMITMENTS_KEY)
            .unwrap_or_else(|| Ok(Map::new(&env)))
            .unwrap();
        commits.set(leaf.clone(), Commitment { leaf: leaf.clone(), nullifier: nullifier.clone() });
        env.storage().instance().set(&COMMITMENTS_KEY, &commits);

        // Register nullifier so withdraw can verify it was committed.
        let mut null_reg: Map<U256, U256> = env
            .storage()
            .instance()
            .get(&NULLIFIER_REGISTRY)
            .unwrap_or_else(|| Ok(Map::new(&env)))
            .unwrap();
        null_reg.set(nullifier, leaf.clone());
        env.storage().instance().set(&NULLIFIER_REGISTRY, &null_reg);

        // Roll root forward: Poseidon(old_root, leaf).
        let root_inputs = vec![&env, state.root, leaf];
        state.root = poseidon_hash::<3, BnScalar>(&env, &root_inputs);
        state.size += 1;
        env.storage().instance().set(&POOL_KEY, &state);

        Ok(state.root)
    }

    /// Return current pool state (root + commitment count).
    pub fn get_state(env: Env) -> PoolState {
        env.storage().instance().get(&POOL_KEY).expect("not initialized")
    }

    /// Mark nullifiers as spent. Errors on unknown or already-used nullifier.
    /// Actual XLM payout is handled off-chain by the backend after this call succeeds.
    pub fn withdraw(
        env: Env,
        recipient: soroban_sdk::Address,
        nullifiers: soroban_sdk::Vec<U256>,
    ) -> Result<(), soroban_sdk::Error> {
        let null_reg: Map<U256, U256> = env
            .storage()
            .instance()
            .get(&NULLIFIER_REGISTRY)
            .unwrap_or_else(|| Ok(Map::new(&env)))
            .unwrap();
        let mut used: Map<U256, U256> = env
            .storage()
            .instance()
            .get(&USED_NULLIFIERS)
            .unwrap_or_else(|| Ok(Map::new(&env)))
            .unwrap();

        let one = U256::from_u32(&env, 1);
        for n in nullifiers.iter() {
            if used.get(n.clone()).is_some() {
                return Err(soroban_sdk::Error::from_contract_error(1)); // already spent
            }
            if null_reg.get(n.clone()).is_none() {
                return Err(soroban_sdk::Error::from_contract_error(2)); // unknown nullifier
            }
            used.set(n, one.clone());
        }
        env.storage().instance().set(&USED_NULLIFIERS, &used);
        let _ = recipient;
        Ok(())
    }
}
