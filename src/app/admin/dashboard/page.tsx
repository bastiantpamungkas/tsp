"use client"
import { useState, useContext, useEffect } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { SidebarContext } from '@/src/contexts/SidebarContext';
import PageTitleWrapper from '@/src/components/PageTitleWrapper';
import AccountBalance from '@/src/components/Crypto/AccountBalance';
import Wallets from '@/src/components/Crypto/Wallets';
import AccountSecurity from '@/src/components/Crypto/AccountSecurity';
import WatchList from '@/src/components/Crypto/WatchList';

export default function Index() {
    const { userData } = useContext(SidebarContext);
    const [values, setValues] = useState({
        name: ((userData) ? userData.name : '') as string,
        avatar: ((userData.image) ? userData.image : '') as string
    })
    const theme = useTheme();

    useEffect(() => {
        setValues({...values, name: userData.name, avatar: (userData.image) ? userData.image : ''})
    }, [userData.name, userData.image])
    
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                    Today is a good day to start trading crypto assets!
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
                        <AccountBalance />
                    </Grid>
                    <Grid item lg={8} xs={12} sx={{ p: 1}}>
                        <Wallets />
                    </Grid>
                    <Grid item lg={4} xs={12} sx={{ p: 1}}>
                        <AccountSecurity />
                    </Grid>
                    <Grid item xs={12} sx={{ p: 1}}>
                        <WatchList />
                    </Grid>
                </Grid>
            </Container>
        </LocalizationProvider>
    )
}


