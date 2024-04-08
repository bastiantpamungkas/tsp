import Box from '@mui/material/Box';
import HeaderSearch from './Search';
import HeaderNotifications from './Notifications';
import HeaderSettings from './Settings';

function HeaderButtons() {
  return (
    <Box sx={{ mr: 1 }}>
      <Box sx={{ mx: 0.5 }} component="span">
        <HeaderSettings />
      </Box>
      <Box sx={{ mx: 0.5 }} component="span">
        <HeaderSearch />
      </Box>
      <Box sx={{ mx: 0.5 }} component="span">
        <HeaderNotifications />
      </Box>
    </Box>
  );
}

export default HeaderButtons;
