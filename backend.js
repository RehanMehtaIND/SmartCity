import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const API_KEY = "7940ea6e520c6a885f546fb54178df09bd620c8656cf855ad14eefd079e352fb";

app.get("/aqi", async (req, res) => {
    const { lat, lon } = req.query;

    const r = await fetch(`https://api.ambeedata.com/latest/by-lat-lng?lat=${lat}&lng=${lon}`, {
        headers: { 
            "x-api-key": API_KEY,
            "Content-type": "application/json"
        }
    });

    const data = await r.json();
    res.json(data);
});

app.get("/forecast", async (req, res) => {
    const { lat, lon } = req.query;

    try {
        const data = await getAmbeeForecast(lat, lon);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

async function getAmbeeForecast(lat, lon) {
    const url = `https://api.ambeedata.com/weather/forecast/by-lat-lng?lat=${lat}&lng=${lon}`;

    const res = await fetch(url, {
        headers: {
            "x-api-key": API_KEY,
            "Content-type": "application/json"
        }
    });

    if (!res.ok) throw new Error("Ambee forecast fetch failed");
    return await res.json();
}

app.listen(3000, () => console.log("Server running on 3000"));