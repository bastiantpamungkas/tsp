"use client"
import React, {useState, useEffect, useCallback, useRef, useContext} from "react";
import { useSession } from "next-auth/react"
// import { useRouter } from 'next/navigation'
import { useRouter } from 'next-nprogress-bar';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DataGrid, GridColDef, GridFilterModel, GridPaginationModel, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Dialog from '@mui/material/Dialog'
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DeleteIcon from '@mui/icons-material/Delete';
import PageTitleWrapper from '@/src/components/PageTitleWrapper';
import { SidebarContext } from '@/src/contexts/SidebarContext';
import checkPermission from '@/src/lib/client_authorize'
import querystring from 'query-string'
import Create from './create'
import Edit from './edit'
import Delete from './delete'
import DeleteBulk from './delete-bulk'


export default function Index() {
    const theme = useTheme();
    const router = useRouter()
    const { userData } = useContext(SidebarContext);
    const { data: session } = useSession()
    const [loading, setLoading] = useState(false)
    const [roles, setRoles] = useState([])
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

    const [createMode, setCreateMode] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [deleteMode, setDeleteMode] = useState(false)
    const [deleteBulkMode, setDeleteBulkMode] = useState(false)
    const [selectedData, setSelectedData] = useState({})

    const handleModalCreate = (data: any) => {
        setSelectedData(data)
        setCreateMode(true)
    }
    const handleModalEdit = (data: any) => {
        setSelectedData(data)
        setEditMode(true)
    }
    const handleModalDelete = (data: any) => {
        setSelectedData(data)
        setDeleteMode(true)
    }
    const handleModalDeleteBulk = (data: any) => {
        setSelectedData(data)
        setDeleteBulkMode(true)
    }
    const handleModalClose = () => {
        reloadData(paginationModel.page, paginationModel.pageSize, sortModel, filterValue)
        setCreateMode(false)
        setEditMode(false)
        setDeleteMode(false)
        setDeleteBulkMode(false)
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
            setRowCount(0)
          } else {
            setRoles(data.rows)
            setRowCount(data.count)
          }
        } catch(err) {
          console.log(err)
          setRoles([])
          setRowCount(0)
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
        if (checkPermission(userData, 'roles')) {
            reloadData(paginationModel.page, paginationModel.pageSize, sortModel, filterValue)
        } else {
            router.push('/admin/dashboard')
        }
    }, [session])

    const columns: GridColDef<(typeof roles)[number]>[] = [
        { field: 'name', headerName: 'Name', flex: 1, minWidth: 150, display: 'flex'},
        { field: 'description', headerName: 'Description', flex: 1, minWidth: 200, display: 'flex'},
        { field: 'role_permission',
          headerName: 'Permissions', 
          sortable: false,
          filterable: false,
          display: 'flex',
          width: 450,
          renderCell: (params:any) => {
            return (
              <Grid>
                { params.row.role_permission.map((item: any, y: number) => {return <Chip key={item.permission.id} label={item.permission.name} sx={{ margin: '5px' }} />}) }
              </Grid>
            )
          }
        },
        {
          field: 'action',
          headerName: 'Action',
          sortable: false,
          filterable: false,
          display: 'flex',
          width: 140,
          renderCell: (params:any) => {
            params.page = paginationModel.page
            params.pageSize = paginationModel.pageSize
            params.sortModel = sortModel
            params.filterValue = filterValue
            return (<Box>
                      <IconButton 
                        aria-label="Edit"
                        onClick={() => {
                            handleModalEdit(params)
                        }} 
                        color="info"
                      >
                        <EditRoundedIcon/>
                      </IconButton>
                      <IconButton 
                        aria-label="Delete"
                        onClick={() => {
                            handleModalDelete(params)
                        }} 
                        color="error"
                      >
                        <DeleteIcon/>
                      </IconButton>
                    </Box>);
          }
        },
    ];

    const columnsMobile: GridColDef<(typeof roles)[number]>[] = [
        { field: 'name', headerName: 'Name', flex: 1, minWidth: 150, display: 'flex', 
          renderCell: (params:any) => {
            return (<Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                            <Typography variant="h5">
                                { params.row.name }
                            </Typography>
                            <Divider />
                            <Typography variant="subtitle2">
                                { params.row.description }
                            </Typography>
                            <Divider />
                            <Grid>
                                { params.row.role_permission.map((item: any, y: number) => {return <Chip key={item.permission.id} label={item.permission.name} sx={{ margin: '5px' }} />}) }
                            </Grid>
                            <Divider />
                            <IconButton 
                                aria-label="Edit"
                                onClick={() => {
                                    handleModalEdit(params)
                                }} 
                                color="info"
                            >
                                <EditRoundedIcon/>
                            </IconButton>
                            <IconButton 
                                aria-label="Delete"
                                onClick={() => {
                                    handleModalDelete(params)
                                }} 
                                color="error"
                            >
                                <DeleteIcon/>
                            </IconButton>
                        </Grid>
                    </Grid>);
          }
        }
    ];

    function ExportToolbar() {
        return (
          <GridToolbarContainer>
            <GridToolbarExport />
          </GridToolbarContainer>
        );
    }  

    let ModalElement =  <></>
    if (createMode) {
        ModalElement = <Create data={selectedData} open={createMode} onModalClose={handleModalClose} hasNotification={setNotification}/>
    } else if (editMode) {
        ModalElement = <Edit data={selectedData} open={editMode} onModalClose={handleModalClose} hasNotification={setNotification}/>
    } else if (deleteMode) {
        ModalElement = <Delete data={selectedData} open={deleteMode} onModalClose={handleModalClose} hasNotification={setNotification}/>
    } else if (deleteBulkMode) {
        ModalElement = <DeleteBulk Ids={selectedIds} open={deleteBulkMode} onModalClose={handleModalClose} hasNotification={setNotification}/>
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
                            Roles
                        </Typography>
                        <Typography variant="subtitle2">
                            these are your roles
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button
                            sx={{ mt: { xs: 2, md: 0 } }}
                            variant="contained"
                            startIcon={<AddTwoToneIcon fontSize="small" sx={{ mx: 1 }} />}
                            onClick={() => {
                                handleModalCreate({})
                            }}
                        >
                            Create
                        </Button>
                        <Button
                            sx={{ mt: { xs: 2, md: 0 }, mx: 1 }}
                            variant="contained"
                            startIcon={<DeleteForeverIcon fontSize="small" sx={{ mx: 1 }} />}
                            color="error"
                            onClick={() => {
                                handleModalDeleteBulk({})
                            }}
                        >
                            Delete
                        </Button>
                    </Grid>
                </Grid>
            </PageTitleWrapper>
            <Container maxWidth="lg">
                <Grid item xs={12} sx={{height: 600, width: '100%'}}>
                    <DataGrid
                        rows={roles}
                        pageSizeOptions={[20, 50, 100]}
                        columns={(isMobile) ? columnsMobile : columns}
                        rowCount={rowCount}
                        paginationModel={paginationModel}
                        onPaginationModelChange={handlePaginationModelChange}
                        sortModel={sortModel}
                        onSortModelChange={handleSortModelChange}
                        onFilterModelChange={onFilterChange}
                        checkboxSelection
                        disableRowSelectionOnClick
                        paginationMode="server"
                        sortingMode="server"
                        filterMode="server"
                        loading={loading}
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
                            toolbar: ExportToolbar,
                        }}   
                    />
                </Grid>
                {ModalElement}
            </Container>
        </LocalizationProvider>
    )
}


