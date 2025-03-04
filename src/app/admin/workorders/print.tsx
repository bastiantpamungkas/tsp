"use client"
import {useState, useRef } from "react";
import PropTypes from 'prop-types'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import moment from 'moment'
import QRCode from "react-qr-code";
import { useReactToPrint } from "react-to-print";

export default function Print(props:any) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false)

    const handleRequestPrint = async () => {
        setLoading(true)
        useReactToPrint({ contentRef })
        setLoading(false)
    }

    const reactToPrintFn = useReactToPrint({ contentRef })

    return (
        <Dialog
            fullWidth
            open={props.open}
            onClose={props.onModalClose}
        >
            <DialogTitle>
              <Grid container spacing={2}>
                <Grid item xs={10} sm={11}>
                  Print Workorder No { props.data.row.id }
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
                  <Skeleton variant="text" height={60} />
                </DialogContent>
              ) : (
                <DialogContent>
                  <Grid ref={contentRef} sx={{
                      '@media print': {
                        color: "black",
                        textAlign: "center"
                      },
                    }}
                  >
                    <Grid textAlign={"center"} sx={{
                        display: "none",
                        '@media print': {
                          display: "block",
                          margin: "20px 0px 50px 0px",
                          fontSize: "20px"
                        },
                      }}
                    >
                      No { props.data.row.id }
                    </Grid>
                    <Grid textAlign={"center"}>
                      <QRCode
                        style={{ height: "auto", maxWidth: "200px", width: "200px" }}
                        value= { props.data.row.id }
                        viewBox={`0 0 256 256`}
                      />
                    </Grid>
                    <Grid sx={{ marginY: "20px" }}>
                      <Grid sx={{ marginY: "10px" }}>
                        <Typography>
                          Due Date : { (props.data.row.due_date) ? moment(props.data.row.due_date).format('DD - MMM - YYYY') : '' }
                        </Typography>
                      </Grid>
                      <Grid sx={{ marginY: "10px" }}>
                        <Typography>
                          Production Manager : { (props.data.row.created_user) ? props.data.row.created_user.name : '' }
                        </Typography>
                      </Grid>
                      <Grid sx={{ marginY: "10px" }}>
                        <Typography>
                          Operator : { (props.data.row.user) ? props.data.row.user.name : '' }
                        </Typography>
                      </Grid>
                      <Grid sx={{ marginY: "10px" }}>
                        <Typography>
                          Product : { (props.data.row.product) ? props.data.row.product.name : '' }
                        </Typography>
                      </Grid>
                      <Grid sx={{ marginY: "10px" }}>
                        <Typography>
                          Quantity : { props.data.row.qty }
                        </Typography>
                      </Grid>
                      <Grid sx={{ marginY: "10px" }}>
                        <Typography>
                          Description : { props.data.row.description }
                        </Typography>
                      </Grid>
                      <Grid sx={{ marginY: "10px" }}>
                        <Typography>
                          Status : { (props.data.row.status) ? props.data.row.status.name : '' }
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
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
                  <Button onClick={() => reactToPrintFn()} variant="contained" color="primary" sx={{ mx: 2}}>
                    Print
                  </Button>
                </DialogActions>
              )
            }
        </Dialog>
    )
}

Print.propTypes = {
    data: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onModalClose: PropTypes.func.isRequired,
    hasNotification: PropTypes.func.isRequired
}
  
Print.Props = {
    data: {},
    open: false,
    onModalClose: () => {},
    hasNotification: () => {}
};

