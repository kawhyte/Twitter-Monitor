// DOM elements
const tweet = document.getElementById("tweet");
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



document.addEventListener('DOMContentLoaded', function(){
  console.log('Loaded page');



  function generateHTML(data, index) {

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
    <div class="div${index+1} container"> 
    <article class="mw5 center bg-white br3 pa5 pa4-ns mv3 ba b--black-20">
        <div class="tc">
          <img src=${data.link} class="br-100 h3 w3 dib" title="Photo of a kitty staring at you">
          <h1 id="twitter_handle" class="f4">${data.name}</h1>
          <hr class="mw3 bb bw1 b--black-10">
        </div>
        <p id="tweet" class="lh-copy measure center f6 black-70 emoticon-size">${data.message}
        </p>
      </article>
      </div>
  `;
  }
  
  
  
  


  
  
  
  const options = {
    headers: new Headers({
      Accept: "application/json",
      Authorization: "Basic",
      "Content-Type": "application/x-www-form-urlencoded",
      Host: "api.rawg.io",
      "User-Agent": "Video Game Of the Year/hulkbaby2@gmail.com"
    }),
    method: "GET"
  };
  



  //  fetch('/db.json', options)
  // .then(resp => { return resp.json()})
  // .then(data => {
  //   //console.log(data);

  //   const html = data.map(generateHTML).join("");
  //   console.log(html);
  //   gallery.innerHTML = html;
  // }
  // );

let newHtml = ""
fetch('/db.json')
.then(r => r.json())
.then(json => {
  var html = json.twitter.map((currElement, index) => {
  
  return html = generateHTML(currElement, index);

 

  // var groupTag = json.twitter.map(current => current.tag);
  // console.log('groupName', html);         
      
}).join(' ')
console.log("OUTSIDE", html)
  gallery.innerHTML = html;

});


// fetch('/db.json')
// .then(r => r.json())
// .then(json => {

//   console.log(json.twitter)

//   json.twitter.map((currElement, index) => {

//     console.log("The current iteration is: " + index);
//     console.log("The current element is: " + currElement[0].message);
//     console.log("\n");
//     return currElement; //equivalent to list[index]
//   })

//   var html = json.twitter.map(generateHTML).join("");


//   var groupTag = json.twitter.map(current => current.tag);
//   console.log('groupName', html);         
//   gallery.innerHTML = html;      
// });



//  fetch('/db.json', options)

//   .then(response => {
//     return response.json();
//   })
    
//     .then(data => {
//       console.log(data);
  



      
//        const html = data.map(function(val,i) {
//         generateHTML(val)
//        });
//        //.join("")
//       // console.log(html);
//       // gallery.innerHTML = html;
//     // }).catch(err => {
//     //   console.log( "Error.", err)
      
//     // });

//       });

});