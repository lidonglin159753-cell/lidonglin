const rows = [...document.querySelectorAll('#product-table tbody tr')];
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    rows.forEach(row => {
      row.hidden = button.dataset.filter !== 'all' && row.dataset.label !== button.dataset.filter;
      if (!row.hidden) count++;
    });
    document.querySelector('#row-count').textContent = `${count} 条样例`;
  });
});
const fields = ['views', 'ctr', 'orders'].map(id => document.getElementById(id));
function calculate() {
  const [views, ctr, orders] = fields.map(input => input.valueAsNumber);
  const valid = fields.every(input => input.value !== '' && input.validity.valid) && [views, ctr, orders].every(Number.isFinite);
  const clicks = valid && ctr > 0 && views > 0 ? views * ctr / 100 : null;
  const cvr = clicks ? orders / clicks : null;
  document.getElementById('clicks-result').textContent = clicks === null ? '—' : clicks.toLocaleString('zh-CN', { maximumFractionDigits: 2 });
  document.getElementById('cvr-result').textContent = cvr === null ? '—' : (cvr * 100).toFixed(2) + '%';
  document.getElementById('eligibility').textContent = !valid ? '请填写非负数；CTR 为 0–100%，播放量和订单数为整数。' : views <= 1000 ? '播放量未严格大于 1,000，不进入本项目视频分析范围。' : clicks === null ? '估算点击量不可计算，不做 CVR 判断。' : clicks < 100 ? '估算点击量低于 100，暂不进入 CVR 组合分层。' : '播放量与点击量门槛均满足，可进入组合分层。';
}
fields.forEach(field => field.addEventListener('input', calculate));
calculate();

document.querySelectorAll('[data-open-methods]').forEach(link => link.addEventListener('click', () => { document.getElementById('methods').open = true; }));
