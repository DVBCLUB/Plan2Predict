import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, ClipboardList, Copy, DatabaseZap, FileKey2, GitBranch, ShieldCheck, Waypoints } from 'lucide-react';

type LineageArea = 'expenses' | 'invoices' | 'inventory' | 'projects' | 'receivables' | 'ml_models';

type LineageTemplate = {
  title: string;
  sourceSystems: string[];
  transformations: string[];
  controls: string[];
  outputs: string[];
  risks: string[];
  owner: string;
};

const templates: Record<LineageArea, LineageTemplate> = {
  expenses: {
    title: 'Expense Ledger Lineage',
    sourceSystems: ['Phiếu đề nghị thanh toán', 'Hóa đơn/chứng từ', 'Phiếu nhập/xuất kho', 'Sổ chi tiết 331/141/154', 'Bank statement'],
    transformations: ['Chuẩn hóa vendor_id', 'Chuẩn hóa invoice_no', 'Map expense_type', 'Map project_id', 'Gắn document_status'],
    controls: ['Duplicate vendor + invoice + amount', 'Missing project_id', 'Missing document_status', 'Negative amount review'],
    outputs: ['Expense dashboard', 'Tax checklist', 'Audit analytics', 'Data quality report'],
    risks: ['Sai mã công trình làm lệch 154', 'Thiếu chứng từ làm rủi ro thuế', 'Nhập trùng hóa đơn/thanh toán'],
    owner: 'Kế toán thanh toán / Kế toán công trình'
  },
  invoices: {
    title: 'Invoice VAT Lineage',
    sourceSystems: ['Hóa đơn điện tử', 'Bảng kê VAT', 'Hợp đồng/PO', 'Biên bản nghiệm thu/giao nhận'],
    transformations: ['Chuẩn hóa MST', 'Tách net_amount / vat_rate / vat_amount', 'Map declared_period', 'Đối chiếu invoice_date'],
    controls: ['VAT mismatch threshold', 'Missing vendor_tax_code', 'Invoice date vs declared period', 'Zero VAT review'],
    outputs: ['VAT review', 'Tax bridge matrix', 'Invoice quality dashboard'],
    risks: ['Sai kỳ kê khai', 'Sai thuế suất', 'Hóa đơn thiếu thông tin đối tác'],
    owner: 'Kế toán thuế'
  },
  inventory: {
    title: 'Inventory Movement Lineage',
    sourceSystems: ['Phiếu nhập kho', 'Phiếu xuất kho', 'Biên bản giao nhận', 'Sổ kho', 'Bảng tập hợp vật tư công trình'],
    transformations: ['Chuẩn hóa item_code', 'Phân loại IN/OUT/ADJUST', 'Map warehouse_id', 'Map project_id', 'Tính ending_qty'],
    controls: ['Negative stock', 'OUT without project_id', 'Slow moving inventory', 'Movement sign check'],
    outputs: ['Warehouse dashboard', 'Project 154 allocation', 'Inventory anomaly detection'],
    risks: ['Âm kho giả do nhập liệu lệch thời điểm', 'Xuất vật tư không gắn công trình', 'Tồn kho chậm luân chuyển'],
    owner: 'Thủ kho / Kế toán kho'
  },
  projects: {
    title: 'Project Cost Lineage',
    sourceSystems: ['Dự toán/BOQ', 'Chi phí thực tế', 'Nghiệm thu', 'Hợp đồng/chủ đầu tư', 'Bảng kết chuyển 154/632'],
    transformations: ['Map project_id', 'Map cost category', 'Tính actual_cost', 'Tính variance', 'Tính wip_age_days'],
    controls: ['Missing budget', 'Overrun > 10%', 'Stale WIP 154', 'Revenue vs cost close check'],
    outputs: ['Project overrun checker', 'Month-end close lab', 'Management dashboard'],
    risks: ['Thiếu budget làm không đo được variance', 'Treo 154 lâu', 'Kết chuyển giá vốn sai kỳ'],
    owner: 'Kế toán công trình / PM / QS'
  },
  receivables: {
    title: 'Accounts Receivable Lineage',
    sourceSystems: ['Hóa đơn đầu ra', 'Hợp đồng bán hàng', 'Bank statement', 'Biên bản đối chiếu công nợ', 'Sổ chi tiết 131'],
    transformations: ['Map customer_id', 'Map invoice_no', 'Tính outstanding_amount', 'Tính days_overdue', 'Map bank_receipt_matched'],
    controls: ['Aging > 90 days', 'Missing confirmation', 'Unmatched bank receipt', 'Large outstanding review'],
    outputs: ['AR aging dashboard', 'Collection risk model', 'Audit confirmation list'],
    risks: ['Sai aging do chưa đối trừ tiền về', 'Thiếu xác nhận công nợ', 'Rủi ro thu hồi nợ'],
    owner: 'Kế toán công nợ / Kinh doanh phụ trách khách hàng'
  },
  ml_models: {
    title: 'ML Model Lineage',
    sourceSystems: ['Sample Dataset Pack', 'Data Quality Pipeline report', 'Feature engineering notebook/spec', 'Model Card', 'Human review log'],
    transformations: ['Train/test split', 'Feature encoding', 'Threshold selection', 'Backtesting', 'Drift monitoring'],
    controls: ['Data quality pass gate', 'Metric threshold', 'Bias/false positive review', 'Human approval before production'],
    outputs: ['Risk score', 'Model card', 'Review queue', 'Monitoring report'],
    risks: ['Tin score tuyệt đối', 'Dataset drift', 'Thiếu human review', 'Model dùng dữ liệu lỗi'],
    owner: 'Data owner / Model reviewer / Business owner'
  }
};

export default function DataLineageGovernanceLab() {
  const [area, setArea] = useState<LineageArea>('expenses');
  const [version, setVersion] = useState('lineage-v0.1-sandbox');
  const [copied, setCopied] = useState(false);
  const selected = templates[area];

  const markdown = useMemo(() => `# Data Lineage & Governance - ${selected.title}\n\n## Version\n${version}\n\n## Owner\n${selected.owner}\n\n## Source systems\n${selected.sourceSystems.map(item => `- ${item}`).join('\n')}\n\n## Transformations\n${selected.transformations.map(item => `- ${item}`).join('\n')}\n\n## Controls\n${selected.controls.map(item => `- [ ] ${item}`).join('\n')}\n\n## Outputs\n${selected.outputs.map(item => `- ${item}`).join('\n')}\n\n## Risks\n${selected.risks.map(item => `- ${item}`).join('\n')}\n\n## Rule\nKhông dùng dữ liệu cho dashboard, tax review, audit analytics hoặc ML nếu chưa rõ nguồn, biến đổi, owner và control gate.`, [selected, version]);

  const copy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-5 text-slate-100 select-text">
      <section className="bg-gradient-to-r from-cyan-950/20 via-[#060a12] to-emerald-950/20 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0"><Waypoints className="w-5 h-5" /></div>
          <div><h2 className="text-sm font-black text-white uppercase tracking-widest">Data Lineage & Governance Lab</h2><p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">Theo dõi dữ liệu đi từ nguồn nào, biến đổi ra sao, kiểm soát bởi ai và được dùng cho output nào trước khi đưa vào dashboard, audit analytics hoặc ML.</p></div>
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2"><FieldLabel>Lineage area</FieldLabel><select value={area} onChange={e => setArea(e.target.value as LineageArea)} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200">{Object.entries(templates).map(([key, value]) => <option key={key} value={key}>{value.title}</option>)}</select></div>
        <div><FieldLabel>Version</FieldLabel><input value={version} onChange={e => setVersion(e.target.value)} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200" /></div>
      </div>

      <div className="grid md:grid-cols-4 gap-3">
        <Metric title="Sources" value={String(selected.sourceSystems.length)} icon={DatabaseZap} />
        <Metric title="Transforms" value={String(selected.transformations.length)} icon={GitBranch} />
        <Metric title="Controls" value={String(selected.controls.length)} icon={ShieldCheck} />
        <Metric title="Outputs" value={String(selected.outputs.length)} icon={FileKey2} />
      </div>

      <section className="p-4 rounded-xl border border-cyan-500/25 bg-cyan-950/15"><h3 className="text-[10px] font-black uppercase tracking-wider mb-2 text-white flex items-center gap-2"><ClipboardList className="w-4 h-4 text-cyan-400" />Owner</h3><p className="text-xs text-cyan-100 font-semibold leading-relaxed">{selected.owner}</p></section>

      <div className="grid md:grid-cols-2 gap-4">
        <ListPanel title="Source systems" icon={DatabaseZap} items={selected.sourceSystems} tone="blue" />
        <ListPanel title="Transformations" icon={GitBranch} items={selected.transformations} tone="purple" />
        <ListPanel title="Control gates" icon={ShieldCheck} items={selected.controls} tone="emerald" />
        <ListPanel title="Risks" icon={AlertTriangle} items={selected.risks} tone="rose" />
      </div>

      <ListPanel title="Outputs using this lineage" icon={FileKey2} items={selected.outputs} tone="amber" />

      <button onClick={copy} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-black rounded-xl flex items-center gap-1.5">{copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}{copied ? 'Đã copy' : 'Copy lineage report'}</button>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) { return <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">{children}</label>; }
function Metric({ title, value, icon: Icon }: { title: string; value: string; icon: React.ComponentType<{ className?: string }> }) { return <div className="p-3 rounded-xl border border-cyan-500/20 bg-cyan-950/10"><Icon className="w-4 h-4 text-cyan-400 mb-2" /><span className="text-[9px] text-slate-500 font-black uppercase block">{title}</span><p className="text-xs font-black text-cyan-300 mt-1">{value}</p></div>; }
function ListPanel({ title, items, icon: Icon, tone }: { title: string; items: string[]; icon: React.ComponentType<{ className?: string }>; tone: 'blue' | 'purple' | 'emerald' | 'rose' | 'amber' }) { const colors = { blue: 'text-blue-400 bg-blue-400', purple: 'text-purple-400 bg-purple-400', emerald: 'text-emerald-400 bg-emerald-400', rose: 'text-rose-400 bg-rose-400', amber: 'text-amber-400 bg-amber-400' }[tone]; const [textColor, dotColor] = colors.split(' '); return <section className="p-4 rounded-xl border border-slate-850 bg-slate-900/35"><h3 className="text-[10px] font-black uppercase tracking-wider mb-3 text-white flex items-center gap-2"><Icon className={`w-4 h-4 ${textColor}`} />{title}</h3><ul className="space-y-2">{items.map(item => <li key={item} className="text-xs text-slate-300 font-semibold leading-relaxed flex gap-2"><span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />{item}</li>)}</ul></section>; }
