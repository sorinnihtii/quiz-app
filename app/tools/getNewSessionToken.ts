"use client";

import { useSettings } from "../storage/settings";
import getToken from "./getSessionToken";

const getNewToken = async () => {
  const { setSessionToken } = useSettings.getState();

  try {
    localStorage.removeItem("sessionToken");
    const newToken = await getToken();
    if (!newToken) return;
    setSessionToken(newToken);
  } catch (err) {
    if (err instanceof Error) {
      window.alert(`Failed to get new token: ${err.message}`);
    }
    console.error(err);
  } finally {
    window.alert("You succesfully received a new session token");
  }
};

export default getNewToken;
