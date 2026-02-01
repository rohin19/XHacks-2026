"""
Run the 311 ETL pipeline: fetch -> transform -> load (shared loader).
Configure via VAN_311_API_BASE; load uses Supabase (sb_url/sb_secret or SUPABASE_*).
"""

import logging
import sys
from pathlib import Path

# Add backend root so we can import services.ingest.load_events
_BACKEND_ROOT = Path(__file__).resolve().parent.parent.parent.parent.parent
if str(_BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(_BACKEND_ROOT))

from fetch import fetch_raw_requests
from transform import transform_batch
from services.ingest.load_events import load_events

logging.basicConfig(level=logging.INFO, format="%(levelname)s:%(name)s:%(message)s")
logger = logging.getLogger(__name__)


def run(limit: int = 100, offset: int = 0) -> None:
    raw = fetch_raw_requests(limit=limit, offset=offset)
    logger.info("Fetched %s raw record(s)", len(raw))
    events = transform_batch(raw)
    logger.info("Transformed %s event(s)", len(events))
    inserted = load_events(events, resolve_neighborhood_by_name=True)
    logger.info("Done: %s inserted", inserted)


if __name__ == "__main__":
    try:
        # Recent events first (order_by=service_request_open_timestamp desc in fetch)
        run(limit=100, offset=0)
    except Exception as e:
        logger.exception("Pipeline failed: %s", e)
        sys.exit(1)
