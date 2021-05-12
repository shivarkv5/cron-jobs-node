const express = require("express")
const _ = require("underscore")
const async = require("async");

const db = require("./db/database");

app = express();

var cronRecord = {};

function addTask(taskName, task, frequency) {
    var lastrun = null;
    if (_.contains(Object.keys(cronRecord), taskName)) {
        lastrun = cronRecord[taskName].lastrun;
    }
    cronRecord[taskName] = {
        task: task,
        frequency: frequency,
        lastrun: lastrun
    };
}
addTask("First cron task", "taskOne", 86400);
addTask("Second cron task", "taskTwo", 97600);
addTask("Third cron task", "taskThree", 56400);


function removeTask(taskName) {
    delete cronRecord[taskName];
}

removeTask("First cron task")

function run(req, res ){
        // req and res are the express request and response objects

        // set timestamp for when cron is invoked
        var now = Date.now();

        // set up array to contain cron tasks that are ready to execute
        var scheduledTasks = [];

        _.forEach(cronRecord, function (cronRecord, taskName) {
            // check if the task is due
            if (cronRecord.lastrun === null || _checkIfTaskIsDue(cronRecord, now)) {
                scheduledTasks.push(
                    function (asyncCallback) {
                        cronRecord.task = asyncCallback ;
                        console.log("TASk DEFFF--------- " + cronRecord.task ) 
                    }
                );
            }
        });

        // if there are tasks due, run them
        if (scheduledTasks.length > 0) {
            async.parallel(scheduledTasks, function (err) {
                // cron tasks will have run
                // storeRecord();
                console.log("Due tasks are completed")
                // return callback(err);
            });
        } else {
            // no cron tasks are due
            // storeRecord();
            console.log("No tasks are pending")
            // return callback(null);
        }

        // function to check if a cron task is due to be executed
        // returns true if the cron task is due, returns false otherwise

        function _checkIfTaskIsDue(description, invokeTime) {
            // set default value of lastrun to 0
            description.lastrun = description.lastrun || 0;

            // check how long it has been since the last time
            // the task was executed
            var elapsedTime = invokeTime - description.lastrun;

            // return true if the elapsed time is greater than or
            // equal to the cron frequency 
            if (elapsedTime - description.frequency * 1000 >= 0) {
                return true;
            }

            // return false otherwise
            return false;
        }
}



// var Cron = {
//     addTask: function (taskName, task, frequency) {
//         var lastrun = null;
//         if (_.contains(Object.keys(cronRecord), taskName)) {
//             // get the last time the task was run
//             lastrun = cronRecord[taskName].lastrun;
//         }

//         cronRecord[taskName] = {
//             task: task,
//             frequency: frequency,
//             lastrun: lastrun
//         };
//         // storeRecord();
//     },

//     removeTask: function (taskName) {
//         delete cronRecord[taskName];
//     },

//     run: function (req, res, callback) {
//         // req and res are the express request and response objects

//         // set timestamp for when cron is invoked
//         var now = Date.now();

//         // set up array to contain cron tasks that are ready to execute
//         var scheduledTasks = [];

//         _.forEach(cronRecord, function (taskDefinition, taskName) {
//             // check if the task is due
//             if (taskDefinition.lastrun === null || _checkIfTaskIsDue(taskDefinition, now)) {
//                 scheduledTasks.push(
//                     function (asyncCallback) {
//                         taskDefinition.task(asyncCallback);
//                     }
//                 );
//             }
//         });

//         // if there are tasks due, run them
//         if (scheduledTasks.length > 0) {
//             async.parallel(scheduledTasks, function (err) {
//                 // cron tasks will have run
//                 storeRecord();
//                 return callback(err);
//             });
//         } else {
//             // no cron tasks are due
//             storeRecord();
//             return callback(null);
//         }

//         // function to check if a cron task is due to be executed
//         // returns true if the cron task is due, returns false otherwise

//         function _checkIfTaskIsDue(description, invokeTime) {
//             // set default value of lastrun to 0
//             description.lastrun = description.lastrun || 0;

//             // check how long it has been since the last time
//             // the task was executed
//             var elapsedTime = invokeTime - description.lastrun;

//             // return true if the elapsed time is greater than or
//             // equal to the cron frequency 
//             if (elapsedTime - description.frequency * 1000 >= 0) {
//                 return true;
//             }

//             // return false otherwise
//             return false;
//         }
//     }
// }

console.log(cronRecord)
console.log(addTask());
console.log(removeTask());
console.log(run())


app.listen(3000, (err) => {
    if (err) throw err;
    else console.log("Server running on port 3000")
});
