let runCron,runMonitorCron;_d69‍.w("./scraper",[["runCron",["runCron"],function(v){runCron=v}],["runMonitorCron",["runMonitorCron"],function(v){runMonitorCron=v}]]);let cron = require('node-cron');


cron.schedule('* * * * *', () => {
    console.log('running a cron every  2 minute');

    runCron();
    // runMonitorCron();
    //runSendEmailCron();
  });

// cron.schedule('* * * * *', () => {
//     console.log('running a cron every 1 minute');

//    runSendEmailCron();
//   });