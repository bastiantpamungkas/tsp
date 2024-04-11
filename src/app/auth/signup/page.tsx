"use client"
import { useState, useEffect } from 'react';
import { useSession, signIn, getCsrfToken } from "next-auth/react"
// import { useRouter, useSearchParams } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next-nprogress-bar';
import NextLink from 'next/link';
import Alert, { AlertColor } from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Checkbox from '@mui/material/Checkbox';
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
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false);
  const [loadingTheme, setLoadingTheme] = useState(true);
  const [openNotification, setOpenNotification] = useState(false);
  const [messageNotification, setMessageNotification] = useState('');
  const [colorNotification, setColorNotification] = useState<AlertColor>('success');
  const [values, setValues] = useState({
    name: '',
    password: '',
    password_confirm: '',
    email: '',
    terms: false,
    csrfToken: ''
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
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
      password_confirm: values.password_confirm || undefined,
      terms: values.terms || false,
      csrfToken: await getCsrfToken()
    }
    try {
      let response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(user)
      })

      const return_data = await response.json() as any
      if (return_data.error) {
        setNotification(return_data.error,'error')
      } else {
        setNotification(return_data.message,'success')
        setValues({ ...values, name: '', password: '', password_confirm: '', email: '', terms: false})
      }
    } catch(err) {
      setNotification(String(err),'error')
    }

    setLoading(false)
  }

  const clickGoogle = async () => {
    if (values.terms) {
      setLoading(true)
      await signIn('google', { redirect: false, callbackUrl: ((searchParams.get('callbackUrl')) ? searchParams.get('callbackUrl') : '/') as string })
    } else {
      setNotification('Please select agree terms & condition to continues','error')
    }
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
            anchorOrigin={{ vertical: "top", horizontal: 'right' }}
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
                Sign up
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
                            Sign up with Google
                        </LoadingButton>
                    }
                    {!loading && 
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            startIcon={<GoogleIcon />}
                            onClick={clickGoogle}
                        >
                            Sign up with Google
                        </Button>
                    }
                </Grid>
            </Box>
            <Box sx={{ mt: 3, mb: 10, width: { md: '600px' } }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            autoComplete="given-name"
                            name="name"
                            required
                            fullWidth
                            id="name"
                            label="Name"
                            autoFocus
                            value={values.name} onChange={handleChange('name')}
                        />
                    </Grid>
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
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={values.password} onChange={handleChange('password')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            name="password_confirm"
                            label="Password Confirm"
                            type="password"
                            id="password_confirm"
                            autoComplete="new-password-confirm"
                            value={values.password_confirm} onChange={handleChange('password_confirm')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Checkbox 
                            checked={values.terms}
                            onChange={ e => {
                                setValues({ ...values, terms: e.target.checked})
                            }}
                        />
                        I agree the Terms and Conditions
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
                            Sign Up
                        </LoadingButton>
                    :
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={clickSubmit}
                        >
                            Sign Up
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
                        <NextLink href="/auth/forgot-password">
                            <Typography variant="body2">
                                Forgot Password?
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
