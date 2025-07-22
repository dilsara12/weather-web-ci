const apiKey = '7f43909e270aacb0befb699d1796ee1e'; 
const weatherInfoDiv = document.getElementById('weather-info');
const backgroundVideo = document.getElementById('background-video');
const searchInput = document.getElementById('city-search');
const suggestionsList = document.getElementById('suggestions');

// 🌍 City autocomplete
searchInput.addEventListener('input', async () => {
  const query = searchInput.value.trim();
  if (query.length < 3) {
    suggestionsList.classList.add('hidden');
    suggestionsList.innerHTML = '';
    return;
  }

  try {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=8&appid=${apiKey}`;
    const res = await fetch(geoUrl);
    const cities = await res.json();

    const uniqueCities = cities
      .filter((c, index, self) =>
        index === self.findIndex(t => t.name === c.name && t.country === c.country)
      )
      .filter(c => c.name && c.country);

    suggestionsList.innerHTML = '';
    uniqueCities.forEach(city => {
      const li = document.createElement('li');
      li.textContent = `${city.name}, ${city.country}`;
      li.addEventListener('click', () => {
        searchInput.value = `${city.name}, ${city.country}`;
        suggestionsList.classList.add('hidden');
        getWeatherByCoords(city.lat, city.lon, city.name);
      });
      suggestionsList.appendChild(li);
    });

    suggestionsList.classList.toggle('hidden', uniqueCities.length === 0);
  } catch (err) {
    console.error('Geo API error:', err);
  }
});

// 🌤️ Weather data by coordinates
async function getWeatherByCoords(lat, lon, cityName) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.cod !== 200) {
      weatherInfoDiv.innerHTML = `<p>❌ Weather not found for ${cityName}</p>`;
      return;
    }

    displayWeatherData(cityName, data);
    updateBackground(data.weather[0].main);
  } catch (error) {
    weatherInfoDiv.innerHTML = `<p>⚠️ Failed to get weather data.</p>`;
    console.error(error);
  }
}

// 🖼️ Display weather
function displayWeatherData(city, data) {
  const { temp } = data.main;
  const { description, icon } = data.weather[0];
  const { speed } = data.wind;

  weatherInfoDiv.innerHTML = `
    <h2>${city}</h2>
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" />
    <p>Temperature: ${temp.toFixed(1)}°C</p>
    <p>Weather: ${description}</p>
    <p>Wind Speed: ${speed} m/s</p>
  `;
}

// 🎥 Dynamic background based on weather
function updateBackground(weatherCondition) {
  let videoFile = 'default-bg.mp4';

  switch (weatherCondition.toLowerCase()) {
    case 'clear': videoFile = 'sunny.mp4'; break;
    case 'rain': videoFile = 'rainy.mp4'; break;
    case 'clouds': videoFile = 'cloudy.mp4'; break;
    case 'snow': videoFile = 'snowy.mp4'; break;
    case 'thunderstorm': videoFile = 'thunderstorm.mp4'; break;
  }

  const source = backgroundVideo.querySelector('source');
  source.setAttribute('src', videoFile);
  backgroundVideo.load();
  backgroundVideo.play();
}
