import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  ArrowRight,
  Languages,
  Stars,
  Pencil,
  Check,
  BookText,
  Clipboard,
  Settings
} from 'lucide-react'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useTranslation } from 'react-i18next'

// --- Constants ---
const languages = [
  { value: 'auto', label: 'Detectar Idioma' },
  { value: 'en', label: 'Inglês' },
  { value: 'pt', label: 'Português' },
  { value: 'es', label: 'Espanhol' },
  { value: 'fr', label: 'Francês' },
  { value: 'de', label: 'Alemão' }
]

// --- Main App Component ---
function App(): React.JSX.Element {
  const { t, i18n } = useTranslation()
  const [showSettings, setShowSettings] = useState(false)
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [fromLanguage, setFromLanguage] = useState('auto')
  const [toLanguage, setToLanguage] = useState('pt')
  const [hasCopied, setHasCopied] = useState(false)

  useEffect(() => {
    window.api.invoke('settings:get', 'uiLanguage').then((lang) => {
      if (lang) {
        i18n.changeLanguage(lang)
      }
    })
  }, [])

  // Load settings on startup
  useEffect(() => {
    window.api
      .invoke('settings:get', 'fromLanguage')
      .then((lang) => lang && setFromLanguage(lang))
    window.api
      .invoke('settings:get', 'toLanguage')
      .then((lang) => lang && setToLanguage(lang))
  }, [])

  // Save language settings when they change
  useEffect(() => {
    window.api.invoke('settings:set', 'fromLanguage', fromLanguage)
  }, [fromLanguage])

  useEffect(() => {
    window.api.invoke('settings:set', 'toLanguage', toLanguage)
  }, [toLanguage])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        window.api.invoke('window:hide')
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleAction = async (
    action: 'translate' | 'improve' | 'correct' | 'summarize'
  ) => {
    if (!text.trim() || isLoading) return
    setIsLoading(true)
    try {
      let result = ''
      if (action === 'translate') {
        result = await window.api.invoke('ai:translate', text)
      } else if (action === 'improve') {
        result = await window.api.invoke('ai:reformulate', text)
      } else if (action === 'summarize') {
        result = await window.api.invoke('ai:summarize', text)
      } else {
        result = await window.api.invoke('ai:correct', text)
      }
      setText(result)
    } catch (error) {
      console.error(`${action} error:`, error)
      setText(`Ocorreu um erro ao processar.`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setHasCopied(true)
    setTimeout(() => setHasCopied(false), 2000)
  }

  return (
    <div className="flex flex-col h-screen p-2 gap-2">
      <header className="flex items-center gap-2 flex-shrink-0">
        <Select
          className="w-[150px]"
          value={fromLanguage}
          onChange={(e) => setFromLanguage(e.target.value)}
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </Select>
        <ArrowRight className="w-4 h-4 mr-2 flex-shrink-0" />
        <Select
          className="w-[150px]"
          value={toLanguage}
          onChange={(e) => setToLanguage(e.target.value)}
        >
          {languages
            .filter((l) => l.value !== 'auto')
            .map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
        </Select>

        <Button
          onClick={() => handleAction('translate')}
          disabled={isLoading}
        >
          <Languages className="w-3.5 h-3.5 mr-2" />
          {t('translate')}
        </Button>
        <Button
          onClick={() => handleAction('improve')}
          disabled={isLoading}
        >
          <Stars className="w-3.5 h-3.5 mr-2" />
          {t('improve')}
        </Button>
        <Button
          onClick={() => handleAction('correct')}
          disabled={isLoading}
        >
          <Pencil className="w-3.5 h-3.5 mr-2" />
          {t('correct')}
        </Button>
        <Button
          onClick={() => handleAction('summarize')}
          disabled={isLoading}
        >
          <BookText className="w-3.5 h-3.5 mr-2" />
          {t('summarize')}
        </Button>

        <div className="flex-grow" />
        <Button
          onClick={handleCopy}
          disabled={!text}
        >
          {hasCopied ? (
            <Check className="w-3.5 h-3.5 text-green-500" />
          ) : (
            <Clipboard className="w-3.5 h-3.5" />
          )}
        </Button>
        <Button
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className="w-3.5 h-3.5" />
        </Button>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden">
        {showSettings ? (
          <SettingsView />
        ) : (
          <Textarea
            className="w-full flex-1 text-lg resize-none"
            placeholder={t('textareaPlaceholder')}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        )}
      </div>
    </div>
  )
}

function SettingsView() {
  const { t, i18n } = useTranslation()
  const [shortcut, setShortcut] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [startOnLogin, setStartOnLogin] = useState(false)

  useEffect(() => {
    window.api.invoke('settings:get', 'shortcut').then(setShortcut)
    window.api.invoke('settings:get', 'startOnLogin').then(setStartOnLogin)
    window.api.invoke('settings:get', 'apiKey').then(setApiKey)
  }, [])

  const handleSave = () => {
    window.api.invoke('settings:set', 'shortcut', shortcut)
    window.api.invoke('settings:set', 'apiKey', apiKey)
    window.api.invoke('settings:set', 'startOnLogin', startOnLogin)
  }

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang)
    window.api.invoke('settings:set', 'uiLanguage', lang)
  }

  const handleReset = () => {
    window.api.invoke('settings:reset').then(() => {
      window.api.invoke('settings:get', 'shortcut').then(setShortcut)
      window.api.invoke('settings:get', 'startOnLogin').then(setStartOnLogin)
      window.api.invoke('settings:get', 'apiKey').then(setApiKey)
    })
  }

  return (
    <div className="flex flex-col h-full gap-4 p-3 overflow-y-auto">
      <h2 className="text-lg font-bold">{t('settings')}</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-2 rounded-md shadow-custom bg-gray-800">
          <Label htmlFor="language-select" className="font-normal">
            {t('appLanguage')}
          </Label>
          <Select
            id="language-select"
            className="w-[150px]"
            value={i18n.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            <option value="pt">Português</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="api-key">{t('apiKeyLabel')}</Label>
          <Input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-sm text-gray-400">
            {t('getApiKey')}{' '}
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              aistudio.google.com/apikey
            </a>
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="shortcut-input">{t('globalShortcut')}</Label>
          <Input
            id="shortcut-input"
            value={shortcut}
            onChange={(e) => setShortcut(e.target.value)}
          />
          <p className="text-sm">{t('restartApp')}</p>
        </div>
        <div className="flex items-center justify-between p-2 rounded-md shadow-custom bg-gray-800">
          <Label htmlFor="start-on-login-switch" className="font-normal">
            {t('startOnLogin')}
          </Label>
          <Switch
            id="start-on-login-switch"
            checked={startOnLogin}
            onChange={(e) => setStartOnLogin(e.target.checked)}
          />
        </div>
      </div>
      <div className="pt-4 mt-auto space-y-2 border-t border-gray-700">
        <Button onClick={handleSave} className="w-full" variant="outline">
          {t('saveSettings')}
        </Button>
        <Button
          onClick={handleReset}
          className="w-full"
          variant="destructive"
        >
          {t('resetSettings')}
        </Button>
      </div>
    </div>
  )
}

export default App
