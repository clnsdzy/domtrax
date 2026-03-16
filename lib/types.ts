export interface Domain {
  id: string;
  name: string;
  registrar: string;
  registeredDate: string;
  expiryDate: string;
  ns1?: string;
  ns2?: string;
  notes?: string;
  status: "active" | "expired";
}

export interface User {
  email: string;
}
