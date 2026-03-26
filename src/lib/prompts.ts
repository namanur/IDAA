/**
 * IDAA Research Prompt System
 * ----------------------------
 * Module-aware, topic-aware prompt builders for Gemini content generation.
 * Each category has a tailored persona, structure, and output contract
 * so the AI knows exactly what kind of expert it is, what to research,
 * and what shape to produce the output in.
 *
 * Usage:
 *   import { buildResearchPrompt, buildDatasetPrompt } from '@/lib/prompts';
 *   const prompt = buildResearchPrompt(topic);
 */

export type TopicRecord = {
  id: string;
  title: string;
  category: string;
  slug: string;
  release_date?: string;
};

// ─────────────────────────────────────────────
// SHARED CONSTANTS
// ─────────────────────────────────────────────

const FISCAL_YEAR = '2024-25';
const ICAI_REF = 'ICAI / MCA / CBDT / GSTN';
const OUTPUT_FORMAT = `
**Output contract (follow strictly):**
- Use Markdown throughout.
- Use ## for major sections, ### for sub-sections.
- Use tables where data benefits from comparison.
- Use numbered lists for procedures/steps; bullet lists for features/rules.
- All monetary examples must use Indian Rupees (₹).
- All section/rule citations must name the exact Act, Section, and Sub-section.
- Do NOT add a disclaimer or "consult a professional" footer.
- Length: 12–15 pages of dense, examiner-grade content.
`.trim();

// ─────────────────────────────────────────────
// CATEGORY PERSONAS
// ─────────────────────────────────────────────

const PERSONAS: Record<string, string> = {
  Excel: `You are a Big 4 CA with 10 years of experience using Excel for financial modelling, audit workpapers, and MIS reporting in Indian corporate environments. You train fresh CA articleship students on practical Excel usage for day-one readiness.`,

  GST: `You are a Senior GST Consultant and ex-GSTN officer with deep knowledge of the CGST Act 2017, all notifications up to \${FISCAL_YEAR}, and hands-on experience handling GST audits, ITC reconciliation (GSTR-2B vs books), and litigation. You have trained CA students for interviews at Big 4 and mid-tier firms.`,

  TDS: `You are a Chartered Accountant specialising in Direct Tax, specifically TDS/TCS compliance under the Income Tax Act 1961. You are current on all Finance Act \${FISCAL_YEAR} amendments, new TDS sections, threshold changes, and TRACES filing procedures. You have advised 50+ corporates on TDS risk and trained hundreds of CA students.`,

  Accounting: `You are a Technical Director at a Big 4 firm specialising in Indian Accounting Standards (Ind AS), ICAI Guidance Notes, and Statutory Audit. You have deep practical experience with schedule III disclosures, consolidation, and audit committee presentations. You prepare CA students for technical accounting interview rounds.`,

  Tally: `You are a Tally-certified ERP trainer and practicing CA who has implemented Tally Prime at 30+ SMEs across manufacturing, trading, and services. You understand Tally from a CA's interview perspective: not just navigation, but why each feature exists in the context of accounting standards and GST compliance.`,

  Interview: `You are a Senior CA who has sat on interview panels at Big 4, Grant Thornton, BDO, and leading NBFCs. You know exactly what interviewers test: technical depth, communication under pressure, STAR-format storytelling, and the ability to link articleship experience to real business problems. You coach CA freshers to crack their first placement.`,
};

// ─────────────────────────────────────────────
// CATEGORY STRUCTURES
// ─────────────────────────────────────────────

const STRUCTURES: Record<string, string> = {
  Excel: `
**Document structure (in this exact order):**
1. **Table of Contents** — anchor links for each section.
2. **Why This Matters for CA Interviews** — 1 paragraph, specific to the topic.
3. **Core Concept Explained** — plain English, no jargon first; then introduce the technical terms.
4. **The Excel Mechanics** — step-by-step with formula syntax, argument breakdown, and common variants.
5. **5 Worked Examples** — each example uses a realistic Indian accounting/audit scenario (₹ amounts, Indian company names). Show input data as a Markdown table; show formula construction step by step; show the output.
6. **Common Errors & Fixes** — at least 6 errors (e.g., #N/A, #VALUE!, wrong range), why each happens, and how to fix.
7. **Nested / Advanced Usage** — combining with IF, IFERROR, INDEX-MATCH, or Power Query as relevant.
8. **Keyboard Shortcuts & Productivity Tips** — specific to this function/feature.
9. **20 Interview Q&A** — realistic questions a Big 4 interviewer would ask; each answer is 3–5 sentences with a concrete example.
10. **Quick-Revision Cheatsheet** — a single reference table summarising syntax, arguments, and key gotchas.
`.trim(),

  GST: `
**Document structure (in this exact order):**
1. **Table of Contents** — anchor links for each section.
2. **Statutory Foundation** — exact section/rule of CGST Act / IGST Act / Rules that governs this topic. Quote the provision heading and sub-section numbers.
3. **Concept in Plain Language** — for a student seeing this first time.
4. **Detailed Technical Analysis** — full legal framework, conditions, exceptions, provisos.
5. **Compliance Calendar & Due Dates** — specific to this topic for FY \${FISCAL_YEAR}.
6. **5–8 Worked Examples** — include inter-state vs intra-state cases, B2B vs B2C, special category scenarios as relevant. Use a ₹-denominated table to show computation.
7. **Recent Notifications & Circulars** — list the most impactful ones (up to \${FISCAL_YEAR}) with notification number and one-line impact.
8. **Common Interview Traps** — 5 conceptual mistakes candidates make, with correct position.
9. **20 Interview Q&A** — mix of definition, computation, scenario-based, and amendment-based questions; detailed model answers.
10. **Quick-Revision Cheatsheet** — rates, thresholds, due dates, and key rules in a single table.
`.trim(),

  TDS: `
**Document structure (in this exact order):**
1. **Table of Contents** — anchor links for each section.
2. **Governing Section** — exact section of Income Tax Act 1961, sub-sections, and relevant Rules.
3. **Scope & Applicability** — who deducts, who is the deductee, threshold, and applicable rate table.
4. **Rate Table** — a Markdown table showing: Nature of Payment | Section | Threshold (₹) | TDS Rate (Resident) | TDS Rate (Non-Resident / Foreign Co.) | Surcharge applicability.
5. **Step-by-Step Deduction Mechanics** — when to deduct, base of deduction, timing (credit vs payment), deposit due dates.
6. **5–7 Worked Examples** — varied: salary, contractor, rent, professional fees, NRI payment, etc. Show gross amount, exemption/threshold, net TDS, and TDS deposit timeline.
7. **Finance Act \${FISCAL_YEAR} Amendments** — specific changes to rates, thresholds, new sections, or removed sections introduced this year.
8. **TRACES & Compliance** — TDS return filing, Form 16/16A/27Q, correction statements, and interest/penalty for default.
9. **Common Interview Traps** — 5 areas where candidates confuse sections or rates.
10. **20 Interview Q&A** — coverage of definition, computation, filing, and amendment questions with model answers.
11. **Quick-Revision Cheatsheet** — a compact reference table.
`.trim(),

  Accounting: `
**Document structure (in this exact order):**
1. **Table of Contents** — anchor links for each section.
2. **Standard / Source** — the exact Ind AS / AS / ICAI Guidance Note / Companies Act section that governs this topic.
3. **Objective & Scope** — as stated in the standard, in plain language.
4. **Recognition & Measurement Principles** — the core accounting rules, conditions, and decision trees.
5. **Key Definitions** — from the standard itself, with plain-language explanations.
6. **5–8 Journal Entry Examples** — realistic Indian company scenarios; show full journal entry (debit/credit), ledger names, and a brief rationale for each line.
7. **Disclosure Requirements** — exact disclosures required in financial statements (balance sheet, P&L, notes).
8. **Ind AS vs Old GAAP / AS Comparison** — a table showing key differences (where applicable).
9. **Auditor's Perspective** — what auditors check, common misstatements, and red flags.
10. **20 Interview Q&A** — ranging from definitional to scenario-based to standard-comparison questions, with detailed model answers.
11. **Quick-Revision Cheatsheet** — key recognition criteria, measurement bases, and disclosure checklist in a table.
`.trim(),

  Tally: `
**Document structure (in this exact order):**
1. **Table of Contents** — anchor links for each section.
2. **Why a CA Needs to Know This** — link to accounting standards or compliance requirements that make this Tally feature relevant (e.g., GST ITC reconciliation, audit trail requirement).
3. **Feature Overview** — what it does and where it sits in Tally Prime's menu path (exact navigation: e.g., Gateway → Accounting Vouchers → F5: Payment).
4. **Step-by-Step Configuration / Usage** — numbered steps with field-by-field guidance.
5. **5 Practical Scenarios** — realistic SME/CA office scenarios with exact Tally entries. Show voucher type, ledger names, amounts, and resulting report.
6. **GST / Compliance Integration** — how this feature connects to GST returns, audit trail, or MCA filing if applicable.
7. **Shortcut Keys Reference** — a table of shortcuts specific to this feature.
8. **Common Mistakes in Tally** — at least 5, with fix.
9. **20 Interview Q&A** — both "how to do X in Tally" and "why does Tally do X" style questions with model answers.
10. **Quick-Revision Cheatsheet** — menu paths, shortcut keys, and key concepts in a table.
`.trim(),

  Interview: `
**Document structure (in this exact order):**
1. **Table of Contents** — anchor links for each section.
2. **What Interviewers Are Actually Testing** — specific to this topic; name 3–5 competencies being evaluated.
3. **The Gold-Standard Answer Framework** — for this topic (e.g., STAR for behavioural, "Define → Apply → Example" for technical concepts, "Pros-Cons-My-View" for opinion questions).
4. **10 Most Common Questions on This Topic** — with a full model answer for each (3–8 sentences). For behavioural questions, include a sample STAR story. For technical questions, include key terms to use.
5. **10 Curveball / Stress Questions** — tricky follow-ups interviewers use; model answers that show composure and depth.
6. **Body Language & Delivery Notes** — specific to this topic (e.g., for "walk me through your articleship", pacing, eye contact, avoiding filler words).
7. **Phrases to Use vs Phrases to Avoid** — a table of strong phrasing vs weak phrasing for this topic.
8. **Articleship Experience Mapping** — how to link common articleship tasks to questions on this topic.
9. **Self-Assessment Scorecard** — 10 criteria a candidate can use to self-grade their answer on this topic (1–5 scale with what each score looks like).
10. **Quick-Revision Cheatsheet** — key phrases, frameworks, and common questions condensed into single reference table.
`.trim(),
};

// ─────────────────────────────────────────────
// CATEGORY-LEVEL CONTEXT INJECTIONS
// ─────────────────────────────────────────────

const CATEGORY_CONTEXT: Record<string, string> = {
  Excel: `
- All examples must use realistic Indian company and employee names (not "Company A").
- Formulas must be written in Excel syntax (not Google Sheets where they differ).
- Reference specific Excel version where a function was introduced (e.g., XLOOKUP requires Excel 2019+/M365).
- Where relevant, mention how this is used in CA-specific workflows: bank reconciliation, ratio analysis, audit sampling, GST reconciliation.
`.trim(),

  GST: `
- All rates and thresholds must reflect GST Council decisions up to FY \${FISCAL_YEAR}.
- Always specify: CGST + SGST vs IGST treatment.
- For every example, state: place of supply, nature of supply (goods/services), and whether input tax credit is available.
- Mention relevant GSTR form where transaction appears (GSTR-1, GSTR-3B, GSTR-9, etc.).
- Flag reverse charge mechanism (RCM) applicability explicitly where it exists.
`.trim(),

  TDS: `
- All rates must be sourced from Income Tax Act and Finance Act \${FISCAL_YEAR}; note any proposed vs enacted changes.
- Distinguish between TDS (deduction at source) and advance tax; students often confuse them.
- Always mention PAN-linked rate and higher rate for non-PAN / non-Aadhaar cases.
- Include impact of tax treaties (DTAA) for NRI/foreign payment sections.
- Note difference between "payment" and "credit" for TDS trigger timing.
`.trim(),

  Accounting: `
- All Ind AS references must use current \${ICAI_REF} notified standards.
- Where a standard has a "carve-out" from IFRS, mention it explicitly.
- Distinguish between Ind AS applicability (Phase I, II, voluntary) and AS applicability.
- All journal entries must use proper Schedule III ledger nomenclature.
- Where measurement involves fair value, specify which level of fair value hierarchy applies.
`.trim(),

  Tally: `
- Specify Tally Prime version where features differ from Tally ERP 9.
- All navigation paths must be exact (e.g., Gateway of Tally > Accounting Vouchers > F7: Journal).
- Mention statutory compliance connection for every feature (GST, TDS, MCA audit trail as applicable).
- The audit trail requirement under Companies (Accounts) Amendment Rules 2021 is a frequent interview topic — connect features to this where relevant.
`.trim(),

  Interview: `
- Write model answers in first person ("In my articleship, I...") to make them immediately usable.
- All STAR stories should be plausible for a CA student who completed articleship at a mid-size firm.
- Avoid vague answers; every model answer must contain at least one specific number, date, or standard name.
- Tailor answers to context of a CA fresher applying to Big 4, Grant Thornton, or a leading NBFC.
`.trim(),
};

// ─────────────────────────────────────────────
// MAIN PROMPT BUILDER
// ─────────────────────────────────────────────

/**
 * Builds the primary research/content generation prompt for a topic.
 * This is what gets sent to Gemini to generate the 12–15 page study guide.
 */
export function buildResearchPrompt(topic: TopicRecord): string {
  const category = topic.category;
  const persona = PERSONAS[category] ?? PERSONAS['Accounting'];
  const structure = STRUCTURES[category] ?? STRUCTURES['Accounting'];
  const context = CATEGORY_CONTEXT[category] ?? '';

  return \`
\${persona}

Your task is to write a comprehensive, examiner-grade study guide on the following topic for CA Intermediate / CA Final students preparing for their first job interview at a Big 4, Grant Thornton, BDO, or leading Indian CA firm:

**Topic: "\${topic.title}"**
**Module: \${category}**
**Target Reader: CA student / fresh articleship-completed candidate**
**Fiscal Year Reference: \${FISCAL_YEAR}**

\${structure}

**Category-specific rules to follow:**
\${context}

\${OUTPUT_FORMAT}
\`.trim();
}

// ─────────────────────────────────────────────
// DATASET PROMPT BUILDER
// ─────────────────────────────────────────────

/**
 * Builds the prompt for generating a practice dataset + exercises for a topic.
 * This drives the secondary Gemini call for the practice data panel in the reader.
 */
export function buildDatasetPrompt(topic: TopicRecord): string {
  const category = topic.category;

  const exerciseTypeByCategory: Record<string, string> = {
    Excel: \`Excel formula exercises (VLOOKUP, SUMIF, XLOOKUP, Pivot, etc.) where the expected_formula is an actual Excel formula string.\`,
    GST: \`GST computation exercises: ITC eligibility, liability calculation, GSTR reconciliation, RCM computation. expected_formula should be a step-by-step calculation (e.g., "IGST = Taxable Value × 18% = ₹X").\`,
    TDS: \`TDS deduction exercises: identify section, compute TDS amount, determine deposit due date. expected_formula should be: "TDS = Gross Payment × Rate% = ₹X; due by [date]".\`,
    Accounting: \`Journal entry exercises: identify correct debit/credit, Ind AS basis, and disclosure impact. expected_formula should be journal entry in "Dr [Account] ₹X / Cr [Account] ₹X" format.\`,
    Tally: \`Tally voucher entry exercises: identify voucher type, ledger names, and menu path. expected_formula should be: "Voucher: [type] | Dr: [ledger] ₹X | Cr: [ledger] ₹X | Path: [menu path]".\`,
    Interview: \`Answer-framing exercises: given an interview question, identify which framework to use (STAR/technical/opinion) and the 3 key points to hit. expected_formula should be: "Framework: STAR | Hook: [1 sentence] | Core: [2–3 points] | Close: [1 sentence]".\`,
  };

  const exerciseType = exerciseTypeByCategory[category] ?? exerciseTypeByCategory['Accounting'];

  return \`
Generate a realistic practice dataset for a CA student studying: "\${topic.title}" (Module: \${category}).

The dataset must use real Indian company names, Indian amounts (₹), and scenarios relevant to \${category} work in India.

Return ONLY a JSON object in this exact shape — no markdown, no explanation, no backticks:
{
  "title": "short dataset title (max 60 chars)",
  "description": "one sentence describing the dataset scenario",
  "columns": ["col1", "col2", "col3", ...],
  "rows": [
    ["val1", "val2", "val3", ...],
    ...
  ],
  "exercises": [
    {
      "question": "Clear, specific question a CA student should be able to answer using the data above.",
      "expected_formula": "The exact answer/formula/entry — see format below.",
      "difficulty": "easy | medium | hard",
      "hint": "One sentence pointing to the right concept or cell range.",
      "explanation": "2–3 sentences explaining why the answer is correct, citing the relevant section/standard/rule."
    }
  ]
}

Dataset requirements:
- 15–20 rows of realistic Indian accounting/business data for "\${topic.title}".
- Columns should match what a CA would actually see in a working file (e.g., invoice numbers, GSTIN, amounts, dates, ledger names).
- 5 exercises of varying difficulty (at least 1 easy, 2 medium, 2 hard).
- Exercise type for this module: \${exerciseType}
- All ₹ amounts should be realistic for an Indian SME or corporate (₹10,000 – ₹50,00,000 range).
- Do not repeat same scenario across exercises.
\`.trim();
}

// ─────────────────────────────────────────────
// UTILITY: GET CATEGORY FROM SLUG
// ─────────────────────────────────────────────

/**
 * Maps a URL slug to a canonical category name.
 * Useful if you ever need to derive the prompt category from the route.
 */
export function categoryFromSlug(slug: string): string {
  const map: Record<string, string> = {
    excel: 'Excel',
    gst: 'GST',
    tds: 'TDS',
    accounting: 'Accounting',
    tally: 'Tally',
    interview: 'Interview',
  };
  return map[slug.toLowerCase()] ?? 'Accounting';
}
