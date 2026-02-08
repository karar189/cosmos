/**
 * Standalone Stellar contract deploy server (optional).
 * Requires: Stellar CLI (stellar), Rust 1.84+ with wasm32v1-none.
 * Run: SOURCE_KEY=your_secret node scripts/soroban-deploy-server.mjs
 * See: https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup
 */
import express from 'express';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: '1mb' }));

app.post('/deploy', (req, res) => {
  const { rustCode } = req.body;
  if (!rustCode) {
    return res.status(400).json({ error: 'rustCode required' });
  }

  const dir = path.join(os.tmpdir(), `stellar-contract-${Date.now()}`);
  const srcDir = path.join(dir, 'src');
  fs.mkdirSync(srcDir, { recursive: true });

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

  const wasmPath = path.join(dir, 'target', 'wasm32v1-none', 'release', 'dynamic_contract.wasm');
  const sourceKey = process.env.SOURCE_KEY || process.env.SOROBAN_SECRET_KEY || '';
  const buildCmd = `cd ${dir} && stellar contract build`;
  const deployCmd = `stellar contract deploy --wasm ${wasmPath} --network testnet --source ${sourceKey}`;

  exec(`${buildCmd} && ${deployCmd}`, (err, stdout, stderr) => {
    if (dir && fs.existsSync(dir)) {
      try {
        fs.rmSync(dir, { recursive: true });
      } catch {}
    }
    if (err) {
      return res.json({ error: String(stderr || err.message) });
    }
    return res.json({ output: String(stdout || stderr) });
  });
});

const port = Number(process.env.DEPLOY_SERVER_PORT) || 9999;
app.listen(port, () => {
  console.log(`Soroban deploy server running on http://localhost:${port}`);
});
