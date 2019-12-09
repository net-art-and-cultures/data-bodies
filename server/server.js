const express = require('express')

const app = express()

const port = Number(process.argv[2]) || 8000

const staticFiles = express.static('${__dirname}www')

const fs = require('fs')

const multer = require('multer')
const upload = multer({ dest; 'www/uploads/' })

app.use(staticFiles)

app.use((req, res, next)) => {
  res.header('Acccess-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'GET, Post, PUT, DELETE, OPTIONS')
  next()
})

app.post('/api/image-upload', uplpad.single('image'), (req, res) => {

  res.json({ message: 'ok' })
})


app.get('/api/images', (req, res) => {
  fs.readdir('www/uploads', (err, files) => {
    if (err) {
      console.log('there was an error', err)
    } else {
      for (let i = 0; i < files.length; i++) {
        files[i] = 'uploads/' + files[i]
      }
      res.json(files)
    }
  })
})

app.listen(port, () => {
  console.log('Server running at http://localhost:${port}, CTRL + to shutdown')
})
