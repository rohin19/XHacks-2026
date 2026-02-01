from fastapi import FastAPI

from api.routes import events

app = FastAPI(title="Events API", description="Read-only API for Supabase events.")

app.include_router(events.router, prefix="/api", tags=["events"])
