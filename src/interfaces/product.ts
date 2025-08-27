export interface Plat {
  id: number;
  name: string;
  description: string;
  category: string;
  size: string;
  price: number;
  urlPhoto: string;
  userId?: string;
  createdAt?: Date;
}