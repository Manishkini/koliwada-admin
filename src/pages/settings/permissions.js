import { useEffect, useState } from 'react'

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
import PermissionDialog from 'src/layouts/components/dialog/PermissionDialog'
import API from 'src/configs/axios'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import toast from 'react-hot-toast'

const Permissions = () => {
  const [show, setShow] = useState(false)
  const [rows, setRows] = useState([])
  const [selectedRow, setSelectedRow] = useState(null)

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

  const fetchPermissions = async () => {
    const permissions = await API.get('/permission')
    setRows(permissions.data)
  }

  const deletePermission = async id => {
    try {
      const response = await API.delete(`/permission/${id}`)
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
    fetchPermissions()
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Permission 🙌'
            action={
              <div>
                <Button size='medium' variant='contained' onClick={onClose}>
                  {`Add Permission`}
                </Button>
              </div>
            }
          />
          <CardContent></CardContent>
          <CardContent>
            <TableSort columns={columns} rows={rows} />
            <PermissionDialog open={show} onClose={onClose} selectedRow={selectedRow} upsertRow={upsertRow} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Permissions
