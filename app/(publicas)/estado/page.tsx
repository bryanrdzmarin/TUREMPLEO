"use client";

import { useState } from "react";

interface Resultado {
  nombre: string;
  ci: string;
  plaza: string;
  estado: string;
  mensaje: string;
  fecha: string;
}

export default function EstadoPage() {
  const [ci, setCi] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultado, setResultado] = useState<Resultado | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResultado(null);

    if (!ci || !pin) {
      setError("Complete todos los campos");
      return;
    }

    if (!/^\d{11}$/.test(ci)) {
      setError("El CI debe tener 11 dígitos");
      return;
    }

    if (!/^\d{6}$/.test(pin)) {
      setError("El PIN debe tener 6 dígitos");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/consulta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ci, pin }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al consultar");
        setLoading(false);
        return;
      }

      setResultado(data);
    } catch {
      setError("Error de conexión");
    }

    setLoading(false);
  };

  const getEstadoInfo = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-300",
          icono: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
          titulo: "Solicitud en Revisión",
        };
      case "aprobado":
        return {
          color: "bg-green-100 text-green-800 border-green-300",
          icono: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
          titulo: "Solicitud Aprobada",
        };
      case "citado":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-300",
          icono: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
          titulo: "Tiene Cita Programada",
        };
      case "entrevista_aprobada":
        return {
          color: "bg-emerald-100 text-emerald-800 border-emerald-300",
          icono: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
          titulo: "En Reserva Laboral",
        };
      case "entrevista_rechazada":
        return {
          color: "bg-red-100 text-red-800 border-red-300",
          icono: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
          titulo: "Entrevista No Aprobada",
        };
      case "rechazado":
        return {
          color: "bg-red-100 text-red-800 border-red-300",
          icono: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
          titulo: "Solicitud Rechazada",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-300",
          icono: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
          titulo: "Estado",
        };
    }
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-8 px-4">
      <div className="container mx-auto max-w-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#002A8F] mb-2">
            Consultar Estado
          </h1>
          <p className="text-gray-600">
            Ingrese su Carné de Identidad y PIN de seguimiento
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carné de Identidad
              </label>
              <input
                type="text"
                value={ci}
                onChange={(e) => setCi(e.target.value.replace(/\D/g, "").slice(0, 11))}
                placeholder="11 dígitos"
                maxLength={11}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent outline-none text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PIN de Seguimiento
              </label>
              <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6 dígitos"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent outline-none text-lg font-mono tracking-widest text-center"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#002A8F] text-white font-semibold rounded-lg hover:bg-[#003a99] transition-colors disabled:opacity-50"
            >
              {loading ? "Consultando..." : "Consultar Estado"}
            </button>
          </form>
        </div>

        {resultado && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Resultado de su Solicitud
            </h2>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Candidato:</span>
                  <span className="font-medium text-gray-800">{resultado.nombre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CI:</span>
                  <span className="font-medium text-gray-800">{resultado.ci}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Plaza:</span>
                  <span className="font-medium text-gray-800">{resultado.plaza}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-medium text-gray-800">{formatFecha(resultado.fecha)}</span>
                </div>
              </div>
            </div>

            <div className={`border-2 rounded-xl p-6 text-center ${getEstadoInfo(resultado.estado).color}`}>
              <svg
                className="w-16 h-16 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={getEstadoInfo(resultado.estado).icono}
                />
              </svg>
              <h3 className="text-xl font-bold mb-2">
                {getEstadoInfo(resultado.estado).titulo}
              </h3>
              <p className="text-sm opacity-90">
                {resultado.mensaje}
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-[#002A8F] hover:underline text-sm"
          >
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}
