import React, { useMemo, useState } from 'react';
import { BookOpen, Bot, CheckCircle2, Cloud, Copy, Database, Filter, GraduationCap, MapPinned, Search, ShieldCheck, Target } from 'lucide-react';

type ModuleGroup = 'all' | 'start' | 'knowledge' | 'practice' | 'data_ml' | 'devops' | 'governance';

type ModuleItem = {
  title: string;
  group: Exclude<ModuleGroup, 'all'>;
  purpose: string;
  useWhen: string;
  output: string;
};

const modules: ModuleItem[] = [
  { title: 'Deep Research Review Index', group: 'start', purpose: 'Bản đồ tổng quan các nhóm cải tiến.', useWhen: 'Khi mới vào mục 09 và cần biết nên xem gì trước.', output: 'Review index markdown' },
  { title: 'Deep Research Quick Start Guide', group: 'start', purpose: 'Lộ trình học theo vai trò.', useWhen: 'Khi người dùng là kế toán, người học data, builder hoặc quản lý.', output: 'Quick start markdown' },
  { title: 'Deep Research Glossary Lab', group: 'start', purpose: 'Từ điển thuật ngữ VAS, IFRS, tax, audit, ML, DevOps.', useWhen: 'Khi gặp thuật ngữ khó hiểu.', output: 'Glossary markdown' },
  { title: 'Deep Research Progress Tracker', group: 'start', purpose: 'Theo dõi tiến độ phase Deep Research.', useWhen: 'Khi muốn biết đã làm gì, còn gì, rủi ro gì.', output: 'Progress report markdown' },
  { title: 'Tax & Accounting Rule Library', group: 'knowledge', purpose: 'Rule card cho VAT, TNDN, TNCN, FCT, xây dựng, audit.', useWhen: 'Khi học logic thuế/kế toán theo từng chủ đề.', output: 'Rule card markdown' },
  { title: 'Accounting - Tax Bridge Matrix', group: 'knowledge', purpose: 'Nối kế toán, thuế, tài khoản, hồ sơ và kiểm soát.', useWhen: 'Khi cần phân tích một khoản chi cụ thể.', output: 'Bridge matrix markdown' },
  { title: 'Source & Citation Checklist Lab', group: 'knowledge', purpose: 'Kiểm soát nguồn tham chiếu trước khi thêm nội dung.', useWhen: 'Khi bổ sung nội dung pháp luật, thuế, VAS/IFRS, cloud hoặc ML.', output: 'Source checklist markdown' },
  { title: 'Case Study & Scenario Lab', group: 'practice', purpose: 'Case thực chiến tiền dầu, gross-up, overrun, duplicate, VAT lệch.', useWhen: 'Khi muốn học bằng tình huống thực tế.', output: 'Case markdown' },
  { title: 'Learning Assessment Quiz Lab', group: 'practice', purpose: 'Quiz kế toán/thuế, Data/ML, DevOps/Governance.', useWhen: 'Khi muốn tự kiểm tra sau khi học.', output: 'Quiz report markdown' },
  { title: 'Data Quality & Pipeline Lab', group: 'data_ml', purpose: 'Rule kiểm tra dữ liệu expense, invoice, inventory, project, AR.', useWhen: 'Trước khi dùng dữ liệu cho dashboard, audit analytics hoặc ML.', output: 'Data quality report' },
  { title: 'ML Explainability Lab', group: 'data_ml', purpose: 'Giải thích model, threshold, drift và backtesting.', useWhen: 'Khi học ML nâng cao trong kế toán/kiểm toán.', output: 'Explainability report' },
  { title: 'Build Status Checker', group: 'devops', purpose: 'Checklist CI/CD: npm ci, lint, build, Docker, env, Cloud Run.', useWhen: 'Trước khi release hoặc sau khi AI sửa code.', output: 'Build checklist markdown' },
  { title: 'Release Notes Generator', group: 'devops', purpose: 'Tạo release note cho mỗi lần thay đổi.', useWhen: 'Sau mỗi đợt commit hoặc trước deploy.', output: 'Release note markdown' },
  { title: 'Cloud Launch Checklist', group: 'devops', purpose: 'Cloud Run, Firebase rewrite, custom domain, cost guardrails.', useWhen: 'Khi deploy web public hoặc kiểm soát chi phí cloud.', output: 'Cloud checklist markdown' },
  { title: 'Product Maturity & Roadmap Lab', group: 'governance', purpose: 'Roadmap 12-24 tháng theo track.', useWhen: 'Khi chọn hướng phát triển tiếp theo.', output: 'Roadmap markdown' },
  { title: 'AI Governance & Data Policy Lab', group: 'governance', purpose: 'Chính sách dùng AI, dữ liệu, prompt, code, deployment, human review.', useWhen: 'Khi cần tránh lộ dữ liệu, prompt sai hoặc AI tự quyết định quá mức.', output: 'Policy markdown' }
];

const groupLabels: Record<ModuleGroup, string> = {
  all: 'Tất cả', start: 'Start', knowledge: 'Knowledge', practice: 'Practice', data_ml: 'Data / ML', devops: 'DevOps', governance: 'Governance'
};

const groupIcons: Record<Exclude<ModuleGroup, 'all'>, React.ComponentType<{ className?: string }>> = {
  start: MapPinned,
  knowledge: BookOpen,
  practice: GraduationCap,
  data_ml: Database,
  devops: Cloud,
  governance: ShieldCheck
};

export default function DeepResearchModuleNavigator() {
  const [group, setGroup] = useState<ModuleGroup>('all');
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const filtered = modules.filter(item => {
    const matchGroup = group === 'all' || item.group === group;
    const keyword = query.trim().toLowerCase();
    const matchQuery = !keyword || [item.title, item.purpose, item.useWhen, item.output].join(' ').toLowerCase().includes(keyword);
    return matchGroup && matchQuery;
  });

  const markdown = useMemo(() => `# Deep Research Module Navigator\n\n${filtered.map(item => `## ${item.title}\n- Group: ${groupLabels[item.group]}\n- Purpose: ${item.purpose}\n- Use when: ${item.useWhen}\n- Output: ${item.output}`).join('\n\n')}\n\n> Mẹo: chọn module theo việc cần làm, không cần học từ trên xuống dưới toàn bộ.`, [filtered]);

  const copy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-5 text-slate-100 select-text">
      <section className="bg-gradient-to-r from-fuchsia-950/20 via-[#060a12] to-cyan-950/20 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-fuchsia-500/15 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 shrink-0"><MapPinned className="w-5 h-5" /></div>
          <div><h2 className="text-sm font-black text-white uppercase tracking-widest">Deep Research Module Navigator</h2><p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">Bộ tìm kiếm và lọc nhanh để chọn đúng module cần dùng trong mục Deep Research mà không phải cuộn quá lâu.</p></div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">Tìm module</label><div className="relative"><Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="gross-up, cloud, quiz, data quality..." className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 pl-9 text-xs text-slate-200" /></div></div>
        <div><label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">Nhóm module</label><select value={group} onChange={e => setGroup(e.target.value as ModuleGroup)} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200">{Object.entries(groupLabels).map(([key, value]) => <option key={key} value={key}>{value}</option>)}</select></div>
      </div>

      <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-850 bg-slate-900/35"><div className="text-xs text-slate-300 font-semibold flex items-center gap-2"><Filter className="w-4 h-4 text-fuchsia-400" />Đang hiển thị {filtered.length}/{modules.length} module</div><button onClick={copy} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-black rounded-xl flex items-center gap-1.5">{copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}{copied ? 'Đã copy' : 'Copy navigator'}</button></div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(item => {
          const Icon = groupIcons[item.group];
          return <section key={item.title} className="p-4 rounded-xl border border-slate-850 bg-slate-900/35"><div className="flex items-start justify-between gap-3"><h3 className="text-xs font-black text-white flex items-center gap-2"><Icon className="w-4 h-4 text-fuchsia-400" />{item.title}</h3><span className="text-[9px] font-black uppercase text-fuchsia-300 border border-fuchsia-500/20 bg-fuchsia-950/10 rounded px-2 py-1">{groupLabels[item.group]}</span></div><p className="text-[10.5px] text-slate-300 font-semibold leading-relaxed mt-3">{item.purpose}</p><div className="mt-3 p-3 rounded-xl bg-[#060a12] border border-slate-850"><p className="text-[10px] text-slate-500 font-black uppercase flex items-center gap-1"><Target className="w-3 h-3" />Dùng khi</p><p className="text-[10.5px] text-slate-300 font-semibold mt-1">{item.useWhen}</p></div><div className="mt-2 text-[10px] text-cyan-300 font-bold flex items-center gap-1"><ClipboardList className="w-3 h-3" />Output: {item.output}</div></section>;
        })}
      </div>
    </div>
  );
}
