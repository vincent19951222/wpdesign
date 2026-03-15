import React from 'react';
import {
  ArrowLeft,
  Beaker,
  FlaskConical,
  Lock,
  LogOut,
  PauseCircle,
  ShieldCheck,
  Sparkles,
  Wrench
} from 'lucide-react';
import { Button } from './ui/button';

interface AdminWorkbenchProps {
  onBack: () => void;
  onLogout: () => void;
  onOpenThemeExtractor: () => void;
}

const adminStats = [
  { label: '内部工具', value: '01', hint: '当前保留中' },
  { label: '暂停实验', value: '02', hint: '等待后续判断' },
  { label: '正式主流程', value: '03', hint: '保持前台清爽' }
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
    <div className="min-h-screen bg-[#f3ecde] text-neo-ink">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
        <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft size={16} className="mr-2" /> 返回首页
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut size={16} className="mr-2" /> 退出后台
            </Button>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 border-4 border-neo-ink bg-white px-3 py-1 font-mono text-xs font-black uppercase tracking-[0.2em] shadow-neo-sm">
              <Lock size={14} />
              Admin Access
            </div>
            <div className="inline-flex items-center gap-2 border-4 border-neo-ink bg-neo-yellow px-3 py-1 font-mono text-xs font-black uppercase tracking-[0.2em] shadow-neo-sm">
              <ShieldCheck size={14} />
              Internal Workbench
            </div>
          </div>
        </div>

        <section className="mb-10 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="border-4 border-neo-ink bg-white p-6 shadow-neo-xl md:p-8">
            <div className="mb-4 inline-flex items-center gap-2 border-4 border-neo-ink bg-neo-accent px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-white shadow-neo-sm">
              <FlaskConical size={14} />
              Backstage Only
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-[0.92] tracking-tight md:text-6xl">
              把实验功能收在后台，
              <span className="mt-2 block text-neo-accent">不要打断正式工作流。</span>
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-neo-ink/72 md:text-xl">
              这里是内部工作台。前台负责稳定的 Markdown、主题和发布链路；后台只承接实验、小工具和还没验证完价值的能力。
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {adminStats.map((item) => (
                <div key={item.label} className="border-4 border-neo-ink bg-[#fff8e9] p-4 shadow-neo-sm">
                  <div className="font-mono text-xs font-black uppercase tracking-[0.2em] text-neo-ink/45">{item.label}</div>
                  <div className="mt-2 text-3xl font-black">{item.value}</div>
                  <div className="mt-1 text-sm font-bold text-neo-ink/65">{item.hint}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-4 border-neo-ink bg-[#1c1a17] p-6 text-[#f5ecd0] shadow-neo-xl md:p-8">
            <div className="mb-4 inline-flex items-center gap-2 border-2 border-[#f5ecd0] px-3 py-1 font-mono text-xs font-black uppercase tracking-[0.2em]">
              管理约定
            </div>
            <div className="space-y-5">
              <div>
                <div className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-[#f5ecd0]/55">01</div>
                <p className="text-lg font-bold">主站只保留真正会反复使用的能力，实验入口全部后移。</p>
              </div>
              <div>
                <div className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-[#f5ecd0]/55">02</div>
                <p className="text-lg font-bold">实验工具默认是暂停状态，只有当它进入高频使用，才值得回到前台。</p>
              </div>
              <div>
                <div className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-[#f5ecd0]/55">03</div>
                <p className="text-lg font-bold">后台不是另一个产品页，而是一个干净的内部工具架。</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.24em] text-neo-ink/50">Primary Tool</p>
              <h2 className="text-3xl font-black md:text-5xl">当前保留中的内部工具</h2>
            </div>
            <div className="border-4 border-neo-ink bg-white px-4 py-2 text-sm font-bold shadow-neo-sm">
              当前只保留 1 个可操作工具
            </div>
          </div>

          <article className="grid gap-6 border-4 border-neo-ink bg-white p-6 shadow-neo-xl md:grid-cols-[1.1fr_0.9fr] md:p-8">
            <div>
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="inline-flex h-16 w-16 items-center justify-center border-4 border-neo-ink bg-neo-yellow shadow-neo-sm">
                  <Sparkles size={28} strokeWidth={2.4} />
                </div>
                <div className="inline-flex items-center gap-2 border-4 border-neo-ink bg-[#fff1c4] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] shadow-neo-sm">
                  <PauseCircle size={14} />
                  Paused / Internal
                </div>
              </div>
              <h3 className="text-3xl font-black">主题提取器</h3>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-neo-ink/72">
                从参考 HTML 抽取样式骨架，生成可编辑的主题 JSON。现在它不再占据首页，而是作为内部小工具保留，用于对照、实验和偶发需求。
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={onOpenThemeExtractor}>
                  打开工具
                </Button>
                <div className="border-4 border-neo-ink bg-[#fff6e8] px-3 py-2 text-xs font-bold uppercase tracking-wide shadow-neo-sm">
                  不纳入正式主流程
                </div>
              </div>
            </div>

            <div className="border-4 border-neo-ink bg-[#fff8ea] p-5 shadow-neo-sm">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-neo-ink/45">Why kept here</p>
              <div className="space-y-4 text-sm font-bold leading-relaxed text-neo-ink/75">
                <p>更适合低频、内部使用，而不是给每个用户一个显性入口。</p>
                <p>当前更高优先级的是 preset 主题、API-safe 和发布链路，而不是开放式自动抽主题。</p>
                <p>保留工具，不等于继续投入主线资源。</p>
              </div>
            </div>
          </article>
        </section>

        <section className="mb-12">
          <div className="mb-5">
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.24em] text-neo-ink/50">Paused Shelf</p>
            <h2 className="text-3xl font-black md:text-5xl">暂停中的实验槽位</h2>
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            {pausedTools.map((tool) => (
              <article key={tool.title} className="border-4 border-neo-ink bg-[#f8f4eb] p-6 shadow-neo-md">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="inline-flex h-14 w-14 items-center justify-center border-4 border-neo-ink bg-white shadow-neo-sm">
                    <Wrench size={24} strokeWidth={2.4} />
                  </div>
                  <div className="border-4 border-neo-ink bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.18em] shadow-neo-sm">
                    {tool.badge}
                  </div>
                </div>
                <h3 className="text-2xl font-black">{tool.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-neo-ink/68">{tool.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-4 border-neo-ink bg-white p-6 shadow-neo-xl md:p-8">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.24em] text-neo-ink/50">Operating Notes</p>
          <h2 className="text-2xl font-black md:text-4xl">后台使用原则</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="border-4 border-neo-ink bg-[#fff8ea] p-4 shadow-neo-sm">
              <div className="mb-2 text-sm font-black uppercase">只放低频工具</div>
              <p className="text-sm leading-relaxed text-neo-ink/70">一旦某个功能开始高频使用，就应该重新评估它是否要回到主流程，而不是长期躲在后台。</p>
            </div>
            <div className="border-4 border-neo-ink bg-[#fff8ea] p-4 shadow-neo-sm">
              <div className="mb-2 text-sm font-black uppercase">保留实验，不保留噪音</div>
              <p className="text-sm leading-relaxed text-neo-ink/70">后台不是功能垃圾场。只有还值得观察的工具才留着，已经证明没价值的就应该删除。</p>
            </div>
            <div className="border-4 border-neo-ink bg-[#fff8ea] p-4 shadow-neo-sm">
              <div className="mb-2 text-sm font-black uppercase">主站保持单纯</div>
              <p className="text-sm leading-relaxed text-neo-ink/70">首页继续只服务写作、预览和发布，避免被实验能力稀释掉焦点。</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminWorkbench;
