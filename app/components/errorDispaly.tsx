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
    return "Your Session Token has returned all possible questions for the specified query. Reset your token (from the Settings) or try changing the quiz category, difficulty or questions type.";
  if (responseCode === 5 || error === "HTTP 429")
    return "Too many requests. Try again in a few seconds.";
  return "Unknown error. Check your internet connection.";
}

const ErrorDisplay = ({ responseCode, error }: Props) => {
  return (
    <div className="grid grid-rows-[60%_40%] md:grid-rows-[80%_20%] w-dvw h-full px-[10dvw] overflow-hidden">
      <Card
        title={error.message}
        subtitle={getErrorMessage(responseCode, error?.message)}
        titleStyles="text-red-500"
      />
      <section className="flex w-[80dvw] h-full items-center justify-center gap-10">
        <button
          onClick={() => window.location.reload()}
          className="
            px-4 py-1.5 border-3 border-color5 rounded-lg
            font-semibold text-xs md:text-base bg-color2
            md:hover:scale-110 focus:outline-3 outline-color4"
        >
          Try Again
        </button>
      </section>
    </div>
  );
};

export default ErrorDisplay;
