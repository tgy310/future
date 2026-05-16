"use client";

import { useState } from "react";
import { Bell, Menu, ShoppingCart, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const categories = [
  {
    id: "recommend",
    label: "おすすめ",
    items: [
      {
        name: "本日のおすすめ",
        description: "季節の食材を使った人気メニューです。",
      },
      {
        name: "OSAKI 亭セット",
        description: "初めての方におすすめの定番セットです。",
      },
    ],
  },
  {
    id: "main",
    label: "メイン",
    items: [
      {
        name: "定食メニュー",
        description: "ご飯・味噌汁付きの満足メニューです。",
      },
      {
        name: "丼メニュー",
        description: "手軽に食べられる人気の一品です。",
      },
    ],
  },
  {
    id: "side",
    label: "サイド",
    items: [
      {
        name: "揚げ物",
        description: "シェアしやすいサイドメニューです。",
      },
      {
        name: "サラダ",
        description: "食事に合わせやすい軽めの一品です。",
      },
    ],
  },
  {
    id: "drink",
    label: "ドリンク",
    items: [
      {
        name: "ソフトドリンク",
        description: "お食事と一緒にどうぞ。",
      },
      {
        name: "温かい飲み物",
        description: "食後にもおすすめです。",
      },
    ],
  },
  {
    id: "dessert",
    label: "デザート",
    items: [
      {
        name: "本日の甘味",
        description: "食後に楽しめるデザートです。",
      },
      {
        name: "アイス",
        description: "さっぱりした定番デザートです。",
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
    <main className="min-h-dvh bg-zinc-50">
      {/* ヘッダー */}
      <header className="sticky top-0 z-30 border-b bg-white">
        <div className="mx-auto flex h-12 max-w-[390px] items-center justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            aria-label="カテゴリメニューを開く"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <h1 className="text-base font-bold tracking-wide text-zinc-900">
            OSAKI 亭
          </h1>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" aria-label="従業員を呼ぶ">
              <Bell className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" aria-label="注文リストを見る">
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
              className="h-9 shrink-0 rounded-full px-4"
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

          <aside className="relative h-full w-72 bg-white p-4 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">カテゴリ</p>
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
                  className="w-full justify-start text-base"
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
                <p className="text-xs font-medium text-zinc-500">Category</p>
                <h2 className="text-xl font-bold text-zinc-900">
                  {category.label}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {category.items.map((item) => (
                  <Card
                    key={item.name}
                    className="flex min-h-40 flex-col justify-between rounded-2xl shadow-sm"
                  >
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base leading-6">
                        {item.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-3 text-xs leading-5">
                        {item.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="p-4 pt-0">
                      <Button className="h-10 w-full">追加</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* 下部固定ボタン */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t bg-white p-3">
        <div className="mx-auto max-w-[390px] px-1">
          <Button className="h-12 w-full text-base">注文リストを見る</Button>
        </div>
      </div>
    </main>
  );
}