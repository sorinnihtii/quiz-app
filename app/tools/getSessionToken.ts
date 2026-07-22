export default async function getToken() {
  try {
    const res = await fetch(
      "https://opentdb.com/api_token.php?command=request",
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data?.token) throw new Error(`Error Code ${data.response_code}`);
    if (typeof window !== "undefined")
      localStorage.setItem("sessionToken", data.token);
    return data.token;
  } catch (err) {
    console.error("error fetching token: ", err);
  }
}
