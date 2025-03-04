import NextLink from 'next/link';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { alpha, useTheme, styled } from '@mui/material/styles';
import TrendingUp from '@mui/icons-material/TrendingUp';
import Text from '@/src/components/Text';
import PropTypes from 'prop-types'

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.main};
      color: ${theme.palette.success.contrastText};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.shadows.success};
`
);

const ListItemAvatarWrapper = styled(ListItemAvatar)(
  ({ theme }) => `
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing(1)};
  padding: ${theme.spacing(0.5)};
  border-radius: 60px;
  background: ${
    theme.palette.mode === 'dark'
      ? theme.colors.alpha.trueWhite[30]
      : alpha(theme.colors.alpha.black[100], 0.07)
  };

  img {
    background: ${theme.colors.alpha.trueWhite[100]};
    padding: ${theme.spacing(0.5)};
    display: block;
    border-radius: inherit;
    height: ${theme.spacing(4.5)};
    width: ${theme.spacing(4.5)};
  }
`
);

const WorkOrderLink = styled(NextLink)(
  ({ theme }) => `
        text-decoration: none;
        cursor: "pointer"
`
);

function AccountBalance(props:any) {
  const theme = useTheme();

  console.log(props)

  return (
    <Card>
      <Grid spacing={0} container>
        <Grid item xs={12} md={6}>
          <Box p={4}>
            <Typography
              sx={{
                pb: 3
              }}
              variant="h4"
            >
              Monthly Production
            </Typography>
            <Box>
              <Typography variant="h1" gutterBottom>
                Rp. { new Intl.NumberFormat("en-US").format(props.data.price) }
              </Typography>
              <Typography
                variant="h4"
                fontWeight="normal"
                color="text.secondary"
              >
                { new Intl.NumberFormat("en-US").format(props.data.qty) } Units
              </Typography>
            </Box>
            <Grid container spacing={3} sx={{ marginY: "40px" }}>
              <Grid sm item>
                <WorkOrderLink href="/admin/reports">
                  <Grid sm item>
                    <Button fullWidth variant="outlined">
                      Report
                    </Button>
                  </Grid>
                </ WorkOrderLink>
              </Grid>
              <Grid sm item>
                <WorkOrderLink href="/admin/workorders">
                  <Button fullWidth variant="contained">
                    Create Work Order
                  </Button>
                </WorkOrderLink>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}

export default AccountBalance;

AccountBalance.propTypes = {
    data: PropTypes.object.isRequired,
}
  
AccountBalance.Props = {
    data: {},
};
