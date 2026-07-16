export default async function getNewToken() {
    await localStorage.removeItem("token");
    window.location.reload();
}