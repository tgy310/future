"use client";

import Image from "next/image";
import { useState } from "react";
import { Bell, Menu, ShoppingCart, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type MenuItem = {
  name: string;
  price: number;
  description?: string;
  image?: string;
};

type Category = {
  id: string;
  label: string;
  items: MenuItem[];
};

const categories: Category[] = [
  {
    id: "recommend",
    label: "おすすめ",
    items: [
      {
        name: "本日のおすすめ",
        price: 750,
        description:
          "店長おすすめの一品です。内容が気になる方はスタッフまでお尋ねください。",
      },
      {
        name: "おつまみ3点セット",
        price: 500,
        image: "/menu/3ten.png",
      },
    ],
  },
  {
    id: "main",
    label: "メイン",
    items: [
      {
        name: "鶏のから揚げ",
        price: 600,
        image: "/menu/kara.png",
      },
      {
        name: "焼き餃子",
        price: 500,
        image: "/menu/gyo.png",
      },
    ],
  },
  {
    id: "side",
    label: "サイド",
    items: [
      {
        name: "だし巻き卵",
        price: 400,
        image: "/menu/dasi.png",
      },
      {
        name: "磯部揚げ",
        price: 400,
        image: "/menu/iso.png",
      },
    ],
  },
  {
    id: "drink",
    label: "ドリンク",
    items: [
      {
        name: "生ビール",
        price: 500,
        image: "/menu/nama.png",
      },
      {
        name: "ジャスミンハイ",
        price: 350,
        image: "/menu/jj.png",
      },
    ],
  },
];

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const scrollToCategory = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setIsSidebarOpen(false);
  };

  return (
    <main className="min-h-dvh bg-orange-50">
      {/* ヘッダー */}
      <header className="sticky top-0 z-30 border-b border-orange-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-12 max-w-[390px] items-center justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            aria-label="カテゴリメニューを開く"
            onClick={() => setIsSidebarOpen(true)}
            className="text-zinc-900"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <h1 className="text-base font-bold tracking-wide text-zinc-950">
            OSAKI 亭
          </h1>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="従業員を呼ぶ"
              className="text-zinc-900"
            >
              <Bell className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              aria-label="注文リストを見る"
              className="text-zinc-900"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* 横スクロールカテゴリタブ */}
        <nav className="mx-auto flex max-w-[390px] gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="outline"
              size="sm"
              className="h-9 shrink-0 rounded-full border-orange-300 bg-orange-50 px-4 text-zinc-900 hover:bg-orange-100"
              onClick={() => scrollToCategory(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </nav>
      </header>

      {/* サイドバー */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40">
          <button
            className="absolute inset-0 bg-black/40"
            aria-label="サイドバーを閉じる"
            onClick={() => setIsSidebarOpen(false)}
          />

          <aside className="relative h-full w-72 bg-orange-50 p-4 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700">カテゴリ</p>
                <h2 className="text-lg font-bold text-zinc-900">
                  メニュー一覧
                </h2>
              </div>

              <Button
                variant="ghost"
                size="icon"
                aria-label="サイドバーを閉じる"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="ghost"
                  className="w-full justify-start rounded-xl text-base hover:bg-orange-100"
                  onClick={() => scrollToCategory(category.id)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </aside>
        </div>
      )}

      {/* コンテンツ */}
      <div className="mx-auto max-w-[390px] px-4 pb-24 pt-4">
        <div className="space-y-7">
          {categories.map((category) => (
            <section
              key={category.id}
              id={category.id}
              className="scroll-mt-28"
            >
              <div className="mb-3">
                <p className="text-xs font-medium text-orange-700">Category</p>
                <h2 className="text-xl font-bold text-zinc-950">
                  {category.label}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {category.items.map((item) => (
                  <Card
                    key={item.name}
                    className="overflow-hidden rounded-2xl border-orange-100 bg-white shadow-sm"
                  >
                    {item.image ? (
                      <div className="relative aspect-[5/4] w-full bg-orange-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="180px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-[5/4] w-full items-center justify-center bg-gradient-to-br from-orange-500 to-amber-600 p-3 text-center text-white">
                        <div>
                          <p className="text-xs opacity-90">店長おすすめ</p>
                          <p className="mt-1 text-sm font-bold leading-5">
                            詳細はスタッフまで
                          </p>
                        </div>
                      </div>
                    )}

                    <CardHeader className="px-3 pb-1 pt-2">
                      <CardTitle className="line-clamp-2 text-sm font-bold leading-5">
                        {item.name}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-1.5 px-3 pb-2 pt-0">
                      <p className="text-sm font-bold leading-none text-zinc-950">
                        ¥{item.price.toLocaleString()}
                      </p>

                      <Button className="h-8 w-full bg-orange-500 text-sm font-bold text-white hover:bg-orange-600">
                        追加
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}