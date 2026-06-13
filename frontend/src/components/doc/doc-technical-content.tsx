"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  DocBullets,
  DocNote,
  DocP,
  DocTable,
  FlowChart,
  ModuleGrid,
  Mono,
  SequenceDiagram,
  StatusList,
} from "./doc-diagrams";
import { HypertronArchitectureDiagram } from "./doc-architecture-diagram";
import { githubBlob, githubTree } from "@/lib/doc/doc-github";
import { technicalHref } from "@/lib/doc/doc-technical-pages";

const githubLinkClass =
  "text-blue-400/90 underline decoration-blue-400/30 underline-offset-2 transition-colors hover:text-blue-300 hover:decoration-blue-300/50";

function GhTree({ path, children }: { path: string; children: ReactNode }) {
  return (
    <a href={githubTree(path)} target="_blank" rel="noopener noreferrer" className={githubLinkClass}>
      {children}
    </a>
  );
}

function GhFile({ path, children }: { path: string; children: ReactNode }) {
  return (
    <a href={githubBlob(path)} target="_blank" rel="noopener noreferrer" className={githubLinkClass}>
      {children}
    </a>
  );
}

function ModuleHeading({ id, title, githubPath }: { id: string; title: string; githubPath: string }) {
  return (
    <div className="flex scroll-mt-20 flex-wrap items-center gap-x-3 gap-y-1 pt-3">
      <h3 id={id} className="text-base font-semibold text-white">
        {title}
      </h3>
      <GhTree path={githubPath}>
        <span className="text-xs font-medium">View on GitHub ↗</span>
      </GhTree>
    </div>
  );
}

const POOLMANAGER_ID = "CAN2RE5SDLJ67G5RSGUDB4BYNUZ3QMPGJOLPUWRVOTMLAWVA3U04PBV2";
const POOL_ACCOUNT = "GATXUXOFATDQXLKJCIU7G22V5NNUE7J5OP3KJKMJNBAPRM5VYQ3K7DKN";
const ESCROW_LEGACY = "CDBYDNW3MLBFYALZ2WBJ5KWJLCPFW556XKHLV7BVT5YNBU7WPN2JDXDS";

function OverviewContent() {
  return (
    <div className="space-y-4">
      <DocP>
        Hypertron is a B2B operations layer for private, workflow native payments on Stellar.
        It combines a payments and onboarding dashboard, a privacy settlement pool, a
        cross chain USDC bridge, and an agent workflow layer for compliance and regulatory
        intelligence. The platform is split into three independently deployable tiers plus
        the Stellar network.
      </DocP>
      <ModuleGrid
        modules={[
          {
            title: "Web app + BFF",
            tag: "Next.js",
            tone: "blue",
            githubPath: "frontend",
            points: [
              "Next.js 14 App Router (Vercel)",
              "Marketing site, dashboard, public checkout",
              "44 Route Handlers act as the backend for frontend",
            ],
          },
          {
            title: "Agent workflow",
            tag: "FastAPI",
            tone: "violet",
            githubPath: "ai-analyzer",
            points: [
              "Python FastAPI service on Render",
              "RegIntel RAG, Compliance Agent, scrapers",
              "Regulation News Sniper + widget recommender",
            ],
          },
          {
            title: "Soroban contracts",
            tag: "Rust",
            tone: "emerald",
            githubPath: "contracts/poolmanager",
            points: [
              "PoolManager privacy pool (Poseidon + BN254)",
              "Commitment / nullifier registry",
              "Deployed to Stellar testnet",
            ],
          },
          {
            title: "Stellar network",
            tag: "L1",
            tone: "amber",
            points: [
              "Classic payments via Horizon",
              "Soroban smart contracts (Protocol 25 / X Ray)",
              "Circle CCTP native USDC",
            ],
          },
        ]}
      />
      <DocNote variant="warn">
        Most flows currently target <strong>Stellar testnet</strong>. The privacy pool ships
        with a stubbed ZK verifier and is <strong>not audited</strong>; do not use with
        real funds yet.
      </DocNote>
    </div>
  );
}

function ArchitectureContent() {
  return (
    <div className="space-y-4">
      <DocP>
        The browser talks to a single Next.js deployment. Route Handlers own all
        authentication, the data model, and orchestration of Stellar/Soroban operations,
        and proxy AI workloads to the agent workflow service. Wallets sign transactions
        client side; secrets and the pool live server side or on chain.
      </DocP>
      <HypertronArchitectureDiagram />
      <DocP>
        The diagram above shows how traffic enters from businesses, customers, and wallets;
        how the Next.js BFF orchestrates auth, payments, and compliance; and where data
        lands in MongoDB, the agent workflow service, and the Stellar network.
      </DocP>
    </div>
  );
}

function ModulesContent() {
  return (
    <div className="space-y-4">
      <DocP>
        Three modules make up the system: the frontend (which also hosts the BFF backend),
        the agent workflow service, and the on chain smart contracts.
      </DocP>

      <ModuleHeading id="frontend" title="Frontend" githubPath="frontend/src/app" />
      <DocP>
        Next.js 14 App Router with four route groups. State is mostly React context plus{" "}
        <Mono>fetch</Mono>; React Query is used on the bridge. UI is Radix + a shadcn style
        system with framer motion.
      </DocP>
      <DocTable
        head={["Route group", "Purpose"]}
        rows={[
          [
            <GhTree key="marketing" path="frontend/src/app/(marketing)">
              <Mono>(marketing)</Mono>
            </GhTree>,
            "Public site: home, pricing, features, docs",
          ],
          [
            <GhTree key="main" path="frontend/src/app/(main)">
              <Mono>(main)</Mono>
            </GhTree>,
            "Authenticated workspace hub + dashboard (wallet gated)",
          ],
          [
            <GhTree key="pay" path="frontend/src/app/pay">
              <Mono>pay/[id]</Mono>
            </GhTree>,
            "Public Stellar checkout for payment links",
          ],
          [
            <GhTree key="demo" path="frontend/src/app/demo">
              <Mono>demo</Mono>
            </GhTree>,
            "Unauthenticated sandbox with mock session/data",
          ],
          [
            <GhTree key="api" path="frontend/src/app/api">
              <Mono>api</Mono>
            </GhTree>,
            "Route Handlers (BFF): auth, payments, vault, AI proxies",
          ],
        ]}
      />
      <DocP>Key dashboard surfaces:</DocP>
      <DocBullets
        items={[
          <><strong>Payments</strong>: create/collect payment links, send outbound payments.</>,
          <><strong>Treasury</strong>: pooled balances and withdrawals.</>,
          <><strong>Secure Vault</strong>: Soroban commitment pool (privacy beta).</>,
          <><strong>Bridge</strong>: Circle CCTP USDC across Ethereum, Avalanche, Solana, Stellar.</>,
          <><strong>Compliance Agent / RegIntel / RNS</strong>: AI compliance analysis and regulatory news.</>,
          <><strong>Employees, Templates, Billing</strong>: workspace operations.</>,
        ]}
      />

      <ModuleHeading id="backend" title="Backend (BFF + services)" githubPath="frontend/src/lib" />
      <ModuleGrid
        modules={[
          {
            title: "Next.js Route Handlers",
            tone: "blue",
            githubPath: "frontend/src/app/api",
            points: [
              "Session auth via signed HMAC cookies",
              "Prisma CRUD against MongoDB",
              "Orchestrates Stellar / Soroban server libs",
              "Proxies AI calls to agent workflow",
            ],
          },
          {
            title: "Server libraries",
            tone: "violet",
            githubPath: "frontend/src/lib",
            points: [
              <>
                <GhFile path="frontend/src/lib/relayer.ts">relayer.ts</GhFile>,{" "}
                <GhFile path="frontend/src/lib/payout-server.ts">payout-server.ts</GhFile>
              </>,
              <>
                <GhFile path="frontend/src/lib/fee-sponsor-server.ts">fee-sponsor-server.ts</GhFile> (CAP 40
                fee bump)
              </>,
              <>
                <GhFile path="frontend/src/lib/soroban-commit-server.ts">soroban-commit-server.ts</GhFile>,{" "}
                <GhFile path="frontend/src/lib/soroban-poolmanager.ts">soroban-poolmanager.ts</GhFile>
              </>,
              <>
                <GhFile path="frontend/src/lib/virtual-balance.ts">virtual-balance.ts</GhFile>,{" "}
                <GhFile path="frontend/src/lib/vault.ts">vault.ts</GhFile> +{" "}
                <GhFile path="frontend/src/lib/vault-crypto.ts">vault-crypto.ts</GhFile>
              </>,
            ],
          },
          {
            title: "Agent workflow (FastAPI)",
            tone: "violet",
            githubPath: "ai-analyzer",
            points: [
              "RegIntel RAG pipeline over MongoDB",
              "Compliance Agent (multi modal)",
              "8 regulatory scrapers (OFAC, SEC, MiCA, GDPR…)",
              "OpenAI gpt-4o-mini / gpt-4o",
            ],
          },
          {
            title: "Express demo stub",
            tag: "Legacy",
            tone: "amber",
            githubPath: "backend",
            points: [
              "soroban-escrow-backend on :4000",
              "In memory payment link demo",
              "Not used in production path",
            ],
          },
        ]}
      />

      <ModuleHeading id="contracts-ref" title="Smart contracts" githubPath="contracts/poolmanager" />
      <DocP>
        A single Soroban contract, <strong>PoolManager</strong> (Rust, soroban-sdk 25), runs
        the privacy pool. It uses Poseidon hashing and BN254 scalars from Stellar&rsquo;s
        X Ray primitives. Source lives in{" "}
        <GhTree path="contracts/poolmanager">
          <Mono>contracts/poolmanager</Mono>
        </GhTree>
        . See{" "}
        <Link className="text-blue-400 hover:text-blue-300" href={technicalHref("contracts")}>
          Smart contracts &amp; deployments
        </Link>{" "}
        for the full interface and addresses.
      </DocP>
    </div>
  );
}

function ProtocolsContent() {
  return (
    <div className="space-y-4">
      <DocTable
        head={["Protocol", "Role", "Where"]}
        rows={[
          ["Stellar Horizon", "Classic XLM/USDC payments, payment link settlement", "stellar-payment.ts, horizon.ts"],
          ["Soroban (Protocol 25)", "Privacy pool smart contract execution", "PoolManager, soroban-*.ts"],
          ["Poseidon / BN254 (X Ray)", "ZK friendly commitment hashing", "PoolManager (CAP 0074)"],
          ["Circle CCTP", "Native USDC burn and mint bridge", "lib/bridge/* + @circle-fin/bridge-kit"],
          ["Privy", "Email / social / embedded wallet auth", "privy-*.ts, /api/auth/privy/*"],
          ["SEP 53", "Stellar wallet message signing sign in", "sep53-verify.ts, /api/auth/*"],
          ["OpenAI", "Compliance + regulatory intelligence", "Agent workflow, /api/compliance/generate"],
          ["wagmi / viem, Solana web3", "EVM & Solana wallet connectivity for the bridge", "bridge-providers.tsx"],
        ]}
      />
      <DocNote variant="info">
        Fee sponsorship uses a Stellar <strong>CAP 40 fee bump</strong>: payers sign the inner
        payment, a sponsor account wraps it so the sponsor pays the network fee. The API
        rejects inner transactions whose destination, amount, or memo hash don&rsquo;t match
        the link.
      </DocNote>
    </div>
  );
}

function DataModelContent() {
  return (
    <div className="space-y-4">
      <DocP>
        Prisma is the ORM over <strong>MongoDB</strong> (<Mono>relationMode = &quot;prisma&quot;</Mono>).
        Identity is wallet or Privy based; businesses own all payment and compliance data.
      </DocP>
      <DocTable
        head={["Model", "Purpose"]}
        rows={[
          [<><Mono>AppUser</Mono> / <Mono>Membership</Mono></>, "Privy users and their RBAC role on a business"],
          [<><Mono>Business</Mono></>, "Workspace: profile, tier, widgets, vault config"],
          [<><Mono>LinkedWallet</Mono></>, "Stellar wallets bound to a business"],
          [<><Mono>AuthChallenge</Mono></>, "One time SEP 53 sign in challenges (10 min TTL)"],
          [<><Mono>PaymentLink</Mono></>, "Collect links + attribution memo + ZK nullifier"],
          [<><Mono>PendingPaymentMemo</Mono></>, "Dark pool one time memo hash for attribution"],
          [<><Mono>OutgoingPayment</Mono> / <Mono>Withdrawal</Mono></>, "Pool payouts and spent nullifiers"],
          [<><Mono>BusinessEmployee(Payment)</Mono></>, "Team roster and payroll history"],
          [<><Mono>DocumentVaultItem</Mono></>, "Saved compliance checklists / documents"],
        ]}
      />
    </div>
  );
}

function FlowsContent() {
  return (
    <div className="space-y-4">
      <DocP>
        The four core flows below cover collecting a private payment, withdrawing from the
        pool, bridging USDC across chains, and running an AI compliance analysis.
      </DocP>

      <h3 id="flow-payment" className="scroll-mt-20 pt-3 text-base font-semibold text-white">
        1. Payment link &amp; private attribution
      </h3>
      <FlowChart
        title="Flowchart: collect a payment"
        nodes={[
          { kind: "start", label: "Business creates payment link" },
          { kind: "process", label: "Link stored", sub: "amount, currency, unique memo, pool address" },
          { kind: "process", label: "Customer opens /pay/[id]", sub: "connects Freighter" },
          { kind: "decision", label: "Fee sponsor configured?" },
          {
            kind: "branch",
            left: {
              label: "Yes, sponsored",
              nodes: [
                { kind: "process", label: "prepare-pay → SHA-256 memo hash" },
                { kind: "process", label: "Payer signs inner tx" },
                { kind: "onchain", label: "Sponsor fee bumps & submits", sub: "sponsor pays network fee" },
              ],
            },
            right: {
              label: "No, classic",
              nodes: [
                { kind: "process", label: "Payer signs & submits" },
                { kind: "onchain", label: "Classic payment to pool", sub: "memo attributes the link" },
              ],
            },
          },
          { kind: "process", label: "Horizon event detected", sub: "relayer / status poll" },
          { kind: "onchain", label: "PoolManager.commit(secret, nullifier, amount)", sub: "Poseidon leaf stored" },
          { kind: "process", label: "Virtual balance updated" },
          { kind: "end", label: "Dashboard shows Paid ✓" },
        ]}
      />
      <SequenceDiagram
        title="Sequence: payment attribution"
        actors={["Customer", "Pay page", "API", "Pool", "Soroban", "Dashboard"]}
        steps={[
          { from: "Customer", to: "Pay page", label: "Open link, connect Freighter" },
          { from: "Pay page", to: "API", label: "POST prepare-pay → memo hash" },
          { from: "Pay page", to: "Pool", label: "Submit XLM/USDC payment (memo)" },
          { from: "API", to: "API", label: "Detect Horizon payment, match memo", kind: "self" },
          { from: "API", to: "Soroban", label: "commit(secret, nullifier, amount, token)" },
          { from: "Soroban", to: "API", label: "CommitResult { leaf, root }", kind: "return" },
          { from: "API", to: "Dashboard", label: "Update virtual balance → Paid ✓" },
        ]}
      />

      <h3 id="flow-withdraw" className="scroll-mt-20 pt-3 text-base font-semibold text-white">
        2. Private withdrawal
      </h3>
      <SequenceDiagram
        title="Sequence: withdraw from pool"
        actors={["Business", "API", "Soroban", "Relayer", "Recipient"]}
        steps={[
          { from: "Business", to: "API", label: "Request withdrawal (amount, recipient)" },
          { from: "API", to: "API", label: "Validate virtual balance, select nullifiers", kind: "self" },
          { from: "API", to: "Soroban", label: "withdraw(recipient, nullifiers, proof, root)" },
          { from: "Soroban", to: "Soroban", label: "Mark nullifiers spent (double spend guard)", kind: "self" },
          { from: "Soroban", to: "API", label: "ok", kind: "return" },
          { from: "API", to: "Relayer", label: "Route payout via ephemeral wallet(s)" },
          { from: "Relayer", to: "Recipient", label: "Final transfer (unlinkable, jittered)" },
        ]}
      />
      <DocNote variant="warn">
        The on chain ZK proof is currently a <strong>stub</strong> (rejects empty proofs only).
        ASP approval + the nullifier registry are the active security controls until the
        Groth16 / BN254 verifier lands.
      </DocNote>

      <h3 id="flow-bridge" className="scroll-mt-20 pt-3 text-base font-semibold text-white">
        3. Cross chain USDC bridge (CCTP)
      </h3>
      <SequenceDiagram
        title="Sequence: burn & mint"
        actors={["User", "Source chain", "Circle", "Dest chain"]}
        steps={[
          { from: "User", to: "Source chain", label: "Approve USDC spend" },
          { from: "User", to: "Source chain", label: "Burn USDC → emit message" },
          { from: "Source chain", to: "Circle", label: "Message observed" },
          { from: "Circle", to: "Source chain", label: "Attestation (~1 to 5 min)", kind: "return" },
          { from: "User", to: "Dest chain", label: "Submit attestation → mint native USDC" },
          { from: "Dest chain", to: "User", label: "USDC received", kind: "return" },
        ]}
      />

      <h3 id="flow-compliance" className="scroll-mt-20 pt-3 text-base font-semibold text-white">
        4. AI compliance analysis
      </h3>
      <SequenceDiagram
        title="Sequence: compliance agent"
        actors={["Dashboard", "API", "Agent workflow", "OpenAI", "MongoDB"]}
        steps={[
          { from: "Dashboard", to: "API", label: "Upload context → /api/compliance-agent/analyze" },
          { from: "API", to: "Agent workflow", label: "Proxy multipart with session guard" },
          { from: "Agent workflow", to: "MongoDB", label: "Retrieve RegIntel chunks (RAG)" },
          { from: "Agent workflow", to: "OpenAI", label: "Analyze with gpt-4o / gpt-4o-mini" },
          { from: "OpenAI", to: "Agent workflow", label: "Roadmap, licenses, controls", kind: "return" },
          { from: "Agent workflow", to: "Dashboard", label: "Structured compliance report", kind: "return" },
        ]}
      />
    </div>
  );
}

function ContractsContent() {
  return (
    <div className="space-y-4">
      <DocP>
        <strong>PoolManager</strong> locks tokens on <Mono>commit</Mono> and pays out on{" "}
        <Mono>withdraw</Mono>. The leaf is <Mono>Poseidon(secret, nullifier, amount)</Mono>;
        a rolling Poseidon accumulator tracks the root. An ASP compliance layer
        (approve/block) gates deposits, with admin pause and protocol fees.
      </DocP>
      <DocTable
        head={["Function", "Type", "Description"]}
        rows={[
          [<><Mono>initialize</Mono></>, "admin", "Set admin, fee recipient, fee bps (one time)"],
          [<><Mono>commit</Mono></>, "core", "Deposit tokens, store Poseidon leaf + nullifier"],
          [<><Mono>withdraw</Mono></>, "core", "Reveal nullifiers + proof, pay recipient (batch)"],
          [<><Mono>set_asp / approve / block</Mono></>, "admin", "KYB whitelist + sanctions blocklist"],
          [<><Mono>pause / unpause / set_fee</Mono></>, "admin", "Emergency stop and fee control"],
          [<><Mono>get_state / is_nullifier_spent</Mono></>, "view", "Pool root, size, config and nullifier status"],
        ]}
      />
      <DocP>Deployed addresses (Stellar testnet; may differ per deployment):</DocP>
      <DocTable
        head={["Contract / account", "Network", "Address", "Status"]}
        rows={[
          ["PoolManager", "Testnet", <Mono>{POOLMANAGER_ID}</Mono>, "Live, ZK stub"],
          ["Payment pool account", "Testnet", <Mono>{POOL_ACCOUNT}</Mono>, "Live"],
          ["EscrowEngine", "Testnet", <Mono>{ESCROW_LEGACY}</Mono>, "Not wired"],
        ]}
      />
      <DocNote variant="info">
        Build with <Mono>cargo build --target wasm32v1-none --release</Mono> and deploy via{" "}
        <Mono>contracts/deploy-testnet.sh</Mono>. Set{" "}
        <Mono>NEXT_PUBLIC_POOLMANAGER_CONTRACT_ID</Mono> in the frontend env after deploying.
      </DocNote>
    </div>
  );
}

function RoadmapContent() {
  return (
    <div className="space-y-4">
      <DocP>
        The payments, attribution, virtual balance, and bridge flows are shipped. The privacy
        guarantees are still maturing toward a fully verified ZK withdrawal.
      </DocP>
      <StatusList
        items={[
          { label: "Payment link attribution + dark pool memo hashing", status: "done" },
          { label: "Fee sponsorship (CAP 40 fee bump)", status: "done" },
          { label: "Commitment + nullifier registry (PoolManager)", status: "done" },
          { label: "Virtual balance engine + ephemeral withdrawals", status: "done" },
          { label: "Cross chain USDC bridge (Circle CCTP)", status: "done" },
          { label: "AI compliance agent + RegIntel + RNS", status: "done" },
          { label: "Real Groth16 / BN254 on chain proof verifier", status: "wip", note: "Replaces verify_proof_stub once X Ray matures on mainnet" },
          { label: "Sparse Merkle tree (replace rolling accumulator)", status: "wip" },
          { label: "Batch withdrawal + multi pool routing", status: "planned" },
          { label: "EscrowEngine wiring into payment links", status: "planned" },
          { label: "MoneyGram on ramp payment method", status: "planned" },
          { label: "Security audit + mainnet launch", status: "planned", note: "Required before real funds use" },
        ]}
      />
    </div>
  );
}

const CONTENT: Record<string, () => JSX.Element> = {
  overview: OverviewContent,
  architecture: ArchitectureContent,
  modules: ModulesContent,
  protocols: ProtocolsContent,
  "data-model": DataModelContent,
  flows: FlowsContent,
  contracts: ContractsContent,
  roadmap: RoadmapContent,
};

export function TechnicalPageContent({ slug }: { slug: string }) {
  const Component = CONTENT[slug];
  if (!Component) return null;
  return <Component />;
}
