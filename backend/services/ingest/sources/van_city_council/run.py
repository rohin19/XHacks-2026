"""
Run the City Council voting ETL pipeline: fetch -> transform -> load (shared loader).
Uses Supabase (sb_url/sb_secret or SUPABASE_*).
"""

import logging
import sys
from pathlib import Path

# Add backend root so we can import services.ingest.load_events
_BACKEND_ROOT = Path(__file__).resolve().parent.parent.parent.parent.parent
if str(_BACKEND_ROOT) not in sys.path:
	sys.path.insert(0, str(_BACKEND_ROOT))

from fetch import fetch_raw_records
from transform import transform_batch
from services.ingest.load_events import load_events

logging.basicConfig(level=logging.INFO, format="%(levelname)s:%(name)s:%(message)s")
logger = logging.getLogger(__name__)


def _print_summaries(events: list[dict]) -> None:
	"""Print a compact summary of transformed events for quick verification."""
	for ev in events:
		title = ev.get("title")
		summary = ev.get("summary")
		published_at = ev.get("published_at")
		start_date = ev.get("start_date")
		end_date = ev.get("end_date")
		updated_at = ev.get("updated_at")
		created_at = ev.get("created_at")
		location = ev.get("location")
		neighborhood_id = ev.get("neighborhood_id")
		neighborhood_name = ev.get("neighborhood_name")
		id_attr = ev.get("id")
		type_attr = ev.get("type")
		source = ev.get("source")
		print(
			f"TITLE: {title} \nTYPE: {type_attr} \nSOURCE: {source} "
			f"\nPUBLISHED-AT: {published_at} \nSTARTS-AT: {start_date} \nENDS-AT: {end_date} "
			f"\nUPDATED-AT: {updated_at} \nCREATED-AT: {created_at} "
			f"\nLOCATION: {location} \nSUMMARY: {summary} \n"   
		)


def run(limit: int = 100, offset: int = 0, *, dry_run: bool = False) -> None:
	raw = fetch_raw_records(limit=limit, offset=offset)
	logger.info("Fetched %s raw record(s)", len(raw))
	events = transform_batch(raw)
	logger.info("Transformed %s event(s)", len(events))
	if dry_run:
		logger.info("Dry run enabled: printing summaries only (no Supabase writes)")
		_print_summaries(events)
		return
	inserted = load_events(events, resolve_neighborhood_by_name=True)
	logger.info("Done: %s inserted", inserted)


if __name__ == "__main__":
	try:
		# set dry_run=True to avoid writing to Supabase to test the pipeline
		run(limit=100, offset=0, dry_run=False)
	except Exception as e:
		logger.exception("Pipeline failed: %s", e)
		sys.exit(1)
