import React, { Component } from 'react';
import { XAxis, YAxis, Tooltip, Legend, CartesianGrid, Bar, BarChart, Line, LineChart } from 'recharts';

const blah = [
      {name: 'Page A', amt: 2400},
      {name: 'Page B', amt: 2210},
      {name: 'Page C', amt: 2290},
      {name: 'Page D', amt: 2000},
      {name: 'Page E', amt: 2181},
      {name: 'Page F', amt: 2500},
      {name: 'Page G', amt: 2100},
];

class Chart extends Component {

    constructor(props) {
        super(props)
        this.state = {
            success: undefined,
            rawData: {},
            data: []
        }
    }

    componentDidMount() {
        fetch("http://localhost:5000/data")
          .then(res => res.json())
          .then(
            (result) => {
              this.setState({
                success: true,
                rawData: result,
                data: []
              });
            },
            (error) => {
              this.setState({
                success: false
              });
            }
          )
      }

    render () {
      if(this.state.rawData) { // If the API has responded
        for (const timestamp in this.state.rawData) { // We will need every unique timestamp from the response.
          let obj = {} 
          obj.timestamp = timestamp // Set our "timestamp" variable to one of X unique timestamps.
          for (const servername in this.state.rawData[timestamp]) { // Grab the counts of each server 
            // Insert into the objects list the name of the server and it's count
            obj[servername] = this.state.rawData[timestamp][servername]
          }
          // After iteration, push this transformed timestamp to the state
          this.state.data.push(obj)
        }

        var lines = []
        var seen = []

        for (let server of this.state.data) {
          for (let [key, value] of Object.entries(server)) {
            if(key === "timestamp") {
              continue
            }
            if(seen.includes(key)) {
              continue
            }
            lines.push(<Line type="monotone" dataKey={key} stroke="#8884d8"/>)
            seen.push(key)
          }
        }
      }

      if (this.state.success === undefined) {
        return (<h1>Loading...</h1>)
      } else if (this.state.success === false) {
        return (<h1>Failed to reach Backend</h1>)
      } 
      return (
          <LineChart width={1920} height={820} data={this.state.data}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="timestamp"/>
              <YAxis/>
              <Tooltip/>
              <Legend />
              {lines}
          </LineChart>
      )
    }
}

export default Chart;