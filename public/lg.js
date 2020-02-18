// DOM elements
const tweet = document.getElementById("tweet");
const tracked_header = document.getElementById("tracked_head");
const twitter_handle = document.getElementById("twitter_handle");
const gallery = document.querySelector(".lg-gallery");
let tempArray = [];
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












function generateHTML(data, index) {
  // tracked_header.innerHTML = `Currently tracking ${index} twitter accounts`
  console.log("DATA from generateHTML ",data)
  // console.log("InDEX ",index)
  //let counter = counter+1

  // console.log(counter)
  //console.log("inside generate " + data.ratings[0].count);
  // const name  = data.name;
  // let rating = (data.rating)*2;

  // const background_image = data.background_image;
  // const released  = data.twitter[2].message;
  return `
  <div class="div1 container">
  <article class="mw6 center bg-white br3 pa3 pa0-ns mv3 ba b--black-20">
    <div>

    <h1 class="f4 bg-blue white mv0 pv2 ph3">Maine - <span>LD1698</span></h1> 
    </div>
    
    <div class="tc">
      <!-- <img src={data.link} class="br-100 h3 w3 dib" title="Photo"> -->
      <article class="w-100 pa0">

        <div class=" bg-near-black white w-100 mt1 pa3">
          <div class="w-100 pb1 bb b--white-50  inline-flex items-center justify-between">
            <div class="ttu f6 fw2">Status</div>
          </div>
          <div class="pt3 f2 f2-m fw5">0% Completed</div>
          <div class="pt2 w-100 dt dt--fixed">
            <div class="dtc h1 white bg-blue br1 br--left tc" style="width: 30%"><small>Introduced</small></div>
            <div class="dtc h1 white bg-blue br1 br--left tc" style="width: 50%"><small>House</small></div>
            <div class="dtc h1 white bg-light-gray br1 br--left tc" style="width: 50%"><small>Senate</small></div>
            <div class="dtc h1 white bg-light-gray br1 br--left tc" style="width: 50%"><small>Gov</small></div>
            <div class="dtc h1 bg-white o-30 br1 br--right"></div>
          </div>
          <div class="pt2 o-80 truncate"><small>+3% since last week</small></div>
        </div>
      </article>

      <div class="pa3 bt">
        <p class="f6 f5-ns lh-copy measure mv0">
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
          tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At
          vero eos et accusam et justo duo dolores et ea rebum.
        </p>
      </div>

      <article class="cf">
        <div class="fl w-50 bg-near-white tc">
     

          <div class="pa3 pa2-ns">
  
            <dl class="f6 lh-title mv2">
              <dt class="dib b">W:</dt>
              <dd class="dib ml0 gray">Wins</dd>
            </dl>
            <dl class="f6 lh-title mv2">
              <dt class="dib b">L:</dt>
              <dd class="dib ml0 gray">Losses</dd>
            </dl>


          </div>
        </div>
        <div class="fl w-50 bg-light-gray tc">

          <div class="pa3 pa2-ns">

            <dl class="f6 lh-title mv2">
              <dt class="dib b">W:</dt>
              <dd class="dib ml0 gray">Wins</dd>
            </dl>
            <dl class="f6 lh-title mv2">
              <dt class="dib b">L:</dt>
              <dd class="dib ml0 gray">Losses</dd>
            </dl>


          </div>

        </div>
      </article>
      <div>
      </div>
    </div>
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
// let sorted = fetch("./db.json", {
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json"
//   }
// })
//   .then(r => r.json())
//   .then(json => {
//     let sortedBydate = json.twitter.sort((a, b) => {
//       return new Date(b.dateTweeted) - new Date(a.dateTweeted);
//     });

//     console.log("SORTED ", sortedBydate);

//     var html = sortedBydate
//       .map((currElement, index) => {
//         return (html = generateHTML(currElement, index));
//       })
//       .join(" ");

//     console.log("OUTSIDE", html);
//     gallery.innerHTML = html;
//   });

fetch('http://localhost:3000/track',
{
  headers : {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
   }

}

)

.then(r => r.json())
.then(json => {
  tempArray.push(json.bill)
   console.log("(LG.JS",json.bill);

 



  var html = tempArray.map((currElement, index) => {

  return html = generateHTML(currElement, index);

}).join(' ')

console.log("OUTSIDE", html)
  gallery.innerHTML = html;

});



// fetch("http://localhost:3000/track")
//     .then(res => res.json())
//     .then(data => {
//     //   setWeatherData
//     // console.log("(LG.JS",data);
//     // console.log("(LG.Bill",data.bill);

//       var html = data.bill.map((currElement, index) => {

//          return html = generateHTML(currElement, index);
      
//       })//.join(' ')

//     });