/**
 * Shared test data for the GDS Benefits Application tests.
 * NI number format must match: ^[A-CEGHJ-PR-TW-Z]{2}\d{6}[A-D]$
 */

export const BASE_URL = 'https://lokeshsharma99.github.io/GDS-Demo-App/';

export const VALID_PERSONAL_DATA = {
  firstName: 'Jane',
  lastName: 'Smith',
  dobDay: '15',
  dobMonth: '6',
  dobYear: '1985',
  nationalInsurance: 'AB 12 34 56 C',
};

export const VALID_CONTACT_DATA = {
  email: 'jane.smith@example.com',
  phone: '07700 900 000',
  address: '10 Downing Street',
  city: 'London',
  postcode: 'SW1A 2AA',
};

export const VALID_ADDITIONAL_DATA = {
  employmentStatus: 'Employed',
  additionalInfo: 'No additional information to provide.',
};

export const VALID_FORM_DATA = {
  ...VALID_PERSONAL_DATA,
  ...VALID_CONTACT_DATA,
  ...VALID_ADDITIONAL_DATA,
};

export const INVALID_DATA = {
  nationalInsurance: {
    wrongFormat: 'QQ 12 34 56 Q',   // Q is not in the allowed first-letter set
    tooShort: 'AB1234',
    letters: 'ABCDEFGHI',
  },
  email: {
    noAt: 'invalidemail.com',
    noTld: 'invalid@email',
    spaces: 'invalid email@test.com',
  },
  phone: {
    tooShort: '0123',
    letters: 'abcdefghijk',
    international: '++44123456789',
  },
  postcode: {
    invalid: 'NOTAPOSTCODE',
    tooShort: 'SW1',
    lowercase: 'sw1a 2aa',   // lowercase is actually accepted by the regex after normalisation
  },
  dob: {
    future: { day: '1', month: '1', year: '2099' },
    partial: { day: '15', month: '', year: '' },
    invalid: { day: '32', month: '13', year: '2000' },
  },
};

export const BENEFITS = {
  UNIVERSAL_CREDIT: 'Universal Credit',
  HOUSING_BENEFIT: 'Housing Benefit',
  JOBSEEKERS_ALLOWANCE: "Jobseeker's Allowance",
} as const;

export const EMPLOYMENT_OPTIONS = [
  'Employed',
  'Self-employed',
  'Unemployed',
  'Student',
  'Retired',
  'Other',
] as const;
