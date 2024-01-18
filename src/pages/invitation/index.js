import { useState, useEffect, useContext } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TableSort from 'src/layouts/components/grid/TableGrid'
import InvitationDialogAdmin from 'src/layouts/components/dialog/InvitationDialogAdmin'
import InvitationTableAdmin from 'src/layouts/components/grid/InvitationTableAdmin'
import InvitationDialogOthers from 'src/layouts/components/dialog/InvitationDialogOthers'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

import API from 'src/configs/axios'

const columns = [
  {
    id: 1,
    align: 'left',
    name: 'village'
  }
]

const innerColumns = [
  {
    id: 1,
    align: 'center',
    name: 'name'
  },
  {
    id: 2,
    align: 'center',
    name: 'role'
  },
  {
    id: 3,
    align: 'center',
    name: 'village'
  },
  {
    id: 4,
    align: 'center',
    name: 'E-mail'
  },
  {
    id: 5,
    align: 'center',
    name: 'Mobile Number'
  },
  {
    id: 5,
    align: 'center',
    name: 'Invitation Status'
  },
  {
    id: 6,
    align: 'center',
    name: 'Actions'
  }
]

const userStatusObj = {
  VERIFIED: 'success',
  INVITED: 'warning',
  inactive: 'secondary'
}

const Invitation = () => {
  const ability = useContext(AbilityContext)

  const [show, setShow] = useState(false)
  const [roles, setRoles] = useState([])
  const [invitations, setInvitations] = useState([])

  const columnsOthers = [
    {
      flex: 0.15,
      field: 'firstName',
      headerName: 'Name',
      sortable: true,
      renderCell: ({ row }) => (
        <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600, textTransform: 'capitalize' }}>
          {`${row.firstName} ${row.middleName} ${row.lastName}`}
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
          {row.role.name}
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

  // Locations
  const [states, setStates] = useState([])

  const fetchRoles = async () => {
    const roles = await API.get('/role')
    setRoles(roles.data)
  }

  const fetchInvitations = async () => {
    const invitations = await API.post('/auth/admin/invitation/filter')
    console.log('invitations', invitations)
    setInvitations(invitations.data)
  }

  const fetchStates = async () => {
    const state = await API.get('/state')
    setStates(state.data)
  }

  const resendInvitation = async id => {
    const invitation = await API.get(`/auth/admin/resend-invitation/${id}`)
  }

  useEffect(() => {
    fetchRoles()
    fetchInvitations()
    if (ability?.can('read', 'adminInvitations')) {
      fetchStates()
    }
  }, [ability])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Invitation 🙌'
            action={
              ability?.can('create', 'Invitation') && (
                <div>
                  <Button size='medium' variant='contained' onClick={() => setShow(true)}>
                    {`Add Invitation`}
                  </Button>
                </div>
              )
            }
          />
          <CardContent>
            {ability?.can('read', 'adminInvitations') ? (
              <>
                {invitations.length > 0 && (
                  <InvitationTableAdmin rows={invitations} columns={columns} innerColumns={innerColumns} />
                )}
                <InvitationDialogAdmin
                  show={show}
                  setShow={setShow}
                  roles={roles}
                  states={states}
                  fetchInvitations={fetchInvitations}
                />
              </>
            ) : (
              <>
                {invitations.length > 0 && <TableSort rows={invitations} columns={columnsOthers} />}
                <InvitationDialogOthers
                  show={show}
                  setShow={setShow}
                  roles={roles}
                  fetchInvitations={fetchInvitations}
                />
              </>
            )}
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
