import { MenuClient } from "./menu-client";
import { getMenuCategoriesWithItems } from "@/lib/menu";

export const revalidate = 60;

export default async function Home() {
  const categories = await getMenuCategoriesWithItems();

  return <MenuClient categories={categories} />;
}