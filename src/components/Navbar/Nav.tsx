import { FC } from 'react'
import { chakra, List, ListItem } from '@ironfish/ui-kit'

import { NavItemProps, NavItem } from './NavItem'
import { NavLink } from 'react-router-dom'

export type NavProps = {
  list: NavItemProps[]
}

export const Nav: FC<NavProps> = ({ list }) => (
  <chakra.nav>
    <List spacing={3} maxWidth="16.5rem">
      {list.map(({ to, label, icon, hotkey }) => (
        <ListItem key={to}>
          <NavLink to={to}>
            {({ isActive }) => (
              <NavItem
                to={to}
                label={label}
                icon={icon}
                hotkey={hotkey}
                active={isActive}
              />
            )}
          </NavLink>
        </ListItem>
      ))}
    </List>
  </chakra.nav>
)
export default Nav
