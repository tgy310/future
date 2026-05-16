import { NextResponse } from "next/server";

import { sql } from "@/lib/db";

type OrderRequestItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type OrderRequestBody = {
  items: OrderRequestItem[];
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderRequestBody;

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { message: "注文商品がありません。" },
        { status: 400 }
      );
    }

    for (const item of body.items) {
      if (
        typeof item.id !== "string" ||
        typeof item.name !== "string" ||
        typeof item.price !== "number" ||
        typeof item.quantity !== "number" ||
        item.price <= 0 ||
        item.quantity <= 0 ||
        !Number.isInteger(item.quantity)
      ) {
        return NextResponse.json(
          { message: "注文データの形式が正しくありません。" },
          { status: 400 }
        );
      }
    }

    const totalPrice = body.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const orderRows = (await sql`
      INSERT INTO orders (total_price, status)
      VALUES (${totalPrice}, 'pending')
      RETURNING id, total_price, status, created_at;
    `) as {
      id: string;
      total_price: number;
      status: string;
      created_at: string;
    }[];

    const order = orderRows[0];

    for (const item of body.items) {
      await sql`
        INSERT INTO order_items (
          order_id,
          menu_item_id,
          menu_item_name,
          unit_price,
          quantity,
          subtotal
        )
        VALUES (
          ${order.id},
          ${item.id},
          ${item.name},
          ${item.price},
          ${item.quantity},
          ${item.price * item.quantity}
        );
      `;
    }

    return NextResponse.json({
      message: "注文を保存しました。",
      order: {
        id: order.id,
        totalPrice: order.total_price,
        status: order.status,
        createdAt: order.created_at,
      },
    });
  } catch (error) {
    console.error("注文保存エラー:", error);

    return NextResponse.json(
      { message: "注文の保存に失敗しました。" },
      { status: 500 }
    );
  }
}