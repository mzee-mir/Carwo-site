export type CartLine = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  size: string;
  colour: string;
  quantity: number;
  unitPrice: number;
  image?: string;
  unavailable?: boolean;
};
