"use client"
import React, {useState, useEffect, useCallback, useRef} from "react";
import { useSession } from "next-auth/react"
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DataGrid, GridColDef, GridFilterModel, GridPaginationModel } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog'
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DeleteIcon from '@mui/icons-material/Delete';
import PageTitleWrapper from '@/src/components/PageTitleWrapper';
import querystring from 'query-string'
import Create from './create'
import Edit from './edit'
import Delete from './delete'
import DeleteBulk from './delete-bulk'


export default function Index() {
    const theme = useTheme();
    const { data: session } = useSession()
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState([])
    const [selectedIds, setSelectedIds] = useState([]);
    const [openNotification, setOpenNotification] = useState(false);
    const [messageNotification, setMessageNotification] = useState('');
    const [colorNotification, setColorNotification] = useState<AlertColor>('success');

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
          let response = await fetch('/api/users?' + q, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          })
          const data = await response.json()
          if (data && data.error) {
            setNotification(data.error, 'error')
            setUsers([])
            setRowCount(0)
          } else {
            setUsers(data.rows)
            setRowCount(data.count)
          }
        } catch(err) {
          console.log(err)
          setUsers([])
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
        reloadData(paginationModel.page, paginationModel.pageSize, sortModel, filterValue)
    }, [session])

    const columns: GridColDef<(typeof users)[number]>[] = [
        { field: 'name', headerName: 'Name', flex: 1, minWidth: 150, display: 'flex' },
        { field: 'email', headerName: 'Email', flex: 1, minWidth: 160, display: 'flex' },
        { field: 'user_role',
          headerName: 'Roles', 
          sortable: false,
          filterable: false,
          display: 'flex',
          width: 450,
          renderCell: (params:any) => {
            return (
              <Grid>
                { params.row.user_role.map((item: any, y: number) => {return <Chip key={item.role.id} label={item.role.name} sx={{ margin: '5px' }} />}) }
              </Grid>
            )
          }
        },
        {
          field: 'action',
          headerName: 'Action',
          sortable: false,
          filterable: false,
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
                            Users
                        </Typography>
                        <Typography variant="subtitle2">
                            these are your users
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
                        rows={users}
                        pageSizeOptions={[20, 50, 100]}
                        columns={columns}
                        rowCount={rowCount}
                        paginationModel={paginationModel}
                        onPaginationModelChange={handlePaginationModelChange}
                        sortModel={sortModel}
                        onSortModelChange={handleSortModelChange}
                        onFilterModelChange={onFilterChange}
                        checkboxSelection
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
                    />
                </Grid>
                {ModalElement}
            </Container>
        </LocalizationProvider>
    )
}


