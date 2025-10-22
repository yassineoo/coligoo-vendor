export type OrderDb = {
  id: number;
  orderId?: string;
  firstname?: string | null;
  lastName?: string | null;
  contactPhone?: string | null;
  contactPhone2?: string | null;
  address?: string | null;
  note?: string | null;
  productList?: unknown;
  price?: string | number | null;
  discount?: string | number | null;
  shippingFee?: string | number | null;
  weight?: string | number | null;
  height?: string | number | null;
  width?: string | number | null;
  length?: string | number | null;
  isStopDesk?: boolean;
  freeShipping?: boolean;
  hasExchange?: boolean;
  paymentType?: string | null;
  status?: string | null;
  returnCause?: string | null;
  returnNotes?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deliveredAt?: string | null;
  cancelledAt?: string | null;
  shippedAt?: string | null;
  returnedAt?: string | null;
  paidAt?: string | null;
  deliveryAttempts?: number | null;
  sender?: unknown;
  deliveryman?: { id?: number; name?: string } | number | null;
  fromCity?: { id: number; name: string; ar_name?: string } | null;
  toCity?: { id: number; name: string; ar_name?: string } | null;
  deliveryProofs?: Array<{ url: string; thumbnail?: string }>;
};

export type OrdersResponse = {
  data: OrderDb[];
  meta?: {
    total?: number;
    page?: number;
    lastPage?: number;
    limit?: number;
  };
};

export type UIOrder = {
  id: string;
  date: string;
  tracking: string;
  client: string;
  contact: string;
  wilya: string;
  address: string;
  orderText: string;
  totalPrice: string;
  delivery: string;
  status: string;
  note: string;
};
