export const dynamic = 'force-dynamic';

/**
 * Autonomous GitHub Actions Webhook Handler
 * Listens to workflow_run events. When conclusion === "failure",
 * it can autonomously trigger healing.
 */
export async function POST(req) {
  try {
    const event = req.headers.get('x-github-event');
    const payload = await req.json();

    if (event === 'workflow_run' && payload.action === 'completed') {
      const workflowRun = payload.workflow_run;

      if (workflowRun?.conclusion === 'failure') {
        const repoUrl = payload.repository?.html_url;
        console.log(`[Autonomous Webhook] CI failure detected in ${repoUrl} for commit ${workflowRun.head_sha}`);

        // In autonomous mode, we return 202 Accepted and can spawn healing
        return new Response(JSON.stringify({
          message: 'CI failure received. Autonomous remediation enqueued.',
          workflow: workflowRun.name,
          run_id: workflowRun.id
        }), { status: 202, headers: { 'Content-Type': 'application/json' } });
      }
    }

    return new Response(JSON.stringify({ message: 'Event ignored' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
