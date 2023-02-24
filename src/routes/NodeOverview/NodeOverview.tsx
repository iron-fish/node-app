import { FC } from 'react'
import {
  chakra,
  TabPanels,
  TabPanel,
  Tabs,
  TabList,
  Tab,
} from '@ironfish/ui-kit'
import NodeStatus from './NodeStatus'
import NodePeers from './NodePeers'
import NodeSettings from './NodeSettings'

const NodeOverview: FC = () => (
  <>
    <chakra.h2 mb="1rem">Your Node</chakra.h2>
    <Tabs>
      <TabList>
        <Tab>Node Overview</Tab>
        <Tab>Node Settings</Tab>
      </TabList>
      <TabPanels>
        <TabPanel p="0" pt="2rem">
          <NodeStatus mb="2rem" />
          <chakra.h3>Connected Peers</chakra.h3>
          <NodePeers />
        </TabPanel>
        <TabPanel p="0" pt="1rem">
          <NodeSettings />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </>
)

export default NodeOverview
