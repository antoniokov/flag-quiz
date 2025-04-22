import { Country } from '../types';

export const normalize = (str: string): string => str.toLowerCase().trim().replace(/["']/g, '');

// Calculate string similarity using Levenshtein distance
export const calculateSimilarity = (str1: string, str2: string): number => {
  const a = normalize(str1);
  const b = normalize(str2);

  // Perfect match
  if (a === b) return 1;

  // Simple check for one being a substring of the other
  if (a.includes(b) || b.includes(a)) {
    const ratio = Math.min(a.length, b.length) / Math.max(a.length, b.length);
    // Return a high score if one is a near-complete substring of the other
    return ratio > 0.7 ? 0.9 : 0.7 * ratio;
  }

  // Levenshtein distance calculation
  const matrix: number[][] = [];

  // Initialize matrix
  for (let i = 0; i <= a.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost, // substitution
      );
    }
  }

  // Calculate similarity score between 0 and 1
  const distance = matrix[a.length][b.length];
  const maxLength = Math.max(a.length, b.length);
  return 1 - distance / maxLength;
};

export interface BestMatch {
  code: string;
  score: number;
  matchedAlias: string | null;
}

export const findBestMatch = (transcript: string, options: Country[], similarityThreshold = 0.6): BestMatch | null => {
  const cleanTranscript = normalize(transcript);
  let bestMatch: BestMatch = { code: '', score: 0, matchedAlias: null };

  for (const option of options) {
    // First check against the country name
    let similarity = calculateSimilarity(cleanTranscript, option.name);
    let matchedAlias: string | null = null;

    // Then check against each alias if they exist
    if (option.aliases && option.aliases.length > 0) {
      for (const alias of option.aliases) {
        const aliasSimilarity = calculateSimilarity(cleanTranscript, alias);
        if (aliasSimilarity > similarity) {
          similarity = aliasSimilarity;
          matchedAlias = alias;
        }
      }
    }

    if (similarity > bestMatch.score) {
      bestMatch = { code: option.code, score: similarity, matchedAlias };
    }
  }

  return bestMatch.score >= similarityThreshold ? bestMatch : null;
}; 