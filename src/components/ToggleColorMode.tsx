import { useContext } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import ModeNightRoundedIcon from '@mui/icons-material/ModeNightRounded';
import { ThemeContext } from '@/src/theme/ThemeProvider'

function ToggleColorMode() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <Box sx={{ maxWidth: '32px' }}>
      <Button
        variant="text"
        onClick={setDarkMode}
        size="small"
        aria-label="button to toggle theme"
        sx={{ minWidth: '32px', height: '32px', p: '4px' }}
      >
        {(darkMode) ? (
          <WbSunnyRoundedIcon fontSize="small" />
        ) : (
          <ModeNightRoundedIcon fontSize="small" />
        )}
      </Button>
    </Box>
  );
}

export default ToggleColorMode;
