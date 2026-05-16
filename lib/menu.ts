import { sql } from "@/lib/db";

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

export type MenuCategoryWithItems = MenuCategory & {
  items: MenuItem[];
};

type MenuCategoryRow = {
  id: string;
  label: string;
  display_order: number;
};

type MenuItemRow = {
  id: string;
  name: string;
  price: number;
  category_id: string;
  image_url: string | null;
  description: string | null;
  is_sold_out: boolean;
  is_recommended: boolean;
  display_order: number;
};

export async function getMenuCategoriesWithItems(): Promise<
  MenuCategoryWithItems[]
> {
  const categoryRows = await sql<MenuCategoryRow[]>`
    SELECT
      id,
      label,
      display_order
    FROM menu_categories
    ORDER BY display_order ASC;
  `;

  const itemRows = await sql<MenuItemRow[]>`
    SELECT
      id,
      name,
      price,
      category_id,
      image_url,
      description,
      is_sold_out,
      is_recommended,
      display_order
    FROM menu_items
    ORDER BY category_id ASC, display_order ASC;
  `;

  const categories: MenuCategory[] = categoryRows.map((category) => ({
    id: category.id,
    label: category.label,
    displayOrder: category.display_order,
  }));

  const items: MenuItem[] = itemRows.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    categoryId: item.category_id,
    imageUrl: item.image_url ?? undefined,
    description: item.description ?? undefined,
    isSoldOut: item.is_sold_out,
    isRecommended: item.is_recommended,
    displayOrder: item.display_order,
  }));

  return categories.map((category) => ({
    ...category,
    items: items
      .filter((item) => item.categoryId === category.id)
      .sort((a, b) => a.displayOrder - b.displayOrder),
  }));
}