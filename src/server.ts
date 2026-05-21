import { runAgent } from './loop.ts';

const PORT = 3000;

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    // POST /chat - 聊天接口
    if (req.method === 'POST' && url.pathname === '/chat') {
      try {
        const { message } = await req.json();
        const result = await runAgent(message);
        return Response.json(result);
      } catch (error) {
        return Response.json(
          { error: error instanceof Error ? error.message : String(error) },
          { status: 500 }
        );
      }
    }

    // 静态文件
    if (url.pathname === '/' || !url.pathname.includes('.')) {
      const file = Bun.file('public/index.html');
      if (await file.exists()) {
        return new Response(file, {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }
      return new Response('Not Found', { status: 404 });
    }

    const file = Bun.file(`public${url.pathname}`);
    if (await file.exists()) {
      return new Response(file);
    }

    return new Response('Not Found', { status: 404 });
  },
});

console.log(`🚀 Agent server running on http://localhost:${PORT}`);