import React, { Component } from 'react';
import { Switch , Route, Redirect , withRouter } from 'react-router-dom';
// import createHistory from 'history/createBrowserHistory';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Login from '../Login';
import Home from "../Home";
import Schedule from '../Schedule';
import Timesheet from '../Timesheet';
import Availability from '../Availability';
import Notifications from '../Notifications';
import img from "../Images/myflc.jpg"
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

// const history = createHistory();

class RouterComp extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isLoggedIn : localStorage.getItem("client_name") ? true : false ,
      userEmail :  localStorage.getItem("client_email"),
      openMenu : false,
      passModal : false,
      oldPass : "",
      newPass : "",
      confirmPass : "",
      error : false ,
      errorText : ""
    }
  }

  handleChange = (e) => {
    this.setState({[e.target.name]:e.target.value})
  }

  handleError = (text) =>{
    
    if(text.length!==0){
      this.setState({
        error:true,
        errorText:text
      })
    } 
    else {
      this.setState({ error:false})
    }
  }
  renderPassModal = () => {

    const { oldPass , newPass , confirmPass , passModal } = this.state;

    return <Modal
      open={passModal}
      onClose={() => this.setState({passModal:false})}
    >
      <div style={{padding:"1rem"}} className="modalBox">
        <h2> Forgot Password? </h2>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          type="password"
          id="oldPass"
          label="Old Password"
          name="oldPass"
          autoComplete="oldPass"
          value={oldPass}
          onChange={this.handleChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          type="password"
          id="newPass"
          label="New Password"
          name="newPass"
          autoComplete="newPass"
          value={newPass}
          onChange={this.handleChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          type="password"
          id="confirmPass"
          label="Confirm Password"
          name="confirmPass"
          autoComplete="confirmPass"
          value={confirmPass}
          onChange={this.handleChange}
        />
        <Button
          style={{ margin: '20px 20px 0 0'  }}
          variant="contained"
          onClick={() => this.setState({passModal:false})}
        >
          Exit
        </Button>
        <Button
          style={{ margin: '20px 20px 0 0'  }}
          variant="contained"
          onClick={this.changePass}>
          Continue
        </Button>
      </div>
    </Modal>
  }
  
  changePass = async() =>{
    const { oldPass , newPass , confirmPass , userEmail } = this.state;
    
    if(newPass!==confirmPass){
      this.handleError("New Passwords Do not Match.")
      return;
    }

    const res = await fetch(`https://clientapp.functionallearning.ca/api/changepassword`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        email:userEmail,
        old_pass:oldPass,
        new_pass:newPass
        })
      })

    const resData = await res.json();
    console.log(resData);
    if(Object.keys(resData).includes("success")){
      this.setState({passModal:false,success:true});
    }
    else{
      this.handleError("Old Password Incorrect.")
    }
    

  }

  toggleDrawer = () => {
    this.setState(prev => ({
      openMenu: !prev.openMenu
    }))
  }

  loginHandler = () => {
    this.setState({ 
      isLoggedIn:true, 
      userEmail:localStorage.getItem('client_email')
    })
  }
  
  logoutHandler = () => {
    this.setState({isLoggedIn:false,userEmail:null})
    localStorage.clear();
  }

  render() {
    const { isLoggedIn , error , errorText , success } = this.state;
    const { location , history } = this.props;
    return (
      <div className="appContainer">
        { isLoggedIn === false   ? 
          <Route render = {() => <Login loginHandler={this.loginHandler}/>}></Route> :
          <div>
            <AppBar position="static">
              <Toolbar className="header-container">
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  onClick={this.toggleDrawer}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap>
                  <span style={{ 
                    textTransform: 'capitalize' , 
                    position:"absolute" ,
                    top : "0.9rem" ,
                    left : "4rem"
                  }}>{
                    location.pathname.substring(1)
                  }</span>
                </Typography>
                {'/home' === location.pathname ? ""
                :
                (<div>
                  <span>
                    Hi, <span style={{ textDecoration: 'capitalize' }}>{localStorage.getItem('client_name')}</span>
                  </span>
                </div>)
                }
              </Toolbar>
              <Drawer anchor={'left'} open={this.state.openMenu} onClose={this.toggleDrawer}>
                <img style={{ margin: '20px auto' }} height="100px" alt="img" width="100px" src={img}></img>
                <div style={{
                  width: '27vw',
                  padding: '12px 16px'
                }}>
                  <div className={`nav-bar-item ${'/home' === location.pathname ? 'highlight' : ''}`} onClick={() => {
                    history.push("/home")
                    this.toggleDrawer();
                  }}>Home</div>
                  <div className={`nav-bar-item ${'/schedule' === location.pathname ? 'highlight' : ''}`} onClick={() => {
                    history.push("/schedule")
                    this.toggleDrawer();
                  }}>Schedule</div>
                  <div className={`nav-bar-item ${'/timesheet' === location.pathname ? 'highlight' : ''}`} onClick={() => {
                    history.push("/timesheet")
                    this.toggleDrawer();
                  }}>Timesheet</div>
                  <div className={`nav-bar-item ${'/availability' === location.pathname ? 'highlight' : ''}`} onClick={() => {
                    history.push("/availability")
                    this.toggleDrawer();
                  }}>Availability</div>
                  <div style={{ fontSize: '12px', cursor: 'pointer', border: '1px solid gray', color: 'black', marginTop: '15px', borderRadius: '8px', padding: '4px 12px', width: '50px' }} onClick={() => {
                    this.toggleDrawer();
                    this.logoutHandler()
                  }}>Sign Out</div>
                  <div style={{ fontSize: '12px', cursor: 'pointer', border: '1px solid gray', color: 'black', marginTop: '15px', borderRadius: '8px', padding: '4px 12px' , width: '100px' }} onClick={() => {
                    this.toggleDrawer();
                    this.setState({passModal:true})
                  }}>Change Password</div>
                </div>
              </Drawer>
            </AppBar>
            <Switch> 
              <Route path="/home" component = {Home}></Route>        
              <Route path="/timesheet" component={Timesheet}></Route>
              <Route path="/schedule" component={Schedule}></Route>
              <Route path="/availability" component={Availability}></Route>
              <Route path="/notifications" component={Notifications}></Route>      
              <Redirect to="/home" />        
            </Switch>
            <Snackbar 
              onClose={()=>{this.handleError("")}}
              open={error}
              autoHideDuration={2000}  >
              <Alert severity="error">
                <span style={{display:"flex",justifyContent:"space-around",alignItems:"center"}}>{errorText} <CloseIcon onClick={()=>{this.handleError("")}}/></span>
              </Alert>
            </Snackbar>
            <Snackbar 
              onClose={()=>{this.setState({success:false})}}
              open={success}
              autoHideDuration={2000}  >
                <Alert severity="success">
                  <span style={{display:"flex",justifyContent:"space-around",alignItems:"center"}}>Password Changed.<CloseIcon onClick={()=>{this.setState({success:false})}}/></span>
                </Alert>
              </Snackbar>
          </div>
        }
        {this.renderPassModal()}   
      </div>
    );
  }
}

export default withRouter(RouterComp);

