let cron = require('node-cron');
import {runCron}  from './scraper'

cron.schedule('* * * * *', () => {
    console.log('running a cron every minute');

    runCron();
    // runMonitorCron();
    //runSendEmailCron();
  });

// cron.schedule('* * * * *', () => {
//     console.log('running a cron every 1 minute');

//    runSendEmailCron();
//   });