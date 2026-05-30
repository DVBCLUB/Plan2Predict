import React, { useMemo, useState } from 'react';
import { BookOpenText, CheckCircle2, Copy, FileText, Filter, Search, Tags } from 'lucide-react';

type Category = 'all' | 'accounting' | 'tax' | 'audit' | 'data' | 'ml' | 'devops' | 'governance';

type GlossaryItem = {
  term: string;
  category: Exclude<Category, 'all'>;
  plain: string;
  example: string;
  related: string[];
};

const glossary: GlossaryItem[] = [
  { term: 'VAS', category: 'accounting', plain: 'Chuẩn mực kế toán Việt Nam, dùng làm nền tảng ghi nhận và trình bày báo cáo tài chính theo bối cảnh Việt Nam.', example: 'Khi học tài khoản 154, 632, doanh thu và giá vốn, cần phân biệt logic kế toán với logic thuế.', related: ['Accounting - Tax Bridge Matrix', 'Rule Library'] },
  { term: 'IFRS', category: 'accounting', plain: 'Chuẩn mực báo cáo tài chính quốc tế, dùng để hiểu cách ghi nhận, đo lường và trình bày theo thông lệ quốc tế.', example: 'So sánh VAS và IFRS khi học doanh thu, tài sản, dự phòng hoặc công cụ tài chính.', related: ['Source & Citation Checklist', 'Knowledge Hub'] },
  { term: 'VAT input deduction', category: 'tax', plain: 'Khấu trừ VAT đầu vào khi khoản mua đáp ứng điều kiện hóa đơn, chứng từ, mục đích sử dụng và thanh toán phù hợp.', example: 'Hóa đơn vật tư công trình có thể cần hóa đơn, giao nhận, phiếu nhập/xuất và chứng từ thanh toán.', related: ['Tax Rule Library', 'Expense Checker'] },
  { term: 'CIT deductible expense', category: 'tax', plain: 'Chi phí được trừ khi tính thuế TNDN nếu phục vụ SXKD và có đủ hồ sơ theo quy định.', example: 'Chi tiếp khách cần mục đích công việc, hóa đơn, phê duyệt và chứng từ thanh toán.', related: ['Bridge Matrix', 'Document Checklist'] },
  { term: 'Gross-up', category: 'tax', plain: 'Tính ngược từ số tiền net người nhận muốn nhận đủ để ra tổng chi phí/gross trước khi khấu trừ thuế.', example: 'Cá nhân muốn nhận đủ 25 triệu, công ty chịu thuế thì hồ sơ phải thống nhất net/gross.', related: ['Gross-up Calculator', 'Case Study Lab'] },
  { term: 'Audit analytics', category: 'audit', plain: 'Dùng dữ liệu để phát hiện tín hiệu bất thường, chọn mẫu kiểm tra hoặc đánh giá rủi ro.', example: 'Tìm thanh toán trùng theo vendor + invoice + amount nhưng vẫn phải đối chiếu chứng từ.', related: ['SQL Playground', 'Data Quality Lab'] },
  { term: 'False positive', category: 'audit', plain: 'Trường hợp hệ thống báo rủi ro nhưng thực tế có thể hợp lệ sau khi kiểm tra chứng từ.', example: 'Một hóa đơn có hai dòng thanh toán vì có tạm ứng và quyết toán, không phải thanh toán trùng.', related: ['Case Study Lab', 'Audit Risk Scoring'] },
  { term: 'Data quality', category: 'data', plain: 'Mức độ dữ liệu đầy đủ, đúng, nhất quán, không trùng lặp và phù hợp để báo cáo hoặc huấn luyện model.', example: 'Thiếu mã công trình sẽ làm sai báo cáo chi phí 154 theo công trình.', related: ['Data Quality Pipeline', 'Month-end Close'] },
  { term: 'Feature contribution', category: 'ml', plain: 'Mức đóng góp của từng yếu tố làm điểm rủi ro của model tăng hoặc giảm.', example: 'Nhà cung cấp mới và số tiền gần ngưỡng phê duyệt có thể làm risk score tăng.', related: ['ML Explainability Lab', 'Fraud Scoring'] },
  { term: 'Model drift', category: 'ml', plain: 'Hiện tượng dữ liệu mới khác dữ liệu ban đầu, khiến model có thể dự đoán kém chính xác hơn.', example: 'Cơ cấu chi phí công trình thay đổi mạnh theo mùa làm score overrun lệch.', related: ['ML Explainability Lab', 'Backtesting'] },
  { term: 'Release gate', category: 'devops', plain: 'Điều kiện tối thiểu phải đạt trước khi deploy bản mới.', example: 'npm run build pass, không lộ secret, UI không vỡ, Cloud Run có rollback.', related: ['Build Status Checker', 'Release Notes'] },
  { term: 'Rollback', category: 'devops', plain: 'Quay lại phiên bản ổn định trước đó khi bản mới bị lỗi.', example: 'Cloud Run revision mới lỗi thì route traffic về revision cũ trước rồi debug sau.', related: ['Cloud Launch Checklist', 'Project QA Lab'] },
  { term: 'Secret', category: 'governance', plain: 'Thông tin nhạy cảm như API key, mật khẩu, token, không được đưa vào frontend hoặc GitHub public.', example: 'GEMINI_API_KEY phải đặt ở Cloud Run env/secrets, không viết trong code React.', related: ['AI Governance Lab', 'Security Policy'] },
  { term: 'Human review', category: 'governance', plain: 'Người có trách nhiệm kiểm tra và duyệt kết luận cuối cùng thay vì để AI tự quyết định.', example: 'AI có thể sinh checklist thuế, nhưng kế toán/người phụ trách phải đối chiếu văn bản và hồ sơ thật.', related: ['AI Governance Lab', 'Source Checklist'] }
];

const labels: Record<Category, string> = {
  all: 'Tất cả', accounting: 'Accounting', tax: 'Tax', audit: 'Audit', data: 'Data', ml: 'ML', devops: 'DevOps', governance: 'Governance'
};

export default function DeepResearchGlossaryLab() {
  const [category, setCategory] = useState<Category>('all');
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const filtered = glossary.filter(item => {
    const matchCategory = category === 'all' || item.category === category;
    const keyword = query.trim().toLowerCase();
    const matchQuery = !keyword || [item.term, item.plain, item.example, ...item.related].join(' ').toLowerCase().includes(keyword);
    return matchCategory && matchQuery;
  });

  const markdown = useMemo(() => `# Deep Research Glossary\n\n${filtered.map(item => `## ${item.term}\n- Category: ${labels[item.category]}\n- Plain meaning: ${item.plain}\n- Example: ${item.example}\n- Related modules: ${item.related.join(', ')}`).join('\n\n')}\n\n> Glossary phục vụ học tập. Với nội dung thuế/kế toán/pháp lý, cần đối chiếu nguồn chính thức trước khi áp dụng hồ sơ thật.`, [filtered]);

  const copy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-5 text-slate-100 select-text">
      <section className="bg-gradient-to-r from-amber-950/20 via-[#060a12] to-blue-950/20 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0"><BookOpenText className="w-5 h-5" /></div>
          <div><h2 className="text-sm font-black text-white uppercase tracking-widest">Deep Research Glossary Lab</h2><p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">Từ điển giải thích nhanh các thuật ngữ kế toán, thuế, kiểm toán, dữ liệu, ML, DevOps và governance trong Plan2Predict.</p></div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">Tìm kiếm</label><div className="relative"><Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="gross-up, drift, rollback..." className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 pl-9 text-xs text-slate-200" /></div></div>
        <div><label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">Nhóm</label><select value={category} onChange={e => setCategory(e.target.value as Category)} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200">{Object.entries(labels).map(([key, value]) => <option key={key} value={key}>{value}</option>)}</select></div>
      </div>

      <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-850 bg-slate-900/35"><div className="text-xs text-slate-300 font-semibold flex items-center gap-2"><Filter className="w-4 h-4 text-amber-400" />Đang hiển thị {filtered.length}/{glossary.length} thuật ngữ</div><button onClick={copy} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-black rounded-xl flex items-center gap-1.5">{copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}{copied ? 'Đã copy' : 'Copy glossary'}</button></div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(item => <section key={item.term} className="p-4 rounded-xl border border-slate-850 bg-slate-900/35"><div className="flex items-start justify-between gap-3"><h3 className="text-sm font-black text-white flex items-center gap-2"><FileText className="w-4 h-4 text-amber-400" />{item.term}</h3><span className="text-[9px] font-black text-amber-300 uppercase px-2 py-1 rounded border border-amber-500/20 bg-amber-950/10">{labels[item.category]}</span></div><p className="text-xs text-slate-300 font-semibold leading-relaxed mt-3">{item.plain}</p><p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed mt-2"><span className="text-slate-400 font-black">Ví dụ:</span> {item.example}</p><div className="flex flex-wrap gap-1.5 mt-3">{item.related.map(tag => <span key={tag} className="text-[9px] px-2 py-1 rounded-lg bg-[#060a12] border border-slate-800 text-slate-400 font-bold flex items-center gap-1"><Tags className="w-3 h-3" />{tag}</span>)}</div></section>)}
      </div>
    </div>
  );
}
