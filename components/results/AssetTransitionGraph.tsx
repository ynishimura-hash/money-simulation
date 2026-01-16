import React from 'react';
import { YearlyCashFlow } from '@/lib/types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
    data: YearlyCashFlow[];
}

const formatYAxis = (tick: number) => {
    return (tick / 10000) + '万';
};

export default function AssetTransitionGraph({ data }: Props) {
    return (
        <div className="h-80 w-full bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <h4 className="text-sm font-bold text-slate-500 mb-4 text-center">資産の推移 (名目額)</h4>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <defs>
                        <linearGradient id="colorInvest" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#64748B" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#64748B" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="age" tick={{ fontSize: 10 }} />
                    <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 10 }} />
                    <Tooltip
                        formatter={(value: number | undefined) => value !== undefined ? new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(value) : ''}
                        labelFormatter={(v) => `${v}歳`}
                    />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                    <Area type="monotone" dataKey="investmentAssets" name="投資資産" stackId="1" stroke="#3B82F6" fill="url(#colorInvest)" />
                    <Area type="monotone" dataKey="cashAssets" name="現金" stackId="1" stroke="#64748B" fill="url(#colorCash)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
