export default async function resetToken(token:string) {
    try {
      const res = await fetch(
        `https://opentdb.com/api_token.php?command=reset&token=${token}`,
      );
      if (!res.ok)
        throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      if (err instanceof Error) {
        window.alert(`Failed to reset token. ${err.name}:${err.message}`);
      }
    }
    finally {
        window.alert("Token reset succesfully")
      }
  }