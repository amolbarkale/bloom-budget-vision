import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { useBudget } from "../context/BudgetContext";
import CategoryIcon from "./CategoryIcon";
import { useAuth } from "@/context/AuthContext";
import console from "console";

interface ExpenseFormProps {
  expense?: {
    id: string;
    amount: number;
    category: string;
    note?: string;
    date: string;
  };
  onSubmit: () => void;
  onCancel?: () => void;
  isEdit?: boolean;
}

const categories = [
  "Food",
  "Transport",
  "Entertainment",
  "Shopping",
  "Health",
  "Other",
];

const ExpenseForm = ({ expense, onSubmit, onCancel }: ExpenseFormProps) => {
  const [amount, setAmount] = useState(expense ? expense.amount : 0);
  const [category, setCategory] = useState(expense ? expense.category : "Food");
  const [note, setNote] = useState(expense ? expense.note || "" : "");
  const [date, setDate] = useState<Date>(
    expense ? new Date(expense.date) : new Date()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addExpense } = useBudget();
  const { session } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (amount <= 0) {
      toast.error("Amount must be greater than zero");
      return;
    }
    if (!category) {
      toast.error("Please select a category");
      return;
    }

    if (!session || !session.user) {
      toast.error("You must be logged in to add an expense");
      return;
    }

    setIsSubmitting(true);

    const expenseData = {
      amount: Number(amount),
      user_id: session.user.id,
      category: category as any,
      note: note || undefined,
      date: date.toISOString(),
    };

    try {
      await addExpense(expenseData);
      onSubmit();
    } catch (error) {
      console.error("Error saving expense:", error);
      toast.error(error.message ?? "Could not save expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium mb-1">
          Amount (₹) *
        </label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          placeholder="0.00"
          required
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          Category *
        </label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                <div className="flex items-center">
                  <CategoryIcon category={cat} />
                  <span className="ml-2">{cat}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium mb-1">
          Date *
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(date, "PP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <label htmlFor="note" className="block text-sm font-medium mb-1">
          Note (optional)
        </label>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add details about this expense"
          className="h-24"
        />
      </div>

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">
          {isSubmitting ? "Adding Expense" : "Add Expense"}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;
