if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const LEGISCAN_API_KEY = process.env.LEGISCAN;
const axios = require("axios");

// import express from "express";
import { getHTML, getTwitterTweets } from "./scraper";
import db from "./db";
import  "./cron";

const express = require('express');
const favicon = require('express-favicon');
const app = express();

app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(express.json());

app.use(express.static("public"));

// READ
app.get("/", async (req, res, next) => {
  console.log("scraping");
  let tweets = [];
  //  let result = go();
  //  console.log(result)

  //const users = await getUsers();

  // console.log("USERS ",users)

  let urls = ["IAmReneWhyte", "florinpop1705", "DasSurma", "IAmKennyWhyte"].map(
    (game, i) => {
      return `https://twitter.com/${game}`;
    }
  );



  

  // const result = await loop(urls)

  for (let index = 0; index < urls.length; index++) {
    const html = await getHTML(urls[index]);
    const tweet = await getTwitterTweets(html);
    console.log("tweet ", tweet);

    // db.get("twitter")
    //   .push({
    //     date: Date.now(),
    //     message: tweet.tweets,
    //     name: tweet.name
    //   })
    //   .write();

    tweets.push({ date: Date.now(), message: tweet.tweets, name: tweet.name });
  }
  res.json(tweets);

  // res.json(tweet);
});



app.get("/track", async (req, res, next) => {

  const url = `https://api.legiscan.com/?key=0b930fa026d22ed0d16ae690f3fa338f&op=getBill&id=1340027`;

  axios({
    url: url,
    responseType: "json"
  }).then(data => {

 console.log(data.data)
    res.json(data.data);
  });

  
});
// async function loop (urls){
// let obj = [];
//   console.log(urls)

//   for (let index = 0; index < urls.length; index++) {
//     const html = await getHTML(urls[index]);
//      const tweet = await getTwitterTweets(html);
//     //  console.log('tweet ', tweet);

//      db.get("twitter")
//       .push({
//         date: Date.now(),
//         message: tweet.tweets,
//         name: tweet.name
//       })
//       .write();

//   }

// //  return tweet;

// }
// async function go(){
//    const html =  await getHTML('https://twitter.com/IAmKennyWhyte')

//    const tweet = await getTwitterTweets(html);

//    console.log( `Your latest tweet: ${tweet}`)
//    return tweet;

// }

// const server = app.listen(3000, function(){
//   console.log('server is running at %s .', server.address().port);
// });


const server_port = process.env.YOUR_PORT || process.env.PORT || 3000;
const server_host = process.env.YOUR_HOST || '0.0.0.0';
app.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});
// app.listen(8887, () => console.log("Scraping app listening on port 8887!"));
