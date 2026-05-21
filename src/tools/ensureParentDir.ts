import { mkdir } from 'bun';

export function ensureParentDir(path: string) {
  const normalized = path.replace(/\\/g, '/');
  const parts = normalized.split('/');

  if (parts.length <= 1) return;

  parts.pop();
  const parentPath = parts.join('/');

  mkdir(parentPath, { recursive: true });
}