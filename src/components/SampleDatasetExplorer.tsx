import React, { useMemo, useState } from 'react';
import { CheckCircle2, ClipboardList, Copy, Database, Download, FileSpreadsheet, FlaskConical, Table2 } from 'lucide-react';
import { sampleDatasetPack, toCsv, type SampleDatasetName } from '../data/sampleDatasetPack';

export default function SampleDatasetExplorer() {
  const [datasetId, setDatasetId] = useState<SampleDatasetName>('expenses');
  const [copied, setCopied] = useState(false);
  const dataset = sampleDatasetPack.find(item => item.id === datasetId) ?? sampleDatasetPack[0];
  const csv = useMemo(() => toCsv(dataset), [dataset]);

  const copyCsv = async () => {
    await navigator.clipboard.writeText(csv);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const downloadCsv = () => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${dataset.id}-sample.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 text-slate-100 select-text">
      <section className="bg-gradient-to-r from-emerald-950/20 via-[#060a12] to-blue-950/20 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0"><Database className="w-5 h-5" /></div>
          <div><h2 className="text-sm font-black text-white uppercase tracking-widest">Sample Dataset Explorer</h2><p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">Bộ dữ liệu mẫu để thực hành data quality, audit analytics, VAT mismatch, inventory, project overrun và AR aging trong sandbox.</p></div>
        </div>
      </section>

      <div className="grid md:grid-cols-4 gap-3">
        <Metric title="Datasets" value={String(sampleDatasetPack.length)} />
        <Metric title="Rows" value={String(dataset.rows.length)} />
        <Metric title="Columns" value={String(dataset.columns.length)} />
        <Metric title="Tests" value={String(dataset.suggestedTests.length)} />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2"><FieldLabel>Dataset</FieldLabel><select value={datasetId} onChange={e => setDatasetId(e.target.value as SampleDatasetName)} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200">{sampleDatasetPack.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></div>
        <div className="flex items-end gap-2"><button onClick={copyCsv} className="flex-1 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-black rounded-xl flex items-center justify-center gap-1.5">{copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}{copied ? 'Đã copy' : 'Copy CSV'}</button><button onClick={downloadCsv} className="px-3 py-2 bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-emerald-200 text-[10px] font-black rounded-xl flex items-center gap-1.5"><Download className="w-3.5 h-3.5" />CSV</button></div>
      </div>

      <section className="p-4 rounded-xl border border-emerald-500/25 bg-emerald-950/15"><h3 className="text-[10px] font-black uppercase tracking-wider mb-2 text-white flex items-center gap-2"><FileSpreadsheet className="w-4 h-4 text-emerald-400" />Mục đích dataset</h3><p className="text-xs text-emerald-100 font-semibold leading-relaxed">{dataset.purpose}</p></section>

      <div className="grid lg:grid-cols-2 gap-4">
        <ListPanel title="Suggested tests" icon={FlaskConical} items={dataset.suggestedTests} tone="amber" />
        <ListPanel title="Learning use cases" icon={ClipboardList} items={dataset.learningUseCases} tone="blue" />
      </div>

      <section className="p-4 rounded-xl border border-slate-850 bg-slate-900/35 space-y-3"><h3 className="text-[10px] font-black uppercase tracking-wider text-white flex items-center gap-2"><Table2 className="w-4 h-4 text-blue-400" />Column dictionary</h3><div className="grid md:grid-cols-2 gap-2">{dataset.columns.map(column => <div key={column.key} className="p-3 rounded-xl bg-[#060a12] border border-slate-850"><div className="flex items-center justify-between gap-2"><h4 className="text-xs font-black text-white">{column.label}</h4><span className="text-[8px] font-black text-blue-300 border border-blue-500/20 rounded px-1.5 py-0.5 uppercase">{column.type}</span></div><p className="text-[10px] text-slate-400 font-semibold mt-1 leading-relaxed">{column.description}</p>{column.qualityRule && <p className="text-[10px] text-amber-300 font-semibold mt-2 leading-relaxed">Rule: {column.qualityRule}</p>}</div>)}</div></section>

      <section className="p-4 rounded-xl border border-slate-850 bg-slate-900/35 space-y-3"><h3 className="text-[10px] font-black uppercase tracking-wider text-white flex items-center gap-2"><Table2 className="w-4 h-4 text-emerald-400" />Sample rows</h3><div className="overflow-x-auto"><table className="w-full text-[10px] border-collapse"><thead><tr>{dataset.columns.map(column => <th key={column.key} className="text-left text-slate-400 font-black uppercase border-b border-slate-800 p-2 whitespace-nowrap">{column.key}</th>)}</tr></thead><tbody>{dataset.rows.map((row, index) => <tr key={index} className="odd:bg-slate-950/40 even:bg-slate-900/20">{dataset.columns.map(column => <td key={column.key} className="p-2 border-b border-slate-850 text-slate-300 font-semibold whitespace-nowrap">{String(row[column.key] ?? '')}</td>)}</tr>)}</tbody></table></div></section>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) { return <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">{children}</label>; }
function Metric({ title, value }: { title: string; value: string }) { return <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-950/10"><span className="text-[9px] text-slate-500 font-black uppercase block">{title}</span><p className="text-xs font-black text-emerald-300 mt-1">{value}</p></div>; }
function ListPanel({ title, items, icon: Icon, tone }: { title: string; items: string[]; icon: React.ComponentType<{ className?: string }>; tone: 'amber' | 'blue' }) { const colors = tone === 'amber' ? 'text-amber-400 bg-amber-400' : 'text-blue-400 bg-blue-400'; const [textColor, dotColor] = colors.split(' '); return <section className="p-4 rounded-xl border border-slate-850 bg-slate-900/35"><h3 className="text-[10px] font-black uppercase tracking-wider mb-3 text-white flex items-center gap-2"><Icon className={`w-4 h-4 ${textColor}`} />{title}</h3><ul className="space-y-2">{items.map(item => <li key={item} className="text-xs text-slate-300 font-semibold leading-relaxed flex gap-2"><span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />{item}</li>)}</ul></section>; }
