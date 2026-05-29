import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Terminal, 
  Sparkles, 
  Copy, 
  Trash2, 
  HelpCircle, 
  FileText, 
  Database, 
  ShieldAlert, 
  AlertCircle, 
  Cpu, 
  Save, 
  FileDown, 
  BookOpen, 
  Check, 
  Edit2 
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant' | 'error';
  text: string;
}

interface SavedSnippet {
  id: string;
  title: string;
  code: string;
  language: string;
  savedAt: string;
}

export default function GeminiPlayground() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Xin chào Solo Founder! Tôi là Trợ lý AI Kế toán & Khoa học Dữ liệu thực chiến. Tôi có thể giúp bạn tạo lược đồ database mới, viết mã phân tích pandas chuẩn, hoặc thiết kế mô hình dự báo dòng tiền. Hãy chọn một mẫu nhanh bên dưới hoặc viết câu hỏi của riêng bạn nhé!'
    }
  ]);
  const [userInput, setUserInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeSideTab, setActiveSideTab] = useState<'presets' | 'scrapbook'>('presets');
  
  // Scrapbook state
  const [savedSnippets, setSavedSnippets] = useState<SavedSnippet[]>([]);
  const [editingSnippetId, setEditingSnippetId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editCode, setEditCode] = useState<string>('');

  // Load Saved Snippets on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fastrack_saved_snippets');
      if (saved) {
        setSavedSnippets(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Lỗi tải sổ tay code: ', e);
    }
  }, []);

  const saveSnippetsToStorage = (updated: SavedSnippet[]) => {
    setSavedSnippets(updated);
    try {
      localStorage.setItem('fastrack_saved_snippets', JSON.stringify(updated));
    } catch (e) {
      console.error('Lỗi lưu trữ sổ tay code: ', e);
    }
  };

  const handleSaveToScrapbook = (title: string, code: string, rawLang: string) => {
    const lang = rawLang.toLowerCase() || 'txt';
    const cleanLang = lang.includes('py') ? 'py' : lang.includes('sql') ? 'sql' : lang.includes('js') ? 'js' : 'txt';
    
    // Check if code already exists to avoid duplicates
    if (savedSnippets.some(s => s.code.trim() === code.trim())) {
      alert('Đoạn code này đã được lưu trước đó trong Sổ tay của bạn!');
      return;
    }

    const newSnippet: SavedSnippet = {
      id: `snippet_${Date.now()}`,
      title,
      code: code.trim(),
      language: cleanLang,
      savedAt: new Date().toLocaleDateString('vi-VN')
    };

    const updated = [newSnippet, ...savedSnippets];
    saveSnippetsToStorage(updated);
    
    // Flash sideTab to scrapbook to show visual success
    setActiveSideTab('scrapbook');
    const noteElement = document.getElementById('scrapbook-toast');
    if (noteElement) {
      noteElement.classList.remove('opacity-0');
      noteElement.classList.add('opacity-100');
      setTimeout(() => {
        noteElement.classList.remove('opacity-100');
        noteElement.classList.add('opacity-0');
      }, 2500);
    }
  };

  const handleDeleteSnippet = (id: string) => {
    const updated = savedSnippets.filter(s => s.id !== id);
    saveSnippetsToStorage(updated);
    if (editingSnippetId === id) {
      setEditingSnippetId(null);
    }
  };

  const handleStartEdit = (snippet: SavedSnippet) => {
    setEditingSnippetId(snippet.id);
    setEditTitle(snippet.title);
    setEditCode(snippet.code);
  };

  const handleSaveEdit = () => {
    const updated = savedSnippets.map(s => {
      if (s.id === editingSnippetId) {
        return {
          ...s,
          title: editTitle,
          code: editCode
        };
      }
      return s;
    });
    saveSnippetsToStorage(updated);
    setEditingSnippetId(null);
  };

  const handleDownloadSnippet = (snippet: SavedSnippet) => {
    const blob = new Blob([snippet.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const fileExtension = snippet.language;
    link.download = `${snippet.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const preSets = [
    {
      title: 'Sinh schema.sql SQLite',
      prompt: 'Hãy thiết kế lược đồ bảng database SQLITE của bảng "fixed_assets" (tài sản cố định) và "asset_depreciation_logs" (bảng khấu hao) cho phần mềm kế toán Việt Nam. Cột tiền dùng kiểu INTEGER làm tròn chuẩn, các cột ngày làm kiểu TEXT ISO8601, có chỉ rõ PRIMARY KEY và REFERENCES khóa ngoại chi tiết.'
    },
    {
      title: 'Viết Code Pandas Phân tích',
      prompt: 'Viết một đoạn code Python sử dụng thư viện pandas để đọc file Excel "invoices.xlsx" chứa các hóa đơn đầu vào kế toán. Hãy làm sạch định dạng tiền tệ có dấu phẩy hoặc chữ "đ", lọc ra các hóa đơn có thuế suất VAT vướng mắc (không bằng 0, 5, 8, 10%), và nhóm lại tính tổng số tiền trước thuế.'
    },
    {
      title: 'Dự đoán Thuế TNCN Bậc thang',
      prompt: 'Viết một hàm Python tính toán thuế TNCN (Thu nhập cá nhân) lũy tiến từng phần theo quy định mới nhất của Việt Nam. Đầu vào là thu nhập chịu thuế sau khi đã giảm trừ gia cảnh.'
    }
  ];

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const newUserMessage: Message = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          systemInstruction: 'Bạn là một chuyên gia lập trình kế toán tin cậy và nhà khoa học dữ liệu người Việt Nam. Câu trả lời của bạn luôn bám sát nghiệp vụ thực tế, luôn khuyên dùng kiểu dữ liệu chuẩn, giải thích súc tích, chuyên sâu và trả về các đoạn code sạch dạng markdown ```sql, ```python, ```js, có kèm bình luận tiếng Việt.'
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessages(prev => [...prev, { role: 'assistant', text: data.text }]);
      } else {
        // Fallback simulate when API key is missing or errored
        let fallbackText = '';
        if (data.isMissingKey) {
          fallbackText = getSimulationText(textToSend);
          setMessages(prev => [
            ...prev, 
            { 
              role: 'error', 
              text: `⚠️ [Thông báo từ hệ thống]: Bạn chưa cấu hình mã khóa GEMINI_API_KEY. Để kết quả được lấy trực tiếp từ mô hình Gemini 3.5 thực tế, hãy cài đặt khóa bí mật của bạn tại mục Secrets. \n\nDưới đây là câu trả lời mô phỏng chi tiết được viết bởi chuyên gia để bạn tham khảo ngay:` 
            },
            { role: 'assistant', text: fallbackText }
          ]);
        } else {
          setMessages(prev => [...prev, { role: 'error', text: data.error || 'Có lỗi phát sinh trong quá trình kết nối.' }]);
        }
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'error', text: 'Mạng bị nghẽn hoặc server không phản hồi.' }]);
    } finally {
      setLoading(false);
    }
  };

  const getSimulationText = (prompt: string): string => {
    const p = prompt.toLowerCase();
    if (p.includes('schema') || p.includes('sqlite') || p.includes('assets')) {
      return `Dưới đây là thiết kế lược đồ SQLite tối giản, chuẩn tắc dành cho tài sản cố định áp dụng chế độ kế toán doanh nghiệp Việt Nam.

\`\`\`sql
-- [SQLite DB Schema - Tài sản cố định & Khấu hao]
CREATE TABLE fixed_assets (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  asset_code      TEXT UNIQUE NOT NULL,       -- Mã TSCĐ (VD: FA_XE_NANG_01)
  asset_name      TEXT NOT NULL,              -- Tên xe, máy móc thiết bị
  purchase_date   TEXT NOT NULL,              -- Ngày hóa đơn dạng YYYY-MM-DD
  in_use_date     TEXT NOT NULL,              -- Ngày bắt đầu tính khấu hao
  original_cost   INTEGER NOT NULL,           -- Nguyên giá tính bằng đồng (VNĐ)
  useful_life     INTEGER NOT NULL,           -- Thời gian sử dụng dự toán (số tháng)
  residual_value  INTEGER DEFAULT 0,          -- Giá trị thanh lý thu hồi dự kiến
  status          TEXT DEFAULT 'active'       -- active (hoạt động), liquidated (thanh lý)
);

CREATE TABLE asset_depreciation_logs (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  asset_id        INTEGER REFERENCES fixed_assets(id) ON DELETE CASCADE,
  dep_period      TEXT NOT NULL,              -- Kỳ trích khấu hao dạng YYYY-MM
  monthly_amount  INTEGER NOT NULL,           -- Mức khấu hao tính theo tháng (VNĐ)
  accumulated_amt INTEGER NOT NULL,           -- Lũy kế khấu hao đến kỳ hiện tại
  book_value      INTEGER NOT NULL,           -- Giá trị còn lại ròng (= Nguyên giá - Lũy kế)
  created_at      TEXT DEFAULT (datetime('now', 'localtime'))
);

CREATE INDEX idx_dep_period ON asset_depreciation_logs(dep_period);
\`\`\`

### 💡 Quy tắc kế toán lưu ý:
1. **Kiểu dữ liệu tiền tệ**: Sử dụng kiểu \`INTEGER\` thay vì Float/Real nhằm tránh sai số làm tròn số lẻ cực kỳ nguy hiểm trong nghiệp vụ đối soát tài chính của Việt Nam.
2. **Khóa xóa mềm**: Đối với bảng tài sản cố định danh giá, không nên xóa cứng dòng ghi nhận, hãy dùng cột \`status\` cấu hình trạng thái thanh lý để bảo vệ tính toàn vẹn của lịch sử báo cáo dòng tiền.`;
    }

    if (p.includes('pandas') || p.includes('python') || p.includes('excel')) {
      return `Tôi đã thiết kế hàm làm sạch dữ liệu và thống kê thuế suất VAT dị thường theo đúng nghiệp vụ kiểm toán độc lập bằng Python Pandas:

\`\`\`python
# [Python Pandas Clean & Audit Script]
import pandas as pd
import re

def clean_excel_invoices(file_path):
    # Đọc tệp excel nguồn
    df = pd.read_excel(file_path)
    
    # 1. Làm sạch cột tiền (loại bỏ chữ "đ", dấu phẩy, ký tự dư thừa)
    def clean_currency(val):
        if pd.isna(val): return 0
        cleaned = re.sub(r'[^\\d.]', '', str(val))
        return int(float(cleaned)) if cleaned else 0
        
    df['so_tien_sach'] = df['so_tien'].apply(clean_currency)
    
    # 2. Phát hiện thuế suất VAT không tương thích quy định kế toán Việt Nam
    # Thuế suất hợp chuẩn chỉ gồm: 0, 5, 8, 10 (%)
    valid_rates = [0, 5, 8, 10]
    df['error_vat'] = ~df['thue_suat'].isin(valid_rates)
    
    invalid_invoices = df[df['error_vat']]
    
    # 3. Phân nhóm tính tổng tiền trước thuế để lên báo cáo
    summary = df.groupby('danh_muc')['so_tien_sach'].sum().reset_index()
    
    print(f"🚨 Phát hiện {len(invalid_invoices)} hóa đơn có sai lệch thuế suất VAT cần kiểm chứng!")
    return df, summary

# Chạy thử nghiệm cục bộ: 
# clean_excel_invoices('data/invoices.xlsx')
\`\`\`

### Chi tiết cách hoạt động:
- Hàm trích lọc biểu diễn regex \`[^\\d.]\` giúp xóa toàn bộ khoảng trắng, tiền tệ đặc thù (\`đ\`, \`VND\`) một cách triệt để nhất.
- Bộ lọc phủ định \`~df['thue_suat'].isin(valid_rates)\` loại ngay các hóa đơn lẻ bị gài thuế suất trung gian giả mạo để trục lợi khấu trừ thuế.`;
    }

    return `Dưới đây là hàm Python tính toán thuế thu nhập cá nhân (TNCN) chuẩn biểu thuế lũy tiến từng phần 7 bậc cho người lao động tại Việt Nam:

\`\`\`python
# [Python Thuế TNCN lũy tiến 7 bậc]
def tinh_thue_tncn_bac_thang(thu_nhap_tinh_thue):
    """
    Tính thuế TNCN lũy tiến theo biểu bậc Thông tư số 111/2013/TT-BTC
    thu_nhap_tinh_thue: Thu nhập tính thuế sau giảm trừ bản thân (11tr) & người phụ thuộc
    Đầu ra đơn vị: Đồng VNĐ chốt ròng
    """
    if thu_nhap_tinh_thue <= 0:
        return 0
        
    # Chuyển đổi thành triệu đồng để phép tính biểu bậc trực quan, thông thoáng
    tntt = thu_nhap_tinh_thue / 1000000.0
    thue = 0.0
    
    if tntt <= 5:
        thue = tntt * 0.05
    elif tntt <= 10:
        thue = (tntt - 5) * 0.10 + 0.25
    elif tntt <= 18:
        thue = (tntt - 10) * 0.15 + 0.75
    elif tntt <= 32:
        thue = (tntt - 18) * 0.20 + 1.95
    elif tntt <= 52:
        thue = (tntt - 32) * 0.25 + 4.75
    elif tntt <= 80:
        thue = (tntt - 52) * 0.30 + 9.75
    else:
        thue = (tntt - 80) * 0.35 + 18.15
        
    return int(thue * 1000000) # Ép kiểu số nguyên VNĐ tránh số lẻ thập phân

# Ví dụ: Thu nhập tính thuế sau giảm trừ là 25,000,000 VNĐ -> thuế TNCN là:
# tinh_thue_tncn_bac_thang(25000000) -> 3,350,000 VND
\`\`\`

### 📌 Ghi nhớ quy định giảm trừ (Hiệu lực 2026):
1. **Giảm trừ gia cảnh bản thân**: 11 triệu đồng/tháng (\`132.000.000\` đồng/năm).
2. **Giảm trừ người phụ thuộc**: 4,4 triệu đồng/người/tháng.`;
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Advanced custom markdown rendering block
  const renderMessageContent = (msgText: string) => {
    // Splits text into blocks of code vs standard paragraphs
    const parts = msgText.split(/(```[a-zA-Z]*\n[\s\S]*?\n```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const match = part.match(/```([a-zA-Z0-9-]*)\n([\s\S]*?)\n?```/);
        const lang = match ? match[1] : 'code';
        const code = match ? match[2] : part.slice(3, -3);
        const codeBlockId = `block_${index}`;

        return (
          <div key={index} className="my-4 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden font-mono text-[11px] select-text">
            <div className="flex justify-between items-center px-4 py-2 bg-slate-900 border-b border-slate-850">
              <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded bg-emerald-500 animate-pulse"></span>
                Language: {lang}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSaveToScrapbook(`Code trích từ AI (${lang})`, code, lang)}
                  className="flex items-center gap-1 px-2 py-0.5 bg-slate-950 border border-slate-800 text-purple-400 hover:text-purple-300 rounded text-[9.5px] transition-all font-sans font-bold"
                >
                  <Save className="w-3.5 h-3.5" />
                  Lưu Sổ Tay
                </button>
                <button
                  onClick={() => copyText(code, codeBlockId)}
                  className="flex items-center gap-1 px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded text-[9.5px] transition-all font-sans"
                >
                  {copiedId === codeBlockId ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Đã sao chép!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <pre className="p-3.5 overflow-x-auto text-slate-200 leading-relaxed font-semibold max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
              {code}
            </pre>
          </div>
        );
      } else {
        // Standard bullet points, headers or basic markdown elements parsing
        const lines = part.split('\n');
        return (
          <div key={index} className="space-y-2 text-slate-300 leading-relaxed text-xs">
            {lines.map((line, lIdx) => {
              if (line.startsWith('### ')) {
                return (
                  <h4 key={lIdx} className="text-sm font-bold text-white mt-4 border-b border-slate-900 pb-1 flex items-center gap-1.5">
                    <span className="w-1 h-3 rounded bg-purple-500"></span>
                    {line.replace('### ', '')}
                  </h4>
                );
              }
              if (line.startsWith('## ')) {
                return (
                  <h3 key={lIdx} className="text-base font-black text-purple-400 mt-5 border-l-2 border-purple-500 pl-2">
                    {line.replace('## ', '')}
                  </h3>
                );
              }
              if (line.startsWith('- ') || line.startsWith('* ')) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-3.5 select-text py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0 shadow shadow-purple-500/50"></span>
                    <span className="font-medium text-slate-300">{line.substring(2)}</span>
                  </div>
                );
              }
              if (line.trim().match(/^\d+\.\s/)) {
                const cleanedLine = line.replace(/^\d+\.\s/, '');
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-3.5 select-text py-0.5 font-medium text-slate-300">
                    <span className="text-purple-400 font-mono text-[11px] font-extrabold shrink-0">{line.match(/^\d+\./)?.[0] || '1.'}</span>
                    <span>{cleanedLine}</span>
                  </div>
                );
              }
              return line.trim() === '' ? <div key={lIdx} className="h-2"></div> : <p key={lIdx} className="select-text font-medium text-slate-300">{line}</p>;
            })}
          </div>
        );
      }
    });
  };

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      {/* QUICK PRESET & SCRAPBOOK PANEL CONTAINER (left) */}
      <div className="lg:col-span-1 space-y-4">
        {/* Toggleable Action Bar */}
        <div className="bg-slate-900/60 p-1.5 rounded-xl border border-slate-800 flex text-center">
          <button
            onClick={() => setActiveSideTab('presets')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeSideTab === 'presets' 
                ? 'bg-purple-600/20 text-purple-400 border border-purple-500/20 shadow-md' 
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Mẫu Code
          </button>
          <button
            onClick={() => setActiveSideTab('scrapbook')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 relative ${
              activeSideTab === 'scrapbook' 
                ? 'bg-purple-600/20 text-purple-400 border border-purple-500/20 shadow-md' 
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Sổ tay Code ({savedSnippets.length})
            {savedSnippets.length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute right-1.5 top-1.5 animate-ping"></span>
            )}
          </button>
        </div>

        {/* CONTROLLER BOX based on Active Side Tab */}
        {activeSideTab === 'presets' ? (
          <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-3">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Chọn mẫu nạp nhanh AI</span>
            <p className="text-slate-400 text-[11px] leading-relaxed font-semibold">Bấm đề tài bên dưới để tự nhập câu lệnh chất lượng cao vào ô chat và tương tác.</p>
            
            <div className="flex flex-col gap-2 pt-1">
              {preSets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setUserInput(preset.prompt);
                    handleSend(preset.prompt);
                  }}
                  disabled={loading}
                  className="w-full text-left p-3 bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white rounded-lg text-xs font-bold border border-slate-850 hover:border-purple-500/30 transition-all block"
                >
                  <span className="flex items-center gap-1 text-[9px] uppercase font-mono text-purple-400 font-extrabold mb-1">
                    Preset #{idx+1}
                  </span>
                  <span className="block truncate font-semibold">{preset.title}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* DIGITAL WORKSPACE SCRAPBOOK */
          <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Lưu trữ Code thô</span>
              {savedSnippets.length > 0 && (
                <button 
                  onClick={() => {
                    if(confirm('Xóa sạch sổ tay code?')) saveSnippetsToStorage([]);
                  }} 
                  className="text-[9.5px] text-rose-500 hover:text-rose-400 font-bold"
                >
                  Xóa hết
                </button>
              )}
            </div>

            {savedSnippets.length === 0 ? (
              <div className="text-center py-8 px-2 bg-slate-950 rounded-lg border border-slate-850">
                <BookOpen className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                <p className="text-[11px] text-slate-500 font-bold">Chưa có code nào được lưu.</p>
                <p className="text-[10px] text-slate-600 mt-1">Trong khi Chat, hãy bấm "Lưu Sổ Tay" tại các khối code để giữ lại tại đây.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                {savedSnippets.map((snippet) => (
                  <div key={snippet.id} className="bg-slate-950 border border-slate-850 p-3 rounded-xl flex flex-col justify-between">
                    {editingSnippetId === snippet.id ? (
                      /* Live edit box */
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 text-[11px] px-2 py-1 text-white rounded font-bold"
                        />
                        <textarea
                          rows={6}
                          value={editCode}
                          onChange={e => setEditCode(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 text-[10px] font-mono p-2 text-slate-300 rounded font-semibold"
                        />
                        <div className="flex justify-end gap-1.5">
                          <button onClick={() => setEditingSnippetId(null)} className="text-[9px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded">Hủy</button>
                          <button onClick={handleSaveEdit} className="text-[9px] px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold">Lưu lại</button>
                        </div>
                      </div>
                    ) : (
                      /* Snippet representation */
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] uppercase font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded font-extrabold shadow">
                            {snippet.language}
                          </span>
                          <span className="text-[9px] text-slate-600 font-semibold">{snippet.savedAt}</span>
                        </div>
                        <h4 className="text-[11px] font-bold text-slate-200 mt-2 truncate">{snippet.title}</h4>
                        
                        <div className="flex gap-1.5 mt-3 pt-2.5 border-t border-slate-900 justify-end">
                          <button
                            onClick={() => handleStartEdit(snippet)}
                            className="p-1 px-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded text-slate-400 hover:text-slate-200 transition-all text-[9.5px]/none flex items-center gap-1 font-bold"
                          >
                            <Edit2 className="w-3 h-3 text-purple-400" />
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDownloadSnippet(snippet)}
                            className="p-1 px-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded text-slate-400 hover:text-slate-200 transition-all text-[9.5px]/none flex items-center gap-1 font-bold"
                            title="Tải thành file"
                          >
                            <FileDown className="w-3 h-3 text-emerald-400" />
                            Tải file
                          </button>
                          <button
                            onClick={() => handleDeleteSnippet(snippet.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 transition-all"
                            title="Xóa khỏi sổ tay"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Small config advice card */}
        <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850/80 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Xác thực an toàn:</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Mã khóa <strong className="text-slate-300">process.env.GEMINI_API_KEY</strong> được injected an toàn bởi Cloud Platform. Key của bạn bảo mật 100% và không bao giờ bị lộ ra trình duyệt.
          </p>
        </div>
      </div>

      {/* CONVERSATION STREAM (center/right area) */}
      <div className="lg:col-span-3 space-y-4 flex flex-col justify-between bg-slate-900/60 border border-slate-800 rounded-xl p-5 min-h-[500px]">
        {/* Toast element for scrapbook success indicator */}
        <div id="scrapbook-toast" className="opacity-0 transition-opacity duration-300 pointer-events-none absolute right-12 top-24 bg-emerald-500/20 text-emerald-400 px-3.5 py-2 rounded-xl text-xs font-semibold border border-emerald-500/30 shadow-lg z-50 flex items-center gap-1.5">
          <Check className="w-4 h-4" />
          Đã lưu đoạn mã vào Sổ tay Code!
        </div>

        {/* Messages List Area */}
        <div className="space-y-4 overflow-y-auto max-h-[440px] pr-1 scrollbar-thin scrollbar-thumb-slate-800 flex-1">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-xl text-xs space-y-3.5 border ${
                msg.role === 'user' 
                  ? 'bg-purple-600/10 border-purple-500/15 ml-12 text-slate-200' 
                  : msg.role === 'error'
                  ? 'bg-rose-500/5 border-rose-500/15 mr-12 text-rose-400 font-semibold shadow shadow-rose-500/5'
                  : 'bg-slate-950 border-slate-850 mr-12 text-slate-300 shadow'
              }`}
            >
              <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                <span className="font-bold tracking-wider uppercase text-[10px] text-slate-500 font-mono">
                  {msg.role === 'user' ? '👤 Solo Founder Query' : msg.role === 'error' ? '🚨 System error message' : '🤖 AI Partner Engine'}
                </span>
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => copyText(msg.text, `msg_${idx}`)}
                    className="flex items-center gap-1.5 px-2 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded text-slate-400 hover:text-white transition-all text-[10px] font-semibold"
                  >
                    {copiedId === `msg_${idx}` ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-extrabold">Đã sao chép!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Sao chép toàn bộ</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="leading-relaxed whitespace-pre-wrap select-text">
                {msg.role === 'assistant' ? renderMessageContent(msg.text) : msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="p-4 bg-slate-950 border border-slate-850/80 mr-12 rounded-xl text-xs text-slate-400 flex items-center gap-3 shadow animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping"></span>
              <span className="font-semibold">Gemini đang phân tích biểu mẫu dữ liệu và chuẩn bị viết mã nguồn cho bạn...</span>
            </div>
          )}
        </div>

        {/* Input Text Form */}
        <div className="border-t border-slate-850 pt-4 flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(userInput); }}
            placeholder="Ví dụ: Thiết kế schema bảng hóa đơn VAT đầu vào..."
            disabled={loading}
            className="flex-1 bg-slate-950 border border-slate-850 px-4 py-3.5 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-medium"
          />
          <button
            onClick={() => handleSend(userInput)}
            disabled={loading || !userInput.trim()}
            className="px-5 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-purple-500/20 shrink-0 select-none"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Gửi câu hỏi</span>
          </button>
        </div>
      </div>
    </div>
  );
}
