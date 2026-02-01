"""
Fetch Road Ahead dataset metadata from the City of Vancouver Open Data API.
Provides dataset info and available endpoints (records, files, attachments, catalog).
"""

import sys
from pathlib import Path

# Ensure backend is on path when running from any working directory
_BACKEND_ROOT = Path(__file__).resolve().parent.parent.parent.parent.parent
if str(_BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(_BACKEND_ROOT))

import requests

# --- Configuration ---
API_BASE = "https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets"
DEFAULT_DATASET_ID = "road-ahead-current-road-closures"


def fetch_dataset_info(
    dataset_id: str = DEFAULT_DATASET_ID,
    *,
    select: str | None = None,
    lang: str | None = None,
    timezone: str | None = None,
    include_links: bool | None = None,
    include_app_metas: bool | None = None,
    timeout: int = 30,
) -> dict:
    """
    GET dataset metadata from the Vancouver Open Data API.

    Args:
        dataset_id: Dataset identifier (e.g., road-ahead-current-road-closures).
        select: Optional select expression to limit fields.
        lang: Optional language override (default API language is "fr").
        timezone: Optional timezone for datetime fields.
        include_links: If True, include HATEOAS links in response.
        include_app_metas: If True, include application metadata in response.
        timeout: Request timeout in seconds.

    Returns:
        Parsed JSON dict containing dataset metadata and endpoints.
    """
    url = f"{API_BASE}/{dataset_id}"
    params: dict[str, str | bool] = {}
    if select:
        params["select"] = select
    if lang:
        params["lang"] = lang
    if timezone:
        params["timezone"] = timezone
    if include_links is not None:
        params["include_links"] = include_links
    if include_app_metas is not None:
        params["include_app_metas"] = include_app_metas

    try:
        response = requests.get(url, params=params, timeout=timeout)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        raise RuntimeError(f"Failed to fetch dataset info for {dataset_id}: {e}") from e


def extract_endpoint_links(dataset_info: dict) -> dict[str, str]:
    """
    Extract endpoint links (records, files, attachments, catalog) if present.
    Requires include_links=True when fetching to reliably populate links.
    """
    links = dataset_info.get("links")
    if not isinstance(links, list):
        return {}

    result: dict[str, str] = {}
    for item in links:
        if not isinstance(item, dict):
            continue
        rel = item.get("rel") or item.get("name")
        href = item.get("href") or item.get("url")
        if isinstance(rel, str) and isinstance(href, str):
            result[rel] = href
    return result


def test_fetch() -> None:
    """
    Basic manual test: fetch dataset info and print the raw response.
    Safe to comment out/remove after verifying the fetch behavior.
    """
    data = fetch_dataset_info(include_links=True)
    print("Raw response:")
    print(data)


if __name__ == "__main__":
    try:
        data = fetch_dataset_info(include_links=True)
        dataset_id = data.get("dataset_id", DEFAULT_DATASET_ID)
        records_count = data.get("metas", {}).get("default", {}).get("records_count")
        links = extract_endpoint_links(data)

        print(f"Dataset: {dataset_id}")
        test_fetch()
        if records_count is not None:
            print(f"Records count: {records_count}")
        if links:
            print("Endpoints:")
            for rel, href in links.items():
                print(f"  - {rel}: {href}")
    except RuntimeError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
