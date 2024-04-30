// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import { useEffect, useState } from 'react'
import API from 'src/configs/axios'

import toast from 'react-hot-toast'

const EventDialog = props => {
  const { open, onClose, selectedRow, upsertRow } = props

  const [name, setName] = useState('')
  const [nameNative, setNameNative] = useState('')
  const [slug, setSlug] = useState('')

  const createEvent = async () => {
    try {
      const event = await API.post('/event', { name, nameNative, slug })
      upsertRow('create', event.data)
      onClose()
    } catch (err) {
      console.log(err)
      onClose()
      toast.error('Something went wrong', {
        position: 'bottom-left'
      })
    }
  }

  const onSubmit = event => {
    event.preventDefault()
    createEvent()
  }

  useEffect(() => {
    if (selectedRow?.id) {
      setName(selectedRow?.name)
      setNameNative(selectedRow?.nameNative)
      setSlug(selectedRow?.slug)
    } else {
      setName(null)
      setNameNative(null)
      setSlug(null)
    }
  }, [selectedRow])

  return (
    <Card>
      <Dialog fullWidth maxWidth='sm' onClose={onClose} open={open}>
        <DialogTitle
          component='div'
          sx={{
            textAlign: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Typography variant='h3' sx={{ mb: 2 }}>
            Add New Event
          </Typography>
          {/* <Typography color='text.secondary'>Permissions you may use and assign to your users.</Typography> */}
        </DialogTitle>
        <DialogContent
          sx={{
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box
            component='form'
            onSubmit={e => onSubmit(e)}
            sx={{
              mt: 4,
              mx: 'auto',
              width: '100%',
              maxWidth: 360,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <CustomTextField
              fullWidth
              sx={{ mb: 1 }}
              label='Event Name'
              placeholder='Enter Event Name'
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <CustomTextField
              fullWidth
              sx={{ mb: 1 }}
              label='Event Name Marathi'
              placeholder='Enter Event Name in Marathi'
              value={nameNative}
              onChange={e => setNameNative(e.target.value)}
            />

            <Box className='demo-space-x' sx={{ '& > :last-child': { mr: '0 !important' } }}>
              <Button type='submit' variant='contained'>
                Create Event
              </Button>
              <Button type='reset' variant='tonal' color='secondary' onClick={onClose}>
                Discard
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default EventDialog
