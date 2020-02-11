import express from "express";
import { getHTML, getTwitterTweets} from "./scraper";
import db from "./db";

const app = express();


// READ
app.get("/scrape", async (req, res, next) => {
  console.log("scraping");
  //  let result = go();
  //  console.log(result)

  //const users = await getUsers();

  // console.log("USERS ",users)

  let urls =  ["IAmReneWhyte", "florinpop1705", "DasSurma", "IAmKennyWhyte"].map((game, i) => {
  return `https://twitter.com/${game}`;
});

 
for (let index = 0; index < urls.length; index++) {
  const html = await getHTML(urls[index]);
  const tweet = await getTwitterTweets(html);
  //  console.log('tweet ', tweet);

   db.get("twitter")
    .push({
      date: Date.now(),
      message: tweet.tweets,
      name: tweet.name
    })
    .write();
    
   

}
 //res.json(tweet);

  // res.json(tweet);
});

// async function go(){
//    const html =  await getHTML('https://twitter.com/IAmKennyWhyte')

//    const tweet = await getTwitterTweets(html);

//    console.log( `Your latest tweet: ${tweet}`)
//    return tweet;

// }

app.listen(8887, () => console.log("Scraping app listening on port 8887!"));
