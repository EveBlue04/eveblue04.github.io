// ICII全景中国地图ECharts实现（ECharts 6.x，需手动加载geoJSON）
window.onload = function() {
  var chartDom = document.getElementById('china-map');
  var myChart = echarts.init(chartDom);
  fetch('js/vendor/china.json')
    .then(res => res.json())
    .then(geoJson => {
      echarts.registerMap('china', geoJson);
      var option = {
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            return params.name;
          }
        },
        series: [
          {
            name: '中国',
            type: 'map',
            map: 'china',
            roam: true,
            itemStyle: {
              areaColor: '#3399ff', // 蓝色
              borderColor: '#fff',
              borderWidth: 1,
              emphasis: {
                areaColor: '#005fae', // hover时深蓝色
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0,0.3)'
              }
            },
            label: {
              show: true,
              color: '#fff',
              fontSize: 12
            },
            data: []
          }

