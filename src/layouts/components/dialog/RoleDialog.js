// ** React Imports
import { useState, forwardRef, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Switch from '@mui/material/Switch'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import PermissionsTable from '../table/permissionsTable'
import API from 'src/configs/axios'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

const capitalize = string => string && string[0].toUpperCase() + string.slice(1)

const getSlug = string =>
  string &&
  string
    .split(' ')
    .map(word => word.toLowerCase())
    .join('_')

const ROLE_LIST = [
  {
    name: 'Super Admin',
    nameNative: 'उच-प्रशासक',
    slug: 'super_admin'
  },
  {
    name: 'Admin',
    nameNative: 'प्रशासक',
    slug: 'admin'
  },
  {
    name: 'Chairman',
    nameNative: 'अध्यक्ष',
    slug: 'chairman'
  },
  {
    name: 'Vice President',
    nameNative: 'उपाध्यक्ष',
    slug: 'vice_president'
  },
  {
    name: 'Secretary',
    nameNative: 'सेक्रेटरी',
    slug: 'secretary'
  },
  {
    name: 'Deputy Secretary',
    nameNative: 'उप-सेक्रेटरी',
    slug: 'deputy_secretary'
  },
  {
    name: 'deputy_treasurer',
    nameNative: 'खजिनदार',
    slug: 'treasurer'
  },
  {
    name: 'Deputy Treasurer',
    nameNative: 'उप-खजिनदार',
    slug: 'deputy_treasurer'
  }
]

const RoleDialog = props => {
  const { open, onClose, selectedRow, upsertRow, permissions } = props
  const [permissionRecords, setPermissionRecords] = useState([])
  const [value, setValue] = useState('')

  const onSubmit = async event => {
    event.preventDefault()
    try {
      const { name, nameNative, slug } = ROLE_LIST.find(data => data.slug === value)
      const response = await API.post('/role', { name, nameNative, slug, permissions: permissionRecords })
      upsertRow('create', response.data)
      onClose()
    } catch (err) {
      console.log(err)
      onClose()
      toast.error('Something went wrong', {
        position: 'bottom-left'
      })
    }
  }

  const upsertPermission = records => {
    setPermissionRecords(records)
  }

  return (
    <Card>
      <Dialog
        fullWidth
        open={open}
        maxWidth='md'
        scroll='body'
        onClose={onClose}
        TransitionComponent={Transition}
        onBackdropClick={onClose}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <CustomCloseButton onClick={onClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h3' sx={{ mb: 3 }}>
              Add New Role
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Updating user details will receive a privacy audit.
            </Typography>
          </Box>
          <Grid container spacing={12}>
            <Grid item xs={12}>
              <CustomTextField
                select
                fullWidth
                defaultValue=''
                label='ROLE'
                id='select-controlled'
                SelectProps={{ value, onChange: e => setValue(e.target.value) }}
              >
                <MenuItem value=''>
                  <em>कृपया प्रशासक निवडा</em>
                </MenuItem>
                <MenuItem value={'super_admin'}>{`उच-प्रशासक (Super Admin)`}</MenuItem>
                <MenuItem value={'admin'}>{`प्रशासक (Admin)`}</MenuItem>
                <MenuItem value={'chairman'}>{`अध्यक्ष (Chairman)`}</MenuItem>
                <MenuItem value={'vice_president'}>{`उपाध्यक्ष (Vice President)`}</MenuItem>
                <MenuItem value={'secretary'}>{`सेक्रेटरी (Secretary)`} </MenuItem>
                <MenuItem value={'deputy_secretary'}>{`उप-सेक्रेटरी (Deputy Secretary)`} </MenuItem>
                <MenuItem value={'treasurer'}>{`खजिनदार (Treasurer)`}</MenuItem>
                <MenuItem value={'deputy_treasurer'}>{`उप-खजिनदार (Deputy Treasurer)`}</MenuItem>
              </CustomTextField>
            </Grid>
            <Grid item xs={12}>
              <PermissionsTable rows={permissions} upsertPermission={upsertPermission} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' sx={{ mr: 1 }} onClick={onSubmit}>
            Submit
          </Button>
          <Button variant='tonal' color='secondary' onClick={onClose}>
            Discard
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default RoleDialog
