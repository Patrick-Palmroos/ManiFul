export type ImageItemType = {
  name: string;
  price: number;
  category: string;
};

export type ImageScanType = {
  vendor: string;
  date: string;
  items: ImageItemType[];
  total: number;
  unrecognized_items: { name: String; price: number }[] | null;
};
