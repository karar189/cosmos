pragma circom 2.0.0;

/*
    HYPERTRON COMMITMENT CIRCUIT
    =============================
    This is the exact commitment scheme from the Soroban contract.

    In the contract (lib.rs), commit() does:
        leaf = Poseidon(secret, nullifier, amount)

    This circuit proves:
        "I know secret, nullifier, and amount such that
         Poseidon(secret, nullifier, amount) = leaf"

    Without revealing secret or nullifier.

    Why does this matter?
    ─────────────────────
    When you want to WITHDRAW, you need to prove:
      1. You know the secret behind your commitment (this circuit)
      2. That commitment exists in the pool (Merkle proof — Day 3)

    If you don't know the secret, you can't produce a valid proof.
    If you produce a valid proof, you must know the secret.
    That's the guarantee.

    What's public vs private:
    ─────────────────────────
    signal input secret     → PRIVATE  (never revealed, the spending key)
    signal input nullifier  → PRIVATE  (revealed separately on withdrawal
                                        to prevent double-spend, but not here)
    signal input amount     → PRIVATE  (keeps payment amounts confidential)
    signal output leaf      → PUBLIC   (stored on-chain, anyone can see it)

    The on-chain contract stores the leaf.
    To withdraw, you prove you know what's behind it.
*/

// Import circomlib's Poseidon hash template
// circomlib is a standard library of ZK-friendly circuits
// Poseidon is a hash function designed specifically for ZK proofs
// (much cheaper to prove than SHA256 or keccak)
include "circomlib/circuits/poseidon.circom";

template HypertronCommitment() {
    // ── PRIVATE INPUTS ──────────────────────────────────────────
    // Only you know these. They never leave your device.
    signal input secret;     // random 256-bit number you generate
    signal input nullifier;  // random 256-bit number you generate
    signal input amount;     // how much you're depositing

    // ── PUBLIC OUTPUT ────────────────────────────────────────────
    // This is stored on-chain. Everyone can see it.
    // It reveals NOTHING about secret, nullifier, or amount.
    signal output leaf;

    // ── CONSTRAINTS ─────────────────────────────────────────────
    // Poseidon(3) = Poseidon hash with 3 inputs
    // This matches the Soroban contract: poseidon_hash::<4, BnScalar>
    //   (T=4 means state width 4, rate = T-1 = 3, handles 3 inputs)
    component hasher = Poseidon(3);

    hasher.inputs[0] <== secret;
    hasher.inputs[1] <== nullifier;
    hasher.inputs[2] <== amount;

    // Bind leaf to the hash output
    // This constraint means: proof is ONLY valid if leaf == Poseidon(secret, nullifier, amount)
    // You cannot claim a different leaf value — the math will break
    leaf <== hasher.out;
}

// The {} means: no signals are explicitly marked public
// leaf is public because it's a signal output
// secret, nullifier, amount are private because they're signal inputs
component main = HypertronCommitment();
