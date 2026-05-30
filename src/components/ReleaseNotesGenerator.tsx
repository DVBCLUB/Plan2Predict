import React, { useMemo, useState } from 'react';
import AIGovernancePolicyLab from './AIGovernancePolicyLab';
import BuildStatusChecker from './BuildStatusChecker';
import CaseStudyScenarioLab from './CaseStudyScenarioLab';
import CloudLaunchChecklist from './CloudLaunchChecklist';
import DataLineageGovernanceLab from './DataLineageGovernanceLab';
import DataQualityPipelineLab from './DataQualityPipelineLab';
import DeepResearchFeedbackLoopLab from './DeepResearchFeedbackLoopLab';
import DeepResearchGlossaryLab from './DeepResearchGlossaryLab';
import DeepResearchModuleNavigator from './DeepResearchModuleNavigator';
import DeepResearchProgressTracker from './DeepResearchProgressTracker';
import DeepResearchQuickStartGuide from './DeepResearchQuickStartGuide';
import DeepResearchReviewIndex from './DeepResearchReviewIndex';
import KnowledgeGapMatrix from './KnowledgeGapMatrix';
import LearningAssessmentQuizLab from './LearningAssessmentQuizLab';
import LearningOutcomeRubricLab from './LearningOutcomeRubricLab';
import ModelCardTemplateLab from './ModelCardTemplateLab';
import ProductMaturityRoadmapLab from './ProductMaturityRoadmapLab';
import SampleDatasetExplorer from './SampleDatasetExplorer';
import SourceCitationChecklistLab from './SourceCitationChecklistLab';
import SourceFreshnessMonitorLab from './SourceFreshnessMonitorLab';
import VasIfrsBridgeLab from './VasIfrsBridgeLab';
import { CheckCircle2, Copy, FileText, Megaphone, PackageCheck, ShieldCheck } from 'lucide-react';

export default function ReleaseNotesGenerator() {
  const [version, setVersion] = useState('v0.6.0');
  const [moduleName, setModuleName] = useState('Project Control & QA Lab');
  const [changes, setChanges] = useState('Thêm Roadmap & Backlog Planner\nThêm Security & Data Governance\nCải thiện checklist release và rollback');
  const [risk, setRisk] = useState('Không sửa layout chính. Chỉ mở rộng component bên trong DevOps Lab.');
  const [copied, setCopied] = useState(false);

  const releaseNote = useMemo(() => {
    const changeLines = changes.split('\n').map(line => line.trim()).filter(Boolean);
    return `# Release ${version} - ${moduleName}\n\n## Mục tiêu\nMở rộng LedgerFlow Studio theo hướng học tập/sandbox, giữ nguyên cấu trúc dashboard hiện tại.\n\n## Thay đổi chính\n${changeLines.map(line => `- ${line}`).join('\n')}\n\n## Kiểm tra trước deploy\n- Build Cloud Run phải pass.\n- UI desktop/mobile không vỡ.\n- Sidebar và tab navigation hoạt động.\n- Không đưa dữ liệu thật vào bản public.\n- Nếu revision mới lỗi, rollback về revision cũ.\n\n## Rủi ro / ghi chú\n${risk}\n\n## Trạng thái\nReady for Cloud Run build nếu không có lỗi TypeScript/Vite.`;
  }, [version, moduleName, changes, risk]);

  const copy = async () => {
    await navigator.clipboard.writeText(releaseNote);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-5 text-slate-100 select-text">
      <section className="bg-gradient-to-r from-sky-950/20 via-[#060a12] to-emerald-950/20 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0"><Megaphone className="w-5 h-5" /></div>
          <div><h2 className="text-sm font-black text-white uppercase tracking-widest">Release Notes Generator</h2><p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">Tạo ghi chú release ngắn gọn cho mỗi lần AI sửa code, giúp kiểm soát thay đổi, test, rollback và triển khai Cloud Run.</p></div>
        </div>
      </section>
      <DeepResearchReviewIndex />
      <DeepResearchModuleNavigator />
      <KnowledgeGapMatrix />
      <VasIfrsBridgeLab />
      <SourceFreshnessMonitorLab />
      <SampleDatasetExplorer />
      <DataLineageGovernanceLab />
      <ModelCardTemplateLab />
      <LearningOutcomeRubricLab />
      <DeepResearchQuickStartGuide />
      <DeepResearchGlossaryLab />
      <DeepResearchProgressTracker />
      <DeepResearchFeedbackLoopLab />
      <div className="grid md:grid-cols-2 gap-4"><Input label="Version" value={version} onChange={setVersion} /><Input label="Module / tính năng" value={moduleName} onChange={setModuleName} /></div>
      <div><label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">Danh sách thay đổi, mỗi dòng 1 ý</label><textarea value={changes} onChange={e => setChanges(e.target.value)} rows={5} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono" /></div>
      <div><label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">Rủi ro / ghi chú</label><textarea value={risk} onChange={e => setRisk(e.target.value)} rows={3} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono" /></div>
      <div className="grid md:grid-cols-3 gap-3"><InfoCard icon={PackageCheck} title="Release" text="Có tên version và module rõ ràng." /><InfoCard icon={CheckCircle2} title="QA" text="Có checklist build/UI/security." /><InfoCard icon={ShieldCheck} title="Rollback" text="Có ghi chú rollback khi revision lỗi." /></div>
      <section className="space-y-2"><div className="flex items-center justify-between gap-3"><h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-2"><FileText className="w-4 h-4" />Release note preview</h3><button onClick={copy} className="text-[9px] font-bold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg flex items-center gap-1">{copied ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}{copied ? 'Copied' : 'Copy'}</button></div><pre className="p-4 bg-[#02050b] border border-slate-850 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">{releaseNote}</pre></section>
      <BuildStatusChecker />
      <DataQualityPipelineLab />
      <CaseStudyScenarioLab />
      <LearningAssessmentQuizLab />
      <ProductMaturityRoadmapLab />
      <AIGovernancePolicyLab />
      <SourceCitationChecklistLab />
      <CloudLaunchChecklist />
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <div><label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">{label}</label><input value={value} onChange={e => onChange(e.target.value)} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200" /></div>;
}

function InfoCard({ icon: Icon, title, text }: { icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return <div className="p-4 bg-slate-950/50 border border-slate-850 rounded-xl"><Icon className="w-5 h-5 text-sky-400 mb-2" /><h3 className="text-xs font-black text-white">{title}</h3><p className="text-[10.5px] text-slate-400 font-semibold mt-1 leading-relaxed">{text}</p></div>;
}
