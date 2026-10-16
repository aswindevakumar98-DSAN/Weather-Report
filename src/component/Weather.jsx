
import { useState } from "react";
import axios from "axios";
import "./Weather.css";

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getWeather = async (e) => {
    e.preventDefault();

    if (!city.trim()) {
      setError("Please enter a city name.");
      setWeather(null);
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=781c02d2aa7809099a645f882a0d0262`,
        {
          params: {
            q: city.trim(),
            appid: API_KEY,
            units: "metric",
          },
        }
      );

      setWeather(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("City not found. Please check the name.");
      } else if (err.response?.status === 401) {
        setError("Invalid API key or key not activated.");
      } else {
        setError("Unable to fetch weather. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="weather-container">
      <h1>Weather Report</h1>
      <p className="subtitle">Check the weather in any city</p>

      <form onSubmit={getWeather} className="search-form">
        <label htmlFor="city">City name</label>

        <div className="search-row">
          <input
            id="city"
            type="text"
            placeholder="Enter city, e.g. Chennai"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Search"}
          </button>
        </div>
      </form>

      {error && <p className="error" role="alert">{error}</p>}

      {weather && (
        <section className="weather-card" aria-live="polite">
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>

          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />

          <p className="temperature">
            {Math.round(weather.main.temp)}°C
          </p>

          <p className="description">
            {weather.weather[0].description}
          </p>

          <div className="weather-details">
            <div>
              <span>Feels like</span>
              <strong>{Math.round(weather.main.feels_like)}°C</strong>
            </div>

            <div>
              <span>Humidity</span>
              <strong>{weather.main.humidity}%</strong>
            </div>

            <div>
              <span>Wind speed</span>
              <strong>{weather.wind.speed} m/s</strong>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default Weather;
