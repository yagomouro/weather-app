var toggleBtn = document.querySelector('#switch');
var docElement = document.documentElement;
var theme = docElement.getAttribute('data-theme');

toggleBtn.addEventListener('change', () => {
  if (toggleBtn.checked) {
    transition()
    docElement.setAttribute('data-theme', 'dark')
  } else {
    transition()
    docElement.setAttribute('data-theme', 'light')
  }
})

let transition = () => {
  docElement.classList.add('transition');
  window.setTimeout(() => {
    docElement.classList.remove('transition')
  }, 1000)
}