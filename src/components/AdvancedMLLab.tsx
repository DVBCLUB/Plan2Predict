import React, { useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AlertCircle, Brain, Check, Copy, Play, RotateCcw } from 'lucide-react';

type SectionKey = 'algorithms' | 'gradient' | 'evaluation' | 'pipeline';
type Category = 'supervised' | 'unsupervised' | 'timeseries' | 'nlp';

type AlgorithmCard = {
  id: string;
  name: string;
  category: Category;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  useCase: string;
  financeApp: string;
  pseudoCode: string;
  hyperparams: { name: string; desc: string; defaultValue: string }[];
};

const algorithms: AlgorithmCard[] = [
  {
    id: 'xgboost-fraud',
    name: 'XGBoost — Phát hiện gian lận',
    category: 'supervised',
    complexity: 'intermediate',
    useCase: 'Phân loại nhị phân giao dịch bình thường và giao dịch bất thường.',
    financeApp: 'Khoanh vùng hóa đơn khống, chi phí bất thường, thanh toán nhà thầu cần kiểm tra.',
    hyperparams: [
      { name: 'n_estimators', desc: 'Số cây quyết định', defaultValue: '200' },
      { name: 'max_depth', desc: 'Độ sâu mỗi cây', defaultValue: '6' },
      { name: 'learning_rate', desc: 'Tốc độ học', defaultValue: '0.05' },
      { name: 'scale_pos_weight', desc: 'Cân bằng lớp gian lận hiếm', defaultValue: '10' }
    ],
    pseudoCode: `features = ['amount_log', 'tax_rate', 'is_round_number', 'is_weekend', 'vendor_risk']
model = XGBClassifier(n_estimators=200, max_depth=6, learning_rate=0.05)
model.fit(X_train[features], y_train)
risk_score = model.predict_proba(new_expenses)[:, 1]`
  },
  {
    id: 'lstm-cashflow',
    name: 'LSTM — Dự báo dòng tiền',
    category: 'timeseries',
    complexity: 'advanced',
    useCase: 'Dự báo chuỗi thời gian nhiều bước cho dòng tiền tuần/tháng.',
    financeApp: 'Mô phỏng dòng tiền 4-13 tuần tới để cảnh báo thiếu hụt vốn lưu động.',
    hyperparams: [
      { name: 'sequence_length', desc: 'Số kỳ quá khứ đưa vào mô hình', defaultValue: '12 tuần' },
      { name: 'hidden_size', desc: 'Kích thước trạng thái ẩn', defaultValue: '64' },
      { name: 'dropout', desc: 'Giảm overfit', defaultValue: '0.2' }
    ],
    pseudoCode: `X = rolling_window(cashflow_series, sequence_length=12)
y = next_4_weeks(cashflow_series)
model = LSTM(input_size=3, hidden_size=64, output_size=4)
forecast = model.predict(latest_12_weeks)`
  },
  {
    id: 'kmeans-sme',
    name: 'K-Means++ — Phân khúc khách hàng',
    category: 'unsupervised',
    complexity: 'beginner',
    useCase: 'Tìm nhóm khách hàng có hành vi tương tự mà không cần nhãn trước.',
    financeApp: 'Phân nhóm SME theo quy mô hóa đơn, tần suất mua, độ trễ thanh toán.',
    hyperparams: [
      { name: 'n_clusters', desc: 'Số cụm mục tiêu', defaultValue: '4' },
      { name: 'init', desc: 'Cách khởi tạo tâm cụm', defaultValue: 'k-means++' },
      { name: 'n_init', desc: 'Số lần chạy thử', defaultValue: '20' }
    ],
    pseudoCode: `rfm = build_rfm_table(customers, invoices)
X = StandardScaler().fit_transform(rfm)
clusters = KMeans(n_clusters=4, init='k-means++').fit_predict(X)
rfm['segment'] = clusters`
  },
  {
    id: 'nlp-invoice',
    name: 'NLP TF-IDF — Gợi ý tài khoản kế toán',
    category: 'nlp',
    complexity: 'intermediate',
    useCase: 'Phân loại mô tả hóa đơn thành nhóm tài khoản kế toán dự kiến.',
    financeApp: 'Từ mô tả như “mua thép móng công trình” gợi ý TK 621/154 để người học kiểm tra.',
    hyperparams: [
      { name: 'max_features', desc: 'Số token giữ lại', defaultValue: '5000' },
      { name: 'ngram_range', desc: 'Độ dài cụm từ', defaultValue: '(1, 2)' },
      { name: 'classifier', desc: 'Mô hình phân loại', defaultValue: 'LinearSVC' }
    ],
    pseudoCode: `pipeline = Pipeline([
  ('tfidf', TfidfVectorizer(max_features=5000, ngram_range=(1,2))),
  ('clf', LinearSVC())
])
pipeline.fit(invoice_descriptions, account_codes)
suggested_account = pipeline.predict(['mua thép công trình'])`
  }
];

function GradientDescentViz() {
  const [lr, setLr] = useState(0.1);
  const [steps, setSteps] = useState<{ epoch: number; w: number; loss: number }[]>([]);

  const lossFunc = (w: number) => (w - 2) ** 2 + 1;
  const gradient = (w: number) => 2 * (w - 2);

  const lossCurve = useMemo(() => Array.from({ length: 60 }, (_, i) => {
    const w = -3 + i * 0.17;
    return { w: Number(w.toFixed(2)), loss: Number(lossFunc(w).toFixed(3)) };
  }), []);

  const run = () => {
    let w = -3;
    const path = [{ epoch: 0, w, loss: Number(lossFunc(w).toFixed(4)) }];
    for (let epoch = 1; epoch <= 30; epoch += 1) {
      w = w - lr * gradient(w);
      path.push({ epoch, w: Number(w.toFixed(4)), loss: Number(lossFunc(w).toFixed(4)) });
      if (Math.abs(gradient(w)) < 0.00001) break;
    }
    setSteps(path);
  };

  const diverging = lr > 0.7 && steps.length > 5 && steps[steps.length - 1].loss > steps[steps.length - 2].loss;

  return (
    <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <span className="text-[9px] font-black text-purple-400 font-mono uppercase block">Interactive</span>
          <h3 className="text-sm font-black text-white">Gradient Descent Visualizer</h3>
          <p className="text-[10.5px] text-slate-400 font-semibold">Loss = (w - 2)² + 1 · tối ưu tại w = 2</p>
        </div>
        <div className="flex gap-2">
          <button onClick={run} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-black rounded-xl flex items-center gap-1.5 transition-all">
            <Play className="w-3.5 h-3.5" /> Chạy GD
          </button>
          <button onClick={() => setSteps([])} className="p-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-[11px]"><span className="text-slate-400 font-semibold">Learning Rate:</span><span className="text-purple-400 font-mono font-bold">{lr}</span></div>
        <input type="range" min="0.01" max="0.95" step="0.01" value={lr} onChange={e => { setLr(Number(e.target.value)); setSteps([]); }} className="w-full accent-purple-500 h-1" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lossCurve}>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
              <XAxis dataKey="w" tick={{ fill: '#475569', fontSize: 9 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 9 }} />
              <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', fontSize: '10px' }} />
              <Line type="monotone" dataKey="loss" stroke="#a855f7" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={steps}>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
              <XAxis dataKey="epoch" tick={{ fill: '#475569', fontSize: 9 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 9 }} />
              <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', fontSize: '10px' }} />
              <Area type="monotone" dataKey="loss" stroke="#a855f7" fill="#a855f7" fillOpacity={0.18} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {diverging && <div className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-xl text-[10.5px] text-rose-400 font-semibold flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" />Learning rate quá cao, loss có dấu hiệu phân kỳ.</div>}
    </div>
  );
}

export default function AdvancedMLLab() {
  const [activeSection, setActiveSection] = useState<SectionKey>('algorithms');
  const [selectedId, setSelectedId] = useState(algorithms[0].id);
  const [filterCat, setFilterCat] = useState<Category | 'all'>('all');
  const [copied, setCopied] = useState(false);

  const filtered = filterCat === 'all' ? algorithms : algorithms.filter(item => item.category === filterCat);
  const selected = filtered.find(item => item.id === selectedId) ?? filtered[0] ?? algorithms[0];

  const copyCode = async () => {
    await navigator.clipboard.writeText(selected.pseudoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6 text-slate-100 select-text pb-12">
      <section className="bg-gradient-to-r from-purple-950/20 via-[#060a12] to-blue-950/20 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-44 h-44 rounded-full bg-purple-500/5 blur-3xl" />
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              🧠 Advanced Machine Learning Lab — Tài chính & Kế toán
              <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/25 text-[9px] font-black rounded font-mono">PRO LEVEL</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-semibold max-w-4xl">
              XGBoost gian lận, LSTM dòng tiền, K-Means phân khúc, NLP gợi ý tài khoản và Gradient Descent Visualizer.
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        {[
          { id: 'algorithms', label: '🤖 Thuật toán ML' },
          { id: 'gradient', label: '📉 Gradient Descent' },
          { id: 'evaluation', label: '📊 Model Evaluation' },
          { id: 'pipeline', label: '⚙️ ML Pipeline' }
        ].map(section => (
          <button key={section.id} onClick={() => setActiveSection(section.id as SectionKey)} className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${activeSection === section.id ? 'bg-purple-600 border-purple-500 text-white shadow-lg' : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white'}`}>
            {section.label}
          </button>
        ))}
      </div>

      {activeSection === 'algorithms' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(['all', 'supervised', 'unsupervised', 'timeseries', 'nlp'] as const).map(cat => (
              <button key={cat} onClick={() => { setFilterCat(cat); const first = cat === 'all' ? algorithms[0] : algorithms.find(a => a.category === cat); if (first) setSelectedId(first.id); }} className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all border ${filterCat === cat ? 'bg-slate-200 text-slate-900 border-slate-200' : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white'}`}>
                {cat === 'all' ? 'Tất cả' : cat}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-2">
              {filtered.map(algo => (
                <button key={algo.id} onClick={() => setSelectedId(algo.id)} className={`w-full text-left p-3.5 rounded-xl border transition-all ${selected.id === algo.id ? 'bg-purple-500/10 border-purple-500 ring-1 ring-purple-500/30' : 'bg-[#060a12] border-slate-850 hover:bg-slate-900'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded border font-mono bg-purple-500/10 text-purple-400 border-purple-500/20">{algo.category}</span>
                    <span className="text-[9px] font-bold text-amber-400">{algo.complexity}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-200 block">{algo.name}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5 line-clamp-1">{algo.financeApp}</span>
                </button>
              ))}
            </div>

            <div className="lg:col-span-8 bg-slate-950/50 border border-slate-850 rounded-2xl p-5 space-y-4">
              <div>
                <span className="text-[8px] font-black px-2 py-0.5 rounded border font-mono bg-purple-500/10 text-purple-400 border-purple-500/20">{selected.category}</span>
                <h2 className="text-sm font-black text-white mt-1.5">{selected.name}</h2>
                <p className="text-[11px] text-slate-400 font-semibold mt-1">{selected.useCase}</p>
              </div>

              <div className="p-3.5 bg-purple-950/20 border border-purple-900/30 rounded-xl"><span className="text-[9.5px] font-black text-purple-400 uppercase font-mono block mb-1">Ứng dụng tài chính:</span><p className="text-xs text-slate-300 font-semibold">{selected.financeApp}</p></div>

              <div className="grid grid-cols-2 gap-2">
                {selected.hyperparams.map(param => <div key={param.name} className="p-2.5 bg-slate-900 border border-slate-850 rounded-lg"><span className="text-[10px] font-black text-emerald-400 font-mono block">{param.name} = {param.defaultValue}</span><span className="text-[9.5px] text-slate-400 font-semibold">{param.desc}</span></div>)}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center"><span className="text-[9.5px] font-black text-slate-400 uppercase font-mono">Pseudo-code học tập:</span><button onClick={copyCode} className="text-[9px] font-bold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-2 py-0.5 rounded flex items-center gap-1">{copied ? <><Check className="w-3 h-3 text-emerald-400" />Copied</> : <><Copy className="w-3 h-3" />Copy</>}</button></div>
                <pre className="p-4 bg-[#02050b] border border-slate-850 rounded-xl text-[10.5px] font-mono text-slate-300 overflow-x-auto max-h-80 overflow-y-auto leading-relaxed">{selected.pseudoCode}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'gradient' && <GradientDescentViz />}

      {activeSection === 'evaluation' && (
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: 'Classification', items: ['Precision: giảm báo động sai', 'Recall: không bỏ sót gian lận', 'F1-score: cân bằng Precision/Recall', 'PR-AUC: tốt cho dữ liệu mất cân bằng'] },
            { title: 'Forecasting/Regression', items: ['MAE: sai số dễ hiểu', 'RMSE: phạt nặng sai số lớn', 'MAPE: xem sai số theo tỷ lệ %', 'Huber Loss: bền hơn với outlier'] }
          ].map(group => <div key={group.title} className="bg-slate-950/50 border border-slate-850 rounded-2xl p-5"><h3 className="text-xs font-black text-white uppercase tracking-wider mb-4">{group.title}</h3><div className="space-y-2">{group.items.map(item => <div key={item} className="p-3 bg-[#060a12] border border-slate-850 rounded-xl text-[11px] text-slate-300 font-semibold">{item}</div>)}</div></div>)}
        </div>
      )}

      {activeSection === 'pipeline' && (
        <div className="bg-slate-950/50 border border-slate-850 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-black text-white uppercase">ML Pipeline chuẩn cho sandbox</h3>
          {['1. Nạp dữ liệu mô phỏng từ CSV/SQLite/API', '2. Làm sạch, chuẩn hóa và tạo đặc trưng', '3. Chia train/validation/test theo thời gian hoặc theo nhãn', '4. Huấn luyện mô hình và đo metric phù hợp', '5. Giải thích kết quả bằng feature importance/SHAP', '6. Đưa ra cảnh báo học tập, không tự động thay quyết định kế toán'].map(step => <div key={step} className="p-3 bg-[#060a12] border border-slate-850 rounded-xl text-xs text-slate-300 font-semibold">{step}</div>)}
        </div>
      )}
    </div>
  );
}
