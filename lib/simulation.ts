import { LifePlanInput, YearlyCashFlow, Person, Child } from "./types";
import { EDUCATION_COSTS, DEFAULT_PENSION } from "./constants";

export function calculateLifePlan(input: LifePlanInput): YearlyCashFlow[] {
    const { headOfHousehold, spouse, children, housing, expenses, assets, config } = input;
    const results: YearlyCashFlow[] = [];

    // Initialize state
    let currentCash = assets.cashSavings;
    let currentInvestments = assets.investmentAssets;

    // We simulate until the head of household is 100 years old
    const startAge = headOfHousehold.currentAge;
    const maxAge = 100;
    const yearsToSimulate = maxAge - startAge;

    for (let year = 0; year <= yearsToSimulate; year++) {
        const currentYearAge = startAge + year;

        // --- INCOME ---
        let annualIncome = 0;
        let annualPension = 0;

        // Head
        if (currentYearAge < headOfHousehold.targetRetirementAge) {
            annualIncome += headOfHousehold.annualIncome + headOfHousehold.annualBonus;
        } else if (currentYearAge === headOfHousehold.targetRetirementAge) {
            // Retirement lump sum simulated as income
            annualIncome += headOfHousehold.retirementAllowance;
        } else if (currentYearAge >= config.socialSecurityPensionOffset) {
            annualPension += getYearlyPension(headOfHousehold.employmentType);
        }

        // Spouse
        if (spouse) {
            const spouseAge = spouse.currentAge + year;
            if (spouseAge < spouse.targetRetirementAge) {
                annualIncome += spouse.annualIncome + spouse.annualBonus;
            } else if (spouseAge === spouse.targetRetirementAge) {
                annualIncome += spouse.retirementAllowance;
            } else if (spouseAge >= config.socialSecurityPensionOffset) {
                annualPension += getYearlyPension(spouse.employmentType);
            }
        }

        const totalIncome = annualIncome + annualPension;

        // --- EXPENSES ---

        // 1. Basic Living (inflate)
        const inflationMultiplier = Math.pow(1 + config.inflationRate / 100, year);
        const basicLiving = expenses.monthlyBasicLiving * 12 * inflationMultiplier;
        const specialExp = expenses.yearlySpecialExpenses * inflationMultiplier;

        // 2. Housing
        let housingCostAnnual = 0;
        if (housing.type === 'rent') {
            housingCostAnnual = housing.monthlyCost * 12 * inflationMultiplier; // Rent increases with inflation usually
        } else if (housing.type === 'own_with_loan') {
            // Main loan payment (fixed usually)
            if (year < housing.remainingLoanYears) {
                housingCostAnnual += housing.monthlyCost * 12;
            }
            // Maintenance (inflates)
            housingCostAnnual += housing.maintenanceCostPerYear * inflationMultiplier;
        } else {
            housingCostAnnual += housing.maintenanceCostPerYear * inflationMultiplier;
        }

        // 3. Education
        let educationCost = 0;
        children.forEach(child => {
            const childAge = child.age + year;
            educationCost += getEducationCost(child, childAge) * inflationMultiplier;
        });

        // 4. Events (Cars, Loans)
        let eventCost = 0;
        if (assets.otherLoansRemaining > 0) {
            // Simplified: pay until done. Realistically need term. 
            // Assuming loan reduces linearly.
            const yearlyLoanPay = assets.otherMonthlyPayment * 12;
            if (currentCash > yearlyLoanPay) { // Simplified check
                // This logic is a bit weak without a proper loan schedule state, but ok for now.
                // Let's assume the user inputs "Remaining Years" for other loans in a real app,
                // but for now let's just subtract until 'otherLoansRemaining' concept in state is depleted (not tracking state deeply here for simplicity, just flow).
                // Actually, let's just use monthly cost provided.
                // Refinement: The Type doesn't have "remaining years" for other loans.
                // Use a fixed approximation or infinite? Let's assume 5 years if not specified or just pay forever?
                // Let's assume the user inputs valid monthly payment that ends correctly.
                // We'll skip complex other loan logic for MVP v2 and just use monthly payment * 12.
                eventCost += assets.otherMonthlyPayment * 12;
            }
        }

        // Car Replacement
        expenses.vehicleReplacements.forEach(vehicle => {
            if (year > 0 && year % vehicle.intervalYears === 0) {
                eventCost += vehicle.cost * inflationMultiplier;
            }
        });

        const totalExpenses = basicLiving + specialExp + housingCostAnnual + educationCost + eventCost;

        // --- BALANCE & ASSET GROWTH ---
        const surplus = totalIncome - totalExpenses;

        // Asset Growth (Start of year assets generate return? Or End? usually average. Let's do Start)
        // Investment growth
        const investmentReturn = currentInvestments * (config.investmentReturnRate / 100);

        // Bank interest (negligible, ignore or tiny)
        // Update Principle
        // Strategy: If surplus > 0, put into Investment (or Bank? User preference).
        // Let's assume specific "Savings" behavior. 
        // For simplicity: Surplus goes to Investment? Or Split?
        // Usually people save cash for emergency. Let's keep cash constant-ish or grow slowly, and put surplus to investment.
        // Actually, let's just add surplus to "Assets".

        let newInvestments = currentInvestments + investmentReturn;

        if (surplus >= 0) {
            // Add to investments
            newInvestments += surplus;
        } else {
            // Deficit: Withdraw from Cash first, then Investments
            let deficit = -surplus;
            if (currentCash >= deficit) {
                currentCash -= deficit;
            } else {
                deficit -= currentCash;
                currentCash = 0;
                newInvestments -= deficit;
            }
        }

        // Update state
        currentInvestments = newInvestments;
        // (CurrentCash stays same if surplus > 0? Maybe realistic to move some surplus to cash? 
        // Let's assume 100% investment of surplus for maximizing "Simulation" effect, or 50/50?
        // Let's keep it simple: Surplus -> Investment. 

        const totalAssets = currentCash + currentInvestments;

        results.push({
            age: currentYearAge,
            year: year,
            income: annualIncome,
            pension: annualPension,
            totalIncome,
            basicLiving: basicLiving + specialExp,
            housing: housingCostAnnual,
            education: educationCost,
            events: eventCost,
            totalExpenses,
            annualSurplus: surplus,
            totalAssets: Math.round(totalAssets),
            investmentAssets: Math.round(currentInvestments),
            cashAssets: Math.round(currentCash),
            realTotalAssets: Math.round(totalAssets / inflationMultiplier)
        });
    }

    return results;
}

function getYearlyPension(type: Person['employmentType']): number {
    return DEFAULT_PENSION[type] || 0;
}

function getEducationCost(child: Child, age: number): number {
    const plan = child.educationPlan;

    // Age 3-5: Kindergarten
    if (age >= 3 && age <= 5) return EDUCATION_COSTS.kindergarten[plan.kindergarten];

    // Age 6-11: Elementary
    if (age >= 6 && age <= 11) return EDUCATION_COSTS.elementary[plan.elementary];

    // Age 12-14: Junior High
    if (age >= 12 && age <= 14) return EDUCATION_COSTS.juniorHigh[plan.juniorHigh];

    // Age 15-17: High School
    if (age >= 15 && age <= 17) return EDUCATION_COSTS.highSchool[plan.highSchool];

    // Age 18-21: University
    if (age >= 18 && age <= 21) {
        if (plan.university === 'none') return 0;
        return EDUCATION_COSTS.university[plan.university];
    }

    return 0;
}
