import React from 'react';
import { Housing, Expenses } from '@/lib/types';
import { Home, Coffee, AlertCircle, Car, JapaneseYen } from 'lucide-react';

interface Props {
    housing: Housing;
    expenses: Expenses;
    onHousingChange: (h: Housing) => void;
    onExpensesChange: (e: Expenses) => void;
}

export default function ExpensesForm({ housing, expenses, onHousingChange, onExpensesChange }: Props) {

    // Handlers
    const handleHousing = (key: keyof Housing, val: any) => onHousingChange({ ...housing, [key]: val });
    const handleExpense = (key: keyof Expenses, val: any) => onExpensesChange({ ...expenses, [key]: val });

    const handleCar = (index: number, key: 'intervalYears' | 'cost', val: number) => {
        const newCars = [...expenses.vehicleReplacements];
        newCars[index] = { ...newCars[index], [key]: val };
        onExpensesChange({ ...expenses, vehicleReplacements: newCars });
    };

    const addCar = () => {
        onExpensesChange({
            ...expenses,
            vehicleReplacements: [...expenses.vehicleReplacements, { intervalYears: 7, cost: 2000000 }]
        });
    };

    const removeCar = (index: number) => {
        const newCars = expenses.vehicleReplacements.filter((_, i) => i !== index);
        onExpensesChange({ ...expenses, vehicleReplacements: newCars });
    };

    return (
        <div className="space-y-6">

            {/* Housing Section */}
            <div className="space-y-3">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                    <Home className="text-orange-500" /> 住まい
                </h3>
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 space-y-3">
                    <div>
                        <label className="text-xs font-bold text-slate-700">現在の住居タイプ</label>
                        <select
                            className="w-full p-2 rounded border border-orange-200 text-sm text-slate-900 font-medium"
                            value={housing.type}
                            onChange={(e) => handleHousing('type', e.target.value)}
                        >
                            <option value="rent">賃貸</option>
                            <option value="own_with_loan">持ち家 (住宅ローンあり)</option>
                            <option value="own_paid_off">持ち家 (完済)</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-slate-700">
                                {housing.type === 'rent' ? '毎月の家賃' : '毎月のローン返済額'}
                            </label>
                            <input
                                type="number"
                                className="w-full p-2 rounded border border-orange-200 text-sm text-slate-900 font-medium"
                                value={housing.monthlyCost}
                                onChange={(e) => handleHousing('monthlyCost', Number(e.target.value))}
                            />
                        </div>
                        {housing.type === 'own_with_loan' && (
                            <div>
                                <label className="text-xs font-bold text-slate-700">ローンの残り年数</label>
                                <input
                                    type="number"
                                    className="w-full p-2 rounded border border-orange-200 text-sm text-slate-900 font-medium"
                                    value={housing.remainingLoanYears}
                                    onChange={(e) => handleHousing('remainingLoanYears', Number(e.target.value))}
                                />
                            </div>
                        )}
                    </div>

                    {housing.type.includes('own') && (
                        <div>
                            <label className="text-xs font-bold text-slate-700">年間の固定資産税・修繕費</label>
                            <input
                                type="number"
                                className="w-full p-2 rounded border border-orange-200 text-sm text-slate-900 font-medium"
                                value={housing.maintenanceCostPerYear}
                                onChange={(e) => handleHousing('maintenanceCostPerYear', Number(e.target.value))}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Living Expenses */}
            <div className="space-y-3">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                    <Coffee className="text-emerald-500" /> 生活費・その他
                </h3>
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 space-y-3">
                    <div>
                        <label className="text-xs font-bold text-slate-700">毎月の基本生活費 (食費・光熱費・通信費など)</label>
                        <p className="text-[10px] text-slate-400 mb-1">※ 住居費・教育費は除いてください</p>
                        <input
                            type="number"
                            className="w-full p-2 rounded border border-emerald-200 text-sm text-slate-900 font-medium"
                            value={expenses.monthlyBasicLiving}
                            onChange={(e) => handleExpense('monthlyBasicLiving', Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-700">年間の特別支出 (旅行・帰省・家具家電など)</label>
                        <input
                            type="number"
                            className="w-full p-2 rounded border border-emerald-200 text-sm text-slate-900 font-medium"
                            value={expenses.yearlySpecialExpenses}
                            onChange={(e) => handleExpense('yearlySpecialExpenses', Number(e.target.value))}
                        />
                    </div>

                    {/* Vehicles */}
                    <div className="pt-2 border-t border-emerald-200">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                <Car size={14} /> 車の買い替え
                            </label>
                            <button onClick={addCar} className="text-xs bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded">追加</button>
                        </div>
                        {expenses.vehicleReplacements.map((car, idx) => (
                            <div key={idx} className="flex gap-2 items-center mb-2">
                                <span className="text-xs">間隔:</span>
                                <input
                                    type="number"
                                    className="w-16 p-1 rounded text-xs text-slate-900 font-medium"
                                    value={car.intervalYears}
                                    onChange={(e) => handleCar(idx, 'intervalYears', Number(e.target.value))}
                                />
                                <span className="text-xs">年 / 予算:</span>
                                <input
                                    type="number"
                                    className="w-24 p-1 rounded text-xs text-slate-900 font-medium"
                                    value={car.cost}
                                    onChange={(e) => handleCar(idx, 'cost', Number(e.target.value))}
                                />
                                <button onClick={() => removeCar(idx)} className="text-slate-400 hover:text-red-500"><AlertCircle size={14} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
