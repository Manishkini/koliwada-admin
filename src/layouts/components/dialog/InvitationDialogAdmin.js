// ** React Imports
import { useState, forwardRef, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import MuiInputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

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

const defaultValues = {
  firstName: '',
  middleName: '',
  lastName: '',
  firstNameNative: '',
  middleNameNative: '',
  lastNameNative: '',
  state: '',
  district: '',
  tehsil: '',
  village: '',
  role: '',
  email: '',
  mobileNumber: ''
}

const schema = yup.object().shape({
  firstName: yup
    .string()
    .required()
    .matches(/^[A-Za-z\s]+$/, 'Please enter first name in english'),
  middleName: yup
    .string()
    .required()
    .matches(/^[A-Za-z\s]+$/, 'Please enter middle name in english'),
  lastName: yup
    .string()
    .required()
    .matches(/^[A-Za-z\s]+$/, 'Please enter last name in english'),
  firstNameNative: yup
    .string()
    .required()
    .matches(/^[ऀ-ॿ\s]+$/, 'Please enter first name in marathi'),
  middleNameNative: yup
    .string()
    .required()
    .matches(/^[ऀ-ॿ\s]+$/, 'Please enter middle name in marathi'),
  lastNameNative: yup
    .string()
    .required()
    .matches(/^[ऀ-ॿ\s]+$/, 'Please enter last name in marathi'),
  state: yup.string().required(),
  district: yup.string().required(),
  tehsil: yup.string().required(),
  role: yup.string().required(),
  village: yup.string().required(),
  email: yup
    .string()
    .required()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address.'),
  mobileNumber: yup
    .string()
    .required()
    .matches(/^[6-9]\d{9}$/, 'Please enter valid mobile number')
})

const InvitationDialogAdmin = props => {
  const { show, setShow, states, roles, fetchInvitations } = props

  // States
  const [districts, setDistricts] = useState([])
  const [tehsils, setTehsils] = useState([])
  const [villages, setVillages] = useState([])

  // ** Hook
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const fetchDistricts = async id => {
    const district = await API.get(`/district/state/${id}`)
    setDistricts(district.data)
  }

  const fetchTehsils = async id => {
    const tehsil = await API.get(`/tehsil/district/${id}`)
    setTehsils(tehsil.data)
  }

  const fetchVillages = async id => {
    const village = await API.get(`/village/tehsil/${id}`)
    setVillages(village.data)
  }

  const sendInvitation = async e => {
    try {
      const invitation = await API.post(`/auth/admin/invitation`, e)
      if (invitation.status === 201) {
        toast.success('Invitation sent successfully!')
        setShow(false)
        fetchInvitations()
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onSubmit = e => {
    e.mobileNumber = `+91${e.mobileNumber}`
    sendInvitation(e)
  }

  return (
    <Card>
      <Dialog
        fullWidth
        open={show}
        maxWidth='md'
        scroll='body'
        onClose={() => setShow(false)}
        TransitionComponent={Transition}
        onBackdropClick={() => setShow(false)}
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
            <CustomCloseButton onClick={() => setShow(false)}>
              <Icon icon='tabler:x' fontSize='1.25rem' />
            </CustomCloseButton>
            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography variant='h3' sx={{ mb: 3 }}>
                Edit User Information
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Updating user details will receive a privacy audit.
              </Typography>
            </Box>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <Controller
                  name='firstName'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='First Name'
                      onChange={onChange}
                      placeholder='Leonard'
                      error={Boolean(errors.firstName)}
                      aria-describedby='validation-schema-first-name'
                      {...(errors.firstName && { helperText: errors.firstName.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <Controller
                  name='middleName'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='Middle Name'
                      onChange={onChange}
                      placeholder='Leonard'
                      error={Boolean(errors.middleName)}
                      aria-describedby='validation-schema-first-name'
                      {...(errors.middleName && { helperText: errors.middleName.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <Controller
                  name='lastName'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='Last Name'
                      onChange={onChange}
                      placeholder='Leonard'
                      error={Boolean(errors.lastName)}
                      aria-describedby='validation-schema-first-name'
                      {...(errors.lastName && { helperText: errors.lastName.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <Controller
                  name='firstNameNative'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='First Name Native'
                      onChange={onChange}
                      placeholder='Leonard'
                      error={Boolean(errors.firstNameNative)}
                      aria-describedby='validation-schema-first-name'
                      {...(errors.firstNameNative && { helperText: errors.firstNameNative.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <Controller
                  name='middleNameNative'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='Middle Name Native'
                      onChange={onChange}
                      placeholder='Leonard'
                      error={Boolean(errors.middleNameNative)}
                      aria-describedby='validation-schema-first-name'
                      {...(errors.middleNameNative && { helperText: errors.middleNameNative.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <Controller
                  name='lastNameNative'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='Last Name Native'
                      onChange={onChange}
                      placeholder='Leonard'
                      error={Boolean(errors.lastNameNative)}
                      aria-describedby='validation-schema-first-name'
                      {...(errors.lastNameNative && { helperText: errors.lastNameNative.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Controller
                  name='state'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      id='status-select'
                      label='State'
                      SelectProps={{
                        value: value,
                        onChange: e => {
                          onChange(e.target.value)
                          fetchDistricts(e.target.value)
                        }
                      }}
                      error={Boolean(errors.state)}
                      aria-describedby='validation-basic-select'
                      {...(errors.state && { helperText: 'This field is required' })}
                    >
                      {states?.length ? (
                        states.map(state => (
                          <MenuItem value={state.id} key={state.id}>
                            {state.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No data</MenuItem>
                      )}
                    </CustomTextField>
                  )}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Controller
                  name='district'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      disabled={!districts.length}
                      id='status-select'
                      label='District'
                      SelectProps={{
                        value: value,
                        onChange: e => {
                          onChange(e.target.value)
                          fetchTehsils(e.target.value)
                        }
                      }}
                      error={Boolean(errors.district)}
                      aria-describedby='validation-basic-select'
                      {...(errors.district && { helperText: 'This field is required' })}
                    >
                      {districts?.length ? (
                        districts.map(district => (
                          <MenuItem value={district.id} key={district.id}>
                            {district.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No data</MenuItem>
                      )}
                    </CustomTextField>
                  )}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Controller
                  name='tehsil'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      disabled={!tehsils.length}
                      id='status-select'
                      label='Tehsil'
                      SelectProps={{
                        value: value,
                        onChange: e => {
                          onChange(e.target.value)
                          fetchVillages(e.target.value)
                        }
                      }}
                      error={Boolean(errors.tehsil)}
                      aria-describedby='validation-basic-select'
                      {...(errors.tehsil && { helperText: 'This field is required' })}
                    >
                      {tehsils?.length ? (
                        tehsils.map(tehsil => (
                          <MenuItem value={tehsil.id} key={tehsil.id}>
                            {tehsil.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No data</MenuItem>
                      )}
                    </CustomTextField>
                  )}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Controller
                  name='village'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      disabled={!villages.length}
                      id='status-select'
                      label='Village'
                      SelectProps={{
                        value: value,
                        onChange: e => onChange(e)
                      }}
                      error={Boolean(errors.village)}
                      aria-describedby='validation-basic-select'
                      {...(errors.village && { helperText: 'This field is required' })}
                    >
                      {villages?.length ? (
                        villages.map(village => (
                          <MenuItem value={village.id} key={village.id}>
                            {village.name}
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
                <Controller
                  name='role'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      id='status-select'
                      label='Role'
                      SelectProps={{
                        value: value,
                        onChange: e => onChange(e)
                      }}
                      error={Boolean(errors.role)}
                      aria-describedby='validation-basic-select'
                      {...(errors.role && { helperText: 'This field is required' })}
                    >
                      {roles?.length ? (
                        roles.map(role => (
                          <MenuItem value={role.id} key={role.id}>
                            {`${role.name} (${role.nameNative})`}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No data</MenuItem>
                      )}
                    </CustomTextField>
                  )}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='Email'
                      onChange={onChange}
                      placeholder='johnDoe@email.com'
                      error={Boolean(errors.email)}
                      aria-describedby='validation-schema-first-name'
                      {...(errors.email && { helperText: errors.email.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Controller
                  name='mobileNumber'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='Mobile number'
                      placeholder='202 555 0111'
                      onChange={onChange}
                      error={Boolean(errors.mobileNumber)}
                      InputProps={{
                        startAdornment: <InputAdornment position='start'>IN (+91)</InputAdornment>
                      }}
                      {...(errors.mobileNumber && { helperText: errors.mobileNumber.message })}
                    />
                  )}
                />
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
            <Button variant='tonal' color='secondary' onClick={() => setShow(false)}>
              Discard
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Card>
  )
}

export default InvitationDialogAdmin
