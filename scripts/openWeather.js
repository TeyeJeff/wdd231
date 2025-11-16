// select HTML elements in the document
const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('figcaption');

// Note: API key is sensitive. For production, use environment variables.
const url  = "https://api.openweathermap.org/data/2.5/weather?lat=49.75&lon=6.64&units=imperial&appid=e0c4b6911deb27b3ec822becfd0f4dc1";
// I added `&units=imperial` to get Fahrenheit. Change to `&units=metric` for Celsius.

async function apiFetch(url) {
      try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log(data); // testing only
      displayResults(data);
    } else {
        throw Error(await response.text());
    }
  } catch (error) {
      console.log(error);
  }
}

apiFetch(url);


function displayResults(data) {
    // 1. Display Temperature
    // Use toFixed(0) to round the temperature to a whole number.
    currentTemp.innerHTML = `${data.main.temp.toFixed(0)}&deg;F`;

    // 2. Prepare Icon URL and Description
    const iconsrc = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    const desc = data.weather[0].description;
    
    // Capitalize the first letter of each word in the description
    const capitalizedDesc = desc.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    // 3. Display Icon and Description
    weatherIcon.setAttribute('src', iconsrc);
    weatherIcon.setAttribute('alt', capitalizedDesc + ' icon');
    captionDesc.textContent = capitalizedDesc;
}