"use client"
import {useState, useEffect, useContext, Fragment} from "react";
import PropTypes from 'prop-types'
import querystring from 'query-string'
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
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import moment from 'moment'
import { SidebarContext } from '@/src/contexts/SidebarContext';
import checkRole from '@/src/lib/client_authorize_role'

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

export default function Edit(props:any) {
    const theme = useTheme();
    const { userData } = useContext(SidebarContext);
    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState([])
    const [productOpen, setProductOpen] = useState(false);
    const [loadingProduct, setLoadingProduct] = useState(false)
    const [productValue, setProductValue] = useState<{ id: string; name: string } | null>(null)
    const [status, setStatus] = useState([])
    const [operators, setOperators] = useState([])
    const [operatorOpen, setOperatorOpen] = useState(false);
    const [loadingOperator, setLoadingOperator] = useState(false)
    const [operatorValue, setOperatorValue] = useState<{ id: string; name: string } | null>(null)
    const [openNotification, setOpenNotification] = useState(false);
    const [messageNotification, setMessageNotification] = useState('');
    const [colorNotification, setColorNotification] = useState<AlertColor>('success');

    const [values, setValues] = useState({
      product_id: '',
      description: '',
      qty: 0,
      due_date: '',
      status_id: '',
      user_id: ''
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
        const workorder = {
          product_id: values.product_id || undefined,
          description: values.description || undefined,
          qty: Number(values.qty) || 0,
          due_date: (values.due_date) ? moment(values.due_date) : undefined,
          status_id: values.status_id || undefined,
          user_id: (!checkRole(userData, 'Operator')) ? values.user_id : undefined,
        }
        try {
            let response = await fetch('/api/workorders/' + props.data.id, {
              method: 'PUT',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(workorder)
            })
          const data = await response.json()
          if (data.error) {
            setNotification(data.error,'error')
          } else {
            props.hasNotification('Workorder has been updated','success')
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

    const reloadProduct = async (searchKey : string) => {
      setLoadingProduct(true)
  
      let params = {} as any
      params.offset = 0
      params.limit = 10
      params.column = 'name'
      params.dir = 'asc'
      if (searchKey) {
        params.searchcolumn = 'name'
        params.searchoperator = 'contains'
        params.searchkey = searchKey
      }

      try {
        const q = querystring.stringify(params);
        let response = await fetch('/api/products?' + q, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        if (data && data.error) {
          setNotification(data.error, 'error')
          setProducts([])
        } else {
          setProducts(data.rows)
        }
      } catch(err) {
        console.log(err)
        setProducts([])
      }

      setLoadingProduct(false)
    }

    const reloadStatus = async () => {
      setLoading(true)

      let params = {} as any
      params.offset = 0
      params.limit = -1
      params.column = 'name'
      params.dir = 'asc'
      try {
        const q = querystring.stringify(params);
        let response = await fetch('/api/status?' + q, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        if (data && data.error) {
          setNotification(data.error, 'error')
          setStatus([])
        } else {
          setStatus(data.rows)
        }
      } catch(err) {
        console.log(err)
        setStatus([])
      }

      setLoading(false)
    }

    const reloadOperator = async (searchKey: string) => {
      setLoadingOperator(true)
  
      let params = {} as any
      params.offset = 0
      params.limit = 10
      params.column = 'name'
      params.dir = 'asc'
      if (searchKey) {
        params.searchcolumn = 'name'
        params.searchoperator = 'contains'
        params.searchkey = searchKey
      }
      try {
        const q = querystring.stringify(params);
        let response = await fetch('/api/operators?' + q, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        if (data && data.error) {
          setNotification(data.error, 'error')
          setOperators([])
        } else {
          setOperators(data.rows)
        }
      } catch(err) {
        console.log(err)
        setOperators([])
      }

      setLoadingOperator(false)
    }

    const handleProductOpen = () => {
      setProductOpen(true);
      if (productValue) {
        reloadProduct(productValue.name)
      } else {
        reloadProduct('')
      }
    };
  
    const handleProductClose = () => {
      setProductOpen(false);
      setProducts([]);
    };

    const handleOperatorOpen = () => {
      setOperatorOpen(true);
      if (operatorValue) {
        reloadOperator(operatorValue.name)
      } else {
        reloadOperator('')
      }
    };
  
    const handleOperatorClose = () => {
      setOperatorOpen(false);
      setOperators([]);
    };

    useEffect(() => {
        if (props.data.id) {
          setValues({...values, product_id: props.data.row.product_id, description: (props.data.row.description == null) ? '' : props.data.row.description, qty: props.data.row.qty, due_date: (props.data.row.due_date) ? moment(props.data.row.due_date).format('YYYY-MM-DD') : '' , status_id: props.data.row.status_id, user_id: props.data.row.user_id})
          if (props.data.row.product && props.data.row.product.name) {
            reloadProduct(props.data.row.product.name)
            setProductValue({ id: props.data.row.product_id, name: props.data.row.product.name })
          }
          if (props.data.row.user && props.data.row.user.name) {
            reloadOperator(props.data.row.user.name)
            setOperatorValue({ id: props.data.row.user_id, name: props.data.row.user.name })
          }
        } else {
          setValues({...values, product_id: '', description: '', qty: 0, due_date: '', status_id: '', user_id: ''})
          setProductValue(null)
          setOperatorValue(null)
        }
        reloadStatus()
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
                  Edit Workorder
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
                  {
                    (!checkRole(userData, 'Operator')) && (
                      <Skeleton variant="text" height={60} />
                    )
                  }
                  <Skeleton variant="text" height={60} />
                </DialogContent>
              ) : (
                <DialogContent>
                  <Autocomplete
                    value={productValue}
                    onChange={(event: any, newValue: { id: string, name: string } | null) => {
                      if (newValue) {
                        setValues({ ...values, product_id: newValue.id });
                        setProductValue(newValue);
                      } else {
                        setValues({ ...values, product_id: '' });
                        setProductValue(null);
                      }
                    }}              
                    open={productOpen}
                    onOpen={handleProductOpen}
                    onClose={handleProductClose}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    getOptionLabel={(option: { id: string, name: string }) => option.name}
                    onInputChange={(event, newInputValue) => {
                      reloadProduct(newInputValue)
                    }}              
                    options={products}
                    loading={loadingProduct}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Product"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <Fragment>
                              {loadingProduct ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </Fragment>
                          ),
                        }}
                      />
                    )}              
                  />
                  <TextField id="qty" type="number" label="Quantity" fullWidth value={values.qty} onChange={handleChange('qty')} margin="normal"/><br/>
                  <TextField id="due_date" type="date" label="Due Date" fullWidth value={values.due_date} onChange={handleChange('due_date')} margin="normal" InputLabelProps={{ shrink: true }}/><br/>
                  <TextField id="description" label="Description" fullWidth value={values.description} onChange={handleChange('description')} margin="normal" multiline rows={5}/><br/>
                  {
                    (!checkRole(userData, 'Operator')) && (
                      <Autocomplete
                        value={operatorValue}
                        onChange={(event: any, newValue: { id: string, name: string } | null) => {
                          if (newValue) {
                            setValues({ ...values, user_id: newValue.id });
                            setOperatorValue(newValue);
                          } else {
                            setValues({ ...values, user_id: '' });
                            setOperatorValue(null);
                          }
                        }}              
                        open={operatorOpen}
                        onOpen={handleOperatorOpen}
                        onClose={handleOperatorClose}
                        isOptionEqualToValue={(option, value) => option.name === value.name}
                        getOptionLabel={(option: { id: string, name: string }) => option.name}
                        onInputChange={(event, newInputValue) => {
                          reloadOperator(newInputValue)
                        }}              
                        options={operators}
                        loading={loadingOperator}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Operator"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <Fragment>
                                  {loadingOperator ? <CircularProgress color="inherit" size={20} /> : null}
                                  {params.InputProps.endAdornment}
                                </Fragment>
                              ),
                            }}
                          />
                        )}              
                      />
                    )
                  }
                  <FormControl sx={{ mt:2, width:'100%' }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={values.status_id}
                      onChange={handleChange('status_id')}
                      input={<OutlinedInput label="Status" />}
                      MenuProps={MenuProps}
                      sx={{ height:50 }}
                    >
                      {status.map((item: any, i:number) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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

