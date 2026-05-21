export async function read(rawPath: string): Promise<string> {
  const path = rawPath.trim();

  if (!path) {
    return 'Error: Empty file path';
  }

  const file = Bun.file(path);

  if (!(await file.exists())) {
    return `Error: File not found: ${path}`;
  }

  try {
    return await file.text();
  } catch (error) {
    return `Error reading file: ${error instanceof Error ? error.message : String(error)}`;
  }
}