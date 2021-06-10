const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const compiler = require("compilex");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

var option = { stats: true };
compiler.init(option);
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/compilecode", function (req, res) {
  var code = req.body.code;
  var input = req.body.input;
  var inputRadio = req.body.inputRadio;
  var lang = req.body.lang;
  if (lang === "C" || lang === "C++") {
    if (inputRadio === "true") {
      var envData = { OS: "linux", cmd: "gcc", options: { timeout: 10000 } };
      compiler.compileCPPWithInput(envData, code, input, function (data) {
        if (data.error) {
          res.send(data.error);
        } else {
          res.send(data.output);
        }
      });
    } else {
      var envData = { OS: "linux", cmd: "gcc", options: { timeout: 10000 } };
      compiler.compileCPP(envData, code, function (data) {
        if (data.error) {
          res.send(data.error);
        } else {
          res.send(data.output);
        }
      });
    }
  }
  if (lang === "Python") {
    if (inputRadio === "true") {
      var envData = { OS: "linux" };
      compiler.compilePythonWithInput(envData, code, input, function (data) {
        res.send(data);
      });
    } else {
      var envData = { OS: "linux" };
      compiler.compilePython(envData, code, function (data) {
        res.send(data);
      });
    }
  }
});

app.get("/fullStat", function (req, res) {
  compiler.fullStat(function (data) {
    res.send(data);
  });
});

const port = process.env.PORT || 8080;

app.listen(port);

compiler.flush(function () {
  console.log("All temporary files flushed !");
});
