const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const bodyParser = require('body-parser');
const notifications = require("./notifications");
require('dotenv').config();

const port = process.env.PORT || 4000;
const emailAuthPass = process.env.EMAIL_AUTH_PASS

// parse application/json
app.use(bodyParser.json())

app.post("/webhooks/optimizely", async (req, res) => {
    console.log("webhook received = ", req.body.data);
    if (req.body.event?.indexOf("project.ruleset_updated") > -1 &&
        req.body.data[0]?.summary &&
        req.body.data[0].summary.indexOf("Production") > -1
    ) {
        console.log("ruleset updated");
        if (req.body.data[0]?.changes[2]?.property &&
            req.body.data[0].changes[2].property === "enabled"
        ) {
            const flagKey = req.body.data[0].entity.api_url.split("flags/")[1].split("/")[0];
            if (req.body.data[0].changes[2].after === true) {
                const projectID = req.body.data[0].entity.api_url.split("projects/")[1].split("/flags")[0];

                const envKey = "production";
                const flagRules = await fetchFlagRules(projectID, flagKey, envKey);
                
                const issues = checkRules(flagRules);
                const message = createMessage(flagKey, notifications.testLaunched.subject, notifications.testLaunched.body, issues)
                sendNotification(message);
            } else {
                const message = createMessage(flagKey, notifications.testPaused.subject, notifications.testPaused.body, [])
                sendNotification(message);
                // sendNotification(notifications.testPaused.subject, notifications.testPaused.subject, []);
            }
        }
    } else if (req.body.event?.indexOf("project.rule_updated") > -1) {
        console.log(req.body.data[0]);
       
        // if type is "rule" && sub_type is "a/b"
            // if rule status === "running"
        console.log("rule updated");
        if (req.body.data[0].entity.type === "rule" && req.body.data[0].entity.sub_type === "a/b") {
            const projectID = req.body.project_id;
            const flagKey = req.body.data[0].entity.name;
            const envKey = "production";
            const ruleKey = req.body.data[0].entity.name;
            const ruleIsRunning = await fetchFlagRule(projectID, flagKey, envKey, ruleKey);
            if (ruleIsRunning) {
                if (req.body.data[0].changes[1].description.indexOf("percentage") > -1) {
                    console.log("traffic allocation changed");
                    const subject = notifications.changeDuringRuntime.subject.split("<condition>").join("Traffic allocation");
                    const body = notifications.changeDuringRuntime.body.split("<condition>").join("Traffic allocation").split("<experiment_name>").join(flagKey);
                    const message = createMessage(flagKey, subject, body, [])
                    sendNotification(message);
                }
            }
        }
    }
    res.send("success")
});

app.listen(port, () => {
    console.log("app listening on port ", port);
});

async function fetchFlagRule(projectID, flagKey, envKey, ruleKey) {
    console.log(projectID, flagKey, envKey, ruleKey);
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: 'Bearer 2:Y9EOz6drYVYtc7V9sAx3rdFINmfEc-DPUu54de4r_Mg_hJb5lzuE'
        }
      };
      
      const flagRule = await fetch(`https://api.optimizely.com/flags/v1/projects/${projectID}/flags/${flagKey}/environments/${envKey}/rules/${ruleKey}`, options)
        .then(response => response.json())
        .then(response => {
            
            return response.status === "running" ? true : false;
        })
        .catch(err => {
            return "error fetching flag rules";
        });
      return flagRule;
}

async function fetchFlagRules(projectID, flagKey, envKey) {
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: 'Bearer 2:Y9EOz6drYVYtc7V9sAx3rdFINmfEc-DPUu54de4r_Mg_hJb5lzuE'
        }
      };
      
      const flagRules = await fetch(`https://api.optimizely.com/flags/v1/projects/${projectID}/flags/${flagKey}/environments/${envKey}/ruleset`, options)
        .then(response => response.json())
        .then(response => {
            return response.rules;
        })
        .catch(err => {
            return "error fetching flag rules";
        });
        return flagRules;
}

function checkRules(rules) {
    console.log("checking flag rules for  = ", rules);
    const ruleMistakes = [];
    for (let rule in rules) {
        if (rules[rule].enabled && rules[rule].type === "a/b") {
            // console.log("rule=> ", response.rules[rule]);

            if (checkTrafficAllocation(rules[rule].variations)) {
                ruleMistakes.push("Unequal traffic allocation between variants");
            }
            if (rules[rule].audience_ids.length === 0) {
                ruleMistakes.push("The test is currently targeting all users across all locales");
            }
            // for (let variation in response.rules[rule].variations) {
            //     console.log(response.rules[rule].variations[variation]);
            //     if (response.rules[rule].variations[variation].percentage_included !== (10000 / Object.keys(response.rules[rule].variations).length)) {
            //         console.log("unequal traffic allocation");
            //     } else {
            //         console.log("equal traffic allocation");
            //     }
            // }
        }
        }
    return ruleMistakes;
}

function checkTrafficAllocation(variations) {
    let unequalTrafficAllocation = false;
    for (let variation in variations) {
        // console.log(variations[variation]);
        if (variations[variation].percentage_included !== (10000 / Object.keys(variations).length)) {
            unequalTrafficAllocation = true;
        }
    }
    return unequalTrafficAllocation;
}

function createMessage(flagKey, subject, messageBody, issues) {
    let text = messageBody.split("<>").join(flagKey);
    
    if (issues.length) {
        
        text += `<br>
                <br>
                The following issues have been found: 
                <ul>`;
        issues.forEach(issue => {
            text += `<li>${issue}</li>`
        });
        text += `</ul>
        
                <br>
                <br>
                Please check these issues with the developer and request a fix if necessary
                <br>
                <br>
                Thanks!`;
    }

    const mailOptions = {
        from: 'michaeljswain@gmail.com',
        to: 'michaeljswain@gmail.com',
        subject,
        html: text
      };
    return mailOptions;
}

function sendNotification(message) {
       var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'michaeljswain@gmail.com',
                      pass: emailAuthPass
                    }
                  });
                  
                //   var mailOptions = {
                //     from: 'michaeljswain@gmail.com',
                //     to: 'michaeljswain@gmail.com',
                //     subject: messageTitle,
                //     text: messageBody
                //   };

                  console.log("mail options => ", message);
                  
                  transporter.sendMail(message, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });
}