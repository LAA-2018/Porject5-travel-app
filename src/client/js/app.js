let tripData = {};
const apiGeonames = "http://api.geonames.org/searchJSON?q=";
const key = "ab8415ecb8f9400ba416da85a56435e4";
const apiWeather = "https://api.weatherbit.io/v2.0/current?";
//const imgKay= '17833708-3436d34edf85294c8e3e571c3';
const imgKay = "17862731-7f9c2dfac68cf8f01d64cb680";
const apiImge = `https://pixabay.com/api/?key=${imgKay}&q=`;

function geteData(event) {
  event.preventDefault();
  // get information from a user
  const currentLocation = document.getElementById("current-location").value;
  const tripLocation = document.getElementById("trip-location").value;
  const date = document.getElementById("date").value;

  // send api to getApiData method to get inofrmation
  getApiData(`${apiGeonames}${tripLocation}&maxRows=10&username=goge`)
    .then((data) => {
      tripData.lat = data.geonames[0].lat;
      tripData.lng = data.geonames[0].lng;
      tripData.cityN = tripLocation;
      tripData.countryN = data.geonames[0].countryName;
      tripData.Departing = date;
      tripData.days = remainingDays(date);
      return getApiData(
        `${apiWeather}&lat=${data.geonames[0].lat}&lon=${data.geonames[0].lng}&key=${key}`
      );
    })
    .then((weatherData) => {
      tripData.temp = weatherData.data[0].temp;
      tripData.description = weatherData.data[0].weather.description;
      return tripData;
    })
    .then(() => {
      return getApiData(
        `https://pixabay.com/api/?key=${imgKay}&q=${tripLocation}&image_type=photo`
      );
    })
    .then((imgeData) => {
      tripData.img = imgeData.hits[0].webformatURL;
      return tripData;
    }).then((tripData)=>{

      return getApiData(
        `https://restcountries.eu/rest/v2/name/${tripData.countryN}`
      );
    }).then((data)=>{
      tripData.capital = data[0].capital;
      return tripData;
    })
    .then((tripData) => {
      postData(tripData);
      displayInfor(tripData);
    });
  // listening to click of "x" to close the model and delete data from HTML page

  document.querySelector(".close").addEventListener("click", () => {
    let model = document.querySelector(".model");
    model.classList.remove("showmodel");
    var List = document.querySelectorAll(".prgrap-style");
    for (let i = List.length - 1; i >= 0; i--) {
      let p = List[i];
      p.parentNode.removeChild(p);
    }
    let img = document.querySelector(".img-style");
    img.parentNode.removeChild(img);
  });
}

export { geteData };

// to send data to server
async function postData(data) {
  console.log(data);
  const req = await fetch("http://localhost:9090/api", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

// to get inofrmation fro api web
async function getApiData(url) {
  const req = await fetch(url);
  const data = await req.json();
  return data;
}

// to calculate the remaining days
function remainingDays(date) {
  let d = new Date();
  var currentDate = new Date(d);
  var tripDate = new Date(date);
  var remDays = Math.round(
    (tripDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
  );
  return remDays;
}

// to display the information to the user
function displayInfor(tripData) {
  let model = document.querySelector(".model");
  model.classList.add("showmodel");

  let center = document.querySelector(".center");
  var img = document.createElement("img");
  img.classList.add("img-style");
  img.classList.add("id", "img-city");
  img.setAttribute("src", tripData.img);
  center.appendChild(img);

  let element = document.querySelector(".content");
  var p1 = document.createElement("p");
  var p2 = document.createElement("p");
  var p3 = document.createElement("p");
  var p4 = document.createElement("p");
  var p5 = document.createElement("p");
  var p6 = document.createElement("p");
  var p7 = document.createElement("p");
  var p8 = document.createElement("p");

  p1.classList.add("prgrap-style");
  p2.classList.add("prgrap-style");
  p3.classList.add("prgrap-style");
  p4.classList.add("prgrap-style");
  p5.classList.add("prgrap-style");
  p6.classList.add("prgrap-style");
  p7.classList.add("prgrap-style");
  p8.classList.add("prgrap-style");
  // p9.classList.add("prgrap-style");
  p1.appendChild(
    document.createTextNode(
      "My Trip To: " + tripData.cityN + "," + tripData.countryN
    )
  );
  element.appendChild(p1);
  p2.appendChild(document.createTextNode("Departing: " + tripData.Departing));
  element.appendChild(p2);
  p3.appendChild(
    document.createTextNode(
      tripData.cityN +
        "," +
        tripData.countryN +
        " is " +
        tripData.days +
        " days away"
    )
  );
  element.appendChild(p3);
  p4.appendChild(
    document.createTextNode(
      "Currrent Wather is: " + tripData.temp + " C , " + tripData.description
    )
  );
  element.appendChild(p4);

  p5.appendChild(document.createTextNode(
    "Information About The Trip: "));
    element.appendChild(p5);

    p6.appendChild(document.createTextNode(
      "The country is "+tripData.countryN));
      element.appendChild(p6);

  p7.appendChild(document.createTextNode(
      "The capital of the century is "+tripData.capital));
      element.appendChild(p7);

}

