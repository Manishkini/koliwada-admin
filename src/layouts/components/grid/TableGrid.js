// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'

const TableSort = props => {
  const { rows, columns } = props

  // ** States
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })

  return (
    <Card>
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Card>
  )
}

export default TableSort
