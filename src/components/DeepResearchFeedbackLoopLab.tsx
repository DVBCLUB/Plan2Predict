import React, { useMemo, useState } from 'react';
import { CheckCircle2, ClipboardCheck, Copy, Lightbulb, MessageSquareText, RotateCcw, Star, Target } from 'lucide-react';

type FeedbackArea = 'content' | 'ux' | 'data_ml' | 'devops' | 'governance';

type FeedbackTemplate = {
  title: string;
  prompts: string[];
  signals: string[];
  actions: string[];
};

const templates: Record<FeedbackArea, FeedbackTemplate> = {
  content: {
    title: 'Content Quality Feedback',
    prompts: ['Nội dung nào khó hiểu nhất?', 'Có thuật ngữ nào cần giải thích thêm?', 'Case nào thiếu bối cảnh thực tế?', 'Có phần nào cần nguồn chính thức hơn?'],
    signals: ['Người học hỏi lại cùng một khái niệm', 'Quiz sai nhiều ở một chủ đề', 'Rule card thiếu ví dụ', 'Có rủi ro dùng nhầm sandbox như tư vấn thật'],
    actions: ['Bổ sung glossary', 'Thêm ví dụ nghiệp vụ', 'Thêm source checklist', 'Tách bài học thành phần nhỏ hơn']
  },
  ux: {
    title: 'UX / Navigation Feedback',
    prompts: ['Có phải cuộn quá dài không?', 'Module nào khó tìm?', 'Mobile có bị vỡ layout không?', 'Người dùng muốn tìm theo vai trò hay theo chủ đề?'],
    signals: ['Mục 09 quá dài', 'Người dùng không biết mở module nào', 'Sidebar khó hiểu', 'Nhiều component render làm trang nặng'],
    actions: ['Tạo navigator', 'Tách thành sub-tabs', 'Thêm quick start theo vai trò', 'Cân nhắc lazy loading']
  },
  data_ml: {
    title: 'Data / ML Feedback',
    prompts: ['Rule data quality nào cần thêm?', 'Dataset mẫu có đủ thực tế chưa?', 'Model explanation có dễ hiểu không?', 'Có cần thêm confusion matrix không?'],
    signals: ['Người học tin model tuyệt đối', 'Không hiểu false positive', 'Thiếu dataset mẫu', 'Không phân biệt drift và lỗi dữ liệu'],
    actions: ['Thêm mini dataset', 'Thêm model card', 'Thêm backtesting demo', 'Thêm quiz Data/ML']
  },
  devops: {
    title: 'DevOps / Cloud Feedback',
    prompts: ['Deploy có lỗi ở bước nào?', 'Cloud Run/Firebase phần nào khó hiểu?', 'Có kiểm soát chi phí chưa?', 'Rollback có dễ làm không?'],
    signals: ['Build fail sau commit', 'Lỗi 409 khi update file', 'Không rõ SHA hiện tại', 'Không biết xem logs Cloud Run'],
    actions: ['Bổ sung troubleshooting tree', 'Thêm build status checklist', 'Nhắc lấy SHA mới trước update', 'Thêm cost guardrails']
  },
  governance: {
    title: 'Governance / Safety Feedback',
    prompts: ['Có nguy cơ đưa dữ liệu thật vào sandbox không?', 'Ai duyệt nội dung thuế/kế toán?', 'Prompt nào dễ lộ secret?', 'Policy nào cần rõ hơn?'],
    signals: ['Paste API key vào prompt', 'Upload chứng từ thật', 'AI tự kết luận hồ sơ hợp lệ', 'Thiếu human review'],
    actions: ['Thêm data policy', 'Thêm human review gate', 'Thêm source checklist', 'Thêm cảnh báo trong module']
  }
};

export default function DeepResearchFeedbackLoopLab() {
  const [area, setArea] = useState<FeedbackArea>('content');
  const [impact, setImpact] = useState(4);
  const [effort, setEffort] = useState(2);
  const [note, setNote] = useState('Người dùng cần tìm module nhanh hơn và tránh bị ngợp khi mục 09 quá dài.');
  const [copied, setCopied] = useState(false);
  const selected = templates[area];
  const priority = impact * 2 - effort;
  const priorityText = priority >= 6 ? 'Ưu tiên cao' : priority >= 3 ? 'Ưu tiên vừa' : 'Để backlog';

  const markdown = useMemo(() => `# Deep Research Feedback Loop\n\n## Area\n${selected.title}\n\n## Feedback note\n${note}\n\n## Score\n- Impact: ${impact}/5\n- Effort: ${effort}/5\n- Priority: ${priority} (${priorityText})\n\n## Questions to ask\n${selected.prompts.map(item => `- ${item}`).join('\n')}\n\n## Signals to watch\n${selected.signals.map(item => `- ${item}`).join('\n')}\n\n## Recommended actions\n${selected.actions.map(item => `- [ ] ${item}`).join('\n')}\n\n> Rule: feedback phải chuyển thành backlog nhỏ, có tiêu chí xong, không sửa đại trà nhiều module cùng lúc.`, [selected, note, impact, effort, priority, priorityText]);

  const copy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-5 text-slate-100 select-text">
      <section className="bg-gradient-to-r from-violet-950/20 via-[#060a12] to-emerald-950/20 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0"><MessageSquareText className="w-5 h-5" /></div>
          <div><h2 className="text-sm font-black text-white uppercase tracking-widest">Deep Research Feedback Loop Lab</h2><p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">Biến phản hồi người dùng thành backlog cải tiến nhỏ, có impact, effort, tín hiệu theo dõi và hành động tiếp theo.</p></div>
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-3">
        <Metric title="Impact" value={`${impact}/5`} />
        <Metric title="Effort" value={`${effort}/5`} />
        <Metric title="Priority" value={priorityText} />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div><FieldLabel>Feedback area</FieldLabel><select value={area} onChange={e => setArea(e.target.value as FeedbackArea)} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200">{Object.entries(templates).map(([key, value]) => <option key={key} value={key}>{value.title}</option>)}</select></div>
        <NumberInput label="Impact" value={impact} onChange={setImpact} />
        <NumberInput label="Effort" value={effort} onChange={setEffort} />
      </div>

      <div><FieldLabel>Feedback note</FieldLabel><textarea value={note} onChange={e => setNote(e.target.value)} rows={3} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono" /></div>

      <div className="grid md:grid-cols-3 gap-4">
        <ListPanel title="Câu hỏi nên hỏi" icon={Target} items={selected.prompts} tone="blue" />
        <ListPanel title="Tín hiệu cần theo dõi" icon={Star} items={selected.signals} tone="amber" />
        <ListPanel title="Hành động đề xuất" icon={ClipboardCheck} items={selected.actions} tone="emerald" />
      </div>

      <section className="p-4 rounded-xl border border-violet-500/25 bg-violet-950/15"><h3 className="text-[10px] font-black uppercase tracking-wider mb-2 text-white flex items-center gap-2"><Lightbulb className="w-4 h-4 text-violet-400" />Quy tắc feedback loop</h3><p className="text-xs text-violet-100 font-semibold leading-relaxed">Mỗi phản hồi chỉ nên tạo một backlog nhỏ. Sau khi sửa, chạy Build Status Checker, cập nhật Release Notes và đánh dấu lại trong Progress Tracker.</p></section>

      <div className="flex flex-wrap gap-2"><button onClick={() => { setImpact(4); setEffort(2); setNote('Người dùng cần tìm module nhanh hơn và tránh bị ngợp khi mục 09 quá dài.'); }} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-black rounded-xl flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5" />Reset</button><button onClick={copy} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-black rounded-xl flex items-center gap-1.5">{copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}{copied ? 'Đã copy' : 'Copy feedback report'}</button></div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) { return <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">{children}</label>; }
function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) { return <div><FieldLabel>{label}</FieldLabel><input type="range" min="1" max="5" value={value} onChange={e => onChange(Number(e.target.value))} className="w-full accent-violet-500" /><p className="text-xs text-violet-300 font-mono mt-1">{value}</p></div>; }
function Metric({ title, value }: { title: string; value: string }) { return <div className="p-3 rounded-xl border border-violet-500/20 bg-violet-950/10"><span className="text-[9px] text-slate-500 font-black uppercase block">{title}</span><p className="text-xs font-black text-violet-300 mt-1 leading-snug">{value}</p></div>; }
function ListPanel({ title, items, icon: Icon, tone }: { title: string; items: string[]; icon: React.ComponentType<{ className?: string }>; tone: 'blue' | 'amber' | 'emerald' }) { const colors = { blue: 'text-blue-400 bg-blue-400', amber: 'text-amber-400 bg-amber-400', emerald: 'text-emerald-400 bg-emerald-400' }[tone]; const [textColor, dotColor] = colors.split(' '); return <section className="p-4 rounded-xl border border-slate-850 bg-slate-900/35"><h3 className="text-[10px] font-black uppercase tracking-wider mb-3 text-white flex items-center gap-2"><Icon className={`w-4 h-4 ${textColor}`} />{title}</h3><ul className="space-y-2">{items.map(item => <li key={item} className="text-xs text-slate-300 font-semibold leading-relaxed flex gap-2"><span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />{item}</li>)}</ul></section>; }
