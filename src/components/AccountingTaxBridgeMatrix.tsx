import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Copy, FileText, GitCompare, ReceiptText, Scale, Table2 } from 'lucide-react';

type ExpenseKey = 'construction_material' | 'fuel' | 'labor_contract' | 'subcontractor' | 'office_admin' | 'entertainment' | 'foreign_service';

type ExpenseRule = {
  id: ExpenseKey;
  title: string;
  accountingTreatment: string;
  taxTreatment: string;
  vasAccounts: string[];
  taxRisks: string[];
  requiredDocs: string[];
  controls: string[];
  example: string;
};

const expenseRules: ExpenseRule[] = [
  {
    id: 'construction_material',
    title: 'Vật tư công trình',
    accountingTreatment: 'Ghi nhận vào kho/vật tư hoặc tập hợp trực tiếp vào chi phí công trình, sau đó theo dõi theo mã công trình/hạng mục.',
    taxTreatment: 'Chi phí có thể được xem xét là chi phí được trừ và VAT đầu vào có thể khấu trừ nếu đáp ứng điều kiện hóa đơn, chứng từ và phục vụ SXKD chịu thuế.',
    vasAccounts: ['152', '154', '621', '1331', '331/111/112'],
    taxRisks: ['Thiếu phiếu nhập/xuất kho', 'Không gắn mã công trình', 'Hóa đơn sai thông tin', 'Thanh toán không có dấu vết phù hợp', 'Vật tư xuất vượt định mức không giải trình'],
    requiredDocs: ['Hợp đồng/đơn đặt hàng', 'Hóa đơn đầu vào', 'Biên bản giao nhận', 'Phiếu nhập kho', 'Phiếu xuất kho theo công trình', 'Chứng từ thanh toán'],
    controls: ['Đối chiếu PO/Invoice/GRN', 'So sánh định mức/dự toán', 'Kiểm tra vật tư âm kho', 'Đối chiếu 154 theo công trình'],
    example: 'Mua thép cho Công trình A: Nợ 152/154, Nợ 1331, Có 331; khi xuất dùng phải gắn mã Công trình A.'
  },
  {
    id: 'fuel',
    title: 'Xăng dầu / nhiên liệu máy thi công',
    accountingTreatment: 'Ghi nhận chi phí nhiên liệu hoặc vật tư phụ theo đối tượng sử dụng: xe, máy, công trình hoặc bộ phận.',
    taxTreatment: 'Cần chứng minh nhiên liệu phục vụ hoạt động SXKD, có hóa đơn/chứng từ và bảng kê sử dụng hợp lý.',
    vasAccounts: ['152', '154', '623', '627', '642', '1331', '111/112/331'],
    taxRisks: ['Hóa đơn xăng dầu không gắn đối tượng sử dụng', 'Thiếu nhật trình xe/máy', 'Định mức tiêu hao bất thường', 'Chi tiền mặt thiếu phê duyệt'],
    requiredDocs: ['Hóa đơn xăng dầu', 'Lệnh điều xe/máy', 'Nhật trình xe/máy', 'Bảng kê nhiên liệu', 'Định mức hoặc giải trình tiêu hao', 'Chứng từ thanh toán'],
    controls: ['So sánh nhiên liệu/ca máy', 'Rà chi phí theo công trình', 'Kiểm tra ngày hóa đơn với nhật trình', 'Phê duyệt người quản lý công trường'],
    example: 'Đổ dầu cho máy thi công Công trình B: tập hợp vào 623/154 nếu đủ nhật trình và định mức.'
  },
  {
    id: 'labor_contract',
    title: 'Nhân công khoán việc / cá nhân thuê ngoài',
    accountingTreatment: 'Tập hợp chi phí nhân công theo công trình hoặc bộ phận, tùy bản chất lao động và hợp đồng.',
    taxTreatment: 'Cần xem xét hồ sơ cá nhân, hợp đồng khoán, nghiệm thu, chứng từ chi trả và nghĩa vụ khấu trừ TNCN nếu phát sinh.',
    vasAccounts: ['154', '622', '334/338 nếu là lao động', '111/112', '3335 nếu khấu trừ'],
    taxRisks: ['Không khấu trừ TNCN khi thuộc diện phải khấu trừ', 'Thiếu nghiệm thu khối lượng', 'Gross-up không thống nhất hồ sơ', 'Nhầm bản chất lao động với dịch vụ khoán'],
    requiredDocs: ['Hợp đồng giao khoán', 'CCCD/MST cá nhân nếu có', 'Bảng xác nhận công việc', 'Biên bản nghiệm thu', 'Chứng từ khấu trừ thuế nếu có', 'Phiếu chi/ủy nhiệm chi'],
    controls: ['Đối chiếu danh sách cá nhân', 'Kiểm tra chữ ký/ngày công', 'Kiểm tra ngưỡng và nghĩa vụ khấu trừ', 'So sánh với dự toán nhân công'],
    example: 'Khoán tháo dỡ cho nhóm cá nhân: cần hợp đồng khoán, nghiệm thu và xử lý TNCN nhất quán với bảng thanh toán.'
  },
  {
    id: 'subcontractor',
    title: 'Nhà thầu phụ xây dựng',
    accountingTreatment: 'Ghi nhận chi phí thầu phụ theo công trình/hạng mục, thường tập hợp vào 154 và kết chuyển khi nghiệm thu.',
    taxTreatment: 'Cần hợp đồng, nghiệm thu, hóa đơn và điều kiện thanh toán để xem xét chi phí được trừ/VAT khấu trừ.',
    vasAccounts: ['154', '627', '632 khi kết chuyển', '1331', '331/112'],
    taxRisks: ['Nghiệm thu không khớp hóa đơn', 'Chi phí không gắn hạng mục', 'Hóa đơn trước/sau kỳ nghiệm thu bất thường', 'Không có hồ sơ năng lực/phê duyệt thầu phụ'],
    requiredDocs: ['Hợp đồng thầu phụ', 'Phụ lục/BOQ', 'Biên bản nghiệm thu', 'Hóa đơn', 'Hồ sơ thanh toán', 'Chứng từ chuyển khoản'],
    controls: ['Đối chiếu hợp đồng - nghiệm thu - hóa đơn', 'Kiểm soát phát sinh ngoài hợp đồng', 'So sánh dự toán/thực tế', 'Đối chiếu công nợ 331'],
    example: 'Nghiệm thu hạng mục thầu phụ: Nợ 154, Nợ 1331, Có 331; khi bàn giao công trình kết chuyển giá vốn phù hợp.'
  },
  {
    id: 'office_admin',
    title: 'Chi phí hành chính văn phòng',
    accountingTreatment: 'Ghi nhận vào chi phí quản lý doanh nghiệp hoặc phân bổ nếu phục vụ nhiều bộ phận/công trình.',
    taxTreatment: 'Cần chứng minh phục vụ SXKD, có hóa đơn/chứng từ và phê duyệt nội bộ.',
    vasAccounts: ['642', '1331', '111/112/331'],
    taxRisks: ['Chi phí cá nhân hóa', 'Thiếu đề nghị/phê duyệt', 'Hóa đơn không phù hợp nội dung', 'Không có quy chế chi tiêu'],
    requiredDocs: ['Đề nghị thanh toán', 'Hóa đơn/chứng từ', 'Phê duyệt', 'Biên bản giao nhận nếu có', 'Chứng từ thanh toán'],
    controls: ['Soát nội dung hóa đơn', 'Kiểm tra hạn mức/quy chế', 'Phân loại đúng phòng ban', 'Theo dõi ngân sách HCNS'],
    example: 'Mua văn phòng phẩm: Nợ 642, Nợ 1331, Có 111/112/331 nếu đủ hóa đơn và phục vụ hoạt động công ty.'
  },
  {
    id: 'entertainment',
    title: 'Tiếp khách / đối ngoại',
    accountingTreatment: 'Ghi nhận chi phí bán hàng/quản lý tùy mục đích, cần mô tả rõ đối tượng và mục tiêu công việc.',
    taxTreatment: 'Rủi ro cao nếu không chứng minh liên quan SXKD hoặc thiếu thông tin người/đơn vị tiếp khách.',
    vasAccounts: ['641', '642', '1331', '111/112/331'],
    taxRisks: ['Không nêu mục đích tiếp khách', 'Không có danh sách/đối tượng làm việc', 'Chi phí cá nhân', 'Hóa đơn không phù hợp'],
    requiredDocs: ['Hóa đơn', 'Đề nghị thanh toán', 'Nội dung/mục đích tiếp khách', 'Danh sách hoặc đối tượng làm việc', 'Phê duyệt', 'Chứng từ thanh toán'],
    controls: ['Kiểm tra mục đích SXKD', 'So sánh hạn mức nội bộ', 'Kiểm tra ngày/địa điểm/hóa đơn', 'Phê duyệt cấp quản lý'],
    example: 'Tiếp khách phục vụ đàm phán hợp đồng: cần ghi rõ khách nào, dự án/hợp đồng nào, ai phê duyệt.'
  },
  {
    id: 'foreign_service',
    title: 'Dịch vụ nước ngoài / cloud / software',
    accountingTreatment: 'Ghi nhận chi phí dịch vụ, phần mềm hoặc công cụ thuê ngoài tùy bản chất và thời gian sử dụng.',
    taxTreatment: 'Cần xem xét thuế nhà thầu, điều khoản gross-up, invoice nước ngoài và chứng từ thanh toán quốc tế.',
    vasAccounts: ['242/642/627', '331/112', '333 nếu có nghĩa vụ thuế liên quan'],
    taxRisks: ['Bỏ sót thuế nhà thầu', 'Nhầm bản quyền với dịch vụ', 'Không có hợp đồng/terms', 'Không có chứng từ thanh toán hợp lệ'],
    requiredDocs: ['Hợp đồng/terms of service', 'Invoice nước ngoài', 'Chứng từ thanh toán', 'Biên bản nghiệm thu hoặc xác nhận sử dụng', 'Tờ khai/biên lai FCT nếu phát sinh'],
    controls: ['Phân tích bản chất dịch vụ', 'Kiểm tra nơi sử dụng dịch vụ', 'Đối chiếu điều khoản thuế', 'Theo dõi chi phí định kỳ'],
    example: 'Mua dịch vụ cloud từ nước ngoài: cần xem bản chất dịch vụ và nghĩa vụ FCT trước khi thanh toán/ghi nhận.'
  }
];

const money = (value: number) => new Intl.NumberFormat('vi-VN').format(Math.round(value));

export default function AccountingTaxBridgeMatrix() {
  const [selectedId, setSelectedId] = useState<ExpenseKey>('construction_material');
  const [amount, setAmount] = useState(50000000);
  const [vatRate, setVatRate] = useState(8);
  const [copied, setCopied] = useState(false);
  const selected = expenseRules.find(rule => rule.id === selectedId) ?? expenseRules[0];
  const vat = Math.round(amount * vatRate / 100);
  const total = amount + vat;

  const markdown = useMemo(() => {
    return `# Accounting - Tax Bridge Matrix\n\n## Khoản chi\n${selected.title}\n\n## Kế toán\n${selected.accountingTreatment}\n\n## Thuế\n${selected.taxTreatment}\n\n## Tài khoản VAS gợi ý\n${selected.vasAccounts.map(acc => `- ${acc}`).join('\n')}\n\n## Hồ sơ cần có\n${selected.requiredDocs.map(doc => `- ${doc}`).join('\n')}\n\n## Rủi ro thuế/kế toán\n${selected.taxRisks.map(risk => `- ${risk}`).join('\n')}\n\n## Kiểm soát đề xuất\n${selected.controls.map(control => `- ${control}`).join('\n')}\n\n## Ví dụ\n${selected.example}\n\n## Tính tiền mô phỏng\n- Giá chưa thuế: ${money(amount)} VNĐ\n- VAT ${vatRate}%: ${money(vat)} VNĐ\n- Tổng thanh toán: ${money(total)} VNĐ\n\n> Ghi chú: Ma trận phục vụ học tập. Khi áp dụng hồ sơ thật cần đối chiếu chuẩn mực, chính sách kế toán và quy định thuế hiện hành.`;
  }, [selected, amount, vatRate, vat, total]);

  const copy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-6 text-slate-100 select-text pb-12">
      <section className="bg-gradient-to-r from-emerald-950/20 via-[#060a12] to-blue-950/20 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-44 h-44 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0"><GitCompare className="w-6 h-6" /></div>
          <div>
            <h1 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">🔁 Accounting - Tax Bridge Matrix <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[9px] font-black rounded font-mono">VAS · TAX · DOCS</span></h1>
            <p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed max-w-4xl">Ma trận nối giữa cách hạch toán, xử lý thuế, tài khoản VAS, hồ sơ cần có và rủi ro kiểm soát cho từng khoản chi thường gặp.</p>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-4 space-y-2">
          {expenseRules.map(rule => (
            <button key={rule.id} onClick={() => setSelectedId(rule.id)} className={`w-full text-left p-3.5 rounded-xl border transition-all ${selected.id === rule.id ? 'bg-emerald-500/10 border-emerald-500 ring-1 ring-emerald-500/30' : 'bg-[#060a12] border-slate-850 hover:bg-slate-900'}`}>
              <span className="text-[9px] font-black text-emerald-400 font-mono uppercase">Bridge Card</span>
              <span className="text-xs font-bold text-slate-200 block mt-1">{rule.title}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5 leading-snug line-clamp-2">{rule.taxTreatment}</span>
            </button>
          ))}
        </aside>

        <main className="lg:col-span-8 bg-slate-950/50 border border-slate-850 rounded-2xl p-5 space-y-5">
          <div className="flex items-start justify-between gap-3 border-b border-slate-850 pb-4">
            <div>
              <span className="text-[9px] font-black text-emerald-400 font-mono uppercase tracking-widest">Accounting · Tax · Documentation</span>
              <h2 className="text-base font-black text-white mt-1 flex items-center gap-2"><Table2 className="w-5 h-5 text-emerald-400" />{selected.title}</h2>
              <p className="text-xs text-slate-400 mt-1 font-semibold">{selected.example}</p>
            </div>
            <button onClick={copy} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-black rounded-xl flex items-center gap-1.5 shrink-0">
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Đã copy' : 'Copy matrix'}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Panel title="Kế toán" icon={FileText} tone="blue">{selected.accountingTreatment}</Panel>
            <Panel title="Thuế" icon={Scale} tone="emerald">{selected.taxTreatment}</Panel>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <Metric title="Giá chưa thuế" value={`${money(amount)} VNĐ`} tone="blue" />
            <Metric title={`VAT ${vatRate}%`} value={`${money(vat)} VNĐ`} tone="emerald" />
            <Metric title="Tổng thanh toán" value={`${money(total)} VNĐ`} tone="amber" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Số tiền chưa thuế</FieldLabel>
              <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value || 0))} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200" />
            </div>
            <div>
              <FieldLabel>VAT (%)</FieldLabel>
              <input type="number" value={vatRate} onChange={e => setVatRate(Number(e.target.value || 0))} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <ListPanel title="Tài khoản VAS gợi ý" items={selected.vasAccounts} tone="blue" />
            <ListPanel title="Hồ sơ cần có" items={selected.requiredDocs} tone="emerald" />
            <ListPanel title="Rủi ro thuế/kế toán" items={selected.taxRisks} tone="rose" />
            <ListPanel title="Kiểm soát đề xuất" items={selected.controls} tone="amber" />
          </div>

          <Panel title="Cảnh báo sử dụng" icon={AlertTriangle} tone="rose">Đây là ma trận học tập/sandbox. Không dùng thay thế tư vấn thuế, chuẩn mực kế toán hoặc phán xét kiểm toán. Hồ sơ thật cần kiểm tra quy định hiện hành và chính sách nội bộ.</Panel>
        </main>
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">{children}</label>;
}

function Panel({ title, children, icon: Icon, tone }: { title: string; children: React.ReactNode; icon: React.ComponentType<{ className?: string }>; tone: 'blue' | 'emerald' | 'rose' | 'amber' }) {
  const colors = { blue: 'border-blue-500/25 bg-blue-950/15 text-blue-200', emerald: 'border-emerald-500/25 bg-emerald-950/15 text-emerald-200', rose: 'border-rose-500/25 bg-rose-950/15 text-rose-200', amber: 'border-amber-500/25 bg-amber-950/15 text-amber-200' }[tone];
  return <section className={`p-4 rounded-xl border ${colors}`}><h3 className="text-[10px] font-black uppercase tracking-wider mb-2 text-white flex items-center gap-2"><Icon className="w-4 h-4" />{title}</h3><div className="text-xs font-semibold leading-relaxed">{children}</div></section>;
}

function Metric({ title, value, tone }: { title: string; value: string; tone: 'blue' | 'emerald' | 'amber' }) {
  const colors = { blue: 'text-blue-400 border-blue-500/25 bg-blue-950/15', emerald: 'text-emerald-400 border-emerald-500/25 bg-emerald-950/15', amber: 'text-amber-400 border-amber-500/25 bg-amber-950/15' }[tone];
  return <div className={`p-3 rounded-xl border ${colors}`}><span className="text-[9px] text-slate-500 font-black uppercase block">{title}</span><p className="text-sm font-black mt-1 font-mono">{value}</p></div>;
}

function ListPanel({ title, items, tone }: { title: string; items: string[]; tone: 'blue' | 'emerald' | 'rose' | 'amber' }) {
  const colors = { blue: 'bg-blue-400', emerald: 'bg-emerald-400', rose: 'bg-rose-400', amber: 'bg-amber-400' }[tone];
  return <section className="p-4 rounded-xl border border-slate-850 bg-slate-900/35"><h3 className="text-[10px] font-black uppercase tracking-wider mb-3 text-white">{title}</h3><ul className="space-y-2">{items.map(item => <li key={item} className="text-xs text-slate-300 font-semibold leading-relaxed flex gap-2"><span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${colors}`} />{item}</li>)}</ul></section>;
}
