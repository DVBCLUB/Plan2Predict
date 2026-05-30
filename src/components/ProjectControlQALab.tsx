import React, { useMemo, useState } from 'react';
import SystemMapSandbox from './SystemMapSandbox';
import MonthEndCloseLab from './MonthEndCloseLab';
import { Bot, Bug, CheckCircle2, ClipboardCheck, FileCheck2, KeyRound, ListChecks, LockKeyhole, Map, RotateCcw, ShieldCheck, Target, TestTube2, FileSpreadsheet } from 'lucide-react';

type TabKey = 'ai_team' | 'acceptance' | 'qa_matrix' | 'bug_triage' | 'release' | 'rollback' | 'risk_register' | 'security_governance' | 'roadmap_backlog' | 'system_map' | 'month_end_close';

type TabItem = { id: TabKey; order: string; title: string; subtitle: string; icon: React.ComponentType<{ className?: string }>; badge: string; };

const tabs: TabItem[] = [
  { id: 'ai_team', order: '01', title: 'AI Team Assignment', subtitle: 'Giao việc cho ChatGPT, Claude, Gemini, Copilot', icon: Bot, badge: 'AI' },
  { id: 'acceptance', order: '02', title: 'Acceptance Criteria Builder', subtitle: 'Tiêu chí nghiệm thu cho từng tính năng', icon: Target, badge: 'AC' },
  { id: 'qa_matrix', order: '03', title: 'QA Test Matrix', subtitle: 'Checklist test UI, dữ liệu, API, deploy', icon: TestTube2, badge: 'QA' },
  { id: 'bug_triage', order: '04', title: 'Bug Triage Board', subtitle: 'Phân loại lỗi theo mức độ và cách xử lý', icon: Bug, badge: 'BUG' },
  { id: 'release', order: '05', title: 'Release Checklist', subtitle: 'Trước khi push/deploy phải kiểm tra gì', icon: FileCheck2, badge: 'REL' },
  { id: 'rollback', order: '06', title: 'Rollback Plan', subtitle: 'Khi web lỗi thì quay lại bản ổn định', icon: RotateCcw, badge: 'SAFE' },
  { id: 'risk_register', order: '07', title: 'Risk Register', subtitle: 'Sổ rủi ro dự án cho người không chuyên code', icon: ShieldCheck, badge: 'RISK' },
  { id: 'security_governance', order: '08', title: 'Security & Data Governance', subtitle: 'API key, dữ liệu mẫu, quyền truy cập, audit trail', icon: LockKeyhole, badge: 'SEC' },
  { id: 'roadmap_backlog', order: '09', title: 'Roadmap & Backlog Planner', subtitle: 'Lộ trình phát triển theo phase, ưu tiên và tiêu chí xong', icon: ListChecks, badge: 'PLAN' },
  { id: 'system_map', order: '10', title: 'System Map / About Sandbox', subtitle: 'Bản đồ tổng thể dự án cho người mới', icon: Map, badge: 'MAP' },
  { id: 'month_end_close', order: '11', title: 'Month-end Close Lab', subtitle: 'Khóa sổ cuối tháng và đối chiếu số liệu', icon: FileSpreadsheet, badge: 'CLOSE' }
];

const aiAssignments = [
  { ai: 'ChatGPT', bestAt: 'Thiết kế hệ thống, kiểm tra logic, viết tài liệu, refactor an toàn', prompt: 'Hãy phân tích cấu trúc repo, đề xuất cách thêm tính năng không phá layout hiện tại, sau đó chia thành các bước commit nhỏ.' },
  { ai: 'Claude', bestAt: 'Viết component dài, UI content, mô tả nghiệp vụ, tạo bản prototype lớn', prompt: 'Hãy viết component React hoàn chỉnh, giữ style Tailwind hiện tại, không thay đổi App.tsx nếu chưa được yêu cầu.' },
  { ai: 'Gemini', bestAt: 'Tích hợp Google ecosystem, Cloud Run, Firebase, Google AI Studio', prompt: 'Hãy kiểm tra cấu hình deploy Google Cloud/Firebase và đề xuất biến môi trường, billing, domain, logs.' },
  { ai: 'Copilot/Codex', bestAt: 'Sửa trực tiếp trong repo, chạy test, debug build error', prompt: 'Hãy sửa lỗi build/type trong repo, chạy npm run build, commit thay đổi nhỏ và giải thích file nào đã sửa.' }
];

export default function ProjectControlQALab() {
  const [activeTab, setActiveTab] = useState<TabKey>('ai_team');
  const current = tabs.find(tab => tab.id === activeTab) ?? tabs[0];
  const Icon = current.icon;

  if (activeTab === 'system_map') return <SystemMapSandbox />;
  if (activeTab === 'month_end_close') return <MonthEndCloseLab />;

  return (
    <div className="space-y-6 text-slate-100 select-text pb-12">
      <section className="bg-gradient-to-r from-amber-950/20 via-[#060a12] to-sky-950/20 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-44 h-44 rounded-full bg-amber-500/5 blur-3xl" />
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0"><ClipboardCheck className="w-6 h-6" /></div>
          <div>
            <h1 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">✅ Project Control & QA Lab <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/25 text-[9px] font-black rounded font-mono">AI PM · QA · RELEASE · SECURITY</span></h1>
            <p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed max-w-4xl">Phòng lab dành cho người quản lý dự án không chuyên code: giao việc cho AI, nghiệm thu tính năng, test build, phân loại lỗi, release, rollback, backlog, khóa sổ và kiểm soát bảo mật dữ liệu.</p>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-4 space-y-2">
          {tabs.map(tab => {
            const TabIcon = tab.icon;
            return <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${activeTab === tab.id ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/30' : 'bg-[#060a12] border-slate-850 hover:bg-slate-900'}`}><div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400 shrink-0"><TabIcon className="w-4 h-4" /></div><div><span className="text-[9px] font-black text-slate-500 font-mono">{tab.order} · {tab.badge}</span><span className="text-xs font-bold text-slate-200 block mt-0.5">{tab.title}</span><span className="text-[10px] text-slate-500 block mt-0.5 leading-snug">{tab.subtitle}</span></div></button>;
          })}
        </aside>

        <main className="lg:col-span-8 bg-slate-950/50 border border-slate-850 rounded-2xl p-5 space-y-5">
          <div className="border-b border-slate-850 pb-4"><span className="text-[9px] font-black text-amber-400 font-mono uppercase tracking-widest">{current.order} · {current.badge}</span><h2 className="text-base font-black text-white mt-1 flex items-center gap-2"><Icon className="w-5 h-5 text-amber-400" />{current.title}</h2><p className="text-xs text-slate-400 mt-1 font-semibold">{current.subtitle}</p></div>
          {activeTab === 'ai_team' && <AITeamAssignment />}
          {activeTab === 'acceptance' && <AcceptanceBuilder />}
          {activeTab === 'qa_matrix' && <QAMatrix />}
          {activeTab === 'bug_triage' && <BugTriage />}
          {activeTab === 'release' && <ReleaseChecklist />}
          {activeTab === 'rollback' && <RollbackPlan />}
          {activeTab === 'risk_register' && <RiskRegister />}
          {activeTab === 'security_governance' && <SecurityGovernance />}
          {activeTab === 'roadmap_backlog' && <RoadmapBacklog />}
        </main>
      </div>
    </div>
  );
}

function Panel({ title, children, tone = 'slate' }: { title: string; children: React.ReactNode; tone?: 'slate' | 'amber' | 'emerald' | 'rose' | 'sky' | 'purple' }) {
  const toneClass = { slate: 'border-slate-850 bg-slate-900/35', amber: 'border-amber-500/25 bg-amber-950/15', emerald: 'border-emerald-500/25 bg-emerald-950/15', rose: 'border-rose-500/25 bg-rose-950/15', sky: 'border-sky-500/25 bg-sky-950/15', purple: 'border-purple-500/25 bg-purple-950/15' }[tone];
  return <section className={`p-4 rounded-xl border ${toneClass}`}><h3 className="text-[10px] font-black uppercase tracking-wider mb-3 text-white">{title}</h3><div className="text-xs text-slate-300 font-semibold leading-relaxed">{children}</div></section>;
}

function AITeamAssignment() {
  return <div className="space-y-4"><Panel title="Nguyên tắc giao việc cho AI" tone="amber">Không giao một AI làm tất cả. Hãy chia vai: người thiết kế, người viết code, người kiểm tra, người deploy. Mỗi lần chỉ yêu cầu thay đổi nhỏ, có tiêu chí nghiệm thu rõ.</Panel><div className="grid md:grid-cols-2 gap-3">{aiAssignments.map(item => <div key={item.ai} className="p-4 bg-[#060a12] border border-slate-850 rounded-xl"><h3 className="text-sm font-black text-white">{item.ai}</h3><p className="text-[11px] text-amber-300 font-semibold mt-1">{item.bestAt}</p><p className="text-[10.5px] text-slate-400 mt-3 font-mono leading-relaxed">{item.prompt}</p></div>)}</div></div>;
}

function AcceptanceBuilder() {
  const [feature, setFeature] = useState('Expense Compliance Checker');
  const criteria = useMemo(() => [`Tính năng ${feature} mở được từ menu đang có.`, 'Không làm thay đổi layout header/sidebar/footer hiện tại.', 'Có dữ liệu mẫu để người dùng bấm thử ngay.', 'Có cảnh báo rõ đây là sandbox học tập, không thay tư vấn chính thức.', 'Không đưa API key hoặc dữ liệu bí mật vào frontend.', 'Build/deploy không lỗi trên Cloud Run.'], [feature]);
  return <div className="space-y-4"><div><label className="text-[10px] text-slate-500 font-black uppercase">Tên tính năng</label><input value={feature} onChange={e => setFeature(e.target.value)} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs" /></div><Panel title="Acceptance Criteria" tone="emerald"><ul className="space-y-2">{criteria.map(item => <li key={item} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />{item}</li>)}</ul></Panel></div>;
}

function QAMatrix() {
  const rows = [['UI/Layout', 'Mở desktop/mobile, kiểm tra sidebar, overflow, text không vỡ', 'Manual'], ['Navigation', 'Bấm từng mục menu, quay lại, không crash', 'Manual'], ['Build', 'npm run build pass', 'Automated'], ['Cloud Run', 'Revision mới chạy, health endpoint ok', 'Cloud'], ['Gemini API', 'Thiếu key hiện lỗi thân thiện, có key thì gọi được', 'API'], ['Cost', 'min 0, max 1, request-based billing', 'Cloud config'], ['Security', 'Không lộ API key, không dùng dữ liệu thật trong sandbox', 'Review'], ['Month-end Close', 'Checklist khóa sổ copy được, reconciliation tính đúng chênh lệch', 'Business QA']];
  return <Table headers={['Nhóm test', 'Cần kiểm tra', 'Loại']} rows={rows} />;
}

function BugTriage() {
  const [impact, setImpact] = useState(3);
  const [frequency, setFrequency] = useState(2);
  const score = impact * frequency;
  const level = score >= 12 ? 'P0/P1 - xử lý ngay' : score >= 6 ? 'P2 - xử lý trong đợt gần nhất' : 'P3 - ghi nhận backlog';
  return <div className="space-y-4"><div className="grid md:grid-cols-2 gap-4"><div><label className="text-[10px] text-slate-500 font-black uppercase">Impact 1-5</label><input type="range" min="1" max="5" value={impact} onChange={e => setImpact(Number(e.target.value))} className="w-full accent-amber-500" /><p className="text-xs text-amber-400 font-mono">{impact}</p></div><div><label className="text-[10px] text-slate-500 font-black uppercase">Frequency 1-5</label><input type="range" min="1" max="5" value={frequency} onChange={e => setFrequency(Number(e.target.value))} className="w-full accent-amber-500" /><p className="text-xs text-amber-400 font-mono">{frequency}</p></div></div><Panel title="Mức ưu tiên" tone={score >= 12 ? 'rose' : score >= 6 ? 'amber' : 'emerald'}><span className="text-xl font-black">{level}</span><p className="mt-2">Score = Impact x Frequency = {score}</p></Panel></div>;
}

function ReleaseChecklist() {
  const items = ['Đã test desktop/mobile.', 'Không đổi layout chính nếu không cần.', 'npm run build pass.', 'Không commit .env/API key.', 'Commit message rõ nghĩa.', 'Cloud Run revision mới chạy được.', 'Có đường rollback nếu lỗi.', 'Ghi release note ngắn gọn.'];
  return <Panel title="Checklist trước khi deploy" tone="emerald"><ul className="space-y-2">{items.map(item => <li key={item} className="flex gap-2"><ListChecks className="w-4 h-4 text-emerald-400 shrink-0" />{item}</li>)}</ul></Panel>;
}

function RollbackPlan() {
  const steps = ['Xác định revision/commit đang lỗi.', 'Mở Cloud Run → Revisions.', 'Chọn revision cũ đang chạy ổn.', 'Route traffic 100% về revision cũ.', 'Ghi lại lỗi và commit gây lỗi.', 'Sửa trên GitHub bằng commit mới, không sửa nóng lung tung.'];
  return <div className="space-y-4"><Panel title="Rollback Cloud Run" tone="sky"><ul className="space-y-2">{steps.map(step => <li key={step} className="flex gap-2"><RotateCcw className="w-4 h-4 text-sky-400 shrink-0" />{step}</li>)}</ul></Panel><Panel title="Nguyên tắc" tone="rose">Không cố sửa trực tiếp trên production khi chưa hiểu lỗi. Rollback trước để web sống lại, sau đó mới debug bình tĩnh.</Panel></div>;
}

function RiskRegister() {
  const rows = [['Lộ API key', 'Cao', 'Không commit .env, dùng env vars/secrets'], ['Chi phí Cloud tăng', 'Cao', 'min 0, max 1, billing alert'], ['AI sửa phá layout', 'Vừa', 'Component riêng, không sửa App.tsx quá nhiều'], ['Build fail sau push', 'Vừa', 'Xem logs, sửa type/build, rollback nếu cần'], ['Nội dung thuế sai/ngộ nhận', 'Cao', 'Gắn disclaimer, kiểm tra với văn bản pháp luật khi dùng thật'], ['Dự án phình quá lớn', 'Vừa', 'Chia module, roadmap theo phase, xóa phần thừa']];
  return <Table headers={['Rủi ro', 'Mức', 'Cách kiểm soát']} rows={rows} />;
}

function SecurityGovernance() {
  const rows = [['API key', 'Chỉ lưu ở Cloud Run env vars/secrets, không để trong frontend hay README'], ['Dữ liệu học tập', 'Dùng dữ liệu giả/masked data, không upload chứng từ thật nếu chưa có chính sách'], ['Quyền GitHub', 'Không cấp quyền write cho người không cần; dùng branch/PR nếu làm việc nhóm'], ['Audit trail', 'Mọi thay đổi phải qua commit, có message và người thực hiện'], ['Prompt AI', 'Không paste mật khẩu, API key, dữ liệu khách hàng, số tài khoản ngân hàng thật'], ['Public web', 'Chỉ public nội dung học tập; API nhạy cảm phải có kiểm soát request']];
  return <div className="space-y-4"><Panel title="Security baseline cho Plan2Predict" tone="sky">Vì đây là web học tập public, nguyên tắc là không đưa dữ liệu thật và không để secret ở phía trình duyệt. AI chỉ nên dùng để phân tích dữ liệu mẫu hoặc dữ liệu đã ẩn danh.</Panel><Table headers={['Mảng', 'Nguyên tắc kiểm soát']} rows={rows.map(row => [row[0], row[1]])} /><Panel title="Checklist trước khi đưa dữ liệu vào sandbox" tone="amber"><ul className="space-y-2"><li className="flex gap-2"><KeyRound className="w-4 h-4 text-amber-400 shrink-0" />Xóa tên khách hàng, MST, số tài khoản, địa chỉ, số điện thoại nếu không cần.</li><li className="flex gap-2"><LockKeyhole className="w-4 h-4 text-amber-400 shrink-0" />Không đưa API key vào prompt hoặc file upload.</li><li className="flex gap-2"><ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />Chỉ dùng dữ liệu giả cho demo public.</li></ul></Panel></div>;
}

function RoadmapBacklog() {
  const [focus, setFocus] = useState('tools');
  const roadmap = { tools: ['Mở rộng Expense Checker theo ngành xây dựng', 'Thêm Journal Simulator có nhập số tiền/VAT', 'Thêm xuất checklist dạng markdown để copy'], accounting: ['Bổ sung VAS 21/24/25', 'Thêm Month-end Close / Reconciliation Lab', 'Tạo bảng đối chiếu kế toán-thuế cho từng khoản chi'], ml: ['Thêm SHAP/feature importance mô phỏng', 'Thêm model drift monitor', 'Thêm mini dataset mẫu để chạy fraud scoring'], devops: ['Thêm build status checklist', 'Thêm release note generator', 'Thêm hướng dẫn custom domain Firebase/Cloud Run'] } as const;
  const items = roadmap[focus as keyof typeof roadmap];
  return <div className="space-y-4"><Panel title="Roadmap nguyên tắc" tone="amber">Ưu tiên module có thể bấm thử, học được ngay, không phá layout. Mỗi phase chỉ nên sửa 1-2 component và có tiêu chí nghiệm thu rõ.</Panel><div><label className="text-[10px] text-slate-500 font-black uppercase">Nhóm ưu tiên</label><select value={focus} onChange={e => setFocus(e.target.value)} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs"><option value="tools">Interactive Tools</option><option value="accounting">Accounting Knowledge</option><option value="ml">Advanced ML</option><option value="devops">DevOps / Cloud</option></select></div><Panel title="Backlog đề xuất tiếp theo" tone="emerald"><ul className="space-y-2">{items.map(item => <li key={item} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />{item}</li>)}</ul></Panel><Table headers={['Tiêu chí Done', 'Mô tả']} rows={[['Build pass', 'Cloud Run build không lỗi'], ['UI không vỡ', 'Desktop/mobile vẫn xem được'], ['Có dữ liệu mẫu', 'Người học bấm thử ngay không cần nhập quá nhiều'], ['Không lộ secret', 'Không có API key hoặc dữ liệu thật trong code'], ['Có rollback', 'Biết commit/revision để quay lại nếu lỗi']]} /></div>;
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return <div className="overflow-x-auto rounded-xl border border-slate-850"><table className="w-full text-[11px]"><thead className="bg-slate-900 text-slate-500 uppercase font-black"><tr>{headers.map(header => <th key={header} className="p-3 text-left">{header}</th>)}</tr></thead><tbody className="divide-y divide-slate-900 text-slate-300 font-semibold">{rows.map(row => <tr key={row.join('|')} className="hover:bg-slate-900/30">{row.map(cell => <td key={cell} className="p-3">{cell}</td>)}</tr>)}</tbody></table></div>;
}
