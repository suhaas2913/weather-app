<template>
  <div class="weather-app">
    <header>
      <h1>Weather App</h1>
      <div class="search-container">
        <input 
          type="text" 
          v-model="city" 
          @keyup.enter="getWeather"
          placeholder="Enter city name..."
          class="search-input"
        >
        <button @click="getWeather" :disabled="loading" class="search-button">
          {{ loading ? 'Loading...' : 'Search' }}
        </button>
      </div>
    </header>
    
    <main>
      <div v-if="error" class="error">{{ error }}</div>
      
      <div v-if="weatherData" class="weather-card">
        <div class="location">
          <h2>{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
          <p>{{ formatDate(new Date()) }}</p>
        </div>
        
        <div class="current-weather">
          <div class="temperature">
            <span class="temp-value">{{ Math.round(weatherData.main.temp) }}</span>
            <span class="temp-unit">°C</span>
          </div>
          <div class="weather-icon">
            <img 
              :src="`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`" 
              :alt="weatherData.weather[0].description"
            >
          </div>
          <div class="weather-description">
            {{ weatherData.weather[0].main }} - {{ weatherData.weather[0].description }}
          </div>
        </div>
        
        <div class="weather-details">
          <div class="detail-item">
            <span class="label">Feels Like:</span>
            <span class="value">{{ Math.round(weatherData.main.feels_like) }}°C</span>
          </div>
          <div class="detail-item">
            <span class="label">Humidity:</span>
            <span class="value">{{ weatherData.main.humidity }}%</span>
          </div>
          <div class="detail-item">
            <span class="label">Wind Speed:</span>
            <span class="value">{{ weatherData.wind.speed }} m/s</span>
          </div>
          <div class="detail-item">
            <span class="label">Pressure:</span>
            <span class="value">{{ weatherData.main.pressure }} hPa</span>
          </div>
        </div>
      </div>
      
      <div v-if="!weatherData && !error && !loading" class="welcome-message">
        <p>Enter a city name to get started!</p>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'WeatherApp',
  data() {
    return {
      city: '',
      weatherData: null,
      loading: false,
      error: null
    }
  },
  mounted() {
    // Get user's location on mount
    this.getCurrentLocationWeather();
  },
  methods: {
    async getCurrentLocationWeather() {
      if (navigator.geolocation) {
        this.loading = true;
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            await this.getWeatherByCoords(latitude, longitude);
            this.loading = false;
          },
          async () => {
            // If geolocation fails, use a default city
            this.city = 'London';
            await this.getWeather();
          }
        );
      } else {
        // Geolocation not supported
        this.city = 'London';
        await this.getWeather();
      }
    },
    async getWeatherByCoords(lat, lon) {
      try {
        this.error = null;
        const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'YOUR_API_KEY_HERE';
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        this.weatherData = response.data;
      } catch (err) {
        console.error('Error fetching weather data:', err);
        this.error = 'Failed to fetch weather data. Please try again later.';
      }
    },
    async getWeather() {
      if (!this.city.trim()) {
        this.error = 'Please enter a city name';
        return;
      }
      
      this.loading = true;
      this.error = null;
      
      try {
        const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'YOUR_API_KEY_HERE';
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&appid=${API_KEY}`
        );
        this.weatherData = response.data;
      } catch (err) {
        console.error('Error fetching weather data:', err);
        if (err.response && err.response.status === 404) {
          this.error = 'City not found. Please check the spelling and try again.';
        } else {
          this.error = 'Failed to fetch weather data. Please try again later.';
        }
      } finally {
        this.loading = false;
      }
    },
    formatDate(date) {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }
}
</script>

<style scoped>
.weather-app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

header {
  text-align: center;
  margin-bottom: 30px;
}

h1 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.search-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
}

.search-input {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 25px;
  width: 250px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #42b549;
}

.search-button {
  padding: 10px 20px;
  background-color: #42b549;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.search-button:hover:not(:disabled) {
  background-color: #35913a;
}

.search-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

main {
  display: flex;
  justify-content: center;
  align-items: center;
}

.weather-card {
  background: linear-gradient(135deg, #74b9ff, #0984e3);
  color: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 500px;
  text-align: center;
}

.location h2 {
  margin: 0 0 5px 0;
  font-size: 24px;
}

.location p {
  margin: 0;
  opacity: 0.8;
  font-size: 16px;
}

.current-weather {
  margin: 25px 0;
}

.temperature {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-bottom: 15px;
}

.temp-value {
  font-size: 64px;
  font-weight: bold;
  line-height: 1;
}

.temp-unit {
  font-size: 24px;
  margin-bottom: 10px;
  margin-left: 5px;
}

.weather-icon img {
  width: 100px;
  height: 100px;
}

.weather-description {
  font-size: 18px;
  margin: 15px 0;
  text-transform: capitalize;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 20px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

.label {
  font-weight: bold;
  opacity: 0.9;
}

.value {
  font-weight: bold;
}

.error {
  color: #e17055;
  background-color: #fdedec;
  padding: 15px;
  border-radius: 10px;
  max-width: 500px;
  text-align: center;
}

.welcome-message {
  text-align: center;
  color: #7f8c8d;
  font-size: 18px;
  padding: 40px;
  max-width: 500px;
}

@media (max-width: 600px) {
  .weather-app {
    padding: 10px;
  }
  
  .search-container {
    flex-direction: column;
    align-items: center;
  }
  
  .search-input {
    width: 100%;
    max-width: 300px;
    margin-bottom: 10px;
  }
  
  .weather-card {
    padding: 20px;
  }
  
  .temp-value {
    font-size: 48px;
  }
  
  .temp-unit {
    font-size: 18px;
  }
  
  .weather-details {
    grid-template-columns: 1fr;
  }
}
</style>