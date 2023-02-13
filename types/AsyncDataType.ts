export interface AsyncDataProps<T> {
  loaded: boolean
  data?: T
  error?: object
}

export default AsyncDataProps
