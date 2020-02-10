require("dotenv").config();
const cheerio = require("cheerio");
const request = require("request");
const notifier = require("node-notifier");
const nodemailer = require("nodemailer");

let separateReqPool = { maxSockets: 15 };
let async = require("async");
let tweets = {},
  // lastTweet  = {};
  apiurls = [],
  N = [],
  tempArray = [];
let keyword2 =["permission" ];
let keyword = [
  "help me",
  "schedule wc",
  "paid family leave",
  "#paidfamilyleave",
  "Paidleave",
  "#paidleave",
  "paid leave",
  "paidleaveforall",
  "familiesMatter",
  "#fmla",
  "paternityleave",
  "maternityleave",
  "familyact",
  "familyvalues",
  "paidleave",
  "paidsickdays", 
  "announcing" 
];
///////////////////////////  TWITTER HANDLE TO MONITOR /////////////////////////////////////////////////////
let twitterHandles = [
  {
    name: "@IAmKenny",
    url: "https://twitter.com/IAmKennyWhyte?lang=en",
    keywords: keyword2
  },
  {
    name: "@IAmReneWhyte",
    url: "https://twitter.com/IAmReneWhyte?lang=en",
    keywords: keyword
  }
];
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

//ADD TWEETS
twitterHandles.forEach((twitterHandle, i) => {
  tweets[twitterHandle.url] = [];
  apiurls.push(twitterHandle.url);
});

//MONITOR
setInterval(() => {
  async.map(
    apiurls,
    function(item, callback) {
      request({ url: item, pool: separateReqPool }, function(
        error,
        response,
        body
      ) {
        try {
          const $ = cheerio.load(body);
          let turl = "https://twitter.com" + response.req.path;

          let lastTweet = $("div.js-tweet-text-container p")
            .eq(0)
            .text()
            .toLowerCase();

          console.log(
            "Checking if items  should be added to tweets[turl] array "
          );
          // console.log('lastTweet',lastTweet)
          // console.log('lastTweet',tweets[turl])
          if (tweets[turl].indexOf(lastTweet) === -1) {
            tweets[turl].push(lastTweet);
            console.log("Added");
            console.log("tweets[turl] after added", tweets[turl]);
          }

          for (
            let i = 0;
            // i < $("div.js-tweet-text-container p").lengtwitterHandle;
            i < 1;
            i++
          ) {
            const s_tweet = $("div.js-tweet-text-container p")
              .eq(0)
              .text()
              .toLowerCase();

 
              let twitterHandle_name = twitterHandles.filter((d, i) => d.url === turl)[0]
              .name;
         
            // twitterHandle_kw.forEach((kw, j) => {
            keyword.forEach((kw, j) => {
              if (wordInString(tweets[turl], kw)) {
                console.log(
                  "Checking if items  should be added to temp and N array "
                );

                if (tempArray.indexOf(lastTweet) === -1) {
                  tempArray.push(lastTweet);

                  N.push({
                    tweet: s_tweet,
                    name: twitterHandle_name
                  });

                  console.log("added to arrays ");
                }
              }
            });
          }
        } catch (e) {
          console.log("Error =>" + e);
        }
      });
    },
    function(err, results) {
      //console.log(results);
    }
  );
}, 5 * 1000); //RUNS EVERY 5 SECONDS

setInterval(() => {
  console.log("Checking if email shoukd be sent ");
  if (N.length) {

    for (const key in N) {
      if (N.hasOwnProperty(key)) {
        const element = N[key];
        console.log("element ",element)
      }
    }
    
   for (let index = 0; index < N.length; index++) {
     
    
    
     
   console.log("index ", index);
   console.log("index ", N[index]);

    //let n = N[index].shift();
    // console.log("twitterHandleis is n", n);
    notifier.notify({ title: N[index].name, message: N[index].tweet, sound: true }, function(
      err,
      response
    ) {
      console.log("Email seeeent !");
      SendEmail(N[index].tweet, N[index].name);
      //console.log("twitterHandleisis twitterHandlee response", response);
      // alert(response);
      // Response is response from notification
      let removed = N.shift();
      console.log("Removed " ,  removed);
    });

}
  
  }
}, 500);

function SendEmail(tweet, name) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  let mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAILTO,
    cc: process.env.EMAILCC,
    subject: `Hey, ${name} just tweeted about Paid family leave`,
    text: `Tweet: ${tweet}`
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log("Error sending email!!", err);
    } else {
      console.log("Email sent!!");
    }
  });
}

function wordInString(s, word) {
  return new RegExp("\\b" + word + "\\b", "i").test(s);
}
