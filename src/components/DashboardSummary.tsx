import { ArrowUp, ArrowDown } from "lucide-react";
import { useBudget } from "../context/BudgetContext";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const DashboardSummary = () => {
  const { monthlyTotal, currentMonthGoal } = useBudget();

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Calculate savings
  const savedSoFar = currentMonthGoal
    ? currentMonthGoal.targetAmount - monthlyTotal
    : 0;
  const savingsProgress = currentMonthGoal
    ? Math.min(
        100,
        Math.max(0, (savedSoFar / currentMonthGoal.targetAmount) * 100)
      )
    : 0;

  const isOnTrack = savedSoFar >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="budget-card animate-fade-in">
        <h3 className="text-lg font-medium mb-2">Monthly Spending</h3>
        <div className="text-3xl font-bold">{formatCurrency(monthlyTotal)}</div>
        <div className="flex items-center mt-2 text-muted-foreground text-sm">
          {isOnTrack ? (
            <ArrowDown className="text-budget-success mr-1" size={14} />
          ) : (
            <ArrowUp className="text-budget-danger mr-1" size={14} />
          )}
          <span>vs. monthly budget</span>
        </div>
      </Card>

      <Card className="budget-card animate-fade-in">
        <h3 className="text-lg font-medium mb-2">Savings Goal</h3>
        <div className="text-3xl font-bold">
          {currentMonthGoal ? formatCurrency(savedSoFar) : "No goal set"}
        </div>

        {currentMonthGoal && (
          <>
            <Progress value={savingsProgress} className="h-2 mt-3" />
            <div className="flex justify-between text-sm mt-1 text-muted-foreground">
              <span>
                {isOnTrack
                  ? `${savingsProgress.toFixed(0)}% of goal`
                  : "Over budget"}
              </span>
              <span>Goal: {formatCurrency(currentMonthGoal.targetAmount)}</span>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default DashboardSummary;
