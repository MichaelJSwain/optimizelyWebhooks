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
    },
    changeDuringRuntime: {
        subject: 'PVH Test Update: <condition> changed during runtime',
        body: `Hi,
                <br>
                <br>
                The <condition> condition in a rule for the server-side experiment <experiment_name> has been changed during runtime.
                Please check with the developer and request a fix if necessary.
                <br>
                <br>
                Thanks!
            `
    }
}

module.exports = notifications;