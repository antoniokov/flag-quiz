import { Country } from '../types';

export const countries: Country[] = [
  { name: 'Andorra', code: 'AD', similarTo: ['RO', 'MD', 'TD'] },
  { name: 'United Arab Emirates', code: 'AE', similarTo: ['JO', 'PS', 'KW'] },
  { name: 'Belgium', code: 'BE', similarTo: ['RO', 'MD', 'DE'] },
  { name: 'Bolivia', code: 'BO', similarTo: ['ET', 'GH', 'LT'] },
  { name: 'Cameroon', code: 'CM', similarTo: ['SN', 'ML', 'GN'] },
  { name: 'Costa Rica', code: 'CR', similarTo: ['NL', 'TH', 'PY'] },
  { name: 'Denmark', code: 'DK', similarTo: ['NO', 'IS', 'SE', 'FI'] },
  { name: 'Egypt', code: 'EG', similarTo: ['SY', 'IQ', 'YE', 'SD', 'PS'] },
  { name: 'Ethiopia', code: 'ET', similarTo: ['GH', 'GN', 'BO'] },
  { name: 'Finland', code: 'FI', similarTo: ['NO', 'IS', 'SE', 'DK'] },
  { name: 'France', code: 'FR', similarTo: ['NL', 'LU', 'RU', 'SI', 'RS'] },
  { name: 'Ghana', code: 'GH', similarTo: ['GN', 'SN', 'ML', 'ET'] },
  { name: 'Guinea', code: 'GN', similarTo: ['GH', 'SN', 'ML', 'ET'] },
  { name: 'Indonesia', code: 'ID', similarTo: ['PL', 'MC', 'MT'] },
  { name: 'Iraq', code: 'IQ', similarTo: ['JO', 'SY', 'YE', 'EG', 'SD'] },
  { name: 'Iceland', code: 'IS', similarTo: ['NO', 'SE', 'FI', 'DK'] },
  { name: 'Jordan', code: 'JO', similarTo: ['PS', 'SY', 'IQ', 'AE', 'KW'] },
  { name: 'Kuwait', code: 'KW', similarTo: ['JO', 'PS', 'AE'] },
  { name: 'Lithuania', code: 'LT', similarTo: ['BO', 'ET', 'GH'] },
  { name: 'Luxembourg', code: 'LU', similarTo: ['FR', 'NL', 'RU', 'NL'] },
  { name: 'Mali', code: 'ML', similarTo: ['GH', 'GN', 'SN', 'CM'] },
  { name: 'Malta', code: 'MT', similarTo: ['PL', 'ID', 'MC'] },
  { name: 'Monaco', code: 'MC', similarTo: ['PL', 'ID', 'MT'] },
  { name: 'Moldova', code: 'MD', similarTo: ['RO', 'BE', 'AD'] },
  { name: 'Netherlands', code: 'NL', similarTo: ['FR', 'LU', 'RU', 'CR', 'PY'] },
  { name: 'Norway', code: 'NO', similarTo: ['IS', 'SE', 'FI', 'DK'] },
  { name: 'Palestine', code: 'PS', similarTo: ['JO', 'SY', 'SD', 'AE', 'KW'] },
  { name: 'Poland', code: 'PL', similarTo: ['ID', 'MC', 'MT'] },
  { name: 'Paraguay', code: 'PY', similarTo: ['NL', 'CR', 'LU'] },
  { name: 'Romania', code: 'RO', similarTo: ['MD', 'BE', 'TD', 'AD'] },
  { name: 'Serbia', code: 'RS', similarTo: ['FR', 'RU', 'SI', 'SK'] },
  { name: 'Russia', code: 'RU', similarTo: ['FR', 'NL', 'LU', 'SI', 'SK', 'RS'] },
  { name: 'Sudan', code: 'SD', similarTo: ['PS', 'IQ', 'EG', 'YE'] },
  { name: 'Sweden', code: 'SE', similarTo: ['NO', 'IS', 'FI', 'DK'] },
  { name: 'Slovenia', code: 'SI', similarTo: ['FR', 'RU', 'SK', 'RS'] },
  { name: 'Slovakia', code: 'SK', similarTo: ['RU', 'SI', 'RS'] },
  { name: 'Senegal', code: 'SN', similarTo: ['GH', 'GN', 'ML', 'CM'] },
  { name: 'Syria', code: 'SY', similarTo: ['JO', 'PS', 'IQ', 'EG', 'YE'] },
  { name: 'Chad', code: 'TD', similarTo: ['RO', 'MD', 'AD'] },
  { name: 'Thailand', code: 'TH', similarTo: ['CR', 'FR', 'NL'] },
  { name: 'Yemen', code: 'YE', similarTo: ['SY', 'IQ', 'EG', 'SD', 'PS'] },
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