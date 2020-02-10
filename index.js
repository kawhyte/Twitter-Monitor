import express from "express";
import { getHTML, getTwitterTweets } from "./scraper";
import db from "./db";

const app = express();

// console.log(db)

// READ
app.get("/scrape", async (req, res, next) => {
  console.log("scraping");
  //  let result = go();
  //  console.log(result)

  const html = await getHTML("https://twitter.com/IAmKennyWhyte");

  const tweet = await getTwitterTweets(html);

  db.get("twitter")
    .push({
      date: Date.now(),
      message: tweet
      
    })
    .write();
  // const searches = db.searches.find().reverse();
  res.json(tweet);
});

// async function go(){
//    const html =  await getHTML('https://twitter.com/IAmKennyWhyte')

//    const tweet = await getTwitterTweets(html);

//    console.log( `Your latest tweet: ${tweet}`)
//    return tweet;

// }

app.listen(8888, () => console.log("Scraping app listening on port 8888!"));
