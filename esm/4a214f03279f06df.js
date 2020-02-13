let express,getHTML,getTwitterTweets,db;_279‍.w("express",[["default",["express"],function(v){express=v}]]);_279‍.w("./scraper",[["getHTML",["getHTML"],function(v){getHTML=v}],["getTwitterTweets",["getTwitterTweets"],function(v){getTwitterTweets=v}]]);_279‍.w("./db",[["default",["db"],function(v){db=v}]]);_279‍.w("./cron");




const app = express();

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

  // const options = {
  //   headers: new Headers({
  //     Accept: "application/json",
  //     Authorization: "Basic",
  //     "Content-Type": "application/x-www-form-urlencoded",
  //     Host: "api.rawg.io",
  //     "User-Agent": "Video Game Of the Year/hulkbaby2@gmail.com"
  //   }),
  //   method: "GET"
  // };

  // const  dataa = await Promise.all(urls.map(url => getHTML(url)))
  //   //.then(resp => Promise.all(resp.map(r => r.json())))
  //   .then(data => {

  //     const tweet =  getTwitterTweets(data);
  //     console.log("TWEET ",tweet);
  //     //const html = data.map(generateHTML).join("");
  //     //console.log(html);
  //     //gallery.innerHTML = html;
  //   });

  

  // const result = await loop(urls)

  for (let index = 0; index < urls.length; index++) {
    const html = await getHTML(urls[index]);
    const tweet = await getTwitterTweets(html);
    _279‍.g.console.log("tweet ", tweet);

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
