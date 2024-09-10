const express = require("express");
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

const port = process.env.PORT || 4000;

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
                console.log("experiment ENABLED!");
            } else {
                console.log("experiment PAUSED!");
            }
        }
    }

});

app.listen(port, () => {
    console.log("app listening on port ", port);
});