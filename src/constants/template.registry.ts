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

import summonsTemplate from "../templates/template-files/civilLitigation/summons.json";
import summonsSchema from "../templates/template-forms/civilSchema/summonsSchema.json";


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
    slug: "summons",
    title: "summons",
    documentFamily: "summons",
    tags: [
      "summons",
      "interpleader summons",
      "motion in the north",
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
  }
  
];
