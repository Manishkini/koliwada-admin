import React, { useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

// Drag Item Type
const ItemTypes = {
  ROW: 'row'
}

const createData = (name, calories, fat, carbs, protein) => {
  return { name, calories, fat, carbs, protein }
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9)
]

// Draggable Row Component
const DraggableTableRow = ({ item, index, moveRow }) => {
  const [, drag] = useDrag({
    type: ItemTypes.ROW,
    item: { index }
  })

  const [, drop] = useDrop({
    accept: ItemTypes.ROW,
    hover: item => {
      if (item.index !== index) {
        moveRow(item.index, index)
        item.index = index
      }
    }
  })

  return (
    <TableRow
      ref={node => drag(drop(node))}
      key={item.name}
      sx={{
        '&:last-of-type td, &:last-of-type th': {
          border: 0
        }
      }}
    >
      <TableCell component='th' scope='row'>
        {item.name}
      </TableCell>
      <TableCell align='right'>{item.calories}</TableCell>
      <TableCell align='right'>{item.fat}</TableCell>
      <TableCell align='right'>{item.carbs}</TableCell>
      <TableCell align='right'>{item.protein}</TableCell>
    </TableRow>
  )
}

const TableBasic = () => {
  const [rows, setRows] = useState([
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9)
  ])

  const [, drop] = useDrop({
    accept: ItemTypes.ROW,
    drop: () => ({ name: 'Table' })
  })

  const moveRow = (fromIndex, toIndex) => {
    const updatedRows = [...rows]
    const [movedRow] = updatedRows.splice(fromIndex, 1)
    updatedRows.splice(toIndex, 0, movedRow)
    setRows(updatedRows)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Dessert (100g serving)</TableCell>
              <TableCell align='right'>Calories</TableCell>
              <TableCell align='right'>Fat (g)</TableCell>
              <TableCell align='right'>Carbs (g)</TableCell>
              <TableCell align='right'>Protein (g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <DraggableTableRow key={row.name} item={row} index={index} moveRow={moveRow} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DndProvider>
  )
}

export default TableBasic
