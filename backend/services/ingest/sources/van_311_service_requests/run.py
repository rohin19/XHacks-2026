"""
Run the 311 ETL pipeline: fetch -> transform -> load.
Configure via VAN_311_API_BASE and DATABASE_URL environment variables.
"""

import logging
import sys

from fetch import fetch_raw_requests
from transform import transform_batch
from load import upsert_events

logging.basicConfig(level=logging.INFO, format="%(levelname)s:%(name)s:%(message)s")
logger = logging.getLogger(__name__)


def run(limit: int = 100, offset: int = 0) -> None:
    raw = fetch_raw_requests(limit=limit, offset=offset)
    logger.info("Fetched %s raw record(s)", len(raw))
    events = transform_batch(raw)
    logger.info("Transformed %s event(s)", len(events))
    inserted, updated = upsert_events(events)
    logger.info("Done: %s inserted, %s updated", inserted, updated)


if __name__ == "__main__":
    try:
        run(limit=100, offset=0)
    except Exception as e:
        logger.exception("Pipeline failed: %s", e)
        sys.exit(1)
