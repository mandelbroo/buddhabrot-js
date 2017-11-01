const express = require('express')
const app = express()
const path = require('path')

app.use('/public',
  express.static(path.resolve(__dirname, './public')))

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public/index.html'))
})

app.listen(9000, () => console.log('running on http://localhost:9000'))
