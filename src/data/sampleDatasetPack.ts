export type SampleDatasetName = 'expenses' | 'invoices' | 'inventory' | 'projects' | 'receivables';

export type SampleColumn = {
  key: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  description: string;
  qualityRule?: string;
};

export type SampleDataset = {
  id: SampleDatasetName;
  title: string;
  purpose: string;
  columns: SampleColumn[];
  rows: Record<string, string | number | boolean>[];
  suggestedTests: string[];
  learningUseCases: string[];
};

export const sampleDatasetPack: SampleDataset[] = [
  {
    id: 'expenses',
    title: 'Expense Ledger Sample',
    purpose: 'Dữ liệu mẫu để học kiểm tra chi phí, chứng từ, thanh toán trùng và phân bổ theo công trình.',
    columns: [
      { key: 'expense_id', label: 'Expense ID', type: 'string', description: 'Mã giao dịch chi phí.' },
      { key: 'project_id', label: 'Project ID', type: 'string', description: 'Mã công trình/hạng mục.', qualityRule: 'Không được trống với chi phí công trình.' },
      { key: 'vendor_id', label: 'Vendor ID', type: 'string', description: 'Mã nhà cung cấp.' },
      { key: 'invoice_no', label: 'Invoice No', type: 'string', description: 'Số hóa đơn/chứng từ.', qualityRule: 'Chuẩn hóa để kiểm tra duplicate.' },
      { key: 'expense_type', label: 'Expense Type', type: 'string', description: 'Nhóm chi phí.' },
      { key: 'amount', label: 'Amount', type: 'number', description: 'Số tiền trước/không gồm VAT tùy bài tập.' },
      { key: 'vat_amount', label: 'VAT Amount', type: 'number', description: 'Số tiền VAT.' },
      { key: 'payment_method', label: 'Payment Method', type: 'string', description: 'Tiền mặt/chuyển khoản/tạm ứng.' },
      { key: 'document_status', label: 'Document Status', type: 'string', description: 'Trạng thái hồ sơ.', qualityRule: 'missing/review phải đưa vào checklist.' }
    ],
    rows: [
      { expense_id: 'EXP-001', project_id: 'PRJ-A', vendor_id: 'V001', invoice_no: 'HD001', expense_type: 'Vật tư', amount: 12500000, vat_amount: 1250000, payment_method: 'bank', document_status: 'complete' },
      { expense_id: 'EXP-002', project_id: '', vendor_id: 'V002', invoice_no: 'HD002', expense_type: 'Dầu', amount: 7200000, vat_amount: 720000, payment_method: 'cash_advance', document_status: 'review' },
      { expense_id: 'EXP-003', project_id: 'PRJ-A', vendor_id: 'V001', invoice_no: 'HD001', expense_type: 'Vật tư', amount: 12500000, vat_amount: 1250000, payment_method: 'bank', document_status: 'complete' },
      { expense_id: 'EXP-004', project_id: 'PRJ-B', vendor_id: 'V003', invoice_no: 'PC004', expense_type: 'Nhân công khoán', amount: 27500000, vat_amount: 0, payment_method: 'cash', document_status: 'missing' },
      { expense_id: 'EXP-005', project_id: 'PRJ-C', vendor_id: 'V004', invoice_no: 'HD005', expense_type: 'Máy thi công', amount: -3500000, vat_amount: 0, payment_method: 'bank', document_status: 'review' }
    ],
    suggestedTests: ['missing_project_id', 'duplicate_vendor_invoice_amount', 'missing_document_status', 'negative_amount_without_refund_type'],
    learningUseCases: ['Expense Compliance Checker', 'Audit duplicate payment', 'Project cost allocation', 'Data Quality Pipeline']
  },
  {
    id: 'invoices',
    title: 'Invoice VAT Sample',
    purpose: 'Dữ liệu mẫu để học VAT mismatch, hóa đơn nhiều thuế suất và kiểm tra kỳ kê khai.',
    columns: [
      { key: 'invoice_id', label: 'Invoice ID', type: 'string', description: 'Mã hóa đơn.' },
      { key: 'invoice_no', label: 'Invoice No', type: 'string', description: 'Số hóa đơn.' },
      { key: 'vendor_tax_code', label: 'Vendor Tax Code', type: 'string', description: 'MST nhà cung cấp.', qualityRule: 'Không được trống với hóa đơn VAT.' },
      { key: 'invoice_date', label: 'Invoice Date', type: 'date', description: 'Ngày hóa đơn.' },
      { key: 'net_amount', label: 'Net Amount', type: 'number', description: 'Giá trị chưa VAT.' },
      { key: 'vat_rate', label: 'VAT Rate', type: 'number', description: 'Thuế suất VAT.' },
      { key: 'vat_amount', label: 'VAT Amount', type: 'number', description: 'Tiền VAT.', qualityRule: 'So sánh net_amount x vat_rate.' },
      { key: 'declared_period', label: 'Declared Period', type: 'string', description: 'Kỳ kê khai.' }
    ],
    rows: [
      { invoice_id: 'INV-001', invoice_no: '000001', vendor_tax_code: '0310000001', invoice_date: '2026-01-05', net_amount: 10000000, vat_rate: 0.1, vat_amount: 1000000, declared_period: '2026-01' },
      { invoice_id: 'INV-002', invoice_no: '000002', vendor_tax_code: '', invoice_date: '2026-01-08', net_amount: 8000000, vat_rate: 0.08, vat_amount: 640000, declared_period: '2026-01' },
      { invoice_id: 'INV-003', invoice_no: '000003', vendor_tax_code: '0310000003', invoice_date: '2026-01-12', net_amount: 15000000, vat_rate: 0.1, vat_amount: 1450000, declared_period: '2026-01' },
      { invoice_id: 'INV-004', invoice_no: '000004', vendor_tax_code: '0310000004', invoice_date: '2026-02-02', net_amount: 5000000, vat_rate: 0, vat_amount: 0, declared_period: '2026-02' }
    ],
    suggestedTests: ['missing_vendor_tax_code', 'vat_mismatch_threshold', 'invoice_date_vs_declared_period', 'zero_vat_review'],
    learningUseCases: ['VAT input deduction', 'Invoice quality review', 'Tax accounting bridge']
  },
  {
    id: 'inventory',
    title: 'Inventory Movement Sample',
    purpose: 'Dữ liệu mẫu để học nhập xuất tồn, âm kho, xuất kho thiếu mã công trình và vật tư chậm luân chuyển.',
    columns: [
      { key: 'movement_id', label: 'Movement ID', type: 'string', description: 'Mã dòng nhập/xuất kho.' },
      { key: 'item_code', label: 'Item Code', type: 'string', description: 'Mã vật tư.' },
      { key: 'movement_type', label: 'Movement Type', type: 'string', description: 'IN/OUT/ADJUST.' },
      { key: 'project_id', label: 'Project ID', type: 'string', description: 'Mã công trình khi xuất kho.', qualityRule: 'OUT cho công trình không được trống project_id.' },
      { key: 'qty', label: 'Quantity', type: 'number', description: 'Số lượng giao dịch.' },
      { key: 'ending_qty', label: 'Ending Quantity', type: 'number', description: 'Tồn sau giao dịch.', qualityRule: 'Không âm nếu không có phê duyệt.' },
      { key: 'last_issue_days', label: 'Last Issue Days', type: 'number', description: 'Số ngày từ lần xuất gần nhất.' }
    ],
    rows: [
      { movement_id: 'MOV-001', item_code: 'STEEL-D10', movement_type: 'IN', project_id: '', qty: 100, ending_qty: 100, last_issue_days: 10 },
      { movement_id: 'MOV-002', item_code: 'STEEL-D10', movement_type: 'OUT', project_id: 'PRJ-A', qty: -60, ending_qty: 40, last_issue_days: 1 },
      { movement_id: 'MOV-003', item_code: 'CEMENT-PC40', movement_type: 'OUT', project_id: '', qty: -50, ending_qty: 25, last_issue_days: 3 },
      { movement_id: 'MOV-004', item_code: 'BOLT-M12', movement_type: 'OUT', project_id: 'PRJ-B', qty: -300, ending_qty: -20, last_issue_days: 2 },
      { movement_id: 'MOV-005', item_code: 'PAINT-WHITE', movement_type: 'IN', project_id: '', qty: 20, ending_qty: 20, last_issue_days: 210 }
    ],
    suggestedTests: ['negative_stock', 'out_without_project', 'slow_moving_inventory', 'movement_type_qty_sign'],
    learningUseCases: ['Inventory data quality', 'Construction 154 control', 'Warehouse dashboard']
  },
  {
    id: 'projects',
    title: 'Project Cost Sample',
    purpose: 'Dữ liệu mẫu để học vượt dự toán, treo 154, nghiệm thu và kết chuyển giá vốn.',
    columns: [
      { key: 'project_id', label: 'Project ID', type: 'string', description: 'Mã công trình.' },
      { key: 'project_name', label: 'Project Name', type: 'string', description: 'Tên công trình.' },
      { key: 'budget_amount', label: 'Budget Amount', type: 'number', description: 'Dự toán/budget baseline.', qualityRule: 'Không trống trước khi phân tích variance.' },
      { key: 'actual_cost', label: 'Actual Cost', type: 'number', description: 'Chi phí thực tế.' },
      { key: 'accepted_revenue', label: 'Accepted Revenue', type: 'number', description: 'Doanh thu/giá trị nghiệm thu.' },
      { key: 'wip_age_days', label: 'WIP Age Days', type: 'number', description: 'Số ngày treo chi phí dở dang.' }
    ],
    rows: [
      { project_id: 'PRJ-A', project_name: 'Công trình A', budget_amount: 500000000, actual_cost: 545000000, accepted_revenue: 620000000, wip_age_days: 35 },
      { project_id: 'PRJ-B', project_name: 'Công trình B', budget_amount: 300000000, actual_cost: 365000000, accepted_revenue: 0, wip_age_days: 140 },
      { project_id: 'PRJ-C', project_name: 'Công trình C', budget_amount: 0, actual_cost: 120000000, accepted_revenue: 150000000, wip_age_days: 20 }
    ],
    suggestedTests: ['missing_budget', 'cost_overrun_10_percent', 'wip_age_threshold', 'accepted_revenue_vs_cost_close'],
    learningUseCases: ['Project Overrun Checker', 'Month-end close', '154 to 632 bridge']
  },
  {
    id: 'receivables',
    title: 'Accounts Receivable Aging Sample',
    purpose: 'Dữ liệu mẫu để học tuổi nợ, xác nhận công nợ, tiền về chưa đối trừ và rủi ro thu hồi.',
    columns: [
      { key: 'ar_id', label: 'AR ID', type: 'string', description: 'Mã công nợ phải thu.' },
      { key: 'customer_id', label: 'Customer ID', type: 'string', description: 'Mã khách hàng.' },
      { key: 'invoice_no', label: 'Invoice No', type: 'string', description: 'Số hóa đơn.' },
      { key: 'outstanding_amount', label: 'Outstanding Amount', type: 'number', description: 'Số dư còn phải thu.' },
      { key: 'days_overdue', label: 'Days Overdue', type: 'number', description: 'Số ngày quá hạn.', qualityRule: 'Trên 90 ngày cần review.' },
      { key: 'confirmation_status', label: 'Confirmation Status', type: 'string', description: 'Trạng thái xác nhận công nợ.' },
      { key: 'bank_receipt_matched', label: 'Bank Receipt Matched', type: 'boolean', description: 'Đã đối trừ tiền về với hóa đơn chưa.' }
    ],
    rows: [
      { ar_id: 'AR-001', customer_id: 'C001', invoice_no: 'INV-A01', outstanding_amount: 90000000, days_overdue: 15, confirmation_status: 'confirmed', bank_receipt_matched: true },
      { ar_id: 'AR-002', customer_id: 'C002', invoice_no: 'INV-B01', outstanding_amount: 125000000, days_overdue: 95, confirmation_status: 'missing', bank_receipt_matched: false },
      { ar_id: 'AR-003', customer_id: 'C003', invoice_no: 'INV-C01', outstanding_amount: 45000000, days_overdue: 45, confirmation_status: 'pending', bank_receipt_matched: false }
    ],
    suggestedTests: ['aging_over_90_days', 'missing_confirmation', 'unmatched_bank_receipt', 'large_outstanding_review'],
    learningUseCases: ['AR aging dashboard', 'Audit confirmation', 'Cash collection planning']
  }
];

export function getSampleDataset(id: SampleDatasetName) {
  return sampleDatasetPack.find(dataset => dataset.id === id) ?? sampleDatasetPack[0];
}

export function toCsv(dataset: SampleDataset) {
  const headers = dataset.columns.map(column => column.key);
  const rows = dataset.rows.map(row => headers.map(header => JSON.stringify(row[header] ?? '')).join(','));
  return [headers.join(','), ...rows].join('\n');
}
