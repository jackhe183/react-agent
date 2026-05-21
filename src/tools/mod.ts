import { bash } from './bash.ts';
import { read } from './read.ts';
import { write } from './write.ts';
import { fetchUrl } from './fetch.ts';
import { getTime } from './getTime.ts';
import type { ToolName } from '../types.ts';

export { bash, read, write, fetchUrl, getTime };

export const TOOLKIT: Record<ToolName, (input: string) => Promise<string>> = {
  getTime,
  bash,
  read,
  write,
  fetch: fetchUrl,
};