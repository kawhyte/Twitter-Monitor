require("dotenv").config();
const cheerio = require("cheerio");
const request = require("request");
const notifier = require("node-notifier");
const nodemailer = require("nodemailer");

let separateReqPool = { maxSockets: 15 };
let async = require("async");
let tweets = {},
  apiurls = [],
  N = [];
let keyword ="paid family leave, Paidleaveforall, FamiliesMatter, #FMLA, Paternityleave, Maternityleave, FamilyAct, FamilyValues, Paidleave, PaidSickDays";
///////////////////////////  CONFIGURE TWITTER HANDLERS /////////////////////////////////////////////////////
var THandlers = [
  {
    name: "WhaleWatch",
    url: "https://twitter.com/whalewatchio?lang=en",
    keywords: "long"
  },

  {
    name: "@IAmKenny",
    url: "https://twitter.com/IAmKennyWhyte?lang=en",
    keywords: "smiling,beautiful,privilege,lifetime"
  },
  {
    name: "@IAmReneWhyte",
    url: "https://twitter.com/IAmReneWhyte?lang=en",
    keywords: keyword
  }
];
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

//ADD TWEETS
THandlers.forEach((th, i) => {
  tweets[th.url] = [];
  apiurls.push(th.url);
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
          // console.log("response", response.req.path);
          if (!tweets[turl].length) {
            //FIRST LOAD
            for (
              let i = 0;
              i < $("div.js-tweet-text-container p").length;
              i++
            ) {
              tweets[turl].push(
                $("div.js-tweet-text-container p")
                  .eq(i)
                  .text()
              );
            }
          } else {
            //EVERY OTHER TIME
            for (
              let i = 0;
              i < $("div.js-tweet-text-container p").length;
              i++
            ) {
              const s_tweet = $("div.js-tweet-text-container p")
                .eq(i)
                .text();
              //CHECK IF TWEET IS NEWS
              if (tweets[turl].indexOf(s_tweet) === -1) {
                tweets[turl].push(s_tweet);
                let th_kw = THandlers.filter(
                  (d, i) => d.url === turl
                )[0].keywords.split(",");
                // console.log("TH-KW",th_kw)

                let th_name = THandlers.filter((d, i) => d.url === turl)[0]
                  .name;
                th_kw.forEach((kw, j) => {
                  if (kw === "*") {
                    N.push({
                      tweet: s_tweet,
                      name: th_name
                    });
                  } else {
                    if (s_tweet.indexOf(kw) != -1) {
                      N.push({
                        tweet: s_tweet,
                        name: th_name
                      });
                    }
                  }
                });
              }
            }
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
  if (N.length) {
    let n = N.shift();
    console.log("This is n", n);
    notifier.notify({ title: n.name, message: n.tweet, sound: true }, function(
      err,
      response
    ) {
      console.log("Thisis the response", response);
      // alert(response);
      // Response is response from notification
    });
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
    subject: `Hey, ${name} just tweeted about Paid family leave ***This is just a test***`,
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

SendEmail(
  `#StrangeThingsCoworkersSay
*works in accounting*

Me: “Hey! Do you know which GL this money belongs in?”

Them: “What’s a GL?”`,
  "@dontcallmenatok"
);
