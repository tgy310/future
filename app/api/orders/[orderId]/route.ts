import { NextResponse } from "next/server";

import { sql } from "@/lib/db";

const allowedStatuses = ["unserved", "served", "cancelled"] as const;

type OrderStatus = (typeof allowedStatuses)[number];

type UpdateOrderStatusBody = {
  status: OrderStatus;
};

type RouteParams = {
  params: Promise<{
    orderId: string;
  }>;
};

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { orderId } = await params;
    const body = (await request.json()) as UpdateOrderStatusBody;

    if (!allowedStatuses.includes(body.status)) {
      return NextResponse.json(
        { message: "指定されたステータスが正しくありません。" },
        { status: 400 }
      );
    }

    const orderRows = (await sql`
      UPDATE orders
      SET status = ${body.status}
      WHERE id = ${orderId}
      RETURNING
        id,
        seat_number,
        total_price,
        status,
        created_at;
    `) as {
      id: string;
      seat_number: string;
      total_price: number;
      status: string;
      created_at: string;
    }[];

    if (orderRows.length === 0) {
      return NextResponse.json(
        { message: "対象の注文が見つかりません。" },
        { status: 404 }
      );
    }

    const order = orderRows[0];

    return NextResponse.json({
      message: "注文ステータスを更新しました。",
      order: {
        id: order.id,
        seatNumber: order.seat_number,
        totalPrice: order.total_price,
        status: order.status,
        createdAt: order.created_at,
      },
    });
  } catch (error) {
    console.error("注文ステータス更新エラー:", error);

    return NextResponse.json(
      { message: "注文ステータスの更新に失敗しました。" },
      { status: 500 }
    );
  }
}