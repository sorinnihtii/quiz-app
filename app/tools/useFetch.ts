export default async function useFetch(url: string) {
    try {
        const response = await fetch(url);

        if(!response?.ok) console.log("error caught")
            
        return response.json();
    }
    catch(error) {
        console.log("error:", error)
    }
}