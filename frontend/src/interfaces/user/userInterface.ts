export interface User {
  _id: any;
  name: string;
  email: string;
  password?: string;
  mobile?: number;
  isVerified?: boolean;
  isBlocked: boolean;
  image?: string;
  role: string;
  skills?: string;
  education?: string;
  specification?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  }[];
  createdAt?: Date;
}
