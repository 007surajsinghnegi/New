import React, { useState } from 'react';
import logo from "../Images/SquareLogo.png";
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import CloseIcon from '@material-ui/icons/Close';
// import { setItemInPersistentStore } from '../utils/Persist.js';
import { withRouter } from 'react-router';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    margin:"1rem auto",
    height:"400px",
    width:"400px"
  },
  logoImg:{
    height:"100%",
    width:"100%"
  },
  form: {
    width: '400px', 
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: "1rem 0rem",
    borderRadius : "13px",
    padding : "1rem"
  },
}));

function Login(props) {
  const classes = useStyles();

  const [email, setEmail] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [forgotModal, setForgotModal] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);


  const handleEmail = (e) => {
    setEmail(e.target.value)
  }

  const handleForgotEmail = (e) => {
    setForgotEmail(e.target.value)
  }

  const handlePass = (e) => {
    setPassword(e.target.value)
  }

  const handleErrorClose = () => {
    setError(false)
  }
  
  const forgotPass = async () => {

    if(forgotEmail===""){
      setError(true)
      setErrorText("Enter Email")
      return;
    }

    const res = await fetch(`https://clientapp.functionallearning.ca/api/resetpassword`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({email:forgotEmail})
      })

    const resData = await res.json();
    if(Object.keys(resData).includes("success")){
      setForgotModal(false);
      setForgotSuccess(true)
    }
    else{
      setErrorText("No such email registered.")
      setError(true);
    }

  }

  const renderResetModal = () => {

    return <Modal
      open={forgotModal}
      onClose={() => setForgotModal(false)}
    >
      <div style={{padding:"1rem"}} className="modalBox">
        <h2> Forgot Password? </h2>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={forgotEmail}
          onChange={handleForgotEmail}
        />
        <Button
          style={{ margin: '20px 20px 0 0'  }}
          variant="contained"
          onClick={() => setForgotModal(false)}
        >
          Exit
        </Button>
        <Button
          style={{ margin: '20px 20px 0 0'  }}
          variant="contained"
          onClick={() => forgotPass()}>
          Continue
        </Button>
      </div>
    </Modal>
  }

  const signIn = () => {

    if(email === "" || password === "" ){
      setErrorText("Fill all the fields.")
      setError(true)
      return
    }

    fetch('https://clientapp.functionallearning.ca/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"email": email, "password": password})
    })
    .then((res) => {
      if(res.status >= 400 && res.status <=500) {
        console.log(res);
        setErrorText("Incorrect Email/Password")
        setError(true)
        return
      }
      res.json().then(res => {
        localStorage.setItem('client_name', res.client_name)
        localStorage.setItem('client_email', email)
        props.loginHandler();
        props.history.push('/home');
      })
    })
  }

  return (
    <div className={classes.paper}>
      <div className={classes.logo}>
        <img className={classes.logoImg} src={logo} alt="logo" />
      </div>
      <form className={classes.form} noValidate>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={handleEmail}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={handlePass}
        />
        <Link
          component="button"
          variant="body2"
          onClick={(e) => {
            e.preventDefault();
            setForgotModal(true)}
          }
        >
          Forgot Password?
        </Link>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={signIn}
        >
          Sign In
        </Button>
      </form>
      {renderResetModal()}
      <Snackbar 
        onClose={handleErrorClose}
        open={error}
        autoHideDuration={2000}  >
        <Alert severity="error">
          <span style={{display:"flex",justifyContent:"space-around",alignItems:"center"}}>{errorText} <CloseIcon onClick={handleErrorClose}/></span>
        </Alert>
      </Snackbar>
      <Snackbar 
      onClose={()=>{setForgotSuccess(false)}}
      open={forgotSuccess}
      autoHideDuration={2000}  >
        <Alert severity="success">
          <span style={{display:"flex",justifyContent:"space-around",alignItems:"center"}}>Reset link sent to your email.<CloseIcon onClick={()=>{setForgotSuccess(false)}}/></span>
        </Alert>
      </Snackbar>
    </div>
  );
}

export default withRouter(Login)
