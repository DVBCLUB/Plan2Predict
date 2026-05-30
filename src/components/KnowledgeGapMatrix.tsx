import React, { useMemo, useState } from 'react';
import { AlertTriangle, BarChart3, CheckCircle2, ClipboardList, Copy, Database, FileSearch, GraduationCap, Layers3, ShieldCheck } from 'lucide-react';

type KnowledgeArea = 'tax_accounting' | 'audit' | 'data_ml' | 'devops_cloud' | 'governance' | 'practice';

type GapStatus = 'strong' | 'partial' | 'missing';

type GapItem = {
  id: string;
  area: KnowledgeArea;
  title: string;
  sourceCoverage: GapStatus;
  caseCoverage: GapStatus;
  quizCoverage: GapStatus;
  datasetCoverage: GapStatus;
  risk: string;
  nextAction: string;
};

const gapItems: GapItem[] = [
  {
    id: 'tax-rule-source-linking',
    area: 'tax_accounting',
    title: 'VAT / TNDN / TNCN / FCT source-linked rule cards',
    sourceCoverage: 'partial',
    caseCoverage: 'partial',
    quizCoverage: 'partial',
    datasetCoverage: 'missing',
    risk: 'Rule card hiện là sandbox seed; cần gắn văn bản cụ thể trước khi dùng cho hồ sơ thật.',
    nextAction: 'Bổ sung source registry chính thức theo từng điều/khoản, ngày hiệu lực và reviewer.'
  },
  {
    id: 'vas-ifrs-bridge',
    area: 'tax_accounting',
    title: 'VAS / IFRS comparison bridge',
    sourceCoverage: 'partial',
    caseCoverage: 'missing',
    quizCoverage: 'missing',
    datasetCoverage: 'missing',
    risk: 'Người học có thể nhầm giữa chuẩn mực kế toán, chế độ kế toán và quy định thuế.',
    nextAction: 'Thêm VAS/IFRS bridge cards: revenue, inventory, provisions, leases, financial instruments.'
  },
  {
    id: 'audit-analytics',
    area: 'audit',
    title: 'Audit analytics and assertion mapping',
    sourceCoverage: 'partial',
    caseCoverage: 'strong',
    quizCoverage: 'partial',
    datasetCoverage: 'missing',
    risk: 'Analytics chỉ là tín hiệu, người học có thể kết luận gian lận quá sớm.',
    nextAction: 'Thêm assertion matrix, sample dataset và false-positive explanation cho duplicate payment / round amount / weekend posting.'
  },
  {
    id: 'data-quality-pipeline',
    area: 'data_ml',
    title: 'Data quality pipeline before ML/dashboard',
    sourceCoverage: 'partial',
    caseCoverage: 'strong',
    quizCoverage: 'partial',
    datasetCoverage: 'partial',
    risk: 'Thiếu dataset mẫu có thể làm người học chỉ hiểu lý thuyết mà chưa thực hành.',
    nextAction: 'Thêm downloadable sample rows hoặc embedded mock dataset cho expense/invoice/inventory/project/AR.'
  },
  {
    id: 'ml-evaluation',
    area: 'data_ml',
    title: 'ML evaluation, backtesting, drift and model cards',
    sourceCoverage: 'partial',
    caseCoverage: 'partial',
    quizCoverage: 'partial',
    datasetCoverage: 'missing',
    risk: 'Người học có thể tin risk score tuyệt đối nếu thiếu metric và model card.',
    nextAction: 'Thêm confusion matrix, precision/recall, drift chart và model card template.'
  },
  {
    id: 'devops-release',
    area: 'devops_cloud',
    title: 'Cloud Run / Firebase / GitHub Actions release control',
    sourceCoverage: 'partial',
    caseCoverage: 'partial',
    quizCoverage: 'strong',
    datasetCoverage: 'missing',
    risk: 'Cloud UI/cost/config thay đổi nhanh; thiếu source chính thức có thể làm hướng dẫn lỗi thời.',
    nextAction: 'Thêm Cloud Run troubleshooting tree, cost guardrail examples và link source chính thức theo từng command.'
  },
  {
    id: 'ai-governance',
    area: 'governance',
    title: 'AI governance, data policy and human review',
    sourceCoverage: 'partial',
    caseCoverage: 'partial',
    quizCoverage: 'strong',
    datasetCoverage: 'missing',
    risk: 'Người dùng có thể đưa dữ liệu thật hoặc secret vào sandbox/AI prompt.',
    nextAction: 'Thêm data classification matrix, prompt templates an toàn và approval gate trước khi publish content.'
  },
  {
    id: 'practice-path',
    area: 'practice',
    title: 'Role-based learning path, case and quiz coverage',
    sourceCoverage: 'partial',
    caseCoverage: 'strong',
    quizCoverage: 'strong',
    datasetCoverage: 'partial',
    risk: 'Mục 09 đang giàu nội dung nhưng có thể quá dài và gây ngợp.',
    nextAction: 'Tách thành sub-tabs hoặc lazy sections nếu build/performance cho thấy trang nặng.'
  }
];

const areaLabels: Record<KnowledgeArea | 'all', string> = {
  all: 'Tất cả',
  tax_accounting: 'Tax / Accounting',
  audit: 'Audit',
  data_ml: 'Data / ML',
  devops_cloud: 'DevOps / Cloud',
  governance: 'Governance',
  practice: 'Practice'
};

const statusWeight: Record<GapStatus, number> = { strong: 100, partial: 55, missing: 0 };
const statusLabel: Record<GapStatus, string> = { strong: 'Strong', partial: 'Partial', missing: 'Missing' };

export default function KnowledgeGapMatrix() {
  const [area, setArea] = useState<KnowledgeArea | 'all'>('all');
  const [copied, setCopied] = useState(false);
  const filtered = area === 'all' ? gapItems : gapItems.filter(item => item.area === area);

  const score = Math.round(filtered.reduce((sum, item) => sum + statusWeight[item.sourceCoverage] + statusWeight[item.caseCoverage] + statusWeight[item.quizCoverage] + statusWeight[item.datasetCoverage], 0) / Math.max(1, filtered.length * 4));
  const highPriority = filtered.filter(item => [item.sourceCoverage, item.datasetCoverage].includes('missing') || [item.sourceCoverage, item.datasetCoverage].includes('partial')).length;

  const markdown = useMemo(() => `# Knowledge Gap Matrix\n\n## Filter\n${areaLabels[area]}\n\n## Overall score\n${score}%\n\n## Gaps\n${filtered.map(item => `### ${item.title}\n- Area: ${areaLabels[item.area]}\n- Source: ${statusLabel[item.sourceCoverage]}\n- Case: ${statusLabel[item.caseCoverage]}\n- Quiz: ${statusLabel[item.quizCoverage]}\n- Dataset: ${statusLabel[item.datasetCoverage]}\n- Risk: ${item.risk}\n- Next action: ${item.nextAction}`).join('\n\n')}\n\n> Rule: ưu tiên source coverage và dataset coverage trước khi thêm kiến thức nâng cao mới.`, [area, score, filtered]);

  const copy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-5 text-slate-100 select-text">
      <section className="bg-gradient-to-r from-blue-950/20 via-[#060a12] to-amber-950/20 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0"><BarChart3 className="w-5 h-5" /></div>
          <div><h2 className="text-sm font-black text-white uppercase tracking-widest">Knowledge Gap Matrix</h2><p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">Chấm độ đầy đủ của từng mảng kiến thức theo 4 lớp: nguồn, case, quiz và dữ liệu mẫu. Đây là bước triển khai trực tiếp theo Evaluation of Knowledge Content.</p></div>
        </div>
      </section>

      <div className="grid md:grid-cols-4 gap-3">
        <Metric title="Coverage score" value={`${score}%`} tone={score >= 75 ? 'emerald' : score >= 50 ? 'amber' : 'rose'} />
        <Metric title="Gap items" value={String(filtered.length)} tone="blue" />
        <Metric title="Need action" value={String(highPriority)} tone="amber" />
        <Metric title="Mode" value="Sandbox review" tone="rose" />
      </div>

      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {(['all', 'tax_accounting', 'audit', 'data_ml', 'devops_cloud', 'governance', 'practice'] as const).map(key => <button key={key} onClick={() => setArea(key)} className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border ${area === key ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white'}`}>{areaLabels[key]}</button>)}
        </div>
        <button onClick={copy} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-black rounded-xl flex items-center gap-1.5">{copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}{copied ? 'Đã copy' : 'Copy gap matrix'}</button>
      </div>

      <div className="grid xl:grid-cols-2 gap-4">
        {filtered.map(item => <GapCard key={item.id} item={item} />)}
      </div>
    </div>
  );
}

function GapCard({ item }: { item: GapItem }) {
  return <section className="p-4 rounded-xl border border-slate-850 bg-slate-900/35 space-y-3"><div className="flex items-start justify-between gap-3"><div><span className="text-[9px] text-blue-400 font-black uppercase">{areaLabels[item.area]}</span><h3 className="text-sm font-black text-white mt-1 leading-snug">{item.title}</h3></div><Layers3 className="w-5 h-5 text-blue-400 shrink-0" /></div><div className="grid grid-cols-2 md:grid-cols-4 gap-2"><StatusPill label="Source" status={item.sourceCoverage} icon={FileSearch} /><StatusPill label="Case" status={item.caseCoverage} icon={ClipboardList} /><StatusPill label="Quiz" status={item.quizCoverage} icon={GraduationCap} /><StatusPill label="Dataset" status={item.datasetCoverage} icon={Database} /></div><Panel title="Risk" icon={AlertTriangle} tone="rose">{item.risk}</Panel><Panel title="Next action" icon={ShieldCheck} tone="emerald">{item.nextAction}</Panel></section>;
}

function StatusPill({ label, status, icon: Icon }: { label: string; status: GapStatus; icon: React.ComponentType<{ className?: string }> }) {
  const colors = status === 'strong' ? 'border-emerald-500/25 bg-emerald-950/15 text-emerald-300' : status === 'partial' ? 'border-amber-500/25 bg-amber-950/15 text-amber-300' : 'border-rose-500/25 bg-rose-950/15 text-rose-300';
  return <div className={`p-2.5 rounded-xl border ${colors}`}><Icon className="w-4 h-4 mb-1" /><span className="text-[8px] text-slate-500 font-black uppercase block">{label}</span><p className="text-[10px] font-black">{statusLabel[status]}</p></div>;
}

function Metric({ title, value, tone }: { title: string; value: string; tone: 'blue' | 'emerald' | 'amber' | 'rose' }) {
  const colors = { blue: 'text-blue-300 border-blue-500/20 bg-blue-950/10', emerald: 'text-emerald-300 border-emerald-500/20 bg-emerald-950/10', amber: 'text-amber-300 border-amber-500/20 bg-amber-950/10', rose: 'text-rose-300 border-rose-500/20 bg-rose-950/10' }[tone];
  return <div className={`p-3 rounded-xl border ${colors}`}><span className="text-[9px] text-slate-500 font-black uppercase block">{title}</span><p className="text-xs font-black mt-1">{value}</p></div>;
}

function Panel({ title, children, icon: Icon, tone }: { title: string; children: React.ReactNode; icon: React.ComponentType<{ className?: string }>; tone: 'emerald' | 'rose' }) {
  const colors = { emerald: 'border-emerald-500/25 bg-emerald-950/15 text-emerald-200', rose: 'border-rose-500/25 bg-rose-950/15 text-rose-200' }[tone];
  return <section className={`p-3 rounded-xl border ${colors}`}><h4 className="text-[9px] font-black uppercase tracking-wider mb-1.5 text-white flex items-center gap-2"><Icon className="w-3.5 h-3.5" />{title}</h4><div className="text-[10.5px] font-semibold leading-relaxed">{children}</div></section>;
}
