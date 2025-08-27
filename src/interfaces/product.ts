export interface Plat {
  id: number;
  name: string;
  description: string;
  category: string;
  size: string;
  price: number;
  urlPhoto: string;
  snackId?: string;
  createdAt?: Date;
}