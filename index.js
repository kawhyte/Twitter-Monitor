if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

import express from "express";
import { getHTML, getTwitterTweets } from "./scraper";
import db from "./db";
import  "./cron";


const app = express();

app.use(express.json());

app.use(express.static("public"));

// READ
app.get("/scrape", async (req, res, next) => {
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



app.get(`/data`, async (req, res, next) => {


  
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

app.listen(8887, () => console.log("Scraping app listening on port 8887!"));
