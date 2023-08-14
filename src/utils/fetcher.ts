interface FetchOptions {
  headers?: HeadersInit;
  retries?: number; // Number of times to retry on failure
  retryDelay?: number; // Time to wait before retrying, in ms
}

interface FetchResult<T> {
  data?: T;
  error?: string;
  loading: boolean;
}

async function fetcher<T>(
  fetchData: { url: string; options?: RequestInit },
  retryCount = 0,
): Promise<T> {
  const { url, options } = fetchData;

  // Merge the user's fetch options with our defaults
  const mergedOptions: FetchOptions = {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, mergedOptions);

    if (!response.ok) throw new Error("Network response was not ok");

    return await response.json();
  } catch (err) {
    if (retryCount < (mergedOptions.retries || 0)) {
      // Wait for retryDelay before trying again
      await new Promise((resolve) =>
        setTimeout(resolve, mergedOptions.retryDelay || 1000),
      );
      return fetcher(fetchData, retryCount + 1);
    }

    throw err;
  }
}

export { fetcher };
export type { FetchOptions, FetchResult };
