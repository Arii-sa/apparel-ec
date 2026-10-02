export type Address = {
  id: number;
  postal_code: string;
  prefecture: string;
  city: string;
  line1: string;
  line2: string | null;
  phone: string;
};

export type NewAddress = {
  postal_code: string;
  prefecture: string;
  city: string;
  line1: string;
  line2?: string;
  phone: string;
};
