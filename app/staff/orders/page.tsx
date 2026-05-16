"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type OrderStatus = "unserved" | "served" | "cancelled";
type StatusFilter = OrderStatus | "all";

type StaffOrderItem = {
  id: string;
  menuItemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
};

type StaffOrder = {
  id: string;
  seatNumber: string;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  items: StaffOrderItem[];
};

const statusLabels: Record<OrderStatus, string> = {
  unserved: "未提供",
  served: "提供済み",
  cancelled: "取消済み",
};

const statusClassNames: Record<OrderStatus, string> = {
  unserved: "bg-orange-100 text-orange-700 border-orange-200",
  served: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-zinc-200 text-zinc-600 border-zinc-300",
};

const filterLabels: Record<StatusFilter, string> = {
  unserved: "未提供",
  served: "提供済み",
  cancelled: "取消済み",
  all: "全て",
};

const statusOptions: OrderStatus[] = ["unserved", "served", "cancelled"];
const filterOptions: StatusFilter[] = ["unserved", "served", "cancelled", "all"];

export default function StaffOrdersPage() {
  const [orders, setOrders] = useState<StaffOrder[]>([]);
  const [seatNumber, setSeatNumber] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("unserved");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchOrders = async (targetSeatNumber = seatNumber) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const query = targetSeatNumber.trim()
        ? `?seatNumber=${encodeURIComponent(targetSeatNumber.trim())}`
        : "";

      const response = await fetch(`/api/orders${query}`, {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "注文一覧の取得に失敗しました。");
      }

      setOrders(result.orders);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "注文一覧の取得に失敗しました。"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    setErrorMessage("");

    const previousOrders = orders;

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "ステータス更新に失敗しました。");
      }
    } catch (error) {
      setOrders(previousOrders);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "ステータス更新に失敗しました。"
      );
    }
  };

  useEffect(() => {
    fetchOrders("");
    // 初回表示時だけ全注文を取得する
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") {
      return orders;
    }

    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

  const summary = useMemo(() => {
    const targetOrders = filteredOrders.filter(
      (order) => order.status !== "cancelled"
    );

    const totalOrderCount = targetOrders.length;

    const totalItemCount = targetOrders.reduce(
      (sum, order) =>
        sum +
        order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0
    );

    const totalPrice = targetOrders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    return {
      totalOrderCount,
      totalItemCount,
      totalPrice,
    };
  }, [filteredOrders]);

  return (
    <main className="min-h-dvh bg-zinc-50 p-4">
      <div className="mx-auto max-w-5xl space-y-4">
        <header className="space-y-1">
          <p className="text-sm font-medium text-orange-700">Staff Console</p>
          <h1 className="text-2xl font-bold text-zinc-950">注文受信画面</h1>
          <p className="text-sm text-zinc-600">
            未提供の注文を中心に確認し、必要に応じて提供済み・取消済みへ変更できます。
          </p>
        </header>

        {/* ステータスフィルター */}
        <Card className="border-orange-100">
          <CardHeader>
            <CardTitle className="text-base">表示ステータス</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {filterOptions.map((filter) => (
                <Button
                  key={filter}
                  variant={statusFilter === filter ? "default" : "outline"}
                  className={
                    statusFilter === filter
                      ? "bg-orange-500 font-bold text-white hover:bg-orange-600"
                      : "border-orange-300 bg-white"
                  }
                  onClick={() => setStatusFilter(filter)}
                >
                  {filterLabels[filter]}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 座席番号検索・会計集計 */}
        <Card className="border-orange-100">
          <CardHeader>
            <CardTitle className="text-base">座席番号で確認</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <input
                value={seatNumber}
                onChange={(event) => setSeatNumber(event.target.value)}
                placeholder="例：1"
                className="h-10 flex-1 rounded-xl border border-orange-200 px-3 text-sm outline-none focus:border-orange-500"
              />

              <Button
                className="bg-orange-500 font-bold text-white hover:bg-orange-600"
                onClick={() => fetchOrders(seatNumber)}
                disabled={isLoading}
              >
                検索
              </Button>

              <Button
                variant="outline"
                className="border-orange-300"
                onClick={() => {
                  setSeatNumber("");
                  fetchOrders("");
                }}
                disabled={isLoading}
              >
                全件
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-2xl bg-orange-50 p-3">
                <p className="text-xs text-zinc-500">注文件数</p>
                <p className="mt-1 text-lg font-bold text-zinc-950">
                  {summary.totalOrderCount}件
                </p>
              </div>

              <div className="rounded-2xl bg-orange-50 p-3">
                <p className="text-xs text-zinc-500">商品点数</p>
                <p className="mt-1 text-lg font-bold text-zinc-950">
                  {summary.totalItemCount}点
                </p>
              </div>

              <div className="rounded-2xl bg-orange-50 p-3">
                <p className="text-xs text-zinc-500">合計金額</p>
                <p className="mt-1 text-lg font-bold text-zinc-950">
                  ¥{summary.totalPrice.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-950">受信注文一覧</h2>
            <p className="text-sm text-zinc-500">
              現在の表示：{filterLabels[statusFilter]}
            </p>
          </div>

          <Button
            variant="outline"
            className="gap-2 border-orange-300"
            onClick={() => fetchOrders()}
            disabled={isLoading}
          >
            <RefreshCcw className="h-4 w-4" />
            更新
          </Button>
        </div>

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-2xl bg-white p-6 text-sm text-zinc-600">
            読み込み中です。
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-sm text-zinc-600">
            表示できる注文がありません。
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="border-orange-100">
                <CardHeader className="space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg">
                        座席 {order.seatNumber}
                      </CardTitle>
                      <p className="mt-1 text-xs text-zinc-500">
                        注文時刻：
                        {new Date(order.createdAt).toLocaleString("ja-JP")}
                      </p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${statusClassNames[order.status]}`}
                      >
                        {statusLabels[order.status]}
                      </span>

                      <p className="mt-2 text-lg font-bold text-zinc-950">
                        ¥{order.totalPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-2"
                      >
                        <div>
                          <p className="text-sm font-bold text-zinc-950">
                            {item.name}
                          </p>
                          <p className="text-xs text-zinc-500">
                            ¥{item.unitPrice.toLocaleString()} ×{" "}
                            {item.quantity}
                          </p>
                        </div>

                        <p className="text-sm font-bold text-zinc-950">
                          ¥{item.subtotal.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {statusOptions.map((status) => (
                      <Button
                        key={status}
                        variant={order.status === status ? "default" : "outline"}
                        className={
                          order.status === status
                            ? "bg-orange-500 font-bold text-white hover:bg-orange-600"
                            : "border-orange-300 bg-white"
                        }
                        onClick={() => updateOrderStatus(order.id, status)}
                      >
                        {statusLabels[status]}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}