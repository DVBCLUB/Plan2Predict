import React, { useMemo, useState } from 'react';
import { BarChart3, CheckCircle2, ClipboardCheck, Copy, Flag, Layers3, ListChecks, Target } from 'lucide-react';

type PhaseKey = 'foundation' | 'knowledge' | 'practice' | 'data_ml' | 'devops' | 'governance' | 'polish';

type Phase = {
  id: PhaseKey;
  title: string;
  goal: string;
  done: string[];
  todo: string[];
  risks: string[];
};

const phases: Phase[] = [
  {
    id: 'foundation',
    title: 'Foundation & Navigation',
    goal: 'Giữ cấu trúc dashboard hiện tại ổn định, có index và quick start để người học không bị lạc.',
    done: ['System Map / About Sandbox', 'Deep Research Review Index', 'Deep Research Quick Start Guide', 'Deep Research Glossary Lab'],
    todo: ['Tách nhóm module nếu mục 09 quá dài', 'Thêm anchor/section navigation nội bộ nếu cần'],
    risks: ['Một trang quá dài làm người dùng khó cuộn', 'Nhiều component render cùng lúc có thể làm trang nặng']
  },
  {
    id: 'knowledge',
    title: 'Accounting / Tax / Audit Knowledge',
    goal: 'Tạo khung kiến thức có rule card, bridge matrix và kiểm soát nguồn.',
    done: ['Tax & Accounting Rule Library', 'Accounting - Tax Bridge Matrix', 'Source & Citation Checklist Lab'],
    todo: ['Bổ sung VAS/IFRS theo chuẩn cụ thể', 'Thêm nguồn chính thức cho từng rule card', 'Thêm quiz chuyên sâu theo từng khoản chi'],
    risks: ['Nội dung pháp luật có thể lỗi thời', 'Người học dùng nhầm sandbox như tư vấn chính thức']
  },
  {
    id: 'practice',
    title: 'Practice & Assessment',
    goal: 'Biến kiến thức thành case thực hành và quiz tự kiểm tra.',
    done: ['Case Study & Scenario Lab', 'Learning Assessment Quiz Lab', 'Gross-up/Expense/Journal simulators'],
    todo: ['Thêm case ngành thương mại/dịch vụ/sản xuất', 'Thêm điểm đánh giá theo năng lực', 'Thêm đề bài export markdown'],
    risks: ['Case quá dài làm người mới khó hiểu', 'Thiếu dữ liệu mẫu làm bài tập chưa đủ thực tế']
  },
  {
    id: 'data_ml',
    title: 'Data & ML Readiness',
    goal: 'Chuẩn hóa dữ liệu, explainability, drift và audit analytics cho kế toán/xây dựng.',
    done: ['Data Quality & Pipeline Lab', 'ML Explainability Lab', 'SQL Query Playground'],
    todo: ['Thêm mini dataset mẫu', 'Thêm confusion matrix/precision/recall', 'Thêm model card template'],
    risks: ['Người học tin model tuyệt đối', 'Dữ liệu lỗi làm kết quả dashboard/ML sai']
  },
  {
    id: 'devops',
    title: 'DevOps & Cloud Release',
    goal: 'Kiểm soát build, release, Cloud Run/Firebase, cost guardrails và rollback.',
    done: ['Build Status Checker', 'Release Notes Generator', 'Cloud Launch Checklist'],
    todo: ['Thêm troubleshooting tree cho Cloud Run', 'Thêm hướng dẫn custom domain chi tiết', 'Thêm CI status badge nếu phù hợp'],
    risks: ['Deploy khi build fail', 'Lộ API key', 'Chi phí Cloud tăng nếu cấu hình sai']
  },
  {
    id: 'governance',
    title: 'AI Governance & Human Review',
    goal: 'Đặt chính sách dùng AI, dữ liệu, prompt, code và human review.',
    done: ['AI Governance & Data Policy Lab', 'Security baseline', 'Human review policy'],
    todo: ['Thêm data classification matrix chi tiết', 'Thêm AI prompt templates theo vai trò', 'Thêm checklist phê duyệt nội dung mới'],
    risks: ['Paste dữ liệu thật vào AI', 'AI sửa code phá layout', 'Không có người duyệt kết luận cuối']
  },
  {
    id: 'polish',
    title: 'UI Polish & Performance',
    goal: 'Rà trải nghiệm người dùng, hiệu năng và cách nhóm module cho dễ học.',
    done: ['Giữ style Tailwind hiện tại', 'Không đại tu App.tsx', 'Gắn module an toàn vào mục 09'],
    todo: ['Cân nhắc lazy loading nếu trang nặng', 'Tách Deep Research thành sub-tabs nếu cần', 'Kiểm tra mobile overflow'],
    risks: ['Trang mục 09 quá dài', 'Build bundle tăng', 'Người dùng khó tìm module cụ thể']
  }
];

export default function DeepResearchProgressTracker() {
  const [phaseId, setPhaseId] = useState<PhaseKey>('foundation');
  const [completed, setCompleted] = useState<Record<PhaseKey, boolean>>({
    foundation: true,
    knowledge: true,
    practice: true,
    data_ml: true,
    devops: true,
    governance: true,
    polish: false
  });
  const [copied, setCopied] = useState(false);
  const phase = phases.find(item => item.id === phaseId) ?? phases[0];
  const doneCount = Object.values(completed).filter(Boolean).length;
  const pct = Math.round(doneCount / phases.length * 100);

  const markdown = useMemo(() => `# Deep Research Progress Tracker\n\n## Overall\n- Completed phases: ${doneCount}/${phases.length}\n- Progress: ${pct}%\n\n## Current phase\n${phase.title}\n\n### Goal\n${phase.goal}\n\n### Done\n${phase.done.map(item => `- ${item}`).join('\n')}\n\n### Todo\n${phase.todo.map(item => `- [ ] ${item}`).join('\n')}\n\n### Risks\n${phase.risks.map(item => `- ${item}`).join('\n')}\n\n## Release rule\nKhông mở rộng thêm nếu build/release gate chưa ổn định.`, [doneCount, pct, phase]);

  const copy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-5 text-slate-100 select-text">
      <section className="bg-gradient-to-r from-cyan-950/20 via-[#060a12] to-emerald-950/20 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0"><BarChart3 className="w-5 h-5" /></div>
          <div><h2 className="text-sm font-black text-white uppercase tracking-widest">Deep Research Progress Tracker</h2><p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">Theo dõi tiến độ triển khai Deep Research Review theo phase: foundation, knowledge, practice, data/ML, DevOps, governance và polish.</p></div>
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-3">
        <Metric title="Completed phases" value={`${doneCount}/${phases.length}`} />
        <Metric title="Progress" value={`${pct}%`} />
        <Metric title="Current phase" value={phase.title} />
      </div>

      <div className="grid md:grid-cols-7 gap-2">
        {phases.map(item => <button key={item.id} onClick={() => setPhaseId(item.id)} className={`p-2.5 rounded-xl border text-left transition-all ${phaseId === item.id ? 'bg-cyan-500/10 border-cyan-500 text-white' : 'bg-[#060a12] border-slate-850 text-slate-400 hover:text-white'}`}><span className="text-[9px] font-black uppercase block">{completed[item.id] ? 'Done' : 'Todo'}</span><span className="text-[10px] font-bold leading-snug block mt-1">{item.title}</span></button>)}
      </div>

      <section className="p-4 rounded-xl border border-cyan-500/25 bg-cyan-950/15"><h3 className="text-[10px] font-black uppercase tracking-wider mb-2 text-white flex items-center gap-2"><Target className="w-4 h-4 text-cyan-400" />Mục tiêu phase</h3><p className="text-xs text-cyan-100 font-semibold leading-relaxed">{phase.goal}</p></section>

      <div className="grid md:grid-cols-3 gap-4">
        <ListPanel title="Đã có" icon={CheckCircle2} items={phase.done} tone="emerald" />
        <ListPanel title="Việc tiếp theo" icon={ListChecks} items={phase.todo} tone="amber" />
        <ListPanel title="Rủi ro" icon={Flag} items={phase.risks} tone="rose" />
      </div>

      <label className="p-3 bg-[#060a12] border border-slate-850 rounded-xl text-xs font-semibold flex items-center gap-2"><input type="checkbox" checked={completed[phase.id]} onChange={e => setCompleted(prev => ({ ...prev, [phase.id]: e.target.checked }))} />Đánh dấu phase này đã xong</label>

      <button onClick={copy} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-black rounded-xl flex items-center gap-1.5">{copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}{copied ? 'Đã copy' : 'Copy progress report'}</button>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }) { return <div className="p-3 rounded-xl border border-cyan-500/20 bg-cyan-950/10"><span className="text-[9px] text-slate-500 font-black uppercase block">{title}</span><p className="text-xs font-black text-cyan-300 mt-1 leading-snug">{value}</p></div>; }
function ListPanel({ title, items, icon: Icon, tone }: { title: string; items: string[]; icon: React.ComponentType<{ className?: string }>; tone: 'emerald' | 'amber' | 'rose' }) { const colors = { emerald: 'text-emerald-400 bg-emerald-400', amber: 'text-amber-400 bg-amber-400', rose: 'text-rose-400 bg-rose-400' }[tone]; const [textColor, dotColor] = colors.split(' '); return <section className="p-4 rounded-xl border border-slate-850 bg-slate-900/35"><h3 className="text-[10px] font-black uppercase tracking-wider mb-3 text-white flex items-center gap-2"><Icon className={`w-4 h-4 ${textColor}`} />{title}</h3><ul className="space-y-2">{items.map(item => <li key={item} className="text-xs text-slate-300 font-semibold leading-relaxed flex gap-2"><span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />{item}</li>)}</ul></section>; }
