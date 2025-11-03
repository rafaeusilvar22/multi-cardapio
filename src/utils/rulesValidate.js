import { i18n } from 'src/boot/i18n';
import { validateEmail, validateCNPJ, validateCPF } from 'src/utils/globalFunctions'

const t = i18n.global.t;

// Object with validation rules for input fields.
export const inputRulesValidate = {
  // Rule for 'Full Name': Checks if the field is filled (not empty, null, or undefined).
  fullName: [(v) => !!v || t('Full name is required'),
  (v) =>
    /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ]+)+$/.test(v?.trim()) ||
    t('Enter your full name (first and last name)')],

  // Rules for 'E-mail':
  email: [
    // 1. Checks if the field is filled (required).
    (v) => !!v || t('E-mail is required'),
    // 2. Calls an external function `validateEmail(v)` to check if the e-mail format is valid.
    (v) => validateEmail(v) || t('Invalid e-mail'),
  ],

  // Rule for 'Business Type': Checks if the field is filled (commonly used in selects/comboboxes).
  businessType: [
    (v) => v !== null && v !== undefined && v !== '' || t('Business type is required')
  ],

  // Rules for 'CNPJ':
  cnpj: [
    // 1. Checks if the field is filled (required).
    (v) => !!v || t('CNPJ is required'),
    // 2. Calls an external function `validateCNPJ(v)` to check if the CNPJ format/verification digit is valid.
    (v) => validateCNPJ(v) || t('Invalid CNPJ'),
  ],

  cpf: [
    // 1. Checks if the field is filled (required).
    (v) => !!v || t('CPF is required'),
    // 2. Calls an external function `validateCPF(v)` to check if the CPF format/verification digit is valid.
    (v) => validateCPF(v) || t('Invalid CPF'),
  ],
  // Rule for 'Company Name': Checks if the field is filled.
  companyName: [(v) => !!v || t('Company name is required')],

  // Rule for 'State Registration' (Inscription Estadual): Checks if the field is filled.
  inscriptionState: [(v) => !!v || t('Inscription State is required')],

  // Rule for 'Municipal Registration' (Inscription Municipal): Checks if the field is filled.
  municipalRegistration: [(v) => !!v || t('Municipal Registration is required')],

  // Rule for 'CNAE Code': Checks if the field is filled.
  cnaeCode: [(v) => !!v || t('CNAE Code is required')],

  // Rule for 'Phone': Checks if the field is filled.
  phone: [(v) => !!v || t('Phone is required')],

  // Rules for 'Cell Phone':
  cellPhone: [(v) => !!v || t('Cell phone is required'), (v) => (v && v.length === 11) || t('Invalid cell phone'),],

  // Rule for 'Address': Checks if the field is filled.
  address: [(v) => !!v || t('Address is required')],

  // Rules for 'Zip Code' (CEP):
  zipCode: [
    // 1. Rule for Required Field: Checks if the field has any value.
    (v) => !!v || t('Zip Code is required'),

    // 2. Rule for Size/Format: Checks if the filled value has exactly 9 characters.
    // This is essential when the field uses the '#####-###' mask (5 digits + hyphen + 3 digits = 9 characters).
    (v) => (v && v.length === 8) || t('Invalid Zip Code'),
  ],

  // Rule for 'City': Checks if the field is filled.
  city: [(v) => !!v || t('City is required')],

  neighborhood: [(v) => !!v || t('Neighborhood is required')],

  // Rule for 'State': Checks if the field is filled.
  state: [(v) => !!v || t('State is required')],

  // Rule for 'Password': Checks if the field is filled.
  password: [
    (v) => !!v || t('Password is required'),
    (v) => (v && v.length >= 8) || t('Password must be at least 8 characters'),
    (v) => /[a-zA-Z]/.test(v) || t('Password must include at least one letter'),
    (v) => /[0-9]/.test(v) || t('Password must include at least one number')
  ],

  // Rule for 'Confirm Password': Checks if the field is filled.
  confirmPassword: (passwordValue) => [
    (v) => !!v || t('Confirm Password is required'),
    (v) => v === passwordValue || t('Passwords do not match')
  ]
}
