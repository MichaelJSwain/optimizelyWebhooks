const express = require("express");
const app = express();
const bodyParser = require('body-parser')

// parse application/json
app.use(bodyParser.json())

app.post("/optimizely/webhooks", (req, res) => {
    console.log("webhook received = ", req.body);
    if (req.body.event?.indexOf("project.ruleset_updated") > -1 &&
        req.body.data[0]?.summary &&
        req.body.data[0].summary.indexOf("Production") > -1
    ) {
        if (req.body.data[0]?.changes[2]?.property &&
            req.body.data[0].changes[2].property === "enabled"
        ) {
            if (req.body.data[0].changes[2].after === true) {
                console.log("experiment ENABLED!");
            } else {
                console.log("experiment PAUSED!");
            }
        }
    }

});

app.listen(3000, () => {
    console.log("app listening on port 3000");
});