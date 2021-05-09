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

fetch('http://localhost:3000/date', {
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
      fetch('http://localhost:3000/key', {
        method: 'POST'
      }).then(result => result.json().then(response => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=pt&units=metric&appid=${response.key}`)
        .then(result => result.json().then(async response => {
          temp = response.main.temp.toString().split('.');
          feels = response.main.feels_like.toString().split('.');
          max = response.main.temp_max.toString().split('.');
          min = response.main.temp_min.toString().split('.');
          document.getElementById('imgW').setAttribute('src', `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
          document.getElementById('temp').innerText = `${temp[0]}ºC`;
          document.getElementById('feelslike').innerText = `${feels[0]}º`;
          document.getElementById('humidity').innerText = `${response.main.humidity}%`;
          document.getElementById('tmaxmin').innerText = `${max[0]}º - ${min[0]}º`
        }))
      }))
    }))
  }
})