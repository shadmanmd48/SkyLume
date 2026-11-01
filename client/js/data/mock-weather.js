/**
 * @file mock-weather.js
 * @description Baseline mock weather forecast data for Chennai, India.
 * Serves as the template schema returned by weather endpoints.
 */

export const mockWeather = {
  city: "Chennai",
  country: "India",
  region: "Tamil Nadu",
  localTime: "11:22 PM",
  isNight: true,

  // Current weather conditions
  current: {
    tempC: 29,
    feelsLikeC: 32,
    highC: 33,
    lowC: 26,
    condition: "Partly Cloudy",
    icon: "⛅",
    humidity: 68,
    windKmh: 14,
    windDir: "E",
    rainChance: 11,
    visibilityKm: 9,
    uv: 8,
    uvLabel: "High",
    sunrise: "5:54 AM",
    sunset: "6:12 PM"
  },

  // Hourly forecast strip (12 items)
  hourly: [
    { time: "Now", tempC: 29, rain: 11, icon: "🌧️" },
    { time: "12 AM", tempC: 28, rain: 18, icon: "🌧️" },
    { time: "1 AM", tempC: 28, rain: 25, icon: "🌧️" },
    { time: "2 AM", tempC: 28, rain: 13, icon: "🌧️" },
    { time: "3 AM", tempC: 28, rain: 20, icon: "🌧️" },
    { time: "4 AM", tempC: 28, rain: 27, icon: "🌧️" },
    { time: "5 AM", tempC: 28, rain: 15, icon: "🌧️" },
    { time: "6 AM", tempC: 29, rain: 22, icon: "⛅" },
    { time: "7 AM", tempC: 30, rain: 29, icon: "⛅" },
    { time: "8 AM", tempC: 30, rain: 17, icon: "⛅" },
    { time: "9 AM", tempC: 31, rain: 24, icon: "☀️" },
    { time: "10 AM", tempC: 32, rain: 12, icon: "☀️" }
  ],

  // 5-day daily forecast
  daily: [
    { day: "Today", date: "Oct 26", highC: 33, lowC: 26, condition: "Partly Cloudy", rain: 15, icon: "⛅" },
    { day: "Tue", date: "Oct 27", highC: 34, lowC: 27, condition: "Partly Cloudy", rain: 15, icon: "⛅" },
    { day: "Wed", date: "Oct 28", highC: 32, lowC: 26, condition: "Clear", rain: 5, icon: "☀️" },
    { day: "Thu", date: "Oct 29", highC: 35, lowC: 27, condition: "Cloudy", rain: 35, icon: "☁️" },
    { day: "Fri", date: "Oct 30", highC: 31, lowC: 25, condition: "Rain", rain: 70, icon: "🌧️" }
  ]
};

// Initial default saved cities list for cold start
export const mockSaved = [
  { id: "chennai", city: "Chennai", tempC: 29, icon: "⛅" },
  { id: "lisbon", city: "Lisbon", tempC: 24, icon: "🌤️" },
  { id: "tokyo", city: "Tokyo", tempC: 21, icon: "☁️" }
];
