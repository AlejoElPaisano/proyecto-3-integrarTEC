'use client'

/**
 * @fileoverview Servicio de cifrado y descifrado simétrico AES-GCM (Web Crypto API).
 * 
 * ⚠️ ADVERTENCIA DE ARQUITECTURA NEXT.JS (SSR / App Router):
 * Este servicio utiliza `crypto.subtle` (Web Crypto API del navegador).
 * NO debe ejecutarse en el servidor (Server Components o durante SSR).
 * Sus funciones (`encryptPassword`, `decryptPassword`) solo deben ser invocadas
 * desde Client Components ('use client') dentro de controladores de eventos
 * (ej. onClick, onSubmit) o callbacks de cliente.
 */

import type { EncryptedPayload } from '@/shared/types/crypto.types'

const encoder = new TextEncoder()
const decoder = new TextDecoder()

function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

function getKeyMaterial(passphrase: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey'],
  )
}

async function deriveKey(
  keyMaterial: CryptoKey,
  saltBuffer: ArrayBuffer,
  usage: KeyUsage[],
): Promise<CryptoKey> {
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: 600000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    usage,
  )
}

export async function encryptPassword(
  password: string,
  passphrase: string,
): Promise<EncryptedPayload> {
  const salt = crypto.getRandomValues(new Uint8Array(16)).buffer as ArrayBuffer
  const iv = crypto.getRandomValues(new Uint8Array(12))

  const keyMaterial = await getKeyMaterial(passphrase)
  const aesKey = await deriveKey(keyMaterial, salt, ['encrypt'])

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    encoder.encode(password),
  )

  return {
    ciphertext: arrayBufferToBase64(ciphertext),
    iv: arrayBufferToBase64(iv),
    salt: arrayBufferToBase64(salt),
  }
}

export async function decryptPassword(
  payload: EncryptedPayload,
  passphrase: string,
): Promise<string | null> {
  try {
    const ciphertext = base64ToArrayBuffer(payload.ciphertext)
    const iv = base64ToArrayBuffer(payload.iv)
    const salt = base64ToArrayBuffer(payload.salt)

    const keyMaterial = await getKeyMaterial(passphrase)
    const aesKey = await deriveKey(keyMaterial, salt, ['decrypt'])

    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      aesKey,
      ciphertext,
    )

    return decoder.decode(plaintext)
  } catch {
    return null
  }
}
