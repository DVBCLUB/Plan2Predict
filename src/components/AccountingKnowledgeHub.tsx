import React, { useMemo, useState } from 'react';
import { BookOpen, Scale, Calculator, Shield, Globe, Copy, Check, ChevronRight } from 'lucide-react';

type TabKey = 'vas' | 'tax' | 'audit' | 'ifrs';

type KnowledgeItem = {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  detail: string;
  example?: string;
};

const vasItems: KnowledgeItem[] = [
  {
    id: 'vas01',
    title: 'VAS 01 - Chuẩn mực chung',
    subtitle: 'Khung nguyên tắc kế toán Việt Nam',
    badge: 'VAS',
    detail: 'Tập trung vào giá gốc, tính thận trọng, phù hợp, nhất quán và có chứng từ kế toán làm căn cứ ghi nhận.',
    example: 'Nợ TK 211 / Có TK 112: Ghi nhận tài sản cố định theo nguyên giá mua và chi phí liên quan trực tiếp.'
  },
  {
    id: 'vas02',
    title: 'VAS 02 - Hàng tồn kho',
    subtitle: 'FIFO, bình quân gia quyền, đích danh',
    badge: 'VAS',
    detail: 'Theo dõi giá gốc hàng tồn kho, dự phòng giảm giá khi giá trị thuần có thể thực hiện được thấp hơn giá gốc.',
    example: 'Nợ TK 156 / Có TK 331: Nhập kho hàng hóa mua chịu từ nhà cung cấp.'
  },
  {
    id: 'vas14',
    title: 'VAS 14 - Doanh thu',
    subtitle: 'Ghi nhận khi chuyển giao rủi ro và lợi ích',
    badge: 'VAS',
    detail: 'Mô phỏng điểm khác biệt với IFRS 15, đặc biệt với hợp đồng nhiều nghĩa vụ và điều kiện bàn giao.',
    example: 'Nợ TK 131 / Có TK 511, 3331: Ghi nhận doanh thu và thuế GTGT đầu ra.'
  }
];

const taxItems: KnowledgeItem[] = [
  {
    id: 'cit',
    title: 'Thuế TNDN',
    subtitle: 'Thuế suất phổ thông và chi phí được trừ',
    badge: 'CIT',
    detail: 'Sandbox giúp phân biệt lợi nhuận kế toán, thu nhập chịu thuế, chi phí không được trừ và ưu đãi thuế.',
    example: 'Thuế TNDN tạm tính = Thu nhập chịu thuế x thuế suất áp dụng.'
  },
  {
    id: 'vat',
    title: 'Thuế GTGT',
    subtitle: '0%, 5%, 8%, 10% theo nhóm hàng/dịch vụ',
    badge: 'VAT',
    detail: 'Mô phỏng cách tách giá trước thuế, tiền thuế, tổng thanh toán và kiểm tra điều kiện khấu trừ.',
    example: 'Tiền thuế GTGT = Giá chưa thuế x Thuế suất.'
  },
  {
    id: 'pit',
    title: 'Thuế TNCN',
    subtitle: 'Lũy tiến từng phần và khấu trừ 10%',
    badge: 'PIT',
    detail: 'Dùng để học cách tính thu nhập tính thuế, giảm trừ gia cảnh, bảo hiểm và khấu trừ tại nguồn.',
    example: 'Thu nhập tính thuế = Thu nhập chịu thuế - Các khoản giảm trừ.'
  }
];

const auditItems: KnowledgeItem[] = [
  {
    id: 'benford',
    title: 'Benford Leading Digit Test',
    subtitle: 'Phát hiện phân phối chữ số bất thường',
    badge: 'AUDIT',
    detail: 'Áp dụng với chi phí, thanh toán nhà thầu, giao dịch tiền mặt để khoanh vùng mẫu kiểm tra.',
    example: 'GROUP BY chữ số đầu của số tiền, so sánh tỷ lệ thực tế với phân phối Benford.'
  },
  {
    id: 'duplicate',
    title: 'Duplicate Payment Test',
    subtitle: 'Phát hiện thanh toán/hóa đơn trùng',
    badge: 'AUDIT',
    detail: 'So sánh nhà cung cấp, số hóa đơn, số tiền, ngày chứng từ trong một khoảng thời gian gần nhau.',
    example: 'JOIN bảng chi phí với chính nó theo vendor_id + amount + khoảng cách ngày <= 30.'
  },
  {
    id: 'cutoff',
    title: 'Cut-off Test',
    subtitle: 'Kiểm tra ghi nhận đúng kỳ',
    badge: 'AUDIT',
    detail: 'Lọc giao dịch quanh ngày khóa sổ để nhận diện ghi nhận sớm/muộn hoặc điều chỉnh kỳ kế toán.',
    example: 'Lọc chứng từ từ 20/12 đến 10/01 và so sánh ngày hóa đơn với ngày nhập hệ thống.'
  }
];

const ifrsItems: KnowledgeItem[] = [
  {
    id: 'fair-value',
    title: 'Fair Value vs Historical Cost',
    subtitle: 'IFRS dùng fair value rộng hơn VAS',
    badge: 'IFRS',
    detail: 'Dùng để học vì sao cùng một tài sản nhưng báo cáo theo VAS và IFRS có thể cho số liệu khác nhau.',
    example: 'VAS thường thiên về nguyên giá trừ khấu hao; IFRS có thể đánh giá lại hoặc kiểm tra suy giảm giá trị.'
  },
  {
    id: 'ifrs15',
    title: 'IFRS 15 Revenue 5-Step',
    subtitle: 'Mô hình doanh thu 5 bước',
    badge: 'IFRS',
    detail: 'Mô phỏng hợp đồng có nhiều nghĩa vụ thực hiện, phân bổ giá giao dịch và thời điểm ghi nhận doanh thu.',
    example: 'Xác định hợp đồng → nghĩa vụ → giá giao dịch → phân bổ → ghi nhận.'
  }
];

const tabConfig: Record<TabKey, { label: string; icon: React.ComponentType<{ className?: string }>; items: KnowledgeItem[]; color: string }> = {
  vas: { label: 'Chuẩn mực VAS', icon: Scale, items: vasItems, color: 'blue' },
  tax: { label: 'Thuế', icon: Calculator, items: taxItems, color: 'emerald' },
  audit: { label: 'Audit Analytics', icon: Shield, items: auditItems, color: 'orange' },
  ifrs: { label: 'VAS vs IFRS', icon: Globe, items: ifrsItems, color: 'purple' }
};

export default function AccountingKnowledgeHub() {
  const [activeTab, setActiveTab] = useState<TabKey>('vas');
  const [selectedId, setSelectedId] = useState('vas01');
  const [copied, setCopied] = useState(false);

  const currentItems = tabConfig[activeTab].items;
  const selected = useMemo(() => currentItems.find(item => item.id === selectedId) ?? currentItems[0], [currentItems, selectedId]);

  const changeTab = (tab: TabKey) => {
    setActiveTab(tab);
    setSelectedId(tabConfig[tab].items[0].id);
  };

  const copyExample = async () => {
    await navigator.clipboard.writeText(selected.example ?? selected.detail);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6 text-slate-100 select-text pb-12">
      <section className="bg-gradient-to-r from-blue-950/20 via-[#060a12] to-purple-950/20 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-44 h-44 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              📚 Kho kiến thức kế toán — kiểm toán chuyên sâu
              <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/25 text-[9px] font-black rounded font-mono">VAS · IFRS · TAX · AUDIT</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed max-w-4xl">
              Phòng học mô phỏng chuẩn mực kế toán, thuế và kỹ thuật kiểm toán dữ liệu. Nội dung phục vụ học tập/sandbox, không thay thế tư vấn pháp lý hoặc tư vấn thuế chính thức.
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(tabConfig) as TabKey[]).map(tab => {
          const Icon = tabConfig[tab].icon;
          return (
            <button
              key={tab}
              onClick={() => changeTab(tab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 border ${activeTab === tab ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white'}`}
            >
              <Icon className="w-4 h-4" /> {tabConfig[tab].label}
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-2">
          {currentItems.map(item => (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${selected.id === item.id ? 'bg-blue-500/10 border-blue-500 ring-1 ring-blue-500/30' : 'bg-[#060a12] border-slate-850 hover:bg-slate-900'}`}
            >
              <div>
                <span className="text-[9px] font-black px-2 py-0.5 rounded border font-mono text-blue-400 bg-blue-500/10 border-blue-500/20">{item.badge}</span>
                <span className="text-xs font-bold text-slate-200 block mt-2">{item.title}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">{item.subtitle}</span>
              </div>
              <ChevronRight className="w-4 h-4 shrink-0 mt-1 text-slate-600" />
            </button>
          ))}
        </div>

        <div className="lg:col-span-8 bg-slate-950/50 border border-slate-850 rounded-2xl p-5 space-y-5">
          <div>
            <span className="text-[9px] font-black font-mono text-blue-400 uppercase tracking-widest block">{selected.badge}</span>
            <h2 className="text-base font-black text-white mt-1">{selected.title}</h2>
            <p className="text-xs text-slate-500 mt-1 font-semibold">{selected.subtitle}</p>
          </div>

          <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-xl space-y-1.5">
            <span className="text-[9.5px] font-black text-emerald-400 uppercase font-mono">Ý nghĩa học tập:</span>
            <p className="text-xs text-slate-300 font-semibold leading-relaxed">{selected.detail}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase font-mono">Ví dụ mô phỏng:</span>
              <button onClick={copyExample} className="text-[9px] font-bold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-2 py-0.5 rounded flex items-center gap-1">
                {copied ? <><Check className="w-3 h-3 text-emerald-400" />Copied</> : <><Copy className="w-3 h-3" />Copy</>}
              </button>
            </div>
            <pre className="p-4 bg-[#02050b] border border-slate-850 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed whitespace-pre-wrap">
              {selected.example ?? selected.detail}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
