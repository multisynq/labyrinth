async function getLocationDetails(latitude, longitude) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
        );
        const data = await response.json();
        
        // Extract location details with fallbacks
        return {
            city: data.address.city || 
                  data.address.town || 
                  data.address.village || 
                  data.address.suburb ||
                  data.address.county,
            state: data.address.state,
            country: data.address.country,
            //countryCode: data.address.country_code,
            //county: data.address.county,
            //postcode: data.address.postcode,
            //suburb: data.address.suburb,
            //neighbourhood: data.address.neighbourhood,
            displayName: data.display_name,
            //raw: data.address  // Include all raw data in case you need other fields
        };
    } catch (error) {
        console.error("Error getting location details:", error);
        return null;
    }
}

function getLocation() {
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const locationDetails = await getLocationDetails(
                            position.coords.latitude,
                            position.coords.longitude
                        );
                        resolve(locationDetails);
                    } catch (error) {
                        reject(error);
                    }
                },
                (error) => {
                    reject(error);
                }
            );
        } else {
            reject(new Error("Geolocation is not supported"));
        }
    });
}

export default getLocation;