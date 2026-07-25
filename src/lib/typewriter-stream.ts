import { delay } from "@/lib/utils";

// oxlint-disable-next-line func-style -- generators cannot be expressed as arrow functions
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

    for (let i = startIndex; i < buffer.length; i += 1) {
      const char = buffer[i];
      const isWhitespace = char === " " || char === "\n" || char === "\t";

      if (isWhitespace) {
        yield buffer.slice(startIndex, i + 1);
        startIndex = i + 1;
        await delay(delayMs);
      }
    }
  }

  if (startIndex < buffer.length) {
    yield buffer.slice(startIndex);
  }
}
