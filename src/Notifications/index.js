import React, { Component } from 'react';
import { format } from "date-fns"
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Edit from '@material-ui/icons/Edit';
import Accept from '@material-ui/icons/Check';
import IconButton from '@material-ui/core/IconButton';
import HourglassEmptySharp from '@material-ui/icons/HourglassEmptySharp';
import Modal from '@material-ui/core/Modal';
import Tooltip from '@material-ui/core/Tooltip';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const months = ['Jan','Feb','March','April','May','June','July','Aug','Sep','Oct','Nov','Dec']
// const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const hours = ['08', '09', 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
const mins = ['00', 15, 30, 45]

const today = new Date();
// const dateToday = today.getDate();

// const clientName = localStorage.getItem("client_name")

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
  console.log(a);
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
      <div style={{display:"flex",justifyContent:"center" ,color:"#aaa"}}>Request Sent</div>
    </TableCell>
  }
  return <TableCell style={{display:"flex",justifyContent:"center"}} align="right">
    {
      <Tooltip title="Edit">
        <IconButton
          edge="start"
          style={{color:"#FFBF00"}}
          aria-label="open drawer"
          onClick={() => props.toggleEditModal(row)}
        >
          <Edit />
        </IconButton>
      </Tooltip>
    }<Tooltip title="Accept">
      <IconButton
        edge="start"
        style={{color:"green"}}
        aria-label="open drawer"
        onClick={() => props.continueAccept(row)}
      >
        <Accept />
      </IconButton>
    </Tooltip>
  </TableCell>
}



const TabPanel = (props) => {

  const { value, index, dataToDisplay = [] } = props;
  const tableCellStyle = { background:"#666" , color:"#fff" , border:"2px solid #000"}

  if (value === index) {
    if (dataToDisplay.length === 0) {
      return <div className="center margin-top-20 text-gray">
        <div><HourglassEmptySharp /></div>
        <p>No Notifications</p>
      </div>
    }
    return <React.Fragment>
      <div className="tableContainer" >
        <TableContainer component={Paper} >
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell style={tableCellStyle} align="center">Date</TableCell>
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
                  <TableCell align="center">{getDateFormat(row.date, true)}</TableCell>
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
      data: [],
      openEditModal: false,
      error: false ,
      editTime : null
    }
  }

  toggleEditModal = value => {
    this.setState({ openEditModal: value })
  }

  continueEdit = newData => {
    console.log(newData)
    const clientName = localStorage.getItem("client_name");

    const isError = (newData.start_time.hours * 60 + (+newData.start_time.minutes)) > (newData.end_time.hours * 60 + (+newData.end_time.minutes))
    if (isError) {
      this.setState({
        error: "Start time can't be greater than end time"
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

    fetch(`https://clientapp.functionallearning.ca/api/session/update?client_name=${clientName}&action=Edit&start_time=${data.start_time}&date=${data.date}&end_time=${data.end_time}&message=${message}&type=${data.type}&notes=${data.notes}&comments=${newData.comments}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => {
      if (res.status >= 400 && res.status <= 500) {
        return
      }
      this.reloadData()
      this.toggleEditModal(false)
    })
  }

  continueAccept = data => {
    const clientName = localStorage.getItem("client_name");
    fetch(`https://clientapp.functionallearning.ca/api/session/update?client_name=${clientName}&action=Accept&start_time=${data.start_time}&date=${data.date}&end_time=${data.end_time}&type=${data.type}&notes=${data.notes}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => {
      if (res.status >= 400 && res.status <= 500) {
        return
      }
      this.reloadData()
    })
  }

  reloadData() {
    fetch(`https://clientapp.functionallearning.ca/api/sessions?client_name=${localStorage.getItem("client_name")}&is_accepted=False`, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => {
      res.text().then(data => {
        this.setState({
          data: JSON.parse(data),
        })
      })
    })
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

    return <Modal
      open={Boolean(_data)}
      onClose={() => this.toggleEditModal(false)}
    >
      <div className="modalBox">
        <h3 style={{textAlign:"center"}}>Session Modification Preference</h3>
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
            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
            <textarea onChange={handleNoteChange} style={{border:"1px solid black",width:"100%",height:"60px",marginTop:"5px" }} type ="text"></textarea>
            </div>
            </div>
            <div style={{
              marginTop:"3rem",
              color:"#000",
              fontSize:"12px",
              fontWeight:"bold"
            }}>
              <p>Please select a different availability window.</p>
              <p>To cancel a session close this window & select cancel session.</p>
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

  render() {
    const dataToDisplay = this.state.data;

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
        <TabPanel key={1} value={this.state.tabValue} dataToDisplay={dataToDisplay} start={start} end={end} toggleEditModal={this.toggleEditModal} continueAccept={this.continueAccept} />
        {this.renderEditModal()}
        {
          this.state.error ? <Snackbar onClose={this.handleErrorClose} open={Boolean(this.state.error)} autoHideDuration={2000} resumeHideDuration={0} >
            <Alert severity="error">
              <span style={{display:"flex",justifyContent:"space-around",alignItems:"center"}}>{this.state.error}<CloseIcon onClick={this.handleErrorClose}/></span>
            </Alert>
          </Snackbar> : ''
        }
      </div>
    );
  }

  componentDidMount() {
    fetch(`https://clientapp.functionallearning.ca/api/sessions?client_name=${localStorage.getItem("client_name")}&is_accepted=False`, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => {
      res.text().then(data => {
        this.setState({
          data: JSON.parse(data),
        })
      })
    })
  }
}

export default App;
