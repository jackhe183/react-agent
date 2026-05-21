// 消息类型
export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

// LLM 回复解析结果类型
export type ParsedAssistant = {
  thought?: string;
  action?: {
    tool: string;
    input: string;
  };
  final?: string;
};

// 文件写入模式
export type WriteMode = 'append' | 'overwrite';

// 写入参数解析结果
export type WriteParseResult =
  | { error: string }
  | { path: string; content: string; mode: WriteMode };

// 工具名称枚举
export type ToolName = 'getTime' | 'bash' | 'read' | 'write' | 'fetch';

// Trace 步骤
export type TraceStep = {
  step: number;
  thought?: string;
  action?: {
    tool: string;
    input: string;
  };
  observation?: string;
  error?: string;
};

// 运行结果
export type RunResult = {
  final: string;
  trace: TraceStep[];
};