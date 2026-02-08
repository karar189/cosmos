import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { promisify } from 'util';

const execAsync = promisify(exec);

const CLI_NOT_FOUND_MESSAGE =
  'Stellar CLI is not installed or not on PATH. Follow the official setup: https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup — install Rust 1.84+, add target wasm32v1-none (rustup target add wasm32v1-none), then install Stellar CLI (e.g. brew install stellar-cli or curl -fsSL https://github.com/stellar/stellar-cli/raw/main/install.sh | sh). Ensure the process running Next.js can see the stellar command.';

/**
 * Deploy AI-generated Stellar (Soroban) contract: write to temp dir, build, deploy via Stellar CLI.
 * Requires: Stellar CLI (stellar), Rust 1.84+ with wasm32v1-none target, SOURCE_KEY (or SOROBAN_SECRET_KEY) in env for testnet.
 * @see https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup
 */
export async function POST(request: NextRequest) {
  let dir: string | null = null;

  try {
    const body = await request.json();
    const { rustCode } = body as { rustCode?: string };

    if (!rustCode || typeof rustCode !== 'string') {
      return NextResponse.json(
        { error: 'rustCode is required in request body' },
        { status: 400 }
      );
    }

    const sourceKey = process.env.SOURCE_KEY || process.env.SOROBAN_SECRET_KEY;
    if (!sourceKey) {
      return NextResponse.json(
        {
          error:
            'SOURCE_KEY or SOROBAN_SECRET_KEY not set. Set it in .env to deploy to testnet.',
        },
        { status: 400 }
      );
    }

    // Fail fast if Stellar CLI is not available (official CLI is "stellar", not "soroban")
    try {
      await execAsync('stellar --version');
    } catch {
      return NextResponse.json(
        { error: CLI_NOT_FOUND_MESSAGE },
        { status: 503 }
      );
    }

    dir = path.join(os.tmpdir(), `stellar-contract-${Date.now()}`);
    const srcDir = path.join(dir, 'src');
    fs.mkdirSync(srcDir, { recursive: true });

    // Cargo.toml matching Stellar contract layout: [lib] crate-type = ["cdylib"], [profile.release] required by Stellar CLI
    const cargoToml = `[package]
name = "dynamic_contract"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[profile.release]
overflow-checks = true

[dependencies]
soroban-sdk = "22"
`;

    fs.writeFileSync(path.join(dir, 'Cargo.toml'), cargoToml);
    fs.writeFileSync(path.join(dir, 'src', 'lib.rs'), rustCode);

    // Stellar CLI builds to target/wasm32v1-none/release/ (Rust 1.84+ target)
    const wasmPath = path.join(
      dir,
      'target',
      'wasm32v1-none',
      'release',
      'dynamic_contract.wasm'
    );

    // Cargo build can produce a lot of output; allow large buffer and long run (first build compiles many crates)
    const execOpts = { maxBuffer: 10 * 1024 * 1024, timeout: 5 * 60 * 1000 };

    const buildCmd = `cd ${dir} && stellar contract build`;
    await execAsync(buildCmd, execOpts);

    const deployCmd = `stellar contract deploy --wasm ${wasmPath} --network testnet --source ${sourceKey}`;
    const { stdout, stderr } = await execAsync(deployCmd, execOpts);
    const output = (stdout || '').trim() || (stderr || '').trim();

    // Contract ID is typically the last line or a line starting with C (Stellar contract ID)
    const contractId =
      output.split(/\r?\n/).find((line) => /^C[A-Z0-9]{55}$/.test(line.trim()))?.trim() ||
      output.split(/\r?\n/).pop()?.trim() ||
      null;

    // Stellar Explorer testnet: testnet.steexp.com/contract/<id>
    const explorerUrl =
      contractId != null
        ? `https://testnet.steexp.com/contract/${contractId}`
        : null;

    return NextResponse.json({
      contractId,
      output,
      explorerUrl,
      message: contractId
        ? `Contract deployed to Stellar testnet. Contract ID: ${contractId}`
        : 'Contract deployed. See output for details.',
    });
  } catch (e: unknown) {
    const err = e as { stderr?: string; stdout?: string; message?: string };
    const stderr = err?.stderr ?? '';
    const stdout = err?.stdout ?? '';
    const message = err?.message ?? 'Deploy failed';
    const details = [stderr, stdout].filter(Boolean).join('\n') || message;
    const isCliNotFound =
      /stellar.*command not found|command not found.*stellar/i.test(details) ||
      /soroban.*command not found|command not found.*soroban/i.test(details) ||
      /stellar.*not found|not found.*stellar/i.test(details);

    if (isCliNotFound) {
      return NextResponse.json(
        { error: CLI_NOT_FOUND_MESSAGE },
        { status: 503 }
      );
    }

    // Return the tail of the output so the actual Rust/build error is visible (errors are usually at the end)
    const detailsToShow = details.length > 12000 ? details.slice(-12000) : details;

    return NextResponse.json(
      {
        error: 'Deploy failed',
        details: detailsToShow,
      },
      { status: 500 }
    );
  } finally {
    if (dir && fs.existsSync(dir)) {
      try {
        fs.rmSync(dir, { recursive: true });
      } catch {
        // ignore cleanup errors
      }
    }
  }
}
