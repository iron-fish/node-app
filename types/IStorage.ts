import Entity from './Entity'
import SortType from './SortType'

interface IStorage<T extends Entity> {
  list: (searchTerm: string, sort: SortType) => Promise<T[]>
  get: (identity: string) => Promise<T | null>
  add: (entity: Partial<Omit<T, '_id'>>) => Promise<T>
  update: (
    identity: string,
    fieldsToUpdate: Partial<Omit<T, '_id'>>
  ) => Promise<T>
  delete: (identity: string) => Promise<void>
  find: (entity: Partial<Omit<T, '_id'>>) => Promise<T | null>
}

export default IStorage
