export type SourceDomain = 'vietnam_tax' | 'vas' | 'ifrs' | 'audit' | 'ml_ai' | 'cloud_security' | 'internal_policy';

export type SourceStatus = 'seeded' | 'needs_review' | 'source_linked' | 'superseded_watch';

export type SourceRecord = {
  id: string;
  domain: SourceDomain;
  authority: string;
  sourceType: string;
  documentNumber: string;
  effectiveDate: string;
  lastReviewedAt: string;
  paragraphOrArticleRef: string;
  appliesTo: string[];
  jurisdiction: string;
  language: 'vi' | 'en' | 'vi/en';
  confidence: 'high' | 'medium' | 'low';
  status: SourceStatus;
  simulationOnly: boolean;
  url?: string;
  reviewerNote: string;
};

export const sourceRegistry: SourceRecord[] = [
  {
    id: 'gdt-vat-input-deduction-seed',
    domain: 'vietnam_tax',
    authority: 'Tổng cục Thuế / hệ thống văn bản pháp luật thuế Việt Nam',
    sourceType: 'Law / Decree / Circular / Official guidance pack',
    documentNumber: 'Seed pack - cần gắn văn bản hiện hành cụ thể trước khi dùng hồ sơ thật',
    effectiveDate: 'Check current effective date before production use',
    lastReviewedAt: '2026-05-30',
    paragraphOrArticleRef: 'VAT input deduction conditions - article/paragraph to be mapped',
    appliesTo: ['vat-input-deduction'],
    jurisdiction: 'Vietnam',
    language: 'vi',
    confidence: 'medium',
    status: 'needs_review',
    simulationOnly: true,
    url: 'https://www.gdt.gov.vn/',
    reviewerNote: 'Deep Research khuyến nghị biến VAT thành source-linked card có số văn bản, ngày hiệu lực, điều khoản và trạng thái cập nhật.'
  },
  {
    id: 'gdt-cit-deductible-expense-seed',
    domain: 'vietnam_tax',
    authority: 'Tổng cục Thuế / văn bản thuế TNDN Việt Nam',
    sourceType: 'CIT legal guidance pack',
    documentNumber: 'Seed pack - cần gắn Luật/Nghị định/Thông tư hiện hành',
    effectiveDate: 'Check current effective date before production use',
    lastReviewedAt: '2026-05-30',
    paragraphOrArticleRef: 'Deductible and non-deductible expense conditions - to be mapped',
    appliesTo: ['cit-deductible-expense'],
    jurisdiction: 'Vietnam',
    language: 'vi',
    confidence: 'medium',
    status: 'needs_review',
    simulationOnly: true,
    url: 'https://www.gdt.gov.vn/',
    reviewerNote: 'Dùng để nhắc người học rằng chi phí được trừ phải được kiểm tra theo nguồn chính thức và thời điểm phát sinh.'
  },
  {
    id: 'gdt-pit-contract-labor-seed',
    domain: 'vietnam_tax',
    authority: 'Tổng cục Thuế / văn bản thuế TNCN Việt Nam',
    sourceType: 'PIT legal guidance pack',
    documentNumber: 'Seed pack - cần gắn quy định TNCN hiện hành',
    effectiveDate: 'Check current effective date before production use',
    lastReviewedAt: '2026-05-30',
    paragraphOrArticleRef: 'Withholding / contract labor / gross-up handling - to be mapped',
    appliesTo: ['pit-contract-labor'],
    jurisdiction: 'Vietnam',
    language: 'vi',
    confidence: 'medium',
    status: 'needs_review',
    simulationOnly: true,
    url: 'https://www.gdt.gov.vn/',
    reviewerNote: 'Phù hợp case gross-up thuê ngoài; phải đồng bộ hợp đồng, bảng thanh toán, chứng từ khấu trừ và chính sách nội bộ.'
  },
  {
    id: 'gdt-fct-foreign-contractor-seed',
    domain: 'vietnam_tax',
    authority: 'Tổng cục Thuế / văn bản thuế nhà thầu',
    sourceType: 'FCT legal guidance pack',
    documentNumber: 'Seed pack - cần gắn thông tư/quy định thuế nhà thầu hiện hành',
    effectiveDate: 'Check current effective date before production use',
    lastReviewedAt: '2026-05-30',
    paragraphOrArticleRef: 'Foreign contractor tax scope and withholding - to be mapped',
    appliesTo: ['fct-foreign-contractor'],
    jurisdiction: 'Vietnam',
    language: 'vi',
    confidence: 'medium',
    status: 'needs_review',
    simulationOnly: true,
    url: 'https://www.gdt.gov.vn/',
    reviewerNote: 'Cần thêm nhánh dịch vụ cloud/software, bản quyền, dịch vụ quảng cáo, dịch vụ phát sinh tại Việt Nam.'
  },
  {
    id: 'vas-construction-154-seed',
    domain: 'vas',
    authority: 'Vietnamese Accounting Standards / accounting policy pack',
    sourceType: 'VAS + internal accounting policy',
    documentNumber: 'Seed pack - cần map VAS, chế độ kế toán và quy chế nội bộ',
    effectiveDate: 'Check current effective date before production use',
    lastReviewedAt: '2026-05-30',
    paragraphOrArticleRef: 'Inventory, revenue, WIP/project cost accumulation - to be mapped',
    appliesTo: ['construction-154-control'],
    jurisdiction: 'Vietnam',
    language: 'vi/en',
    confidence: 'medium',
    status: 'needs_review',
    simulationOnly: true,
    reviewerNote: 'Ưu tiên bổ sung bridge TK 154, 632, 511, nghiệm thu, dở dang và dự toán theo công trình.'
  },
  {
    id: 'iaasb-isa315-duplicate-payment-seed',
    domain: 'audit',
    authority: 'IAASB / ISA risk assessment framework',
    sourceType: 'Audit standard and internal control methodology',
    documentNumber: 'ISA 315 risk assessment reference pack',
    effectiveDate: 'Check applicable audit framework before production use',
    lastReviewedAt: '2026-05-30',
    paragraphOrArticleRef: 'Risk identification, assessment and response - assertion mapping to be added',
    appliesTo: ['audit-duplicate-payment'],
    jurisdiction: 'International / local adoption depends on engagement',
    language: 'en',
    confidence: 'medium',
    status: 'needs_review',
    simulationOnly: true,
    url: 'https://www.iaasb.org/',
    reviewerNote: 'Analytics chỉ là tín hiệu; cần evidence, sampling logic, conclusion và human review trước khi xem là phát hiện kiểm toán.'
  }
];

export function getSourcesForRule(ruleId: string) {
  return sourceRegistry.filter(source => source.appliesTo.includes(ruleId));
}

export function sourceStatusLabel(status: SourceStatus) {
  switch (status) {
    case 'seeded': return 'Seeded';
    case 'needs_review': return 'Needs review';
    case 'source_linked': return 'Source linked';
    case 'superseded_watch': return 'Superseded watch';
    default: return status;
  }
}
