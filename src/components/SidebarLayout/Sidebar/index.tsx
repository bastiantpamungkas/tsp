import { useContext } from 'react';
import NextLink from 'next/link';
import Scrollbar from '@/src/components/Scrollbar';
import { SidebarContext } from '@/src/contexts/SidebarContext';
import { ThemeContext } from '@/src/theme/ThemeProvider'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography'
import { alpha, useTheme, styled, lighten, darken } from '@mui/material/styles';

import SidebarMenu from './SidebarMenu';
import Logo from '@/src/components/LogoSign';

const SidebarWrapper = styled(Box)(
  ({ theme }) => `
        width: ${theme.sidebar.width};
        min-width: ${theme.sidebar.width};
        color: ${theme.colors.alpha.trueWhite[70]};
        position: relative;
        z-index: 7;
        height: 100%;
        padding-bottom: 68px;
`
);

const NextLinkWrapper = styled(NextLink)(
  ({ theme }) => `
        text-decoration: none;
        width: 100%;
        color: 'inherit';
`
);

function Sidebar() {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const closeSidebar = () => toggleSidebar();
  const { rtl } = useContext(ThemeContext);
  const theme = useTheme();
  theme.direction = (rtl) ? 'rtl' : 'ltr'

  return (
    <>
      <SidebarWrapper
        sx={{
          display: {
            xs: 'none',
            lg: 'inline-block'
          },
          position: 'fixed',
          left: theme.direction === 'rtl' ? undefined : 0,
          right: theme.direction === 'rtl' ? 0 : undefined,
          top: 0,
          background:
            theme.palette.mode === 'dark'
              ? alpha(lighten(theme.header.background as string, 0.1), 0.5)
              : darken(theme.colors.alpha.black[100], 0.5),
          boxShadow:
            theme.palette.mode === 'dark' ? theme.sidebar.boxShadow : 'none'
        }}
      >
        <Scrollbar>
          <Box mt={3}>
            <Box
              mx={2}
              sx={{
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              <Logo />
              <NextLinkWrapper
                href="/"
                sx={{
                  color: 'inherit',
                }}
              >
                <Typography sx={{ fontWeight: 700, mx: 3 }}>
                  {process.env.NEXT_PUBLIC_APP_NAME}
                </Typography>
              </NextLinkWrapper>
            </Box>
          </Box>
          <Divider
            sx={{
              mt: theme.spacing(3),
              mx: theme.spacing(2),
              background: theme.colors.alpha.trueWhite[10]
            }}
          />
          <SidebarMenu />
        </Scrollbar>
        <Divider
          sx={{
            background: theme.colors.alpha.trueWhite[10]
          }}
        />
        <Box p={2}>
          <Button
            href="https://buzztian.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            color="success"
            size="small"
            fullWidth
          >
            Upgrade to PRO
          </Button>
        </Box>
      </SidebarWrapper>
      <Drawer
        sx={{
          boxShadow: `${theme.sidebar.boxShadow}`
        }}
        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
        open={sidebarToggle}
        onClose={closeSidebar}
        variant="temporary"
        elevation={9}
      >
        <SidebarWrapper
          sx={{
            background:
              theme.palette.mode === 'dark'
                ? theme.colors.alpha.white[100]
                : darken(theme.colors.alpha.black[100], 0.5)
          }}
        >
          <Scrollbar>
            <Box mt={3}>
              <Box
                mx={2}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center'
                }}
              >
                <Box onClick={closeSidebar}>
                  <Logo />
                </Box>
                <NextLinkWrapper
                  href="/"
                  sx={{
                    color: 'inherit',
                  }}
                  onClick={closeSidebar}
                >
                  <Typography sx={{ fontWeight: 700, mx: 3 }}>
                    {process.env.NEXT_PUBLIC_APP_NAME}
                  </Typography>
                </NextLinkWrapper>
              </Box>
            </Box>
            <Divider
              sx={{
                mt: theme.spacing(3),
                mx: theme.spacing(2),
                background: theme.colors.alpha.trueWhite[10]
              }}
            />
            <SidebarMenu />
          </Scrollbar>
          <Divider
            sx={{
              background: theme.colors.alpha.trueWhite[10]
            }}
          />
          <Box p={2}>
            <Button
              href="https://buzztian.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              color="success"
              size="small"
              fullWidth
            >
              Upgrade to PRO
            </Button>
          </Box>
        </SidebarWrapper>
      </Drawer>
    </>
  );
}

export default Sidebar;
