extern crate std;

use super::*;
use soroban_sdk::{
    testutils::Address as _,
    token::{Client as TokenClient, StellarAssetClient},
    Address, Bytes, Env, U256,
};

// ─────────────────────────────────────────────
// TEST HELPERS
// ─────────────────────────────────────────────

struct Fixture {
    env: Env,
    contract_id: Address,
    admin: Address,
    fee_recipient: Address,
    token: Address,
    depositor: Address,
}

impl Fixture {
    fn new(fee_bps: u32) -> Self {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let fee_recipient = Address::generate(&env);
        let depositor = Address::generate(&env);

        // Register a Stellar Asset Contract as test token
        let token_admin = Address::generate(&env);
        let token_sac = env.register_stellar_asset_contract_v2(token_admin);
        let token = token_sac.address();

        // Fund the depositor
        StellarAssetClient::new(&env, &token).mint(&depositor, &100_000_000);

        // Deploy and initialize pool
        let contract_id = env.register(PoolManager, ());
        PoolManagerClient::new(&env, &contract_id).initialize(&admin, &fee_recipient, &fee_bps);

        // Approve depositor (for realism — ASP not configured yet, but pre-approve)
        PoolManagerClient::new(&env, &contract_id).approve_depositor(&depositor);

        Self { env, contract_id, admin, fee_recipient, token, depositor }
    }

    fn client(&self) -> PoolManagerClient<'_> {
        PoolManagerClient::new(&self.env, &self.contract_id)
    }

    fn token_client(&self) -> TokenClient<'_> {
        TokenClient::new(&self.env, &self.token)
    }

    /// Deterministic (secret, nullifier) pair from a seed — for tests only.
    fn note(&self, seed: u128) -> (U256, U256) {
        let secret = U256::from_u128(&self.env, seed);
        let nullifier = U256::from_u128(&self.env, seed.wrapping_add(0xcafe_babe));
        (secret, nullifier)
    }
}

// ─────────────────────────────────────────────
// INITIALIZATION TESTS
// ─────────────────────────────────────────────

#[test]
fn test_initialize() {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let fee_recipient = Address::generate(&env);
    let contract_id = env.register(PoolManager, ());
    let client = PoolManagerClient::new(&env, &contract_id);

    let state = client.initialize(&admin, &fee_recipient, &30);
    assert_eq!(state.fee_bps, 30);
    assert!(!state.paused);
    assert_eq!(state.size, 0);
    assert!(state.asp.is_none());
}

#[test]
fn test_initialize_rejects_fee_above_1000_bps() {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let fee_recipient = Address::generate(&env);
    let contract_id = env.register(PoolManager, ());
    let client = PoolManagerClient::new(&env, &contract_id);

    // try_ variant returns Result — use for error assertions
    let result = client.try_initialize(&admin, &fee_recipient, &1001);
    assert!(result.is_err());
}

#[test]
fn test_double_initialize_fails() {
    let f = Fixture::new(0);
    let result = f.client().try_initialize(&f.admin, &f.fee_recipient, &0);
    assert!(result.is_err());
}

// ─────────────────────────────────────────────
// COMMIT (DEPOSIT) TESTS
// ─────────────────────────────────────────────

#[test]
fn test_commit_transfers_tokens_into_contract() {
    let f = Fixture::new(0);
    let depositor_before = f.token_client().balance(&f.depositor);

    let (secret, nullifier) = f.note(0x1111);
    f.client().commit(&f.depositor, &secret, &nullifier, &1_000_000_i128, &f.token);

    let depositor_after = f.token_client().balance(&f.depositor);
    let contract_balance = f.token_client().balance(&f.contract_id);

    assert_eq!(depositor_before - depositor_after, 1_000_000);
    assert_eq!(contract_balance, 1_000_000);
}

#[test]
fn test_commit_returns_correct_index() {
    let f = Fixture::new(0);

    let (s1, n1) = f.note(0x1111);
    let r1 = f.client().commit(&f.depositor, &s1, &n1, &1_000_000_i128, &f.token);
    assert_eq!(r1.commitment_index, 0);

    let (s2, n2) = f.note(0x2222);
    let r2 = f.client().commit(&f.depositor, &s2, &n2, &1_000_000_i128, &f.token);
    assert_eq!(r2.commitment_index, 1);
}

#[test]
fn test_commit_rejects_zero_amount() {
    let f = Fixture::new(0);
    let (secret, nullifier) = f.note(0x3333);
    let result = f.client().try_commit(&f.depositor, &secret, &nullifier, &0_i128, &f.token);
    assert!(result.is_err());
}

#[test]
fn test_commit_rejects_duplicate_leaf() {
    let f = Fixture::new(0);
    let (secret, nullifier) = f.note(0x4444);

    f.client().commit(&f.depositor, &secret, &nullifier, &1_000_000_i128, &f.token);

    // Same secret + nullifier + amount = same leaf → must be rejected
    let result = f.client().try_commit(&f.depositor, &secret, &nullifier, &1_000_000_i128, &f.token);
    assert!(result.is_err());
}

#[test]
fn test_commit_rejects_blocked_depositor() {
    let f = Fixture::new(0);
    f.client().block_depositor(&f.depositor);

    let (secret, nullifier) = f.note(0x5555);
    let result = f.client().try_commit(&f.depositor, &secret, &nullifier, &1_000_000_i128, &f.token);
    assert!(result.is_err());
}

#[test]
fn test_commit_rejects_when_pool_paused() {
    let f = Fixture::new(0);
    f.client().pause();

    let (secret, nullifier) = f.note(0x6666);
    let result = f.client().try_commit(&f.depositor, &secret, &nullifier, &1_000_000_i128, &f.token);
    assert!(result.is_err());
}

#[test]
fn test_commit_rejects_when_pool_cap_exceeded() {
    let f = Fixture::new(0);

    // Mint enough to go over the cap in a single deposit
    StellarAssetClient::new(&f.env, &f.token)
        .mint(&f.depositor, &(MAX_POOL_BALANCE + 1));

    let (secret, nullifier) = f.note(0x7777);
    let result = f.client().try_commit(
        &f.depositor,
        &secret,
        &nullifier,
        &(MAX_POOL_BALANCE + 1),
        &f.token,
    );
    assert!(result.is_err());
}

// ─────────────────────────────────────────────
// WITHDRAW TESTS
// ─────────────────────────────────────────────

#[test]
fn test_withdraw_pays_recipient() {
    let f = Fixture::new(0);
    let recipient = Address::generate(&f.env);

    let (secret, nullifier) = f.note(0x8888);
    f.client().commit(&f.depositor, &secret, &nullifier, &1_000_000_i128, &f.token);

    let state = f.client().get_state();
    let proof = Bytes::from_array(&f.env, &[0x01u8; 32]);
    let nullifiers = soroban_sdk::vec![&f.env, nullifier];

    f.client().withdraw(&recipient, &nullifiers, &proof, &state.root);

    assert_eq!(f.token_client().balance(&recipient), 1_000_000);
    assert_eq!(f.token_client().balance(&f.contract_id), 0);
}

#[test]
fn test_fee_deducted_correctly() {
    let f = Fixture::new(30); // 0.30% fee
    let recipient = Address::generate(&f.env);

    let amount = 10_000_000_i128;
    let (secret, nullifier) = f.note(0x9999);
    f.client().commit(&f.depositor, &secret, &nullifier, &amount, &f.token);

    let state = f.client().get_state();
    let proof = Bytes::from_array(&f.env, &[0x01u8; 32]);
    let nullifiers = soroban_sdk::vec![&f.env, nullifier];

    f.client().withdraw(&recipient, &nullifiers, &proof, &state.root);

    let expected_fee = (amount * 30) / 10_000;
    let expected_net = amount - expected_fee;

    assert_eq!(f.token_client().balance(&recipient), expected_net);
    assert_eq!(f.token_client().balance(&f.fee_recipient), expected_fee);
}

#[test]
fn test_double_spend_fails() {
    let f = Fixture::new(0);
    let recipient = Address::generate(&f.env);

    let (secret, nullifier) = f.note(0xaaaa);
    f.client().commit(&f.depositor, &secret, &nullifier, &1_000_000_i128, &f.token);

    let state = f.client().get_state();
    let proof = Bytes::from_array(&f.env, &[0x01u8; 32]);
    let nullifiers = soroban_sdk::vec![&f.env, nullifier];

    f.client().withdraw(&recipient, &nullifiers, &proof, &state.root);

    // Second withdrawal with same nullifier must fail
    let result = f.client().try_withdraw(&recipient, &nullifiers, &proof, &state.root);
    assert!(result.is_err());
}

#[test]
fn test_unknown_nullifier_fails() {
    let f = Fixture::new(0);
    let recipient = Address::generate(&f.env);

    let fake_nullifier = U256::from_u128(&f.env, 0xdead_dead_dead_dead);
    let state = f.client().get_state();
    let proof = Bytes::from_array(&f.env, &[0x01u8; 32]);
    let nullifiers = soroban_sdk::vec![&f.env, fake_nullifier];

    let result = f.client().try_withdraw(&recipient, &nullifiers, &proof, &state.root);
    assert!(result.is_err());
}

#[test]
fn test_empty_proof_fails() {
    let f = Fixture::new(0);
    let recipient = Address::generate(&f.env);

    let (secret, nullifier) = f.note(0xbbbb);
    f.client().commit(&f.depositor, &secret, &nullifier, &1_000_000_i128, &f.token);

    let state = f.client().get_state();
    let empty_proof = Bytes::new(&f.env);
    let nullifiers = soroban_sdk::vec![&f.env, nullifier];

    let result = f.client().try_withdraw(&recipient, &nullifiers, &empty_proof, &state.root);
    assert!(result.is_err());
}

#[test]
fn test_withdraw_rejects_when_pool_paused() {
    let f = Fixture::new(0);
    let recipient = Address::generate(&f.env);

    let (secret, nullifier) = f.note(0xcccc);
    f.client().commit(&f.depositor, &secret, &nullifier, &1_000_000_i128, &f.token);

    f.client().pause();

    let state = f.client().get_state();
    let proof = Bytes::from_array(&f.env, &[0x01u8; 32]);
    let nullifiers = soroban_sdk::vec![&f.env, nullifier];

    let result = f.client().try_withdraw(&recipient, &nullifiers, &proof, &state.root);
    assert!(result.is_err());
}

#[test]
fn test_batch_withdrawal() {
    let f = Fixture::new(0);
    let recipient = Address::generate(&f.env);

    let (s1, n1) = f.note(0xdddd);
    let (s2, n2) = f.note(0xeeee);

    f.client().commit(&f.depositor, &s1, &n1, &1_000_000_i128, &f.token);
    f.client().commit(&f.depositor, &s2, &n2, &2_000_000_i128, &f.token);

    let state = f.client().get_state();
    let proof = Bytes::from_array(&f.env, &[0x01u8; 32]);
    let nullifiers = soroban_sdk::vec![&f.env, n1, n2];

    f.client().withdraw(&recipient, &nullifiers, &proof, &state.root);

    assert_eq!(f.token_client().balance(&recipient), 3_000_000);
    assert_eq!(f.token_client().balance(&f.contract_id), 0);
}

// ─────────────────────────────────────────────
// ADMIN TESTS
// ─────────────────────────────────────────────

#[test]
fn test_pause_and_unpause() {
    let f = Fixture::new(0);

    f.client().pause();
    assert!(f.client().get_state().paused);

    f.client().unpause();
    assert!(!f.client().get_state().paused);
}

#[test]
fn test_set_fee() {
    let f = Fixture::new(0);
    f.client().set_fee(&100);
    assert_eq!(f.client().get_state().fee_bps, 100);
}

#[test]
fn test_set_fee_rejects_above_1000_bps() {
    let f = Fixture::new(0);
    let result = f.client().try_set_fee(&1001);
    assert!(result.is_err());
}

#[test]
fn test_approve_and_revoke_depositor() {
    let f = Fixture::new(0);
    let new_depositor = Address::generate(&f.env);

    assert!(!f.client().is_approved(&new_depositor));
    f.client().approve_depositor(&new_depositor);
    assert!(f.client().is_approved(&new_depositor));
    f.client().revoke_depositor(&new_depositor);
    assert!(!f.client().is_approved(&new_depositor));
}

#[test]
fn test_block_depositor() {
    let f = Fixture::new(0);

    assert!(!f.client().is_blocked(&f.depositor));
    f.client().block_depositor(&f.depositor);
    assert!(f.client().is_blocked(&f.depositor));
}

// ─────────────────────────────────────────────
// QUERY TESTS
// ─────────────────────────────────────────────

#[test]
fn test_nullifier_state_transitions() {
    let f = Fixture::new(0);
    let recipient = Address::generate(&f.env);

    let (secret, nullifier) = f.note(0xffff);

    // Initially: not committed, not spent
    assert!(!f.client().is_nullifier_committed(&nullifier));
    assert!(!f.client().is_nullifier_spent(&nullifier));

    f.client().commit(&f.depositor, &secret, &nullifier, &1_000_000_i128, &f.token);

    // After commit: committed, not yet spent
    assert!(f.client().is_nullifier_committed(&nullifier));
    assert!(!f.client().is_nullifier_spent(&nullifier));

    let state = f.client().get_state();
    let proof = Bytes::from_array(&f.env, &[0x01u8; 32]);
    let nullifiers = soroban_sdk::vec![&f.env, nullifier.clone()];
    f.client().withdraw(&recipient, &nullifiers, &proof, &state.root);

    // After withdraw: committed and spent
    assert!(f.client().is_nullifier_spent(&nullifier));
}
