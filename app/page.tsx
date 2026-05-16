import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
  <main className="min-h-screen bg-zinc-50">
    <div className="mx-auto max-w-sm px-4 pb-28 pt-4">
      {/* ヘッダー */}
      <header className="mb-5">
        <p className="text-sm text-zinc-500">スマホ注文システム</p>
        <h1 className="text-2xl font-bold text-zinc-900">OSAKI 亭</h1>
        <p className="mt-1 text-sm text-zinc-600">
          お席からそのままご注文いただけます。
        </p>
      </header>

      {/* メニューエリア */}
      <section className="space-y-4">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>おすすめメニュー</CardTitle>
            <CardDescription>
              人気の商品をここに表示します。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-zinc-900">
                    本日のおすすめ
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    料理名や価格の詳細は後で実装します。
                  </p>
                </div>
                <Button size="sm">追加</Button>
              </div>
            </div>

            <div className="rounded-xl border bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-zinc-900">
                    ドリンク
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    カテゴリごとのメニュー表示を想定しています。
                  </p>
                </div>
                <Button size="sm">追加</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 注文メモ / 検索欄 */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>メニュー検索</CardTitle>
            <CardDescription>
              商品名やカテゴリで探せる想定です。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input placeholder="例：カレー、ドリンク、デザート" />
          </CardContent>
        </Card>
      </section>
    </div>

    {/* 下部固定ボタン */}
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4">
      <div className="mx-auto max-w-sm">
        <Button className="h-12 w-full text-base">
          注文リストを見る
        </Button>
      </div>
    </div>
  </main>
);
}
