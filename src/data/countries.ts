import { Country } from '../types';

// Countries with similar flags grouped together
export const countries: Country[] = [
  // Middle Eastern similar flags
  { 
    name: 'Jordan', 
    code: 'JO', 
    region: 'Middle East',
    similarTo: ['PS', 'SY', 'IQ', 'AE', 'KW'] 
  },
  { 
    name: 'Palestine', 
    code: 'PS', 
    region: 'Middle East',
    similarTo: ['JO', 'SY', 'SD', 'AE', 'KW'] 
  },
  { 
    name: 'Syria', 
    code: 'SY', 
    region: 'Middle East',
    similarTo: ['JO', 'PS', 'IQ', 'EG', 'YE'] 
  },
  { 
    name: 'Iraq', 
    code: 'IQ', 
    region: 'Middle East',
    similarTo: ['JO', 'SY', 'YE', 'EG', 'SD'] 
  },
  { 
    name: 'Egypt', 
    code: 'EG', 
    region: 'Middle East',
    similarTo: ['SY', 'IQ', 'YE', 'SD', 'PS'] 
  },
  { 
    name: 'Yemen', 
    code: 'YE', 
    region: 'Middle East',
    similarTo: ['SY', 'IQ', 'EG', 'SD', 'PS'] 
  },
  { 
    name: 'Sudan', 
    code: 'SD', 
    region: 'Africa',
    similarTo: ['PS', 'IQ', 'EG', 'YE'] 
  },
  { 
    name: 'United Arab Emirates', 
    code: 'AE', 
    region: 'Middle East',
    similarTo: ['JO', 'PS', 'KW'] 
  },
  { 
    name: 'Kuwait', 
    code: 'KW', 
    region: 'Middle East',
    similarTo: ['JO', 'PS', 'AE'] 
  },
  
  // European similar flags
  { 
    name: 'Romania', 
    code: 'RO', 
    region: 'Europe',
    similarTo: ['MD', 'BE', 'TD', 'AD'] 
  },
  { 
    name: 'Moldova', 
    code: 'MD', 
    region: 'Europe',
    similarTo: ['RO', 'BE', 'AD'] 
  },
  { 
    name: 'Belgium', 
    code: 'BE', 
    region: 'Europe',
    similarTo: ['RO', 'MD', 'DE'] 
  },
  { 
    name: 'Chad', 
    code: 'TD', 
    region: 'Africa',
    similarTo: ['RO', 'MD', 'AD'] 
  },
  { 
    name: 'Andorra', 
    code: 'AD', 
    region: 'Europe',
    similarTo: ['RO', 'MD', 'TD'] 
  },
  
  // Similar tricolor flags
  { 
    name: 'France', 
    code: 'FR', 
    region: 'Europe',
    similarTo: ['NL', 'LU', 'RU', 'SI', 'RS'] 
  },
  { 
    name: 'Netherlands', 
    code: 'NL', 
    region: 'Europe',
    similarTo: ['FR', 'LU', 'RU', 'CR', 'PY'] 
  },
  { 
    name: 'Luxembourg', 
    code: 'LU', 
    region: 'Europe',
    similarTo: ['FR', 'NL', 'RU', 'NL'] 
  },
  { 
    name: 'Russia', 
    code: 'RU', 
    region: 'Europe',
    similarTo: ['FR', 'NL', 'LU', 'SI', 'SK', 'RS'] 
  },
  { 
    name: 'Slovenia', 
    code: 'SI', 
    region: 'Europe',
    similarTo: ['FR', 'RU', 'SK', 'RS'] 
  },
  { 
    name: 'Slovakia', 
    code: 'SK', 
    region: 'Europe',
    similarTo: ['RU', 'SI', 'RS'] 
  },
  { 
    name: 'Serbia', 
    code: 'RS', 
    region: 'Europe',
    similarTo: ['FR', 'RU', 'SI', 'SK'] 
  },
  { 
    name: 'Costa Rica', 
    code: 'CR', 
    region: 'North America',
    similarTo: ['NL', 'TH', 'PY'] 
  },
  { 
    name: 'Thailand', 
    code: 'TH', 
    region: 'Asia',
    similarTo: ['CR', 'FR', 'NL'] 
  },
  { 
    name: 'Paraguay', 
    code: 'PY', 
    region: 'South America',
    similarTo: ['NL', 'CR', 'LU'] 
  },
  
  // Nordic cross flags
  { 
    name: 'Norway', 
    code: 'NO', 
    region: 'Europe',
    similarTo: ['IS', 'SE', 'FI', 'DK'] 
  },
  { 
    name: 'Iceland', 
    code: 'IS', 
    region: 'Europe',
    similarTo: ['NO', 'SE', 'FI', 'DK'] 
  },
  { 
    name: 'Sweden', 
    code: 'SE', 
    region: 'Europe',
    similarTo: ['NO', 'IS', 'FI', 'DK'] 
  },
  { 
    name: 'Finland', 
    code: 'FI', 
    region: 'Europe',
    similarTo: ['NO', 'IS', 'SE', 'DK'] 
  },
  { 
    name: 'Denmark', 
    code: 'DK', 
    region: 'Europe',
    similarTo: ['NO', 'IS', 'SE', 'FI'] 
  },
  
  // Similar African flags
  { 
    name: 'Ghana', 
    code: 'GH', 
    region: 'Africa',
    similarTo: ['GN', 'SN', 'ML', 'ET'] 
  },
  { 
    name: 'Guinea', 
    code: 'GN', 
    region: 'Africa',
    similarTo: ['GH', 'SN', 'ML', 'ET'] 
  },
  { 
    name: 'Senegal', 
    code: 'SN', 
    region: 'Africa',
    similarTo: ['GH', 'GN', 'ML', 'CM'] 
  },
  { 
    name: 'Mali', 
    code: 'ML', 
    region: 'Africa',
    similarTo: ['GH', 'GN', 'SN', 'CM'] 
  },
  { 
    name: 'Cameroon', 
    code: 'CM', 
    region: 'Africa',
    similarTo: ['SN', 'ML', 'GN'] 
  },
  { 
    name: 'Ethiopia', 
    code: 'ET', 
    region: 'Africa',
    similarTo: ['GH', 'GN', 'BO'] 
  },
  { 
    name: 'Bolivia', 
    code: 'BO', 
    region: 'South America',
    similarTo: ['ET', 'GH', 'LT'] 
  },
  { 
    name: 'Lithuania', 
    code: 'LT', 
    region: 'Europe',
    similarTo: ['BO', 'ET', 'GH'] 
  },
  
  // Red and white flags
  { 
    name: 'Poland', 
    code: 'PL', 
    region: 'Europe',
    similarTo: ['ID', 'MC', 'MT'] 
  },
  { 
    name: 'Indonesia', 
    code: 'ID', 
    region: 'Asia',
    similarTo: ['PL', 'MC', 'MT'] 
  },
  { 
    name: 'Monaco', 
    code: 'MC', 
    region: 'Europe',
    similarTo: ['PL', 'ID', 'MT'] 
  },
  { 
    name: 'Malta', 
    code: 'MT', 
    region: 'Europe',
    similarTo: ['PL', 'ID', 'MC'] 
  },
];

// Helper function to get a country by code
export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find(country => country.code === code);
};

// Helper function to get similar countries
export const getSimilarCountries = (countryCode: string, count: number): Country[] => {
  const country = getCountryByCode(countryCode);
  if (!country || !country.similarTo) return [];
  
  return country.similarTo
    .map(code => getCountryByCode(code))
    .filter((c): c is Country => c !== undefined)
    .slice(0, count);
}; 