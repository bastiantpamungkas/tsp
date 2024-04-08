import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';

import { useRef, useState } from 'react';
import { usePathname } from 'next/navigation'
import Link from '@/src/components/Link';

import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';

const ListWrapper = styled(Box)(
  ({ theme }) => `
        .MuiTouchRipple-root {
            display: none;
        }
        
        .MuiListItem-root {
            transition: ${theme.transitions.create(['color', 'fill'])};
            
            &.MuiListItem-indicators {
                padding: ${theme.spacing(1, 2)};
            
                .MuiListItemText-root {
                    .MuiTypography-root {
                        &:before {
                            height: 4px;
                            width: 22px;
                            opacity: 0;
                            visibility: hidden;
                            display: block;
                            position: absolute;
                            bottom: -10px;
                            transition: all .2s;
                            border-radius: ${theme.general.borderRadiusLg};
                            content: "";
                            background: ${theme.colors.primary.main};
                        }
                    }
                }

                &.active,
                &:active,
                &:hover {
                
                    background: transparent;
                
                    .MuiListItemText-root {
                        .MuiTypography-root {
                            &:before {
                                opacity: 1;
                                visibility: visible;
                                bottom: 0px;
                            }
                        }
                    }
                }
            }
        }
`
);

function HeaderMenu() {
  const pathname = usePathname()
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      <ListWrapper
        sx={{
          display: {
            xs: 'none',
            md: 'block'
          }
        }}
      >
        <List disablePadding component={Box} display="flex">
          <ListItem
            classes={{ root: 'MuiListItem-indicators' }}
            button
            component={Link}
            href="/"
          >
            <ListItemText
              primaryTypographyProps={{ noWrap: true }}
              primary="home"
            />
          </ListItem>
          <ListItem
            classes={{ root: 'MuiListItem-indicators' }}
            button
            component={Link}
            href={pathname}
          >
            <ListItemText
              primaryTypographyProps={{ noWrap: true }}
              primary={pathname.replace("/", "")}
            />
          </ListItem>
          {/* <ListItem
            classes={{ root: 'MuiListItem-indicators' }}
            button
            ref={ref}
            onClick={handleOpen}
          >
            <ListItemText
              primaryTypographyProps={{ noWrap: true }}
              primary={
                <Box display="flex" alignItems="center">
                  Others
                  <Box display="flex" alignItems="center" pl={0.3}>
                    <ExpandMoreTwoToneIcon fontSize="small" />
                  </Box>
                </Box>
              }
            />
          </ListItem> */}
        </List>
      </ListWrapper>
      <Menu anchorEl={ref.current} onClose={handleClose} open={isOpen}>
        <MenuItem sx={{ px: 3 }} component={Link} href="/">
          Overview
        </MenuItem>
        <MenuItem sx={{ px: 3 }} component={Link} href="/components/tabs">
          Tabs
        </MenuItem>
        <MenuItem sx={{ px: 3 }} component={Link} href="/components/cards">
          Cards
        </MenuItem>
        <MenuItem sx={{ px: 3 }} component={Link} href="/components/modals">
          Modals
        </MenuItem>
      </Menu>
    </>
  );
}

export default HeaderMenu;
