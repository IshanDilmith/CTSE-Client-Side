import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Truck } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      id="hero-section"
      className="relative overflow-hidden bg-gradient-to-br from-store-bg via-white to-blue-50"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-store-primary/5 blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-72 h-72 rounded-full bg-store-accent/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 rounded-full bg-store-primary/3 blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-store-primary/10 px-4 py-1.5 text-sm font-medium text-store-primary">
              <Zap className="h-3.5 w-3.5" />
              New Arrivals — Spring 2026
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              <span className="text-store-text">Elevate Your</span>
              <br />
              <span className="bg-gradient-to-r from-store-primary to-store-accent bg-clip-text text-transparent">
                Mobile Experience
              </span>
            </h1>

            <p className="text-lg text-store-text-muted max-w-lg leading-relaxed">
              Discover premium earbuds, lightning-fast chargers, designer cases,
              and smart gadgets — crafted to perfectly complement your lifestyle.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link to="/products">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-store-primary to-store-primary-light text-white shadow-xl shadow-store-primary/25 hover:shadow-2xl hover:shadow-store-primary/30 transition-all duration-300 text-base px-8 h-12 rounded-xl"
                  id="hero-shop-btn"
                >
                  Shop Now
                  <ArrowRight className="h-5 w-5 ml-1" />
                </Button>
              </Link>
              <Link to="/categories">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-store-primary/20 text-store-primary hover:bg-store-primary/5 h-12 px-8 rounded-xl text-base"
                  id="hero-categories-btn"
                >
                  Browse Categories
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 pt-4">
              {[
                { icon: Truck, label: "Free Shipping" },
                { icon: Shield, label: "2-Year Warranty" },
                { icon: Zap, label: "Fast Delivery" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-store-text-muted">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-store-accent/10">
                    <Icon className="h-4 w-4 text-store-accent" />
                  </div>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Hero Visual */}
          <div className="relative flex items-center justify-center animate-fade-in-up delay-200">
            <div className="relative w-full max-w-md mx-auto">
              {/* Main card */}
              <div className="relative rounded-3xl bg-gradient-to-br from-store-primary to-store-primary-dark p-1 shadow-2xl shadow-store-primary/30 animate-float">
                <div className="rounded-[1.4rem] bg-gradient-to-br from-store-primary via-store-primary-light to-store-accent p-8 sm:p-12">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm">
                      <Zap className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Smart Gadgets</h3>
                    <p className="text-blue-100 text-sm">
                      Experience the future of mobile tech with our curated collection
                    </p>
                    <div className="pt-2">
                      <span className="inline-block rounded-full bg-white/20 backdrop-blur-sm px-5 py-2 text-sm font-semibold text-white">
                        Starting at LKR 500
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 rounded-2xl bg-white p-3 shadow-xl shadow-black/10 animate-float delay-300">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold text-store-text">Verified</div>
                    <div className="text-store-text-muted">1000+ Reviews</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 rounded-2xl bg-white p-3 shadow-xl shadow-black/10 animate-float delay-500">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-store-accent/10 flex items-center justify-center">
                    <Truck className="h-4 w-4 text-store-accent" />
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold text-store-text">Express</div>
                    <div className="text-store-text-muted">Next Day Delivery</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
