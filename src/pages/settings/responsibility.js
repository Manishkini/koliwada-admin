import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TableSort from 'src/layouts/components/grid/TableGrid'
import ResponsibilityDialog from 'src/layouts/components/dialog/ResponsibilityDialog'
import API from 'src/configs/axios'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useAuth } from 'src/hooks/useAuth'
import PermissionPreview from 'src/layouts/components/preview/permissions'

const Roles = () => {
  const auth = useAuth()
  const [show, setShow] = useState(false)
  const [rows, setRows] = useState([])
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [savedPermissions, setSavedPermissions] = useState([])
  const [selectedRow, setSelectedRow] = useState(null)
  const [openPermissionPreview, setOpenPermissionPreview] = useState(false)
  const [selectedResponsibility, setSelectedResponsibility] = useState(null)

  const fetchResponsibility = async () => {
    try {
      const tempResponsibility = await API.get('/responsibility')
      setRows(tempResponsibility.data)
    } catch (err) {
      console.log(err)
      if (err.response.data.statusCode === 401) {
        auth.logout()
      }
    }
  }

  const fetchRoles = async () => {
    try {
      const tempRoles = await API.get('/role')
      setRoles(tempRoles.data)
    } catch (err) {
      console.log(err)
      if (err.response.data.statusCode === 401) {
        auth.logout()
      }
    }
  }

  const fetchPermissions = async () => {
    try {
      const permissions = await API.get('/permission')
      setPermissions(permissions.data)
    } catch (err) {
      console.log(err)
      if (err.response.data.statusCode === 401) {
        auth.logout()
      }
    }
  }

  const deletePermission = async id => {
    try {
      const response = await API.delete(`/role/${id}`)
      if (response.status === 200) {
        const tempRows = rows.filter(obj => obj.id !== id)
        setRows(tempRows)
      } else {
        toast.error('Something went wrong', {
          position: 'bottom-left'
        })
      }
    } catch (err) {
      toast.error('Something went wrong', {
        position: 'bottom-left'
      })
    }
  }

  const onClose = () => {
    setShow(!show)
    setSelectedRow(null)
    setSavedPermissions([])
    setSelectedResponsibility(null)
  }

  useEffect(() => {
    fetchRoles()
    fetchPermissions()
    fetchResponsibility()
  }, [])

  const columns = [
    {
      flex: 0.3,
      minWidth: 200,
      field: 'role',
      headerName: 'Role',
      sortable: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ value }) => {
        const { name, nameNative } = value

        return (
          <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
            {name}
          </Typography>
        )
      }
    },
    {
      flex: 0.3,
      minWidth: 200,
      field: 'permissions',
      headerName: 'Permissions',
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        return (
          <Button
            size='small'
            variant='outlined'
            color='secondary'
            onClick={() => {
              setOpenPermissionPreview(true)
              const tempPermissions = JSON.parse(JSON.stringify(permissions))
              const tempResponsibilityObject = JSON.parse(JSON.stringify(row))
              tempPermissions.forEach(permission => {
                const tempSavedPermission = row.permissions.find(
                  savedPermission => permission.name === savedPermission.subject
                )
                if (tempSavedPermission?.subject) {
                  permission.subject = tempSavedPermission.subject
                  permission.actions = tempSavedPermission.actions
                } else {
                  permission.subject = permission.name
                  permission.actions = []
                }

                return permission
              })

              tempResponsibilityObject.permissions = tempPermissions
              setSelectedResponsibility(tempResponsibilityObject)
            }}
          >
            View Permissions
          </Button>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 100,
      headerName: 'Rank',
      sortable: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        const { rank } = row.role

        return (
          <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
            {Number(rank)}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 200,
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={() => {
                setShow(true)
                setSelectedRow(row)

                const tempPermissions = JSON.parse(JSON.stringify(permissions))
                tempPermissions.forEach(permission => {
                  const tempSavedPermission = row.permissions.find(
                    savedPermission => permission.name === savedPermission.subject
                  )
                  if (tempSavedPermission?.subject) {
                    permission.actions = tempSavedPermission.actions
                  } else {
                    permission.actions = []
                  }

                  return permission
                })

                setSavedPermissions(tempPermissions)
              }}
            >
              <Icon icon='tabler:edit' />
            </IconButton>
            <IconButton
              onClick={() => {
                deletePermission(row.id)
              }}
            >
              <Icon icon='tabler:trash' />
            </IconButton>
          </Box>
        )
      }
    }
  ]

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title='Responsibilities 🙌'
              action={
                <div>
                  <Button size='medium' variant='contained' onClick={onClose}>
                    {`Add Responsibility`}
                  </Button>
                </div>
              }
            />
            <CardContent>
              <TableSort type='Responsibility' columns={columns} rows={rows} />
              <ResponsibilityDialog
                open={show}
                onClose={onClose}
                roles={roles}
                permissions={savedPermissions?.length ? savedPermissions : permissions}
                selectedRow={selectedRow}
                fetchResponsibility={fetchResponsibility}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <PermissionPreview
        selectedResponsibility={selectedResponsibility}
        open={openPermissionPreview}
        onClose={() => setOpenPermissionPreview(false)}
      />
    </>
  )
}

export default Roles
