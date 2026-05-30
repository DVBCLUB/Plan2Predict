import React, { useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, ClipboardList, Cloud, Copy, Database, GraduationCap, Map, ShieldCheck, Sparkles } from 'lucide-react';

type ReviewArea = {
  title: string;
  purpose: string;
  modules: string[];
  nextAction: string;
};

const areas: ReviewArea[] = [
  {
    title: 'Knowledge & Source Control',
    purpose: 'Kiểm soát nội dung kế toán, thuế, IFRS/VAS, audit bằng rule card, bridge matrix và source checklist.',
    modules: ['Tax & Accounting Rule Library', 'Accounting - Tax Bridge Matrix', 'Source & Citation Checklist Lab'],
    nextAction: 'Bổ sung nguồn chính thức cho từng rule card trước khi dùng cho hồ sơ thật.'
  },
  {
    title: 'Practice & Assessment',
    purpose: 'Biến web học tập thành nơi có case study, bài tập, quiz và kết quả tự kiểm tra.',
    modules: ['Case Study & Scenario Lab', 'Learning Assessment Quiz Lab', 'Interactive Tools & Simulators'],
    nextAction: 'Thêm nhiều case theo ngành xây dựng, thương mại, dịch vụ, sản xuất.'
  },
  {
    title: 'Data & ML Readiness',
    purpose: 'Chuẩn hóa dữ liệu trước khi dùng cho dashboard, audit analytics hoặc machine learning.',
    modules: ['Data Quality & Pipeline Lab', 'ML Explainability Lab', 'SQL Playground'],
    nextAction: 'Thêm mini dataset mẫu để người học thử nghiệm pipeline và score.'
  },
  {
    title: 'DevOps & Release Control',
    purpose: 'Kiểm soát build, release, Cloud Run, Firebase, domain, chi phí và rollback.',
    modules: ['Build Status Checker', 'Release Notes Generator', 'Cloud Launch Checklist'],
    nextAction: 'Theo dõi GitHub Actions/Cloud Run sau mỗi commit trước khi mở rộng tiếp.'
  },
  {
    title: 'Governance & Roadmap',
    purpose: 'Đặt chính sách dùng AI, dữ liệu, human review và roadmap 12-24 tháng.',
    modules: ['AI Governance & Data Policy Lab', 'Product Maturity & Roadmap Lab', 'Project Control & QA Lab'],
    nextAction: 'Chốt phase ưu tiên và tránh thêm module lớn khi build chưa ổn định.'
  }
];

export default function DeepResearchReviewIndex() {
  const [copied, setCopied] = useState(false);
  const markdown = useMemo(() => `# Deep Research Review Index\n\n${areas.map((area, index) => `## ${index + 1}. ${area.title}\n${area.purpose}\n\n### Modules\n${area.modules.map(module => `- ${module}`).join('\n')}\n\n### Next action\n- ${area.nextAction}`).join('\n\n')}\n\n## Operating rule\nMở rộng theo từng module nhỏ, giữ layout hiện tại, build pass trước khi triển khai tiếp.`, []);

  const copy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-5 text-slate-100 select-text">
      <section className="bg-gradient-to-r from-purple-950/20 via-[#060a12] to-cyan-950/20 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0"><Sparkles className="w-5 h-5" /></div>
          <div><h2 className="text-sm font-black text-white uppercase tracking-widest">Deep Research Review Index</h2><p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">Bản đồ tổng hợp các cải tiến đã triển khai theo hướng Deep Research Review để người học không bị lạc trong nhiều module.</p></div>
        </div>
      </section>

      <div className="grid md:grid-cols-5 gap-3">
        <Metric icon={BookOpen} title="Knowledge" value="3 modules" />
        <Metric icon={GraduationCap} title="Practice" value="Quiz + Cases" />
        <Metric icon={Database} title="Data/ML" value="Quality + XAI" />
        <Metric icon={Cloud} title="DevOps" value="Build + Launch" />
        <Metric icon={ShieldCheck} title="Governance" value="Policy + Roadmap" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {areas.map((area, index) => (
          <section key={area.title} className="p-4 rounded-xl border border-slate-850 bg-slate-900/35">
            <div className="flex items-start gap-3"><div className="w-8 h-8 rounded-xl bg-[#060a12] border border-slate-800 flex items-center justify-center text-purple-400 shrink-0 font-black text-[10px]">{index + 1}</div><div><h3 className="text-xs font-black text-white">{area.title}</h3><p className="text-[10.5px] text-slate-400 font-semibold leading-relaxed mt-1">{area.purpose}</p></div></div>
            <div className="mt-3 space-y-2"><h4 className="text-[9px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1"><ClipboardList className="w-3 h-3" />Modules</h4>{area.modules.map(module => <div key={module} className="text-[10.5px] text-slate-300 font-semibold flex gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />{module}</div>)}</div>
            <div className="mt-3 p-3 rounded-xl border border-cyan-500/20 bg-cyan-950/10 text-[10.5px] text-cyan-200 font-semibold leading-relaxed"><Map className="w-3.5 h-3.5 inline mr-1" />{area.nextAction}</div>
          </section>
        ))}
      </div>

      <button onClick={copy} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-black rounded-xl flex items-center gap-1.5">{copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}{copied ? 'Đã copy' : 'Copy review index'}</button>
    </div>
  );
}

function Metric({ icon: Icon, title, value }: { icon: React.ComponentType<{ className?: string }>; title: string; value: string }) {
  return <div className="p-3 bg-[#060a12] border border-slate-850 rounded-xl"><Icon className="w-4 h-4 text-purple-400 mb-2" /><span className="text-[9px] text-slate-500 font-black uppercase block">{title}</span><p className="text-[11px] font-black text-white mt-1">{value}</p></div>;
}
