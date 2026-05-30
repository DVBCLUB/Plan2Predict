import React, { useMemo, useState } from 'react';
import { Award, BarChart3, CheckCircle2, ClipboardCheck, Copy, GraduationCap, Layers3, Lightbulb, Target } from 'lucide-react';

type RubricTrack = 'tax_accounting' | 'audit_analytics' | 'data_ml' | 'devops_cloud' | 'governance';
type Level = 'foundation' | 'practitioner' | 'advanced' | 'reviewer';

type Rubric = {
  title: string;
  goal: string;
  levels: Record<Level, string[]>;
  evidence: string[];
  nextPractice: string[];
};

const rubrics: Record<RubricTrack, Rubric> = {
  tax_accounting: {
    title: 'Tax / Accounting Mastery Rubric',
    goal: 'Đánh giá khả năng hiểu và áp dụng VAS, thuế, hồ sơ chi phí, bridge kế toán-thuế trong sandbox.',
    levels: {
      foundation: ['Hiểu khác nhau giữa kế toán, thuế và hồ sơ chứng từ', 'Đọc được rule card VAT/TNDN/TNCN/FCT', 'Nhận biết cảnh báo simulation-only'],
      practitioner: ['Lập được checklist hồ sơ theo khoản chi', 'Giải thích được vì sao một khoản chi cần review', 'Dùng bridge matrix để nối tài khoản, thuế và chứng từ'],
      advanced: ['Phân tích case gross-up, 154, VAT mismatch và chi phí được trừ', 'Đề xuất bút toán/kiểm soát nhưng vẫn ghi rõ giả định', 'Biết khi nào cần nguồn chính thức hoặc người duyệt'],
      reviewer: ['Rà được source registry, status và last reviewed', 'Yêu cầu bổ sung văn bản/điều khoản khi thiếu nguồn', 'Không cho dùng kết luận sandbox như tư vấn chính thức']
    },
    evidence: ['Completed rule card report', 'Source checklist', 'Case study answer', 'Quiz score >= 70%', 'Human review note'],
    nextPractice: ['Làm case gross-up TNCN', 'Soát VAT input deduction', 'Phân tích TK 154 theo công trình', 'Tạo source-linked rule card mới']
  },
  audit_analytics: {
    title: 'Audit Analytics Mastery Rubric',
    goal: 'Đánh giá khả năng dùng dữ liệu để chọn mẫu, phát hiện exception và giải thích false positive.',
    levels: {
      foundation: ['Hiểu analytics là tín hiệu, không phải kết luận gian lận', 'Biết duplicate payment, round amount, weekend posting là rule chọn mẫu'],
      practitioner: ['Viết được test logic đơn giản', 'Đọc được fail count trong Data Quality Pipeline', 'Giải thích được false positive'],
      advanced: ['Map được rule với assertion và evidence cần kiểm tra', 'Thiết kế review queue theo severity', 'Đề xuất fix data/master data'],
      reviewer: ['Phân biệt exception, error, fraud và control weakness', 'Yêu cầu chứng từ gốc trước khi kết luận', 'Ghi audit conclusion có giới hạn rõ ràng']
    },
    evidence: ['Data quality report', 'Duplicate payment review note', 'Exception list', 'False positive reason', 'Audit conclusion draft'],
    nextPractice: ['Chạy Expense Ledger sample', 'Tạo duplicate payment checklist', 'Thêm assertion matrix', 'Làm quiz audit analytics']
  },
  data_ml: {
    title: 'Data / ML Mastery Rubric',
    goal: 'Đánh giá khả năng chuẩn bị dữ liệu, hiểu model, metric, drift, model card và human review.',
    levels: {
      foundation: ['Hiểu data quality trước ML', 'Biết missing, duplicate, outlier, mismatch', 'Hiểu risk score không phải quyết định cuối'],
      practitioner: ['Chạy sample dataset', 'Đọc pass rate, failures, release gate', 'Giải thích feature contribution cơ bản'],
      advanced: ['Tạo model card cho use case', 'Chọn metric phù hợp như precision/recall/backtest', 'Nhận diện drift và false positive'],
      reviewer: ['Không cho release model nếu thiếu lineage, quality report, backtest, approval', 'Đặt human review gate', 'Ghi limitation rõ trong model card']
    },
    evidence: ['Sample dataset CSV', 'Data quality report', 'Model card', 'Lineage report', 'Backtest/drift note'],
    nextPractice: ['Tạo model card Expense Risk', 'Chạy Project Cost sample', 'So sánh pass rate trước/sau fix', 'Viết human review rule']
  },
  devops_cloud: {
    title: 'DevOps / Cloud Mastery Rubric',
    goal: 'Đánh giá khả năng kiểm soát build, release, Cloud Run/Firebase, rollback, secret và chi phí.',
    levels: {
      foundation: ['Hiểu GitHub commit, build, deploy, revision', 'Biết API key không được đưa vào frontend'],
      practitioner: ['Đọc Build Status Checker', 'Tạo release note', 'Biết rollback khi revision lỗi'],
      advanced: ['Thiết kế release gate', 'Kiểm tra env/secrets, domain, cost guardrail', 'Biết xử lý lỗi 409 bằng fetch SHA mới'],
      reviewer: ['Không deploy khi build fail', 'Yêu cầu logs trước khi sửa đoán', 'Duyệt rollback plan và monitoring']
    },
    evidence: ['Build checklist', 'Release note', 'Cloud launch checklist', 'Rollback note', 'Secret review note'],
    nextPractice: ['Tạo release note mới', 'Soát Cloud Launch Checklist', 'Thêm troubleshooting tree', 'Kiểm tra cost guardrail']
  },
  governance: {
    title: 'Governance / Safety Mastery Rubric',
    goal: 'Đánh giá khả năng kiểm soát dữ liệu, nguồn, AI prompt, human review và publish gate.',
    levels: {
      foundation: ['Hiểu sandbox không dùng dữ liệu thật', 'Biết phân biệt public/demo/private/secret'],
      practitioner: ['Dùng Source Checklist và AI Governance Policy', 'Nhận biết prompt có nguy cơ lộ thông tin', 'Gắn owner cho dữ liệu'],
      advanced: ['Thiết kế data classification, lineage, approval gate', 'Chuyển feedback thành backlog nhỏ', 'Kiểm soát source status và last reviewed'],
      reviewer: ['Không duyệt nội dung thuế/kế toán thiếu nguồn', 'Không duyệt model thiếu human review', 'Không duyệt deploy thiếu rollback/cost guardrail']
    },
    evidence: ['AI policy markdown', 'Source checklist', 'Lineage report', 'Feedback loop report', 'Approval note'],
    nextPractice: ['Tạo data lineage cho Expense Ledger', 'Review source registry', 'Tạo policy cho prompt AI', 'Chấm maturity roadmap']
  }
};

const levelLabels: Record<Level, string> = {
  foundation: 'Foundation',
  practitioner: 'Practitioner',
  advanced: 'Advanced',
  reviewer: 'Reviewer'
};

export default function LearningOutcomeRubricLab() {
  const [track, setTrack] = useState<RubricTrack>('tax_accounting');
  const [level, setLevel] = useState<Level>('practitioner');
  const [score, setScore] = useState(70);
  const [copied, setCopied] = useState(false);
  const rubric = rubrics[track];
  const current = rubric.levels[level];
  const readiness = score >= 85 ? 'Ready for advanced practice' : score >= 70 ? 'Ready with review' : 'Needs guided practice';

  const markdown = useMemo(() => `# Learning Outcome Rubric\n\n## Track\n${rubric.title}\n\n## Goal\n${rubric.goal}\n\n## Selected level\n${levelLabels[level]}\n\n## Score\n${score}/100 - ${readiness}\n\n## Competencies\n${current.map(item => `- [ ] ${item}`).join('\n')}\n\n## Evidence required\n${rubric.evidence.map(item => `- ${item}`).join('\n')}\n\n## Next practice\n${rubric.nextPractice.map(item => `- ${item}`).join('\n')}\n\n> Rule: muốn lên level cao hơn phải có evidence, không chỉ đọc lý thuyết.`, [rubric, level, score, readiness, current]);

  const copy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-5 text-slate-100 select-text">
      <section className="bg-gradient-to-r from-amber-950/20 via-[#060a12] to-emerald-950/20 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0"><Award className="w-5 h-5" /></div>
          <div><h2 className="text-sm font-black text-white uppercase tracking-widest">Learning Outcome Rubric Lab</h2><p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">Khung đánh giá năng lực sau khi học Plan2Predict: không chỉ đọc nội dung mà phải có evidence, case, quiz, dataset report và human review.</p></div>
        </div>
      </section>

      <div className="grid md:grid-cols-4 gap-3">
        <Metric title="Track" value={rubric.title.split(' ')[0]} icon={Layers3} />
        <Metric title="Level" value={levelLabels[level]} icon={GraduationCap} />
        <Metric title="Score" value={`${score}/100`} icon={BarChart3} />
        <Metric title="Readiness" value={readiness} icon={Target} />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div><FieldLabel>Track</FieldLabel><select value={track} onChange={e => setTrack(e.target.value as RubricTrack)} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200">{Object.entries(rubrics).map(([key, value]) => <option key={key} value={key}>{value.title}</option>)}</select></div>
        <div><FieldLabel>Level</FieldLabel><select value={level} onChange={e => setLevel(e.target.value as Level)} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200">{Object.entries(levelLabels).map(([key, value]) => <option key={key} value={key}>{value}</option>)}</select></div>
        <div><FieldLabel>Score</FieldLabel><input type="range" min="0" max="100" value={score} onChange={e => setScore(Number(e.target.value))} className="w-full accent-amber-500" /><p className="text-xs text-amber-300 font-mono mt-1">{score}/100</p></div>
      </div>

      <section className="p-4 rounded-xl border border-amber-500/25 bg-amber-950/15"><h3 className="text-[10px] font-black uppercase tracking-wider mb-2 text-white flex items-center gap-2"><Lightbulb className="w-4 h-4 text-amber-400" />Mục tiêu track</h3><p className="text-xs text-amber-100 font-semibold leading-relaxed">{rubric.goal}</p></section>

      <div className="grid md:grid-cols-3 gap-4">
        <ListPanel title={`Competencies - ${levelLabels[level]}`} icon={ClipboardCheck} items={current} tone="emerald" />
        <ListPanel title="Evidence required" icon={CheckCircle2} items={rubric.evidence} tone="blue" />
        <ListPanel title="Next practice" icon={Target} items={rubric.nextPractice} tone="amber" />
      </div>

      <button onClick={copy} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-black rounded-xl flex items-center gap-1.5">{copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}{copied ? 'Đã copy' : 'Copy rubric report'}</button>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) { return <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">{children}</label>; }
function Metric({ title, value, icon: Icon }: { title: string; value: string; icon: React.ComponentType<{ className?: string }> }) { return <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-950/10"><Icon className="w-4 h-4 text-amber-400 mb-2" /><span className="text-[9px] text-slate-500 font-black uppercase block">{title}</span><p className="text-[11px] font-black text-amber-300 mt-1 leading-snug">{value}</p></div>; }
function ListPanel({ title, items, icon: Icon, tone }: { title: string; items: string[]; icon: React.ComponentType<{ className?: string }>; tone: 'emerald' | 'blue' | 'amber' }) { const colors = { emerald: 'text-emerald-400 bg-emerald-400', blue: 'text-blue-400 bg-blue-400', amber: 'text-amber-400 bg-amber-400' }[tone]; const [textColor, dotColor] = colors.split(' '); return <section className="p-4 rounded-xl border border-slate-850 bg-slate-900/35"><h3 className="text-[10px] font-black uppercase tracking-wider mb-3 text-white flex items-center gap-2"><Icon className={`w-4 h-4 ${textColor}`} />{title}</h3><ul className="space-y-2">{items.map(item => <li key={item} className="text-xs text-slate-300 font-semibold leading-relaxed flex gap-2"><span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />{item}</li>)}</ul></section>; }
