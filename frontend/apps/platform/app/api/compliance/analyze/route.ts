import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';

const INSTITUTION_NAMES: Record<string, string> = {
  rwa: 'RWA (Real World Assets)',
  stablecoin: 'Stablecoin / Fiat Issuers',
  neobank: 'Neobanks',
  ngo: 'NGOs / Aid Organizations',
  remittance: 'Remittance Companies',
  fintech: 'Fintech Payment Apps',
};

// Rich fallback responses per institution type
const FALLBACK_RESPONSES: Record<string, string> = {
  rwa: `## Compliance Analysis: RWA (Real World Assets)

Based on your institution profile, here is my analysis and recommended compliance checklist for operating tokenized real-world assets on the Stellar network.

### Key Risk Areas Identified
- **Securities Regulation**: Tokenized RWAs may be classified as securities in most jurisdictions. You'll need ongoing SEC/MAS/FCA compliance monitoring.
- **Asset Custody & Verification**: Each on-chain token must have verifiable off-chain collateral. Regular proof-of-reserve audits are critical.
- **Investor Accreditation**: Depending on the asset class, KYC/KYB and accredited investor verification may be required before allowing transactions.

### Recommended Compliance Widgets
1. **Asset Tokenization Tracker** — Real-time monitoring of all tokenized assets, their on-chain representation, and backing status. Alerts when reserve ratios drop below thresholds.
2. **RWA Compliance Monitor** — Automated regulatory scanning across 40+ jurisdictions. Flags when asset classifications change or new regulations affect your tokens.
3. **Yield Analytics** — Track and report yield distributions to token holders. Ensures proper tax reporting and regulatory disclosures.
4. **Regulatory Reporting** — Auto-generate compliance reports for SEC, MAS, FCA, and other regulators. ISO 20022 formatted outputs ready for bank submission.

### Priority Actions
- Set up Soroban smart contract enforcement for freeze/clawback capabilities
- Implement proof-of-reserve oracle integration
- Configure automated SAR (Suspicious Activity Report) generation

### Smart Contract Recommendations
- **Soroban Enforcement Module** — You likely need smart contract–based freeze/clawback for regulatory compliance (e.g. court orders, sanctions). Build or use a Soroban contract that allows an authorized admin to freeze or claw back token balances.
- **Proof-of-Reserve Oracle** — Consider an oracle contract that attests off-chain collateral on-chain so holders can verify backing. Useful for RWA and stablecoin-style tokens.
- **Asset Token Contract** — If you issue tokens for real-world assets, you need a Soroban token contract (or Stellar Classic asset) with the right metadata and compliance hooks; you may not need custom logic beyond standard issuance if you rely on off-chain compliance.

These widgets are available on your **Dashboard Maker** page and can be customized to your specific needs.`,

  stablecoin: `## Compliance Analysis: Stablecoin / Fiat Issuers

Your institution requires robust compliance infrastructure for issuing and managing stablecoins on the Stellar network. Here's my comprehensive analysis.

### Key Risk Areas Identified
- **Reserve Transparency**: Regulators worldwide are tightening requirements for stablecoin reserves. Real-time proof-of-reserves is becoming mandatory.
- **Redemption Risk**: Ensuring 1:1 redemption capability at all times requires constant monitoring of reserve composition and liquidity.
- **Cross-border Compliance**: Stablecoins used in cross-border payments trigger multi-jurisdictional regulatory requirements.

### Recommended Compliance Widgets
1. **Reserve Monitoring** — Real-time tracking of fiat reserves, bank balances, and collateral composition. Automated alerts when reserves deviate from required ratios.
2. **Redemption Tracker** — Monitor all redemption requests, processing times, and fulfillment rates. Ensures SLA compliance and identifies bottlenecks.
3. **Regulatory Compliance** — Multi-jurisdiction compliance engine covering MiCA (EU), NYDFS (US), MAS (Singapore), and 30+ other frameworks.
4. **Audit Dashboard** — Continuous audit trail with real-time attestation. Integration with external auditors for automated monthly reports.

### Priority Actions
- Configure trustline analytics for holder risk distribution
- Set up geo-distribution monitoring for sanctions compliance
- Enable freeze/unfreeze capabilities via Soroban enforcement

### Smart Contract Recommendations
- **Freeze/Clawback Contract** — You typically need a Soroban (or Classic) contract with freeze and clawback for regulatory and court orders. Many stablecoin issuers use this; avoid custom logic if your platform already provides it.
- **Reserve Attestation** — You may not need a custom smart contract for reserves if you use off-chain attestations and dashboards; an on-chain oracle is optional but improves trust.
- **Custom Token Logic** — Only build custom token contracts if you need programmatic redemption, tiered access, or other rules; standard Stellar assets plus admin tools are often enough.

These widgets are available on your **Dashboard Maker** page and can be customized to your specific needs.`,

  neobank: `## Compliance Analysis: Neobanks

As a neobank operating on the Stellar network, your compliance needs span traditional banking regulations plus blockchain-specific requirements. Here's my analysis.

### Key Risk Areas Identified
- **KYC/KYB Gaps**: Digital-first onboarding increases risk of identity fraud. Enhanced due diligence workflows are essential.
- **Transaction Monitoring**: High transaction volumes require real-time AML screening and pattern detection.
- **Regulatory Licensing**: Banking licenses in each operating jurisdiction must be maintained with continuous compliance reporting.

### Recommended Compliance Widgets
1. **KYC/KYB Dashboard** — Centralized identity verification hub with risk scoring, document verification, and ongoing monitoring. Supports tiered KYC with automated upgrade prompts.
2. **Transaction Monitoring** — AI-powered real-time monitoring of all transactions. Detects structuring, smurfing, round-tripping, and other suspicious patterns.
3. **Risk Scoring** — Dynamic customer risk scoring based on behavior, geography, transaction patterns, and network analysis. Auto-triggers enhanced due diligence.
4. **Regulatory Reporting** — Automated generation of STRs, SARs, CTRs, and other regulatory filings. Calendar-based compliance deadlines with alerts.

### Priority Actions
- Implement daily/weekly transaction limits with smart enforcement
- Set up jurisdiction-specific rule engines
- Configure large-value transfer monitoring thresholds

### Smart Contract Recommendations
- **Enforcement Rules** — You may not need on-chain smart contracts for limits; off-chain KYC and transaction monitoring often suffice. Consider Soroban only if you need enforceable, programmable limits on-chain.
- **Identity / KYC Hooks** — If you require on-chain gating (e.g. only verified accounts hold certain assets), a Soroban contract that checks an allowlist or attestation can help; otherwise keep compliance off-chain.
- **Freeze/Clawback** — For fraud or court orders, a token with freeze/clawback (Classic or Soroban) is recommended; use existing issuer tooling if available.

These widgets are available on your **Dashboard Maker** page and can be customized to your specific needs.`,

  ngo: `## Compliance Analysis: NGOs / Aid Organizations

Aid organizations operating on Stellar face unique compliance challenges around fund traceability, high-risk regions, and anti-corruption requirements. Here's my analysis.

### Key Risk Areas Identified
- **Fund Diversion Risk**: Aid funds flowing through multiple intermediaries in high-risk regions require end-to-end traceability.
- **Sanctions & Embargoes**: Operating in conflict zones means constant sanctions screening against OFAC, EU, and UN lists.
- **Donor Compliance**: Many donors (governments, foundations) require detailed reporting on fund utilization and impact metrics.

### Recommended Compliance Widgets
1. **Donation Tracker** — End-to-end tracking of all incoming donations with source verification, purpose tagging, and donor compliance documentation.
2. **Fund Flow Monitor** — Visual mapping of fund flows from receipt to final beneficiary. Detects unusual patterns, diversions, or delays in fund distribution.
3. **Compliance Checker** — Real-time screening against global sanctions lists, PEP databases, and high-risk entity registries. Automated blocking of prohibited transactions.
4. **Transparency Dashboard** — Public-facing and internal transparency reports. Shows fund utilization rates, beneficiary reach, and impact metrics.

### Priority Actions
- Configure high-risk region geo-scoring for all corridors
- Set up rapid outflow detection for corruption risk
- Enable wallet behavior profiling for beneficiary verification

### Smart Contract Recommendations
- **You may not need custom smart contracts** — Many NGOs run on standard Stellar payments and off-chain compliance; focus on tracking and reporting first.
- **Conditional Disbursement** — If you need “pay only when condition X is met,” a simple Soroban contract or escrow can help; otherwise use SDP or manual flows.
- **Attestation / Proof of Use** — Optional: a lightweight contract or claimable balance that records that funds reached a beneficiary can improve transparency without heavy smart contract use.

These widgets are available on your **Dashboard Maker** page and can be customized to your specific needs.`,

  remittance: `## Compliance Analysis: Remittance Companies

Cross-border remittance on Stellar requires robust AML/CFT compliance, corridor risk management, and regulatory adherence across multiple jurisdictions. Here's my analysis.

### Key Risk Areas Identified
- **Corridor Risk**: Different remittance corridors carry vastly different risk levels based on FATF ratings, sanctions exposure, and financial crime prevalence.
- **Structuring/Smurfing**: Breaking large transfers into smaller amounts to avoid reporting thresholds is a primary concern.
- **Agent Network Risk**: Third-party agents and cash-out partners introduce additional compliance risk layers.

### Recommended Compliance Widgets
1. **Corridor Risk Monitor** — Real-time risk scoring for all active remittance corridors using FATF data, sanctions lists, and historical transaction analysis. Dynamic risk-based pricing.
2. **Transaction Limits** — Configurable daily, weekly, and monthly limits per customer, per corridor, and per agent. Smart enforcement with override workflows.
3. **AML Screening** — Real-time name screening against OFAC, EU, UN, and local sanctions lists. Fuzzy matching, alias detection, and PEP screening included.
4. **Regulatory Compliance** — Multi-jurisdiction compliance engine covering money transmitter licenses, reporting obligations, and record-keeping requirements.

### Priority Actions
- Configure memo-required enforcement for all transfers
- Set up high-risk corridor alerts with automatic escalation
- Enable smurfing detection algorithms across customer accounts

### Smart Contract Recommendations
- **Memo / Compliance Data** — You usually do not need a smart contract for memo enforcement; use Stellar transaction memos and off-chain validation. Soroban is for programmable logic, not just metadata.
- **Limit Enforcement** — Daily/corridor limits are typically enforced off-chain; consider Soroban only if you need hard, on-chain caps (e.g. per-account caps in a liquidity pool).
- **Freeze/Clawback** — If you issue tokens, having freeze/clawback for sanctions or court orders is recommended; use Stellar’s native asset flags or a Soroban wrapper.

These widgets are available on your **Dashboard Maker** page and can be customized to your specific needs.`,

  fintech: `## Compliance Analysis: Fintech Payment Apps

As a fintech payment app on Stellar, you need a modern compliance stack that balances user experience with robust regulatory compliance. Here's my analysis.

### Key Risk Areas Identified
- **Fraud Prevention**: Real-time payments attract sophisticated fraud patterns including account takeovers, synthetic identities, and social engineering.
- **AML Compliance**: Growing regulatory scrutiny on fintechs means AML programs must be on par with traditional financial institutions.
- **Data Privacy**: Handling user payment data requires GDPR, CCPA, and local data protection compliance.

### Recommended Compliance Widgets
1. **Payment Analytics** — Real-time dashboard of all payment flows, success rates, failure patterns, and anomaly detection. ISO 20022 metadata formatting included.
2. **Fraud Detection** — AI-powered fraud scoring for every transaction. Detects account takeovers, velocity abuse, device fingerprint anomalies, and coordinated fraud rings.
3. **Compliance Score** — Real-time organizational compliance score across all regulatory frameworks. Identifies gaps, tracks remediation, and generates board-ready reports.
4. **User Risk Assessment** — Dynamic risk profiling for each user based on onboarding data, transaction behavior, device patterns, and network connections.

### Priority Actions
- Implement real-time sanctions screening on all payment flows
- Configure ISO 20022 metadata formatting for bank interoperability
- Set up automated fraud pattern detection with ML models

### Smart Contract Recommendations
- **You may not need custom smart contracts** — Many fintech apps use Stellar as a rail and do compliance off-chain; only add Soroban if you need programmable rules (e.g. conditional releases, loyalty logic).
- **Conditional or Programmable Payments** — If you need “pay when X” or multi-step flows, a small Soroban contract or escrow can help; otherwise use standard payments + your backend.
- **Token or Loyalty Programs** — If you issue points or tokens, a simple Soroban token contract may be useful; for pure fiat flows, standard Stellar payments are often enough.

These widgets are available on your **Dashboard Maker** page and can be customized to your specific needs.`,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { institutionName: institutionNameInput, institutionType, lookingFor, existingAudits } = body;

    if (!institutionNameInput?.trim() || !institutionType || !lookingFor) {
      return NextResponse.json(
        { error: 'Institution name, type, and requirements are required' },
        { status: 400 }
      );
    }

    const institutionTypeLabel = INSTITUTION_NAMES[institutionType] || institutionType;
    const institutionName = String(institutionNameInput).trim();

    // Try OpenAI first
    if (OPENAI_API_KEY && OPENAI_API_KEY.startsWith('sk-')) {
      try {
        console.log('[API] Calling OpenAI...');
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: `You are a compliance and Stellar/Soroban smart contract expert. Help institutions set up compliance checklists for Stellar blockchain operations. Be concise and practical. Use markdown with headers and bullet points. Always include:
1) Key risk areas
2) Recommended compliance widgets
3) Priority actions
4) Smart Contract Recommendations — what kind of smart contracts this institution might need (e.g. Soroban freeze/clawback, oracles, token contracts) or when they may NOT need custom smart contracts. Be specific to Stellar/Soroban.`
              },
              {
                role: 'user',
                content: `Institution Name: ${institutionName}\nInstitution Type: ${institutionTypeLabel}\nNeeds: ${lookingFor}\nExisting audits: ${existingAudits || 'None'}\n\nProvide a compliance analysis for "${institutionName}" including key risk areas, recommended widgets, priority actions, and a "Smart Contract Recommendations" section (what smart contracts they might need—or not need—on Stellar/Soroban). Mention the Dashboard Maker page.`
              }
            ],
            temperature: 0.7,
            max_tokens: 1200
          })
        });

        if (response.ok) {
          const data = await response.json();
          const aiResponse = data.choices?.[0]?.message?.content;
          if (aiResponse) {
            console.log('[API] OpenAI response received successfully');
            return NextResponse.json({ analysis: aiResponse, success: true, source: 'openai' });
          }
        }
        console.warn('[API] OpenAI failed, using fallback. Status:', response.status);
      } catch (e) {
        console.warn('[API] OpenAI call failed, using fallback:', e);
      }
    }

    // Fallback: use curated responses (include institution name and smart contract section)
    console.log('[API] Using fallback response for:', institutionType);
    const fallbackAnalysis = FALLBACK_RESPONSES[institutionType] || FALLBACK_RESPONSES['fintech'];
    const analysisWithName = `Compliance analysis for: ${institutionName}\n\n${fallbackAnalysis}`;

    // Simulate slight delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({ 
      analysis: analysisWithName, 
      success: true, 
      source: 'fallback'
    });
  } catch (error) {
    console.error('[API] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
