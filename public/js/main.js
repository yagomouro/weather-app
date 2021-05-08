var toggleBtn = document.querySelector('#switch');
var docElement = document.documentElement;
var theme = docElement.getAttribute('data-theme');
var cep = document.getElementById("inputCEP");

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

fetch('https://weather-appe.herokuapp.com/date', {
  method: 'GET'
}).then(response => response.json().then(result => {
  const date = result.date;
  const totalD = date.split(' ');
  for(i = 0; i < totalD.length; i++){
    let w = totalD[i];
    if(w != 'de') totalD[i] = w[0].toUpperCase() + w.slice(1);
  }
  document.getElementById("data").innerText = totalD.join(" ");
}))

cep.addEventListener('keyup', event => {
  if(cep.value.length == 8) {
    fetch(`https://viacep.com.br/ws/${cep.value}/json/`, {
      method: 'GET'
    }).then(response => response.json().then(result => {
      if(result.erro){
        document.getElementById('local').innerHTML = `<strong>Cidade não encontrada!</strong>`
        return;
      }
      document.getElementById('local').innerHTML = `<strong>${result.localidade}, ${result.uf} -</strong> Brasil`;
      const city = result.localidade;
      fetch('https://weather-appe.herokuapp.com/key', {
        method: 'GET'
      }).then(result => result.json().then(response => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=pt&units=metric&appid=${response.key}`)
        .then(result => result.json().then(response => {
          document.getElementById('temp').innerText = `${response.main.temp}º`;
          document.getElementById('wing').innerText = `${response.wind.speed} m/s`;
          document.getElementById('humidity').innerText = `${response.main.humidity}%`
        }))
      }))
    }))
  }
})