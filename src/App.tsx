import React, { useState } from 'react';
import SoloFounderBusiness from './components/SoloFounderBusiness';
import WebAccountingRoadmap from './components/WebAccountingRoadmap';
import DataScienceEngineering from './components/DataScienceEngineering';
import PromptPlayground from './components/PromptPlayground';
import GeminiPlayground from './components/GeminiPlayground';
import CustomDataWorkbench from './components/CustomDataWorkbench';
import AIEcosystemArchitecture from './components/AIEcosystemArchitecture';
import GameAndMLWorkbench from './components/GameAndMLWorkbench';
import { 
  Briefcase, 
  Calendar, 
  Database, 
  Terminal, 
  Cpu, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  ChevronRight, 
  TrendingUp, 
  FileText,
  Compass,
  LayoutDashboard,
  Layers,
  Network,
  Gamepad2
} from 'lucide-react';

export default function App() {
  const [activeSegment, setActiveSegment] = useState<'founder' | 'roadmap' | 'datascience' | 'prompts' | 'assistant' | 'custom_data' | 'architecture' | 'game_ml'>('founder');

  // Simple quick summary stats representing Vietnam Solo Opportunities
  const stats = [
    { label: "Quy mô DNNVV VN (SMEs)", value: "98%", desc: "DNNVV chiếm lĩnh thị trường", color: "text-blue-400" },
    { label: "Mức MRR Solo kỳ vọng", value: "35M - 120M+ VND", desc: "Từ 10 - 20 khách hàng duy trì", color: "text-emerald-400" },
    { label: "Biên lợi nhuận gộp", value: "70% - 90%", desc: "Mô hình sản phẩm hóa tối ưu", color: "text-purple-400" },
    { label: "Onboarding tối ưu", value: "< 10 ngày", desc: "Đưa giải pháp dữ liệu vào chạy thật", color: "text-amber-400" }
  ];

  return (
    <div className="min-h-screen bg-[#03060c] font-sans antialiased text-slate-100 flex flex-col justify-between select-none">
      {/* GRID ACCENTS */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(139,92,246,0.06),transparent_60%)] bg-size-[48px_48px] before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] before:bg-[size:32px_32px]"></div>

      <div className="relative z-10">
        {/* HEADER BRANDING */}
        <header className="border-b border-slate-900 bg-[#060b13]/60 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 select-text">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <span className="font-black text-white text-base tracking-wider font-mono">LF</span>
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                  LedgerFlow Studio
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-900 text-purple-400 border border-slate-800 rounded-full font-mono">REAL-TIME WORKBENCH v4_V26</span>
                </h1>
                <p className="text-slate-400 text-xs font-semibold">Hệ Thống Thực Chiến Kế Toán, Phân Tích Dữ Liệu Lớn & Sổ Sách Tùy Biến cho SME Việt Nam</p>
              </div>
            </div>

            {/* Platform status indicator - architectural honesty, clear and clean */}
            <div className="flex items-center gap-2.5 bg-slate-950 border border-slate-900 px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Workspace Local Mode (WAL ready)</span>
            </div>
          </div>
        </header>

        {/* STATS OVERVIEW */}
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

        {/* INTERACTIVE STUDY DISCLAIMER & MAP */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-gradient-to-r from-purple-950/20 via-[#0a0f1d] to-indigo-950/25 border border-purple-900/40 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute right-0 top-0 -mt-6 -mr-6 w-32 h-32 rounded-full bg-purple-500/5 blur-2xl"></div>
            
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
                    Hệ thống hoạt động như một <strong>Sổ tay thực chiến và Sân chơi (Sandbox) thiết kế dữ liệu lớn</strong>. Đây không phải là phần mềm ghi chép kế toán thuế thương mại. Hãy sử dụng các công cụ biên dịch DDL tự động, Pipeline dọn dẹp Pandas và mô hình AI để học sâu về kỹ nghệ phân tích báo cáo tài chính/kiểm toán tối ưu!
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0 w-full md:w-auto mt-1 md:mt-0">
                <button 
                  onClick={() => setActiveSegment('custom_data')}
                  className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-[11px] rounded-xl transition-all shadow-md shadow-purple-500/10 uppercase tracking-widest text-center flex-1 md:flex-initial"
                >
                  Trải Nghiệm Sandbox
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE NAVIGATION PILLS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 block lg:hidden">
          <div className="bg-[#050911]/80 backdrop-blur-md p-2.5 rounded-2xl border border-slate-900/60 shadow-xl shadow-purple-500/5">
            <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider block mb-2 px-1 text-left">
              Chuyển Tác Vụ Nhanh (Trượt ngang để xem hết)
            </span>
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 select-none">
              <button
                onClick={() => setActiveSegment('founder')}
                className={`py-2 px-3.5 rounded-xl text-[11px] font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                  activeSegment === 'founder'
                    ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-500/10'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border-transparent hover:bg-slate-905'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 shrink-0" />
                <span>1. Cơ Hội</span>
              </button>

              <button
                onClick={() => setActiveSegment('roadmap')}
                className={`py-2 px-3.5 rounded-xl text-[11px] font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                  activeSegment === 'roadmap'
                    ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-500/10'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border-transparent hover:bg-slate-905'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>2. Lộ Trình</span>
              </button>

              <button
                onClick={() => setActiveSegment('datascience')}
                className={`py-2 px-3.5 rounded-xl text-[11px] font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                  activeSegment === 'datascience'
                    ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-500/10'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border-transparent hover:bg-slate-905'
                }`}
              >
                <Database className="w-3.5 h-3.5 shrink-0" />
                <span>3. Data Science</span>
              </button>

              <button
                onClick={() => setActiveSegment('prompts')}
                className={`py-2 px-3.5 rounded-xl text-[11px] font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                  activeSegment === 'prompts'
                    ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-500/10'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border-transparent hover:bg-slate-905'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 shrink-0" />
                <span>4. Prompts</span>
              </button>

              <button
                onClick={() => setActiveSegment('assistant')}
                className={`py-2 px-3.5 rounded-xl text-[11px] font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                  activeSegment === 'assistant'
                    ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-500/10'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border-transparent hover:bg-slate-905'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 shrink-0" />
                <span>5. AI Trợ Lý</span>
              </button>

              <button
                onClick={() => setActiveSegment('custom_data')}
                className={`py-2 px-3.5 rounded-xl text-[11px] font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                  activeSegment === 'custom_data'
                    ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-500/10'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border-transparent hover:bg-slate-905'
                }`}
              >
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span>6. Sandbox</span>
              </button>

              <button
                onClick={() => setActiveSegment('architecture')}
                className={`py-2 px-3.5 rounded-xl text-[11px] font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                  activeSegment === 'architecture'
                    ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-500/10'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border-transparent hover:bg-slate-905'
                }`}
              >
                <Network className="w-3.5 h-3.5 shrink-0 text-purple-400" />
                <span>7. Sơ đồ AI & Quy trình</span>
              </button>

              <button
                onClick={() => setActiveSegment('game_ml')}
                className={`py-2 px-3.5 rounded-xl text-[11px] font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                  activeSegment === 'game_ml'
                    ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-500/10'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border-transparent hover:bg-slate-905'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5 shrink-0 text-sky-400" />
                <span>8. Game Mobile & ML Labs</span>
              </button>
            </div>
          </div>
        </div>

        {/* CORE CONTAINER */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-4 gap-8">
          {/* NAVIGATION SIDEBAR */}
          <section className="hidden lg:block lg:col-span-1 space-y-4">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-905 space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-3 px-2">Bục điều khiển tác vụ</span>
              
              <button
                onClick={() => setActiveSegment('founder')}
                className={`w-full text-left p-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                  activeSegment === 'founder'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 text-purple-400" />
                  <span>1. Cơ Hội Solo Founder & Tài Chính</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              </button>

              <button
                onClick={() => setActiveSegment('roadmap')}
                className={`w-full text-left p-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                  activeSegment === 'roadmap'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span>2. Tuần Tự A-Z Web Roadmap</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              </button>

              <button
                onClick={() => setActiveSegment('datascience')}
                className={`w-full text-left p-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                  activeSegment === 'datascience'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-purple-400" />
                  <span>3. Đa Ngành Data Science & DS</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              </button>

              <button
                onClick={() => setActiveSegment('prompts')}
                className={`w-full text-left p-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                  activeSegment === 'prompts'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <span>4. Bộ Kỹ Sư Prompt Chuyên Sâu</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              </button>

              <button
                onClick={() => setActiveSegment('assistant')}
                className={`w-full text-left p-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                  activeSegment === 'assistant'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  <span>5. Trợ Lý AI Gemini Chatbot</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              </button>

              <button
                onClick={() => setActiveSegment('custom_data')}
                className={`w-full text-left p-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                  activeSegment === 'custom_data'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>6. Không Gian Dữ Liệu Tự Do</span>
                </span>
                <span className="bg-emerald-500/15 text-emerald-400 text-[9px] font-black px-1.5 py-0.5 rounded border border-emerald-500/25 uppercase font-mono leading-none tracking-tight">Active</span>
              </button>

              <button
                onClick={() => setActiveSegment('architecture')}
                className={`w-full text-left p-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                  activeSegment === 'architecture'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Network className="w-4 h-4 text-purple-400" />
                  <span>7. Sơ đồ AI & Quy trình thực hiện</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              </button>

              <button
                onClick={() => setActiveSegment('game_ml')}
                className={`w-full text-left p-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                  activeSegment === 'game_ml'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Gamepad2 className="w-4 h-4 text-sky-405" />
                  <span>8. Game Mobile & ML Labs</span>
                </span>
                <span className="bg-sky-500/15 text-sky-400 text-[9px] font-black px-1.5 py-0.5 rounded border border-sky-500/25 uppercase font-mono leading-none tracking-tight">New</span>
              </button>
            </div>

            {/* Helpful quick guide box */}
            <div className="bg-slate-950/65 p-4 rounded-xl border border-slate-900 text-xs text-slate-400 space-y-2.5">
              <div className="flex items-center gap-2 text-purple-400 font-bold">
                <Compass className="w-4 h-4 shrink-0" />
                <span>Hướng dẫn học tập nhanh:</span>
              </div>
              <p className="text-[11px] leading-relaxed font-semibold">
                Sử dụng các thẻ bên trái để tuần tự học tập sâu. 
                <br /><br />
                Đặc biệt thẻ <strong className="text-purple-450">Sơ đồ AI & Quy trình</strong> giúp hình dung kết nối vận hành vẹn toàn của 1 Solo Founder!
              </p>
            </div>
          </section>

          {/* ACTIVE WORKSPACE AREA */}
          <section className="lg:col-span-3 space-y-6">
            {activeSegment === 'founder' && <SoloFounderBusiness />}
            {activeSegment === 'roadmap' && <WebAccountingRoadmap />}
            {activeSegment === 'datascience' && <DataScienceEngineering />}
            {activeSegment === 'prompts' && <PromptPlayground />}
            {activeSegment === 'assistant' && <GeminiPlayground />}
            {activeSegment === 'custom_data' && <CustomDataWorkbench />}
            {activeSegment === 'architecture' && <AIEcosystemArchitecture />}
            {activeSegment === 'game_ml' && <GameAndMLWorkbench />}
          </section>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-600 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p>© 2026 LedgerFlow Studio Việt Nam. Toàn bộ giải pháp, lộ trình A-Z vàStar Schema quản trị thuộc bản quyền vẹn toàn.</p>
        </div>
      </footer>
    </div>
  );
}
