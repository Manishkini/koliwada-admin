// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import DraggableTable from 'src/layouts/components/grid/DraggableTable'
import { useRouter } from 'next/router'

const Preview = () => {
  const router = useRouter()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Welcome to koliwada admin portal'></CardHeader>
          <CardContent>
            <Typography sx={{ mb: 2 }} onClick={() => router.push('/gallery/preview/1')}>
              This portal you can use to manage various settings based on your role
            </Typography>
            <Typography>
              You can checkout the left sidebar to route to specific section and Create, Read, Update, Delete the
              records. All the best!
            </Typography>
            <DraggableTable />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

Preview.acl = {
  action: 'read',
  subject: 'preview'
}

export default Preview
