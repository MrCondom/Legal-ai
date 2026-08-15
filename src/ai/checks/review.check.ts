import { deedChecks } from './deed.checks';
import { agreementChecks } from './agreement.checks';
import { corporateDocumentChecks } from './corporate-document.checks';
import { courtDocumentChecks } from './court-document.checks';
import { letterChecks } from './letter.checks';
import { willChecks } from './will.checks';
import { legalOpinionChecks } from './legal-opinion.checks';

export const reviewChecks = {
  deed: deedChecks,
  agreement: agreementChecks,
  corporate_document: corporateDocumentChecks,
  court_document: courtDocumentChecks,
  letter: letterChecks,
  will: willChecks,
  legal_opinion: legalOpinionChecks,
} as const;

export type ReviewDocumentFamily = keyof typeof reviewChecks;
