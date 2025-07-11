export type ImageItemType = {
  name: string;
  price: number;
  quantity: number;
  discount: number | null;
  type_id: number;
};

export type ImageScanType = {
  vendor: string;
  date: string;
  items: ImageItemType[];
  total: number;
  unrecognized_items: { name: String; price: number }[] | null;
};
