import { Injectable } from '@nestjs/common';
import hints from './hint.json';
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

  async extractLegalData(prompt: string) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4.1-mini',

      messages: [
        {
          role: 'system',

          content: `
You are a Nigerian legal draft parser .

Extract all identifiable drafting variables.

Examples:

vendor
purchaser
lessor
lessee
landlord
tenant
assignor
assignee
donor
donee
mortgagor
mortgagee
defendant
claimant
applicant
applicant/defendant's name
applicant/claimant's name
garnishee's name
director name
secretary name
CAC number
property address
property price
date
survey number
amount

Return ONLY JSON.

Never explain.

Never wrap JSON in markdown.

Use null for missing values.

Normalize monetary values.

Extract both numeric and textual amounts.

Extract locations.

Extract occupations.

Extract company names.

Extract CAC numbers.

Unkown values should be null.

`,
        },

        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content ?? '{}';

    return this.parseJson(content);
  }

  async inferTemplate(request: string) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4.1-mini',

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


Available families

deed;
if user requests
Deed of Assignment
Deed of Conveyance

Return
{
"type": "deed",
"intent": "DRAFT"
}


motion

affidavit

letter

resolution

petition

summons

corporate notice



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
      model: 'gpt-4.1-mini',

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
      model: 'gpt-4.1-mini',

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

Do not modify section numbering.

Do NOT alter legal intent.


-Do Not modify for deed:

NOW THIS DEED WITNESSETH AS FOLLOWS

THIS DEED WITNESSETH AS FOLLOWS

THIS DEED RECITES AS FOLLOWS:

ACKNOWLEDGEMENT FOR SAFE CUSTODY AND PRODUCTION OF DOCUMENT

WHEREAS

BACKGROUND

in consideration of

the receipt of which the ... hereby acknowledges

the ... conveys (or assigns) unto the ... ALL that

TO HOLD the same unto the

THE SCHEDULE REFERRED TO

ALL THAT

IN WITNESS OF WHICH

SIGNED, SEALED AND DELIVERED


However Briefly Modify For Deed:
1. Contents of BACKGROUND as per what is provided in the source of title.
2. Execution part as the case may be.
3. Where parties title are totally different from the requested draft. or where words used in a template is totally different from what the user is demanding e.g user requested for a deed of conveyance, but deed of assignment was presented.
4. Modify the execution part where either party is a corporate body, organization, infant or illeterate.
5. Clause or covenants. e.g a Mortgage clause bears vendor or something else, modify to mortgagor.


-Do Not modify For Resolution:

FEDERAL REPUBLIC OF NIGERIA

IN THE COMPANIES AND ALLIED MATTERS ACT 2020



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

  async reviewDocument(document: string) {
    const draftingHintsText = JSON.stringify(hints, null, 2);

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4.1-mini',

      messages: [
        {
          role: 'system',

          content: `

          You are a senior Nigerian legal reviewer.
          
          Use this draft hints.
          
          ${draftingHintsText}
          
          Review document.
          
          First identify the document type.
          
          Possible types:
          
          DEED
          LETTER
          LEGAL_OPINION
          RESOLUTION
          AFFIDAVIT
          MOTION
          PETITION
          OTHER
          
          
          Review according to its document type.
          
      
          For DEEDS:
          Check:
          - missing operative clauses
          - missing covenants
          - missing consideration
          - missing schedules
          - title defects

          Available families
          
          DEED
          
          Examples include:
          
          - Deed of Assignment
          - Deed of Conveyance
          - Deed of Partition
          - Deed of Gift
          - Deed of Mortgage
          - Deed of Release
          - Deed of Surrender
          - Deed of Rectification
          - Deed of Exchange
          - Deed of Variation
          
          Any legal document beginning with "Deed of..."
          belongs to the DEED family.
          
          
          For LETTERS:
          Check:
          - clarity
          - legal position
          - missing facts
          - tone
          - requested relief
          
          
          For LEGAL OPINIONS:
          Check:
          - legal reasoning
          - authorities
          - conclusions
          - assumptions
          
          
          For RESOLUTIONS:
          Check:
          - company law compliance
          - authority
          - signatures
          - meeting requirements
          
          
          
          Return JSON only.

      Format:
    {
      "validDocument":true,
      "documentType": "DEED",
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
      model: 'gpt-4.1-mini',

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

  async quickDraftEnhancer(draft: string) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4.1-mini',

      messages: [
        {
          role: 'system',

          content: `

This is a quick draft.

Make it look professionally drafted.

Keep wording concise.

Do not substantially rewrite.

Improve punctuation.

Do not increase document length.

Replace all placeholders.

Never leave:

{{vendor}}
{{purchaser}}
{{amount}}
{{date}}

Generate realistics Nigerian examples.
Examples:

vendor: Jackson Jax
purchaser: Benjamin Akwu
address: No. 6 Hailey Street, Port-Harcourt, No. 4 Harrison Lane, Lugbe, Abuja
amount: Five Million Naira, Thirty Million Naira
date: 13th July, 2026

Return only the completed legal document.

Do not return JSON.


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

  async customDraftEnhancer(
    draft: string,

    selectedClauses: string[],

    answers: Record<string, string>,
  ) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4.1-mini',

      messages: [
        {
          role: 'system',

          content: `

Enhance the draft.

Enhance the draft as per the instructions at the bottom of each templates. Also ensure you erase the entire instruction's section after enhancement.

Integrate the supplied clauses naturally.

Preserve legal intent.

Use professional drafting language.

Do not duplicate clauses.

Do not introduce contradictory provisions.

Preserve clause numbering.

Maintain sequence.

For letters:

Target 100 - 400 words.

For legal opinion:

Target 500 - 900 words.

For Resolutions:

Target 50 - 200 words.

For deed:

-Do not substantially increase word count.

-Dates should be like this; e.g 2nd October, 2020.

-Amounts should be in figure and in words; e.g 5,000,000.00 or Five Million Naira Only

-Amounts should carry a currency sign. if no currency is provided the default is Naira.

-If no state is provided, use property state, or vendor's, seller's, lessor's, assignor's, donor's, mortgagor's state.

-Franking is totally optional, and can be left blank.

-All clauses or covenants should be replaced in the '{{clause}}' placeholder or in a clause or cvenant's section.

-All clauses or convenants should be numbered.

-If some covenants or clauses do not belong in the same Heading, create a Heading for that clause or covenant. eg Donor's clauses & Donee's clauses.

-Always provide titles for the parties. eg 'Mr' or 'Mrs', unless the party is a company, organization or you are unsure of the parties gender.



For affidavit:

Target 50 - 400 words.

Preserve sequence.

Preserve numbering.

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
  ) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4.1-mini',

      messages: [
        {
          role: 'system',

          content: `

User requested a document not found in templates.

Use the provided template style.

Letters should resemble letters.

Motions should resemble motions.

Affidavits should resemble affidavits.

Corporate Notices should resemble corporate notices.

Originating applications resembles a motion.

Resolutions should resemble resolutions.

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
