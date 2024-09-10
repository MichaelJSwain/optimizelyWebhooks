const notifications = {
    testLaunched: {
        subject: "PVH Test Update: Test Launched",
        body: `Hi, 
                <br>
                <br>
                The server-side test <strong><></strong> has launched to the production environment.`
    },
    testPaused: {
        subject: "PVH Test Update: Test Paused",
        body: `Hi, 
                <br>
                <br>
                The server-side test <strong><></strong> has been paused in the production environment.`
    }
}

module.exports = notifications;