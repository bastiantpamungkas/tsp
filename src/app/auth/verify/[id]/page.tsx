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
import prisma from '@/src/lib/prismaClient'

export default async function Index({ params }: any) {
  const findUser = await prisma.user.findFirst({
    where: {
        hashed_email_verify: params.id,
    },
  });

  if (findUser) {
    await prisma.user.update({
        where: {
          id: findUser.id,
        },
        data: { hashed_email_verify : null },
    })
  } else {
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
              Hallo { findUser.name }
          </Typography>
          <Typography component="h6" variant="h6" mt={1} sx={{ textAlign: 'center' }}>
            Account has been activated, and click the button to login
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
