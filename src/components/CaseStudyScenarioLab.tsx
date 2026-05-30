import React, { useMemo, useState } from 'react';
import { AlertTriangle, BookOpen, CheckCircle2, ClipboardList, Copy, FileText, Lightbulb, Route, SearchCheck } from 'lucide-react';

type CaseKey = 'fuel_cash' | 'labor_grossup' | 'project_overrun' | 'duplicate_payment' | 'vat_mismatch';

type CaseStudy = {
  id: CaseKey;
  title: string;
  context: string;
  facts: string[];
  tasks: string[];
  expectedChecks: string[];
  learningGoals: string[];
  suggestedTools: string[];
};

const cases: CaseStudy[] = [
  {
    id: 'fuel_cash',
    title: 'Case 01 - Thanh toán tiền dầu tại công trường',
    context: 'Thủ kho/vật tư thanh toán hộ tiền dầu cho xe máy thi công. Một số hóa đơn trên 5 triệu, có khoản chi tiền mặt và thiếu nhật trình máy.',
    facts: ['Có hóa đơn xăng dầu', 'Có phiếu đề nghị thanh toán', 'Thiếu lệnh điều xe/nhật trình máy cho một số ngày', 'Có hóa đơn trên 5 triệu', 'Người thanh toán là thủ kho/vật tư'],
    tasks: ['Xác định hồ sơ còn thiếu', 'Đánh giá rủi ro VAT/TNDN', 'Đề xuất chứng từ bổ sung', 'Viết ghi chú kiểm soát nội bộ'],
    expectedChecks: ['Hóa đơn', 'Chứng từ thanh toán', 'Ủy quyền thanh toán hộ nếu có', 'Nhật trình xe/máy', 'Bảng kê nhiên liệu', 'Mã công trình sử dụng'],
    learningGoals: ['Hiểu cách nối chi phí xăng dầu với công trình', 'Biết rủi ro khi thiếu nhật trình/định mức', 'Biết cách lập checklist hồ sơ thanh toán'],
    suggestedTools: ['Expense Compliance Checker', 'Document Checklist Generator', 'Accounting - Tax Bridge Matrix']
  },
  {
    id: 'labor_grossup',
    title: 'Case 02 - Nhân công khoán việc và gross-up TNCN',
    context: 'Đội thi công muốn nhận đủ tiền net, công ty đồng ý chịu phần thuế khấu trừ. Hồ sơ cần thống nhất giữa hợp đồng, nghiệm thu và bảng thanh toán.',
    facts: ['Net mong muốn 25.000.000', 'Tỷ lệ khấu trừ mô phỏng 10%', 'Có nhiều cá nhân nhận tiền', 'Cần bảng thanh toán khớp hợp đồng', 'Rủi ro lệch gross/net'],
    tasks: ['Tính gross-up', 'Xác định bút toán mô phỏng', 'Liệt kê hồ sơ cần có', 'Nêu điểm dễ sai khi kế toán kiểm tra'],
    expectedChecks: ['Hợp đồng giao khoán', 'Danh sách cá nhân', 'Biên bản nghiệm thu', 'Bảng thanh toán', 'Chứng từ chi trả', 'Xử lý TNCN nhất quán'],
    learningGoals: ['Hiểu net-to-gross', 'Biết vì sao không chỉ sửa bảng thanh toán', 'Liên kết thuế TNCN với hồ sơ kế toán'],
    suggestedTools: ['VAT / PIT Gross-up Calculator', 'Journal Entry Simulator', 'Tax & Accounting Rule Library']
  },
  {
    id: 'project_overrun',
    title: 'Case 03 - Công trình vượt dự toán',
    context: 'Công trình A có chi phí thực tế vượt dự toán 18%. Vật tư và máy thi công là hai nhóm tăng mạnh nhất.',
    facts: ['Dự toán có BOQ', 'Chi phí vật tư vượt 20%', 'Chi phí máy thi công vượt 14%', 'Nghiệm thu chậm', 'Một số phiếu xuất kho thiếu hạng mục'],
    tasks: ['Tính tỷ lệ vượt ngân sách', 'Khoanh vùng nguyên nhân', 'Đề xuất dữ liệu cần đối chiếu', 'Lập kế hoạch kiểm soát phase sau'],
    expectedChecks: ['BOQ/dự toán', 'Phiếu xuất kho', 'Nhật trình máy', 'Bảng phân bổ chi phí chung', 'Bảng tập hợp 154', 'Biên bản nghiệm thu'],
    learningGoals: ['Hiểu overrun theo driver chi phí', 'Biết liên kết 154 với nghiệm thu/632', 'Biết dùng data quality rules trước khi phân tích'],
    suggestedTools: ['Project Cost Overrun Checker', 'Month-end Close Lab', 'Data Quality & Pipeline Lab']
  },
  {
    id: 'duplicate_payment',
    title: 'Case 04 - Nghi thanh toán trùng nhà cung cấp',
    context: 'Có hai dòng thanh toán cùng nhà cung cấp, cùng số hóa đơn và số tiền gần nhau trong tháng. Cần phân biệt thanh toán trùng hay tạm ứng/quyết toán hợp lệ.',
    facts: ['Cùng vendor_id', 'Cùng invoice_no', 'Số tiền giống nhau', 'Ngày thanh toán cách nhau 4 ngày', 'Một dòng ghi chú tạm ứng'],
    tasks: ['Thiết kế query kiểm tra', 'Xác định false positive', 'Liệt kê chứng từ đối chiếu', 'Đề xuất cách chuẩn hóa dữ liệu'],
    expectedChecks: ['Sổ chi tiết 331', 'Hóa đơn', 'Ủy nhiệm chi', 'Phiếu chi', 'Biên bản giao nhận', 'Bảng đối chiếu công nợ'],
    learningGoals: ['Hiểu audit analytics chỉ là tín hiệu', 'Biết false positive trong dữ liệu kế toán', 'Biết đối chiếu chứng từ trước khi kết luận'],
    suggestedTools: ['SQL Query Playground', 'Audit Risk Scoring Tool', 'Data Quality & Pipeline Lab']
  },
  {
    id: 'vat_mismatch',
    title: 'Case 05 - Hóa đơn lệch VAT',
    context: 'Một số hóa đơn đầu vào có VAT amount lệch so với net amount x VAT rate do làm tròn, sai dòng hàng hoặc nhập liệu sai.',
    facts: ['Có file hóa đơn đầu vào', 'Có dòng VAT 8% và 10%', 'Một số dòng lệch nhỏ', 'Một số dòng lệch lớn', 'Có hóa đơn nhiều dòng hàng'],
    tasks: ['Xác định ngưỡng lệch chấp nhận', 'Phân loại lỗi rounding hay sai nhập liệu', 'Đề xuất rule kiểm tra', 'Liên kết với VAT đầu vào'],
    expectedChecks: ['Hóa đơn gốc', 'Net amount', 'VAT rate', 'VAT amount', 'Tổng thanh toán', 'Kỳ kê khai'],
    learningGoals: ['Hiểu kiểm tra chất lượng dữ liệu hóa đơn', 'Biết phân biệt rounding và sai nhập liệu', 'Biết kết nối data quality với VAT compliance'],
    suggestedTools: ['Data Quality & Pipeline Lab', 'Tax & Accounting Rule Library', 'Accounting - Tax Bridge Matrix']
  }
];

export default function CaseStudyScenarioLab() {
  const [caseId, setCaseId] = useState<CaseKey>('fuel_cash');
  const [copied, setCopied] = useState(false);
  const selected = cases.find(item => item.id === caseId) ?? cases[0];

  const markdown = useMemo(() => `# Case Study Scenario\n\n## ${selected.title}\n\n## Bối cảnh\n${selected.context}\n\n## Dữ kiện\n${selected.facts.map(item => `- ${item}`).join('\n')}\n\n## Nhiệm vụ học viên\n${selected.tasks.map(item => `- [ ] ${item}`).join('\n')}\n\n## Checklist kiểm tra kỳ vọng\n${selected.expectedChecks.map(item => `- ${item}`).join('\n')}\n\n## Mục tiêu học tập\n${selected.learningGoals.map(item => `- ${item}`).join('\n')}\n\n## Tool nên dùng\n${selected.suggestedTools.map(item => `- ${item}`).join('\n')}\n\n> Đây là case học tập/sandbox, không dùng làm kết luận pháp lý hoặc kiểm toán chính thức.`, [selected]);

  const copy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-5 text-slate-100 select-text">
      <section className="bg-gradient-to-r from-amber-950/20 via-[#060a12] to-purple-950/20 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0"><BookOpen className="w-5 h-5" /></div>
          <div><h2 className="text-sm font-black text-white uppercase tracking-widest">Case Study & Scenario Lab</h2><p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">Bộ tình huống thực chiến để học kế toán, thuế, kiểm toán dữ liệu và kiểm soát công trình theo dạng sandbox.</p></div>
        </div>
      </section>

      <div><label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">Chọn case study</label><select value={caseId} onChange={e => setCaseId(e.target.value as CaseKey)} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200">{cases.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></div>

      <section className="p-4 rounded-xl border border-amber-500/25 bg-amber-950/15"><h3 className="text-[10px] font-black uppercase tracking-wider mb-2 text-white flex items-center gap-2"><FileText className="w-4 h-4 text-amber-400" />Bối cảnh</h3><p className="text-xs text-amber-100 font-semibold leading-relaxed">{selected.context}</p></section>

      <div className="grid md:grid-cols-2 gap-4">
        <ListPanel title="Dữ kiện" icon={SearchCheck} items={selected.facts} tone="blue" />
        <ListPanel title="Nhiệm vụ học viên" icon={ClipboardList} items={selected.tasks} tone="emerald" />
        <ListPanel title="Checklist kỳ vọng" icon={CheckCircle2} items={selected.expectedChecks} tone="purple" />
        <ListPanel title="Tool nên dùng" icon={Route} items={selected.suggestedTools} tone="amber" />
      </div>

      <section className="p-4 rounded-xl border border-slate-850 bg-slate-900/35"><h3 className="text-[10px] font-black uppercase tracking-wider mb-3 text-white flex items-center gap-2"><Lightbulb className="w-4 h-4 text-emerald-400" />Mục tiêu học tập</h3><ul className="space-y-2">{selected.learningGoals.map(item => <li key={item} className="text-xs text-slate-300 font-semibold leading-relaxed flex gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />{item}</li>)}</ul></section>

      <section className="p-4 rounded-xl border border-rose-500/25 bg-rose-950/15"><h3 className="text-[10px] font-black uppercase tracking-wider mb-2 text-white flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-rose-400" />Cảnh báo</h3><p className="text-xs text-rose-100 font-semibold leading-relaxed">Case phục vụ học tập. Khi áp dụng hồ sơ thật cần kiểm tra chứng từ gốc, quy định hiện hành và phê duyệt nội bộ.</p></section>

      <button onClick={copy} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-black rounded-xl flex items-center gap-1.5">{copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}{copied ? 'Đã copy' : 'Copy case markdown'}</button>
    </div>
  );
}

function ListPanel({ title, items, icon: Icon, tone }: { title: string; items: string[]; icon: React.ComponentType<{ className?: string }>; tone: 'blue' | 'emerald' | 'purple' | 'amber' }) {
  const colors = { blue: 'text-blue-400 bg-blue-400', emerald: 'text-emerald-400 bg-emerald-400', purple: 'text-purple-400 bg-purple-400', amber: 'text-amber-400 bg-amber-400' }[tone];
  const [textColor, dotColor] = colors.split(' ');
  return <section className="p-4 rounded-xl border border-slate-850 bg-slate-900/35"><h3 className="text-[10px] font-black uppercase tracking-wider mb-3 text-white flex items-center gap-2"><Icon className={`w-4 h-4 ${textColor}`} />{title}</h3><ul className="space-y-2">{items.map(item => <li key={item} className="text-xs text-slate-300 font-semibold leading-relaxed flex gap-2"><span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />{item}</li>)}</ul></section>;
}
