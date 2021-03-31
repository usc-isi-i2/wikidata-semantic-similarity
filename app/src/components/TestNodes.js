import React, { useEffect, useRef, useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper'
import CancelIcon from '@material-ui/icons/Cancel'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'


import Input from './Input'


const TYPES = ['complex', 'transe', 'text']


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
    marginTop: theme.spacing(1),
    transform: 'scale(2)',
    cursor: 'pointer',
    transition: 'all 350ms ease',
    '&:hover': {
      color: 'rgba(255, 255, 255, 0.5)',
    },
  },
  result: {
    position: 'relative',
    marginTop: theme.spacing(3),
  },
  link: {
    width: '97%',
    display: 'inline-block',
    padding: theme.spacing(1),
    marginLeft: theme.spacing(5),
    color: '#fefefe',
    transition: '0.2s background ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.1)',
      textDecoration: 'none',
      cursor: 'pointer',
    },
  },
  index: {
    color: '#fefefe',
    position: 'absolute',
    top: theme.spacing(2.5),
    left: theme.spacing(1),
  },
  label: {
    color: '#fefefe',
    textDecoration: 'underline',
  },
  description: {
    color: '#fefefe',
    textDecoration: 'none',
    marginTop: theme.spacing(1),
  },
  progressBar: {
    backgroundColor: 'rgba(0, 255, 0, 0.35)',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '0%',
    height: '100%',
    transition: 'width 250ms ease',
  },
}))


const TestNodes = ({ subject }) => {

  const classes = useStyles()

  const timeoutID = useRef(null)

  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState([])

  useEffect(() => {
    // fetch similarities for this qnode and update
    selected.forEach(alt => {
      TYPES.forEach(type => {
        if ( !alt.similarity[type] ) {
          let url = `/similarity?q1=${subject.qnode}`
          url += `&q2=${alt.qnode}`
          url += `&embedding_type=${type}`
          return fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .then((response) => response.json())
          .then((results) => {
            alt.similarity[type] = Math.abs(results.similarity)
            setSelected([
              ...selected.filter(item => item.qnode !== alt.qnode),
              alt,
            ])
          })
        }
      })
    })
  }, [selected])

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

  const renderSelected = () => {
    return selected.map(selected => (
      <Grid container spacing={3} className={classes.wrapper}>
        <Grid item xs={3}>
          <Typography
            component="h5"
            variant="h5"
            className={ classes.label }>
            { selected.label[0] } ({ selected.qnode })
          </Typography>
          <Typography
            component="p"
            variant="body1"
            className={ classes.description }>
            <b>Description:</b> { !!selected.description[0] ? selected.description[0] : 'No Description'}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Grid container spacing={3}>
            {TYPES.map(type => (
              <Grid item xs={4} key={type}>
                <Paper component="div"
                  className={classes.paper} square>
                  <div className={classes.progressBar}
                    style={{
                      width: `${Math.round(selected.similarity[type] * 100)}%`
                  }}></div>
                  {!!selected.similarity[type] ? (
                    <React.Fragment>
                      <Typography component="h5" variant="h5"
                        style={{ width: '100%', textAlign: 'center', cursor: 'pointer' }}
                        title={selected.similarity[type]}>
                        {Math.round(selected.similarity[type] * 100) / 100}
                      </Typography>
                    </React.Fragment>
                  ) : (
                    <Typography component="h5" variant="h5"
                      style={{ width: '100%', textAlign: 'center' }}>
                      --
                    </Typography>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={1} style={{ textAlign: "center" }}>
          <IconButton className={classes.cancel}
            onClick={event => removeSelected(selected)}>
            <CancelIcon fontSize="large" />
          </IconButton>
        </Grid>
      </Grid>
    ))
  }

  const submitQuery = query => {
    // Construct the url with correct parameters
    let url = `https://kgtk.isi.edu/api/`
    if ( query ) {
      url += `${query}?type=ngram&extra_info=true&language=en&item=qnode`
      return fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.json())
      .then((results) => {
        setResults(results)
      })
    }
  }

  const handleSubmit = event => {
    event.preventDefault()
    submitQuery(query)
  }

  const handleOnChange = query => {
    setQuery(query)
    if ( !query ) {
      setResults([])
    } else {
      clearTimeout(timeoutID.current)
      timeoutID.current = setTimeout(() => {
        submitQuery(query)
      }, 500)
    }
  }

  const renderSearch = () => {
    return (
      <Grid container spacing={3} className={classes.wrapper}>
        <Grid item xs={3}>
        </Grid>
        <Grid item xs={8}>
          <form className={ classes.form } noValidate
            onSubmit={event => handleSubmit(event)}>
            <Grid container spacing={ 3 }>
              <Grid item xs={ 12 }>
                <Paper component="div" className={ classes.paper } square>
                  <Grid container spacing={ 3 }>
                    <Grid item xs={ 12 }>
                      <Input
                        fontSize='1.5em'
                        labelFontSize='1.25em'
                        autoFocus={ true }
                        label={'search to compare q-nodes'}
                        onChange={query => handleOnChange(query)}/>
                    </Grid>
                  </Grid>
                </Paper>
                {renderResults()}
              </Grid>
            </Grid>
          </form>
        </Grid>
        <Grid item xs={1}>
        </Grid>
      </Grid>
    )
  }

  const addSelected = result => {
    result.similarity = {}
    setSelected([
      ...selected.filter(item => item.qnode !== result.qnode),
      result,
    ])
    setResults([
      ...results.filter(item => item.qnode !== result.qnode),
    ])
  }

  const removeSelected = result => {
    setSelected([...selected.filter(item => item.qnode !== result.qnode)])
  }

  const renderResults = () => {
    return results.map((result, i) => (
      <Grid key={i} container spacing={3} className={classes.result}>
        <Grid item xs={12}>
          <Typography
            component="h5"
            variant="h5"
            className={ classes.index }>
            { i + 1 }.
          </Typography>
          <Link
            onClick={event => addSelected(result)}
            className={ classes.link }>
            <Typography
              component="h5"
              variant="h5"
              className={ classes.label }>
              { result.label[0] } ({ result.qnode })
            </Typography>
            <Typography
              component="p"
              variant="body1"
              className={ classes.description }>
              <b>Description:</b> { !!result.description[0] ? result.description[0] : 'No Description'}
            </Typography>
            { !!result.alias.length ? (
              <Typography
                component="p"
                variant="body1"
                className={ classes.description }>
                <b>Alias:</b> { result.alias.join(', ') }
              </Typography>
            ) : null }
          </Link>
        </Grid>
      </Grid>
    ))
  }

  return (
    <React.Fragment>
      {renderHeader()}
      {renderSelected()}
      {renderSearch()}
    </React.Fragment>
  )
}


export default TestNodes
