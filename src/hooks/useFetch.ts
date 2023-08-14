import { useState } from "react";

interface FetchOptions {
  headers?: any;
  retries?: number; // Number of times to retry on failure
  retryDelay?: number; // Time to wait before retrying, in ms
}

export const useFetch = <T = any>() => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetcher = async (
    fetchData: { url: string; options: FetchOptions },
    retryCount = 0,
  ): Promise<T> => {
    try {
      setLoading(true);
      const response = await fetch(fetchData.url, fetchData.options);

      return await response.json();
    } catch (err) {
      if (retryCount < (fetchData.options.retries || 0)) {
        // Wait for retryDelay before trying again
        await new Promise((res) =>
          setTimeout(res, fetchData.options.retryDelay || 1000),
        );
        return fetcher(fetchData, retryCount + 1);
      }

      setError(err as string);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetcher, loading, error };
};
