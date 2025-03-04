"use client"
import {useState, useEffect} from "react";
import PropTypes from 'prop-types'
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid'
import Snackbar from '@mui/material/Snackbar'
import Alert, { AlertColor } from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'

export default function Edit(props:any) {
    const theme = useTheme();
    const [loading, setLoading] = useState(false)
    const [openNotification, setOpenNotification] = useState(false);
    const [messageNotification, setMessageNotification] = useState('');
    const [colorNotification, setColorNotification] = useState<AlertColor>('success');

    const [values, setValues] = useState({
        name: '',
        description: '',
        price: 0
    })

    const setNotification = (message: string, color: AlertColor) => {
      setMessageNotification(message)
      setColorNotification(color)
      setTimeout(function() {
        setOpenNotification(false);
      }, 5000);
      setOpenNotification(true)
    }

    const handleRequestEdit = async () => {
        setLoading(true)
        const product = {
          name: values.name || undefined,
          description: values.description || undefined,
          price: Number(values.price) || 0
        }
        try {
            let response = await fetch('/api/products/' + props.data.id, {
              method: 'PUT',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(product)
            })
          const data = await response.json()
          if (data.error) {
            setNotification(data.error,'error')
          } else {
            props.hasNotification('Product has been updated','success')
            props.onModalClose()
          }
        } catch(err) {
          console.log(err)
        }
        setLoading(false)
    }
    
    const handleChange = (name: string) => (event: { target: { value: any; }; }) => {
        setValues({ ...values, [name]: event.target.value })
    }

    useEffect(() => {
        if (props.data.id) {
            setValues({...values, name: props.data.row.name, description: (props.data.row.description == null) ? '' : props.data.row.description, price: props.data.row.price}) 
        } else {
            setValues({...values, name: '', description: '', price: 0})
        }
    }, [props.data])

    return (
        <Dialog
            fullWidth
            open={props.open}
            onClose={props.onModalClose}
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
            <DialogTitle>
              <Grid container spacing={2}>
                <Grid item xs={10} sm={11}>
                  Edit Product
                </Grid>
                <Grid item xs={2} sm={1}>
                  <IconButton aria-label="Close" onClick={props.onModalClose} color="default">
                    <CancelRoundedIcon/>
                  </IconButton>
                </Grid>
              </Grid>
            </DialogTitle>
            {
              (loading) ? (
                <DialogContent>
                  <Skeleton variant="text" height={60} />
                  <Skeleton variant="text" height={60} />
                  <Skeleton variant="text" height={60} />
                </DialogContent>
              ) : (
                <DialogContent>
                  <TextField id="name" label="Name" fullWidth value={values.name} onChange={handleChange('name')} margin="normal"/><br/>
                  <TextField id="description" label="Description" fullWidth value={values.description} onChange={handleChange('description')} margin="normal" multiline rows={5}/><br/>
                  <TextField id="price" type="number"  label="Price" fullWidth value={values.price} onChange={handleChange('price')} margin="normal"/>
                </DialogContent>
              )
            }
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
                  <Button onClick={handleRequestEdit} variant="contained" color="primary" sx={{ mx: 2}}>
                    Update
                  </Button>
                </DialogActions>
              )
            }
        </Dialog>
    )
}

Edit.propTypes = {
    data: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onModalClose: PropTypes.func.isRequired,
    hasNotification: PropTypes.func.isRequired
}
  
Edit.Props = {
    data: {},
    open: false,
    onModalClose: () => {},
    hasNotification: () => {}
};

