// ===== 侧边栏抽屉 =====
const sidebar = document.querySelector('.sidebar');
const burger = document.querySelector('.burger');
const scrim = document.querySelector('.scrim');
if (burger) {
  burger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    scrim.classList.toggle('on');
  });
  scrim.addEventListener('click', () => {
    sidebar.classList.remove('open');
    scrim.classList.remove('on');
  });
  document.querySelectorAll('.side-nav a').forEach(a => {
    a.addEventListener('click', () => {
      sidebar.classList.remove('open');
      scrim.classList.remove('on');
    });
  });
}

// ===== 滚动淡入 =====
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 3) * 80 + 'ms';
  io.observe(el);
});

// ===== 数字滚动 =====
const ioNum = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseFloat(el.dataset.count);
    const pre = el.dataset.pre || '';
    const suf = el.dataset.suf || '';
    const dec = parseInt(el.dataset.dec || 0);
    let start = null;
    const run = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1300, 1);
      const v = target * (1 - Math.pow(1 - p, 3));
      el.textContent = pre + (dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US')) + suf;
      if (p < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
    ioNum.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(n => ioNum.observe(n));

// ===== 询价表单：拼装邮件 =====
const quoteForm = document.getElementById('quoteForm');
if (quoteForm) {
  quoteForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const d = new FormData(quoteForm);
    const body = [
      '姓名 / 公司：' + (d.get('name') || ''),
      '联系方式：' + (d.get('contact') || ''),
      '需求产品：' + (d.get('product') || ''),
      '预计数量：' + (d.get('qty') || ''),
      '交货国家/地区：' + (d.get('region') || ''),
      '',
      '需求说明：',
      (d.get('message') || '')
    ].join('\n');
    const url = 'mailto:1450920332@qq.com'
      + '?subject=' + encodeURIComponent('【官网询价】' + (d.get('product') || '纸钩') + ' - ' + (d.get('name') || ''))
      + '&body=' + encodeURIComponent(body);
    window.location.href = url;
    const tip = document.getElementById('formTip');
    if (tip) {
      tip.style.display = 'block';
      tip.textContent = '已调起邮件客户端。若未自动打开，请直接发送至 1450920332@qq.com 或 WhatsApp +86 155 1560 1979。';
    }
  });
}
