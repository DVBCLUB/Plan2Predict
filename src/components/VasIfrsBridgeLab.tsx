import React, { useMemo, useState } from 'react';
import { ArrowRightLeft, BookOpenCheck, CheckCircle2, ClipboardList, Copy, FileWarning, Layers3, Scale, ShieldCheck } from 'lucide-react';

type BridgeTopic = 'revenue' | 'inventory' | 'construction_wip' | 'provisions' | 'leases' | 'financial_instruments';

type BridgeCard = {
  title: string;
  businessQuestion: string;
  vasLens: string[];
  ifrsLens: string[];
  taxLens: string[];
  evidence: string[];
  risks: string[];
  learningTask: string;
};

const bridgeCards: Record<BridgeTopic, BridgeCard> = {
  revenue: {
    title: 'Revenue Recognition Bridge',
    businessQuestion: 'Khi nào ghi nhận doanh thu và cần chứng từ nào để không lệch giữa kế toán, thuế và quản trị?',
    vasLens: ['Tập trung hồ sơ nghiệm thu, hóa đơn, điều khoản hợp đồng và nguyên tắc phù hợp doanh thu - chi phí.', 'Cần kiểm tra chính sách kế toán nội bộ về thời điểm ghi nhận doanh thu.'],
    ifrsLens: ['Tư duy theo performance obligations, transfer of control và transaction price.', 'Cần xem xét variable consideration, contract modification và timing of recognition.'],
    taxLens: ['Đối chiếu thời điểm lập hóa đơn, kê khai VAT và doanh thu tính thuế.', 'Không tự động đồng nhất doanh thu kế toán với doanh thu tính thuế nếu có chênh lệch chính sách/thời điểm.'],
    evidence: ['Hợp đồng', 'Biên bản nghiệm thu', 'Hóa đơn', 'Bảng xác định giá trị hoàn thành', 'Chính sách kế toán'],
    risks: ['Ghi nhận sai kỳ', 'Nghiệm thu chưa đủ hồ sơ', 'Doanh thu và giá vốn không phù hợp', 'Nhầm doanh thu kế toán với kê khai thuế'],
    learningTask: 'Tạo một case nghiệm thu công trình cuối tháng và phân tích thời điểm ghi doanh thu theo VAS, IFRS lens và tax lens.'
  },
  inventory: {
    title: 'Inventory / Cost Flow Bridge',
    businessQuestion: 'Vật tư, hàng tồn kho và chi phí dở dang được đo lường, kiểm soát và kết chuyển thế nào?',
    vasLens: ['Xem nguyên giá, xuất kho, kiểm kê, dự phòng giảm giá và chứng từ nhập xuất.', 'Với xây dựng cần map vật tư xuất kho vào công trình/hạng mục.'],
    ifrsLens: ['Tập trung measurement at lower of cost and NRV, cost formulas và write-down reversal nếu phù hợp.', 'Cần kiểm soát judgement về NRV và allocation overhead.'],
    taxLens: ['Chi phí hàng tồn kho/giá vốn cần hồ sơ hợp lệ, định mức/phân bổ hợp lý và chứng từ xuất dùng.', 'Dự phòng hoặc write-down cần điều kiện thuế riêng nếu áp dụng.'],
    evidence: ['Phiếu nhập kho', 'Phiếu xuất kho', 'Biên bản kiểm kê', 'Bảng tính giá xuất kho', 'Hồ sơ định mức/phân bổ'],
    risks: ['Âm kho', 'Xuất không gắn công trình', 'Sai giá xuất kho', 'Treo tồn kho ảo', 'Dự phòng thiếu căn cứ'],
    learningTask: 'Dùng Inventory Movement Sample để tìm âm kho, xuất thiếu công trình và vật tư chậm luân chuyển.'
  },
  construction_wip: {
    title: 'Construction WIP / 154 Bridge',
    businessQuestion: 'Chi phí công trình đang dở dang được tập hợp, kiểm soát và kết chuyển giá vốn ra sao?',
    vasLens: ['Tập hợp chi phí theo mã công trình/hạng mục: vật tư, nhân công, máy thi công, chi phí chung.', 'Kết chuyển giá vốn khi có nghiệm thu/doanh thu theo chính sách kế toán.'],
    ifrsLens: ['Tư duy theo contract costs, performance progress và matching với revenue recognition.', 'Cần phân biệt cost to fulfill, cost to obtain và impairment nếu có.'],
    taxLens: ['Chi phí phải có chứng từ hợp lệ, phục vụ SXKD và phân bổ hợp lý.', 'Treo 154 lâu cần giải trình tiến độ, nghiệm thu và khả năng thu hồi.'],
    evidence: ['Dự toán/BOQ', 'Bảng tập hợp chi phí 154', 'Phiếu xuất vật tư', 'Nhật trình máy', 'Nghiệm thu', 'Bảng kết chuyển 632'],
    risks: ['Treo 154 quá lâu', 'Không có budget baseline', 'Sai mã công trình', 'Kết chuyển giá vốn sai kỳ', 'Overrun không được cảnh báo'],
    learningTask: 'Dùng Project Cost Sample để xác định công trình vượt dự toán, thiếu budget và treo WIP lâu.'
  },
  provisions: {
    title: 'Provisions / Contingencies Bridge',
    businessQuestion: 'Khi nào ghi nhận dự phòng/nợ phải trả và khi nào chỉ thuyết minh rủi ro?',
    vasLens: ['Cần kiểm tra nghĩa vụ hiện tại, khả năng phát sinh và ước tính đáng tin cậy theo chính sách kế toán.', 'Phân biệt dự phòng kế toán với chi phí thuế được trừ.'],
    ifrsLens: ['Áp dụng logic present obligation, probable outflow và reliable estimate.', 'Contingent liabilities thường disclosure nếu chưa đủ điều kiện ghi nhận.'],
    taxLens: ['Một số khoản dự phòng có điều kiện thuế riêng; không tự động xem là chi phí được trừ.', 'Cần hồ sơ, phương pháp tính và căn cứ pháp lý/thực tế.'],
    evidence: ['Biên bản đánh giá rủi ro', 'Hồ sơ pháp lý', 'Tính toán dự phòng', 'Phê duyệt kế toán trưởng', 'Thuyết minh nếu có'],
    risks: ['Trích dự phòng thiếu căn cứ', 'Không hoàn nhập khi điều kiện thay đổi', 'Nhầm dự phòng kế toán với chi phí thuế', 'Thiếu disclosure'],
    learningTask: 'Tạo case tranh chấp công trình và quyết định ghi nhận dự phòng hay chỉ thuyết minh.'
  },
  leases: {
    title: 'Leases Bridge',
    businessQuestion: 'Hợp đồng thuê tài sản được ghi nhận như thuê hoạt động hay cần phân tích quyền sử dụng tài sản?',
    vasLens: ['Phân loại thuê tài chính/thuê hoạt động theo chính sách và quy định kế toán áp dụng.', 'Cần kiểm tra hợp đồng, thời hạn, quyền mua, trách nhiệm bảo trì và thanh toán.'],
    ifrsLens: ['IFRS 16 yêu cầu lessee ghi nhận right-of-use asset và lease liability trừ ngoại lệ.', 'Cần xác định lease term, discount rate và lease payments.'],
    taxLens: ['Chi phí thuê cần hợp đồng, hóa đơn/chứng từ, mục đích SXKD và điều kiện thanh toán.', 'Chênh lệch kế toán - thuế có thể phát sinh do cách ghi nhận.'],
    evidence: ['Hợp đồng thuê', 'Lịch thanh toán', 'Hóa đơn', 'Biên bản bàn giao tài sản', 'Chính sách phân loại thuê'],
    risks: ['Phân loại thuê sai', 'Thiếu hóa đơn/chứng từ', 'Không phân bổ đúng kỳ', 'Nhầm IFRS 16 với chế độ kế toán đang áp dụng'],
    learningTask: 'Lập bảng so sánh hợp đồng thuê máy thi công theo VAS lens, IFRS lens và tax lens.'
  },
  financial_instruments: {
    title: 'Financial Instruments Bridge',
    businessQuestion: 'Khoản phải thu, phải trả, vay, bảo lãnh và công cụ tài chính được đo lường/kiểm soát thế nào?',
    vasLens: ['Tập trung ghi nhận công nợ, lãi vay, chênh lệch tỷ giá, dự phòng phải thu khó đòi theo chính sách áp dụng.', 'Cần đối chiếu công nợ và chứng từ ngân hàng.'],
    ifrsLens: ['Có logic classification, amortized cost/FV, ECL impairment và hedge nếu có.', 'Cần xem xét expected credit loss cho receivables.'],
    taxLens: ['Lãi vay, chênh lệch tỷ giá, dự phòng và chi phí tài chính có điều kiện thuế riêng.', 'Cần hồ sơ hợp đồng vay, thanh toán, đối chiếu và giới hạn nếu có.'],
    evidence: ['Hợp đồng vay/công nợ', 'Sao kê ngân hàng', 'Biên bản đối chiếu công nợ', 'Bảng tính lãi', 'Aging report'],
    risks: ['Sai aging', 'Thiếu xác nhận công nợ', 'Tính lãi sai kỳ', 'Dự phòng thiếu căn cứ', 'Nhầm ECL IFRS với thuế Việt Nam'],
    learningTask: 'Dùng AR Aging Sample để phân loại nợ quá hạn, thiếu xác nhận và tiền về chưa đối trừ.'
  }
};

export default function VasIfrsBridgeLab() {
  const [topic, setTopic] = useState<BridgeTopic>('construction_wip');
  const [copied, setCopied] = useState(false);
  const selected = bridgeCards[topic];

  const markdown = useMemo(() => `# VAS / IFRS / Tax Bridge - ${selected.title}\n\n## Business question\n${selected.businessQuestion}\n\n## VAS lens\n${selected.vasLens.map(item => `- ${item}`).join('\n')}\n\n## IFRS lens\n${selected.ifrsLens.map(item => `- ${item}`).join('\n')}\n\n## Tax lens\n${selected.taxLens.map(item => `- ${item}`).join('\n')}\n\n## Evidence required\n${selected.evidence.map(item => `- ${item}`).join('\n')}\n\n## Risks\n${selected.risks.map(item => `- ${item}`).join('\n')}\n\n## Learning task\n${selected.learningTask}\n\n> Rule: đây là bridge học tập. Trước khi áp dụng hồ sơ thật cần source registry, chính sách kế toán và người duyệt chuyên môn.`, [selected]);

  const copy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-5 text-slate-100 select-text">
      <section className="bg-gradient-to-r from-indigo-950/20 via-[#060a12] to-amber-950/20 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0"><ArrowRightLeft className="w-5 h-5" /></div>
          <div><h2 className="text-sm font-black text-white uppercase tracking-widest">VAS / IFRS / Tax Bridge Lab</h2><p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">So sánh một chủ đề theo 3 lăng kính: VAS/chế độ kế toán, IFRS và thuế. Mục tiêu là hiểu khác biệt, chứng từ cần có và rủi ro khi áp dụng.</p></div>
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2"><FieldLabel>Bridge topic</FieldLabel><select value={topic} onChange={e => setTopic(e.target.value as BridgeTopic)} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200">{Object.entries(bridgeCards).map(([key, value]) => <option key={key} value={key}>{value.title}</option>)}</select></div>
        <button onClick={copy} className="self-end px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-black rounded-xl flex items-center justify-center gap-1.5">{copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}{copied ? 'Đã copy' : 'Copy bridge card'}</button>
      </div>

      <section className="p-4 rounded-xl border border-indigo-500/25 bg-indigo-950/15"><h3 className="text-[10px] font-black uppercase tracking-wider mb-2 text-white flex items-center gap-2"><BookOpenCheck className="w-4 h-4 text-indigo-400" />Business question</h3><p className="text-xs text-indigo-100 font-semibold leading-relaxed">{selected.businessQuestion}</p></section>

      <div className="grid md:grid-cols-3 gap-4">
        <ListPanel title="VAS lens" icon={Scale} items={selected.vasLens} tone="blue" />
        <ListPanel title="IFRS lens" icon={Layers3} items={selected.ifrsLens} tone="purple" />
        <ListPanel title="Tax lens" icon={ShieldCheck} items={selected.taxLens} tone="emerald" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <ListPanel title="Evidence required" icon={ClipboardList} items={selected.evidence} tone="amber" />
        <ListPanel title="Risks" icon={FileWarning} items={selected.risks} tone="rose" />
      </div>

      <section className="p-4 rounded-xl border border-amber-500/25 bg-amber-950/15"><h3 className="text-[10px] font-black uppercase tracking-wider mb-2 text-white flex items-center gap-2"><ClipboardList className="w-4 h-4 text-amber-400" />Learning task</h3><p className="text-xs text-amber-100 font-semibold leading-relaxed">{selected.learningTask}</p></section>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) { return <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">{children}</label>; }
function ListPanel({ title, items, icon: Icon, tone }: { title: string; items: string[]; icon: React.ComponentType<{ className?: string }>; tone: 'blue' | 'purple' | 'emerald' | 'amber' | 'rose' }) { const colors = { blue: 'text-blue-400 bg-blue-400', purple: 'text-purple-400 bg-purple-400', emerald: 'text-emerald-400 bg-emerald-400', amber: 'text-amber-400 bg-amber-400', rose: 'text-rose-400 bg-rose-400' }[tone]; const [textColor, dotColor] = colors.split(' '); return <section className="p-4 rounded-xl border border-slate-850 bg-slate-900/35"><h3 className="text-[10px] font-black uppercase tracking-wider mb-3 text-white flex items-center gap-2"><Icon className={`w-4 h-4 ${textColor}`} />{title}</h3><ul className="space-y-2">{items.map(item => <li key={item} className="text-xs text-slate-300 font-semibold leading-relaxed flex gap-2"><span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />{item}</li>)}</ul></section>; }
