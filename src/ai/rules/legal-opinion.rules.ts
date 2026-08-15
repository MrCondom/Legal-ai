export const LEGAL_OPINION_RULES = `
FOR LEGAL_OPINION:

1. The output must read as a completed, professionally prepared legal opinion and not as an explanation of how the opinion was generated.

2. Do not describe the drafting process, AI process, prompt, instructions, source materials, or how the opinion was prepared.

3. Do not invent facts that are not contained in the supplied material.

4. Do not assume material facts that have not been supplied.

5. Where an essential fact is missing, identify the uncertainty and explain how the absence of that fact may affect the legal analysis rather than fabricating the fact.

6. The supplied "full facts" and "other relevant information" are source materials for the opinion. Do not reproduce those labels as headings or create sections titled "Full Facts" or "Other Relevant Information" unless specifically instructed.

7. The "Introduction" must introduce the subject matter, background, purpose, and legal context of the opinion. It must not primarily describe who requested the opinion or how the opinion was generated.

8. The "Facts of the case" section should present the material facts supplied by the user in a clear, chronological, coherent, and legally relevant manner.

9. Do not omit material facts supplied by the user merely because they appear inconvenient to the legal position being considered.

10. Where the supplied facts contain conflicting versions of events, identify the conflict expressly and do not silently select one version as true.

11. The "Prayers" section should state the reliefs, objectives, questions, or outcomes sought by the client or person whose legal position is being considered, where such information is supplied or reasonably apparent from the facts.

12. Do not invent prayers or remedies that the user has not requested or that are not reasonably connected to the facts and issues.

13. The "Issues for determination" must contain specific legal questions arising from the supplied facts.

14. Issues should be framed as questions capable of being answered through legal analysis.

15. Avoid creating unnecessary or repetitive issues.

16. Where several facts raise distinct legal questions, separate them into appropriately numbered issues.

17. The "Applicable laws" section should identify the legislation, rules, constitutional provisions, treaties, conventions, regulations, judicial authorities, and other legal sources that are genuinely relevant to the issues.

18. Do not include laws merely because they appear in the general list of potentially relevant laws. Select only laws that are relevant to the particular facts and issues.

19. Where no laws are supplied by the user, consider the relevant Nigerian legal framework and the following sources where applicable:
    (a) Constitution of the Federal Republic of Nigeria, 1999 (as amended);
    (b) Land Use Act;
    (c) Companies and Allied Matters Act, 2020;
    (d) relevant international treaties and conventions applicable in Nigeria;
    (e) applicable Tenancy Laws;
    (f) applicable Recovery of Premises Laws;
    (g) Wills Act;
    (h) Cybercrimes Act;
    (i) Terrorism (Prevention) Act or applicable legislation;
    (j) Evidence Act;
    (k) applicable Criminal Code or Penal Code provisions;
    (l) Administration of Criminal Justice Act;
    (m) Trade Unions Act;
    (n) Labour Act;
    (o) Fundamental Rights (Enforcement Procedure) Rules;
    (p) Electoral Act; and
    (q) any other relevant legislation, subsidiary legislation, rules, regulations, treaties, conventions, or legal authorities applicable to the particular matter.

20. Do not cite a law merely because it appears in the above list. Its relevance must arise from the facts and issues.

21. Where a particular Nigerian State law is applicable, use the law of the relevant State where the facts establish the State concerned.

22. Where the applicable law depends upon the jurisdiction, location, date of the transaction, nature of the parties, or another material fact that has not been supplied, identify the limitation instead of assuming the answer.

23. Where legal authorities are supplied by the user, incorporate them into the analysis where relevant and do not disregard them without explanation.

24. Do not fabricate case names, case citations, statutory sections, legal principles, quotations, judicial statements, treaties, regulations, or other authorities.

25. Where specific statutory provisions are known and relevant, identify the appropriate provisions accurately.

26. Where there is uncertainty about a statutory provision, do not manufacture a section number. State the legal principle without an unverified citation or identify the provision as requiring verification.

27. The "Legal Opinion" section must apply the identified law to the actual facts supplied by the user.

28. Do not merely list laws and then state a conclusion. Explain the connection between each material legal rule and the relevant facts.

29. Distinguish clearly between:
    (a) the applicable legal rule;
    (b) the relevant facts;
    (c) the application of the rule to those facts; and
    (d) the resulting legal position.

30. Where there are competing legal interpretations, identify the competing positions and explain which position is stronger and why.

31. Where the legal position is uncertain, expressly state the uncertainty and explain the factors that may determine the outcome.

32. Do not present a prediction as an absolute certainty where the outcome depends on disputed facts, judicial discretion, evidence, procedural requirements, or unsettled law.

33. Where the facts support more than one possible legal outcome, analyse the alternatives rather than forcing a single conclusion.

34. Where an issue involves evidential questions, distinguish between what is alleged, what is established by the supplied facts, and what would require proof.

35. Do not treat an allegation as an established fact merely because it appears in the client's account.

36. Where the opinion concerns a transaction, agreement, property, company, employment relationship, estate, criminal matter, constitutional right, or other legal relationship, identify the relevant legal rights, duties, liabilities, restrictions, and available remedies arising from the supplied facts.

37. Where a contractual document is involved, analyse the relevant contractual terms supplied by the user and do not invent terms that are not contained in the material.

38. Where property or land is involved, consider the relevant property law, Land Use Act, applicable State legislation, title, consent, registration, possession, tenancy, or other property principles only where relevant to the facts.

39. Where a company or corporate matter is involved, consider the Companies and Allied Matters Act, 2020 and relevant corporate principles where applicable.

40. Where an employment matter is involved, consider the applicable Labour Act, employment contract, relevant regulations, and other applicable employment law where relevant.

41. Where a criminal matter is involved, distinguish clearly between the elements of the alleged offence, available evidence, applicable criminal legislation, possible defences, and procedural considerations.

42. Where fundamental rights are involved, identify the specific right or rights potentially engaged and consider the applicable constitutional and procedural framework, including the Fundamental Rights (Enforcement Procedure) Rules where relevant.

43. Where the matter concerns a will, estate, succession, or administration of an estate, consider the applicable succession, probate, estate administration, and testamentary laws relevant to the facts and jurisdiction.

44. Where the matter concerns a tenancy or recovery of premises, consider the applicable tenancy and recovery-of-premises laws of the relevant jurisdiction rather than applying a generic tenancy rule.

45. Where the matter concerns an international treaty or convention, determine whether the instrument is relevant and whether it has legal application in the circumstances before relying upon it.

46. The analysis should be logically structured under the numbered issues where appropriate.

47. Avoid repeating the entire facts section in the legal opinion section. Refer to the material facts and analyse them instead.

48. Avoid repeating the same legal rule unnecessarily under multiple issues unless its application genuinely differs.

49. The "Conclusion and Recommendations" section should directly answer the issues and prayers based on the legal analysis.

50. The conclusion should be consistent with the reasoning contained in the opinion.

51. Do not introduce a new material legal argument in the conclusion that was not analysed earlier.

52. Recommendations should be practical, legally relevant, and connected to the conclusions reached.

53. Where further documents, evidence, searches, approvals, notices, negotiations, applications, or procedural steps are required, identify them as recommendations where appropriate.

54. Do not recommend an action that is inconsistent with the legal position established in the opinion.

55. Where the outcome depends on obtaining additional evidence or confirming a material fact, state that clearly in the recommendations.

56. Use formal, professional, precise, and understandable legal language.

57. Avoid unnecessary legal jargon where a clear legal expression can be used instead.

58. Improve grammar, spelling, punctuation, sentence structure, coherence, and legal expression without changing the substance of the supplied facts.

59. Do not substantially increase the word count beyond what is reasonably necessary to provide a complete and properly reasoned legal opinion.

60. The opinion should be sufficiently detailed to analyse all material issues but should not contain irrelevant discussion.

61. Where dates are stated, use a formal legal style; e.g. 2nd October, 2020.

62. Where a date is required and no specific date is provided, use today's date for the date of the opinion.

63. Where a legal deadline, limitation period, notice period, contractual period, or other time period is relevant, calculate the date correctly based on the supplied starting date and applicable period.

64. Do not guess or fabricate a date where the information necessary for calculation is missing.

65. Where amounts are relevant, ordinarily state them in both figures and words; e.g. ₦5,000,000.00 (Five Million Naira Only).

66. Where no currency is specified for a Nigerian transaction, use Naira (₦) as the default currency unless the context clearly indicates otherwise.

67. Do not invent monetary amounts, property values, damages, salaries, consideration, debts, or other financial figures.

68. Where the supplied information contains placeholders, use the information in those placeholders to develop the opinion naturally.

69. Do not reproduce placeholders in the final opinion where the necessary information has been supplied.

70. Where essential information is missing, retain the relevant placeholder or clearly identify the missing information rather than fabricating it.

71. The opinion should ordinarily follow this structure where the template provides it:
    1. Introduction
    2. Facts of the Case
    3. Prayers
    4. Issues for Determination
    5. Applicable Laws
    6. Legal Opinion
    7. Conclusion and Recommendations

72. Do not unnecessarily add headings outside the structure above unless they materially improve the organization of a complex opinion.

73. Where an issue requires sub-issues, use clear and consistent subheadings or numbering beneath the relevant principal issue.

74. Where several laws apply to one issue, discuss them together in a logically organized manner rather than producing an unstructured list.

75. Where a legal proposition is supported by a statutory provision and judicial authority, explain the statutory rule first and use the judicial authority to clarify or apply the principle where appropriate.

76. Do not use judicial authorities merely to increase the length of the opinion.

77. Where the user specifically requests case law, legal authorities, statutory provisions, or legal research, provide the requested authorities and integrate them into the analysis rather than merely listing them.

78. Where the user does not request legal research and no reliable authority has been supplied, do not fabricate authorities to make the opinion appear more authoritative.

79. The final opinion must not contain drafting instructions, internal comments, source labels, notes to the AI, or statements such as "I have enhanced the draft."

80. The final opinion should read as though prepared by counsel after considering the facts and applicable law.

81. Use the following source material to prepare the opinion:
    Full Facts:
    {{facts}}

82. Use the following additional information to enhance and complete the opinion where relevant:
    {{information}}

83. The draft should ordinarily be within 500–10,000 words unless the complexity of the matter reasonably requires a different length.

84. Use today's date to fill the date section where no other date is specifically required.
`;

