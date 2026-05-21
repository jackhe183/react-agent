export async function bash(rawCmd: string): Promise<string> {
  const cmd = rawCmd.trim();
  if (!cmd) {
    return 'Error: Empty command';
  }

  const isWindows = process.platform === 'win32';

  // Windows date 命令兼容处理
  if (isWindows && /date\s+-Iseconds?/i.test(cmd)) {
    const psCmd = 'Get-Date -Format o';
    const proc = Bun.spawn(['powershell', '-Command', psCmd], { stdout: 'pipe', stderr: 'pipe' });
    const [stdout, stderr] = await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
    ]);
    const exitCode = await proc.exited;
    if (exitCode !== 0) {
      return `Command failed with exit code ${exitCode}:\n${stderr || stdout}`;
    }
    return stdout.trim() || 'Command executed successfully (no output)';
  }

  // 尝试解析 JSON 数组格式
  try {
    const parsed = JSON.parse(cmd);
    if (Array.isArray(parsed)) {
      const proc = Bun.spawn(parsed, { stdout: 'pipe', stderr: 'pipe' });
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
  } catch {
    // 不是 JSON 数组
  }

  // 使用 shell 执行
  let proc: ReturnType<typeof Bun.spawn>;
  if (isWindows) {
    proc = Bun.spawn(['cmd', '/c', cmd], { stdout: 'pipe', stderr: 'pipe' });
  } else {
    proc = Bun.spawn(['sh', '-c', cmd], { stdout: 'pipe', stderr: 'pipe' });
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