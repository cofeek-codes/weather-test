const { default: axios } = require('axios')
const express = require('express')
let dotenv = require('dotenv').config()
const fetch = require('node-fetch')
const app = express()
const port = 4200

const fetchWeather = async () => {
	const res = await axios.get(process.env.API_URL)
	return { status: res.status, data: res.data, st: res.statusText }
}

app.get('/', (req, res) => {
	fetchWeather()
		.then(r => {
			let pr = prettify(r)
			res.send(pr)
		})
		.catch(console.log)
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const prettify = data => {
	let parsedData = data['data']['$return_value']
	const { temp } = parsedData.main
	const place = parsedData.name
	const { description, icon } = parsedData.weather[0]
	const { sunrise, sunset } = parsedData.sys
	// данные вытащенные из json для последующего вывода

	const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`
	const celcium = Math.round(temp - 273)

	// конвертирование в формат GMT
	const sunriseGMT = new Date(sunrise * 1000)
	const sunsetGMT = new Date(sunset * 1000)

	return { celcium, place, description, icon, sunriseGMT, sunsetGMT, iconUrl }
}
