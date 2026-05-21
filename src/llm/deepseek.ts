import type { ChatMessage } from '../types.ts';

const MODEL = 'deepseek-chat';

export async function callDeepSeek(messages: ChatMessage[]): Promise<string> {
  const apiKey = Bun.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY environment variable is not set');
  }

  const baseUrl = Bun.env.DEEPSEEK_BASE || 'https://api.deepseek.com/v1';
  const apiUrl = `${baseUrl}/chat/completions`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}