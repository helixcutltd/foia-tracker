export interface CrimeTypeInfo {
  value: string
  label: string
  category: string
  color: string
}

export const CRIME_CATEGORIES = [
  'Violent Crimes',
  'Property Crimes', 
  'Drug Related',
  'Traffic & Vehicle',
  'Public Order',
  'Against Government',
  'Cybercrime',
  'Other'
] as const

export const CRIME_TYPES: CrimeTypeInfo[] = [
  // Violent Crimes
  { value: 'MURDER', label: 'Murder', category: 'Violent Crimes', color: 'bg-red-100 text-red-800' },
  { value: 'MANSLAUGHTER', label: 'Manslaughter', category: 'Violent Crimes', color: 'bg-red-100 text-red-800' },
  { value: 'ASSAULT', label: 'Assault', category: 'Violent Crimes', color: 'bg-red-100 text-red-800' },
  { value: 'BATTERY', label: 'Battery', category: 'Violent Crimes', color: 'bg-red-100 text-red-800' },
  { value: 'AGGRAVATED_ASSAULT', label: 'Aggravated Assault', category: 'Violent Crimes', color: 'bg-red-100 text-red-800' },
  { value: 'DOMESTIC_VIOLENCE', label: 'Domestic Violence', category: 'Violent Crimes', color: 'bg-red-100 text-red-800' },
  { value: 'CHILD_ABUSE', label: 'Child Abuse', category: 'Violent Crimes', color: 'bg-red-100 text-red-800' },
  { value: 'ELDER_ABUSE', label: 'Elder Abuse', category: 'Violent Crimes', color: 'bg-red-100 text-red-800' },
  { value: 'KIDNAPPING', label: 'Kidnapping', category: 'Violent Crimes', color: 'bg-red-100 text-red-800' },
  { value: 'SEXUAL_ASSAULT', label: 'Sexual Assault', category: 'Violent Crimes', color: 'bg-red-100 text-red-800' },
  { value: 'RAPE', label: 'Rape', category: 'Violent Crimes', color: 'bg-red-100 text-red-800' },
  { value: 'ROBBERY', label: 'Robbery', category: 'Violent Crimes', color: 'bg-red-100 text-red-800' },
  { value: 'ARMED_ROBBERY', label: 'Armed Robbery', category: 'Violent Crimes', color: 'bg-red-100 text-red-800' },

  // Property Crimes
  { value: 'THEFT', label: 'Theft', category: 'Property Crimes', color: 'bg-blue-100 text-blue-800' },
  { value: 'PETTY_THEFT', label: 'Petty Theft', category: 'Property Crimes', color: 'bg-blue-100 text-blue-800' },
  { value: 'GRAND_THEFT', label: 'Grand Theft', category: 'Property Crimes', color: 'bg-blue-100 text-blue-800' },
  { value: 'BURGLARY', label: 'Burglary', category: 'Property Crimes', color: 'bg-blue-100 text-blue-800' },
  { value: 'BREAKING_AND_ENTERING', label: 'Breaking and Entering', category: 'Property Crimes', color: 'bg-blue-100 text-blue-800' },
  { value: 'VANDALISM', label: 'Vandalism', category: 'Property Crimes', color: 'bg-blue-100 text-blue-800' },
  { value: 'ARSON', label: 'Arson', category: 'Property Crimes', color: 'bg-blue-100 text-blue-800' },
  { value: 'FRAUD', label: 'Fraud', category: 'Property Crimes', color: 'bg-blue-100 text-blue-800' },
  { value: 'EMBEZZLEMENT', label: 'Embezzlement', category: 'Property Crimes', color: 'bg-blue-100 text-blue-800' },
  { value: 'FORGERY', label: 'Forgery', category: 'Property Crimes', color: 'bg-blue-100 text-blue-800' },
  { value: 'IDENTITY_THEFT', label: 'Identity Theft', category: 'Property Crimes', color: 'bg-blue-100 text-blue-800' },
  { value: 'CREDIT_CARD_FRAUD', label: 'Credit Card Fraud', category: 'Property Crimes', color: 'bg-blue-100 text-blue-800' },

  // Drug Related
  { value: 'DRUG_POSSESSION', label: 'Drug Possession', category: 'Drug Related', color: 'bg-purple-100 text-purple-800' },
  { value: 'DRUG_TRAFFICKING', label: 'Drug Trafficking', category: 'Drug Related', color: 'bg-purple-100 text-purple-800' },
  { value: 'DRUG_MANUFACTURING', label: 'Drug Manufacturing', category: 'Drug Related', color: 'bg-purple-100 text-purple-800' },
  { value: 'DUI_DWI', label: 'DUI/DWI', category: 'Drug Related', color: 'bg-purple-100 text-purple-800' },
  { value: 'PUBLIC_INTOXICATION', label: 'Public Intoxication', category: 'Drug Related', color: 'bg-purple-100 text-purple-800' },

  // Traffic & Vehicle
  { value: 'POLICE_CHASE', label: 'Police Chase', category: 'Traffic & Vehicle', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'ELUDING_POLICE', label: 'Eluding Police', category: 'Traffic & Vehicle', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'RECKLESS_DRIVING', label: 'Reckless Driving', category: 'Traffic & Vehicle', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'HIT_AND_RUN', label: 'Hit and Run', category: 'Traffic & Vehicle', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'DRIVING_WITHOUT_LICENSE', label: 'Driving Without License', category: 'Traffic & Vehicle', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'VEHICULAR_MANSLAUGHTER', label: 'Vehicular Manslaughter', category: 'Traffic & Vehicle', color: 'bg-yellow-100 text-yellow-800' },

  // Public Order
  { value: 'DISORDERLY_CONDUCT', label: 'Disorderly Conduct', category: 'Public Order', color: 'bg-orange-100 text-orange-800' },
  { value: 'DISTURBING_PEACE', label: 'Disturbing the Peace', category: 'Public Order', color: 'bg-orange-100 text-orange-800' },
  { value: 'TRESPASSING', label: 'Trespassing', category: 'Public Order', color: 'bg-orange-100 text-orange-800' },
  { value: 'LOITERING', label: 'Loitering', category: 'Public Order', color: 'bg-orange-100 text-orange-800' },
  { value: 'PROSTITUTION', label: 'Prostitution', category: 'Public Order', color: 'bg-orange-100 text-orange-800' },
  { value: 'WEAPONS_VIOLATION', label: 'Weapons Violation', category: 'Public Order', color: 'bg-orange-100 text-orange-800' },
  { value: 'FIREARM_POSSESSION', label: 'Illegal Firearm Possession', category: 'Public Order', color: 'bg-orange-100 text-orange-800' },

  // Against Government
  { value: 'ATTACKING_OFFICER', label: 'Attacking Officer', category: 'Against Government', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'RESISTING_ARREST', label: 'Resisting Arrest', category: 'Against Government', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'OBSTRUCTION_OF_JUSTICE', label: 'Obstruction of Justice', category: 'Against Government', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'CONTEMPT_OF_COURT', label: 'Contempt of Court', category: 'Against Government', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'TAX_EVASION', label: 'Tax Evasion', category: 'Against Government', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'BRIBERY', label: 'Bribery', category: 'Against Government', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'PERJURY', label: 'Perjury', category: 'Against Government', color: 'bg-indigo-100 text-indigo-800' },

  // Cybercrime
  { value: 'CYBERCRIME', label: 'Cybercrime', category: 'Cybercrime', color: 'bg-pink-100 text-pink-800' },
  { value: 'HACKING', label: 'Hacking', category: 'Cybercrime', color: 'bg-pink-100 text-pink-800' },
  { value: 'ONLINE_FRAUD', label: 'Online Fraud', category: 'Cybercrime', color: 'bg-pink-100 text-pink-800' },

  // Other
  { value: 'PAROLE_VIOLATION', label: 'Parole Violation', category: 'Other', color: 'bg-gray-100 text-gray-800' },
  { value: 'PROBATION_VIOLATION', label: 'Probation Violation', category: 'Other', color: 'bg-gray-100 text-gray-800' },
  { value: 'WARRANT', label: 'Warrant', category: 'Other', color: 'bg-gray-100 text-gray-800' },
  { value: 'FAILURE_TO_APPEAR', label: 'Failure to Appear', category: 'Other', color: 'bg-gray-100 text-gray-800' },
  { value: 'OTHER', label: 'Other', category: 'Other', color: 'bg-gray-100 text-gray-800' },
]

export const getCrimeTypeInfo = (value: string): CrimeTypeInfo => {
  return CRIME_TYPES.find(type => type.value === value) || CRIME_TYPES[CRIME_TYPES.length - 1]
}

export const getCrimeTypesByCategory = () => {
  return CRIME_CATEGORIES.reduce((acc, category) => {
    acc[category] = CRIME_TYPES.filter(type => type.category === category)
    return acc
  }, {} as Record<string, CrimeTypeInfo[]>)
}