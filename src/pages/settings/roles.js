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
import RoleDialog from 'src/layouts/components/dialog/RoleDialog'
import API from 'src/configs/axios'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useAuth } from 'src/hooks/useAuth'

const Roles = () => {
  const auth = useAuth()
  const [show, setShow] = useState(false)
  const [rows, setRows] = useState([])
  const [permissions, setPermissions] = useState([])
  const [selectedRow, setSelectedRow] = useState(null)

  const fetchRoles = async () => {
    try {
      const roles = await API.get('/role')
      setRows(roles.data)
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
  }

  const upsertRow = (type, obj) => {
    let tempRow = [...rows]
    if (type === 'create') {
      tempRow.push(obj)
      setRows(tempRow)
    } else if (type === 'update') {
      const rowIndex = tempRow.findIndex(permission => permission.id === obj.id)
      tempRow[rowIndex].name = obj.name
      setRows(tempRow)
    }
  }

  useEffect(() => {
    fetchRoles()
    fetchPermissions()
  }, [])

  const columns = [
    {
      flex: 0.8,
      field: 'name',
      headerName: 'Name',
      sortable: true,
      renderCell: params => (
        <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
          {params.value}
        </Typography>
      )
    },
    {
      flex: 0.2,
      field: 'actions',
      headerName: 'Actions',
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            onClick={() => {
              setShow(true)
              setSelectedRow(row)
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
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Roles 🙌'
            action={
              <div>
                <Button size='medium' variant='contained' onClick={onClose}>
                  {`Add Role`}
                </Button>
              </div>
            }
          />
          <CardContent>
            <TableSort type='Role' columns={columns} rows={rows} />
            <RoleDialog open={show} onClose={onClose} permissions={permissions} upsertRow={upsertRow} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Roles
