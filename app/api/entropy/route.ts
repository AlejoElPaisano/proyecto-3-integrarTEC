import { z } from 'zod'
import { NextResponse } from 'next/server'
import { analyzeEntropy } from '@/lib/entropy'

const PASSWORD_CONFIG_SCHEMA = z.object({
  wordCount: z.number().int().min(1).max(20),
  separator: z.string().trim().min(1).max(4),
  includeNumbers: z.boolean(),
  includeSymbols: z.boolean(),
  capitalize: z.boolean(),
  selectedCategories: z.array(z.string().trim().min(1).max(40)).min(1).max(20),
  password: z.string().trim().min(1).max(512).optional(),
})

export async function POST(request: Request) {
  let rawData: unknown
  try {
    rawData = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, message: 'Cuerpo de la solicitud invalido: se espera JSON.' },
      { status: 400 },
    )
  }

  const result = PASSWORD_CONFIG_SCHEMA.safeParse(rawData)
  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        message: 'La configuracion recibida no es valida.',
        errors: result.error.flatten().fieldErrors,
      },
      { status: 400 },
    )
  }

  try {
    const analysis = analyzeEntropy(result.data, result.data.password)
    return NextResponse.json(
      {
        success: true,
        bits: analysis.bits,
        strength: analysis.strength,
      },
      { status: 200 },
    )
  } catch {
    return NextResponse.json(
      { success: false, message: 'No se pudo calcular la entropia. Intenta de nuevo.' },
      { status: 500 },
    )
  }
}
