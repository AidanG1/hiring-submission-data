// Create worker
export default {
    async fetch(request: Request, env: Env) {
        return await handleRequest(request, env).catch(
            (err) => new Response(err.stack, { status: 500 })
        )
    }
}

interface Env {
    // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
    kv: KVNamespace;
}

/**
 * Many more examples available at:
 *   https://developers.cloudflare.com/workers/examples
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function handleRequest(request: Request, env: Env) {
    const { pathname } = new URL(request.url);
    let body: string;

    if (pathname.startsWith("/traffic-change")) {
        const meta = await env.kv.get("meta", "json");
        const http = await env.kv.get("http", "json");
        const total = await env.kv.get("total", "json");

        body = JSON.stringify({
            meta,
            data: {
                http,
                total,
            }
        })
    } else if (pathname.startsWith("/popular-domains")) {
        const domains = await env.kv.get("domains", "json");

        body = JSON.stringify({
            rankingEntries: domains,
        })
    } else {
        const meta = await env.kv.get("layer3-meta", "json");
        const total = await env.kv.get("layer3-total", "json");

        body = JSON.stringify({
            meta,
            data: total,
        })
    }

    return new Response(
        body, {
        headers: {
            'Access-Control-Allow-Origin': '*', 
            'content-type': 'application/json;charset=UTF-8',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
        }
    }
    )
}