pragma circom 2.0.0;

/*
    HYPERTRON WITHDRAWAL CIRCUIT
    ==============================
    Day 4: Combines Day 2 (Poseidon commitment) + Day 3 (Merkle inclusion)
    into one complete proof.

    What this proves in a single ZK proof:
      1. I know the secret and nullifier behind a specific commitment leaf
         leaf = Poseidon(secret, nullifier, amount)

      2. That leaf exists in the on-chain Merkle tree at the claimed root

      3. The nullifier I'm revealing publicly is the same one used in the leaf
         (so the contract can mark it spent and prevent double-withdrawal)

      4. The proof is bound to a specific recipient address
         (prevents front-running: someone can't steal your proof and redirect funds)

    What's PUBLIC vs PRIVATE:
    ─────────────────────────────────────────────────────────────
    PRIVATE                         PUBLIC
    ───────                         ──────
    secret          (spending key)  root           (on-chain Merkle root)
    nullifier       (blinding)      publicNullifier (revealed → marks leaf spent)
    amount          (hidden)        recipient       (where funds go)
    pathElements[]  (hidden)
    pathIndices[]   (hides position)
    ─────────────────────────────────────────────────────────────

    The verifier (smart contract) learns:
    - Which root you're proving against (must match current on-chain root)
    - Your nullifier (marks it spent so you can't withdraw twice)
    - Where to send the funds
    - Nothing else. Not your leaf, not your secret, not your position in the tree.
*/

include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/mux1.circom";

template HypertronWithdraw(depth) {

    // ── PRIVATE INPUTS ─────────────────────────────────────────────────────
    signal input secret;               // random 256-bit number — your spending key
    signal input nullifier;            // random 256-bit number — used in commitment
    signal input amount;               // hidden payment amount

    signal input pathElements[depth];  // sibling hashes along the Merkle path
    signal input pathIndices[depth];   // 0=left child, 1=right child at each level

    // ── PUBLIC INPUTS ──────────────────────────────────────────────────────
    signal input root;                 // on-chain Merkle root to prove against
    signal input publicNullifier;      // must equal nullifier — contract marks this spent
    signal input recipient;            // destination address (as field element)


    // ═══════════════════════════════════════════════════════════════════════
    // STEP 1: Compute leaf = Poseidon(secret, nullifier, amount)
    //
    // This is identical to what the contract stores when you deposit.
    // If you don't know the correct (secret, nullifier, amount), you cannot
    // produce a witness that satisfies this constraint.
    // ═══════════════════════════════════════════════════════════════════════

    component leafHasher = Poseidon(3);
    leafHasher.inputs[0] <== secret;
    leafHasher.inputs[1] <== nullifier;
    leafHasher.inputs[2] <== amount;

    signal leaf <== leafHasher.out;


    // ═══════════════════════════════════════════════════════════════════════
    // STEP 2: Merkle inclusion proof
    //
    // Walk from leaf to root, re-computing each parent hash.
    // At each level, use Mux1 to place us on the correct side (left or right)
    // based on pathIndices[i].
    //
    // If any pathElement is wrong, the final computed root won't match `root`.
    // ═══════════════════════════════════════════════════════════════════════

    signal levelHashes[depth + 1];
    levelHashes[0] <== leaf;   // start at the leaf, walk up to the root

    component hashers[depth];
    component leftSelectors[depth];
    component rightSelectors[depth];

    for (var i = 0; i < depth; i++) {

        // pathIndices must be binary — 0 or 1, nothing else
        // Without this, an attacker could use fractional values to cheat
        pathIndices[i] * (1 - pathIndices[i]) === 0;

        // Mux1: select which side WE are on
        //   s=0 (we're LEFT)  → left=our hash,      right=sibling
        //   s=1 (we're RIGHT) → left=sibling,        right=our hash
        leftSelectors[i] = Mux1();
        leftSelectors[i].c[0] <== levelHashes[i];   // s=0: left = us
        leftSelectors[i].c[1] <== pathElements[i];  // s=1: left = sibling
        leftSelectors[i].s    <== pathIndices[i];

        rightSelectors[i] = Mux1();
        rightSelectors[i].c[0] <== pathElements[i]; // s=0: right = sibling
        rightSelectors[i].c[1] <== levelHashes[i];  // s=1: right = us
        rightSelectors[i].s    <== pathIndices[i];

        // Hash the pair to get the parent
        hashers[i] = Poseidon(2);
        hashers[i].inputs[0] <== leftSelectors[i].out;
        hashers[i].inputs[1] <== rightSelectors[i].out;

        levelHashes[i + 1] <== hashers[i].out;
    }

    // Final: computed root must equal the claimed on-chain root
    // If this fails → leaf is NOT in the tree
    root === levelHashes[depth];


    // ═══════════════════════════════════════════════════════════════════════
    // STEP 3: Bind the public nullifier to the private nullifier
    //
    // Why: The contract calls `mark_nullifier_spent(publicNullifier)` after
    // a successful withdrawal. Without this constraint, a user could provide
    // ANY nullifier as the public one — re-using the same leaf forever.
    //
    // With this constraint: publicNullifier MUST equal the nullifier used to
    // build the leaf. So after withdrawal the exact right nullifier is spent.
    // ═══════════════════════════════════════════════════════════════════════

    publicNullifier === nullifier;


    // ═══════════════════════════════════════════════════════════════════════
    // STEP 4: Bind the proof to a specific recipient
    //
    // Why: Without this, Mallory could intercept Alice's valid proof
    // (from the mempool) and re-submit it with Mallory's own address.
    // The proof would still be valid! This is a front-running attack.
    //
    // By including recipient as a public input, changing the recipient
    // changes the public inputs → the proof is no longer valid.
    //
    // The square is a safety constraint — it forces the signal to be used
    // in an arithmetic constraint (not just as a free signal that the prover
    // could set to anything without consequence).
    // ═══════════════════════════════════════════════════════════════════════

    signal recipientSquare <== recipient * recipient;
}

// depth=3 → supports 8 leaves (learning)
// For production Hypertron: change to depth=20 → 1,048,576 leaves
component main {public [root, publicNullifier, recipient]} = HypertronWithdraw(3);
