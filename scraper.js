const cheerio = require("cheerio");
const request = require("request");
const axios = require("axios");

 async function getHTML(url) {
  const {data: html} = await axios.get(url);
 
  return html;
}

// async function getUsers(){

//   const users = ['IAmKennyWhyte', 'IAmReneWhyte', 'dn22je3'];

//   const user = users.map(user => {
//     return axios
//       .get(`https://twitter.com/${user}`)
//       // .then(res => console.log(res.data))
//       .then(res => console.log("res.data"))
//       .catch(e => console.error(e));
  
//  }); 
  // Promise.all(posts).then(res => console.log(`We have posts: ${res}!`));



//}

async function getTwitterTweets(html){
// load cheerio


const $ = cheerio.load(html)
//
const  name =  $( 'h2 a span b')
 console.log("here", name.html());

const span = $('div.js-tweet-text-container p')

const value = { name:name.html(), tweets: span.html() }
// console.log(span.html())
// return (span.html());


return value;

}

export {getHTML, getTwitterTweets};


