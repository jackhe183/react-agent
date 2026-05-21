import { bash } from './bash.ts';
import { read } from './read.ts';
import { write } from './write.ts';
import { fetchUrl } from './fetch.ts';
import { getTime } from './getTime.ts';

export { bash, read, write, fetchUrl, getTime };

// 使用小写 key 以支持大小写不敏感的工具名匹配
export const TOOLKIT = {
  gettime: getTime,
  bash: bash,
  read: read,
  write: write,
  fetch: fetchUrl,
} as const;