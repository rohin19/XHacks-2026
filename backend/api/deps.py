"""
Supabase client and env loading for the API.
Reuses the same env vars as services.ingest.load_events.
"""

import os
from pathlib import Path

_REPO_ROOT = Path(__file__).resolve().parent.parent.parent


def _load_dotenv() -> None:
    try:
        from dotenv import load_dotenv
        load_dotenv(_REPO_ROOT / ".env")
    except ImportError:
        pass


_load_dotenv()


def get_supabase():
    """
    Build Supabase client from sb_url/sb_secret or SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY.
    Read-only usage from API is fine with service_role.
    """
    from supabase import create_client
    url = os.environ.get("sb_url") or os.environ.get("SUPABASE_URL")
    key = os.environ.get("sb_secret") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        raise RuntimeError(
            "Missing sb_url or sb_secret (or SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY) in environment. "
            "Use the service_role key (Settings → API in Supabase), not the anon key."
        )
    return create_client(url, key)
