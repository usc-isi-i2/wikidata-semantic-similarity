import React from 'react'

import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'


const useStyles = makeStyles(theme => ({
  wrapper: {
    marginTop: theme.spacing(6),
  },
  paper: {
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    backgroundColor: 'rgba(254, 254, 254, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    position: 'relative',
    color: '#fefefe',
  },
  cancel: {
    color: 'rgba(255, 255, 255, 0.35)',
    position: 'absolute',
    top: theme.spacing(7),
    right: theme.spacing(5),
    transform: 'scale(2)',
    cursor: 'pointer',
    transition: 'all 350ms ease',
    '&:hover': {
      color: 'rgba(255, 255, 255, 0.5)',
    },
  },
}))


const TestNodes = ({ subject }) => {

  const classes = useStyles()

  const renderHeader = () => {
    return (
      <Grid container spacing={3} className={classes.wrapper}>
        <Grid item xs={3}>
        </Grid>
        <Grid item xs={8}>
          <Paper component="div"
            className={classes.paper} square>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <Typography component="h5" variant="h5" style={{ textAlign: 'center' }}>
                  ComplEx
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography component="h5" variant="h5" style={{ textAlign: 'center' }}>
                  TransE
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography component="h5" variant="h5" style={{ textAlign: 'center' }}>
                  Text
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={1}>
        </Grid>
      </Grid>
    )
  }

  return (
    <React.Fragment>
      {renderHeader()}
    </React.Fragment>
  )
}


export default TestNodes
