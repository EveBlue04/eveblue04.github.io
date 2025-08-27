// 对话领域卡片交互占位脚本
const cardsContainer = document.getElementById('cards-container');
const fieldBtns = document.querySelectorAll('.field-btn');
const demoCards = {
  craft: [
    {img: '卡片图片', name: '工艺项目A'},
    {img: '卡片图片', name: '工艺项目B'}
  ],
  medicine: [
    {img: '卡片图片', name: '医药项目A'},
    {img: '卡片图片', name: '医药项目B'}
  ],
  other: [
    {img: '卡片图片', name: '其他项目A'}
  ]
};
function renderCards(field) {
  cardsContainer.innerHTML = '';
  demoCards[field].forEach(card => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `<div class='card-img'>${card.img}</div><div>${card.name}</div>`;
    div.onclick = () => window.location.href = 'project.html';
    cardsContainer.appendChild(div);
  });
}
fieldBtns.forEach(btn => {
  btn.onclick = () => renderCards(btn.dataset.field);
});
// 默认显示第一个领域
renderCards('craft');

