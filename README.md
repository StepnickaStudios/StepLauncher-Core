
---

# 📦 StepLauncher-Core

> Módulo oficial de [StepnickaStudios](https://github.com/StepnickaStudios) para descargar y ejecutar versiones de Minecraft con progreso en tiempo real. Diseñado específicamente para launchers modernos como **StepLauncher**, pero también puede utilizarse en cualquier proyecto Node.js o Electron.

---

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![Electron](https://img.shields.io/badge/Compatible-Electron-blue)
![License](https://img.shields.io/github/license/StepnickaStudios/step-minecraft-downloader)

---

## 🌟 ¿Qué es StepLauncher-Core?

**StepLauncher-Core** es una librería JavaScript que permite:

- Descargar versiones de Minecraft directamente desde los servidores de Mojang.
- Mostrar el **progreso de descarga en tiempo real**, ideal para interfaces gráficas.
- Ejecutar versiones vanilla y modificadas como **Forge**, **NeoForge**, y próximamente **Fabric** y **OptiFine**.
- Integrarse fácilmente con proyectos en **Electron** (ideal para launchers personalizados).
- Controlar memoria, versión de Java, ruta de instalación y más.

Este módulo busca hacerte la vida más fácil si estás desarrollando tu propio launcher de Minecraft.

---

## 📦 Instalación

Para instalar el módulo:

```bash
npm install StepLauncher-Core
```

Asegúrate de tener **Node.js 18 o superior**.

---

## 🚀 ¿Cómo descargar Minecraft?

```js
const { downloadMinecraft } = require('StepLauncher-Core');

downloadMinecraft({
  root: '.StepLauncher',
  version: '1.20.4',
  type: 'release',
  onProgress: (info) => {
    console.log(`⏳ Progreso: ${info.percentage}% - Paso: ${info.step}`);
  }
});
```

### Explicación de parámetros:

| Nombre        | Tipo     | Descripción                                                                    |
|---------------|----------|--------------------------------------------------------------------------------|
| `root`        | `string` | Ruta de instalación. Por ejemplo: `.StepLauncher` o `C:/MiLauncher/Minecraft`. |
| `version`     | `string` | Versión de Minecraft a descargar, como `1.20.4`, `1.8.9`, `1.12.2`, etc.       |
| `type`        | `string` | Tipo de versión. Puede ser `release`, `snapshot`, `forge`, `neoforge`, etc.    |
| `onProgress`  | `func`   | Función que se ejecuta en cada paso de la descarga. Retorna un objeto con información del estado actual. |

---

## 📊 ¿Qué devuelve `onProgress`?

El parámetro `onProgress` es **una función de callback** que se ejecuta en cada cambio del progreso. Esto es ideal si estás trabajando con una barra de progreso o interfaz visual en tu launcher.

El objeto que se devuelve tiene esta estructura:

```js
{
  percentage: 38,             // Porcentaje completado
  step: 'Descargando assets', // Paso actual (ej. descargando JAR, assets, librerías)
  downloaded: 2745,           // Bytes descargados
  total: 8000                 // Bytes totales por descargar
}
```

Ejemplo práctico en consola:

```js
onProgress: (info) => {
  console.log(`⏳ ${info.percentage}% - ${info.step}`);
}
```

Ejemplo para interfaz gráfica (frontend):

```js
window.ElectronAPI.onProgressUpdate((info) => {
  progressBar.style.width = `${info.percentage}%`;
  progressText.textContent = `Paso: ${info.step} (${info.percentage}%)`;
});
```

---

## 💻 ¿Cómo ejecutar Minecraft?

Una vez descargado Minecraft, podés lanzarlo así:

```js
const { launchMinecraft } = require('StepLauncher-Core');

launchMinecraft({
  user: {
    username: 'step_user',
    uuid: '1234-5678-uuid',
  },
  version: '1.20.4',
  type: 'release',
  gameDirectory: '.StepLauncher',
  memory: {
    min: '2G',
    max: '4G',
  },
  java: 'C:/Program Files/Java/jdk-17/bin/java.exe', // [OPCIONAL] ELIGIRA EL JAVA POR DEFECTO QUE TENGA INSTALADO EL USUARIO
});
```

| Parámetro        | Descripción |
|------------------|-------------|
| `user`           | Objeto con el nombre de usuario y UUID. No necesita token si es sin login. |
| `version`        | La versión a ejecutar, debe estar descargada.                              |
| `type`           | `release`, `forge`, `neoforge`, etc.                                       |
| `gameDirectory`  | Carpeta donde se descargó Minecraft.                                       |
| `memory`         | Memoria mínima y máxima a asignar.                                         |
| `java`           | Ruta del ejecutable de Java. Si no se especifica, se usará el del sistema. |

---

## 🧪 Soporte para Forge, NeoForge y más

Este módulo **soporta versiones modificadas**, siempre que ya hayan sido instaladas:

```js
launchMinecraft({
  user: { username: 'player' },
  version: '1.12.2-forge-14.23.5.2860',
  type: 'forge',
  gameDirectory: '.StepLauncher',
  memory: { min: '2G', max: '6G' },
});
```

**Importante**: Para que funcione correctamente, asegúrate de instalar correctamente Forge/NeoForge en el mismo directorio (`root`) que usaste para descargar la versión base.

---

## 🖥️ Integración completa con Electron

### Backend (`main.js` o `main.ts`):

```js
const { downloadMinecraft } = require('StepLauncher-Core');

ipcMain.handle('installMinecraft', async (_event, version) => {
  await downloadMinecraft({
    root: '.StepLauncher',
    version,
    type: 'release',
    onProgress: (info) => {
      mainWindow.webContents.send('progressUpdate', info);
    }
  });

  return 'ok';
});
```

### Frontend (`renderer.js`):

```js
window.ElectronAPI.onProgressUpdate((info) => {
  const { percentage, step } = info;
  progressBar.style.width = `${percentage}%`;
  progressText.textContent = `Descargando: ${step} (${percentage}%)`;
});
```

Esto crea una experiencia visual **muy parecida a los launchers oficiales**, pero personalizada a tu gusto.

---

## 🧾 Configuración de usuarios desde archivo (opcional)

Podés guardar tus usuarios en un archivo `.json` para no tener que escribirlo siempre:

```json
[
  {
    "name": "step_user",
    "uuid": "1234-5678-91011"
  }
]
```

Y luego usar:

```js
launchMinecraft({
  usersConfig: './users.json',
  version: '1.20.4',
  type: 'release'
});
```

---

## 🛠️ Requisitos

- Node.js 18 o superior
- Conexión a Internet para la descarga inicial
- Java instalado en el sistema (Java 8, 17 o 21) *TAMBIEN SELECCIONA EL JAVA INSTALADO EN EL SISTEMA*
- Espacio suficiente en disco

---

## 📌 Notas adicionales

- 🛡️ Este módulo no modifica archivos del sistema, todo va dentro de tu carpeta personalizada.
- ✅ Compatible con sistemas Windows, macOS y Linux.
- 🔒 No almacena contraseñas ni tokens.
- 💡 Ideal para launchers con diseño personalizado.

---

## 👨‍💻 Autor

Hecho con ❤️ por **Santiago Stepnicka**  
📦 [StepnickaStudios](https://github.com/StepnickaStudios)

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**.  
Puedes usarlo libremente, incluso en proyectos comerciales, siempre que respetes la licencia.

---

## ⭐ ¿Te gusta?

¡Apoyá el proyecto con una estrella en GitHub o compartilo con otros devs de launchers! 🚀  
```
