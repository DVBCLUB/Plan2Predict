import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, ClipboardList, Copy, FileSpreadsheet, GitCompare, Landmark, Lock, RotateCcw, SearchCheck } from 'lucide-react';

type CloseArea = 'cash' | 'bank' | 'ar' | 'ap' | 'inventory' | 'fixed_assets' | 'tax' | 'project_cost';

type CloseItem = {
  id: CloseArea;
  title: string;
  owner: string;
  goal: string;
  checklist: string[];
  risks: string[];
  evidence: string[];
};

const closeItems: CloseItem[] = [
  {
    id: 'cash',
    title: 'Tiền mặt',
    owner: 'Thủ quỹ / Kế toán thanh toán',
    goal: 'Đảm bảo số dư quỹ khớp sổ, phiếu thu/chi đầy đủ và không âm quỹ bất thường.',
    checklist: ['Đối chiếu sổ quỹ với sổ cái TK 111', 'Kiểm tra phiếu thu/chi thiếu chữ ký', 'Kiểm tra quỹ âm theo ngày', 'Lập biên bản kiểm kê quỹ cuối kỳ'],
    risks: ['Chi tiền mặt vượt quy chế', 'Phiếu chi thiếu chứng từ gốc', 'Quỹ âm hoặc bù trừ không rõ'],
    evidence: ['Sổ quỹ', 'Phiếu thu/chi', 'Biên bản kiểm kê quỹ', 'Bảng đối chiếu TK 111']
  },
  {
    id: 'bank',
    title: 'Ngân hàng',
    owner: 'Kế toán ngân hàng',
    goal: 'Đảm bảo số dư TK 112 khớp sao kê và các khoản treo được giải trình.',
    checklist: ['Import sao kê ngân hàng', 'Đối chiếu sao kê với sổ TK 112', 'Khoanh vùng giao dịch chưa hạch toán', 'Kiểm tra phí ngân hàng/lãi vay/lãi tiền gửi'],
    risks: ['Giao dịch ngân hàng chưa ghi sổ', 'Ghi trùng UNC', 'Sai mã nhà cung cấp/khách hàng'],
    evidence: ['Sao kê ngân hàng', 'Ủy nhiệm chi', 'Giấy báo có/nợ', 'Bảng bank reconciliation']
  },
  {
    id: 'ar',
    title: 'Phải thu khách hàng',
    owner: 'Kế toán công nợ',
    goal: 'Đối chiếu công nợ phải thu, tuổi nợ và khả năng thu hồi.',
    checklist: ['Đối chiếu sổ chi tiết TK 131 với sổ cái', 'Gửi xác nhận công nợ nếu cần', 'Lập aging AR', 'Đánh dấu nợ quá hạn/rủi ro'],
    risks: ['Doanh thu ghi nhận nhưng chưa đủ nghiệm thu', 'Công nợ quá hạn chưa trích lập/dự phòng', 'Bù trừ công nợ không có xác nhận'],
    evidence: ['Biên bản đối chiếu công nợ', 'Aging report', 'Hợp đồng', 'Hóa đơn đầu ra', 'Hồ sơ nghiệm thu']
  },
  {
    id: 'ap',
    title: 'Phải trả nhà cung cấp',
    owner: 'Kế toán công nợ / Mua hàng',
    goal: 'Đảm bảo AP đúng nhà cung cấp, đúng hóa đơn, không thanh toán trùng.',
    checklist: ['Đối chiếu TK 331 với sổ chi tiết NCC', 'Kiểm tra hóa đơn chưa thanh toán', 'Chạy test duplicate payment', 'Đối chiếu PO/GRN/Invoice nếu có'],
    risks: ['Thanh toán trùng', 'Thiếu hóa đơn/chứng từ', 'Ghi sai nhà cung cấp hoặc sai kỳ'],
    evidence: ['Sổ chi tiết 331', 'Hóa đơn đầu vào', 'Biên bản giao nhận', 'PO/Hợp đồng', 'Ủy nhiệm chi']
  },
  {
    id: 'inventory',
    title: 'Hàng tồn kho / Vật tư',
    owner: 'Thủ kho / Kế toán kho',
    goal: 'Đảm bảo tồn kho khớp kiểm kê và xuất dùng đúng công trình/hạng mục.',
    checklist: ['Đối chiếu TK 152/156 với thẻ kho', 'Kiểm kê tồn kho', 'Kiểm tra phiếu xuất thiếu công trình', 'Rà soát vật tư âm kho hoặc chậm luân chuyển'],
    risks: ['Xuất kho không có công trình', 'Âm kho', 'Không lập dự phòng hàng chậm luân chuyển', 'Sai giá xuất kho'],
    evidence: ['Biên bản kiểm kê', 'Phiếu nhập/xuất', 'Thẻ kho', 'Bảng tính giá xuất kho', 'Bảng phân bổ vật tư']
  },
  {
    id: 'fixed_assets',
    title: 'TSCĐ / CCDC',
    owner: 'Kế toán tài sản',
    goal: 'Kiểm soát nguyên giá, khấu hao, phân bổ và tình trạng sử dụng tài sản.',
    checklist: ['Đối chiếu sổ TSCĐ với TK 211/214', 'Kiểm tra tài sản tăng/giảm trong kỳ', 'Tính khấu hao', 'Phân bổ CCDC', 'Kiểm kê tài sản nếu cần'],
    risks: ['Khấu hao sai kỳ', 'Tài sản chưa bàn giao đã khấu hao', 'CCDC phân bổ sai bộ phận/công trình'],
    evidence: ['Thẻ TSCĐ', 'Biên bản bàn giao', 'Bảng khấu hao', 'Biên bản thanh lý', 'Bảng phân bổ CCDC']
  },
  {
    id: 'tax',
    title: 'Thuế GTGT / TNDN / TNCN',
    owner: 'Kế toán thuế',
    goal: 'Đối chiếu thuế đầu vào, đầu ra, chi phí được trừ và nghĩa vụ khấu trừ.',
    checklist: ['Đối chiếu VAT đầu vào/đầu ra', 'Rà hóa đơn sai thông tin', 'Lập danh sách chi phí rủi ro TNDN', 'Kiểm tra TNCN khoán việc/lương', 'Chuẩn bị tờ khai đúng kỳ'],
    risks: ['VAT không đủ điều kiện khấu trừ', 'Chi phí không đủ hồ sơ', 'Không khấu trừ TNCN khi cần', 'Kê khai sai kỳ'],
    evidence: ['Bảng kê hóa đơn', 'Tờ khai thuế', 'Chứng từ thanh toán', 'Bảng chi phí không được trừ', 'Chứng từ khấu trừ TNCN']
  },
  {
    id: 'project_cost',
    title: 'Chi phí công trình / TK 154',
    owner: 'Kế toán giá thành / Kế toán công trình',
    goal: 'Khóa chi phí theo công trình, đối chiếu dự toán - thực tế - nghiệm thu - giá vốn.',
    checklist: ['Đối chiếu chi phí 154 theo từng công trình', 'Kiểm tra chi phí chưa có mã công trình', 'So sánh dự toán và thực tế', 'Đối chiếu nghiệm thu với doanh thu/giá vốn', 'Rà soát công trình lỗ hoặc vượt ngân sách'],
    risks: ['Chi phí chung phân bổ tùy tiện', 'Không kết chuyển 154 sang 632 khi nghiệm thu', 'Lệch dự toán lớn không giải trình', 'Chi phí công trình này ghi vào công trình khác'],
    evidence: ['Bảng tập hợp 154', 'Dự toán/BOQ', 'Biên bản nghiệm thu', 'Hóa đơn', 'Phiếu xuất vật tư', 'Bảng phân bổ chi phí chung']
  }
];

const money = (value: number) => new Intl.NumberFormat('vi-VN').format(Math.round(value));

export default function MonthEndCloseLab() {
  const [activeArea, setActiveArea] = useState<CloseArea>('bank');
  const [bookBalance, setBookBalance] = useState(250000000);
  const [statementBalance, setStatementBalance] = useState(247500000);
  const [unrecordedReceipts, setUnrecordedReceipts] = useState(5000000);
  const [unrecordedPayments, setUnrecordedPayments] = useState(2500000);
  const [copied, setCopied] = useState(false);

  const selected = closeItems.find(item => item.id === activeArea) ?? closeItems[0];
  const adjustedStatement = statementBalance + unrecordedReceipts - unrecordedPayments;
  const variance = bookBalance - adjustedStatement;
  const isMatched = Math.abs(variance) < 1;

  const markdown = useMemo(() => {
    return `# Month-end Close Checklist - ${selected.title}\n\n## Owner\n${selected.owner}\n\n## Mục tiêu\n${selected.goal}\n\n## Checklist\n${selected.checklist.map(item => `- [ ] ${item}`).join('\n')}\n\n## Hồ sơ bằng chứng\n${selected.evidence.map(item => `- ${item}`).join('\n')}\n\n## Rủi ro cần chú ý\n${selected.risks.map(item => `- ${item}`).join('\n')}\n\n## Reconciliation mô phỏng\n- Số dư sổ sách: ${money(bookBalance)} VNĐ\n- Số dư đối chiếu đã điều chỉnh: ${money(adjustedStatement)} VNĐ\n- Chênh lệch: ${money(variance)} VNĐ\n- Trạng thái: ${isMatched ? 'Khớp' : 'Cần kiểm tra chênh lệch'}`;
  }, [selected, bookBalance, adjustedStatement, variance, isMatched]);

  const copy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-6 text-slate-100 select-text pb-12">
      <section className="bg-gradient-to-r from-cyan-950/20 via-[#060a12] to-amber-950/20 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-44 h-44 rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              📅 Month-end Close & Reconciliation Lab
              <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 text-[9px] font-black rounded font-mono">CLOSE · RECON · CHECKLIST</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed max-w-4xl">
              Phòng lab mô phỏng quy trình khóa sổ cuối tháng: đối chiếu tiền, ngân hàng, công nợ, kho, tài sản, thuế và chi phí công trình. Dùng cho học tập và kiểm soát dự án, không thay thế quy trình kế toán chính thức.
            </p>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-4 space-y-2">
          {closeItems.map(item => (
            <button key={item.id} onClick={() => setActiveArea(item.id)} className={`w-full text-left p-3.5 rounded-xl border transition-all ${activeArea === item.id ? 'bg-cyan-500/10 border-cyan-500 ring-1 ring-cyan-500/30' : 'bg-[#060a12] border-slate-850 hover:bg-slate-900'}`}>
              <span className="text-[9px] font-black text-cyan-400 font-mono uppercase">{item.owner}</span>
              <span className="text-xs font-bold text-slate-200 block mt-1">{item.title}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5 leading-snug">{item.goal}</span>
            </button>
          ))}
        </aside>

        <main className="lg:col-span-8 bg-slate-950/50 border border-slate-850 rounded-2xl p-5 space-y-5">
          <div className="flex items-start justify-between gap-3 border-b border-slate-850 pb-4">
            <div>
              <span className="text-[9px] font-black text-cyan-400 font-mono uppercase tracking-widest">{selected.owner}</span>
              <h2 className="text-base font-black text-white mt-1 flex items-center gap-2"><Lock className="w-5 h-5 text-cyan-400" />{selected.title}</h2>
              <p className="text-xs text-slate-400 mt-1 font-semibold">{selected.goal}</p>
            </div>
            <button onClick={copy} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-black rounded-xl flex items-center gap-1.5 shrink-0">
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Đã copy' : 'Copy checklist'}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <ListPanel title="Checklist khóa sổ" icon={ClipboardList} items={selected.checklist} tone="emerald" />
            <ListPanel title="Hồ sơ bằng chứng" icon={SearchCheck} items={selected.evidence} tone="blue" />
          </div>

          <ListPanel title="Rủi ro cần chú ý" icon={AlertTriangle} items={selected.risks} tone="rose" />

          <section className="p-4 rounded-xl border border-cyan-500/25 bg-cyan-950/15 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-white flex items-center gap-2"><GitCompare className="w-4 h-4 text-cyan-400" />Reconciliation simulator</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <NumberInput label="Số dư sổ sách" value={bookBalance} onChange={setBookBalance} />
              <NumberInput label="Số dư sao kê/bảng đối chiếu" value={statementBalance} onChange={setStatementBalance} />
              <NumberInput label="Khoản thu chưa ghi sổ" value={unrecordedReceipts} onChange={setUnrecordedReceipts} />
              <NumberInput label="Khoản chi chưa ghi sổ" value={unrecordedPayments} onChange={setUnrecordedPayments} />
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              <Metric title="Đối chiếu đã điều chỉnh" value={`${money(adjustedStatement)} VNĐ`} tone="blue" />
              <Metric title="Chênh lệch" value={`${money(variance)} VNĐ`} tone={isMatched ? 'emerald' : 'rose'} />
              <Metric title="Trạng thái" value={isMatched ? 'Khớp' : 'Cần rà soát'} tone={isMatched ? 'emerald' : 'amber'} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <div><label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">{label}</label><input type="number" value={value} onChange={e => onChange(Number(e.target.value || 0))} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200" /></div>;
}

function Metric({ title, value, tone }: { title: string; value: string; tone: 'blue' | 'emerald' | 'amber' | 'rose' }) {
  const colors = { blue: 'text-blue-400 border-blue-500/25 bg-blue-950/15', emerald: 'text-emerald-400 border-emerald-500/25 bg-emerald-950/15', amber: 'text-amber-400 border-amber-500/25 bg-amber-950/15', rose: 'text-rose-400 border-rose-500/25 bg-rose-950/15' }[tone];
  return <div className={`p-3 rounded-xl border ${colors}`}><span className="text-[9px] text-slate-500 font-black uppercase block">{title}</span><p className="text-sm font-black mt-1 font-mono">{value}</p></div>;
}

function ListPanel({ title, items, icon: Icon, tone }: { title: string; items: string[]; icon: React.ComponentType<{ className?: string }>; tone: 'emerald' | 'blue' | 'rose' }) {
  const color = tone === 'rose' ? 'text-rose-400' : tone === 'emerald' ? 'text-emerald-400' : 'text-blue-400';
  const dot = tone === 'rose' ? 'bg-rose-400' : tone === 'emerald' ? 'bg-emerald-400' : 'bg-blue-400';
  return <section className="p-4 rounded-xl border border-slate-850 bg-slate-900/35"><h3 className="text-[10px] font-black uppercase tracking-wider mb-3 text-white flex items-center gap-2"><Icon className={`w-4 h-4 ${color}`} />{title}</h3><ul className="space-y-2">{items.map(item => <li key={item} className="text-xs text-slate-300 font-semibold leading-relaxed flex gap-2"><span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />{item}</li>)}</ul></section>;
}
