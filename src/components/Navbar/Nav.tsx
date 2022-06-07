import { FC } from 'react'
import { chakra, List, ListItem } from '@ironfish/ui-kit'

import { NavItemProps, NavItem } from './NavItem'

export type NavProps = {
  list: NavItemProps[]
}

export const Nav: FC<NavProps> = ({ list }) => (
  <chakra.nav>
    <List spacing={3} maxWidth="16.5rem">
      {list.map(({ to, label, icon, hotkey }) => (
        <ListItem key={to}>
          <NavItem
            to={to}
            label={label}
            icon={icon}
            hotkey={hotkey}
            active={hotkey === 'A'}
          />
        </ListItem>
      ))}
    </List>
  </chakra.nav>
)
export default Nav
