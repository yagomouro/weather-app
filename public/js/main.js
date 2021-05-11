var toggleBtn = document.querySelector('#switch');
var docElement = document.documentElement;
var theme = docElement.getAttribute('data-theme');
var selectLocal = document.querySelector('#selectLocal')
var cep = document.getElementById("inputCEP");
var cepType = cep.getAttribute('type');
var timerNumber = 5000;
var timer;


//#region Change input
selectLocal.addEventListener('change', () => {
  if (selectLocal.value == 'cep') {
    cep.value = "";
    document.getElementById('local').innerHTML = `<strong>Digite um CEP do Brasil</strong>`;
    document.getElementById('imgW').setAttribute('src', `/img/cloudy-day.svg`);
    document.getElementById('temp').innerText = '-- ºC';
    document.getElementById('feelslike').innerText = '-- ºC';
    document.getElementById('tmaxmin').innerText = '-- ºC';
    document.getElementById('humidity').innerText = '-- %';
    cep.innerText = "";
    cep.setAttribute('placeholder', 'Pesquisar CEP')
    cep.setAttribute('type', 'number')
    cep.setAttribute('maxlength', '8')

  } else if (selectLocal.value == 'cidade') {
    cep.value = "";
    document.getElementById('local').innerHTML = `<strong>Digite uma cidade do Brasil</strong>`;
    document.getElementById('imgW').setAttribute('src', `/img/cloudy-day.svg`);
    document.getElementById('temp').innerText = '-- ºC';
    document.getElementById('feelslike').innerText = '-- ºC';
    document.getElementById('tmaxmin').innerText = '-- ºC';
    document.getElementById('humidity').innerText = '-- %';
    cep.setAttribute('placeholder', 'Pesquisar Cidade')
    cep.setAttribute('type', 'text')
    cep.setAttribute('maxlength', '30')
  }
})

function sliceLength() {
  if (cepType == "number") {
    if (cep.value.length > cep.maxLength) {
      cep.value = cep.value.slice(0, cep.maxLength)
    }
  }
}




//#endregion

// #region Change theme color
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

//#endregion

//#region Get date
fetch('http://localhost:3000/date', {
  method: 'GET'
}).then(response => response.json().then(result => {
  const date = result.date;
  const totalD = date.split(' ');
  for (i = 0; i < totalD.length; i++) {
    let w = totalD[i];
    if (w != 'de') totalD[i] = w[0].toUpperCase() + w.slice(1);
  }
  document.getElementById("data").innerText = totalD.join(" ");
}))
//#endregion

//#region search weather
cep.addEventListener('keyup', event => {
  clearTimeout(timer);
  if (selectLocal.selectedIndex == 0) {
    if (cep.value.length == 8) {
      fetch(`https://viacep.com.br/ws/${cep.value}/json/`, {
        method: 'GET'
      }).then(response => response.json().then(result => {
        if (result.erro) {
          document.getElementById('local').innerHTML = `<strong>Cidade não encontrada!</strong>`;
          document.getElementById('imgW').setAttribute('src', `/img/cloudy-day.svg`);
          document.getElementById('temp').innerText = '-- ºC';
          document.getElementById('feelslike').innerText = '-- ºC';
          document.getElementById('tmaxmin').innerText = '-- ºC';
          document.getElementById('humidity').innerText = '-- %';
          return;
        }
        document.getElementById('local').innerHTML = `<strong>${result.localidade}, ${result.uf} -</strong> Brasil`;
        const city = result.localidade;
        fetch('http://localhost:3000/key', {
          method: 'POST'
        }).then(result => result.json().then(response => {
          fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=pt&units=metric&appid=${response.key}`)
            .then(result => result.json().then(response => {
              document.getElementById('imgW').setAttribute('src', `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
              document.getElementById('temp').innerText = `${response.main.temp.toString().split('.')[0]}ºC`;
              document.getElementById('feelslike').innerText = `${response.main.feels_like.toString().split('.')[0]}º`;
              document.getElementById('humidity').innerText = `${response.main.humidity}%`;
              document.getElementById('tmaxmin').innerText = `${response.main.temp_max.toString().split('.')[0]}º - ${response.main.temp_min.toString().split('.')[0]}º`
            }))
        }))
      }))
    }
  }
  else {
    let city = cep.value;
    if (cep.value) {
      timer = setTimeout(() => {
        fetch('http://localhost:3000/key', {
          method: 'POST'
        }).then(result => result.json().then(response => {
          fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},BR&lang=pt&units=metric&appid=${response.key}`).then(
            res => res.json().then(response => {
              if (response.cod == '404') {
                document.getElementById('local').innerHTML = `<strong>Cidade não encontrada!</strong>`;
                document.getElementById('imgW').setAttribute('src', `/img/cloudy-day.svg`);
                document.getElementById('temp').innerText = '-- ºC';
                document.getElementById('feelslike').innerText = '-- ºC';
                document.getElementById('tmaxmin').innerText = '-- ºC';
                document.getElementById('humidity').innerText = '-- %'
                return;
              }
              document.getElementById('local').innerHTML = `<strong>${response.name} -</strong> Brasil`;
              document.getElementById('imgW').setAttribute('src', `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
              document.getElementById('temp').innerText = `${response.main.temp.toString().split('.')[0]}ºC`;
              document.getElementById('feelslike').innerText = `${response.main.feels_like.toString().split('.')[0]}º`;
              document.getElementById('humidity').innerText = `${response.main.humidity}%`;
              document.getElementById('tmaxmin').innerText = `${response.main.temp_max.toString().split('.')[0]}º - ${response.main.temp_min.toString().split('.')[0]}º`
            })
          )
        }))
      }, 800)
    }
  }
})
//#endregion