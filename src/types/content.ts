/** A photo served from `public/images/` with its intrinsic pixel size. */
export interface Photo {
  /** Path below `public/images/`, e.g. `blockhaus/blockhaus-teich-sommer.jpg`. */
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface PostalAddress {
  street: string;
  postalCode: string;
  city: string;
}

export type ContactRole = 'blockhaus' | 'islandpferde' | 'angus';

export interface ContactPerson {
  role: ContactRole;
  /** Section heading as used on the former website. */
  group: string;
  /** What the person is responsible for (wording of the former website). */
  responsibility: string;
  name: string;
  phone: string;
  email: string;
  address?: PostalAddress;
}

export interface OpeningHour {
  days: string;
  time: string;
}

export interface ApartmentPrice {
  label: string;
  amount: string;
}

export interface Apartment {
  id: string;
  name: string;
  size: string;
  beds: string;
  features: string[];
  prices: ApartmentPrice[];
  priceNote: string;
  photo: Photo;
  gallery: Photo[];
}

export interface MenuCategory {
  id: string;
  title: string;
  /** Optional remark printed with the category on the former menu. */
  note?: string;
  items: string[];
}

export interface Stallion {
  id: string;
  name: string;
  born: string;
  details?: string;
  stud?: string;
}

export interface SaleHorse {
  name: string;
  born: string;
  dam: string;
  /** Id of the sire in the stallion list. */
  sireId: string;
  photo: Photo;
}

export interface SaleHorseGroup {
  id: string;
  title: string;
  horses: SaleHorse[];
}
