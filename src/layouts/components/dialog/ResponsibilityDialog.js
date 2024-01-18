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

// ** Third Party Imports
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

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

const defaultValues = {
  role: '',
  permissions: []
}

const schema = yup.object().shape({
  role: yup.string().required(),
  permissions: yup.array()
})

const ResponsibilityDialog = props => {
  const { open, onClose, roles, selectedRow, permissions, fetchResponsibility } = props
  const [permissionRecords, setPermissionRecords] = useState([])

  // ** Form
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const emptyCurrentState = () => {
    setValue('role', '')
    setPermissionRecords([])
  }

  const onSubmit = async event => {
    try {
      const { role } = event

      const response = await API.post('/responsibility', { role, permissions: permissionRecords })
      if (response.status === 200) {
        toast.success('Responsibility Assigned to the role successfully!', {
          position: 'bottom-left'
        })
        fetchResponsibility()
        onClose()
        emptyCurrentState()
      }
    } catch (err) {
      console.log(err)
      onClose()
      emptyCurrentState()
      toast.error('Something went wrong', {
        position: 'bottom-left'
      })
    }
  }

  const upsertPermission = records => {
    setPermissionRecords(records)
  }

  useEffect(() => {
    if (selectedRow?.id) {
      setValue('role', selectedRow.role.id)
    }
  }, [selectedRow, setValue])

  return (
    <Card>
      <Dialog
        fullWidth
        open={open}
        maxWidth='md'
        scroll='body'
        onClose={() => {
          onClose()
          emptyCurrentState()
        }}
        TransitionComponent={Transition}
        onBackdropClick={() => {
          onClose()
          emptyCurrentState()
        }}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent
            sx={{
              pb: theme => `${theme.spacing(8)} !important`,
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <CustomCloseButton
              onClick={() => {
                onClose()
                emptyCurrentState()
              }}
            >
              <Icon icon='tabler:x' fontSize='1.25rem' />
            </CustomCloseButton>
            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography variant='h3' sx={{ mb: 3 }}>
                Add New Responsibility
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Updating user details will receive a privacy audit.
              </Typography>
            </Box>
            <Grid container spacing={12}>
              <Grid item xs={12}>
                <Controller
                  name='role'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      id='role-select'
                      label='Roles'
                      SelectProps={{
                        value: value,
                        onChange: e => onChange(e)
                      }}
                      error={Boolean(errors.role)}
                      aria-describedby='validation-basic-select'
                      {...(errors.role && { helperText: 'Please Select Role' })}
                    >
                      {roles?.length ? (
                        roles.map(role => (
                          <MenuItem value={role.id} key={role.id}>
                            {role.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No data</MenuItem>
                      )}
                    </CustomTextField>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <PermissionsTable rows={permissions} isEdited={selectedRow?.id} upsertPermission={upsertPermission} />
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
            <Button type='submit' variant='contained' sx={{ mr: 1 }}>
              Submit
            </Button>
            <Button
              variant='tonal'
              color='secondary'
              onClick={() => {
                onClose()
                emptyCurrentState()
              }}
            >
              Discard
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Card>
  )
}

export default ResponsibilityDialog
