import { courtDocumentRules } from "./court-document";
import { deedRules } from "./deed.rules";
import { willRules } from "./will.rules";
import { agreementRules } from "./agreement.rules";
import { LETTER_RULES } from "./letter.rules";
import { CORPORATE_DOCUMENT_RULES } from "./corporate-document.rules";
import { LEGAL_OPINION_RULES } from "./legal-opinion.rules";

export const familyRules = {
  deed: deedRules,

  agreement: agreementRules,

  court_document: courtDocumentRules,

  corporate_document: CORPORATE_DOCUMENT_RULES,

  letter: LETTER_RULES,

  will: willRules,

  legal_opinion: LEGAL_OPINION_RULES,
};

export function getFamilyRules(family: string): string {
  return familyRules[family as keyof typeof familyRules] ?? '';
}
