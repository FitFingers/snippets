import { makeStyles } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { useFormikContext } from 'formik'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'

const allowedFiles = 'image/*,.pdf'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    borderWidth: 4,
    borderRadius: 5,
    textAlign: 'center',
    borderStyle: 'dashed',
    cursor: 'pointer',
    borderColor: theme.palette.primary.main,
    padding: theme.spacing(6, 12),
    margin: theme.spacing(0, 1, 1)
  }
}))

export default function FileUploader(props) {
  const [file, setFile] = useState(null)
  const { setFieldValue, setFieldTouched, values } = useFormikContext()
  const classes = useStyles()

  const saveFileDataToState = useCallback(
    (fileData) => {
      setFieldTouched('application', true)
      setFieldValue('applicationFileName', fileData.name)
      setFile(fileData)
    },
    [setFieldTouched, setFieldValue]
  )

  const saveFileToState = useCallback(
    (binary) => setFieldValue('application', binary, true),
    [setFieldValue]
  )

  const onDrop = useCallback(
    (acceptedFiles) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        const binaryStr = reader.result
        saveFileToState(binaryStr)
      }

      acceptedFiles.forEach((fileData) => {
        const img = reader.readAsDataURL(fileData)
        saveFileDataToState(fileData)
      })
    },
    [saveFileDataToState, saveFileToState]
  )

  // TODOJ: REMOVE => DEBUG ONLY
  useEffect(() => {
    console.log('DEBUG', { file, application: values.application })
  }, [file, values.application])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 16 * 1024 * 1024
  })

  const label = useMemo(() => {
    if (file) return file.name
    if (isDragActive) return 'Drop your file here...'
    return 'Drag and drop your file here, or click to select a file'
  }, [isDragActive, file])

  return (
    <Box {...getRootProps()} className={classes.wrapper}>
      <input {...getInputProps()} accept={allowedFiles} />
      <p>{label}</p>
    </Box>
  )
}
