export interface OxylabsScrapeResult {
  success: boolean;
  html?: string;
  statusCode?: number;
  error?: string;
  url: string;
}

export async function fetchPageHtmlWithOxylabs(targetUrl: string): Promise<OxylabsScrapeResult> {
  const username = process.env.OXYLABS_USERNAME;
  const password = process.env.OXYLABS_PASSWORD;

  if (!username || !password || username.startsWith("sample_")) {
    console.warn(`[Oxylabs] Missing valid credentials for ${targetUrl}. Falling back to standard fetch.`);
    try {
      const res = await fetch(targetUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });
      const html = await res.text();
      return {
        success: res.ok,
        html,
        statusCode: res.status,
        url: targetUrl,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Fetch failed";
      return {
        success: false,
        error: msg,
        url: targetUrl,
      };
    }
  }

  const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

  try {
    const response = await fetch("https://realtime.oxylabs.io/v1/queries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        source: "universal",
        url: targetUrl,
        user_agent_type: "desktop_chrome",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Oxylabs] API Error (${response.status}): ${errorText}`);
      return {
        success: false,
        statusCode: response.status,
        error: `Oxylabs API status ${response.status}`,
        url: targetUrl,
      };
    }

    const data = await response.json();
    const firstResult = data.results && data.results[0];

    if (!firstResult || !firstResult.content) {
      return {
        success: false,
        error: "Oxylabs returned empty content",
        url: targetUrl,
      };
    }

    return {
      success: true,
      html: firstResult.content,
      statusCode: firstResult.status_code || 200,
      url: targetUrl,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown Oxylabs network error";
    console.error(`[Oxylabs] Exception fetching ${targetUrl}:`, errorMsg);
    return {
      success: false,
      error: errorMsg,
      url: targetUrl,
    };
  }
}
