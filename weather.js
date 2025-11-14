const cityInput = document.getElementById("citySearch")
const submitButton = document.getElementById("submit")
const locationName = document.getElementById("mainLocation")
const temperatureData = document.getElementById("mainTemp")
const humidityOutput = document.getElementById("humidity_level")
const humiditySectionOutput = document.getElementById("humidityValue")
const extraDetails = document.getElementById("mainSummary")
const aqiValue = document.getElementById("aqiValue")
const feelslikevalue = document.getElementById("feelsLikeValue")
const windSpeedEl = document.getElementById("windSpeed")
const windGustsEl = document.getElementById("windGusts")
const windDirectionEl = document.getElementById("windDirection")
const windIconEl = document.getElementById("windIcon")

const WeatherAPI = "2dceec3cfd0de3fde73d04b7b77c6806"

submitButton.addEventListener("click", async function(e) {
    e.preventDefault()
    const city = cityInput.value

    if (!city) return alert("Enter a valid city name.")

    try {
        const weather = await getWeatherData(city)
        displayWeatherInfo(weather)
    } catch(err) {
        console.log(err)
        alert("Something went wrong.")
    }
})

async function getWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WeatherAPI}`
    const r = await fetch(url)

    if (!r.ok) throw new Error("Failed to fetch weather")
    return await r.json()
}

async function getCoords(city) {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${WeatherAPI}`
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
    const wind = data.wind
    const coords = await getCoords(city)
    const lat = coords.lat
    const lon = coords.lon
    const aq = await fetch(`http://localhost:3000/aqi?lat=${lat}&lon=${lon}`).then(r=>r.json())
    const forecast = await fetch(`http://localhost:3000/forecast?lat=${lat}&lon=${lon}`).then(r=>r.json())

    updateMainScreen(city, temp, humidity, description, id, wind, aq, forecast)
    addCityCard(city, temp, description, id, aq, forecast, wind)
}

function addCityCard(city, temp, description, id, aq, forecast, wind) {
    const aside = document.querySelector(".sidebar.glass")
    let existingCard = aside.querySelector(`[data-city="${city}"]`)
    if (existingCard) return
    const card = document.createElement("div")
    card.classList.add("city-card", "glass")
    card.dataset.city = city
    card.innerHTML = `<div class="city-info"><div><div class="city-name">${city}</div><div class="city-time" data-time-for="${city}">--:--</div><div class="city-condition">${description}</div></div><div class="city-temp">${Math.round(temp - 273.15)}°C</div></div>`
    aside.appendChild(card)
    card.addEventListener("click", function() {
        updateMainScreen(city, temp, 0, description, id, wind, aq, forecast)
    })
}

function updateMainScreen(city, temp, humidity, description, id, wind, aq, forecast) {
    locationName.textContent = city
    const c = Math.round(temp - 273.15)
    const f = Math.round((temp - 273.15) * 9/5 + 32)
    temperatureData.textContent = `${temp}K / ${c}°C / ${f}°F`
    feelslikevalue.textContent = `${c}°C`
    humidityOutput.textContent = `Humidity: ${humidity}%`
    humiditySectionOutput.textContent = `${humidity}%`
    extraDetails.textContent = `${description} ${getWeatherEmoji(id)}`

    if (aq.stations && aq.stations[0]) {
        const currentAQI = aq.stations[0].AQI
        aqiValue.textContent = `AQI: ${currentAQI}, PM2.5: ${aq.stations[0].PM25}`
        updateAQIGauge(currentAQI)
    }

    const windSpeedKph = msToKph(wind.speed)
    const windGustKph = wind.gust ? msToKph(wind.gust) : windSpeedKph
    const windDir = degToDirection(wind.deg)
    windSpeedEl.innerHTML = `${windSpeedKph}<span class="widget-value-small">kph</span>`
    windGustsEl.textContent = `Gusts: ${windGustKph} kph`
    windDirectionEl.textContent = `Direction: ${windDir} (${wind.deg}°)`
    windIconEl.style.transform = `rotate(${wind.deg}deg)`
    const mapIframeCont = document.querySelector(".map-iframe-container")
    mapIframeCont.innerHTML = `<iframe class="map-iframe" id="mapFrame" src="https://www.google.com/maps?q=${city}&output=embed" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
    displayHourlyForecast(forecast)
}

function msToKph(ms) { return Math.round(ms * 3.6) }
function degToDirection(deg) {
    const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"]
    return dirs[Math.round(deg / 22.5) % 16]
}

function getWeatherEmoji(id) {
    switch(true) {
        case (id >= 200 && id < 300):
            return "⛈️"
        case (id >= 300 && id < 400):
            return "🌦️"
        case (id >= 500 && id < 600):
            return "🌧️"
        case (id >= 600 && id < 700):
            return "❄️"
        case (id >= 700 && id < 800):
            return "🌫️"
        case (id === 800):
            return "☀️"
        case (id > 800 && id < 900):
            return "☁️"
        default:
            return "🌍"
    }
}

function updateAQIGauge(aqi){
    const gaugeEl = document.getElementById("aqiIndicator")
    const clampedAQI = Math.max(0, Math.min(aqi, 500))
    const percent = (clampedAQI / 500) * 100
    gaugeEl.style.left = `${percent}%`

    if (aqi <= 50){
        gaugeEl.style.backgroundColor = "green"
    }else if (aqi <= 100){
        gaugeEl.style.backgroundColor = "yellow"
    }else if (aqi <= 150){
        gaugeEl.style.backgroundColor = "orange"
    }else if (aqi <= 200){
        gaugeEl.style.backgroundColor = "red"
    }else if (aqi <= 300){
        gaugeEl.style.backgroundColor = "purple"
    }else{
        gaugeEl.style.backgroundColor = "maroon"
    }
}

function displayHourlyForecast(forecast) {
    const cont = document.getElementById("hourlyForecastContainer")
    cont.innerHTML = ""

    if (!forecast || !forecast.data) return

    let hours = forecast.data.forecast || forecast.data.hours || forecast.data || []
    const sliced = hours.slice(0, 24)

    sliced.forEach(h => {
        const div = document.createElement("div")
        div.classList.add("hour-card")
        const timeStr = new Date(h.time).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})
        const kelvin = h.temperature || (h.main && h.main.temp)
        const c = kelvin ? Math.round(kelvin - 273.15) : "--"
        div.innerHTML = `<div>${timeStr}</div><div>${c}°C</div>`
        cont.appendChild(div)
    })
    
    drawGraph(sliced)
}

let graph
function drawGraph(hourly) {
    const context = document.getElementById("weatherGraph").getContext("2d")
    const labels = hourly.map(h => new Date(h.time).toLocaleTimeString([], {hour:"2-digit"}))

    const temps = hourly.map(h => {
        const kelvin = h.temperature || (h.main && h.main.temp)
        return kelvin ? Math.round(kelvin - 273.15) : null
    })

    if (graph) graph.destroy()
    graph = new Chart(context, {
        type: "line",
        data: { labels, datasets:[{label:"Hourly Temperature (°C)",data:temps,borderWidth:3,tension:0.3}]},
        options:{responsive:true,scales:{y:{beginAtZero:false}}}
    })
}

function displayError(msg) {
    alert(msg)
    cityInput.value = ""
}