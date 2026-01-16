import React from 'react';
import { Assets, SimulationConfig } from '@/lib/types';
import { Landmark, Settings, TrendingUp } from 'lucide-react';
import MoneyInput from '../MoneyInput';

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
                        <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                            <TrendingUp size={12} /> 想定運用利回り(年率)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                step={0.1}
                                className="w-full p-2 pr-6 rounded border border-purple-200 text-sm text-slate-900 font-medium"
                                value={config.investmentReturnRate}
                                onChange={(e) => handleConfig('investmentReturnRate', Number(e.target.value))}
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold pointer-events-none">%</span>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-700">インフレ率 (年率)</label>
                        <div className="relative">
                            <input
                                type="number"
                                step={0.1}
                                className="w-full p-2 pr-6 rounded border border-purple-200 text-sm text-slate-900 font-medium"
                                value={config.inflationRate}
                                onChange={(e) => handleConfig('inflationRate', Number(e.target.value))}
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold pointer-events-none">%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
