import 'dotenv/config';
import { runAgent } from './loop.ts';
import { printTrace } from './trace.ts';

async function main() {
  const args = Bun.argv.slice(2);
  const showTrace = args.includes('--trace') || args.includes('-t');

  // 提取任务（移除 --trace/-t 参数）
  const task = args.filter(arg => arg !== '--trace' && arg !== '-t').join(' ');

  if (!task) {
    console.log(`
React Agent - DemoAgent

用法:
  bun run src/index.ts "<your task>"
  bun run src/index.ts --trace "<your task>"    # 显示执行 trace

示例:
  bun run src/index.ts "现在几点了？"
  bun run src/index.ts --trace "列出当前目录文件"
    `);
    process.exit(0);
  }

  console.log(`任务: ${task}\n`);
  console.log('正在启动 ReAct 循环...\n');

  try {
    const result = await runAgent(task);

    if (showTrace) {
      printTrace(result.trace, result.final);
    } else {
      console.log('--- 最终结果 ---');
      console.log(result.final);
    }
  } catch (error) {
    console.error('\n错误:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();