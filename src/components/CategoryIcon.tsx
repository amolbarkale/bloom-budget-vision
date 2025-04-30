
import { 
  UtensilsCrossed, 
  Bus, 
  Film, 
  ShoppingCart, 
  Heart, 
  CircleDashed 
} from 'lucide-react';

const iconSize = 18;

interface CategoryIconProps {
  category: string;
  size?: number;
}

const CategoryIcon = ({ category, size = iconSize }: CategoryIconProps) => {
  switch (category) {
    case 'Food':
      return <UtensilsCrossed size={size} className="text-budget-food" />;
    case 'Transport':
      return <Bus size={size} className="text-budget-transport" />;
    case 'Entertainment':
      return <Film size={size} className="text-budget-entertainment" />;
    case 'Shopping':
      return <ShoppingCart size={size} className="text-budget-shopping" />;
    case 'Health':
      return <Heart size={size} className="text-budget-health" />;
    case 'Other':
    default:
      return <CircleDashed size={size} className="text-budget-other" />;
  }
};

export default CategoryIcon;
