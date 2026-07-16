export default async function getNewToken() {
    await localStorage.removeItem("token");
    window.alert("Your current token was deleted. Reload the page to receive a new one.");
}