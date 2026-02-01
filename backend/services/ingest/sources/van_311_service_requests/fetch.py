"""
Extract 3-1-1 Service Request records from the City of Vancouver Open Data API.
Returns raw JSON records for transformation without data loss.
"""

import logging
import os
from typing import Any

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

logger = logging.getLogger(__name__)

# --- Configuration (env with fallback for local dev) ---
DEFAULT_API_BASE = "https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/3-1-1-service-requests/records"


def _get_session_with_retries(
    retries: int = 3,
    backoff_factor: float = 0.5,
    status_forcelist: tuple[int, ...] = (429, 500, 502, 503, 504),
) -> requests.Session:
    """Build a requests session with retry logic for transient failures."""
    session = requests.Session()
    retry = Retry(
        total=retries,
        backoff_factor=backoff_factor,
        status_forcelist=status_forcelist,
        allowed_methods=["GET"],
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    return session


# ODS API order: newest first (service_request_open_timestamp descending)
ORDER_RECENT_FIRST = "service_request_open_timestamp desc"


def fetch_raw_requests(
    limit: int = 100,
    offset: int = 0,
    *,
    order_by: str | None = ORDER_RECENT_FIRST,
    api_base: str | None = None,
    timeout: int = 60,
) -> list[dict[str, Any]]:
    """
    Fetch raw 311 service request records from the Open Data API.

    Uses environment variable VAN_311_API_BASE for the endpoint if set.
    By default requests recent events first (order_by=service_request_open_timestamp desc).
    Applies network retries and validates response status before returning
    the list of record dictionaries (prevents data loss before transformation).

    Args:
        limit: Max number of records to return (default 100).
        offset: Pagination offset (default 0).
        order_by: ODS order_by clause (default: recent first). Set to None to use API default.
        api_base: Override API base URL (default: env VAN_311_API_BASE or DEFAULT_API_BASE).
        timeout: Request timeout in seconds.

    Returns:
        List of raw record dictionaries from the API 'results' array.

    Raises:
        requests.RequestException: On non-retryable or exhausted retries.
        ValueError: On invalid API response (e.g. missing 'results').
    """
    base = api_base or os.environ.get("VAN_311_API_BASE", DEFAULT_API_BASE)
    params: dict[str, str | int] = {"limit": limit, "offset": offset}
    if order_by:
        params["order_by"] = order_by

    session = _get_session_with_retries()
    try:
        response = session.get(base, params=params, timeout=timeout)
        response.raise_for_status()
    finally:
        session.close()

    data = response.json()
    if not isinstance(data, dict):
        raise ValueError("API response is not a JSON object")

    results = data.get("results")
    if not isinstance(results, list):
        raise ValueError("API response missing or invalid 'results' array")

    return results
