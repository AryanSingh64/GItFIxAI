"""
Supabase database client for storing analysis runs and fixes.
Uses the Supabase Python SDK with the service role key for server-side operations.
"""
import os
from datetime import datetime, timezone


def get_supabase_client():
    """Get Supabase client. Returns None if not configured."""
    try:
        from supabase import create_client
    except ImportError:
        print("⚠️  supabase-py not installed. DB features disabled.")
        return None

    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    if not url or not key or url == "your-supabase-project-url":
        return None

    return create_client(url, key)


async def save_analysis_run(run_data: dict):
    """Save an analysis run record to the 'analysis_runs' table."""
    client = get_supabase_client()
    if not client:
        return None

    try:
        record = {
            "repo_url": run_data.get("repo_url", ""),
            "team_name": run_data.get("team_name", ""),
            "leader_name": run_data.get("leader_name", ""),
            "branch_name": run_data.get("branch_name", ""),
            "status": run_data.get("status", "UNKNOWN"),
            "total_failures": run_data.get("total_failures", 0),
            "fixes_applied": run_data.get("fixes_applied", 0),
            "remaining_issues": run_data.get("remaining_issues", 0),
            "duration": run_data.get("duration", ""),
            "score": run_data.get("score", 0),
            "pr_url": run_data.get("pr_url"),
            "created_at": datetime.now(timezone.utc).isoformat(),
        }

        result = client.table("analysis_runs").insert(record).execute()
        if result.data and len(result.data) > 0:
            return result.data[0].get("id")
        return None
    except Exception as e:
        print(f"⚠️  Failed to save analysis run to DB: {e}")
        return None


async def save_file_fixes(run_id, fixes: list):
    """Save individual file fix records for an analysis run."""
    client = get_supabase_client()
    if not client or not run_id or not fixes:
        return

    try:
        records = []
        for fix in fixes:
            records.append({
                "run_id": run_id,
                "file_path": fix.get("file", ""),
                "fix_type": fix.get("type", ""),
                "line_number": fix.get("line", 0),
                "commit_message": fix.get("commit", ""),
                "status": fix.get("status", "FIXED"),
                "method": fix.get("method", "heuristic"),
                "agent": fix.get("agent", "Fixer"),
                "created_at": datetime.now(timezone.utc).isoformat(),
            })

        if records:
            client.table("file_fixes").insert(records).execute()
    except Exception as e:
        print(f"⚠️  Failed to save file fixes to DB: {e}")


async def get_user_runs(user_email: str = None, limit: int = 20):
    """Get recent analysis runs, optionally filtered by user email."""
    client = get_supabase_client()
    if not client:
        return []

    try:
        query = client.table("analysis_runs").select("*").order(
            "created_at", desc=True
        ).limit(limit)

        result = query.execute()
        return result.data if result.data else []
    except Exception as e:
        print(f"⚠️  Failed to fetch runs from DB: {e}")
        return []
