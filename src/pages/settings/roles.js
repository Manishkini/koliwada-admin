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

  useEffect(() => {
    fetchRoles()
  }, [])

  const columns = [
    {
      flex: 0.2,
      minWidth: 200,
      field: 'name',
      headerName: 'Role Name',
      sortable: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: params => (
        <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
          {params.value}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 200,
      field: 'nameNative',
      headerName: 'Marathi Role Name',
      sortable: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: params => (
        <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
          {params.value}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 200,
      field: 'slug',
      headerName: 'Slug',
      sortable: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: params => (
        <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
          {params.value}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 200,
      field: 'rank',
      headerName: 'Rank',
      sortable: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: params => (
        <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
          {params.value}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 100,
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
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
            <RoleDialog open={show} onClose={onClose} refetch={fetchRoles} selectedRow={selectedRow} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Roles
