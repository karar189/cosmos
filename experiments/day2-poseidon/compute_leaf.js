/**
 * compute_leaf.js
 * ───────────────
 * Computes what the Poseidon hash of our inputs should be.
 *
 * This is what the Soroban contract computes during commit().
 * The circuit must produce the exact same value — or the proof fails.
 *
 * Run with: node compute_leaf.js
 */

const { buildPoseidon } = require("circomlibjs");

async function main() {
    const poseidon = await buildPoseidon();

    // These must match input.json exactly
    const secret    = BigInt("1234567890123456789");
    const nullifier = BigInt("9876543210987654321");
    const amount    = BigInt("1000000");

    // Poseidon([secret, nullifier, amount])
    const hash = poseidon([secret, nullifier, amount]);
    const leaf = poseidon.F.toString(hash);

    console.log("─────────────────────────────────────────");
    console.log("Inputs:");
    console.log("  secret    =", secret.toString());
    console.log("  nullifier =", nullifier.toString());
    console.log("  amount    =", amount.toString());
    console.log("");
    console.log("Expected leaf (Poseidon hash):");
    console.log(" ", leaf);
    console.log("");
    console.log("This is what will appear in public.json after");
    console.log("the witness is generated. If they match, your");
    console.log("circuit is computing the right thing.");
    console.log("─────────────────────────────────────────");
}

main().catch(console.error);
