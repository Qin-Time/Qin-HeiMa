// const { default: axios } = require("axios")

function render(response) {
  const { area, dateShort, dateLunar, temperature, psPm25, psPm25Level, weather, weatherImg, windDirection, windPower, todayWeather, dayForecast } = response.data.data     //巨长的链式数据，应该结构
  document.querySelector('.date-info').innerHTML = `${dateShort} 农历 ${dateLunar}`
  document.querySelector('.city-name').innerHTML = `${area}`
  document.querySelector('.weather-info').innerHTML = `
    <section class="weather-info">
      <div class="temp-section">
        <h1 class="temperature">${temperature}°</h1>
        <span class="aqi-badge">${psPm25} ${psPm25Level}</span>
      </div>
      <div class="condition">${weather} ${windDirection} ${windPower}</div>
      <div class="detail-list">
        <span>今天：${todayWeather.weather} ${todayWeather.temNight} - ${todayWeather.temDay}℃</span>
        <span>紫外线 ${todayWeather.ultraviolet || "中等"}</span>
        <span>湿度 ${todayWeather.humidity}%</span>
        <span>日出 ${todayWeather.sunriseTime}</span>
        <span>日落 ${todayWeather.sunsetTime}</span>
      </div>
    </section>`
  let dayForecastStr = ''
  dayForecast.forEach(element => {
    dayForecastStr += `
    <div class="day-item">
      <div class="day-date">${element.dateFormat}<br>${element.date}</div>
      <div class="day-icon" style="background-image: url('${element.weatherImg}')")></div>
      <div class="day-condition">${element.weather}</div>
      <div class="day-temp">${element.temNight} - ${element.temDay}°C</div>
      <div class="day-wind">${element.windDirection} ${element.windPower}</div>
    </div>
    `
  });
  document.querySelector('.forecast-days').innerHTML = dayForecastStr
}

function getweather(cityCode) {
  axios(
    {
      method: 'get',
      url: 'http://hmajax.itheima.net/api/weather',
      params: {
        city: cityCode
      }
    }
  ).then(response => {
    render(response)
  }).catch(error => {
    console.log(error);
  })
}

/**
 * @param {Function} func 需要防抖的函数
 * @param {Number} delay 延迟时间（毫秒）
 */
function debounce(func, delay) {
  let timer = null; // 利用闭包保存定时器

  return function (...args) {
    // 如果定时器存在，说明在延迟时间内又触发了事件，清除之前的定时器
    if (timer) clearTimeout(timer);

    // 重新开启一个定时器
    timer = setTimeout(() => {
      // 使用 apply 保证 this 指向正确，并传入参数
      func.apply(this, args);
    }, delay);
  };
}

function rendercitylist(res) {
  const ul = document.querySelector('.city-list');

  // 1. 安全解构：防止 res.data 为 undefined 导致报错
  const listData = (res && res.data && res.data.data) || [];
  console.log(listData);


  // 2. 判断是否有数据
  if (listData.length === 0) {
    ul.innerHTML = '';
    return;
  }

  // 3. 渲染列表并绑定 data-code 属性
  // 假设接口返回的城市编码字段名为 citycode
  ul.innerHTML = listData.map(item => {
    return `<li data-code="${item.code}">${item.name}</li>`;
  }).join('');
}

function getcitylist(keyword) {
  axios({
    method: 'get',
    url: 'http://hmajax.itheima.net/api/weather/city',
    params: {
      city: keyword
    }
  }).then(result => { rendercitylist(result) }).catch(error => { console.log(error); })
}

//将请求函数进行防抖处理
const debouncedSearch = debounce(getcitylist, 1000);

document.querySelector(".search-input").addEventListener("input", (e) => {
  console.log(e.target.value);
  debouncedSearch(e.target.value);
});

document.querySelector('.city-list').addEventListener("click", e => {
  if (e.target.tagName === 'LI') {
    console.log(e.target.dataset.code);
    getweather(e.target.dataset.code)
  }
})

getweather("460100") //海口 460100 北京110100