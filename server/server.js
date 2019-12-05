const express = require('express')

const app = express()

const port = Number(process.argv[2]) || 8000

const staticFiles = express.static(`${__dirname}/www`)

app.use(staticFiles)

app.post(/api/image-uploaded)
app.get(/api/images)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}, CTRL + C to shutdown`)
})
