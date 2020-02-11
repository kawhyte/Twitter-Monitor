const cheerio = require("cheerio");
const request = require("request");
const axios = require("axios");
import db from "./db";

 async function getHTML(url) {
  const {data: html} = await axios.get(url);
 
  return html;
}

async function getTwitterTweets(html){
// load cheerio

const $ = cheerio.load(html)
//
const  name =  $( 'h2 a span b')
// console.log("here", name.html());

const span = $('div.js-tweet-text-container p')

const value = { name:name.html(), tweets: span.html() }
// console.log(span.html())
// return (span.html());
return value;

}

async function runCron(){

  console.log("Chron");
  let tweets = [];

  let urls = ["IAmReneWhyte", "florinpop1705", "DasSurma", "IAmKennyWhyte"].map(
    (game, i) => {
      return `https://twitter.com/${game}`;
    }
  );

  for (let index = 0; index < urls.length; index++) {
    const html = await getHTML(urls[index]);
    const tweet = await getTwitterTweets(html);
    console.log("tweet ", tweet);

    db.get("twitter")
      .push({
        date: Date.now(),
        message: tweet.tweets,
        name: tweet.name
      })
      .write();

    tweets.push({ date: Date.now(), message: tweet.tweets, name: tweet.name });
  }
   console.log('DONE!!!')

}

export {getHTML, getTwitterTweets, runCron};


