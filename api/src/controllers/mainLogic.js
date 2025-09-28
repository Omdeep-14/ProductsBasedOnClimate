import axios from "axios";

export const fetchWeather = async (req, res, next) => {
  try {
    const geo_api = process.env.GEO_API;
    const rapid_api = process.env.RAPID_API;

    const { city, country } = req.body;

    if (!city || !country) {
      return res.status(404).json({
        success: false,
        message: "No city or country entered",
      });
    }

    let location = `${city}, ${country}`;

    const response = await axios.get(
      "https://api.opencagedata.com/geocode/v1/json",
      {
        params: {
          q: location,
          key: geo_api,
          limit: 1,
          language: "en",
        },
      }
    );

    if (response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry;

      console.log(`lat:${lat} and lng:${lng}`);

      const options = {
        method: "GET",
        url: "https://meteostat.p.rapidapi.com/stations/nearby",
        params: {
          lat: lat,
          lon: lng,
          alt: "43",
        },
        headers: {
          "x-rapidapi-key": rapid_api,
          "x-rapidapi-host": "meteostat.p.rapidapi.com",
        },
      };

      const response1 = await axios.request(options);

      const station = response1.data.data[0]?.id || null;
      console.log(station);

      const today = new Date();
      const firstDayPrevMonth = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1
      );
      const lastDayPrevMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        0
      ); // 0th day = last day of prev month

      const start = firstDayPrevMonth.toISOString().split("T")[0];
      const end = lastDayPrevMonth.toISOString().split("T")[0];

      const option1 = {
        method: "GET",
        url: "https://meteostat.p.rapidapi.com/stations/monthly",
        params: {
          station: station,
          start: start,
          end: end,
        },
        headers: {
          "x-rapidapi-key": rapid_api,
          "x-rapidapi-host": "meteostat.p.rapidapi.com",
        },
      };

      const response2 = await axios.request(option1);
      const avgTemp = response2.data.data?.[0]?.tavg;
      const dateData = response2.data.data?.[0]?.time;

      if (!avgTemp) {
        return res.json({
          success: false,
          message: "Unable to get the climate",
        });
      }

      res.json({
        success: true,
        lat: lat,
        lng: lng,
        station: station,
        avgTemp: avgTemp,
        date: dateData,
      });
    } else {
      return res.status(404).json({ error: "Unable to get the data" });
    }
  } catch (error) {
    next(error);
  }
};
