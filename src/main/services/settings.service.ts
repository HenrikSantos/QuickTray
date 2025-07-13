import { app } from 'electron'
import * as fs from 'fs'
import * as path from 'path'

type StoreSchema = {
  shortcut: string
  startOnLogin: boolean
  apiKey: string
  fromLanguage: string
  toLanguage: string
}

class SettingsService {
  private path: string
  private data: StoreSchema

  private defaults: StoreSchema = {
    shortcut: 'CommandOrControl+,',
    startOnLogin: false,
    apiKey: '',
    fromLanguage: 'auto',
    toLanguage: 'pt'
  }

  constructor() {
    const userDataPath = app.getPath('userData')
    this.path = path.join(userDataPath, 'settings.json')
    this.data = this.loadDataFromFile()
  }

  private loadDataFromFile(): StoreSchema {
    try {
      const fileData = JSON.parse(fs.readFileSync(this.path, 'utf-8'))
      // Merge defaults with file data to ensure all keys are present
      return { ...this.defaults, ...fileData }
    } catch (error) {
      // If file doesn't exist or is corrupted, return defaults
      return this.defaults
    }
  }

  private saveDataToFile(): void {
    fs.writeFileSync(this.path, JSON.stringify(this.data, null, 2))
  }

  get<K extends keyof StoreSchema>(key: K): StoreSchema[K] {
    return this.data[key]
  }

  set<K extends keyof StoreSchema>(key: K, value: StoreSchema[K]): void {
    this.data[key] = value
    this.saveDataToFile()
  }

  clear(): void {
    this.data = this.defaults
    this.saveDataToFile()
  }
}

export const settingsService = new SettingsService() 