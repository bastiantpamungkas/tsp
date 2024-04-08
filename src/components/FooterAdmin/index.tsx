import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const FooterWrapper = styled(Container)(
  ({ theme }) => `
        margin-top: ${theme.spacing(4)};
`
);

function Footer() {
  return (
    <FooterWrapper className="footer-wrapper">
      <Box
        pb={4}
        display={{ xs: 'block', md: 'flex' }}
        alignItems="center"
        textAlign={{ xs: 'center', md: 'left' }}
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="subtitle1">
            &copy; {new Date().getFullYear()} - {process.env.NEXT_PUBLIC_APP_NAME}
          </Typography>
        </Box>
        <Typography
          sx={{
            pt: { xs: 2, md: 0 }
          }}
          variant="subtitle1"
        >
          Crafted by{' '}
          <Link
            href="https://buzztian.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            buzztian.com
          </Link>
        </Typography>
      </Box>
    </FooterWrapper>
  );
}

export default Footer;
