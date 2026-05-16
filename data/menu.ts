export type MenuCategory = {
  id: string;
  label: string;
  displayOrder: number;
};

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
  description?: string;
  isSoldOut: boolean;
  isRecommended: boolean;
  displayOrder: number;
};

export const menuCategories: MenuCategory[] = [
  {
    id: "recommend",
    label: "おすすめ",
    displayOrder: 1,
  },
  {
    id: "main",
    label: "メイン",
    displayOrder: 2,
  },
  {
    id: "side",
    label: "サイド",
    displayOrder: 3,
  },
  {
    id: "drink",
    label: "ドリンク",
    displayOrder: 4,
  },
];

export const menuItems: MenuItem[] = [
  {
    id: "today-recommend",
    name: "本日のおすすめ",
    price: 750,
    categoryId: "recommend",
    description:
      "店長おすすめの一品です。内容が気になる方はスタッフまでお尋ねください。",
    isSoldOut: false,
    isRecommended: true,
    displayOrder: 1,
  },
  {
    id: "otsumami-3set",
    name: "おつまみ3点セット",
    price: 500,
    categoryId: "recommend",
    imageUrl: "/menu/3ten.png",
    isSoldOut: false,
    isRecommended: true,
    displayOrder: 2,
  },
  {
    id: "karaage",
    name: "鶏のから揚げ",
    price: 600,
    categoryId: "main",
    imageUrl: "/menu/kara.png",
    isSoldOut: false,
    isRecommended: false,
    displayOrder: 1,
  },
  {
    id: "gyoza",
    name: "焼き餃子",
    price: 500,
    categoryId: "main",
    imageUrl: "/menu/gyo.png",
    isSoldOut: false,
    isRecommended: false,
    displayOrder: 2,
  },
  {
    id: "dashimaki",
    name: "だし巻き卵",
    price: 400,
    categoryId: "side",
    imageUrl: "/menu/dasi.png",
    isSoldOut: false,
    isRecommended: false,
    displayOrder: 1,
  },
  {
    id: "isobeage",
    name: "磯部揚げ",
    price: 400,
    categoryId: "side",
    imageUrl: "/menu/iso.png",
    isSoldOut: false,
    isRecommended: false,
    displayOrder: 2,
  },
  {
    id: "draft-beer",
    name: "生ビール",
    price: 500,
    categoryId: "drink",
    imageUrl: "/menu/nama.png",
    isSoldOut: false,
    isRecommended: false,
    displayOrder: 1,
  },
  {
    id: "jasmine-high",
    name: "ジャスミンハイ",
    price: 350,
    categoryId: "drink",
    imageUrl: "/menu/jj.png",
    isSoldOut: false,
    isRecommended: false,
    displayOrder: 2,
  },
];

export const menuCategoriesWithItems = menuCategories
  .sort((a, b) => a.displayOrder - b.displayOrder)
  .map((category) => ({
    ...category,
    items: menuItems
      .filter((item) => item.categoryId === category.id)
      .sort((a, b) => a.displayOrder - b.displayOrder),
  }));