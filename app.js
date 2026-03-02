function WeatherApp(apiKey) {
    this.apiKey = apiKey;

    this.apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
    this.forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

    this.searchBtn = document.getElementById('search-btn');
    this.cityInput = document.getElementById('city-input');
    this.weatherDisplay = document.getElementById('weather-display');

    this.init();
}

WeatherApp.prototype.init = function() {
    this.searchBtn.addEventListener(
        'click',
        this.handleSearch.bind(this)
    );

    this.cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            this.handleSearch();
        }
    });

    this.showWelcome();
};

WeatherApp.prototype.showWelcome = function() {
    this.weatherDisplay.innerHTML = `
        <div class="welcome-message">
            <h2>🌤️ Welcome</h2>
            <p>Enter a city name to check weather</p>
        </div>
    `;
};

WeatherApp.prototype.handleSearch = function() {
    const city = this.cityInput.value.trim();

    if (!city) {
        this.showError("Please enter a city name.");
        return;
    }

    if (city.length < 2) {
        this.showError("City must be at least 2 characters.");
        return;
    }

    this.getWeather(city);
    this.cityInput.value = '';
};

WeatherApp.prototype.getWeather = async function(city) {
    this.showLoading();
    this.searchBtn.disabled = true;
    this.searchBtn.textContent = "Searching...";

    const currentUrl = `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`;

    try {
        const [currentWeather, forecastData] = await Promise.all([
            axios.get(currentUrl),
            this.getForecast(city)
        ]);

        this.displayWeather(currentWeather.data);
        this.displayForecast(forecastData);

    } catch (error) {
        if (error.response && error.response.status === 404) {
            this.showError("City not found.");
        } else {
            this.showError("Something went wrong.");
        }
    } finally {
        this.searchBtn.disabled = false;
        this.searchBtn.textContent = "Search";
    }
};

WeatherApp.prototype.getForecast = async function(city) {
    const url = `${this.forecastUrl}?q=${city}&appid=${this.apiKey}&units=metric`;
    const response = await axios.get(url);
    return response.data;
};

WeatherApp.prototype.displayWeather = function(data) {
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    this.weatherDisplay.innerHTML = `
        <div class="weather-info">
            <h2>${data.name}</h2>
            <img src="${iconUrl}">
            <h1>${Math.round(data.main.temp)}°C</h1>
            <p>${data.weather[0].description}</p>
        </div>
    `;
};

WeatherApp.prototype.processForecastData = function(data) {
    const daily = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );
    return daily.slice(0, 5);
};

WeatherApp.prototype.displayForecast = function(data) {
    const daily = this.processForecastData(data);

    const forecastHTML = daily.map(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

        return `
            <div class="forecast-card">
                <h4>${dayName}</h4>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">
                <div class="forecast-temp">${Math.round(day.main.temp)}°C</div>
                <div class="forecast-desc">${day.weather[0].description}</div>
            </div>
        `;
    }).join('');

    this.weatherDisplay.innerHTML += `
        <div class="forecast-section">
            <h3 class="forecast-title">5-Day Forecast</h3>
            <div class="forecast-container">
                ${forecastHTML}
            </div>
        </div>
    `;
};

WeatherApp.prototype.showLoading = function() {
    this.weatherDisplay.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
};

WeatherApp.prototype.showError = function(message) {
    this.weatherDisplay.innerHTML = `
        <div class="error-message">
            <h3>⚠️ Error</h3>
            <p>${message}</p>
        </div>
    `;
};

const app = new WeatherApp("YOUR_API_KEY");