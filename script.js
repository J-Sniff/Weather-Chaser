const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const weatherCards = document.getElementById("weather-cards");
const searchHistory = document.getElementById("search-history");

const API_KEY = "7a1a91fdfda4d27709d7c20731555ec0";

// Adding event listener to search button
searchButton.addEventListener("click", () => {
  const city = searchInput.value;
  getWeatherData(city);
  saveSearchHistory(city);
});

// Fetch weather data from OpenWeather API
function getWeatherData(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => displayWeatherData(data, city)) // Pass city name as argument
    .catch((error) => console.log("Error:", error));
}

// Display weather data on page
function displayWeatherData(data, cityName) {
  weatherCards.innerHTML = "";

  // Iterate over the weather data for each day
  for (let i = 0; i < data.list.length; i += 8) {
    // Get weather info for current day
    const weather = data.list[i];
    // Create weather card for current day with city name
    const card = createWeatherCard(weather, cityName);
    // Append the weather card to the container
    weatherCards.appendChild(card);
  }
}

// Create a weather card for a specific day's weather
function createWeatherCard(weather, cityName) {
  const card = document.createElement("div");
  card.classList.add("card");

  const date = new Date(weather.dt * 1000);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  const dateString = `${month}/${day}/${year}`;
  // Grabbing URL for weather icon
  const imageSrc = `http://openweathermap.org/img/w/${weather.weather[0].icon}.png`;

  // Converting temperature from Kelvin to Fahrenheit
  const temperatureFahrenheit = Math.round(
    ((weather.main.temp - 273.15) * 9) / 5 + 32
  );

  // Set the HTML content of the card with the weather information
  card.innerHTML = `
      <h3>${cityName}</h3>
      <h4>${dateString}</h4>
      <img src="${imageSrc}" alt="${weather.weather[0].description}">
      <p>Temperature: ${temperatureFahrenheit} °F</p>
      <p>Wind Speed: ${weather.wind.speed} m/s</p>
      <p>Humidity: ${weather.main.humidity}%</p>
    `;

  return card;
}

function saveSearchHistory(city) {
  let cities = localStorage.getItem("searchHistory");
  if (!cities) {
    cities = [];
  } else {
    cities = JSON.parse(cities);
  }

  // Add the city to the search history array
  cities.push(city);

  // Limit the search history to the last 5 cities
  if (cities.length > 5) {
    cities.shift();
  }

  // Update the search history in localStorage
  localStorage.setItem("searchHistory", JSON.stringify(cities));

  // Display the search history
  displaySearchHistory(cities);
}

function displaySearchHistory(cities) {
  searchHistory.innerHTML = "";

  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];
    const historyItem = document.createElement("div");
    historyItem.textContent = city;
    searchHistory.appendChild(historyItem);
  }
}

// Retrieve the search history from localStorage and display it
const storedCities = localStorage.getItem("searchHistory");
if (storedCities) {
  const cities = JSON.parse(storedCities);
  displaySearchHistory(cities);
}

// Add event listener to the search history container
searchHistory.addEventListener("click", (event) => {
  if (event.target.tagName === "DIV") {
    const city = event.target.textContent;
    getWeatherData(city);
  }
});


