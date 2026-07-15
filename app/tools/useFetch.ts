"use client";

import { useState, useEffect } from "react";

export default function useFetch(url: string, storage?: string) {
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const [responseCode, setResponseCode] = useState(0);

  async function getData() {
      if (storage) {
        const cached = localStorage.getItem(storage);

        if (cached) {
          console.log("cached:", cached, JSON.parse(cached));
          
          setData(JSON.parse(cached));
          setIsLoading(false);
          return;
        }
      }

      try {
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error("Loading Error");
        }

        const data = await res.json();

        if (!data) {
          throw new Error("Failed to fetch data");
        }

        setResponseCode(data.response_code);

        if (data.response_code && data.response_code !== 0) {
          throw new Error(`Error Code ${data.response_code}`);
        }

        setData(data);
        if(storage && data[storage]) localStorage.setItem(storage, JSON.stringify(data));
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        }
      } finally {
        setIsLoading(false);
      }
    }

  useEffect(() => {
    getData();
  }, [url]);

  return { data, isLoading, error, responseCode, refetch: getData };
}