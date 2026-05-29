import React, { useMemo, useState } from 'react';
import { Calculator, CheckCircle2, ClipboardList, Code2, Copy, FileText, Gauge, ReceiptText, ShieldAlert, Sparkles, TrendingUp, Wrench } from 'lucide-react';

type ToolKey =
  | 'expense_checker'
  | 'journal_simulator'
  | 'construction_flow'
  | 'vat_grossup'
  | 'audit_risk'
  | 'cashflow_forecast'
  | 'prompt_builder'
  | 'sql_playground'
  | 'project_overrun'
  | 'document_checklist';

type ToolItem = {
  id: ToolKey;
  order: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
};

const tools: ToolItem[] = [
  { id: 'expense_checker', order: '01', title: 'Expense Compliance Checker', subtitle: 'Kiểm tra chi phí, VAT, TNDN và chứng từ cần có', icon: ReceiptText, badge: 'TAX' },
  { id: 'journal_simulator', order: '02', title: 'Journal Entry Simulator', subtitle: 'Mô phỏng bút toán Nợ/Có, số tiền và VAT', icon: FileText, badge: 'VAS' },
  { id: 'construction_flow', order: '03', title: 'Construction Cost Flow', subtitle: 'Mua vật tư → kho → công trình → 154 → giá vốn', icon: Wrench, badge: 'BUILD' },
  { id: 'vat_grossup', order: '04', title: 'VAT / PIT Gross-up Calculator', subtitle: 'Tính net-to-gross cho tình huống công ty chịu thuế', icon: Calculator, badge: 'CALC' },
  { id: 'audit_risk', order: '05', title: 'Audit Risk Scoring Tool', subtitle: 'Chấm điểm rủi ro giao dịch để học kiểm toán dữ liệu', icon: ShieldAlert, badge: 'AUDIT' },
  { id: 'cashflow_forecast', order: '06', title: 'Cash Flow Forecast Sandbox', subtitle: 'Dự báo tiền 4 tuần / 12 tuần theo kịch bản', icon: TrendingUp, badge: 'CASH' },
  { id: 'prompt_builder', order: '07', title: 'AI Prompt Builder', subtitle: 'Sinh prompt chuẩn cho ChatGPT, Claude, Gemini', icon: Sparkles, badge: 'AI' },
  { id: 'sql_playground', order: '08', title: 'SQL Query Playground', subtitle: 'SQL mẫu kiểm tra trùng lặp, aging, vượt ngân sách', icon: Code2, badge: 'SQL' },
  { id: 'project_overrun', order: '09', title: 'Project Cost Overrun Checker', subtitle: 'So sánh dự toán và chi phí thực tế theo công trình', icon: Gauge, badge: 'PM' },
  { id: 'document_checklist', order: '10', title: 'Document Checklist Generator', subtitle: 'Sinh checklist hồ sơ và copy markdown', icon: ClipboardList, badge: 'DOC' }
];

const money = (value: number) => new Intl.NumberFormat('vi-VN').format(Math.round(value));

export default function InteractiveSimulatorHub() {
  const [activeTool, setActiveTool] = useState<ToolKey>('expense_checker');
  const selected = tools.find(tool => tool.id === activeTool) ?? tools[0];
  const Icon = selected.icon;

  return (
    <div className="space-y-6 text-slate-100 select-text pb-12">
      <section className="bg-gradient-to-r from-emerald-950/20 via-[#060a12] to-purple-950/20 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-44 h-44 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0"><Wrench className="w-6 h-6" /></div>
          <div>
            <h1 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">🧰 Interactive Simulator Hub <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[9px] font-black rounded font-mono">TOOLS · SANDBOX · LAB</span></h1>
            <p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed max-w-4xl">Bộ công cụ tương tác phục vụ học tập: kiểm tra chi phí, mô phỏng bút toán, gross-up thuế, audit risk, dòng tiền, SQL và checklist hồ sơ. Không thay thế tư vấn thuế/kế toán chính thức.</p>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-4 space-y-2">
          {tools.map(tool => {
            const ToolIcon = tool.icon;
            return <button key={tool.id} onClick={() => setActiveTool(tool.id)} className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${activeTool === tool.id ? 'bg-emerald-500/10 border-emerald-500 ring-1 ring-emerald-500/30' : 'bg-[#060a12] border-slate-850 hover:bg-slate-900'}`}><div className="flex items-start gap-3"><div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0"><ToolIcon className="w-4 h-4" /></div><div><span className="text-[9px] font-black text-slate-500 font-mono">{tool.order} · {tool.badge}</span><span className="text-xs font-bold text-slate-200 block mt-0.5">{tool.title}</span><span className="text-[10px] text-slate-500 block mt-0.5 leading-snug">{tool.subtitle}</span></div></div></button>;
          })}
        </aside>

        <main className="lg:col-span-8 bg-slate-950/50 border border-slate-850 rounded-2xl p-5 space-y-5">
          <div className="flex items-start justify-between gap-4 border-b border-slate-850 pb-4"><div><span className="text-[9px] font-black text-emerald-400 font-mono uppercase tracking-widest">{selected.order} · {selected.badge}</span><h2 className="text-base font-black text-white mt-1 flex items-center gap-2"><Icon className="w-5 h-5 text-emerald-400" />{selected.title}</h2><p className="text-xs text-slate-400 mt-1 font-semibold">{selected.subtitle}</p></div></div>
          {activeTool === 'expense_checker' && <ExpenseComplianceChecker />}
          {activeTool === 'journal_simulator' && <JournalEntrySimulator />}
          {activeTool === 'construction_flow' && <ConstructionCostFlow />}
          {activeTool === 'vat_grossup' && <GrossUpCalculator />}
          {activeTool === 'audit_risk' && <AuditRiskScoring />}
          {activeTool === 'cashflow_forecast' && <CashFlowForecast />}
          {activeTool === 'prompt_builder' && <PromptBuilder />}
          {activeTool === 'sql_playground' && <SqlPlayground />}
          {activeTool === 'project_overrun' && <ProjectOverrunChecker />}
          {activeTool === 'document_checklist' && <DocumentChecklistGenerator />}
        </main>
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">{children}</label>;
}

function ResultCard({ title, children, tone = 'slate' }: { title: string; children: React.ReactNode; tone?: 'slate' | 'emerald' | 'amber' | 'rose' | 'blue' | 'purple' }) {
  const toneClass = { slate: 'border-slate-850 bg-slate-900/35 text-slate-300', emerald: 'border-emerald-500/25 bg-emerald-950/15 text-emerald-200', amber: 'border-amber-500/25 bg-amber-950/15 text-amber-200', rose: 'border-rose-500/25 bg-rose-950/15 text-rose-200', blue: 'border-blue-500/25 bg-blue-950/15 text-blue-200', purple: 'border-purple-500/25 bg-purple-950/15 text-purple-200' }[tone];
  return <div className={`p-4 rounded-xl border ${toneClass}`}><h3 className="text-[10px] font-black uppercase tracking-wider mb-2 text-white">{title}</h3><div className="text-xs font-semibold leading-relaxed">{children}</div></div>;
}

function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1600); };
  return <button onClick={copy} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-black rounded-xl flex items-center gap-1.5"><Copy className="w-3.5 h-3.5" />{copied ? 'Đã copy' : label}</button>;
}

function ExpenseComplianceChecker() {
  const [expenseType, setExpenseType] = useState('vat_tu_cong_trinh');
  const [amount, setAmount] = useState(8000000);
  const [hasInvoice, setHasInvoice] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'cash'>('bank');
  const [supplierType, setSupplierType] = useState<'company' | 'individual'>('company');
  const result = useMemo(() => {
    let risk = 15;
    const issues: string[] = [];
    const docs = ['Hóa đơn/chứng từ hợp lệ', 'Đề nghị thanh toán', 'Biên bản giao nhận hoặc nghiệm thu', 'Phiếu chi/ủy nhiệm chi'];
    if (!hasInvoice) { risk += 35; issues.push('Thiếu hóa đơn/chứng từ hợp lệ, rủi ro bị loại chi phí và không khấu trừ VAT.'); }
    if (amount >= 5000000 && paymentMethod === 'cash') { risk += 20; issues.push('Khoản chi từ 5 triệu nên ưu tiên thanh toán chuyển khoản để dễ kiểm soát và lưu vết.'); }
    if (supplierType === 'individual') { risk += 15; issues.push('Nhà cung cấp cá nhân cần xem xét hợp đồng, CCCD/MST cá nhân và khấu trừ thuế nếu thuộc diện phải khấu trừ.'); docs.push('Hợp đồng khoán/biên bản xác nhận công việc', 'Thông tin CCCD/MST cá nhân'); }
    if (expenseType === 'vat_tu_cong_trinh') docs.push('Phiếu nhập kho', 'Phiếu xuất kho theo công trình', 'Bảng phân bổ vật tư');
    if (expenseType === 'xang_dau') docs.push('Lệnh điều xe/nhật trình xe', 'Bảng kê sử dụng nhiên liệu');
    if (expenseType === 'tiep_khach') { risk += 10; docs.push('Danh sách khách/đối tượng làm việc', 'Nội dung tiếp khách phục vụ SXKD'); }
    return { risk: Math.min(risk, 100), issues, docs };
  }, [expenseType, amount, hasInvoice, paymentMethod, supplierType]);
  const tone = result.risk >= 70 ? 'rose' : result.risk >= 40 ? 'amber' : 'emerald';
  const report = `# Expense Compliance Check\n\n- Số tiền: ${money(amount)} VNĐ\n- Điểm rủi ro: ${result.risk}/100\n\n## Cảnh báo\n${result.issues.length ? result.issues.map(i => `- ${i}`).join('\n') : '- Chưa thấy cảnh báo lớn trong mô phỏng.'}\n\n## Checklist hồ sơ\n${result.docs.map(d => `- ${d}`).join('\n')}`;
  return <div className="space-y-4"><div className="grid md:grid-cols-2 gap-4"><div><FieldLabel>Loại chi phí</FieldLabel><select value={expenseType} onChange={e => setExpenseType(e.target.value)} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs"><option value="vat_tu_cong_trinh">Vật tư công trình</option><option value="xang_dau">Xăng dầu / xe máy thi công</option><option value="nhan_cong">Nhân công thuê ngoài</option><option value="tiep_khach">Tiếp khách</option><option value="van_phong">Hành chính văn phòng</option></select></div><div><FieldLabel>Số tiền thanh toán</FieldLabel><input value={amount} onChange={e => setAmount(Number(e.target.value || 0))} type="number" className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs" /></div><div><FieldLabel>Hóa đơn/chứng từ</FieldLabel><select value={hasInvoice ? 'yes' : 'no'} onChange={e => setHasInvoice(e.target.value === 'yes')} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs"><option value="yes">Có hóa đơn/chứng từ</option><option value="no">Chưa có hóa đơn/chứng từ</option></select></div><div><FieldLabel>Thanh toán</FieldLabel><select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as 'bank' | 'cash')} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs"><option value="bank">Chuyển khoản</option><option value="cash">Tiền mặt</option></select></div><div><FieldLabel>Nhà cung cấp</FieldLabel><select value={supplierType} onChange={e => setSupplierType(e.target.value as 'company' | 'individual')} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs"><option value="company">Công ty/hộ kinh doanh có hóa đơn</option><option value="individual">Cá nhân</option></select></div></div><div className="grid md:grid-cols-3 gap-4"><ResultCard title="Điểm rủi ro" tone={tone as 'emerald' | 'amber' | 'rose'}><span className="text-2xl font-black font-mono">{result.risk}/100</span><p className="mt-1 text-[11px]">{result.risk >= 70 ? 'Rủi ro cao' : result.risk >= 40 ? 'Rủi ro vừa' : 'Rủi ro thấp'}</p></ResultCard><ResultCard title="Cảnh báo" tone="amber">{result.issues.length ? <ul className="space-y-1 list-disc pl-4">{result.issues.map(i => <li key={i}>{i}</li>)}</ul> : 'Chưa thấy cảnh báo lớn trong mô phỏng.'}</ResultCard><ResultCard title="Checklist hồ sơ" tone="blue"><ul className="space-y-1 list-disc pl-4">{result.docs.map(doc => <li key={doc}>{doc}</li>)}</ul></ResultCard></div><CopyButton text={report} label="Copy báo cáo markdown" /></div>;
}

function JournalEntrySimulator() {
  const [caseId, setCaseId] = useState('material');
  const [baseAmount, setBaseAmount] = useState(50000000);
  const [vatRate, setVatRate] = useState(8);
  const vat = Math.round(baseAmount * vatRate / 100);
  const total = baseAmount + vat;
  const templates: Record<string, { title: string; rows: { debit?: string; credit?: string; amount: number; desc: string }[]; impact: string }> = {
    material: { title: 'Mua vật tư công trình chưa thanh toán, có VAT', rows: [{ debit: 'Nợ TK 152/154', amount: baseAmount, desc: 'Giá chưa thuế' }, { debit: 'Nợ TK 1331', amount: vat, desc: 'VAT đầu vào' }, { credit: 'Có TK 331', amount: total, desc: 'Phải trả NCC' }], impact: 'Tăng vật tư/chi phí dở dang, tăng VAT đầu vào và tăng công nợ phải trả.' },
    labor: { title: 'Chi nhân công thuê ngoài cho công trình', rows: [{ debit: 'Nợ TK 154/622', amount: baseAmount, desc: 'Chi phí nhân công' }, { credit: 'Có TK 111/112/331', amount: baseAmount, desc: 'Số phải trả/thanh toán' }], impact: 'Tăng chi phí công trình; nếu là cá nhân cần xem xét khấu trừ thuế và hồ sơ khoán việc.' },
    revenue: { title: 'Nghiệm thu doanh thu công trình', rows: [{ debit: 'Nợ TK 131', amount: total, desc: 'Tổng phải thu' }, { credit: 'Có TK 511', amount: baseAmount, desc: 'Doanh thu chưa VAT' }, { credit: 'Có TK 3331', amount: vat, desc: 'VAT đầu ra' }], impact: 'Tăng doanh thu, VAT phải nộp và công nợ phải thu; cần kết chuyển giá vốn tương ứng từ 154 sang 632.' }
  };
  const item = templates[caseId];
  const markdown = `# Journal Entry Simulator\n\n## ${item.title}\n\n| Nợ | Có | Số tiền | Diễn giải |\n|---|---|---:|---|\n${item.rows.map(row => `| ${row.debit ?? ''} | ${row.credit ?? ''} | ${money(row.amount)} | ${row.desc} |`).join('\n')}\n\n## Ảnh hưởng\n${item.impact}`;
  return <div className="space-y-4"><div className="grid md:grid-cols-3 gap-4"><div><FieldLabel>Nghiệp vụ</FieldLabel><select value={caseId} onChange={e => setCaseId(e.target.value)} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs"><option value="material">Mua vật tư công trình</option><option value="labor">Nhân công thuê ngoài</option><option value="revenue">Nghiệm thu doanh thu</option></select></div><div><FieldLabel>Số tiền chưa thuế / chi phí gốc</FieldLabel><input type="number" value={baseAmount} onChange={e => setBaseAmount(Number(e.target.value || 0))} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs" /></div><div><FieldLabel>VAT (%)</FieldLabel><input type="number" value={vatRate} onChange={e => setVatRate(Number(e.target.value || 0))} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs" /></div></div><ResultCard title={item.title} tone="purple"><div className="overflow-x-auto"><table className="w-full text-[11px]"><thead className="text-slate-500"><tr><th className="p-2 text-left">Nợ</th><th className="p-2 text-left">Có</th><th className="p-2 text-right">Số tiền</th><th className="p-2 text-left">Diễn giải</th></tr></thead><tbody>{item.rows.map((row, index) => <tr key={index} className="border-t border-slate-800"><td className="p-2 text-blue-300">{row.debit}</td><td className="p-2 text-emerald-300">{row.credit}</td><td className="p-2 text-right font-mono">{money(row.amount)}</td><td className="p-2 text-slate-400">{row.desc}</td></tr>)}</tbody></table></div></ResultCard><ResultCard title="Ảnh hưởng báo cáo" tone="blue">{item.impact}</ResultCard><CopyButton text={markdown} label="Copy bút toán markdown" /></div>;
}

function ConstructionCostFlow() {
  const steps = ['Mua vật tư', 'Nhập kho', 'Xuất cho công trình', 'Tập hợp TK 154', 'Nghiệm thu khối lượng', 'Kết chuyển giá vốn'];
  return <div className="space-y-4"><div className="grid md:grid-cols-3 gap-3">{steps.map((step, index) => <div key={step} className="p-4 bg-[#060a12] border border-slate-850 rounded-xl"><span className="text-[9px] text-emerald-400 font-black font-mono">STEP {index + 1}</span><p className="text-xs font-bold text-white mt-1">{step}</p><p className="text-[10px] text-slate-500 mt-1">Mốc kiểm soát chứng từ và chi phí.</p></div>)}</div><ResultCard title="Điểm kiểm soát" tone="emerald">Luôn gắn chi phí với mã công trình, mã hạng mục, người phê duyệt và chứng từ gốc. Đây là nền tảng để so sánh dự toán - thực tế.</ResultCard></div>;
}

function GrossUpCalculator() {
  const [net, setNet] = useState(25000000);
  const [rate, setRate] = useState(10);
  const gross = rate >= 100 ? 0 : net / (1 - rate / 100);
  const tax = gross - net;
  return <div className="space-y-4"><div className="grid md:grid-cols-2 gap-4"><div><FieldLabel>Số tiền thực nhận/thực trả net</FieldLabel><input type="number" value={net} onChange={e => setNet(Number(e.target.value || 0))} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs" /></div><div><FieldLabel>Tỷ lệ thuế/khấu trừ (%)</FieldLabel><input type="number" value={rate} onChange={e => setRate(Number(e.target.value || 0))} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs" /></div></div><div className="grid md:grid-cols-3 gap-4"><ResultCard title="Gross trước khấu trừ" tone="blue">{money(gross)} VNĐ</ResultCard><ResultCard title="Thuế công ty chịu" tone="amber">{money(tax)} VNĐ</ResultCard><ResultCard title="Net thực trả" tone="emerald">{money(net)} VNĐ</ResultCard></div><ResultCard title="Cảnh báo hồ sơ" tone="rose">Gross-up cần thống nhất trong hợp đồng, bảng đề xuất, chứng từ thanh toán và cách hạch toán. Không nên chỉ sửa riêng bảng thanh toán.</ResultCard></div>;
}

function AuditRiskScoring() {
  const [roundAmount, setRoundAmount] = useState(true);
  const [weekend, setWeekend] = useState(false);
  const [newVendor, setNewVendor] = useState(true);
  const [nearApprovalLimit, setNearApprovalLimit] = useState(false);
  const score = [roundAmount ? 20 : 0, weekend ? 20 : 0, newVendor ? 25 : 0, nearApprovalLimit ? 30 : 0].reduce((a, b) => a + b, 10);
  return <div className="space-y-4"><div className="grid md:grid-cols-2 gap-3">{[['roundAmount', 'Số tiền tròn/chẵn lớn', roundAmount, setRoundAmount], ['weekend', 'Tạo chứng từ cuối tuần/ngoài giờ', weekend, setWeekend], ['newVendor', 'Nhà cung cấp mới', newVendor, setNewVendor], ['nearApprovalLimit', 'Tách nhỏ gần ngưỡng phê duyệt', nearApprovalLimit, setNearApprovalLimit]].map(([key, label, value, setter]) => <label key={key as string} className="p-3 bg-[#060a12] border border-slate-850 rounded-xl text-xs font-semibold flex items-center gap-2"><input type="checkbox" checked={value as boolean} onChange={e => (setter as React.Dispatch<React.SetStateAction<boolean>>)(e.target.checked)} />{label as string}</label>)}</div><ResultCard title="Audit risk score" tone={score >= 70 ? 'rose' : score >= 40 ? 'amber' : 'emerald'}><span className="text-2xl font-black font-mono">{score}/100</span><p className="mt-1">Đề xuất: kiểm tra chứng từ gốc, phê duyệt, lịch sử nhà cung cấp và đối chiếu thanh toán.</p></ResultCard></div>;
}

function CashFlowForecast() {
  const [opening, setOpening] = useState(50000000);
  const [weeklyIn, setWeeklyIn] = useState(30000000);
  const [weeklyOut, setWeeklyOut] = useState(42000000);
  const rows = Array.from({ length: 4 }, (_, index) => ({ week: index + 1, in: weeklyIn, out: weeklyOut, end: opening + (weeklyIn - weeklyOut) * (index + 1) }));
  return <div className="space-y-4"><div className="grid md:grid-cols-3 gap-4"><div><FieldLabel>Tiền đầu kỳ</FieldLabel><input type="number" value={opening} onChange={e => setOpening(Number(e.target.value || 0))} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs" /></div><div><FieldLabel>Thu mỗi tuần</FieldLabel><input type="number" value={weeklyIn} onChange={e => setWeeklyIn(Number(e.target.value || 0))} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs" /></div><div><FieldLabel>Chi mỗi tuần</FieldLabel><input type="number" value={weeklyOut} onChange={e => setWeeklyOut(Number(e.target.value || 0))} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs" /></div></div><div className="overflow-x-auto rounded-xl border border-slate-850"><table className="w-full text-[11px]"><thead className="bg-slate-900 text-slate-500"><tr><th className="p-2 text-left">Tuần</th><th className="p-2 text-left">Thu</th><th className="p-2 text-left">Chi</th><th className="p-2 text-left">Số dư cuối</th></tr></thead><tbody>{rows.map(row => <tr key={row.week} className="border-t border-slate-900"><td className="p-2">Tuần {row.week}</td><td className="p-2 text-emerald-400">{money(row.in)}</td><td className="p-2 text-rose-400">{money(row.out)}</td><td className={`p-2 font-bold ${row.end < 0 ? 'text-rose-400' : 'text-slate-200'}`}>{money(row.end)}</td></tr>)}</tbody></table></div></div>;
}

function PromptBuilder() {
  const [goal, setGoal] = useState('kiểm tra chi phí xây dựng');
  const prompt = `Bạn là chuyên gia kế toán, kiểm toán và dữ liệu cho doanh nghiệp xây dựng Việt Nam. Hãy giúp tôi ${goal}. Trình bày theo 5 phần: mục tiêu kiểm tra, dữ liệu đầu vào cần có, checklist chứng từ, rủi ro thuế/kế toán, và đề xuất hành động cụ thể. Nếu thiếu thông tin, hãy hỏi lại tối đa 5 câu quan trọng nhất.`;
  return <div className="space-y-4"><div><FieldLabel>Mục tiêu</FieldLabel><input value={goal} onChange={e => setGoal(e.target.value)} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs" /></div><ResultCard title="Prompt đề xuất" tone="purple"><pre className="whitespace-pre-wrap font-mono text-[11px]">{prompt}</pre></ResultCard><CopyButton text={prompt} label="Copy prompt" /></div>;
}

function SqlPlayground() {
  const [query, setQuery] = useState('duplicate');
  const sql: Record<string, string> = { duplicate: `SELECT vendor_id, invoice_no, total_amount, COUNT(*) AS count_dup\nFROM expenses\nGROUP BY vendor_id, invoice_no, total_amount\nHAVING COUNT(*) > 1;`, aging: `SELECT customer_id, SUM(amount_due) AS balance,\n  CASE WHEN days_overdue > 90 THEN '90+' WHEN days_overdue > 30 THEN '31-90' ELSE '0-30' END AS bucket\nFROM receivables\nGROUP BY customer_id, bucket;`, overrun: `SELECT project_id, budget_amount, actual_cost,\n  actual_cost - budget_amount AS variance\nFROM project_costs\nWHERE actual_cost > budget_amount;` };
  return <div className="space-y-4"><div><FieldLabel>Bài test SQL</FieldLabel><select value={query} onChange={e => setQuery(e.target.value)} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs"><option value="duplicate">Duplicate payment</option><option value="aging">Aging công nợ</option><option value="overrun">Vượt ngân sách công trình</option></select></div><pre className="p-4 bg-[#02050b] border border-slate-850 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto">{sql[query]}</pre><CopyButton text={sql[query]} label="Copy SQL" /></div>;
}

function ProjectOverrunChecker() {
  const [budget, setBudget] = useState(120000000);
  const [actual, setActual] = useState(145000000);
  const variance = actual - budget;
  const pct = budget ? variance / budget * 100 : 0;
  return <div className="space-y-4"><div className="grid md:grid-cols-2 gap-4"><div><FieldLabel>Dự toán</FieldLabel><input type="number" value={budget} onChange={e => setBudget(Number(e.target.value || 0))} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs" /></div><div><FieldLabel>Thực tế</FieldLabel><input type="number" value={actual} onChange={e => setActual(Number(e.target.value || 0))} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs" /></div></div><ResultCard title="Chênh lệch" tone={variance > 0 ? 'rose' : 'emerald'}>{variance > 0 ? 'Vượt' : 'Tiết kiệm'} {money(Math.abs(variance))} VNĐ ({pct.toFixed(1)}%). {variance > 0 ? 'Cần xem lại vật tư, nhân công, máy thi công và chi phí chung.' : 'Đang trong ngân sách mô phỏng.'}</ResultCard></div>;
}

function DocumentChecklistGenerator() {
  const [type, setType] = useState('material');
  const lists: Record<string, { title: string; items: string[] }> = { material: { title: 'Mua/xuất vật tư', items: ['Hợp đồng/đơn đặt hàng', 'Hóa đơn', 'Biên bản giao nhận', 'Phiếu nhập kho', 'Phiếu xuất theo công trình', 'Ủy nhiệm chi/phiếu chi'] }, labor: { title: 'Nhân công thuê ngoài', items: ['Hợp đồng giao khoán', 'CCCD/MST cá nhân nếu có', 'Bảng chấm công/xác nhận khối lượng', 'Biên bản nghiệm thu', 'Chứng từ khấu trừ thuế nếu có', 'Phiếu chi/ủy nhiệm chi'] }, fuel: { title: 'Xăng dầu', items: ['Hóa đơn xăng dầu', 'Lệnh điều xe', 'Nhật trình xe/máy', 'Bảng kê nhiên liệu', 'Định mức hoặc giải trình sử dụng'] }, revenue: { title: 'Nghiệm thu doanh thu', items: ['Hợp đồng', 'Phụ lục/BOQ', 'Biên bản nghiệm thu', 'Hồ sơ thanh toán', 'Hóa đơn đầu ra', 'Đối chiếu công nợ'] } };
  const current = lists[type];
  const markdown = `# Checklist hồ sơ - ${current.title}\n\n${current.items.map(item => `- [ ] ${item}`).join('\n')}\n\n> Ghi chú: checklist phục vụ học tập/sandbox, cần đối chiếu quy định và hồ sơ thực tế trước khi áp dụng.`;
  return <div className="space-y-4"><div><FieldLabel>Loại nghiệp vụ</FieldLabel><select value={type} onChange={e => setType(e.target.value)} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs"><option value="material">Mua/xuất vật tư</option><option value="labor">Nhân công thuê ngoài</option><option value="fuel">Xăng dầu</option><option value="revenue">Nghiệm thu doanh thu</option></select></div><ResultCard title={`Checklist hồ sơ - ${current.title}`} tone="blue"><ul className="space-y-2">{current.items.map(item => <li key={item} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />{item}</li>)}</ul></ResultCard><CopyButton text={markdown} label="Copy checklist markdown" /></div>;
}
