// Weather App Configuration
const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const FORECAST_URL = `${BASE_URL}/forecast`;
const CURRENT_WEATHER_URL = `${BASE_URL}/weather`;

// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const cityName = document.getElementById('city-name');
const dateTime = document.getElementById('date-time');
const tempValue = document.getElementById('temp-value');
const weatherIcon = document.getElementById('weather-icon');
const weatherDesc = document.getElementById('weather-desc');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const pressure = document.getElementById('pressure');
const forecastList = document.getElementById('forecast-list');

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Set current date and time
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update every minute
    
    // Load default city weather (can be changed to user's location detection)
    getWeatherByCity('London');
    
    // Event listeners
    searchBtn.addEventListener('click', handleSearch);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
});

// Update date and time display
function updateDateTime() {
    const now = new Date();
    dateTime.textContent = now.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Handle search button click
function handleSearch() {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherByCity(city);
    } else {
        showError('Please enter a city name');
    }
}

// Get current weather by city name
async function getWeatherByCity(city) {
    try {
        showLoading(true);
        
        // Fetch current weather
        const currentResponse = await fetch(
            `${CURRENT_WEATHER_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
        );
        
        if (!currentResponse.ok) {
            throw new Error(`Weather data not found: ${currentResponse.status}`);
        }
        
        const currentData = await currentResponse.json();
        
        // Fetch 5-day forecast
        const forecastResponse = await fetch(
            `${FORECAST_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
        );
        
        if (!forecastResponse.ok) {
            throw new Error(`Forecast data not found: ${forecastResponse.status}`);
        }
        
        const forecastData = await forecastResponse.json();
        
        // Update UI with weather data
        updateCurrentWeather(currentData);
        updateForecast(forecastData);
        
        showLoading(false);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError('Failed to fetch weather data. Please check the city name and try again.');
        showLoading(false);
    }
}

// Update current weather UI
function updateCurrentWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    tempValue.textContent = Math.round(data.main.temp);
    weatherDesc.textContent = data.weather[0].description;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`; // Convert m/s to km/h
    pressure.textContent = `${data.main.pressure} hPa`;
    
    // Update weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
}

// Update forecast UI
function updateForecast(data) {
    // Clear existing forecast
    forecastList.innerHTML = '';
    
    // Group forecast by day (every 8 items is roughly every 24 hours in 3-hour intervals)
    const dailyForecasts = [];
    for (let i = 0; i < data.list.length; i += 8) {
        dailyForecasts.push(data.list[i]);
    }
    
    // Limit to 5 days
    dailyForecasts.slice(0, 5).forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <div class="forecast-date">${dayName}<br>${monthDay}</div>
            <div class="forecast-icon">
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" 
                     alt="${item.weather[0].description}" />
            </div>
            <div class="forecast-temp">${Math.round(item.main.temp)}°C</div>
            <div class="forecast-desc">${item.weather[0].description}</div>
        `;
        
        forecastList.appendChild(forecastItem);
    });
}

// Show loading state
function showLoading(isLoading) {
    if (isLoading) {
        searchBtn.innerHTML = '<div class="loading"></div>';
        searchBtn.disabled = true;
    } else {
        searchBtn.textContent = 'Search';
        searchBtn.disabled = false;
    }
}

// Show error message
function showError(message) {
    // Remove any existing error messages
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const header = document.querySelector('header');
    header.parentNode.insertBefore(errorDiv, header.nextSibling);
    
    // Auto-remove error after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Geolocation support (optional enhancement)
async function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                
                try {
                    showLoading(true);
                    
                    // Fetch weather by coordinates
                    const currentResponse = await fetch(
                        `${CURRENT_WEATHER_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
                    );
                    
                    if (!currentResponse.ok) {
                        throw new Error(`Weather data not found: ${currentResponse.status}`);
                    }
                    
                    const currentData = await currentResponse.json();
                    
                    // Fetch forecast by coordinates
                    const forecastResponse = await fetch(
                        `${FORECAST_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
                    );
                    
                    if (!forecastResponse.ok) {
                        throw new Error(`Forecast data not found: ${forecastResponse.status}`);
                    }
                    
                    const forecastData = await forecastResponse.json();
                    
                    // Update UI
                    updateCurrentWeather(currentData);
                    updateForecast(forecastData);
                    
                    showLoading(false);
                } catch (error) {
                    console.error('Error fetching weather by location:', error);
                    showError('Failed to get weather for your location.');
                    showLoading(false);
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                showError('Unable to retrieve your location. Using default city instead.');
                getWeatherByCity('London'); // Fallback to default city
            }
        );
    } else {
        showError('Geolocation is not supported by your browser.');
    }
}

// Export functions for potential use in other modules
window.WeatherApp = {
    getWeatherByCity,
    getWeatherByLocation
};