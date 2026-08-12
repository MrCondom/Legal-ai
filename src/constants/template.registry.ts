import deedTemplate from "../templates/template-files/propertyLaw/deed-of-conveyance.json";
import conveyanceForm from "../templates/template-forms/propertySchema/conveyance.json";

import assignmentTemplate from "../templates/template-files/propertyLaw/deed-of-assignment.json";
import assignmentForm from "../templates/template-forms/propertySchema/assignment.json";

import giftTemplate from "../templates/template-files/propertyLaw/deed-of-gift.json";
import giftForm from "../templates/template-forms/propertySchema/giftSchema.json";

import sharesTemplate from "../templates/template-files/propertyLaw/deed-of-shares.json";
import sharesForm from "../templates/template-forms/propertySchema/sharesSchema.json";

import mortgageTemplate from "../templates/template-files/propertyLaw/deed-of-mortgage.json";
import mortgageSchema from "../templates/template-forms/propertySchema/mortgageSchema.json";

import triparteTemplate from "../templates/template-files/propertyLaw/deed-of-triparte-mortgage.json";
import triparteSchema from "../templates/template-forms/propertySchema/triparteSchema.json";

import releaseTemplate from "../templates/template-files/propertyLaw/deed-of-release-of-mortgage.json";
import releaseSchema from "../templates/template-forms/propertySchema/releaseSchema.json";

import assentTemplate from "../templates/template-files/propertyLaw/assent.json";
import assentSchema from "../templates/template-forms/propertySchema/assentSchema.json";

import attorneyTemplate from "../templates/template-files/propertyLaw/deed-of-power-of-attorney.json";
import attorneySchema from "../templates/template-forms/propertySchema/attorneySchema.json";

import willsTemplate from "../templates/template-files/propertyLaw/wills.json";
import willsSchema from "../templates/template-forms/propertySchema/willsSchema.json";

import leaseTemplate from "../templates/template-files/propertyLaw/lease.json";
import leaseSchema from "../templates/template-forms/propertySchema/leaseSchema.json";

import tenancyTemplate from "../templates/template-files/propertyLaw/tenancy.json";
import tenancySchema from "../templates/template-forms/propertySchema/tenancySchema.json";

import hireTemplate from "../templates/template-files/propertyLaw/hire-purchase.json";
import hireSchema from "../templates/template-forms/propertySchema/hireSchema.json";

import agreementTemplate from "../templates/template-files/propertyLaw/agreement.json";
import agreementSchema from "../templates/template-forms/propertySchema/agreementSchema.json";

//Civil Litigation
import opinionTemplate from "../templates/template-files/civilLitigation/legal-opinion.json";
import opinionSchema from "../templates/template-forms/civilSchema/opinionSchema.json";

import exparteTemplate from "../templates/template-files/civilLitigation/motion-exparte.json";
import exparteSchema from "../templates/template-forms/civilSchema/exparteSchema.json";
import motionTemplate from "../templates/template-files/civilLitigation/motion-on-notice.json";

import garnisheeTemplate from "../templates/template-files/civilLitigation/garnishee.json";
import garnisheeSchema from "../templates/template-forms/civilSchema/garnisheeSchema.json";

import humanTemplate from "../templates/template-files/civilLitigation/human-right.json";
import humanSchema from "../templates/template-forms/civilSchema/humanSchema.json";

import joinderTemplate from "../templates/template-files/civilLitigation/joinder-parties.json";
import joinderSchema from "../templates/template-forms/civilSchema/joinderSchema.json";

import affidavitTemplate from "../templates/template-files/civilLitigation/affidavit.json";
import affidavitSchema from "../templates/template-forms/civilSchema/affidavitSchema.json";

import appealTemplate from "../templates/template-files/civilLitigation/appeal.json";
import appealSchema from "../templates/template-forms/civilSchema/appealSchema.json";

import writtenTemplate from "../templates/template-files/civilLitigation/written-address.json";
import writtenSchema from "../templates/template-forms/civilSchema/writtenSchema.json";

import summonsTemplate from "../templates/template-files/civilLitigation/summonsNorth.json";
import summonsSchema from "../templates/template-forms/civilSchema/summonsSchema.json";

import claimTemplate from "../templates/template-files/civilLitigation/claim.json";
import statementTemplate from "../templates/template-files/civilLitigation/statement-of-claims.json";
import claimSchema from "../templates/template-forms/civilSchema/claimSchema.json";

import defenceTemplate from "../templates/template-files/civilLitigation/statement-of-defense.json";
import defenceSchema from "../templates/template-forms/civilSchema/defenceSchema.json";

import setoffTemplate from "../templates/template-files/civilLitigation/set-off.json";
import setoffSchema from "../templates/template-forms/civilSchema/setoffSchema.json";

import counterTemplate from "../templates/template-files/civilLitigation/counter-claim.json";
import counterSchema from "../templates/template-forms/civilSchema/counterSchema.json";

import electionTemplate from "../templates/template-files/civilLitigation/election-petition.json";
import electionSchema from "../templates/template-forms/civilSchema/petitionElectionSchema.json";

import interpleaderTemplate from "../templates/template-files/civilLitigation/interpleader-summons.json";
import interpleaderSchema from "../templates/template-forms/civilSchema/interpleaderSchema.json";

import replyTemplate from "../templates/template-files/civilLitigation/reply.json";
import replySchema from "../templates/template-forms/civilSchema/replySchema.json";

import petitionReplyTemplate from "../templates/template-files/civilLitigation/petition-reply.json";
import petitionReplySchema from "../templates/template-forms/civilSchema/petitionReplySchema.json";

import marriageTemplate from "../templates/template-files/civilLitigation/marriage-petition.json";
import marriageSchema from "../templates/template-forms/civilSchema/marriageSchema.json";

import petitionTemplate from "../templates/template-files/civilLitigation/petition.json";
import petitionSchema from "../templates/template-forms/civilSchema/petitionSchema.json";

import discontinuanceTemplate from "../templates/template-files/civilLitigation/notice-of-discontinuance.json";
import discontinuanceSchema from "../templates/template-forms/civilSchema/discontinuanceSchema.json";

import writTemplate from "../templates/template-files/civilLitigation/writ-of-summons.json";
import writSchema from "../templates/template-forms/civilSchema/writSchema.json";

import originatingTemplate from "../templates/template-files/civilLitigation/originating-summons.json";
import originatingSchema from "../templates/template-forms/civilSchema/originatingSchema.json";

import appearanceTemplate from "../templates/template-files/civilLitigation/momorandum-of-appearance.json";
import appearanceSchema from "../templates/template-forms/civilSchema/appearanceSchema.json";


export const templateRegistry = [
  {
    slug: "deed-of-conveyance",
    title: "Deed of Conveyance",
    documentFamily: "deed",
    tags: [
      "property",
      "land",
      "ownership",
      "conveyance",
      "transfer of title",
    ],
    template: deedTemplate,
    formSchema: conveyanceForm,
  },

  {
    slug: "deed-of-assignment",
    title: "Deed of Assignment",
    documentFamily: "deed",
    tags: [
      "property",
      "land",
      "ownership",
      "assignment",
      "transfer of title",
    ],
    template: assignmentTemplate,
    formSchema: assignmentForm,
  },

  {
    slug: "assent",
    title: "Deed of Assent",
    documentFamily: "deed",
    tags: [
      "property",
      "land",
      "representatives",
      "executors",
      "transfer of title",
      "deceased",
    ],
    template: assentTemplate,
    formSchema: assentSchema,
  },

  {
    slug: "deed-of-power-attorney",
    title: "Deed of Power of Attorney",
    documentFamily: "deed",
    tags: [
      "property",
      "attorney",
      "representative",
      "power",
      "donor",
    ],
    template: attorneyTemplate,
    formSchema: attorneySchema,
  },

  {
    slug: "wills",
    title: "Wills",
    documentFamily: "wills",
    tags: [
      "testator",
      "testamentory instrument",
      "last wish",
      "codicil",
      "letter of wishes",
    ],
    template: willsTemplate,
    formSchema: willsSchema,
  },

  {
    slug: "deed-of-lease",
    title: "Deed of lease",
    documentFamily: "deed",
    tags: [
      "3 years and above tenancy",
      "property",
      "reversionary interest",
      "lessor",
      "no governor's consent",
    ],
    template: leaseTemplate,
    formSchema: leaseSchema,
  },

  {
    slug: "tenancy-agreement",
    title: "Tenancy agreement",
    documentFamily: "agreement",
    tags: [
      "3 years below",
      "property",
      "reversionary interest",
      "landlord",
      "tenant",
    ],
    template: tenancyTemplate,
    formSchema: tenancySchema,
  },

  {
    slug: "hire-purchase-agreement",
    title: "Hire Purchase agreement",
    documentFamily: "agreement",
    tags: [
      "hire",
      "hirer",
      "installmental payments",
      "hire and buy",
      "transfer of interest",
    ],
    template: hireTemplate,
    formSchema: hireSchema,
  },

  {
    slug: "deed-of-gift",
    title: "Deed of Gift",
    documentFamily: "deed",
    tags: [
      "property",
      "gift",
      "ownership",
      "transfer of title",
      "no consideration",
    ],
    template: giftTemplate,
    formSchema: giftForm,
  },

  {
    slug: "deed-of-mortgage",
    title: "Deed of Mortgage",
    documentFamily: "deed",
    tags: [
      "property",
      "mortgage",
      "interest",
      "loan",
      "borrow",
    ],
    template: mortgageTemplate,
    formSchema: mortgageSchema,
  },

  {
    slug: "deed-of-triparte-mortgage",
    title: "Deed of Triparte Mortgage",
    documentFamily: "deed",
    tags: [
      "property",
      "mortgage",
      "interest",
      "loan",
      "borrow",
      "guarantor",
      "three party mortgage",
    ],
    template: triparteTemplate,
    formSchema: triparteSchema,
  },
  {
    slug: "deed-of-release-of-mortgage",
    title: "Deed of Release of Mortgage",
    documentFamily: "deed",
    tags: [
      "property",
      "mortgage",
      "repayment",
      "release",
      "reversionary interest",
    ],
    template: releaseTemplate,
    formSchema: releaseSchema,
  },
  {
    slug: "deed-of-transfer-of-shares",
    title: "Deed of Transfer of Shares",
    documentFamily: "deed",
    tags: [
      "shares",
      "company",
      "corporate",
      "transfer",
      "ownership",
    ],
    template: sharesTemplate,
    formSchema: sharesForm,
  },

  {
    slug: "agreement-template",
    title: "Agreement",
    documentFamily: "agreement",
    tags: [
      "partnership agreement",
      "sale of land agreement",
      "buyer and seller agreement",
      "joint-venture agreement",
      "memorandum of understanding",
      "confidentiality agreement",
      "agreement",
    ],
    template: agreementTemplate,
    formSchema: agreementSchema,
  },

  //Civil Litigation
  {
    slug: "legal-opinion",
    title: "Legal opinion",
    documentFamily: "legal_opinion",
    tags: [
      "legal advice",
      "advice a party",
      "advice a senior officer",
    ],
    template: opinionTemplate,
    formSchema: opinionSchema,
  },

  {
    slug: "motion-ex-parte",
    title: "motion ex parte",
    documentFamily: "motion",
    tags: [
      "interim injunction",
      "mareva injunction",
      "anton piller injunction",
      "substituted service",
      "motion for leave"
    ],
    template: exparteTemplate,
    formSchema: exparteSchema,
  },

  {
    slug: "motion-on-notice",
    title: "motion on notice",
    documentFamily: "motion",
    tags: [
      "interlocutory injunction",
      "preliminary objection challenging the jurisdiction of the court",
      "motion for summary judgment",
      "motion for trinity prayers",
      "motion"
    ],
    template: motionTemplate,
    formSchema: exparteSchema,
  },

  {
    slug: "garnishee-order",
    title: "garnishee order",
    documentFamily: "motion",
    tags: [
      "garnishee order",
      "motion to set aside a garnishee order",
      "judgment creditor",
      "order nisi",
      "enforcing judgment"
    ],
    template: garnisheeTemplate,
    formSchema: garnisheeSchema,
  },

  {
    slug: "joinder-of-parties",
    title: "joinder of parties",
    documentFamily: "motion",
    tags: [
      "joinder of parties",
      "misjoinder of parties",
      "party sought to be joined",
    ],
    template: joinderTemplate,
    formSchema: joinderSchema,
  },

  {
    slug: "originating-motion",
    title: "originating-motion",
    documentFamily: "motion",
    tags: [
      "originating motion",
      "originating motion ex parte",
      "enforcement of human rights",
      "originating motion on notice"
    ],
    template: humanTemplate,
    formSchema: humanSchema,
  },

  {
    slug: "affidavit",
    title: "affidavit",
    documentFamily: "affidavit",
    tags: [
      "affidavit",
      "document supporting motions"
    ],
    template: affidavitTemplate,
    formSchema: affidavitSchema,
  },

  {
    slug: "written-address",
    title: "written address",
    documentFamily: "written address",
    tags: [
      "written address",
      "final address",
      "document supporting motions"
    ],
    template: writtenTemplate,
    formSchema: writtenSchema,
  },

  {
    slug: "motion-in-the-north",
    title: "motion in the north",
    documentFamily: "motion",
    tags: [
      "motion in the north",
      "bail motion in the north",
    ],
    template: summonsTemplate,
    formSchema: summonsSchema,
  },

  {
    slug: "interpleader-summons",
    title: "interpleader summons",
    documentFamily: "pleadings",
    tags: [
      "interpleader summons",
    ],
    template: summonsTemplate,
    formSchema: summonsSchema,
  },

  {
    slug: "notice-of-appeal",
    title: "notice of appeal",
    documentFamily: "appeal",
    tags: [
      "notice of appeal",
      "appeal document"
    ],
    template: appealTemplate,
    formSchema: appealSchema,
  },

  {
    slug: "claim",
    title: "claim",
    documentFamily: "pleadings",
    tags: [
      "particulars of claim",
      "claim",
      "simple claim",
      "claim at the magistrate courts",
      "claim at the area courts",
    ],
    template: claimTemplate,
    formSchema: claimSchema,
  },

  {
    slug: "statement-of-claim",
    title: "statement of claim",
    documentFamily: "pleadings",
    tags: [
      "statement of claim",
      "claim at the High courts",
    ],
    template: statementTemplate,
    formSchema: claimSchema,
  },

  {
    slug: "set-off",
    title: "set-off",
    documentFamily: "pleadings",
    tags: [
      "set-off",
      "monetary claim against the claimant",
    ],
    template: setoffTemplate,
    formSchema: setoffSchema,
  },

  {
    slug: "statement-of-defence",
    title: "statement of defence",
    documentFamily: "pleadings",
    tags: [
      "statement of defence",
    ],
    template: defenceTemplate,
    formSchema: defenceSchema,
  },

  {
    slug: "counter-claim",
    title: "counter claim",
    documentFamily: "pleadings",
    tags: [
      "defendant's claim",
      "counter-claim",
    ],
    template: counterTemplate,
    formSchema: counterSchema,
  },

  {
    slug: "reply",
    title: "reply",
    documentFamily: "pleadings",
    tags: [
      "claimant's reply",
      "reply",
    ],
    template: replyTemplate,
    formSchema: replySchema,
  },

  {
    slug: "petition",
    title: "petition",
    documentFamily: "petitions",
    tags: [
      "petition",
    ],
    template: petitionTemplate,
    formSchema: petitionSchema,
  },

  {
    slug: "election-petition",
    title: "election petition",
    documentFamily: "petitions",
    tags: [
      "election petition",
    ],
    template: electionTemplate,
    formSchema: electionSchema,
  },

  {
    slug: "marriage-petition",
    title: "marriage petition",
    documentFamily: "petitions",
    tags: [
      "dissolution of marriage",
      "marriage petition"
    ],
    template: marriageTemplate,
    formSchema: marriageSchema,
  },

  {
    slug: "reply-to-petition",
    title: "reply to petition",
    documentFamily: "petitions",
    tags: [
      "reply to election petition",
      "respondent's reply to election petition"
    ],
    template: petitionReplyTemplate,
    formSchema: petitionReplySchema,
  },

  {
    slug: "memorandum-of-appearance",
    title: "memorandum of appearance",
    documentFamily: "pleadings",
    tags: [
      "memorandum of appearance",
      "conditional memorandum of appearance",
      "unconditional memorandum of appearance",
      "entering an appearance for the defendant"
    ],
    template: appearanceTemplate,
    formSchema: appearanceSchema,
  },

  {
    slug: "notice-of-discontinuance",
    title: "notice of discontinuance",
    documentFamily: "pleadings",
    tags: [
      "notice of discontinuance",
      "claimant's notice to discontinue the suit"
    ],
    template: discontinuanceTemplate,
    formSchema: discontinuanceSchema,
  },

  {
    slug: "writ-of-summons",
    title: "writ of summons",
    documentFamily: "pleadings",
    tags: [
      "writ of summons",
      "commencement of an action in the high court",
      "summons"
    ],
    template: writTemplate,
    formSchema: writSchema,
  },

  {
    slug: "originating-summons",
    title: "originating summons",
    documentFamily: "pleadings",
    tags: [
      "originating summons",
      "interpreting a law,document, etc"
    ],
    template: originatingTemplate,
    formSchema: originatingSchema,
  }

];
