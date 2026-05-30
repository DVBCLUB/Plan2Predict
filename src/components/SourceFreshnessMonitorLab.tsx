import React, { useMemo, useState } from 'react';
import { AlertTriangle, CalendarClock, CheckCircle2, ClipboardList, Copy, FileSearch, RefreshCcw, ShieldAlert } from 'lucide-react';
import { sourceRegistry, sourceStatusLabel, type SourceDomain } from '../data/sourceRegistry';

const domainLabels: Record<SourceDomain | 'all', string> = {
  all: 'Tất cả',
  vietnam_tax: 'Vietnam Tax',
  vas: 'VAS',
  ifrs: 'IFRS',
  audit: 'Audit',
  ml_ai: 'ML / AI',
  cloud_security: 'Cloud / Security',
  internal_policy: 'Internal Policy'
};

function daysSince(dateText: string) {
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) return 9999;
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
}

function freshness(days: number) {
  if (days <= 90) return { label: 'Fresh', tone: 'emerald' as const };
  if (days <= 180) return { label: 'Review soon', tone: 'amber' as const };
  return { label: 'Stale / re-check', tone: 'rose' as const };
}

export default function SourceFreshnessMonitorLab() {
  const [domain, setDomain] = useState<SourceDomain | 'all'>('all');
  const [copied, setCopied] = useState(false);
  const filtered = domain === 'all' ? sourceRegistry : sourceRegistry.filter(item => item.domain === domain);
  const staleCount = filtered.filter(item => daysSince(item.lastReviewedAt) > 180 || item.status === 'needs_review').length;
  const freshCount = filtered.length - staleCount;

  const markdown = useMemo(() => `# Source Freshness Monitor\n\n## Domain\n${domainLabels[domain]}\n\n## Summary\n- Source records: ${filtered.length}\n- Fresh / acceptable: ${freshCount}\n- Needs review or stale: ${staleCount}\n\n## Records\n${filtered.map(item => {
    const days = daysSince(item.lastReviewedAt);
    const state = freshness(days);
    return `### ${item.id}\n- Domain: ${domainLabels[item.domain]}\n- Authority: ${item.authority}\n- Document: ${item.documentNumber}\n- Status: ${sourceStatusLabel(item.status)}\n- Last reviewed: ${item.lastReviewedAt} (${days} days)\n- Freshness: ${state.label}\n- Simulation only: ${item.simulationOnly ? 'Yes' : 'No'}\n- Reviewer note: ${item.reviewerNote}`;
  }).join('\n\n')}\n\n> Rule: nếu source là Needs review hoặc Stale thì không dùng như kết luận thật; chỉ dùng cho học tập/sandbox cho tới khi có người duyệt nguồn.`, [domain, filtered, freshCount, staleCount]);

  const copy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-5 text-slate-100 select-text">
      <section className="bg-gradient-to-r from-rose-950/20 via-[#060a12] to-amber-950/20 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0"><CalendarClock className="w-5 h-5" /></div>
          <div><h2 className="text-sm font-black text-white uppercase tracking-widest">Source Freshness Monitor Lab</h2><p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">Theo dõi tuổi nguồn, trạng thái review và cảnh báo nguồn stale/needs review để nội dung thuế, VAS, IFRS, audit, cloud và ML không bị lỗi thời.</p></div>
        </div>
      </section>

      <div className="grid md:grid-cols-4 gap-3">
        <Metric title="Source records" value={String(filtered.length)} tone="blue" />
        <Metric title="Fresh" value={String(freshCount)} tone="emerald" />
        <Metric title="Need review" value={String(staleCount)} tone={staleCount ? 'rose' : 'emerald'} />
        <Metric title="Mode" value="Review gate" tone="amber" />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2"><FieldLabel>Domain</FieldLabel><select value={domain} onChange={e => setDomain(e.target.value as SourceDomain | 'all')} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200">{Object.entries(domainLabels).map(([key, value]) => <option key={key} value={key}>{value}</option>)}</select></div>
        <button onClick={copy} className="self-end px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-black rounded-xl flex items-center justify-center gap-1.5">{copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}{copied ? 'Đã copy' : 'Copy freshness report'}</button>
      </div>

      <section className="p-4 rounded-xl border border-amber-500/25 bg-amber-950/15"><h3 className="text-[10px] font-black uppercase tracking-wider mb-2 text-white flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-amber-400" />Review rule</h3><p className="text-xs text-amber-100 font-semibold leading-relaxed">Nguồn pháp luật, thuế, cloud, AI và chuẩn mực có thể thay đổi. Nếu status là Needs review hoặc Last reviewed quá 180 ngày, chỉ dùng cho học tập cho tới khi có người duyệt lại.</p></section>

      <div className="grid xl:grid-cols-2 gap-4">
        {filtered.map(source => {
          const days = daysSince(source.lastReviewedAt);
          const state = freshness(days);
          return <section key={source.id} className="p-4 rounded-xl border border-slate-850 bg-slate-900/35 space-y-3"><div className="flex items-start justify-between gap-3"><div><span className="text-[9px] text-rose-300 font-black uppercase">{domainLabels[source.domain]}</span><h3 className="text-xs font-black text-white mt-1 leading-snug">{source.id}</h3></div><Badge tone={state.tone}>{state.label}</Badge></div><div className="grid md:grid-cols-2 gap-2"><Meta label="Authority" value={source.authority} /><Meta label="Document" value={source.documentNumber} /><Meta label="Status" value={sourceStatusLabel(source.status)} /><Meta label="Last reviewed" value={`${source.lastReviewedAt} · ${days} days`} /></div><Panel title="Reviewer note" icon={ClipboardList} tone="blue">{source.reviewerNote}</Panel>{source.status === 'needs_review' && <Panel title="Action" icon={RefreshCcw} tone="rose">Cần gắn văn bản/điều khoản cụ thể và người duyệt trước khi dùng ngoài sandbox.</Panel>}</section>;
        })}
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) { return <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">{children}</label>; }
function Badge({ children, tone }: { children: React.ReactNode; tone: 'emerald' | 'amber' | 'rose' }) { const colors = { emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25', amber: 'bg-amber-500/10 text-amber-300 border-amber-500/25', rose: 'bg-rose-500/10 text-rose-300 border-rose-500/25' }[tone]; return <span className={`px-2 py-1 rounded-lg border text-[9px] font-black uppercase ${colors}`}>{children}</span>; }
function Metric({ title, value, tone }: { title: string; value: string; tone: 'blue' | 'emerald' | 'amber' | 'rose' }) { const colors = { blue: 'text-blue-300 border-blue-500/20 bg-blue-950/10', emerald: 'text-emerald-300 border-emerald-500/20 bg-emerald-950/10', amber: 'text-amber-300 border-amber-500/20 bg-amber-950/10', rose: 'text-rose-300 border-rose-500/20 bg-rose-950/10' }[tone]; return <div className={`p-3 rounded-xl border ${colors}`}><FileSearch className="w-4 h-4 mb-2" /><span className="text-[9px] text-slate-500 font-black uppercase block">{title}</span><p className="text-xs font-black mt-1">{value}</p></div>; }
function Meta({ label, value }: { label: string; value: string }) { return <div className="p-2 rounded-lg bg-[#060a12] border border-slate-850"><span className="text-[8px] text-slate-500 font-black uppercase block mb-0.5">{label}</span><span className="text-[10px] text-slate-300 font-semibold leading-relaxed">{value}</span></div>; }
function Panel({ title, children, icon: Icon, tone }: { title: string; children: React.ReactNode; icon: React.ComponentType<{ className?: string }>; tone: 'blue' | 'rose' }) { const colors = { blue: 'border-blue-500/25 bg-blue-950/15 text-blue-200', rose: 'border-rose-500/25 bg-rose-950/15 text-rose-200' }[tone]; return <section className={`p-3 rounded-xl border ${colors}`}><h4 className="text-[9px] font-black uppercase tracking-wider mb-1.5 text-white flex items-center gap-2"><Icon className="w-3.5 h-3.5" />{title}</h4><div className="text-[10.5px] font-semibold leading-relaxed">{children}</div></section>; }
