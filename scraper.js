const cheerio = require("cheerio");
const request = require("request");
const axios = require("axios");
require("dotenv").config();
const notifier = require("node-notifier");
const nodemailer = require("nodemailer");
import db from "./db";

async function getHTML(url) {
  const { data: html } = await axios.get(url);

  return html;
}

async function getTwitterTweets(html) {
  // load cheerio
  const $ = cheerio.load(html);

  const imageLink =  $(".js-user-profile-link").find("img").eq(0).attr('src');
  // console.log("FIND" , image.find(".js-action-profile-avatar").find("img").eq(0).attr('src'));
  // console.log("IMAGE ", imageLink)

  const name = $("h2 a span b");

  const span = $("div.js-tweet-text-container p");

  const value = { name: name.html(), tweets: span.html(), imageLink };
  return value;
}

async function runCron() {
  console.log(" Started Cron job ");
  let counter = 0;
  let counter2 = 0;

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
    "dictate", "San Diego","Intuit", "#Intuit", "session"
  ];

  ///////  ACCOUNTS /////////
  let urls = [
    "IAmReneWhyte",
    "IAmKennyWhyte",
    "wesbos",
    "florinpop1705",
    "DasSurma",
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

  // let urls = [
  //   "IAmKennyWhyte",
  // ].map((game, i) => {
  //   return `https://twitter.com/${game}`;
  // });

  for (let index = 0; index < urls.length; index++) {
    const html = await getHTML(urls[index]);
    const tweet = await getTwitterTweets(html);

    let value = db
      .get("twitter")
      .find({ name: tweet.name })
      .value();

    console.log("(typeof value === 'undefined') ", (typeof value === 'undefined'));
    console.log("COMP ", Object.values(value.message).indexOf(tweet.tweets) !== -1);
    console.log("value.message ", value.message);
    console.log("TWEET tweet.tweets ", tweet.tweets);

    if  (typeof value === 'undefined') {
      db.get("twitter")
        .push({
          date: Date.now(),
          message: tweet.tweets,
          name: tweet.name,
          link: tweet.imageLink,
          notificationSent: false
        })
        .write();
        counter2++
      console.log(`${counter2}  - New tweets added to database!!!`);
    } else if ( Object.values(value.message).indexOf(tweet.tweets) === -1){

      db.get("twitter")
      .find({ name: tweet.name })
      .assign({ 
        date: Date.now(),
        message: tweet.tweets,
        notificationSent: false })
      .write();

      counter++
      console.log(`${counter} tweet updated in  database!!!`);
    }

    keyword.forEach((kw, j) => {
      if (wordInString(tweet.tweets, kw)) {
        console.log("keyword Found!!", tweet.name, kw);

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

  // console.log("notificationSent ", value.notificationSent);

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
      console.log("Error sending email!!", err);
    } else {
      console.log("Email sent!!");
    }
  });
}

function wordInString(s, word) {
  return new RegExp("\\b" + word + "\\b", "i").test(s);
}

export { getHTML, getTwitterTweets, runCron };
