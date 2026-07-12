export default async function fetchData(url: string) {
    try {
        const response = await fetch(url);
        

        if(!response?.ok) throw new Error(`HTTP error: ${response.status}`);
            
        return response.json();
    }
    catch(error) {
        console.log("error:", error)
    }
}