import { Link } from "react-router-dom";
import {
  Smartphone,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";

const footerLinks = {
  Shop: [
    { label: "All Products", path: "/products" },
    { label: "Phone Cases", path: "/categories/cases" },
    { label: "Chargers", path: "/categories/chargers" },
    { label: "Earbuds", path: "/categories/earbuds" },
    { label: "Smart Gadgets", path: "/categories/gadgets" },
  ],
  Support: [
    { label: "Help Center", path: "/help" },
    { label: "Shipping Info", path: "/shipping" },
    { label: "Returns", path: "/returns" },
    { label: "Order Tracking", path: "/tracking" },
  ],
  Company: [
    { label: "About Us", path: "/about" },
    { label: "Careers", path: "/careers" },
    { label: "Blog", path: "/blog" },
    { label: "Contact", path: "/contact" },
  ],
};

const socials = [
  { Icon: Facebook, href: "#", label: "Facebook" },
  { Icon: Twitter, href: "#", label: "Twitter" },
  { Icon: Instagram, href: "#", label: "Instagram" },
  { Icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer id="main-footer" className="bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-store-primary via-store-accent to-store-primary" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-store-primary to-store-accent shadow-lg shadow-store-primary/20">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-white">Tech</span>
                <span className="text-store-accent">Nest</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Your one-stop destination for premium mobile accessories. From sleek phone cases to cutting-edge smart gadgets, we've got everything to elevate your mobile experience.
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-slate-400 text-sm">
                <Mail className="h-4 w-4 text-store-accent" />
                support@technest.com
              </div>
              <div className="flex items-center gap-2.5 text-slate-400 text-sm">
                <Phone className="h-4 w-4 text-store-accent" />
                +94 77 123 1234
              </div>
              <div className="flex items-center gap-2.5 text-slate-400 text-sm">
                <MapPin className="h-4 w-4 text-store-accent" />
                123, Galle Road, Colombo 03, Sri Lanka
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map(({ label, path }) => (
                  <li key={path}>
                    <Link
                      to={path}
                      className="text-sm text-slate-400 hover:text-store-accent transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} TechNest. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-store-primary/20 hover:text-store-primary transition-all duration-200"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
