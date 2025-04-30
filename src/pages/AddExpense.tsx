import MainNav from "../components/MainNav";
import ExpenseForm from "../components/ExpenseForm";
import { useNavigate } from "react-router-dom";

const AddExpense = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <div className="container py-6 pb-20 sm:pb-6">
        <h1 className="text-2xl font-bold mb-6">Add Expense</h1>

        <div className="max-w-md mx-auto">
          <ExpenseForm onSubmit={handleSuccess} />
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
