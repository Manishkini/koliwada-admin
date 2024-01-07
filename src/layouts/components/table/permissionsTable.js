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

const columns = [
  {
    id: 'name',
    label: 'Permission',
    flex: 0.2
  },
  {
    id: 'code',
    label: 'ISO\u00a0Code',
    flex: 0.2
  },
  {
    id: 'population',
    label: 'Population',
    flex: 0.2,
    align: 'right',
    format: value => value.toLocaleString('en-US')
  },
  {
    id: 'size',
    label: 'Size\u00a0(km\u00b2)',
    flex: 0.2,
    align: 'right',
    format: value => value.toLocaleString('en-US')
  },
  {
    id: 'density',
    label: 'Density',
    flex: 0.2,
    align: 'right',
    format: value => value.toFixed(2)
  }
]
function createData(name, code, population, size) {
  const density = population / size

  return { name, code, population, size, density }
}

const rows = [
  createData('India', 'IN', 1324171354, 3287263),
  createData('China', 'CN', 1403500365, 9596961),
  createData('Italy', 'IT', 60483973, 301340),
  createData('United States', 'US', 327167434, 9833520),
  createData('Canada', 'CA', 37602103, 9984670),
  createData('Australia', 'AU', 25475400, 7692024),
  createData('Germany', 'DE', 83019200, 357578),
  createData('Ireland', 'IE', 4857000, 70273),
  createData('Mexico', 'MX', 126577691, 1972550),
  createData('Japan', 'JP', 126317000, 377973),
  createData('France', 'FR', 67022000, 640679),
  createData('United Kingdom', 'GB', 67545757, 242495),
  createData('Russia', 'RU', 146793744, 17098246),
  createData('Nigeria', 'NG', 200962417, 923768),
  createData('Brazil', 'BR', 210147125, 8515767)
]

const PermissionsTable = props => {
  const { rows, upsertPermission } = props

  const [permissions, setPermissions] = useState([])

  const togglePermissionActions = (action, subject) => {
    const isPermissionAlreadyExists = permissions.findIndex(obj => obj.subject.toLowerCase() === subject.toLowerCase())
    if (isPermissionAlreadyExists > -1) {
      const tempPermissions = []
      permissions.forEach(obj => {
        if (obj.subject.toLowerCase() === subject.toLowerCase()) {
          if (obj.actions.includes(action)) {
            const tempActions = obj.actions.filter(obj => obj !== action)
            if (!tempActions.length) obj.actions = tempActions
          } else {
            obj.actions.push(action)
          }
        }
        obj.actions.length && tempPermissions.push(obj)
      })
      setPermissions(tempPermissions)
    } else {
      const tempPermissionObj = { subject, actions: [action] }
      const tempPermissions = [...permissions]
      tempPermissions.push(tempPermissionObj)
      setPermissions(tempPermissions)
    }
  }

  useEffect(() => {
    if (permissions.length) {
      upsertPermission(permissions)
    }
  }, [permissions])

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
            return (
              <TableRow key={row.name} sx={{ '&:last-of-type  td, &:last-of-type  th': { border: 0 } }}>
                <TableCell component='th' scope='row'>
                  {row.name}
                </TableCell>
                <TableCell align='center'>
                  <Checkbox
                    name='color-success'
                    color='success'
                    onChange={e => togglePermissionActions('read', row.name)}
                  />
                </TableCell>
                <TableCell align='center'>
                  <Checkbox
                    name='color-success'
                    color='success'
                    onChange={e => togglePermissionActions('create', row.name)}
                  />
                </TableCell>
                <TableCell align='center'>
                  <Checkbox
                    name='color-success'
                    color='success'
                    onChange={e => togglePermissionActions('update', row.name)}
                  />
                </TableCell>
                <TableCell align='center'>
                  <Checkbox
                    name='color-success'
                    color='success'
                    onChange={e => togglePermissionActions('delete', row.name)}
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
