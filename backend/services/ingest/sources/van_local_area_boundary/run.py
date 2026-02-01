"""
Run the map-builder seed: fetch Vancouver local-area-boundary and load into Supabase.
Uses sb_url and sb_secret from .env. Run once per city when adding a new city to the platform.
"""

import sys

from .load import run_seed

if __name__ == "__main__":
    try:
        run_seed(limit=25, offset=0)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
