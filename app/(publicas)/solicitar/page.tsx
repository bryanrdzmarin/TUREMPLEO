/**
 * SolicitarPage - Página de solicitud de empleo.
 * Envuelve el formulario principal en un Suspense boundary para manejar
 * la carga de los search params de Next.js de forma segura.
 */
"use client";

import { Suspense } from "react";
import SolicitarForm from "@/components/publica/SolicitarForm";

export default function SolicitarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500">Cargando...</p>
        </div>
      </div>
    }>
      <SolicitarForm />
    </Suspense>
  );
}
