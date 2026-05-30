import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, ClipboardCheck, Copy, FileSearch, GitPullRequestArrow, RefreshCcw, ShieldCheck, UserCheck } from 'lucide-react';

type WorkflowDomain = 'tax' | 'vas_ifrs' | 'audit' | 'cloud_devops' | 'ml_ai' | 'internal_policy';
type WorkflowStepStatus = 'todo' | 'doing' | 'done';

type WorkflowTemplate = {
  title: string;
  trigger: string[];
  sourceTargets: string[];
  reviewerRoles: string[];
  acceptanceCriteria: string[];
  risks: string[];
};

const templates: Record<WorkflowDomain, WorkflowTemplate> = {
  tax: {
    title: 'Vietnam Tax Source Update',
    trigger: ['Nguồn trong Source Freshness Monitor quá 180 ngày', 'Có luật/nghị định/thông tư/công văn mới', 'Rule card đang Needs review', 'Người dùng chuẩn bị dùng checklist cho hồ sơ thật'],
    sourceTargets: ['Luật thuế hiện hành', 'Nghị định', 'Thông tư', 'Công văn/hướng dẫn cơ quan thuế nếu phù hợp', 'Chính sách nội bộ liên quan'],
    reviewerRoles: ['Kế toán thuế', 'Kế toán trưởng', 'Người phụ trách pháp chế/thuế nếu có'],
    acceptanceCriteria: ['Có số văn bản và ngày hiệu lực', 'Có điều/khoản cụ thể', 'Có ngày last reviewed', 'Có reviewer note', 'Rule card ghi rõ simulation hay usable'],
    risks: ['Dùng văn bản hết hiệu lực', 'Nhầm giữa hướng dẫn địa phương và quy định chung', 'Áp dụng sai kỳ tính thuế']
  },
  vas_ifrs: {
    title: 'VAS / IFRS Source Update',
    trigger: ['Thêm bridge card mới', 'Thay đổi chính sách kế toán', 'Có yêu cầu so sánh VAS và IFRS chuyên sâu', 'Chuẩn bị dùng cho tài liệu đào tạo chính thức'],
    sourceTargets: ['VAS/chế độ kế toán áp dụng', 'IFRS/IAS reference', 'Accounting policy nội bộ', 'Ví dụ minh họa/interpretation nếu có'],
    reviewerRoles: ['Kế toán trưởng', 'Người phụ trách báo cáo tài chính', 'IFRS reviewer nếu có'],
    acceptanceCriteria: ['Phân biệt rõ VAS lens, IFRS lens, tax lens', 'Không ghi IFRS như quy định đang áp dụng nếu công ty chưa áp dụng', 'Có evidence list và limitation'],
    risks: ['Nhầm chuẩn mực với chính sách thuế', 'Nhầm IFRS với chế độ kế toán Việt Nam', 'Thiếu disclosure/limitation']
  },
  audit: {
    title: 'Audit Analytics Source Update',
    trigger: ['Thêm rule analytics mới', 'Thêm assertion mapping', 'Thêm case fraud/error/control weakness', 'Cần dùng cho audit training'],
    sourceTargets: ['Audit methodology', 'ISA/VSA reference nếu phù hợp', 'Internal control policy', 'Engagement-specific evidence rules'],
    reviewerRoles: ['Audit reviewer', 'Internal control owner', 'Kế toán trưởng'],
    acceptanceCriteria: ['Rule chỉ tạo signal, không kết luận gian lận', 'Có false positive examples', 'Có evidence required', 'Có human review gate'],
    risks: ['Kết luận quá mức từ dữ liệu', 'Thiếu chứng từ gốc', 'Không phân biệt exception/error/fraud']
  },
  cloud_devops: {
    title: 'Cloud / DevOps Source Update',
    trigger: ['Google Cloud/Firebase UI thay đổi', 'Build/deploy lỗi mới', 'Thêm command hoặc hướng dẫn mới', 'Chi phí cloud bất thường'],
    sourceTargets: ['Google Cloud official docs', 'Firebase official docs', 'GitHub Actions docs', 'Repo config thực tế'],
    reviewerRoles: ['Repo maintainer', 'Cloud owner', 'Security reviewer nếu có'],
    acceptanceCriteria: ['Có nguồn official docs', 'Có rollback plan', 'Không lộ secret', 'Có cost guardrail', 'Có build status note'],
    risks: ['Hướng dẫn lỗi thời', 'Lộ API key', 'Deploy khi build fail', 'Chi phí tăng do cấu hình sai']
  },
  ml_ai: {
    title: 'ML / AI Governance Source Update',
    trigger: ['Thêm model card mới', 'Thêm scoring/risk prediction', 'Thêm AI prompt workflow', 'Dataset/model drift hoặc false positive cao'],
    sourceTargets: ['Model card', 'Data lineage report', 'Data quality report', 'Backtest/drift note', 'Human review policy'],
    reviewerRoles: ['Data owner', 'Model reviewer', 'Business owner', 'Human reviewer'],
    acceptanceCriteria: ['Có target rõ', 'Có metric', 'Có limitation', 'Có human review', 'Không tự động quyết định thật từ model'],
    risks: ['Tin risk score tuyệt đối', 'Model dùng dữ liệu lỗi', 'Thiếu approval gate', 'Prompt lộ dữ liệu thật']
  },
  internal_policy: {
    title: 'Internal Policy Source Update',
    trigger: ['Công ty đổi quy trình', 'Thêm vai trò người duyệt', 'Thêm checklist hồ sơ', 'Thay đổi phân quyền dữ liệu'],
    sourceTargets: ['Quy chế tài chính', 'Quy trình thanh toán', 'Quy trình kho', 'Quy trình tạm ứng/hoàn ứng', 'Data classification policy'],
    reviewerRoles: ['Kế toán trưởng', 'Ban giám đốc', 'HCNS/Pháp chế nếu liên quan', 'Data owner'],
    acceptanceCriteria: ['Có owner', 'Có effective date', 'Có scope áp dụng', 'Có approval note', 'Có version history'],
    risks: ['Quy trình trong app khác quy trình công ty', 'Thiếu phê duyệt', 'Người dùng hiểu sai quyền hạn']
  }
};

const defaultSteps = ['Find current official/internal source', 'Check effective date and scope', 'Map article/section to rule card', 'Update source registry metadata', 'Add reviewer note and limitation', 'Run build/release gate before publish'];

export default function SourceUpdateWorkflowLab() {
  const [domain, setDomain] = useState<WorkflowDomain>('tax');
  const [owner, setOwner] = useState('Source reviewer / Knowledge owner');
  const [statuses, setStatuses] = useState<Record<string, WorkflowStepStatus>>({});
  const [copied, setCopied] = useState(false);
  const template = templates[domain];
  const doneCount = defaultSteps.filter(step => statuses[step] === 'done').length;
  const progress = Math.round((doneCount / defaultSteps.length) * 100);

  const markdown = useMemo(() => `# Source Update Workflow - ${template.title}\n\n## Owner\n${owner}\n\n## Progress\n${progress}% (${doneCount}/${defaultSteps.length})\n\n## Triggers\n${template.trigger.map(item => `- ${item}`).join('\n')}\n\n## Workflow steps\n${defaultSteps.map(step => `- [${statuses[step] === 'done' ? 'x' : ' '}] ${step} (${statuses[step] ?? 'todo'})`).join('\n')}\n\n## Source targets\n${template.sourceTargets.map(item => `- ${item}`).join('\n')}\n\n## Reviewer roles\n${template.reviewerRoles.map(item => `- ${item}`).join('\n')}\n\n## Acceptance criteria\n${template.acceptanceCriteria.map(item => `- [ ] ${item}`).join('\n')}\n\n## Risks\n${template.risks.map(item => `- ${item}`).join('\n')}\n\n> Publish gate: không chuyển nội dung từ sandbox sang usable nếu chưa có source, scope, effective date, reviewer và limitation.`, [template, owner, statuses, progress, doneCount]);

  const copy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const cycleStatus = (step: string) => {
    setStatuses(prev => {
      const current = prev[step] ?? 'todo';
      const next: WorkflowStepStatus = current === 'todo' ? 'doing' : current === 'doing' ? 'done' : 'todo';
      return { ...prev, [step]: next };
    });
  };

  return (
    <div className="space-y-5 text-slate-100 select-text">
      <section className="bg-gradient-to-r from-blue-950/20 via-[#060a12] to-emerald-950/20 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0"><RefreshCcw className="w-5 h-5" /></div>
          <div><h2 className="text-sm font-black text-white uppercase tracking-widest">Source Update Workflow Lab</h2><p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">Quy trình cập nhật nguồn khi nội dung thuế, kế toán, IFRS, audit, cloud hoặc AI governance bị stale/needs review.</p></div>
        </div>
      </section>

      <div className="grid md:grid-cols-4 gap-3">
        <Metric title="Progress" value={`${progress}%`} />
        <Metric title="Steps done" value={`${doneCount}/${defaultSteps.length}`} />
        <Metric title="Domain" value={template.title.split(' ')[0]} />
        <Metric title="Gate" value="Review before publish" />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div><FieldLabel>Workflow domain</FieldLabel><select value={domain} onChange={e => { setDomain(e.target.value as WorkflowDomain); setStatuses({}); }} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200">{Object.entries(templates).map(([key, value]) => <option key={key} value={key}>{value.title}</option>)}</select></div>
        <div><FieldLabel>Owner</FieldLabel><input value={owner} onChange={e => setOwner(e.target.value)} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200" /></div>
        <button onClick={copy} className="self-end px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-black rounded-xl flex items-center justify-center gap-1.5">{copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}{copied ? 'Đã copy' : 'Copy workflow'}</button>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <ListPanel title="Triggers" icon={AlertTriangle} items={template.trigger} tone="rose" />
        <ListPanel title="Source targets" icon={FileSearch} items={template.sourceTargets} tone="blue" />
      </div>

      <section className="p-4 rounded-xl border border-slate-850 bg-slate-900/35"><h3 className="text-[10px] font-black uppercase tracking-wider mb-3 text-white flex items-center gap-2"><ClipboardCheck className="w-4 h-4 text-emerald-400" />Workflow steps</h3><div className="space-y-2">{defaultSteps.map(step => <button key={step} onClick={() => cycleStatus(step)} className="w-full text-left p-3 rounded-xl border border-slate-850 bg-[#060a12] hover:bg-slate-900 transition-all flex items-center justify-between gap-3"><span className="text-xs text-slate-300 font-semibold">{step}</span><span className={`text-[9px] font-black uppercase px-2 py-1 rounded border ${statuses[step] === 'done' ? 'text-emerald-300 border-emerald-500/25 bg-emerald-950/15' : statuses[step] === 'doing' ? 'text-amber-300 border-amber-500/25 bg-amber-950/15' : 'text-slate-400 border-slate-700 bg-slate-950'}`}>{statuses[step] ?? 'todo'}</span></button>)}</div></section>

      <div className="grid lg:grid-cols-2 gap-4">
        <ListPanel title="Reviewer roles" icon={UserCheck} items={template.reviewerRoles} tone="emerald" />
        <ListPanel title="Acceptance criteria" icon={ShieldCheck} items={template.acceptanceCriteria} tone="amber" />
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) { return <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">{children}</label>; }
function Metric({ title, value }: { title: string; value: string }) { return <div className="p-3 rounded-xl border border-blue-500/20 bg-blue-950/10"><span className="text-[9px] text-slate-500 font-black uppercase block">{title}</span><p className="text-[11px] font-black text-blue-300 mt-1 leading-snug">{value}</p></div>; }
function ListPanel({ title, items, icon: Icon, tone }: { title: string; items: string[]; icon: React.ComponentType<{ className?: string }>; tone: 'rose' | 'blue' | 'emerald' | 'amber' }) { const colors = { rose: 'text-rose-400 bg-rose-400', blue: 'text-blue-400 bg-blue-400', emerald: 'text-emerald-400 bg-emerald-400', amber: 'text-amber-400 bg-amber-400' }[tone]; const [textColor, dotColor] = colors.split(' '); return <section className="p-4 rounded-xl border border-slate-850 bg-slate-900/35"><h3 className="text-[10px] font-black uppercase tracking-wider mb-3 text-white flex items-center gap-2"><Icon className={`w-4 h-4 ${textColor}`} />{title}</h3><ul className="space-y-2">{items.map(item => <li key={item} className="text-xs text-slate-300 font-semibold leading-relaxed flex gap-2"><span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />{item}</li>)}</ul></section>; }
