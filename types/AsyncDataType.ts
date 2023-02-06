export interface AsyncDataProps<T> {
  loaded: boolean
  data?: T
  error?: Error
}

export default AsyncDataProps
