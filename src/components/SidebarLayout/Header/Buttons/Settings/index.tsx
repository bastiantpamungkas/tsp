"use client"
import { useContext } from 'react';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { useRef, useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

import { ThemeContext } from '@/src/theme/ThemeProvider'

function HeaderSettings() {
  const { darkMode, setDarkMode, rtl, setRtl } = useContext(ThemeContext);
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
      <Tooltip arrow title="Settings">
        <IconButton color="primary" ref={ref} onClick={handleOpen}>
          <SettingsIcon />
        </IconButton>
      </Tooltip>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <Box
          sx={{ p: 2, minWidth: 200 }}
          display="flex"
          justifyContent="space-between"
        >
          <Typography variant="h5" sx={{ mt: 1 }}>{(darkMode) ? 'Light Mode' : 'Dark Mode'}</Typography>
          <Tooltip title={(darkMode) ? 'Light Mode' : 'Dark Mode'} >
            <IconButton color="primary" onClick={(e) => {
              e.preventDefault()
              setDarkMode()
            }}>
              {
                (darkMode) ? 
                  <LightModeIcon/>
                : 
                  <DarkModeIcon/>
              }
            </IconButton>
          </Tooltip>
        </Box>
        <Divider />
        <Box
          sx={{ p: 2 }}
          display="flex"
          justifyContent="space-between"
        >
          <Typography variant="h5" sx={{ mt: 1 }}>{ rtl ? 'LTR' : 'RTL' }</Typography>
          <Tooltip title={rtl ? 'LTR' : 'RTL'} >
            <IconButton color="primary" onClick={(e) => {
              e.preventDefault()
              setRtl()
            }}>
              {
                (rtl) ? 
                  <ArrowCircleRightIcon/>
                : 
                  <ArrowCircleLeftIcon/>
              }
            </IconButton>
          </Tooltip>
        </Box>
      </Popover>
    </>
  );
}

export default HeaderSettings;
