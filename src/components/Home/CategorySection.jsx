import { Link } from "react-router-dom";
import {
  Headphones,
  BatteryCharging,
  Smartphone,
  Watch,
  Cable,
  Speaker,
} from "lucide-react";

const categories = [
  {
    name: "Earbuds",
    description: "Wireless & noise-cancelling",
    icon: Headphones,
    count: 42,
    gradient: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-500/25",
    bg: "bg-violet-50",
  },
  {
    name: "Chargers",
    description: "Fast & wireless charging",
    icon: BatteryCharging,
    count: 38,
    gradient: "from-store-primary to-blue-600",
    shadow: "shadow-blue-500/25",
    bg: "bg-blue-50",
  },
  {
    name: "Phone Cases",
    description: "Protection meets style",
    icon: Smartphone,
    count: 65,
    gradient: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/25",
    bg: "bg-emerald-50",
  },
  {
    name: "Smart Watches",
    description: "Stay connected",
    icon: Watch,
    count: 24,
    gradient: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/25",
    bg: "bg-amber-50",
  },
  {
    name: "Cables",
    description: "Lightning & USB-C",
    icon: Cable,
    count: 31,
    gradient: "from-rose-500 to-pink-600",
    shadow: "shadow-rose-500/25",
    bg: "bg-rose-50",
  },
  {
    name: "Speakers",
    description: "Portable Bluetooth",
    icon: Speaker,
    count: 19,
    gradient: "from-store-accent to-cyan-600",
    shadow: "shadow-cyan-500/25",
    bg: "bg-cyan-50",
  },
];

export default function CategorySection() {
  return (
    <section id="category-section" className="py-20 sm:py-28 bg-store-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-14">
          <span className="inline-block rounded-full bg-store-accent/10 px-4 py-1.5 text-sm font-medium text-store-accent">
            Categories
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-store-text">
            Shop by Category
          </h2>
          <p className="text-store-text-muted max-w-2xl mx-auto">
            Find exactly what you need — browse our curated collections
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/categories/${cat.name.toLowerCase().replace(/\s/g, "-")}`}
                className="group animate-fade-in-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="relative flex flex-col items-center gap-4 rounded-2xl bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 cursor-pointer">
                  {/* Icon Container */}
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.gradient} ${cat.shadow} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>

                  {/* Text */}
                  <div className="text-center space-y-1">
                    <h3 className="font-semibold text-sm text-store-text group-hover:text-store-primary transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-store-text-muted hidden sm:block">
                      {cat.description}
                    </p>
                  </div>

                  {/* Count badge */}
                  <span className={`rounded-full ${cat.bg} px-2.5 py-0.5 text-xs font-medium text-store-text-muted`}>
                    {cat.count} items
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
