import React, { useMemo, useState } from 'react';
import { AlertTriangle, BarChart3, BrainCircuit, CheckCircle2, ClipboardList, Copy, Database, FileText, Gauge, ShieldCheck } from 'lucide-react';

type ModelUseCase = 'expense_risk' | 'project_overrun' | 'ar_collection' | 'inventory_anomaly' | 'duplicate_payment';

type ModelTemplate = {
  title: string;
  objective: string;
  target: string;
  features: string[];
  metrics: string[];
  risks: string[];
  humanReview: string[];
};

const templates: Record<ModelUseCase, ModelTemplate> = {
  expense_risk: {
    title: 'Expense Risk Scoring Model',
    objective: 'Chấm điểm rủi ro khoản chi trước khi đưa vào báo cáo, hoàn ứng, thanh toán hoặc kiểm tra thuế.',
    target: 'risk_flag hoặc risk_score cho từng expense_id.',
    features: ['expense_type', 'amount', 'payment_method', 'document_status', 'vendor_age_days', 'project_id_missing', 'invoice_duplicate_signal'],
    metrics: ['precision@high_risk', 'recall@high_risk', 'false_positive_rate', 'review_acceptance_rate'],
    risks: ['Dữ liệu chứng từ thiếu làm score sai', 'Model có thể đánh dấu nhầm khoản chi hợp lệ', 'Không được dùng model để tự động từ chối thanh toán'],
    humanReview: ['Kế toán kiểm tra chứng từ gốc', 'Người duyệt xác nhận ngoại lệ', 'Cập nhật rule nếu false positive lặp lại']
  },
  project_overrun: {
    title: 'Project Cost Overrun Model',
    objective: 'Dự báo công trình có nguy cơ vượt dự toán, treo 154 lâu hoặc lợi nhuận giảm.',
    target: 'overrun_probability hoặc expected_variance_percent theo project_id.',
    features: ['budget_amount', 'actual_cost_to_date', 'wip_age_days', 'material_cost_ratio', 'labor_cost_ratio', 'change_order_count', 'accepted_revenue'],
    metrics: ['MAE variance percent', 'recall@overrun', 'calibration_error', 'backtest_hit_rate'],
    risks: ['Thiếu budget baseline làm model vô nghĩa', 'Thay đổi thiết kế/hợp đồng làm dữ liệu lịch sử không còn phù hợp', 'Model không thay thế phân tích QS/kỹ thuật'],
    humanReview: ['PM/QS xác nhận nguyên nhân vượt', 'Kế toán đối chiếu 154/632', 'Ban điều hành duyệt hành động kiểm soát']
  },
  ar_collection: {
    title: 'AR Collection Risk Model',
    objective: 'Ưu tiên công nợ cần thu, xác nhận hoặc trích lập dự phòng theo aging và hành vi thanh toán.',
    target: 'collection_risk_bucket cho từng ar_id/customer_id.',
    features: ['days_overdue', 'outstanding_amount', 'confirmation_status', 'bank_receipt_matched', 'customer_payment_history', 'dispute_flag'],
    metrics: ['recall@over90', 'precision@high_risk', 'collection_lift', 'aging_bucket_accuracy'],
    risks: ['Không có biên bản đối chiếu làm đánh giá sai', 'Khách hàng chậm trả theo hợp đồng không hẳn là nợ xấu', 'Cần tuân thủ chính sách dự phòng nội bộ'],
    humanReview: ['Kế toán công nợ xác nhận số dư', 'Kinh doanh/PM xác nhận tranh chấp', 'Kế toán trưởng duyệt phân loại rủi ro']
  },
  inventory_anomaly: {
    title: 'Inventory Anomaly Detection Model',
    objective: 'Phát hiện âm kho, xuất kho bất thường, vật tư chậm luân chuyển và sai mapping công trình.',
    target: 'anomaly_score cho từng item_code/movement_id.',
    features: ['movement_type', 'qty', 'ending_qty', 'project_id_missing', 'last_issue_days', 'item_category', 'warehouse_id'],
    metrics: ['anomaly_review_precision', 'false_alert_rate', 'coverage_by_item_category', 'stockout_detection_rate'],
    risks: ['Điều chỉnh kho hợp lệ có thể bị báo bất thường', 'Thiếu dữ liệu phiếu nhập làm âm kho giả', 'Không thay thế kiểm kê thực tế'],
    humanReview: ['Thủ kho xác minh phiếu nhập/xuất', 'Kế toán kho đối chiếu sổ', 'Quản lý công trình xác nhận xuất vật tư']
  },
  duplicate_payment: {
    title: 'Duplicate Payment Detection Model',
    objective: 'Tìm giao dịch có khả năng thanh toán trùng hoặc nhập trùng hóa đơn.',
    target: 'duplicate_candidate_flag theo vendor_id, invoice_no, amount và payment evidence.',
    features: ['vendor_id', 'normalized_invoice_no', 'amount', 'payment_date_gap', 'bank_reference', 'document_status', 'advance_settlement_flag'],
    metrics: ['precision@duplicate_candidate', 'duplicate_recovery_amount', 'false_positive_reason_rate', 'review_turnaround_time'],
    risks: ['Tạm ứng/quyết toán có thể giống duplicate nhưng hợp lệ', 'Số hóa đơn nhập không chuẩn làm miss detection', 'Không kết luận gian lận nếu chưa đối chiếu chứng từ'],
    humanReview: ['Đối chiếu hóa đơn gốc', 'Đối chiếu UNC/phiếu chi', 'Kiểm tra công nợ 331 và tạm ứng/hoàn ứng']
  }
};

export default function ModelCardTemplateLab() {
  const [useCase, setUseCase] = useState<ModelUseCase>('expense_risk');
  const [owner, setOwner] = useState('Data owner / Kế toán trưởng / Project reviewer');
  const [version, setVersion] = useState('model-card-v0.1-sandbox');
  const [copied, setCopied] = useState(false);
  const template = templates[useCase];

  const markdown = useMemo(() => `# Model Card - ${template.title}\n\n## Version\n${version}\n\n## Owner\n${owner}\n\n## Objective\n${template.objective}\n\n## Target\n${template.target}\n\n## Input features\n${template.features.map(item => `- ${item}`).join('\n')}\n\n## Evaluation metrics\n${template.metrics.map(item => `- ${item}`).join('\n')}\n\n## Risks and limitations\n${template.risks.map(item => `- ${item}`).join('\n')}\n\n## Human review requirements\n${template.humanReview.map(item => `- [ ] ${item}`).join('\n')}\n\n## Release rule\nKhông dùng model cho quyết định thật nếu chưa có dataset lineage, data quality report, backtest, drift monitoring và human approval.`, [template, owner, version]);

  const copy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-5 text-slate-100 select-text">
      <section className="bg-gradient-to-r from-purple-950/20 via-[#060a12] to-cyan-950/20 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0"><BrainCircuit className="w-5 h-5" /></div>
          <div><h2 className="text-sm font-black text-white uppercase tracking-widest">Model Card Template Lab</h2><p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">Chuẩn hóa model card cho các mô hình kế toán, kiểm toán và xây dựng: mục tiêu, feature, metric, rủi ro, human review và release rule.</p></div>
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-4">
        <div><FieldLabel>Use case</FieldLabel><select value={useCase} onChange={e => setUseCase(e.target.value as ModelUseCase)} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200">{Object.entries(templates).map(([key, value]) => <option key={key} value={key}>{value.title}</option>)}</select></div>
        <div><FieldLabel>Version</FieldLabel><input value={version} onChange={e => setVersion(e.target.value)} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200" /></div>
        <div><FieldLabel>Owner</FieldLabel><input value={owner} onChange={e => setOwner(e.target.value)} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200" /></div>
      </div>

      <div className="grid md:grid-cols-4 gap-3">
        <Metric title="Features" value={String(template.features.length)} icon={Database} />
        <Metric title="Metrics" value={String(template.metrics.length)} icon={BarChart3} />
        <Metric title="Risks" value={String(template.risks.length)} icon={AlertTriangle} />
        <Metric title="Review gates" value={String(template.humanReview.length)} icon={ShieldCheck} />
      </div>

      <section className="p-4 rounded-xl border border-purple-500/25 bg-purple-950/15"><h3 className="text-[10px] font-black uppercase tracking-wider mb-2 text-white flex items-center gap-2"><Gauge className="w-4 h-4 text-purple-400" />Objective</h3><p className="text-xs text-purple-100 font-semibold leading-relaxed">{template.objective}</p><p className="text-[10.5px] text-slate-400 font-semibold mt-2"><span className="text-slate-300 font-black">Target:</span> {template.target}</p></section>

      <div className="grid md:grid-cols-2 gap-4">
        <ListPanel title="Input features" icon={Database} items={template.features} tone="blue" />
        <ListPanel title="Evaluation metrics" icon={BarChart3} items={template.metrics} tone="emerald" />
        <ListPanel title="Risks / limitations" icon={AlertTriangle} items={template.risks} tone="rose" />
        <ListPanel title="Human review" icon={ClipboardList} items={template.humanReview} tone="amber" />
      </div>

      <section className="p-4 rounded-xl border border-amber-500/25 bg-amber-950/15"><h3 className="text-[10px] font-black uppercase tracking-wider mb-2 text-white flex items-center gap-2"><FileText className="w-4 h-4 text-amber-400" />Release rule</h3><p className="text-xs text-amber-100 font-semibold leading-relaxed">Không dùng model cho quyết định thật nếu chưa có dataset lineage, data quality report, backtest, drift monitoring và human approval.</p></section>

      <button onClick={copy} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-black rounded-xl flex items-center gap-1.5">{copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}{copied ? 'Đã copy' : 'Copy model card'}</button>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) { return <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">{children}</label>; }
function Metric({ title, value, icon: Icon }: { title: string; value: string; icon: React.ComponentType<{ className?: string }> }) { return <div className="p-3 rounded-xl border border-purple-500/20 bg-purple-950/10"><Icon className="w-4 h-4 text-purple-400 mb-2" /><span className="text-[9px] text-slate-500 font-black uppercase block">{title}</span><p className="text-xs font-black text-purple-300 mt-1">{value}</p></div>; }
function ListPanel({ title, items, icon: Icon, tone }: { title: string; items: string[]; icon: React.ComponentType<{ className?: string }>; tone: 'blue' | 'emerald' | 'rose' | 'amber' }) { const colors = { blue: 'text-blue-400 bg-blue-400', emerald: 'text-emerald-400 bg-emerald-400', rose: 'text-rose-400 bg-rose-400', amber: 'text-amber-400 bg-amber-400' }[tone]; const [textColor, dotColor] = colors.split(' '); return <section className="p-4 rounded-xl border border-slate-850 bg-slate-900/35"><h3 className="text-[10px] font-black uppercase tracking-wider mb-3 text-white flex items-center gap-2"><Icon className={`w-4 h-4 ${textColor}`} />{title}</h3><ul className="space-y-2">{items.map(item => <li key={item} className="text-xs text-slate-300 font-semibold leading-relaxed flex gap-2"><span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />{item}</li>)}</ul></section>; }
