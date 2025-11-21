
document.addEventListener('DOMContentLoaded', () => {
    // --- Utility Functions ---

    const updateFooter = () => {
        document.getElementById('currentYear').textContent = new Date().getFullYear();
        document.getElementById('lastModified').textContent = document.lastModified;
    };
    
    // --- Navigation Toggle Logic ---
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');

    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('open');
        menuToggle.classList.toggle('active');
    });

    // --- Weather Data and Forecast (using async/await) ---

    const url = "https://api.openweathermap.org/data/2.5/forecast?lat=5.60&lon=-0.19&units=imperial&appid=e0c4b6911deb27b3ec822becfd0f4dc1";
    
    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    const displayWeather = (current, forecast) => {
        const weatherContainer = document.getElementById('weather');
        
        const currentIconUrl = `https://openweathermap.org/img/wn/${current.icon}@2x.png`;
        
        let htmlContent = `
            <h2>Accra Weather</h2>
            <div class="current-weather">
                <p class="weather-temp">
                    <img src="${currentIconUrl}" alt="${current.description}" class="weather-icon">
                    ${current.temp}°F 
                </p>
                <p>${current.description.toUpperCase()}</p>
                <p>Humidity: ${current.humidity}%</p>
            </div>
            
            <h3 class="forecast-title">3-Day Forecast</h3>
            <div class="forecast-grid">
        `;
        
        forecast.forEach(day => {
            const dayIconUrl = `https://openweathermap.org/img/wn/${day.icon}@2x.png`;
            htmlContent += `
                <div class="forecast-day">
                    <p class="day-name">${day.day}</p>
                    <img src="${dayIconUrl}" alt="${day.description}" class="forecast-icon">
                    <p class="temp-range">${day.temp}°F</p>
                </div>
            `;
        });
        
        htmlContent += `</div>`;
        
        weatherContainer.innerHTML = htmlContent;
    };


    const getWeatherAndForecast = async () => {
        const weatherContainer = document.getElementById('weather');
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            const currentData = data.list[0];
            const current = {
                temp: currentData.main.temp.toFixed(0),
                description: currentData.weather[0].description,
                icon: currentData.weather[0].icon,
                humidity: currentData.main.humidity
            };

            const forecastDays = [];
            const processedDates = new Set();
            
            for (let i = 1; i < data.list.length; i++) {
                const item = data.list[i];
                const day = formatDate(item.dt); 
                
                if (!processedDates.has(day)) {
                    if (forecastDays.length < 3) {
                        forecastDays.push({
                            day: day,
                            temp: item.main.temp.toFixed(0), 
                            description: item.weather[0].description,
                            icon: item.weather[0].icon
                        });
                        processedDates.add(day);
                    } else {
                        break; 
                    }
                }
            }

            displayWeather(current, forecastDays);

        } catch (error) {
            console.error('Could not fetch weather data:', error);
            weatherContainer.innerHTML = '<h2>Accra Weather</h2><p class="error">Weather data unavailable.</p>';
        }
    };


    // --- Events Section (Hardcoded Placeholder) ---

    const loadEvents = () => {
        const eventsContainer = document.getElementById('eventsContainer');
        eventsContainer.innerHTML = ''; 

        const events = [
            { name: "Q4 Business Mixer", date: "Dec 12, 2025", location: "Accra Marriott", time: "6:00 PM", link: "#" },
            { name: "Tech Startup Summit", date: "Jan 25, 2026", location: "Digital Hub", time: "9:00 AM", link: "#" },
        ];

        events.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';
            eventCard.innerHTML = `
                <h3>${event.name}</h3>
                <p class="event-date">📅 ${event.date} at ${event.time}</p>
                <p class="event-location">📍 ${event.location}</p>
                <a href="${event.link}" class="details-button">Details</a>
            `;
            eventsContainer.appendChild(eventCard);
        });
    };

    // --- Company Spotlights Section (DYNAMICALLY FETCHED from members.json) ---
    const loadSpotlights = async () => {
        const spotlightsContainer = document.getElementById('spotlightsContainer');
        spotlightsContainer.innerHTML = 'Loading spotlights...';

        const membersURL = "data/members.json";

        try {
            const response = await fetch(membersURL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const members = await response.json();

            // Filter for Gold (3) and Silver (2) members
            const filteredMembers = members.filter(member => 
                member.membershipLevel === 3 || member.membershipLevel === 2
            );

            // Shuffle and select up to 3 members
            const shuffled = filteredMembers.sort(() => 0.5 - Math.random());
            const spotlights = shuffled.slice(0, 3);
            
            spotlightsContainer.innerHTML = ''; 

            if (spotlights.length === 0) {
                spotlightsContainer.innerHTML = '<p>No Gold or Silver member spotlights available yet.</p>';
                return;
            }

            spotlights.forEach(spotlight => {
                const card = document.createElement('div');
                card.className = 'spotlight-card';
                
                // Use first 80 characters of description as the motto
                const motto = spotlight.description.substring(0, 80).trim() + (spotlight.description.length > 80 ? '...' : ''); 

                card.innerHTML = `
                    <img src="${spotlight.image}" alt="${spotlight.name} logo" loading="lazy">
                    <h4>${spotlight.name}</h4>
                    <p class="category">${spotlight.category}</p>
                    <p class="motto">"${motto}"</p>
                    <a href="directory.html" class="learn-more">Find Them</a>
                `;
                spotlightsContainer.appendChild(card);
            });

        } catch (error) {
            console.error('Could not load member spotlights:', error);
            spotlightsContainer.innerHTML = '<p class="error">Failed to load member data.</p>';
        }
    };

    // --- Initialization ---
    updateFooter();
    getWeatherAndForecast(); 
    loadEvents();
    loadSpotlights();
});