const express = require("express");
const app = express();
const cors = require("cors");
var bodyParser = require("body-parser");
let projectData = [];

module.exports = app;
app.use(express.static("dist"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(9090, (req, res) => {
  console.log("we are listening to 9090");
});

app.get("/", function (req, res) {
  res.status(200).sendFile("dist/index.html");
});

app.post("/api", (req, res) => {
  newData = {
    lat: req.body.lat,
    lng: req.body.lng,
    cityName: req.body.cityN,
    countryName: req.body.countryN,
    temp: req.body.temp,
    description: req.body.description,
    img: req.body.img,
    capital: tripData.capital,
  };
  projectData.push(newData);
  console.log(projectData);
  res.end();
});
