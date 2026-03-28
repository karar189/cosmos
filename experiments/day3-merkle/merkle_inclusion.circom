pragma circom 2.0.0;

/*
    MERKLE INCLUSION PROOF CIRCUIT
    ================================
    Proves: "leaf X exists in the Merkle tree with root R"
    Without revealing: which position X is at in the tree

    What is a Merkle tree?
    ──────────────────────
    A binary tree where every parent node = Poseidon(left_child, right_child)
    The root is a single hash that commits to ALL leaves.

    depth=3 example (8 leaves):

    Root          =  Poseidon(Q0, Q1)
                       /              \
    Level 2:     Q0                    Q1
               /    \               /    \
    Level 1:  P0     P1           P2     P3
             / \    / \          / \    / \
    Level 0: L0 L1 L2 L3       L4 L5  L6 L7
                   ^
                   Our leaf (index 2)

    To prove L2 is in this tree, you provide:
      pathElements = [L3, P0, Q1]   ← siblings along the path
      pathIndices  = [0,  1,  0]    ← 0=we're left child, 1=we're right child

    The circuit re-computes the root from L2 + the path,
    then checks: computed_root == claimed_root
*/

include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/mux1.circom";

// depth = number of levels (depth=3 → 8 leaves, depth=20 → 1M leaves)
template MerkleInclusion(depth) {

    // ── PRIVATE INPUTS ─────────────────────────────────────────
    signal input leaf;                   // the commitment leaf

    // Siblings along the path from leaf to root
    signal input pathElements[depth];    // sibling hashes at each level

    // 0 = we are the LEFT child  (sibling is on the right)
    // 1 = we are the RIGHT child (sibling is on the left)
    signal input pathIndices[depth];     // kept private → hides leaf position

    // ── PUBLIC INPUTS ──────────────────────────────────────────
    // The Merkle root stored on-chain
    signal input root;

    // ── INTERNAL SIGNALS ───────────────────────────────────────
    // Tracks the running hash as we walk up the tree
    signal levelHashes[depth + 1];
    levelHashes[0] <== leaf;    // start at the leaf

    // One hasher and two selectors per level
    component hashers[depth];
    component leftSelectors[depth];
    component rightSelectors[depth];

    // ── CONSTRAINTS ────────────────────────────────────────────
    for (var i = 0; i < depth; i++) {

        // pathIndices must be binary (0 or 1) — no other values allowed
        pathIndices[i] * (1 - pathIndices[i]) === 0;

        // Decide which side WE are on at this level
        //
        // leftSelectors[i]:
        //   s=0 (we're left)  → left input = our hash
        //   s=1 (we're right) → left input = sibling
        leftSelectors[i] = Mux1();
        leftSelectors[i].c[0] <== levelHashes[i];   // when s=0, left = us
        leftSelectors[i].c[1] <== pathElements[i];  // when s=1, left = sibling
        leftSelectors[i].s    <== pathIndices[i];

        // rightSelectors[i]:
        //   s=0 (we're left)  → right input = sibling
        //   s=1 (we're right) → right input = our hash
        rightSelectors[i] = Mux1();
        rightSelectors[i].c[0] <== pathElements[i];  // when s=0, right = sibling
        rightSelectors[i].c[1] <== levelHashes[i];   // when s=1, right = us
        rightSelectors[i].s    <== pathIndices[i];

        // Hash (left, right) to get the parent node
        hashers[i] = Poseidon(2);
        hashers[i].inputs[0] <== leftSelectors[i].out;
        hashers[i].inputs[1] <== rightSelectors[i].out;

        // Advance up the tree
        levelHashes[i + 1] <== hashers[i].out;
    }

    // Final check: the root we computed must equal the on-chain root
    // If this fails, the leaf is NOT in the tree (or the path is wrong)
    root === levelHashes[depth];
}

// depth = 3 → supports 2^3 = 8 leaves
// For production Hypertron: depth = 20 → 2^20 = 1,048,576 leaves
component main {public [root]} = MerkleInclusion(3);
