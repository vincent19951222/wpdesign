import React from 'react';
import {
  ArrowLeft,
  FlaskConical,
  Lock,
  LogOut,
  PauseCircle,
  ShieldCheck,
  Sparkles,
  Wrench
} from 'lucide-react';

interface AdminWorkbenchProps {
  onBack: () => void;
  onLogout: () => void;
  onOpenThemeExtractor: () => void;
}

const adminStats = [
  { label: '内部工具', value: '01', hint: '当前保留中', tone: 'yellow' },
  { label: '暂停实验', value: '02', hint: '等待后续判断', tone: 'blue' },
  { label: '正式主流程', value: '03', hint: '保持前台清爽', tone: 'green' }
];

const pausedTools = [
  {
    title: 'API-safe 实验位',
    description: '后续放草稿同步验证、兼容性小实验和低保真链路对照，不急着塞满。',
    badge: 'Reserved'
  },
  {
    title: '后续实验槽位',
    description: '给将来的临时工具预留框架，避免每次都回到首页加一个显性入口。',
    badge: 'Empty'
  }
];

const AdminWorkbench: React.FC<AdminWorkbenchProps> = ({ onBack, onLogout, onOpenThemeExtractor }) => {
  return (
    <div className="landing-flow-shell studio-flow-shell landing-flow-font px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-[1520px]">
        <div className="studio-flow-page-head">
          <div className="studio-flow-page-intro">
            <div className="studio-flow-icon-btn" aria-hidden="true">
              <ShieldCheck strokeWidth={3} />
            </div>
            <div>
              <div className="studio-flow-kicker">Internal workbench</div>
              <h1 className="studio-flow-title">后台工作台</h1>
              <p className="studio-flow-copy">
                这里继续沿用同一套 bright studio 视觉，但语义上只服务内部管理。前台负责稳定工作流，后台只保留低频实验、小工具和等待验证的能力。
              </p>
              <div className="studio-flow-chip-row">
                <span className="studio-flow-chip">Admin access</span>
                <span className="studio-flow-chip">Hidden tools</span>
                <span className="studio-flow-chip">Paused experiments</span>
              </div>
            </div>
          </div>

          <div className="studio-flow-toolbar">
            <div className="studio-flow-action-row">
              <button type="button" className="landing-flow-secondary-btn" onClick={onBack}>
                <ArrowLeft size={18} />
                返回首页
              </button>
              <button type="button" className="landing-flow-secondary-btn" onClick={onLogout}>
                <LogOut size={18} />
                退出后台
              </button>
            </div>
            <div className="workbench-flow-badge-row">
              <span className="workbench-flow-badge">
                <Lock size={14} />
                Admin Access
              </span>
              <span className="workbench-flow-badge workbench-flow-badge--yellow">
                <ShieldCheck size={14} />
                Internal Only
              </span>
            </div>
          </div>
        </div>

        <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_360px]">
          <div className="studio-flow-panel">
            <div className="studio-flow-kicker">Backstage only</div>
            <h2 className="mt-4 text-[clamp(2.3rem,4.3vw,4.6rem)] font-[900] leading-[0.92] tracking-[-0.06em] text-[#1d1d1f]">
              把实验功能收在后台，
              <span className="block text-[#4d58ff]">不要打断正式工作流。</span>
            </h2>
            <p className="studio-flow-copy max-w-[60ch]">
              后台不是另一个产品首页，而是内部工具架。这里保留的能力都不应该稀释主站焦点，只有在高频验证后，才值得重新回到前台。
            </p>
            <div className="studio-flow-compact-stat-grid mt-6">
              {adminStats.map((item) => (
                <div
                  key={item.label}
                  className={`studio-flow-compact-stat ${
                    item.tone === 'yellow'
                      ? 'studio-flow-compact-stat--yellow'
                      : item.tone === 'blue'
                        ? 'studio-flow-compact-stat--blue'
                        : 'studio-flow-compact-stat--green'
                  }`}
                >
                  <div className="studio-flow-compact-stat-label">{item.label}</div>
                  <div className="studio-flow-compact-stat-value">{item.value}</div>
                  <div className="mt-2 text-sm font-semibold text-black/55">{item.hint}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="studio-flow-panel workbench-flow-dark-card">
            <div className="studio-flow-kicker !text-white/50">管理约定</div>
            <div className="mt-5 space-y-5">
              <div>
                <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-white/45">01</div>
                <p className="text-lg font-bold leading-relaxed text-white">主站只保留真正会反复使用的能力，实验入口全部后移。</p>
              </div>
              <div>
                <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-white/45">02</div>
                <p className="text-lg font-bold leading-relaxed text-white">实验工具默认暂停，只有进入高频使用，才值得重新回到前台。</p>
              </div>
              <div>
                <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-white/45">03</div>
                <p className="text-lg font-bold leading-relaxed text-white">后台是内部工具架，不是另一个花哨产品页。</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="studio-flow-kicker">Primary tool</p>
              <h2 className="mt-3 text-[clamp(2rem,3vw,3.2rem)] font-[900] leading-[0.96] tracking-[-0.05em]">
                当前保留中的内部工具
              </h2>
            </div>
            <div className="studio-flow-chip">当前只保留 1 个可操作工具</div>
          </div>

          <article className="workbench-flow-tool-card">
            <div>
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="workbench-flow-tool-icon">
                  <Sparkles size={28} strokeWidth={2.4} />
                </div>
                <div className="workbench-flow-badge workbench-flow-badge--soft">
                  <PauseCircle size={14} />
                  Paused / Internal
                </div>
              </div>
              <h3 className="text-[clamp(2rem,3vw,3rem)] font-[900] leading-[0.96] tracking-[-0.05em] text-[#1d1d1f]">
                主题提取器
              </h3>
              <p className="mt-4 max-w-[58ch] text-lg leading-8 text-black/64">
                从参考 HTML 抽取样式骨架，生成可编辑的主题 JSON。它现在继续保留，但只作为内部实验小工具存在，不再占据前台首页的注意力。
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" className="landing-flow-primary-btn" onClick={onOpenThemeExtractor}>
                  OPEN TOOL
                  <FlaskConical size={18} />
                </button>
                <span className="studio-flow-chip">不纳入正式主流程</span>
              </div>
            </div>

            <div className="studio-flow-panel !p-6">
              <div className="studio-flow-kicker">Why kept here</div>
              <div className="mt-4 grid gap-4 text-sm font-semibold leading-7 text-black/64">
                <p>更适合低频、内部使用，而不是给每个用户一个显性入口。</p>
                <p>当前更高优先级的是 preset 主题、API-safe 和发布链路，而不是开放式自动抽主题。</p>
                <p>保留工具，不等于继续投入主线资源。</p>
              </div>
            </div>
          </article>
        </section>

        <section className="mt-8">
          <div className="mb-5">
            <p className="studio-flow-kicker">Paused shelf</p>
            <h2 className="mt-3 text-[clamp(2rem,3vw,3.2rem)] font-[900] leading-[0.96] tracking-[-0.05em]">
              暂停中的实验槽位
            </h2>
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            {pausedTools.map((tool) => (
              <article key={tool.title} className="studio-flow-panel">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="workbench-flow-tool-icon workbench-flow-tool-icon--soft">
                    <Wrench size={24} strokeWidth={2.4} />
                  </div>
                  <span className="workbench-flow-badge">{tool.badge}</span>
                </div>
                <h3 className="text-[1.9rem] font-[900] leading-[1] tracking-[-0.04em] text-[#1d1d1f]">{tool.title}</h3>
                <p className="mt-4 text-base leading-8 text-black/64">{tool.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 studio-flow-panel">
          <p className="studio-flow-kicker">Operating notes</p>
          <h2 className="mt-3 text-[clamp(1.9rem,2.8vw,3rem)] font-[900] leading-[0.98] tracking-[-0.05em] text-[#1d1d1f]">
            后台使用原则
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="studio-flow-check-item">
              <div className="mb-2 text-sm font-black uppercase tracking-[0.08em] text-[#1d1d1f]">只放低频工具</div>
              一旦某个功能开始高频使用，就应该重新评估它是否要回到主流程，而不是长期躲在后台。
            </div>
            <div className="studio-flow-check-item">
              <div className="mb-2 text-sm font-black uppercase tracking-[0.08em] text-[#1d1d1f]">保留实验，不保留噪音</div>
              后台不是功能垃圾场。只有还值得观察的工具才留着，已经证明没价值的就应该删除。
            </div>
            <div className="studio-flow-check-item">
              <div className="mb-2 text-sm font-black uppercase tracking-[0.08em] text-[#1d1d1f]">主站保持单纯</div>
              首页继续只服务写作、预览和发布，避免被实验能力稀释掉焦点。
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminWorkbench;
