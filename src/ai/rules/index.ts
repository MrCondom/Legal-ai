import { courtDocumentRules } from "./court-document";

export const familyRules = {
  deed: '',

  agreement: '',

  court_document: courtDocumentRules,

  corporate_document: '',

  letter: '',

  will: '',

  legal_opinion: '',
};

export function getFamilyRules(family: string): string {
  return familyRules[family as keyof typeof familyRules] ?? '';
}
