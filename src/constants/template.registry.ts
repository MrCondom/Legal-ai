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
  }
];
