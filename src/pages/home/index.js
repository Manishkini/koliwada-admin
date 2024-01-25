// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import DraggableTable from 'src/layouts/components/grid/DraggableTable'

const Home = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Welcome to koliwada admin portal'></CardHeader>
          <CardContent>
            <Typography sx={{ mb: 2 }}>
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

Home.acl = {
  action: 'read',
  subject: 'home'
}

export default Home
