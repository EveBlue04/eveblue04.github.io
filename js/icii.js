// ICII全景中国地图ECharts实现（ECharts 6.x，需手动加载geoJSON）
window.onload = function() {
  var chartDom = document.getElementById('china-map');
  if (!chartDom) {
    console.error('未找到地图容器元素，可能是加载出问题了，尝试刷新页面看看？');
    return;
  }
  var myChart = echarts.init(chartDom);
  fetch('./js/vendor/china.json')
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
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
            layoutCenter: ['50%', '50%'], // 保证地图内容居中
            layoutSize: '90%', // 保证地图内容有留白，不贴边
            itemStyle: {
              areaColor: '#3399ff', // 蓝色
              borderColor: '#fff',
              borderWidth: 1
            },
            emphasis: {
              itemStyle: {
                areaColor: '#005fae', // hover时深蓝色
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0,0.3)'
              },
              label: {
                color: '#ff0', // hover时字体高亮
                fontWeight: 'bold'
              }
            },
            label: {
              show: true,
              color: '#fff',
              fontSize: 12
            },
            data: []
          }
        ]
      };
      myChart.setOption(option);
      window.addEventListener('resize', function() {
        myChart.resize();
      });
    })
    .catch(err => {
      console.error('中国地图geoJSON加载失败:', err);
    });
};
