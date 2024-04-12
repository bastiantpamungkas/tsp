"use client"
import { useState, useEffect } from 'react';
import { useSession, signIn } from "next-auth/react"
// import { useRouter, useSearchParams } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next-nprogress-bar';
import NextLink from 'next/link';
import { useTheme } from '@mui/material/styles';
import Alert, { AlertColor } from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import LoadingButton from '@mui/lab/LoadingButton';
import Divider from '@mui/material/Divider';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import SaveIcon from '@mui/icons-material/Save';
import AppAppBar from '@/src/components/AppAppBar';
import Footer from '@/src/components/Footer';

export default function Index() {
  const theme = useTheme();
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false);
  const [loadingTheme, setLoadingTheme] = useState(true);
  const [openNotification, setOpenNotification] = useState(false);
  const [messageNotification, setMessageNotification] = useState('');
  const [colorNotification, setColorNotification] = useState<AlertColor>('success');
  const [values, setValues] = useState({
    email: ''
  })

  const setNotification = (message: string, color: AlertColor) => {
    setMessageNotification(message)
    setColorNotification(color)
    setTimeout(function() {
      setOpenNotification(false);
    }, 5000);
    setOpenNotification(true)
  }

  const handleChange = (name: string) => (event: { target: { value: any; }; }) => {
    setValues({ ...values, [name]: event.target.value })
  }

  const clickSubmit = async () => {
    setLoading(true)
    if (values.email) {
      if (!isValidEmail(values.email)) {
        setNotification('Email not valid','error')
        setLoading(false)
      } else {
        await signIn("sendgrid", { email: values.email })
      }
    } else {
      setNotification('Email Required','error')
      setLoading(false)
    }
  }

  function isValidEmail(email:string) {
    return /\S+@\S+\.\S+/.test(email);
  }

  useEffect(() => {
    if (session) {
        router.push('/')
    }
    setLoadingTheme(false)
  }, [router, session]);

  return (
    (!loadingTheme) &&
      <>
        <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: theme.direction === 'rtl' ? 'left' : 'right' }}
            open={openNotification}
            autoHideDuration={6000}
            onClose={() => setOpenNotification(false)}
        >
            <Alert onClose={() => setOpenNotification(false)} severity={colorNotification}>
            <Typography sx={{ whiteSpace: "pre-wrap", mx: 2 }}>
                {messageNotification}
            </Typography>
            </Alert>
        </Snackbar>
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
                Forgot Password
            </Typography>
            <Box sx={{ mt: 3 }}>
                <Grid container>
                    {loading && 
                      <LoadingButton
                          loading
                          loadingPosition="start"
                          sx={{ mt: 3, mb: 2 }}
                          variant="contained"
                          startIcon={<GoogleIcon />}
                      >
                          Sign in with Google
                      </LoadingButton>
                    }
                    {!loading && 
                      <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          sx={{ mt: 3, mb: 2 }}
                          startIcon={<GoogleIcon />}
                          onClick={async () => {
                              setLoading(true)
                              await signIn('google', { redirect: false, callbackUrl: ((searchParams.get('callbackUrl')) ? searchParams.get('callbackUrl') : '/') as string })
                            }
                          }
                      >
                          Sign in with Google
                      </Button>
                    }
                </Grid>
            </Box>
            <Box sx={{ mt: 3, mb: 10, width: { md: '600px' } }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={values.email} onChange={handleChange('email')}
                        />
                    </Grid>
                </Grid>
                { 
                    (loading) ?   
                        <LoadingButton
                            loading
                            loadingPosition="start"
                            fullWidth
                            sx={{ mt: 3, mb: 2 }}
                            variant="contained"
                            startIcon={<SaveIcon />}
                        >
                            Send Email
                        </LoadingButton>
                    :
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={clickSubmit}
                        >
                            Send Email
                        </Button>
                }
                <Grid container>
                    <Grid item xs={6} sx={{ textAlign: 'left' }}>
                        <NextLink href="/auth/signin">
                            <Typography variant="body2">
                                Already have an account? Sign in
                            </Typography>
                        </NextLink>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                        <NextLink href="/auth/signup">
                            <Typography variant="body2">
                              Create an account? Sign Up
                            </Typography>
                        </NextLink>
                    </Grid>
                </Grid>
            </Box>
            <Divider />
            <Footer  />
        </Box>
      </>
  )
}
