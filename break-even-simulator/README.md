# 損益分岐点シミュレーター (Break-Even Simulator)

お店やイベントの売上で「どこまで売れば黒字になるか」を計算・可視化する Vite + React + TypeScript のシングルページアプリです。

🔗 デプロイURL: https://break-even-calculator-app-zlhg4c5t.devinapps.com

## 機能

- **入力項目**: シミュレーション名 / 固定費 / 1個あたりの販売価格 / 1個あたりの変動費 / 目標利益 / 想定販売個数
- **出力**:
  - 損益分岐点 (販売個数・売上高)
  - 貢献利益 (1個あたり) と粗利率
  - 目標利益を達成するために必要な販売個数
  - 想定販売個数での予想利益 (赤字/黒字バッジ付き)
- **グラフ**: 売上高と総費用の線を描画し、交点 (= 損益分岐点) にマーカー表示
- **プリセット**: 焼きそば屋台 / カフェ / 物販イベント / ライブイベント

## 開発

```bash
npm install
npm run dev       # 開発サーバー (http://localhost:5173)
npm run lint      # ESLint
npm run build     # 本番ビルド (dist/)
npm run preview   # ビルド結果のプレビュー
```

## スタック

- Vite 6
- React 18 + TypeScript
- Tailwind CSS
- Recharts (グラフ)
- lucide-react (アイコン)
