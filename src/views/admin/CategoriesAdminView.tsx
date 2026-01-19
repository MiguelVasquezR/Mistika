"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Plus, Edit, Trash2, Search, X, Package, ArrowLeft, AlertTriangle } from "lucide-react";
import {
  useFetchCategoriesQuery,
  useDeleteCategoryMutation,
} from "@/store/features/categories/categoriesApi";
import { getApiErrorMessage } from "@/store/features/api/getApiErrorMessage";
import toast from "react-hot-toast";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export function CategoriesAdminView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState<{ id: number; name: string } | null>(null);

  const {
    data: categoriesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchCategoriesQuery(undefined, { skip: false });

  const [deleteCategory] = useDeleteCategoryMutation();

  const categories = categoriesData?.data ?? [];
  const errorMessage = getApiErrorMessage(error);

  // Show all categories (not just active ones) for admin view
  const filteredCategories = categories.filter((category: Category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async () => {
    if (!showDeleteModal) return;

    try {
      await deleteCategory(showDeleteModal.id).unwrap();
      toast.success(`Categoría "${showDeleteModal.name}" eliminada correctamente.`);
      setShowDeleteModal(null);
      refetch();
    } catch (err: any) {
      const errorMsg = err?.data?.error || "Error al eliminar la categoría";
      toast.error(errorMsg);
      console.error("Error deleting category:", err);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-white to-black/5">
      <motion.div
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-10">
          <Link
            href="/admin"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-black/60 transition hover:text-black"
          >
            <ArrowLeft size={18} aria-hidden="true" />
            <span className="uppercase tracking-[0.2em]">Volver al dashboard</span>
          </Link>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2">
                <p className="text-xs uppercase tracking-[0.4em] text-black/50">
                  Administración
                </p>
              </div>
              <h1 className="mb-3 text-4xl font-semibold tracking-[0.05em] sm:text-5xl">
                Categorías
              </h1>
              <p className="text-base text-black/60">
                Gestiona las categorías de productos
              </p>
            </div>
            <Link
              href="/admin/categories/new"
              className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white shadow-md transition hover:bg-black/90 hover:translate-y-[-1px]"
            >
              <Plus size={18} aria-hidden="true" />
              Nueva Categoría
            </Link>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40"
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Buscar categorías por nombre o descripción..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-black/10 bg-white px-12 py-3 text-black placeholder:text-black/40 shadow-sm transition focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-black/50 hover:text-black/70"
                aria-label="Limpiar búsqueda"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="rounded-[32px] border border-black/10 bg-white p-16 text-center shadow-[0_16px_36px_rgba(0,0,0,0.08)]">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-black/10 border-t-black" />
            <p className="text-black/60">Cargando categorías...</p>
          </div>
        ) : isError ? (
          <div className="rounded-[32px] border border-black/10 bg-white p-16 text-center shadow-[0_16px_36px_rgba(0,0,0,0.08)]">
            <p className="text-red-600">
              {errorMessage ?? "No se pudieron cargar las categorías."}
            </p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="rounded-[32px] border border-black/10 bg-white p-16 text-center shadow-[0_16px_36px_rgba(0,0,0,0.08)]">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-black/10 bg-black/5">
              <Tag size={40} className="text-black/30" aria-hidden="true" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">No hay categorías</h2>
            <p className="mb-8 text-black/60">
              {searchQuery
                ? "No se encontraron categorías con ese criterio"
                : "Comienza creando tu primera categoría para organizar tus productos"}
            </p>
            {!searchQuery && (
              <Link
                href="/admin/categories/new"
                className="inline-flex items-center gap-2 rounded-full bg-black px-8 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white shadow-md transition hover:bg-black/90 hover:translate-y-[-1px]"
              >
                <Plus size={18} aria-hidden="true" />
                Crear Primera Categoría
              </Link>
            )}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {filteredCategories.map((category: Category, index: number) => (
              <motion.div key={category.id} variants={itemVariants}>
                <div className="group relative overflow-hidden rounded-[32px] border border-black/10 bg-white p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_16px_36px_rgba(0,0,0,0.12)] hover:-translate-y-1">
                  {/* Decorative background */}
                  <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-black/5 blur-2xl transition-transform duration-700 group-hover:scale-150" />

                  {/* Status badge */}
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] ${
                        category.isActive
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-gray-200 bg-gray-50 text-gray-600"
                      }`}
                    >
                      {category.isActive ? "Activa" : "Inactiva"}
                    </span>
                  </div>

                  {/* Icon and Name */}
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-black/10 bg-black/5">
                      <Tag size={24} className="text-black/70" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-xl font-bold tracking-[0.05em]">
                        {category.name}
                      </h3>
                      <p className="truncate text-sm text-black/50">{category.slug}</p>
                    </div>
                  </div>

                  {/* Description */}
                  {category.description && (
                    <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-black/70">
                      {category.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/categories/${category.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
                    >
                      <Edit size={16} aria-hidden="true" />
                      Editar
                    </Link>
                    <button
                      onClick={() => setShowDeleteModal({ id: category.id, name: category.name })}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
                      aria-label={`Eliminar categoría ${category.name}`}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowDeleteModal(null)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4"
              >
                <div className="relative overflow-hidden rounded-[32px] border border-black/10 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
                  <button
                    onClick={() => setShowDeleteModal(null)}
                    className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-black/10 bg-black/5 text-black/60 transition hover:bg-black/10"
                    aria-label="Cerrar"
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-red-200 bg-red-50">
                    <AlertTriangle size={32} className="text-red-600" aria-hidden="true" />
                  </div>
                  <h2 className="mb-3 text-center text-2xl font-semibold tracking-[0.05em]">
                    ¿Eliminar categoría?
                  </h2>
                  <p className="mb-8 text-center text-sm leading-relaxed text-black/70">
                    Estás a punto de eliminar la categoría <strong>"{showDeleteModal.name}"</strong>. Esta acción es irreversible y no se puede deshacer.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteModal(null)}
                      type="button"
                      className="flex-1 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-black transition hover:bg-black/5"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleDelete}
                      type="button"
                      className="flex-1 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
