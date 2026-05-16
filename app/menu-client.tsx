"use client";

import Image from "next/image";
import { useState } from "react";
import { Bell, Menu, ShoppingCart, X } from "lucide-react";

import type { MenuCategoryWithItems } from "@/lib/menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type MenuClientProps = {
  categories: MenuCategoryWithItems[];
};

type MenuItemForOrder = {
  id: string;
  name: string;
  price: number;
  isSoldOut: boolean;
};

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

const calculateTotalPrice = (orderItems: OrderItem[]) => {
  return orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
};

const calculateSplitPrice = (totalPrice: number, splitCount: number) => {
  if (!Number.isFinite(splitCount) || splitCount <= 0) {
    return null;
  }

  return Math.ceil(totalPrice / splitCount);
};

export function MenuClient({ categories }: MenuClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOrderListOpen, setIsOrderListOpen] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [splitCount, setSplitCount] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const totalPrice = calculateTotalPrice(orderItems);
  const splitPrice = calculateSplitPrice(totalPrice, splitCount);

  const scrollToCategory = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setIsSidebarOpen(false);
  };

  const handleAddItem = (item: MenuItemForOrder) => {
    if (item.isSoldOut) {
      setErrorMessage("この商品は品切れのため追加できません。");
      return;
    }

    setErrorMessage("");

    setOrderItems((currentItems) => {
      const existingItem = currentItems.find(
        (orderItem) => orderItem.id === item.id
      );

      if (existingItem) {
        return currentItems.map((orderItem) =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        );
      }

      return [
        ...currentItems,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ];
    });
  };

  const handleIncreaseQuantity = (item: MenuItemForOrder) => {
    handleAddItem(item);
  };

  const handleDecreaseQuantity = (id: string) => {
    setErrorMessage("");

    setOrderItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const getOrderQuantity = (id: string) => {
    return orderItems.find((orderItem) => orderItem.id === id)?.quantity ?? 0;
  };

  const handleSubmitOrder = async () => {
    if (orderItems.length === 0) {
        setErrorMessage("注文リストに商品がありません。");
        return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
        const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            items: orderItems,
        }),
        });

        const result = await response.json();

        if (!response.ok) {
        throw new Error(result.message ?? "注文の送信に失敗しました。");
        }

        setSuccessMessage("注文を受け付けました。");
        setOrderItems([]);
        setIsOrderListOpen(false);
    } catch (error) {
        setErrorMessage(
        error instanceof Error
            ? error.message
            : "注文の送信に失敗しました。"
        );
    } finally {
        setIsSubmitting(false);
    }
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
              onClick={() => setIsOrderListOpen(true)}
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

      {/* エラーメッセージ */}
      {errorMessage && (
        <div className="fixed left-0 right-0 top-16 z-40 mx-auto max-w-[390px] px-4">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm">
            {errorMessage}
          </div>
        </div>
      )}

      {successMessage && (
        <div className="fixed left-0 right-0 top-16 z-40 mx-auto max-w-[390px] px-4">
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 shadow-sm">
            {successMessage}
            </div>
        </div>
      )}

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

      {/* 注文リストパネル */}
      {isOrderListOpen && (
        <div className="fixed inset-0 z-50">
          <button
            className="absolute inset-0 bg-black/40"
            aria-label="注文リストを閉じる"
            onClick={() => setIsOrderListOpen(false)}
          />

          <section className="absolute bottom-0 left-0 right-0 mx-auto max-h-[80dvh] max-w-[390px] overflow-y-auto rounded-t-3xl bg-white p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700">Order List</p>
                <h2 className="text-xl font-bold text-zinc-950">
                  注文リスト
                </h2>
              </div>

              <Button
                variant="ghost"
                size="icon"
                aria-label="注文リストを閉じる"
                onClick={() => setIsOrderListOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {orderItems.length === 0 ? (
              <div className="rounded-2xl bg-orange-50 p-4 text-sm text-zinc-600">
                まだ商品が追加されていません。
              </div>
            ) : (
              <div className="space-y-3">
                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-orange-100 bg-orange-50 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-zinc-950">
                          {item.name}
                        </p>
                        <p className="mt-1 text-sm text-zinc-600">
                          ¥{item.price.toLocaleString()} × {item.quantity}
                        </p>
                      </div>

                      <p className="text-sm font-bold text-zinc-950">
                        ¥{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <Button
                        variant="outline"
                        className="h-8 w-8 rounded-full border-orange-300 p-0"
                        onClick={() => handleDecreaseQuantity(item.id)}
                      >
                        −
                      </Button>

                      <span className="w-8 text-center text-sm font-bold">
                        {item.quantity}
                      </span>

                      <Button
                        variant="outline"
                        className="h-8 w-8 rounded-full border-orange-300 p-0"
                        onClick={() =>
                          handleIncreaseQuantity({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            isSoldOut: false,
                          })
                        }
                      >
                        ＋
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="mt-4 rounded-2xl border border-orange-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-zinc-600">
                      合計金額
                    </p>
                    <p className="text-xl font-bold text-zinc-950">
                      ¥{totalPrice.toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-4">
                    <label
                      htmlFor="split-count"
                      className="text-sm font-medium text-zinc-700"
                    >
                      割り勘人数
                    </label>

                    <div className="mt-2 flex items-center gap-2">
                      <input
                        id="split-count"
                        type="number"
                        min={1}
                        value={splitCount}
                        onChange={(event) =>
                          setSplitCount(Number(event.target.value))
                        }
                        className="h-10 w-24 rounded-xl border border-orange-200 px-3 text-sm outline-none focus:border-orange-500"
                      />
                      <span className="text-sm text-zinc-600">人</span>
                    </div>

                    <div className="mt-3 rounded-xl bg-orange-50 p-3">
                      <p className="text-sm text-zinc-600">1人あたり</p>
                      <p className="mt-1 text-lg font-bold text-orange-700">
                        {splitPrice === null
                          ? "人数を入力してください"
                          : `¥${splitPrice.toLocaleString()}`}
                      </p>
                    </div>

                    <Button
                      className="mt-4 h-12 w-full bg-orange-500 text-base font-bold text-white hover:bg-orange-600 disabled:bg-zinc-300"
                      disabled={isSubmitting || orderItems.length === 0}
                      onClick={handleSubmitOrder}
                    >
                      {isSubmitting ? "送信中..." : "注文を確定する"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </section>
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
                {category.items.map((item) => {
                  const quantity = getOrderQuantity(item.id);

                  return (
                    <Card
                      key={item.id}
                      className="overflow-hidden rounded-2xl border-orange-100 bg-white shadow-sm"
                    >
                      <div className="relative">
                        {item.imageUrl ? (
                          <div className="relative aspect-[5/4] w-full bg-orange-100">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              sizes="180px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex aspect-[5/4] w-full items-center justify-center bg-gradient-to-br from-orange-500 to-amber-600 p-3 text-center text-white">
                            <div>
                              <p className="text-xs opacity-90">
                                店長おすすめ
                              </p>
                              <p className="mt-1 text-sm font-bold leading-5">
                                詳細はスタッフまで
                              </p>
                            </div>
                          </div>
                        )}

                        {item.isSoldOut && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-zinc-900">
                              売り切れ
                            </span>
                          </div>
                        )}
                      </div>

                      <CardHeader className="px-3 pb-1 pt-2">
                        <CardTitle className="line-clamp-2 text-sm font-bold leading-5">
                          {item.name}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-1.5 px-3 pb-2 pt-0">
                        <p className="text-sm font-bold leading-none text-zinc-950">
                          ¥{item.price.toLocaleString()}
                        </p>

                        {quantity > 0 ? (
                          <div className="flex h-8 items-center justify-between rounded-md border border-orange-300 bg-orange-50">
                            <Button
                              variant="ghost"
                              className="h-8 w-10 rounded-none text-base font-bold text-orange-700 hover:bg-orange-100"
                              onClick={() => handleDecreaseQuantity(item.id)}
                            >
                              −
                            </Button>

                            <span className="text-sm font-bold text-zinc-950">
                              {quantity}
                            </span>

                            <Button
                              variant="ghost"
                              className="h-8 w-10 rounded-none text-base font-bold text-orange-700 hover:bg-orange-100"
                              onClick={() => handleIncreaseQuantity(item)}
                            >
                              ＋
                            </Button>
                          </div>
                        ) : (
                          <Button
                            className="h-8 w-full bg-orange-500 text-sm font-bold text-white hover:bg-orange-600 disabled:bg-zinc-300"
                            onClick={() => handleAddItem(item)}
                          >
                            {item.isSoldOut ? "売り切れ" : "追加"}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* 下部固定ボタン */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-orange-200 bg-white p-3">
        <div className="mx-auto max-w-[390px] px-1">
          <Button
            className="h-12 w-full bg-orange-500 text-base font-bold text-white hover:bg-orange-600"
            onClick={() => setIsOrderListOpen(true)}
          >
            注文リストを見る
          </Button>
        </div>
      </div>
    </main>
  );
}