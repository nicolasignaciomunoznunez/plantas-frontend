// src/utils/roles.js

/**
 * Utilidades para gestión de roles y permisos
 * Centraliza toda la lógica de autorización
 */

export const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin', 
  TECNICO: 'tecnico',
  CLIENTE: 'cliente'
};

// ==================== VERIFICACIONES DE ROL ====================

/**
 * Verifica si el usuario es Superadmin (acceso total)
 */
export const esSuperAdmin = (usuario) => usuario?.rol === ROLES.SUPERADMIN;

/**
 * Verifica si el usuario puede administrar (Superadmin o Admin)
 */
export const puedeAdministrar = (usuario) => 
  esSuperAdmin(usuario) || usuario?.rol === ROLES.ADMIN;

/**
 * Verifica si el usuario puede gestionar plantas
 */
export const puedeGestionarPlantas = (usuario) =>
  esSuperAdmin(usuario) || 
  usuario?.rol === ROLES.ADMIN || 
  usuario?.rol === ROLES.TECNICO;

/**
 * Verifica si el usuario puede ver TODAS las plantas (solo Superadmin)
 */
export const puedeVerTodasPlantas = (usuario) =>
  esSuperAdmin(usuario);

/**
 * Verifica si el usuario puede asignar técnicos
 */
export const puedeAsignarTecnicos = (usuario) =>
  esSuperAdmin(usuario) || usuario?.rol === ROLES.ADMIN;

/**
 * Verifica si el usuario puede gestionar usuarios
 */
export const puedeGestionarUsuarios = (usuario) =>
  esSuperAdmin(usuario);

// ==================== VERIFICACIONES ESPECÍFICAS ====================

/**
 * Verifica si el usuario tiene un rol específico
 */
export const tieneRol = (usuario, rol) => usuario?.rol === rol;

/**
 * Verifica si el usuario tiene alguno de los roles especificados
 */
export const tieneAlgunRol = (usuario, roles) => 
  usuario?.rol && roles.includes(usuario.rol);

/**
 * Verifica si el usuario puede ver una planta específica
 * (basado en sus permisos de rol)
 */
export const puedeVerPlanta = (usuario, planta) => {
  if (!usuario || !planta) return false;
  
  switch (usuario.rol) {
    case ROLES.SUPERADMIN:
      return true; // Ve todo
    case ROLES.ADMIN:
    case ROLES.TECNICO:
      return planta.tecnicoId === usuario.id; // Solo sus plantas asignadas
    case ROLES.CLIENTE:
      return planta.clienteId === usuario.id; // Solo su planta
    default:
      return false;
  }
};

// ==================== HELPERS PARA COMPONENTES ====================

/**
 * Obtiene el nombre legible del rol
 */
export const obtenerNombreRol = (rol) => {
  const nombres = {
    [ROLES.SUPERADMIN]: 'Super Administrador',
    [ROLES.ADMIN]: 'Administrador',
    [ROLES.TECNICO]: 'Técnico',
    [ROLES.CLIENTE]: 'Cliente'
  };
  return nombres[rol] || rol;
};

/**
 * Obtiene los roles que pueden ser asignados por el usuario actual
 */
export const obtenerRolesAsignables = (usuarioActual) => {
  if (esSuperAdmin(usuarioActual)) {
    return [ROLES.ADMIN, ROLES.TECNICO, ROLES.CLIENTE];
  }
  if (usuarioActual?.rol === ROLES.ADMIN) {
    return [ROLES.TECNICO, ROLES.CLIENTE];
  }
  return [];
};