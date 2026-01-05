import { Link } from "react-router-dom";

const categories = [
  {
    title: "Fashion",
    itemCount: "2,500+",
    items: ["Dresses", "T-Shirts", "Jackets", "Shoes", "Accessories"],
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=500&fit=crop",
    color: "from-secondary/20 to-accent/10",
  },
  {
    title: "Electronics",
    itemCount: "1,800+",
    items: ["Phones", "Laptops", "Audio", "Cameras", "Accessories"],
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=500&fit=crop",
    color: "from-primary/20 to-accent/10",
  },
  {
    title: "Home & Living",
    itemCount: "1,200+",
    items: ["Furniture", "Decor", "Kitchen", "Bedding", "Lighting"],
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=500&fit=crop",
    color: "from-accent/30 to-secondary/10",
  },
];

const CategoriesSection = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-40 h-40 dot-pattern opacity-30" />

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Shop By Category</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4">
            Explore Our Collections
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              to="/marketplace"
              key={category.title}
              className="group relative rounded-3xl overflow-hidden bg-gradient-to-br p-6 min-h-[400px] flex flex-col justify-between card-shadow hover:card-shadow-hover transition-all duration-300"
              style={{
                backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to))`,
              }}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color}`} />
              
              {/* Category Image - positioned on right */}
              <div className="absolute right-0 bottom-0 w-2/3 h-3/4">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover object-center opacity-90 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <span className="text-sm font-medium text-muted-foreground">{category.itemCount} Items</span>
                <h3 className="text-2xl font-bold text-foreground mt-1">{category.title}</h3>
              </div>

              <div className="relative z-10">
                <ul className="space-y-2">
                  {category.items.map((item) => (
                    <li key={item} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;