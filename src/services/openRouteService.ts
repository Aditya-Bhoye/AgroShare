
export const fetchRoute = async (start: [number, number], end: [number, number]) => {
    const apiKey = import.meta.env.VITE_ORS_API_KEY;
    if (!apiKey) {
        console.error("OpenRouteService API key is missing");
        return null;
    }

    try {
        const response = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`);

        if (!response.ok) {
            throw new Error(`OpenRouteService error: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching route:", error);
        return null;
    }
};
