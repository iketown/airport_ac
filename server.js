const express = require("express")
const fs = require("fs")
const app = express()
require("dotenv").config()

app.get("/country/:countryName/:keyword", (req, res) => {
  console.log("req", req.params)
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
    // console.log("filtered", filteredResults)
    filteredResults.sort((a, b) => {
      const aa = Number(a.carriers)
      const bb = Number(b.carriers)
      if (aa > bb) {
        return -1
      }
      if (aa < bb) {
        return 1
      }
      if (aa === bb) {
        if (Number(a.direct_flights) > Number(b.direct_flights)) return -1
        if (Number(a.direct_flights) < Number(b.direct_flights)) return 1
        return 0
      }
    })
    // console.log("filtered after sort", filteredResults)
    res.json(filteredResults.slice(0, 10))
  })
})
const { host, environment } = process.env

app.listen(4444, () => {
  console.log("listening on 4444")
})
