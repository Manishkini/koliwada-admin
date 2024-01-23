import { useState, useEffect, useContext } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

import API from 'src/configs/axios'
import TableSort from 'src/layouts/components/grid/TableGrid'
import InvitationDialog from 'src/layouts/components/dialog/InvitationDialog'

const userStatusObj = {
  VERIFIED: 'success',
  INVITED: 'warning',
  inactive: 'secondary'
}

const defaultFilterObj = {
  searchString: '',
  responsibility: '',
  state: '',
  district: '',
  tehsil: '',
  village: '',
  invitationStatus: '',
  limit: 10,
  skip: 0
}

const Invitation = () => {
  const ability = useContext(AbilityContext)

  const [show, setShow] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [responsibilities, setResponsibilities] = useState([])
  const [invitations, setInvitations] = useState([])
  const [hideNameColumn, setHideNameColumn] = useState({})

  // Filter Object
  const [filters, setFilters] = useState({
    searchString: '',
    responsibility: '',
    state: '',
    district: '',
    tehsil: '',
    village: '',
    invitationStatus: '',
    limit: 10,
    skip: 0
  })

  // Locations
  const [states, setStates] = useState([])
  const [districts, setDistricts] = useState([])
  const [tehsils, setTehsils] = useState([])
  const [villages, setVillages] = useState([])

  const columnsOthers = [
    {
      flex: 0.15,
      field: 'firstName',
      headerName: 'Name',
      sortable: true,
      renderCell: ({ row }) => (
        <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600, textTransform: 'capitalize' }}>
          {row.firstName ? `${row.firstName} ${row.lastName}` : '--'}
        </Typography>
      )
    },

    {
      flex: 0.1,
      field: 'role',
      headerName: 'Role',
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CustomAvatar skin='light' sx={{ mr: 2, width: 20, height: 20 }} color={'success'}>
            <Icon icon={'tabler:user'} />
          </CustomAvatar>
          {row.responsibility.role.name}
        </Box>
      )
    },
    {
      flex: 0.1,
      field: 'village',
      headerName: 'Village',
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => (
        <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
          {row.village.name}
        </Typography>
      )
    },
    {
      flex: 0.15,
      field: 'email',
      headerName: 'E-mail',
      headerAlign: 'center',
      align: 'center',
      renderCell: param => (
        <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
          {param.value}
        </Typography>
      )
    },
    {
      flex: 0.15,
      field: 'mobileNumber',
      headerName: 'Mobile Number',
      headerAlign: 'center',
      align: 'center',
      renderCell: param => (
        <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
          {param.value}
        </Typography>
      )
    },
    {
      flex: 0.3,
      field: 'invitationStatus',
      headerName: 'Invitation Status',
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 2 }}>
          <CustomChip
            rounded
            skin='light'
            size='small'
            label={row.invitationStatus !== 'VERIFIED' ? 'NOT VERIFIED' : 'VERIFIED'}
            color={userStatusObj[row.invitationStatus]}
            sx={{ textTransform: 'capitalize' }}
          />
          {row.invitationStatus !== 'VERIFIED' && (
            <Button
              size='small'
              variant='outlined'
              color='warning'
              sx={{ textTransform: 'capitalize' }}
              onClick={() => resendInvitation(row.id)}
            >
              resend invitation
            </Button>
          )}
        </Box>
      )
    },
    {
      flex: 0.1,
      field: 'actions',
      headerName: 'Actions',
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            onClick={() => {
              setShow(true)

              // setSelectedRow(row)
            }}
          >
            <Icon icon='tabler:edit' />
          </IconButton>
          <IconButton
            onClick={() => {
              // deletePermission(row.id)
            }}
          >
            <Icon icon='tabler:trash' />
          </IconButton>
        </Box>
      )
    }
  ]

  const fetchResponsibilities = async () => {
    try {
      const responsibilities = await API.get('/responsibility')
      setResponsibilities(responsibilities.data)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchInvitations = async (filters = {}) => {
    try {
      const invitations = await API.post('/auth/admin/invitation/filter', filters)
      setInvitations(invitations.data)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchStates = async () => {
    try {
      const state = await API.get('/state')
      setStates(state.data)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchDistricts = async id => {
    try {
      const district = await API.get(`/district/state/${id}`)
      setDistricts(district.data)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchTehsils = async id => {
    try {
      const tehsil = await API.get(`/tehsil/district/${id}`)
      setTehsils(tehsil.data)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchVillages = async id => {
    try {
      const village = await API.get(`/village/tehsil/${id}`)
      setVillages(village.data)
    } catch (err) {
      console.log(err)
    }
  }

  const resendInvitation = async id => {
    try {
      const invitation = await API.get(`/auth/admin/resend-invitation/${id}`)
    } catch (err) {
      console.log(err)
    }
  }

  const handleOnChange = (key, value) => {
    setFilters({ ...filters, [key]: value })
  }

  const handleSubmit = event => {
    event.preventDefault()
    fetchInvitations(filters)
  }

  useEffect(() => {
    fetchResponsibilities()
    fetchInvitations()
    if (ability?.can('read', 'adminInvitations')) {
      fetchStates()
    }

    if (!ability?.can('update', 'Invitations')) {
      setHideNameColumn({ invitationStatus: false, actions: false })
    }
  }, [ability])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Invitation 🙌'></CardHeader>
          <Divider light />
          <CardContent>
            <Grid
              container
              spacing={4}
              direction='row'
              justifyContent='space-between'
              alignItems='center'
              sx={{ mb: 4 }}
            >
              <Grid item lg={2} md={3} sm={6} xs={12}>
                <Button
                  fullWidth
                  variant='outlined'
                  onClick={() => setShowFilters(!showFilters)}
                  startIcon={<Icon icon='teenyicons:filter-outline' />}
                >
                  {`Filter`}
                </Button>
              </Grid>
              {ability?.can('read', 'Invitations') && (
                <Grid item lg={2} md={3} sm={6} xs={12}>
                  <Button fullWidth variant='contained' onClick={() => setShow(true)}>
                    {`Add Invitation`}
                  </Button>
                </Grid>
              )}
            </Grid>

            {showFilters && (
              <form onSubmit={handleSubmit}>
                {/* Filter Div */}
                <Grid
                  container
                  spacing={4}
                  direction='row'
                  justifyContent='space-around'
                  alignItems='center'
                  sx={{ mb: 4 }}
                >
                  <Grid item md={4} sm={6} xs={12}>
                    <CustomTextField
                      fullWidth
                      placeholder='Search…'
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 2, display: 'flex' }}>
                            <Icon fontSize='1.25rem' icon='tabler:search' />
                          </Box>
                        ),
                        endAdornment: (
                          <IconButton size='small' title='Clear' aria-label='Clear'>
                            <Icon fontSize='1.25rem' icon='tabler:x' />
                          </IconButton>
                        )
                      }}
                    />
                  </Grid>

                  <Grid item md={4} sm={6} xs={12}>
                    <CustomTextField
                      select
                      fullWidth
                      defaultValue=''
                      id='status-select'
                      placeholder='Responsibility'
                      disabled={!responsibilities.length}
                      SelectProps={{
                        displayEmpty: true,
                        value: filters.responsibility,
                        onChange: e => handleOnChange('responsibility', e.target.value)
                      }}
                    >
                      <MenuItem value='' selected disabled>
                        Select Responsibility
                      </MenuItem>
                      {responsibilities?.length ? (
                        responsibilities.map(responsibility => (
                          <MenuItem value={responsibility.id} key={responsibility.id}>
                            {responsibility.role.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No data</MenuItem>
                      )}
                    </CustomTextField>
                  </Grid>

                  {ability?.can('read', 'adminInvitations') && (
                    <Grid item md={4} sm={6} xs={12}>
                      <CustomTextField
                        select
                        fullWidth
                        defaultValue=''
                        id='status-select'
                        placeholder='State'
                        disabled={!states.length}
                        SelectProps={{
                          displayEmpty: true,
                          value: filters.state,
                          onChange: e => {
                            handleOnChange('state', e.target.value)
                            fetchDistricts(e.target.value)
                          }
                        }}
                      >
                        <MenuItem value='' selected disabled>
                          Select State
                        </MenuItem>
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
                    </Grid>
                  )}

                  {ability?.can('read', 'adminInvitations') && (
                    <Grid item md={4} sm={6} xs={12}>
                      <CustomTextField
                        select
                        fullWidth
                        defaultValue=''
                        id='status-select'
                        placeholder='District'
                        disabled={!districts.length}
                        SelectProps={{
                          displayEmpty: true,
                          value: filters.district,
                          onChange: e => {
                            handleOnChange('district', e.target.value)
                            fetchTehsils(e.target.value)
                          }
                        }}
                      >
                        <MenuItem value='' selected disabled>
                          Select District
                        </MenuItem>
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
                    </Grid>
                  )}

                  {ability?.can('read', 'adminInvitations') && (
                    <Grid item md={4} sm={6} xs={12}>
                      <CustomTextField
                        select
                        fullWidth
                        defaultValue=''
                        id='status-select'
                        placeholder='Tehsil'
                        disabled={!tehsils.length}
                        SelectProps={{
                          displayEmpty: true,
                          value: filters.tehsil,
                          onChange: e => {
                            handleOnChange('tehsil', e.target.value)
                            fetchVillages(e.target.value)
                          }
                        }}
                      >
                        <MenuItem value='' selected disabled>
                          Select Tehsil
                        </MenuItem>
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
                    </Grid>
                  )}

                  {ability?.can('read', 'adminInvitations') && (
                    <Grid item md={4} sm={6} xs={12}>
                      <CustomTextField
                        select
                        fullWidth
                        defaultValue=''
                        id='status-select'
                        placeholder='Village'
                        disabled={!villages.length}
                        SelectProps={{
                          displayEmpty: true,
                          value: filters.village,
                          onChange: e => handleOnChange('village', e.target.value)
                        }}
                      >
                        <MenuItem value='' selected disabled>
                          Select Village
                        </MenuItem>
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
                    </Grid>
                  )}
                </Grid>

                <Divider light />

                {/* Search Button */}
                <Grid
                  container
                  direction='row'
                  spacing={4}
                  justifyContent='center'
                  alignItems='center'
                  sx={{ mb: 2, mt: 2 }}
                >
                  <Grid item lg={2} md={2} sm={6} xs={12}>
                    <Button fullWidth type='submit' size='medium' variant='contained'>
                      {`Search`}
                    </Button>
                  </Grid>
                  <Grid item lg={2} md={2} sm={6} xs={12}>
                    <Button
                      fullWidth
                      type='reset'
                      size='medium'
                      variant='outlined'
                      onClick={() => setFilters(defaultFilterObj)}
                    >
                      {`Reset`}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}

            <TableSort rows={invitations} columns={columnsOthers} hideNameColumn={hideNameColumn} />
            <InvitationDialog
              show={show}
              setShow={setShow}
              responsibilities={responsibilities}
              states={states}
              fetchInvitations={fetchInvitations}
              isAdmin={ability?.can('read', 'adminInvitations')}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

Invitation.acl = {
  action: 'read',
  subject: 'Invitation'
}

export default Invitation
