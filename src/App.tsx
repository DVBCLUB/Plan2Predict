import React, { useState } from 'react';
import SoloFounderBusiness from './components/SoloFounderBusiness';
import WebAccountingRoadmap from './components/WebAccountingRoadmap';
import DataScienceEngineering from './components/DataScienceEngineering';
import PromptPlayground from './components/PromptPlayground';
import GeminiPlayground from './components/GeminiPlayground';
import CustomDataWorkbench from './components/CustomDataWorkbench';
import AIEcosystemArchitecture from './components/AIEcosystemArchitecture';
import GameAndMLWorkbench from './components/GameAndMLWorkbench';
import AccountingKnowledgeHub from './components/AccountingKnowledgeHub';
import AdvancedMLLab from './components/AdvancedMLLab';
import InteractiveSimulatorHub from './components/InteractiveSimulatorHub';
import DevOpsDeploymentLab from './components/DevOpsDeploymentLab';
import {
  Briefcase,
  Calendar,
  Database,
  Terminal,
  Cpu,
  HelpCircle,
  ChevronRight,
  Compass,
  Layers,
  Network,
  Gamepad2,
  BookOpen,
  Brain,
  Wrench,
  Rocket
} from 'lucide-react';

type SegmentKey =
  | 'founder'
  | 'roadmap'
  | 'datascience'
  | 'prompts'
  | 'assistant'
  | 'custom_data'
  | 'architecture'
  | 'game_ml'
  | 'accounting_knowledge'
  | 'advanced_ml'
  | 'interactive_simulators'
  | 'devops_deployment';

type NavItem = {
  id: SegmentKey;
  order: string;
  shortLabel: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeClassName?: string;
};

const navItems: NavItem[] = [
  { id: 'founder', order: '1', shortLabel: 'Cơ Hội', label: 'Cơ Hội Solo Founder & Tài Chính', icon: Briefcase },
  { id: 'roadmap', order: '2', shortLabel: 'Lộ Trình', label: 'Tuần Tự A-Z Web Roadmap', icon: Calendar },
  { id: 'datascience', order: '3', shortLabel: 'Data Science', label: 'Đa Ngành Data Science & DS', icon: Database },
  { id: 'prompts', order: '4', shortLabel: 'Prompts', label: 'Bộ Kỹ Sư Prompt Chuyên Sâu', icon: Terminal },
  { id: 'assistant', order: '5', shortLabel: 'AI Trợ Lý', label: 'Trợ Lý AI Gemini Chatbot', icon: Cpu },
  { id: 'custom_data', order: '6', shortLabel: 'Sandbox', label: 'Không Gian Dữ Liệu Tự Do', icon: Layers, badge: 'Active', badgeClassName: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
  { id: 'architecture', order: '7', shortLabel: 'Sơ đồ AI', label: 'Sơ đồ AI & Quy trình thực hiện', icon: Network },
  { id: 'game_ml', order: '8', shortLabel: 'Game & ML', label: 'Game Mobile & ML Labs', icon: Gamepad2, badge: 'New', badgeClassName: 'bg-sky-500/15 text-sky-400 border-sky-500/25' },
  { id: 'accounting_knowledge', order: '9', shortLabel: 'VAS · Tax', label: 'Kho Kiến Thức Kế Toán · Thuế · Audit', icon: BookOpen, badge: 'Hub', badgeClassName: 'bg-blue-500/15 text-blue-400 border-blue-500/25' },
  { id: 'advanced_ml', order: '10', shortLabel: 'ML Lab', label: 'Advanced Machine Learning Lab', icon: Brain, badge: 'Pro', badgeClassName: 'bg-purple-500/15 text-purple-400 border-purple-500/25' },
  { id: 'interactive_simulators', order: '11', shortLabel: 'Tools', label: 'Interactive Tools & Simulators', icon: Wrench, badge: 'Tools', badgeClassName: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
  { id: 'devops_deployment', order: '12', shortLabel: 'DevOps', label: 'DevOps & Cloud Deployment Lab', icon: Rocket, badge: 'Cloud', badgeClassName: 'bg-sky-500/15 text-sky-400 border-sky-500/25' },
];

export default function App() {
  const [activeSegment, setActiveSegment] = useState<SegmentKey>('founder');

  const stats = [
    { label: 'Quy mô DNNVV VN (SMEs)', value: '98%', desc: 'DNNVV chiếm lĩnh thị trường', color: 'text-blue-400' },
    { label: 'Mức MRR Solo kỳ vọng', value: '35M - 120M+ VND', desc: 'Từ 10 - 20 khách hàng duy trì', color: 'text-emerald-400' },
    { label: 'Biên lợi nhuận gộp', value: '70% - 90%', desc: 'Mô hình sản phẩm hóa tối ưu', color: 'text-purple-400' },
    { label: 'Onboarding tối ưu', value: '< 10 ngày', desc: 'Đưa giải pháp dữ liệu vào chạy thật', color: 'text-amber-400' }
  ];

  const renderWorkspace = () => {
    switch (activeSegment) {
      case 'founder':
        return <SoloFounderBusiness />;
      case 'roadmap':
        return <WebAccountingRoadmap />;
      case 'datascience':
        return <DataScienceEngineering />;
      case 'prompts':
        return <PromptPlayground />;
      case 'assistant':
        return <GeminiPlayground />;
      case 'custom_data':
        return <CustomDataWorkbench />;
      case 'architecture':
        return <AIEcosystemArchitecture />;
      case 'game_ml':
        return <GameAndMLWorkbench />;
      case 'accounting_knowledge':
        return <AccountingKnowledgeHub />;
      case 'advanced_ml':
        return <AdvancedMLLab />;
      case 'interactive_simulators':
        return <InteractiveSimulatorHub />;
      case 'devops_deployment':
        return <DevOpsDeploymentLab />;
      default:
        return <SoloFounderBusiness />;
    }
  };

  return (
    <div className="min-h-screen bg-[#03060c] font-sans antialiased text-slate-100 flex flex-col justify-between select-none">
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(139,92,246,0.06),transparent_60%)] bg-size-[48px_48px] before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] before:bg-[size:32px_32px]" />

      <div className="relative z-10">
        <header className="border-b border-slate-900 bg-[#060b13]/60 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 select-text">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <span className="font-black text-white text-base tracking-wider font-mono">LF</span>
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                  LedgerFlow Studio
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-900 text-purple-400 border border-slate-800 rounded-full font-mono">REAL-TIME WORKBENCH v5_LAB</span>
                </h1>
                <p className="text-slate-400 text-xs font-semibold">Web học tập · Dashboard · Sandbox mô phỏng kế toán, dữ liệu lớn, AI & Machine Learning cho SME Việt Nam</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-slate-950 border border-slate-900 px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Workspace Sandbox Mode · GitHub Ready</span>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 select-text">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="bg-slate-950/60 p-4.5 rounded-xl border border-slate-900">
                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">{stat.label}</span>
                <p className={`text-xl font-black mt-1 mb-0.5 ${stat.color}`}>{stat.value}</p>
                <p className="text-[11px] text-slate-400 font-medium">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-gradient-to-r from-purple-950/20 via-[#0a0f1d] to-indigo-950/25 border border-purple-900/40 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute right-0 top-0 -mt-6 -mr-6 w-32 h-32 rounded-full bg-purple-500/5 blur-2xl" />
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                  <HelpCircle className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
                    🎓 LedgerFlow Studio: Hệ Thống Học Tập & Sân Chơi Mô Phỏng
                    <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px] font-black rounded font-mono">SANDBOX SIMULATOR</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-4xl font-medium">
                    Hệ thống hoạt động như một <strong>Sổ tay thực chiến và Sân chơi thiết kế dữ liệu lớn</strong>. Đây không phải là phần mềm kế toán thuế thương mại, mà là dashboard học tập để mô phỏng VAS/IFRS, thuế, kiểm toán dữ liệu, AI, DevOps và Machine Learning.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0 w-full md:w-auto mt-1 md:mt-0 flex-wrap">
                <button
                  onClick={() => setActiveSegment('accounting_knowledge')}
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-[11px] rounded-xl transition-all shadow-md shadow-blue-500/10 uppercase tracking-widest text-center flex-1 md:flex-initial"
                >
                  Mở Kho Kiến Thức
                </button>
                <button
                  onClick={() => setActiveSegment('advanced_ml')}
                  className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-black text-[11px] rounded-xl transition-all shadow-md shadow-purple-500/10 uppercase tracking-widest text-center flex-1 md:flex-initial"
                >
                  Mở ML Lab
                </button>
                <button
                  onClick={() => setActiveSegment('interactive_simulators')}
                  className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-[11px] rounded-xl transition-all shadow-md shadow-emerald-500/10 uppercase tracking-widest text-center flex-1 md:flex-initial"
                >
                  Mở Tools
                </button>
                <button
                  onClick={() => setActiveSegment('devops_deployment')}
                  className="px-4 py-2.5 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-black text-[11px] rounded-xl transition-all shadow-md shadow-sky-500/10 uppercase tracking-widest text-center flex-1 md:flex-initial"
                >
                  Mở DevOps
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 block lg:hidden">
          <div className="bg-[#050911]/80 backdrop-blur-md p-2.5 rounded-2xl border border-slate-900/60 shadow-xl shadow-purple-500/5">
            <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider block mb-2 px-1 text-left">
              Chuyển Tác Vụ Nhanh (Trượt ngang để xem hết)
            </span>
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 select-none">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSegment(item.id)}
                    className={`py-2 px-3.5 rounded-xl text-[11px] font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                      activeSegment === item.id
                        ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-500/10'
                        : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border-transparent hover:bg-slate-905'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0 text-purple-400" />
                    <span>{item.order}. {item.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-4 gap-8">
          <section className="hidden lg:block lg:col-span-1 space-y-4">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-905 space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-3 px-2">Bục điều khiển tác vụ</span>

              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSegment(item.id)}
                    className={`w-full text-left p-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                      activeSegment === item.id
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-purple-400" />
                      <span>{item.order}. {item.label}</span>
                    </span>
                    {item.badge ? (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase font-mono leading-none tracking-tight ${item.badgeClassName}`}>
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="bg-slate-950/65 p-4 rounded-xl border border-slate-900 text-xs text-slate-400 space-y-2.5">
              <div className="flex items-center gap-2 text-purple-400 font-bold">
                <Compass className="w-4 h-4 shrink-0" />
                <span>Hướng dẫn học tập nhanh:</span>
              </div>
              <p className="text-[11px] leading-relaxed font-semibold">
                Dùng các thẻ bên trái để học theo từng phòng lab. Các module mới gồm <strong className="text-blue-400">Kho kiến thức kế toán</strong>, <strong className="text-purple-400">Advanced ML Lab</strong>, <strong className="text-emerald-400">Interactive Tools</strong> và <strong className="text-sky-400">DevOps Cloud Lab</strong>, giữ nguyên cấu trúc dashboard hiện tại.
              </p>
            </div>
          </section>

          <section className="lg:col-span-3 space-y-6">
            {renderWorkspace()}
          </section>
        </main>
      </div>

      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-600 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p>© 2026 LedgerFlow Studio Việt Nam. Sandbox học tập, dashboard mô phỏng và phòng lab dữ liệu/AI.</p>
        </div>
      </footer>
    </div>
  );
}
