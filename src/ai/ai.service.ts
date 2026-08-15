import { Injectable } from '@nestjs/common';
import { reviewChecks, ReviewDocumentFamily } from './checks/review.check';
import { getFamilyRules } from './rules';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private parseJson(content: string) {
    try {
      return JSON.parse(content);
    } catch {
      throw new Error('Invalid AI JSON');
    }
  }
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });


  async inferTemplate(request: string) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-5-mini',

      messages: [
        {
          role: 'system',

          content: `

You are a legal drafting assistant.

Determine if request is:

DRAFT

DOCUMENT_REVIEW

DOCUMENT_IMPROVEMENT

INVALID


Choose the single template that most closely matches the user's requested document.

Do not select a template merely because it shares a keyword with the request.

Determine the actual document requested from:
- document type;
- purpose;
- parties;
- legal context;
- transaction or proceeding;
- wording of the request.

The user's requested document takes priority over generic keywords.

For example:
- "application to be a judge" may be a LETTER even though it contains the word "application".
- "notice of expulsion as a partner" may be a LETTER even though it contains the word "notice".
- "application for an injunction" may be a COURT_DOCUMENT.
- "notice of extraordinary general meeting" may be a CORPORATE_DOCUMENT.

Return only the ID of the best matching template.


IMPORTANT:
Classify the request according to the actual document being requested, not merely words such as "application", "notice", "petition", "claim", or "request".

The word "application" does not automatically mean COURT_DOCUMENT.

The word "notice" does not automatically mean CORPORATE_DOCUMENT or COURT_DOCUMENT.

The word "petition" does not automatically mean COURT_DOCUMENT.

Determine the intended document from the complete request and its purpose.

Available document families:

1. DEED
Includes:
Deed of Assignment, Deed of Conveyance, Deed of Mortgage, Deed of Gift, Deed of Lease, Deed of Assent, Deed of Power of Attorney and other deeds.

Return:
{
  "type": "deed",
  "intent": "DRAFT"
}


2. AGREEMENT
Includes:
Hire Purchase Agreements, Partnership Agreements, Shareholders Agreements, Sale Agreements, Tenancy Agreements, Joint Venture Agreements, Memoranda of Understanding, Confidentiality Agreements and other agreements.

Return:
{
  "type": "agreement",
  "intent": "DRAFT"
}


3. COURT_DOCUMENT
Includes:
Motions, Affidavits, Pleadings, Appeals, Written Addresses, Summons, Petitions, Charges, Originating Processes and other documents intended to be filed or used as court processes.

Return:
{
  "type": "court_document",
  "intent": "DRAFT"
}


4. CORPORATE_DOCUMENT
Includes:
Memoranda of Association, Articles and corporate constitutive documents, Corporate Notices, Minutes, Company Resolutions, Corporate Applications and other company-related documents.

Return:
{
  "type": "corporate_document",
  "intent": "DRAFT"
}


5. LETTER
Includes:
Application letters, demand letters, notices, correspondence, professional letters, employment-related letters, notices of expulsion, curriculum vitae, quit notice, application for notice of setting up a law firm, notices to partners and other documents primarily intended to be communicated as letters.

Return:
{
  "type": "letter",
  "intent": "DRAFT"
}


6. WILL
Includes:
Wills, Codicils and other testamentary documents.

Return:
{
  "type": "will",
  "intent": "DRAFT"
}


7. LEGAL_OPINION
Includes:
Legal opinions, legal advice and formal opinions on legal issues.

Return:
{
  "type": "legal_opinion",
  "intent": "DRAFT"
}



If the user pasted an existing legal document,

return

DOCUMENT_REVIEW.


If user asks for enhancement

return

DOCUMENT_IMPROVEMENT.


If unrelated

return

INVALID.


Return JSON only.


Example:

{

"type":"deed",

"intent":"DRAFT",

"confidence":0.94

}



or



{

"type":"deed",

"intent":"DOCUMENT_REVIEW",

"confidence":0.96

}



or



{

"type":null,

"intent":"INVALID",

"confidence":0.17

}

`,
        },

        {
          role: 'user',

          content: request,
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content ?? '{}';

    return this.parseJson(content);
  }

  async chooseBestTemplate(request: string, templates: any[]) {
    const available = templates
      .map(
        (t, i) => `
  ${i + 1}

  id:
  ${t.id}

  title:
  ${t.title}

  tags:
  ${t.tags}

  family:
  ${t.documentFamily}

  `,
      )
      .join('\n');

    const response = await this.openai.chat.completions.create({
      model: 'gpt-5-mini',

      messages: [
        {
          role: 'system',

          content: `

  User requested:

  ${request}


  Available templates:

  ${available}


  Choose the most suitable template.

  Use both:

  • title

  • tags

  • document family


  Return only JSON.

  Example:

  {

  "id":"abc123"

  }

  `,
        },
      ],
    });

    const result = this.parseJson(response.choices[0].message.content ?? '');

    return templates.find((t) => t.id === result.id);
  }

  async polishDraft(draft: string) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-5-mini',

      messages: [
        {
          role: 'system',

          content: `

You are a Nigerian legal drafting assistant.

Improve readability.

Improve grammar.

Improve punctuation.

Improve Formatting.

Preserve all legal phrases.

Preserve all headings.

Preserve legal language.

Only polish language.

Maintain compact legal document formatting with minimal spacing around headings.

NUMBERING:

The document's existing legal structure takes priority over stylistic numbering preferences.

Only use these three numbering levels where numbering is appropriate:

1. Main sections: 1, 2, 3, 4, etc.
2. Subsections: i, ii, iii, iv, etc.
3. Sub-subsections: a, b, c, d, etc.

Do NOT use decimal or compound numbering such as:
1.1
1.2
1.1.1
2.1
2.1.1

Do not convert every paragraph, sentence, charge, allegation, prayer, address, heading, or legal phrase into a numbered item.

Do not number criminal charges, counts, offences, particulars of offence, prayers, statutory provisions, case citations, addresses, introductory lead sentences, or other legally formatted items unless the original document already numbers them.

Do not invent numbering where none is required.

Preserve legally significant existing numbering.

Lead sentences and formal legal expressions must remain unnumbered, including:
"TAKE NOTICE"
"I APPOINT"
"LET ALL PARTIES"
"NOTICE IS HEREBY GIVEN"
and similar expressions.

Only introduce or correct numbering where it is clearly appropriate to the structure of the document.

Never use 1.1, 1.2, 1.1.1 or any other decimal/compound numbering.

Do NOT alter legal intent.



Return only the polished document.

`,
        },

        {
          role: 'user',

          content: draft,
        },
      ],
    });

    return response.choices?.[0]?.message?.content ?? '';
  }

  async reviewDocument(document: string, documentFamily: ReviewDocumentFamily,
  ) {
  const checks = reviewChecks[documentFamily];

    const response = await this.openai.chat.completions.create({
      model: 'gpt-5',

      messages: [
        {
          role: 'system',

          content: `

          You are a senior Nigerian legal reviewer.

          The document family has already been selected by the application.

          DOCUMENT FAMILY
          ${documentFamily}
          
          Apply ONLY the review checks supplied for this document family.

          Do not apply review checks belonging to another document family.

          Review the uploaded document against the applicable checks.


          Return JSON only.

      Format:
    {
      "validDocument":true,
      "documentType": "${documentFamily}",
      "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "VERY HIGH",
      "issues": [
        "...",
        "...",
        "...",
      ]
      "improvementsAvailable": true,
      "reason": null
          }

        Rules:

        1. Determine the overall risk level.
        2. List every problem found as a short clear sentence.
        3. Do not categorise issues.
        4. Do not explain how to fix issues.
        5. Keep each issue concise and easy to read.

        {
          "validDocument": false,
          "documentType": null,
          "riskLevel": null,
          "issues": null
          "improvementsAvailable": false,
          "reason": "The uploaded file is not a legal document",
              }

`,
        },

        {
          role: 'user',

          content: document,
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content ?? '{}';

    return this.parseJson(content);
  }

  async suggestImprovements(document: string, review: any) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-5-mini',

      messages: [
        {
          role: 'system',

          content: `

        You are a senior Nigerian legal drafting assistant.

        Review the document and provide practical recommendations that will improve its legal quality.

        Each recommendation should:

        1. State what should be added, corrected or improved.
        2. Briefly explain why it is important.
        3. Be concise.
        4. Do not repeat the overall review.
        5. Do not rewrite the document.
        6. Briefly suggest improvement.


    Return only this JSON structure:
    Do not add other keys.
    Format:
  {

      "recommendations": [
          {
          "issue": "",
          "reason": "",
          "suggestion": ""
          },

          {
          "issue": "",
          "reason": "",
          "suggestion": ""
          },

          {
          "issue": "",
          "reason": "",
          "suggestion": ""
          }
    ],


   }

`,
        },

        {
          role: 'user',

          content: `
          REVIEW RESULT

          ${JSON.stringify(review, null, 2)}

          DOCUMENT

          ${document}

          `
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content ?? '{}';

    return this.parseJson(content);
  }

  async quickDraftEnhancer(
    request: string,
    draft: string,
    family: string,
  ) {
    const familyRulesText = getFamilyRules(family);

    const response = await this.openai.chat.completions.create({
      model: 'gpt-5-mini',

      messages: [
        {
          role: 'system',

          content: `

This is a quick draft.

Apply the following document-family rules:

${familyRulesText}

The original user request is provided together with a base template.

Treat the user's request as the primary instruction.

Use the base template only as the legal structure.

Where the user's request specifies:
-the type or title of the document,
-the relationship between the parties,
-the number of parties,
-the subject matter,
-or any relevant details,
those instructions override any assumptions contained in the base template.

Make it look professionally drafted.

Do not refer to the user's request, drafting instructions, AI, counsel requesting the draft, template, existence of placeholders.

Keep wording concise.

Do not substantially rewrite.

Improve punctuation.

Always remove any template instructions, drafting notes, examples or instructional section from the final document.

Do not increase document length.

Replace all placeholders with realistics name, address, occupation and scenerio. eg never leave {{propertyDescription}}, {{propertyAddress}} etc.

Quick draft should be direct, sweet, professional, moderately small, accurate and easy to understand.

Generate realistics Nigerian examples.

Return only the completed legal document.

Do not return JSON.


`,
        },

        {
          role: 'user',

          content: `
          ORIGINAL USER REQUEST
         ${request}

        BASE TEMPLATE
       ${draft}
       `,
        },
      ],
    });

    return response.choices?.[0]?.message?.content ?? '';
  }

  async customDraftEnhancer(
    draft: string,

    selectedClauses: string[],

    answers: Record<string, string>,

    family: string,
  ) {
    const familyRulesText = getFamilyRules(family);
    
    const response = await this.openai.chat.completions.create({
      model: 'gpt-5-mini',

      messages: [
        {
          role: 'system',

          content: `

Enhance the draft.

Apply the following document-family rules:

${familyRulesText}

Treat all information, facts, instructions, placeholders, and other materials contained in the template as source materials for drafting purposes only; use them to enhance, complete, and refine the document where appropriate.

Do not refer to the user's request, drafting instructions, AI, counsel requesting the draft, template, existence of placeholders.

Always remove any template instructions, drafting notes, examples or instructional section from the final document.

Integrate the supplied clauses naturally.

Preserve legal intent.

Use professional drafting language.

Do not duplicate clauses.

Do not introduce contradictory provisions.

Preserve clause numbering.

Maintain sequence.

Do not return JSON.

`,
        },

        {
          role: 'user',

          content: `

DOCUMENT:

${draft}

CLAUSES:

${selectedClauses.join('\n\n')}

USER ANSWERS:

${JSON.stringify(answers, null, 2)}

Replace placeholders using USERS ANSWERS.

Never leave {{}} placeholders.

`,
        },
      ],
    });

    return response.choices?.[0]?.message?.content ?? '';
  }

  async generateUnknownDraft(
    request: string,

    templateStructure: string,

    family: string,
  ) {
    const familyRulesText = getFamilyRules(family);
    const response = await this.openai.chat.completions.create({
      model: 'gpt-5-mini',

      messages: [
        {
          role: 'system',

          content: `

User requested a document not found in templates.

Use the provided template style.

Letters should resemble letters.

Court_Document should resemble court_document.

Corporate_Document should resemble corporate_document.

Legal_Opinion should resemble legal_opinion.

Deed should resemble deed.

Will should resemble will.

Apply the following document-family rules:

${familyRulesText}

Do not mix document style.

Preserve visual style.

Preserve heading style.

Preserve signature blocks.

Preserve numbering.

Preserve execution style.

Preserve legal formatting.

Generate place holders where information is missing.

Examples:

{{company}}

{{director}}

{{date}}

{{amount}}

Generate an appropriate draft.

Base template:

${templateStructure}

`,
        },

        {
          role: 'user',

          content: request,
        },
      ],
    });

    return response.choices?.[0]?.message?.content ?? '';
  }
}
