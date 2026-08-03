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


Available families are:

1. DEED
eg Deed of assignment, Deed of lease, Deed of mortgage etc

Return
{
"type": "deed",
"intent": "DRAFT"
}

2. AGREEMENT
eg Hire purchase agreement, agreement etc

Return
{
"type": "agreement",
"intent": "DRAFT"
}

3. WILLS
eg Wills

Return
{
"type": "wills",
"intent": "DRAFT"
}

4. LEGAL_OPINION
eg Legal opinion

Return
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

Do not modify section numbering.

Ensure you number and paragraph sentences, where applicable, to enhance readability.

Do NOT alter legal intent.

FOR DEED:
Polish and modify
1. Contents of BACKGROUND as per what is provided in the source of title.
2. Execution part as the case may be.
3. Where parties title are totally different from the requested draft. or where words used in a template is totally different from what the user is demanding e.g user requested for a deed of conveyance, but deed of assignment was presented.
4. Modify the execution part where either party is a corporate body, organization, infant or illeterate.
5. Clause or covenants. e.g a Mortgage clause bears vendor or something else, modify to mortgagor.

FOR LEGAL_OPINION:
Polish
1. Contents of CONCLUSION

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
      model: 'gpt-5',

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
          WILLS
          AGREEMENT
          LETTER
          LEGAL_OPINION
          RESOLUTION
          AFFIDAVIT
          MOTION
          PETITION
          OTHER


          Review according to its document type.

          For DEEDS:

          Any legal document beginning with "Deed of..."
          belongs to the DEED family.


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

  async quickDraftEnhancer(draft: string) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-5-mini',

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

Replace all placeholders with realistics name, address, occupation and scenerio. eg never leave {{propertyDescription}}, {{propertyAddress}} etc.

Quick draft should be direct, sweet, professional, moderately small, accurate and easy to understand.

Generate realistics Nigerian examples.

FOR DEED:
1. Input at least 1 or 2 covenants, and where covenants are more than 3 reduce it.
2. Create an execution part, where none is provided.
3. Do not modify these;
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

FOR LEGAL_OPINION:
1. Create realistics Nigerian scenerio.


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
      model: 'gpt-5-mini',

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

FOR DEED:
1. Do not substantially increase word count.
2. Dates should be like this; e.g 2nd October, 2020.
3. Amounts should be in figure and in words; e.g 5,000,000.00 or Five Million Naira Only
4. Amounts should carry a currency sign. if no currency is provided the default is Naira.
5. If no state is provided, use property state, or vendor's, seller's, lessor's, assignor's, donor's, mortgagor's state.
6. Franking is totally optional, and can be left blank.
7. All clauses or covenants should be replaced in the '{{clause}}' placeholder or in a clause or cvenant's section.
8. All clauses or convenants should be numbered.
9. If some covenants or clauses do not belong in the same Heading, create a Heading for that clause or covenant. eg Donor's clauses & Donee's clauses.
10. Always provide titles for the parties. eg 'Mr' or 'Mrs', unless the party is a company, organization or you are unsure of the parties gender.
11. Do not modify these;
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

FOR LEGAL_OPINION:
Laws that may be of assistance, if no laws are provided.
1. 1999 Constitution Of Nigeria.
2. Nigeria Land Use Act.
3. Companies And Alied Matters Act 2020.
4. International Treaties And Conventions.
5. Tenancy Laws.
6. Recovery Of Premises Laws.
7. Wills Act.
8. Cybercrime Act.
9. Terrorism Act.
10. Evidence Act.
11. Criminal And Penal Act.
12. Administration Of Criminal Justice Act.
13. Trade Union Act.
14. Labour Act.
15. Other Relevant Laws as the case may be

FOR AGREEMENT:
1. Do not substantially increase word count.
2. Dates should be like this; e.g 2nd October, 2020.
3. Amounts should be in figure and in words; e.g 5,000,000.00 or Five Million Naira Only
4. Amounts should carry a currency sign. if no currency is provided the default is Naira.
5. All clauses or covenants should be replaced in the '{{clause}}' placeholder or in a clause or cvenant's section.
6. All clauses or convenants should be numbered.
7. If some covenants or clauses do not belong in the same Heading, create a Heading for that clause or covenant. eg Donor's clauses & Donee's clauses.
8. Always provide titles for the parties. eg 'Mr' or 'Mrs', unless the party is a company, organization or you are unsure of the parties gender.


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
      model: 'gpt-5-mini',

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
