import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Target, BarChart3, Clock } from "lucide-react";
import { useBudget } from "../context/BudgetContext";
import MainNav from "../components/MainNav";
import DashboardSummary from "../components/DashboardSummary";
import ExpenseList from "../components/ExpenseList";
import ExpenseCharts from "../components/ExpenseCharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  const navigate = useNavigate();
  const { expenses, fetchExpenses, isLoading } = useBudget();
  const [activeTab, setActiveTab] = useState("recent");
  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await fetchExpenses();
      setInitialLoaded(true);
    };

    loadData();
  }, []);

  // Get recent expenses (last 5)
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Prepare UI rendering states to prevent shaking
  const showLoadingState = isLoading && !initialLoaded;
  const showEmptyState =
    !isLoading && initialLoaded && recentExpenses.length === 0;
  const showExpenseList = !isLoading && recentExpenses.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <div className="container py-6 pb-20 sm:pb-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <DashboardSummary />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Button
            onClick={() => navigate("/add-expense")}
            className="flex items-center justify-center h-24"
          >
            <div className="flex flex-col items-center">
              <PlusCircle size={24} className="mb-2" />
              <span>Add Expense</span>
            </div>
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/goals")}
            className="flex items-center justify-center h-24"
          >
            <div className="flex flex-col items-center">
              <Target size={24} className="mb-2" />
              <span>Savings Goals</span>
            </div>
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/visualize")}
            className="flex items-center justify-center h-24"
          >
            <div className="flex flex-col items-center">
              <BarChart3 size={24} className="mb-2" />
              <span>Visualize</span>
            </div>
          </Button>
        </div>

        <div className="mt-8">
          <div className="flex border-b mb-4">
            <Button
              variant="ghost"
              className={`${activeTab === "recent" ? "border-b-2 border-primary rounded-none" : ""}`}
              onClick={() => setActiveTab("recent")}
            >
              <Clock size={16} className="mr-2" />
              Recent Expenses
            </Button>
            <Button
              variant="ghost"
              className={`${activeTab === "charts" ? "border-b-2 border-primary rounded-none" : ""}`}
              onClick={() => setActiveTab("charts")}
            >
              <BarChart3 size={16} className="mr-2" />
              Charts
            </Button>
          </div>

          {activeTab === "recent" && (
            <Card>
              <CardContent className="p-4">
                {showLoadingState ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading expenses...
                  </div>
                ) : showEmptyState ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent expenses. Add your first expense to get started.
                  </div>
                ) : showExpenseList ? (
                  <>
                    <ExpenseList />
                    <div className="mt-4 text-center">
                      <Button
                        variant="link"
                        onClick={() => navigate("/history")}
                      >
                        View All Expenses
                      </Button>
                    </div>
                  </>
                ) : null}
              </CardContent>
            </Card>
          )}

          {activeTab === "charts" && (
            <Card>
              <CardContent className="p-4">
                <ExpenseCharts />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
