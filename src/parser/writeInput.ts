import type { WriteParseResult } from '../types.ts';

export function parseWriteInput(input: string): WriteParseResult {
  try {
    const parsed = JSON.parse(input);
    const path = parsed.path;
    const content = parsed.content ?? '';
    const mode = parsed.mode === 'append' ? 'append' : 'overwrite';

    if (!path || typeof path !== 'string') {
      return { error: 'Invalid input: path is required' };
    }

    return { path, content, mode };
  } catch {
    return { error: `Invalid JSON format: ${input.slice(0, 100)}` };
  }
}