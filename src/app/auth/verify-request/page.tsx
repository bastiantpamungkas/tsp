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
                Check your email
            </Typography>
            <Typography component="h6" variant="h6" mt={1} sx={{ textAlign: 'center' }}>
                A sign in link has been sent to your email address.
            </Typography>
            <Box sx={{ mt: 3 }}>
                <Grid container>
                <NextLink href="/">
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 10, }}
                    >
                        {process.env.NEXT_PUBLIC_APP_NAME}
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
