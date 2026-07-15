import { useState, useEffect } from "react"

const useFetch = (url:string) => {
  const [data, setData] = useState<DisplayContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const [responseCode, setResponseCode] = useState(0);

  useEffect(() => {
    const abortContent = new AbortController()

    fetch(url, { signal: abortContent.signal })
      .then((res) => {
        if (!res.ok) {
          throw Error("Loading Error")
        }
        return res.json()
      })

      .then((data) => {
        setResponseCode(data.response_code)
        console.log("response code",data.response_code)
        if(data.response_code !== 0) return;

        setData(data)
        setIsLoading(false)
      })

      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("fetch aborted")
        } else {
          setIsLoading(false)
          setError(err.message)
        }
      })
    return () => abortContent.abort()
  }, [url])

  return { data, isLoading, error, responseCode }
}

export default useFetch