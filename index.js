import {getHTML, getTwitterTweets} from './scraper';


async function go(){
   const html =  await getHTML('https://twitter.com/IAmKennyWhyte')
   
   const tweet = await getTwitterTweets(html);

   console.log( `Your latest tweet: ${tweet}`)
   
}
go();