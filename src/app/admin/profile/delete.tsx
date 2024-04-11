"use client"
import {useState, useEffect} from "react";
import { signOut } from "next-auth/react"
// import { useRouter } from 'next/navigation'
import { useRouter } from 'next-nprogress-bar';
import PropTypes from 'prop-types'
import querystring from 'query-string'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from "@mui/material/DialogContentText";
import Grid from '@mui/material/Grid'
import Snackbar from '@mui/material/Snackbar'
import Alert, { AlertColor } from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'

export default function Delete(props:any) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [openNotification, setOpenNotification] = useState(false);
    const [messageNotification, setMessageNotification] = useState('');
    const [colorNotification, setColorNotification] = useState<AlertColor>('success');

    const [values, setValues] = useState({
        name: ''
    })

    const setNotification = (message: string, color: AlertColor) => {
      setMessageNotification(message)
      setColorNotification(color)
      setTimeout(function() {
        setOpenNotification(false);
      }, 5000);
      setOpenNotification(true)
    }

    const handleRequestDelete = async () => {
        setLoading(true)
        try {
            let response = await fetch('/api/profile', {
              method: 'DELETE',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            })
          const data = await response.json()
          if (data.error) {
            setNotification(data.error,'error')
            setLoading(false)
          } else {
            setNotification('User has been deleted','success')
            setTimeout(async function() {
              const response = await signOut({redirect: false})
              if (response.url) {
                const responseUrl = querystring.stringify({ 'callbackUrl' : response.url })
                router.push('/auth/signin?' + responseUrl)
              }
            }, 3000);
          }
        } catch(err) {
          console.log(err)
          setLoading(false)
        }
    }
  
    useEffect(() => {
        if (props.data.id) {
            setValues({...values, name: props.data.name})
        } else {
            setValues({...values, name: ''})
        }
    }, [props.data])

    return (
        <Dialog
            fullWidth
            open={props.open}
            onClose={props.onModalClose}
        >
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
            <DialogTitle>
              <Grid container spacing={2}>
                <Grid item xs={10} sm={11}>
                  Delete Profile
                </Grid>
                <Grid item xs={2} sm={1}>
                  <IconButton aria-label="Close" onClick={props.onModalClose} color="default">
                    <CancelRoundedIcon/>
                  </IconButton>
                </Grid>
              </Grid>
            </DialogTitle>
            <DialogContent>
              {
                (loading) ? (
                  <DialogContentText>
                    <Skeleton variant="text" height={60} />
                  </DialogContentText>
                ) : (
                  <DialogContentText>
                    Confirm to delete profile <b>{values.name}</b> ?
                  </DialogContentText>
                )
              }
            </DialogContent>
            {
              (loading) ? (
                <DialogActions sx={{my:3}}>
                  <Skeleton variant="rectangular" height={40} width={100}/>
                  <Skeleton variant="rectangular" height={40} width={100} sx={{ mx: 2}}/>
                </DialogActions>
              ) : (
                <DialogActions sx={{my:3}}>
                  <Button onClick={props.onModalClose} variant="contained" color="inherit">
                    Cancel
                  </Button>
                  <Button onClick={handleRequestDelete} variant="contained" color="error" sx={{ mx: 2}}>
                    Delete
                  </Button>
                </DialogActions>
              )
            }
        </Dialog>
    )
}

Delete.propTypes = {
    data: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onModalClose: PropTypes.func.isRequired,
    hasNotification: PropTypes.func.isRequired
}
  
Delete.Props = {
    data: {},
    open: false,
    onModalClose: () => {},
    hasNotification: () => {}
};

