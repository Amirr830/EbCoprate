import React, { Component } from "react";
import "./styles.css";
export default class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date()
    };
  }

  componentDidMount() {
    this.timerId = setInterval(() => {
      this.setState({
        time: new Date()
      });
    }, 1000);
  }

  componentWillMount() {
    clearInterval(this.timerId);
  }

  render() {
    return (
      <div className="box" >
        <div className="clock">
          <div
            className="hour_hand"
            style={{
              transform: `rotateZ(${this.state.time.getHours() * 30}deg)`
            }}
          />
          <div
            className="min_hand"
            style={{
              transform: `rotateZ(${this.state.time.getMinutes() * 6}deg)`
            }}
          />
          <div
            className="sec_hand"
            style={{
              transform: `rotateZ(${this.state.time.getSeconds() * 6}deg)`
            }}
          />
          <span className="position-absolute top-0 start-50 translate-middle-x">12</span>
          <span className="position-absolute top-50 start-0 translate-middle-y px-2">9</span>
          <span className="position-absolute bottom-0 start-50 translate-middle-x ">6</span>
          <span className="position-absolute top-50 end-0 translate-middle-y px-2">3</span>
        </div>
      </div>

    );
  }
}
