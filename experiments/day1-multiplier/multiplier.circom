pragma circom 2.0.0;

/*
    MULTIPLIER CIRCUIT
    ==================
    This is the "Hello World" of ZK circuits.

    What we're proving:
      "I know two secret numbers (a, b) that multiply to give c"

    Without revealing a and b.

    In Circom, everything is a "constraint" — a math equation
    that the prover must satisfy. If you can't satisfy all
    constraints, you can't produce a valid proof.
*/

template Multiplier() {
    // --- SIGNALS ---
    // Think of signals as variables.
    // "private input" = only you know this (the prover)
    // "output"        = visible to everyone (public)

    signal input a;   // private — you know this
    signal input b;   // private — you know this
    signal output c;  // public  — everyone sees this

    // --- CONSTRAINTS ---
    // This single line does two things:
    //   1. Computes: c = a * b
    //   2. Creates a constraint: the proof is only valid if c == a * b
    //
    // You CANNOT cheat. If you submit a proof claiming c=33
    // but you don't actually know factors, the math breaks.
    c <== a * b;
}

// Tell circom: use the Multiplier template as the main circuit
component main = Multiplier();
