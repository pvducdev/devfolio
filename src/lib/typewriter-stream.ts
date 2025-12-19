import { delay } from "@/lib/utils.ts";

export async function* typewriterStream(
  chunks: AsyncIterable<string | undefined>,
  delayMs = 30
): AsyncGenerator<string> {
  let buffer = "";
  let startIndex = 0;

  for await (const chunk of chunks) {
    if (!chunk) {
      continue;
    }

    buffer += chunk;

    for (let i = startIndex; i < buffer.length; i++) {
      const char = buffer[i];
      const isWhitespace = char === " " || char === "\n" || char === "\t";

      if (isWhitespace) {
        yield buffer.substring(startIndex, i + 1);
        startIndex = i + 1;
        await delay(delayMs);
      }
    }
  }

  if (startIndex < buffer.length) {
    yield buffer.substring(startIndex);
  }
}
