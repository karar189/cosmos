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

These widgets are available on your **Dashboard Maker** page and can be customized to your specific needs.`,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { institutionType, lookingFor, existingAudits } = body;

    if (!institutionType || !lookingFor) {
      return NextResponse.json(
        { error: 'Institution type and requirements are required' },
        { status: 400 }
      );
    }

    const institutionName = INSTITUTION_NAMES[institutionType] || institutionType;

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
                content: `You are a compliance expert helping institutions set up compliance checklists for Stellar blockchain operations. Be concise and practical. Use markdown formatting with headers and bullet points.`
              },
              {
                role: 'user',
                content: `Institution Type: ${institutionName}\nNeeds: ${lookingFor}\nExisting audits: ${existingAudits || 'None'}\n\nProvide a compliance analysis with key risk areas, recommended widgets, and priority actions. Mention the Dashboard Maker page.`
              }
            ],
            temperature: 0.7,
            max_tokens: 1000
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

    // Fallback: use curated responses
    console.log('[API] Using fallback response for:', institutionType);
    const fallbackAnalysis = FALLBACK_RESPONSES[institutionType] || FALLBACK_RESPONSES['fintech'];

    // Simulate slight delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({ 
      analysis: fallbackAnalysis, 
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
