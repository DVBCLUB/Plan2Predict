import React, { useMemo, useState } from 'react';
import { AlertTriangle, BookOpen, CheckCircle2, ClipboardList, Copy, FileSearch, Landmark, ReceiptText, Scale, Search, ShieldCheck } from 'lucide-react';

type RuleArea = 'vat' | 'cit' | 'pit' | 'fct' | 'construction' | 'audit';

type RuleCard = {
  id: string;
  area: RuleArea;
  title: string;
  purpose: string;
  keyIdea: string;
  documents: string[];
  warning: string[];
  simulation: string;
  sourceNote: string;
};

const rules: RuleCard[] = [
  {
    id: 'vat-input-deduction',
    area: 'vat',
    title: 'VAT đầu vào: điều kiện khấu trừ cơ bản',
    purpose: 'Giúp người học kiểm tra một hóa đơn đầu vào có đủ điều kiện đưa vào danh sách khấu trừ hay cần treo kiểm tra.',
    keyIdea: 'Cần có hóa đơn/chứng từ hợp lệ, hàng hóa dịch vụ phục vụ hoạt động chịu thuế và chứng từ thanh toán phù hợp theo ngưỡng/điều kiện áp dụng.',
    documents: ['Hóa đơn đầu vào', 'Hợp đồng/đơn đặt hàng nếu có', 'Biên bản giao nhận/nghiệm thu', 'Chứng từ thanh toán', 'Phiếu nhập/xuất kho nếu là vật tư'],
    warning: ['Hóa đơn sai thông tin người mua/người bán', 'Thanh toán tiền mặt cho khoản cần kiểm soát chuyển khoản', 'Hàng hóa dịch vụ không phục vụ hoạt động SXKD chịu thuế', 'Kê khai sai kỳ hoặc bỏ sót hóa đơn'],
    simulation: 'Expense Checker có thể hỏi: có hóa đơn không, hình thức thanh toán, loại nhà cung cấp, loại chi phí và số tiền.',
    sourceNote: 'Source-linked card: khi dùng thật cần đối chiếu Luật thuế GTGT, nghị định, thông tư và hướng dẫn đang có hiệu lực.'
  },
  {
    id: 'cit-deductible-expense',
    area: 'cit',
    title: 'TNDN: chi phí được trừ / không được trừ',
    purpose: 'Chuẩn hóa tư duy kiểm tra chi phí trước khi đưa vào chi phí tính thuế TNDN.',
    keyIdea: 'Một khoản chi thường cần liên quan hoạt động SXKD, có hóa đơn/chứng từ hợp pháp và có chứng từ thanh toán phù hợp nếu thuộc diện phải có.',
    documents: ['Đề nghị thanh toán', 'Hóa đơn/chứng từ', 'Hợp đồng hoặc quyết định/phê duyệt', 'Biên bản nghiệm thu/giao nhận', 'Chứng từ thanh toán', 'Giải trình mục đích SXKD nếu cần'],
    warning: ['Chi không phục vụ SXKD', 'Không đủ hồ sơ nghiệm thu', 'Chi phí cá nhân hóa', 'Hồ sơ thanh toán không nhất quán với hợp đồng', 'Chi phí bị khống chế hoặc cần điều kiện riêng'],
    simulation: 'Document Checklist Generator có thể sinh checklist theo loại chi phí và đánh dấu rủi ro TNDN.',
    sourceNote: 'Source-linked card: cần đối chiếu Luật thuế TNDN, văn bản hướng dẫn và chính sách từng thời kỳ.'
  },
  {
    id: 'pit-contract-labor',
    area: 'pit',
    title: 'TNCN: khoán việc / cá nhân thuê ngoài',
    purpose: 'Hỗ trợ người học nhận diện tình huống phải xem xét khấu trừ, hồ sơ cá nhân và gross-up.',
    keyIdea: 'Chi trả cho cá nhân không ký HĐLĐ hoặc khoán việc cần kiểm tra bản chất khoản chi, hồ sơ cá nhân, ngưỡng khấu trừ và chứng từ chi trả.',
    documents: ['Hợp đồng giao khoán', 'CCCD/MST cá nhân nếu có', 'Bảng xác nhận khối lượng/công việc', 'Biên bản nghiệm thu', 'Chứng từ khấu trừ thuế nếu phát sinh', 'Phiếu chi/ủy nhiệm chi'],
    warning: ['Không khấu trừ khi thuộc diện phải khấu trừ', 'Gross-up không thống nhất giữa hợp đồng và bảng thanh toán', 'Thiếu chứng minh công việc thực hiện', 'Nhầm quan hệ lao động với khoán việc'],
    simulation: 'Gross-up Calculator mô phỏng net-to-gross khi công ty muốn cá nhân nhận đủ tiền net.',
    sourceNote: 'Source-linked card: cần đối chiếu Luật thuế TNCN, thông tư hướng dẫn và quy định lao động liên quan.'
  },
  {
    id: 'fct-foreign-contractor',
    area: 'fct',
    title: 'Thuế nhà thầu FCT: dịch vụ nước ngoài',
    purpose: 'Giúp phân biệt khi nào khoản thanh toán cho nhà cung cấp nước ngoài cần xem xét thuế nhà thầu.',
    keyIdea: 'Cần kiểm tra bên nhận tiền, nơi phát sinh/tiêu dùng dịch vụ, điều khoản hợp đồng, hóa đơn nước ngoài và nghĩa vụ kê khai khấu trừ tại Việt Nam nếu có.',
    documents: ['Hợp đồng với nhà cung cấp nước ngoài', 'Invoice nước ngoài', 'Chứng từ thanh toán quốc tế', 'Biên bản nghiệm thu dịch vụ', 'Tờ khai/biên lai nộp FCT nếu phát sinh'],
    warning: ['Nhầm dịch vụ cloud/software với mua hàng hóa thông thường', 'Không xác định đúng bản chất bản quyền/dịch vụ', 'Không gross-up khi hợp đồng quy định bên Việt Nam chịu thuế', 'Thiếu hồ sơ kê khai'],
    simulation: 'Rule card này có thể dùng trong Prompt Builder để yêu cầu AI lập checklist FCT trước khi thanh toán.',
    sourceNote: 'Source-linked card: cần đối chiếu quy định thuế nhà thầu hiện hành và hiệp định tránh đánh thuế hai lần nếu có.'
  },
  {
    id: 'construction-154-control',
    area: 'construction',
    title: 'Xây dựng: kiểm soát TK 154 theo công trình',
    purpose: 'Chuẩn hóa cách tập hợp chi phí công trình và giảm rủi ro lệch dự toán/giá vốn.',
    keyIdea: 'Chi phí vật tư, nhân công, máy thi công và chi phí chung cần gắn mã công trình/hạng mục, có chứng từ nghiệm thu và nguyên tắc phân bổ rõ.',
    documents: ['Dự toán/BOQ', 'Phiếu xuất kho theo công trình', 'Bảng chấm công/nhật trình máy', 'Biên bản nghiệm thu', 'Bảng phân bổ chi phí chung', 'Bảng tập hợp chi phí 154'],
    warning: ['Chi phí không có mã công trình', 'Phân bổ chi phí chung tùy tiện', 'Không kết chuyển 154 sang 632 khi nghiệm thu', 'Ghi nhầm công trình', 'Treo 154 quá lâu không giải trình'],
    simulation: 'Month-end Close Lab và Project Overrun Checker dùng rule này để kiểm tra công trình vượt ngân sách.',
    sourceNote: 'Source-linked card: cần đối chiếu VAS về hàng tồn kho, doanh thu, hợp đồng xây dựng và chính sách kế toán nội bộ.'
  },
  {
    id: 'audit-duplicate-payment',
    area: 'audit',
    title: 'Audit analytics: kiểm tra thanh toán trùng',
    purpose: 'Minh họa cách dùng dữ liệu để chọn mẫu kiểm toán và phòng tránh thanh toán trùng.',
    keyIdea: 'Tìm các giao dịch có cùng nhà cung cấp, số hóa đơn, số tiền hoặc ngày gần nhau; kết quả chỉ là tín hiệu rủi ro, cần đối chiếu chứng từ gốc.',
    documents: ['Sổ chi tiết 331', 'Danh sách thanh toán', 'Hóa đơn đầu vào', 'Ủy nhiệm chi/phiếu chi', 'Biên bản giao nhận'],
    warning: ['Một hóa đơn có thể thanh toán nhiều lần hợp lệ nếu có tạm ứng/quyết toán', 'Sai mã nhà cung cấp làm tăng false positive', 'Thiếu chuẩn hóa số hóa đơn trước khi test'],
    simulation: 'SQL Playground có query duplicate payment để người học copy và hiểu logic.',
    sourceNote: 'Source-linked card: đối chiếu chuẩn mực kiểm toán, chính sách kiểm soát nội bộ và dữ liệu thực tế trước khi kết luận.'
  }
];

const areaLabels: Record<RuleArea | 'all', string> = {
  all: 'Tất cả',
  vat: 'VAT',
  cit: 'TNDN',
  pit: 'TNCN',
  fct: 'FCT',
  construction: 'Xây dựng',
  audit: 'Audit'
};

export default function TaxAccountingRuleLibrary() {
  const [area, setArea] = useState<RuleArea | 'all'>('all');
  const [selectedId, setSelectedId] = useState(rules[0].id);
  const [copied, setCopied] = useState(false);

  const filtered = area === 'all' ? rules : rules.filter(rule => rule.area === area);
  const selected = filtered.find(rule => rule.id === selectedId) ?? filtered[0] ?? rules[0];

  const markdown = useMemo(() => {
    return `# Source-linked Rule Card - ${selected.title}\n\n## Mục tiêu\n${selected.purpose}\n\n## Logic chính\n${selected.keyIdea}\n\n## Hồ sơ cần có\n${selected.documents.map(item => `- ${item}`).join('\n')}\n\n## Cảnh báo rủi ro\n${selected.warning.map(item => `- ${item}`).join('\n')}\n\n## Mô phỏng trong sandbox\n${selected.simulation}\n\n## Ghi chú nguồn\n${selected.sourceNote}\n\n> Nội dung phục vụ học tập. Khi áp dụng hồ sơ thật cần kiểm tra văn bản pháp luật, chuẩn mực và quy định hiện hành.`;
  }, [selected]);

  const copy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-6 text-slate-100 select-text pb-12">
      <section className="bg-gradient-to-r from-blue-950/20 via-[#060a12] to-amber-950/20 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-44 h-44 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0"><Landmark className="w-6 h-6" /></div>
          <div>
            <h1 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">📚 Tax & Accounting Rule Library <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/25 text-[9px] font-black rounded font-mono">VAS · TAX · AUDIT</span></h1>
            <p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed max-w-4xl">Thư viện rule card có cấu trúc: mục tiêu, logic, hồ sơ, rủi ro, mô phỏng và ghi chú nguồn. Đây là nền để sau này gắn văn bản pháp luật/chuẩn mực cụ thể vào từng card.</p>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        {(['all', 'vat', 'cit', 'pit', 'fct', 'construction', 'audit'] as const).map(key => (
          <button key={key} onClick={() => { setArea(key); const first = key === 'all' ? rules[0] : rules.find(rule => rule.area === key); if (first) setSelectedId(first.id); }} className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all border ${area === key ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white'}`}>{areaLabels[key]}</button>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-4 space-y-2">
          {filtered.map(rule => (
            <button key={rule.id} onClick={() => setSelectedId(rule.id)} className={`w-full text-left p-3.5 rounded-xl border transition-all ${selected.id === rule.id ? 'bg-blue-500/10 border-blue-500 ring-1 ring-blue-500/30' : 'bg-[#060a12] border-slate-850 hover:bg-slate-900'}`}>
              <span className="text-[9px] font-black text-blue-400 font-mono uppercase">{areaLabels[rule.area]}</span>
              <span className="text-xs font-bold text-slate-200 block mt-1">{rule.title}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5 leading-snug line-clamp-2">{rule.purpose}</span>
            </button>
          ))}
        </aside>

        <main className="lg:col-span-8 bg-slate-950/50 border border-slate-850 rounded-2xl p-5 space-y-5">
          <div className="flex items-start justify-between gap-3 border-b border-slate-850 pb-4">
            <div>
              <span className="text-[9px] font-black text-blue-400 font-mono uppercase tracking-widest">{areaLabels[selected.area]} · Rule Card</span>
              <h2 className="text-base font-black text-white mt-1 flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-400" />{selected.title}</h2>
              <p className="text-xs text-slate-400 mt-1 font-semibold">{selected.purpose}</p>
            </div>
            <button onClick={copy} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-black rounded-xl flex items-center gap-1.5 shrink-0">
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Đã copy' : 'Copy card'}
            </button>
          </div>

          <Panel title="Logic chính" icon={Scale} tone="blue">{selected.keyIdea}</Panel>

          <div className="grid md:grid-cols-2 gap-4">
            <ListPanel title="Hồ sơ cần có" icon={ClipboardList} items={selected.documents} tone="emerald" />
            <ListPanel title="Cảnh báo rủi ro" icon={AlertTriangle} items={selected.warning} tone="rose" />
          </div>

          <Panel title="Mô phỏng trong sandbox" icon={ReceiptText} tone="purple">{selected.simulation}</Panel>
          <Panel title="Ghi chú nguồn / kiểm tra văn bản" icon={FileSearch} tone="amber">{selected.sourceNote}</Panel>
          <Panel title="Nguyên tắc sử dụng" icon={ShieldCheck} tone="emerald">Không dùng rule card như kết luận pháp lý cuối cùng. Khi áp dụng hồ sơ thật, cần kiểm tra văn bản pháp luật, chuẩn mực, chính sách kế toán nội bộ và hồ sơ thực tế tại thời điểm phát sinh.</Panel>
        </main>
      </div>
    </div>
  );
}

function Panel({ title, children, icon: Icon, tone }: { title: string; children: React.ReactNode; icon: React.ComponentType<{ className?: string }>; tone: 'blue' | 'emerald' | 'rose' | 'amber' | 'purple' }) {
  const colors = { blue: 'border-blue-500/25 bg-blue-950/15 text-blue-200', emerald: 'border-emerald-500/25 bg-emerald-950/15 text-emerald-200', rose: 'border-rose-500/25 bg-rose-950/15 text-rose-200', amber: 'border-amber-500/25 bg-amber-950/15 text-amber-200', purple: 'border-purple-500/25 bg-purple-950/15 text-purple-200' }[tone];
  return <section className={`p-4 rounded-xl border ${colors}`}><h3 className="text-[10px] font-black uppercase tracking-wider mb-2 text-white flex items-center gap-2"><Icon className="w-4 h-4" />{title}</h3><div className="text-xs font-semibold leading-relaxed">{children}</div></section>;
}

function ListPanel({ title, items, icon: Icon, tone }: { title: string; items: string[]; icon: React.ComponentType<{ className?: string }>; tone: 'emerald' | 'rose' }) {
  const dot = tone === 'emerald' ? 'bg-emerald-400' : 'bg-rose-400';
  const iconColor = tone === 'emerald' ? 'text-emerald-400' : 'text-rose-400';
  return <section className="p-4 rounded-xl border border-slate-850 bg-slate-900/35"><h3 className="text-[10px] font-black uppercase tracking-wider mb-3 text-white flex items-center gap-2"><Icon className={`w-4 h-4 ${iconColor}`} />{title}</h3><ul className="space-y-2">{items.map(item => <li key={item} className="text-xs text-slate-300 font-semibold leading-relaxed flex gap-2"><span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />{item}</li>)}</ul></section>;
}
