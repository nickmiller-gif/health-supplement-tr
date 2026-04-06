import { SupplementService } from './supplement-service'
import { INITIAL_SUPPLEMENTS, SUPPLEMENT_COMBINATIONS } from './data'
import { isSupabaseConfigured } from './supabase'

export async function seedDatabase(): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      message: 'Supabase is not configured. Please set up your .env file first.'
    }
  }

  try {
    await SupplementService.upsertSupplements(INITIAL_SUPPLEMENTS)
    
    await SupplementService.upsertCombinations(SUPPLEMENT_COMBINATIONS)

    return {
      success: true,
      message: `Successfully seeded database with ${INITIAL_SUPPLEMENTS.length} supplements and ${SUPPLEMENT_COMBINATIONS.length} combinations!`
    }
  } catch (error) {
    console.error('Database seeding failed:', error)
    return {
      success: false,
      message: `Failed to seed database: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

export async function checkDatabaseEmpty(): Promise<boolean> {
  if (!isSupabaseConfigured) {
    return false
  }

  try {
    const supplements = await SupplementService.getAllSupplements()
    return supplements.length === 0
  } catch (error) {
    console.error('Error checking database:', error)
    return false
  }
}
