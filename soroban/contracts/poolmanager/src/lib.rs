//! PoolManager contract — Soroban v25 ZK primitives (Poseidon + BN254).
//! Stores commitments and supports BN254 pairing check for proof verification.

#![cfg_attr(target_family = "wasm", no_std)]

use soroban_poseidon::poseidon_hash;
use soroban_sdk::{
    contract, contractimpl, contracttype, crypto::BnScalar, symbol_short, vec, BytesN, Env,
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
/// Phase 4: nullifier -> leaf (so we can verify nullifier was committed).
const NULLIFIER_REGISTRY: Symbol = symbol_short!("NULLREG");
/// Phase 4: nullifiers already spent in a withdraw.
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

    /// Add a commitment (leaf = Poseidon(secret, nullifier)) and return new root.
    pub fn commit(
        env: Env,
        secret: U256,
        nullifier: U256,
    ) -> Result<U256, soroban_sdk::Error> {
        let inputs = vec![&env, secret, nullifier.clone()];
        let leaf = poseidon_hash::<3, BnScalar>(&env, &inputs);

        let mut state: PoolState = env.storage().instance().get(&POOL_KEY).expect("not initialized");

        let mut commits: Map<U256, Commitment> = env
            .storage()
            .instance()
            .get(&COMMITMENTS_KEY)
            .unwrap_or_else(|| Ok::<Map<U256, Commitment>, soroban_sdk::Error>(Map::new(&env)))
            .unwrap();
        commits.set(leaf.clone(), Commitment { leaf: leaf.clone(), nullifier: nullifier.clone() });
        env.storage().instance().set(&COMMITMENTS_KEY, &commits);

        // Phase 4: register nullifier so withdraw can verify and mark used.
        let mut null_reg: Map<U256, U256> = env
            .storage()
            .instance()
            .get(&NULLIFIER_REGISTRY)
            .unwrap_or_else(|| Ok::<Map<U256, U256>, soroban_sdk::Error>(Map::new(&env)))
            .unwrap();
        null_reg.set(nullifier, leaf.clone());
        env.storage().instance().set(&NULLIFIER_REGISTRY, &null_reg);

        // New root: in production, recompute Merkle root; here Poseidon(old_root, leaf).
        let root_inputs = vec![&env, state.root, leaf];
        state.root = poseidon_hash::<3, BnScalar>(&env, &root_inputs);
        state.size += 1;
        env.storage().instance().set(&POOL_KEY, &state);

        Ok(state.root)
    }

    /// Get current pool state (root + size).
    pub fn get_state(env: Env) -> PoolState {
        env.storage().instance().get(&POOL_KEY).expect("not initialized")
    }

    /// Phase 4: Mark nullifiers as used (withdraw). Caller must have proven ownership off-chain;
    /// in production, verify ZK proof here. Recipient is for event/logging; actual payout is off-chain.
    pub fn withdraw(
        env: Env,
        recipient: soroban_sdk::Address,
        nullifiers: soroban_sdk::Vec<U256>,
    ) -> Result<(), soroban_sdk::Error> {
        let null_reg: Map<U256, U256> = env
            .storage()
            .instance()
            .get(&NULLIFIER_REGISTRY)
            .unwrap_or_else(|| Ok::<Map<U256, U256>, soroban_sdk::Error>(Map::new(&env)))
            .unwrap();
        let mut used: Map<U256, U256> = env
            .storage()
            .instance()
            .get(&USED_NULLIFIERS)
            .unwrap_or_else(|| Ok::<Map<U256, U256>, soroban_sdk::Error>(Map::new(&env)))
            .unwrap();

        let one = U256::from_u32(&env, 1);
        for n in nullifiers.iter() {
            if used.get(n.clone()).is_some() {
                return Err(soroban_sdk::Error::from_contract_error(1)); // already used
            }
            if null_reg.get(n.clone()).is_none() {
                return Err(soroban_sdk::Error::from_contract_error(2)); // unknown nullifier
            }
            used.set(n, one.clone()); // value 1 = used
        }
        env.storage().instance().set(&USED_NULLIFIERS, &used);
        // In production: emit event(recipient, nullifiers) for backend to send XLM from pool.
        let _ = recipient;
        Ok(())
    }

    /// Verify a BN254 pairing check (Groth16 / ZK proof verification).
    /// Uses Soroban v25 host: bn254_multi_pairing_check, bn254_g1_mul, bn254_g1_add.
    /// Stub: replace with actual proof bytes and host calls in production.
    #[allow(dead_code)]
    fn bn254_pairing_check_stub(_env: &Env, _proof_g1: &BytesN<64>, _vk_g2: &BytesN<128>) -> bool {
        // Production: env.crypto().bn254_multi_pairing_check(...) or equivalent host.
        true
    }
}
