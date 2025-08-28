export interface Plat {
  id?: number;
  name: string;
  description: string;
  category: string;
  cost: {
    price: number;
    size: string;
    quantity: number;
  }[]|[],
  status: boolean;
  urlPhoto: string;
  snackId?: string;
  createdAt?: Date;
}
