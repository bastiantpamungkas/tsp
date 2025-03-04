import Box from '@mui/material/Box';
import HeaderSettings from './Settings';

function HeaderButtons() {
  return (
    <Box sx={{ mr: 1 }}>
      <Box sx={{ mx: 0.5 }} component="span">
        <HeaderSettings />
      </Box>
    </Box>
  );
}

export default HeaderButtons;
