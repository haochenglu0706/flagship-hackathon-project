// import './style.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.js'

// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vite.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector('#counter'))

let btn = document.getElementsByClassName("searchButton")[0]
let input = document.getElementsByClassName("searchInput")[0]



input.onfocus = function(){
  input.value = ''
  input.style.color = 'var(--primary-color)'

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      btn.click();
    }
  });
}

btn.onclick = function(){
  let pattern = /^[A-Za-z]{4}[0-9]{4}$/
  if(!input.value.match(pattern)){
    // alert("Can't find the course!")
    input.value = "Not a valid course!";
    input.style.color = "#ff7878ff";
    return;
  }
  window.location.href = '/calendar?courseid=' + input.value.toUpperCase();
}