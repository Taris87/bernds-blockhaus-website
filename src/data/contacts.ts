import type {
  ContactPerson,
  OpeningHour,
  PostalAddress,
} from '../types/content';

export const operator = {
  name: 'Tanja und Bernd Schellhaas GbR',
  address: {
    street: 'Eichwieserhof 10',
    postalCode: '67685',
    city: 'Weilerbach',
  } satisfies PostalAddress,
  phone: '06374-992911',
  email: 'bs@eichwieserhof.de',
  /** Shown as on the former imprint; format still to be checked by the operator. */
  vatId: 'DE 25 / 200 / 0508 / 02',
};

export const contactPersons: ContactPerson[] = [
  {
    role: 'blockhaus',
    group: 'Kontakt Bernd’s Blockhaus',
    responsibility:
      'Für Reservierungen und Anfragen bezüglich der Gaststätte oder Ferienwohnung',
    name: 'Tanja Schellhaas',
    phone: '06374-992911',
    email: 'ts@eichwieserhof.de',
    address: operator.address,
  },
  {
    role: 'islandpferde',
    group: 'Kontakt Eichwieserhof',
    responsibility: 'Für Anfragen bezüglich der Islandpferde',
    name: 'Anna Schellhaas',
    phone: '0176-85072834',
    email: 'anna@eichwieserhof.de',
  },
  {
    role: 'angus',
    group: 'Kontakt Eichwieserhof',
    responsibility: 'Für Anfragen bezüglich der Anguszucht, des Hofladens',
    name: 'Bernd Schellhaas',
    phone: '0151-15555502',
    email: 'bs@eichwieserhof.de',
    address: {
      street: 'Eichwieserhof 4',
      postalCode: '67685',
      city: 'Weilerbach',
    },
  },
];

export function getContact(role: ContactPerson['role']): ContactPerson {
  const person = contactPersons.find((entry) => entry.role === role);
  if (!person) throw new Error(`Kein Kontakt für Rolle ${role}`);
  return person;
}

export const openingHours: OpeningHour[] = [
  { days: 'Freitag', time: 'ab 15:00 Uhr' },
  { days: 'Samstag', time: 'ab 11:00 Uhr' },
  { days: 'Sonn- und feiertags', time: 'ab 10:00 Uhr' },
];

/** Phone number for beef pre-orders (former page “Rindfleisch bestellen”). */
export const beefOrderPhone = '06374/992911';

export const directions = '[PLATZHALTER: Anfahrtsbeschreibung]';

export function formatAddress(address: PostalAddress): string {
  return `${address.street}, ${address.postalCode} ${address.city}`;
}

/** Turns a displayed German phone number into an international `tel:` href. */
export function phoneHref(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return `tel:${digits.startsWith('0') ? `+49${digits.slice(1)}` : digits}`;
}
