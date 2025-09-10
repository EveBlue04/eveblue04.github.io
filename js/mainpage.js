// 视差滚动效果：mount-left 向左，mount-right 向右
// 记录缩放比例，默认1
let mountLeftScale = 1;
let mountRightScale = 1;
let animationId = null;
let lastScrollY = 0;

// 提供接口，外部可调用动态调整缩放比例
window.setMountScale = function(leftScale, rightScale) {
  if (typeof leftScale === 'number') mountLeftScale = leftScale;
  if (typeof rightScale === 'number') mountRightScale = rightScale;
};

// 平滑动画循环
function smoothAnimationLoop() {
  const currentScrollY = window.scrollY;

  // 如果滚动位置没有变化就跳过更新
  if (Math.abs(currentScrollY - lastScrollY) < 0.5) {
    animationId = requestAnimationFrame(smoothAnimationLoop);
    return;
  }

  // 获取所有需要动画的元素
  const left = document.getElementById('mount-left');
  const right = document.getElementById('mount-right');
  const title = document.getElementById('main-title');
  const subtitle = document.getElementById('main-title-secondary');
  const road = document.getElementById('main-road');

  // 计算动画参数
  const yOffset = currentScrollY;
  const scaleSpeed = 1 + currentScrollY / 800;

  // 标题动画（分层效果1：向上移动并缩放）
  if (title) {
    const titleOffset = yOffset * -0.2; // 标题向上移动
    const titleScale = 1 + currentScrollY / 400; // 标题缩放
    const titleOpacity = currentScrollY < 1000 ? Math.max(0, 1 - currentScrollY / 800) : 0;

    title.style.transform = `translate3d(0, ${titleOffset.toFixed(1)}px, 0) scale(${titleScale.toFixed(3)})`;
    title.style.opacity = titleOpacity.toFixed(3);
    title.style.visibility = titleOpacity > 0.001 ? 'visible' : 'hidden';
    title.style.display = titleOpacity > 0.001 ? '' : 'none';
  }

  // 副标题动画（分层效果2：不同的移动速度和缩放）
  if (subtitle) {
    const subtitleOffset = yOffset * -0.2; // 副标题向上移动
    const subtitleScale = 1 + currentScrollY / 600; // 副标题不同的缩放速度
    const subtitleOpacity = currentScrollY < 1000 ? Math.max(0, 1 - currentScrollY / 800) : 0;

    subtitle.style.transform = `translate3d(0, ${subtitleOffset.toFixed(1)}px, 0) scale(${subtitleScale.toFixed(3)})`;
    subtitle.style.opacity = subtitleOpacity.toFixed(3);
    subtitle.style.visibility = subtitleOpacity > 0.001 ? 'visible' : 'hidden';
    subtitle.style.display = subtitleOpacity > 0.001 ? '' : 'none';
  }

  // 道路动画（分层效果3：渐隐效果）
  if (road) {
    const roadOpacity = currentScrollY < 600 ? Math.max(0, 1 - currentScrollY / 600) : 0;
    road.style.opacity = roadOpacity.toFixed(3);
    road.style.visibility = roadOpacity > 0.001 ? 'visible' : 'hidden';
    road.style.display = roadOpacity > 0.001 ? '' : 'none';
  }

  // 山体动画（分层效果4：视差滚动，左右分离移动）
  if (currentScrollY <= 2000) {
    if (left) {
      const leftX = -currentScrollY * 0.9; // 左山向左移动
      left.style.transform = `translate3d(${leftX.toFixed(1)}px, ${yOffset.toFixed(1)}px, 0) scale(${scaleSpeed.toFixed(3)})`;
    }
    if (right) {
      const rightX = currentScrollY * 0.9; // 右山向右移动
      right.style.transform = `translate3d(${rightX.toFixed(1)}px, ${yOffset.toFixed(1)}px, 0) scale(${scaleSpeed.toFixed(3)})`;
    }
  }

  // 山体透明度控制（分层效果5：距离控制显隐）
  const mountOpacity = currentScrollY > 2000 ? 0 : 1;
  if (left) {
    left.style.opacity = mountOpacity.toString();
    left.style.pointerEvents = mountOpacity > 0 ? '' : 'none';
  }
  if (right) {
    right.style.opacity = mountOpacity.toString();
    right.style.pointerEvents = mountOpacity > 0 ? '' : 'none';
  }

  lastScrollY = currentScrollY;

  // 继续下一帧
  animationId = requestAnimationFrame(smoothAnimationLoop);
}

// 启动动画
function startAnimation() {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  smoothAnimationLoop();
}

// 停止动画
function stopAnimation() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

// 页面加载时启动动画
document.addEventListener('DOMContentLoaded', startAnimation);

// 页面可见性变化时控制动画（性能优化）
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    stopAnimation();
  } else {
    startAnimation();
  }
});

// 兼容性函数（保留原有接口）
function updateMountTransform() {
  // 空函数，保持兼容性
}

// 移除鼠标缩放逻辑，改为页面滚动缩放
if (window._mountMousemoveHandler) {
  window.removeEventListener('mousemove', window._mountMousemoveHandler);
}



