document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '4aed51eb21261abe40f7dd04800eea68'; // This is an example, use your real key!
    const locationInput = document.getElementById('location-input');
    const searchBtn = document.getElementById('search-btn');
    const currentLocationBtn = document.getElementById('current-location-btn');
    const cityNameElem = document.getElementById('city-name');
    const weatherIconElem = document.getElementById('weather-icon');
    const temperatureElem = document.getElementById('temperature');
    const descriptionElem = document.getElementById('description');
    const humidityElem = document.getElementById('humidity');
    const windSpeedElem = document.getElementById('wind-speed');
    const feelsLikeElem = document.getElementById('feels-like');
    const loadingMessage = document.getElementById('loading-message');
    const errorMessage = document.getElementById('error-message');
    const weatherDisplay = document.querySelector('.weather-display');
    const mainInfo = document.querySelector('.main-info');
    const detailsDiv = document.querySelector('.details');

    // Function to show/hide messages and weather display
    function showLoading() {
        loadingMessage.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        mainInfo.classList.add('hidden');
        detailsDiv.classList.add('hidden');
        cityNameElem.classList.add('hidden');
    }

    function showWeatherDisplay() {
        loadingMessage.classList.add('hidden');
        errorMessage.classList.add('hidden');
        mainInfo.classList.remove('hidden');
        detailsDiv.classList.remove('hidden');
        cityNameElem.classList.remove('hidden');
    }

    function showErrorMessage(message) {
        loadingMessage.classList.add('hidden');
        errorMessage.classList.remove('hidden');
        errorMessage.textContent = message;
        mainInfo.classList.add('hidden');
        detailsDiv.classList.add('hidden');
        cityNameElem.classList.add('hidden');
    }

    // Function to fetch weather data
    async function getWeatherData(url) {
        showLoading();
        try {
            const response = await fetch(url);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('City not found. Please check the spelling.');
                }
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            displayWeatherData(data);
            showWeatherDisplay();
        } catch (error) {
            console.error('Failed to fetch weather data:', error);
            showErrorMessage(`Could not retrieve weather: ${error.message}`);
        }
    }

    // Function to display weather data
    function displayWeatherData(data) {
        cityNameElem.textContent = data.name + ', ' + data.sys.country;
        temperatureElem.textContent = `${Math.round(data.main.temp)}°C`;
        descriptionElem.textContent = data.weather[0].description;
        weatherIconElem.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        weatherIconElem.alt = data.weather[0].description;
        humidityElem.textContent = `${data.main.humidity}%`;
        windSpeedElem.textContent = `${data.wind.speed} m/s`;
        feelsLikeElem.textContent = `${Math.round(data.main.feels_like)}°C`;
    }

    // Event listener for search button
    searchBtn.addEventListener('click', () => {
        const location = locationInput.value.trim();
        if (location) {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;
            getWeatherData(url);
        } else {
            showErrorMessage('Please enter a city name.');
        }
    });

    // Event listener for "Use Current Location" button
    currentLocationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            showLoading();
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
                    getWeatherData(url);
                },
                (error) => {
                    console.error('Error getting geolocation:', error);
                    let errorMessageText = 'Unable to retrieve your location.';
                    if (error.code === error.PERMISSION_DENIED) {
                        errorMessageText = 'Location access denied. Please enable location services in your browser settings.';
                    } else if (error.code === error.POSITION_UNAVAILABLE) {
                        errorMessageText = 'Location information is unavailable.';
                    } else if (error.code === error.TIMEOUT) {
                        errorMessageText = 'The request to get user location timed out.';
                    }
                    showErrorMessage(errorMessageText);
                }
            );
        } else {
            showErrorMessage('Geolocation is not supported by your browser.');
        }
    });

    // Optional: Fetch weather for a default location when the page loads
    // For example, fetch weather for Shivamogga, given your current location.
    const defaultLocation = "Shivamogga"; // Using your remembered current location
    const defaultUrl = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&units=metric&appid=${apiKey}`;
    getWeatherData(defaultUrl);
});