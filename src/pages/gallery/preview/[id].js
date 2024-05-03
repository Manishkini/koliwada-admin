import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import toast from 'react-hot-toast'
import API from 'src/configs/axios'

import { PhotoAlbum, RenderPhotoProps } from 'react-photo-album'
import Lightbox from 'yet-another-react-lightbox'
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import Download from 'yet-another-react-lightbox/plugins/download'
import Share from 'yet-another-react-lightbox/plugins/share'

const autoplay = false
const delay = 3000

const Preview = () => {
  const router = useRouter()
  const { id } = router.query

  const [index, setIndex] = useState(-1)
  const [gallery, setGallery] = useState(null)
  const [photos, setPhotos] = useState([])

  const fetchGallery = async () => {
    try {
      const gallery = await API.get(`/gallery/${id}`)
      setGallery(gallery.data)
    } catch (error) {
      toast.error('Something went wrong', {
        position: 'bottom-left'
      })
    }
  }

  const fetchPhotoGallery = async () => {
    try {
      const photos = await API.get(`/gallery/${id}/photos`)
      setPhotos(photos.data)
    } catch (error) {
      toast.error('Something went wrong', {
        position: 'bottom-left'
      })
    }
  }

  const renderPhoto = ({ imageProps: { alt, style, ...rest } }) => (
    <img
      alt={alt}
      style={{
        ...style,
        borderRadius: '4px',
        boxShadow:
          '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
        transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
      }}
      {...rest}
    />
  )

  useEffect(() => {
    if (id) {
      fetchGallery()
      fetchPhotoGallery()
    }
  }, [id])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Event Details' />
          <CardContent>
            <Typography variant='h1' sx={{ mb: 2 }}>
              {gallery?.name}
            </Typography>
            <Typography sx={{ mb: 2 }}>{gallery?.event?.name}</Typography>
            <Typography sx={{ mb: 2 }}>{gallery?.eventDate && new Date(gallery.eventDate).getFullYear()}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <PhotoAlbum
          layout='rows'
          photos={photos}
          targetRowHeight={250}
          padding={10}
          spacing={10}
          renderPhoto={renderPhoto}
          onClick={({ index }) => setIndex(index)}
        />
        <Lightbox
          slides={photos}
          open={index >= 0}
          index={index}
          close={() => setIndex(-1)}
          slideshow={{ autoplay, delay }}
          plugins={[Fullscreen, Slideshow, Zoom, Counter, Download, Share]}
        />
      </Grid>
    </Grid>
  )
}

Preview.acl = {
  action: 'read',
  subject: 'Gallery'
}

export default Preview
