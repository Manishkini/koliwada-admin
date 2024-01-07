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

const PermissionDialog = props => {
  const { open, onClose, selectedRow, upsertRow } = props

  const [name, setName] = useState('')

  const createPermission = async () => {
    try {
      const permission = await API.post('/permission', { name })
      upsertRow('create', permission.data)
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
    createPermission()
  }

  useEffect(() => {
    if (selectedRow?.id) {
      setName(selectedRow?.name)
    } else {
      setName(null)
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
            Add New Permission
          </Typography>
          <Typography color='text.secondary'>Permissions you may use and assign to your users.</Typography>
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
              label='Permission Name'
              placeholder='Enter Permission Name'
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <Box className='demo-space-x' sx={{ '& > :last-child': { mr: '0 !important' } }}>
              <Button type='submit' variant='contained'>
                Create Permission
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

export default PermissionDialog
