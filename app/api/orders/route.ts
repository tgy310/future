import { NextResponse } from "next/server";

import { sql } from "@/lib/db";

type OrderRequestItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type OrderRequestBody = {
  seatNumber: string;
  items: OrderRequestItem[];
};

type OrderRow = {
  id: string;
  seat_number: string;
  total_price: number;
  status: string;
  created_at: string;
};

type OrderItemRow = {
  id: string;
  order_id: string;
  menu_item_id: string;
  menu_item_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const seatNumber = searchParams.get("seatNumber");

    const orderRows = seatNumber
      ? ((await sql`
          SELECT
            id,
            seat_number,
            total_price,
            status,
            created_at
          FROM orders
          WHERE seat_number = ${seatNumber}
          ORDER BY created_at DESC
          LIMIT 50;
        `) as OrderRow[])
      : ((await sql`
          SELECT
            id,
            seat_number,
            total_price,
            status,
            created_at
          FROM orders
          ORDER BY created_at DESC
          LIMIT 50;
        `) as OrderRow[]);

    const orderIds = orderRows.map((order) => order.id);

    if (orderIds.length === 0) {
      return NextResponse.json({
        orders: [],
      });
    }

    const itemRows = (await sql`
      SELECT
        id,
        order_id,
        menu_item_id,
        menu_item_name,
        unit_price,
        quantity,
        subtotal
      FROM order_items
      WHERE order_id = ANY(${orderIds})
      ORDER BY created_at ASC;
    `) as OrderItemRow[];

    const orders = orderRows.map((order) => ({
      id: order.id,
      seatNumber: order.seat_number,
      totalPrice: order.total_price,
      status: order.status,
      createdAt: order.created_at,
      items: itemRows
        .filter((item) => item.order_id === order.id)
        .map((item) => ({
          id: item.id,
          menuItemId: item.menu_item_id,
          name: item.menu_item_name,
          unitPrice: item.unit_price,
          quantity: item.quantity,
          subtotal: item.subtotal,
        })),
    }));

    return NextResponse.json({
      orders,
    });
  } catch (error) {
    console.error("注文一覧取得エラー:", error);

    return NextResponse.json(
      { message: "注文一覧の取得に失敗しました。" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderRequestBody;

    if (
      typeof body.seatNumber !== "string" ||
      body.seatNumber.trim().length === 0
    ) {
      return NextResponse.json(
        { message: "座席番号を取得できませんでした。" },
        { status: 400 }
      );
    }

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
      INSERT INTO orders (
        seat_number,
        total_price,
        status
      )
      VALUES (
        ${body.seatNumber.trim()},
        ${totalPrice},
        'unserved'
      )
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
        seatNumber: order.seat_number,
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