"use client"
import {useState, useEffect} from "react";
import PropTypes from 'prop-types'
import querystring from 'query-string'
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
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    },
  },
};

export default function Create(props:any) {
    const [loading, setLoading] = useState(false)
    const [roles, setRoles] = useState([])
    const [openNotification, setOpenNotification] = useState(false);
    const [messageNotification, setMessageNotification] = useState('');
    const [colorNotification, setColorNotification] = useState<AlertColor>('success');

    const [values, setValues] = useState({
      name: '',
      password: '',
      password_confirm: '',
      email: '',
      roles: []
    })

    const setNotification = (message: string, color: AlertColor) => {
      setMessageNotification(message)
      setColorNotification(color)
      setTimeout(function() {
        setOpenNotification(false);
      }, 5000);
      setOpenNotification(true)
    }

    const handleRequestCreate = async () => {
        setLoading(true)
        const user = {
          name: values.name || undefined,
          email: values.email || undefined,
          password: values.password || undefined,
          password_confirm: values.password_confirm || undefined,
          roles: values.roles || undefined
        }
        try {
            let response = await fetch('/api/users/', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(user)
            })
          const data = await response.json()
          if (data.error) {
            setNotification(data.error,'error')
          } else {
            props.hasNotification('User has been created','success')
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

    const reloadRole = async () => {
        setLoading(true)

        let params = {} as any
        params.offset = 0
        params.column = 'name'
        params.dir = 'asc'
        try {
          const q = querystring.stringify(params);
          let response = await fetch('/api/roles?' + q, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          })
          const data = await response.json()
          if (data && data.error) {
            setNotification(data.error, 'error')
            setRoles([])
          } else {
            setRoles(data.rows)
          }
        } catch(err) {
          console.log(err)
          setRoles([])
        }

        setLoading(false)
    }

    useEffect(() => {
        setValues({...values, name: '', password: '', password_confirm: '', email: '', roles: []})
        reloadRole()
    }, [])

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
                  Create User
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
                  <Skeleton variant="text" height={60} />
                  <Skeleton variant="text" height={60} />
                </DialogContent>
              ) : (
                <DialogContent>
                  <TextField id="name" label="Name" fullWidth value={values.name} onChange={handleChange('name')} margin="normal"/><br/>
                  <TextField id="email" label="Email" fullWidth value={values.email} onChange={handleChange('email')} margin="normal"/>

                  <FormControl sx={{ mt:2, width:'100%' }}>
                    <InputLabel>Roles</InputLabel>
                    <Select
                      multiple
                      value={values.roles}
                      onChange={handleChange('roles')}
                      input={<OutlinedInput label="Roles" />}
                      MenuProps={MenuProps}
                      sx={{ height:50 }}
                    >
                      {roles.map((item: any, i:number) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField id="password" type="password" label="Password" fullWidth value={values.password} onChange={handleChange('password')} margin="normal"/><br/>
                  <TextField id="password_confirm" type="password" label="Password Confirm" fullWidth value={values.password_confirm} onChange={handleChange('password_confirm')} margin="normal"/>
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
                  <Button onClick={handleRequestCreate} variant="contained" color="primary" sx={{ mx: 2}}>
                    Create
                  </Button>
                </DialogActions>
              )
            }
        </Dialog>
    )
}

Create.propTypes = {
    data: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onModalClose: PropTypes.func.isRequired,
    hasNotification: PropTypes.func.isRequired
}
  
Create.Props = {
    data: {},
    open: false,
    onModalClose: () => {},
    hasNotification: () => {}
};

