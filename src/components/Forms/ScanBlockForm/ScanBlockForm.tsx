import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ScanInformation } from 'interfaces';
import { DEFAULT_SCAN_INFO } from 'constants/scan';

const useStyles = makeStyles((theme: Theme) => ({
  formContainer: {
    padding: theme.spacing(2),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    '& .MuiTextField-root': {
      marginBottom: theme.spacing(2),
      width: 400
    }
  },
  formTitle: {
    marginBottom: theme.spacing(4),
  }
}));

const validationSchema = yup.object({
  startBlock: yup.number()
    .required('Start Block is required')
    .positive()
    .integer()
    .lessThan(yup.ref('endBlock'), 'Start block should be less than end block.'),
  endBlock: yup.number()
    .required('End Block is required')
    .positive()
    .integer()
    .moreThan(yup.ref('startBlock'), 'End Block should be bigger than start block.'),
  endpoint: yup.string().required('Endpoint is required')
});

interface ScanBlockFormInterface {
  onScan: (info: ScanInformation) => void;
}

const ScanBlockForm: React.FC<ScanBlockFormInterface> = ({ onScan }) => {
  const classes = useStyles();
  const formik = useFormik({
    initialValues: DEFAULT_SCAN_INFO,
    validationSchema,
    onSubmit: (values) => {
      onScan(values);
    }
  })

  return (
    <Paper className={classes.formContainer} elevation={6}>
      <Typography className={classes.formTitle} align='center' variant='h5'>Scan Information</Typography>
      <form className={classes.form} onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          label='Start Block'
          variant='outlined'
          id='startBlock'
          name='startBlock'
          value={formik.values.startBlock}
          onChange={formik.handleChange}
          error={formik.touched.startBlock && Boolean(formik.errors.startBlock)}
          helperText={formik.touched.startBlock && formik.errors.startBlock}
        />
        <TextField
          fullWidth
          label='End Block'
          variant='outlined'
          id='endBlock'
          name='endBlock'
          value={formik.values.endBlock}
          onChange={formik.handleChange}
          error={formik.touched.endBlock && Boolean(formik.errors.endBlock)}
          helperText={formik.touched.endBlock && formik.errors.endBlock}
        />
        <TextField
          fullWidth
          label='Endpoint'
          variant='outlined'
          id='endpoint'
          name='endpoint'
          value={formik.values.endpoint}
          onChange={formik.handleChange}
          error={formik.touched.endpoint && Boolean(formik.errors.endpoint)}
          helperText={formik.touched.endpoint && formik.errors.endpoint}
        />
        <Button color='primary' variant='contained' type='submit'>Scan</Button>
      </form>
    </Paper>
  )
};

export default ScanBlockForm;
