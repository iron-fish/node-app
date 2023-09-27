/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { FileStore, NodeFileProvider } from '@ironfish/sdk'
import { UserSettings } from 'Types/UserSettings'

export class UserSettingsStore {
  private storage: FileStore<UserSettings>
  defaults: UserSettings
  loaded: Partial<UserSettings> = {}

  constructor(options: {
    fileSystem: NodeFileProvider
    dataDir: string
    fileName: string
    defaults: UserSettings
  }) {
    this.storage = new FileStore<UserSettings>(
      options.fileSystem,
      options.fileName,
      options.dataDir
    )
    this.defaults = options.defaults
  }

  get config(): UserSettings {
    return {
      ...this.defaults,
      ...this.loaded,
    }
  }

  async load(): Promise<void> {
    const data = await this.storage.load()

    this.loaded = { ...data }

    // Write the file out if it doesnt exist
    if (data === null) {
      await this.storage.save({})
    }
  }

  async setAndSave(params: Partial<UserSettings>): Promise<void> {
    Object.assign(this.loaded, params)
    await this.storage.save(this.loaded)
  }

  get<T extends keyof UserSettings>(key: T): UserSettings[T] {
    return this.config[key]
  }

  /**
   * Returns true if the key is set, or false if its value is from the defaults
   */
  isSet<T extends keyof UserSettings>(key: T): boolean {
    return key in this.loaded
  }
}
