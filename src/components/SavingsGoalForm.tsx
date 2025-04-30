
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarIcon } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';

interface SavingsGoalFormProps {
  goal?: {
    id: string;
    month: string;
    targetAmount: number;
  };
  onSubmit: () => void;
  onCancel?: () => void;
  isEdit?: boolean;
}

const SavingsGoalForm = ({ 
  goal, 
  onSubmit, 
  onCancel,
  isEdit = false 
}: SavingsGoalFormProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    goal ? new Date(goal.month + '-01') : undefined
  );
  
  const [monthStr, setMonthStr] = useState(
    goal ? goal.month : ''
  );
  
  const [targetAmount, setTargetAmount] = useState(
    goal ? goal.targetAmount : 0
  );

  const { addGoal, updateGoal } = useBudget();

  // Update monthStr when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      const month = format(selectedDate, 'yyyy-MM');
      setMonthStr(month);
    }
  }, [selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!monthStr) return;
    
    const goalData = {
      month: monthStr,
      targetAmount: Number(targetAmount)
    };

    try {
      if (isEdit && goal) {
        await updateGoal(goal.id, goalData);
      } else {
        await addGoal(goalData);
      }
      onSubmit();
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="month" className="block text-sm font-medium mb-1">
          Month *
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, 'MMMM yyyy') : 'Select month'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <label htmlFor="targetAmount" className="block text-sm font-medium mb-1">
          Target Amount ($) *
        </label>
        <Input
          id="targetAmount"
          type="number"
          step="0.01"
          min="0"
          value={targetAmount}
          onChange={(e) => setTargetAmount(parseFloat(e.target.value))}
          placeholder="0.00"
          required
          className="w-full"
        />
      </div>

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={!selectedDate}
        >
          {isEdit ? 'Update Goal' : 'Add Goal'}
        </Button>
      </div>
    </form>
  );
};

export default SavingsGoalForm;
