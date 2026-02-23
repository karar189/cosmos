//! EscrowEngine contract — milestone-based escrow, ready for commit–prove–withdraw flow.
//! Soroban v25 compatible.

#![cfg_attr(target_family = "wasm", no_std)]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, Symbol, Vec,
};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MilestoneStatus {
    Pending,
    Approved,
    Rejected,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct Milestone {
    pub amount: i128,
    pub status: MilestoneStatus,
    pub description: Symbol,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct Escrow {
    pub client: Address,
    pub provider: Address,
    pub token: Address,
    pub total: i128,
    pub milestones: Vec<Milestone>,
    pub created_at: u64,
}

const ESCROW_KEY: Symbol = symbol_short!("ESCROW");

#[contract]
pub struct EscrowEngine;

#[contractimpl]
impl EscrowEngine {
    /// Create a new escrow with milestones.
    pub fn create(
        env: Env,
        client: Address,
        provider: Address,
        token: Address,
        total: i128,
        milestone_amounts: Vec<i128>,
    ) -> Result<Escrow, soroban_sdk::Error> {
        client.require_auth();
        let mut milestones: Vec<Milestone> = Vec::new(&env);
        for amount in milestone_amounts.iter() {
            milestones.push_back(Milestone {
                amount,
                status: MilestoneStatus::Pending,
                description: symbol_short!("M"),
            });
        }
        let escrow = Escrow {
            client: client.clone(),
            provider: provider.clone(),
            token: token.clone(),
            total,
            milestones,
            created_at: env.ledger().timestamp(),
        };
        env.storage().instance().set(&ESCROW_KEY, &escrow);
        Ok(escrow)
    }

    /// Approve a milestone (client releases funds for that milestone).
    pub fn approve_milestone(env: Env, _escrow_id: Address, milestone_index: u32) -> Result<(), soroban_sdk::Error> {
        let escrow: Escrow = env.storage().instance().get(&ESCROW_KEY).expect("not initialized");
        // In production: escrow_id.require_auth(); then update milestone at index and transfer token.
        let _ = milestone_index;
        env.storage().instance().set(&ESCROW_KEY, &escrow);
        Ok(())
    }

    /// Get escrow details (stub: single escrow per contract instance for simplicity).
    pub fn get_escrow(env: Env) -> Escrow {
        env.storage().instance().get(&ESCROW_KEY).expect("not initialized")
    }
}
