const mirrorAuditRows = [
  {
    type: 'conflict',
    typeLabel: '口径冲突',
    metric: '砸盘系数 → 涨停分档系数',
    source: '原 UI 文案宣称“按各档晋级率平均”，但源码实际写成涨停家数 > 50 ? 5 : 2。',
    fix: '改用同日真实涨停家数并更名为“涨停分档系数”，修正页面说明，消除图文不符。'
  },
  {
    type: 'estimate',
    typeLabel: '估算改实数',
    metric: '上涨家数',
    source: '历史路径按指数开收涨幅与涨跌停差估算；实时路径可能按 5100 归一化或随机生成。',
    fix: '改为同日沪深北（SH/SZ/BJ）原数直接合计，停用估算、缩放与实时补历史路径。'
  },
  {
    type: 'conflict',
    typeLabel: '口径冲突',
    metric: '炸板率',
    source: '不同模块混用三种定义：1 − 次日成功率、炸板池 / 涨停池、炸板池 / (涨停池 + 炸板池)。',
    fix: '统一按同日真实 炸板池 / (涨停池 + 炸板池) 供数，并在界面明确区分，互不混用。'
  },
  {
    type: 'conflict',
    typeLabel: '口径冲突',
    metric: '涨停溢价 → 晋级得分',
    source: '公式为 successRate × 60 + avgBoardGain × 10，并非真实资金收益率，易被误读为次日回报。',
    fix: '更名为“晋级得分（单位：分）”，显式标注样本日与验证日，并用独立脚本交叉核对源码公式。'
  },
  {
    type: 'missing',
    typeLabel: '缺值防误判',
    metric: '周期阶段与置信度',
    source: '原逻辑对缺失的修复率执行 repair ?? 0，导致缺数时触发 < 20 阈值直接误判为“退潮”。',
    fix: '阻断缺数默认补零路径；当上游修复率、高位风险或龙头反馈缺失时，页面显式标为缺失。'
  },
  {
    type: 'estimate',
    typeLabel: '估算改实数',
    metric: '沪深两市成交额与量能状态',
    source: '不同源存在深证综指/深证成指口径差异，且缺数时默认回退“存量震荡”。',
    fix: '按明确沪深两市口径交叉核验（不含北交所），以原始金额计算变化率，缺数时不伪造状态。'
  }
];

function mirrorCase() {
  if (lang !== 'zh') {
    return `<a class="back" href="#projects">← Selected work</a>
    <article class="finance-story">
      <div class="story-hero">
        <div class="eyebrow">BUILT SYSTEM / 05 · QUANT WORKBENCH INTEGRATION</div>
        <h1>MirrorDesk (明镜台): Integrating &amp; Auditing a Local A-Share Review Workbench</h1>
        <p class="story-lead">Built on top of open-source foundations (Vibe AStock &amp; QuantDash) with AI-assisted development, I audited 12 core market-sentiment formulas, engineered custom highboard comparison &amp; post-close pipelines, unified 5 local services with credential-isolated AI routing, and packaged the workbench as a native macOS app.</p>
        <div class="story-meta">
          <span>Role: System Integration · Metric Auditing · Custom Feature Dev</span>
          <span>Stack: React / TypeScript · Python / FastAPI · Node.js · macOS Applet</span>
          <span>Scope: Local Research &amp; Review Tool (Non-Trading)</span>
        </div>
      </div>
      <div class="story-summary">
        <div><small>WHAT WAS BUILT</small><p>Unified two open-source A-share research tools into one local workbench with custom highboard K-line comparison, 10-day peer timelines, and calendar-aware post-close data refresh.</p></div>
        <div><small>KEY ANALYTICAL CONTRIBUTION</small><p>Audited 12 sentiment indicators line-by-line against source code, fixing silent zero-fill bugs, mislabeled formulas, and estimated breadth counts.</p></div>
        <div><small>BOUNDARIES &amp; CREDIT</small><p>Open-source UI and base endpoints come from Vibe AStock and QuantDash. No live trading execution or predictive alpha is claimed.</p></div>
      </div>
      <section class="story-section">
        <div class="chapter">01 / CORE CONTRIBUTIONS</div>
        <h2>From source-code metric audits to a daily-usable macOS workbench</h2>
        <div class="story-steps">
          <div><b>01 / Formula Audit</b><p>Verified 12 sentiment metrics against source code; blocked silent <code>?? 0</code> fallbacks that misclassified missing data as market downturns.</p></div>
          <div><b>02 / Highboard Views</b><p>Added dual-stock K-line &amp; intraday minute comparison, stock search, and a 10-day peer competition timeline backed by local TDX archives.</p></div>
          <div><b>03 / Unified AI Proxy</b><p>Built a local proxy (port 8791) keeping API keys out of browser storage while syncing model selection across all workbench entries within 5s.</p></div>
          <div><b>04 / macOS Packaging</b><p>Orchestrated 5 local services with health checks, port reuse, lockfiles, and 24 replayable source overlays packaged as <code>明镜台.app</code>.</p></div>
        </div>
      </section>
      <section class="story-section">
        <div class="chapter">02 / BOUNDARIES</div>
        <div class="story-conclusion">
          <h3>Explicit authorship &amp; verification scope</h3>
          <p>Base front-end layouts and upstream market endpoints originate from open-source Vibe AStock and QuantDash. My work covers cross-system metric auditing, custom highboard &amp; intraday chart modules, calendar-aware post-close pipelines, credential-isolated AI proxy orchestration, and replayable overlay deployment. Switch to 中文 (top right) for the full interactive metric audit table and architecture walkthrough.</p>
        </div>
        <p><a class="secondary" href="#case-1">View Financial Analytics Case →</a></p>
      </section>
    </article>`;
  }

  return `<a class="back" href="#projects">← 返回精选研究</a>
  <article class="finance-story mirror-story">
    <div class="story-hero">
      <div class="eyebrow">BUILT SYSTEM / 05 · 投研工具工程与口径审计</div>
      <h1>明镜台 · MirrorDesk：<br>A 股短线复盘与情绪周期整合工作台</h1>
      <p class="story-lead">基于开源 Vibe AStock 与 QuantDash 底座，结合 AI 辅助开发完成的本地化投研工作台。核心工作不是简单拼界面，而是逐行审计 12 项短线情绪指标源码口径、自研同期高标双股对照与盘后自动补采流水线，并将 5 个本地服务与密钥隔离的统一 AI 代理封装为 macOS 一键启动应用。</p>
      <div class="story-meta">
        <span>本人角色：系统整合 · 指标口径审计 · 自研模块与流水线开发</span>
        <span>技术栈：Python / FastAPI · React / TypeScript · Node.js · macOS Applet</span>
        <span>定位：本地复盘与研究工具（非自动交易 / 非荐股）</span>
      </div>
    </div>

    <div class="story-summary">
      <div>
        <small>核心增量</small>
        <p>在两个开源底座之上，完成 12 项指标源码审计纠偏、同期高标双股 K 线/分时对照、10 日竞争时间线与盘后自动刷新流水线。</p>
      </div>
      <div>
        <small>工程架构</small>
        <p>编排 5 个本机服务至统一入口（5941），搭建密钥不进前端的本机统一 AI 代理（8791），封装为健康检查与端口复用的 <code>明镜台.app</code>。</p>
      </div>
      <div>
        <small>诚实边界</small>
        <p>明确区分开源底座与本人二次开发增量；缺数指标显式留空不补零；记录已通过与未覆盖测试，不宣称实盘收益或预测能力。</p>
      </div>
    </div>

    <nav class="story-nav" aria-label="案例章节导航">
      <a href="#m-why" data-mirror-section="m-why">01 项目起因</a>
      <a href="#m-audit" data-mirror-section="m-audit">02 指标口径审计</a>
      <a href="#m-features" data-mirror-section="m-features">03 自研功能与数据流</a>
      <a href="#m-arch" data-mirror-section="m-arch">04 多服务与安全架构</a>
      <a href="#m-limits" data-mirror-section="m-limits">05 验证记录与边界</a>
    </nav>

    <section class="story-section" id="m-why">
      <div class="chapter">01 / MOTIVATION</div>
      <h2>为什么整合两个工具，最难的不是拼界面，而是对齐口径？</h2>
      <div class="story-prose">
        <p>在日常跟踪 A 股短线情绪、连板梯队与高标股演变时，单一开源工具往往各有短板：Vibe AStock 擅长短线情绪快照、连板天梯与复盘工作流，QuantDash 侧重个股/看板可视化；但两者端口分散、AI 密钥各自存在浏览器本地、且同一市场概念在不同源码里的算法口径并不一致。</p>
        <p>如果只是把两个网页套在同一个壳里，很容易把“估算出来的上涨家数”、“定义冲突的炸板率”和“缺数默认补零触发的退潮信号”一起带进复盘结论。因此，我把这次整合拆成三件事：<strong>先审源码口径，再补自研复盘视图与自动采集，最后把多服务与安全代理收敛成一个日常点开就能用的 macOS 桌面应用。</strong></p>
      </div>
      <div class="story-evolution">
        <div>
          <b>阶段 1 · 口径核验与桥接</b>
          <span>逐行核对 12 项情绪与量能指标的源码公式，建立跨系统供数映射与校验脚本，阻断静默补零与估算污染。</span>
        </div>
        <div>
          <b>阶段 2 · 自研复盘模块</b>
          <span>补充同期高标双股 K 线/分时对照、10 日同期竞争时间线、情绪页悬停 K 线预览及通达信盘后缓存构建。</span>
        </div>
        <div>
          <b>阶段 3 · 统一编排与桌面交付</b>
          <span>收拢 5 个本机服务、实现密钥隔离的统一 AI 代理（多端 5 秒同步），并封装为可重放源码覆层与 <code>明镜台.app</code>。</span>
        </div>
      </div>
    </section>

    <section class="story-section" id="m-audit">
      <div class="chapter">02 / SOURCE-CODE METRIC AUDIT</div>
      <h2>把 12 项核心指标的源码公式拆开核对，揪出隐藏的统计陷阱</h2>
      <div class="story-prose">
        <p>与金融量化案例中“先核验 1,118 笔收益口径”的思路一致，在桥接 QuantDash 与 AStock 数据时，我没有直接信任原界面标签，而是对照原始 TypeScript 计算逻辑逐项复算（并以本地缓存跑通一致性对照脚本）。下表摘录 6 项最具代表性的口径纠偏记录：</p>
      </div>

      <div class="audit-panel">
        <div class="audit-toolbar">
          <div class="audit-filters" role="group" aria-label="按问题类型筛选指标审计记录">
            <button type="button" class="audit-btn" data-audit-filter="all" aria-pressed="true">全部问题 (6)</button>
            <button type="button" class="audit-btn" data-audit-filter="conflict" aria-pressed="false">口径冲突 (3)</button>
            <button type="button" class="audit-btn" data-audit-filter="estimate" aria-pressed="false">估算改实数 (2)</button>
            <button type="button" class="audit-btn" data-audit-filter="missing" aria-pressed="false">缺值防误判 (1)</button>
          </div>
          <span class="audit-count" id="mirror-audit-count">显示 6 / 6 项审计记录</span>
        </div>
        <div class="story-table" style="margin:0;border:0;border-radius:0;box-shadow:none">
          <table>
            <thead>
              <tr>
                <th style="width:18%">指标名称</th>
                <th style="width:12%">问题类型</th>
                <th style="width:35%">原源码实现与隐患</th>
                <th style="width:35%">本人纠偏与桥接处理</th>
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
        <b>为什么“缺值留空”比“自动补全”更重要？</b>
        <p>在短线情绪周期判断中，原代码对缺失的修复率执行 <code>repair ?? 0</code>，会直接命中 <code>&lt; 20</code> 的阈值，把“当日数据未到”误判成“市场退潮”。我在适配层显式阻断了这条默认路径：缺少次日完整反馈的修复率、高位风险和龙头状态统一标为缺失，不拿缺口凑完整画面。</p>
      </div>
    </section>

    <section class="story-section" id="m-features">
      <div class="chapter">03 / CUSTOM FEATURES &amp; DATA PIPELINE</div>
      <h2>面向真实复盘动线的 4 项自研增量模块</h2>
      <div class="story-prose">
        <p>除了口径对齐，我还针对日常复盘中最常切换窗口的痛点，在整合工作台与 Python 数据流水线中补充了以下自研功能：</p>
      </div>
      <div class="mirror-feature-grid">
        <div class="mirror-feature-card">
          <div class="mf-head"><span>01 · CHART COMPARISON</span><b>同期高标双股 K 线与分时对照</b></div>
          <p>在「同期高标对比」与「近期高标对比」中接入本机逐股日线缓存，支持悬停预览、展开与同日双股同步对照；可一键切至「当日分时」查看分钟走势并按股票/日期落盘缓存，较早交易日无分钟数据时显式提示缺项。</p>
        </div>
        <div class="mirror-feature-card">
          <div class="mf-head"><span>02 · PEER TIMELINE</span><b>个股搜索与 10 日竞争时间线</b></div>
          <p>支持按股票名或代码检索，默认定位至本地覆盖期内的最高连板日，并可在连板、断板节点间自由切换观察日。图表下方自动列出截至观察日近 10 个交易日的个股高度、同限幅市场最高及当日领先对手（2 板以上最多 3 只），点击对手即可同日打开双股对照图。</p>
        </div>
        <div class="mirror-feature-card">
          <div class="mf-head"><span>03 · INLINE PREVIEW</span><b>情绪复盘悬停行情与分时切换</b></div>
          <p>在「今日情绪」的昨日强势股明细、连板天梯、题材事件和首板名单中，悬停股票名称即可直接预览截至复盘日的不复权日 K 线，点开可无缝切换「日 K 线」与「当日分时」，无需在多个行情软件之间来回跳转。</p>
        </div>
        <div class="mirror-feature-card">
          <div class="mf-head"><span>04 · CALENDAR AUTOMATION</span><b>交易日历感知的盘中/盘后流水线</b></div>
          <p>盘中按北京时间 09:15–11:30、13:00–15:00 分时段轮询，午休与休市自动暂停；盘后 15:15 起自动检查并补采最新收盘快照，配合 15:35 / 16:35 定时补查任务。已验证完整的交易日快照直接复用，失败项在页面打开时约 15 分钟自动重试。</p>
        </div>
      </div>
    </section>

    <section class="story-section" id="m-arch">
      <div class="chapter">04 / ARCHITECTURE, SECURITY &amp; PACKAGING</div>
      <h2>5 服务本地编排、密钥隔离与 macOS 桌面应用封装</h2>
      <div class="story-prose">
        <p>为了避免每次复盘都要手动开四五个终端窗口，同时解决上游工具把 API Key 直接存在浏览器 <code>localStorage</code> 的安全隐患，我搭建了一套轻量、可自愈的本机编排与代理层：</p>
      </div>

      <div class="arch-diagram">
        <div class="arch-top">
          <div class="arch-launcher">
            <small>MACOS DESKTOP LAUNCHER</small>
            <strong>明镜台.app</strong>
            <span>AppleScript + Python 锁文件 · 端口健康检查与复用 · 绝不误杀已占端口进程</span>
          </div>
        </div>
        <div class="arch-arrow" aria-hidden="true">↓ 统一拉起 / 复用 5 项本地服务 ↓</div>
        <div class="arch-services">
          <div class="arch-node arch-primary">
            <code>:5941</code>
            <b>Workbench 整合前端</b>
            <span>统一入口 · React/TS/Vite · 24 个可重放源码覆层</span>
          </div>
          <div class="arch-node arch-accent">
            <code>:8791</code>
            <b>Unified AI 凭据隔离代理</b>
            <span>密钥留在系统配置文件 · 不进前端 · 多端 5s 同步切换模型</span>
          </div>
          <div class="arch-node">
            <code>:5940 / :8770</code>
            <b>Vibe 情绪与复盘引擎</b>
            <span>短线情绪快照 · 连板天梯 · 题材轮动 · 台账</span>
          </div>
          <div class="arch-node">
            <code>:7878</code>
            <b>QuantDash 量化 API</b>
            <span>FastAPI / Uvicorn · 行情与分析接口</span>
          </div>
          <div class="arch-node">
            <code>:3000</code>
            <b>QuantDash 原生前端</b>
            <span>Vite 模块嵌入 · 盘后刷新触发端点</span>
          </div>
        </div>
      </div>

      <div class="formula-pair">
        <div>
          <small>安全边界 · 凭据作用域隔离</small>
          <code>Keys 仅存于本机系统目录 → 代理按服务独立启动进程 → 前端零明文密钥</code>
        </div>
        <div>
          <small>故障保护 · 拒绝静默回退</small>
          <code>统一代理断开时显式提示“未连接”，阻止悄悄回退旧线路；覆层脚本遇未知改动立即停止并要求人工合并</code>
        </div>
      </div>
    </section>

    <section class="story-section" id="m-limits">
      <div class="chapter">05 / VERIFICATION &amp; HONEST BOUNDARIES</div>
      <h2>已验证什么、未验证什么，以及开源底座致谢</h2>
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
              <td><strong>前端构建与类型检查</strong></td>
              <td>4 项前端构建与 TypeScript 类型检查全部通过；24 个源码覆层可重放、有哈希清单与安装前备份。</td>
              <td>不覆盖未登记的后续手动修改，避免静默破坏本地代码。</td>
            </tr>
            <tr>
              <td><strong>核心测试与代理联调</strong></td>
              <td>AI、请求、取消与隐私既有测试 24/24 通过；新增统一状态测试 1/1、代理单元测试 3/3 通过；多端浏览器模型切换联调通过。</td>
              <td>全量历史 Node 测试限时内未跑完，上游 Python 测试环境未装全，<strong>不记为通过</strong>。</td>
            </tr>
            <tr>
              <td><strong>数据口径与实盘边界</strong></td>
              <td>桥接指标经本地缓存与源码公式脚本交叉核验；盘后快照按交易日记录哈希与运行日志。</td>
              <td>未验证算法预测能力或策略收益；不含自动下单，不构成投资建议。</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="story-conclusion">
        <h3>底座致谢与归属声明</h3>
        <p>「明镜台 · MirrorDesk」的基础界面框架与上游基础数据接口基于开源项目 <strong>Vibe AStock</strong> 与 <strong>QuantDash</strong>。本人借助 AI 辅助完成的工作严格界定为：<strong>跨系统指标源码审计与口径纠偏、同期高标双股 K 线/分时与 10 日竞争时间线等自研功能、交易日历感知的盘后自动补采流水线、密钥隔离的本机统一 AI 代理、5 服务编排与 macOS 桌面应用封装。</strong></p>
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
      if (countEl) countEl.textContent = `显示 ${visible} / ${rows.length} 项审计记录`;
    };
  });
}
