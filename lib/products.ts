export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Vela Coco",
    price: 199,
    image: "/images/products/VelaCoco.jpeg",
  },
  {
    id: 2,
    name: "Vela Violeta",
    price: 229,
    image: "/images/products/VelaVioleta.jpeg",
  },
  {
    id: 3,
    name: "Veladora Canela",
    price: 189,
    image: "/images/products/veladora-aromatica-de-canela.jpeg",
  },
  {
    id: 4,
    name: "Naranja Mandarina",
    price: 209,
    image: "/images/products/veladora-aromatica-de-naranja-mandarina.jpeg",
  },
  {
    id: 5,
    name: "Palo Santo",
    price: 179,
    image: "/images/products/PaloSanto.jpeg",
  },
  {
    id: 6,
    name: "Tabla Ritual",
    price: 249,
    image: "/images/products/Tabla.jpeg",
  },
  {
    id: 7,
    name: "Vela Rosas",
    price: 219,
    image: "/images/products/VelaRosas.jpeg",
  },
  {
    id: 8,
    name: "Parafina Natural",
    price: 159,
    image: "/images/products/Parafina.jpeg",
  },
];
