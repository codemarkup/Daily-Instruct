const STOP_WORDS = new Set([
  "a", "an", "the", "and", "but", "if", "or", "because", "as", "what",
  "which", "this", "that", "these", "those", "then",
  "so", "than", "about", "above", "across", "after", "against",
  "along", "among", "around", "at", "before", "behind", "below",
  "beneath", "beside", "between", "beyond", "but", "by", "concerning",
  "considering", "despite", "down", "during", "except", "for", "from",
  "in", "inside", "into", "like", "near", "of", "off", "on", "onto",
  "out", "outside", "over", "past", "regarding", "round", "since",
  "through", "throughout", "till", "to", "toward", "under", "underneath",
  "until", "up", "upon", "with", "within", "without", "is", "are", "was",
  "were", "be", "been", "being", "have", "has", "had", "do", "does",
  "did", "will", "would", "shall", "should", "may", "might", "must", "can", "could"
]);

const FILLER_PHRASES = [
  "what this means", "why it matters", "the real reason",
  "suddenly", "quietly", "reveals", "everything you need to know",
  "heres why", "here is why", "you wont believe", "breaking",
  "exclusive", "watch", "must read"
];

/**
 * Deterministically generates an SEO-friendly slug from a title.
 * Enforces 3-5 words, max 70 chars, strips stop words and years.
 */
export function deterministicGenerateSlug(title: string, keepYear: boolean = false): string {
  if (!title) return "";

  // 1. Lowercase
  let text = title.toLowerCase();

  // 2. Remove filler phrases
  for (const phrase of FILLER_PHRASES) {
    text = text.replace(new RegExp(`\\b${phrase}\\b`, 'g'), "");
  }

  // 3. Remove punctuation except spaces and hyphens
  text = text.replace(/[^\w\s-]/g, "");

  // 4. Split into words
  let words = text.split(/\s+/).filter(w => w.length > 0);

  // 5. Remove stop words and years
  const filteredWords = [];
  for (const word of words) {
    // Check if year
    if (!keepYear && /^(19|20)\d{2}$/.test(word)) {
      continue;
    }
    
    // Check stop word
    if (STOP_WORDS.has(word)) {
      continue;
    }

    filteredWords.push(word);
  }

  // Fallback: If stripping stop words removed too much (e.g. title was very short), use original words
  let targetWords = filteredWords.length >= 3 ? filteredWords : words;

  // 6. Enforce 3-5 words
  targetWords = targetWords.slice(0, 5);

  // 7. Join with hyphens
  let slug = targetWords.join("-");

  // 8. Enforce 70 char limit (truncating at whole words if possible)
  if (slug.length > 70) {
    const chars = slug.substring(0, 70);
    const lastHyphen = chars.lastIndexOf('-');
    if (lastHyphen > 0) {
      slug = chars.substring(0, lastHyphen);
    } else {
      slug = chars; // If a single word is > 70 chars, just truncate it.
    }
  }

  return slug;
}
