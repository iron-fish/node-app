enum IronFishInitStatus {
  NOT_STARTED,
  INITIALIZING_SDK,
  STARTING_RPC,
  INITIALIZING_NODE,
  MIGRATING_DB,
  STARTING_NODE,
  ERROR,
  READY,
}

export default IronFishInitStatus
