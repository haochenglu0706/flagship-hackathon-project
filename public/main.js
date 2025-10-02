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
    input.style.animation = "shake 0.2s ease-in-out 0s 2";
    setTimeout(() => {
      input.style.animation = ""
    }, 200);
    return;
  }
  window.location.href = '/calendar?courseid=' + input.value.toUpperCase();
}