'use client'

import { useCallback, useRef, useState } from "react"
import { Download, Upload } from "lucide-react"
import type { FavoriteEntry } from "@/features/favorites/types"
import { parseBackup, serializeBackup } from "@/shared/lib/favorites-io"
import { ConfirmDialog } from "@/shared/components/ui/ConfirmDialog"

interface FavoritesBackupButtonsProps {
  favorites: FavoriteEntry[]
  onMerge: (incoming: FavoriteEntry[]) => number
}

function formatDate(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function FavoritesBackupButtons({ favorites, onMerge }: FavoritesBackupButtonsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [pendingImport, setPendingImport] = useState<FavoriteEntry[] | null>(null)

  const handleExport = useCallback(() => {
    if (favorites.length === 0) return
    setError(null)
    setSuccess(null)
    try {
      const backup = serializeBackup(favorites)
      const json = JSON.stringify(backup, null, 2)
      const blob = new Blob([json], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `passfrases-favorites-${formatDate()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setSuccess("Backup exportado correctamente.")
      setTimeout(() => setSuccess(null), 3000)
    } catch {
      setError("No se pudo exportar el archivo de backup.")
    }
  }, [favorites])

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null)
      setSuccess(null)
      const file = e.target.files?.[0]
      if (!file) return
      try {
        const text = await file.text()
        const result = parseBackup(text)
        if (!result.ok) {
          setError(result.error)
          return
        }
        setPendingImport(result.favorites)
      } catch {
        setError("No se pudo leer el archivo seleccionado.")
      }
      if (fileInputRef.current) fileInputRef.current.value = ""
    },
    [],
  )

  const handleConfirmImport = useCallback(() => {
    if (!pendingImport) return
    const added = onMerge(pendingImport)
    setPendingImport(null)
    if (added === 0) {
      setSuccess("Todos los favoritos del archivo ya existían. No se importaron duplicados.")
    } else {
      setSuccess(`${added} favorito${added === 1 ? "" : "s"} importado${added === 1 ? "" : "s"}.`)
    }
    setTimeout(() => setSuccess(null), 4000)
  }, [pendingImport, onMerge])

  const handleCancelImport = useCallback(() => {
    setPendingImport(null)
  }, [])

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <button
        type="button"
        onClick={handleExport}
        disabled={favorites.length === 0}
        aria-label="Exportar favoritos cifrados"
        title="Descargar un archivo .json con tus favoritos cifrados"
        className="transition-colors duration-150 ease-out hover:border-accent hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          all: "unset",
          cursor: favorites.length === 0 ? "not-allowed" : "pointer",
          opacity: favorites.length === 0 ? 0.5 : 1,
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          padding: "0.45rem 0.8rem",
          borderRadius: "10px",
          border: "1px solid var(--color-border)",
          background: "var(--color-accent-soft)",
          color: "var(--color-text-secondary)",
          fontSize: "0.75rem",
          fontWeight: 600,
          fontFamily: "var(--font-sans)",
        }}
      >
        <Download className="h-3.5 w-3.5 shrink-0" />
        Exportar
      </button>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        aria-label="Importar favoritos desde archivo de backup"
        title="Cargar un archivo .json de backup y mergear los favoritos"
        className="transition-colors duration-150 ease-out hover:border-accent hover:text-text"
        style={{
          all: "unset",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          padding: "0.45rem 0.8rem",
          borderRadius: "10px",
          border: "1px solid var(--color-border)",
          background: "var(--color-accent-soft)",
          color: "var(--color-text-secondary)",
          fontSize: "0.75rem",
          fontWeight: 600,
          fontFamily: "var(--font-sans)",
        }}
      >
        <Upload className="h-3.5 w-3.5 shrink-0" />
        Importar
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />

      {error && (
        <p role="alert" className="text-[0.65rem] font-semibold text-error">
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="text-[0.65rem] font-semibold text-success">
          {success}
        </p>
      )}

      <ConfirmDialog
        open={pendingImport !== null}
        title="Importar favoritos"
        message={
          pendingImport
            ? `Se importarán ${pendingImport.length} favorito${pendingImport.length === 1 ? "" : "s"}. Los favoritos existentes no se sobreescribirán. Necesitarás la passphrase original para desencriptar cada uno.`
            : ""
        }
        confirmLabel="Importar"
        onConfirm={handleConfirmImport}
        onCancel={handleCancelImport}
      />
    </div>
  )
}