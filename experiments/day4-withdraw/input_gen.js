/**
 * input_gen.js
 * ─────────────
 * Simulates a deposit + withdrawal flow:
 *
 *   1. User generates (secret, nullifier, amount) at deposit time
 *   2. Contract computes leaf = Poseidon(secret, nullifier, amount) and inserts it
 *   3. At withdrawal time, user provides:
 *        - Their private credentials (secret, nullifier, amount)
 *        - A Merkle proof that their leaf is in the tree
 *        - Their recipient address
 *   4. This script produces input.json ready for the ZK circuit
 *
 * Run with: node input_gen.js
 */

const { buildPoseidon } = require("circomlibjs");
const fs = require("fs");

async function main() {
    const poseidon = await buildPoseidon();
    const F = poseidon.F;

    // ── STEP 1: Deposit credentials ────────────────────────────────────────
    // In production: generated randomly and stored encrypted by the user's wallet
    // Here: fixed values so you can follow the math
    const secret    = BigInt("1234567890123456789");
    const nullifier = BigInt("9876543210987654321");
    const amount    = BigInt("1000000000");          // 1000 XLM (in stroops)
    const recipient = BigInt("42");                  // in production: hash of Stellar address

    console.log("─────────────────────────────────────────────────────");
    console.log("HYPERTRON WITHDRAWAL — input generator");
    console.log("─────────────────────────────────────────────────────");
    console.log("");
    console.log("Deposit credentials (private — never leave device):");
    console.log("  secret    =", secret.toString());
    console.log("  nullifier =", nullifier.toString());
    console.log("  amount    =", amount.toString(), "(stroops)");
    console.log("  recipient =", recipient.toString(), "(public — where funds go)");
    console.log("");

    // ── STEP 2: Compute commitment leaf ────────────────────────────────────
    // leaf = Poseidon(secret, nullifier, amount)
    // This is what the Soroban contract stores when you call commit()
    const leafRaw = poseidon([secret, nullifier, amount]);
    const leaf = F.toObject(leafRaw);
    console.log("Commitment leaf = Poseidon(secret, nullifier, amount):");
    console.log("  leaf =", leaf.toString());
    console.log("  (this is stored on-chain — reveals nothing about credentials)");
    console.log("");

    // ── STEP 3: Build Merkle tree ───────────────────────────────────────────
    // Tree has 8 leaves (depth=3). Our commitment is at index 2.
    // Other leaves are dummy values (in production: other users' commitments).
    const OUR_INDEX = 2;
    const rawLeaves = [
        BigInt("111"),   // L0 — someone else's commitment
        BigInt("222"),   // L1 — someone else's commitment
        leaf,            // L2 — OUR commitment ← we're withdrawing this one
        BigInt("444"),   // L3 — someone else's commitment
        BigInt("555"),   // L4 — someone else's commitment
        BigInt("666"),   // L5 — someone else's commitment
        BigInt("777"),   // L6 — someone else's commitment
        BigInt("888"),   // L7 — someone else's commitment
    ];

    console.log("Building Merkle tree (depth=3, 8 leaves)...");
    console.log("  Our leaf is at index", OUR_INDEX);
    console.log("");

    const levels = [rawLeaves];
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
    console.log("Tree levels (top → bottom):");
    for (let i = levels.length - 1; i >= 0; i--) {
        const label = i === levels.length - 1 ? "Root   " :
                      i === 0                 ? "Leaves " :
                      "Level " + i + " ";
        const nodes = levels[i].map((v, j) => {
            const mark = (i === 0 && j === OUR_INDEX) ? " ←OURS" : "";
            return v.toString().slice(0, 10) + "..." + mark;
        });
        console.log("  " + label + ": [" + nodes.join(", ") + "]");
    }
    console.log("");
    console.log("Root:", root.toString());
    console.log("");

    // ── STEP 4: Compute Merkle path (siblings from leaf to root) ────────────
    const pathElements = [];
    const pathIndices  = [];

    let idx = OUR_INDEX;
    for (let i = 0; i < levels.length - 1; i++) {
        if (idx % 2 === 0) {
            // We are LEFT child — sibling is to our right
            pathElements.push(levels[i][idx + 1].toString());
            pathIndices.push(0);
            console.log("Level " + i + ": we are LEFT  → sibling = " +
                levels[i][idx + 1].toString().slice(0, 12) + "...");
        } else {
            // We are RIGHT child — sibling is to our left
            pathElements.push(levels[i][idx - 1].toString());
            pathIndices.push(1);
            console.log("Level " + i + ": we are RIGHT → sibling = " +
                levels[i][idx - 1].toString().slice(0, 12) + "...");
        }
        idx = Math.floor(idx / 2);
    }
    console.log("");

    // ── STEP 5: Verify the path manually ────────────────────────────────────
    console.log("Verifying path manually (should match root):");
    let computed = leaf;
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
    const matches = computed.toString() === root.toString();
    console.log("  Recomputed root matches tree root:", matches ? "✅ YES" : "❌ NO");
    console.log("");

    // ── STEP 6: Write input.json ─────────────────────────────────────────────
    const input = {
        // Private inputs (known only to the withdrawer)
        secret:          secret.toString(),
        nullifier:       nullifier.toString(),
        amount:          amount.toString(),
        pathElements:    pathElements,
        pathIndices:     pathIndices,

        // Public inputs (visible to the verifier / smart contract)
        root:            root.toString(),
        publicNullifier: nullifier.toString(),   // same as nullifier — contract marks it spent
        recipient:       recipient.toString(),
    };

    fs.writeFileSync("input.json", JSON.stringify(input, null, 2));
    console.log("✅ input.json written");
    console.log("");
    console.log("Public inputs the verifier will see:");
    console.log("  root            =", root.toString().slice(0, 20) + "...");
    console.log("  publicNullifier =", nullifier.toString());
    console.log("  recipient       =", recipient.toString());
    console.log("");
    console.log("Private inputs stay on your device. The ZK proof reveals NONE of them.");
    console.log("─────────────────────────────────────────────────────");
}

main().catch(console.error);
