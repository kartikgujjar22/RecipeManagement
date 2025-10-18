import { Clock, User, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RecipeCardProps {
  id: string;
  title: string;
  description: string;
  image?: string;
  cookingTime?: number;
  author?: string;
  isOwner?: boolean;
  onDelete?: (id: string) => void;
}

const RecipeCard = ({
  id,
  title,
  description,
  image,
  cookingTime,
  author,
  isOwner = false,
  onDelete,
}: RecipeCardProps) => {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border h-full flex flex-col">
      <Link to={`/recipe/${id}`} className="flex-1 flex flex-col">
        <div className="relative h-48 overflow-hidden bg-muted">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-secondary/20">
              <span className="text-4xl">🍳</span>
            </div>
          )}
        </div>
        <CardContent className="p-4 flex-1 flex flex-col">
          <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
            {description}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {cookingTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{cookingTime} min</span>
              </div>
            )}
            {author && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span className="truncate">{author}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Link>
      {isOwner && onDelete && (
        <CardFooter className="p-4 pt-0">
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              onDelete(id);
            }}
            className="w-full gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Recipe
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default RecipeCard;
