// Your OpenWeatherMap API Key
const API_KEY = 'b44a93a3bd11e499c3cdd4ef9756315e';  // Replace with your actual API key
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Function to fetch weather data
async function getWeather(city) {
    // Show loading spinner at the START
    showLoading();

    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await axios.get(url);

        // Replace loading with weather data
        displayWeather(response.data);

    } catch (error) {
        console.error('Error:', error);

        // Handle specific errors
        if (error.response && error.response.status === 404) {
            showError('City not found. Please check the spelling and try again.');
        } else if (error.response && error.response.status === 401) {
            showError('Invalid API key. Please check your configuration.');
        } else if (!error.response) {
            showError('Network error. Please check your internet connection.');
        } else {
            showError('Something went wrong. Please try again later.');
        }
    }
}
// Create showError function
function showError(message) {
    const weatherDisplay = document.getElementById("weather-display");

    weatherDisplay.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #ff6b6b, #ff8e53);
            color: white;
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            font-size: 1.1rem;
            box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        ">
            ⚠️ ${message}
        </div>
    `;
}
// Get references to HTML elements
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");

// Function to handle search
function handleSearch() {
    const city = cityInput.value.trim();

    // Validate input
    if (city === "") {
        showError("❌ Please enter a city name!");
        return;
    }

    // Call weather function
    getWeather(city);
}

// Add click event listener to search button
searchBtn.addEventListener("click", handleSearch);

// BONUS: Add Enter key support
cityInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        handleSearch();
    }
});
// Add click event listener
searchBtn.addEventListener("click", function () {

    const city = cityInput.value.trim();

    // 1 & 2: Check if empty or only spaces
    if (!city) {
        showError("❌ Please enter a city name.");
        return;
    }

    // 3: Minimum length validation
    if (city.length < 2) {
        showError("⚠️ City name too short. Please enter at least 2 characters.");
        return;
    }

    // Optional: Allow only letters and spaces (extra professional touch)
    const validCityRegex = /^[a-zA-Z\s]+$/;
    if (!validCityRegex.test(city)) {
        showError("⚠️ City name should contain only letters.");
        return;
    }

    // 4: If valid, proceed
    getWeather(city);
});

// Function to display weather data
function displayWeather(data) {
    // Extract the data we need
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    
    // Create HTML to display
    const weatherHTML = `
        <div class="weather-info">
            <h2 class="city-name">${cityName}</h2>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <div class="temperature">${temperature}°C</div>
            <p class="description">${description}</p>
        </div>
    `;
    
    // Put it on the page
    document.getElementById('weather-display').innerHTML = weatherHTML;
}
//skyfetch
console.log('Skyfetch is running!');

// Call the function when page loads
// getWeather('London');
// Remove or comment out this line
// getWeather('London');

// Show welcome message instead
function showLoading() {
    const weatherDisplay = document.getElementById("weather-display");

    const loadingHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Loading weather data...</p>
        </div>
    `;

    weatherDisplay.innerHTML = loadingHTML;
}
const weatherDisplay = document.getElementById("weather-display");

weatherDisplay.innerHTML = `
    <div style="
        text-align: center;
        padding: 30px;
        color: #555;
        font-size: 1.1rem;
    ">
        🌤️ Welcome to the Weather App! <br><br>
        Enter a city name above and click <strong>Search</strong> to get started.
    </div>
`;
