const cityInput = document.getElementById("citySearch")
const submitButton = document.getElementById("submit")
const locationName = document.getElementById("mainLocation")
const temperatureData = document.getElementById("mainTemp")
const humidityOutput = document.getElementById("humidity_level")
const humiditySectionOutput = document.getElementById("humidityValue")
const extraDetails = document.getElementById("mainSummary")
const aqiValue = document.getElementById("aqiValue")
const feelslikevalue = document.getElementById("feelsLikeValue")

const WeatherAPI = "2dceec3cfd0de3fde73d04b7b77c6806"

submitButton.addEventListener("click", async function(e) {
    e.preventDefault()
    const city = cityInput.value
    if (city === "") {
        displayError("Enter a valid city name.")
        return
    }

    try {
        const weather = await getWeatherData(city)
        displayWeatherInfo(weather)
    } catch (err) {
        console.log(err)
        displayError("Something went wrong.")
    }
})

async function getWeatherData(city) {
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + WeatherAPI
    const r = await fetch(url)
    if (!r.ok) throw new Error("Failed to fetch weather")
    return await r.json()
}

async function getCoords(city) {
    const url = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + WeatherAPI
    const r = await fetch(url)
    const d = await r.json()
    return { lat: d[0].lat, lon: d[0].lon }
}

async function displayWeatherInfo(data) {
    const city = data.name
    const temp = data.main.temp
    const humidity = data.main.humidity
    const description = data.weather[0].description
    const id = data.weather[0].id

    const aside = document.querySelector(".sidebar.glass")
    const card = document.createElement("div")
    card.classList.add("city-card", "glass")
    card.dataset.city = city

    const coords = await getCoords(city)
    const lat = coords.lat
    const lon = coords.lon

    const aq = await fetch("http://localhost:3000/aqi?lat=" + lat + "&lon=" + lon).then(r => r.json())
    const forecast = await fetch("http://localhost:3000/forecast?lat=" + lat + "&lon=" + lon).then(r => r.json())

    const mapIframeCont = document.querySelector(".map-iframe-container")
    mapIframeCont.innerHTML = ""
    const frame = document.createElement("iframe")
    frame.classList.add("map-iframe")
    frame.id = "mapFrame"
    frame.src = "https://www.google.com/maps?q=" + city + "&output=embed"
    frame.allowFullscreen = ""
    frame.loading = "lazy"
    frame.referrerPolicy = "no-referrer-when-downgrade"
    mapIframeCont.appendChild(frame)

    card.innerHTML = `
        <div class="city-info">
            <div>
                <div class="city-name">${city}</div>
                <div class="city-time" data-time-for="${city}">--:--</div>
                <div class="city-condition">${description}</div>
            </div>
            <div class="city-temp">${Math.round((temp - 273.15) * 100) / 100}°C</div>
        </div>
    `

    aside.appendChild(card)

    card.addEventListener("click", function() {
        updateMainScreen(city, temp, humidity, description, id, aq, forecast)
    })

    updateMainScreen(city, temp, humidity, description, id, aq, forecast)
}

function updateMainScreen(city, temp, humidity, description, id, aq, forecast) {
    locationName.textContent = city

    const c = Math.round((temp - 273.15) * 100) / 100
    const f = Math.round(((temp - 273.15) * 9 / 5 + 32) * 100) / 100

    temperatureData.textContent = temp + "K / " + c + "°C / " + f + "°F"
    feelslikevalue.textContent = c + "°C"
    humidityOutput.textContent = "Humidity: " + humidity + "%"
    humiditySectionOutput.textContent = humidity + "%"
    extraDetails.textContent = description + " " + getWeatherEmoji(id)
    aqiValue.textContent = "AQI: " + aq.stations[0].AQI + ", PM2.5: " + aq.stations[0].PM25

    displayHourlyForecast(forecast)

    const mapIframeCont = document.querySelector(".map-iframe-container")
    mapIframeCont.innerHTML = ""
    const frame = document.createElement("iframe")
    frame.classList.add("map-iframe")
    frame.id = "mapFrame"
    frame.src = "https://www.google.com/maps?q=" + city + "&output=embed"
    frame.allowFullscreen = ""
    frame.loading = "lazy"
    frame.referrerPolicy = "no-referrer-when-downgrade"
    mapIframeCont.appendChild(frame)
}

function displayHourlyForecast(forecast) {
    const cont = document.getElementById("hourlyForecastContainer")
    cont.innerHTML = ""

    let hours = []

    if (Array.isArray(forecast.data)) hours = forecast.data
    else if (forecast.data && forecast.data.forecast) hours = forecast.data.forecast
    else if (forecast.data && forecast.data.hours) hours = forecast.data.hours
    else if (forecast.stations && forecast.stations[0] && forecast.stations[0].forecasts) hours = forecast.stations[0].forecasts
    else return

    const sliced = hours.slice(0, 24)

    sliced.forEach(function(h) {
        const div = document.createElement("div")
        div.classList.add("hour-card")

        const timeStr = new Date(h.time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })

        const kelvin = h.temperature || (h.main && h.main.temp)
        const c = kelvin ? Math.round(kelvin - 273.15) : "--"

        div.innerHTML = `
            <div>${timeStr}</div>
            <div>${c}°K</div>
        `
        cont.appendChild(div)
    })

    drawGraph(sliced)
}

function getWeatherEmoji(id) {
    switch (true) {
        case id >= 200 && id < 300: return "⛈️"
        case id >= 300 && id < 400: return "🌦️"
        case id >= 500 && id < 600: return "🌧️"
        case id >= 600 && id < 700: return "❄️"
        case id >= 700 && id < 800: return "🌫️"
        case id === 800: return "☀️"
        case id > 800 && id < 900: return "☁️"
        default: return "🌍"
    }
}

function displayError(m) {
    alert(m)
    cityInput.value = ""
}

let graph

function drawGraph(hourly) {
    const context = document.getElementById("weatherGraph").getContext("2d")

    const labels = hourly.map(h =>
        new Date(h.time).toLocaleTimeString([], { hour: "2-digit" })
    )

    const temps = hourly.map(h => {
        const kelvin = h.temperature || (h.main && h.main.temp)
        return Math.round(kelvin - 273.15)
    })

    if (graph) graph.destroy()

    graph = new Chart(context, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "Hourly Temperature (°C)",
                data: temps,
                borderWidth: 3,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: false }
            }
        }
    })
}