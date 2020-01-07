const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const app = express();
const DATAPATH = './public/data/';
const DATAURL = '/data/'
const PORT = 8080;

app.use(fileUpload());
app.use(express.static('public'))

app.get(DATAURL, function(req, res) {
  fs.readdir(DATAPATH, function (err, files) {
    if (err) {
      console.log('Something went wrong..');
      console.log('Unable to scan directory: ' + err);
      return;
    }
    res.write('<html><head><meta charset="UTF-8"></head><ul>')
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      res.write(`<li><a href='${DATAURL}${encodeURI(file)}' download>${file}</a></li>`);
    }
    res.write('</ul></html>')
    res.end();
  })
})


app.post('/', function(req, res) {
  if (!req.files) {
    res.send('Something went wrong..');
    console.log('Something went wrong..');
    console.log(req);
    return;
  }
  let files = req.files.files;
  if (!Array.isArray(files)) {
    files = [files];
  }
  console.log(`Total: ${files.length} file(s)`);
  res.write('<html><head><meta charset="UTF-8"></head><ul>')
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    console.log(`Saving: ${file.name}`)
    file.mv(DATAPATH + file.name, function(err) {
      if (err) {
        res.write(`<li>${file.name}: FAILED</li>`);
      } else {
        res.write(`<li><a href='${DATAURL}${encodeURI(file.name)}' download>${file.name}</a></li>`);
      }
      if (i == files.length-1) {
        res.write('</ul></html>')
        res.end();
      }
    });
  }
});

app.listen(PORT, function() {
  console.log('Express server listening on port ', PORT);
});