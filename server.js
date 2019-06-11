const express = require("express")
const fs = require("fs")
const app = express()
require("dotenv").config()

app.get("/country/:countryName/:keyword", (req, res) => {
  const { countryName, keyword } = req.params
  let obj
  fs.readFile(`./airportCountries/${countryName}`, "utf8", function(err, data) {
    if (err) throw err
    obj = JSON.parse(data)
    const filteredResults = obj.filter(ap => {
      const searchString = keyword.toLowerCase()
      if (ap.code && ap.code.toLowerCase().includes(searchString)) return true
      if (ap.name && ap.name.toLowerCase().includes(searchString)) return true
      if (ap.city && ap.city.toLowerCase().includes(searchString)) return true
      if (ap.state && ap.state.toLowerCase().includes(searchString)) return true
    })

    filteredResults.sort((a, b) => {
      const aCarriers = Number(a.carriers)
      const bCarriers = Number(b.carriers)
      if (aCarriers > bCarriers) {
        return -1
      }
      if (aCarriers < bCarriers) {
        return 1
      }
      if (aCarriers === bCarriers) {
        if (Number(a.direct_flights) > Number(b.direct_flights)) return -1
        if (Number(a.direct_flights) < Number(b.direct_flights)) return 1
        return 0
      }
    })
    res.json(filteredResults.slice(0, 10))
  })
})
const { host, environment } = process.env

app.listen(4444, () => {
  console.log("listening on 4444")
})
