# Weather App - Responsive PWA

A modern, responsive weather application with Progressive Web App (PWA) capabilities built using Vue.js and Vite.

## Features

- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **PWA Support**: Installable on mobile and desktop devices
- **Current Weather Data**: Real-time weather information from OpenWeatherMap API
- **Geolocation Support**: Automatically detects user's location for weather data
- **Search Functionality**: Search for weather in any city worldwide
- **Detailed Weather Information**: Temperature, humidity, wind speed, pressure, etc.

## Technologies Used

- Vue.js 3
- Vite
- Vite Plugin PWA
- Axios
- OpenWeatherMap API

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd weather-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on the example:
```bash
cp .env.example .env
```

4. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api) and add it to your `.env` file:
```
VITE_OPENWEATHER_API_KEY=your_actual_api_key_here
```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

## Building for Production

To build the application for production:

```bash
npm run build
```

This will create a `dist` folder with the optimized production-ready files.

## PWA Capabilities

The application includes PWA features:
- Works offline (with cached content)
- Installable on mobile and desktop
- Fast loading times
- Responsive design

## Project Structure

```
src/
├── components/
│   └── WeatherApp.vue    # Main weather component
├── assets/
│   └── icon.png          # PWA icon placeholder
├── main.js               # Vue app entry point
└── App.vue               # Root component
```

## Future Enhancements

This app is designed with future enhancements in mind:
- 5-day forecast
- Hourly weather predictions
- Weather maps
- Multiple unit systems (Fahrenheit/Celsius)
- Weather alerts
- Location history
- Dark/light mode toggle
- Customizable widgets