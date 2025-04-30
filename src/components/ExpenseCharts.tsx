import { useState } from "react";
import { format, subDays, parseISO, startOfMonth, endOfMonth } from "date-fns";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useBudget } from "../context/BudgetContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CategoryIcon from "./CategoryIcon";
import CustomChartTooltip from "./CustomChartTooltip";
import { formatCurrency } from "@/helpers";

const dateRanges = [
  { label: "Last 7 days", value: "7days" },
  { label: "Last 30 days", value: "30days" },
  { label: "This month", value: "thisMonth" },
  { label: "Last month", value: "lastMonth" },
];

const categoryColors = {
  Food: "#FF5722",
  Transport: "#2196F3",
  Entertainment: "#9C27B0",
  Shopping: "#FFC107",
  Health: "#4CAF50",
  Other: "#607D8B",
};

const ExpenseCharts = () => {
  const { expenses } = useBudget();
  console.log("ExpenseCharts expenses:", expenses);
  const [dateRange, setDateRange] = useState("thisMonth");
  const [chartType, setChartType] = useState("category");

  // Date filtering logic
  const getFilteredExpenses = () => {
    const today = new Date();
    let startDate, endDate;

    switch (dateRange) {
      case "7days":
        startDate = subDays(today, 7);
        endDate = today;
        break;
      case "30days":
        startDate = subDays(today, 30);
        endDate = today;
        break;
      case "thisMonth":
        startDate = startOfMonth(today);
        endDate = today;
        break;
      case "lastMonth":
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
        startDate = startOfMonth(lastMonth);
        endDate = endOfMonth(lastMonth);
        break;
      default:
        startDate = startOfMonth(today);
        endDate = today;
    }

    return expenses.filter((expense) => {
      const expenseDate = parseISO(expense.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    });
  };

  const filteredExpenses = getFilteredExpenses();

  const getCategoryData = () => {
    const categoryTotals = {};

    filteredExpenses.forEach((expense) => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }
      categoryTotals[expense.category] += expense.amount;
    });

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
    }));
  };

  // Prepare data for bar chart
  const getTimeData = () => {
    const dailyTotals = {};

    filteredExpenses.forEach((expense) => {
      const day = format(parseISO(expense.date), "MMM d");

      if (!dailyTotals[day]) {
        dailyTotals[day] = 0;
      }
      dailyTotals[day] += expense.amount;
    });

    return Object.entries(dailyTotals)
      .map(([date, amount]) => ({
        date,
        amount,
      }))
      .sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
  };

  const categoryData = getCategoryData();
  const timeData = getTimeData();

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {dateRanges.map((range) => (
          <Button
            key={range.value}
            variant={dateRange === range.value ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange(range.value)}
          >
            {range.label}
          </Button>
        ))}
      </div>

      {/* Chart types */}
      <Tabs defaultValue="category" onValueChange={setChartType}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="category">Category Breakdown</TabsTrigger>
          <TabsTrigger value="time">Spending Over Time</TabsTrigger>
        </TabsList>

        <TabsContent value="category" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              {categoryData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available for this period
                </div>
              ) : (
                <>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) =>
                            `${name}: ${formatCurrency(value)}`
                          }
                        >
                          {categoryData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={categoryColors[entry.name]}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomChartTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {categoryData.map((category) => (
                      <div
                        key={category.name}
                        className="flex items-center text-sm py-1"
                      >
                        <CategoryIcon category={category.name} size={16} />
                        <span className="ml-1 mr-2">{category.name}</span>
                        <span className="text-muted-foreground">
                          {formatCurrency(Number(category.value) || 0)}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Spending Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              {timeData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available for this period
                </div>
              ) : (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={timeData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="date" />
                      <YAxis tickFormatter={formatCurrency} />
                      <Tooltip content={<CustomChartTooltip />} />
                      <Bar dataKey="amount" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExpenseCharts;
