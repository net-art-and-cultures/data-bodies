const express = require('express')
const bodyParser= require('body-parser')
const multer = require('multer');
app.use(bodyParser.urlencoded({extended: true}))

const app = express()
const port = process.argv[2] || 8000

app.get('/',function(req,res){
  res.sendFile(__dirname + '/index.html');

});


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({ storage: storage })

app.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
  const files = req.files
  if (!files) {
    const error = new Error('Please choose files')
    error.httpStatusCode = 400
    return next(error)
  }

    res.send(files)

})

app.post('/api/profile-info', (req, res) => {
    var img = fs.readFileSync(req.file.path);


  })
})

app.get('/api/profile-info', (req, res) => {

   if (err) return console.log(err)
   res.send(imgArray)

  })
});

app.listen(port,() => {
  console.log('listening on http://localhost8000')
})
