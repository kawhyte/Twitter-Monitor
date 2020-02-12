let cron = require('node-cron');
import {runCron, runMonitorCron, runSendEmailCron}  from './scraper'

cron.schedule('*/2 * * * *', () => {
    console.log('running a cron every  2 minute');

    runCron();
    // runMonitorCron();
    //runSendEmailCron();
  });

// cron.schedule('* * * * *', () => {
//     console.log('running a cron every 1 minute');

//    runSendEmailCron();
//   });