export async function bash(rawCmd: string): Promise<string> {
  const cmd = rawCmd.trim();
  if (!cmd) {
    return 'Error: Empty command';
  }

  let proc: ReturnType<typeof Bun.spawn>;
  const isWindows = process.platform === 'win32';

  try {
    // 尝试解析 JSON 数组格式
    const parsed = JSON.parse(cmd);
    if (Array.isArray(parsed)) {
      proc = Bun.spawn(parsed, { stdout: 'pipe', stderr: 'pipe' });
    } else {
      throw new Error('Not an array');
    }
  } catch {
    // 不是 JSON 数组：使用 shell 执行
    if (isWindows) {
      proc = Bun.spawn(['cmd', '/c', cmd], { stdout: 'pipe', stderr: 'pipe' });
    } else {
      proc = Bun.spawn(['sh', '-c', cmd], { stdout: 'pipe', stderr: 'pipe' });
    }
  }

  const [stdout, stderr] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
  ]);

  const exitCode = await proc.exited;

  if (exitCode !== 0) {
    return `Command failed with exit code ${exitCode}:\n${stderr || stdout}`;
  }

  return stdout || 'Command executed successfully (no output)';
}