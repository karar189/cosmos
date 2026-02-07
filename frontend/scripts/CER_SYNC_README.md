# CER.live Data Synchronization

## Overview

This script synchronizes exchange data from CER.live API to local JSON files, updating security ratings, certifications, and detailed security metrics.

## Files

- **`sync-cer-data.py`**: Main synchronization script
- **`exchange-slug-mapping.json`**: Manual mappings for exchanges with non-standard slug names

## Usage

### Update All Exchanges
```bash
python3 scripts/sync-cer-data.py
```

### Update Single Exchange
```bash
python3 scripts/sync-cer-data.py --exchange "Binance"
```

### Dry Run (Preview Changes)
```bash
python3 scripts/sync-cer-data.py --dry-run
```

### Quiet Mode
```bash
python3 scripts/sync-cer-data.py --quiet
```

## What Gets Updated

### In `exchanges_statistic.json`:
- `certification.level` - Certification level from CER.live
- `security.score` - Overall security score (0-100)
- `security.grade` - Security rating (AAA, AA, A, BBB, BB, B, CCC, CC, C, DDD, DD, D)

### In Individual Exchange JSON Files (e.g., `Binance.json`):

**exchangeDetails section:**
- `certification.level` - Certification level
- `security.score.current` - Overall security score
- `security.grade.label` - Security rating grade
- `description` - Updated with new score percentage

**security section:**
- `score.current` - Overall security score
- `serverSecurity.score` - Server security score (0-100)
- `userSecurity.score` - User security score (0-100)
- `penetrationTest.score.current` - Penetration test score (0-100)
- `bugBounty.score.current` - Bug bounty score (0-100)

**solvency section:**
- `proofOfReserves.isProofOfReservesAuditPresent` - Boolean from CER.live

## Synchronization Results

### Successfully Updated: 223+ exchanges

**Sample Updates:**
- **MEXC**: 15 → 90 (C → AA), certification: low → medium
- **Binance**: 14 → 87 (C → AA), certification: medium → high
- **KuCoin**: 12 → 100 (C → AAA), certification: low → high
- **Kraken**: 22 → 90 (CC → AA), certification: low → high
- **XT.COM**: Updated via slug mapping (xt)
- **WOO X**: Updated via slug mapping (wootrade)

### Custom Slug Mappings (35 exchanges)

These exchanges require special slug mappings because their CER.live URLs differ from their display names:

- MEXC → `mxc`
- XT.COM → `xt`
- WOO X → `wootrade`
- BtcTurk | Kripto → `btcturk`
- CEX.IO → `cex`
- zondacrypto → `bitbay`
- ...and 29 more (see `exchange-slug-mapping.json`)

### Not Found on CER.live (12 exchanges)

These exchanges could not be found on CER.live and were not updated:
- BitMEX, BitTrade, BloFin, Hotcoin, BWFX.pro, BitGlobal
- CERRAM META, Coins.ph, Collect & Exchange, Delta Exchange, FMFW.io, Qbit

These may be:
1. Not yet added to CER.live
2. Using completely different names
3. Merged with other exchanges
4. No longer active

## Backup Files

All modified JSON files have corresponding `.backup` files created before changes. These can be found at:
- `apps/platform/src/data/exchanges_statistic.json.backup`
- `apps/platform/src/data/exchanges/*.json.backup`

To restore from backup:
```bash
cp apps/platform/src/data/exchanges_statistic.json.backup apps/platform/src/data/exchanges_statistic.json
```

## TypeScript Types Updated

The TypeScript type definitions in `apps/platform/src/types/api/exchange.ts` have been updated to include the new optional fields:

```typescript
interface SecuritySection {
  // ... existing fields ...
  serverSecurity?: {
    score: number;
    maxScore: number;
  };
  userSecurity?: {
    score: number;
    maxScore: number;
  };
  penetrationTest: {
    coverage: { percentage: number };
    score?: {
      current: number;
      maxScore: number;
    };
  };
  bugBounty: {
    // ... existing fields ...
    score?: {
      current: number;
      maxScore: number;
    };
  };
}
```

## Adding New Mappings

If you find a CER.live slug for a missing exchange:

1. Add it to `scripts/exchange-slug-mapping.json`:
   ```json
   {
     "Exchange Name": "cer-slug",
     ...
   }
   ```

2. Run the sync script:
   ```bash
   python3 scripts/sync-cer-data.py --exchange "Exchange Name"
   ```

## CER.live API Endpoints

- **Exchange List**: `POST https://cer.security.cloud/api/v1/exchange/compact/search`
- **Exchange Details**: `GET https://cer.security.cloud/api/v1/exchange/eid/{slug}`

