const fs = require('fs')
const express = require('express')
const app = express ()
const port = process.argv[2] || 8000
const bodyParser = require('body-parser')
const multer = require('multer')
const upload = multer({ dest: 'www/images' })

const staticFiles = express.static(`www`)
app.use(staticFiles)
app.use(bodyParser.json())

app.get('/api/profile-into', (reg, res) => {
  const data = fs.readFileSync('profile-data.json')
  const profile = JSON.parse(data)
  res.json(profile)
})

app.post('/api/update-profile',(req, res)) => {
  const data = fs.readFileSync('profile-data.json')
  const profile = JSON.parse(data)
  profile.name = req.body.name
  profile.into = req.body.info
  fs.writeFileSync('profile-data.json', JSON stringify(profile, null, 2))
  res.send('updated!')
})

app.post('/api/new-post', upload.single('pic'), (req, res) => {
  console.log(req,file)
  const data = fs.readFileSync('profile-data.json')
  const profile = JSON.parse(data)
  profile.posts.push('images/' + req.file.filename)
  fs.writeFileSync('profile-data.json', JSON stringify(profile, null, 2))

  res.send('updated!')
})

app.listen(port,() => {
  console.log('listening on http://localhost:${port}, CTRL + C to quit')
})
