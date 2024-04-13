"use client"
import { FC, ReactNode, useState, useContext } from 'react';
import { alpha, lighten, useTheme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';

import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShareIcon from '@mui/icons-material/Share';

import Sidebar from './Sidebar';
import Header from './Header';
import Footer from '@/src/components/FooterAdmin';
import { ThemeContext } from '@/src/theme/ThemeProvider'

export default function SidebarLayout({ children }: React.PropsWithChildren) {
  const { rtl } = useContext(ThemeContext);
  const theme = useTheme();
  const [valueNavigation, setValueNavigation] = useState('');

  const handleNavigation = (newValue: string) => {
    setValueNavigation(newValue);
    // put code for bottom navigation
  }

  return (
    <>
      <Box
        sx={{
          flex: 1,
          height: '100%',

          '.MuiPageTitle-wrapper': {
            background:
              theme.palette.mode === 'dark'
                ? theme.colors.alpha.trueWhite[5]
                : theme.colors.alpha.white[50],
            marginBottom: `${theme.spacing(4)}`,
            boxShadow:
              theme.palette.mode === 'dark'
                ? `0 1px 0 ${alpha(
                    lighten(theme.colors.primary.main, 0.7),
                    0.15
                  )}, 0px 2px 4px -3px rgba(0, 0, 0, 0.2), 0px 5px 12px -4px rgba(0, 0, 0, .1)`
                : `0px 2px 4px -3px ${alpha(
                    theme.colors.alpha.black[100],
                    0.1
                  )}, 0px 5px 12px -4px ${alpha(
                    theme.colors.alpha.black[100],
                    0.05
                  )}`
          }
        }}
      >
        <Header />
        <Sidebar />
        <Box
          sx={{
            position: 'relative',
            zIndex: 5,
            pb: { xs: 5, sm: 5, md: 0 },
            display: 'block',
            flex: 1,
            pt: `${theme.header.height}`,
            [theme.breakpoints.up('lg')]: (rtl) ? {
              mr: `${theme.sidebar.width}`
            } : {
              ml: `${theme.sidebar.width}`
            }
          }}
        >
          <Box display="block" sx={{ minHeight: '700px' }}>{children}</Box>
          <Footer />
        </Box>

        <Box sx={{ display: { xs: 'none', lg: 'block'  } }}>
          <SpeedDial
            ariaLabel="SpeedDial"
            icon={<SpeedDialIcon />}
            direction="up"
            sx={{ position: "fixed", bottom: { xs: theme.spacing(8), lg: theme.spacing(2) }, [(rtl) ? 'left' : 'right']: theme.spacing(2) }}
          >
            <SpeedDialAction
              key="Recents"
              icon={<RestoreIcon />}
              tooltipTitle="Recents"
            />
            <SpeedDialAction
              key="Favorites"
              icon={<FavoriteIcon />}
              tooltipTitle="Favorites"
            />
            <SpeedDialAction
              key="Share"
              icon={<ShareIcon />}
              tooltipTitle="Share"
            />
            <SpeedDialAction
              key="Nearby"
              icon={<LocationOnIcon />}
              tooltipTitle="Nearby"
            />
          </SpeedDial>
        </Box>

        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 6, display: { md: 'block', lg: 'none'  } }} elevation={3}>
          <BottomNavigation
            showLabels
            value={valueNavigation}
            onChange={(event, newValue) => {
              handleNavigation(newValue)
            }}
          >
            <BottomNavigationAction label="Recents" icon={<RestoreIcon />} value="recents" />
            <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} value="favorites" />
            <BottomNavigationAction label="Share" icon={<ShareIcon />} value="share" />
            <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} value="nearby" />
          </BottomNavigation>
        </Paper>
      </Box>
    </>
  );
};
