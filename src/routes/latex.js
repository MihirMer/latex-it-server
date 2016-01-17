const express = require('express');
const router 	= express.Router();
const multer  = require('multer');
const upload  = multer({dest: 'uploads/'});
const path    = require('path');
const compile = require('../latex/latex');

// POST method route
router.post('/', upload.single('zip_file'), function (req, res) {
  const filename = req.file.filename;
  const compiler = req.file.compiler || 'pdflatex';
  compile(compiler, filename)
    .then((file) => sendResultingFile(file, res))
    .catch((error) => errorHandler(error, res));
});

function sendResultingFile(file, res) {
  res.sendFile(path.resolve(file), function (err) {
    if(err) {
      console.error('Error sending the file: ' + err);
      res.status(400).send(err);
    }
  });
}

function errorHandler(error, res) {
  console.error(error);
  res.status(400).send(error);
}

module.exports = router;