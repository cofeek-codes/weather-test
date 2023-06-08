const { default: axios } = require('axios')
const express = require('express')
let dotenv = require('dotenv').config()
const fetch = require('node-fetch')
const app = express()
const port = 8080

const fetchWeatherByCity = async city => {
	let capitalize = s => (s = s.charAt(0).toUpperCase() + s.slice(1))
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${capitalize(
		city
	)}&appid=${process.env.API_KEY}&units=metric`

	const res = await axios.get(url)
	return { status: res.status, data: res.data, st: res.statusText }
}
// city route
app.get('/city', (req, res) => {
	res.set('Access-Control-Allow-Origin', '*')
	fetchWeatherByCity(req.query.city)
		.then(r => {
			let pr = prettify(r)
			res.send(pr)
		})
		.catch(e => res.send(e))
})

const prettify = data => {
	let parsedData = data.data
	const { temp } = parsedData.main
	const place = parsedData.name
	const { description, icon } = parsedData.weather[0]
	const { sunrise, sunset } = parsedData.sys
	// данные вытащенные из json для последующего вывода

	const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`
	const celcium = Math.round(temp)
	// конвертирование в формат GMT
	const sunriseGMT = new Date(sunrise * 1000)
	const sunsetGMT = new Date(sunset * 1000)
	console.log({
		celcium,
		place,
		description,
		icon,
		sunriseGMT,
		sunsetGMT,
		iconUrl,
	})
	return { celcium, place, description, icon, sunriseGMT, sunsetGMT, iconUrl }
}

const fetchWeatherByCoords = async (long, lat) => {
	const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${process.env.API_KEY}&units=metric`

	const res = await axios.get(url)
	return { status: res.status, data: res.data, st: res.statusText }
}

app.get('/coords', (req, res) => {
	res.set('Access-Control-Allow-Origin', '*')
	fetchWeatherByCoords(req.query.long, req.query.lat)
		.then(r => {
			let pr = prettify(r)
			res.json(pr)
		})
		.catch(console.log)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
