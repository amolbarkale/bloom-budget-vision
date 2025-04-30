import MainNav from "../components/MainNav";
import ExpenseCharts from "../components/ExpenseCharts";
import { Card, CardContent } from "@/components/ui/card";

const Visualize = () => {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <div className="container py-6 pb-20 sm:pb-6">
        <h1 className="text-2xl font-bold mb-6">Visualize Spending</h1>

        <Card>
          <CardContent className="p-4">
            <ExpenseCharts />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Visualize;
