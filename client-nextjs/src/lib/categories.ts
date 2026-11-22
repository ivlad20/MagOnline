import {
  Laptop,
  Cpu,
  Mouse,
  Smartphone,
  Tablet,
  Gamepad2,
  Tv,
  Car,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface MainCategory {
  /** Valoarea exactă din coloana `category` din baza de date */
  value: string;
  label: string;
  icon: LucideIcon;
  /** Valori pentru coloana `subcategory` */
  subcategories: string[];
}

export const CATEGORIES: MainCategory[] = [
  {
    value: "Laptopuri",
    label: "Laptopuri",
    icon: Laptop,
    subcategories: ["Laptopuri gaming", "Ultrabook-uri", "Laptopuri business", "Accesorii laptop"],
  },
  {
    value: "Componente PC",
    label: "Componente PC",
    icon: Cpu,
    subcategories: [
      "Placi Video",
      "Procesoare",
      "Placa de baza",
      "Memorii RAM",
      "Surse PC",
      "Cooler Procesor",
      "SSD-uri",
      "Rack Hard-Disk",
    ],
  },
  {
    value: "Periferice PC",
    label: "Periferice PC",
    icon: Mouse,
    subcategories: ["Mouse", "Mousepad", "Tastaturi", "Monitoare", "Casti gaming", "Camere web"],
  },
  {
    value: "Smartphone-uri",
    label: "Telefoane",
    icon: Smartphone,
    subcategories: ["iPhone", "Android", "Huse si folii", "Incarcatoare"],
  },
  {
    value: "Tablete",
    label: "Tablete",
    icon: Tablet,
    subcategories: ["iPad", "Galaxy Tab", "Accesorii tablete"],
  },
  {
    value: "Console",
    label: "Console & Gaming",
    icon: Gamepad2,
    subcategories: ["PlayStation", "Xbox", "Nintendo", "Jocuri", "Accesorii gaming"],
  },
  {
    value: "TV, Audio-Video & Foto",
    label: "TV, Audio-Video & Foto",
    icon: Tv,
    subcategories: [
      "Televizoare",
      "Playere, Boxe & Casti",
      "Aparate foto",
      "Baterii, acumulatori si incarcatoare",
    ],
  },
  {
    value: "Auto, Moto & RCA",
    label: "Auto, Moto & RCA",
    icon: Car,
    subcategories: ["Trotinete Electrice", "Camere auto", "Accesorii auto"],
  },
  {
    value: "Ingrijire personala & Cosmetice",
    label: "Îngrijire personală",
    icon: Sparkles,
    subcategories: ["Parfumuri", "Aparate de ras", "Ingrijirea parului"],
  },
];

export function categoryHref(category: string, subcategory?: string) {
  const base = `/category/${encodeURIComponent(category)}`;
  return subcategory ? `${base}?subcategory=${encodeURIComponent(subcategory)}` : base;
}
