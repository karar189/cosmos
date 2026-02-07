#!/usr/bin/env python3
"""
CER.live Data Synchronization Script

This script fetches exchange data from CER.live API and updates local JSON files
with accurate security ratings, certifications, and detailed security metrics.

Usage:
    python scripts/sync-cer-data.py                    # Update all exchanges
    python scripts/sync-cer-data.py --exchange binance # Update single exchange
    python scripts/sync-cer-data.py --dry-run          # Preview changes without writing
"""

import json
import argparse
import sys
import os
from pathlib import Path
from typing import Dict, List, Optional, Any
from datetime import datetime
import shutil

try:
    import requests
except ImportError:
    print("Error: requests library not found. Please install it with: pip install requests")
    sys.exit(1)


# API Configuration
CER_API_BASE = "https://cer.security.cloud/api/v1"
EXCHANGE_LIST_ENDPOINT = f"{CER_API_BASE}/exchange/compact/search"
EXCHANGE_DETAIL_ENDPOINT = f"{CER_API_BASE}/exchange/eid"

# File paths
PROJECT_ROOT = Path(__file__).parent.parent
STATISTICS_FILE = PROJECT_ROOT / "apps/platform/src/data/exchanges_statistic.json"
EXCHANGES_DIR = PROJECT_ROOT / "apps/platform/src/data/exchanges"


class CERDataSync:
    def __init__(self, dry_run: bool = False, verbose: bool = True):
        self.dry_run = dry_run
        self.verbose = verbose
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
        
        # Load slug mappings for exchanges with different names
        self.slug_mappings = self._load_slug_mappings()
    
    def _load_slug_mappings(self) -> Dict[str, str]:
        """Load the manual slug mappings from file."""
        mapping_file = PROJECT_ROOT / "scripts/exchange-slug-mapping.json"
        if mapping_file.exists():
            with open(mapping_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {}
    
    def log(self, message: str, level: str = "INFO"):
        """Print log message if verbose mode is enabled."""
        if self.verbose:
            timestamp = datetime.now().strftime("%H:%M:%S")
            print(f"[{timestamp}] {level}: {message}")
    
    def fetch_exchange_list(self) -> List[Dict[str, Any]]:
        """Fetch the list of all exchanges from CER.live API."""
        self.log("Fetching exchange list from CER.live...")
        
        try:
            response = self.session.post(
                EXCHANGE_LIST_ENDPOINT,
                json={"page": 1, "limit": 1000}  # Get all exchanges
            )
            response.raise_for_status()
            data = response.json()
            
            # API returns {'data': [...], 'total': N}
            exchanges = data.get('data', [])
            self.log(f"Found {len(exchanges)} exchanges on CER.live")
            return exchanges
        except requests.RequestException as e:
            self.log(f"Failed to fetch exchange list: {e}", "ERROR")
            return []
    
    def fetch_exchange_details(self, exchange_name: str) -> Optional[Dict[str, Any]]:
        """Fetch detailed information for a specific exchange."""
        # Check if we have a manual mapping for this exchange
        if exchange_name in self.slug_mappings:
            exchange_slug = self.slug_mappings[exchange_name]
            self.log(f"Using mapped slug for {exchange_name}: {exchange_slug}")
        else:
            exchange_slug = exchange_name.lower().replace(' ', '-')
        
        url = f"{EXCHANGE_DETAIL_ENDPOINT}/{exchange_slug}"
        
        self.log(f"Fetching details for {exchange_name} from {url}...")
        
        try:
            response = self.session.get(url)
            response.raise_for_status()
            data = response.json()
            # The API returns the data directly, not wrapped in a 'data' key
            return data
        except requests.RequestException as e:
            self.log(f"Failed to fetch details for {exchange_name}: {e}", "WARNING")
            return None
    
    def map_certification_level(self, cer_certification: Optional[str]) -> str:
        """Map CER certification to our internal format."""
        if not cer_certification:
            return "uncertified"
        
        # CER uses certification levels directly
        cert_lower = cer_certification.lower()
        if cert_lower in ["low", "medium", "high", "uncertified"]:
            return cert_lower
        
        # If it's something else, try to infer
        if "high" in cert_lower or cert_lower == "3":
            return "high"
        elif "medium" in cert_lower or cert_lower == "2":
            return "medium"
        elif "low" in cert_lower or cert_lower == "1":
            return "low"
        
        return "uncertified"
    
    def update_statistics_file(self, exchange_data_map: Dict[str, Dict[str, Any]]):
        """Update the exchanges_statistic.json file."""
        self.log(f"Updating {STATISTICS_FILE.name}...")
        
        if not STATISTICS_FILE.exists():
            self.log(f"Statistics file not found: {STATISTICS_FILE}", "ERROR")
            return
        
        # Read current statistics
        with open(STATISTICS_FILE, 'r', encoding='utf-8') as f:
            stats = json.load(f)
        
        # Create backup
        if not self.dry_run:
            backup_path = STATISTICS_FILE.with_suffix('.json.backup')
            shutil.copy2(STATISTICS_FILE, backup_path)
            self.log(f"Created backup: {backup_path.name}")
        
        # Update exchanges list
        updated_count = 0
        for exchange_item in stats.get('exchangesList', {}).get('list', []):
            exchange_name = exchange_item.get('exchange', {}).get('name', '')
            
            if exchange_name in exchange_data_map:
                cer_data = exchange_data_map[exchange_name]
                
                # Update certification
                if 'certification' in cer_data:
                    old_cert = exchange_item.get('certification', {}).get('level')
                    new_cert = self.map_certification_level(cer_data['certification'])
                    if old_cert != new_cert:
                        exchange_item['certification']['level'] = new_cert
                        self.log(f"  {exchange_name}: certification {old_cert} → {new_cert}")
                        updated_count += 1
                
                # Update security rating
                if 'security_rating' in cer_data:
                    old_grade = exchange_item.get('security', {}).get('grade')
                    new_grade = cer_data['security_rating']
                    if old_grade != new_grade:
                        exchange_item['security']['grade'] = new_grade
                        self.log(f"  {exchange_name}: grade {old_grade} → {new_grade}")
                        updated_count += 1
                
                # Update security score
                if 'security_score' in cer_data:
                    old_score = exchange_item.get('security', {}).get('score')
                    new_score = cer_data['security_score']
                    if old_score != new_score:
                        exchange_item['security']['score'] = new_score
                        self.log(f"  {exchange_name}: score {old_score} → {new_score}")
                        updated_count += 1
        
        # Write updated statistics
        if not self.dry_run:
            with open(STATISTICS_FILE, 'w', encoding='utf-8') as f:
                json.dump(stats, f, indent=2, ensure_ascii=False)
            self.log(f"Updated {updated_count} exchanges in statistics file")
        else:
            self.log(f"[DRY RUN] Would update {updated_count} exchanges in statistics file")
    
    def update_exchange_file(self, exchange_name: str, cer_data: Dict[str, Any]):
        """Update individual exchange JSON file."""
        # Find the exchange file
        exchange_file = None
        for file_path in EXCHANGES_DIR.glob("*.json"):
            with open(file_path, 'r', encoding='utf-8') as f:
                try:
                    data = json.load(f)
                    if data.get('exchangeDetails', {}).get('name') == exchange_name:
                        exchange_file = file_path
                        break
                except json.JSONDecodeError:
                    continue
        
        if not exchange_file:
            self.log(f"No file found for {exchange_name}", "WARNING")
            return
        
        self.log(f"Updating {exchange_file.name}...")
        
        # Read current data
        with open(exchange_file, 'r', encoding='utf-8') as f:
            exchange_json = json.load(f)
        
        # Create backup
        if not self.dry_run:
            backup_path = exchange_file.with_suffix('.json.backup')
            shutil.copy2(exchange_file, backup_path)
        
        updates = []
        
        # Update exchangeDetails section
        if 'exchangeDetails' in exchange_json:
            details = exchange_json['exchangeDetails']
            
            # Certification
            if 'certification' in cer_data:
                new_cert = self.map_certification_level(cer_data['certification'])
                old_cert = details.get('certification', {}).get('level')
                if old_cert != new_cert:
                    details['certification']['level'] = new_cert
                    updates.append(f"certification: {old_cert} → {new_cert}")
            
            # Security in exchangeDetails
            if 'security' in details:
                # Update score
                if 'security_score' in cer_data:
                    old_score = details['security']['score']['current']
                    new_score = cer_data['security_score']
                    if old_score != new_score:
                        details['security']['score']['current'] = new_score
                        updates.append(f"security score: {old_score} → {new_score}")
                
                # Update grade
                if 'security_rating' in cer_data:
                    old_grade = details['security']['grade']['label']
                    new_grade = cer_data['security_rating']
                    if old_grade != new_grade:
                        details['security']['grade']['label'] = new_grade
                        updates.append(f"security grade: {old_grade} → {new_grade}")
            
            # Update description with new score
            if 'security_score' in cer_data and 'description' in details:
                old_desc = details['description']
                # Replace score percentage in description
                import re
                new_desc = re.sub(r'\d+%', f"{cer_data['security_score']}%", old_desc)
                if old_desc != new_desc:
                    details['description'] = new_desc
                    updates.append("description updated with new score")
        
        # Update root security section
        if 'security' in exchange_json:
            security = exchange_json['security']
            
            # Update overall score
            if 'security_score' in cer_data:
                old_score = security['score']['current']
                new_score = cer_data['security_score']
                if old_score != new_score:
                    security['score']['current'] = new_score
            
            # Add/update server security score
            if 'server_security_score' in cer_data:
                if 'serverSecurity' not in security:
                    security['serverSecurity'] = {}
                security['serverSecurity']['score'] = cer_data['server_security_score']
                security['serverSecurity']['maxScore'] = 100
                updates.append(f"server security: {cer_data['server_security_score']}/100")
            
            # Add/update user security score
            if 'user_security_score' in cer_data:
                if 'userSecurity' not in security:
                    security['userSecurity'] = {}
                security['userSecurity']['score'] = cer_data['user_security_score']
                security['userSecurity']['maxScore'] = 100
                updates.append(f"user security: {cer_data['user_security_score']}/100")
            
            # Update penetration test score
            if 'penetration_test_score' in cer_data:
                if 'penetrationTest' not in security:
                    security['penetrationTest'] = {}
                if 'score' not in security['penetrationTest']:
                    security['penetrationTest']['score'] = {}
                security['penetrationTest']['score']['current'] = cer_data['penetration_test_score']
                security['penetrationTest']['score']['maxScore'] = 100
                updates.append(f"penetration test: {cer_data['penetration_test_score']}/100")
            
            # Update bug bounty score
            if 'bug_bounty_score' in cer_data:
                if 'bugBounty' not in security:
                    security['bugBounty'] = {}
                if 'score' not in security['bugBounty']:
                    security['bugBounty']['score'] = {}
                security['bugBounty']['score']['current'] = cer_data['bug_bounty_score']
                security['bugBounty']['score']['maxScore'] = 100
                updates.append(f"bug bounty: {cer_data['bug_bounty_score']}/100")
        
        # Update solvency section
        if 'solvency' in exchange_json and 'has_proof_of_reserves' in cer_data:
            if 'proofOfReserves' not in exchange_json['solvency']:
                exchange_json['solvency']['proofOfReserves'] = {}
            
            old_por = exchange_json['solvency']['proofOfReserves'].get('isProofOfReservesAuditPresent')
            new_por = cer_data['has_proof_of_reserves']
            if old_por != new_por:
                exchange_json['solvency']['proofOfReserves']['isProofOfReservesAuditPresent'] = new_por
                updates.append(f"proof of reserves: {old_por} → {new_por}")
        
        # Write updated data
        if not self.dry_run and updates:
            with open(exchange_file, 'w', encoding='utf-8') as f:
                json.dump(exchange_json, f, indent=2, ensure_ascii=False)
            self.log(f"  Updated {exchange_name}: {', '.join(updates)}")
        elif updates:
            self.log(f"  [DRY RUN] Would update {exchange_name}: {', '.join(updates)}")
        else:
            self.log(f"  No updates needed for {exchange_name}")
    
    def rating_to_grade(self, rating: float) -> str:
        """Convert numeric rating (0-10) to letter grade."""
        # rating is out of 10, convert to percentage
        score = rating * 10
        
        if score >= 95:
            return "AAA"
        elif score >= 85:
            return "AA"
        elif score >= 75:
            return "A"
        elif score >= 65:
            return "BBB"
        elif score >= 55:
            return "BB"
        elif score >= 45:
            return "B"
        elif score >= 35:
            return "CCC"
        elif score >= 25:
            return "CC"
        elif score >= 15:
            return "C"
        elif score >= 5:
            return "DDD"
        elif score >= 2:
            return "DD"
        else:
            return "D"
    
    def get_certification_from_certificates(self, certificates: List[Dict[str, Any]]) -> str:
        """Determine certification level from certificates list."""
        if not certificates:
            return "uncertified"
        
        # Count different certificate types
        has_penetration = any(c.get('name') == 'PENETRATION_TEST' for c in certificates)
        has_por = any(c.get('name') == 'PROOF_OF_FUNDS' for c in certificates)
        has_bug_bounty = any(c.get('name') == 'BUG_BOUNTY' for c in certificates)
        
        # Determine level based on certificates
        cert_count = sum([has_penetration, has_por, has_bug_bounty])
        
        if cert_count >= 3:
            return "high"
        elif cert_count >= 2:
            return "medium"
        elif cert_count >= 1:
            return "low"
        else:
            return "uncertified"
    
    def extract_exchange_data(self, cer_details: Dict[str, Any]) -> Dict[str, Any]:
        """Extract relevant data from CER API response."""
        data = {}
        
        # Overall security score (rating is 0-10, convert to 0-100)
        if 'rating' in cer_details:
            rating_out_of_10 = cer_details['rating']
            data['security_score'] = int(round(rating_out_of_10 * 10))
            data['security_rating'] = self.rating_to_grade(rating_out_of_10)
        
        # Certification level from certificates array
        if 'certificates' in cer_details:
            data['certification'] = self.get_certification_from_certificates(cer_details['certificates'])
        
        # Server security score (already 0-100)
        if 'serverSecurity' in cer_details:
            data['server_security_score'] = cer_details['serverSecurity']
        
        # User security score (already 0-100)
        if 'userSecurity' in cer_details:
            data['user_security_score'] = cer_details['userSecurity']
        
        # Penetration test score (already 0-100)
        if 'penetrationTests' in cer_details:
            data['penetration_test_score'] = cer_details['penetrationTests']
        
        # Bug bounty score (already 0-100)
        if 'bugBounty' in cer_details:
            data['bug_bounty_score'] = cer_details['bugBounty']
        
        # Proof of reserves (convert percentage to boolean)
        if 'proofOfReserves' in cer_details:
            data['has_proof_of_reserves'] = cer_details['proofOfReserves'] > 0
        
        # ISO and CCSS certifications
        if 'iso' in cer_details:
            data['has_iso'] = cer_details['iso']
        if 'ccss' in cer_details:
            data['has_ccss'] = cer_details['ccss']
        
        # Funds insurance
        if 'fundsInsurance' in cer_details:
            data['has_funds_insurance'] = cer_details['fundsInsurance']
        
        return data
    
    def sync_exchange(self, exchange_name: str) -> bool:
        """Sync a single exchange."""
        self.log(f"\n{'='*60}")
        self.log(f"Processing: {exchange_name}")
        self.log(f"{'='*60}")
        
        # Fetch details from CER.live
        cer_details = self.fetch_exchange_details(exchange_name)
        if not cer_details:
            self.log(f"Could not fetch data for {exchange_name}", "ERROR")
            return False
        
        # Extract relevant data
        exchange_data = self.extract_exchange_data(cer_details)
        if not exchange_data:
            self.log(f"No data extracted for {exchange_name}", "WARNING")
            return False
        
        # Update the exchange file
        self.update_exchange_file(exchange_name, exchange_data)
        
        return True
    
    def sync_all_exchanges(self):
        """Sync all exchanges from the statistics file."""
        self.log("Starting full synchronization...")
        
        # Read statistics file to get exchange list
        if not STATISTICS_FILE.exists():
            self.log(f"Statistics file not found: {STATISTICS_FILE}", "ERROR")
            return
        
        with open(STATISTICS_FILE, 'r', encoding='utf-8') as f:
            stats = json.load(f)
        
        exchanges = stats.get('exchangesList', {}).get('list', [])
        self.log(f"Found {len(exchanges)} exchanges in statistics file")
        
        # Fetch all exchange data from CER.live
        exchange_data_map = {}
        success_count = 0
        
        for exchange_item in exchanges:
            exchange_name = exchange_item.get('exchange', {}).get('name', '')
            if not exchange_name:
                continue
            
            # Fetch CER details
            cer_details = self.fetch_exchange_details(exchange_name)
            if cer_details:
                exchange_data = self.extract_exchange_data(cer_details)
                if exchange_data:
                    exchange_data_map[exchange_name] = exchange_data
                    success_count += 1
                    
                    # Also update individual exchange file
                    self.update_exchange_file(exchange_name, exchange_data)
        
        self.log(f"\nSuccessfully fetched data for {success_count}/{len(exchanges)} exchanges")
        
        # Update statistics file with all the data
        self.update_statistics_file(exchange_data_map)
        
        self.log("\n" + "="*60)
        self.log("Synchronization complete!")
        self.log("="*60)


def main():
    parser = argparse.ArgumentParser(
        description="Sync exchange data from CER.live API to local JSON files"
    )
    parser.add_argument(
        '--exchange',
        type=str,
        help='Name of a specific exchange to sync (e.g., "Binance")'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Preview changes without writing to files'
    )
    parser.add_argument(
        '--quiet',
        action='store_true',
        help='Suppress verbose output'
    )
    
    args = parser.parse_args()
    
    # Initialize syncer
    syncer = CERDataSync(
        dry_run=args.dry_run,
        verbose=not args.quiet
    )
    
    if args.dry_run:
        syncer.log("Running in DRY RUN mode - no files will be modified")
    
    # Sync single exchange or all exchanges
    if args.exchange:
        success = syncer.sync_exchange(args.exchange)
        sys.exit(0 if success else 1)
    else:
        syncer.sync_all_exchanges()
        sys.exit(0)


if __name__ == "__main__":
    main()

