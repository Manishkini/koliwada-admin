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
import TehsilDialog from 'src/layouts/components/dialog/TehsilDialog'
import API from 'src/configs/axios'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import toast from 'react-hot-toast'

const Tehsil = () => {
  const [show, setShow] = useState(false)
  const [rows, setRows] = useState([])
  const [states, setStates] = useState([])
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
              deleteState(row.id)
            }}
          >
            <Icon icon='tabler:trash' />
          </IconButton>
        </Box>
      )
    }
  ]

  const fetchStates = async () => {
    try {
      const state = await API.get('/state')
      if (state.status === 200) {
        setStates(state.data)
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

  const fetchTehsils = async () => {
    try {
      const tehsils = await API.get('/tehsil')
      if (tehsils.status === 200) {
        setRows(tehsils.data)
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

  const deleteState = async id => {
    try {
      const response = await API.delete(`/tehsil/${id}`)
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

  const refetch = () => {
    fetchStates()
    fetchTehsils()
  }

  useEffect(() => {
    refetch()
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Tehsil 🙌'
            action={
              <div>
                <Button size='medium' variant='contained' onClick={onClose}>
                  {`Add Tehsil`}
                </Button>
              </div>
            }
          />
          <CardContent></CardContent>
          <CardContent>
            <TableSort columns={columns} rows={rows} />
            <TehsilDialog open={show} states={states} onClose={onClose} selectedRow={selectedRow} refetch={refetch} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

Tehsil.acl = {
  action: 'read',
  subject: 'Location'
}

export default Tehsil
