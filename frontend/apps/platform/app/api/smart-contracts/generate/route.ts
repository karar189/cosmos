import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';

const RWA_CONTRACT_SYSTEM_PROMPT = `You are an expert in Stellar Soroban smart contracts (soroban-sdk 22) for Real World Assets (RWAs).

STRICT RULES — generated code must follow these or it will not compile:

1. Imports: Always include \`contract\` and \`contractimpl\`: \`use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Map, Symbol, ...};\` Do NOT import \`i128\` from soroban_sdk (i128 is a Rust primitive; use it as \`i128\` with no import).

2. Contract functions must NOT take \`&mut self\` or \`self\`. Use \`env: Env\` as the first parameter. Example: \`pub fn transfer(env: Env, from: Address, to: Address, amount: i128) -> Result<(), soroban_sdk::Error>\`.

3. Return types: Use \`Result<(), soroban_sdk::Error>\` or a custom type that implements \`From<YourError> for soroban_sdk::Error\`. Do NOT use \`Result<(), &str>\` or \`Result<(), &'static str>\`. Do NOT use \`soroban_sdk::Error::from("message")\` — Error does not implement From<&str>. For contract errors use \`panic!("message")\` instead of \`return Err(Error::from("..."))\`.

4. Use \`i128\` for token/asset amounts. In \`#[contracttype]\` structs only use: \`Address\`, \`Symbol\`, \`i32\`, \`i64\`, \`i128\`, \`u32\`, \`u64\`, \`u128\`, \`bool\`, \`Vec<T>\`, \`Map<K,V>\`. Never use \`u8\`.

5. Map: \`Map::new(&env)\` takes \`&Env\` (e.g. \`Map::new(&env)\`). Use \`.set(key, value)\` and \`.get(key)\` with owned key.

6. Storage keys: Use \`Symbol::new(&env, "key_name")\` for keys (e.g. \`env.storage().instance().set(&Symbol::new(&env, "token"), &value)\`). Do NOT use \`Symbol::from("key")\` for storage — use \`Symbol::new(&env, "key")\`.

7. Use \`#![cfg_attr(target_family = "wasm", no_std)]\`, \`#[contract]\` on the struct, \`#[contractimpl]\` on the impl. One \`#[contract]\` struct, one \`#[contractimpl]\` impl; every public function takes \`env: Env\` first. No placeholder TODOs.

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
    let code = content.replace(/^```(?:rust|rs)?\s*/i, '').replace(/\s*```$/i, '').trim();

    // Fix: soroban_sdk::Error::from("...") is not supported — use panic! instead
    code = code.replace(
      /return\s+Err\s*\(\s*soroban_sdk::Error::from\s*\(\s*"([^"]*)"\s*\)\s*\)\s*;/g,
      'panic!("$1");'
    );

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
