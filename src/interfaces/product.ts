export interface Plat {
  id?: number;
  name: string;
  description: string;
  status: boolean;
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
