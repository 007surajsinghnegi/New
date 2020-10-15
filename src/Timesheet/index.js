import React, { Component } from 'react';
// import { format } from "date-fns";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import CloseIcon from '@material-ui/icons/Close';
// import { getItemFromPersistentStore } from '../utils/Persist.js';
import Modal from '@material-ui/core/Modal';
import HourglassEmptySharp from '@material-ui/icons/HourglassEmptySharp';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ReportIcon from '@material-ui/icons/Report';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const getTimeFormat = a => {
  if (!a) {
    return '-'
  }
  let hoursA = a.substring(0, 2)
  const minsA = a.substring(3, 5)
  let unit = 'AM'
  if (hoursA >= 12) {
    unit = 'PM'
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

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      selectedMonth: null,
      raiseQueryModal: false,
      error: false,
      months: [] ,
      isRaising: false,
      query:"",
      isAcceptAllDisabled : true,
      clientName : localStorage.getItem('client_name')
    }
  }

  handleChange = (e) => {
    this.setState({
      selectedMonth: e.target.value
    }, () => {
      this.reloadData()
    })
  }

  handleAcceptAll = () => {
    fetch(`https://clientapp.functionallearning.ca/api/session/update?action=AcceptAll&client_name=${this.state.clientName}&message=${this.state.selectedMonth - 1}`, {
      method: 'GET'
    })
      .then(res => {
        if (res.status >= 400 && res.status <= 500) {
          this.setState({
            error: 'Something went wrong'
          })
          return
        }
        this.reloadData()
      })
  }

  toggleRaiseQueryModal = data => this.setState({
    raiseQueryModal: data
  })

  handleQueryValue = data => this.setState({
    query: data.target.value
  })

  renderRaiseQueryModal = () => {
    const clientName = this.state.clientName;
    if (!this.state.raiseQueryModal) {
      return '';
    }

    return <Modal
      open={Boolean(this.state.raiseQueryModal)}
      onClose={() => this.toggleRaiseQueryModal(false)}
    >
      <div className="modalBox">
        <div style={{ padding: '12px' }}>
          <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>Review request</div>
          <TextField
            style={{
              marginBottom: '20px',
              width: '100%'
            }}
            placeholder="Comments..."
            type="text"
            onChange={this.handleQueryValue}
          />
          <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              style={{ marginRight: '20px' }}
              variant="contained"
              onClick={() => this.toggleRaiseQueryModal(false)}
            >
              Exit
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                this.setState({
                  isRaising: true
                })

                if(this.state.query===""){
                  this.setState({
                    error: 'Please enter comment before pressing "Submit"',
                    isRaising: false
                  })
                  return;
                }


                fetch(`https://clientapp.functionallearning.ca/api/session/update?client_name=${clientName}&action=RaiseQuery&start_time=${this.state.raiseQueryModal.start_time}&date=${this.state.raiseQueryModal.date}&end_time=${this.state.raiseQueryModal.end_time}&message=${this.state.query}`, {
                  method: 'GET',
                  headers: { 'Content-Type': 'application/json' }
                })
                  .then(res => {
                    this.setState({
                      isRaising: false
                    })
                    if (res.status >= 400 && res.status <= 500) {
                      this.setState({
                        error: 'Something went wrong'
                      })
                      return
                    }
                    this.setState({query: ""})
                    this.reloadData()
                    this.handleQueryValue({ target: { value: '' } })
                    this.toggleRaiseQueryModal(false);
                  })
              }}
            >
              { this.state.isRaising ? 'Submitting...' : 'Submit' }
            </Button>
          </div>
        </div>
      </div>
    </Modal >
  }

  handleErrorClose = () => {
    this.setState({
      error: false
    })
  }

  render() {
    return <div>
      <div style={{ width: '90%', margin: '20px auto', display: 'flex', justifyContent: 'space-between' , alignItems: "center" , borderBottom: "1px dotted black"}}>
        <Button
          style={{
            height:"3rem",
            width:"10rem"
          }}
          disabled={this.state.isAcceptAllDisabled}
          variant="contained" onClick={this.handleAcceptAll}>
          ACCEPT ALL
        </Button>
        <div style={{
          fontSize:"0.85rem",
          fontWeight:"bold",
          padding:"0rem 3rem",
        }}>
          <p>To confirm agreement with the timesheet, please press “Accept All”.</p>
          <p>To request review of a session, please press the “Review” button to the right of the session and fill out the form.</p>
        </div>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={this.state.selectedMonth || ""}
          onChange={this.handleChange}
          style={{
            minWidth: '8%'
          }}
        >
          {this.state.months.map((ele,index) =>
            <MenuItem key={index} value={ele+1}>{months[ele]}</MenuItem>
          )}
        </Select>
      </div>
      {
        !this.state.data.length ?
          <div className="center margin-top-20 text-gray">
            <div><HourglassEmptySharp /></div>
            <p>No Data</p>
          </div> :
          <div className="tableContainer" >
            <TableContainer component={Paper} >
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center"><strong>Date</strong></TableCell>
                    <TableCell align="center"><strong>Time</strong></TableCell>
                    <TableCell align="center"><strong>Duration</strong></TableCell>
                    <TableCell align="center"><strong>Comments</strong></TableCell>
                    <TableCell align="center"><strong>Type</strong></TableCell>
                    <TableCell align="center"><strong>Review</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.data.map((row, index) => (
                    <TableRow disabled={row.is_disputed}
                      style={{ background: (row.is_disputed || this.state.status ) ? 'lightgray' : '' }}
                      key={index}>
                      <TableCell align="center">{getDateFormat(row.date)}</TableCell>
                      <TableCell align="center">{getTimeFormat(row.start_time)} - {getTimeFormat(row.end_time)}</TableCell>
                      <TableCell align="center">{getDuration(row.end_time,row.start_time)}</TableCell>
                      <TableCell align="center">{row.is_disputed ? 'Under Revision' : 'Attended'}</TableCell>
                      <TableCell align="center">{row.type}</TableCell>
                      <TableCell align="center">
                      {(this.state.status ? false : !row.is_disputed ) ?
                        <Button variant="contained"
                        onClick={() => {this.toggleRaiseQueryModal(row)}} ><ReportIcon/>
                        </Button>
                        :""}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {
              this.state.error ? <Snackbar onClose={this.handleErrorClose} open={Boolean(this.state.error)} autoHideDuration={2000} resumeHideDuration={0}>
                <Alert severity="error">
                  <span style={{display:"flex",justifyContent:"space-around",alignItems:"center"}}>{this.state.error}<CloseIcon onClick={this.handleErrorClose}/></span>
                </Alert>
              </Snackbar> : ''
            }
          </div>
      }
      {this.renderRaiseQueryModal()}
    </div>
  }

  reloadData = () => {

    const { selectedMonth , clientName , months } = this.state;

    fetch(`https://clientapp.functionallearning.ca/api/session/timesheet?&month=${selectedMonth ?(selectedMonth-1) : -1}&client_name=${clientName}`, {
    headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        if (res.status >= 400 && res.status <= 500) {
          this.setState({
            error: 'Something went wrong'
          })
          return
        }
        res.text().then(data => {
          data = JSON.parse(data || "{}")
          const sessions = data.sessions || [];

          let isAcceptAllDisabled = sessions.reduce((acc, ele) => {
            return acc || ele.is_disputed
          }, false)

          let newMonths=[];
          if(months.length===0){
            newMonths = data.archive_months.slice().sort().map(month=>{
              return month-1;
            })
          }

          isAcceptAllDisabled = (isAcceptAllDisabled || data.status)
          this.setState(prev => {
            return({
              selectedMonth: prev.selectedMonth || data.archive_months[0],
              data: sessions,
              months : prev.months.length===0 ? newMonths : prev.months,
              status:data.status,
              isAcceptAllDisabled
            })
          })
        })
      })
  }

  componentDidMount() {
    this.reloadData()
  }
}

export default App;

// is_disputed = true (grey)
