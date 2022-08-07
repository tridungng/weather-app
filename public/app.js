const API_KEY = "3f6e48722529597aa7574949b2c5e9b9";

window.addEventListener("load", function () {
  let long;
  let lat;

  const tempDescription = document.querySelector("div.temperature-description");
  const tempDegree = document.querySelector("h2.temperature-degree");
  const degreeSymbol = document.querySelector(".degree-section span");
  const locTimezone = document.querySelector(".location-timezone");
  const userLoc = document.querySelector(".user-location");

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      lat = position.coords.latitude;
      long = position.coords.longitude;

      const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}`;

      fetch(api)
        .then(function (response) {
          return response.json();
        })
        .then((result) => {
          console.log(result);
          tempDegree.textContent = convertTemperature(
            "K",
            "C",
            result.main.temp
          ).toFixed(1);

          const degreeSpan = createElementWithTextContent("span", "\u00B0C");
          tempDegree.after(degreeSpan);

          tempDescription.textContent = result.weather[0].description;
          locTimezone.textContent = timeZoneCalc(result.timezone);
          userLoc.textContent = `${result.name}, ${result.sys.country} `;

          const weather = result.weather[0].main.toLowerCase();
          const icon = mapWeatherToIcon(weather);

          setIcon(icon, document.querySelector(".icon"));
        });
    });
  } else {
    alert("We need your geo-position to personalize your experience!");
  }
});

function createElementWithTextContent(tag, textContent) {
  const element = document.createElement(`${tag}`);
  element.textContent = textContent;

  return element;
}

function convertTemperature(currentScale, targetScale, degree) {
  if (currentScale === "K" && targetScale === "C") {
    return degree - 273.15;
  } else if (currentScale === "F") {
    return (5 / 9) * (degree - 32);
  } else if (currentScale === "C") {
    return (degree * 9) / 5 + 32;
  }
}

function timeZoneCalc(shiftInSecs) {
  const hour = shiftInSecs / 3600;
  const sign = hour >= 0 ? "+" : "-";

  return `GMT${sign}${hour}`;
}

function mapWeatherToIcon(weather) {
  switch (true) {
    case weather.includes("clear"):
      return "clear_day";
    case weather.includes("rain"):
      return "rain";
    case weather.includes("cloud"):
      return "cloudy";
    case weather.includes("snow"):
      return "snow";
    case weather.includes("thunderstorm"):
      return "rain";
  }
}

function setIcon(icon, id) {
  console.log(icon);
  const skycons = new Skycons({ color: "white" });
  const currentIcon = icon.replace(/-/g, "_").toUpperCase();
  skycons.play();
  return skycons.set(id, Skycons[currentIcon]);
}
