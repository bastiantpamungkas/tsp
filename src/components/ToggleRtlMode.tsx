import { useContext } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { ThemeContext } from '@/src/theme/ThemeProvider'

function ToggleRtlMode() {
  const { rtl, setRtl } = useContext(ThemeContext);

  return (
    <Box sx={{ maxWidth: '32px' }}>
      <Tooltip title={rtl ? 'LTR' : 'RTL'} >
        <Button
          variant="text"
          onClick={setRtl}
          size="small"
          aria-label="button to toggle theme"
          sx={{ minWidth: '32px', height: '32px', p: '4px' }}
        >
          {(rtl) ? (
            <ArrowCircleRightIcon fontSize="small" />
          ) : (
            <ArrowCircleLeftIcon fontSize="small" />
          )}
        </Button>
      </Tooltip>
    </Box>
  );
}

export default ToggleRtlMode;
