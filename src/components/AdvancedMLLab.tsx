import React, { useMemo, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AlertCircle, BarChart3, Brain, Check, Copy, Database, GitBranch, Play, RotateCcw, ShieldAlert, Target, TrendingUp, Workflow, Zap } from 'lucide-react';

type SectionKey = 'algorithms' | 'gradient' | 'evaluation' | 'forecasting' | 'fraud' | 'data_engineering' | 'leakage' | 'pipeline';
type Category = 'supervised' | 'unsupervised' | 'timeseries' | 'nlp' | 'anomaly';

type AlgorithmCard = {
  id: string;
  name: string;
  category: Category;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  useCase: string;
  financeApp: string;
  pseudoCode: string;
  hyperparams: { name: string; desc: string; defaultValue: string }[];
  whenToUse: string[];
  watchOut: string[];
};

const algorithms: AlgorithmCard[] = [
  {
    id: 'linear-regression',
    name: 'Linear Regression — Dự báo chi phí',
    category: 'supervised',
    complexity: 'beginner',
    useCase: 'Dự báo giá trị liên tục như chi phí, doanh thu, giá vốn.',
    financeApp: 'Ước tính chi phí công trình theo khối lượng, nhân công, vật tư, số ngày thi công.',
    hyperparams: [
      { name: 'fit_intercept', desc: 'Có hệ số chặn hay không', defaultValue: 'true' },
      { name: 'regularization', desc: 'Ridge/Lasso để giảm overfit', defaultValue: 'Ridge' }
    ],
    whenToUse: ['Cần mô hình dễ giải thích.', 'Quan hệ tương đối tuyến tính.', 'Dữ liệu chưa quá phức tạp.'],
    watchOut: ['Nhạy với outlier.', 'Không bắt được quan hệ phi tuyến mạnh.', 'Cần kiểm tra multicollinearity.'],
    pseudoCode: `features = ['volume', 'labor_hours', 'material_price_index']
model = Ridge(alpha=1.0)
model.fit(X_train[features], y_train_cost)
predicted_cost = model.predict(new_project[features])`
  },
  {
    id: 'logistic-regression',
    name: 'Logistic Regression — Rủi ro thu hồi nợ',
    category: 'supervised',
    complexity: 'beginner',
    useCase: 'Phân loại nhị phân có xác suất dễ giải thích.',
    financeApp: 'Dự đoán khách hàng có khả năng quá hạn thanh toán trên 60 ngày.',
    hyperparams: [
      { name: 'C', desc: 'Độ mạnh regularization', defaultValue: '1.0' },
      { name: 'class_weight', desc: 'Cân bằng lớp mất cân bằng', defaultValue: 'balanced' }
    ],
    whenToUse: ['Cần xác suất và giải thích hệ số.', 'Dữ liệu tabular đơn giản.', 'Muốn baseline nhanh.'],
    watchOut: ['Giả định log-odds tuyến tính.', 'Cần xử lý biến categorical.', 'Dễ bị ảnh hưởng bởi leakage.'],
    pseudoCode: `features = ['days_overdue', 'invoice_count', 'avg_delay', 'customer_age']
model = LogisticRegression(class_weight='balanced')
model.fit(X_train[features], y_train_default)
default_prob = model.predict_proba(customer)[:, 1]`
  },
  {
    id: 'random-forest',
    name: 'Random Forest — Chấm điểm vendor',
    category: 'supervised',
    complexity: 'intermediate',
    useCase: 'Mô hình cây ensemble ổn định, ít cần scaling.',
    financeApp: 'Chấm rủi ro nhà cung cấp theo lịch sử hóa đơn, trùng lặp, điều chỉnh, phê duyệt.',
    hyperparams: [
      { name: 'n_estimators', desc: 'Số cây', defaultValue: '300' },
      { name: 'max_depth', desc: 'Độ sâu tối đa', defaultValue: '8' },
      { name: 'min_samples_leaf', desc: 'Mẫu tối thiểu ở lá', defaultValue: '20' }
    ],
    whenToUse: ['Dữ liệu tabular hỗn hợp.', 'Muốn feature importance nhanh.', 'Baseline mạnh hơn cây đơn.'],
    watchOut: ['Có thể nặng khi dữ liệu lớn.', 'Ít giải thích hơn logistic.', 'Không extrapolate tốt cho chuỗi thời gian.'],
    pseudoCode: `features = ['invoice_count', 'duplicate_rate', 'late_delivery_rate', 'avg_amount']
model = RandomForestClassifier(n_estimators=300, max_depth=8)
model.fit(vendor_features, risk_label)
vendor_risk = model.predict_proba(new_vendor)[:, 1]`
  },
  {
    id: 'xgboost-fraud',
    name: 'XGBoost — Phát hiện gian lận',
    category: 'supervised',
    complexity: 'intermediate',
    useCase: 'Phân loại giao dịch bình thường và bất thường với dữ liệu tabular mạnh.',
    financeApp: 'Khoanh vùng hóa đơn khống, chi phí bất thường, thanh toán nhà thầu cần kiểm tra.',
    hyperparams: [
      { name: 'n_estimators', desc: 'Số cây quyết định', defaultValue: '200' },
      { name: 'max_depth', desc: 'Độ sâu mỗi cây', defaultValue: '6' },
      { name: 'learning_rate', desc: 'Tốc độ học', defaultValue: '0.05' },
      { name: 'scale_pos_weight', desc: 'Cân bằng lớp gian lận hiếm', defaultValue: '10' }
    ],
    whenToUse: ['Dữ liệu tabular nhiều đặc trưng.', 'Cần hiệu năng cao.', 'Có nhãn gian lận/không gian lận.'],
    watchOut: ['Dễ overfit nếu tuning kém.', 'Cần validation đúng thời gian.', 'Không tự kết luận gian lận, chỉ chấm rủi ro.'],
    pseudoCode: `features = ['amount_log', 'tax_rate', 'is_round_number', 'is_weekend', 'vendor_risk']
model = XGBClassifier(n_estimators=200, max_depth=6, learning_rate=0.05)
model.fit(X_train[features], y_train)
risk_score = model.predict_proba(new_expenses)[:, 1]`
  },
  {
    id: 'isolation-forest',
    name: 'Isolation Forest — Anomaly Detection',
    category: 'anomaly',
    complexity: 'intermediate',
    useCase: 'Phát hiện bất thường không cần nhãn gian lận.',
    financeApp: 'Tìm chi phí, thanh toán, journal entry khác mẫu thông thường.',
    hyperparams: [
      { name: 'contamination', desc: 'Tỷ lệ bất thường dự kiến', defaultValue: '0.02' },
      { name: 'n_estimators', desc: 'Số cây cách ly', defaultValue: '200' }
    ],
    whenToUse: ['Không có nhãn gian lận.', 'Muốn chọn mẫu kiểm toán.', 'Dữ liệu có pattern ổn định.'],
    watchOut: ['Outlier không đồng nghĩa gian lận.', 'Cần loại mùa vụ/chu kỳ hợp lệ.', 'Contamination chọn sai sẽ báo động quá nhiều.'],
    pseudoCode: `features = ['amount_log', 'hour_created', 'vendor_frequency', 'approval_lag']
model = IsolationForest(contamination=0.02, random_state=42)
model.fit(expense_features)
expense['anomaly_score'] = -model.score_samples(expense_features)`
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
    whenToUse: ['Dữ liệu chuỗi thời gian dài.', 'Có seasonality/phụ thuộc quá khứ.', 'Muốn forecast nhiều bước.'],
    watchOut: ['Cần nhiều dữ liệu.', 'Khó giải thích.', 'Không phù hợp nếu dữ liệu ít và nhiễu.'],
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
    whenToUse: ['Muốn phân nhóm khách hàng/vendor.', 'Không có nhãn.', 'Dữ liệu đã chuẩn hóa.'],
    watchOut: ['Phải scale dữ liệu.', 'Chọn k không đúng gây cụm vô nghĩa.', 'Cụm cần được đặt tên bằng nghiệp vụ.'],
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
    whenToUse: ['Có dữ liệu mô tả hóa đơn.', 'Muốn gợi ý mã tài khoản.', 'Cần baseline NLP nhẹ, dễ deploy.'],
    watchOut: ['Cần tập huấn luyện đủ đa dạng.', 'Không thay quyết định kế toán.', 'Mô tả tiếng Việt cần tiền xử lý tốt.'],
    pseudoCode: `pipeline = Pipeline([
  ('tfidf', TfidfVectorizer(max_features=5000, ngram_range=(1,2))),
  ('clf', LinearSVC())
])
pipeline.fit(invoice_descriptions, account_codes)
suggested_account = pipeline.predict(['mua thép công trình'])`
  }
];

const sections: { id: SectionKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'algorithms', label: '🤖 Thuật toán ML', icon: Brain },
  { id: 'gradient', label: '📉 Gradient Descent', icon: TrendingUp },
  { id: 'evaluation', label: '📊 Evaluation', icon: BarChart3 },
  { id: 'forecasting', label: '🔮 Forecasting', icon: TrendingUp },
  { id: 'fraud', label: '🛡️ Fraud Detection', icon: ShieldAlert },
  { id: 'data_engineering', label: '🧱 Data Engineering', icon: Database },
  { id: 'leakage', label: '⚠️ Leakage & Bias', icon: AlertCircle },
  { id: 'pipeline', label: '⚙️ ML Pipeline', icon: Workflow }
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
  return <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 space-y-4"><div className="flex flex-col md:flex-row md:items-center justify-between gap-3"><div><span className="text-[9px] font-black text-purple-400 font-mono uppercase block">Interactive</span><h3 className="text-sm font-black text-white">Gradient Descent Visualizer</h3><p className="text-[10.5px] text-slate-400 font-semibold">Loss = (w - 2)² + 1 · tối ưu tại w = 2</p></div><div className="flex gap-2"><button onClick={run} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-black rounded-xl flex items-center gap-1.5 transition-all"><Play className="w-3.5 h-3.5" /> Chạy GD</button><button onClick={() => setSteps([])} className="p-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all"><RotateCcw className="w-4 h-4" /></button></div></div><div className="space-y-2"><div className="flex justify-between text-[11px]"><span className="text-slate-400 font-semibold">Learning Rate:</span><span className="text-purple-400 font-mono font-bold">{lr}</span></div><input type="range" min="0.01" max="0.95" step="0.01" value={lr} onChange={e => { setLr(Number(e.target.value)); setSteps([]); }} className="w-full accent-purple-500 h-1" /></div><div className="grid md:grid-cols-2 gap-4"><div className="h-40"><ResponsiveContainer width="100%" height="100%"><LineChart data={lossCurve}><CartesianGrid stroke="#1e293b" strokeDasharray="3 3" /><XAxis dataKey="w" tick={{ fill: '#475569', fontSize: 9 }} /><YAxis tick={{ fill: '#475569', fontSize: 9 }} /><Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', fontSize: '10px' }} /><Line type="monotone" dataKey="loss" stroke="#a855f7" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div><div className="h-40"><ResponsiveContainer width="100%" height="100%"><AreaChart data={steps}><CartesianGrid stroke="#1e293b" strokeDasharray="3 3" /><XAxis dataKey="epoch" tick={{ fill: '#475569', fontSize: 9 }} /><YAxis tick={{ fill: '#475569', fontSize: 9 }} /><Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', fontSize: '10px' }} /><Area type="monotone" dataKey="loss" stroke="#a855f7" fill="#a855f7" fillOpacity={0.18} strokeWidth={2} /></AreaChart></ResponsiveContainer></div></div>{diverging && <div className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-xl text-[10.5px] text-rose-400 font-semibold flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" />Learning rate quá cao, loss có dấu hiệu phân kỳ.</div>}</div>;
}

export default function AdvancedMLLab() {
  const [activeSection, setActiveSection] = useState<SectionKey>('algorithms');
  const [selectedId, setSelectedId] = useState(algorithms[0].id);
  const [filterCat, setFilterCat] = useState<Category | 'all'>('all');
  const [copied, setCopied] = useState(false);
  const filtered = filterCat === 'all' ? algorithms : algorithms.filter(item => item.category === filterCat);
  const selected = filtered.find(item => item.id === selectedId) ?? filtered[0] ?? algorithms[0];
  const copyCode = async () => { await navigator.clipboard.writeText(selected.pseudoCode); setCopied(true); setTimeout(() => setCopied(false), 1800); };
  return (
    <div className="space-y-6 text-slate-100 select-text pb-12">
      <section className="bg-gradient-to-r from-purple-950/20 via-[#060a12] to-blue-950/20 border border-slate-800 rounded-3xl p-6 relative overflow-hidden"><div className="absolute right-0 top-0 w-44 h-44 rounded-full bg-purple-500/5 blur-3xl" /><div className="flex items-start gap-4"><div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0"><Brain className="w-6 h-6 animate-pulse" /></div><div><h1 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">🧠 Advanced Machine Learning Lab — Tài chính & Kế toán<span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/25 text-[9px] font-black rounded font-mono">PHASE 4</span></h1><p className="text-xs text-slate-400 mt-1 font-semibold max-w-4xl">Thuật toán ML, model evaluation, forecasting, fraud detection, data engineering, leakage/bias và pipeline chuẩn production cho sandbox kế toán - tài chính.</p></div></div></section>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">{sections.map(section => { const Icon = section.icon; return <button key={section.id} onClick={() => setActiveSection(section.id)} className={`px-3 py-2.5 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all border flex items-center justify-center gap-1.5 ${activeSection === section.id ? 'bg-purple-600 border-purple-500 text-white shadow-lg' : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white'}`}><Icon className="w-3.5 h-3.5" />{section.label}</button>; })}</div>
      {activeSection === 'algorithms' && <AlgorithmExplorer filtered={filtered} selected={selected} filterCat={filterCat} setFilterCat={setFilterCat} setSelectedId={setSelectedId} copyCode={copyCode} copied={copied} />}
      {activeSection === 'gradient' && <GradientDescentViz />}
      {activeSection === 'evaluation' && <EvaluationLab />}
      {activeSection === 'forecasting' && <ForecastingSimulator />}
      {activeSection === 'fraud' && <FraudDetectionLab />}
      {activeSection === 'data_engineering' && <DataEngineeringLab />}
      {activeSection === 'leakage' && <LeakageBiasLab />}
      {activeSection === 'pipeline' && <PipelineLab />}
    </div>
  );
}

function AlgorithmExplorer({ filtered, selected, filterCat, setFilterCat, setSelectedId, copyCode, copied }: { filtered: AlgorithmCard[]; selected: AlgorithmCard; filterCat: Category | 'all'; setFilterCat: (cat: Category | 'all') => void; setSelectedId: (id: string) => void; copyCode: () => void; copied: boolean }) {
  const complexityColors: Record<string, string> = { beginner: 'text-emerald-400', intermediate: 'text-amber-400', advanced: 'text-rose-400' };
  return <div className="space-y-4"><div className="flex flex-wrap gap-2">{(['all', 'supervised', 'unsupervised', 'timeseries', 'nlp', 'anomaly'] as const).map(cat => <button key={cat} onClick={() => { setFilterCat(cat); const first = cat === 'all' ? algorithms[0] : algorithms.find(a => a.category === cat); if (first) setSelectedId(first.id); }} className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all border ${filterCat === cat ? 'bg-slate-200 text-slate-900 border-slate-200' : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white'}`}>{cat === 'all' ? 'Tất cả' : cat}</button>)}</div><div className="grid lg:grid-cols-12 gap-6"><div className="lg:col-span-4 space-y-2">{filtered.map(algo => <button key={algo.id} onClick={() => setSelectedId(algo.id)} className={`w-full text-left p-3.5 rounded-xl border transition-all ${selected.id === algo.id ? 'bg-purple-500/10 border-purple-500 ring-1 ring-purple-500/30' : 'bg-[#060a12] border-slate-850 hover:bg-slate-900'}`}><div className="flex items-center gap-2 mb-1"><span className="text-[8px] font-black px-1.5 py-0.5 rounded border font-mono bg-purple-500/10 text-purple-400 border-purple-500/20">{algo.category}</span><span className={`text-[9px] font-bold ${complexityColors[algo.complexity]}`}>{algo.complexity}</span></div><span className="text-xs font-bold text-slate-200 block">{algo.name}</span><span className="text-[10px] text-slate-500 block mt-0.5 line-clamp-1">{algo.financeApp}</span></button>)}</div><div className="lg:col-span-8 bg-slate-950/50 border border-slate-850 rounded-2xl p-5 space-y-4"><div><span className="text-[8px] font-black px-2 py-0.5 rounded border font-mono bg-purple-500/10 text-purple-400 border-purple-500/20">{selected.category}</span><h2 className="text-sm font-black text-white mt-1.5">{selected.name}</h2><p className="text-[11px] text-slate-400 font-semibold mt-1">{selected.useCase}</p></div><Panel title="Ứng dụng tài chính" tone="purple">{selected.financeApp}</Panel><div className="grid grid-cols-2 gap-2">{selected.hyperparams.map(param => <div key={param.name} className="p-2.5 bg-slate-900 border border-slate-850 rounded-lg"><span className="text-[10px] font-black text-emerald-400 font-mono block">{param.name} = {param.defaultValue}</span><span className="text-[9.5px] text-slate-400 font-semibold">{param.desc}</span></div>)}</div><div className="grid md:grid-cols-2 gap-3"><List title="Khi nên dùng" items={selected.whenToUse} tone="emerald" /><List title="Cần coi chừng" items={selected.watchOut} tone="rose" /></div><div className="space-y-2"><div className="flex justify-between items-center"><span className="text-[9.5px] font-black text-slate-400 uppercase font-mono">Pseudo-code học tập:</span><button onClick={copyCode} className="text-[9px] font-bold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-2 py-0.5 rounded flex items-center gap-1">{copied ? <><Check className="w-3 h-3 text-emerald-400" />Copied</> : <><Copy className="w-3 h-3" />Copy</>}</button></div><pre className="p-4 bg-[#02050b] border border-slate-850 rounded-xl text-[10.5px] font-mono text-slate-300 overflow-x-auto max-h-80 overflow-y-auto leading-relaxed">{selected.pseudoCode}</pre></div></div></div></div>;
}

function Panel({ title, children, tone = 'slate' }: { title: string; children: React.ReactNode; tone?: 'slate' | 'purple' | 'emerald' | 'rose' | 'amber' | 'blue' }) {
  const classes = { slate: 'border-slate-850 bg-slate-900/35', purple: 'border-purple-500/25 bg-purple-950/15', emerald: 'border-emerald-500/25 bg-emerald-950/15', rose: 'border-rose-500/25 bg-rose-950/15', amber: 'border-amber-500/25 bg-amber-950/15', blue: 'border-blue-500/25 bg-blue-950/15' }[tone];
  return <section className={`p-4 rounded-xl border ${classes}`}><h3 className="text-[10px] font-black uppercase tracking-wider mb-2 text-white">{title}</h3><div className="text-xs text-slate-300 font-semibold leading-relaxed">{children}</div></section>;
}

function List({ title, items, tone }: { title: string; items: string[]; tone: 'emerald' | 'rose' | 'blue' | 'amber' | 'purple' }) {
  const dot = { emerald: 'bg-emerald-400', rose: 'bg-rose-400', blue: 'bg-blue-400', amber: 'bg-amber-400', purple: 'bg-purple-400' }[tone];
  return <Panel title={title}><ul className="space-y-2">{items.map(item => <li key={item} className="flex gap-2"><span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />{item}</li>)}</ul></Panel>;
}

function EvaluationLab() {
  const [tp, setTp] = useState(40); const [fp, setFp] = useState(10); const [fn, setFn] = useState(15); const [tn, setTn] = useState(300);
  const precision = tp + fp ? tp / (tp + fp) : 0; const recall = tp + fn ? tp / (tp + fn) : 0; const f1 = precision + recall ? 2 * precision * recall / (precision + recall) : 0; const accuracy = (tp + tn) / (tp + fp + fn + tn);
  return <div className="space-y-4"><Panel title="Confusion Matrix Simulator" tone="purple">Thay đổi TP/FP/FN/TN để hiểu Precision, Recall, F1 và Accuracy trong bài toán phát hiện gian lận.</Panel><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{[['TP', tp, setTp], ['FP', fp, setFp], ['FN', fn, setFn], ['TN', tn, setTn]].map(([label, value, setter]) => <div key={label as string}><label className="text-[10px] text-slate-500 font-black">{label as string}</label><input type="number" value={value as number} onChange={e => (setter as React.Dispatch<React.SetStateAction<number>>)(Number(e.target.value || 0))} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs" /></div>)}</div><div className="grid md:grid-cols-4 gap-3">{[['Accuracy', accuracy], ['Precision', precision], ['Recall', recall], ['F1', f1]].map(([name, value]) => <div key={name as string} className="p-4 bg-slate-950 border border-slate-850 rounded-xl"><span className="text-[9px] text-slate-500 font-black uppercase">{name as string}</span><p className="text-xl font-black text-purple-400 font-mono">{((value as number) * 100).toFixed(1)}%</p></div>)}</div><List title="Chọn metric đúng" tone="amber" items={['Fraud hiếm: ưu tiên PR-AUC, Recall, F1 hơn Accuracy.', 'Cảnh báo sai nhiều làm người dùng bỏ qua hệ thống: cần Precision đủ tốt.', 'Không để sót gian lận lớn: cần Recall cao.']} /></div>;
}

function ForecastingSimulator() {
  const [base, setBase] = useState(100); const [growth, setGrowth] = useState(3); const [seasonality, setSeasonality] = useState(10);
  const data = Array.from({ length: 12 }, (_, i) => ({ month: `T${i + 1}`, revenue: Number((base * (1 + growth / 100) ** i + Math.sin(i / 2) * seasonality).toFixed(1)) }));
  return <div className="space-y-4"><div className="grid md:grid-cols-3 gap-4">{[['Doanh thu gốc', base, setBase], ['Tăng trưởng %/tháng', growth, setGrowth], ['Mùa vụ', seasonality, setSeasonality]].map(([label, value, setter]) => <div key={label as string}><label className="text-[10px] text-slate-500 font-black uppercase">{label as string}</label><input type="number" value={value as number} onChange={e => (setter as React.Dispatch<React.SetStateAction<number>>)(Number(e.target.value || 0))} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs" /></div>)}</div><div className="h-64 bg-slate-950/50 border border-slate-850 rounded-2xl p-4"><ResponsiveContainer width="100%" height="100%"><LineChart data={data}><CartesianGrid stroke="#1e293b" strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} /><YAxis tick={{ fill: '#64748b', fontSize: 10 }} /><Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', fontSize: '10px' }} /><Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} /></LineChart></ResponsiveContainer></div><Panel title="Kiến thức cần nhớ" tone="emerald">Forecast phải tách trend, seasonality, outlier và sự kiện bất thường. Không dùng dữ liệu tương lai để train mô hình dự báo.</Panel></div>;
}

function FraudDetectionLab() {
  const signals = [{ name: 'Số tiền tròn', score: 20 }, { name: 'Cuối tuần/ngoài giờ', score: 18 }, { name: 'Vendor mới', score: 25 }, { name: 'Gần ngưỡng duyệt', score: 30 }, { name: 'Trùng hóa đơn', score: 35 }];
  return <div className="space-y-4"><Panel title="Fraud feature map" tone="rose">Các đặc trưng dưới đây không kết luận gian lận. Chúng dùng để xếp hạng rủi ro và chọn mẫu kiểm tra.</Panel><div className="h-64 bg-slate-950/50 border border-slate-850 rounded-2xl p-4"><ResponsiveContainer width="100%" height="100%"><BarChart data={signals}><CartesianGrid stroke="#1e293b" strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 9 }} /><YAxis tick={{ fill: '#64748b', fontSize: 10 }} /><Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', fontSize: '10px' }} /><Bar dataKey="score" fill="#f43f5e" /></BarChart></ResponsiveContainer></div><List title="Quy trình dùng đúng" tone="emerald" items={['Chấm điểm rủi ro.', 'Chọn mẫu kiểm tra.', 'Đối chiếu chứng từ gốc.', 'Phỏng vấn/giải trình nếu cần.', 'Kết luận dựa trên bằng chứng, không dựa riêng vào model.']} /></div>;
}

function DataEngineeringLab() {
  const steps = ['Raw CSV/Excel', 'Data cleaning', 'Schema chuẩn', 'Fact/Dimension', 'Quality checks', 'Dashboard/Model'];
  return <div className="space-y-4"><div className="grid md:grid-cols-3 gap-3">{steps.map((step, i) => <div key={step} className="p-4 bg-[#060a12] border border-slate-850 rounded-xl"><span className="text-[9px] text-blue-400 font-black font-mono">STEP {i + 1}</span><p className="text-xs font-bold text-white mt-1">{step}</p></div>)}</div><Panel title="Star schema mini" tone="blue"><pre className="text-[11px] font-mono whitespace-pre-wrap">fact_expenses(project_id, vendor_id, date_id, amount, tax, account_code)\ndim_project(project_id, project_name, manager)\ndim_vendor(vendor_id, tax_code, risk_group)\ndim_date(date_id, month, quarter, year)</pre></Panel><List title="Data quality rules" tone="amber" items={['Không để amount âm nếu không phải credit note.', 'Mỗi hóa đơn cần vendor_id và invoice_no.', 'Mỗi chi phí công trình cần project_id.', 'Ngày chứng từ không được sau ngày nhập quá xa nếu không có giải trình.']} /></div>;
}

function LeakageBiasLab() {
  return <div className="space-y-4"><Panel title="Data Leakage là gì?" tone="rose">Leakage xảy ra khi mô hình được học thông tin mà tại thời điểm dự báo thực tế chưa thể biết. Model nhìn rất giỏi khi test nhưng chạy thật thì hỏng.</Panel><div className="grid md:grid-cols-2 gap-4"><List title="Ví dụ leakage" tone="rose" items={['Dùng ngày thanh toán để dự báo nợ quá hạn trước khi đến hạn.', 'Dùng trạng thái đã bị kiểm toán kết luận làm feature.', 'Random split dữ liệu chuỗi thời gian khiến tương lai lọt vào train.']} /><List title="Cách tránh" tone="emerald" items={['Split theo thời gian.', 'Chỉ dùng feature có sẵn tại thời điểm dự báo.', 'Ghi rõ prediction_time.', 'Review feature list bằng nghiệp vụ.']} /></div><Panel title="Bias trong tài chính" tone="amber">Nếu dữ liệu lịch sử đã thiên lệch, model có thể tiếp tục thiên lệch. Luôn kiểm tra theo nhóm khách hàng, vendor, công trình, người nhập liệu.</Panel></div>;
}

function PipelineLab() {
  const stages = ['Ingest', 'Validate', 'Transform', 'Train', 'Evaluate', 'Explain', 'Deploy', 'Monitor'];
  return <div className="space-y-4"><div className="grid md:grid-cols-4 gap-3">{stages.map(stage => <div key={stage} className="p-3 bg-[#060a12] border border-slate-850 rounded-xl text-center"><GitBranch className="w-4 h-4 text-purple-400 mx-auto mb-2" /><span className="text-xs font-black text-white">{stage}</span></div>)}</div><Panel title="Production checklist" tone="purple"><ul className="space-y-2 list-disc pl-4"><li>Version dữ liệu, code, model.</li><li>Validation trước khi train.</li><li>Metric theo thời gian và theo nhóm.</li><li>Feature importance/SHAP để giải thích.</li><li>Monitoring drift sau deploy.</li><li>Human approval cho quyết định kế toán/kiểm toán.</li></ul></Panel><Panel title="Không tự động hóa quá mức" tone="rose">Trong kế toán/kiểm toán, model nên là trợ lý gợi ý và xếp hạng rủi ro. Kết luận cuối cùng cần bằng chứng, xét đoán nghề nghiệp và phê duyệt người có trách nhiệm.</Panel></div>;
}
