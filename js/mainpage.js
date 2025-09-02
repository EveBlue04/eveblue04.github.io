// 视差滚动效果：mount-left 向左，mount-right 向右
// 记录缩放比例，默认1
let mountLeftScale = 1;
let mountRightScale = 1;

// 提供接口，外部可调用动态调整缩放比例
window.setMountScale = function(leftScale, rightScale) {
  if (typeof leftScale === 'number') mountLeftScale = leftScale;
  if (typeof rightScale === 'number') mountRightScale = rightScale;
  updateMountTransform();
};


function updateMountTransform() {
  const left = document.getElementById('mount-left');
  const right = document.getElementById('mount-right');
  const scrollY = window.scrollY;
  // Y轴随滚动下移，系数可调
  const yOffset = scrollY * 1.0;
  const scaleSpeed = 1 + scrollY / 800;
  const title = document.getElementById('main-title');
  if (title) {
    title.style.transform = `translateY(${(yOffset * -0.2).toFixed(2)}px) scale(${(1 + scrollY / 400).toFixed(2)})`;
  }
  const subtitle = document.getElementById('main-title-secondary');
  if (subtitle) {
    subtitle.style.transform = `translateY(${(yOffset * -0.2).toFixed(2)}px) scale(${(1 + scrollY / 600).toFixed(2)})`;
  }
  // 只在scrollY <= 2000时更新山体transform
  if (scrollY <= 2000) {
    if (left) {
      left.style.transform = `translateX(${(-scrollY *0.9).toFixed(2)}px) translateY(${yOffset.toFixed(2)}px) scale(${scaleSpeed.toFixed(2)})`;
    }
    if (right) {
      right.style.transform = `translateX(${(scrollY * 0.9).toFixed(2)}px) translateY(${yOffset.toFixed(2)}px) scale(${scaleSpeed.toFixed(2)})`;
    }
  }
}

// requestAnimationFrame 节流
let ticking = false;
window.addEventListener('scroll', function() {
  if (!ticking) {
    window.requestAnimationFrame(function() {
      updateMountTransform();
      ticking = false;
    });
    ticking = true;
  }
  // road 渐隐与隐藏
  const road = document.getElementById('main-road');
  const title_main= document.getElementById('main-title');
  const title_sec= document.getElementById('main-title-secondary');
  if (road) {
    if (window.scrollY < 600) {
      road.style.opacity = 1 - window.scrollY / 600;
      road.style.visibility = 'visible';
      road.style.display = '';
    } else {
      road.style.opacity = 0;
      road.style.visibility = 'hidden';
      road.style.display = 'none';
    }
  }
  if (title_main) {
    if (window.scrollY < 1000) {
      title_main.style.opacity = 1 - window.scrollY / 800;
      title_main.style.visibility = 'visible';
      title_main.style.display = '';
    } else {
      title_main.style.opacity = 0;
      title_main.style.visibility = 'hidden';
      title_main.style.display = 'none';
    }
  }
  if (title_sec) {
    if (window.scrollY < 1000) {
      title_sec.style.opacity = 1 - window.scrollY / 800;
      title_sec.style.visibility = 'visible';
      title_sec.style.display = '';
    } else {
      title_sec.style.opacity = 0;
      title_sec.style.visibility = 'hidden';
      title_sec.style.display = 'none';
    }
  }

  // 新增：滚动到2000px后隐藏两侧山体
  const left = document.getElementById('mount-left');
  const right = document.getElementById('mount-right');
  if (window.scrollY > 2000) {
    if (left) {
      left.style.opacity = '0';
      left.style.pointerEvents = 'none';
    }
    if (right) {
      right.style.opacity = '0';
      right.style.pointerEvents = 'none';
    }
  } else {
    if (left) {
      left.style.opacity = '1';
      left.style.pointerEvents = '';
    }
    if (right) {
      right.style.opacity = '1';
      right.style.pointerEvents = '';
    }
  }
});

// 移除鼠标缩放逻辑，改为页面滚动缩放
window.removeEventListener && window.removeEventListener('mousemove', window._mountMousemoveHandler);
