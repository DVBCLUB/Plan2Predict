import React, { useState } from 'react';
import { BookOpen, Brain, CheckCircle2, Cloud, Database, GitBranch, LockKeyhole, Map, ShieldAlert, Wrench } from 'lucide-react';

type MapSection = 'overview' | 'modules' | 'data_policy' | 'workflow' | 'next_steps';

const sections: { id: MapSection; title: string; subtitle: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'overview', title: 'Tổng quan hệ thống', subtitle: 'Plan2Predict là gì và không phải là gì', icon: Map },
  { id: 'modules', title: 'Bản đồ module', subtitle: 'Các phòng lab đang có trong dashboard', icon: Database },
  { id: 'data_policy', title: 'Quy định dữ liệu', subtitle: 'Dữ liệu nào được nhập, dữ liệu nào không nên nhập', icon: LockKeyhole },
  { id: 'workflow', title: 'Luồng triển khai', subtitle: 'GitHub → Cloud Run → website public', icon: GitBranch },
  { id: 'next_steps', title: 'Ưu tiên tiếp theo', subtitle: 'Việc nên làm sau khi web đã chạy ổn', icon: CheckCircle2 }
];

export default function SystemMapSandbox() {
  const [active, setActive] = useState<MapSection>('overview');
  const current = sections.find(section => section.id === active) ?? sections[0];
  const Icon = current.icon;

  return (
    <div className="space-y-5 text-slate-100 select-text">
      <section className="bg-gradient-to-r from-blue-950/20 via-[#060a12] to-emerald-950/20 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-widest">System Map / About Sandbox</h2>
            <p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">
              Trang giải thích toàn bộ Plan2Predict / LedgerFlow Studio để người mới hiểu đây là dashboard học tập, không phải phần mềm kế toán vận hành thật.
            </p>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-12 gap-5">
        <aside className="lg:col-span-4 space-y-2">
          {sections.map(section => {
            const SectionIcon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActive(section.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${active === section.id ? 'bg-blue-500/10 border-blue-500 ring-1 ring-blue-500/30' : 'bg-[#060a12] border-slate-850 hover:bg-slate-900'}`}
              >
                <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-blue-400 shrink-0">
                  <SectionIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200 block">{section.title}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5 leading-snug">{section.subtitle}</span>
                </div>
              </button>
            );
          })}
        </aside>

        <main className="lg:col-span-8 bg-slate-950/50 border border-slate-850 rounded-2xl p-5 space-y-4">
          <div className="border-b border-slate-850 pb-4">
            <h3 className="text-base font-black text-white flex items-center gap-2"><Icon className="w-5 h-5 text-blue-400" />{current.title}</h3>
            <p className="text-xs text-slate-400 mt-1 font-semibold">{current.subtitle}</p>
          </div>
          {active === 'overview' && <Overview />}
          {active === 'modules' && <Modules />}
          {active === 'data_policy' && <DataPolicy />}
          {active === 'workflow' && <Workflow />}
          {active === 'next_steps' && <NextSteps />}
        </main>
      </div>
    </div>
  );
}

function Panel({ title, children, tone = 'slate' }: { title: string; children: React.ReactNode; tone?: 'slate' | 'blue' | 'emerald' | 'amber' | 'rose' | 'purple' }) {
  const classes = {
    slate: 'border-slate-850 bg-slate-900/35',
    blue: 'border-blue-500/25 bg-blue-950/15',
    emerald: 'border-emerald-500/25 bg-emerald-950/15',
    amber: 'border-amber-500/25 bg-amber-950/15',
    rose: 'border-rose-500/25 bg-rose-950/15',
    purple: 'border-purple-500/25 bg-purple-950/15'
  }[tone];
  return <section className={`p-4 rounded-xl border ${classes}`}><h4 className="text-[10px] font-black uppercase tracking-wider mb-2 text-white">{title}</h4><div className="text-xs text-slate-300 font-semibold leading-relaxed">{children}</div></section>;
}

function Overview() {
  return <div className="space-y-4"><Panel title="Plan2Predict là gì?" tone="blue">Plan2Predict / LedgerFlow Studio là web học tập dạng dashboard sandbox, dùng để mô phỏng kế toán, thuế, kiểm toán dữ liệu, data science, machine learning, DevOps và quản lý dự án AI.</Panel><Panel title="Không phải là gì?" tone="rose">Đây không phải phần mềm kế toán vận hành thật, không thay thế phần mềm hóa đơn, sổ kế toán, hồ sơ thuế, kiểm toán hoặc tư vấn chuyên môn chính thức.</Panel><Panel title="Nguyên tắc phát triển" tone="emerald">Mỗi tính năng mới nên là một component riêng, có dữ liệu mẫu, có cảnh báo sandbox, không phá layout dashboard hiện tại và deploy được trên Cloud Run.</Panel></div>;
}

function Modules() {
  const modules = [
    ['Kho kiến thức kế toán', 'VAS, IFRS, thuế, audit, kế toán xây dựng', BookOpen],
    ['Advanced ML Lab', 'Thuật toán ML, evaluation, forecasting, fraud, data engineering', Brain],
    ['Interactive Tools', 'Expense checker, bút toán, gross-up, cash flow, SQL, checklist', Wrench],
    ['DevOps Cloud Lab', 'GitHub, Docker, Cloud Run, Firebase, cost control, troubleshooting', Cloud],
    ['Project Control QA', 'AI team, nghiệm thu, QA, bug triage, release, rollback, security', ShieldAlert]
  ] as const;
  return <div className="grid md:grid-cols-2 gap-3">{modules.map(([title, desc, Icon]) => <div key={title} className="p-4 bg-[#060a12] border border-slate-850 rounded-xl"><Icon className="w-5 h-5 text-blue-400 mb-2" /><h4 className="text-xs font-black text-white">{title}</h4><p className="text-[10.5px] text-slate-400 font-semibold mt-1 leading-relaxed">{desc}</p></div>)}</div>;
}

function DataPolicy() {
  return <div className="space-y-4"><Panel title="Được nhập" tone="emerald"><ul className="space-y-2 list-disc pl-4"><li>Dữ liệu giả để học tập.</li><li>Dữ liệu đã ẩn danh hoặc đã che thông tin nhạy cảm.</li><li>Ví dụ nghiệp vụ không chứa tên khách hàng thật, MST thật, tài khoản ngân hàng thật.</li></ul></Panel><Panel title="Không nên nhập" tone="rose"><ul className="space-y-2 list-disc pl-4"><li>API key, mật khẩu, service account.</li><li>Hóa đơn/chứng từ thật chưa ẩn danh.</li><li>Dữ liệu lương, ngân hàng, hợp đồng, công nợ thật.</li><li>Thông tin cá nhân hoặc dữ liệu khách hàng nhạy cảm.</li></ul></Panel></div>;
}

function Workflow() {
  const steps = ['Sửa code theo module riêng', 'Commit lên GitHub main', 'Cloud Build tạo container', 'Cloud Run tạo revision mới', 'Test web public', 'Rollback nếu lỗi'];
  return <div className="grid md:grid-cols-3 gap-3">{steps.map((step, index) => <div key={step} className="p-4 bg-[#060a12] border border-slate-850 rounded-xl"><span className="text-[9px] text-emerald-400 font-black font-mono">STEP {index + 1}</span><p className="text-xs font-bold text-white mt-1">{step}</p></div>)}</div>;
}

function NextSteps() {
  return <div className="space-y-4"><Panel title="Ưu tiên kỹ thuật" tone="blue"><ul className="space-y-2 list-disc pl-4"><li>Kiểm tra Cloud Run build sau mỗi commit lớn.</li><li>Giữ max instances thấp khi thử nghiệm.</li><li>Theo dõi Gemini API usage và logs.</li></ul></Panel><Panel title="Ưu tiên sản phẩm" tone="purple"><ul className="space-y-2 list-disc pl-4"><li>Mở rộng Tools theo chiều sâu thay vì thêm menu chính.</li><li>Thêm dữ liệu mẫu copy được.</li><li>Thêm checklist và release note cho từng phase.</li></ul></Panel></div>;
}
