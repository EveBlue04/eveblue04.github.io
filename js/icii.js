// ICII全景地图交互占位脚本
// 实际地图和队伍数据需后续补充
const mapTooltip = document.getElementById('map-tooltip');
const mapSvg = document.querySelector('.map-svg');
if(mapSvg && mapTooltip) {
  mapSvg.addEventListener('mouseover', function(e) {
    mapTooltip.style.display = 'block';
    mapTooltip.textContent = '示例：江苏省 - NAU-China队伍';
  });
  mapSvg.addEventListener('mousemove', function(e) {
    mapTooltip.style.left = (e.pageX - mapSvg.offsetLeft + 20) + 'px';
    mapTooltip.style.top = (e.pageY - mapSvg.offsetTop + 20) + 'px';
  });
  mapSvg.addEventListener('mouseout', function() {
    mapTooltip.style.display = 'none';
  });
  mapSvg.addEventListener('click', function() {
    window.location.href = 'team.html';
  });
}

