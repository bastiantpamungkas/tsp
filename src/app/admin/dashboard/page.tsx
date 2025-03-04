"use client"
import { useState, useContext, useEffect } from 'react';
import { useSession } from "next-auth/react"
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { useTheme } from '@mui/material/styles';
import Alert, { AlertColor } from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog'
import Snackbar from '@mui/material/Snackbar';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { SidebarContext } from '@/src/contexts/SidebarContext';
import PageTitleWrapper from '@/src/components/PageTitleWrapper';
import AccountBalance from '@/src/components/WorkOrder/AccountBalance';

export default function Index() {
    const { userData } = useContext(SidebarContext);
    const { data: session } = useSession()
    const [loading, setLoading] = useState(false)
    const [openNotification, setOpenNotification] = useState(false);
    const [messageNotification, setMessageNotification] = useState('');
    const [colorNotification, setColorNotification] = useState<AlertColor>('success');
    const [values, setValues] = useState({
        name: ((userData) ? userData.name : '') as string,
        avatar: ((userData.image) ? userData.image : '') as string,
        qty: 0,
        price: 0,
        count: 0,
    })
    const theme = useTheme();

    const reloadData = async () => {
        setLoading(true)

        try {
            let response = await fetch('/api/dashboard', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
            })
            const data = await response.json()
            if (data && data.error) {
                setNotification(data.error, 'error')
                setValues({...values, qty: 0, price: 0, count: 0})
            } else {
                console.log(data)
                setValues({...values, qty: data.qty._sum.qty , price: data.price, count: data.count})
            }
        } catch(err) {
            console.log(err)
            setValues({...values, qty: 0, price: 0, count: 0})
        }
        
        setLoading(false)
    }

    const setNotification = (message: string, color: AlertColor) => {
        setMessageNotification(message)
        setColorNotification(color)
        setTimeout(function() {
            setOpenNotification(false);
        }, 5000);
        setOpenNotification(true)
    }

    useEffect(() => {
        setValues({...values, name: userData.name, avatar: (userData.image) ? userData.image : ''})
        reloadData()
    }, [session, userData.name, userData.image])
    
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
                    <Avatar
                    sx={{
                        mx: 2,
                        width: theme.spacing(8),
                        height: theme.spacing(8)
                    }}
                    variant="rounded"
                    alt={values.name}
                    src={values.avatar}
                    />
                </Grid>
                <Grid item>
                    <Typography variant="h3" component="h3" gutterBottom>
                    Welcome, {values.name}!
                    </Typography>
                    <Typography variant="subtitle2">
                    Today is a good day to start working!
                    </Typography>
                </Grid>
                </Grid>
            </PageTitleWrapper>   
            <Container maxWidth="lg">
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="stretch"
                >
                    <Grid item xs={12} sx={{ p: 1}}>
                        <AccountBalance data={values} />
                    </Grid>
                </Grid>
            </Container>
        </LocalizationProvider>
    )
}


