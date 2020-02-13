let db;_295‍.x([["getHTML",()=>getHTML],["getTwitterTweets",()=>getTwitterTweets],["runCron",()=>runCron]]);_295‍.w("./db",[["default",["db"],function(v){db=v}]]);const cheerio = require("cheerio");
const request = require("request");
const axios = require("axios");
require("dotenv").config();
const notifier = require("node-notifier");
const nodemailer = require("nodemailer");


async function getHTML(url) {
  const { data: html } = await axios.get(url);

  return html;
}

async function getTwitterTweets(html) {
  // load cheerio
  const $ = cheerio.load(html);

  const name = $("h2 a span b");

  const span = $("div.js-tweet-text-container p");

  const value = { name: name.html(), tweets: span.html() };
  return value;
}

async function runCron() {
  console.log(" Started Cron job ");

  ///////  KEYWORDS /////////
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
    "announcing",
    "learnable",
    "permission",
    "dictate"
  ];

  ///////  ACCOUNTS /////////
  let urls = [
    "IAmReneWhyte",
    "florinpop1705",
    "DasSurma",
    "IAmKennyWhyte",
    "GovernorKayIvey",
    "GovDunleavy",
    "dougducey",
    "AsaHutchinson",
    "GavinNewsom",
    "jaredpolis",
    "GovNedLamont",
    "JohnCarneyDE",
    "GovRonDeSantis",
    "BrianKempGA",
    "GovHawaii",
    "GovernorLittle",
    "JBPritzker"
  ].map((game, i) => {
    return `https://twitter.com/${game}`;
  });

  for (let index = 0; index < urls.length; index++) {
    const html = await getHTML(urls[index]);
    const tweet = await getTwitterTweets(html);

    let value = db
      .get("twitter")
      .find({ name: tweet.name })
      .value();

    _295‍.g.console.log("VALUE ", value);

    if (Object.values(value.message).indexOf(tweet.tweets) !== -1 || value.message = undefined) {
      db.get("twitter")
        .push({
          date: Date.now(),
          message: tweet.tweets,
          name: tweet.name,
          notificationSent: tweet.notificationSent
        })
        .write();

      console.log("value added to database!!!");
    }

    keyword.forEach((kw, j) => {
      if (wordInString(tweet.tweets, kw)) {
        _295‍.g.console.log("keyword Found!!", tweet.name, kw);

        sendNotification(tweet);
      }
    });
  }
  console.log("DONE!!!");
}

// SENT EMAIL
async function sendNotification(tweet) {
  console.log("sendNotification!!!");

  let value = db
    .get("twitter")
    .find({ name: tweet.name })
    .value();

  _295‍.g.console.log("notificationSent ", value.notificationSent);

  if (value.notificationSent === false) {
    db.get("twitter")
      .find({ name: tweet.name })
      .assign({ notificationSent: true })
      .write();

    sendEmail(value.message, value.name);
    console.log("Email seeeent !");
  }
}

function sendEmail(tweet, name) {
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
      _295‍.g.console.log("Error sending email!!", err);
    } else {
      console.log("Email sent!!");
    }
  });
}

function wordInString(s, word) {
  return new RegExp("\\b" + word + "\\b", "i").test(s);
}


