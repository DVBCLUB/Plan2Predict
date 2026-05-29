import React, { useMemo, useState } from 'react';
import ProjectControlQALab from './ProjectControlQALab';
import ReleaseNotesGenerator from './ReleaseNotesGenerator';
import { AlertTriangle, CheckCircle2, Cloud, Container, Copy, FileText, GitBranch, Globe2, Rocket, Server, ShieldCheck, WalletCards, ClipboardCheck } from 'lucide-react';

type LabKey = 'workflow' | 'cicd' | 'docker' | 'cloudrun' | 'firebase' | 'cost' | 'troubleshoot' | 'project_qa' | 'release_notes';

type LabItem = {
  id: LabKey;
  order: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
};

const labs: LabItem[] = [
  { id: 'workflow', order: '01', title: 'GitHub Workflow Map', subtitle: 'AI sửa code → commit → GitHub → deploy', icon: GitBranch, badge: 'GIT' },
  { id: 'cicd', order: '02', title: 'CI/CD Pipeline Simulator', subtitle: 'Build, test, deploy, logs và rollback', icon: Rocket, badge: 'CI/CD' },
  { id: 'docker', order: '03', title: 'Docker Lab', subtitle: 'Dockerfile, image, container, port 8080', icon: Container, badge: 'DOCKER' },
  { id: 'cloudrun', order: '04', title: 'Google Cloud Run Lab', subtitle: 'Service, revision, trigger, env vars', icon: Cloud, badge: 'CLOUD' },
  { id: 'firebase', order: '05', title: 'Firebase Hosting Lab', subtitle: 'Hosting, rewrite, domain, SSL', icon: Globe2, badge: 'FIREBASE' },
  { id: 'cost', order: '06', title: 'Cost Control Lab', subtitle: 'Min 0, max 1, billing alert, quota', icon: WalletCards, badge: 'COST' },
  { id: 'troubleshoot', order: '07', title: 'Troubleshooting Playbook', subtitle: 'Nhìn lỗi build/runtime và xử lý nhanh', icon: AlertTriangle, badge: 'FIX' },
  { id: 'project_qa', order: '08', title: 'Project Control & QA Lab', subtitle: 'AI PM, nghiệm thu, QA, release, rollback', icon: ClipboardCheck, badge: 'QA' },
  { id: 'release_notes', order: '09', title: 'Release Notes Generator', subtitle: 'Tạo ghi chú release sau mỗi lần AI sửa code', icon: FileText, badge: 'NOTE' }
];

const codeSamples: Record<string, string> = {
  dockerfile: `FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080
CMD ["npm", "run", "start"]`,
  env: `NODE_ENV=production
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-2.5-flash
PORT=8080`,
  firebase: `{
  "hosting": {
    "public": "dist",
    "rewrites": [
      {
        "source": "**",
        "run": {
          "serviceId": "plan2predict",
          "region": "asia-southeast1"
        }
      }
    ]
  }
}`
};

export default function DevOpsDeploymentLab() {
  const [activeLab, setActiveLab] = useState<LabKey>('workflow');
  const current = labs.find(lab => lab.id === activeLab) ?? labs[0];
  const Icon = current.icon;

  if (activeLab === 'project_qa') {
    return <ProjectControlQALab />;
  }

  if (activeLab === 'release_notes') {
    return <ReleaseNotesGenerator />;
  }

  return (
    <div className="space-y-6 text-slate-100 select-text pb-12">
      <section className="bg-gradient-to-r from-sky-950/20 via-[#060a12] to-emerald-950/20 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-44 h-44 rounded-full bg-sky-500/5 blur-3xl" />
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              🚀 DevOps & Cloud Deployment Lab
              <span className="px-2 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/25 text-[9px] font-black rounded font-mono">GITHUB · DOCKER · CLOUD RUN · FIREBASE</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed max-w-4xl">
              Phòng lab giúp người không chuyên lập trình hiểu cách AI sửa code, push GitHub, build Docker, deploy Cloud Run/Firebase, đọc lỗi và khóa chi phí.
            </p>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-4 space-y-2">
          {labs.map(lab => {
            const LabIcon = lab.icon;
            return (
              <button key={lab.id} onClick={() => setActiveLab(lab.id)} className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${activeLab === lab.id ? 'bg-sky-500/10 border-sky-500 ring-1 ring-sky-500/30' : 'bg-[#060a12] border-slate-850 hover:bg-slate-900'}`}>
                <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-sky-400 shrink-0"><LabIcon className="w-4 h-4" /></div>
                <div>
                  <span className="text-[9px] font-black text-slate-500 font-mono">{lab.order} · {lab.badge}</span>
                  <span className="text-xs font-bold text-slate-200 block mt-0.5">{lab.title}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5 leading-snug">{lab.subtitle}</span>
                </div>
              </button>
            );
          })}
        </aside>

        <main className="lg:col-span-8 bg-slate-950/50 border border-slate-850 rounded-2xl p-5 space-y-5">
          <div className="border-b border-slate-850 pb-4">
            <span className="text-[9px] font-black text-sky-400 font-mono uppercase tracking-widest">{current.order} · {current.badge}</span>
            <h2 className="text-base font-black text-white mt-1 flex items-center gap-2"><Icon className="w-5 h-5 text-sky-400" />{current.title}</h2>
            <p className="text-xs text-slate-400 mt-1 font-semibold">{current.subtitle}</p>
          </div>

          {activeLab === 'workflow' && <WorkflowMap />}
          {activeLab === 'cicd' && <CicdSimulator />}
          {activeLab === 'docker' && <DockerLab />}
          {activeLab === 'cloudrun' && <CloudRunLab />}
          {activeLab === 'firebase' && <FirebaseLab />}
          {activeLab === 'cost' && <CostControlLab />}
          {activeLab === 'troubleshoot' && <TroubleshootingPlaybook />}
        </main>
      </div>
    </div>
  );
}

function Panel({ title, children, tone = 'slate' }: { title: string; children: React.ReactNode; tone?: 'slate' | 'sky' | 'emerald' | 'amber' | 'rose' | 'purple' }) {
  const classes = {
    slate: 'border-slate-850 bg-slate-900/35',
    sky: 'border-sky-500/25 bg-sky-950/15',
    emerald: 'border-emerald-500/25 bg-emerald-950/15',
    amber: 'border-amber-500/25 bg-amber-950/15',
    rose: 'border-rose-500/25 bg-rose-950/15',
    purple: 'border-purple-500/25 bg-purple-950/15'
  }[tone];
  return <section className={`p-4 rounded-xl border ${classes}`}><h3 className="text-[10px] font-black uppercase tracking-wider mb-3 text-white">{title}</h3><div className="text-xs text-slate-300 font-semibold leading-relaxed">{children}</div></section>;
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return <div className="space-y-2"><button onClick={copy} className="text-[9px] font-bold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-2 py-1 rounded flex items-center gap-1 ml-auto">{copied ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}{copied ? 'Copied' : 'Copy'}</button><pre className="p-4 bg-[#02050b] border border-slate-850 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap">{code}</pre></div>;
}

function WorkflowMap() {
  const steps = ['AI/Developer sửa code', 'Commit vào GitHub main', 'Cloud Build trigger chạy', 'Docker image được build', 'Cloud Run tạo revision mới', 'Website public cập nhật'];
  return <div className="space-y-4"><div className="grid md:grid-cols-3 gap-3">{steps.map((step, index) => <div key={step} className="p-4 bg-[#060a12] border border-slate-850 rounded-xl"><span className="text-[9px] text-sky-400 font-black font-mono">STEP {index + 1}</span><p className="text-xs font-bold text-white mt-1">{step}</p></div>)}</div><Panel title="Nguyên tắc kiểm soát" tone="sky">Mỗi thay đổi phải có commit rõ nghĩa. Nếu web lỗi sau deploy, tìm commit gần nhất, xem build logs, sau đó rollback revision hoặc sửa commit mới.</Panel></div>;
}

function CicdSimulator() {
  const [hasDockerfile, setHasDockerfile] = useState(true);
  const [hasEnv, setHasEnv] = useState(true);
  const [buildOk, setBuildOk] = useState(true);
  const result = useMemo(() => {
    if (!hasDockerfile) return { status: 'Build failed', tone: 'rose' as const, msg: 'Thiếu Dockerfile ở root repo. Cloud Build không biết build container.' };
    if (!buildOk) return { status: 'Build failed', tone: 'rose' as const, msg: 'npm run build lỗi. Cần xem log TypeScript/Vite để sửa.' };
    if (!hasEnv) return { status: 'Runtime warning', tone: 'amber' as const, msg: 'Deploy có thể thành công nhưng Gemini API lỗi vì thiếu GEMINI_API_KEY.' };
    return { status: 'Deploy success', tone: 'emerald' as const, msg: 'Pipeline đủ điều kiện cơ bản: có Dockerfile, build pass, env vars đã cấu hình.' };
  }, [hasDockerfile, hasEnv, buildOk]);
  return <div className="space-y-4"><div className="grid md:grid-cols-3 gap-3">{[[hasDockerfile, setHasDockerfile, 'Có Dockerfile'], [buildOk, setBuildOk, 'npm run build pass'], [hasEnv, setHasEnv, 'Có GEMINI_API_KEY']].map(([value, setter, label]) => <label key={label as string} className="p-3 bg-[#060a12] border border-slate-850 rounded-xl text-xs font-semibold flex items-center gap-2"><input type="checkbox" checked={value as boolean} onChange={e => (setter as React.Dispatch<React.SetStateAction<boolean>>)(e.target.checked)} />{label as string}</label>)}</div><Panel title={result.status} tone={result.tone}>{result.msg}</Panel></div>;
}

function DockerLab() {
  return <div className="space-y-4"><Panel title="Dockerfile chuẩn cho app hiện tại" tone="sky">Cloud Run chạy container. Vì vậy repo cần Dockerfile ở thư mục gốc, app phải lắng nghe cổng từ biến môi trường PORT.</Panel><CodeBlock code={codeSamples.dockerfile} /><Panel title="Lỗi hay gặp" tone="amber"><ul className="space-y-2 list-disc pl-4"><li>Cloud Build báo không tìm thấy Dockerfile: build đang ở commit cũ hoặc Dockerfile không nằm ở root.</li><li>Container không start: app không listen đúng PORT.</li><li>Build chậm/lỗi: kiểm tra package-lock và TypeScript error.</li></ul></Panel></div>;
}

function CloudRunLab() {
  return <div className="space-y-4"><Panel title="Cấu hình Cloud Run đề xuất" tone="emerald"><ul className="space-y-2 list-disc pl-4"><li>Service name: plan2predict</li><li>Region: asia-southeast1</li><li>Authentication: Allow public access</li><li>Billing: Request-based</li><li>Minimum instances: 0</li><li>Maximum instances: 1 khi mới thử nghiệm</li></ul></Panel><Panel title="Environment variables" tone="sky"><CodeBlock code={codeSamples.env} /></Panel><Panel title="Revision là gì?" tone="purple">Mỗi lần deploy tạo một revision. Nếu revision mới lỗi, có thể rollback về revision trước đang chạy ổn.</Panel></div>;
}

function FirebaseLab() {
  return <div className="space-y-4"><Panel title="Khi nào dùng Firebase Hosting?" tone="sky">Dùng Firebase Hosting làm lớp public URL/custom domain/SSL/CDN. Với app có Express backend, nên rewrite sang Cloud Run thay vì chỉ host static.</Panel><CodeBlock code={codeSamples.firebase} /><Panel title="Domain ngắn" tone="emerald">Trước mắt dùng URL Cloud Run hoặc project.web.app. Khi ổn định mới mua domain ngắn rồi map custom domain trong Firebase Hosting hoặc Cloud Run.</Panel></div>;
}

function CostControlLab() {
  const checklist = ['Minimum instances = 0', 'Maximum instances = 1 lúc thử nghiệm', 'Request-based billing', 'Tạo Billing Alert', 'Không public API key ở frontend', 'Giới hạn/quản lý Gemini API key', 'Xem logs khi request tăng bất thường'];
  return <div className="space-y-4"><Panel title="Checklist khóa chi phí" tone="emerald"><ul className="space-y-2">{checklist.map(item => <li key={item} className="flex gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />{item}</li>)}</ul></Panel><Panel title="Nguyên tắc ngân sách thấp" tone="amber">Không bật min instances &gt; 0 khi chưa cần. Không tăng max instances nếu web chỉ là dashboard học tập. Không để key AI bị gọi không kiểm soát.</Panel></div>;
}

function TroubleshootingPlaybook() {
  const rows = [
    ['No Dockerfile', 'Build đang không thấy Dockerfile', 'Deploy commit mới nhất hoặc đặt Dockerfile ở root'],
    ['Container failed to start', 'App không listen đúng PORT hoặc start command lỗi', 'Kiểm tra server.ts, PORT, npm run start'],
    ['Gemini key missing', 'Thiếu GEMINI_API_KEY', 'Thêm env var trong Cloud Run'],
    ['Model not found', 'Tên model Gemini không hợp lệ', 'Đổi GEMINI_MODEL sang model đang hỗ trợ'],
    ['Website trắng', 'Build frontend lỗi hoặc JS runtime lỗi', 'Mở browser console và Cloud Run logs']
  ];
  return <div className="overflow-x-auto rounded-xl border border-slate-850"><table className="w-full text-[11px]"><thead className="bg-slate-900 text-slate-500 uppercase font-black"><tr><th className="p-3 text-left">Lỗi</th><th className="p-3 text-left">Nghĩa là gì</th><th className="p-3 text-left">Cách xử lý</th></tr></thead><tbody className="divide-y divide-slate-900 text-slate-300 font-semibold">{rows.map(row => <tr key={row[0]} className="hover:bg-slate-900/30">{row.map(cell => <td key={cell} className="p-3">{cell}</td>)}</tr>)}</tbody></table></div>;
}
