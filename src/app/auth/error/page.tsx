import { auth } from "@/src/auth"
import { redirect } from 'next/navigation'
import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AppAppBar from '@/src/components/AppAppBar';
import Footer from '@/src/components/Footer';

export default async function Index() {
  const session = await auth()

  if (session) {
      redirect('/')
  }

  return (
    <>
        <AppAppBar/>
        <Box
            sx={{
                bgcolor: 'background.default',
                pt: 15,
                px: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Unable to sign in
            </Typography>
            <Typography component="h6" variant="h6" mt={1} sx={{ textAlign: 'center' }}>
                The sign in link is no longer valid.
            </Typography>
            <Typography component="h6" variant="h6" mt={1} sx={{ textAlign: 'center' }}>
                It may have been used already or it may have expired.
            </Typography>
            <Box sx={{ mt: 3 }}>
                <Grid container>
                <NextLink href="/auth/signin">
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 10, }}
                    >
                        Sign in
                    </Button>
                </NextLink>
                </Grid>
            </Box>
            <Divider />
            <Footer  />
        </Box>
    </>
  )
}
