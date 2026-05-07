"use client";

import { useEffect, useState } from "react";

interface Usuario {
  id: number;
  nombreUsuario: string;
  nombre: string;
  email: string;
  rol: string;
  creadoEn: string;
}

type ModalMode = "create" | "edit" | null;

const USERNAME_REGEX = /^[a-zA-Z0-9_]{5,30}$/;

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Usuario | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [formNombreUsuario, setFormNombreUsuario] = useState("");
  const [formNombre, setFormNombre] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRol, setFormRol] = useState("reclutador");
  const [usernameError, setUsernameError] = useState("");
  const [resettingUserId, setResettingUserId] = useState<number | null>(null);

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/usuarios");
      if (!res.ok) throw new Error("Error al cargar usuarios");
      const data = await res.json();
      setUsuarios(data);
    } catch {
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const openCreate = () => {
    setFormNombreUsuario("");
    setFormNombre("");
    setFormEmail("");
    setFormPassword("");
    setFormRol("reclutador");
    setUsernameError("");
    setEditingUser(null);
    setModalMode("create");
  };

  const openEdit = (user: Usuario) => {
    setFormNombreUsuario(user.nombreUsuario);
    setFormNombre(user.nombre);
    setFormEmail(user.email);
    setFormPassword("");
    setFormRol(user.rol);
    setUsernameError("");
    setEditingUser(user);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingUser(null);
    setUsernameError("");
  };

  const handleUsernameChange = (value: string) => {
    setFormNombreUsuario(value);
    if (modalMode === "create" && !USERNAME_REGEX.test(value) && value.length > 0) {
      setUsernameError("Solo letras, números y guión bajo (5-30 caracteres)");
    } else {
      setUsernameError("");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!USERNAME_REGEX.test(formNombreUsuario)) {
      showNotification("error", "El nombre de usuario debe tener entre 5 y 30 caracteres, solo letras, números y guión bajo");
      return;
    }
    try {
      const res = await fetch("/api/admin/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreUsuario: formNombreUsuario,
          nombre: formNombre,
          email: formEmail,
          password: formPassword,
          rol: formRol,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showNotification("error", data.error || "Error al crear usuario");
        return;
      }
      showNotification("success", "Usuario creado exitosamente");
      closeModal();
      loadUsuarios();
    } catch {
      showNotification("error", "Error de conexión");
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const body: Record<string, string> = {
        nombre: formNombre,
        email: formEmail,
        rol: formRol,
      };
      if (formPassword) {
        body.password = formPassword;
      }
      const res = await fetch(`/api/admin/usuarios/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        showNotification("error", data.error || "Error al editar usuario");
        return;
      }
      showNotification("success", "Usuario actualizado exitosamente");
      closeModal();
      loadUsuarios();
    } catch {
      showNotification("error", "Error de conexión");
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const res = await fetch("/api/admin/usuarios", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteConfirm.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        showNotification("error", data.error || "Error al eliminar usuario");
        return;
      }
      showNotification("success", "Usuario eliminado");
      setDeleteConfirm(null);
      loadUsuarios();
    } catch {
      showNotification("error", "Error de conexión");
    }
  };

  const [generatingPassword, setGeneratingPassword] = useState(false);

  const handleForceReset = async (user: Usuario) => {
    setResettingUserId(user.id);
    try {
      const res = await fetch("/api/admin/usuarios", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, action: "force-reset" }),
      });
      const data = await res.json();
      if (!res.ok) {
        showNotification("error", data.error || "Error al enviar reset");
        return;
      }
      showNotification("success", `Email de reset enviado a ${user.email}`);
    } catch {
      showNotification("error", "Error de conexión");
    } finally {
      setResettingUserId(null);
    }
  };

  const handleGeneratePassword = async () => {
    if (!editingUser) return;
    setGeneratingPassword(true);
    try {
      const res = await fetch(`/api/admin/usuarios/${editingUser.id}/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) {
        showNotification("error", data.error || "Error al generar contraseña");
        return;
      }
      showNotification("success", `Nueva contraseña generada y enviada a ${editingUser.email}`);
    } catch {
      showNotification("error", "Error de conexión");
    } finally {
      setGeneratingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#002A8F] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-[#002A8F] text-white rounded-lg hover:bg-[#001F5C] transition-colors text-sm font-medium"
        >
          + Nuevo usuario
        </button>
      </div>

      {notification && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-sm ${
            notification.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {usuarios.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-600">{u.id}</td>
                <td className="px-6 py-4 text-sm text-gray-800 font-medium">{u.nombreUsuario}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{u.nombre}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      u.rol === "admin"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {u.rol}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(u.creadoEn).toLocaleDateString("es")}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(u)}
                      className="px-3 py-1 text-xs font-medium text-[#002A8F] border border-[#002A8F] rounded hover:bg-[#002A8F] hover:text-white transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleForceReset(u)}
                      disabled={resettingUserId === u.id}
                      className="px-3 py-1 text-xs font-medium text-amber-600 border border-amber-600 rounded hover:bg-amber-600 hover:text-white transition-colors disabled:opacity-50"
                    >
                      {resettingUserId === u.id ? "Enviando..." : "Reset"}
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(u)}
                      className="px-3 py-1 text-xs font-medium text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {usuarios.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No hay usuarios registrados.
          </div>
        )}
      </div>

      {modalMode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                {modalMode === "create" ? "Nuevo usuario" : "Editar usuario"}
              </h2>
            </div>
            <form onSubmit={modalMode === "create" ? handleCreate : handleEdit} className="p-6 space-y-4">
              {modalMode === "create" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de usuario</label>
                  <input
                    type="text"
                    value={formNombreUsuario}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent outline-none ${usernameError ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Solo letras, números y guión bajo (5-30 chars)"
                    required
                  />
                  {usernameError && (
                    <p className="mt-1 text-xs text-red-600">{usernameError}</p>
                  )}
                </div>
              )}
              {modalMode === "edit" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de usuario</label>
                  <input
                    type="text"
                    value={formNombreUsuario}
                    disabled
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500">El nombre de usuario no se puede cambiar</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña{modalMode === "edit" ? " (actual)" : ""}
                </label>
                {modalMode === "edit" ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value="••••••••"
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed select-none"
                    />
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      disabled={generatingPassword}
                      className="shrink-0 px-3 py-2 text-xs font-medium text-emerald-700 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors disabled:opacity-50 whitespace-nowrap"
                    >
                      {generatingPassword ? "Generando..." : "Generar nueva"}
                    </button>
                  </div>
                ) : (
                  <input
                    type="password"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent outline-none"
                    required
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select
                  value={formRol}
                  onChange={(e) => setFormRol(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-transparent outline-none"
                >
                  <option value="reclutador">Reclutador</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#002A8F] text-white rounded-lg hover:bg-[#001F5C] transition-colors"
                >
                  {modalMode === "create" ? "Crear" : "Guardar cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirmar eliminación</h3>
              <p className="text-sm text-gray-600 mb-4">
                ¿Estás seguro de que quieres eliminar a <strong>{deleteConfirm.nombre}</strong>? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
