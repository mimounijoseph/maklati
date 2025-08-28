export interface Plat {
  id: number;
  name: string;
  description: string;
  status: boolean;
  category: string;
  size: string;
  price: number;
  urlPhoto: string;
  userId?: string;
  createdAt?: Date;
}