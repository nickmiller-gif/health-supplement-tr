import { Supplement, SupplementCombination } from './types'
import { INITIAL_SUPPLEMENTS, SUPPLEMENT_COMBINATIONS } from './data'

export class SupplementService {
  static async getAllSupplements(): Promise<Supplement[]> {
    const supplements = await spark.kv.get<Supplement[]>('supplements')
    return supplements || INITIAL_SUPPLEMENTS
  }

  static async getSupplementById(id: string): Promise<Supplement | null> {
    const supplements = await this.getAllSupplements()
    return supplements.find(s => s.id === id) || null
  }

  static async searchSupplements(query: string): Promise<Supplement[]> {
    const supplements = await this.getAllSupplements()
    const lowerQuery = query.toLowerCase()
    return supplements.filter(s => 
      s.name.toLowerCase().includes(lowerQuery) || 
      s.description.toLowerCase().includes(lowerQuery)
    )
  }

  static async upsertSupplement(supplement: Supplement): Promise<void> {
    const supplements = await this.getAllSupplements()
    const index = supplements.findIndex(s => s.id === supplement.id)
    
    if (index >= 0) {
      supplements[index] = supplement
    } else {
      supplements.push(supplement)
    }
    
    await spark.kv.set('supplements', supplements)
    await spark.kv.set('last-update-time', Date.now())
  }

  static async upsertSupplements(supplementList: Supplement[]): Promise<void> {
    await spark.kv.set('supplements', supplementList)
    await spark.kv.set('last-update-time', Date.now())
  }

  static async getAllCombinations(): Promise<SupplementCombination[]> {
    const combinations = await spark.kv.get<SupplementCombination[]>('supplement-combinations')
    return combinations || SUPPLEMENT_COMBINATIONS
  }

  static async upsertCombinations(combinations: SupplementCombination[]): Promise<void> {
    await spark.kv.set('supplement-combinations', combinations)
    await spark.kv.set('last-update-time', Date.now())
  }
}
