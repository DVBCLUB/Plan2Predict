import React, { useMemo, useState } from 'react';
import { BookOpen, Calculator, Check, ChevronRight, ClipboardList, Copy, FileText, Globe, Landmark, Scale, Shield, Wrench } from 'lucide-react';

type TabKey = 'vas' | 'ifrs' | 'tax' | 'audit' | 'construction';

type KnowledgeItem = {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  summary: string;
  recognition: string[];
  documents: string[];
  commonRisks: string[];
  journalExample?: string[];
  practicalCase?: string;
  ifrsGap?: string;
};

const vasItems: KnowledgeItem[] = [
  {
    id: 'vas01',
    title: 'VAS 01 - Chuẩn mực chung',
    subtitle: 'Cơ sở lập và trình bày thông tin kế toán',
    badge: 'VAS',
    summary: 'Nền tảng của hệ thống chuẩn mực Việt Nam: giá gốc, phù hợp, thận trọng, nhất quán, trọng yếu và có chứng từ làm căn cứ ghi nhận.',
    recognition: ['Ghi nhận khi nghiệp vụ đã phát sinh và có bằng chứng hợp lý.', 'Ưu tiên cơ sở giá gốc, thận trọng khi ước tính.', 'Thông tin phải nhất quán giữa kỳ này và kỳ trước.'],
    documents: ['Chứng từ gốc', 'Phê duyệt nội bộ', 'Sổ chi tiết/sổ cái', 'Biên bản đối chiếu nếu có'],
    commonRisks: ['Ghi nhận theo ý chí quản trị thay vì chứng từ.', 'Không nhất quán chính sách giữa các kỳ.', 'Thiếu bằng chứng cho ước tính kế toán.'],
    journalExample: ['Ví dụ mua TSCĐ: Nợ 211 / Có 112, 331.', 'Trích khấu hao: Nợ 627, 641, 642 / Có 214.'],
    practicalCase: 'Dùng làm màn hình nhập môn trước khi học từng chuẩn mực cụ thể.',
    ifrsGap: 'IFRS thiên về bản chất kinh tế và fair value rộng hơn; VAS thực hành thường thiên về chứng từ và giá gốc.'
  },
  {
    id: 'vas02',
    title: 'VAS 02 - Hàng tồn kho',
    subtitle: 'Giá gốc, NRV, dự phòng giảm giá hàng tồn kho',
    badge: 'VAS',
    summary: 'Theo dõi nguyên vật liệu, hàng hóa, sản phẩm dở dang theo giá gốc; cuối kỳ so sánh với giá trị thuần có thể thực hiện được.',
    recognition: ['Giá gốc gồm giá mua, chi phí mua và chi phí chế biến liên quan.', 'Không dùng LIFO.', 'Lập dự phòng nếu NRV thấp hơn giá gốc.'],
    documents: ['Hóa đơn mua hàng', 'Phiếu nhập kho', 'Phiếu xuất kho', 'Biên bản kiểm kê', 'Bảng tính giá xuất kho'],
    commonRisks: ['Không phân bổ chi phí mua vào giá vốn.', 'Xuất kho không có định mức/công trình.', 'Không kiểm kê hoặc không lập dự phòng hàng chậm luân chuyển.'],
    journalExample: ['Nhập kho: Nợ 152, 156 / Nợ 1331 / Có 331.', 'Xuất dùng công trình: Nợ 154 / Có 152.'],
    practicalCase: 'Vật tư xây dựng cần gắn mã công trình, hạng mục, phiếu xuất và người nhận.',
    ifrsGap: 'IAS 2 gần VAS 02 nhưng yêu cầu trình bày và đánh giá NRV có thể chặt hơn.'
  },
  {
    id: 'vas03',
    title: 'VAS 03/04 - Tài sản cố định',
    subtitle: 'TSCĐ hữu hình, vô hình, khấu hao và hồ sơ tài sản',
    badge: 'VAS',
    summary: 'Ghi nhận tài sản khi chắc chắn thu được lợi ích kinh tế tương lai và xác định được nguyên giá đáng tin cậy.',
    recognition: ['Đủ tiêu chuẩn tài sản cố định theo quy định nội bộ/pháp luật.', 'Có thời gian sử dụng và hồ sơ bàn giao.', 'Khấu hao theo phương pháp được phê duyệt.'],
    documents: ['Hợp đồng mua', 'Hóa đơn', 'Biên bản bàn giao', 'Quyết định đưa vào sử dụng', 'Thẻ TSCĐ', 'Bảng khấu hao'],
    commonRisks: ['Hạch toán nhầm chi phí sửa chữa lớn và tài sản.', 'Không có biên bản bàn giao đưa vào sử dụng.', 'Khấu hao sai thời gian hoặc sai bộ phận chịu chi phí.'],
    journalExample: ['Mua tài sản: Nợ 211, 213 / Nợ 1331 / Có 112, 331.', 'Khấu hao: Nợ 627, 641, 642 / Có 214.'],
    practicalCase: 'Máy móc công trình cần phân bổ khấu hao theo công trình/ca máy nếu phục vụ tính giá thành.',
    ifrsGap: 'IAS 16 cho phép revaluation model; VAS thực tế thường dùng cost model.'
  },
  {
    id: 'vas06',
    title: 'VAS 06 - Thuê tài sản',
    subtitle: 'Phân biệt thuê hoạt động và thuê tài chính',
    badge: 'VAS',
    summary: 'Tập trung phân loại hợp đồng thuê theo bản chất chuyển giao rủi ro/lợi ích của tài sản thuê.',
    recognition: ['Thuê tài chính nếu gần như chuyển giao rủi ro/lợi ích.', 'Thuê hoạt động ghi chi phí thuê theo kỳ.', 'Cần đọc kỹ điều khoản mua lại, thời hạn thuê, giá trị hiện tại.'],
    documents: ['Hợp đồng thuê', 'Biên bản bàn giao', 'Lịch thanh toán', 'Hóa đơn thuê', 'Phụ lục điều chỉnh giá'],
    commonRisks: ['Hạch toán mọi hợp đồng thuê vào chi phí mà không xem bản chất.', 'Thiếu phân bổ chi phí thuê theo công trình.', 'Không kiểm soát cam kết thuê dài hạn.'],
    journalExample: ['Thuê hoạt động: Nợ 627, 641, 642 / Nợ 1331 / Có 331, 112.'],
    practicalCase: 'Thuê máy thi công nên gắn với nhật trình máy và hạng mục thi công.',
    ifrsGap: 'IFRS 16 thường ghi nhận right-of-use asset và lease liability cho bên thuê, khác đáng kể với cách VAS phổ biến.'
  },
  {
    id: 'vas14',
    title: 'VAS 14 - Doanh thu và thu nhập khác',
    subtitle: 'Ghi nhận doanh thu khi thỏa điều kiện chuyển giao',
    badge: 'VAS',
    summary: 'Ghi nhận doanh thu khi phần lớn rủi ro/lợi ích đã chuyển giao, doanh thu xác định được và có khả năng thu lợi ích kinh tế.',
    recognition: ['Có hợp đồng/đơn hàng.', 'Có bàn giao hoặc nghiệm thu.', 'Doanh thu và chi phí liên quan xác định được.', 'Có khả năng thu tiền.'],
    documents: ['Hợp đồng', 'Biên bản nghiệm thu', 'Hóa đơn', 'Hồ sơ thanh toán', 'Đối chiếu công nợ'],
    commonRisks: ['Xuất hóa đơn nhưng chưa đủ điều kiện ghi nhận doanh thu.', 'Ghi nhận sai kỳ quanh ngày khóa sổ.', 'Không kết chuyển giá vốn tương ứng.'],
    journalExample: ['Doanh thu: Nợ 131 / Có 511, 3331.', 'Giá vốn: Nợ 632 / Có 154, 156.'],
    practicalCase: 'Công trình xây dựng cần đối chiếu biên bản nghiệm thu, giá trị khối lượng và điều khoản hợp đồng.',
    ifrsGap: 'IFRS 15 dùng mô hình 5 bước và performance obligations, chi tiết hơn VAS 14.'
  },
  {
    id: 'vas15',
    title: 'VAS 15 - Hợp đồng xây dựng',
    subtitle: 'Doanh thu, chi phí và kết quả hợp đồng xây dựng',
    badge: 'VAS',
    summary: 'Rất quan trọng cho doanh nghiệp xây dựng: theo dõi doanh thu, chi phí và lợi nhuận theo từng hợp đồng/công trình.',
    recognition: ['Xác định được tổng doanh thu hợp đồng.', 'Xác định được chi phí phát sinh và ước tính hoàn thành.', 'Theo dõi riêng từng hợp đồng/công trình.'],
    documents: ['Hợp đồng xây dựng', 'Dự toán/BOQ', 'Biên bản nghiệm thu khối lượng', 'Hồ sơ thanh toán', 'Bảng tập hợp chi phí 154'],
    commonRisks: ['Không tách chi phí theo công trình.', 'Ghi nhận doanh thu không khớp nghiệm thu.', 'Không đánh giá công trình lỗ dự kiến.'],
    journalExample: ['Tập hợp chi phí: Nợ 154 / Có 152, 334, 331, 214.', 'Nghiệm thu: Nợ 131 / Có 511, 3331; Nợ 632 / Có 154.'],
    practicalCase: 'Nên có dashboard riêng so sánh dự toán, thực tế, nghiệm thu và công nợ từng công trình.',
    ifrsGap: 'IFRS 15 có thể ghi nhận theo over-time nếu đáp ứng điều kiện kiểm soát và nghĩa vụ thực hiện.'
  },
  {
    id: 'vas16',
    title: 'VAS 16 - Chi phí đi vay',
    subtitle: 'Vốn hóa hoặc ghi chi phí lãi vay',
    badge: 'VAS',
    summary: 'Chi phí đi vay được vốn hóa khi liên quan trực tiếp đến tài sản dở dang đủ điều kiện; các khoản khác ghi nhận chi phí tài chính.',
    recognition: ['Xác định tài sản dở dang đủ điều kiện.', 'Xác định khoản vay liên quan.', 'Có thời gian xây dựng/sản xuất đáng kể.'],
    documents: ['Hợp đồng vay', 'Lịch trả nợ', 'Bảng tính lãi', 'Hồ sơ tài sản/công trình', 'Phê duyệt vốn hóa'],
    commonRisks: ['Vốn hóa lãi vay không đủ điều kiện.', 'Không phân bổ lãi vay đúng công trình.', 'Thiếu hồ sơ giải trình mối liên hệ giữa khoản vay và tài sản.'],
    journalExample: ['Vốn hóa: Nợ 241, 154 / Có 335, 112.', 'Ghi chi phí: Nợ 635 / Có 112, 335.'],
    practicalCase: 'Dự án xây dựng dài hạn cần tracking nguồn vốn và tiến độ để xác định phần lãi được vốn hóa.',
    ifrsGap: 'IAS 23 có nguyên tắc tương đồng nhưng yêu cầu trình bày/ước tính chặt chẽ hơn.'
  },
  {
    id: 'vas17',
    title: 'VAS 17 - Thuế TNDN',
    subtitle: 'Thuế hiện hành và thuế hoãn lại',
    badge: 'VAS',
    summary: 'Phân biệt lợi nhuận kế toán, thu nhập chịu thuế, thuế TNDN hiện hành và các chênh lệch tạm thời tạo thuế hoãn lại.',
    recognition: ['Xác định chi phí không được trừ.', 'Theo dõi chênh lệch tạm thời.', 'Tính thuế hiện hành và nếu cần thuế hoãn lại.'],
    documents: ['Tờ khai quyết toán TNDN', 'Bảng reconciliation kế toán-thuế', 'Bảng chi phí không được trừ', 'Hồ sơ ưu đãi nếu có'],
    commonRisks: ['Nhầm lợi nhuận kế toán là thu nhập chịu thuế.', 'Bỏ sót chi phí không được trừ.', 'Không lưu hồ sơ giải trình ưu đãi/miễn giảm.'],
    journalExample: ['Thuế hiện hành: Nợ 8211 / Có 3334.', 'Nộp thuế: Nợ 3334 / Có 112.'],
    practicalCase: 'Sandbox nên có bảng bridge từ lợi nhuận kế toán sang thu nhập chịu thuế.',
    ifrsGap: 'IAS 12 triển khai thuế hoãn lại sâu hơn; VAS có nhưng doanh nghiệp nhỏ thường ít vận dụng đầy đủ.'
  }
];

const ifrsItems: KnowledgeItem[] = [
  {
    id: 'ifrs15',
    title: 'IFRS 15 - Revenue 5-Step Model',
    subtitle: 'Doanh thu theo nghĩa vụ thực hiện',
    badge: 'IFRS',
    summary: 'Mô hình 5 bước: xác định hợp đồng, nghĩa vụ thực hiện, giá giao dịch, phân bổ giá và ghi nhận doanh thu.',
    recognition: ['Có hợp đồng với khách hàng.', 'Tách nghĩa vụ thực hiện riêng biệt.', 'Phân bổ transaction price theo standalone selling price.'],
    documents: ['Hợp đồng', 'Phụ lục nghĩa vụ', 'Biên bản bàn giao/nghiệm thu', 'Bảng phân bổ giá giao dịch'],
    commonRisks: ['Gộp nhiều nghĩa vụ thành một.', 'Ghi nhận doanh thu trước khi hoàn thành nghĩa vụ.', 'Không xử lý biến đổi giá/chiết khấu/bảo hành.'],
    journalExample: ['Contract asset/liability tùy thời điểm thực hiện nghĩa vụ và thanh toán.'],
    practicalCase: 'Hợp đồng xây dựng vừa thi công, vừa bảo hành, vừa cung cấp thiết bị có thể cần tách nghĩa vụ.',
    ifrsGap: 'VAS 14 đơn giản hơn; IFRS 15 cần phân tích hợp đồng sâu hơn.'
  },
  {
    id: 'ifrs16',
    title: 'IFRS 16 - Leases',
    subtitle: 'Right-of-use asset và lease liability',
    badge: 'IFRS',
    summary: 'Bên thuê thường ghi nhận tài sản quyền sử dụng và nợ thuê thay vì chỉ ghi chi phí thuê hoạt động.',
    recognition: ['Xác định có quyền kiểm soát việc sử dụng tài sản.', 'Ước tính thời hạn thuê.', 'Chiết khấu dòng tiền thuê tương lai.'],
    documents: ['Hợp đồng thuê', 'Lịch thanh toán', 'Lãi suất chiết khấu', 'Điều khoản gia hạn/mua lại'],
    commonRisks: ['Bỏ sót hợp đồng thuê nhúng trong hợp đồng dịch vụ.', 'Sai thời hạn thuê do bỏ qua quyền gia hạn.', 'Không cập nhật khi điều chỉnh hợp đồng.'],
    journalExample: ['Ghi nhận ban đầu: Nợ ROU asset / Có lease liability.', 'Sau đó: khấu hao ROU và ghi lãi vay thuê.'],
    practicalCase: 'Thuê văn phòng, xe, máy thi công dài hạn sẽ ảnh hưởng tài sản, nợ vay, EBITDA.',
    ifrsGap: 'VAS 06 vẫn phân loại thuê hoạt động/tài chính; khác lớn so với IFRS 16.'
  },
  {
    id: 'ifrs9',
    title: 'IFRS 9 - Expected Credit Loss',
    subtitle: 'Tổn thất tín dụng kỳ vọng cho công nợ',
    badge: 'IFRS',
    summary: 'Dự phòng tổn thất dựa trên kỳ vọng tương lai, không chỉ khi đã có dấu hiệu mất khả năng thu hồi.',
    recognition: ['Phân nhóm công nợ theo tuổi nợ.', 'Ước tính xác suất vỡ nợ và tỷ lệ tổn thất.', 'Cập nhật forward-looking information.'],
    documents: ['Aging công nợ', 'Lịch sử thu tiền', 'Hồ sơ khách hàng', 'Chính sách tín dụng', 'Biên bản đối chiếu công nợ'],
    commonRisks: ['Chỉ trích lập khi nợ quá hạn lâu.', 'Không dùng dữ liệu lịch sử thu tiền.', 'Không phân nhóm khách hàng theo rủi ro.'],
    journalExample: ['Nợ chi phí dự phòng / Có dự phòng tổn thất tín dụng.'],
    practicalCase: 'Dữ liệu aging AR rất phù hợp để xây simulator ECL trong dashboard.',
    ifrsGap: 'VAS dự phòng nợ phải thu thường thiên về bằng chứng hiện hữu và quy định thuế.'
  },
  {
    id: 'ias36',
    title: 'IAS 36 - Impairment of Assets',
    subtitle: 'Suy giảm giá trị tài sản',
    badge: 'IFRS',
    summary: 'Kiểm tra tài sản có bị suy giảm khi carrying amount cao hơn recoverable amount.',
    recognition: ['Có chỉ báo suy giảm.', 'Xác định recoverable amount.', 'Ghi giảm nếu carrying amount cao hơn recoverable amount.'],
    documents: ['Danh sách tài sản', 'Dòng tiền dự kiến', 'Định giá/ước tính', 'Biên bản đánh giá suy giảm'],
    commonRisks: ['Không test impairment khi tài sản không còn hiệu quả.', 'Ước tính dòng tiền quá lạc quan.', 'Không phân bổ impairment cho CGU.'],
    journalExample: ['Nợ loss impairment / Có accumulated impairment hoặc giảm tài sản.'],
    practicalCase: 'Máy móc công trình ngưng sử dụng dài hạn cần đánh giá khả năng suy giảm.',
    ifrsGap: 'VAS ít vận dụng impairment sâu như IAS 36 trong doanh nghiệp vừa và nhỏ.'
  }
];

const taxItems: KnowledgeItem[] = [
  {
    id: 'vat-deduct',
    title: 'Thuế GTGT - Điều kiện khấu trừ',
    subtitle: 'Hóa đơn, thanh toán, mục đích SXKD',
    badge: 'VAT',
    summary: 'Kiểm tra đầu vào có được khấu trừ VAT không dựa trên hóa đơn hợp pháp, thanh toán phù hợp và phục vụ hoạt động chịu thuế.',
    recognition: ['Có hóa đơn hợp pháp.', 'Hàng hóa/dịch vụ phục vụ SXKD chịu thuế.', 'Thanh toán không dùng tiền mặt khi thuộc ngưỡng bắt buộc theo quy định hiện hành.'],
    documents: ['Hóa đơn điện tử', 'Hợp đồng/đơn đặt hàng', 'Biên bản giao nhận', 'Ủy nhiệm chi', 'Phiếu nhập/xuất kho nếu là vật tư'],
    commonRisks: ['Hóa đơn sai thông tin.', 'Thanh toán tiền mặt cho khoản lớn.', 'Chi phí không phục vụ hoạt động chịu thuế.'],
    journalExample: ['Nợ 152, 156, 642 / Nợ 1331 / Có 331, 112.'],
    practicalCase: 'Vật tư công trình cần đủ hóa đơn, thanh toán và phiếu xuất theo công trình để bảo vệ VAT đầu vào.'
  },
  {
    id: 'cit-deductible',
    title: 'Thuế TNDN - Chi phí được trừ',
    subtitle: 'Thực tế phát sinh, liên quan SXKD, đủ chứng từ',
    badge: 'CIT',
    summary: 'Chi phí được trừ thường cần liên quan hoạt động SXKD, có đủ hóa đơn/chứng từ và không thuộc nhóm bị khống chế/loại trừ.',
    recognition: ['Thực tế phát sinh.', 'Liên quan hoạt động doanh nghiệp.', 'Đủ hóa đơn/chứng từ.', 'Thanh toán phù hợp.'],
    documents: ['Hợp đồng', 'Hóa đơn', 'Biên bản nghiệm thu/giao nhận', 'Đề nghị thanh toán', 'Chứng từ thanh toán'],
    commonRisks: ['Thiếu chứng từ nghiệm thu.', 'Chi phí cá nhân đưa vào công ty.', 'Khoản chi không có quy chế/phê duyệt.'],
    journalExample: ['Nợ 627, 641, 642, 154 / Có 111, 112, 331.'],
    practicalCase: 'Chi phí tiếp khách, xăng dầu, nhân công khoán cần checklist hồ sơ riêng.'
  },
  {
    id: 'pit-contract',
    title: 'Thuế TNCN - Khoán việc/cá nhân',
    subtitle: 'Khấu trừ, hồ sơ cá nhân, chứng từ thanh toán',
    badge: 'PIT',
    summary: 'Mô phỏng xử lý chi phí trả cho cá nhân: hợp đồng, biên bản nghiệm thu, chứng từ thanh toán và nghĩa vụ khấu trừ nếu có.',
    recognition: ['Xác định quan hệ lao động hay dịch vụ khoán.', 'Xác định mức khấu trừ theo quy định.', 'Lưu thông tin cá nhân/MST nếu có.'],
    documents: ['Hợp đồng khoán việc', 'CCCD/MST', 'Biên bản nghiệm thu', 'Bảng thanh toán', 'Chứng từ khấu trừ nếu có'],
    commonRisks: ['Ghi nhận chi phí cá nhân nhưng thiếu hồ sơ.', 'Không khấu trừ thuế khi thuộc diện phải khấu trừ.', 'Gross-up không thống nhất hợp đồng và thanh toán.'],
    journalExample: ['Nợ 154, 622, 642 / Có 334, 111, 112, 3335.'],
    practicalCase: 'Rất phù hợp với công cụ Gross-up Calculator trong module Tools.'
  },
  {
    id: 'fct',
    title: 'Thuế nhà thầu FCT',
    subtitle: 'Dịch vụ, bản quyền, thương mại xuyên biên giới',
    badge: 'FCT',
    summary: 'Áp dụng khi tổ chức/cá nhân nước ngoài có thu nhập phát sinh tại Việt Nam từ dịch vụ, bản quyền hoặc hợp đồng hỗn hợp.',
    recognition: ['Xác định đối tượng nước ngoài.', 'Xác định bản chất hợp đồng.', 'Tách phần hàng hóa, dịch vụ, bản quyền nếu có.'],
    documents: ['Hợp đồng', 'Invoice nước ngoài', 'Chứng từ thanh toán', 'Tờ khai FCT', 'Hồ sơ hiệp định nếu áp dụng'],
    commonRisks: ['Không nhận diện FCT khi mua dịch vụ SaaS/quảng cáo/cố vấn nước ngoài.', 'Không gross-up khi hợp đồng ghi net.', 'Tách sai phần dịch vụ và hàng hóa.'],
    journalExample: ['Nợ chi phí / Có 331; khi nộp thay: Nợ 331 hoặc chi phí / Có 333, 112.'],
    practicalCase: 'Các dịch vụ AI/SaaS quốc tế nên được đưa vào checklist FCT học tập.'
  },
  {
    id: 'transfer-pricing',
    title: 'Giao dịch liên kết',
    subtitle: 'Related-party, arm’s length, hồ sơ xác định giá',
    badge: 'TP',
    summary: 'Nhận diện bên liên kết và rủi ro giá chuyển nhượng, lãi vay, phí dịch vụ nội bộ, mua bán nội bộ.',
    recognition: ['Xác định quan hệ liên kết.', 'Xác định loại giao dịch liên kết.', 'So sánh điều kiện độc lập nếu cần.'],
    documents: ['Danh sách bên liên kết', 'Hợp đồng nội bộ', 'Bảng kê giao dịch', 'Hồ sơ xác định giá nếu thuộc diện', 'Chứng từ dịch vụ thực nhận'],
    commonRisks: ['Không nhận diện bên liên kết.', 'Phí quản lý nội bộ không có bằng chứng dịch vụ.', 'Lãi vay vượt ngưỡng kiểm soát.'],
    journalExample: ['Hạch toán theo bản chất giao dịch: mua bán, vay, dịch vụ, phân bổ chi phí.'],
    practicalCase: 'Nên có tool scan vendor/customer theo MST/chủ sở hữu để cảnh báo liên kết.'
  }
];

const auditItems: KnowledgeItem[] = [
  {
    id: 'benford',
    title: 'Benford Test',
    subtitle: 'Kiểm tra phân phối chữ số đầu',
    badge: 'AUDIT',
    summary: 'Dùng để phát hiện bất thường trong dữ liệu tài chính tự nhiên như chi phí, thanh toán, phiếu thu.',
    recognition: ['Tập dữ liệu đủ lớn.', 'Số tiền không bị giới hạn hẹp.', 'So sánh tỷ lệ chữ số đầu với phân phối kỳ vọng.'],
    documents: ['Dataset chi phí', 'Data dictionary', 'Biên bản chọn mẫu', 'Kết quả phân tích'],
    commonRisks: ['Dùng cho tập dữ liệu quá nhỏ.', 'Kết luận gian lận chỉ dựa vào Benford.', 'Không loại trừ dữ liệu có pattern hợp lệ.'],
    journalExample: ['SQL: lấy chữ số đầu của ABS(amount), group by digit, so sánh expected rate.'],
    practicalCase: 'Dùng để chọn mẫu chi phí công trình hoặc thanh toán nhà thầu.'
  },
  {
    id: 'duplicate-payment',
    title: 'Duplicate Payment Test',
    subtitle: 'Phát hiện thanh toán hoặc hóa đơn trùng',
    badge: 'AUDIT',
    summary: 'So sánh vendor, invoice_no, amount, ngày chứng từ và nội dung để tìm giao dịch có khả năng trùng.',
    recognition: ['Trùng số hóa đơn.', 'Trùng vendor + amount.', 'Ngày gần nhau bất thường.', 'Mô tả tương tự.'],
    documents: ['Bảng AP/chi phí', 'Danh mục vendor', 'Phiếu chi/ủy nhiệm chi', 'Hóa đơn'],
    commonRisks: ['Dữ liệu vendor không chuẩn hóa.', 'Số hóa đơn nhập sai format.', 'Bỏ qua thanh toán tạm ứng và quyết toán.'],
    journalExample: ['JOIN bảng expenses với chính nó theo vendor_id + amount + khoảng cách ngày.'],
    practicalCase: 'Áp dụng trực tiếp cho sổ chi phí, vật tư và thanh toán nhà thầu.'
  },
  {
    id: 'cutoff',
    title: 'Cut-off Test',
    subtitle: 'Kiểm tra đúng kỳ kế toán',
    badge: 'AUDIT',
    summary: 'Lọc nghiệp vụ quanh ngày khóa sổ để kiểm tra doanh thu/chi phí có ghi nhận đúng kỳ hay không.',
    recognition: ['Giao dịch gần 31/12 hoặc ngày khóa sổ.', 'Ngày hóa đơn khác xa ngày nghiệm thu/giao nhận.', 'Booking lag bất thường.'],
    documents: ['Hóa đơn', 'Biên bản giao nhận/nghiệm thu', 'Phiếu nhập/xuất', 'Log nhập liệu'],
    commonRisks: ['Đẩy doanh thu sang kỳ trước.', 'Dồn chi phí sang kỳ sau.', 'Ghi nhận theo ngày hóa đơn nhưng không theo bản chất giao nhận.'],
    journalExample: ['Filter ngày chứng từ từ 20/12 đến 10/01 và so sánh created_at, invoice_date, delivery_date.'],
    practicalCase: 'Rất quan trọng khi quyết toán công trình cuối năm.'
  },
  {
    id: 'three-way-match',
    title: '3-Way Match',
    subtitle: 'PO - GRN - Invoice',
    badge: 'AUDIT',
    summary: 'Đối chiếu đơn đặt hàng, phiếu nhận hàng và hóa đơn để kiểm tra thanh toán có cơ sở.',
    recognition: ['Có PO hoặc đề nghị mua hàng.', 'Có nhận hàng/nghiệm thu.', 'Hóa đơn khớp số lượng, đơn giá, nhà cung cấp.'],
    documents: ['Đề nghị mua', 'PO/hợp đồng', 'Phiếu nhập/biên bản giao nhận', 'Hóa đơn', 'Chứng từ thanh toán'],
    commonRisks: ['Thanh toán hóa đơn không có nhận hàng.', 'Đơn giá hóa đơn cao hơn PO.', 'Số lượng hóa đơn vượt số lượng nhận.'],
    journalExample: ['JOIN purchase_orders, goods_received_notes, invoices theo po_id/grn_id.'],
    practicalCase: 'Cực hợp cho vật tư xây dựng, xăng dầu, thiết bị, thuê máy.'
  },
  {
    id: 'journal-entry-testing',
    title: 'Journal Entry Testing',
    subtitle: 'Kiểm tra bút toán thủ công/rủi ro cao',
    badge: 'AUDIT',
    summary: 'Tìm bút toán nhập tay, ngoài giờ, số tiền tròn, người tạo bất thường hoặc tài khoản nhạy cảm.',
    recognition: ['Manual entry.', 'Created outside business hours.', 'Round amount.', 'Posted near period end.', 'Sensitive accounts.'],
    documents: ['General ledger', 'Audit log', 'User list', 'Approval matrix', 'Voucher files'],
    commonRisks: ['Không có audit log.', 'Không phân quyền người lập/người duyệt.', 'Bút toán điều chỉnh cuối kỳ thiếu giải trình.'],
    journalExample: ['Filter journal_entries where is_manual=true, hour_created>=18, amount round million.'],
    practicalCase: 'Đây là nền tảng cho module kiểm toán dữ liệu nâng cao.'
  }
];

const constructionItems: KnowledgeItem[] = [
  {
    id: 'cost-154',
    title: 'TK 154 theo công trình',
    subtitle: 'Tập hợp chi phí sản xuất kinh doanh dở dang',
    badge: 'BUILD',
    summary: 'Theo dõi chi phí trực tiếp và chi phí phân bổ theo từng công trình/hạng mục để tính giá vốn khi nghiệm thu.',
    recognition: ['Mỗi chi phí có mã công trình.', 'Có hạng mục, đội thi công, người phê duyệt.', 'Kết chuyển giá vốn theo nghiệm thu.'],
    documents: ['Dự toán', 'Phiếu xuất vật tư', 'Bảng lương/nhân công', 'Hóa đơn thuê ngoài', 'Biên bản nghiệm thu'],
    commonRisks: ['Chi phí không gắn công trình.', 'Chi phí chung phân bổ tùy tiện.', 'Không đối chiếu dự toán-thực tế.'],
    journalExample: ['Nợ 154 / Có 152, 334, 331, 214, 111, 112.', 'Kết chuyển: Nợ 632 / Có 154.'],
    practicalCase: 'Nên có dashboard theo công trình: dự toán, chi phí thực tế, nghiệm thu, lợi nhuận gộp.'
  },
  {
    id: 'materials-flow',
    title: 'Luồng vật tư công trình',
    subtitle: 'Mua - nhập kho - xuất công trình - quyết toán',
    badge: 'BUILD',
    summary: 'Kiểm soát vật tư từ mua hàng đến sử dụng thực tế tại công trường, tránh thất thoát và sai giá vốn.',
    recognition: ['Có phiếu nhập kho.', 'Có phiếu xuất theo công trình.', 'Có người nhận và mục đích sử dụng.', 'Đối chiếu định mức/dự toán.'],
    documents: ['Đề nghị mua vật tư', 'Hóa đơn', 'Phiếu nhập', 'Phiếu xuất', 'Biên bản giao nhận tại công trường'],
    commonRisks: ['Mua thẳng công trình nhưng không có biên bản giao nhận.', 'Xuất kho không có mã công trình.', 'Không kiểm kê vật tư tồn công trường.'],
    journalExample: ['Nhập: Nợ 152 / Nợ 1331 / Có 331.', 'Xuất: Nợ 154 / Có 152.'],
    practicalCase: 'Liên kết module kho vật tư với dashboard chi phí công trình.'
  },
  {
    id: 'machine-cost',
    title: 'Máy thi công và nhiên liệu',
    subtitle: 'Ca máy, xăng dầu, thuê máy, khấu hao',
    badge: 'BUILD',
    summary: 'Theo dõi chi phí máy thi công theo nhật trình, ca máy, nhiên liệu và hạng mục sử dụng.',
    recognition: ['Có lệnh điều xe/máy.', 'Có nhật trình máy.', 'Có hóa đơn nhiên liệu/thuê máy.', 'Phân bổ theo công trình.'],
    documents: ['Lệnh điều xe', 'Nhật trình máy', 'Hóa đơn xăng dầu', 'Hợp đồng thuê máy', 'Biên bản nghiệm thu ca máy'],
    commonRisks: ['Xăng dầu thiếu nhật trình.', 'Chi phí thuê máy không gắn hạng mục.', 'Khấu hao máy không phân bổ theo sử dụng thực tế.'],
    journalExample: ['Nợ 154, 623 / Có 152, 214, 331, 111, 112.'],
    practicalCase: 'Có thể kết nối với tool Document Checklist Generator và Project Overrun Checker.'
  },
  {
    id: 'revenue-construction',
    title: 'Nghiệm thu và doanh thu công trình',
    subtitle: 'Khối lượng hoàn thành, hồ sơ thanh toán, công nợ',
    badge: 'BUILD',
    summary: 'Ghi nhận doanh thu theo khối lượng nghiệm thu và đối chiếu với giá vốn, công nợ phải thu.',
    recognition: ['Có biên bản nghiệm thu.', 'Có hồ sơ thanh toán.', 'Có hóa đơn đầu ra.', 'Kết chuyển giá vốn tương ứng.'],
    documents: ['Hợp đồng', 'BOQ/dự toán', 'Biên bản nghiệm thu', 'Hồ sơ thanh toán', 'Hóa đơn', 'Đối chiếu công nợ'],
    commonRisks: ['Xuất hóa đơn trước khi đủ nghiệm thu.', 'Không kết chuyển 154 sang 632.', 'Công nợ nghiệm thu và hóa đơn lệch nhau.'],
    journalExample: ['Doanh thu: Nợ 131 / Có 511, 3331.', 'Giá vốn: Nợ 632 / Có 154.'],
    practicalCase: 'Cần bảng đối chiếu: hợp đồng - nghiệm thu - hóa đơn - thu tiền.'
  }
];

const tabConfig: Record<TabKey, { label: string; icon: React.ComponentType<{ className?: string }>; items: KnowledgeItem[]; accent: string }> = {
  vas: { label: 'VAS Practical Lab', icon: Scale, items: vasItems, accent: 'blue' },
  ifrs: { label: 'IFRS Gap Map', icon: Globe, items: ifrsItems, accent: 'purple' },
  tax: { label: 'Tax Compliance', icon: Calculator, items: taxItems, accent: 'emerald' },
  audit: { label: 'Audit Analytics', icon: Shield, items: auditItems, accent: 'orange' },
  construction: { label: 'Construction Accounting', icon: Wrench, items: constructionItems, accent: 'amber' }
};

const accentClasses: Record<string, { active: string; badge: string; icon: string }> = {
  blue: { active: 'bg-blue-600 border-blue-500 text-white shadow-lg', badge: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: 'text-blue-400' },
  purple: { active: 'bg-purple-600 border-purple-500 text-white shadow-lg', badge: 'text-purple-400 bg-purple-500/10 border-purple-500/20', icon: 'text-purple-400' },
  emerald: { active: 'bg-emerald-600 border-emerald-500 text-white shadow-lg', badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: 'text-emerald-400' },
  orange: { active: 'bg-orange-600 border-orange-500 text-white shadow-lg', badge: 'text-orange-400 bg-orange-500/10 border-orange-500/20', icon: 'text-orange-400' },
  amber: { active: 'bg-amber-600 border-amber-500 text-white shadow-lg', badge: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: 'text-amber-400' }
};

export default function AccountingKnowledgeHub() {
  const [activeTab, setActiveTab] = useState<TabKey>('vas');
  const [selectedId, setSelectedId] = useState(vasItems[0].id);
  const [copied, setCopied] = useState(false);

  const current = tabConfig[activeTab];
  const classes = accentClasses[current.accent];
  const selected = useMemo(() => current.items.find(item => item.id === selectedId) ?? current.items[0], [current.items, selectedId]);

  const switchTab = (tab: TabKey) => {
    setActiveTab(tab);
    setSelectedId(tabConfig[tab].items[0].id);
  };

  const copySummary = async () => {
    const text = [
      selected.title,
      selected.subtitle,
      `Tóm tắt: ${selected.summary}`,
      `Điều kiện/logic: ${selected.recognition.join('; ')}`,
      `Hồ sơ: ${selected.documents.join('; ')}`,
      `Rủi ro: ${selected.commonRisks.join('; ')}`,
      selected.journalExample ? `Ví dụ: ${selected.journalExample.join('; ')}` : '',
      selected.ifrsGap ? `VAS/IFRS gap: ${selected.ifrsGap}` : ''
    ].filter(Boolean).join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-6 text-slate-100 select-text pb-12">
      <section className="bg-gradient-to-r from-blue-950/20 via-[#060a12] to-purple-950/20 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-44 h-44 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              📚 Accounting Knowledge Hub — VAS · IFRS · Tax · Audit · Construction
              <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/25 text-[9px] font-black rounded font-mono">PHASE 2</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed max-w-4xl">
              Kho kiến thức mở rộng theo hướng thực chiến: chuẩn mực kế toán, khoảng cách VAS/IFRS, thuế, kiểm toán dữ liệu và kế toán xây dựng. Nội dung dùng cho học tập/sandbox, không thay thế tư vấn chuyên môn chính thức.
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 xl:grid-cols-5 gap-2">
        {(Object.keys(tabConfig) as TabKey[]).map(tab => {
          const Icon = tabConfig[tab].icon;
          const isActive = activeTab === tab;
          const tabClasses = accentClasses[tabConfig[tab].accent];
          return (
            <button key={tab} onClick={() => switchTab(tab)} className={`px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 border ${isActive ? tabClasses.active : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white'}`}>
              <Icon className="w-4 h-4" /> {tabConfig[tab].label}
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-4 space-y-2">
          {current.items.map(item => (
            <button key={item.id} onClick={() => setSelectedId(item.id)} className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${selected.id === item.id ? 'bg-slate-900 border-slate-600 ring-1 ring-slate-500/30' : 'bg-[#060a12] border-slate-850 hover:bg-slate-900'}`}>
              <div>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded border font-mono ${classes.badge}`}>{item.badge}</span>
                <span className="text-xs font-bold text-slate-200 block mt-2 leading-snug">{item.title}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5 leading-snug">{item.subtitle}</span>
              </div>
              <ChevronRight className="w-4 h-4 shrink-0 mt-1 text-slate-600" />
            </button>
          ))}
        </aside>

        <main className="lg:col-span-8 bg-slate-950/50 border border-slate-850 rounded-2xl p-5 space-y-5">
          <div className="flex items-start justify-between gap-4 border-b border-slate-850 pb-4">
            <div>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded border font-mono ${classes.badge}`}>{selected.badge}</span>
              <h2 className="text-base font-black text-white mt-2">{selected.title}</h2>
              <p className="text-xs text-slate-500 mt-1 font-semibold">{selected.subtitle}</p>
            </div>
            <button onClick={copySummary} className="text-[9px] font-bold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg flex items-center gap-1 shrink-0">
              {copied ? <><Check className="w-3 h-3 text-emerald-400" />Copied</> : <><Copy className="w-3 h-3" />Copy</>}
            </button>
          </div>

          <InfoPanel title="Tóm tắt thực chiến" icon={FileText} tone={current.accent}>{selected.summary}</InfoPanel>

          <div className="grid md:grid-cols-2 gap-4">
            <ListPanel title="Điều kiện / logic ghi nhận" icon={Scale} items={selected.recognition} tone="emerald" />
            <ListPanel title="Hồ sơ cần có" icon={ClipboardList} items={selected.documents} tone="blue" />
          </div>

          <ListPanel title="Rủi ro thường gặp" icon={Shield} items={selected.commonRisks} tone="rose" />

          {selected.journalExample && <ListPanel title="Ví dụ bút toán / dữ liệu mô phỏng" icon={Landmark} items={selected.journalExample} tone="purple" />}

          <div className="grid md:grid-cols-2 gap-4">
            {selected.practicalCase && <InfoPanel title="Case thực hành" icon={Calculator} tone="amber">{selected.practicalCase}</InfoPanel>}
            {selected.ifrsGap && <InfoPanel title="Góc nhìn VAS / IFRS" icon={Globe} tone="purple">{selected.ifrsGap}</InfoPanel>}
          </div>
        </main>
      </div>
    </div>
  );
}

function InfoPanel({ title, children, icon: Icon, tone }: { title: string; children: React.ReactNode; icon: React.ComponentType<{ className?: string }>; tone: string }) {
  const toneMap: Record<string, string> = {
    blue: 'border-blue-500/25 bg-blue-950/15 text-blue-100',
    purple: 'border-purple-500/25 bg-purple-950/15 text-purple-100',
    emerald: 'border-emerald-500/25 bg-emerald-950/15 text-emerald-100',
    orange: 'border-orange-500/25 bg-orange-950/15 text-orange-100',
    amber: 'border-amber-500/25 bg-amber-950/15 text-amber-100',
    rose: 'border-rose-500/25 bg-rose-950/15 text-rose-100'
  };
  return <section className={`p-4 rounded-xl border ${toneMap[tone] ?? toneMap.blue}`}><h3 className="text-[10px] font-black uppercase tracking-wider mb-2 text-white flex items-center gap-2"><Icon className="w-4 h-4" />{title}</h3><p className="text-xs font-semibold leading-relaxed text-slate-300">{children}</p></section>;
}

function ListPanel({ title, items, icon: Icon, tone }: { title: string; items: string[]; icon: React.ComponentType<{ className?: string }>; tone: string }) {
  const color = tone === 'rose' ? 'text-rose-400' : tone === 'emerald' ? 'text-emerald-400' : tone === 'purple' ? 'text-purple-400' : tone === 'amber' ? 'text-amber-400' : 'text-blue-400';
  return <section className="p-4 rounded-xl border border-slate-850 bg-slate-900/35"><h3 className="text-[10px] font-black uppercase tracking-wider mb-3 text-white flex items-center gap-2"><Icon className={`w-4 h-4 ${color}`} />{title}</h3><ul className="space-y-2">{items.map(item => <li key={item} className="text-xs text-slate-300 font-semibold leading-relaxed flex gap-2"><span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${tone === 'rose' ? 'bg-rose-400' : tone === 'emerald' ? 'bg-emerald-400' : tone === 'purple' ? 'bg-purple-400' : tone === 'amber' ? 'bg-amber-400' : 'bg-blue-400'}`} />{item}</li>)}</ul></section>;
}
