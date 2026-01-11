import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal, X } from "lucide-react";

interface ProductFiltersProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  maxPrice: number;
}

const ProductFilters = ({
  categories,
  activeCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  maxPrice,
}: ProductFiltersProps) => {
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);

  const handlePriceSliderChange = (values: number[]) => {
    setLocalPriceRange([values[0], values[1]]);
  };

  const applyPriceFilter = () => {
    onPriceChange(localPriceRange);
  };

  const resetFilters = () => {
    onCategoryChange("All");
    onPriceChange([0, maxPrice]);
    setLocalPriceRange([0, maxPrice]);
  };

  const hasActiveFilters = activeCategory !== "All" || priceRange[0] > 0 || priceRange[1] < maxPrice;

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden md:block">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Price Range */}
        <div className="bg-card rounded-xl p-4 border mb-6">
          <div className="flex items-center justify-between mb-4">
            <Label className="font-medium">Price Range</Label>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs h-7">
                Reset all
              </Button>
            )}
          </div>
          <div className="space-y-4">
            <Slider
              defaultValue={[0, maxPrice]}
              value={localPriceRange}
              max={maxPrice}
              step={100}
              onValueChange={handlePriceSliderChange}
              className="w-full"
            />
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Input
                  type="number"
                  value={localPriceRange[0]}
                  onChange={(e) => setLocalPriceRange([Number(e.target.value), localPriceRange[1]])}
                  className="h-9"
                  placeholder="Min"
                />
              </div>
              <span className="text-muted-foreground">-</span>
              <div className="flex-1">
                <Input
                  type="number"
                  value={localPriceRange[1]}
                  onChange={(e) => setLocalPriceRange([localPriceRange[0], Number(e.target.value)])}
                  className="h-9"
                  placeholder="Max"
                />
              </div>
              <Button size="sm" onClick={applyPriceFilter} className="h-9">
                Apply
              </Button>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              ₦{localPriceRange[0].toLocaleString()} - ₦{localPriceRange[1].toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      <div className="md:hidden mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.slice(0, 4).map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {category}
            </button>
          ))}
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 w-2 h-2 rounded-full bg-secondary" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl">
              <SheetHeader className="mb-4">
                <SheetTitle>Filter Products</SheetTitle>
              </SheetHeader>
              
              <div className="space-y-6">
                {/* Categories in Sheet */}
                <div>
                  <Label className="font-medium mb-3 block">Category</Label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => onCategoryChange(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          activeCategory === category
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range in Sheet */}
                <div>
                  <Label className="font-medium mb-3 block">Price Range</Label>
                  <Slider
                    value={localPriceRange}
                    max={maxPrice}
                    step={100}
                    onValueChange={handlePriceSliderChange}
                    className="w-full mb-4"
                  />
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      value={localPriceRange[0]}
                      onChange={(e) => setLocalPriceRange([Number(e.target.value), localPriceRange[1]])}
                      placeholder="Min"
                    />
                    <span>-</span>
                    <Input
                      type="number"
                      value={localPriceRange[1]}
                      onChange={(e) => setLocalPriceRange([localPriceRange[0], Number(e.target.value)])}
                      placeholder="Max"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={resetFilters}>
                    Reset
                  </Button>
                  <Button className="flex-1" onClick={applyPriceFilter}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};

export default ProductFilters;
