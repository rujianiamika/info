async function fetchWeatherData() {
  try {
    const response = await fetch(
      "https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=35.07.24.2004"
    );
    const data = await response.json();
    console.log("API Response:", data); // Add this to debug the response
    // Updated data structure check
    if (!data || !data.lokasi || !data.cuaca) {
      throw new Error("Invalid data structure received from API");
    }
    // Update location information
    const location = data.lokasi;
    document.getElementById("location").textContent =
      location.desa || "Unknown Location";
    document.getElementById("sub-location").textContent = `${
      location.kecamatan || ""
    }, ${location.kotkab || ""}, ${location.provinsi || ""} (${location.lat}, ${
      location.lon
    })`;
    // Update administrative codes
    document.getElementById(
      "admin-codes"
    ).textContent = `ADM: ${location.adm1}.${location.adm2}.${location.adm3}.${location.adm4}`;
    // Update timezone
    document.getElementById(
      "timezone-info"
    ).textContent = `Timezone: ${location.timezone}`;
    // Update coordinates
    document.getElementById(
      "coordinates"
    ).textContent = `Coordinates: ${location.lat}, ${location.lon}`;
    // Get current weather (first item in the cuaca array)
    const currentWeather = data.cuaca[0]?.[0];
    if (!currentWeather) {
      throw new Error("Weather data not available");
    }
    // Update weather information
    document.getElementById("temperature").textContent = `${
      currentWeather.t || "--"
    }°C`;
    document.getElementById("weather-desc").textContent = `${
      currentWeather.weather_desc || ""
    } ${
      currentWeather.weather_desc_en
        ? `(${currentWeather.weather_desc_en})`
        : ""
    }`;
    document.getElementById("weather-icon").src = currentWeather.image || "";

    // Update detailed weather information
    document.getElementById("humidity").textContent = `${
      currentWeather.hu || "--"
    }%`;
    document.getElementById("tcc").textContent = `TCC: ${
      currentWeather.tcc || "--"
    }%`;

    document.getElementById("wind-speed").textContent = `${
      currentWeather.ws || "--"
    } km/h`;
    document.getElementById("wind-direction").textContent = `${
      currentWeather.wd || ""
    } → ${currentWeather.wd_to || ""} (${currentWeather.wd_deg || "--"}°)`;

    document.getElementById("visibility").textContent =
      currentWeather.vs_text || "--";
    document.getElementById("visibility-meters").textContent = `${
      currentWeather.vs || "--"
    } m`;
    // Update weather time
    document.getElementById("weather-time").textContent = `Time Index: ${
      currentWeather.time_index || "--"
    }`;
    // Format and display datetime
    if (currentWeather.local_datetime) {
      const localDateTime = new Date(currentWeather.local_datetime);
      document.getElementById(
        "datetime"
      ).textContent = `${localDateTime.toLocaleString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })} (${location.timezone || ""})`;
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    // Reset all elements to show error state
    document.getElementById("location").textContent = "Error loading data";
    document.getElementById("sub-location").textContent =
      "Please try again later";
    document.getElementById("admin-codes").textContent = "--";
    document.getElementById("coordinates").textContent = "--";
    document.getElementById("timezone-info").textContent = "--";
    document.getElementById("temperature").textContent = "--°C";
    document.getElementById("weather-desc").textContent = "--";
    document.getElementById("weather-time").textContent = "--";
    document.getElementById("humidity").textContent = "--%";
    document.getElementById("tcc").textContent = "TCC: --%";
    document.getElementById("wind-speed").textContent = "-- km/h";
    document.getElementById("wind-direction").textContent = "--";
    document.getElementById("visibility").textContent = "--";
    document.getElementById("visibility-meters").textContent = "--";
    document.getElementById("datetime").textContent = "--";
  }
}

// Fetch weather data when page loads
fetchWeatherData();

// Update weather data every 30 minutes
setInterval(fetchWeatherData, 30 * 60 * 1000);
