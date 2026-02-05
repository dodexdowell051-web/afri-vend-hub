import { Button } from "@/components/ui/button";
import { Heart, Package, ShoppingCart } from "lucide-react";
import { useState } from "react";
import LazyImage from "@/components/ui/lazy-image";
import ButtonLoader from "@/components/loading/ButtonLoader";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  category: string | null;
  store: {
    id: string;
    name: string;
  };
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => Promise<void>;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    await onAddToCart(product.id);
    setLoading(false);
  };

  return (
    <div className="bg-card rounded-2xl overflow-hidden border hover:border-primary/30 transition-all duration-300 group">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        {product.image_url ? (
          <LazyImage
            src={product.image_url}
            alt={product.name}
            aspectRatio="square"
            className="w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Package className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={() => setLiked(!liked)}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all ${
            liked
              ? "bg-secondary text-secondary-foreground"
              : "bg-background/80 text-muted-foreground hover:text-secondary"
          }`}
        >
          <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
        </button>

        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 text-xs font-medium bg-background/80 backdrop-blur-sm rounded-full">
              {product.category}
            </span>
          </div>
        )}

        {/* Low Stock Warning */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-full">
              Only {product.stock} left!
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">
          by {product.store?.name || "Unknown Store"}
        </p>
        <h3 className="font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {product.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-primary">
            ₦{product.price.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground">
            {product.stock} in stock
          </span>
        </div>

        <Button
          variant="secondary"
          className="w-full"
          size="sm"
          onClick={handleAddToCart}
          disabled={loading || product.stock === 0}
        >
          {loading ? (
            <ButtonLoader variant="dots" size="sm" />
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
