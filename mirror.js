const mirrorAuditRows = [
  {
    type: 'conflict',
    typeLabel: '口径冲突',
    metric: '砸盘系数 → 涨停分档系数',
    source: '原界面宣称“按各档晋级率平均”衡量市场承接，但源码仅以涨停家数 > 50 简单二值映射为 5 或 2。',
    fix: '改用同日真实涨停家数并更名为“涨停分档系数”，避免研究员将简单家数分档误读为接力晋级强度。'
  },
  {
    type: 'estimate',
    typeLabel: '估算改实数',
    metric: '全市场上涨家数',
    source: '历史路径按指数开收涨幅与涨跌停差估算；实时路径存在按 5100 归一化或随机生成逻辑，导致市场广度失真。',
    fix: '改为同日沪深北（SH/SZ/BJ）真实上涨家数直接合计，停用估算、缩放与实时补历史路径。'
  },
  {
    type: 'conflict',
    typeLabel: '口径冲突',
    metric: '炸板率',
    source: '不同模块混用三种定义：1 − 次日晋级率、炸板池 / 涨停池、炸板池 / (涨停池 + 炸板池)，导致日内分歧度不可比。',
    fix: '统一采用日内真实 炸板池 / (涨停池 + 炸板池) 口径供数，并在界面明确区分，不与次日溢价混用。'
  },
  {
    type: 'conflict',
    typeLabel: '口径冲突',
    metric: '涨停溢价 → 晋级得分',
    source: '原公式为 successRate × 60 + avgBoardGain × 10，并非真实持仓收益率，容易误导对短线赚钱效应的评估。',
    fix: '更名为“晋级得分（单位：分）”，显式标明样本日与次日验证日，并用独立脚本交叉核验计算一致性。'
  },
  {
    type: 'missing',
    typeLabel: '缺值防误判',
    metric: '情绪周期与置信度',
    source: '原逻辑对缺失的次日修复率执行 repair ?? 0，导致数据尚未到达时直接触发 < 20 阈值误判为“退潮期”。',
    fix: '阻断缺数默认补零路径；当修复率、高位 A 杀风险或龙头次日反馈缺失时显式留空，绝不将缺口伪装成熊市信号。'
  },
  {
    type: 'estimate',
    typeLabel: '估算改实数',
    metric: '沪深两市成交额与量能状态',
    source: '不同源存在深证综指/深证成指混用，且缺失前日数据时默认回退“存量震荡”，掩盖真实流动性变化。',
    fix: '统一按沪深两市成交额口径交叉核验（不含北交所），以原始金额计算量能变化率，缺数时不伪造量能结论。'
  }
];

function mirrorCase() {
  if (lang !== 'zh') {
    return `<a class="back" href="#projects">← Selected work</a>
    <article class="finance-story">
      <div class="story-hero">
        <div class="eyebrow">FINTECH &amp; QUANT RESEARCH / 05 · MARKET MICROSTRUCTURE WORKBENCH</div>
        <h1>MirrorDesk (明镜台): Bringing Metric Discipline to A-Share Sentiment &amp; Highboard Review</h1>
        <p class="story-lead">Short-term A-share trading revolves around market breadth, limit-up ladders, and sentiment cycles—yet common retail tools suffer from estimated breadth, conflicting broken-limit definitions, and silent zero-fills that misclassify missing data as market downturns. Building atop open-source foundations (Vibe AStock &amp; QuantDash), I audited 12 microstructure indicators, added cross-sectional highboard peer comparisons, and unified the workflow into a local macOS research workbench.</p>
        <div class="story-meta">
          <span>Focus: Market Microstructure · Sentiment Cycles · FinTech Tooling</span>
          <span>Role: Metric Governance · Cross-Sectional Review Views · Workflow Integration</span>
          <span>Scope: Local Research &amp; Post-Close Review (Non-Trading)</span>
        </div>
      </div>
      <div class="story-summary">
        <div><small>FINANCIAL PROBLEM</small><p>Align subjective short-term market review with verifiable breadth, limit-up promotion, and cross-sectional peer competition.</p></div>
        <div><small>CORE CONTRIBUTION</small><p>Audited 12 sentiment &amp; liquidity metrics against source code, engineered dual-stock highboard K-line/intraday views &amp; 10-day peer timelines, and automated post-close snapshots.</p></div>
        <div><small>BOUNDARIES &amp; CREDIT</small><p>Built atop open-source Vibe AStock and QuantDash. Missing data stays explicitly blank; no live trading or alpha claims are made.</p></div>
      </div>
      <section class="story-section">
        <div class="chapter">01 / FINANCE × TECHNOLOGY</div>
        <h2>Using engineering discipline to serve investment research rigor</h2>
        <div class="story-steps">
          <div><b>01 / Metric Governance</b><p>Audited 12 sentiment &amp; volume indicators; eliminated estimated breadth, conflicting broken-limit ratios, and silent zero-fill downturn signals.</p></div>
          <div><b>02 / Cross-Sectional Review</b><p>Built dual-stock K-line &amp; intraday comparison plus a 10-day peer competition timeline showing same-limit market leaders alongside each target stock.</p></div>
          <div><b>03 / Trading-Calendar Flow</b><p>Aligned intraday polling (09:15–15:00) and post-close archival (15:15 / 15:35) to A-share sessions so every review ties back to immutable daily snapshots.</p></div>
          <div><b>04 / Local Privacy &amp; UX</b><p>Unified the multi-service stack into a one-click macOS workbench with key-isolated AI assistance—keeping personal notes and credentials strictly local.</p></div>
        </div>
      </section>
      <section class="story-section">
        <div class="chapter">02 / BOUNDARIES</div>
        <div class="story-conclusion">
          <h3>Open-source attribution &amp; research limits</h3>
          <p>UI foundations and base data endpoints come from open-source Vibe AStock and QuantDash. My work focuses on financial metric auditing, cross-sectional highboard comparison, trading-calendar data archival, and secure local workbench integration. Switch to 中文 (top right) for the full interactive metric audit table.</p>
        </div>
        <p><a class="secondary" href="#case-1">View Financial Analytics Case →</a></p>
      </section>
    </article>`;
  }

  return `<a class="back" href="#projects">← 返回精选研究</a>
  <article class="finance-story mirror-story">
    <div class="story-hero">
      <div class="eyebrow">FINTECH &amp; QUANT RESEARCH / 05 · 金融 × 科技 · 市场微观结构复盘系统</div>
      <h1>明镜台 · MirrorDesk：<br>用指标治理与工程方法，重塑 A 股情绪周期复盘</h1>
      <p class="story-lead">A 股短线博弈的核心不在大盘指数涨跌，而在市场广度、连板高度、晋级率与情绪周期的切换。但在实际复盘中，开源与市面工具常存在“用估算替代真实广度”、“指标口径混用”、“缺数补零误判退潮”等问题。我在开源底座之上，从金融投研口径出发完成 12 项微观结构指标核验，补充同期高标横截面对照与盘后快照体系，将其打磨为日常可用的本地投研工作台。</p>
      <div class="story-meta">
        <span>研究视角：A 股市场微观结构 · 情绪周期 · 横截面龙头对比</span>
        <span>本人增量：12 项指标口径治理 · 高标双股与 10 日竞争轴 · 交易日历盘后流水线</span>
        <span>定位：本地复盘与研究工具（非自动交易 / 非荐股）</span>
      </div>
    </div>

    <div class="story-summary">
      <div>
        <small>解决的金融痛点</small>
        <p>把依赖主观盘感的短线复盘，拉回到可核验的真实上涨家数、日内炸板率、连板晋级与同期对手竞争格局上。</p>
      </div>
      <div>
        <small>金融 × 科技结合点</small>
        <p>用源码审计确保金融指标不失真，用双股 K 线/分时与 10 日竞争轴还原横截面博弈，用交易日历自动化沉淀每日收盘快照。</p>
      </div>
      <div>
        <small>研究与归属边界</small>
        <p>基于开源 Vibe AStock 与 QuantDash 二次开发整合；缺数显式留空不伪造信号，不宣称实盘策略收益或预测能力。</p>
      </div>
    </div>

    <nav class="story-nav" aria-label="案例章节导航">
      <a href="#m-why" data-mirror-section="m-why">01 投研痛点</a>
      <a href="#m-audit" data-mirror-section="m-audit">02 金融口径治理</a>
      <a href="#m-features" data-mirror-section="m-features">03 横截面复盘视图</a>
      <a href="#m-arch" data-mirror-section="m-arch">04 投研基础设施与隐私</a>
      <a href="#m-limits" data-mirror-section="m-limits">05 验证记录与边界</a>
    </nav>

    <section class="story-section" id="m-why">
      <div class="chapter">01 / RESEARCH MOTIVATION</div>
      <h2>短线情绪复盘为什么容易失真？三个必须用工具解决的投研问题</h2>
      <div class="story-prose">
        <p>在观察 A 股短线市场时，单纯看上证指数或个股 K 线，很难解释“为什么同样是三板，上周能走出空间龙，这周却集体核按钮”。真正决定短线赔率的，是当时的<strong>市场情绪周期（冰点 / 修复 / 主升 / 退潮）、流动性量能变化，以及同周期内高标股之间的横截面竞争</strong>。</p>
        <p>当我尝试整合两个开源投研工具（Vibe AStock 与 QuantDash）建立自己的日常复盘框架时，发现直接拿来用会踩进三个典型的金融数据陷阱：一是<strong>指标定义失真</strong>（把指数推算当上涨家数、把加权打分标成涨停溢价）；二是<strong>孤立看龙头</strong>（复盘只看最终走出来的个股，看不到当天同限幅的领先对手是谁）；三是<strong>盘中/盘后数据割裂</strong>（缺少按交易日归档的稳定快照，事后回看容易受后视镜偏差干扰）。</p>
      </div>
      <div class="story-evolution">
        <div>
          <b>01 · 先正口径，再谈情绪周期</b>
          <span>对照金融定义逐项审计 12 项情绪与量能指标源码，清除估算、缩放与三义混用，缺数时宁可留空也不误判退潮。</span>
        </div>
        <div>
          <b>02 · 从单股视角到横截面博弈</b>
          <span>建立同期高标双股 K 线/分时对照与 10 日竞争时间线，把每只高标放回当天的市场高度与对手梯队中观察。</span>
        </div>
        <div>
          <b>03 · 工程隐于幕后，服务复盘纪律</b>
          <span>按 A 股交易日历自动沉淀盘后快照，以密钥隔离的本地 AI 辅助整理复盘，让研究者专注市场判断而非折腾环境。</span>
        </div>
      </div>
    </section>

    <section class="story-section" id="m-audit">
      <div class="chapter">02 / FINANCIAL METRIC GOVERNANCE</div>
      <h2>金融指标口径治理：逐项核验 12 项微观结构指标，消除信号污染</h2>
      <div class="story-prose">
        <p>这与我在指数增强量化研究中“先核验 1,118 笔收益口径、再做风格归因”坚持的是同一条研究纪律：<strong>如果底层金融指标的定义本身有偏差，再漂亮的可视化或 AI 总结都只会放大错误结论。</strong>下表摘录 6 项在跨系统桥接中发现并纠偏的核心金融指标：</p>
      </div>

      <div class="audit-panel">
        <div class="audit-toolbar">
          <div class="audit-filters" role="group" aria-label="按问题类型筛选指标审计记录">
            <button type="button" class="audit-btn" data-audit-filter="all" aria-pressed="true">全部审计项 (6)</button>
            <button type="button" class="audit-btn" data-audit-filter="conflict" aria-pressed="false">口径冲突 (3)</button>
            <button type="button" class="audit-btn" data-audit-filter="estimate" aria-pressed="false">估算改实数 (2)</button>
            <button type="button" class="audit-btn" data-audit-filter="missing" aria-pressed="false">缺值防误判 (1)</button>
          </div>
          <span class="audit-count" id="mirror-audit-count">显示 6 / 6 项金融口径审计</span>
        </div>
        <div class="story-table" style="margin:0;border:0;border-radius:0;box-shadow:none">
          <table>
            <thead>
              <tr>
                <th style="width:18%">金融指标</th>
                <th style="width:12%">偏差类型</th>
                <th style="width:35%">原实现口径与投研误导风险</th>
                <th style="width:35%">纠偏后的投研口径与处理</th>
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
        <b>投研视角下，为什么“显式留空”远胜于“默认补零”？</b>
        <p>在短线情绪周期模型里，次日修复率是判断市场是否进入退潮期的关键阈值。原代码将缺失值直接按 <code>0</code> 处理，导致盘后部分源数据未就绪时，系统自动给出“退潮”信号。在金融风险监测中，<strong>“数据缺失”与“市场走弱”是完全不同的两件事</strong>——我在适配层阻断了补零路径，修复率、高位风险和龙头次日反馈缺数时明确标注缺失，守住信号真实性。</p>
      </div>
    </section>

    <section class="story-section" id="m-features">
      <div class="chapter">03 / CROSS-SECTIONAL REVIEW WORKFLOW</div>
      <h2>把“横截面对比”与“交易时段节奏”做进日常复盘工作流</h2>
      <div class="story-prose">
        <p>金融研究里，脱离横截面基准和当时盘面语境的复盘很容易变成“事后看图说话”。围绕短线复盘的真实决策链条，我重点补齐了 4 项面向投研场景的核心能力：</p>
      </div>
      <div class="mirror-feature-grid">
        <div class="mirror-feature-card">
          <div class="mf-head"><span>01 · PEER K-LINE &amp; INTRADAY</span><b>同期高标双股 K 线与分时同屏对照</b></div>
          <p>在「同期高标对比」与「近期高标对比」中，支持两只竞争个股在同一交易日并排查看日 K 线与当日分时走势。复盘时可以直观对照“谁先上板、谁在分歧时抗住回落、谁先被资金淘汰”，不再孤立看单只股票的形态。</p>
        </div>
        <div class="mirror-feature-card">
          <div class="mf-head"><span>02 · 10-DAY COMPETITION AXIS</span><b>个股检索与近 10 日同限幅竞争时间线</b></div>
          <p>输入任意股票即可自动定位其最高连板日，并在图表下方展开截至观察日近 10 个交易日的横截面竞争记录：同步列出个股自身高度、同涨跌幅限制下的市场最高板，以及当日 2 板以上的领先对手（点击对手即刻打开同日双股对照）。</p>
        </div>
        <div class="mirror-feature-card">
          <div class="mf-head"><span>03 · SENTIMENT-TO-STOCK LINK</span><b>情绪盘面与个股走势的无跳转联动</b></div>
          <p>在「今日情绪」的昨日强势股、连板天梯、题材主线与首板名单中，悬停股票名即可预览截至复盘日的不复权日 K 线，点击可即时切换当日分时。把宏观情绪读数与微观个股承接放在同一视野里，缩短盘面归因路径。</p>
        </div>
        <div class="mirror-feature-card">
          <div class="mf-head"><span>04 · SESSION-AWARE ARCHIVAL</span><b>贴合 A 股交易日历的盘中/盘后快照体系</b></div>
          <p>盘中严格按 A 股交易时段（09:15–11:30、13:00–15:00）动态跟踪，午休与休市自动静默；收盘后于 15:15 / 15:35 自动核查并归档当日情绪、连板天梯、题材与高标快照，确保每一天的复盘都建立在不可篡改的历史盘面事实上。</p>
        </div>
      </div>
    </section>

    <section class="story-section" id="m-arch">
      <div class="chapter">04 / FINTECH INFRASTRUCTURE &amp; COMPLIANCE</div>
      <h2>技术作为投研底座：本地化隐私隔离与一键桌面运行</h2>
      <div class="story-prose">
        <p>金融投研工具是否真的能每天用起来，取决于它够不够稳定、私密、省心。为了避免每天复盘重复配置环境，同时守住金融数据与个人研究记录的隐私边界，我在底层做了三项轻量化工程整合：</p>
      </div>

      <div class="arch-diagram">
        <div class="arch-top">
          <div class="arch-launcher">
            <small>LOCAL RESEARCH DESKTOP · MACOS</small>
            <strong>明镜台.app · 统一投研入口</strong>
            <span>一键启动与健康自检 · 复用已运行本地行情与复盘服务 · 无需手动操作终端</span>
          </div>
        </div>
        <div class="arch-arrow" aria-hidden="true">↓ 围绕投研流程整合三大核心层 ↓</div>
        <div class="arch-services arch-three">
          <div class="arch-node arch-primary">
            <code>DATA &amp; AUDIT</code>
            <b>行情快照与口径桥接层</b>
            <span>统一盘后数据归档、通达信日线/分时缓存与 12 项情绪指标口径校验，数据全部留存本机。</span>
          </div>
          <div class="arch-node arch-accent">
            <code>AI &amp; PRIVACY</code>
            <b>密钥隔离的本机 AI 辅助层</b>
            <span>模型凭据仅存于系统安全目录、绝不进入浏览器前端；支持多模型切换与 5 秒同步，服务断开时显式提示而不静默回退。</span>
          </div>
          <div class="arch-node">
            <code>REPRODUCIBILITY</code>
            <b>可重放覆层与版本防误改</b>
            <span>二次开发改动以可重放源码覆层管理并记录哈希校验，遇到未知改动即停，保证研究工具长期可维护。</span>
          </div>
        </div>
      </div>
    </section>

    <section class="story-section" id="m-limits">
      <div class="chapter">05 / VERIFICATION &amp; HONEST BOUNDARIES</div>
      <h2>工程核验记录、开源底座致谢与研究边界</h2>
      <div class="story-table">
        <table>
          <thead>
            <tr>
              <th>核验维度</th>
              <th>实际执行与结果</th>
              <th>边界说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>金融指标一致性</strong></td>
              <td>桥接后的情绪与量能指标均通过本地缓存与源码公式脚本交叉核验；盘后快照按交易日留存校验记录。</td>
              <td>未独立接入第二家付费商业行情源交叉比对；历史缺失项显式留空。</td>
            </tr>
            <tr>
              <td><strong>系统构建与核心测试</strong></td>
              <td>全部前端构建与类型检查通过；AI 代理、隐私隔离与状态同步核心测试通过并完成实机浏览器联调。</td>
              <td>部分上游遗留全量测试未在限时内跑完，不记为通过，保持诚实记录。</td>
            </tr>
            <tr>
              <td><strong>投研用途边界</strong></td>
              <td>用于盘后情绪复盘、高标横截面对比与交易纪律回溯，沉淀结构化市场观察。</td>
              <td><strong>未验证策略预测能力或超额收益</strong>；不含自动下单功能，不构成任何投资建议。</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="story-conclusion">
        <h3>底座致谢与本人贡献界定</h3>
        <p>「明镜台 · MirrorDesk」的基础界面与上游基础接口基于开源项目 <strong>Vibe AStock</strong> 与 <strong>QuantDash</strong>。本人借助 AI 辅助完成的核心工作严格界定为：<strong>面向 A 股微观结构的 12 项情绪/量能指标源码审计与口径纠偏、同期高标双股 K 线/分时对照与 10 日横截面竞争时间线、贴合交易日历的盘中/盘后快照流水线，以及密钥隔离的本地化桌面工作台整合。</strong></p>
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
      if (countEl) countEl.textContent = `显示 ${visible} / ${rows.length} 项金融口径审计`;
    };
  });
}
