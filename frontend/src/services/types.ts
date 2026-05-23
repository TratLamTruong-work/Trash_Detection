export interface User {
  _id: string;
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  male: boolean;
  role: "ADMIN" | "USER";
  totalPoint?: number;
  points: number;
  iconUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DefaultItem {
  _id: string;
  name: string;
  pointToTrade: number;
  imageUrl: string;
  description?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomItem extends DefaultItem {
  userId?: string;
  groupId?: string;
}

export interface TradeHistory {
  _id: string;
  userId?: string;
  itemId?: string;
  user?: {
    _id: string;
    username: string;
    email: string;
  };
  item?: {
    _id: string;
    name: string;
    pointToTrade: number;
    imageUrl: string;
  };
  quantityTraded?: number;
  quantity?: number;
  pointsUsed?: number;
  previousPoint?: number;
  remainedPoint?: number;
  status?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SignInParams {
  userName: string;
  password: string;
}

export interface SignUpParams {
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate?: string;
  male: boolean;
  points?: number;
  role?: 'ADMIN' | 'USER';
  icon?: File;
}

export interface ItemPayload {
  name: string;
  pointToTrade: number;
  imageUrl?: string;
  description?: string;
  userId?: string;
  groupId?: string;
}

export interface TradeHistoryPayload {
  userId: string;
  itemId: string;
  quantityTraded: number;
  pointsUsed?: number;
  status?: string;
  notes?: string;
}

export interface PointTransaction {
  _id: string;
  userId: string | User;
  qrCodeId?: string;
  type: 'earn' | 'spend';
  method: string;
  points: number;
  prevPoint: number;
  currentPoint: number;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
  updatedAt?: string;
}

export interface PointTransactionPayload {
  userId: string;
  qrCodeId?: string;
  type: 'earn' | 'spend';
  method: string;
  points: number;
  prevPoint: number;
  currentPoint: number;
  status?: 'completed' | 'pending' | 'failed';
}
