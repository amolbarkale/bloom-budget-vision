
import { useState } from 'react';
import { format } from 'date-fns';
import { Edit2, Trash2, Filter } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { 
  Card,
  CardContent, 
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import CategoryIcon from './CategoryIcon';
import ExpenseForm from './ExpenseForm';

const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Highest Amount', value: 'highest' },
  { label: 'Lowest Amount', value: 'lowest' },
];

const categories = [
  'Food', 
  'Transport', 
  'Entertainment', 
  'Shopping', 
  'Health', 
  'Other'
];

const ExpenseList = () => {
  const { expenses, deleteExpense } = useBudget();
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([...categories]);
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  // Filtering and sorting
  const filteredExpenses = expenses
    .filter((expense) => 
      (selectedCategories.includes(expense.category)) &&
      (expense.note?.toLowerCase().includes(searchTerm.toLowerCase()) || 
       expense.category.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'highest':
          return b.amount - a.amount;
        case 'lowest':
          return a.amount - b.amount;
        case 'newest':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  // Handle category toggle
  const toggleCategory = (category) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((c) => c !== category)
        : [...current, category]
    );
  };

  // Delete confirmation
  const confirmDelete = (expense) => {
    setSelectedExpense(expense);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (selectedExpense) {
      await deleteExpense(selectedExpense.id);
      setIsDeleteDialogOpen(false);
    }
  };

  // Edit expense
  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <Input
          placeholder="Search expenses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-64"
        />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter size={16} className="mr-1" /> 
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => toggleCategory(category)}
                >
                  <div className="flex items-center">
                    <CategoryIcon category={category} size={14} />
                    <span className="ml-2">{category}</span>
                  </div>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Sort: {sortOptions.find(opt => opt.value === sortBy)?.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              {sortOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={sortBy === option.value}
                  onCheckedChange={() => setSortBy(option.value)}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No expenses found. Try adjusting your filters or add a new expense.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredExpenses.map((expense) => (
            <Card key={expense.id} className="animate-fade-in">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className={`category-badge category-${expense.category}`}>
                      <CategoryIcon category={expense.category} size={14} />
                      <span className="ml-1">{expense.category}</span>
                    </span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {formatDate(expense.date)}
                    </span>
                  </div>
                  <span className="font-semibold">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>
              </CardHeader>
              
              {expense.note && (
                <CardContent className="py-1">
                  <p className="text-sm">{expense.note}</p>
                </CardContent>
              )}
              
              <CardFooter className="pt-2 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleEdit(expense)}
                >
                  <Edit2 size={16} className="mr-1" /> Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => confirmDelete(expense)}
                  className="text-destructive hover:text-destructive/90"
                >
                  <Trash2 size={16} className="mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          {selectedExpense && (
            <ExpenseForm
              expense={selectedExpense}
              onSubmit={() => setIsEditDialogOpen(false)}
              onCancel={() => setIsEditDialogOpen(false)}
              isEdit
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this expense?</p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpenseList;
