// Team data with coordinates (longitude, latitude)
const teams = [
  {
    name: "Team Beijing",
    city: "Beijing",
    coords: [116.46, 39.92],
    photo: "#",
    description: "Integrating ancient Chinese textile wisdom with modern biosynthesis techniques. Our project explores temperature-controlled bacterial cellulose production inspired by traditional silk dyeing methods."
  }
];

// 弹窗DOM插入body末尾
window.addEventListener('DOMContentLoaded', function () {
  // 创建遮罩层
  const overlay = document.createElement('div');
  overlay.id = 'popup-overlay';
  overlay.style.cssText = `
    display:none;
    position:fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background:rgba(0,0,0,0.5);
    z-index:9998;
  `;

  // 创建弹窗
  const popup = document.createElement('div');
  popup.id = 'province-popup';
  popup.style.cssText = `
        display:none;
        position:fixed;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%);
        width:500px;
        height:400px;
        background:#fffbe6;
        border:2px solid #b38a3a;
        border-radius:12px;
        box-shadow:0 8px 32px rgba(0,0,0,0.18);
        font-size:1.2rem;
        z-index:9999;
        overflow:hidden;
      `;
  popup.innerHTML = `
        <div id="popup-content" style="
          height:calc(100% - 80px);
          padding:30px 40px 0;
          overflow-y:auto;
          overflow-x:hidden;
          line-height:1.6;
        "></div>
        <div style="
          position:absolute;
          bottom:0;
          left:0;
          right:0;
          padding:20px 40px;
          background:#fffbe6;
          border-top:1px solid rgba(179,138,58,0.2);
          text-align:center;
        ">
          <button id="popup-close" style="
            padding:8px 24px;
            background:#b38a3a;
            color:#fff;
            border:none;
            border-radius:6px;
            cursor:pointer;
            font-size:1rem;
            transition:background 0.3s ease;
          ">关闭</button>
        </div>
      `;

  document.body.appendChild(overlay);
  document.body.appendChild(popup);

  // 关闭弹窗的函数
  function closePopup() {
    popup.style.display = 'none';
    overlay.style.display = 'none';
  }

  // 点击关闭按钮关闭弹窗
  document.getElementById('popup-close').onclick = closePopup;

  // 点击遮罩层关闭弹窗
  overlay.onclick = closePopup;

  // 按ESC键关闭弹窗
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && popup.style.display === 'block') {
      closePopup();
    }
  });
});

// ICII全景中国地图ECharts实现（ECharts 6.x，需手动加载geoJSON）
window.onload = function () {
  var chartDom = document.getElementById('china-map');
  var teamInfoElement = document.getElementById('team-info');

  if (!chartDom) {
    console.error('未找到地图容器元素，可能是加载出问题了，尝试刷新页面看看？');
    return;
  }

  var myChart = echarts.init(chartDom);
  fetch('js/vendor/china.json')
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
          formatter: function (params) {
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
              areaColor: '#AB9363', // 蓝色
              borderColor: '#fff',
              borderWidth: 1
            },
            emphasis: {
              itemStyle: {
                areaColor: '#ffe9b8', // hover时暗淡的黄色（比正常状态更暗）
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0,0.3)'
              },
              label: {
                color: 'rgba(64,41,24,0.2)', // hover时字体颜色改为白色
                fontWeight: 'bold'
              }
            },
            label: {
              show: true,
              color: '#fff',
              fontSize: 12
            },
            data: []
          },
          {
            name: 'Teams',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: teams.map(team => ({
              name: team.name,
              value: [...team.coords, 15]
            })),
            symbolSize: 15,
            itemStyle: {
              color: '#9F4A2D'
            },
            emphasis: {
              itemStyle: {
                color: '#ff0000',
                borderColor: '#fff',
                borderWidth: 2
              }
            }
          }
        ]
      };
      myChart.setOption(option);

      // 省份点击弹窗机制
      myChart.on('click', function (params) {
        if (params.seriesType === 'map') {
          showProvincePopup(params.name);
        }
      });

      // Handle mouse events for team markers
      myChart.on('mouseover', function (params) {
        if (params.seriesType === 'scatter') {
          const team = teams.find(t => t.name === params.name);
          if (team) {
            document.querySelector('.team-photo img').src = team.photo;
            document.querySelector('.team-name').textContent = team.name;
            document.querySelector('.team-city').textContent = team.city;
            document.querySelector('.team-description').textContent = team.description;

            teamInfoElement.style.display = 'block';
            setTimeout(() => {
              teamInfoElement.classList.add('visible');
            }, 10);
          }
        }
      });

      myChart.on('mouseout', function (params) {
        if (params.seriesType === 'scatter') {
          teamInfoElement.classList.remove('visible');
          setTimeout(() => {
            if (!teamInfoElement.classList.contains('visible')) {
              teamInfoElement.style.display = 'none';
            }
          }, 400);
        }
      });

      window.addEventListener('resize', function () {
        myChart.resize();
      });
    })
    .catch(err => {
      console.error('中国地图geoJSON加载失败:', err);
      chartDom.innerHTML = '<div style="color: #e2c1b0; text-align: center; padding: 20px; font-size: 1.2rem;">Map loading error. Please check your internet connection and refresh the page.</div>';
    });
};

// 弹窗显示函数
function showProvincePopup(provinceName) {
  var popup = document.getElementById('province-popup');
  var content = document.getElementById('popup-content');
  var overlay = document.getElementById('popup-overlay');

  if (popup && content && overlay) {
    //查询json数据
    fetch('./provinces.json')
      .then(res => res.json())
      .then(data => {
        var provinceData = data.find(item => item.name === provinceName);
        var desc = provinceData ? provinceData.description : '暂无相关信息';
        content.innerHTML = `你点击了省份：<b>${provinceName}</b><br><br>${desc}`;
        popup.style.display = 'block';
        overlay.style.display = 'block';
      })
      .catch(err => {
        console.error('省份数据加载失败:', err);
        content.innerHTML = `你点击了省份：<b>${provinceName}</b><br><br>暂无相关信息。`;
        popup.style.display = 'block';
        overlay.style.display = 'block';
      });
  }
}
