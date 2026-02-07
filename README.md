# Neighborhood News

We've always felt a little disconnected from our local community—not socially, but in a **data sense**. It's easy to pull up the news and keep tabs on what's happening across the world, but when it comes to your own neighborhood—construction updates, community complaints, city projects—it all feels scattered and hard to follow.

That's why we built **Neighborhood News**!

https://neighborhood-news2.vercel.app/

## What is it?

Neighborhood News is a **spatial intelligence platform** that maps city events (road closures, construction, community alerts) onto an interactive neighborhood grid.  

All you have to do is click on your neighborhood or type in your address, and instantly, you'll see every city project, event, and road closure affecting your street.

## Data Pipeline: Automated Ingestion

The Neighborhood News data ecosystem is powered by a robust ETL (Extract, Transform, Load) pipeline that synchronizes with city open data daily, keeping the map up-to-date with the latest community events.

### ETL Workflow

Our pipeline follows a modular three-stage process:

- **Extract:** Connects to Vancouver’s Open Data APIs to retrieve raw records of recent and upcoming events.  
- **Transform:** Cleans and normalizes the data, mapping heterogeneous points into a unified schema.  
- **Load:** Pushes transformed data to the database using an Idempotent Upsert strategy, updating existing records without creating duplicates.

### Automated Scheduling

The entire ETL pipeline is fully automated using **GitHub Actions**:

- **Daily Cron Jobs:** A scheduled workflow triggers the pipeline every 24 hours.  
- **Monitoring & Logging:** Detailed execution logs capture API status and transformation counts, allowing easy health checks directly from the repository.

## Database

Neighborhood News uses a **Supabase (PostgreSQL + PostGIS)** database as its core data layer. Instead of handling everything in application code, we rely on the database to manage location logic, data consistency, and performance — which keeps the system reliable and fast as the dataset grows.

### Automatic Location Matching

When new events are added, the database automatically determines which neighborhood they belong to based on their coordinates.

- Events are checked against neighborhood boundary shapes
- The correct neighborhood is assigned automatically

This ensures every event is correctly tied to a geographic area.

### Safe Daily Data Updates

The system is designed to import new data every day without creating duplicates.

- Incoming records are compared against existing ones
- Matching events are updated instead of re-inserted
- Works even when some fields are missing

This allows automated scripts to refresh data safely and repeatedly.

### Fast Map & Filter Performance

The database is optimized for map-based browsing and time filtering.

- Location data is indexed for fast geographic queries
- Date fields are indexed for quick time-based searches
- Map views and filters stay responsive even with large datasets

---

## Backend API

The Neighborhood News backend is a **FastAPI** service hosted on Railway, providing access to city events and neighborhoods.

### Endpoints

#### `GET /api/events`

Returns a list of events filtered by date range, type, or neighborhood. Events are ordered by `published_at` descending.

**Query Parameters:**

| Parameter        | Type       | Description |
|-----------------|-----------|-------------|
| `start_date`     | `date`    | Start of date range (inclusive). Required. |
| `end_date`       | `date`    | End of date range (inclusive). Required. |
| `event_type`     | `string`  | Optional. Filter by event type: `ROAD_CLOSURE`, `SERVICE_REQUEST`, `CITY_PROJECT`, `COUNCIL_VOTE`, `PERMIT`, `VOTE`. |
| `neighborhood_id`| `UUID`    | Optional. Return only events in the given neighborhood. |

**Response Example:**

```json
[
  {
    "id": "uuid",
    "neighborhood_id": "uuid",
    "title": "Street closure on Main St",
    "type": "ROAD_CLOSURE",
    "summary": "Main St closed for construction",
    "source": "City Open Data",
    "location": {"type": "Point", "coordinates": [-123.123, 49.123]},
    "start_date": "2026-02-01T00:00:00Z",
    "end_date": "2026-02-01T23:59:59Z",
    "published_at": "2026-02-01T12:00:00Z"
  }
]
```

### `GET /api/neighbourhoods`

Returns a list of all neighborhoods with their `id` and `name`.

**Response Example:**

```json
[
  {
    "id": "uuid",
    "name": "Downtown"
  },
  {
    "id": "uuid",
    "name": "Kitsilano"
  }
]

