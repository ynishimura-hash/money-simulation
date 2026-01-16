import React from 'react';
import { Assets, SimulationConfig } from '@/lib/types';
import { Landmark, Settings, TrendingUp } from 'lucide-react';
import MoneyInput from '../MoneyInput';
import PercentageInput from '../PercentageInput';

interface Props {
    assets: Assets;
    config: SimulationConfig;
    onAssetsChange: (a: Assets) => void;
    onConfigChange: (c: SimulationConfig) => void;
}

export default function AssetsConfigForm({ assets, config, onAssetsChange, onConfigChange }: Props) {
    const handleAsset = (key: keyof Assets, val: any) => onAssetsChange({ ...assets, [key]: val });
    const handleConfig = (key: keyof SimulationConfig, val: any) => onConfigChange({ ...config, [key]: val });

    return (
        <div className="space-y-6">
            {/* Assets */}
            <div className="space-y-3">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                    <Landmark className="text-blue-600" /> 現在の資産
                </h3>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-700">預金 (キャッシュ)</label>
                        <MoneyInput
                            className="w-full p-2 rounded border border-blue-200 text-sm text-slate-900 font-medium"
                            value={assets.cashSavings}
                            onChange={(val) => handleAsset('cashSavings', val)}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-700">投資済み資産 (時価)</label>
                        <MoneyInput
                            className="w-full p-2 rounded border border-blue-200 text-sm text-slate-900 font-medium"
                            value={assets.investmentAssets}
                            onChange={(val) => handleAsset('investmentAssets', val)}
                        />
                    </div>
                </div>

                {/* Tsumitate */}
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <label className="text-xs font-bold text-slate-700 mb-2 block flex items-center gap-1">
                        <TrendingUp size={14} className="text-blue-500" />
                        毎月の積立投資 (NISA等)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="text-[10px] text-slate-500 mb-1 block">積立額 (月額)</label>
                            <MoneyInput
                                className="w-full p-2 rounded border border-blue-200 text-sm text-slate-900 font-medium bg-white"
                                value={assets.monthlyInvestment?.amount || 0}
                                onChange={(val) => onAssetsChange({ ...assets, monthlyInvestment: { ...assets.monthlyInvestment || { expectedReturn: 5, durationYears: 20, amount: 0 }, amount: val } })}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-500 mb-1 block">想定利回り (年率)</label>
                            <PercentageInput
                                value={assets.monthlyInvestment?.expectedReturn || 5}
                                onChange={(val) => onAssetsChange({ ...assets, monthlyInvestment: { ...assets.monthlyInvestment || { amount: 0, durationYears: 20, expectedReturn: 5 }, expectedReturn: val } })}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-500 mb-1 block">積立期間 (年)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    className="w-full p-2 rounded border border-blue-200 text-sm text-slate-900 font-medium bg-white pr-8"
                                    value={assets.monthlyInvestment?.durationYears || 20}
                                    onChange={(e) => onAssetsChange({ ...assets, monthlyInvestment: { ...assets.monthlyInvestment || { amount: 0, expectedReturn: 5, durationYears: 20 }, durationYears: Number(e.target.value) } })}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs text font-bold">年</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="text-xs font-bold text-slate-700 mb-2 block">その他のローン返済 (奨学金など)</label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-slate-500">毎月の返済額</label>
                            <MoneyInput
                                className="w-full p-2 rounded border border-slate-200 text-sm text-slate-900 font-medium"
                                value={assets.otherMonthlyPayment}
                                onChange={(val) => handleAsset('otherMonthlyPayment', val)}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-500">残高 (概算)</label>
                            <MoneyInput
                                className="w-full p-2 rounded border border-slate-200 text-sm text-slate-900 font-medium"
                                value={assets.otherLoansRemaining}
                                onChange={(val) => handleAsset('otherLoansRemaining', val)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Config */}
            <div className="space-y-3">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                    <Settings className="text-purple-600" /> シミュレーション前提
                </h3>
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-700 flex items-center gap-1 mb-1">
                            <TrendingUp size={12} /> 想定運用利回り(年率)
                        </label>
                        <PercentageInput
                            value={config.investmentReturnRate}
                            onChange={(val) => handleConfig('investmentReturnRate', val)}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-700 mb-1 block">インフレ率 (年率)</label>
                        <PercentageInput
                            value={config.inflationRate}
                            onChange={(val) => handleConfig('inflationRate', val)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
