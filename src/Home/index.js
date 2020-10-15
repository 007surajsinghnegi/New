import React from 'react';
import { Link , withRouter } from 'react-router-dom';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openMenu : false,
      isNotification : false,
      alert:""
    }
  }

  async componentDidMount(){
    
    //Notifications
    const URL = `https://clientapp.functionallearning.ca/api/sessions?client_name=${localStorage.getItem('client_name')}&is_accepted=False`

    const res = await fetch(URL, {
      headers: { 'Content-Type': 'application/json' }
    })

    const resData = await res.json()

    if (resData.length > 0)
      this.setState({isNotification:true})

      
    //Alerts
    const res_2 = await fetch(`https://clientapp.functionallearning.ca/api/noticeboard`, {
      headers: { 'Content-Type': 'application/json' }
    })

    const resData_2 = await res_2.json()
    this.setState({alert:resData_2[0]})
  }

  render() {
    const { isNotification } = this.state;

    return (
      <div>
        <h1 style={{textAlign:"center",marginBottom:"5rem"}}>Hello {localStorage.getItem('client_name')}</h1>
        <div className="Home">
          <Link className={ isNotification ? "Home-Btn Home-Bottom Red-Background":"Home-Btn Home-Bottom"} to="/notifications">Notifications</Link>
          <Link className="Home-Btn Home-Top" to="/schedule">Schedule</Link>
          <Link className="Home-Btn Home-Right" to="/availability">Availability</Link>
          <Link className="Home-Btn Home-Left" to="/timesheet">Timesheet</Link>
        </div>
        <div style={{background:"#FCEEE3", padding:"1rem",textAlign:"center",border:"2px #000 solid",marginTop:"6rem"}}>{this.state.alert.message||"...Loading" }</div>
      </div>
    );
  }
}

export default withRouter(Home)
