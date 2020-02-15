const cheerio = require("cheerio");
const request = require("request");
const axios = require("axios");
require("dotenv").config();
const notifier = require("node-notifier");
const nodemailer = require("nodemailer");
import { compareAsc, format, compareDesc } from "date-fns";
import db from "./db";

async function getHTML(url) {
  const { data: html } = await axios.get(url);

  return html;
}

async function getTwitterTweets(html) {
 let dateArray = [];
 let tweetArray = [];
  // load cheerio
  const $ = cheerio.load(html);

  

  // const imageLink = $(".js-user-profile-link ")
  //   .find("img")
  //   .eq(0)
  //   .attr("src");
  const imageLink = $('.ProfileAvatar-container')
  .eq(0)
  .attr("data-url")//.find("img").eq(0).attr('style')
  

  // console.log("FIND" , image.find(".js-action-profile-avatar").find("img").eq(0).attr('src'));
  console.log("IMAGE ", imageLink)
  // console.log("test ", test.html())

  // const name = $("h2 a span b");

  // const dateTweeted = $(".time")
  //   .find("span")
  //   .eq(0)
  //   .attr("data-time-ms");

  // const span = $("div.js-tweet-text-container p");

  for (let i = 0; i < $("div.js-tweet-text-container p").length; i++) {
    // console.log("NAME ", $("h2 a span b").html());

    tweetArray.push({
      name: $("h2 a span b").html(),

      date: parseInt($(".time")
        .find("span")
        .eq(i)
        .attr("data-time-ms"),10),

      tweetText: $("div.js-tweet-text-container p")
        .eq(i)
        .text(),

      image: $('.ProfileAvatar-container')
      .eq(i)
      .attr("data-url")
    });


    let milliseconds = $(".time")
    .find("span")
    .eq(i)
    .attr("data-time-ms");

    
    let integer = parseInt(milliseconds, 10);
  

    dateArray.push(
      integer
    );
  }

  let latestTweetTime = dateArray.sort((compareDesc));
 
  // console.log("FirstTweetTime ", latestTweetTime[0]);

  console.log("tweetArray-- ", tweetArray);

  let result = tweetArray.filter(obj => {
    return obj.date === (latestTweetTime[0])
  })


  console.log("RESULT-- ", result);

  const value = {
    name: result[0].name,
    tweets: result[0].tweetText,
    imageLink: tweetArray[0].image,
    dateTweeted: result[0].date
  };

  console.log("VALUE-- ", value);
  return value;
}

async function runCron() {
  console.log(" Started Cron job ");
  let counter = 0;
  let counter2 = 0;


  ///////  KEYWORDS /////////
  let keyword = [
  
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
    "dictate",
    "San Diego",
    "Intuit",
    "#Intuit",
    "session"
  ];

  ///////  ACCOUNTS /////////
  let urls = [
    "FamilyEconomyVA",
    "NCLeg",
    "PaLegis",
    "GovMLG",
    "DCPaidLeave",
    "PaidLeaveforCT",
    "GovJanetMills",
    "GovChrisSununu",
    "StateMaryland",
    "NJDOLCommish",
    "OregonCapitol",
    "MomsRising",
    "IAmReneWhyte",
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

  // let urls = ["wesbos",
  // "florinpop1705"].map((game, i) => {
  //   return `https://twitter.com/${game}`;
  // });

  for (let index = 0; index < urls.length; index++) {
    const html = await getHTML(urls[index]);
    const tweet = await getTwitterTweets(html);

    let value = db
      .get("twitter")
      .find({ name: tweet.name })
      .value();


     console.log("HELLO====>>>> ",tweet.imageLink)

    if (typeof value === "undefined") {
console.log("tweet.imageLink NEW++++ " , tweet.imageLink)

      db.get("twitter")
        .push({
          date: Date.now(),
          message: tweet.tweets,
          name: tweet.name,
          link: tweet.imageLink,
          dateTweeted: tweet.dateTweeted,
          notificationSent: false
        })
        .write();
      counter2++;
      console.log(`${counter2}  - New tweets added to database!!!`);
    } else if ((Object.values(value.message).indexOf(tweet.tweets) === -1)) {

      console.log("tweet.imageLink UPDATE++ " , tweet.imageLink)
      db.get("twitter")
        .find({ name: tweet.name })
        .assign({
          date: Date.now(),
          message: tweet.tweets,
          name: tweet.name,
          link: tweet.imageLink,
          dateTweeted: tweet.dateTweeted,
          notificationSent: false
        })
        .write();

      counter++;
      console.log(`${counter} tweet updated in  database!!!`);
    }

    keyword.forEach((kw, j) => {
      if (wordInString(tweet.tweets, kw)) {
        console.log("keyword Found!!", tweet.name, kw);

        // sendNotification(tweet);
      }
    });
  }
  console.log("DONE!!!");
  counter2 = 0;
  counter = 0;
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
