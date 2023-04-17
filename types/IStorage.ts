import Entity from './Entity'
import SortType from './SortType'

interface IStorage<T extends Entity> {
  add: (entity: Partial<Omit<T, '_id'>>) => Promise<T>
  delete: (identity: string) => Promise<void>
  find: (entity: Partial<Omit<T, '_id'>>) => Promise<T | null>
  get: (identity: string) => Promise<T | null>
  list: (searchTerm: string, sort: SortType) => Promise<T[]>
  update: (
    identity: string,
    fieldsToUpdate: Partial<Omit<T, '_id'>>
  ) => Promise<T>
}

export default IStorage
