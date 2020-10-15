import React, { Component } from 'react';
import { format } from "date-fns"

//Material UI
// import TextField from '@material-ui/core/TextField';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Edit from '@material-ui/icons/Edit';
import Cancel from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import HourglassEmptySharp from '@material-ui/icons/HourglassEmptySharp';
import Modal from '@material-ui/core/Modal';
import Tooltip from '@material-ui/core/Tooltip';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import NotificationsIcon from '@material-ui/icons/Notifications';
import CloseIcon from '@material-ui/icons/Close';
// import Badge from '@material-ui/core/Badge';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const months = [ 'Jan', 'Feb', 'March','April','May','June','July','Aug','Sep','Oct','Nov','Dec'];

const daysInMonths = [31,28,31,30,31,30,31,31,30,31,30,31]
const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const hours = ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']

const mins = ['00', '15', '30', '45']

const today = new Date();
const currMonth = today.getMonth();
const currentYear = today.getFullYear();
const dateToday = today.getDate();
const firstDayOfMonth = new Date(`${currMonth+1}/1/${currentYear}`)
const firstDayOfNextMonth = new Date(`${currMonth+2}/1/${currentYear}`)
// const currMonth = today.getMonth();
// const isMobile = false;
//  screen.width < 768;

const getTimeFormat = a => {
  if (!a) {
    return '-'
  }
  let hoursA = a.substring(0, 2)
  const minsA = a.substring(3, 5)
  let unit = 'am'
  if (hoursA >= 12) {
    unit = 'pm'
    if (hoursA > 12) {
      hoursA = hoursA - 12;
    }
  }
  if(hoursA===0)
    hoursA=12;
  return `${hoursA}:${minsA} ${unit}`
}

const getDuration = (a, b) => {
  const hoursA = a.substring(0, 2)
  const hoursB = b.substring(0, 2)
  const minutesA = a.substring(3, 5)
  const minutesB = b.substring(3, 5)
  const hours = hoursA - hoursB;
  const mins = ((hoursA - hoursB) * 60 + (minutesA - minutesB)) % 60;
  if(minutesA!=minutesB && minutesA < minutesB){
      return (`${hours-1}Hrs  ${mins}Mins`)
  }
  else
  return (`${hours}Hrs  ${mins}Mins`)

}

const getDateFormat = (date) => {

  const _date = new Date(date);
  const day = _date.toUTCString();
  const dateArr = date.split("-");
  const currentMonth = Number(dateArr[1]);
  const currentDay = day.substr(0,3);
  const currentDate = Number(dateArr[2]);

  return `${currentDay}, ${months[currentMonth-1]} ${currentDate}`

}

const renderDesktopActions = (props, row) => {

  if (row.status === 'Request Sent') {
    return <TableCell align="right">
      <div style={{display:"flex",justifyContent:"center", color: '#aaa' }}>Request Sent</div>
    </TableCell>
  }
  return <TableCell style={{display:"flex",justifyContent:"center"}} align="right">
    {
      [ 2].includes(props.index) ? <Tooltip title="Edit"><IconButton
        edge="start"
        style={{color:"#FFBF00"}}
        aria-label="open drawer"
        onClick={() => props.toggleEditModal(row)}
      >
        <Edit />
      </IconButton></Tooltip> : ''
    }<Tooltip title="Cancel">
      <IconButton
        edge="start"
        style={{color:"red"}}
        aria-label="open drawer"
        onClick={() => props.toggleCancelModal(row)}
      >
        <Cancel />
      </IconButton>
    </Tooltip>
  </TableCell>
}

const TabPanel = (props) => {
  const { value, index, dataToDisplay = [] } = props;

  const tableCellStyle = { background:"#666" , color:"#fff" , border:"2px solid #000"}
  const headStyle = {
    background:"#7380c9" ,
    padding:"1rem 1.5rem",
    color:"#fff",
    fontSize:"1.15rem"
  }

  if (value === index) {
    if (dataToDisplay.length === 0) {
      return <div className="center margin-top-20 text-gray">
        <div><HourglassEmptySharp /></div>
        <p>No Appointments</p>
      </div>
    }
    return <React.Fragment>
      {[0, 1].includes(props.index) ? <div className="meta">
        <div style={headStyle}>{getDateFormat(props.dataToDisplay[0].date, true)}</div>
        <div style={headStyle}>Start: {getTimeFormat(props.start)}</div>
        <div style={headStyle}>End: {getTimeFormat(props.end)}</div>
        <div style={headStyle}>Duration: <span>{getDuration(props.end, props.start)}</span></div>
      </div> : ''}

      <div className="tableContainer" >
        <TableContainer component={Paper} >
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {props.index === 2 ? <TableCell style={tableCellStyle} align="center">Date</TableCell> : undefined}
                <TableCell style={tableCellStyle} align="center">Start</TableCell>
                <TableCell style={tableCellStyle} align="center">Finish</TableCell>
                <TableCell style={tableCellStyle} align="center">Duration</TableCell>
                <TableCell style={tableCellStyle} align="center">Service</TableCell>
                <TableCell style={tableCellStyle} align="center">Notes</TableCell>
                <TableCell style={tableCellStyle} align="center">Options</TableCell>
              </TableRow>

            </TableHead>

            <TableBody>
              {dataToDisplay.map((row, index) => (
                <TableRow key={index}>
                  {props.index === 2 ? <TableCell align="center">{getDateFormat(row.date, true)}</TableCell> : undefined}
                  <TableCell align="center">{getTimeFormat(row.start_time)}</TableCell>
                  <TableCell align="center">{getTimeFormat(row.end_time)}</TableCell>
                  <TableCell align="center">{getDuration(row.end_time , row.start_time)}</TableCell>
                  <TableCell align="center">{row.type}</TableCell>
                  <TableCell align="center">{row.notes}</TableCell>
                  {renderDesktopActions(props, row)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </React.Fragment>
  }
  return '';
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 0,
      todayBooking: [],
      tomorrowBooking: [],
      upcomingBooking: [],
      openCancelModal: false,
      openEditModal: false,
      error: false ,
      editTime : null ,
      nonWorkingDays: [],
      alert : ""
    }
  }

  toggleCancelModal = value => {
    this.setState({ openCancelModal: value })
  }

  toggleEditModal = value => {
    this.setState({ openEditModal: value })
  }

  continueCancel = isLateCancellation => {
    const data = this.state.openCancelModal;
    const clientName = localStorage.getItem("client_name");
    fetch(`https://clientapp.functionallearning.ca/api/session/update?client_name=${clientName}&action=Cancel&start_time=${data.start_time}&date=${data.date}&end_time=${data.end_time}&message=${isLateCancellation}&type=${data.type}&notes=${data.notes}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        if (res.status >= 400 && res.status <= 500) {
          return
        }
        this.reloadData()
        this.toggleCancelModal(false)
      })
  }

  reloadData() {
    fetch(`https://clientapp.functionallearning.ca/api/sessions?client_name=${localStorage.getItem('client_name')}&is_accepted=True`, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => {
      res.text().then(data => {
        data = JSON.parse(data)
        // console.log(dateToday);
        const { todayBooking, upcomingBooking, tomorrowBooking } = data.reduce((acc, booking) => {

          const dateFull = new Date(booking.date);
          const month = Number(booking.date.split("-")[1])-1;
          const date = Number(booking.date.split("-")[2]);
          if (month===currMonth && date === dateToday) {
            acc['todayBooking'].push(booking)
          } else if ((month===currMonth && date === (dateToday + 1)) || (month===currMonth+1 && date === 1) ) {
            acc['tomorrowBooking'].push(booking)
          }
          else {
            acc['upcomingBooking'].push(booking)
          }
          return acc;
        }, { todayBooking: [], upcomingBooking: [], tomorrowBooking: [] })
        this.setState({
          todayBooking,
          tomorrowBooking,
          upcomingBooking
        })
      })
    })
  }

  continueEdit = newData => {
    const clientName = localStorage.getItem('client_name');
    const isError = (newData.start_time.hours * 60 + (+newData.start_time.minutes)) > (newData.end_time.hours * 60 + (+newData.end_time.minutes))
    if (isError) {
      this.setState({
        error: "Start time can't be greater than end time",
        editTime:newData
      })
      return;
    }

    const isError_2 = ( newData.start_time.hours * 60 + (+newData.start_time.minutes)+ 120) > (newData.end_time.hours * 60 + (+newData.end_time.minutes))
    if (isError_2) {
      this.setState({
        error: "The scheduled session has to be of at least 2 hours.",
        editTime:newData
      })
      return;
    }

    const message = `Date ${newData.date}<br>Window:</br>Start no earlier than ${newData.start_time.hours}:${newData.start_time.minutes}<br>End no later than ${newData.end_time.hours}:${newData.end_time.minutes}`;
    const data = this.state.openEditModal;
    this.setState({
      isContinue: true,
      editTime: null
    })
    fetch(`https://clientapp.functionallearning.ca/api/session/update?client_name=${clientName}&action=Edit&start_time=${data.start_time}&date=${data.date}&end_time=${data.end_time}&message=${message}&type=${data.type}&notes=${data.notes}&comments=${newData.comments}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        this.setState({
          isContinue: false
        })
        if (res.status >= 400 && res.status <= 500) {
          return
        }
        this.reloadData()
        this.toggleEditModal(false)
      })
  }

  renderCancelModal = () => {
    if (!this.state.openCancelModal) {
      return ''
    }
    let bodyText = ''

    const today = new Date();
    const date = today.getDate();
    const dateBooking = Number(this.state.openCancelModal.date.split("-")[2]);
    const monthBooking = Number(this.state.openCancelModal.date.split("-")[1]);
    const currentHours = today.getHours();


    let nextDay = daysInMonths[currMonth] === date ? 1 : date + 1;
    let monthChanged = 0;
    let bookingMonthChanged = 0;
    // This Month
    while(this.state.nonWorkingDays.includes(nextDay) && nextDay !== 1){
      console.log("Increment1");
      if(daysInMonths[currMonth] === nextDay){
        nextDay=1;
        break;
      }
      else
      nextDay++;

    }

    // Next Month
    if(nextDay===1){
      console.log("Increment2");
      monthChanged = daysInMonths[currMonth];
      while(this.state.nextMonthsSatSun.includes(nextDay))
      nextDay++;
    }

    if( currMonth+2===monthBooking || (currMonth===11 && monthBooking === 1) )
      bookingMonthChanged = daysInMonths[currMonth];

    const isLateCancellation = ( date === dateBooking || ( dateBooking+bookingMonthChanged <= nextDay+monthChanged  && currentHours >= 17 ))

    console.log(`Current date :-${date}`)
    console.log(`Booking date to be cancelled :-${dateBooking}`)
    console.log(`Next Date :-${nextDay}`)
    console.log(`Local machine Time :-${today}`)
    console.log(`Current Hour :-${currentHours}`)
    console.log(`Is late? ${isLateCancellation}`)
    console.log(`holidays? ${this.state.nonWorkingDays}`)
    console.log(`----------------------------------`)

    if (isLateCancellation) {
      bodyText = 'This cancellation will be logged as late cancellation and will be charged. Would you like to proceed?'
    } else {
      bodyText = 'Are you sure you want to cancel?'
    }

    return <Modal
      open={Boolean(this.state.openCancelModal)}
      onClose={() => this.toggleCancelModal(false)}
    >
      <div className="modalBox">
        <div style={{ padding: '16px' }}>
          <p>{bodyText}</p>
          <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              style={{ marginRight: '20px' }}
              variant="contained"
              onClick={() => this.toggleCancelModal(false)}
            >
              Exit
            </Button>
            <Button
              variant="contained"
              onClick={() => this.continueCancel(isLateCancellation)}>
              Continue
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  }

  renderEditModal = () => {

    const { openEditModal , editTime } = this.state;

    const _data = openEditModal;
    if (!_data) {
      return ''
    }

    const hoursStart = editTime ? editTime.start_time.hours:_data.start_time.substring(0, 2);
    const hoursEnd =  editTime ? editTime.end_time.hours :  _data.end_time.substring(0, 2)
    const minutesStart = editTime ? editTime.start_time.minutes : _data.start_time.substring(3, 5)
    const minutesEnd = editTime ? editTime.end_time.minutes : _data.end_time.substring(3, 5)


    const newData = {
      date: _data.date,
      start_time: {
        hours: hoursStart,
        minutes: minutesStart
      },
      end_time: {
        hours: hoursEnd,
        minutes: minutesEnd
      },
      comments:""
    };



    const handleDateChange = e => {
      newData['date'] = e.target.value
    }
    const handleNoteChange = e => {
      newData['comments'] = e.target.value
    }

    const handleTimeChange = (value, type, time) => {
      newData[time][type] = value
    }

    const styleText={textAlign:"center",fontWeight:"900"}

    return <Modal
    open={Boolean(_data)}
    onClose={() => this.toggleEditModal(false)}
    >
      <div className="modalBox">
        <h3 style={{textAlign:"center",fontSize:"1.75rem"}}>Session Modification Preference</h3>
        <p style={styleText}>Please select a different availability window.</p>
        <p style={styleText}>To cancel a session close this window & select cancel session.</p>
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>Start Date</div>
            <input
              id="date"
              type="date"
              min={format(today, "yyyy-MM-dd")}
              defaultValue={_data.date}
              onChange={handleDateChange}
            />
          </div>
          <div>
            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>Start Time</div>
              <div>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  onChange={(e) => handleTimeChange(e.target.value, 'hours', 'start_time')}
                  style={{ width: '45px' }}
                  defaultValue={hoursStart}
                >
                  {hours.map(hour =>
                    <MenuItem key={hour} value={hour}>{hour}</MenuItem>
                  )}
                </Select>
                <span> : </span>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  onChange={(e) => handleTimeChange(e.target.value, 'minutes', 'start_time')}
                  style={{ width: '45px' }}
                  defaultValue={minutesStart}
                >
                  {mins.map(minute =>
                    <MenuItem key={minute} value={minute}>{minute}</MenuItem>
                  )}
                </Select>
              </div>
            </div>
            <br />
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                End Time
            </div>
              <div>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  onChange={(e) => handleTimeChange(e.target.value, 'hours', 'end_time')}
                  style={{ width: '45px' }}
                  defaultValue={hoursEnd}
                >
                  {hours.map(hour =>
                    <MenuItem key={hour} value={hour}>{hour}</MenuItem>
                  )}
                </Select>
                <span> : </span>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  onChange={(e) => handleTimeChange(e.target.value, 'minutes', 'end_time')}
                  style={{ width: '45px' }}
                  defaultValue={minutesEnd}
                >
                  {mins.map(minute =>
                    <MenuItem key={minute} value={minute}>{minute}</MenuItem>
                  )}
                </Select>
              </div>
            </div>
            <div style={{ marginTop: '20px', display: 'block' }}>
              <div style={{ display: 'block' }}>
                Note
            </div>
            <div>
            <textarea defaultValue="" onChange={handleNoteChange} style={{border:"1px solid black",width:"100%",height:"60px",marginTop:"5px" }} type ="text"></textarea>
            </div>
            </div>
            <div style={{
              marginTop:"1rem",
              color:"#000",
              fontSize:"12px",
              fontWeight:"bold"
            }}>
            </div>
            <div style={{ marginTop: '30px', marginBottom: '30px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                style={{ marginRight: '20px' }}
                variant="contained"
                onClick={() => this.toggleEditModal(false)}
              >
                Exit
            </Button>
              <Button
                variant="contained"
                onClick={() => this.continueEdit(newData)}
              >
                {this.state.isContinue ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
            <p style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: 'red'
            }}>
              This is not a confirmation of the session. Please wait for the notification sent with session updates.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  }

  handleChange = (e, newValue) => {
    this.setState({ tabValue: newValue });
  }

  handleErrorClose = () => {
    this.setState({
      error: false
    })
  }

  setNotifications = () => {
    this.setState({
      isNotifications: true
    })
  }

  render() {
    const mapTabToData = [
      'todayBooking',
      'tomorrowBooking',
      'upcomingBooking'
    ]

    const dataToDisplay = this.state[mapTabToData[this.state.tabValue]];

    const startTimes = dataToDisplay.map(ele => ele.start_time)
    const endTimes = dataToDisplay.map(ele => ele.end_time)

    let start = startTimes.reduce((acc, ele) => {
      let value = ele;;
      if (acc < ele) {
        value = acc
      }
      return value;
    }, startTimes[0])

    start = start && start.substring(0, 5)

    let end = endTimes.reduce((acc, ele) => {
      let value = ele;
      if (acc > ele) {
        value = acc
      }
      return value
    }, endTimes[0])

    end = end && end.substring(0, 5)

    return (
      <div>
        <AppBar position="static" className="lightBlue">
          <Tabs value={this.state.tabValue} onChange={this.handleChange} aria-label="simple tabs example">
            <Tab id="simple-tab-0" label="Today" />
            <Tab id="simple-tab-1" label="Tomorrow" />
            <Tab id="simple-tab-2" label="Upcoming" />
          </Tabs>
        </AppBar>
        <div style={{background:"#FCEEE3", padding:"1rem",textAlign:"center",borderBottom:"2px #000 solid"}}>{this.state.alert.message||"...Loading"}</div>
        <TabPanel key={0} value={this.state.tabValue} index={0} dataToDisplay={dataToDisplay} start={start} end={end} toggleCancelModal={this.toggleCancelModal} toggleEditModal={this.toggleEditModal} />
        <TabPanel key={1} value={this.state.tabValue} index={1} dataToDisplay={dataToDisplay} start={start} end={end} toggleCancelModal={this.toggleCancelModal} toggleEditModal={this.toggleEditModal} />
        <TabPanel key={2} value={this.state.tabValue} index={2} dataToDisplay={dataToDisplay} start={start} end={end} toggleCancelModal={this.toggleCancelModal} toggleEditModal={this.toggleEditModal} />
        {this.renderCancelModal()}
        {this.renderEditModal()}
        {
          this.state.error ? <Snackbar onClose={this.handleErrorClose} open={Boolean(this.state.error)} autoHideDuration={2000} resumeHideDuration={0} >
            <Alert severity="error">
              <span style={{display:"flex",justifyContent:"space-around",alignItems:"center"}}>{this.state.error}<CloseIcon onClick={this.handleErrorClose}/></span>
            </Alert>
          </Snackbar> : ''
        }
        {this.state.isNotifications ?
            <div onClick={()=>{this.props.history.push("/notifications")}}>
              <NotificationsIcon
              style={{
                  fontSize : "2rem",
                  color:"red",
                  position:"absolute",
                  top : "1rem",
                  left : "19.5rem" ,
                  zIndex : 2,
                  cursor : "pointer"
                }
              } />
              <div
              style={{
                color:"white",
                position:"absolute",
                top : "0.25rem",
                left : "21rem" ,
                display : "flex",
                justifyContent : "center",
                alignItems : "center",
                height : "20px",
                width : "20px",
                background : "red",
                borderRadius : "50%",
                zIndex : 2,
                cursor : "pointer"
              }}> ! </div>
            </div>
              :
              <NotificationsIcon

              style={{
                color:"#9ACD32",
                position:"absolute",
                fontSize : "2rem",
                top : "1rem",
                left : "19.5rem" ,
                zIndex : 2 ,
                cursor : "pointer"
              }}
              onClick={()=>{this.props.history.push("/notifications")}}
            />
        }
      </div>
    );
  }

  updateRoute = path => {
    const { history } = this.props;
    history.push(path);
  }

  async componentDidMount() {
    //Schedule Update
    this.reloadData()

    // Sundays & Holidays
    const firstDay = (days.findIndex(x => x===String(firstDayOfMonth).substring(0,3)));

    let nonWorkingDays = [];

    for(let i = 0 ; i < daysInMonths[currMonth] ; i++){
      if( (i + firstDay) % 7 === 0 || (i + firstDay) % 7 === 6)
      nonWorkingDays.push(i+1);
    }

    const firstNextMonthDay = (days.findIndex(x => x===String(firstDayOfNextMonth).substring(0,3)));

    let nextMonthsSatSun = []

    for(let i = 0 ; i < daysInMonths[currMonth] ; i++){
      if( (i + firstNextMonthDay) % 7 === 0 || (i + firstNextMonthDay) % 7 === 6)
      nextMonthsSatSun.push(i+1);
    }

    fetch('https://clientapp.functionallearning.ca/api/session/holidays', {
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => {
      if (res.status >= 400 && res.status <= 500) {
        return
      }
      res.text().then(data => {
        this.setState({
          nonWorkingDays: [ ...nonWorkingDays, ...JSON.parse(data) ] ,
          nextMonthsSatSun
        })
      })
    })

    //Notifications
    fetch(`https://clientapp.functionallearning.ca/api/sessions?client_name=${localStorage.getItem('client_name')}&is_accepted=False`, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => {
      res.text().then(data => {
        data = JSON.parse(data)
        if (data.length > 0) {
          this.setNotifications(true)
        }
      })
    })

    //Alerts
    const res = await fetch(`https://clientapp.functionallearning.ca/api/noticeboard`, {
      headers: { 'Content-Type': 'application/json' }
    })

    const resData = await res.json()
    this.setState({alert:resData[0]})

  }
}

export default App;
