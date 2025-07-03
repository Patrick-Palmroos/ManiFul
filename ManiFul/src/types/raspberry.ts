export type ImageItemType = {
  name: String;
  price: number;
  category: String;
};

export type ImageScanType = {
  vendor: String;
  date: String;
  items: ImageItemType[];
  total: number;
  unrecognized_items: { name: String; price: number }[] | null;
};
