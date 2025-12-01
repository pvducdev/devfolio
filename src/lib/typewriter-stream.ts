import { delay } from "@/lib/utils.ts";

export async function* typewriterStream(
  chunks: AsyncIterable<string | undefined>,
  delayMs = 30
): AsyncGenerator<string> {
  let buffer = "";
  let pos = 0;

  for await (const chunk of chunks) {
    if (!chunk) {
      continue;
    }

    buffer += chunk;

    while (pos < buffer.length) {
      const char = buffer[pos];
      const isWhitespace = char === " " || char === "\n" || char === "\t";

      if (isWhitespace) {
        yield buffer.slice(0, pos + 1);
        buffer = buffer.slice(pos + 1);
        pos = 0;
        await delay(delayMs);
      } else {
        pos++;
      }
    }
  }

  if (buffer) {
    yield buffer;
  }
}
