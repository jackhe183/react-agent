import type { TraceStep } from './types.ts';

export function printTrace(steps: TraceStep[], final: string): void {
  for (const step of steps) {
    printStep(step);
  }
  console.log('\n✅ Final:', final);
}

export function printStep(step: TraceStep): void {
  console.log(`\n[Step ${step.step}]`);

  if (step.thought) {
    console.log(`🤔 Thought: ${step.thought}`);
  }

  if (step.action) {
    const input = step.action.input || '{}';
    console.log(`🔧 Action: ${step.action.tool}(${truncate(input, 100)})`);
  }

  if (step.observation) {
    console.log(`📋 Observation: ${truncate(step.observation, 200)}`);
  }

  if (step.error) {
    console.log(`❌ Error: ${step.error}`);
  }
}

function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + '...';
}