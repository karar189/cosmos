import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';

const RWA_CONTRACT_SYSTEM_PROMPT = `You are an expert in Stellar Soroban smart contracts for Real World Assets (RWAs).
Generate production-quality Soroban (Rust) contract code that:
- Compiles with soroban-sdk and is compatible with Stellar mainnet/testnet
- Implements the requested contract type with clear admin, authorization, and asset lifecycle logic
- Includes necessary imports, error types, and events
- Is concise but complete (no placeholder TODOs)
Return ONLY the Rust source code, no markdown code fence or explanation.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contractType, description } = body as { contractType?: string; description?: string };

    if (!contractType || typeof contractType !== 'string') {
      return NextResponse.json(
        { error: 'contractType is required' },
        { status: 400 }
      );
    }

    const userPrompt = description
      ? `Generate a Soroban smart contract for: ${contractType}. Additional context: ${description}`
      : `Generate a Soroban smart contract for: ${contractType}.`;

    if (!OPENAI_API_KEY) {
      // Return mock response when no API key (development)
      const mockCode = `// Soroban RWA contract: ${contractType}
// Set OPENAI_API_KEY to generate via OpenAI.

#![cfg_attr(target_family = "wasm", no_std)]
use soroban_sdk::{contract, contractimpl, contracttype, Env, Symbol, Vec};

#[contracttype]
pub struct Config {
    pub admin: soroban_sdk::Address,
}

#[contract]
pub struct ${contractType.replace(/\s+/g, '')};

#[contractimpl]
impl ${contractType.replace(/\s+/g, '')} {
    pub fn init(env: Env, admin: soroban_sdk::Address) -> Config {
        Config { admin }
    }
}
`;
      return NextResponse.json({
        code: mockCode,
        deployedAddress: null,
        message: 'Mock contract generated. Set OPENAI_API_KEY for OpenAI generation.',
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: RWA_CONTRACT_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json(
        { error: 'OpenAI request failed', details: err },
        { status: response.status }
      );
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data?.choices?.[0]?.message?.content?.trim() ?? '';
    const code = content.replace(/^```(?:rust|rs)?\s*/i, '').replace(/\s*```$/i, '').trim();

    // Deploy placeholder: in production you would invoke Stellar/Soroban deploy here
    const deployedAddress = null;

    return NextResponse.json({
      code: code || '// No code generated',
      deployedAddress,
      message: deployedAddress
        ? 'Contract generated and deployed on Stellar.'
        : 'Contract generated. Deploy via Stellar Laboratory or CLI.',
    });
  } catch (e) {
    console.error('smart-contracts/generate:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
