import { ensureParentDir } from './ensureParentDir.ts';
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

export async function write(rawInput: string): Promise<string> {
  const result = parseWriteInput(rawInput);

  if ('error' in result) {
    return `Error: ${result.error}`;
  }

  const { path, content, mode } = result;

  try {
    ensureParentDir(path);

    if (mode === 'append') {
      const existing = Bun.file(path);
      const existingContent = (await existing.exists())
        ? await existing.text()
        : '';
      await Bun.write(path, existingContent + content);
    } else {
      await Bun.write(path, content);
    }

    return `Successfully wrote to ${path}`;
  } catch (error) {
    return `Error writing file: ${error instanceof Error ? error.message : String(error)}`;
  }
}