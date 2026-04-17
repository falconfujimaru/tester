import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Calculator,
  Info,
  PieChart,
  Plus,
  Store,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import './App.css'

type CostItem = {
  id: string
  label: string
  amount: number
}

type Inputs = {
  name: string
  fixedCostItems: CostItem[]
  price: number
  variableCost: number
  targetProfit: number
  expectedUnits: number
}

let __idSeq = 0
const genId = () => {
  __idSeq += 1
  return `c-${Date.now().toString(36)}-${__idSeq}`
}

const makeItems = (items: { label: string; amount: number }[]): CostItem[] =>
  items.map((it) => ({ id: genId(), ...it }))

type Preset = { label: string; icon: string; values: Inputs }

const MARCHE_PRESET: Preset = {
  label: 'マルシェ・屋台',
  icon: '🏪',
  values: {
    name: '夏祭り マルシェ・屋台',
    fixedCostItems: makeItems([
      { label: '出店料', amount: 20000 },
      { label: '設営費(机・テント)', amount: 10000 },
      { label: '広告・チラシ', amount: 5000 },
      { label: '人件費', amount: 10000 },
      { label: '雑費', amount: 5000 },
    ]),
    price: 600,
    variableCost: 250,
    targetProfit: 30000,
    expectedUnits: 200,
  },
}

const PRESETS: Preset[] = [
  MARCHE_PRESET,
  {
    label: 'カフェ(月)',
    icon: '☕',
    values: {
      name: '小さなカフェ (1ヶ月)',
      fixedCostItems: makeItems([
        { label: '家賃', amount: 200000 },
        { label: '人件費', amount: 150000 },
        { label: '水道光熱費', amount: 40000 },
        { label: '広告・販促費', amount: 30000 },
        { label: '消耗品・雑費', amount: 30000 },
      ]),
      price: 550,
      variableCost: 180,
      targetProfit: 150000,
      expectedUnits: 1500,
    },
  },
  {
    label: '物販イベント',
    icon: '🛍️',
    values: {
      name: 'ハンドメイド物販',
      fixedCostItems: makeItems([
        { label: '出店料', amount: 10000 },
        { label: '設営費(什器・ディスプレイ)', amount: 3000 },
        { label: '広告費', amount: 2000 },
        { label: '雑費', amount: 5000 },
      ]),
      price: 1500,
      variableCost: 500,
      targetProfit: 10000,
      expectedUnits: 50,
    },
  },
  {
    label: 'ライブイベント',
    icon: '🎤',
    values: {
      name: '音楽ライブ (チケット制)',
      fixedCostItems: makeItems([
        { label: '会場費', amount: 70000 },
        { label: '機材費(音響・照明)', amount: 40000 },
        { label: '人件費(スタッフ)', amount: 20000 },
        { label: '広告費(SNS・チラシ)', amount: 15000 },
        { label: '雑費', amount: 5000 },
      ]),
      price: 3000,
      variableCost: 200,
      targetProfit: 50000,
      expectedUnits: 100,
    },
  },
  {
    label: 'リラクゼーション(月)',
    icon: '💆',
    values: {
      name: 'リラクゼーションサロン (1ヶ月)',
      fixedCostItems: makeItems([
        { label: '家賃', amount: 180000 },
        { label: '人件費', amount: 150000 },
        { label: '水道光熱費', amount: 25000 },
        { label: '広告・販促費', amount: 25000 },
        { label: '消耗品・雑費', amount: 20000 },
      ]),
      price: 6000,
      variableCost: 400,
      targetProfit: 150000,
      expectedUnits: 120,
    },
  },
  {
    label: '野外イベント',
    icon: '⛺',
    values: {
      name: '野外フェス出店',
      fixedCostItems: makeItems([
        { label: '会場費・出店料', amount: 30000 },
        { label: '設営費(テント・机・電源)', amount: 20000 },
        { label: '人件費', amount: 15000 },
        { label: '広告費', amount: 10000 },
        { label: '雑費', amount: 5000 },
      ]),
      price: 800,
      variableCost: 300,
      targetProfit: 40000,
      expectedUnits: 250,
    },
  },
]

const formatYen = (n: number) => {
  if (!Number.isFinite(n)) return '—'
  const sign = n < 0 ? '-' : ''
  const abs = Math.abs(Math.round(n))
  return `${sign}¥${abs.toLocaleString('ja-JP')}`
}

const formatUnits = (n: number) => {
  if (!Number.isFinite(n)) return '—'
  return `${Math.ceil(n).toLocaleString('ja-JP')} 個`
}

type NumberFieldProps = {
  label: string
  value: number
  onChange: (n: number) => void
  suffix?: string
  hint?: string
}

function NumberField({ label, value, onChange, suffix, hint }: NumberFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="mt-1 flex items-stretch rounded-lg border border-slate-300 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const v = e.target.value
            onChange(v === '' ? 0 : Number(v))
          }}
          className="w-full rounded-lg bg-transparent px-3 py-2 text-right text-base text-slate-900 outline-none"
        />
        {suffix && (
          <span className="flex items-center rounded-r-lg bg-slate-50 px-3 text-sm text-slate-500">
            {suffix}
          </span>
        )}
      </div>
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  )
}

type CostItemRowProps = {
  item: CostItem
  onChange: (item: CostItem) => void
  onDelete: () => void
  canDelete: boolean
}

function CostItemRow({ item, onChange, onDelete, canDelete }: CostItemRowProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={item.label}
        onChange={(e) => onChange({ ...item, label: e.target.value })}
        className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        placeholder="項目名 (例: 会場費)"
      />
      <div className="flex items-stretch rounded-lg border border-slate-300 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={Number.isFinite(item.amount) ? item.amount : 0}
          onChange={(e) => {
            const v = e.target.value
            onChange({ ...item, amount: v === '' ? 0 : Number(v) })
          }}
          className="w-28 rounded-l-lg bg-transparent px-2 py-1.5 text-right text-sm outline-none"
        />
        <span className="flex items-center rounded-r-lg bg-slate-50 px-2 text-xs text-slate-500">
          円
        </span>
      </div>
      <button
        type="button"
        onClick={onDelete}
        disabled={!canDelete}
        className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
        aria-label="削除"
        title="この項目を削除"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}

type StatCardProps = {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
  tone?: 'default' | 'good' | 'bad' | 'accent'
}

function StatCard({ icon, label, value, sub, tone = 'default' }: StatCardProps) {
  const toneClasses: Record<NonNullable<StatCardProps['tone']>, string> = {
    default: 'bg-white border-slate-200',
    good: 'bg-emerald-50 border-emerald-200',
    bad: 'bg-rose-50 border-rose-200',
    accent: 'bg-indigo-50 border-indigo-200',
  }
  const valueToneClasses: Record<NonNullable<StatCardProps['tone']>, string> = {
    default: 'text-slate-900',
    good: 'text-emerald-700',
    bad: 'text-rose-700',
    accent: 'text-indigo-700',
  }
  return (
    <div className={`flex flex-col gap-1 rounded-xl border p-4 shadow-sm ${toneClasses[tone]}`}>
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <span className="text-slate-500">{icon}</span>
        <span>{label}</span>
      </div>
      <div className={`text-2xl font-semibold tabular-nums ${valueToneClasses[tone]}`}>
        {value}
      </div>
      {sub && <div className="text-xs text-slate-500">{sub}</div>}
    </div>
  )
}

function App() {
  const [inputs, setInputs] = useState<Inputs>(() => ({
    ...MARCHE_PRESET.values,
    fixedCostItems: makeItems(
      MARCHE_PRESET.values.fixedCostItems.map((i) => ({ label: i.label, amount: i.amount })),
    ),
  }))

  const set = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    setInputs((prev) => ({ ...prev, [key]: value }))

  const applyPreset = (values: Inputs) =>
    setInputs({
      ...values,
      fixedCostItems: makeItems(
        values.fixedCostItems.map((i) => ({ label: i.label, amount: i.amount })),
      ),
    })

  const updateItem = (id: string, next: CostItem) =>
    setInputs((prev) => ({
      ...prev,
      fixedCostItems: prev.fixedCostItems.map((it) => (it.id === id ? next : it)),
    }))

  const deleteItem = (id: string) =>
    setInputs((prev) => ({
      ...prev,
      fixedCostItems: prev.fixedCostItems.filter((it) => it.id !== id),
    }))

  const addItem = () =>
    setInputs((prev) => ({
      ...prev,
      fixedCostItems: [...prev.fixedCostItems, { id: genId(), label: '', amount: 0 }],
    }))

  const {
    fixedCost,
    contributionMargin,
    contributionMarginRatio,
    breakEvenUnits,
    breakEvenRevenue,
    targetUnits,
    targetRevenue,
    expectedRevenue,
    expectedTotalCost,
    expectedProfit,
    isExpectedProfitable,
    chartData,
    xMax,
    invalid,
  } = useMemo(() => {
    const { fixedCostItems, price, variableCost, targetProfit, expectedUnits } = inputs
    const fixedCost = fixedCostItems.reduce(
      (sum, it) => sum + (Number.isFinite(it.amount) ? it.amount : 0),
      0,
    )
    const contributionMargin = price - variableCost
    const contributionMarginRatio = price > 0 ? contributionMargin / price : 0

    const validContribution = contributionMargin > 0
    const breakEvenUnits = validContribution ? fixedCost / contributionMargin : Infinity
    const breakEvenRevenue = validContribution ? breakEvenUnits * price : Infinity

    const targetUnits = validContribution
      ? (fixedCost + (targetProfit || 0)) / contributionMargin
      : Infinity
    const targetRevenue = validContribution ? targetUnits * price : Infinity

    const expectedRevenue = expectedUnits * price
    const expectedTotalCost = fixedCost + expectedUnits * variableCost
    const expectedProfit = expectedRevenue - expectedTotalCost
    const isExpectedProfitable = expectedProfit >= 0

    const maxCandidate = Math.max(
      breakEvenUnits === Infinity ? 0 : breakEvenUnits,
      targetUnits === Infinity ? 0 : targetUnits,
      expectedUnits,
      1,
    )
    const xMax = Math.max(Math.ceil(maxCandidate * 1.3), 10)

    const steps = 30
    const chartData = Array.from({ length: steps + 1 }, (_, i) => {
      const units = Math.round((xMax / steps) * i)
      const revenue = units * price
      const totalCost = fixedCost + units * variableCost
      return {
        units,
        売上高: revenue,
        総費用: totalCost,
        利益: revenue - totalCost,
      }
    })

    return {
      fixedCost,
      contributionMargin,
      contributionMarginRatio,
      breakEvenUnits,
      breakEvenRevenue,
      targetUnits,
      targetRevenue,
      expectedRevenue,
      expectedTotalCost,
      expectedProfit,
      isExpectedProfitable,
      chartData,
      xMax,
      invalid: !validContribution,
    }
  }, [inputs])

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-indigo-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
              <Calculator size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">損益分岐点シミュレーター</h1>
              <p className="text-sm text-slate-600">
                お店・イベントの売上で、どこまで売れば黒字になるかを可視化
              </p>
            </div>
          </div>
        </header>

        <div className="mb-6 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p.values)}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700"
              type="button"
            >
              <span>{p.icon}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <section className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Store size={18} className="text-indigo-600" />
                入力
              </h2>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">
                    シミュレーション名
                  </span>
                  <input
                    type="text"
                    value={inputs.name}
                    onChange={(e) => set('name', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    placeholder="例: 文化祭たこ焼き屋"
                  />
                </label>

                <div>
                  <div className="mb-2 flex items-end justify-between">
                    <div>
                      <span className="text-sm font-medium text-slate-700">
                        固定費の内訳
                      </span>
                      <p className="text-xs text-slate-500">
                        会場費・出店料・設営費・広告費・人件費・雑費など。自由に追加/削除できます。
                      </p>
                    </div>
                    <span className="whitespace-nowrap rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                      合計 {formatYen(fixedCost)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {inputs.fixedCostItems.map((item) => (
                      <CostItemRow
                        key={item.id}
                        item={item}
                        onChange={(next) => updateItem(item.id, next)}
                        onDelete={() => deleteItem(item.id)}
                        canDelete={inputs.fixedCostItems.length > 1}
                      />
                    ))}
                    {inputs.fixedCostItems.length === 0 && (
                      <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-center text-xs text-slate-500">
                        項目がありません。下のボタンから追加してください。
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={addItem}
                    className="mt-2 inline-flex items-center gap-1 rounded-lg border border-dashed border-indigo-300 bg-indigo-50/50 px-3 py-1.5 text-sm font-medium text-indigo-700 transition hover:border-indigo-400 hover:bg-indigo-50"
                  >
                    <Plus size={14} />
                    項目を追加
                  </button>
                </div>

                <NumberField
                  label="1個あたりの販売価格"
                  value={inputs.price}
                  onChange={(n) => set('price', n)}
                  suffix="円"
                  hint="商品やチケット1つあたりの売値"
                />
                <NumberField
                  label="1個あたりの変動費"
                  value={inputs.variableCost}
                  onChange={(n) => set('variableCost', n)}
                  suffix="円"
                  hint="材料費・原価など、売れた数に比例して発生する費用"
                />
                <NumberField
                  label="目標利益"
                  value={inputs.targetProfit}
                  onChange={(n) => set('targetProfit', n)}
                  suffix="円"
                  hint="達成したい利益額 (空欄なら0円でOK)"
                />
                <NumberField
                  label="想定販売個数"
                  value={inputs.expectedUnits}
                  onChange={(n) => set('expectedUnits', n)}
                  suffix="個"
                  hint="実際に売れそうな数。赤字/黒字のシミュレートに使います"
                />
              </div>
            </div>
          </section>

          <section className="lg:col-span-3">
            {invalid && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <Info size={18} className="mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="font-semibold">計算できません: </strong>
                  販売価格は変動費より大きい必要があります。
                  現状、1個売るたびに赤字が増える構造になっています。
                </div>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <StatCard
                tone="accent"
                icon={<Target size={16} />}
                label="損益分岐点 (販売個数)"
                value={invalid ? '—' : formatUnits(breakEvenUnits)}
                sub={invalid ? undefined : `ここを超えると黒字`}
              />
              <StatCard
                tone="accent"
                icon={<Calculator size={16} />}
                label="損益分岐点 (売上高)"
                value={invalid ? '—' : formatYen(breakEvenRevenue)}
              />
              <StatCard
                icon={<PieChart size={16} />}
                label="貢献利益 (1個あたり)"
                value={formatYen(contributionMargin)}
                sub={`粗利率 ${(contributionMarginRatio * 100).toFixed(1)}%`}
              />
              <StatCard
                icon={<Target size={16} />}
                label="目標利益 達成に必要な個数"
                value={invalid ? '—' : formatUnits(targetUnits)}
                sub={invalid ? undefined : `売上高 ${formatYen(targetRevenue)}`}
              />
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700">
                  想定販売個数 {inputs.expectedUnits.toLocaleString('ja-JP')} 個の場合
                </h3>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    isExpectedProfitable
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {isExpectedProfitable ? (
                    <>
                      <TrendingUp size={14} /> 黒字
                    </>
                  ) : (
                    <>
                      <TrendingDown size={14} /> 赤字
                    </>
                  )}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <StatCard
                  icon={<TrendingUp size={16} />}
                  label="予想売上高"
                  value={formatYen(expectedRevenue)}
                />
                <StatCard
                  icon={<TrendingDown size={16} />}
                  label="予想総費用"
                  value={formatYen(expectedTotalCost)}
                  sub={`固定費 ${formatYen(fixedCost)} + 変動費 ${formatYen(inputs.expectedUnits * inputs.variableCost)}`}
                />
                <StatCard
                  tone={isExpectedProfitable ? 'good' : 'bad'}
                  icon={isExpectedProfitable ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  label="予想利益"
                  value={formatYen(expectedProfit)}
                />
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-slate-700">
                売上高 vs 総費用 グラフ
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="units"
                      type="number"
                      domain={[0, xMax]}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      label={{
                        value: '販売個数',
                        position: 'insideBottom',
                        offset: -5,
                        fill: '#64748b',
                        fontSize: 12,
                      }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      tickFormatter={(v) => `¥${(v / 1000).toLocaleString()}k`}
                    />
                    <Tooltip
                      formatter={(value: number) => formatYen(value)}
                      labelFormatter={(label) => `${label} 個`}
                      contentStyle={{
                        borderRadius: 8,
                        border: '1px solid #e2e8f0',
                        fontSize: 12,
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line
                      type="monotone"
                      dataKey="売上高"
                      stroke="#6366f1"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="総費用"
                      stroke="#f43f5e"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                    {!invalid && breakEvenUnits <= xMax && (
                      <ReferenceLine
                        x={breakEvenUnits}
                        stroke="#10b981"
                        strokeDasharray="4 4"
                        label={{
                          value: '損益分岐点',
                          position: 'top',
                          fill: '#10b981',
                          fontSize: 11,
                        }}
                      />
                    )}
                    {!invalid && breakEvenUnits <= xMax && (
                      <ReferenceDot
                        x={breakEvenUnits}
                        y={breakEvenRevenue}
                        r={5}
                        fill="#10b981"
                        stroke="white"
                        strokeWidth={2}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                売上高と総費用の線が交わる点が損益分岐点です。それより右(たくさん売れる)ほど黒字になります。
              </p>
            </div>
          </section>
        </div>

        <footer className="mt-10 text-center text-xs text-slate-500">
          {inputs.name} — 損益分岐点シミュレーター
        </footer>
      </div>
    </div>
  )
}

export default App
