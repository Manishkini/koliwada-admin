// ** React Imports
import { useState, forwardRef, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Switch from '@mui/material/Switch'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import Checkbox from '@mui/material/Checkbox'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import CustomAvatar from 'src/@core/components/mui/avatar'
import PermissionsTable from '../table/permissionsTable'
import API from 'src/configs/axios'

// ** Third Party Imports
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

const actionAvatarSize = 23
const actionIconSize = 25

const PermissionPreview = props => {
  const { open, onClose, selectedResponsibility } = props

  return (
    <Card>
      <Dialog
        fullWidth
        open={open}
        maxWidth='md'
        scroll='body'
        onClose={onClose}
        TransitionComponent={Transition}
        onBackdropClick={onClose}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <CustomCloseButton onClick={onClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <Grid container spacing={12}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <CustomAvatar skin='light' color='success' sx={{ mb: 2, width: 42, height: 42 }}>
                  <Icon icon='zondicons:badge' fontSize={24} />
                </CustomAvatar>
                <Typography variant='h5' sx={{ mb: 2 }}>
                  {selectedResponsibility?.role?.name}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <CustomAvatar skin='light' color='success' sx={{ mb: 2, width: 42, height: 42 }}>
                  <Icon icon={`fa6-solid:${selectedResponsibility?.role?.rank}`} fontSize={24} />
                </CustomAvatar>
                <Typography variant='h5' sx={{ mb: 2 }}>
                  {'Rank'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={12}>
            <Grid item xs={12}>
              <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                <Table stickyHeader size='small' aria-label='sticky table'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Management</TableCell>
                      <TableCell align='center'>Read</TableCell>
                      <TableCell align='center'>Create</TableCell>
                      <TableCell align='center'>Update</TableCell>
                      <TableCell align='center'>Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedResponsibility?.permissions?.map(row => {
                      return (
                        <TableRow key={row.subject} sx={{ '&:last-of-type  td, &:last-of-type  th': { border: 0 } }}>
                          <TableCell component='th' scope='row'>
                            {row.subject}
                          </TableCell>
                          <TableCell align='center'>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                              <CustomAvatar
                                color={row.actions.includes('read') ? 'success' : 'error'}
                                sx={{ width: actionAvatarSize, height: actionAvatarSize }}
                              >
                                <Icon
                                  icon={
                                    row.actions.includes('read')
                                      ? 'material-symbols:check-small'
                                      : 'material-symbols:close-small'
                                  }
                                  fontSize={actionIconSize}
                                />
                              </CustomAvatar>
                            </Box>
                          </TableCell>
                          <TableCell align='center'>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                              <CustomAvatar
                                color={row.actions.includes('create') ? 'success' : 'error'}
                                sx={{ width: actionAvatarSize, height: actionAvatarSize }}
                              >
                                <Icon
                                  icon={
                                    row.actions.includes('create')
                                      ? 'material-symbols:check-small'
                                      : 'material-symbols:close-small'
                                  }
                                  fontSize={actionIconSize}
                                />
                              </CustomAvatar>
                            </Box>
                          </TableCell>
                          <TableCell align='center'>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                              <CustomAvatar
                                color={row.actions.includes('update') ? 'success' : 'error'}
                                sx={{ width: actionAvatarSize, height: actionAvatarSize }}
                              >
                                <Icon
                                  icon={
                                    row.actions.includes('update')
                                      ? 'material-symbols:check-small'
                                      : 'material-symbols:close-small'
                                  }
                                  fontSize={actionIconSize}
                                />
                              </CustomAvatar>
                            </Box>
                          </TableCell>
                          <TableCell align='center'>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                              <CustomAvatar
                                color={row.actions.includes('delete') ? 'success' : 'error'}
                                sx={{ width: actionAvatarSize, height: actionAvatarSize }}
                              >
                                <Icon
                                  icon={
                                    row.actions.includes('delete')
                                      ? 'material-symbols:check-small'
                                      : 'material-symbols:close-small'
                                  }
                                  fontSize={actionIconSize}
                                />
                              </CustomAvatar>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default PermissionPreview
