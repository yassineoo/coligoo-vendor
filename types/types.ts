export type DbAdminNotification = {
  id: number; 
  title: string; 
  content: string; 
  read: boolean; 
  createdAt: string;
};

export type AdminNotificationInsert = {
  id?: number;
  title: string;
  content: string;
  read?: boolean;
  createdAt?: string;
};

export type AdminNotificationUpdate = Partial<AdminNotificationInsert>;

export type DbCity = {
  id: number; 
  name: string; 
  ar_name: string; 
  wilayaCode: string | null; 
};

export type CityInsert = {
  id?: number;
  name: string;
  ar_name: string;
  wilayaCode?: string | null;
};

export type CityUpdate = Partial<CityInsert>;

export type DbNotification = {
  id: number; 
  content: string; 
  ar_content: string; 
  type: string; 
  read: boolean; 
  fileUploaded: number; 
  createdAt: string;
  userId: number | null; 
};

export type NotificationInsert = {
  id?: number;
  content: string;
  ar_content: string;
  type: string;
  read?: boolean;
  fileUploaded?: number;
  createdAt?: string;
  userId?: number | null;
};

export type NotificationUpdate = Partial<NotificationInsert>;

export type DbOrders = {
  id: number; 
  orderId: string; 
  firstname: string; 
  contactPhone: string; 
  address: string; 
  price: string; 
  shippingFee: string; 
  weight: string | null; 
  height: number | null; 
  width: number | null; 
  length: number | null; 
  isStopDesk: boolean; 
  freeShipping: number; 
  hasExchange: boolean; 
  paymentType: 'cash_on_delivery' | 'prepaid'; 
  status: 'pending' | 'confirmed' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled' | 'returned'; 
  createdAt: string; 
  updatedAt: string;
  deliveredAt: string | null; 
  cancelledAt: string | null; 
  senderId: number | null; 
  deliverymanId: number | null; 
  fromCityId: number | null; 
  toCityId: number | null;
  lastName: string; 
  contactPhone2: string | null; 
  note: string; 
  productList: string | null;
};

export type OrdersInsert = {
  id?: number;
  orderId: string;
  firstname: string;
  contactPhone: string;
  address: string;
  price: string;
  shippingFee?: string;
  weight?: string | null;
  height?: number | null;
  width?: number | null;
  length?: number | null;
  isStopDesk?: boolean;
  freeShipping?: number;
  hasExchange?: boolean;
  paymentType?: 'cash_on_delivery' | 'prepaid';
  status?: 'pending' | 'confirmed' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled' | 'returned';
  createdAt?: string;
  updatedAt?: string;
  deliveredAt?: string | null;
  cancelledAt?: string | null;
  senderId?: number | null;
  deliverymanId?: number | null;
  fromCityId?: number | null;
  toCityId?: number | null;
  lastName: string;
  contactPhone2?: string | null;
  note: string;
  productList?: string | null;
};

export type OrdersUpdate = Partial<OrdersInsert>;

export type DbOrderItems = {
  id: number; 
  order_id: number; 
  product_id: number; 
  quantity: number; 
  unitPrice: string; 
  productVariations: string | null;
  notes: string | null;
  created_at: string; 
  updated_at: string;
};

export type OrderItemsInsert = {
  id?: number;
  order_id: number;
  product_id: number;
  quantity?: number;
  unitPrice: string;
  productVariations?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type OrderItemsUpdate = Partial<OrderItemsInsert>;

export type DbOrderTracking = {
  id: number; 
  orderId: number; 
  status: 'pending' | 'confirmed' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled' | 'returned';
  location: string; 
  note: string;
  proofPhoto: string | null; 
  signature: string | null; 
  timestamp: string;
  updatedById: number | null; 
};

export type OrderTrackingInsert = {
  id?: number;
  orderId: number;
  status: 'pending' | 'confirmed' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled' | 'returned';
  location: string;
  note: string;
  proofPhoto?: string | null;
  signature?: string | null;
  timestamp?: string;
  updatedById?: number | null;
};

export type OrderTrackingUpdate = Partial<OrderTrackingInsert>;

export type DbOtp = {
  otp: string; 
  email: string; 
  createdAt: string;
  type: 'reset-password' | 'verify-email'; 
  expiresAt: string; 
};

export type OtpInsert = {
  otp: string;
  email: string;
  createdAt?: string;
  type: 'reset-password' | 'verify-email';
  expiresAt: string;
};

export type OtpUpdate = Partial<OtpInsert>;

export type DbProducts = {
  id: number; 
  product_name: string | null; 
  product_alias: string | null; 
  category: 'electronics' | 'clothing' | 'home & garden' | 'sports & outdoors' | 'books' | 'toys & games' | 'health & beauty' | 'automotive' | 'jewelry' | 'food & beverages' | null;
  description: string | null;
  price: string | null;
  quantity: number | null; 
  has_variables: boolean | null; 
  show_alias_in_order: number | null; 
  vendor_id: number | null; 
  created_at: string;
  updated_at: string;
  variables: string | null; 
};

export type ProductsInsert = {
  id?: number;
  product_name?: string | null;
  product_alias?: string | null;
  category?: 'electronics' | 'clothing' | 'home & garden' | 'sports & outdoors' | 'books' | 'toys & games' | 'health & beauty' | 'automotive' | 'jewelry' | 'food & beverages' | null;
  description?: string | null;
  price?: string | null;
  quantity?: number | null;
  has_variables?: boolean | null;
  show_alias_in_order?: number | null;
  vendor_id?: number | null;
  created_at?: string;
  updated_at?: string;
  variables?: string | null;
};

export type ProductsUpdate = Partial<ProductsInsert>;

export type DbUser = {
  id: number; 
  email: string; 
  password: string | null; 
  nom: string | null; 
  prenom: string | null; 
  role: 'client' | 'vendor' | 'admin' | 'hub_admin' | 'moderator' | 'hub_employee' | 'deliveryman'; 
  createdAt: string; 
  dob: string | null;
  phoneNumber: string | null; 
  sex: 'homme' | 'femme' | null;
  isEmailVerified: boolean; 
  imgUrl: string | null; 
  blocked: number; 
  deviceToken: string | null; 
  permissions: string | null;
  fullName: string | null; 
  hub_id: number | null; 
  firebaseUserId: string | null; 
  address: string | null; 
};

export type UserInsert = {
  id?: number;
  email: string;
  password?: string | null;
  nom?: string | null;
  prenom?: string | null;
  role: 'client' | 'vendor' | 'admin' | 'hub_admin' | 'moderator' | 'hub_employee' | 'deliveryman';
  createdAt?: string;
  dob?: string | null;
  phoneNumber?: string | null;
  sex?: 'homme' | 'femme' | null;
  isEmailVerified?: boolean;
  imgUrl?: string | null;
  blocked?: number;
  deviceToken?: string | null;
  permissions?: string | null;
  fullName?: string | null;
  hub_id?: number | null;
  firebaseUserId?: string | null;
  address?: string | null;
};

export type UserUpdate = Partial<UserInsert>;

export type DbWilaya = {
  code: string;
  name: string; 
  ar_name: string; 
};

export type WilayaInsert = {
  code: string;
  name: string;
  ar_name: string;
};

export type WilayaUpdate = Partial<WilayaInsert>;

