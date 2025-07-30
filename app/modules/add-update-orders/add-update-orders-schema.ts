export type AddUpdateOrderFormType = {
  firstName: string;
  lastName: string;
  phoneNumberOne: string;
  phoneNumberTwo?: string;
  wilaya: string;
  commune: string;
  address: string;
  product: string;
  note: string;
  orderType: "domicile" | "stopdesk";
  orderTypeTwo: "normal" | "exchange";
  returnFees: number;
  deliveryCost: number;
  subtotal: number;
  totalToCollect: number;
};
