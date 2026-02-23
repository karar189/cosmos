#!/usr/bin/env bash
# Check XLM balance for a mainnet identity (key name or G... address).
# Usage: ./check-mainnet-balance.sh deployer-mainnet   OR   ./check-mainnet-balance.sh GB6PJ...
set -e
ADDR="$1"
if [ -z "$ADDR" ]; then
  echo "Usage: $0 <identity-name-or-G-address>"
  echo "  e.g. $0 deployer-mainnet"
  exit 1
fi
# If it looks like a key name (no G prefix), resolve to public key
if [[ ! "$ADDR" =~ ^G ]]; then
  ADDR=$(stellar keys address "$ADDR" 2>/dev/null || true)
  if [ -z "$ADDR" ]; then
    echo "Unknown identity. Use a key name (e.g. deployer-mainnet) or a G... address."
    exit 1
  fi
fi
echo "Account: $ADDR"
echo "Network: mainnet (horizon.stellar.org)"
curl -s "https://horizon.stellar.org/accounts/$ADDR" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    if 'balances' in d:
        for b in d['balances']:
            if b.get('asset_type') == 'native':
                print('Balance: {} XLM'.format(b['balance']))
                break
        else:
            print('Balance: 0 XLM (native)')
    else:
        print('Account not found or error:', d.get('detail', d.get('status', d)))
except Exception as e:
    print('Error:', e)
    sys.exit(1)
"
