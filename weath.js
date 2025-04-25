const apiKey = '7f43909e270aacb0befb699d1796ee1e'; 
const weatherInfoDiv = document.getElementById('weather-info');
const cityButtons = document.querySelectorAll('.city-button');
const backgroundVideo = document.getElementById('background-video');

cityButtons.forEach(button => {
    button.addEventListener('click', async () => {
        const city = button.getAttribute('data-city');
        const weatherData = await fetchWeatherData(city);
        if (weatherData) {
            displayWeatherData(city, weatherData);
            updateBackground(weatherData.weather[0].main);
        }
    });
});

async function fetchWeatherData(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        if (!response.ok) throw new Error('Failed to fetch weather data');
        return await response.json();
    } catch (error) {
        console.error(error);
        weatherInfoDiv.innerHTML = '<p>Failed to fetch weather data. Please try again later.</p>';
        return null;
    }
}

function displayWeatherData(city, data) {
    const { temp } = data.main;
    const { description } = data.weather[0];
    const { speed } = data.wind;

    weatherInfoDiv.innerHTML = `
        <h2>${city}</h2>
        <p>Temperature: ${temp.toFixed(1)}°C</p>
        <p>Weather: ${description}</p>
        <p>Wind Speed: ${speed} m/s</p>
    `;
}

function updateBackground(weatherCondition) {
    let videoSource;
    switch (weatherCondition.toLowerCase()) {
        case 'clear':
            videoSource = 'sunny.mp4';
            break;
        case 'rain':
            videoSource = 'rainy.mp4';
            break;
        case 'clouds':
            videoSource = 'cloudy.mp4';
            break;
        case 'snow':
            videoSource = 'snowy.mp4';
            break;
        case 'thunderstorm':
            videoSource = 'thunderstorm.mp4';
            break;
        default:
            videoSource = 'default-bg.mp4';
    }
    backgroundVideo.setAttribute('src', videoSource);
    backgroundVideo.load();
    backgroundVideo.play();
}
