"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Package, ShoppingBag, Plus, TrendingUp, DollarSign, Tag } from "lucide-react";
import { useFetchProductsQuery } from "@/store/features/products/productsApi";
import { useFetchOrdersQuery } from "@/store/features/orders/ordersApi";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function DashboardView() {
  const { data: productsData, isLoading: isLoadingProducts } = useFetchProductsQuery({ page: 1, limit: 100 }, { skip: false });
  const { data: ordersData, isLoading: isLoadingOrders } = useFetchOrdersQuery({ page: 1, limit: 100 }, { skip: false });
  
  const products = productsData?.data ?? [];
  const orders = ordersData?.data ?? [];
  
  const totalProducts = products.length;
  const activeProducts = products.filter((p: Product) => p.isActive).length;
  const productsOnSale = products.filter((p: Product) => p.isOnSale).length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o: Order) => o.status === "pending").length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-white to-black/5">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="mb-2">
            <p className="text-xs uppercase tracking-[0.4em] text-black/50">
              Panel de administración
            </p>
          </div>
          <h1 className="text-4xl font-semibold tracking-[0.05em] sm:text-5xl lg:text-6xl">
            Dashboard
          </h1>
          <p className="mt-3 text-base text-black/60 sm:text-lg">
            Administra tus productos, pedidos y ventas desde un solo lugar
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div
            variants={cardVariants}
            className="group relative overflow-hidden rounded-[32px] border border-black/10 bg-white p-6 shadow-[0_16px_36px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-black/5 blur-2xl transition-transform duration-700 group-hover:scale-150" />
            <div className="relative">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-black/10 bg-gradient-to-br from-black/5 to-black/10">
                <Package size={28} className="text-black/80" aria-hidden="true" />
              </div>
              <p className="text-4xl font-bold tracking-tight">
                {isLoadingProducts ? "..." : totalProducts}
              </p>
              <p className="mt-1 text-sm font-medium text-black/60">Total productos</p>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="group relative overflow-hidden rounded-[32px] border border-black/10 bg-white p-6 shadow-[0_16px_36px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-green-500/10 blur-2xl transition-transform duration-700 group-hover:scale-150" />
            <div className="relative">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-500/5">
                <TrendingUp size={28} className="text-green-700" aria-hidden="true" />
              </div>
              <p className="text-4xl font-bold tracking-tight">
                {isLoadingProducts ? "..." : activeProducts}
              </p>
              <p className="mt-1 text-sm font-medium text-black/60">Activos</p>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="group relative overflow-hidden rounded-[32px] border border-black/10 bg-white p-6 shadow-[0_16px_36px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-red-500/10 blur-2xl transition-transform duration-700 group-hover:scale-150" />
            <div className="relative">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-red-500/5">
                <DollarSign size={28} className="text-red-700" aria-hidden="true" />
              </div>
              <p className="text-4xl font-bold tracking-tight">
                {isLoadingProducts ? "..." : productsOnSale}
              </p>
              <p className="mt-1 text-sm font-medium text-black/60">En oferta</p>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="group relative overflow-hidden rounded-[32px] border border-black/10 bg-white p-6 shadow-[0_16px_36px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl transition-transform duration-700 group-hover:scale-150" />
            <div className="relative">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                <ShoppingBag size={28} className="text-blue-700" aria-hidden="true" />
              </div>
              <p className="text-4xl font-bold tracking-tight">
                {isLoadingOrders ? "..." : totalOrders}
              </p>
              <p className="mt-1 text-sm font-medium text-black/60">Pedidos</p>
              {pendingOrders > 0 && (
                <p className="mt-1 text-xs font-semibold text-blue-700">
                  {pendingOrders} pendientes
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-6 lg:grid-cols-3"
        >
          {/* Products Card */}
          <motion.div
            variants={cardVariants}
            className="group relative overflow-hidden rounded-[32px] border border-black/10 bg-white p-8 shadow-[0_16px_36px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-black/5 blur-3xl transition-transform duration-700 group-hover:scale-150" />
            <div className="relative">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-black/10 bg-gradient-to-br from-black/5 to-black/10">
                    <Package size={32} className="text-black/80" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold tracking-[0.05em]">Productos</h2>
                    <p className="mt-1 text-sm text-black/60">
                      Gestiona tu catálogo
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Link
                  href="/admin/products"
                  className="group/btn flex w-full items-center justify-between rounded-2xl border border-black/10 bg-black/5 px-6 py-4 transition-all hover:bg-black hover:text-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 transition-colors group-hover/btn:bg-white">
                      <Package size={20} className="text-black transition-colors group-hover/btn:text-black" aria-hidden="true" />
                    </div>
                    <span className="font-semibold">Ver todos los productos</span>
                  </div>
                  <span className="text-black/40 transition-colors group-hover/btn:text-white/80">→</span>
                </Link>
                
                <Link
                  href="/admin/products/new"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-black px-6 py-4 font-semibold uppercase tracking-[0.2em] text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <Plus size={20} aria-hidden="true" />
                  Agregar nuevo producto
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Orders Card */}
          <motion.div
            variants={cardVariants}
            className="group relative overflow-hidden rounded-[32px] border border-black/10 bg-white p-8 shadow-[0_16px_36px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl transition-transform duration-700 group-hover:scale-150" />
            <div className="relative">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                    <ShoppingBag size={32} className="text-blue-700" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold tracking-[0.05em]">Pedidos</h2>
                    <p className="mt-1 text-sm text-black/60">
                      Gestiona órdenes
                    </p>
                  </div>
                </div>
              </div>
              
              <Link
                href="/admin/orders"
                className="group/btn flex w-full items-center justify-between rounded-2xl border border-black/10 bg-black/5 px-6 py-4 transition-all hover:bg-black hover:text-white"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 transition-colors group-hover/btn:bg-white">
                    <ShoppingBag size={20} className="text-black transition-colors group-hover/btn:text-black" aria-hidden="true" />
                  </div>
                  <span className="font-semibold">Ver todos los pedidos</span>
                </div>
                <span className="text-black/40 transition-colors group-hover/btn:text-white/80">→</span>
              </Link>
            </div>
          </motion.div>

          {/* Categories Card */}
          <motion.div
            variants={cardVariants}
            className="group relative overflow-hidden rounded-[32px] border border-black/10 bg-white p-8 shadow-[0_16px_36px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-black/5 blur-3xl transition-transform duration-700 group-hover:scale-150" />
            <div className="relative">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-black/10 bg-gradient-to-br from-black/5 to-black/10">
                    <Tag size={32} className="text-black/80" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold tracking-[0.05em]">Categorías</h2>
                    <p className="mt-1 text-sm text-black/60">
                      Organiza productos
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Link
                  href="/admin/categories"
                  className="group/btn flex w-full items-center justify-between rounded-2xl border border-black/10 bg-black/5 px-6 py-4 transition-all hover:bg-black hover:text-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 transition-colors group-hover/btn:bg-white">
                      <Tag size={20} className="text-black transition-colors group-hover/btn:text-black" aria-hidden="true" />
                    </div>
                    <span className="font-semibold">Ver todas las categorías</span>
                  </div>
                  <span className="text-black/40 transition-colors group-hover/btn:text-white/80">→</span>
                </Link>
                
                <Link
                  href="/admin/categories/new"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-black px-6 py-4 font-semibold uppercase tracking-[0.2em] text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <Plus size={20} aria-hidden="true" />
                  Nueva categoría
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
