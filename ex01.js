const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello Kitsada')
})

app.listen(port, () => {
  console.log(`on port ${port}`)
  console.log('IT CHAIYAPHUM')
})