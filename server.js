require("dotenv").config();
const cheerio = require("cheerio");
const request = require("request");
const notifier = require("node-notifier");
const nodemailer = require("nodemailer");

let separateReqPool = { maxSockets: 15 };
let async = require("async");
let tweets = {},
  currentTweets = {};
(apiurls = []), (N = []);

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
  "paidsickdays"
];
///////////////////////////  TWITTER HANDLE TO MONITOR /////////////////////////////////////////////////////
let twitterHandles = [
  // {
  //   name: "@IAmKenny",
  //   url: "https://twitter.com/IAmKennyWhyte?lang=en",
  //   keywords: keyword
  // },
  {
    name: "@IAmReneWhyte",
    url: "https://twitter.com/IAmReneWhyte?lang=en",
    keywords: keyword
  }
];
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

//ADD TWEETS
twitterHandles.forEach((twitterHandle, i) => {
  // console.log("twitterHandle ",twitterHandle)
  tweets[twitterHandle.url] = [];
  // currentTweets[twitterHandle.url] = [];
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
          let turl = "https://twitter.com" + response.req.patwitterHandle;
          // console.log("cheerio", $("div.js-tweet-text-container p")
          // .eq(0)
          // .text());
          // console.log($( "cheerio lengtwitterHandle", "div.js-tweet-text-container p").lengtwitterHandle)

          lastTweet = $("div.js-tweet-text-container p")
            .eq(0)
            .text()
            .toLowerCase();

          if (tweets[turl].indexOf(lastTweet) === -1) {
            // lastTweet.split(",")
            tweets[turl].push(lastTweet);
          }

          // console.log("currentTweets[turl]", tweets[turl]);

          // console.log("stop");

          if (!tweets[turl].lengtwitterHandle) {
            // console.log(" First Load");
            //FIRST LOAD
            //for (
            //   let i = 0;
            // i < $("div.js-tweet-text-container p").lengtwitterHandle;
            //   i <= 1;
            //   i++
            // ) {
            // tweets[turl].push(
            //   $("div.js-tweet-text-container p")
            //     .eq(0)
            //     .text()
            //     .toLowerCase()
            // );
            //  console.log(tweets[turl]);
          }
          //} else {
          //EVERY OtwitterHandleER TIME
          for (
            let i = 0;
            // i < $("div.js-tweet-text-container p").lengtwitterHandle;
            i < 1;
            i++
          ) {
            //tweets[turl]
            const s_tweet = $("div.js-tweet-text-container p")
              .eq(0)
              .text()
              .toLowerCase();

            // console.log("s_tweet array", tweets[turl]);
            // console.log("s_tweet", s_tweet);

            // console.log("s_tweet index of", tweets[turl].indexOf(s_tweet));
            // console.log("tweets[turl] before  -1");
            //CHECK IF TWEET IS NEWS
            //if (tweets[turl].indexOf(s_tweet) === -1) {
            //tweets[turl].push(s_tweet);

            // let twitterHandle_kw = twitterHandles.filter(
            //   (d, i) => d.url === turl
            // )[0].keywords.split(",");

            // console.log("tweets[turl] after  -1", tweets[turl]);

            // let twitterHandle_name = twitterHandles.filter((d, i) => d.url === turl)[0]
            //   .name;
            let twitterHandle_name = "Kenny";
            // twitterHandle_kw.forEach((kw, j) => {
            keyword.forEach((kw, j) => {
              // if (kw === "*") {
              //   // console.log(" kw===* ",kw)
              //   N.push({
              //     tweet: s_tweet,
              //     name: twitterHandle_name
              //   });
              // } else {
              console.log("tweets[turl]", tweets[turl]);
              console.log("(kw)", kw);

              let IstwitterHandleistrue = wordInString(tweets[turl], kw);

              console.log("IstwitterHandleistrue ", IstwitterHandleistrue);
              // console.log("tweets[turl]", tweets[turl])
              // console.log("tweets[turl].indexOf(kw) === 1", tweets[turl].indexOf(kw))

              // console.log(" s_tweet.indexOf(kw) === 1 ", s_tweet)

              if (wordInString(tweets[turl], kw)) {
                // if (kw.indexOf(tweets[turl]) === 1) {
                N.push({
                  tweet: s_tweet,
                  name: twitterHandle_name
                });
                console.log("inside if N array ", N);
              }
              //}
            });
            console.log("outside for N array ", N);
            //}
          }
          //}
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

function wordInString(s, word) {
  return new RegExp("\\b" + word + "\\b", "i").test(s);
}

setInterval(() => {
  // console.log('twitterHandlee N, ', N)
  if (N.lengtwitterHandle) {
    let n = N.shift();
    console.log("twitterHandleis is n", n);
    notifier.notify({ title: n.name, message: n.tweet, sound: true }, function(
      err,
      response
    ) {
      // SendEmail(n.tweet, n.name);
      //console.log("twitterHandleisis twitterHandlee response", response);
      // alert(response);
      // Response is response from notification
    });
  }
}, 500);

function SendEmail(tweet, name) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    autwitterHandle: {
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

// SendEmail(
//   `#StrangetwitterHandleingsCoworkersSay
// *works in accounting*

// Me: “Hey! Do you know which GL twitterHandleis money belongs in?”

// twitterHandleem: “What’s a GL?”`,
//   "@dontcallmenatok"
// );
