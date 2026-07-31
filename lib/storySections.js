export function splitStoryIntoChunks(story, maxChunks = 3) {
  if (!story) return [];

  const sentences = story
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length === 0) return [];

  const numChunks = Math.min(maxChunks, sentences.length);
  const perChunk = Math.ceil(sentences.length / numChunks);
  const chunks = [];

  for (let i = 0; i < sentences.length; i += perChunk) {
    chunks.push(sentences.slice(i, i + perChunk).join(" "));
  }

  return chunks;
}
