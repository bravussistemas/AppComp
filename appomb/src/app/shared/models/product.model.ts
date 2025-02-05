export class ImageProduct {
  image: {
    thumbnail: string;
    original: string;
  }
}

export class CategoryProduct {
  public static MAIN = 0;
  public static SECUNDARY = 1;
}


export class Product {
  description: string;
  image: {
    original: string;
  };
  id: number;
  image_thumbnail: {
    original: string;
  };
  name: string;
  name_formatted: string;
  name_short: string;
  next_batch_default: string;
  category: number;
  is_visible: boolean;
  item_order: number;
  price: number;
  reset_at_end_day: boolean;
  slug: string;
  images_product: ImageProduct[];
}


export class ProductForEdit {
  id: number;
  name: string;
  next_batch_default: string;
}
