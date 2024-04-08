import { useRef, useState, useContext, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation'
import { signOut } from "next-auth/react"
import querystring from 'query-string'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Hidden from '@mui/material/Hidden';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { lighten, styled } from '@mui/material/styles';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import { SidebarContext } from '@/src/contexts/SidebarContext';

const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${lighten(theme.palette.secondary.main, 0.5)}
`
);

const UserNextLink = styled(NextLink)(
  ({ theme }) => `
        text-decoration: none;
        cursor: "pointer"
`
);


function HeaderUserbox() {
  const { userData } = useContext(SidebarContext);
  const router = useRouter()
  const [values, setValues] = useState({
    name: '',
    email: '',
    jobtitle: '',
    image: ''
  })

  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleSignOut = async () => {
    setOpen(false);
    const response = await signOut({redirect: false})
    if (response.url) {
      const responseUrl = querystring.stringify({ 'callbackUrl' : response.url })
      router.push('/auth/signin?' + responseUrl)
    }
  };

  useEffect(() => {
    setValues({...values, name: userData.name, email: userData.email, jobtitle: '', image: (userData.image) ? userData.image : ''})
  }, [userData.name, userData.email, userData.image])

  return (
    <>
      <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        <Avatar variant="rounded" alt={values.name} src={values.image} sx={{ mx: 1 }}/>
        <Hidden mdDown>
          <UserBoxText>
            <UserBoxLabel variant="body1">{values.name}</UserBoxLabel>
            <UserBoxDescription variant="body2">
              {values.jobtitle}
            </UserBoxDescription>
          </UserBoxText>
        </Hidden>
        <Hidden smDown>
          <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
        </Hidden>
      </UserBoxButton>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuUserBox sx={{ minWidth: 210, alignItems: 'center' }} display="flex">
          <Avatar variant="rounded" alt={values.name} src={values.image} sx={{ mx: 1 }}/>
          <UserBoxText>
            <UserBoxLabel variant="body1">{values.name}</UserBoxLabel>
            <UserBoxDescription variant="body2">
              {values.jobtitle}
            </UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider sx={{ mb: 0 }} />
        <List sx={{ p: 1 }} component="nav">
          <UserNextLink href="/admin/profile" onClick={handleClose}>
            <ListItem button>
              <AccountBoxTwoToneIcon fontSize="small" />
              <ListItemText primary="My Profile" />
            </ListItem>
          </UserNextLink>
        </List>
        <Divider />
        <List sx={{ p: 1 }} component="nav">
          <ListItem button onClick={handleSignOut}>
            <LockOpenTwoToneIcon fontSize="small" />
            <ListItemText primary="Sign out" />
          </ListItem>
        </List>
      </Popover>
    </>
  );
}

export default HeaderUserbox;
