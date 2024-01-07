// ** React Imports
import { useState, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import Collapse from '@mui/material/Collapse'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TableContainer from '@mui/material/TableContainer'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import API from 'src/configs/axios'

const userRoleObj = {
  editor: { icon: 'tabler:edit', color: 'info' },
  author: { icon: 'tabler:user', color: 'warning' },
  admin: { icon: 'tabler:device-laptop', color: 'error' },
  maintainer: { icon: 'tabler:chart-pie-2', color: 'success' },
  subscriber: { icon: 'tabler:circle-check', color: 'primary' }
}

const userStatusObj = {
  VERIFIED: 'success',
  INVITED: 'warning',
  inactive: 'secondary'
}

const Row = props => {
  // ** Props
  const { row, innerColumns } = props

  // ** State
  const [open, setOpen] = useState(false)

  const resendInvitation = async id => {
    const invitation = await API.get(`/auth/admin/resend-invitation/${id}`)
  }

  return (
    <Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
            <Icon icon={open ? 'tabler:chevron-up' : 'tabler:chevron-down'} />
          </IconButton>
        </TableCell>
        <TableCell component='th' scope='row' align='left' sx={{ textTransform: 'uppercase' }}>
          {row._id.name}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ py: '0 !important' }}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ m: 2 }}>
              <Typography variant='h6' gutterBottom component='div'>
                Invitations
              </Typography>
              <Table size='small' aria-label='purchases'>
                <TableHead>
                  <TableRow>
                    {innerColumns.map(column => (
                      <TableCell key={column.id} align={column.align}>
                        {column.name}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.invitations.map(invitation => (
                    <TableRow key={invitation._id}>
                      <TableCell component='th' scope='row' align='center'>
                        {`${invitation.firstName} ${invitation.middleName} ${invitation.lastName}`}
                      </TableCell>
                      <TableCell component='th' scope='row' align='center'>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CustomAvatar skin='light' sx={{ mr: 2, width: 20, height: 20 }} color={'success'}>
                            <Icon icon={'tabler:user'} />
                          </CustomAvatar>
                          {invitation.role.name}
                        </Box>
                      </TableCell>
                      <TableCell align='center'>{invitation.village.name}</TableCell>
                      <TableCell align='center'>{invitation.email}</TableCell>
                      <TableCell align='center'>{invitation.mobileNumber}</TableCell>
                      <TableCell align='center'>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                          <CustomChip
                            rounded
                            skin='light'
                            size='small'
                            label={invitation.invitationStatus !== 'VERIFIED' ? 'NOT VERIFIED' : 'VERIFIED'}
                            color={userStatusObj[invitation.invitationStatus]}
                            sx={{ textTransform: 'capitalize' }}
                          />
                          {invitation.invitationStatus !== 'VERIFIED' && (
                            <Button
                              size='small'
                              variant='outlined'
                              color='warning'
                              sx={{ textTransform: 'capitalize' }}
                              onClick={() => resendInvitation(invitation._id)}
                            >
                              resend invitation
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align='center'>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  )
}

const InvitationTableAdmin = props => {
  const { rows, columns, innerColumns } = props

  return (
    <TableContainer component={Paper}>
      <Table aria-label='collapsible table'>
        <TableHead>
          <TableRow>
            <TableCell />
            {columns.map(column => (
              <TableCell key={column.id} align={column.align}>
                {column.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <Row key={row._id._id} row={row} innerColumns={innerColumns} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default InvitationTableAdmin
