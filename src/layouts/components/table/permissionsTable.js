// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import Checkbox from '@mui/material/Checkbox'
import { rowsStateInitializer } from '@mui/x-data-grid/internals'

const PermissionsTable = props => {
  const { rows, upsertPermission } = props

  const [permissions, setPermissions] = useState([])

  const togglePermissionActions = (action, subject) => {
    const isPermissionAlreadyExists = permissions.findIndex(obj => obj.subject.toLowerCase() === subject.toLowerCase())
    if (isPermissionAlreadyExists > -1) {
      const tempPermissions = []
      permissions.forEach(obj => {
        if (obj.subject?.toLowerCase() === subject.toLowerCase()) {
          if (obj.actions?.includes(action)) {
            const tempActions = obj.actions.filter(obj => obj !== action)
            if (!tempActions.length) obj.actions = tempActions
          } else {
            obj.actions?.push(action)
          }
        }
        obj.actions?.length && tempPermissions.push(obj)
      })
      setPermissions(tempPermissions)
      upsertPermission(tempPermissions)
    } else {
      const tempPermissionObj = { subject, actions: [action] }
      const tempPermissions = [...permissions]
      tempPermissions.push(tempPermissionObj)
      setPermissions(tempPermissions)
      upsertPermission(tempPermissions)
    }
  }

  useEffect(() => {
    if (rows.length) {
      const tempPermissions = []
      rows.map(permission => {
        tempPermissions.push({ subject: permission.name, actions: permission.actions })
      })
      setPermissions(tempPermissions)
    }
  }, [rows])

  return (
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
          {rows.map(row => {
            const name = row.name

            return (
              <TableRow key={name} sx={{ '&:last-of-type  td, &:last-of-type  th': { border: 0 } }}>
                <TableCell component='th' scope='row'>
                  {name}
                </TableCell>
                <TableCell align='center'>
                  <Checkbox
                    name='color-success'
                    color='success'
                    defaultChecked={row?.actions?.length ? row.actions.includes('read') : false}
                    onChange={e => togglePermissionActions('read', name)}
                  />
                </TableCell>
                <TableCell align='center'>
                  <Checkbox
                    name='color-success'
                    color='success'
                    defaultChecked={row?.actions?.length ? row.actions.includes('create') : false}
                    onChange={e => togglePermissionActions('create', name)}
                  />
                </TableCell>
                <TableCell align='center'>
                  <Checkbox
                    name='color-success'
                    color='success'
                    defaultChecked={row?.actions?.length ? row.actions.includes('update') : false}
                    onChange={e => togglePermissionActions('update', name)}
                  />
                </TableCell>
                <TableCell align='center'>
                  <Checkbox
                    name='color-success'
                    color='success'
                    defaultChecked={row?.actions?.length ? row.actions.includes('delete') : false}
                    onChange={e => togglePermissionActions('delete', name)}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default PermissionsTable
