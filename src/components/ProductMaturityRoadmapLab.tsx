import React, { useMemo, useState } from 'react';
import { CheckCircle2, ClipboardList, Copy, Flag, Layers3, Map, Rocket, ShieldCheck, Target } from 'lucide-react';

type TrackKey = 'knowledge' | 'simulators' | 'data_ml' | 'devops' | 'governance';

type Track = {
  id: TrackKey;
  title: string;
  goal: string;
  current: string[];
  next: string[];
  maturity: string[];
};

const tracks: Track[] = [
  {
    id: 'knowledge',
    title: 'Knowledge Hub',
    goal: 'Biến kho kiến thức kế toán, thuế, kiểm toán, IFRS/VAS thành hệ thống học có cấu trúc và có rule card.',
    current: ['Accounting Knowledge Hub', 'Tax & Accounting Rule Library', 'Accounting - Tax Bridge Matrix'],
    next: ['Thêm VAS/IFRS rule card theo chuẩn', 'Gắn disclaimer và nguồn tham chiếu cho từng card', 'Thêm câu hỏi tự kiểm tra sau mỗi chủ đề'],
    maturity: ['Level 1: nội dung tĩnh', 'Level 2: rule card có checklist', 'Level 3: case study + quiz', 'Level 4: liên kết nguồn luật/chuẩn mực', 'Level 5: cá nhân hóa lộ trình học']
  },
  {
    id: 'simulators',
    title: 'Interactive Simulators',
    goal: 'Tăng phần bấm thử, tính toán và copy output để người học hiểu nghiệp vụ qua thao tác.',
    current: ['Expense Checker', 'Journal Simulator', 'Gross-up Calculator', 'Document Checklist', 'Case Study Lab'],
    next: ['Thêm scoring theo từng khoản chi', 'Thêm dữ liệu mẫu có thể chỉnh', 'Thêm export markdown/CSV cho nhiều công cụ'],
    maturity: ['Level 1: tính toán đơn giản', 'Level 2: checklist copy được', 'Level 3: simulator có nhiều scenario', 'Level 4: import dữ liệu mẫu', 'Level 5: tự sinh bài tập theo vai trò']
  },
  {
    id: 'data_ml',
    title: 'Data & ML Lab',
    goal: 'Xây phần data science cho kế toán, kiểm toán và xây dựng: data quality, fraud, overrun, aging, explainability.',
    current: ['Advanced ML Lab', 'ML Explainability Lab', 'Data Quality & Pipeline Lab', 'SQL Playground'],
    next: ['Thêm mini dataset mẫu', 'Thêm confusion matrix/precision/recall', 'Thêm model drift theo tháng', 'Thêm pipeline diagram theo nguồn dữ liệu'],
    maturity: ['Level 1: giải thích khái niệm', 'Level 2: mô phỏng score', 'Level 3: dataset mẫu', 'Level 4: backtesting', 'Level 5: workflow ML end-to-end']
  },
  {
    id: 'devops',
    title: 'DevOps & Cloud',
    goal: 'Giúp người không chuyên code kiểm soát GitHub, CI/CD, Docker, Cloud Run, Firebase, cost và rollback.',
    current: ['Build Status Checker', 'Cloud Launch Checklist', 'Release Notes Generator', 'CI workflow', 'Dockerfile', 'firebase.json'],
    next: ['Thêm GitHub Actions status reader', 'Thêm Cloud Run troubleshooting tree', 'Thêm domain launch checklist chi tiết', 'Thêm rollback drill'],
    maturity: ['Level 1: deploy thủ công', 'Level 2: CI build check', 'Level 3: release checklist', 'Level 4: preview/PR workflow', 'Level 5: automated QA gate']
  },
  {
    id: 'governance',
    title: 'Governance & QA',
    goal: 'Biến dự án thành sandbox có kiểm soát: không dữ liệu thật, có security, có QA, có roadmap và release discipline.',
    current: ['Project Control & QA Lab', 'Security Policy', 'System Map', 'Risk Register', 'Roadmap Planner'],
    next: ['Thêm data classification matrix', 'Thêm AI usage policy', 'Thêm acceptance criteria templates theo module', 'Thêm changelog theo phase'],
    maturity: ['Level 1: checklist thủ công', 'Level 2: risk register', 'Level 3: governance policy', 'Level 4: audit trail theo release', 'Level 5: multi-user review workflow']
  }
];

export default function ProductMaturityRoadmapLab() {
  const [trackId, setTrackId] = useState<TrackKey>('knowledge');
  const [phase, setPhase] = useState('Phase 2 - Stabilize & Deepen');
  const [copied, setCopied] = useState(false);
  const selected = tracks.find(track => track.id === trackId) ?? tracks[0];

  const markdown = useMemo(() => `# Product Maturity Roadmap\n\n## Phase\n${phase}\n\n## Track\n${selected.title}\n\n## Goal\n${selected.goal}\n\n## Current assets\n${selected.current.map(item => `- ${item}`).join('\n')}\n\n## Next backlog\n${selected.next.map(item => `- [ ] ${item}`).join('\n')}\n\n## Maturity ladder\n${selected.maturity.map(item => `- ${item}`).join('\n')}\n\n## Rule\nKhông thêm tính năng lớn nếu build/release gate chưa ổn. Ưu tiên module nhỏ, có copy output, có dữ liệu mẫu và không phá layout chính.`, [phase, selected]);

  const copy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-5 text-slate-100 select-text">
      <section className="bg-gradient-to-r from-indigo-950/20 via-[#060a12] to-emerald-950/20 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0"><Map className="w-5 h-5" /></div>
          <div><h2 className="text-sm font-black text-white uppercase tracking-widest">Product Maturity & Roadmap Lab</h2><p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">Bản đồ phát triển 12-24 tháng cho Plan2Predict: kiến thức, simulator, data/ML, DevOps và governance.</p></div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-4">
        <div><FieldLabel>Phase</FieldLabel><input value={phase} onChange={e => setPhase(e.target.value)} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200" /></div>
        <div><FieldLabel>Track</FieldLabel><select value={trackId} onChange={e => setTrackId(e.target.value as TrackKey)} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200">{tracks.map(track => <option key={track.id} value={track.id}>{track.title}</option>)}</select></div>
      </div>

      <section className="p-4 rounded-xl border border-indigo-500/25 bg-indigo-950/15"><h3 className="text-[10px] font-black uppercase tracking-wider mb-2 text-white flex items-center gap-2"><Target className="w-4 h-4 text-indigo-400" />Mục tiêu track</h3><p className="text-xs text-indigo-100 font-semibold leading-relaxed">{selected.goal}</p></section>

      <div className="grid md:grid-cols-2 gap-4">
        <ListPanel title="Hiện đã có" icon={CheckCircle2} items={selected.current} tone="emerald" />
        <ListPanel title="Backlog tiếp theo" icon={ClipboardList} items={selected.next} tone="amber" />
      </div>

      <section className="p-4 rounded-xl border border-slate-850 bg-slate-900/35"><h3 className="text-[10px] font-black uppercase tracking-wider mb-3 text-white flex items-center gap-2"><Layers3 className="w-4 h-4 text-purple-400" />Maturity ladder</h3><div className="space-y-2">{selected.maturity.map((item, index) => <div key={item} className="flex gap-3 items-start p-2.5 rounded-xl bg-[#060a12] border border-slate-850"><span className="text-[9px] font-black text-purple-400 font-mono">L{index + 1}</span><p className="text-xs text-slate-300 font-semibold">{item}</p></div>)}</div></section>

      <div className="grid md:grid-cols-2 gap-4">
        <Panel title="Nguyên tắc ưu tiên" icon={Rocket} tone="emerald">Ưu tiên module nhỏ, có dữ liệu mẫu, có copy output và có thể test nhanh. Không đại tu giao diện khi chưa cần.</Panel>
        <Panel title="Release gate" icon={ShieldCheck} tone="rose">Không mở rộng thêm nếu CI/build hoặc Cloud Run đang lỗi. Khóa ổn định trước, mở rộng sau.</Panel>
      </div>

      <button onClick={copy} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-black rounded-xl flex items-center gap-1.5">{copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}{copied ? 'Đã copy' : 'Copy roadmap markdown'}</button>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) { return <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">{children}</label>; }
function ListPanel({ title, items, icon: Icon, tone }: { title: string; items: string[]; icon: React.ComponentType<{ className?: string }>; tone: 'emerald' | 'amber' }) { const colors = tone === 'emerald' ? 'text-emerald-400 bg-emerald-400' : 'text-amber-400 bg-amber-400'; const [textColor, dotColor] = colors.split(' '); return <section className="p-4 rounded-xl border border-slate-850 bg-slate-900/35"><h3 className="text-[10px] font-black uppercase tracking-wider mb-3 text-white flex items-center gap-2"><Icon className={`w-4 h-4 ${textColor}`} />{title}</h3><ul className="space-y-2">{items.map(item => <li key={item} className="text-xs text-slate-300 font-semibold leading-relaxed flex gap-2"><span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />{item}</li>)}</ul></section>; }
function Panel({ title, children, icon: Icon, tone }: { title: string; children: React.ReactNode; icon: React.ComponentType<{ className?: string }>; tone: 'emerald' | 'rose' }) { const colors = { emerald: 'border-emerald-500/25 bg-emerald-950/15 text-emerald-200', rose: 'border-rose-500/25 bg-rose-950/15 text-rose-200' }[tone]; return <section className={`p-4 rounded-xl border ${colors}`}><h3 className="text-[10px] font-black uppercase tracking-wider mb-2 text-white flex items-center gap-2"><Icon className="w-4 h-4" />{title}</h3><div className="text-xs font-semibold leading-relaxed">{children}</div></section>; }
