# SmartCity+ 🌆

SmartCity+ is an interactive web dashboard that lets you explore real-time weather, air quality, and wind conditions for cities around the world. It also includes hourly forecasts, city maps, and temperature graphs — all in a sleek, glass-style interface.

---

## 🚀 Features

- Search for any city and get live weather updates  
- View temperature in Kelvin, Celsius, or Fahrenheit  
- See humidity, feels-like temperature, and wind speed/direction  
- Check the Air Quality Index (AQI) with PM2.5 readings and a visual gauge  
- Explore hourly forecasts through interactive graphs  
- View the city’s location directly via embedded Google Maps  
- Clean, modern UI with glassmorphism styling  

---

## 💻 Tech Stack

- **Frontend:** HTML, CSS, JavaScript  
- **APIs Used:**  
  - [OpenWeatherMap API](https://openweathermap.org/api) — Weather and geolocation data  
  - Local endpoints (`/aqi` and `/forecast`) — AQI and forecast data  
- **Charting:** [Chart.js](https://www.chartjs.org/) — Temperature and forecast graphs  

---

## ⚙️ Installation & Setup

1. Clone the repository  
git clone https://github.com/RehanMehtaIND/SmartCity.git
cd SmartCity

text
2. Open `index.html` in your web browser.  
3. Make sure your local server is running if you plan to fetch AQI and forecast data from `http://localhost:3000/`.

---

## 🌐 Usage

1. Enter a city name in the search bar.  
2. Press `Enter` to fetch data.  
3. The dashboard will display:  
- Current temperature, humidity, and weather description  
- Wind speed, gusts, and direction  
- Air quality index (AQI) with color-coded PM2.5 gauge  
- Hourly forecast cards and temperature graph  
- Google Map with the city location  

---

## ✨ Future Improvements

- Connect to live AQI and forecast APIs  
- Add widgets for UV index, sunrise/sunset times, and precipitation  
- Improve mobile responsiveness and animations  
- Allow users to compare or save favorite cities  

---

## 🤝 Contributing

1. Fork the repository  
2. Create a new branch  
git checkout -b feature/YourFeature

text
3. Commit your changes  
git commit -m "Add feature"

text
4. Push to your branch  
git push origin feature/YourFeature

text
5. Open a Pull Request  

---

## 📫 Contact

**Maintainer:** [Rehan Mehta](https://github.com/RehanMehtaIND)  
Found a bug or have an idea? Open an issue on GitHub to share feedback or suggestions.

---

## 📝 License

This project is open source. (License: MIT)
