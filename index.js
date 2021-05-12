const express = require('express');
const cron = require('node-cron');
const _ = require("underscore");


app = express();

app.get('/cron', function (req, res) {
    sendNewsletter();
    doBackup();
    processImages();
});


// define tasks to be run periodically
function taskOne(callback) {
    // perform some actions and then return a callback with status
    return callback(err);
}

function taskTwo(callback) {
    // perform computations
    return callback(err);
}

/* set up the object to keep track of the cron system
 * the object will have the format
 * {
 *  taskName: {task: <task>, frequency: <frequency>, lastrun: <time task was last run> }
 * }
 */



var cronRecord = {};

var Cron = {
    addTask: function (taskName, task, frequency) {
        var lastrun = null;

        //  you should probably do some validation of your arguments
        //  to ensure "task" is really a function and
        //  "frequency" is a time period in the appropriate units
        //  e.g. seconds

        //  let's check if the taskName already exists.
        //  if so, just update the properties


        if (_.contains(Object.keys(cronRecord), taskName)) {
            // get the last time the task was run
            lastrun = cronRecord[taskName].lastrun;
        }

        cronRecord[taskName] = {
            task: task,
            frequency: frequency,
            lastrun: lastrun
        };
    },
    removeTask: function (taskName) {
        delete cronRecord[taskName];
    }
};

// set function "taskOne" to run daily
Cron.addTask("First cron task", taskOne, 86400);

// set function "taskTwo" to run weekly
Cron.addTask("Second cron task", taskTwo, 604800);

// modify period of "First cron task" from daily to hourly
Cron.addTask("first cron task", taskOne, 3600);

// remove "First cron task" from cron
Cron.removeTask("First cron task");

app.listen(3000, (err)=>{
    if(err) throw err;
    else console.log("Server running on port 3000")
} );
