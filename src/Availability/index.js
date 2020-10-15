import React, { Component } from 'react';
import { Button, Tooltip } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import Modal from '@material-ui/core/Modal';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();
const nextMonth = currentMonth + 1;
const firstDayOfNextMonth = new Date(`${nextMonth + 1}/1/${currentYear}`)
const nextMonthYear = firstDayOfNextMonth.getFullYear()
const index = firstDayOfNextMonth.getDay();

const dayMapWithYear = [
  31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
]

const totalDays = dayMapWithYear[nextMonth]

const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

const weekArrangement = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const hours = [ 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

const mins = ['00', 15, 30, 45]

const getTimeFormat = a => {
  if (!a) {
    return '-'
  }
  let hoursA = Number(a.hours);
  const minsA = a.mins;
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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientName : localStorage.getItem('client_name'),
      holidays: [],
      mode: 'add_time',
      msgModal: false,
      submitSheet:false,
      submitBtn:false,
      submitting:false,
      copyModal : false,
      copying : false ,
      modal: false,
      dates: {},
      time: {
        start_time: {
          hours: '8',
          mins: '00'
        },
        end_time: {
          hours: '20',
          mins: '00'
        }
      },
      errorText: '',
      submitError : false
    }
  }

  uploadData = async () => {

    const { dates , clientName } = this.state;

    this.setState({copying:false})
    if(Object.keys(dates).length !== dayMapWithYear[nextMonth]){
      this.setState({
        submitError : true ,
        errorText:"Fill information about all the dates before submitting."
      })
    }
    else {

      this.setState({submitting:true})

      let datesBody={};
      Object.keys(dates).forEach((key) => {
        if(dates[key]==="blocked")
          datesBody[key]="X"
        else
          datesBody[key]=`${dates[key].start_time.hours}:${dates[key].start_time.mins};${dates[key].end_time.hours}:${dates[key].end_time.mins}`
      });

      const res = await fetch(`https://clientapp.functionallearning.ca/api/session/availability/`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(
        {
        ...datesBody,
        40: `${clientName}`,
        41: `${currentMonth+1}`})
      })

      if(res.status===200){
        this.setState({submitSheet:true,submitting:false,submitBtn:true})
      }
    }
  }

  clearAll = () => {
    this.setState(prev=>{
      let blockedDates = {};
      prev.holidays.forEach(date => {
        blockedDates[date]="blocked";
      })
      return({dates:blockedDates})
    })
  }

  handleModeChange = (event) => {
    this.setState({
      mode: event.target.value
    })
  }

  openTimeModal = date => {
    this.setState({
      modal: date
    })
  }

  handleTimeChange = (value, type, time) => {
    this.setState(prev => {
      prev.time[time][type] = value
      return prev;
    })
  }

  handleCopying = (date) => {
    if(this.state.holidays.includes(date))
      return

    this.setState(prev => {
      prev.dates[date] = prev.time
      return prev;
    })
  }

  handleTimeSubmit = () => {
    const { time } = this.state

    if(time.start_time.hours === "" || time.start_time.mins === "" || time.start_time.mins === "" || time.end_time.mins === "" ){
      this.setState({
        submitError:true,
        errorText: "Fill all the fields"
      })
      return;
    }

    let start = time.start_time.hours * 60 + Number(time.start_time.mins)
    let end = time.end_time.hours * 60 + Number(time.end_time.mins)

    if (start >= end) {
      this.setState({
        submitError:true,
        errorText: "Start time can't be greater or same as end time"
      })
      return;
    }

    if (start+120 > end) {
      this.setState({
        submitError:true,
        errorText: "The scheduled session has to be of at least 2 hours."
      })
      return;
    }

    this.setState(prev => {
      const date = prev.modal
      prev.dates[date] = prev.time
      prev.copyModal=true
      prev.modal = false
      return prev
    })
  }
  renderModalContent = () => {
    return <div className="time-modal-container">
      <div style={{
        marginBottom: '12px'
      }}>Start Time </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', padding: '0 8px' }}>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          onChange={e => this.handleTimeChange(e.target.value, 'hours', 'start_time')}
          style={{ width: '60px' }}
          value={this.state.time.start_time.hours}
        >
          {hours.map(hour =>
            <MenuItem key={hour} value={hour}>{hour}</MenuItem>
          )}
        </Select>
        <span> : </span>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          onChange={e => this.handleTimeChange(e.target.value, 'mins', 'start_time')}
          style={{ width: '60px' }}
          value={this.state.time.start_time.mins}
        >
          {mins.map(minute =>
            <MenuItem key={minute} value={minute}>{minute}</MenuItem>
          )}
        </Select>
      </div>

      <div style={{
        marginBottom: '12px'
      }}>
        End Time
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px' }}>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          onChange={e => this.handleTimeChange(e.target.value, 'hours', 'end_time')}
          style={{ width: '60px' }}
          value={this.state.time.end_time.hours}
        >
          {hours.map(hour =>
            <MenuItem key={hour} value={hour}>{hour}</MenuItem>
          )}
        </Select>
        <span> : </span>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          onChange={e => this.handleTimeChange(e.target.value, 'mins', 'end_time')}
          style={{ width: '60px' }}
          value={this.state.time.end_time.mins}
        >
          {mins.map(minute =>
            <MenuItem key={minute} value={minute}>{minute}</MenuItem>
          )}
        </Select>
      </div>

      <div style={{
        color: 'indianred',
        fontSize: '12px',
        marginTop: '16px'
      }}>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '16px'
      }}>
        <Button
          onClick={() => this.handleTimeSubmit()}
        >Continue</Button>
      </div>

    </div>
  }

  renderModal = () => {
    return <Modal
      open={Boolean(this.state.modal)}
      onClose={() => this.setState({
        modal: false,
      })}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {this.renderModalContent()}
    </Modal>
  }

  renderCopyModal = () => {
    return <Modal
      open={Boolean(this.state.copyModal)}
      onClose={() => this.setState({
        copyModal: false,
        time: {
          start_time: {
            hours: '8',
            mins: '00'
          },
          end_time: {
            hours: '20',
            mins: '00'
          }
        }
      })}
    >
      <div className="time-modal-container" style={{
        display:"flex",
        flexDirection:"column",
        justifyContent:"space-around"
      }}>
        <p>Do you want wish to copy selected times for the to other dates as well?</p>
        <Button
          onClick={()=>this.setState({
            copyModal: false,
            copying: true
          })}
        variant="outlined" color="primary">Yes</Button>
        <Button
          onClick={()=>this.setState({
            copyModal: false,
            time: {
              start_time: {
                hours: '8',
                mins: '00'
              },
              end_time: {
                hours: '20',
                mins: '00'
              }
            }
          })}
          variant="outlined" color="secondary">No</Button>
      </div>
    </Modal>
  }

  blockTime = date => {

    this.setState(prev => {

    if(prev.dates[date]==="blocked")
      delete prev.dates[date];
    else
      prev.dates[date] = 'blocked'

      return prev
    })
  }

  handleDateClick = date => {
    if(this.state.holidays.includes(date)) {
      return
    }
    if ('add_time' === this.state.mode) {
      this.openTimeModal(date)
    } else {
      this.blockTime(date)
    }
  }

  renderMsgModal = () => {
    return <Modal
      open={this.state.msgModal}
      onClose={() => this.setState({msgModal: false})}
    >
      <div className="time-modal-container" style={{
        display:"flex",
        flexDirection:"column",
        justifyContent:"space-around"
      }}>
        <p>"Deadline for availability submission was on {months[currentMonth]} 15th. You may still submit availability and we will try to accommodate"</p>
        <Button
          onClick={() => {
            this.setState({msgModal: false})
            this.uploadData();
          }}
        variant="outlined" color="primary">Ok</Button>
      </div>
    </Modal>
  }

  render() {
    const title = <div style={{
      textAlign: 'center',
      marginBottom: '40px',
      marginTop: '30px',
      fontSize: '20px',
      fontWeight: 'bold'
    }}>
      {`${months[nextMonth]} ${nextMonthYear}`}
    </div>

    const days = weekArrangement.map(ele => <div key={ele} style={{ textTransform: 'capitalize', width: '14.28%', textAlign: 'center' }}>{ele}</div>)
    let calendar = [];

    for (let i = 1; i <= 42; i++) {
      let date = '';

      if ((i >= index + 1) && (i <= totalDays + index)) {

        let style = {}
        let data ;
        if (this.state.dates[+ (i - index)]) {
          style = {
            borderRadius: '50%',
            border: '1px solid black',
            color: 'white',
            background: 'lightgray'
          }
          data=this.state.dates[+ (i - index)]
        }

        if (this.state.holidays.includes(+ (i - index)) || (this.state.dates[+ (i - index)] && 'blocked' === this.state.dates[+ (i - index)])) {
          style = {
            borderRadius: '50%',
            border: '1px solid black',
            color: 'white',
            background: 'black'
          }
        }

        const unavailableDates = [...this.state.holidays]
        // console.log(data)

        //Selecting Tooltip text

        let tooltipText;
        if(data===undefined)
          tooltipText="Click to fill.";
        else if(data==="blocked")
          tooltipText="No Appointments";
        else
          tooltipText=`Start :- ${getTimeFormat(data.start_time)} End :- ${getTimeFormat(data.end_time)}`;


        date = <div
        onClick={() => {
          if(!this.state.copying)
            this.handleDateClick(i - index)
          else
            this.handleCopying(i-index)
          }
        }
        key={i}
        style={{ marginBottom: '30px', width: '14.28%', display: 'flex',
        justifyContent: 'center' }}
        >
          <Tooltip
            title={tooltipText}
          >
            <div
              disabled={unavailableDates.includes(i - index)}
              key={i}
              style={{
                width: '30px',
                height: '30px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                ...style
              }}>
                {i - index}
            </div>
          </Tooltip>
        </div>
      } else {
        date = <div key={i} style={{ marginBottom: '30px', width: '14.28%' }}>{''}</div>
      }

      calendar.push(date)
    }

    return (
      <div style={{ width: '85%', margin: 'auto' }}>
        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div>
            <strong style={{ marginRight: '2rem' }}>I want to :- </strong>
          </div>
          <div style={{display:"flex" , flexDirection:"column" }}>
            <div style={{fontSize:"1rem"}}>
              Provide availability window <Radio
              checked={this.state.mode === 'add_time'}
              onChange={this.handleModeChange}
              value="add_time"
              name="mode-change"
              disabled={this.state.copying}
              style={{width:"5px",height:"5px"}}
              />
            </div>
            <div>
              Block day(s) <Radio
              checked={this.state.mode === 'block_date'}
              onChange={this.handleModeChange}
              value="block_date"
              name="mode-change"
              disabled={this.state.copying}
              style={{width:"5px",height:"5px"}}
              />
            </div>
          </div>
        </div>
        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
         { this.state.copying && <Button style={{margin:"auto"}} variant="contained"
         onClick={()=>{
          this.setState({
            copying:false,
            time: {
              start_time: {
                hours: '8',
                mins: '00'
              },
              end_time: {
                hours: '20',
                mins: '00'
              }
            }
          })
         }}>Done Copying</Button>}
        </div>

        {title}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', }}>{days}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>{calendar}</div>
        <div style={{ display: 'flex', justifyContent: 'space-around'  }}>
          <Button
            variant="contained"
            onClick={this.clearAll}
          >
            Clear All
        </Button>
        <Button
          variant="contained"
          onClick={()=>{
            if(today.getDate()<=15)
              this.uploadData();
            else
              this.setState({msgModal:true})
          }}
          disabled={today.getDate() > 15 ? true :false}
        >
         {this.state.submitting ? "Submitting..." : "Submit"}
        </Button>


          {this.renderModal()}
          {this.renderCopyModal()}
          {this.renderMsgModal()}
          <Snackbar onClose={()=>{
            this.setState({submitError:false})
          }} open={this.state.submitError} autoHideDuration={2500} resumeHideDuration={0}>
            <Alert severity="error">
            <span style={{display:"flex",justifyContent:"space-around",alignItems:"center"}}>{this.state.errorText}<CloseIcon onClick={()=>{this.setState({submitError:false})}}/></span>
            </Alert>
          </Snackbar>
          <Snackbar
            onClose={()=>{this.setState({submitSheet:false})}}
            open={this.state.submitSheet} autoHideDuration={2000} resumeHideDuration={0}>
            <Alert severity="success">
              <span style={{display:"flex",justifyContent:"space-around",alignItems:"center"}}>Successful Submission.<CloseIcon onClick={()=>{this.setState({submitSheet:false})}}/></span>
            </Alert>
          </Snackbar>
        </div>
        <p style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: 'red',margin:"30px auto 0 auto",textAlign:"center",
          paddingBottom:"20px"
        }}>
          You may submit availability to the 15th of the month. After that, availability submissions will not be accepted.
        </p>
      </div>
    )
  }

  componentDidMount() {

  //Adding Sundays to Holidays

  const firstDay = (weekArrangement.findIndex(x => x===String(firstDayOfNextMonth).substring(0,3)));

  let sundayDates = [];

  for(let i = 0 ; i < dayMapWithYear[nextMonth] ; i++){
    if( (i + firstDay) % 7 === 0)
      sundayDates.push(i+1);
  }

  let blockedDates = {};
  sundayDates.forEach(date => {
    blockedDates[date]="blocked";
  })

  this.setState({
    holidays:sundayDates,
    dates:{...blockedDates}
  })

    fetch('https://clientapp.functionallearning.ca/api/session/holidays', {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        if (res.status >= 400 && res.status <= 500) {
          return
        }
        res.text().then(data => {

          const parsedData = JSON.parse(data);

          this.setState(prev =>{

            const newDates = {...prev.dates}
            parsedData.forEach(date=>{
              newDates[date]="blocked"
            })

            return({
              holidays: [ ...prev.holidays, ...JSON.parse(data) ],
              dates:{ ...newDates }
            })
          })
        })
      })

  }
}

export default App;
