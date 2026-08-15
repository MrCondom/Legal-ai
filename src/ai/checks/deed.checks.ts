export const deedChecks = {
  general: [
    'Parties are properly identified.',
    'The parties have the correct legal descriptions and capacities.',
    'The nature and purpose of the deed are clear.',
    'The operative provisions correspond with the type of deed.',
    'The deed contains the necessary execution date.',
    'The consideration is stated where applicable.',
    'The subject matter of the deed is sufficiently identified.',
    'Names, dates, consideration, property details and other material particulars are internally consistent.',
    'Defined terms are used consistently.',
    'The deed does not contain material ambiguity or contradictory provisions.',
  ],

  parties: [
    'Individual parties have appropriate names and descriptions.',
    'Occupation and address are included where legally or contextually appropriate.',
    'Companies and other corporate entities are properly identified.',
    'The capacity in which a party executes the deed is clear.',
    'Where an attorney acts for a party, the authority and capacity are properly addressed.',
    'Where family property is involved, the relevant family capacity and execution requirements are addressed.',
    'Where an illiterate party is involved, the appropriate execution and attestation requirements are addressed.',
  ],

  property: [
    'The property is sufficiently described.',
    'The property description is consistent throughout the deed.',
    'Survey plan details are included where required or applicable.',
    'The relevant title document or root of title is identified where applicable.',
    'The interest being transferred, assigned, mortgaged, leased or otherwise dealt with is clearly identified.',
    'Any relevant encumbrance, restriction or defect disclosed by the supplied information is addressed.',
  ],

  title: [
    'The root of title is sufficiently identified.',
    'The grantor or transferor appears to have the capacity to deal with the interest.',
    'The chain of title is sufficiently clear from the supplied information.',
    'The deed does not create an apparent conflict with the stated root of title.',
    'Relevant title documents are identified where necessary.',
  ],

  consideration: [
    'The consideration is clearly stated where applicable.',
    'The amount and currency are consistent throughout the deed.',
    'The person paying and receiving consideration are correctly identified where relevant.',
    'Any stated payment or consideration terms are consistent with the operative provisions.',
  ],

  covenants: [
    'Necessary covenants appropriate to the particular deed are present.',
    'Covenants are consistent with the parties and transaction.',
    'The obligations imposed on each party are clearly identified.',
    'Material covenants supplied by the user have not been omitted.',
  ],

  execution: [
    'The execution block is present.',
    'The execution structure corresponds with the parties.',
    'Witness requirements are addressed where applicable.',
    'Company execution requirements are addressed where applicable.',
    'Execution by an attorney is properly reflected where applicable.',
    'Execution requirements for illiterate parties are addressed where applicable.',
    'Execution requirements for family property are addressed where applicable.',
    'The deed contains appropriate attestation where required.',
  ],

  land: [
    'Governor’s Consent is addressed where applicable.',
    'The applicable consent or approval for the particular transaction is addressed.',
    'The deed contains appropriate endorsement of consent where required.',
    'Stamping requirements are addressed where applicable.',
    'Registration requirements are addressed where applicable.',
    'The deed does not overlook a material land-registration requirement applicable to the transaction.',
  ],

  schedules: [
    'A required schedule is present.',
    'The schedule corresponds with the operative provisions.',
    'Property particulars in the schedule are consistent with the body of the deed.',
    'Survey or other supporting particulars are included where applicable.',
  ],

  quality: [
    'No material operative clause appears to be missing.',
    'No material covenant appears to be missing.',
    'No material schedule appears to be missing.',
    'The deed reads as one complete legal instrument.',
    'The deed complies with applicable Nigerian law and relevant state-specific requirements to the extent determinable from the document and supplied information.',
  ],
};
