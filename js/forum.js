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
renderForum();

