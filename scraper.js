const cheerio = require("cheerio");
const request = require("request");
const axios = require("axios");

 async function getHTML(url) {
  const {data: html} = await axios.get(url);
 
  return html;
}

async function getTwitterTweets(html){
// load cheerio


const $ = cheerio.load(html)
const span = $('div.js-tweet-text-container p')
return (span.html());

}

export {getHTML, getTwitterTweets};