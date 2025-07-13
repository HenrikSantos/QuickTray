import { app, shell, BrowserWindow, ipcMain, Tray, Menu, globalShortcut, screen } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import {
  translate,
  reformulateText,
  correctText,
  summarizeText,
  testApiConnection
} from './services/ai.service'
import { settingsService } from './services/settings.service'

let tray: Tray | null = null
let mainWindow: BrowserWindow | null = null

function setStartOnLogin(shouldStart: boolean): void {
  app.setLoginItemSettings({
    openAtLogin: shouldStart,
    path: app.getPath('exe')
  })
}

// Helper function to handle AI service calls
async function handleAIService(
  serviceFn: (text: string, apiKey: string) => Promise<string>,
  text: string
): Promise<string> {
  if (!text.trim()) {
    return ''
  }
  const apiKey = settingsService.get('apiKey')

  if (!apiKey) {
    return 'Por favor, configure sua chave de API nas configurações.'
  }

  try {
    return await serviceFn(text, apiKey)
  } catch (error) {
    console.error('AI Service Error:', error)
    return 'Ocorreu um erro ao processar sua solicitação.'
  }
}

function createWindow(): void {
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  const windowHeight = Math.floor(height * 0.15);

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: Math.floor(width * 0.4),
    height: windowHeight,
    minHeight: 200,
    x: Math.floor(width - width * 0.4 - 20),
    y: Math.floor(height - windowHeight - 20), // Position near the bottom
    show: false,
    frame: false,
    resizable: false,
    skipTaskbar: true,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('blur', () => {
    // A menos que as devtools estejam abertas
    if (!mainWindow?.webContents.isDevToolsOpened()) {
      mainWindow?.hide()
    }
  })

  // mainWindow.on('ready-to-show', () => {
  //   mainWindow.show()
  // })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Set start on login
  setStartOnLogin(settingsService.get('startOnLogin'))

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  globalShortcut.register(settingsService.get('shortcut'), () => {
    if (mainWindow) {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    }
  })

  tray = new Tray(icon)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Abrir/Fechar',
      click: (): void => {
        if (!mainWindow) {
          return
        }
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
      }
    },
    { type: 'separator' },
    {
      label: 'Sair',
      click: (): void => {
        app.quit()
      }
    }
  ])

  tray.setToolTip('AI QuickTray')
  tray.setContextMenu(contextMenu)

  ipcMain.handle('window:hide', () => {
    mainWindow?.hide()
  })

  ipcMain.handle('settings:get', (_event, key) => settingsService.get(key as any))
  ipcMain.handle('settings:set', (_event, key, value) => settingsService.set(key as any, value))
  ipcMain.handle('settings:reset', () => {
    settingsService.clear()
    setStartOnLogin(settingsService.get('startOnLogin'))
  })

  ipcMain.handle('settings:set-start-on-login', (_event, shouldStart: boolean) => {
    settingsService.set('startOnLogin', shouldStart)
    setStartOnLogin(shouldStart)
  })

  ipcMain.handle('ai:translate', (_event, text: string) => {
    const apiKey = settingsService.get('apiKey')
    const from = settingsService.get('fromLanguage')
    const to = settingsService.get('toLanguage')
    if (!apiKey) {
      return 'Por favor, configure sua chave de API nas configurações.'
    }
    return translate(text, apiKey, from, to)
  })
  ipcMain.handle('ai:reformulate', (_event, text: string) =>
    handleAIService(reformulateText, text)
  )
  ipcMain.handle('ai:correct', (_event, text: string) =>
    handleAIService(correctText, text)
  )
  ipcMain.handle('ai:summarize', (_event, text: string) =>
    handleAIService(summarizeText, text)
  )

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle('test:api', async () => {
    const apiKey = settingsService.get('apiKey')
    return testApiConnection(apiKey)
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
