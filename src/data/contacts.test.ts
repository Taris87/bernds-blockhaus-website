import { describe, expect, it } from 'vitest';
import {
  contactPersons,
  formatAddress,
  getContact,
  openingHours,
  phoneHref,
} from './contacts';

describe('contact data', () => {
  it('lists one contact person per role of the former website', () => {
    expect(contactPersons.map((person) => [person.role, person.name])).toEqual([
      ['blockhaus', 'Tanja Schellhaas'],
      ['islandpferde', 'Anna Schellhaas'],
      ['angus', 'Bernd Schellhaas'],
    ]);
  });

  it('keeps both farm addresses apart', () => {
    expect(formatAddress(getContact('blockhaus').address!)).toBe(
      'Eichwieserhof 10, 67685 Weilerbach',
    );
    expect(formatAddress(getContact('angus').address!)).toBe(
      'Eichwieserhof 4, 67685 Weilerbach',
    );
  });

  it('builds international tel: links from displayed numbers', () => {
    expect(phoneHref('06374-992911')).toBe('tel:+496374992911');
    expect(phoneHref('06374/992911')).toBe('tel:+496374992911');
    expect(phoneHref('0176-85072834')).toBe('tel:+4917685072834');
  });

  it('contains the opening hours without the expired holiday notice', () => {
    expect(openingHours.map((entry) => `${entry.days} ${entry.time}`)).toEqual([
      'Freitag ab 15:00 Uhr',
      'Samstag ab 11:00 Uhr',
      'Sonn- und feiertags ab 10:00 Uhr',
    ]);
  });
});
