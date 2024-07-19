# Grayola Test
## Descripción
Este proyecto es una aplicación web desarrollada con Next.js y Supabase. Permite a los usuarios registrarse o iniciar sesión con Google y define automáticamente un rol (Cliente, Diseñador o Project Manager) durante el registro. Cada rol tiene diferentes vistas y funcionalidades dentro de la aplicación.
Miralo en 
## Características
- Autenticación de usuarios (registro e inicio de sesión con Google)
- Definición de roles: Cliente, Diseñador y Project Manager
- Vistas personalizadas basadas en el rol del usuario
- Gestión de proyectos:
- Clientes: Ver y crear proyectos
- Project Managers: Modificar y asignar proyectos a diseñadores
- Diseñadores: Ver proyectos asignados
- Base de datos en tiempo real con Supabase
- Gestión de estados y funcionalidades con Context API
- Estilos personalizados con Tailwind CSS
- Componentes modales y popups con ShadCN
## Requisitos Previos
- Node.js (versión 14 o superior)
- NPM o Yarn
- Cuenta de Supabase
## Instalación
1. Clona el repositorio:
```
git clone https://github.com/JDGuzman2001/grayola-test.git
cd grayola-test
```
2. Instala las dependencias:
```
npm install
```
o si usas Yarn:
```
yarn install
```
Este comando instalará todas las dependencias listadas en el archivo package.json, incluyendo shadcn y otros paquetes necesarios.
## Configuración
1. Crea un archivo .env.local en la raíz del proyecto y añade las siguientes variables de entorno:
env
```
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```
2. Configura tu instancia de Supabase:
Ve a Supabase y crea un proyecto.
En la configuración del proyecto, obtén la URL y la clave anónima y añádelas a tu archivo .env.local.
## Uso
1. Inicia el servidor de desarrollo:
```
npm run dev
```
o si usas Yarn:
```
yarn dev
```
2. Abre http://localhost:3000 en tu navegador para ver la aplicación en funcionamiento.

## Estructura del Proyecto
```
/.
├── actions/
│   └── index.ts
├── app/
│   ├── assign/
│   │   └── page.tsx
│   ├── client/
│   │   └── page.tsx
│   ├── designer/
│   │   ├── projects/
│   │       └── [slug]/
│   │   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── loading/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── modify/
│   │   └── [slug]/
│   │   │   └── page.tsx
│   ├── project-manager/
│   │   └── page.tsx
│   ├── projects/
│   │   └── [slug]/
│   │   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── global.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── command.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── menubar.tsx
│   │   ├── popover.tsx
│   │   ├── progress.tsx
│   │   ├── select.tsx
│   │   └── textarea.tsx
│   ├── assignclient.tsx
│   ├── designer-card.tsx
│   ├── designerclient.tsx
│   ├── designerprojectclient.tsx
│   ├── logoutbutton.tsx
│   ├── modifyclient.tsx
│   ├── project-card.tsx
│   ├── projectclient.tsx
│   ├── selectdesigner.tsx
│   ├── selectproject.tsx
│   ├── submit-button-project.tsx
│   ├── submit-button-update.tsx
│   ├── submit-button.tsx
│   └── updateinfo.tsx
├── context/
│   └── UserContex/
│       └── userContext.tsx
├── lib/
│   └── utils.ts
├── public/
│   ├── Google_Logo.svg
│   ├── Google__G__logo.svg
│   ├── GrayolaIcon.svg
│   ├── next.svg
│   └── vercel.ts
├── supabase/
│   └── client.ts
├── types/
│   └── project/
│   │   └── index.ts
├── .eslintrc.json
├── .gitignore
├── README.md
├── components.json
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind,config.ts
└── tsconfig.json
```
## Demo
Puedes ver una demo en funcionamiento de la aplicación en el siguiente enlace: [Demo](https://grayola-test-ee72.vercel.app/)  en Vercel
