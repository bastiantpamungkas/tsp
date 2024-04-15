import PropTypes from 'prop-types'
import { useTheme } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

export default function SnackBarWrapper(props:any) {
    const theme = useTheme();

    return (
        <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: theme.direction === 'rtl' ? 'left' : 'right' }}
            open={props.openNotification}
            autoHideDuration={6000}
            onClose={() => props.closeNotification(false)}
        >
            <Alert onClose={() => props.closeNotification(false)} severity={props.messageType}>
            <Typography sx={{ whiteSpace: "pre-wrap", mx: 2 }}>
                {props.message}
            </Typography>
            </Alert>
        </Snackbar>
    )
}

SnackBarWrapper.propTypes = {
    message: PropTypes.string.isRequired,
    messageType: PropTypes.oneOf(['success', 'info', 'warning', 'error']).isRequired,
    openNotification: PropTypes.bool.isRequired,
    closeNotification: PropTypes.func.isRequired
}
  
SnackBarWrapper.Props = {
    message: '' as string,
    messageType: 'success' as AlertColor,
    openNotification: false as Boolean,
    closeNotification: () => {}
};