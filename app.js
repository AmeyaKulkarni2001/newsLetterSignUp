const express = require("express");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_feilds: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };
  const jsonData = JSON.stringify(data);
  const url = process.env.URL;
  const options = {
    method: "POST",
    auth: process.env.AUTH
  };
  const request = https.request(url, options, function(response) {
    if(response.statusCode === 200){
      res.sendFile(__dirname+"/success.html");
    } else{
      res.sendFile(__dirname+"/faliure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/faliure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
});

