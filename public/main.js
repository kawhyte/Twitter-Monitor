// DOM elements
const tweet = document.getElementById("tweet");
const tracked_header = document.getElementById("tracked_head");
const twitter_handle = document.getElementById("twitter_handle");
const gallery = document.querySelector(".game-gallery");

// Replace ./data.json with your JSON feed
// fetch('/db.json').then(response => {
//     return response.json();
//   }).then(data => {
//     // Work with JSON data here
//     console.log(data);

//     tweet.innerHTML =  data.twitter[2].message;
//     twitter_handle.innerHTML = data.twitter[2].name;

//     const html = data.map(generateHTML).join("");
//     console.log(html);
//     gallery.innerHTML = html;
//   }).catch(err => {
//     // Do something for an error here
//   });

console.log("Loaded page");



function generateHTML(data, index) {
  tracked_header.innerHTML = `Currently tracking ${index} twitter accounts`
  // console.log("DATA ",data)
  // console.log("InDEX ",index)
  //let counter = counter+1

  // console.log(counter)
  //console.log("inside generate " + data.ratings[0].count);
  // const name  = data.name;
  // let rating = (data.rating)*2;

  // const background_image = data.background_image;
  // const released  = data.twitter[2].message;
  return `
    <div class="div${index + 1} container"> 
    <article class="mw5 center bg-white br3 pa5 pa4-ns mv3 ba b--black-20">
        <div class="tc">
          <img src=${data.link} class="br-100 h3 w3 dib" title="Photo">
         <h1>  <a id="twitter_handle"  class="f4 fw7 dib pa2 no-underline bg-animate bg-white hover-bg-light-blue blue" href="${data.url}">${data.name} </a></h1>
        <div >
          <dl class="f6 lh-title mv2">
             <dt class="dib ml0 gray">Tweeted</dt>
             <dd class="dib ml0 gray">${data.timeAgo}</dd>
           </dl>
         </div>
          <hr class="mw3 bb bw1 b--black-10">
          
        </div>
        <p id="tweet" class="lh-copy measure center f6 black-70 emoticon-size">${data.message}
        </p>
      </article> 
      </div>
  `;
}

//  fetch('/db.json', options)
// .then(resp => { return resp.json()})
// .then(data => {
//   //console.log(data);

//   const html = data.map(generateHTML).join("");
//   console.log(html);
//   gallery.innerHTML = html;
// }
// );
let sorted = fetch("./db.json", {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
})
  .then(r => r.json())
  .then(json => {
    let sortedBydate = json.twitter.sort((a, b) => {
      return new Date(b.dateTweeted) - new Date(a.dateTweeted);
    });

    console.log("SORTED ", sortedBydate);

    var html = sortedBydate
      .map((currElement, index) => {
        return (html = generateHTML(currElement, index));
      })
      .join("");

    console.log("OUTSIDE", html);
    gallery.innerHTML = html;
  });

// fetch('./db.json',
// {
//   headers : {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json'
//    }

// }

// )

// .then(r => r.json())
// .then(json => {
//   var html = json.twitter.map((currElement, index) => {

//   return html = generateHTML(currElement, index);

// }).join(' ')
//  html.sort();
// console.log("OUTSIDE", html)
//   gallery.innerHTML = html;

// });
