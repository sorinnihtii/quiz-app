"use client";

import { useState, useEffect, useCallback } from "react";

export default function useFetch(url: string, storage?: string) {
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const [responseCode, setResponseCode] = useState(0);

  const getData = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);
    setResponseCode(0);

    if (storage) {
      try {
        const cached = localStorage.getItem(storage);

        if (cached) {
          setData(JSON.parse(cached));
          setIsLoading(false);
          return;
        }
        localStorage.removeItem(storage);
      } catch {
        localStorage.removeItem(storage);
      }
    }

    try {
      const res = await fetch(url);
      console.log("usefetch res: ", res);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log("usefetch data: ", data);

      if (!data) {
        throw new Error("Failed to fetch data");
      }

      setResponseCode(data.response_code);
      console.log("usefetch response code:", data.response_code);

      if (data.response_code !== undefined && data.response_code !== 0) {
        throw new Error(`Error Code ${data.response_code}`);
      }

      setData(data);
      if (storage) {
        localStorage.setItem(storage, JSON.stringify(data));
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log("usefetch err: ", err);
        setError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [url, storage]);

  useEffect(() => {
    getData();
  }, [getData]);

  return { data, isLoading, error, responseCode, refetch: getData };
}
