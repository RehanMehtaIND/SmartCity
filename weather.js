    const cityInput = document.getElementById("citySearch");
    const submitButton = document.getElementById("submit")
    const locationName = document.getElementById("mainLocation");
    const temperatureData = document.getElementById("mainTemp");
    const humidityOutput = document.getElementById("humidity_level");
    const humiditySectionOutput = document.getElementById("humidityValue");
    const extraDetails = document.getElementById("mainSummary");
    const WeatherAPI = "2dceec3cfd0de3fde73d04b7b77c6806";

    submitButton.addEventListener("click", async event =>{
        event.preventDefault();
        let city = cityInput.value

        if(city){
            try{
                const weatherData = await getWeatherData(city);
                displayWeatherInfo(weatherData);
            } catch(error){
                console.error(error);
                displayError(error)
            };
        } else{
            displayError("Enter a valid city name.")
        }
    });

        async function getWeatherData(city){
            const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WeatherAPI}`;
            const response = await fetch(apiURL);
            if (!response.ok){
                throw new Error("Couldn't fetch data.")
            }

            return await response.json();
        }

        function displayWeatherInfo(data){
            const {
                name: city,
                main: {temp, humidity},
                weather: [{description, id}]
            } = data;

            const card = document.createElement("div")
            const aside = document.querySelector(".sidebar.glass")
            card.classList.add("city-card", "glass")
            card.dataset.city = `${city}`

            card.innerHTML = `
                <div class="city-info">
                    <div>
                        <div class="city-name">${city}</div>
                        <div class="city-time" data-time-for="${city}">7:27 PM</div>
                        <div class="city-condition">${description}</div>
                    </div>
                    <div class="city-temp">${temp}</div>
                </div>`
            aside.appendChild(card)

            card.addEventListener("click", () => {
                locationName.textContent = city
                temperatureData.textContent = `${temp}K / ${Math.round((temp-273.15)*100)/100}°C / ${Math.round(((temp-273.15)*9/5 + 32)*100)/100}°F`
                humidityOutput.textContent = `Humidity: ${humidity}%`
                humiditySectionOutput.textContent = `${humidity}%`
                extraDetails.textContent = `${description} ${getWeatherEmoji(id)}`
            })
            
            locationName.textContent = city;
            temperatureData.textContent = `${temp}K / ${Math.round((temp-273.15)*100)/100}°C / ${Math.round(((temp-273.15)*9/5 + 32)*100)/100}°F`;
            humidityOutput.textContent = `Humidity: ${humidity}%`;
            humiditySectionOutput.textContent = `${humidity}%`
            extraDetails.textContent = `${description} ${getWeatherEmoji(id)}`;
        }

        function getWeatherEmoji(weatherId){
            switch(true){
                case (weatherId >= 200 && weatherId < 300):
                    return "⛈️"  
                case (weatherId >= 300 && weatherId < 400):
                    return "🌦️"  
                case (weatherId >= 500 && weatherId < 600):
                    return "🌧️"  
                case (weatherId >= 600 && weatherId < 700):
                    return "❄️"  
                case (weatherId >= 700 && weatherId < 800):
                    return "🌫️"  
                case (weatherId === 800):
                    return "☀️"  
                case (weatherId > 800 && weatherId < 900):
                    return "☁️"  
                default:
                    return "🌍"
            }
        }

        function displayError(msg){
            alert(msg);
            cityInput.value = "";
        }

        // <div class="city-card glass" data-city="Bengaluru">
        //         <div class="city-info">
        //             <div>
        //                 <div class="city-name">Bengaluru</div>
        //                 <div class="city-time" data-time-for="Bengaluru">7:27 PM</div>
        //                 <div class="city-condition">Clear</div>
        //             </div>
        //             <div class="city-temp">23°</div>
        //         </div>
        //         <div style="display:flex;justify-content:space-between;margin-top:15px;font-size:0.8rem;color:#94a3b8">
        //             <span>H:27° L:17°</span>
        //         </div>
        //     </div>

//         const card = document.createElement("div")
// card.classList.add("city-card", "glass")
// card.dataset.city = "Bengaluru"

// card.innerHTML = `
//     <div class="city-info">
//         <div>
//             <div class="city-name">Bengaluru</div>
//             <div class="city-time" data-time-for="Bengaluru">7:27 PM</div>
//             <div class="city-condition">Clear</div>
//         </div>
//         <div class="city-temp">23°</div>
//     </div>

//     <div style="display:flex;justify-content:space-between;margin-top:15px;font-size:0.8rem;color:#94a3b8">
//         <span>H:27° L:17°</span>
//     </div>
// `

// document.body.appendChild(card)