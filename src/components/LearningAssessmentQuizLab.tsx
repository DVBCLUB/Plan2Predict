import React, { useMemo, useState } from 'react';
import { Award, CheckCircle2, Copy, HelpCircle, Lightbulb, RotateCcw, Target, XCircle } from 'lucide-react';

type QuizKey = 'accounting_tax' | 'data_ml' | 'devops_governance';

type Question = {
  question: string;
  options: string[];
  answer: number;
  explain: string;
};

const quizzes: Record<QuizKey, { title: string; goal: string; questions: Question[] }> = {
  accounting_tax: {
    title: 'Accounting / Tax / Audit Quiz',
    goal: 'Kiểm tra hiểu biết về hồ sơ chi phí, VAT, TNDN, TNCN và kiểm soát công trình.',
    questions: [
      { question: 'Chi phí vật tư công trình nên có thông tin quan trọng nào để kiểm soát TK 154?', options: ['Mã công trình/hạng mục', 'Màu hóa đơn', 'Tên người nhập liệu là đủ', 'Không cần phiếu xuất kho'], answer: 0, explain: 'Mã công trình/hạng mục giúp tập hợp chi phí, đối chiếu dự toán và kết chuyển giá vốn.' },
      { question: 'Gross-up TNCN nên được thể hiện ở đâu để tránh lệch hồ sơ?', options: ['Chỉ sửa riêng bảng thanh toán', 'Thống nhất hợp đồng, nghiệm thu, bảng thanh toán và chứng từ chi trả', 'Chỉ ghi chú miệng', 'Không cần thể hiện'], answer: 1, explain: 'Gross-up cần nhất quán giữa hồ sơ pháp lý, kế toán và thanh toán.' },
      { question: 'Audit analytics phát hiện thanh toán trùng có nghĩa là gì?', options: ['Chắc chắn gian lận', 'Chỉ là tín hiệu cần đối chiếu chứng từ', 'Không cần kiểm tra', 'Tự động xóa giao dịch'], answer: 1, explain: 'Kết quả phân tích dữ liệu là tín hiệu chọn mẫu, không thay thế chứng từ gốc và xét đoán nghề nghiệp.' }
    ]
  },
  data_ml: {
    title: 'Data Science / ML Quiz',
    goal: 'Kiểm tra hiểu biết về data quality, explainability, drift và backtesting.',
    questions: [
      { question: 'Trước khi dùng dữ liệu cho ML kế toán, việc nào nên làm trước?', options: ['Huấn luyện model ngay', 'Kiểm tra data quality rules', 'Xóa hết dữ liệu lỗi không ghi nhận', 'Tăng threshold'], answer: 1, explain: 'Dữ liệu lỗi sẽ làm model và báo cáo sai; cần kiểm tra missing, duplicate, outlier, mapping trước.' },
      { question: 'Feature contribution trong explainability dùng để làm gì?', options: ['Giải thích yếu tố làm score tăng/giảm', 'Thay thế kiểm toán', 'Xóa dữ liệu nhạy cảm', 'Tự động duyệt thanh toán'], answer: 0, explain: 'Feature contribution giúp người học hiểu vì sao model chấm rủi ro cao/thấp.' },
      { question: 'Model drift nghĩa là gì?', options: ['Giao diện bị lệch', 'Phân phối dữ liệu thay đổi so với baseline', 'Build Docker lỗi', 'Sai mật khẩu API'], answer: 1, explain: 'Drift xảy ra khi dữ liệu hiện tại khác dữ liệu baseline/training, làm hiệu năng model có thể giảm.' }
    ]
  },
  devops_governance: {
    title: 'DevOps / Governance Quiz',
    goal: 'Kiểm tra hiểu biết về GitHub, Cloud Run, Firebase, bảo mật và release gate.',
    questions: [
      { question: 'API key Gemini nên lưu ở đâu khi deploy Cloud Run?', options: ['Trong frontend code', 'Trong README', 'Cloud Run env/secrets', 'Trong ảnh chụp màn hình'], answer: 2, explain: 'Secret phải nằm trong biến môi trường/secrets, không public trong source hoặc frontend.' },
      { question: 'Nếu revision Cloud Run mới làm web lỗi, bước an toàn đầu tiên là gì?', options: ['Sửa nóng lung tung', 'Rollback traffic về revision cũ ổn định', 'Xóa repo', 'Tắt billing ngay'], answer: 1, explain: 'Rollback trước giúp web sống lại, sau đó mới debug commit gây lỗi.' },
      { question: 'Release gate tối thiểu nên yêu cầu gì?', options: ['Build/lint pass, không lộ secret, UI không vỡ', 'Chỉ cần commit message đẹp', 'Bỏ qua test nếu vội', 'Deploy mọi commit'], answer: 0, explain: 'Release gate giúp giảm rủi ro web trắng, lỗi build hoặc lộ dữ liệu nhạy cảm.' }
    ]
  }
};

export default function LearningAssessmentQuizLab() {
  const [quizKey, setQuizKey] = useState<QuizKey>('accounting_tax');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [copied, setCopied] = useState(false);
  const quiz = quizzes[quizKey];
  const score = quiz.questions.reduce((sum, question, index) => sum + (answers[index] === question.answer ? 1 : 0), 0);
  const completed = Object.keys(answers).length === quiz.questions.length;
  const pct = Math.round((score / quiz.questions.length) * 100);

  const markdown = useMemo(() => `# Learning Assessment Quiz\n\n## ${quiz.title}\n${quiz.goal}\n\n## Score\n${score}/${quiz.questions.length} (${pct}%)\n\n## Review\n${quiz.questions.map((q, index) => `### Q${index + 1}. ${q.question}\n- Your answer: ${answers[index] !== undefined ? q.options[answers[index]] : 'Chưa chọn'}\n- Correct answer: ${q.options[q.answer]}\n- Explain: ${q.explain}`).join('\n\n')}\n\n> Quiz phục vụ tự học, không thay thế kiểm tra chuyên môn chính thức.`, [quiz, score, pct, answers]);

  const reset = () => setAnswers({});
  const copy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-5 text-slate-100 select-text">
      <section className="bg-gradient-to-r from-emerald-950/20 via-[#060a12] to-amber-950/20 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0"><Award className="w-5 h-5" /></div>
          <div><h2 className="text-sm font-black text-white uppercase tracking-widest">Learning Assessment Quiz Lab</h2><p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">Quiz tự kiểm tra kiến thức kế toán/thuế, data/ML, DevOps và governance sau khi học các module sandbox.</p></div>
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-3">
        <Metric title="Score" value={`${score}/${quiz.questions.length}`} tone={completed && pct >= 70 ? 'emerald' : 'amber'} />
        <Metric title="Completion" value={completed ? 'Done' : 'In progress'} tone={completed ? 'emerald' : 'amber'} />
        <Metric title="Percent" value={`${pct}%`} tone={pct >= 70 ? 'emerald' : 'rose'} />
      </div>

      <div><label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">Chủ đề quiz</label><select value={quizKey} onChange={e => { setQuizKey(e.target.value as QuizKey); setAnswers({}); }} className="w-full bg-[#02050b] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200">{Object.entries(quizzes).map(([key, value]) => <option key={key} value={key}>{value.title}</option>)}</select></div>

      <section className="p-4 rounded-xl border border-emerald-500/25 bg-emerald-950/15"><h3 className="text-[10px] font-black uppercase tracking-wider mb-2 text-white flex items-center gap-2"><Target className="w-4 h-4 text-emerald-400" />Mục tiêu</h3><p className="text-xs text-emerald-100 font-semibold leading-relaxed">{quiz.goal}</p></section>

      <div className="space-y-4">
        {quiz.questions.map((question, index) => {
          const selected = answers[index];
          const isAnswered = selected !== undefined;
          const isCorrect = selected === question.answer;
          return <section key={question.question} className="p-4 rounded-xl border border-slate-850 bg-slate-900/35 space-y-3"><h3 className="text-xs font-black text-white flex items-center gap-2"><HelpCircle className="w-4 h-4 text-amber-400" />Q{index + 1}. {question.question}</h3><div className="grid md:grid-cols-2 gap-2">{question.options.map((option, optionIndex) => <button key={option} onClick={() => setAnswers(prev => ({ ...prev, [index]: optionIndex }))} className={`text-left p-3 rounded-xl border text-[11px] font-semibold transition-all ${selected === optionIndex ? (optionIndex === question.answer ? 'bg-emerald-500/10 border-emerald-500 text-emerald-200' : 'bg-rose-500/10 border-rose-500 text-rose-200') : 'bg-[#060a12] border-slate-850 text-slate-300 hover:bg-slate-900'}`}>{option}</button>)}</div>{isAnswered && <div className={`p-3 rounded-xl border text-xs font-semibold leading-relaxed ${isCorrect ? 'border-emerald-500/25 bg-emerald-950/15 text-emerald-200' : 'border-rose-500/25 bg-rose-950/15 text-rose-200'}`}>{isCorrect ? <CheckCircle2 className="w-4 h-4 inline mr-1" /> : <XCircle className="w-4 h-4 inline mr-1" />}{question.explain}</div>}</section>;
        })}
      </div>

      <section className="p-4 rounded-xl border border-amber-500/25 bg-amber-950/15"><h3 className="text-[10px] font-black uppercase tracking-wider mb-2 text-white flex items-center gap-2"><Lightbulb className="w-4 h-4 text-amber-400" />Gợi ý học tiếp</h3><p className="text-xs text-amber-100 font-semibold leading-relaxed">Nếu điểm dưới 70%, quay lại Rule Library, Bridge Matrix, Data Quality Lab hoặc Cloud Launch Checklist để ôn lại phần sai.</p></section>

      <div className="flex flex-wrap gap-2"><button onClick={reset} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-black rounded-xl flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5" />Reset</button><button onClick={copy} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-black rounded-xl flex items-center gap-1.5">{copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}{copied ? 'Đã copy' : 'Copy quiz report'}</button></div>
    </div>
  );
}

function Metric({ title, value, tone }: { title: string; value: string; tone: 'emerald' | 'amber' | 'rose' }) { const colors = { emerald: 'text-emerald-400 border-emerald-500/25 bg-emerald-950/15', amber: 'text-amber-400 border-amber-500/25 bg-amber-950/15', rose: 'text-rose-400 border-rose-500/25 bg-rose-950/15' }[tone]; return <div className={`p-3 rounded-xl border ${colors}`}><span className="text-[9px] text-slate-500 font-black uppercase block">{title}</span><p className="text-sm font-black mt-1 font-mono">{value}</p></div>; }
