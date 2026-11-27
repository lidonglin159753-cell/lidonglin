const mirrorAuditRows = [
  {
    type: 'conflict',
    typeLabel: '口径冲突',
    metric: '砸盘系数 → 涨停分档系数',
    source: '界面写着“按各档晋级率平均”，翻源码发现只是按涨停家数是否大于 50 简单给 5 或 2。',
    fix: '改用当日真实涨停家数，名字也改成“涨停分档系数”，不再让人误以为是接力强度。'
  },
  {
    type: 'estimate',
    typeLabel: '估算改实数',
    metric: '全市场上涨家数',
    source: '历史数据靠指数涨跌幅反推，实时路径还存在按 5100 缩放或随机数兜底的情况。',
    fix: '改成同日沪深北（SH/SZ/BJ）真实上涨家数直接加总，停掉所有估算和缩放路径。'
  },
  {
    type: 'conflict',
    typeLabel: '口径冲突',
    metric: '炸板率',
    source: '不同页面混用了三种算法：1 − 次日晋级率、炸板/涨停、炸板/(涨停+炸板)，互相打架。',
    fix: '统一按日内真实 炸板池 / (涨停池 + 炸板池) 计算，不和次日溢价混在一起。'
  },
  {
    type: 'conflict',
    typeLabel: '口径冲突',
    metric: '涨停溢价 → 晋级得分',
    source: '公式实际是 successRate × 60 + avgBoardGain × 10，算出来是个分值，并不是真实收益率。',
    fix: '更名为“晋级得分（分）”，标清样本日和次日验证日，并用脚本核对计算一致。'
  },
  {
    type: 'missing',
    typeLabel: '缺值防误判',
    metric: '情绪周期与置信度',
    source: '次日修复率缺失时代码写了 repair ?? 0，数据还没到就直接触发 < 20，把缺数判成“退潮期”。',
    fix: '去掉默认补零。修复率或高位回撤数据没就绪时直接留空，不把缺数伪装成市场走弱。'
  },
  {
    type: 'estimate',
    typeLabel: '估算改实数',
    metric: '沪深两市成交额',
    source: '不同接口混用深证综指和深证成指，前一日数据缺失时还默认写死“存量震荡”。',
    fix: '统一按沪深两市真实成交额（不含北交所）算变化率，缺前日数据时不强行给结论。'
  }
];

const mirrorScreens = [
  {
    tabZh: '01 同期高标对比',
    tabEn: '01 Highboard Peers',
    url: 'mirror/highboard.png',
    titleZh: 'MirrorDesk · 同期高标对比与本地 DeepSeek Agent 实景',
    titleEn: 'MirrorDesk · Highboard peer comparison & local DeepSeek Agent',
    capZh: '实机截图：上方实时显示盘后各表采集进度（未齐备前不静默切日）；右上角接入本地 DeepSeek Agent；主区域按时间窗口和交易日列出四板主池与断板守线标的。',
    capEn: 'Actual local interface: explicit post-close data completeness bar at top, key-isolated DeepSeek Agent on top right, and cross-sectional highboard groupings by trading day.'
  },
  {
    tabZh: '02 情绪周期与涨停结构',
    tabEn: '02 Sentiment & Limit-Up Mix',
    url: 'mirror/sentiment-cycle.png',
    titleZh: '情绪周期 · 涨停结构与首板占比（已关闭模拟与估算回退）',
    titleEn: 'Sentiment Cycle · Limit-Up Structure & First-Board Share',
    capZh: '整合联调实机界面：顶部显式标明“此入口已关闭模拟与估算回退”，按首板 / 2 板 / 3 板 / 4 板及以上堆叠展示真实连板结构与首板占比趋势。',
    capEn: 'Real integration capture explicitly disabling simulated/estimated fallbacks, stacking 1st, 2nd, 3rd, and 4+ consecutive limit-up counts alongside first-board share.'
  },
  {
    tabZh: '03 历史日 K 线与缺失不补零',
    tabEn: '03 Daily K-Line & No Zero-Fill',
    url: 'mirror/stock-kline.png',
    titleZh: '市场与选股 · 未复权历史日 K 线（缺失不补 0）',
    titleEn: 'Market & Screening · Unadjusted Daily K-Line (No Zero-Fill)',
    capZh: '整合界面中的历史日线与个股列表：显式注明数据来源、采集时间与「非实时；缺失不补 0」原则，避免把数据缺口当成真实跌停或零值。',
    capEn: 'Unadjusted historical daily candlesticks with explicit source timestamps and a "no zero-fill on missing data" discipline.'
  }
];

function mirrorGalleryHtml(isZh) {
  const first = mirrorScreens[0];
  return `<div class="mirror-gallery">
    <div class="mg-bar">
      <div class="mg-tabs" role="tablist" aria-label="${isZh ? '明镜台界面切换' : 'MirrorDesk screenshots'}">
        ${mirrorScreens.map((s, idx) => `<button type="button" class="mg-tab" role="tab" data-screen-idx="${idx}" aria-selected="${idx === 0 ? 'true' : 'false'}">${isZh ? s.tabZh : s.tabEn}</button>`).join('')}
      </div>
      <a class="mg-raw" id="mirror-screen-raw" href="${first.url}" target="_blank" rel="noopener">${isZh ? '查看高清原图 ↗' : 'Full resolution ↗'}</a>
    </div>
    <figure class="mirror-shot" style="margin-top:0">
      <div class="mirror-shot-bar">
        <span class="ms-dots"><i></i><i></i><i></i></span>
        <span class="ms-title" id="mirror-screen-title">${isZh ? first.titleZh : first.titleEn}</span>
        <span class="ms-badge">${isZh ? 'ACTUAL UI' : 'LOCAL WORKBENCH'}</span>
      </div>
      <img id="mirror-screen-img" src="${first.url}" alt="${isZh ? first.titleZh : first.titleEn}" loading="lazy">
      <figcaption id="mirror-screen-cap">${isZh ? first.capZh : first.capEn}</figcaption>
    </figure>
  </div>`;
}

function mirrorCase() {
  if (lang !== 'zh') {
    return `<a class="back" href="#projects">← Selected work</a>
    <article class="finance-story mirror-story">
      <div class="story-hero">
        <div class="eyebrow">PERSONAL TOOLING / 05 · A-SHARE REVIEW WORKBENCH</div>
        <h1>MirrorDesk (明镜台):<br>Can the numbers in a market review tool actually be trusted?</h1>
        <p class="story-lead">When reviewing A-share market breadth and leading stocks after market close, two practical problems kept coming up: existing open-source tools quietly mixed indicator definitions (even turning missing data into “downturn” signals), and looking at one stock chart in isolation hides who else was leading that same day. I audited 12 core metrics against the source code, built peer comparison views, and wired in a local AI assistant for daily use.</p>
        <div class="story-meta">
          <span>Focus: Metric auditing · Cross-sectional peer views · Local AI workflow</span>
          <span>Stack: Python · TypeScript · React · Local macOS App</span>
          <span>Scope: Post-close review only (no trading / no alpha claims)</span>
        </div>
      </div>

      ${mirrorGalleryHtml(false)}

      <section class="story-section">
        <div class="chapter">01 / WHAT I FIXED AND BUILT</div>
        <h2>Start with clean numbers, then fix the review workflow</h2>
        <div class="story-prose">
          <p><strong>1. Source-code audit of 12 metrics:</strong> Replaced estimated market breadth with real SH/SZ/BJ counts, unified three conflicting broken-limit formulas, renamed a weighted score mislabeled as “return premium”, and blocked <code>repair ?? 0</code> so missing data stays blank instead of triggering false downturn labels.</p>
          <p><strong>2. Cross-sectional peer views:</strong> Added side-by-side K-line/intraday comparison for two competing highboard stocks on the same day, a 10-day peer competition timeline, and inline K-line hover previews directly inside sentiment lists.</p>
          <p><strong>3. Reliable local setup &amp; AI:</strong> Scheduled post-close snapshots at 15:15 / 15:35 around A-share trading hours, kept model API keys strictly in local system storage outside the browser, and tracked all modifications as replayable overlays.</p>
        </div>
        <div class="story-conclusion">
          <h3>Scope &amp; limits</h3>
          <p>This is a personal research and review tool built by extending open-source market UI components. It does not automate trading, has not been tested for predictive alpha, and leaves missing historical fields explicitly blank. Switch to 中文 (top right) for the full interactive metric audit table.</p>
        </div>
        <p style="margin-top:24px"><a class="secondary" href="#case-1">Read Case 01: Financial product performance &amp; risk monitoring →</a></p>
      </section>
    </article>`;
  }

  return `<a class="back" href="#projects">← 返回精选研究</a>
  <article class="finance-story mirror-story">
    <div class="story-hero">
      <div class="eyebrow">RESEARCH TOOLING / 05 · A 股复盘工具与指标核验</div>
      <h1>明镜台 · MirrorDesk：<br>收盘后看市场情绪，工具里的数字能直接信吗？</h1>
      <p class="story-lead">每天收盘后复盘 A 股市场广度和强势股梯队时，我遇到两个很具体的麻烦：一是现成工具里的指标经常和字面意思对不上，甚至会把“数据没拉完”直接判成“市场退潮”；二是孤立看一只股票的 K 线，很难还原它当天在同批领涨股里排第几。于是我翻源码核验了 12 项核心指标，补上同期双股对照和盘后自动快照，接上本地 AI 助手，改成了自己每天在用的桌面复盘工具。</p>
      <div class="story-meta">
        <span>解决的问题：指标口径失真 · 缺同期对手参照 · 盘后重复手工拉数</span>
        <span>我的工作：12 项源码口径核验 · 高标双股与 10 日对手线 · 本机 AI 接入与一键启动</span>
        <span>使用边界：仅作盘后复盘与笔记整理，不含下单，不宣称策略收益</span>
      </div>
    </div>

    <nav class="story-nav" aria-label="案例章节导航">
      <a href="#m-audit" data-mirror-section="m-audit">01 先查数字对不对</a>
      <a href="#m-ui" data-mirror-section="m-ui">02 界面长什么样</a>
      <a href="#m-eng" data-mirror-section="m-eng">03 本地运行与 AI 怎么接稳</a>
      <a href="#m-limits" data-mirror-section="m-limits">04 边界与说明</a>
    </nav>

    <section class="story-section" id="m-audit">
      <div class="chapter">01 / CHECK THE NUMBERS FIRST</div>
      <h2>先查数字对不对：翻源码核验 12 项指标</h2>
      <div class="story-prose">
        <p>在复用开源行情面板搭建工具时，我没有直接拿上面的数字用，而是先像做量化归因一样把关键指标的计算逻辑翻了一遍。结果发现好几个如果不看源码根本察觉不到的坑：上涨家数有的路径是用指数反推的，炸板率在三个页面里用了三种公式，最误导人的是情绪周期判断——次日修复率还没拉下来时，代码直接写了 <code>repair ?? 0</code>，结果每次盘后数据未齐，系统就会给出一句“退潮期”。</p>
        <p>下面列出 6 项改动最直接的口径记录，可以按问题类型筛选查看：</p>
      </div>

      <div class="audit-panel">
        <div class="audit-toolbar">
          <div class="audit-filters" role="group" aria-label="按问题类型筛选指标审计记录">
            <button type="button" class="audit-btn" data-audit-filter="all" aria-pressed="true">全部 (6)</button>
            <button type="button" class="audit-btn" data-audit-filter="conflict" aria-pressed="false">口径冲突 (3)</button>
            <button type="button" class="audit-btn" data-audit-filter="estimate" aria-pressed="false">估算改实数 (2)</button>
            <button type="button" class="audit-btn" data-audit-filter="missing" aria-pressed="false">缺值防误判 (1)</button>
          </div>
          <span class="audit-count" id="mirror-audit-count">显示 6 / 6 项</span>
        </div>
        <div class="story-table" style="margin:0;border:0;border-radius:0;box-shadow:none">
          <table>
            <thead>
              <tr>
                <th style="width:18%">指标</th>
                <th style="width:12%">问题类型</th>
                <th style="width:35%">原来怎么算的</th>
                <th style="width:35%">我改成怎么算</th>
              </tr>
            </thead>
            <tbody id="mirror-audit-tbody">
              ${mirrorAuditRows.map(r => `<tr data-audit-type="${r.type}">
                <td><strong>${r.metric}</strong></td>
                <td><span class="audit-badge audit-${r.type}">${r.typeLabel}</span></td>
                <td>${r.source}</td>
                <td>${r.fix}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="story-callout">
        <b>一个小原则：缺数就留空，绝不默认补零</b>
        <p>“数据还没到达”和“市场真的走弱”是两回事。阻断补零后，页面顶部直接显示当日各张表的采集进度，数据没齐之前不会偷偷切到新交易日，也不把半成品数字喂给 AI 做总结。</p>
      </div>
    </section>

    <section class="story-section" id="m-ui">
      <div class="chapter">02 / INTERFACE &amp; WORKFLOW</div>
      <h2>把复盘真正要看的界面补齐</h2>
      <div class="story-prose">
        <p>指标对齐之后，我把平时复盘最费时间的三个动作直接做进了界面里，不用再在行情软件、表格和笔记之间来回切窗口：</p>
      </div>

      ${mirrorGalleryHtml(true)}

      <div class="mirror-feature-grid">
        <div class="mirror-feature-card">
          <div class="mf-head"><span>01 · 双股同屏</span><b>同期高标 K 线与分时并排看</b></div>
          <p>在「同期高标对比」里选两只同一天的强势股，直接并排展开日 K 和当日分时。谁先走强、谁在盘中分歧时扛住了回落，一眼就能对比出来，不再事后孤立看单只股票。</p>
        </div>
        <div class="mirror-feature-card">
          <div class="mf-head"><span>02 · 10 日对手线</span><b>搜任意个股，还原同批竞争对手</b></div>
          <p>输入股票名会自动定位到它的最高连板日，下方列出近 10 个交易日同涨跌幅限制下的市场最高板和 2 板以上领先对手，点一下对手名就能直接拉出同日双股对照。</p>
        </div>
        <div class="mirror-feature-card">
          <div class="mf-head"><span>03 · 无跳转预览</span><b>情绪榜单里悬停看 K 线、点击看分时</b></div>
          <p>在昨日强势股、连板天梯和题材列表里，鼠标悬停就能预览截至复盘日的不复权日 K，点击切到当日分时，把整体情绪和个股走势放在同一个视野里。</p>
        </div>
        <div class="mirror-feature-card">
          <div class="mf-head"><span>04 · 交易日历驱动</span><b>盘后 15:15 / 15:35 自动存快照</b></div>
          <p>盘中按 09:15–11:30 和 13:00–15:00 跟踪，休市自动静默；收盘后定时拉取并保存当日情绪、梯队与高标快照，回头复查历史行情时有稳定的原始记录。</p>
        </div>
      </div>
    </section>

    <section class="story-section" id="m-eng">
      <div class="chapter">03 / LOCAL SETUP &amp; AI INTEGRATION</div>
      <h2>把本地运行和 AI 助手接稳：三个实在的工程决定</h2>
      <div class="story-prose">
        <p>工具做出来如果每天打开都要敲几行终端命令，或者过两周自己都改不动，很快就会吃灰。除了前端界面，我在底层主要处理了三件实际问题：</p>
      </div>
      <div class="story-evolution">
        <div>
          <b>01 · API Key 绝不进前端</b>
          <span>接入 DeepSeek 等模型做复盘整理时，把密钥和调用代理留在本地系统安全目录，浏览器里不存任何明文凭据；本地代理断开时直接报错提示，不静默切走。</span>
        </div>
        <div>
          <b>02 · 点一下就能打开</b>
          <span>把多个本地服务收成一个 macOS 桌面入口（明镜台.app），启动时自动检查端口和健康状态，已经跑着的服务直接复用，不用每天手动开终端。</span>
        </div>
        <div>
          <b>03 · 改动可重放、防误改</b>
          <span>自己改过的源码单独收成可重放覆层并记下文件哈希。以后更新或继续迭代时，遇到意外变动会先停下来，不会把之前修好的口径覆盖掉。</span>
        </div>
      </div>
    </section>

    <section class="story-section" id="m-limits">
      <div class="chapter">04 / LIMITS &amp; NOTES</div>
      <h2>能做什么、不能做什么</h2>
      <div class="story-table">
        <table>
          <thead>
            <tr>
              <th style="width:22%">维度</th>
              <th style="width:42%">目前做到了什么</th>
              <th style="width:36%">明确边界</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>数据与口径</strong></td>
              <td>12 项情绪与量能指标已对照源码核验；每日盘后快照和齐备进度留存本机。</td>
              <td>未接入第二家付费商业行情源交叉比对；历史缺失项直接留空。</td>
            </tr>
            <tr>
              <td><strong>测试与运行</strong></td>
              <td>前端构建、类型检查，以及 AI 代理、密钥隔离和状态同步核心测试通过，已在本地实机日常运行。</td>
              <td>部分上游遗留全量测试未在限时内跑完，不记为通过。</td>
            </tr>
            <tr>
              <td><strong>用途范围</strong></td>
              <td>用于盘后复盘、同日标的横截面对比和 AI 辅助整理研究笔记。</td>
              <td><strong>没有验证策略预测能力或收益</strong>，不含任何自动下单功能，不构成投资建议。</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="story-conclusion">
        <h3>做完这个工具留下的收获</h3>
        <p>对我来说，明镜台和前面几个研究案例其实是一脉相承的：遇到不顺手、数字对不上的工具，不将就、不盲信，先把口径查清楚，再把重复的分析动作做成每天真能用得上的小系统。</p>
      </div>

      <p style="margin-top:28px"><a class="secondary" href="#case-1">继续阅读：金融产品表现分析与风险监测 →</a></p>
    </section>
  </article>`;
}

function bindMirror() {
  document.querySelectorAll('[data-mirror-section]').forEach(a => {
    a.onclick = e => {
      e.preventDefault();
      document.getElementById(a.dataset.mirrorSection)?.scrollIntoView();
    };
  });
  const tabs = document.querySelectorAll('[data-screen-idx]');
  const imgEl = document.getElementById('mirror-screen-img');
  const titleEl = document.getElementById('mirror-screen-title');
  const capEl = document.getElementById('mirror-screen-cap');
  const rawEl = document.getElementById('mirror-screen-raw');
  if (tabs.length && imgEl) {
    tabs.forEach(tab => {
      tab.onclick = () => {
        const s = mirrorScreens[+tab.dataset.screenIdx];
        if (!s) return;
        const isZh = lang === 'zh';
        tabs.forEach(t => t.setAttribute('aria-selected', t === tab ? 'true' : 'false'));
        imgEl.src = s.url;
        imgEl.alt = isZh ? s.titleZh : s.titleEn;
        if (titleEl) titleEl.textContent = isZh ? s.titleZh : s.titleEn;
        if (capEl) capEl.textContent = isZh ? s.capZh : s.capEn;
        if (rawEl) rawEl.href = s.url;
      };
    });
  }
  const btns = document.querySelectorAll('[data-audit-filter]');
  const rows = document.querySelectorAll('#mirror-audit-tbody tr');
  const countEl = document.getElementById('mirror-audit-count');
  if (!btns.length || !rows.length) return;
  btns.forEach(btn => {
    btn.onclick = () => {
      const f = btn.dataset.auditFilter;
      btns.forEach(b => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));
      let visible = 0;
      rows.forEach(r => {
        const match = f === 'all' || r.dataset.auditType === f;
        r.hidden = !match;
        if (match) visible++;
      });
      if (countEl) countEl.textContent = `显示 ${visible} / ${rows.length} 项`;
    };
  });
}
