import React, { useMemo, useState } from 'react';
import { AlertTriangle, BookMarked, CheckCircle2, ClipboardList, Copy, FileSearch, Link2, Scale, ShieldCheck } from 'lucide-react';

type DomainKey = 'tax' | 'accounting' | 'ifrs' | 'audit' | 'devops' | 'ml';

type SourceRule = {
  id: DomainKey;
  title: string;
  purpose: string;
  primarySources: string[];
  evidenceNeeded: string[];
  citationWarnings: string[];
  updateCadence: string;
};

const sourceRules: SourceRule[] = [
  {
    id: 'tax',
    title: 'Thuế Việt Nam',
    purpose: 'Khi viết rule card VAT, TNDN, TNCN, FCT cần đối chiếu văn bản hiện hành và không kết luận tuyệt đối nếu thiếu nguồn.',
    primarySources: ['Luật thuế', 'Nghị định', 'Thông tư', 'Công văn hướng dẫn theo tình huống nếu có', 'Tờ khai/mẫu biểu từ cơ quan thuế'],
    evidenceNeeded: ['Tên văn bản', 'Số hiệu', 'Điều/khoản liên quan', 'Ngày hiệu lực', 'Tóm tắt điều kiện áp dụng'],
    citationWarnings: ['Không dùng blog/diễn đàn làm nguồn chính', 'Cẩn thận văn bản hết hiệu lực', 'Không trộn quy định cũ và mới', 'Tình huống cụ thể cần kiểm tra hồ sơ thật'],
    updateCadence: 'Rà soát ít nhất theo quý hoặc khi có luật/nghị định/thông tư mới.'
  },
  {
    id: 'accounting',
    title: 'VAS / Chế độ kế toán Việt Nam',
    purpose: 'Khi mô phỏng bút toán và tài khoản, cần tách rõ chuẩn mực, chế độ kế toán và chính sách nội bộ.',
    primarySources: ['Chuẩn mực kế toán Việt Nam', 'Thông tư chế độ kế toán doanh nghiệp', 'Chính sách kế toán nội bộ', 'Hồ sơ hợp đồng/nghiệm thu'],
    evidenceNeeded: ['Tài khoản sử dụng', 'Bản chất nghiệp vụ', 'Căn cứ ghi nhận', 'Kỳ kế toán', 'Chứng từ gốc'],
    citationWarnings: ['Tài khoản gợi ý không thay thế chính sách kế toán', 'Cùng nghiệp vụ có thể khác cách hạch toán theo bản chất', 'Không tự động kết luận chi phí được trừ thuế'],
    updateCadence: 'Rà soát khi thay đổi chế độ kế toán, chart of accounts hoặc chính sách nội bộ.'
  },
  {
    id: 'ifrs',
    title: 'IFRS / Financial Reporting',
    purpose: 'Dùng để so sánh khái niệm VAS-IFRS và giải thích logic báo cáo tài chính nâng cao.',
    primarySources: ['IFRS Standards', 'IAS Standards', 'IFRIC agenda decisions', 'Tài liệu training chính thống', 'Báo cáo tài chính mẫu'],
    evidenceNeeded: ['Chuẩn mực liên quan', 'Khái niệm ghi nhận/đo lường', 'Trình bày/thuyết minh', 'Khác biệt với VAS', 'Ví dụ số liệu'],
    citationWarnings: ['Không nhầm IFRS với US GAAP', 'Không áp dụng IFRS cho hồ sơ thuế Việt Nam nếu không có chuyển đổi', 'Cần ghi rõ đây là so sánh học tập'],
    updateCadence: 'Rà soát khi có cập nhật chuẩn mực hoặc agenda decision mới.'
  },
  {
    id: 'audit',
    title: 'Kiểm toán / Audit Analytics',
    purpose: 'Dùng để xây case kiểm toán dữ liệu, chọn mẫu, rủi ro và kiểm soát nội bộ.',
    primarySources: ['Chuẩn mực kiểm toán', 'Chính sách kiểm soát nội bộ', 'Audit program mẫu', 'Dữ liệu sổ cái và chứng từ gốc'],
    evidenceNeeded: ['Mục tiêu kiểm toán', 'Assertion liên quan', 'Thủ tục kiểm tra', 'Nguồn dữ liệu', 'Cách xử lý false positive'],
    citationWarnings: ['Analytics chỉ là tín hiệu', 'Không kết luận gian lận nếu chưa kiểm tra chứng từ', 'Cần phân biệt exception, error và fraud'],
    updateCadence: 'Rà soát theo mùa kiểm toán hoặc khi thay đổi quy trình kiểm soát.'
  },
  {
    id: 'devops',
    title: 'DevOps / Cloud / Security',
    purpose: 'Dùng để giữ hướng dẫn deploy, Docker, Cloud Run, Firebase và bảo mật luôn đúng với nền tảng hiện tại.',
    primarySources: ['Tài liệu chính thức Google Cloud', 'Tài liệu Firebase', 'Tài liệu GitHub Actions', 'README/Dockerfile/package.json trong repo'],
    evidenceNeeded: ['Command cụ thể', 'Region/service', 'Env var/secrets', 'Chi phí/cost guardrail', 'Rollback path'],
    citationWarnings: ['Cloud UI có thể đổi', 'Giá/cấu hình có thể đổi', 'Không hardcode API key', 'Không deploy khi CI fail'],
    updateCadence: 'Rà soát khi thay đổi cấu hình cloud, billing, domain hoặc CI/CD.'
  },
  {
    id: 'ml',
    title: 'Data Science / Machine Learning',
    purpose: 'Dùng để giải thích model, data quality, backtesting, drift và explainability một cách có kiểm soát.',
    primarySources: ['Tài liệu thư viện ML chính thức', 'Bài toán nghiệp vụ', 'Dataset dictionary', 'Model card', 'Evaluation report'],
    evidenceNeeded: ['Mục tiêu model', 'Feature list', 'Metric', 'Train/test split', 'Drift/backtest result'],
    citationWarnings: ['Không dùng model như phán quyết cuối', 'Cần kiểm tra bias/drift', 'Dữ liệu lỗi làm model sai', 'Giải thích model phải kèm ngữ cảnh nghiệp vụ'],
    updateCadence: 'Rà soát khi đổi dataset, feature, threshold hoặc model.'
  }
];

export default function SourceCitationChecklistLab() {
  const [domain, setDomain] = useState<DomainKey>('tax');
  const [sourceName, setSourceName] = useState('Tên văn bản / tài liệu / source chính thức');
  const [copied, setCopied] = useState(false);
  const selected = sourceRules.find(rule => rule.id === domain) ?? sourceRules[0];

  const markdown = useMemo(() => `# Source & Citation Checklist\n\n## Domain\n${selected.title}\n\n## Source name\n${sourceName}\n\n## Purpose\n${selected.purpose}\n\n## Primary sources to prefer\n${selected.primarySources.map(item => `- ${item}`).join('\n')}\n\n## Evidence needed before adding to Plan2Predict\n${selected.evidenceNeeded.map(item => `- [ ] ${item}`).join('\n')}\n\n## Citation warnings\n${selected.citationWarnings.map(item => `- ${item}`).join('\n')}\n\n## Update cadence\n${selected.updateCadence}\n\n> Rule: nội dung pháp luật, thuế, cloud, AI và ML phải có nguồn hoặc ghi rõ là mô phỏng học tập.`, [selected, sourceName]);

  const copy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-5 text-slate-100 select-text">
      <section className="bg-gradient-to-r from-blue-950/20 via-[#060a12] to-emerald-950/20 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0"><BookMarked className="w-5 h-5" /></div>
          <div><h2 className="text-sm font-black text-white uppercase tracking-widest">Source & Citation Checklist Lab</h2><p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">Bảng kiểm nguồn tham chiếu trước khi thêm nội dung VAS, IFRS, thuế, audit, DevOps hoặc ML vào Plan2Predict.</p></div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-4">
        <div><FieldLabel>Domain</FieldLabel><select value={domain} onChange={e => setDomain(e.target.value as DomainKey)} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200">{sourceRules.map(rule => <option key={rule.id} value={rule.id}>{rule.title}</option>)}</select></div>
        <div><FieldLabel>Source name</FieldLabel><input value={sourceName} onChange={e => setSourceName(e.target.value)} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200" /></div>
      </div>

      <section className="p-4 rounded-xl border border-blue-500/25 bg-blue-950/15"><h3 className="text-[10px] font-black uppercase tracking-wider mb-2 text-white flex items-center gap-2"><Scale className="w-4 h-4 text-blue-400" />Mục tiêu</h3><p className="text-xs text-blue-100 font-semibold leading-relaxed">{selected.purpose}</p></section>

      <div className="grid md:grid-cols-2 gap-4">
        <ListPanel title="Nguồn chính nên ưu tiên" icon={Link2} items={selected.primarySources} tone="emerald" />
        <ListPanel title="Bằng chứng cần có" icon={ClipboardList} items={selected.evidenceNeeded} tone="blue" />
      </div>

      <ListPanel title="Cảnh báo khi trích dẫn" icon={AlertTriangle} items={selected.citationWarnings} tone="rose" />
      <section className="p-4 rounded-xl border border-amber-500/25 bg-amber-950/15"><h3 className="text-[10px] font-black uppercase tracking-wider mb-2 text-white flex items-center gap-2"><FileSearch className="w-4 h-4 text-amber-400" />Chu kỳ cập nhật</h3><p className="text-xs text-amber-100 font-semibold leading-relaxed">{selected.updateCadence}</p></section>
      <section className="p-4 rounded-xl border border-emerald-500/25 bg-emerald-950/15"><h3 className="text-[10px] font-black uppercase tracking-wider mb-2 text-white flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" />Nguyên tắc</h3><p className="text-xs text-emerald-100 font-semibold leading-relaxed">Nếu chưa có nguồn chính thức, nội dung phải ghi rõ là mô phỏng học tập, không dùng làm kết luận pháp lý/kế toán/thuế cuối cùng.</p></section>

      <button onClick={copy} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-black rounded-xl flex items-center gap-1.5">{copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}{copied ? 'Đã copy' : 'Copy source checklist'}</button>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) { return <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">{children}</label>; }
function ListPanel({ title, items, icon: Icon, tone }: { title: string; items: string[]; icon: React.ComponentType<{ className?: string }>; tone: 'emerald' | 'blue' | 'rose' }) { const colors = { emerald: 'text-emerald-400 bg-emerald-400', blue: 'text-blue-400 bg-blue-400', rose: 'text-rose-400 bg-rose-400' }[tone]; const [textColor, dotColor] = colors.split(' '); return <section className="p-4 rounded-xl border border-slate-850 bg-slate-900/35"><h3 className="text-[10px] font-black uppercase tracking-wider mb-3 text-white flex items-center gap-2"><Icon className={`w-4 h-4 ${textColor}`} />{title}</h3><ul className="space-y-2">{items.map(item => <li key={item} className="text-xs text-slate-300 font-semibold leading-relaxed flex gap-2"><span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />{item}</li>)}</ul></section>; }
