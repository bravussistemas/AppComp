export class Point {
  lng: number;
  lat: number;
  srid: number;
}

export class Address {
  id: number;
  street: string;
  number: string;
  complement: string;
  ref: string;
  district: string;
  city: number;
  state: number;
  state_label: string;
  city_label: string;
  point: Point;
  zip_code: string;
  get_simple_address: string;
  simple_address: string;
  minimum_address: string;
  full_address: string;
}
