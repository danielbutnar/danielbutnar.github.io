import { createReadableStreamFromReadable } from "@react-router/node";
import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { ServerRouter, type EntryContext } from "react-router";

// This site only renders at build time (prerendering for GitHub Pages), so every
// page waits for all content, including the lazily loaded case study text. The
// HTML then holds the finished page instead of placeholders that scripts fill in.
// progressiveChunkSize: React moves large Suspense content out of line so a live
// server can flush early; with nothing to stream, that only adds scripts.

export const streamTimeout = 10_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  return new Promise<Response>((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={routerContext} url={request.url} />,
      {
        progressiveChunkSize: Number.POSITIVE_INFINITY,
        onAllReady() {
          const body = new PassThrough();
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(createReadableStreamFromReadable(body), {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );
        },
        onShellError: reject,
        onError(error) {
          responseStatusCode = 500;
          console.error(error);
        },
      },
    );
    setTimeout(abort, streamTimeout);
  });
}
