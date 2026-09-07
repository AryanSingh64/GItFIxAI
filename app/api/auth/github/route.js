export const dynamic = 'force-dynamic';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export async function POST(req) {
  try {
    const { code } = await req.json();
    if (!code) {
      return new Response(JSON.stringify({ error: 'Code is required' }), { status: 400 });
    }

    // Exchange code for GitHub access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code
      })
    });

    const tokenData = await tokenRes.json();
    if (tokenData.error) {
      return new Response(JSON.stringify({ error: tokenData.error_description || tokenData.error }), { status: 400 });
    }

    const accessToken = tokenData.access_token;
    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'No access token returned from GitHub' }), { status: 400 });
    }

    // Fetch user info
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    const userData = await userRes.json();

    // Fetch user repositories
    const reposRes = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    const repos = await reposRes.json();

    return new Response(
      JSON.stringify({
        access_token: accessToken,
        user: {
          name: userData.name || userData.login || 'GitHub User',
          login: userData.login || '',
          avatar: userData.avatar_url || ''
        },
        repos: Array.isArray(repos)
          ? repos.map(r => ({
              name: r.name,
              full_name: r.full_name,
              url: r.clone_url || `https://github.com/${r.full_name}`,
              private: r.private,
              description: r.description
            }))
          : []
      }),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
