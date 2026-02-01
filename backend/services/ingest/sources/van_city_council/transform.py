"""
Transform City Council voting records into event payloads for Supabase events table.
Output: dicts with type, dates, and summary composed from vote metadata.
"""

import logging
from datetime import datetime, timezone
from typing import Any

logger = logging.getLogger(__name__)

# Internal schema constants for City Council
SOURCE_CITY_COUNCIL = "city_council"
EVENT_TYPE_COUNCIL_VOTE = "COUNCIL_VOTE"


def _parse_datetime(value: str | None) -> datetime | None:
	"""Parse ISO-8601 timestamp to timezone-aware datetime."""
	if value is None or (isinstance(value, str) and not value.strip()):
		return None
	try:
		text = str(value).strip()
		return datetime.fromisoformat(text.replace("Z", "+00:00"))
	except (ValueError, TypeError) as e:
		logger.warning("Malformed datetime skipped: %r -> %s", value, e)
		return None


def _parse_date(value: str | None) -> datetime | None:
	"""Parse a date string to timezone-aware datetime at midnight UTC."""
	if value is None or (isinstance(value, str) and not value.strip()):
		return None
	try:
		text = str(value).strip()
		return datetime.fromisoformat(text + "T00:00:00+00:00")
	except (ValueError, TypeError) as e:
		logger.warning("Malformed date skipped: %r -> %s", value, e)
		return None


def _build_summary(record: dict[str, Any]) -> str:
	"""Assemble a short summary from known fields."""
	parts: list[str] = []
	meeting_type = record.get("meeting_type")
	agenda = record.get("agenda_description")
	council_member = record.get("council_member")
	vote = record.get("vote")
	decision = record.get("decision")
	vote_number = record.get("vote_number")
	vote_date = record.get("vote_date")

	if vote_date:
		parts.append(f"Council Meeting: {vote_date}")
	if agenda:
		parts.append(f"Topic: {agenda}")
	if vote:
		parts.append(f"Vote: {vote}")
	if vote_number:
		parts.append(f"Vote #: {vote_number}")

	return "; ".join(parts) if parts else "Council vote update"


def transform_record(raw: dict[str, Any]) -> dict[str, Any] | None:
	"""
	Convert a single City Council voting record into an event payload dict for Supabase events.

	Output keys: id, neighborhood_id, title, type, summary, source, location (None),
	start_date, end_date, published_at, updated_at, created_at, neighborhood_name.
	"""
	if not isinstance(raw, dict):
		return None

	end_date = _parse_datetime(raw.get("vote_start_date_time"))
	if end_date is None:
		logger.warning("Skipping record: missing or invalid vote_start_date_time")
		return None

	updated_at = _parse_date(raw.get("vote_date"))
	if updated_at is None:
		logger.warning("Skipping record: missing or invalid vote_date")
		return None

	vote_detail_id = raw.get("vote_detail_id")
	meeting_type = raw.get("meeting_type") or "Council Vote"
	agenda = raw.get("agenda_description") or "No agenda"
	if vote_detail_id:
		title = f"{meeting_type}: {agenda} ({vote_detail_id})"
	else:
		title = f"{meeting_type}: {agenda}"
	summary = _build_summary(raw)

	published_at = datetime.now(timezone.utc)

	return {
		"id": None,
		"neighborhood_id": None,
		"title": title,
		"type": EVENT_TYPE_COUNCIL_VOTE,
		"summary": summary,
		"source": SOURCE_CITY_COUNCIL,
		"location": None,
		"start_date": None,
		"end_date": end_date,
		"published_at": published_at,
		"updated_at": updated_at,
		# "created_at": created_at,
		"neighborhood_name": None,
	}


def transform_batch(raw_records: list[dict[str, Any]]) -> list[dict[str, Any]]:
	"""
	Convert a list of City Council records into event payload dicts.
	Logs transformation failures without crashing the batch; returns only successful events.
	"""
	events: list[dict[str, Any]] = []
	seen_meetings: set[str] = set()
	for i, raw in enumerate(raw_records):
		try:
			if isinstance(raw, dict):
				meeting_key = "|".join(
					str(raw.get(k) or "")
					for k in (
						"meeting_type",
						"vote_date",
						"vote_number",
						"agenda_description",
						"vote_start_date_time",
					)
				)
				if meeting_key in seen_meetings:
					continue
				seen_meetings.add(meeting_key)
			ev = transform_record(raw)
			if ev is not None:
				events.append(ev)
		except Exception as e:
			logger.warning("Transform failed for record index %s: %s", i, e, exc_info=False)
	return events
