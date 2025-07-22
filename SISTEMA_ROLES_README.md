# Sistema de Roles - Hotel Carita

## 📋 Descripción

El sistema de roles controla qué secciones del menú puede ver cada usuario basándose en su rol almacenado en localStorage.

## 🎯 Roles Disponibles

### 👑 **Admin** (admin@caritafeliz.com)
- **Email específico**: `admin@caritafeliz.com`
- **Acceso completo** a todas las secciones:
  - ✅ Productos (Lista de productos + Historial de stock)
  - ✅ Habitaciones
  - ✅ Clientes
  - ✅ Página de Inicio

### 👤 **User** (cualquier otro email)
- **Cualquier email diferente** a `admin@caritafeliz.com`
- **Acceso a la mayoría de secciones**:
  - ✅ Productos (Solo Lista de productos - Solo lectura)
  - ✅ Habitaciones
  - ✅ Clientes
  - ❌ Historial de Stock (solo admin)
  - ❌ Página de Inicio (solo admin)
  - ❌ Agregar/Editar Productos (solo admin)

## 🔧 Implementación Técnica

### 1. Lógica de Determinación de Roles
```typescript
// Lógica simple y directa
const determinedRole = userData.email === 'admin@caritafeliz.com' ? 'admin' : 'user'
```

**Reglas:**
- ✅ **admin@caritafeliz.com** → Rol ADMIN (acceso completo + funciones de edición)
- ✅ **Cualquier otro email** → Rol USER (acceso de solo lectura, excepto Historial de Stock, Página de Inicio y edición de productos)

### 2. Hook `useUserRole`
```typescript
// src/hooks/useUserRole.ts
const { userRole, user, isLoading, isAdmin, isUser } = useUserRole()
```

**Retorna:**
- `userRole`: string - Rol actual del usuario
- `user`: User | null - Datos completos del usuario
- `isLoading`: boolean - Estado de carga
- `isAdmin`: boolean - true si es admin
- `isUser`: boolean - true si es user

### 3. Fuentes de Datos
El hook busca el rol del usuario en este orden:

1. **localStorage.getItem('user')** - Objeto usuario completo
2. **localStorage.getItem('accessToken')** - Token JWT decodificado
3. **Por defecto**: 'user'

### 4. Flujo de Autenticación
1. **Login** → NextAuth → Backend API
2. **Backend** responde con: `{ id, correo, nombre, rol, token }`
3. **NextAuth** guarda en sesión: `{ id, email, name, rol, accessToken }`
4. **Login** guarda en localStorage: `{ id, email, name, role }`
5. **useUserRole** lee desde localStorage y determina rol por email:
   - `admin@caritafeliz.com` → **ADMIN**
   - Cualquier otro email → **USER**

### 5. Menú Condicional
```typescript
// Productos - Producto visible para todos, Historial solo para admin
<SubMenu label="Productos" icon={<i className='tabler-package' />}>
  <MenuItem href={`/${locale}/apps/productos/list`}>Producto</MenuItem>
  {isAdmin && (
    <MenuItem href={`/${locale}/apps/stock/list`}>Historial de Stock</MenuItem>
  )}
</SubMenu>

// Habitaciones - Visible para todos
<SubMenu label="Habitaciones" icon={<i className='tabler-bed' />}>
  <MenuItem href={`/${locale}/apps/habitaciones/list`}>Habitaciones</MenuItem>
</SubMenu>

// Clientes - Visible para todos
<SubMenu label="Clientes" icon={<i className='tabler-users' />}>
  <MenuItem href={`/${locale}/apps/clientes/list`}>Lista de Clientes</MenuItem>
</SubMenu>

// Página de Inicio - Solo visible para admin
{isAdmin && (
  <SubMenu label="Pagina de Inicio" icon={<i className='tabler-files' />}>
    <MenuItem href='/front-pages/landing-page' target='_blank'>
      Pagina de Inicio
    </MenuItem>
  </SubMenu>
)}
```

## 📝 Estructura de Datos Esperada

### En localStorage como 'user':
```json
{
  "id": 1,
  "email": "admin@caritafeliz.com",
  "name": "Administrador"
}
```

### En JWT Token (decodificado):
```json
{
  "sub": 1,
  "email": "admin@caritafeliz.com",
  "name": "Administrador"
}
```

## 📋 Resumen de Permisos

### 👑 Admin (admin@caritafeliz.com):
- ✅ Productos (Lista + Historial de Stock + Agregar/Editar)
- ✅ Habitaciones
- ✅ Clientes
- ✅ Página de Inicio

### 👤 User (cualquier otro email):
- ✅ Productos (Solo Lista - Solo lectura)
- ✅ Habitaciones
- ✅ Clientes
- ❌ Historial de Stock
- ❌ Página de Inicio
- ❌ Agregar/Editar Productos

## 🚀 Cómo Probar

### Para Usuario Admin:
```javascript
// En la consola del navegador
localStorage.setItem('user', JSON.stringify({
  id: 1,
  email: 'admin@caritafeliz.com',
  name: 'Administrador'
}))
// El rol se determina automáticamente por el email
```

### Para Usuario Normal:
```javascript
// En la consola del navegador
localStorage.setItem('user', JSON.stringify({
  id: 2,
  email: 'usuario@caritafeliz.com',
  name: 'Usuario'
}))
// El rol se determina automáticamente por el email
```

## 🔄 Actualización Automática

El sistema se actualiza automáticamente cuando:
- Se modifica localStorage
- Se cambia el token de acceso
- Se recarga la página

## 🛡️ Seguridad

- **Frontend Only**: Esta implementación es solo para UI
- **Backend Validation**: Siempre validar permisos en el backend
- **Token Expiration**: Los tokens JWT tienen expiración
- **Fallback**: Si no hay datos, se asume rol 'user'

## 📱 Componentes Relacionados

1. **VerticalMenu.tsx** - Menú principal con permisos
2. **useUserRole.ts** - Hook para obtener rol del usuario
3. **UserInfo.tsx** - Componente para mostrar info del usuario
4. **RoleDebug.tsx** - Componente de debug para testing
5. **Login.tsx** - Guarda información del usuario en localStorage

## 🎨 Características Visuales

- **Iconos específicos** para cada sección
- **Chips de rol** en la información del usuario
- **Estados de carga** mientras se obtiene el rol
- **Menú responsivo** que se adapta al contenido visible

## 🔍 Debugging

### Componente de Debug
Se incluye un componente `RoleDebug` que aparece como botón flotante en la esquina inferior derecha. Permite:
- Ver el estado actual del usuario
- Simular roles (Admin/User)
- Limpiar localStorage
- Ver contenido de localStorage

### Consola del Navegador
Para verificar el estado del usuario:
```javascript
// En la consola del navegador
console.log('Usuario:', JSON.parse(localStorage.getItem('user')))
console.log('Token:', localStorage.getItem('accessToken'))
```

## 📋 Checklist de Implementación

- ✅ Hook useUserRole creado
- ✅ Menú vertical con permisos
- ✅ Componente UserInfo actualizado
- ✅ Documentación completa
- ✅ Manejo de errores
- ✅ Estados de carga
- ✅ Actualización automática 
