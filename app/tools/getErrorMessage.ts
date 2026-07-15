export default function getErrorMessage(responseCode: number, error: string) {
    if (responseCode === 1)
      return "No Results Could not return results. The API doesn't have enough questions for your query.";
    if (responseCode === 2)
      return "Arguements passed in aren't valid. (Ex. Amount = Five)";
    if (responseCode === 3)
      return "Your Session Token does not exist. Try creating a new one or disabling it in the settings. Note: not using a token will result in duplicate questions";
    if (responseCode === 4)
      return "Your Session Token has returned all possible questions for the specified query. Reset your token or try changing the quiz category, difficulty or questions type.";
    if (responseCode === 5 || error === "HTTP 429")
      return "Too many requests. Try again in a few seconds";
    return "Unknown error";
  }