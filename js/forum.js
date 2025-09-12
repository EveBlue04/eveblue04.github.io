// 论坛提问+回答占位脚本
const forumList = document.getElementById('forum-list');
const askBtn = document.getElementById('ask-btn');
const questionInput = document.getElementById('forum-question');
const demoAnswers = [
  {q: '传统工艺与现代科技如何结合？', a: '可以通过现代生物技术赋能传统工艺。'},
  {q: 'ICII全景地图如何参与？', a: '请联系组委会报名。'}
];
function renderForum() {
  forumList.innerHTML = '';
  demoAnswers.forEach(item => {
    const qDiv = document.createElement('div');
    qDiv.className = 'forum-question';
    qDiv.textContent = item.q;
    const aDiv = document.createElement('div');
    aDiv.className = 'forum-answer';
    aDiv.textContent = item.a;
    forumList.appendChild(qDiv);
    forumList.appendChild(aDiv);
  });
}
askBtn.onclick = function() {
  if(questionInput.value.trim()) {
    demoAnswers.unshift({q: questionInput.value, a: '（等待回答）'});
    questionInput.value = '';
    renderForum();
  }
};
if(askBtn) {
  askBtn.onclick = function() {
    const content = questionInput.value.trim();
    window.location.href = 'mailto:your@email.com?subject=ICII论坛提问&body=' + encodeURIComponent(content);
  };
}
renderForum();

// ======= 全屏弹幕与按钮控制 =======
window.addEventListener('DOMContentLoaded', function() {
  const forumMain = document.querySelector('.forum-main');
  const showForumBtn = document.getElementById('show-forum-btn');
  const danmuContainer = document.getElementById('danmu-container');

  // 按钮显示修正：确保按钮可见
  if (showForumBtn) {
    showForumBtn.style.display = 'block';
    showForumBtn.style.zIndex = 1100;
  }
  if (danmuContainer) {
    danmuContainer.style.display = 'block';
    danmuContainer.style.zIndex = 1000;
  }

  // 评论按钮点击后显示主内容，隐藏弹幕和按钮
  if (showForumBtn) {
    showForumBtn.addEventListener('click', function() {
      forumMain.style.display = 'block';
      showForumBtn.style.display = 'none';
      danmuContainer.style.display = 'none';
    });
  }

  // 返回按钮逻辑
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      forumMain.style.display = 'none';
      showForumBtn.style.display = 'block';
      danmuContainer.style.display = 'block';
    });
  }

  // 全屏弹幕功能
  fetch('comment/comment_list.json')
    .then(res => res.json())
    .then(comments => {
      if (!Array.isArray(comments) || comments.length === 0) return;
      const danmuLines = 10; // 屏幕分10行弹幕
      const usedLines = Array(danmuLines).fill(0);
      function launchDanmu(item) {
        // 随机选择一行
        let line;
        let tryCount = 0;
        do {
          line = Math.floor(Math.random() * danmuLines);
          tryCount++;
        } while (usedLines[line] > 0 && usedLines.some(v=>v===0) && tryCount < 20);
        usedLines[line]++;
        const danmu = document.createElement('div');
        danmu.textContent = item.user + '：' + item.content;
        danmu.style.position = 'fixed';
        danmu.style.whiteSpace = 'nowrap';
        danmu.style.left = '100vw';
        danmu.style.top = (10 + line * 7 + Math.random()*2) + 'vh';

        const fontSize = 25 + Math.floor(Math.random() * 15);
        danmu.style.fontSize = fontSize + 'px';
        danmu.style.color = '#fff';
        danmu.style.textShadow = '0 0 2px #000,0 0 8px #000';
        danmu.style.pointerEvents = 'auto'; // 允许鼠标事件
        danmu.style.zIndex = 1001;
        danmuContainer.appendChild(danmu);
        // 动画
        let left = window.innerWidth;
        const speed = 2 + Math.random()*2; // px/帧
        // 鼠标悬浮暂停，移开恢复
        let paused = false;
        danmu.addEventListener('mouseenter', () => { paused = true; });
        danmu.addEventListener('mouseleave', () => { paused = false; });
        function animate() {
          if (!paused) left -= speed;
          danmu.style.left = left + 'px';
          if (left < -danmu.offsetWidth) {
            danmuContainer.removeChild(danmu);
            usedLines[line]--;
          } else {
            requestAnimationFrame(animate);
          }
        }
        animate();
      }
      // 循环发射弹幕
      let idx = 0;
      setInterval(() => {
        launchDanmu(comments[idx]);
        idx = (idx + 1) % comments.length;
      }, 800);
    });
});
