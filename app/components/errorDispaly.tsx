import { useEffect, useRef } from "react";
import Card from "./card";

interface Props {
  responseCode: number;
  error: Error;
}

function getErrorMessage(responseCode: number, error: string) {
  if (responseCode === 1)
    return "Could not return results. The API doesn't have enough questions for your query.";
  if (responseCode === 2) return "Arguements passed in aren't valid.";
  if (responseCode === 3)
    return "Your Session Token does not exist. Try creating a new one or disabling it in the settings. Note: not using a token will result in duplicate questions.";
  if (responseCode === 4)
    return "Your Session Token has returned all possible questions for the specified query. Reset your token (from the Settings) or try changing the quiz category, difficulty or questions type. This error can also be caused by the database not having enough questions for your query";
  if (responseCode === 5 || error === "HTTP 429")
    return "Too many requests. Try again in a few seconds.";
  return "Unknown error. Check your internet connection.";
}

const ErrorDisplay = ({ responseCode, error }: Props) => {
  const tryAgainRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    tryAgainRef.current?.focus();
  }, []);
  return (
    <div className="grid grid-rows-[80%_20%] w-dvw h-full px-[10dvw] overflow-hidden">
      <Card
        title={error.message}
        subtitle={getErrorMessage(responseCode, error?.message)}
        titleStyles="text-red-500"
      />
      <section className="flex w-[80dvw] h-full items-center justify-center gap-10">
        <button
          ref={tryAgainRef}
          onClick={() => window.location.reload()}
          className="
            common bg-color2 px-4 py-1.25 rounded-lg font-semibold border-2 text-xs xl:text-sm 2xl:text-base"
        >
          Try Again
        </button>
      </section>
    </div>
  );
};

export default ErrorDisplay;
