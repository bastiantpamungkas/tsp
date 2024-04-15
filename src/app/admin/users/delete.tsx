"use client"
import {useState, useEffect} from "react";
import PropTypes from 'prop-types'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from "@mui/material/DialogContentText";
import Grid from '@mui/material/Grid'
import { AlertColor } from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import DialogTitle from '@mui/material/DialogTitle'
import SnackBarWrapper from '@/src/components/SnackBarWrapper';

export default function Delete(props:any) {
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
            let response = await fetch('/api/users/' + props.data.id, {
              method: 'DELETE',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            })
          const data = await response.json()
          if (data.error) {
            setNotification(data.error,'error')
          } else {
            props.hasNotification('User has been deleted','success')
            props.onModalClose()
          }
        } catch(err) {
          console.log(err)
        }
        setLoading(false)
    }
  
    useEffect(() => {
        if (props.data.id) {
            setValues({...values, name: props.data.row.name})
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
            <SnackBarWrapper 
                message={messageNotification} 
                messageType="colorNotification" 
                openNotification={openNotification} 
                closeNotification={() => {setOpenNotification(false)}} 
            />
            <DialogTitle>
              <Grid container spacing={2}>
                <Grid item xs={10} sm={11}>
                  Delete User
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
                    Confirm to delete user <b>{values.name}</b> ?
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

