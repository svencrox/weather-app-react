import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import {
  WiDaySunny,
  WiRain,
  WiSnow,
  WiCloudy,
  WiDayFog,
  WiThunderstorm,
  WiHumidity,
  WiStrongWind,
  WiBarometer,
  WiSunrise,
  WiSunset,
  WiThermometer,
} from "react-icons/wi";
import { css } from "@emotion/react";
import "./App.css";
import ClipLoader from "react-spinners/ClipLoader";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          "https://api.openweathermap.org/data/2.5/weather?q=Malaysia&appid=22d965a266f7666e1d9f5621156c26d7&units=metric"
        );
        setWeatherData(response.data);
      } catch (error) {
        setError(error.message);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  if (loading) {
    return (
      <div className="loader">
        <ClipLoader
          color={"#36D7B7"}
          loading={true}
          css={override}
          size={150}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
      </div>
    );
  }

  if (!weatherData) {
    return null;
  }

  const windDeg = weatherData.wind?.deg;
  const windDirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const windDir = windDeg != null ? windDirs[Math.round(windDeg / 45) % 8] : null;

  return (
    <div
      className={`weather weather-${weatherData.weather[0].main.toLowerCase()}`}
    >
      <h1>Weather App</h1>
      <p className="date">{moment().format("MMMM Do YYYY, h:mm:ss a")}</p>
      <p className="location">
        {weatherData.name}, {weatherData.sys.country}
      </p>

      <div className="icon">
        {weatherData.weather[0].main === "Clear" && <WiDaySunny />}
        {weatherData.weather[0].main === "Rain" && <WiRain />}
        {weatherData.weather[0].main === "Snow" && <WiSnow />}
        {weatherData.weather[0].main === "Clouds" && <WiCloudy />}
        {weatherData.weather[0].main === "Mist" && <WiDayFog />}
        {weatherData.weather[0].main === "Thunderstorm" && <WiThunderstorm />}
      </div>

      <p className="temp">{Math.round(weatherData.main.temp)}&deg;C</p>
      <p className="description">{weatherData.weather[0].description}</p>
      <p className="feels-like">Feels like: {Math.round(weatherData.main.feels_like)}&deg;C</p>

      <div className="details-grid">
        <div className="detail-item">
          <WiThermometer />
          <span className="detail-label">High / Low</span>
          <span>{Math.round(weatherData.main.temp_max)}&deg; / {Math.round(weatherData.main.temp_min)}&deg;C</span>
        </div>
        <div className="detail-item">
          <WiHumidity />
          <span className="detail-label">Humidity</span>
          <span>{weatherData.main.humidity}%</span>
        </div>
        <div className="detail-item">
          <WiStrongWind />
          <span className="detail-label">Wind</span>
          <span>{weatherData.wind?.speed} m/s {windDir}</span>
        </div>
        <div className="detail-item">
          <WiBarometer />
          <span className="detail-label">Pressure</span>
          <span>{weatherData.main.pressure} hPa</span>
        </div>
        <div className="detail-item">
          <WiSunrise />
          <span className="detail-label">Sunrise</span>
          <span>{moment.unix(weatherData.sys.sunrise).format("h:mm a")}</span>
        </div>
        <div className="detail-item">
          <WiSunset />
          <span className="detail-label">Sunset</span>
          <span>{moment.unix(weatherData.sys.sunset).format("h:mm a")}</span>
        </div>
        {weatherData.visibility != null && (
          <div className="detail-item">
            <span className="detail-label">Visibility</span>
            <span>{(weatherData.visibility / 1000).toFixed(1)} km</span>
          </div>
        )}
        <div className="detail-item">
          <span className="detail-label">Cloud Cover</span>
          <span>{weatherData.clouds?.all}%</span>
        </div>
      </div>
    </div>
  );
}

export default App;
