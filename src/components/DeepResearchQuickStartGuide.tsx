import React, { useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, ClipboardList, Copy, Database, GraduationCap, Rocket, ShieldCheck } from 'lucide-react';

type UserRole = 'beginner' | 'accountant' | 'data_learner' | 'builder' | 'manager';

type Guide = {
  title: string;
  goal: string;
  path: string[];
  doFirst: string[];
  avoid: string[];
};

const guides: Record<UserRole, Guide> = {
  beginner: {
    title: 'Người mới vào Plan2Predict',
    goal: 'Hiểu web này là dashboard học tập/sandbox, không phải phần mềm kế toán vận hành thật.',
    path: ['Deep Research Review Index', 'System Map / About Sandbox', 'Case Study & Scenario Lab', 'Learning Assessment Quiz Lab'],
    doFirst: ['Đọc mục Index để biết toàn bộ hệ thống', 'Chọn 1 case study dễ hiểu', 'Làm quiz để tự kiểm tra', 'Không nhập dữ liệu thật'],
    avoid: ['Nhảy ngay vào cloud/deploy', 'Dùng kết quả sandbox làm kết luận thuế', 'Upload chứng từ thật']
  },
  accountant: {
    title: 'Kế toán / Kiểm soát chi phí',
    goal: 'Học cách kiểm tra chi phí, hồ sơ, bút toán, VAT/TNDN/TNCN và công trình.',
    path: ['Tax & Accounting Rule Library', 'Accounting - Tax Bridge Matrix', 'Expense Compliance Checker', 'Month-end Close Lab'],
    doFirst: ['Chọn khoản chi cần học', 'Xem hồ sơ cần có', 'So sánh kế toán và thuế', 'Copy checklist để áp dụng vào bài tập'],
    avoid: ['Áp dụng máy móc tài khoản gợi ý', 'Bỏ qua chứng từ gốc', 'Không kiểm tra văn bản hiện hành']
  },
  data_learner: {
    title: 'Người học Data / ML',
    goal: 'Hiểu data quality, SQL, explainability, drift và audit analytics trong kế toán xây dựng.',
    path: ['Data Quality & Pipeline Lab', 'SQL Query Playground', 'ML Explainability Lab', 'Project Cost Overrun Checker'],
    doFirst: ['Hiểu lỗi dữ liệu trước khi học model', 'Chạy các rule missing/duplicate/outlier', 'Xem feature contribution', 'Làm quiz Data Science / ML'],
    avoid: ['Tin model tuyệt đối', 'Bỏ qua dữ liệu lỗi', 'Không kiểm tra drift/backtesting']
  },
  builder: {
    title: 'Người build web / AI coding',
    goal: 'Tiếp tục phát triển Plan2Predict mà không phá layout, build hoặc Cloud Run.',
    path: ['Build Status Checker', 'Release Notes Generator', 'Cloud Launch Checklist', 'AI Governance & Data Policy Lab'],
    doFirst: ['Thêm component riêng', 'Commit nhỏ', 'Kiểm tra build/lint', 'Ghi release note', 'Rollback nếu revision lỗi'],
    avoid: ['Đại tu App.tsx khi không cần', 'Sửa quá nhiều module một lúc', 'Commit API key', 'Deploy khi build fail']
  },
  manager: {
    title: 'Người quản lý dự án',
    goal: 'Theo dõi roadmap, rủi ro, governance và hướng phát triển 12-24 tháng.',
    path: ['Product Maturity & Roadmap Lab', 'AI Governance & Data Policy Lab', 'Source & Citation Checklist Lab', 'Project Control & QA Lab'],
    doFirst: ['Chọn track ưu tiên', 'Xem maturity ladder', 'Đặt release gate', 'Duyệt nguồn trước khi thêm nội dung pháp luật/thuế'],
    avoid: ['Thêm tính năng liên tục khi build chưa ổn', 'Không phân quyền review', 'Bỏ qua chính sách dữ liệu']
  }
};

export default function DeepResearchQuickStartGuide() {
  const [role, setRole] = useState<UserRole>('beginner');
  const [copied, setCopied] = useState(false);
  const guide = guides[role];

  const markdown = useMemo(() => `# Deep Research Quick Start Guide\n\n## Vai trò\n${guide.title}\n\n## Mục tiêu\n${guide.goal}\n\n## Lộ trình nên đi\n${guide.path.map((item, index) => `${index + 1}. ${item}`).join('\n')}\n\n## Nên làm trước\n${guide.doFirst.map(item => `- [ ] ${item}`).join('\n')}\n\n## Tránh\n${guide.avoid.map(item => `- ${item}`).join('\n')}\n\n> Quy tắc: học theo lộ trình nhỏ, kiểm tra build/release nếu có sửa code, không dùng dữ liệu thật trong sandbox.`, [guide]);

  const copy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-5 text-slate-100 select-text">
      <section className="bg-gradient-to-r from-emerald-950/20 via-[#060a12] to-blue-950/20 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0"><GraduationCap className="w-5 h-5" /></div>
          <div><h2 className="text-sm font-black text-white uppercase tracking-widest">Deep Research Quick Start Guide</h2><p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">Lộ trình dùng Plan2Predict theo từng vai trò để người học không bị ngợp vì có nhiều module.</p></div>
        </div>
      </section>

      <div><label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">Vai trò</label><select value={role} onChange={e => setRole(e.target.value as UserRole)} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"><option value="beginner">Người mới</option><option value="accountant">Kế toán / kiểm soát chi phí</option><option value="data_learner">Người học Data / ML</option><option value="builder">Người build web / AI coding</option><option value="manager">Người quản lý dự án</option></select></div>

      <section className="p-4 rounded-xl border border-emerald-500/25 bg-emerald-950/15"><h3 className="text-[10px] font-black uppercase tracking-wider mb-2 text-white flex items-center gap-2"><BookOpen className="w-4 h-4 text-emerald-400" />{guide.title}</h3><p className="text-xs text-emerald-100 font-semibold leading-relaxed">{guide.goal}</p></section>

      <div className="grid md:grid-cols-2 gap-4">
        <ListPanel title="Lộ trình nên đi" icon={Rocket} items={guide.path} tone="blue" numbered />
        <ListPanel title="Nên làm trước" icon={CheckCircle2} items={guide.doFirst} tone="emerald" />
        <ListPanel title="Tránh" icon={ShieldCheck} items={guide.avoid} tone="rose" />
        <section className="p-4 rounded-xl border border-slate-850 bg-slate-900/35"><h3 className="text-[10px] font-black uppercase tracking-wider mb-3 text-white flex items-center gap-2"><Database className="w-4 h-4 text-purple-400" />Gợi ý vận hành</h3><p className="text-xs text-slate-300 font-semibold leading-relaxed">Mỗi lần học hoặc sửa code chỉ chọn một module. Sau khi sửa code, kiểm tra Build Status Checker, Release Notes và Cloud Launch Checklist trước khi tiếp tục.</p></section>
      </div>

      <button onClick={copy} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-black rounded-xl flex items-center gap-1.5">{copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}{copied ? 'Đã copy' : 'Copy quick start'}</button>
    </div>
  );
}

function ListPanel({ title, items, icon: Icon, tone, numbered = false }: { title: string; items: string[]; icon: React.ComponentType<{ className?: string }>; tone: 'blue' | 'emerald' | 'rose'; numbered?: boolean }) {
  const colors = { blue: 'text-blue-400 bg-blue-400', emerald: 'text-emerald-400 bg-emerald-400', rose: 'text-rose-400 bg-rose-400' }[tone];
  const [textColor, dotColor] = colors.split(' ');
  return <section className="p-4 rounded-xl border border-slate-850 bg-slate-900/35"><h3 className="text-[10px] font-black uppercase tracking-wider mb-3 text-white flex items-center gap-2"><Icon className={`w-4 h-4 ${textColor}`} />{title}</h3><ul className="space-y-2">{items.map((item, index) => <li key={item} className="text-xs text-slate-300 font-semibold leading-relaxed flex gap-2"><span className={`mt-1.5 ${numbered ? 'w-5 h-5 text-[9px] flex items-center justify-center font-black text-slate-950' : 'w-1.5 h-1.5'} rounded-full shrink-0 ${dotColor}`}>{numbered ? index + 1 : ''}</span>{item}</li>)}</ul></section>;
}
