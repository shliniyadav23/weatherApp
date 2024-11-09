

const apiKey = '3d9fe3bb857eabea9b690349aca57690'; // Replace with your OpenWeatherMap API key

document.getElementById('search-button').addEventListener('click', function () {
    const city = document.getElementById('city-input').value;
    if (city) {
        getWeather(city);
        getForecast(city);
    } else {
        alert('Please enter a city name.');
    }
});

function getWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Weather data:', data); // Debugging line
            updateWeather(data);
        })
        .catch(error => console.error('Error fetching the weather data:', error));
}

function getForecast(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Forecast data:', data); // Debugging line
            updateForecast(data);
        })
        .catch(error => console.error('Error fetching the forecast data:', error));
}

function updateWeather(data) {
    document.getElementById('city').textContent = data.name;
    document.getElementById('temp').textContent = data.main.temp;
    document.getElementById('min-temp').textContent = data.main.temp_min;
    document.getElementById('max-temp').textContent = data.main.temp_max;
    document.getElementById('feel-like').textContent = data.main.feels_like;
    document.getElementById('humidity-span').textContent = data.main.humidity;
    document.getElementById('wind-degree').textContent = data.wind.deg;
    document.getElementById('wind-speed-span').textContent = data.wind.speed;
    document.getElementById('sunrise').textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    document.getElementById('sunset').textContent = new Date(data.sys.sunset * 1000).toLocaleTimeString();
    

   
        const weatherIcon = data.weather[0].icon;
        document.getElementById('weather-img').src = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
        
        // Show weather description text
        const weatherDescription = data.weather[0].description;
        document.getElementById('weather-description').textContent = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);
        
        // Set the background video based on weather condition
        const weatherCondition = data.weather[0].main.toLowerCase();
        const backgroundVideo = document.getElementById('background-video');
        let videoSource = '';
    
        if (weatherCondition.includes('clear')) {
            videoSource = ''; // Sunny video path
        } else if (weatherCondition.includes('rain')) {
            videoSource = 'https://cdn.pixabay.com/video/2021/05/16/74233-550033536_large.mp4'; // Rainy video path
        } else if (weatherCondition.includes('cloud')) {
            videoSource = 'https://cdn.pixabay.com/video/2017/06/11/9825-221185540_large.mp4'; // Cloudy video path
        } else if (weatherCondition.includes('snow')) {
            videoSource = 'https://cdn.pixabay.com/video/2024/03/25/205614-927347862_large.mp4'; // Snowy video path
        } else if (weatherCondition.includes('mist')) {
            videoSource = 'https://cdn.pixabay.com/video/2022/09/11/130979-748577162_large.mp4'; // Mist video path
        } else {
            videoSource = 'https://path-to-your-default-video.mp4'; // Default video path
        }
    
        // Set the video source and load the new video
        backgroundVideo.src = videoSource;
        backgroundVideo.load();


    document.body.style.backgroundImage = backgroundVideo;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';

    // Update humidity icon
    const humidity = data.main.humidity;
    const humidityImg = document.getElementById('humidity-img');
    if (humidity < 30) {
        humidityImg.src = 'https://cdn-icons-png.flaticon.com/128/14672/14672929.png'; // Low humidity icon
    } else if (humidity < 60) {
        humidityImg.src = 'https://cdn-icons-png.flaticon.com/128/15398/15398058.png'; // Moderate humidity icon
    } else {
        humidityImg.src = 'https://cdn-icons-png.flaticon.com/128/1594/1594877.png'; // High humidity icon
    }

    // Update wind icon
    const windSpeed = data.wind.speed;
    const windImg = document.getElementById('wind-img');
    if (windSpeed < 10) {
        windImg.src = 'https://cdn-icons-png.flaticon.com/128/3026/3026375.png'; // Light wind icon
    } else if (windSpeed < 20) {
        windImg.src = 'https://cdn-icons-png.flaticon.com/128/15056/15056690.png'; // Moderate wind icon
    } else {
        windImg.src = 'https://cdn-icons-png.flaticon.com/128/15056/15056690.png'; // Strong wind icon
    }
}

function updateForecast(data) {
    const forecastContainer = document.getElementById('daily-forecast');
    forecastContainer.innerHTML = ''; // Clear previous content

    for (let i = 0; i < data.list.length; i += 8) {
        if (i / 8 >= 5) break; // Limit to 5 days

        const forecast = data.list[i];
        const day = document.createElement('div');
        day.classList.add('forecast-day');

        const date = new Date(forecast.dt * 1000).toLocaleDateString();
        const icon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
        const temp = forecast.main.temp;
        const description = forecast.weather[0].description;

        // Set background based on weather description
        let weatherCondition = forecast.weather[0].main.toLowerCase();
        
        if (weatherCondition.includes('clear')) {
            day.classList.add('sunny-day');
        } else if (weatherCondition.includes('rain')) {
            day.classList.add('rainy-day');
        } else if (weatherCondition.includes('cloud')) {
            day.classList.add('cloudy-day');
        } else if (weatherCondition.includes('snow')) {
            day.classList.add('snowy-day');
        } else if (weatherCondition.includes('mist')) {
            day.classList.add('misty-day');
        } else {
            day.classList.add('default-day'); // Default class
        }


        day.innerHTML = `

            <h3>${date}</h3>
            <img src="${icon}" alt="Weather icon">
            <p>${temp} °C</p>
            <p>${description.charAt(0).toUpperCase() + description.slice(1)}</p>
        `;
        
        forecastContainer.appendChild(day);
    }
}
