import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Copy, Database, FileWarning, Gauge, GitBranch, ListChecks, ShieldCheck } from 'lucide-react';

type DatasetKey = 'expenses' | 'invoices' | 'inventory' | 'projects' | 'receivables';

type DataRule = {
  id: string;
  name: string;
  test: string;
  risk: string;
  fix: string;
  severity: 'low' | 'medium' | 'high';
};

const datasetRules: Record<DatasetKey, { title: string; purpose: string; rules: DataRule[] }> = {
  expenses: {
    title: 'Chi phí / Expense Ledger',
    purpose: 'Kiểm tra dữ liệu chi phí trước khi đưa vào dashboard kế toán, thuế, ML hoặc audit analytics.',
    rules: [
      { id: 'missing_project', name: 'Thiếu mã công trình', test: 'project_id is null', risk: 'Không phân bổ được chi phí vào 154/công trình.', fix: 'Bắt buộc project_id với chi phí xây dựng.', severity: 'high' },
      { id: 'negative_amount', name: 'Số tiền âm bất thường', test: 'amount < 0 and transaction_type != refund', risk: 'Sai nhập liệu hoặc bút toán đảo chưa giải thích.', fix: 'Phân loại refund/reversal và yêu cầu ghi chú.', severity: 'medium' },
      { id: 'missing_doc', name: 'Thiếu chứng từ', test: 'document_status = missing', risk: 'Rủi ro thuế và kiểm toán.', fix: 'Gắn checklist hồ sơ theo loại chi phí.', severity: 'high' },
      { id: 'duplicate_payment', name: 'Nghi thanh toán trùng', test: 'same vendor + invoice + amount', risk: 'Có thể thanh toán trùng hoặc nhập trùng hóa đơn.', fix: 'Đối chiếu hóa đơn, UNC và công nợ 331.', severity: 'high' }
    ]
  },
  invoices: {
    title: 'Hóa đơn / Invoice Data',
    purpose: 'Kiểm tra dữ liệu hóa đơn đầu vào/đầu ra trước khi đối chiếu VAT, doanh thu và công nợ.',
    rules: [
      { id: 'missing_tax_code', name: 'Thiếu MST', test: 'tax_code is null', risk: 'Khó đối chiếu đối tác và rủi ro sai thông tin hóa đơn.', fix: 'Chuẩn hóa master data nhà cung cấp/khách hàng.', severity: 'medium' },
      { id: 'vat_mismatch', name: 'VAT lệch', test: 'vat_amount != net_amount * vat_rate', risk: 'Sai tính thuế hoặc sai mapping dòng hàng.', fix: 'Cho phép rounding threshold và kiểm tra hóa đơn gốc.', severity: 'high' },
      { id: 'invoice_date_gap', name: 'Ngày hóa đơn lệch nghiệm thu', test: 'invoice_date far from acceptance_date', risk: 'Ghi nhận sai kỳ hoặc thiếu nghiệm thu.', fix: 'Đối chiếu hợp đồng/nghiệm thu/hóa đơn.', severity: 'medium' }
    ]
  },
  inventory: {
    title: 'Kho / Inventory Data',
    purpose: 'Kiểm tra dữ liệu nhập xuất tồn, âm kho và vật tư chậm luân chuyển.',
    rules: [
      { id: 'negative_stock', name: 'Âm kho', test: 'ending_qty < 0', risk: 'Sai thời điểm nhập/xuất hoặc thiếu phiếu nhập.', fix: 'Chặn xuất quá tồn hoặc yêu cầu phê duyệt điều chỉnh.', severity: 'high' },
      { id: 'no_project_issue', name: 'Xuất kho thiếu công trình', test: 'issue_type = project and project_id is null', risk: 'Không tập hợp được chi phí công trình.', fix: 'Bắt buộc mã công trình khi xuất vật tư.', severity: 'high' },
      { id: 'slow_moving', name: 'Vật tư chậm luân chuyển', test: 'days_since_last_issue > 180', risk: 'Tồn kho ảo/chậm luân chuyển/cần dự phòng.', fix: 'Kiểm kê và phân loại tình trạng vật tư.', severity: 'medium' }
    ]
  },
  projects: {
    title: 'Công trình / Project Cost Data',
    purpose: 'Kiểm tra dữ liệu dự toán, thực tế, nghiệm thu và vượt ngân sách.',
    rules: [
      { id: 'budget_missing', name: 'Thiếu dự toán', test: 'budget_amount is null', risk: 'Không đo được overrun/variance.', fix: 'Bắt buộc budget baseline trước khi theo dõi thực tế.', severity: 'high' },
      { id: 'overrun', name: 'Vượt ngân sách', test: 'actual_cost > budget_amount * 1.1', risk: 'Rủi ro lỗ công trình hoặc sai phân bổ chi phí.', fix: 'Phân tích vật tư/nhân công/máy thi công/chi phí chung.', severity: 'high' },
      { id: 'stale_154', name: 'Treo 154 lâu', test: 'wip_age_days > threshold', risk: 'Chưa kết chuyển giá vốn hoặc chậm nghiệm thu.', fix: 'Đối chiếu nghiệm thu, doanh thu và kết chuyển 632.', severity: 'medium' }
    ]
  },
  receivables: {
    title: 'Công nợ phải thu / AR Data',
    purpose: 'Kiểm tra tuổi nợ, xác nhận công nợ và rủi ro thu hồi.',
    rules: [
      { id: 'aging_90', name: 'Nợ quá 90 ngày', test: 'days_overdue > 90', risk: 'Rủi ro thu hồi và dự phòng.', fix: 'Gửi xác nhận công nợ, kế hoạch thu tiền, phân loại nợ.', severity: 'high' },
      { id: 'missing_confirmation', name: 'Thiếu đối chiếu công nợ', test: 'confirmation_status = missing', risk: 'Rủi ro tranh chấp số dư.', fix: 'Lập biên bản đối chiếu cuối kỳ.', severity: 'medium' },
      { id: 'unmatched_receipt', name: 'Tiền về chưa đối trừ', test: 'bank_receipt not matched to invoice', risk: 'Sai aging hoặc ghi nhận công nợ chưa đúng.', fix: 'Bank reconciliation và mapping hóa đơn.', severity: 'medium' }
    ]
  }
};

export default function DataQualityPipelineLab() {
  const [dataset, setDataset] = useState<DatasetKey>('expenses');
  const [rowCount, setRowCount] = useState(1200);
  const [failedRows, setFailedRows] = useState(36);
  const [copied, setCopied] = useState(false);
  const selected = datasetRules[dataset];
  const passRate = rowCount > 0 ? Math.max(0, Math.min(100, (rowCount - failedRows) / rowCount * 100)) : 0;
  const status = passRate >= 98 ? 'Ready' : passRate >= 95 ? 'Review' : 'Block release';
  const statusTone = passRate >= 98 ? 'emerald' : passRate >= 95 ? 'amber' : 'rose';

  const markdown = useMemo(() => `# Data Quality Pipeline Report\n\n## Dataset\n${selected.title}\n\n## Purpose\n${selected.purpose}\n\n## Summary\n- Rows: ${rowCount}\n- Failed rows: ${failedRows}\n- Pass rate: ${passRate.toFixed(1)}%\n- Status: ${status}\n\n## Rules\n${selected.rules.map(rule => `- ${rule.name} [${rule.severity}]\n  - Test: ${rule.test}\n  - Risk: ${rule.risk}\n  - Fix: ${rule.fix}`).join('\n')}\n\n## Release gate\nKhông dùng dataset cho báo cáo/ML nếu pass rate thấp hoặc có lỗi high severity chưa xử lý.`, [selected, rowCount, failedRows, passRate, status]);

  const copy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-5 text-slate-100 select-text">
      <section className="bg-gradient-to-r from-cyan-950/20 via-[#060a12] to-purple-950/20 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0"><Database className="w-5 h-5" /></div>
          <div><h2 className="text-sm font-black text-white uppercase tracking-widest">Data Quality & Pipeline Lab</h2><p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">Kiểm tra chất lượng dữ liệu trước khi dùng cho dashboard, khóa sổ, audit analytics hoặc machine learning.</p></div>
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-3">
        <Metric title="Pass rate" value={`${passRate.toFixed(1)}%`} tone={statusTone} />
        <Metric title="Failed rows" value={`${failedRows}`} tone={failedRows === 0 ? 'emerald' : 'amber'} />
        <Metric title="Release gate" value={status} tone={statusTone} />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div><FieldLabel>Dataset</FieldLabel><select value={dataset} onChange={e => setDataset(e.target.value as DatasetKey)} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200">{Object.entries(datasetRules).map(([key, value]) => <option key={key} value={key}>{value.title}</option>)}</select></div>
        <NumberInput label="Số dòng dữ liệu" value={rowCount} onChange={setRowCount} />
        <NumberInput label="Số dòng lỗi" value={failedRows} onChange={setFailedRows} />
      </div>

      <section className="p-4 rounded-xl border border-slate-850 bg-slate-900/35">
        <h3 className="text-[10px] font-black uppercase tracking-wider mb-2 text-white flex items-center gap-2"><GitBranch className="w-4 h-4 text-cyan-400" />{selected.title}</h3>
        <p className="text-xs text-slate-300 font-semibold leading-relaxed">{selected.purpose}</p>
      </section>

      <div className="space-y-3">
        {selected.rules.map(rule => (
          <div key={rule.id} className="p-4 bg-[#060a12] border border-slate-850 rounded-xl">
            <div className="flex items-start justify-between gap-3"><h3 className="text-xs font-black text-white flex items-center gap-2"><ListChecks className="w-4 h-4 text-cyan-400" />{rule.name}</h3><span className={`text-[9px] font-black uppercase px-2 py-1 rounded border ${rule.severity === 'high' ? 'text-rose-300 border-rose-500/25 bg-rose-950/15' : rule.severity === 'medium' ? 'text-amber-300 border-amber-500/25 bg-amber-950/15' : 'text-emerald-300 border-emerald-500/25 bg-emerald-950/15'}`}>{rule.severity}</span></div>
            <p className="text-[10px] text-slate-500 font-mono mt-2">Test: {rule.test}</p>
            <div className="grid md:grid-cols-2 gap-3 mt-3"><Panel title="Risk" icon={FileWarning} tone="rose">{rule.risk}</Panel><Panel title="Fix" icon={ShieldCheck} tone="emerald">{rule.fix}</Panel></div>
          </div>
        ))}
      </div>

      <button onClick={copy} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-black rounded-xl flex items-center gap-1.5">{copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}{copied ? 'Đã copy' : 'Copy data quality report'}</button>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) { return <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">{children}</label>; }
function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) { return <div><FieldLabel>{label}</FieldLabel><input type="number" value={value} onChange={e => onChange(Number(e.target.value || 0))} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200" /></div>; }
function Metric({ title, value, tone }: { title: string; value: string; tone: 'emerald' | 'amber' | 'rose' }) { const colors = { emerald: 'text-emerald-400 border-emerald-500/25 bg-emerald-950/15', amber: 'text-amber-400 border-amber-500/25 bg-amber-950/15', rose: 'text-rose-400 border-rose-500/25 bg-rose-950/15' }[tone]; return <div className={`p-3 rounded-xl border ${colors}`}><span className="text-[9px] text-slate-500 font-black uppercase block">{title}</span><p className="text-sm font-black mt-1 font-mono">{value}</p></div>; }
function Panel({ title, children, icon: Icon, tone }: { title: string; children: React.ReactNode; icon: React.ComponentType<{ className?: string }>; tone: 'emerald' | 'rose' }) { const colors = { emerald: 'border-emerald-500/25 bg-emerald-950/15 text-emerald-200', rose: 'border-rose-500/25 bg-rose-950/15 text-rose-200' }[tone]; return <section className={`p-3 rounded-xl border ${colors}`}><h4 className="text-[9px] font-black uppercase tracking-wider mb-1.5 text-white flex items-center gap-2"><Icon className="w-3.5 h-3.5" />{title}</h4><div className="text-[10.5px] font-semibold leading-relaxed">{children}</div></section>; }
