import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  if (req.headers.get("upgrade") !== "websocket") {
    return new Response("Expected a websocket request", { status: 400 });
  }

  type DurableWebSocket = WebSocket & { accept: () => void; OPEN: number };

  const { WebSocketPair } = globalThis as unknown as {
    WebSocketPair: new () => { 0: WebSocket; 1: WebSocket };
  };
  const pair = new WebSocketPair();
  const client = pair[0];
  const server = pair[1] as DurableWebSocket;
  const heartbeatInterval = 1000 * 30;

  server.accept();

  const keepAlive = () => {
    if (server.readyState === server.OPEN) {
      server.send(JSON.stringify({ type: "heartbeat", timestamp: Date.now() }));
    }
  };

  const interval = setInterval(keepAlive, heartbeatInterval);

  server.addEventListener("message", (event) => {
    try {
      const data = JSON.parse(event.data as string);
      if (data.type === "orderflow") {
        server.send(
          JSON.stringify({
            type: "ack",
            receivedAt: Date.now(),
            correlationId: data.correlationId,
          }),
        );
      }
    } catch (error) {
      console.error("Websocket error", error);
    }
  });

  server.addEventListener("close", () => {
    clearInterval(interval);
  });

  return new Response(null, {
    status: 101,
    webSocket: client,
  } as ResponseInit & { webSocket: WebSocket });
}
