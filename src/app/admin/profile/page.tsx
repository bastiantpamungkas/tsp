"use client"
import {useState, useContext, useEffect} from "react";
import { useSession, signOut } from "next-auth/react"
// import { useRouter } from 'next/navigation'
import { useRouter } from 'next-nprogress-bar';
import querystring from 'query-string'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { useTheme, styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog'
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Alert, { AlertColor } from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import { SidebarContext } from '@/src/contexts/SidebarContext';
import PageTitleWrapper from '@/src/components/PageTitleWrapper';
import Delete from './delete'

const Input = styled('input')({
    display: 'none'
});
  
const AvatarWrapper = styled(Card)(
    ({ theme }) => `
  
      position: relative;
      overflow: visible;
      display: inline-block;
      margin-right: ${theme.spacing(2)};
      margin-left: ${theme.spacing(2)};
  
      .MuiAvatar-root {
        width: ${theme.spacing(16)};
        height: ${theme.spacing(16)};
      }
  `
);
  
const ButtonUploadWrapper = styled(Box)(
    ({ theme }) => `
      position: absolute;
      width: ${theme.spacing(4)};
      height: ${theme.spacing(4)};
      bottom: -${theme.spacing(1)};
      right: -${theme.spacing(1)};
  
      .MuiIconButton-root {
        border-radius: 100%;
        background: ${theme.colors.primary.main};
        color: ${theme.palette.primary.contrastText};
        box-shadow: ${theme.colors.shadows.primary};
        width: ${theme.spacing(4)};
        height: ${theme.spacing(4)};
        padding: 0;
    
        &:hover {
          background: ${theme.colors.primary.dark};
        }
      }
  `
);

export default function Index() {
    const theme = useTheme();
    const { userData } = useContext(SidebarContext);
    const { data: session, update } = useSession()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [openNotification, setOpenNotification] = useState(false);
    const [messageNotification, setMessageNotification] = useState('');
    const [colorNotification, setColorNotification] = useState<AlertColor>('success');
    const [deleteMode, setDeleteMode] = useState(false)
    const [selectedData, setSelectedData] = useState({})
    const [withPassword, setWithPassword] = useState(true)
    const [values, setValues] = useState({
        name: '',
        email: '',
        image: '',
        password: '',
        password_confirm: ''
    })

    const handleModalDelete = () => {
        setSelectedData({...selectedData, name: values.name, email: values.email, image: values.image })
        setDeleteMode(true)
    }
    const handleModalClose = () => {
        setDeleteMode(false)
    }

    const handleRequestEdit = async () => {
        setLoading(true)
        const user = {
          name: values.name || undefined,
          email: values.email || undefined,
          password: values.password || undefined,
          password_confirm: values.password_confirm || undefined,
        }
        try {
            let response = await fetch('/api/profile', {
              method: 'PUT',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(user)
            })
          const data = await response.json()
          if (data.error) {
            setNotification(data.error,'error')
            setLoading(false)
          } else {
            setNotification('Profile has been updated','success')
            if (values.password && values.password_confirm) {
              setValues({...values, password: '', password_confirm: ''})
              setTimeout(async function() {
                const response = await signOut({redirect: false})
                if (response.url) {
                  const responseUrl = querystring.stringify({ 'callbackUrl' : response.url })
                  router.push('/auth/signin?' + responseUrl)
                }
              }, 3000);
            } else {
              if (session) {
                await update({
                  ...session,
                  user: { ...session.user, id: data.id, name: data.name, email: data.email, image: data.image },
                })
              }
              setLoading(false)
            }
          }
        } catch(err) {
          console.log(err)
          setLoading(false)
        }
    }

    const handleFileInput = async (e: any) => {
        setLoading(true)
        const file = (e.target.files[0]) ? e.target.files[0] : ''
        let payload = new FormData()
        payload.append('photo', file)
        e.target.files = undefined
    
        try {
          let response = await fetch('/api/profile/upload', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
              },
              body: payload
            })
          const data = await response.json()
          if (data.error) {
            setNotification(data.error,'error')
          } else {
            setNotification('Image has been updated','success')
            if (session) {
              await update({
                ...session,
                user: { ...session.user, id: data.profile.id, name: data.profile.name, email: data.profile.email, image: data.profile.image },
              })
            }
          }
        } catch(err) {
          console.log(err)
        }
        setLoading(false)
    }

    const handleChange = (name: string) => (event: { target: { value: any; }; }) => {
        setValues({ ...values, [name]: event.target.value })
    }

    const setNotification = (message: string, color: AlertColor) => {
      setMessageNotification(message)
      setColorNotification(color)
      setTimeout(function() {
        setOpenNotification(false);
      }, 5000);
      setOpenNotification(true)
    }

    const loadData = async () => {
        setLoading(true)
        
        try {
          let response = await fetch('/api/profile', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          })
          const data = await response.json()
          if (data && data.error) {
            setNotification(data.error,'error')
            setWithPassword(true)
          } else {
            if (data.account) {
              setWithPassword(false)
            }
          }
        } catch(err) {
          console.log(err)
          setWithPassword(true)
        }
        
        setLoading(false)
    }

    useEffect(() => {
      loadData
    }, [])

    useEffect(() => {
      setValues({...values, name: userData.name, email: userData.email, image: userData.image, password: '', password_confirm: ''})
    }, [userData])

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Dialog
                fullWidth
                open={openNotification}
                onClose={() => setOpenNotification(false)}
            >
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
            </Dialog>
            <PageTitleWrapper>
                <Grid container alignItems="center">
                    <Grid item>
                        <AvatarWrapper>
                            <Avatar variant="rounded" alt={values.name} src={((values.image) ? values.image : '') as string} />
                            <ButtonUploadWrapper>
                                <Input
                                    accept="image/*"
                                    id="icon-button-file"
                                    name="icon-button-file"
                                    type="file"
                                    onChange={handleFileInput}
                                />
                                <label htmlFor="icon-button-file">
                                    <IconButton component="span" color="primary">
                                    <UploadTwoToneIcon />
                                    </IconButton>
                                </label>
                            </ButtonUploadWrapper>
                        </AvatarWrapper>
                    </Grid>
                    <Grid item>
                    <Typography variant="h3" component="h3" gutterBottom>
                        Profile for {values.name}!
                    </Typography>
                    <Typography variant="subtitle2">
                        This is a profile page. Easy to modify, always blazing fast
                    </Typography>
                    </Grid>
                </Grid>
            </PageTitleWrapper>
            <Container maxWidth="lg">
                <Grid
                    container
                    direction="row"
                >
                
                    {
                        (loading) ? (
                            <Grid sx={{
                                width: '100%',
                            }}>
                                <Skeleton variant="text" height={70} />
                                <Skeleton variant="text" height={70} />
                                {
                                    (withPassword) ? (
                                    <>
                                        <Skeleton variant="text" height={70} />
                                        <Skeleton variant="text" height={70} />
                                    </>
                                    ) : (<></>)
                                }
                            </Grid>
                        ) : (
                            <>
                                <TextField id="name" label="Name" fullWidth value={values.name} onChange={handleChange('name')} margin="normal"/><br/>
                                <TextField id="email" type="email" label="Email" fullWidth value={values.email} onChange={handleChange('email')} margin="normal"/><br/>
                                {
                                    (withPassword) ? (
                                    <>
                                        <TextField id="password" type="password" label="Password" fullWidth value={values.password} onChange={handleChange('password')} margin="normal"/><br/>
                                        <TextField id="password_confirm" type="password" label="Password Confirm" fullWidth value={values.password_confirm} onChange={handleChange('password_confirm')} margin="normal"/><br/>
                                    </>
                                    ) : (<></>)
                                }
                            </>
                        )
                    }
                    {
                        (loading) ? (
                            <Grid container spacing={2} sx={{marginTop: 3, marginBottom: 3, p:2}}>
                                <Skeleton variant="rectangular" height={40} width={100}/>
                                <Skeleton variant="rectangular" height={40} width={100} sx={{ mx: 2}}/>
                            </Grid>
                        ) : (
                            <Grid sx={{marginTop: 3, marginBottom: 3}}>
                                <Button onClick={handleRequestEdit} variant="contained" color="primary">
                                    Update
                                </Button>
                                <Button onClick={handleModalDelete} variant="contained" color="error" sx={{ mx: 2}}>
                                    Delete
                                </Button>
                            </Grid>
                        )
                    }
                </Grid>
                <Delete data={selectedData} open={deleteMode} onModalClose={handleModalClose} hasNotification={setNotification}/>
            </Container>
            
        </LocalizationProvider>
    )
}


