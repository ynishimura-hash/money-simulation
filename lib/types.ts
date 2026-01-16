export type EducationLevel = 'public' | 'private' | 'private_science' | 'private_arts' | 'national_uni';

export interface Person {
    currentAge: number;
    targetRetirementAge: number;
    employmentType: 'employee' | 'self_employed' | 'none';
    annualIncome: number; // Current gross income
    annualBonus: number;
    retirementAllowance: number; // Expected lump sum at retirement
}

export interface Child {
    id: string;
    name: string;
    age: number;
    educationPlan: {
        kindergarten: 'public' | 'private';
        elementary: 'public' | 'private';
        juniorHigh: 'public' | 'private';
        highSchool: 'public' | 'private';
        university: 'none' | 'national_arts' | 'national_science' | 'private_arts' | 'private_science';
    };
}

export interface Housing {
    type: 'rent' | 'own_with_loan' | 'own_paid_off';
    monthlyCost: number; // Rent or Mortgage payment
    maintenanceCostPerYear: number;
    // For loan
    remainingLoanYears: number;
    loanInterestRate: number;
    // For future purchase (simplified for now: treated as an expense event or simplified stream)
}

export interface Expenses {
    monthlyBasicLiving: number; // Food, Utilities, etc. (excluding housing/education)
    yearlySpecialExpenses: number; // Travel, etc.
    vehicleReplacements: {
        intervalYears: number;
        cost: number;
    }[];
}

export interface Assets {
    cashSavings: number;
    investmentAssets: number;
    // Liabilities
    otherLoansRemaining: number;
    otherMonthlyPayment: number;
}

export interface SimulationConfig {
    investmentReturnRate: number; // %
    inflationRate: number; // %
    socialSecurityPensionOffset: number; // Age to start receiving pension (usually 65)
}

// Aggregated input for the simulation
export interface LifePlanInput {
    headOfHousehold: Person;
    spouse?: Person;
    children: Child[];
    housing: Housing;
    expenses: Expenses;
    assets: Assets;
    config: SimulationConfig;
}

export interface YearlyCashFlow {
    age: number;
    year: number; // 0, 1, 2...

    // Incomes
    income: number;
    pension: number;
    totalIncome: number;

    // Expenses
    basicLiving: number;
    housing: number;
    education: number;
    events: number; // Car, Marriage, etc.
    totalExpenses: number;

    // Balance
    annualSurplus: number;

    // Assets (End of Year)
    totalAssets: number;
    investmentAssets: number;
    cashAssets: number;

    // Inflation adjusted
    realTotalAssets: number;
}
