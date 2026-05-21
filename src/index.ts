import { runAgent } from './loop.ts';
import type { TraceStep } from './types.ts';

// ANSI 颜色代码
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

function printStep(step: TraceStep): void {
  console.log(`\n${colors.gray}[Step ${step.step}]${colors.reset}`);

  if (step.thought) {
    console.log(`${colors.cyan}🤔 ${step.thought}${colors.reset}`);
  }

  if (step.action) {
    const input = step.action.input || '{}';
    console.log(`${colors.yellow}🔧 ${step.action.tool}(${truncate(input, 80)})${colors.reset}`);
  }

  if (step.observation) {
    console.log(`${colors.green}📋 ${truncate(step.observation, 200)}${colors.reset}`);
  }

  if (step.error && !step.final) {
    console.log(`${colors.red}❌ ${step.error}${colors.reset}`);
  }

  if (step.final) {
    console.log(`${colors.green}${colors.bold}✅ ${step.final}${colors.reset}`);
  }
}

function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + '...';
}

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

  console.log(`${colors.bold}任务: ${task}${colors.reset}\n`);
  console.log(`${colors.gray}正在启动 ReAct 循环...${colors.reset}\n`);

  try {
    const result = await runAgent(task, showTrace ? printStep : undefined);

    if (!showTrace) {
      console.log('\n--- 最终结果 ---');
      console.log(result.final);
    }
  } catch (error) {
    console.error('\n错误:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();