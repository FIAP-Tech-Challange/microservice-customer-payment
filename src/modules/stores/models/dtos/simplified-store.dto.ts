export interface SimplifiedStoreDto {
  id: string;
  name: string;
  fantasyName: string;
  email: string;
  phone: string;
  cnpj: string;
  isActive: boolean;
  totems: SimplifiedTotemDto[];
}

export interface SimplifiedTotemDto {
  id: string;
  name: string;
  tokenAccess: string;
  isActive: boolean;
}
