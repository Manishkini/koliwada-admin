// ** React Imports
import { forwardRef, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
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
  name: '',
  nameNative: '',
  slug: ''
}

const schema = yup.object().shape({
  name: yup
    .string()
    .required()
    .matches(/^[A-Za-z\s]+$/, 'Please enter role name in english'),
  nameNative: yup
    .string()
    .required()
    .matches(/^[ऀ-ॿ\s]+$/, 'Please enter role name in marathi'),
  slug: yup.string().required()
})

const RoleDialog = props => {
  const { open, onClose, selectedRow, refetch } = props

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

  const generateSlug = value => {
    if (value) {
      const createSlug = () => {
        return value
          .split(' ')
          .map(word => word && word.toLowerCase())
          .join('_')
      }

      const capitalizeRoleName = () => {
        return value
          .split(' ')
          .map(word => word && word[0].toUpperCase() + word.slice(1))
          .join(' ')
      }
      setValue('slug', createSlug(), { shouldValidate: true })
      setValue('name', capitalizeRoleName(), { shouldValidate: true })
    }
  }

  const createRole = async obj => {
    try {
      const invitation = await API.post(`/role`, obj)
      if (invitation.status === 201) {
        toast.success('Role created successfully!')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onSubmit = async obj => {
    try {
      createRole(obj)
      refetch()

      // upsertRow('create', response.data)
      emptyState()
      onClose()
    } catch (err) {
      console.log(err)
      onClose()
      toast.error('Something went wrong', {
        position: 'bottom-left'
      })
    }
  }

  const emptyState = () => {
    setValue('name', '')
    setValue('nameNative', '')
    setValue('slug', '')
  }

  useEffect(() => {
    if (selectedRow?.id) {
      setValue('name', selectedRow?.name)
      setValue('nameNative', selectedRow?.nameNative)
      setValue('slug', selectedRow?.slug)
    }

    return () => {
      emptyState()
    }
  }, [selectedRow])

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
        <form onSubmit={handleSubmit(onSubmit)}>
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
                <Controller
                  name='name'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='Role Name English'
                      onChange={onChange}
                      onBlur={e => generateSlug(e.target.value)}
                      placeholder='Super Admin'
                      error={Boolean(errors.name)}
                      aria-describedby='validation-schema-role-name'
                      {...(errors.name && { helperText: errors.name.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <Controller
                    name='nameNative'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        label='Role Name Marathi'
                        onChange={onChange}
                        placeholder='उच्च प्रशासक'
                        error={Boolean(errors.nameNative)}
                        aria-describedby='validation-schema-role-name-native'
                        {...(errors.nameNative && { helperText: errors.nameNative.message })}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <Controller
                    name='slug'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        label='Role Slug'
                        disabled
                        onChange={onChange}
                        placeholder='super_admin'
                        error={Boolean(errors.slug)}
                        aria-describedby='validation-schema-role-slug'
                        {...(errors.slug && { helperText: errors.slug.message })}
                      />
                    )}
                  />
                </Grid>
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
            <Button variant='tonal' color='secondary' onClick={onClose}>
              Discard
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Card>
  )
}

export default RoleDialog
