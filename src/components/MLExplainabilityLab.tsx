import React, { useMemo, useState } from 'react';
import { AlertTriangle, BarChart3, CheckCircle2, Copy, Eye, LineChart, Scale, ShieldAlert, SlidersHorizontal, TrendingDown } from 'lucide-react';

type ScenarioKey = 'fraud' | 'overrun' | 'ar_collection';

type FeatureItem = {
  name: string;
  value: string;
  impact: number;
  note: string;
};

const scenarios: Record<ScenarioKey, { title: string; baseScore: number; features: FeatureItem[]; recommendation: string }> = {
  fraud: {
    title: 'Fraud / Expense Risk Scoring',
    baseScore: 28,
    features: [
      { name: 'Nhà cung cấp mới', value: 'Có', impact: 18, note: 'Vendor mới thường cần kiểm tra hồ sơ pháp lý và lịch sử giao dịch.' },
      { name: 'Số tiền tròn', value: '50.000.000', impact: 12, note: 'Số tiền tròn/chẵn lớn là tín hiệu chọn mẫu kiểm toán, không kết luận gian lận.' },
      { name: 'Gần ngưỡng phê duyệt', value: 'Dưới ngưỡng 2%', impact: 16, note: 'Có thể là tách nhỏ hoặc né cấp duyệt, cần xem chuỗi giao dịch liên quan.' },
      { name: 'Có hóa đơn hợp lệ', value: 'Có', impact: -10, note: 'Có hóa đơn làm giảm rủi ro nhưng vẫn cần đối chiếu hàng hóa/dịch vụ thực nhận.' },
      { name: 'Thanh toán chuyển khoản', value: 'Có', impact: -8, note: 'Chuyển khoản giúp tăng audit trail.' }
    ],
    recommendation: 'Chọn mẫu kiểm tra: đối chiếu hóa đơn, hợp đồng, biên bản giao nhận, phê duyệt và lịch sử nhà cung cấp.'
  },
  overrun: {
    title: 'Project Cost Overrun Prediction',
    baseScore: 35,
    features: [
      { name: 'Vật tư vượt dự toán', value: '+18%', impact: 22, note: 'Vật tư là driver lớn nhất của chi phí công trình.' },
      { name: 'Nhân công vượt kế hoạch', value: '+9%', impact: 12, note: 'Có thể do năng suất thấp, phát sinh khối lượng hoặc chậm tiến độ.' },
      { name: 'Máy thi công nhàn rỗi', value: 'Cao', impact: 15, note: 'Chi phí ca máy không hiệu quả làm tăng giá thành.' },
      { name: 'Nghiệm thu đúng tiến độ', value: 'Có', impact: -9, note: 'Tiến độ nghiệm thu tốt làm giảm rủi ro dòng tiền và treo 154.' },
      { name: 'Dự toán có BOQ chi tiết', value: 'Có', impact: -7, note: 'BOQ chi tiết giúp so sánh thực tế tốt hơn.' }
    ],
    recommendation: 'Rà soát vật tư, ca máy, khối lượng phát sinh, định mức và điều khoản nghiệm thu trước khi cảnh báo vượt ngân sách.'
  },
  ar_collection: {
    title: 'AR Collection / Bad Debt Risk',
    baseScore: 25,
    features: [
      { name: 'Tuổi nợ', value: '76 ngày', impact: 20, note: 'Tuổi nợ cao làm tăng rủi ro thu hồi và dự phòng.' },
      { name: 'Lịch sử trễ hạn', value: 'Thường xuyên', impact: 18, note: 'Hành vi thanh toán quá khứ là tín hiệu mạnh.' },
      { name: 'Có biên bản đối chiếu', value: 'Có', impact: -12, note: 'Đối chiếu công nợ giúp giảm tranh chấp số dư.' },
      { name: 'Khách hàng đang có dự án mới', value: 'Có', impact: -6, note: 'Quan hệ đang hoạt động có thể hỗ trợ thu hồi nhưng vẫn cần theo dõi.' },
      { name: 'Hóa đơn chưa nghiệm thu đầy đủ', value: 'Một phần', impact: 14, note: 'Thiếu nghiệm thu làm tăng rủi ro tranh chấp công nợ.' }
    ],
    recommendation: 'Ưu tiên gọi xác nhận công nợ, rà hồ sơ nghiệm thu và lập kế hoạch thu tiền theo bucket tuổi nợ.'
  }
};

const money = (value: number) => new Intl.NumberFormat('vi-VN').format(Math.round(value));

export default function MLExplainabilityLab() {
  const [scenario, setScenario] = useState<ScenarioKey>('fraud');
  const [threshold, setThreshold] = useState(60);
  const [baselineMonth, setBaselineMonth] = useState(100);
  const [currentMonth, setCurrentMonth] = useState(126);
  const [copied, setCopied] = useState(false);
  const data = scenarios[scenario];
  const score = Math.max(0, Math.min(100, data.baseScore + data.features.reduce((sum, item) => sum + item.impact, 0)));
  const decision = score >= threshold ? 'Cảnh báo / cần kiểm tra' : 'Theo dõi bình thường';
  const driftPct = baselineMonth ? (currentMonth - baselineMonth) / baselineMonth * 100 : 0;
  const driftStatus = Math.abs(driftPct) >= 20 ? 'Có dấu hiệu drift' : 'Ổn định tương đối';

  const markdown = useMemo(() => {
    return `# ML Explainability Report\n\n## Scenario\n${data.title}\n\n## Risk score\n- Score: ${score}/100\n- Threshold: ${threshold}/100\n- Decision: ${decision}\n\n## Feature contributions\n${data.features.map(f => `- ${f.name}: ${f.impact >= 0 ? '+' : ''}${f.impact} điểm | ${f.value} | ${f.note}`).join('\n')}\n\n## Drift check\n- Baseline index: ${money(baselineMonth)}\n- Current index: ${money(currentMonth)}\n- Drift: ${driftPct.toFixed(1)}%\n- Status: ${driftStatus}\n\n## Recommendation\n${data.recommendation}\n\n> Ghi chú: Đây là mô phỏng explainability cho học tập. Không dùng riêng model để kết luận gian lận, sai phạm hoặc xử lý kế toán.`;
  }, [data, score, threshold, decision, baselineMonth, currentMonth, driftPct, driftStatus]);

  const copy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-6 text-slate-100 select-text pb-12">
      <section className="bg-gradient-to-r from-purple-950/20 via-[#060a12] to-rose-950/20 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-44 h-44 rounded-full bg-purple-500/5 blur-3xl" />
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0"><Eye className="w-6 h-6" /></div>
          <div>
            <h1 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">🧠 ML Explainability & Backtesting Lab <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/25 text-[9px] font-black rounded font-mono">XAI · DRIFT · RISK</span></h1>
            <p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed max-w-4xl">Mô phỏng cách giải thích điểm rủi ro ML: feature contribution, threshold, drift, backtesting và khuyến nghị kiểm tra. Dùng cho học tập, không thay thế xét đoán chuyên môn.</p>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-4 space-y-4">
          <Panel title="Cấu hình mô phỏng" tone="purple">
            <div className="space-y-3">
              <div>
                <FieldLabel>Scenario</FieldLabel>
                <select value={scenario} onChange={e => setScenario(e.target.value as ScenarioKey)} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs">
                  <option value="fraud">Fraud / Expense Risk</option>
                  <option value="overrun">Project Cost Overrun</option>
                  <option value="ar_collection">AR Collection Risk</option>
                </select>
              </div>
              <div>
                <FieldLabel>Threshold cảnh báo: {threshold}/100</FieldLabel>
                <input type="range" min="30" max="90" value={threshold} onChange={e => setThreshold(Number(e.target.value))} className="w-full accent-purple-500" />
              </div>
            </div>
          </Panel>

          <Panel title="Drift monitor" tone="amber">
            <div className="space-y-3">
              <NumberInput label="Baseline index" value={baselineMonth} onChange={setBaselineMonth} />
              <NumberInput label="Current index" value={currentMonth} onChange={setCurrentMonth} />
              <div className={`p-3 rounded-xl border ${Math.abs(driftPct) >= 20 ? 'border-rose-500/25 bg-rose-950/15 text-rose-300' : 'border-emerald-500/25 bg-emerald-950/15 text-emerald-300'}`}>
                <span className="text-[9px] font-black uppercase text-slate-500 block">Drift</span>
                <p className="text-lg font-black font-mono">{driftPct.toFixed(1)}%</p>
                <p className="text-[11px] font-semibold">{driftStatus}</p>
              </div>
            </div>
          </Panel>
        </aside>

        <main className="lg:col-span-8 bg-slate-950/50 border border-slate-850 rounded-2xl p-5 space-y-5">
          <div className="flex items-start justify-between gap-3 border-b border-slate-850 pb-4">
            <div>
              <span className="text-[9px] font-black text-purple-400 font-mono uppercase tracking-widest">Explainability report</span>
              <h2 className="text-base font-black text-white mt-1 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-purple-400" />{data.title}</h2>
              <p className="text-xs text-slate-400 mt-1 font-semibold">Score = base score + tổng đóng góp của từng feature.</p>
            </div>
            <button onClick={copy} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-black rounded-xl flex items-center gap-1.5 shrink-0">
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Đã copy' : 'Copy report'}
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <Metric title="Risk score" value={`${score}/100`} tone={score >= threshold ? 'rose' : 'emerald'} />
            <Metric title="Threshold" value={`${threshold}/100`} tone="purple" />
            <Metric title="Decision" value={decision} tone={score >= threshold ? 'amber' : 'emerald'} />
          </div>

          <section className="p-4 rounded-xl border border-slate-850 bg-slate-900/35">
            <h3 className="text-[10px] font-black uppercase tracking-wider mb-3 text-white flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-purple-400" />Feature contribution</h3>
            <div className="space-y-3">
              {data.features.map(feature => (
                <div key={feature.name} className="grid md:grid-cols-12 gap-3 items-center p-3 bg-[#060a12] border border-slate-850 rounded-xl">
                  <div className="md:col-span-4"><p className="text-xs font-black text-white">{feature.name}</p><p className="text-[10px] text-slate-500 font-semibold">{feature.value}</p></div>
                  <div className="md:col-span-2"><span className={`font-black font-mono ${feature.impact >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{feature.impact >= 0 ? '+' : ''}{feature.impact}</span></div>
                  <div className="md:col-span-6 text-[10.5px] text-slate-400 font-semibold leading-relaxed">{feature.note}</div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-4">
            <Panel title="Khuyến nghị kiểm tra" tone="blue"><div className="flex gap-2"><ShieldAlert className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />{data.recommendation}</div></Panel>
            <Panel title="Cảnh báo sử dụng" tone="rose"><div className="flex gap-2"><AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />Model chỉ hỗ trợ xếp hạng rủi ro và chọn mẫu. Kết luận cuối cùng phải dựa trên chứng từ, phê duyệt và xét đoán nghề nghiệp.</div></Panel>
          </div>

          <Panel title="Backtesting mini" tone="amber"><div className="flex gap-2"><TrendingDown className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />Khi thay đổi threshold, cần đo lại Precision/Recall trên dữ liệu cũ theo thời gian. Không nên chọn threshold chỉ vì nhìn score đẹp.</div></Panel>
        </main>
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">{children}</label>;
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <div><FieldLabel>{label}</FieldLabel><input type="number" value={value} onChange={e => onChange(Number(e.target.value || 0))} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200" /></div>;
}

function Panel({ title, children, tone = 'slate' }: { title: string; children: React.ReactNode; tone?: 'slate' | 'purple' | 'emerald' | 'rose' | 'amber' | 'blue' }) {
  const classes = { slate: 'border-slate-850 bg-slate-900/35', purple: 'border-purple-500/25 bg-purple-950/15', emerald: 'border-emerald-500/25 bg-emerald-950/15', rose: 'border-rose-500/25 bg-rose-950/15', amber: 'border-amber-500/25 bg-amber-950/15', blue: 'border-blue-500/25 bg-blue-950/15' }[tone];
  return <section className={`p-4 rounded-xl border ${classes}`}><h3 className="text-[10px] font-black uppercase tracking-wider mb-2 text-white">{title}</h3><div className="text-xs text-slate-300 font-semibold leading-relaxed">{children}</div></section>;
}

function Metric({ title, value, tone }: { title: string; value: string; tone: 'purple' | 'emerald' | 'amber' | 'rose' }) {
  const colors = { purple: 'text-purple-400 border-purple-500/25 bg-purple-950/15', emerald: 'text-emerald-400 border-emerald-500/25 bg-emerald-950/15', amber: 'text-amber-400 border-amber-500/25 bg-amber-950/15', rose: 'text-rose-400 border-rose-500/25 bg-rose-950/15' }[tone];
  return <div className={`p-3 rounded-xl border ${colors}`}><span className="text-[9px] text-slate-500 font-black uppercase block">{title}</span><p className="text-sm font-black mt-1 font-mono leading-snug">{value}</p></div>;
}
