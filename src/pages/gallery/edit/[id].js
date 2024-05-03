import { useEffect, forwardRef, Fragment, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import CardActions from '@mui/material/CardActions'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Badge from '@mui/material/Badge'

import InputAdornment from '@mui/material/InputAdornment'

import API from 'src/configs/axios'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import * as yup from 'yup'
import toast from 'react-hot-toast'
import DatePicker from 'react-datepicker'
import { useForm, Controller } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Styled Component
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useRouter } from 'next/router'

const CustomInput = forwardRef((props, ref) => {
  return <CustomTextField fullWidth {...props} inputRef={ref} label='Event Date' autoComplete='off' />
})

const gallerySchema = yup.object().shape({
  name: yup
    .string()
    .required('Event name in required')
    .matches(/^[A-Za-z0-9\s]+$/, 'Please enter event name in english'),
  nameNative: yup
    .string()
    .required('Event name in marathi required')
    .matches(/^[ऀ-ॿ\s]+$/, 'Please enter event name in marathi'),
  event: yup.string().required(),
  eventDate: yup.string().required(),
  village: yup.string().required()
})

const defaultValues = {
  name: '',
  nameNative: '',
  eventDate: null,
  event: '',
  village: ''
}

const Gallery = () => {
  const router = useRouter()
  const { id } = router.query

  const [events, setEvents] = useState([])
  const [villages, setVillages] = useState([])
  const [files, setFiles] = useState([])

  const [photos, setPhotos] = useState([])

  const [tab, setTab] = useState('1')

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 100,
    maxSize: 15000000,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles)
    },
    onDropRejected: () => {
      toast.error('You can only upload 100 files & maximum size of 15 MB.', {
        duration: 2000
      })
    }
  })

  // ** Hook
  const {
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(gallerySchema)
  })

  const renderFilePreview = file => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file)} />
    } else {
      return <Icon icon='tabler:file-description' />
    }
  }

  const handleRemoveFile = file => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter(i => i.name !== file.name)
    setFiles([...filtered])
  }

  const fileList = files.map(file => (
    <ListItem key={file.name}>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name'>{file.name}</Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <Icon icon='tabler:x' fontSize={20} />
      </IconButton>
    </ListItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  const fetchEvents = async () => {
    const events = await API.get('/event')
    setEvents(events.data)
  }

  const fetchVillages = async () => {
    const villages = await API.get('/village')
    setVillages(villages.data)
  }

  const onSubmit = async ({ name, nameNative, event, eventDate, village }) => {
    try {
      const slug = name.trim().toLowerCase().split(' ').join('-')
      const formData = new FormData()
      formData.append('name', name.trim())
      formData.append('nameNative', nameNative.trim())
      formData.append('slug', slug)
      formData.append('event', event)
      formData.append('eventDate', new Date(eventDate))
      formData.append('village', village)
      files.forEach(file => {
        formData.append('files', file)
      })

      await API.patch(`/gallery/${id}`, formData)
      toast.success('Event with photos added successfully', {
        position: 'bottom-left'
      })
      setFiles([])
      fetchPhotoGallery()
    } catch (err) {
      console.log(err)
      toast.error('Something went wrong', {
        position: 'bottom-left'
      })
    }
  }

  const fetchGallery = async () => {
    try {
      const gallery = await API.get(`/gallery/${id}`)
      const { name, nameNative, eventDate, event, village } = gallery.data
      setValue('name', name)
      setValue('nameNative', nameNative)
      setValue('eventDate', new Date(eventDate))
      setValue('event', event?.id)
      setValue('village', village?.id)
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

  const deletePhoto = async photoId => {
    try {
      await API.delete(`/gallery/${id}/photo/${photoId}`)
      const tempPhoto = photos.filter(photo => photo.id !== photoId)
      setPhotos(tempPhoto)
    } catch (error) {
      toast.error('Something went wrong', {
        position: 'bottom-left'
      })
    }
  }

  const deleteAllPhotos = async () => {
    try {
      await API.delete(`/gallery/${id}/photos`)
      setPhotos([])
    } catch (error) {
      toast.error('Something went wrong', {
        position: 'bottom-left'
      })
    }
  }

  useEffect(() => {
    fetchEvents()
    fetchVillages()
  }, [])

  useEffect(() => {
    if (id) {
      fetchGallery()
      fetchPhotoGallery()
    }
  }, [id])

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Add Event Details With Photos' />
            <Divider sx={{ m: '0 !important' }} />
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <Typography variant='body2' sx={{ fontWeight: 600 }}>
                      1. Event Details
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='name'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          label='Name'
                          onChange={onChange}
                          placeholder='Palkhi 2024'
                          error={Boolean(errors.name)}
                          aria-describedby='validation-schema-name'
                          {...(errors.name && { helperText: errors.name.message })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='nameNative'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          label='Marathi Name'
                          onChange={onChange}
                          placeholder='पालखी २०२४'
                          error={Boolean(errors.nameNative)}
                          aria-describedby='validation-schema-nameNative'
                          {...(errors.nameNative && { helperText: errors.nameNative.message })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='event'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          select
                          fullWidth
                          id='events-select'
                          label='Events'
                          SelectProps={{
                            value: value,
                            onChange: e => onChange(e.target.value)
                          }}
                          error={Boolean(errors.event)}
                          aria-describedby='validation-basic-select'
                          {...(errors.event && { helperText: 'This field is required' })}
                        >
                          {events?.length ? (
                            events.map(event => (
                              <MenuItem
                                key={event.id}
                                value={event.id}
                              >{`${event.name} (${event.nameNative})`}</MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>No Event Found</MenuItem>
                          )}
                        </CustomTextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='eventDate'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <DatePicker
                          selected={value}
                          showYearDropdown
                          showMonthDropdown
                          onChange={e => onChange(e)}
                          placeholderText='DD-MM-YYYY'
                          dateFormat='d-MMMM-yyyy'
                          customInput={
                            <CustomInput
                              value={value}
                              onChange={onChange}
                              label='Event Date'
                              error={Boolean(errors.eventDate)}
                              aria-describedby='form-layouts-separator-eventDate'
                              {...(errors.eventDate && { helperText: 'This field is required' })}
                            />
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name='village'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          select
                          fullWidth
                          id='villages-select'
                          label='Village'
                          SelectProps={{
                            value: value,
                            onChange: e => onChange(e.target.value)
                          }}
                          error={Boolean(errors.village)}
                          aria-describedby='validation-basic-select'
                          {...(errors.village && { helperText: 'This field is required' })}
                        >
                          {villages?.length ? (
                            villages.map(village => (
                              <MenuItem
                                key={village.id}
                                value={village.id}
                              >{`${village.name} (${village.nameNative})`}</MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>No Village Found</MenuItem>
                          )}
                        </CustomTextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ mb: '0 !important' }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='body2' sx={{ fontWeight: 600 }}>
                      2. Upload / Delete Photos
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TabContext value={tab}>
                      <TabList onChange={(event, newTab) => setTab(newTab)} aria-label='icon tabs example'>
                        <Tab value='1' label='Delete Photos' icon={<Icon icon='material-symbols:delete' />} />
                        <Tab value='2' label='Upload Photos' icon={<Icon icon='material-symbols:upload' />} />
                      </TabList>
                      <TabPanel value='1'>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            textAlign: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            gap: 2
                          }}
                        >
                          {photos?.length ? (
                            photos.map(photo => (
                              <Box
                                key={photo.id}
                                sx={{
                                  m: 1.5,
                                  p: 6,
                                  display: 'flex',
                                  textAlign: 'center',
                                  alignItems: 'center',
                                  borderRadius: 1,
                                  border: theme => `1px solid ${theme.palette.divider}`
                                }}
                              >
                                <Badge
                                  badgeContent={
                                    <Icon
                                      icon='mingcute:delete-fill'
                                      fontSize={25}
                                      style={{ color: '#7367f0' }}
                                      onClick={() => deletePhoto(photo.id)}
                                    />
                                  }
                                  sx={{ cursor: 'pointer' }}
                                >
                                  <img style={{ maxHeight: '150px', maxWidth: '300px' }} src={photo.path} alt='test' />
                                </Badge>
                              </Box>
                            ))
                          ) : (
                            <Typography sx={{ mb: 2 }}>No Image Uploaded</Typography>
                          )}
                        </Box>
                        {photos.length > 0 && (
                          <div className='buttons'>
                            <Button color='error' variant='outlined' onClick={deleteAllPhotos}>
                              Delete All
                            </Button>
                          </div>
                        )}
                      </TabPanel>
                      <TabPanel value='2'>
                        <DropzoneWrapper>
                          <Fragment>
                            <div {...getRootProps({ className: 'dropzone' })}>
                              <input {...getInputProps()} />
                              <Box
                                sx={{
                                  display: 'flex',
                                  textAlign: 'center',
                                  alignItems: 'center',
                                  flexDirection: 'column'
                                }}
                              >
                                <Box
                                  sx={{
                                    mb: 8.75,
                                    width: 48,
                                    height: 48,
                                    display: 'flex',
                                    borderRadius: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.08)`
                                  }}
                                >
                                  <Icon icon='tabler:upload' fontSize='1.75rem' />
                                </Box>
                                <Typography variant='h4' sx={{ mb: 2.5 }}>
                                  Drop files here or click to upload.
                                </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>
                                  Allowed *.jpeg, *.jpg, *.png, *.gif
                                </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>
                                  Max 2 files and max size of 2 MB
                                </Typography>
                              </Box>
                            </div>
                            {files.length ? (
                              <Fragment>
                                <List>{fileList}</List>
                                <div className='buttons'>
                                  <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
                                    Remove All
                                  </Button>
                                </div>
                              </Fragment>
                            ) : null}
                          </Fragment>
                        </DropzoneWrapper>
                      </TabPanel>
                    </TabContext>
                  </Grid>
                </Grid>
              </CardContent>
              <Divider sx={{ m: '0 !important' }} />
              <CardActions sx={{ textAlign: 'center' }}>
                <Button type='submit' variant='contained'>
                  Submit
                </Button>
              </CardActions>
            </form>
          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

Gallery.acl = {
  action: 'update',
  subject: 'Gallery'
}

export default Gallery
