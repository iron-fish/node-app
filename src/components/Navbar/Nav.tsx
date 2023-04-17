import { FC } from 'react'
import { chakra, List, ListItem, StyleProps } from '@ironfish/ui-kit'

import { NavItemProps, NavItem } from './NavItem'
import { NavLink, useLocation } from 'react-router-dom'

export interface NavProps extends StyleProps {
  list: NavItemProps[]
}

export const Nav: FC<NavProps> = ({ list, ...props }) => {
  const location = useLocation()
  return (
    <chakra.nav {...props}>
      <List spacing={3} maxWidth="16.5rem">
        {list.map(({ to, label, icon, hotkey, aliases, statItem }) => (
          <ListItem key={to}>
            <NavLink to={to}>
              {({ isActive }) => (
                <NavItem
                  to={to}
                  label={label}
                  icon={icon}
                  hotkey={hotkey}
                  statItem={statItem}
                  active={
                    isActive ||
                    !!aliases.find(alias => alias.includes(location.pathname))
                  }
                />
              )}
            </NavLink>
          </ListItem>
        ))}
      </List>
    </chakra.nav>
  )
}
export default Nav
