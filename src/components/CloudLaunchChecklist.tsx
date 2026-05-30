import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Cloud, Copy, Globe2, KeyRound, Rocket, ShieldCheck, WalletCards } from 'lucide-react';

type LaunchMode = 'cloudrun' | 'firebase_cloudrun' | 'custom_domain';

const modeInfo = {
  cloudrun: {
    title: 'Cloud Run trực tiếp',
    desc: 'Nhanh nhất để chạy web Express + React + Gemini backend. Dùng URL run.app public trước khi mua domain.',
    checklist: ['Service chạy public được', 'Region đúng asia-southeast1', 'PORT dùng biến môi trường', 'GEMINI_API_KEY nằm trong env/secrets', 'min instances = 0', 'max instances thấp khi thử nghiệm']
  },
  firebase_cloudrun: {
    title: 'Firebase Hosting rewrite sang Cloud Run',
    desc: 'Dùng Firebase làm lớp hosting/domain/SSL/CDN, Cloud Run vẫn chạy backend.',
    checklist: ['firebase.json có rewrite sang Cloud Run', 'serviceId đúng plan2predict', 'region đúng asia-southeast1', 'pinTag bật nếu muốn ghim revision', 'kiểm tra route SPA không bị 404']
  },
  custom_domain: {
    title: 'Custom domain ngắn',
    desc: 'Khi web ổn định mới gắn domain ngắn để dễ chia sẻ. Có thể map qua Firebase Hosting hoặc Cloud Run.',
    checklist: ['Chọn domain ngắn, dễ nhớ', 'Xác minh DNS ownership', 'Trỏ DNS theo hướng dẫn Google', 'Đợi SSL certificate active', 'Test www và non-www nếu dùng cả hai']
  }
} as const;

export default function CloudLaunchChecklist() {
  const [mode, setMode] = useState<LaunchMode>('cloudrun');
  const [minInstances, setMinInstances] = useState(0);
  const [maxInstances, setMaxInstances] = useState(1);
  const [hasBillingAlert, setHasBillingAlert] = useState(true);
  const [hasApiKeySecret, setHasApiKeySecret] = useState(true);
  const [copied, setCopied] = useState(false);

  const selected = modeInfo[mode];
  const riskScore = useMemo(() => {
    let score = 10;
    if (minInstances > 0) score += 25;
    if (maxInstances > 3) score += 25;
    if (!hasBillingAlert) score += 20;
    if (!hasApiKeySecret) score += 30;
    return Math.min(100, score);
  }, [minInstances, maxInstances, hasBillingAlert, hasApiKeySecret]);

  const riskText = riskScore >= 70 ? 'Rủi ro cao' : riskScore >= 40 ? 'Rủi ro vừa' : 'Rủi ro thấp';
  const riskTone = riskScore >= 70 ? 'rose' : riskScore >= 40 ? 'amber' : 'emerald';

  const markdown = `# Cloud Launch Checklist\n\n## Chế độ triển khai\n${selected.title}\n\n${selected.desc}\n\n## Checklist\n${selected.checklist.map(item => `- [ ] ${item}`).join('\n')}\n\n## Cost guardrails\n- min instances: ${minInstances}\n- max instances: ${maxInstances}\n- billing alert: ${hasBillingAlert ? 'Có' : 'Chưa có'}\n- API key trong env/secrets: ${hasApiKeySecret ? 'Có' : 'Chưa có'}\n- risk score: ${riskScore}/100 - ${riskText}\n\n## Khuyến nghị\n- Giai đoạn thử nghiệm: min instances = 0, max instances = 1.\n- Không public API key ở frontend.\n- Nếu web lỗi sau deploy, rollback revision cũ trước rồi sửa code sau.`;

  const copy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-6 text-slate-100 select-text pb-12">
      <section className="bg-gradient-to-r from-sky-950/20 via-[#060a12] to-emerald-950/20 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-44 h-44 rounded-full bg-sky-500/5 blur-3xl" />
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0"><Rocket className="w-6 h-6" /></div>
          <div>
            <h1 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">🚀 Cloud Launch Checklist <span className="px-2 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/25 text-[9px] font-black rounded font-mono">CLOUD RUN · FIREBASE · DOMAIN</span></h1>
            <p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed max-w-4xl">Bảng kiểm triển khai web public: Cloud Run, Firebase Hosting rewrite, custom domain, khóa chi phí và bảo vệ API key.</p>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-4 space-y-3">
          {(['cloudrun', 'firebase_cloudrun', 'custom_domain'] as LaunchMode[]).map(key => (
            <button key={key} onClick={() => setMode(key)} className={`w-full text-left p-4 rounded-xl border transition-all ${mode === key ? 'bg-sky-500/10 border-sky-500 ring-1 ring-sky-500/30' : 'bg-[#060a12] border-slate-850 hover:bg-slate-900'}`}>
              <span className="text-[9px] font-black text-sky-400 font-mono uppercase">Launch mode</span>
              <span className="text-xs font-bold text-slate-200 block mt-1">{modeInfo[key].title}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5 leading-snug">{modeInfo[key].desc}</span>
            </button>
          ))}
        </aside>

        <main className="lg:col-span-8 bg-slate-950/50 border border-slate-850 rounded-2xl p-5 space-y-5">
          <div className="flex items-start justify-between gap-3 border-b border-slate-850 pb-4">
            <div>
              <span className="text-[9px] font-black text-sky-400 font-mono uppercase tracking-widest">Deployment checklist</span>
              <h2 className="text-base font-black text-white mt-1 flex items-center gap-2"><Cloud className="w-5 h-5 text-sky-400" />{selected.title}</h2>
              <p className="text-xs text-slate-400 mt-1 font-semibold">{selected.desc}</p>
            </div>
            <button onClick={copy} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-black rounded-xl flex items-center gap-1.5 shrink-0">
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Đã copy' : 'Copy checklist'}
            </button>
          </div>

          <section className="p-4 rounded-xl border border-slate-850 bg-slate-900/35">
            <h3 className="text-[10px] font-black uppercase tracking-wider mb-3 text-white flex items-center gap-2"><Globe2 className="w-4 h-4 text-sky-400" />Checklist triển khai</h3>
            <ul className="space-y-2">{selected.checklist.map(item => <li key={item} className="text-xs text-slate-300 font-semibold flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />{item}</li>)}</ul>
          </section>

          <section className="p-4 rounded-xl border border-amber-500/25 bg-amber-950/15 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-white flex items-center gap-2"><WalletCards className="w-4 h-4 text-amber-400" />Cost guardrails</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <NumberInput label="Min instances" value={minInstances} onChange={setMinInstances} />
              <NumberInput label="Max instances" value={maxInstances} onChange={setMaxInstances} />
              <label className="p-3 bg-[#060a12] border border-slate-850 rounded-xl text-xs font-semibold flex items-center gap-2"><input type="checkbox" checked={hasBillingAlert} onChange={e => setHasBillingAlert(e.target.checked)} />Có Billing Alert</label>
              <label className="p-3 bg-[#060a12] border border-slate-850 rounded-xl text-xs font-semibold flex items-center gap-2"><input type="checkbox" checked={hasApiKeySecret} onChange={e => setHasApiKeySecret(e.target.checked)} />API key nằm trong env/secrets</label>
            </div>
            <Metric title="Deployment risk score" value={`${riskScore}/100 · ${riskText}`} tone={riskTone} />
          </section>

          <div className="grid md:grid-cols-2 gap-4">
            <Panel title="Bảo vệ API key" icon={KeyRound} tone="emerald">Không đưa Gemini API key vào frontend, prompt, README hoặc file .env commit lên GitHub. Dùng Cloud Run env vars hoặc secrets.</Panel>
            <Panel title="Rollback khi lỗi" icon={AlertTriangle} tone="rose">Nếu revision mới làm web lỗi, route traffic về revision cũ trước. Sau đó mới debug commit gây lỗi.</Panel>
          </div>
        </main>
      </div>
    </div>
  );
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <div><label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">{label}</label><input type="number" value={value} onChange={e => onChange(Number(e.target.value || 0))} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200" /></div>;
}

function Metric({ title, value, tone }: { title: string; value: string; tone: 'emerald' | 'amber' | 'rose' }) {
  const colors = { emerald: 'text-emerald-400 border-emerald-500/25 bg-emerald-950/15', amber: 'text-amber-400 border-amber-500/25 bg-amber-950/15', rose: 'text-rose-400 border-rose-500/25 bg-rose-950/15' }[tone];
  return <div className={`p-3 rounded-xl border ${colors}`}><span className="text-[9px] text-slate-500 font-black uppercase block">{title}</span><p className="text-sm font-black mt-1 font-mono">{value}</p></div>;
}

function Panel({ title, children, icon: Icon, tone }: { title: string; children: React.ReactNode; icon: React.ComponentType<{ className?: string }>; tone: 'emerald' | 'rose' }) {
  const colors = { emerald: 'border-emerald-500/25 bg-emerald-950/15 text-emerald-200', rose: 'border-rose-500/25 bg-rose-950/15 text-rose-200' }[tone];
  return <section className={`p-4 rounded-xl border ${colors}`}><h3 className="text-[10px] font-black uppercase tracking-wider mb-2 text-white flex items-center gap-2"><Icon className="w-4 h-4" />{title}</h3><div className="text-xs font-semibold leading-relaxed">{children}</div></section>;
}
