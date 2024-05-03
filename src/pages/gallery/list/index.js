// ** React Imports
import { useState, useEffect, forwardRef } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'
import toast from 'react-hot-toast'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomChip from 'src/@core/components/mui/chip'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import API from 'src/configs/axios'

import ConfirmationDialog from 'src/layouts/components/dialog/ConfirmationDialog'

const defaultColumns = [
  {
    flex: 0.2,
    field: 'name',
    minWidth: 140,
    headerName: 'Name',
    headerAlign: 'center',
    align: 'center',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row.name}</Typography>
  },
  {
    flex: 0.15,
    minWidth: 140,
    field: 'event',
    headerName: 'Event',
    headerAlign: 'center',
    align: 'center',
    renderCell: ({ row }) => (
      <Box
        key={row.id}
        sx={{
          display: 'flex',
          alignItems: 'center',
          '&:not(:last-of-type)': { mb: 3 }

          // '& svg': { color: `${item.color}.main` }
        }}
      >
        <Icon fontSize='1.25rem' icon='token-branded:prom' />

        <Typography sx={{ color: 'text.secondary' }}>{row.event.name}</Typography>
      </Box>
    )
  },
  {
    flex: 0.15,
    minWidth: 100,
    field: 'village',
    headerName: 'Village',
    headerAlign: 'center',
    align: 'center',
    renderCell: ({ row }) => (
      <Box
        key={row.id}
        sx={{
          display: 'flex',
          alignItems: 'center',
          '&:not(:last-of-type)': { mb: 3 }

          // '& svg': { color: `${item.color}.main` }
        }}
      >
        <Icon fontSize='1.25rem' icon='openmoji:location-indicator-red' />

        <Typography sx={{ color: 'text.secondary' }}>{row.village.name}</Typography>
      </Box>
    )
  },
  {
    flex: 0.1,
    minWidth: 100,
    field: 'isPublished',
    headerName: 'Status',
    headerAlign: 'center',
    align: 'center',
    renderCell: ({ row }) =>
      row.isPublished ? (
        <CustomChip rounded label='Published' skin='light' color='success' />
      ) : (
        <CustomChip rounded label='Not Published' skin='light' color='error' />
      )
  }
]
/* eslint-disable */
const CustomInput = forwardRef((props, ref) => {
  const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
  const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null
  const value = `${startDate}${endDate !== null ? endDate : ''}`
  props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null
  const updatedProps = { ...props }
  delete updatedProps.setDates
  return <CustomTextField fullWidth inputRef={ref} {...updatedProps} label={props.label || ''} value={value} />
})

/* eslint-enable */
const GalleryList = () => {
  // ** State
  const [dates, setDates] = useState([])
  const [value, setValue] = useState('')
  const [statusValue, setStatusValue] = useState('')
  const [endDateRange, setEndDateRange] = useState(null)
  const [selectedRows, setSelectedRows] = useState([])
  const [startDateRange, setStartDateRange] = useState(null)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const [rows, setRows] = useState([])

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [galleryId, setGalleryId] = useState(null)

  const fetchGallery = async () => {
    try {
      const galleries = await API.get('/gallery')
      setRows(galleries.data)
    } catch (error) {
      console.log('error', error)
      toast.error('Something went wrong', {
        position: 'bottom-left'
      })
    }
  }

  const handleStatusValue = e => {
    setStatusValue(e.target.value)
  }

  const handleOnChangeRange = dates => {
    const [start, end] = dates
    if (start !== null && end !== null) {
      setDates(dates)
    }
    setStartDateRange(start)
    setEndDateRange(end)
  }

  const deleteGallery = async () => {
    try {
      await API.delete(`/gallery/${galleryId}`)
      const tempRows = rows?.length ? rows.filter(gallery => gallery.id !== galleryId) : []
      setRows(tempRows)
      setOpenDeleteDialog(false)
    } catch (error) {
      console.log('error', error)
      toast.error('Something went wrong', {
        position: 'bottom-left'
      })
    }
  }

  const changeGalleryStatus = async (id, status) => {
    try {
      await API.get(`/gallery/${id}/status/${status}`)

      const tempRows = rows?.length
        ? rows.map(gallery => {
            if (gallery.id !== galleryId) {
              gallery.isPublished = status === 'publish' ? true : false
            }

            return gallery
          })
        : []
      setRows(tempRows)
    } catch (error) {
      console.log('error', error)
      toast.error('Something went wrong', {
        position: 'bottom-left'
      })
    }
  }

  useEffect(() => {
    fetchGallery()
  }, [])

  const columns = [
    ...defaultColumns,
    {
      flex: 0.13,
      minWidth: 200,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        const option = [
          {
            text: 'Publish',
            menuItemProps: {
              onClick: () => {
                changeGalleryStatus(row.id, 'publish')
              }
            },
            icon: <Icon icon='material-symbols:publish' fontSize={20} />
          },
          {
            text: 'Unpublish',
            menuItemProps: {
              onClick: () => {
                changeGalleryStatus(row.id, 'unpublish')
              }
            },
            icon: <Icon icon='fluent-mdl2:unpublish-content' fontSize={20} />
          },
          {
            text: 'Edit',
            href: `/gallery/edit/${row.id}`,
            icon: <Icon icon='tabler:edit' fontSize={20} />
          }
        ].filter(obj => {
          if (obj.text === 'Publish' || obj.text === 'Unpublish') {
            if (row.isPublished && obj.text !== 'Unpublish') {
              return false
            } else if (!row.isPublished && obj.text === 'Unpublish') {
              return false
            }
          }

          return true
        })

        return (
          <Box sx={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <Tooltip title='Delete Invoice'>
              <IconButton
                size='small'
                sx={{ color: 'text.secondary' }}
                onClick={() => {
                  setOpenDeleteDialog(true)
                  setGalleryId(row.id)
                }}
              >
                <Icon icon='tabler:trash' />
              </IconButton>
            </Tooltip>
            <Tooltip title='View'>
              <IconButton
                size='small'
                component={Link}
                sx={{ color: 'text.secondary' }}
                href={`/gallery/preview/${row.id}`}
              >
                <Icon icon='tabler:eye' />
              </IconButton>
            </Tooltip>
            <OptionsMenu
              menuProps={{ sx: { '& .MuiMenuItem-root svg': { mr: 2 } } }}
              iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
              options={option}
            />
          </Box>
        )
      }
    }
  ]

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Filters' />
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    select
                    fullWidth
                    label='Invoice Status'
                    SelectProps={{ value: statusValue, onChange: e => handleStatusValue(e) }}
                  >
                    <MenuItem value=''>None</MenuItem>
                    <MenuItem value='downloaded'>Downloaded</MenuItem>
                    <MenuItem value='draft'>Draft</MenuItem>
                    <MenuItem value='paid'>Paid</MenuItem>
                    <MenuItem value='partial payment'>Partial Payment</MenuItem>
                    <MenuItem value='past due'>Past Due</MenuItem>
                    <MenuItem value='sent'>Sent</MenuItem>
                  </CustomTextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    isClearable
                    selectsRange
                    monthsShown={2}
                    endDate={endDateRange}
                    selected={startDateRange}
                    startDate={startDateRange}
                    shouldCloseOnSelect={false}
                    id='date-range-picker-months'
                    onChange={handleOnChangeRange}
                    customInput={
                      <CustomInput
                        dates={dates}
                        setDates={setDates}
                        label='Invoice Date'
                        end={endDateRange}
                        start={startDateRange}
                      />
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <DataGrid
              autoHeight
              pagination
              rowHeight={62}
              rows={rows}
              columns={columns}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              onRowSelectionModelChange={rows => setSelectedRows(rows)}
            />
          </Card>
        </Grid>
      </Grid>
      <ConfirmationDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        dialog={'Are you sure you want to delete this gallery event?'}
        title={'Delete Gallery Event Confirmation'}
        cancelText={'Cancel'}
        acceptText={'Yes'}
        acceptFunction={deleteGallery}
      />
    </DatePickerWrapper>
  )
}

GalleryList.acl = {
  action: 'read',
  subject: 'Gallery'
}

export default GalleryList
