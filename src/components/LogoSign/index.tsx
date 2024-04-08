import { styled, useTheme } from '@mui/material/styles';
import { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Link from '@/src/components/Link';

const LogoWrapper = styled(Link)(
  ({ theme }) => `
        color: ${theme.palette.text.primary};
        background-color: ${theme.colors.alpha.trueWhite[70]};
        display: flex;
        text-decoration: none;
        width: 53px;
        margin: 0 auto;
        padding: 5px;
        border-radius: 5px;
        font-weight: ${theme.typography.fontWeightBold};
`
);

const LogoSignWrapper = styled(Box)(
  () => `
        width: 52px;
        height: 38px;
`
);

const LogoSign = styled(Box)(
  ({ theme }) => `
        background: ${theme.general.reactFrameworkColor};
        width: 18px;
        height: 18px;
        border-radius: ${theme.general.borderRadiusSm};
        position: relative;
        transform: rotate(45deg);
        top: 3px;
        left: 17px;

        &:after, 
        &:before {
            content: "";
            display: block;
            width: 18px;
            height: 18px;
            position: absolute;
            top: -1px;
            right: -20px;
            transform: rotate(0deg);
            border-radius: ${theme.general.borderRadiusSm};
        }

        &:before {
            background: ${theme.palette.primary.dark};
            right: auto;
            left: 0;
            top: 20px;
        }

        &:after {
            background: ${theme.palette.secondary.dark};
        }
`
);

const LogoSignInner = styled(Box)(
  ({ theme }) => `
        width: 16px;
        height: 16px;
        position: absolute;
        top: 12px;
        left: 12px;
        z-index: 5;
        border-radius: ${theme.general.borderRadiusSm};
        background: ${theme.header.textColor};
`
);

const TooltipWrapper = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.colors.alpha.trueWhite[100],
    color: theme.palette.getContrastText(theme.colors.alpha.trueWhite[100]),
    fontSize: theme.typography.pxToRem(12),
    fontWeight: 'bold',
    borderRadius: theme.general.borderRadiusSm,
    boxShadow:
      '0 .2rem .8rem rgba(7,9,25,.18), 0 .08rem .15rem rgba(7,9,25,.15)'
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.colors.alpha.trueWhite[100]
  }
}));

function Logo() {
  const theme = useTheme();

  return (
    <TooltipWrapper
      title={process.env.NEXT_PUBLIC_APP_NAME}
      arrow
    >
      <LogoWrapper href="/">
        <img
          src="/static/images/logo/material-ui.svg"
          alt={process.env.NEXT_PUBLIC_APP_NAME}
          width={53}
        />
      </LogoWrapper>
    </TooltipWrapper>
  );
}

export default Logo;
