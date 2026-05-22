'use client'

import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { formatBRL } from '@/lib/formatters'

interface DataPoint {
  month: number
  accumulated: number
  withInterest: number
}

interface SavingsChartProps {
  data: DataPoint[]
  target: number
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number }[]; label?: number }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-xl border border-stone-100 shadow-sm p-3 text-xs space-y-1">
      <p className="font-medium text-stone-600">Mês {label}</p>
      {payload.map((p) => (
        <p key={p.name} className="tabular-nums">
          {p.name}: <span className="font-bold">{formatBRL(p.value)}</span>
        </p>
      ))}
    </div>
  )
}

export function SavingsChart({ data, target }: SavingsChartProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-5">
      <p className="text-sm font-medium text-stone-600 mb-4">Evolução da poupança</p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#a8a29e' }}
            tickFormatter={(v) => `${v}m`}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#a8a29e' }}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            width={36}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span className="text-xs text-stone-500">{value}</span>
            )}
          />
          <ReferenceLine
            y={target}
            stroke="#e8a838"
            strokeDasharray="4 4"
            label={{ value: 'Meta', position: 'right', fontSize: 11, fill: '#e8a838' }}
          />
          <Line
            type="monotone"
            dataKey="accumulated"
            name="Sem investir"
            stroke="#9ca3af"
            strokeDasharray="4 4"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="withInterest"
            name="Investindo na Selic"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
