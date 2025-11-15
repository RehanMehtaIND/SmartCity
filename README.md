SmartCity+ 🌆
SmartCity+ is an interactive web dashboard that lets you explore real-time weather, air quality, and wind conditions for cities around the world. It also includes hourly forecasts, city maps, and temperature graphs — all wrapped in a sleek, glass-style interface.

🚀 Features
Search for any city and get live weather updates

View temperature in Kelvin, Celsius, or Fahrenheit

See humidity, “feels like” temperature, and wind speed/direction

Check the Air Quality Index (AQI) with PM2.5 readings and a visual gauge

Explore hourly forecasts through interactive graphs

View the city’s location directly via embedded Google Maps

Clean, modern UI built with glassmorphism styling

💻 Tech Stack
Frontend: HTML, CSS, JavaScript

APIs Used:

OpenWeatherMap API — for weather and geolocation data

Local endpoints (/aqi and /forecast) — for AQI and forecast data

Charting: Chart.js — for temperature and forecast graphs

⚙️ Installation & Setup
Clone the repository:

bash
git clone https://github.com/RehanMehtaIND/SmartCity.git
cd SmartCity
Open index.html in your web browser.

Ensure your local server is running if you plan to fetch AQI and forecast data from http://localhost:3000/.

🌐 Usage
Enter a city name in the search bar.

Press Enter to load data.

The dashboard will display:

Current temperature, humidity, and weather description

Wind speed, gusts, and direction

Air quality index (AQI) with color-coded PM2.5 gauge

Hourly forecast cards and a temperature graph

A Google Map showing the city’s location

✨ Future Improvements
Replace local AQI and forecast endpoints with live data APIs

Add widgets for UV index, sunrise/sunset times, and precipitation

Make the layout mobile-responsive with smooth animations

Allow users to compare multiple cities or save favorites

🤝 Contributing
Want to help make SmartCity+ better?

Fork this repository

Create a new branch

bash
git checkout -b feature/YourFeature
Commit your changes

bash
git commit -m "Add new feature"
Push your branch

bash
git push origin feature/YourFeature
Open a Pull Request to share your improvements

📫 Contact
Maintainer: Rehan Mehta — GitHub Profile
Found a bug or have a suggestion? Open an issue on GitHub — community feedback is always welcome!

📝 License
This project is open source. (MIT License)
