export async function fetchUrl(rawUrl: string): Promise<string> {
  const url = rawUrl.trim();

  if (!url) {
    return 'Error: Empty URL';
  }

  try {
    new URL(url);
  } catch {
    return `Error: Invalid URL format: ${url}`;
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'React-Agent/1.0',
      },
    });

    if (!response.ok) {
      return `HTTP ${response.status}: ${response.statusText}`;
    }

    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const data = await response.json();
      return JSON.stringify(data, null, 2);
    }

    return await response.text();
  } catch (error) {
    return `Error fetching URL: ${error instanceof Error ? error.message : String(error)}`;
  }
}