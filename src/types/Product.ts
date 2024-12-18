interface Product {
  sku: string;
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  brand: string;
  tags: string[];
  price: number;
  stock: number;
  isAvailable: boolean;
  images: string[];
}

export default Product;
