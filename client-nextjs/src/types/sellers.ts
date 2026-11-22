export interface SellerStatus {
  isSeller: boolean;
  seller: {
    userId: number;
    companyName: string;
    cui: string | null;
    address: string | null;
    phone: string | null;
    iban: string | null;
  } | null;
}

export interface SellerRegistration {
  companyName: string;
  cui: string;
  address: string;
  phone: string;
  iban: string;
}