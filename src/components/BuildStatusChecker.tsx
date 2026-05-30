import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, ClipboardCheck, Code2, Copy, GitBranch, PlayCircle, ShieldCheck, XCircle } from 'lucide-react';

type CheckKey = 'deps' | 'lint' | 'build' | 'dist' | 'docker' | 'env' | 'security' | 'cloudrun';

type CheckItem = {
  id: CheckKey;
  title: string;
  command: string;
  passText: string;
  failText: string;
  owner: string;
};

const checks: CheckItem[] = [
  { id: 'deps', title: 'Install dependencies', command: 'npm ci', passText: 'Dependencies cài sạch theo package-lock.', failText: 'Kiểm tra package-lock, Node version hoặc dependency conflict.', owner: 'CI' },
  { id: 'lint', title: 'Type check', command: 'npm run lint', passText: 'TypeScript không báo lỗi.', failText: 'Sửa type/import/component props trước khi deploy.', owner: 'Developer/AI' },
  { id: 'build', title: 'Build app', command: 'npm run build', passText: 'Frontend và server bundle build thành công.', failText: 'Xem lỗi Vite/esbuild/TypeScript trong log.', owner: 'CI' },
  { id: 'dist', title: 'Verify dist output', command: 'test -f dist/index.html && test -f dist/server.cjs', passText: 'Có đủ frontend entry và server bundle.', failText: 'Build output thiếu file, cần xem script build.', owner: 'CI' },
  { id: 'docker', title: 'Dockerfile check', command: 'docker build -t plan2predict .', passText: 'Docker image build được cho Cloud Run.', failText: 'Kiểm tra Dockerfile, .dockerignore, npm ci và start command.', owner: 'DevOps' },
  { id: 'env', title: 'Environment variables', command: 'GEMINI_API_KEY + PORT + NODE_ENV', passText: 'Biến môi trường được cấu hình ở Cloud Run.', failText: 'Không đưa key vào frontend; cấu hình env/secrets trên Cloud Run.', owner: 'Cloud Admin' },
  { id: 'security', title: 'Security guardrails', command: '.env không commit + rate limit + prompt length', passText: 'Có kiểm soát secret và giới hạn API cơ bản.', failText: 'Kiểm tra .env, SECURITY.md, server.ts và Cloud Run env.', owner: 'QA/Security' },
  { id: 'cloudrun', title: 'Cloud Run health', command: 'GET /api/health', passText: 'Service trả status ok và model hiện tại.', failText: 'Kiểm tra revision, logs, PORT và start command.', owner: 'Cloud Run' }
];

export default function BuildStatusChecker() {
  const [status, setStatus] = useState<Record<CheckKey, boolean>>({
    deps: true,
    lint: true,
    build: true,
    dist: true,
    docker: true,
    env: true,
    security: true,
    cloudrun: true
  });
  const [copied, setCopied] = useState(false);

  const passed = Object.values(status).filter(Boolean).length;
  const total = checks.length;
  const score = Math.round((passed / total) * 100);
  const ready = score === 100;

  const markdown = useMemo(() => {
    return `# Build Status Checklist\n\n## Summary\n- Passed: ${passed}/${total}\n- Readiness: ${score}%\n- Status: ${ready ? 'Ready for release' : 'Need fixes before release'}\n\n## Checks\n${checks.map(item => `- [${status[item.id] ? 'x' : ' '}] ${item.title} (${item.owner})\n  - Command: ${item.command}\n  - ${status[item.id] ? item.passText : item.failText}`).join('\n')}\n\n## Release rule\nKhông deploy bản mới nếu type check/build fail hoặc thiếu biến môi trường quan trọng.`;
  }, [passed, total, score, ready, status]);

  const copy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-5 text-slate-100 select-text">
      <section className="bg-gradient-to-r from-emerald-950/20 via-[#060a12] to-sky-950/20 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0"><ClipboardCheck className="w-5 h-5" /></div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-widest">Build Status Checker</h2>
            <p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">Checklist mô phỏng trạng thái CI/CD trước khi release: npm ci, lint, build, Docker, env, security và Cloud Run health.</p>
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-3">
        <Metric title="Passed" value={`${passed}/${total}`} tone={ready ? 'emerald' : 'amber'} />
        <Metric title="Readiness" value={`${score}%`} tone={score >= 80 ? 'emerald' : 'rose'} />
        <Metric title="Release status" value={ready ? 'Ready' : 'Fix first'} tone={ready ? 'emerald' : 'rose'} />
      </div>

      <section className="space-y-2">
        {checks.map(item => (
          <label key={item.id} className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer ${status[item.id] ? 'border-emerald-500/25 bg-emerald-950/10' : 'border-rose-500/25 bg-rose-950/10'}`}>
            <input type="checkbox" checked={status[item.id]} onChange={e => setStatus(prev => ({ ...prev, [item.id]: e.target.checked }))} className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xs font-black text-white flex items-center gap-2">{status[item.id] ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}{item.title}</h3>
                <span className="text-[9px] text-slate-500 font-black uppercase">{item.owner}</span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-1"><Code2 className="w-3 h-3" />{item.command}</p>
              <p className={`text-[10.5px] font-semibold mt-1 ${status[item.id] ? 'text-emerald-300' : 'text-rose-300'}`}>{status[item.id] ? item.passText : item.failText}</p>
            </div>
          </label>
        ))}
      </section>

      <div className="grid md:grid-cols-2 gap-4">
        <Panel title="Quy tắc release" icon={ShieldCheck} tone="emerald">Chỉ release khi npm run lint và npm run build pass. Nếu Cloud Run revision mới lỗi, rollback trước rồi sửa commit mới.</Panel>
        <Panel title="Cảnh báo" icon={AlertTriangle} tone="rose">Không deploy khi thiếu GEMINI_API_KEY, build fail, hoặc có dữ liệu thật/API key trong source.</Panel>
      </div>

      <button onClick={copy} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-black rounded-xl flex items-center gap-1.5">
        {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? 'Đã copy' : 'Copy build checklist'}
      </button>
    </div>
  );
}

function Metric({ title, value, tone }: { title: string; value: string; tone: 'emerald' | 'amber' | 'rose' }) {
  const colors = { emerald: 'text-emerald-400 border-emerald-500/25 bg-emerald-950/15', amber: 'text-amber-400 border-amber-500/25 bg-amber-950/15', rose: 'text-rose-400 border-rose-500/25 bg-rose-950/15' }[tone];
  return <div className={`p-3 rounded-xl border ${colors}`}><span className="text-[9px] text-slate-500 font-black uppercase block">{title}</span><p className="text-sm font-black mt-1 font-mono">{value}</p></div>;
}

function Panel({ title, children, icon: Icon, tone }: { title: string; children: React.ReactNode; icon: React.ComponentType<{ className?: string }>; tone: 'emerald' | 'rose' }) {
  const colors = { emerald: 'border-emerald-500/25 bg-emerald-950/15 text-emerald-200', rose: 'border-rose-500/25 bg-rose-950/15 text-rose-200' }[tone];
  return <section className={`p-4 rounded-xl border ${colors}`}><h3 className="text-[10px] font-black uppercase tracking-wider mb-2 text-white flex items-center gap-2"><Icon className="w-4 h-4" />{title}</h3><div className="text-xs font-semibold leading-relaxed">{children}</div></section>;
}
