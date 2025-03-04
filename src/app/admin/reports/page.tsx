"use client"
import React, {useState, useEffect, useCallback, useRef, useContext} from "react";
import { useSession } from "next-auth/react"
// import { useRouter } from 'next/navigation'
import { useRouter } from 'next-nprogress-bar';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DataGrid, GridColDef, GridFilterModel, GridPaginationModel, GridToolbar } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Dialog from '@mui/material/Dialog'
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import PageTitleWrapper from '@/src/components/PageTitleWrapper';
import { SidebarContext } from '@/src/contexts/SidebarContext';
import checkPermission from '@/src/lib/client_authorize'
import querystring from 'query-string'
import Print from '../workorders/print'
import NextLink from "next/link";

export default function Index() {
    const theme = useTheme();
    const router = useRouter()
    const { userData } = useContext(SidebarContext);
    const { data: session } = useSession()
    const [loading, setLoading] = useState(false)
    const [transactions, setTransactions] = useState([])
    const [status, setStatus] = useState([])
    const [selectedIds, setSelectedIds] = useState([]);
    const [openNotification, setOpenNotification] = useState(false);
    const [messageNotification, setMessageNotification] = useState('');
    const [colorNotification, setColorNotification] = useState<AlertColor>('success');
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 20,
    });
    const [rowCount, setRowCount] = useState(0);
    const [sortModel, setSortModel] = useState([]);
    const [filterValue, setFilterValue] = useState({});
    const [printMode, setPrintMode] = useState(false)
    const [selectedData, setSelectedData] = useState({})

    const handleModalPrint = (data: any) => {
        setSelectedData(data)
        setPrintMode(true)
    }
    const handleModalClose = () => {
        reloadData(paginationModel.page, paginationModel.pageSize, sortModel, filterValue)
        setPrintMode(false)
    }

    const handlePaginationModelChange = (newPaginationModel: GridPaginationModel) => {
        setPaginationModel(newPaginationModel)
        reloadData(newPaginationModel.page , newPaginationModel.pageSize, sortModel, filterValue)
    };

    const handleSortModelChange = (newModel: any) => {
        setSortModel(newModel)
        reloadData(paginationModel.page, paginationModel.pageSize, newModel, filterValue)
    };

    const onFilterChange = useCallback((filterModel: GridFilterModel) => {
        let queryValue = {} as any
        if (filterModel.items[0]) {
            queryValue.field = filterModel.items[0].field
            queryValue.value = filterModel.items[0].value
            queryValue.operator = filterModel.items[0].operator
        }
        setFilterValue(queryValue);
        reloadData(paginationModel.page, paginationModel.pageSize, sortModel, queryValue)
    }, []);

    const reloadData = async (newPage: number, newPageSize: number, newModel: any, queryValue: any, skipError = false) => {
        setLoading(true)
    
        let params = {} as any
        params.offset = newPage * newPageSize
        params.limit = newPageSize
    
        if (newModel) {
          if (newModel[0]) {
            params.column = newModel[0].field
          }
          if (newModel[0]) {
            params.dir = newModel[0].sort
          }
        }
    
        if (queryValue) {
          params.searchcolumn = queryValue.field
          params.searchkey = queryValue.value
          params.searchoperator = queryValue.operator
        }
    
        try {
          const q = querystring.stringify(params);
          let response = await fetch('/api/transactions?' + q, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          })
          const data = await response.json()
          if (data && data.error) {
            setNotification(data.error, 'error')
            setTransactions([])
            setRowCount(0)
          } else {
            setTransactions(data.rows)
            setRowCount(data.count)
          }
        } catch(err) {
          console.log(err)
          setTransactions([])
          setRowCount(0)
        }
        
        setLoading(false)
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
            setStatus(data.rows.map((item:any, i:number) => {
                    return { value: item.id, label: item.name }  
                })
            )
        }
        } catch(err) {
            console.log(err)
            setStatus([])
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
        if (checkPermission(userData, 'transactions')) {
            reloadData(paginationModel.page, paginationModel.pageSize, sortModel, filterValue)
            reloadStatus()
        } else {
            router.push('/admin/dashboard')
        }
    }, [session])

    const columns: GridColDef<(typeof transactions)[number]>[] = [
        { field: 'workorder_id', headerName: 'Work Order', flex: 1, minWidth: 250, display: 'flex', 
          renderCell: (params:any) => {
            return (
                <Grid 
                    sx={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => {
                        handleModalPrint(params)
                    }} 
                >
                    <Typography>
                        { params.row.id }
                    </Typography>
                </Grid>
            )
          }
        },
        { field: 'product_id',
          headerName: 'Product',
          display: 'flex',
          minWidth: 200,
          renderCell: (params:any) => {
            return (
                <Grid>
                    { params.row.product.name }
                </Grid>
            )
          }
        },
        { field: 'qty', headerName: 'Quantity', type: "number", flex: 1, minWidth: 75, display: 'flex'},
        { field: 'due_date', headerName: 'Due Date', type:"date", flex: 1, minWidth: 150, display: 'flex', 
          valueGetter: (params:any) => {
            return (params) ? new Date(params) : null   
          }
        },
        { field: 'status_id',
          headerName: 'Status', 
          type: 'singleSelect',
          valueOptions: status, 
          display: 'flex',
          minWidth: 100,
          renderCell: (params:any) => {
            return (
                <Grid>
                    { params.row.status.name }
                </Grid>
            )
          }
        },
        { field: 'user_id',
          headerName: 'Operator', 
          display: 'flex',
          minWidth: 150,
          renderCell: (params:any) => {
            return (
                <Grid>
                    { params.row.user.name }
                </Grid>
            )
          }
        },
        { field: 'created_by',
          headerName: 'Manager', 
          display: 'flex',
          minWidth: 150,
          renderCell: (params:any) => {
            return (
                <Grid>
                    { params.row.created_user.name }
                </Grid>
            )
          }
        },
        { field: 'description', headerName: 'Description', flex: 1, minWidth: 200, display: 'flex'},
    ];

    const columnsMobile: GridColDef<(typeof transactions)[number]>[] = [
        { field: 'workorder_id', headerName: 'Work Order', flex: 1, minWidth: 150, display: 'flex', 
          renderCell: (params:any) => {
            return (<Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                            <Typography variant="h5">
                                { params.row.workorder_id }
                            </Typography>
                            <Divider />
                            <Typography variant="h5">
                                { params.row.product.name + ' ' + params.row.qty }
                            </Typography>
                            <Divider />
                            <Typography variant="subtitle2">
                                Status : { params.row.status.name }
                            </Typography>
                            <Divider />
                            <Grid>
                                Due Date : { params.row.due_date }
                            </Grid>
                            <Divider />
                            <Grid>
                                Operator : { params.row.user.name }
                            </Grid>
                            <Divider />
                            <Grid>
                                Manager : { params.row.created_user.name }
                            </Grid>
                            <Divider />
                            <Grid>
                                Description : { params.row.description }
                            </Grid>
                            <Divider />
                        </Grid>
                    </Grid>);
          }
        }
    ];
    
    let ModalElement =  <></>
    if (printMode) {
        ModalElement = <Print data={selectedData} open={printMode} onModalClose={handleModalClose} hasNotification={setNotification}/>
    } else {
        ModalElement = <></>
    }

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
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Typography variant="h3" component="h3" gutterBottom>
                            Work Order Report
                        </Typography>
                        <Typography variant="subtitle2">
                            these are your work order report 
                        </Typography>
                    </Grid>
                </Grid>
            </PageTitleWrapper>
            <Container maxWidth="lg">
                <Grid item xs={12} sx={{height: 600, width: '100%'}}>
                    <DataGrid
                        rows={transactions}
                        pageSizeOptions={[20, 50, 100]}
                        columns={(isMobile) ? columnsMobile : columns}
                        rowCount={rowCount}
                        paginationModel={paginationModel}
                        onPaginationModelChange={handlePaginationModelChange}
                        sortModel={sortModel}
                        onSortModelChange={handleSortModelChange}
                        onFilterModelChange={onFilterChange}
                        // checkboxSelection
                        disableRowSelectionOnClick
                        paginationMode="server"
                        sortingMode="server"
                        filterMode="server"
                        // loading={loading}
                        getRowHeight={() => 'auto'}
                        onRowSelectionModelChange={(Ids: any) => {
                            setSelectedIds(Ids)
                        }}
                        slotProps={{
                            filterPanel: {
                                sx: {
                                    "& .MuiDataGrid-filterForm": { 
                                        display: { xs: "block", sm: "inherit" },
                                    },
                                }
                            }
                        }}
                        slots={{
                            toolbar: GridToolbar,
                        }}   
                    />
                </Grid>
                {ModalElement}
            </Container>
        </LocalizationProvider>
    )
}


