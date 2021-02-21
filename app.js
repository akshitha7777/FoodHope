const express = require('express');
const axios = require('axios')
const fetch = require("node-fetch");
const env = require("dotenv").config();



const key = process.env.GOOGLE_API_KEY

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static(__dirname + '/public'));

var _location = ''

app.get('/donate', (req,res,next)=>{
  fetch('https://extreme-ip-lookup.com/json/')
  .then( resp => resp.json())
  .then( async response => {
    console.log(response);
    let location = response.lat + ', ' + response.lon;
    _location = location
   })
   .catch((data, status) => {
      console.log('Request failed');
   })
next();
})
app.get('/', (req,res) => {
    res.sendFile(__dirname + "/public/FoodHope.html");
});



app.get('/donate', (req,res)=>{
  res.render('FoodHope2')
})

app.post('/nearby', async (req,res)=>{
  const {data} = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=ngo&location=${_location}&radius=10000&key=${key}`)
  res.json(data)
})

app.get('/details&place_id=:place_id', async (req,res)=>{
  var place_id = req.params.place_id;
  const {data} = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name,formatted_address,website,formatted_phone_number&key=${key}`)
  res.json(data)
})

app.get('/undefined',(req,res)=>{
  res.send('The NGO does not have a website')
})

let port = process.env.PORT || 80;
var server = app.listen(port)
