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

5. MOTION
eg motion ex parte, motion on notice, motion for joinder of party, garnishee order, moving a motion etc

Return
{
"type": "motion",
"intent": "DRAFT"
}

6. CHARGES
eg criminal information, charge sheet in the north, charge sheet

Return
{
"type": "charges",
"intent": "DRAFT"
}

7. AFFIDAVIT
eg affidavit

Return
{
"type": "affidavit",
"intent": "DRAFT"
}

8. WRITTEN ADDRESS
eg written address, final address 

Return
{
"type": "written address",
"intent": "DRAFT"
}

9. APPEAL
eg notice of appeal

Return
{
"type": "appeal",
"intent": "DRAFT"
}

10. PLEADINGS
eg claim, statement of claim, statement of defence, counter-claim, writ of summons, interpleader summons, originating summons etc

Return
{
"type": "pleadings",
"intent": "DRAFT"
}

11. PETITIONS
eg election petition, petition for dissolution of marriage, petition for winding-up

Return
{
"type": "petitions",
"intent": "DRAFT"
}

12. COURT_APPLICATIONS
eg list of evidence, notice to defend, CMC notice, pre action protocol etc

Return
{
"type": "court_applications",
"intent": "DRAFT"
}

13. CORPORATE_APPLICATIONS
eg application for exemption, letter of allotment, letter of regret, statutory letter of demand etc

Return
{
"type": "corporate_applications",
"intent": "DRAFT"
}

14. MEMORANDUM_OF_ASSOCIATION
eg memorandum of association of a company, memorandum of association of a company limited by guarantee

Return
{
"type": "memorandum_of_association",
"intent": "DRAFT"
}

15. CORPORATE_NOTICE
eg notice of a meeting, requisition of an extra-ordinary general meeting

Return
{
"type": "corporate_notice",
"intent": "DRAFT"
}

16. RESOLUTION
eg resolution to increase share capital, resolution for re-registration, creditor's winding up, appointment of a liquidator etc

Return
{
"type": "resolution",
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

Use a clear and consistent hierarchical numbering system for all sections and clauses, to enhance readability, except lead sentences or lead-in-phrases eg 'TAKE NOTICE', 'I APPOINT', 'LET ALL PARTIES', 'NOTICE IS HEREBY GIVEN' etc.

Use Arabic numerals (1, 2, 3 ...) for main sections, Roman numerals (i, ii, iii ...) for subsections, and lowercase letters (a,b,c ...) for sub-subsections. Maintain this numbering structure consistently throughout the document.

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

          For AGREEMENTS:
          Any legal document having contents bearing "Agreement"
          belongs to the AGREEMENT family.

          For MOTIONS:
          Any legal document with contents like  "An Order ..", "A Declaration", "Motion on ..", "Injunction"
          belongs to the MOTION family.

          For LEGAL_OPINION:
          Any legal document with contents like "Legal opinion", "Legal advice"
          belongs to the LEGAL_OPINION family.

          For WILLS:
          Any legal document with contents like "wills", "codicil", "probate", "letters of administrations"
          belongs to the WILLS family.


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

  async quickDraftEnhancer(
    request: string,
    draft: string,
  ) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-5-mini',

      messages: [
        {
          role: 'system',

          content: `

This is a quick draft.

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

Always get rid of the instructions section at the bottom of the template.

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
12. Enhance contents of BACKGROUND as per what is provided in the source of title.
13. Enhance execution part as the case may be.
14. Enhance clause or covenants. e.g a Mortgage clause bears vendor or something else, modify to mortgagor.

FOR AGREEMENT:
1. Do not substantially increase word count.
2. Dates should be like this; e.g 2nd October, 2020.
3. Amounts should be in figure and in words; e.g 5,000,000.00 or Five Million Naira Only
4. Amounts should carry a currency sign. if no currency is provided the default is Naira.
5. Always provide titles for the parties. eg 'Mr' or 'Mrs', unless the party is a company, organization or you are unsure of the parties gender.

FOR LEGAL_OPINION:
1. Create realistics Nigerian scenerio.
2. The output must read as a completed legal opinion, not as an explanation of how the opinion was generated.
3. Do not invent facts that are not contained in the supplied material.
4. The 'intoduction' must introduce the subject matter, purpose and background of the legal opinion. it must not describe who requested the opinion or how the opinion was prepared.

FOR MOTION
1. The HEADING should be, in full capital letter and should be centralised.
2. The HEADING should look like this, eg 'IN THE HIGH COURT OF LAGOS STATE', 'IN THE LAGOS JUDICIAL DIVISION or IN THE IKEJA JUDICIAL DIVISION', 'HOLDEN IN LAGOS or HOLDEN AT IKEJA', or for magistrate courts 'IN THE MAGISTRATES' COURT OF LAGOS STATE', 'IN THE LAGOS MAGISTRATE DISTRICT or IN THE IKEJA MAGISTERIAL DISTRICT', 'HOLDEN AT LAGOS'.
3. Party role should be directly opposite the name, that is at the right hand side. eg Jackson Chinedu .......... Applicant
4. Motion ex parte has no service. i.e the motion is not served on the other party.
5. All motion ex parte are filled together with a motion on notice. so most times, it is stated in the ex parte motion. eg for an Interim Injunction: AN ORDER restraining ___ pending the hearing of the Motion on notice already filed before the court and AN ORDER restraining ___ pending the determination of the substantive suit.
6. For Anton Piller: AN ORDER ___ restraining the ___ for destroying copyright materials, that is to be used as evidence.
7. For Mareva injunction: AN ORDER ___ restraining the ___ from removing his assets from jurisdiction.
8. For Misjoinder: AN ORDER ___ striking out ___ in this suit.
9. For Renewal of writ: AN ORDER ___ extending the lifespan of the writ of summons and other originating processes in the suit for three (3) months.
10. For Substituted service: AN ORDER ___ granting leave on the ____ to effect substituted service on the ____, by way of advertising in two (2) daily national newspapers.
11. For Amending a writ: AN ORDER ___ granting leave to the __ to amend his writ of summons, as stated in the proposed amended writ of of summons.
12. For Joinder of party(s): AN ORDER ___ joining ___ as ___ in this suit.
13. For Leave to sue in representative capacity: AN ORDER ___ granting leave to the ___ to commence this action in a representative capacity on behalf of himself and the ___.
14. For Jurisdiction: AN ORDER __ striking this suit for lack of jurisdiction.
15. For Summary judgement: AN ORDER ___ to be entered for the ___ enabling him to recover ___ owed to him by the ___.
16. For Garnishee order: A GARNISHEE ORDER NISI attaching the sum of ___, standing to the credit of the judgment debtor in Account number: ___, at the ___ branch of the garnishee, in satisfaction of the judgment in favour of the judgment creditor/applicant in this case.
17. For Enforcement of Fundamental Human Rights: A DECLARATION that the arrest of the applicant by the ___ is unlawful and unconstitutional and AN ORDER __ compelling the ___ to release the applicant from prison.
18. For Trinity Prayers: AN ORDER FOR EXTENSION OF TIME to seek leave to appeal the decision of the __ high court delivered by honourable Justice __ on the __ in suit No: ____, AN ORDER GRANTING LEAVE TO APPEAL, and AN ORDER FOR EXTENSION OF TIME WITHIN WHICH TO FILE AN APPEAL.
19. For Setting aside garnishee order: AN ORDER setting aside the garnishee order nisi made on the ___.
20. Always provide titles for the parties. eg 'Mr' or 'Mrs', unless the party is a company, organization or you are unsure of the parties gender.
21. The date should look like this, eg Dated this 31st day of january, 2026.
22. If a name carries infant, lunatic, partner, then it should be like this, eg Mr Jackson(infant) .......... Applicant. no ocupation or address should be stated.
23. An originating motion is used to commence an action in court and therefore always includes an Applicant and a Respondent.
24. if the content of the draft is related to criminal law, SUIT NO: should become CHARGE NO: eg motion for bail.
25. Motions are served to the other party except Ex Parte motion. so 'For Service:' should always end like this eg 'For Service', 'The Respondent'.
26. For Bail application; it must be stated that every person is presumed innocent until the contrary, name(s)of surety must also be provided.


FOR PLEADINGS
1. The HEADING should be, in full capital letter and should be centralised.
2. The HEADING should look like this, eg 'IN THE HIGH COURT OF LAGOS STATE', 'IN THE LAGOS JUDICIAL DIVISION or IN THE IKEJA JUDICIAL DIVISION', 'HOLDEN IN LAGOS or HOLDEN AT IKEJA', or for magistrate courts 'IN THE MAGISTRATES' COURT OF LAGOS STATE', 'IN THE LAGOS MAGISTRATE DISTRICT or IN THE IKEJA MAGISTERIAL DISTRICT', 'HOLDEN AT LAGOS'.
3. Party role should be directly opposite the name, that is at the right hand side. eg Jackson Chinedu .......... Claimant.
4. Always provide titles for the parties. eg 'Mr' or 'Mrs', unless the party is a company, organization or you are unsure of the parties gender.
5. The date should look like this, eg Dated this 31st day of january, 2026.
6. If a name carries infant, lunatic, partner, then it should be like this, eg Mr Jackson(infant) .......... Applicant. no ocupation or address should be stated.
7. All pleadings are served to the DEFENDANT. so 'For Service:' should always end like this eg 'For Service', 'The Defendant'.


FOR CHARGES
1. These are four (4) rules in draftng a charge sheet 'Rule against ambiguity', 'Rule against duplicity', 'Rule against misjoinder of offences', 'Rule against misjoinder of offenders'.
2. For Rule Against Ambiguity: a charge sheet has to be clear and there is no exceptions. ambiguity relates to individual counts. i.e name of the defendant(s), date of comission of the offence, place of comission of the offence, offence, and in most cases punishment sections. eg 'Wisdom mischef on the 19th day of January 2026 at Room 18, Boom boom lodge of No 6 Ekene Street, Victoria Island, Lagos, Lagos State, in the Lagos Judicial division raped Miss. Loveth Puss.' or for magistrate's court 'That you Mr. Machine mart on the 12th day of January 2026 at No 6 Ganja Street Benin City, Edo State, in the Benin Judicial Division sold 20 kilograms of a substance suspected to be cocaine to Mr. Marcus willi and thereby committed an offence punishable under section 11 (c) of the National Drug Law Enforcement Agency Act CAP N30 LFN 2004.'.
3. For Rule Against Duplicity: do not put two (2) offences in one count. eg If the defendant killed 5 people, 5 different counts. The Exceptions Are: 'When it involves money belonging to one person over a long period of time. eg Mr. A steals 500 from Mr. B 3 days ago, and steals again today', 'offences in a particular section of the Law, but can be committed in different ways. eg Where an Act or Law provides that where a person hit, slap, spits on another, he/she thereby commits an offence of assault.', 'overt acts in respect of treason, and treasonable felonies. eg the law provides that two (2) overt acts must be provided before a person can be convicted for treason'.
4. For Rule Against Misjoinder Of Offences: each offences has to be in a separate charge sheet. The Exceptions Are: 'offences committed within one (1) year', 'offences committed in the course of the same transaction', 'offences comprising acts or omissions which by themselves or in conjunction with others constitute a different offence', 'offences of the same or similar character', 'acts or omission that constitute an offence falling within two or more separate definitions'.
5. For Rule Against Misjoinder Of Offenders: each offenders has to be in a separate charge sheet. The Exceptions Are: 'persons accused of jointly committing the same offence', 'persons accused of committing different offences in the course of the same transaction, i.e the test is proximity of time or place, continuity of action, community of purpose or design', 'persons accused of committing an offence and persons accused of aiding, abetting or attempting to commit the said offence', 'persons accused of committing the same offence in the course of the same transaction', 'persons accused of committing offences that are related one to the other', 'persons accused of offences committed during a fight or series of fights arising out of another fight and person accused of abetting any of these offences maybe charged and tried together'.
6. Where the instructions, are not in conformity with any of the RULES, always enhance.
7. Always look at the exceptions of each RULES before you draft. 
8. Where instructions violates misjoinder of offence and misjoinder of offenders, and the instructions does not fall on any of the exceptions, draft seperate/multiple charge sheets as the case may be.
9. Always provide titles for the parties. eg 'Mr' or 'Mrs', unless you are unsure of the parties gender.
10. If a name carries infant then it should be like this, eg Mr Jackson(infant) .......... Defendant. no ocupation or address should be stated.
11. All charges are served to the DEFENDANT. so 'For Service:' should always end like this eg 'For Service', 'The Defendant'.



FOR CORPORATE_APPLICATIONS
1. For removal of company secretary; reasons for his removal should be stated, eg 'failure to write minutes, failure to perform his duties etc', seven (7) working days is usually given to him to make a defence or relinquish his office. it is usually signed by the 'board of directors'.
2. For application for exemption; it means a foreign company is coming to nigeria to do business but is applying for exemption NOT to be incorporated as a company. This is provided in section 80(2) CAMA 2020. Companies that fall under this category are; 'foreign companies invited to nigeria by federal government, foreign companies which are in nigeria for a specific individual loans, foreign government owned companies engaged solely in export promotion activities.etc'.
3. For application for exemption; it is always addressed to the minister of trade, industry and investment. Also it is always attached with other documents, it is best if you list them, i.e 'Proposed name and place of business in Nigeria, Particulars of the parent company outside Nigeria, Particulars of the name and address of each director, partners and principal officers of the company, Duration and proposed business of the company in Nigeria. etc' .
4. For application for consent to change name of company; it is always addressed to the Registrar General Corporate Affairs Commission. It is section 30(3) and 50(1) of CAMA 2020. The body of the application is like this 'I am directed on behalf of the board of directors of the company, to apply for the approval of the commission, for the name of the company to be changed to ...' .
5. CAMA means companies and allied matters act 2020

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
  ) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-5-mini',

      messages: [
        {
          role: 'system',

          content: `

Enhance the draft.

Enhance the draft as per the instructions at the bottom of each templates. Also ensure you erase the entire instruction's section after enhancement.

Treat all information, facts, instructions, placeholders, and other materials contained in the template as source materials for drafting purposes only; use them to enhance, complete, and refine the document where appropriate.

Do not refer to the user's request, drafting instructions, AI, counsel requesting the draft, template, existence of placeholders.

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
12. Enhance contents of BACKGROUND as per what is provided in the source of title.
13. Enhance execution part as the case may be.
14. Enhance clause or covenants. e.g a Mortgage clause bears vendor or something else, modify to mortgagor.

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
15. Fundamental Rights (Enforcement Procedure) Rules.
16. Electoral Act.
17. Other Relevant Laws as the case may be
18. The output must read as a completed legal opinion, not as an explanation of how the opinion was generated.
19. Do not invent facts that are not contained in the supplied material.
20. The 'intoduction' must introduce the subject matter, purpose and background of the legal opinion. it must not describe who requested the opinion or how the opinion was prepared.
21. The supplied 'full facts' and 'other relevant information' are source materials, not headings or sections to be reproduced.


FOR AGREEMENT:
1. Do not substantially increase word count.
2. Dates should be like this; e.g 2nd October, 2020.
3. Amounts should be in figure and in words; e.g 5,000,000.00 or Five Million Naira Only
4. Amounts should carry a currency sign. if no currency is provided the default is Naira.
5. All clauses or covenants should be replaced in the '{{clause}}' placeholder or in a clause or cvenant's section.
6. All clauses or convenants should be numbered.
7. If some covenants or clauses do not belong in the same Heading, create a Heading for that clause or covenant. eg Donor's clauses & Donee's clauses.
8. Always provide titles for the parties. eg 'Mr' or 'Mrs', unless the party is a company, organization or you are unsure of the parties gender.

FOR MOTION
1. The HEADING should be, in full capital letter and should be centralised.
2. The HEADING should look like this, eg 'IN THE HIGH COURT OF LAGOS STATE', 'IN THE LAGOS JUDICIAL DIVISION or IN THE IKEJA JUDICIAL DIVISION', 'HOLDEN IN LAGOS or HOLDEN AT IKEJA', or for magistrate courts 'IN THE MAGISTRATES' COURT OF LAGOS STATE', 'IN THE LAGOS MAGISTRATE DISTRICT or IN THE IKEJA MAGISTERIAL DISTRICT', 'HOLDEN AT LAGOS'.
3. Party role should be directly opposite the name, that is at the right hand side. eg Jackson Chinedu .......... Applicant
4. Motion ex parte has no service. i.e the motion is not served on the other party.
5. All motion ex parte are filled together with a motion on notice. so most times, it is stated in the ex parte motion. eg for an Interim Injunction: AN ORDER restraining ___ pending the hearing of the Motion on notice already filed before the court and AN ORDER restraining ___ pending the determination of the substantive suit.
6. For Anton Piller: AN ORDER ___ restraining the ___ for destroying copyright materials, that is to be used as evidence.
7. For Mareva injunction: AN ORDER ___ restraining the ___ from removing his assets from jurisdiction.
8. For Misjoinder: AN ORDER ___ striking out ___ in this suit.
9. For Renewal of writ: AN ORDER ___ extending the lifespan of the writ of summons and other originating processes in the suit for three (3) months.
10. For Substituted service: AN ORDER ___ granting leave on the ____ to effect substituted service on the ____, by way of advertising in two (2) daily national newspapers.
11. For Amending a writ: AN ORDER ___ granting leave to the __ to amend his writ of summons, as stated in the proposed amended writ of of summons.
12. For Joinder of party(s): AN ORDER ___ joining ___ as ___ in this suit.
13. For Leave to sue in representative capacity: AN ORDER ___ granting leave to the ___ to commence this action in a representative capacity on behalf of himself and the ___.
14. For Jurisdiction: AN ORDER __ striking this suit for lack of jurisdiction.
15. For Summary judgement: AN ORDER ___ to be entered for the ___ enabling him to recover ___ owed to him by the ___.
16. For Garnishee order: A GARNISHEE ORDER NISI attaching the sum of ___, standing to the credit of the judgment debtor in Account number: ___, at the ___ branch of the garnishee, in satisfaction of the judgment in favour of the judgment creditor/applicant in this case.
17. For Enforcement of Fundamental Human Rights: A DECLARATION that the arrest of the applicant by the ___ is unlawful and unconstitutional and AN ORDER __ compelling the ___ to release the applicant from prison.
18. For Trinity Prayers: AN ORDER FOR EXTENSION OF TIME to seek leave to appeal the decision of the __ high court delivered by honourable Justice __ on the __ in suit No: ____, AN ORDER GRANTING LEAVE TO APPEAL, and AN ORDER FOR EXTENSION OF TIME WITHIN WHICH TO FILE AN APPEAL.
19. For Setting aside garnishee order: AN ORDER setting aside the garnishee order nisi made on the ___.
20. Always provide titles for the parties. eg 'Mr' or 'Mrs', unless the party is a company, organization or you are unsure of the parties gender.
21. The date should look like this, eg Dated this 31st day of january, 2026.
22. If a name carries infant, lunatic, partner, then it should be like this, eg Mr Jackson(infant) .......... Applicant. no ocupation or address should be stated.
23. An originating motion is used to commence an action in court and therefore always includes an Applicant and a Respondent.
24. if the content of the draft is related to criminal law, SUIT NO: should become CHARGE NO: eg motion for bail.
25. Motions are served to the other party except Ex Parte motion. so 'For Service:' should always end like this eg 'For Service', 'The Respondent'.


FOR PLEADINGS
1. The HEADING should be, in full capital letter and should be centralised.
2. The HEADING should look like this, eg 'IN THE HIGH COURT OF LAGOS STATE', 'IN THE LAGOS JUDICIAL DIVISION or IN THE IKEJA JUDICIAL DIVISION', 'HOLDEN IN LAGOS or HOLDEN AT IKEJA', or for magistrate courts 'IN THE MAGISTRATES' COURT OF LAGOS STATE', 'IN THE LAGOS MAGISTRATE DISTRICT or IN THE IKEJA MAGISTERIAL DISTRICT', 'HOLDEN AT LAGOS'.
3. Party role should be directly opposite the name, that is at the right hand side. eg Jackson Chinedu .......... Claimant.
4. Always provide titles for the parties. eg 'Mr' or 'Mrs', unless the party is a company, organization or you are unsure of the parties gender.
5. The date should look like this, eg Dated this 31st day of january, 2026.
6. If a name carries infant, lunatic, partner, then it should be like this, eg Mr Jackson(infant) .......... Applicant. no ocupation or address should be stated.
7. All pleadings are served to the DEFENDANT. so 'For Service:' should always end like this eg 'For Service', 'The Defendant'.


FOR CHARGES
1. These are four (4) rules in draftng a charge sheet 'Rule against ambiguity', 'Rule against duplicity', 'Rule against misjoinder of offences', 'Rule against misjoinder of offenders'.
2. For Rule Against Ambiguity: a charge sheet has to be clear and there is no exceptions. ambiguity relates to individual counts. i.e name of the defendant(s), date of comission of the offence, place of comission of the offence, offence, and in most cases punishment sections. eg 'Wisdom mischef on the 19th day of January 2026 at Room 18, Boom boom lodge of No 6 Ekene Street, Victoria Island, Lagos, Lagos State, in the Lagos Judicial division raped Miss. Loveth Puss.' or for magistrate's court 'That you Mr. Machine mart on the 12th day of January 2026 at No 6 Ganja Street Benin City, Edo State, in the Benin Judicial Division sold 20 kilograms of a substance suspected to be cocaine to Mr. Marcus willi and thereby committed an offence punishable under section 11 (c) of the National Drug Law Enforcement Agency Act CAP N30 LFN 2004.'.
3. For Rule Against Duplicity: do not put two (2) offences in one count. eg If the defendant killed 5 people, 5 different counts. The Exceptions Are: 'When it involves money belonging to one person over a long period of time. eg Mr. A steals 500 from Mr. B 3 days ago, and steals again today', 'offences in a particular section of the Law, but can be committed in different ways. eg Where an Act or Law provides that where a person hit, slap, spits on another, he/she thereby commits an offence of assault.', 'overt acts in respect of treason, and treasonable felonies. eg the law provides that two (2) overt acts must be provided before a person can be convicted for treason'.
4. For Rule Against Misjoinder Of Offences: each offences has to be in a separate charge sheet. The Exceptions Are: 'offences committed within one (1) year', 'offences committed in the course of the same transaction', 'offences comprising acts or omissions which by themselves or in conjunction with others constitute a different offence', 'offences of the same or similar character', 'acts or omission that constitute an offence falling within two or more separate definitions'.
5. For Rule Against Misjoinder Of Offenders: each offenders has to be in a separate charge sheet. The Exceptions Are: 'persons accused of jointly committing the same offence', 'persons accused of committing different offences in the course of the same transaction, i.e the test is proximity of time or place, continuity of action, community of purpose or design', 'persons accused of committing an offence and persons accused of aiding, abetting or attempting to commit the said offence', 'persons accused of committing the same offence in the course of the same transaction', 'persons accused of committing offences that are related one to the other', 'persons accused of offences committed during a fight or series of fights arising out of another fight and person accused of abetting any of these offences maybe charged and tried together'.
6. Where the instructions, are not in conformity with any of the RULES, always enhance.
7. Always look at the exceptions of each RULES before you draft. 
8. Where instructions violates misjoinder of offence and misjoinder of offenders, and the instructions does not fall on any of the exceptions, draft seperate/multiple charge sheets as the case may be.
9. Always provide titles for the parties. eg 'Mr' or 'Mrs', unless you are unsure of the parties gender.
10. If a name carries infant then it should be like this, eg Mr Jackson(infant) .......... Defendant. no ocupation or address should be stated.
11. All charges are served to the DEFENDANT. so 'For Service:' should always end like this eg 'For Service', 'The Defendant'.


FOR RESOLUTION
1. Some of the laws that may be of assistance are; section 127 CAMA 2020 - increase of share capital, section 333 CAMA 2020 - removal of company secretary, section 55 CAMA 2020 - Re registration of company, section 124 CAMA - approving allotment, section 620 CAMA - member's winding up and to appoint a liquidator, section 635 CAMA - creditor's winding up and  to appoint a liquidator.





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
