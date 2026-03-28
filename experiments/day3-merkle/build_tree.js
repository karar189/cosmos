/**
 * build_tree.js
 * ─────────────
 * Builds a depth-3 Merkle tree with 8 leaves using Poseidon.
 * Computes the inclusion proof path for leaf at index 2.
 * Writes input.json for the circuit.
 *
 * Run with: node build_tree.js
 */

const { buildPoseidon } = require("circomlibjs");
const fs = require("fs");

async function main() {
    const poseidon = await buildPoseidon();
    const F = poseidon.F;

    // ── STEP 1: Define 8 leaves ────────────────────────────────
    // In production: leaf = Poseidon(secret, nullifier, amount)
    // Here: simple numbers so you can follow the math
    const rawLeaves = [
        BigInt("111"),   // L0
        BigInt("222"),   // L1
        BigInt("333"),   // L2 ← OUR COMMITMENT (index 2)
        BigInt("444"),   // L3
        BigInt("555"),   // L4
        BigInt("666"),   // L5
        BigInt("777"),   // L6
        BigInt("888"),   // L7
    ];
    const OUR_INDEX = 2;

    console.log("─────────────────────────────────────────");
    console.log("Building Merkle tree (depth=3, 8 leaves)");
    console.log("Our leaf: L" + OUR_INDEX + " = " + rawLeaves[OUR_INDEX]);
    console.log("");

    // ── STEP 2: Build the tree bottom-up ──────────────────────
    // Each level: hash pairs of nodes to get the next level up
    const levels = [rawLeaves];   // level 0 = the leaves

    let current = rawLeaves;
    while (current.length > 1) {
        const next = [];
        for (let i = 0; i < current.length; i += 2) {
            const h = poseidon([current[i], current[i + 1]]);
            next.push(F.toObject(h));
        }
        levels.push(next);
        current = next;
    }

    const root = levels[levels.length - 1][0];

    // Print the tree
    console.log("Tree structure:");
    for (let i = levels.length - 1; i >= 0; i--) {
        const label = i === levels.length - 1 ? "Root   " :
                      i === 0                 ? "Leaves " :
                      "Level " + i;
        const values = levels[i].map((v, j) => {
            const marker = (i === 0 && j === OUR_INDEX) ? " ← OURS" : "";
            return v.toString().slice(0, 8) + "..." + marker;
        });
        console.log("  " + label + ": [" + values.join(", ") + "]");
    }
    console.log("");
    console.log("Root: " + root.toString());
    console.log("");

    // ── STEP 3: Compute the inclusion proof path ───────────────
    // Walk from the leaf up to the root, collecting siblings
    const pathElements = [];
    const pathIndices  = [];

    let idx = OUR_INDEX;
    for (let i = 0; i < levels.length - 1; i++) {
        if (idx % 2 === 0) {
            // We are the LEFT child — sibling is to our right
            pathElements.push(levels[i][idx + 1].toString());
            pathIndices.push(0);
            console.log("Level " + i + ": we are LEFT  → sibling = levels[" + i + "][" + (idx+1) + "] = " + levels[i][idx+1].toString().slice(0,12) + "...");
        } else {
            // We are the RIGHT child — sibling is to our left
            pathElements.push(levels[i][idx - 1].toString());
            pathIndices.push(1);
            console.log("Level " + i + ": we are RIGHT → sibling = levels[" + i + "][" + (idx-1) + "] = " + levels[i][idx-1].toString().slice(0,12) + "...");
        }
        idx = Math.floor(idx / 2);
    }

    // ── STEP 4: Verify the path manually ──────────────────────
    console.log("\nVerifying path manually:");
    let computed = rawLeaves[OUR_INDEX];
    for (let i = 0; i < pathElements.length; i++) {
        const sibling = BigInt(pathElements[i]);
        let left, right;
        if (pathIndices[i] === 0) {
            left = computed; right = sibling;
        } else {
            left = sibling; right = computed;
        }
        const h = poseidon([left, right]);
        computed = F.toObject(h);
        console.log("  Level " + i + " → " + computed.toString().slice(0, 16) + "...");
    }
    const pathValid = computed.toString() === root.toString();
    console.log("  Computed root matches tree root: " + (pathValid ? "✅ YES" : "❌ NO"));

    // ── STEP 5: Write input.json ───────────────────────────────
    const input = {
        leaf:         rawLeaves[OUR_INDEX].toString(),
        pathElements: pathElements,
        pathIndices:  pathIndices,
        root:         root.toString(),
    };

    fs.writeFileSync("input.json", JSON.stringify(input, null, 2));
    console.log("\n✅ input.json written");
    console.log("─────────────────────────────────────────");
}

main().catch(console.error);
