const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const bodyParser = require('body-parser');
require('dotenv').config();

const port = process.env.PORT || 4000;
const emailAuthPass = process.env.EMAIL_AUTH_PASS

// parse application/json
app.use(bodyParser.json())

app.post("/webhooks/optimizely", (req, res) => {
    console.log("webhook received = ", req.body);
    if (req.body.event?.indexOf("project.ruleset_updated") > -1 &&
        req.body.data[0]?.summary &&
        req.body.data[0].summary.indexOf("Production") > -1
    ) {
        if (req.body.data[0]?.changes[2]?.property &&
            req.body.data[0].changes[2].property === "enabled"
        ) {
            if (req.body.data[0].changes[2].after === true) {
                sendNotification("Optimizely notification", "A new test has been launched");
            } else {
                sendNotification("Optimizely notification", "A test has been paused");
            }
        }
    }
    res.send("success")
});

app.listen(port, () => {
    console.log("app listening on port ", port);
});

function sendNotification(messageTitle, messageBody) {
       var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'michaeljswain@gmail.com',
                      pass: emailAuthPass
                    }
                  });
                  
                  var mailOptions = {
                    from: 'michaeljswain@gmail.com',
                    to: 'michaeljswain@gmail.com',
                    subject: messageTitle,
                    text: messageBody
                  };
                  
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });
}