export type User = {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  fullName: string;
  role: string;
  permissions: string;
  hubId: string;
  hubAdmin: string;
  createdAt: string;
  dob: string;
  phoneNumber: string;
  sex: string;
  isEmailVerified: boolean;
  imgUrl: string;
  blocked: boolean;
  deviceToken: string;
  hubEmployeesCount: number;
};

export type Product = {
  id: number;
  productName: string;
  productAlias: string;
  category: string;
  description: string;
  price: string;
  quantity: number;
  hasVariables: boolean;
  variables: any;
  showAliasInOrder: boolean;
  vendorId: number;
  createdAt: string;
  updatedAt: string;
};

export type Meta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
