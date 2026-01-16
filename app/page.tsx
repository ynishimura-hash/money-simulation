"use client";

import React, { useState, useMemo } from 'react';
import { calculateLifePlan } from '@/lib/simulation';
import { LifePlanInput, YearlyCashFlow } from '@/lib/types';
import { calculateLifePlan as calcFn } from '@/lib/simulation';

import PersonInput from '@/components/forms/PersonInput';
import FamilyForm from '@/components/forms/FamilyForm';
import ExpensesForm from '@/components/forms/ExpensesForm';
import AssetsConfigForm from '@/components/forms/AssetsConfigForm';

import AssetTransitionGraph from '@/components/results/AssetTransitionGraph';
import CashFlowGraph from '@/components/results/CashFlowGraph';

import { Users, Info, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';

export default function Home() {
  // Initial State
  const [input, setInput] = useState<LifePlanInput>({
    headOfHousehold: {
      currentAge: 30,
      targetRetirementAge: 65,
      employmentType: 'employee',
      annualIncome: 5000000,
      annualBonus: 1000000,
      retirementAllowance: 10000000
    },
    spouse: undefined,
    children: [],
    housing: {
      type: 'rent',
      monthlyCost: 100000,
      maintenanceCostPerYear: 0,
      remainingLoanYears: 0,
      loanInterestRate: 0
    },
    expenses: {
      food: 60000,
      utilities: 20000,
      communication: 10000,
      dailyGoods: 10000,
      clothingBeauty: 10000,
      entertainment: 30000,
      medicalInsurance: 5000,
      otherBasic: 20000,
      yearlySpecialExpenses: 300000,
      vehicleReplacements: []
    },
    assets: {
      cashSavings: 3000000,
      investmentAssets: 1000000,
      monthlyInvestment: {
        amount: 30000,
        expectedReturn: 5.0,
        durationYears: 20
      },
      otherLoansRemaining: 0,
      otherMonthlyPayment: 0
    },
    config: {
      inflationRate: 2.0,
      socialSecurityPensionOffset: 65,
      enableExpenses: true,
      enableRetirement: true
    }
  });

  const [expandedSection, setExpandedSection] = useState<string | null>('assets');

  // Comparison State
  const [compareInput, setCompareInput] = useState<LifePlanInput | null>(null);

  // Toggle Spouse
  const toggleSpouse = () => {
    if (input.spouse) {
      setInput({ ...input, spouse: undefined });
    } else {
      setInput({
        ...input,
        spouse: {
          currentAge: 30,
          targetRetirementAge: 65,
          employmentType: 'employee',
          annualIncome: 3000000,
          annualBonus: 500000,
          retirementAllowance: 5000000
        }
      });
    }
  };

  // Comparison Results (calculated separately from main results)
  const compareResults = useMemo(() => compareInput ? calcFn(compareInput) : null, [compareInput]);

  const startComparison = () => {
    setCompareInput(JSON.parse(JSON.stringify(input)));
  };

  const stopComparison = () => {
    setCompareInput(null);
  };

  const results = useMemo(() => {
    try {
      const res = calcFn(input);
      if (!res || res.length === 0) {
        return [];
      }
      return res;
    } catch (e) {
      console.error("Simulation error", e);
      return [];
    }
  }, [input]);

  // Guard against empty results
  const finalResult = results.length > 0 ? results[results.length - 1] : {
    totalAssets: 0,
    realTotalAssets: 0,
    investmentAssets: 0,
    cashAssets: 0,
    age: 0,
    year: 0,
    income: 0,
    pension: 0,
    totalIncome: 0,
    basicLiving: 0,
    housing: 0,
    education: 0,
    events: 0,
    totalExpenses: 0,
    annualSurplus: 0
  };

  const SectionHeader = ({ id, title, icon: Icon }: { id: string, title: string, icon: any }) => (
    <button
      onClick={() => setExpandedSection(expandedSection === id ? null : id)}
      className={`w-full flex items-center justify-between p-4 bg-white border border-slate-200 ${expandedSection === id ? 'rounded-t-xl border-b-0' : 'rounded-xl shadow-sm'}`}
    >
      <div className="flex items-center gap-3 font-bold text-slate-700">
        <Icon className="text-blue-500" />
        {title}
      </div>
      {expandedSection === id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white pt-10 pb-24 px-4 shadow-lg rounded-b-[2.5rem]">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl md:text-4xl font-black mb-2 tracking-tight">
            ライフプラン・シミュレーター
          </h1>
          <p className="text-blue-100 text-sm md:text-base font-medium opacity-90">
            家族、住まい、教育、そして老後。<br />
            人生の収支を見える化し、未来を設計しよう。
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 -mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left: Inputs */}
        <div className="lg:col-span-5 space-y-4">

          {/* 1. Assets & Config */}
          <div>
            <SectionHeader id="assets" title="資産・シミュレーション条件" icon={TrendingUp} />
            {expandedSection === 'assets' && (
              <div className="bg-white p-4 rounded-b-xl border border-t-0 border-slate-200 shadow-sm">
                <AssetsConfigForm
                  assets={input.assets}
                  config={input.config}
                  onAssetsChange={(a) => setInput({ ...input, assets: a })}
                  onConfigChange={(c) => setInput({ ...input, config: c })}
                />
              </div>
            )}
          </div>

          {/* 2. Basic Profile */}
          <div>
            <SectionHeader id="basic" title="基本情報・家族" icon={Users} />
            {expandedSection === 'basic' && (
              <div className="bg-white p-4 rounded-b-xl border border-t-0 border-slate-200 shadow-sm space-y-6">
                <PersonInput
                  title="世帯主"
                  person={input.headOfHousehold}
                  onChange={(p) => setInput({ ...input, headOfHousehold: p })}
                  colorClass="bg-blue-50 border-blue-100"
                />

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-600">配偶者</h3>
                    <button
                      onClick={toggleSpouse}
                      className={`text-xs px-3 py-1 rounded-full font-bold transition ${input.spouse ? 'bg-pink-500 text-white' : 'bg-slate-200 text-slate-500'}`}
                    >
                      {input.spouse ? 'あり' : 'なし'}
                    </button>
                  </div>
                  {input.spouse && (
                    <PersonInput
                      title="配偶者"
                      person={input.spouse}
                      onChange={(p) => setInput({ ...input, spouse: p })}
                      colorClass="bg-pink-50 border-pink-100"
                    />
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <FamilyForm
                    childrenData={input.children}
                    onChange={(c) => setInput({ ...input, children: c })}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2. Expenses & Housing */}
          <div>
            <SectionHeader id="expenses" title="住まい・生活費" icon={Info} />
            {expandedSection === 'expenses' && (
              <div className="bg-white p-4 rounded-b-xl border border-t-0 border-slate-200 shadow-sm">
                <ExpensesForm
                  housing={input.housing}
                  expenses={input.expenses}
                  onHousingChange={(h) => setInput({ ...input, housing: h })}
                  onExpensesChange={(e) => setInput({ ...input, expenses: e })}
                />
              </div>
            )}
          </div>

          {/* 3. Assets & Config */}

        </div>

        {/* Right: Results */}
        <div className="lg:col-span-7 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-xs font-bold text-slate-400 mb-1">100歳時点の資産残高</p>
              <p className={`text-2xl font-black ${finalResult.totalAssets >= 0 ? 'text-blue-600' : 'text-red-500'}`}>
                {finalResult.totalAssets >= 0 ? '' : '▲'}
                {Math.abs(finalResult.totalAssets).toLocaleString()}円
              </p>
              <p className="text-xs text-slate-400 mt-2">
                (インフレ考慮後の実質価値: {finalResult.realTotalAssets.toLocaleString()}円)
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-xs font-bold text-slate-400 mb-1">生涯の総支出 (インフレ込)</p>
              <p className="text-2xl font-black text-slate-700">
                {Math.round(results.reduce((acc, r) => acc + r.totalExpenses, 0)).toLocaleString()}円
              </p>
              <p className="text-xs text-slate-400 mt-2">
                内 教育費: {Math.round(results.reduce((acc, r) => acc + r.education, 0)).toLocaleString()}円
              </p>
            </div>
          </div>

          {/* Graphs */}
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
            <div className="p-4 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-lg text-slate-800">資産推移シミュレーション</h3>
              <p className="text-xs text-slate-500">
                {input.assets.monthlyInvestment?.expectedReturn || 0}%運用 / インフレ率{input.config.inflationRate}%
              </p>
            </div>
            <AssetTransitionGraph data={results} />
          </div>



          {/* Disclaimer */}
          <div className="px-4 py-2 text-[10px] text-slate-400 text-center">
            ※ このシミュレーション結果は概算であり、将来の運用成果や税制変更などを保証するものではありません。
            教育費は文部科学省の統計データ(H30)を参照しています。
          </div>
        </div>
      </main>
    </div>
  );
}
