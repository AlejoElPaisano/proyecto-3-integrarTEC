import 'server-only'
import { calculateEntropy, getStrengthLevel } from '@/features/generator/entropy'
import type { PasswordConfig } from '@/features/generator/types'

export interface EntropyAnalysis {
  bits: number
  strength: 'weak' | 'medium' | 'strong' | 'very-strong'
}

export function analyzeEntropy(config: PasswordConfig, password?: string): EntropyAnalysis {
  const bits = calculateEntropy(config, password)
  return {
    bits,
    strength: getStrengthLevel(bits),
  }
}
