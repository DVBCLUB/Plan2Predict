import React, { useMemo, useState } from 'react';
import { AlertTriangle, Bot, CheckCircle2, ClipboardList, Copy, KeyRound, LockKeyhole, ShieldCheck, UserCheck } from 'lucide-react';

type PolicyArea = 'data' | 'prompt' | 'code' | 'deployment' | 'review';

type PolicyBlock = {
  id: PolicyArea;
  title: string;
  purpose: string;
  allowed: string[];
  prohibited: string[];
  controls: string[];
};

const policies: PolicyBlock[] = [
  {
    id: 'data',
    title: 'Data Classification Policy',
    purpose: 'Phân loại dữ liệu trước khi đưa vào sandbox, AI prompt hoặc GitHub repo.',
    allowed: ['Dữ liệu demo', 'Dữ liệu đã ẩn danh', 'Số liệu mô phỏng', 'Tên nhà cung cấp/khách hàng giả'],
    prohibited: ['API key hoặc mật khẩu', 'Số tài khoản ngân hàng thật', 'Hóa đơn/chứng từ thật chưa che', 'Dữ liệu lương/CCCD/MST cá nhân thật'],
    controls: ['Che thông tin nhạy cảm trước khi upload', 'Không commit file .env', 'Không lưu chứng từ thật trong public repo', 'Dùng SECURITY.md làm baseline']
  },
  {
    id: 'prompt',
    title: 'AI Prompt Safety Policy',
    purpose: 'Kiểm soát nội dung gửi cho AI khi phân tích kế toán, thuế, code hoặc dữ liệu.',
    allowed: ['Prompt với dữ liệu mẫu', 'Yêu cầu phân tích logic nghiệp vụ', 'Yêu cầu viết checklist', 'Yêu cầu sinh code không chứa secret'],
    prohibited: ['Dán mật khẩu/API key', 'Dán dữ liệu khách hàng thật', 'Yêu cầu AI kết luận pháp lý tuyệt đối', 'Yêu cầu bypass kiểm soát bảo mật'],
    controls: ['Dùng prompt template chuẩn', 'Yêu cầu AI nêu giả định', 'Yêu cầu disclaimer khi nói về thuế/pháp lý', 'Kiểm tra đầu ra trước khi áp dụng']
  },
  {
    id: 'code',
    title: 'AI Coding Policy',
    purpose: 'Quy định cách dùng AI sửa code mà không phá cấu trúc dashboard.',
    allowed: ['Thêm component riêng', 'Commit nhỏ theo module', 'Giữ Tailwind style hiện tại', 'Chạy build/lint sau sửa'],
    prohibited: ['Đại tu App.tsx khi không cần', 'Xóa component đang chạy ổn', 'Commit secret vào code', 'Sửa nhiều module lớn cùng lúc'],
    controls: ['Acceptance criteria trước khi code', 'QA Matrix sau khi code', 'Release note mỗi phase', 'Rollback plan nếu Cloud Run lỗi']
  },
  {
    id: 'deployment',
    title: 'Cloud Deployment Policy',
    purpose: 'Giữ Cloud Run/Firebase an toàn, chi phí thấp và dễ rollback.',
    allowed: ['Cloud Run min instances = 0', 'Max instances thấp khi thử nghiệm', 'Env vars/secrets cho API key', 'Firebase rewrite sang Cloud Run khi cần domain'],
    prohibited: ['Public API key ở frontend', 'Bật min instances cao khi chưa cần', 'Deploy khi build fail', 'Không có rollback revision'],
    controls: ['Build Status Checker', 'Cloud Launch Checklist', 'Billing alert', 'Kiểm tra /api/health']
  },
  {
    id: 'review',
    title: 'Human Review Policy',
    purpose: 'Xác định việc nào AI được đề xuất và việc nào phải có người duyệt.',
    allowed: ['AI đề xuất checklist', 'AI sinh case study', 'AI mô phỏng bút toán', 'AI hỗ trợ phân tích rủi ro'],
    prohibited: ['AI tự kết luận hồ sơ thật hợp lệ', 'AI tự quyết toán thuế', 'AI tự duyệt thanh toán', 'AI tự tăng quyền truy cập'],
    controls: ['Người phụ trách duyệt cuối', 'Lưu vết commit/release', 'Tách sandbox khỏi dữ liệu thật', 'Đối chiếu văn bản hiện hành khi dùng thật']
  }
];

export default function AIGovernancePolicyLab() {
  const [area, setArea] = useState<PolicyArea>('data');
  const [owner, setOwner] = useState('Project Owner / Kế toán trưởng / Admin kỹ thuật');
  const [copied, setCopied] = useState(false);
  const selected = policies.find(item => item.id === area) ?? policies[0];

  const markdown = useMemo(() => `# AI Governance Policy\n\n## Policy\n${selected.title}\n\n## Owner\n${owner}\n\n## Purpose\n${selected.purpose}\n\n## Allowed\n${selected.allowed.map(item => `- ${item}`).join('\n')}\n\n## Prohibited\n${selected.prohibited.map(item => `- ${item}`).join('\n')}\n\n## Controls\n${selected.controls.map(item => `- ${item}`).join('\n')}\n\n## Rule\nPlan2Predict là learning sandbox. Không đưa dữ liệu thật, secret hoặc quyết định pháp lý/thuế cuối cùng vào AI nếu chưa có quy trình kiểm soát.`, [selected, owner]);

  const copy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-5 text-slate-100 select-text">
      <section className="bg-gradient-to-r from-rose-950/20 via-[#060a12] to-sky-950/20 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0"><ShieldCheck className="w-5 h-5" /></div>
          <div><h2 className="text-sm font-black text-white uppercase tracking-widest">AI Governance & Data Policy Lab</h2><p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">Quy định sử dụng AI an toàn cho sandbox: dữ liệu, prompt, code, deployment và human review.</p></div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-4">
        <div><FieldLabel>Policy area</FieldLabel><select value={area} onChange={e => setArea(e.target.value as PolicyArea)} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200">{policies.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></div>
        <div><FieldLabel>Owner</FieldLabel><input value={owner} onChange={e => setOwner(e.target.value)} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200" /></div>
      </div>

      <section className="p-4 rounded-xl border border-sky-500/25 bg-sky-950/15"><h3 className="text-[10px] font-black uppercase tracking-wider mb-2 text-white flex items-center gap-2"><Bot className="w-4 h-4 text-sky-400" />Mục tiêu</h3><p className="text-xs text-sky-100 font-semibold leading-relaxed">{selected.purpose}</p></section>

      <div className="grid md:grid-cols-2 gap-4">
        <ListPanel title="Được phép" icon={CheckCircle2} items={selected.allowed} tone="emerald" />
        <ListPanel title="Không được phép" icon={AlertTriangle} items={selected.prohibited} tone="rose" />
      </div>
      <ListPanel title="Controls / Cách kiểm soát" icon={ClipboardList} items={selected.controls} tone="amber" />

      <div className="grid md:grid-cols-3 gap-3">
        <MiniCard icon={LockKeyhole} title="Data" text="Không dữ liệu thật trong public sandbox." />
        <MiniCard icon={KeyRound} title="Secrets" text="API key chỉ nằm trong env/secrets." />
        <MiniCard icon={UserCheck} title="Human review" text="Người phụ trách duyệt kết luận cuối." />
      </div>

      <button onClick={copy} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-black rounded-xl flex items-center gap-1.5">{copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}{copied ? 'Đã copy' : 'Copy policy markdown'}</button>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) { return <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">{children}</label>; }
function ListPanel({ title, items, icon: Icon, tone }: { title: string; items: string[]; icon: React.ComponentType<{ className?: string }>; tone: 'emerald' | 'rose' | 'amber' }) { const colors = { emerald: 'text-emerald-400 bg-emerald-400', rose: 'text-rose-400 bg-rose-400', amber: 'text-amber-400 bg-amber-400' }[tone]; const [textColor, dotColor] = colors.split(' '); return <section className="p-4 rounded-xl border border-slate-850 bg-slate-900/35"><h3 className="text-[10px] font-black uppercase tracking-wider mb-3 text-white flex items-center gap-2"><Icon className={`w-4 h-4 ${textColor}`} />{title}</h3><ul className="space-y-2">{items.map(item => <li key={item} className="text-xs text-slate-300 font-semibold leading-relaxed flex gap-2"><span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />{item}</li>)}</ul></section>; }
function MiniCard({ icon: Icon, title, text }: { icon: React.ComponentType<{ className?: string }>; title: string; text: string }) { return <div className="p-3 bg-[#060a12] border border-slate-850 rounded-xl"><Icon className="w-4 h-4 text-rose-400 mb-2" /><h3 className="text-xs font-black text-white">{title}</h3><p className="text-[10px] text-slate-400 font-semibold mt-1">{text}</p></div>; }
