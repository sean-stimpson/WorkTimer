import * as React from "react";
import {
  Picker,
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  Vibration,
  KeyboardAvoidingView,
} from "react-native";
import Constants from "expo-constants";

const ONE_SECOND_IN_MS = 1000;

const PATTERN = [
  1 * ONE_SECOND_IN_MS,
  2 * ONE_SECOND_IN_MS,
  3 * ONE_SECOND_IN_MS,
];

const Timer = (props) => {
  const totalTime = props.time;
  const mins = String(Math.floor(props.time / 60)).padStart(2, "0");
  const secs = String(totalTime % 60).padStart(2, "0");
  return (
    <Text style={{ fontSize: 100, textAlign: "center" }}>
      {mins}:{secs}
    </Text>
  );
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timerSet: false,
      onWorkTime: true,
      timerStopped: true,
      workTimeStarted: false,
      breakTimeStarted: false,
      seconds: 0,
      minutes: 0,
      workTimeSet: 25*60,
      breakTimeSet: 5*60+1,
      currBreakTime: 5,
      currWorkTime: 5,
    };
  }
  vibrate() {
    console.log(!this.state.timerStopped);
    console.log(this.state.timerStarted);
    console.log(this.state.currBreakTime);
    console.log(this.state.currWorkTime);
    if (
      !this.state.timerStopped &&
      this.state.timerStarted &&
      this.state.currWorkTime === 2 &&
      this.state.currBreakTime === this.state.breakTimeSet
    ) {
      console.log("vibrating");
      Vibration.vibrate(PATTERN);
    }
  }
  countDown() {
    this.vibrate();
    // console.log(this.state.onWorkTime);
    if (
      // Counting down work time
      this.state.currWorkTime > 0 &&
      this.state.timerStarted &&
      !this.state.timerStopped
    ) {
      this.setState((state) => ({
        currWorkTime: state.currWorkTime - 1,
      }));
    } else if (
      // Counting down break time
      this.state.timerStarted &&
      this.state.currBreakTime > 0 &&
      !this.state.timerStopped
    ) {
      // alert('BreakTimeStarted');
      console.log("settingbreak time");
      this.setState((state) => ({
        breakTimeStarted: true,
        onWorkTime: false,
        currBreakTime: state.currBreakTime - 1,
      }));
    } else if (
      //Both times at 0 resetting times.
      this.state.timerStarted &&
      this.state.currBreakTime === 0 &&
      this.state.currWorkTime === 0 &&
      !this.state.timerStopped
    ) {
      this.setState((state) => ({
        onWorkTime: true,
        currWorkTime: this.state.workTimeSet,
        currBreakTime: this.state.breakTimeSet,
      }));
    }
    if (
      this.state.currBreakTime === 2 &&
      !this.state.timerStopped &&
      this.state.timerStarted
    ) {
      Vibration.vibrate(PATTERN);
    }
  }
  setWorkTimer(workTime) {
    this.setState((state) => ({
      workTimeSet: workTime * 60,
      currWorkTime: workTime * 60,
    }));
  }
  setBreakTimer(breakTime) {
    this.setState((state) => ({
      breakTimeSet: breakTime * 60 + 1,
      currBreakTime: breakTime * 60 + 1, //Compensate for state difference between timers.
    }));
  }

  startTimer(e) {
    this.setState((state) => ({
      timerStarted: true,
      timerStopped: false,
    }));
  }
  stopTimer(e) {
    this.setState((state) => ({
      timerStarted: false,
      timerStopped: true,
    }));
  }
  resetTimer(e) {
    this.setState((state) => ({
      onWorkTime: true,
      timerStarted: false,
      timerStopped: true,
      currBreakTime: this.state.breakTimeSet,
      currWorkTime: this.state.workTimeSet,
    }));
  }
  componentDidMount() {
    this.interval = setInterval(() => this.countDown(), 1000);
  }

  handleSetTime(work, breakTime, e) {
    e.preventDefault();
    this.setState((state) => ({
      currBreakTime: breakTime,
      currWorkTime: work,
      breakTimeSet: breakTime,
      workTimeSet: work,
    }));
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ borderBottomWidth: 2 }}>
          <Text style={{ fontSize: 25, textAlign: "center" }}>
            Work Time: {this.state.workTimeSet / 60} minutes
          </Text>
          <Text style={{ fontSize: 25, textAlign: "center" }}>
            Break Time: {(this.state.breakTimeSet-1) / 60 } minutes
          </Text>
        </View>
        {this.state.onWorkTime ? (
          <View>
            <Text style={{ fontSize: 25, textAlign: "center" }}>
              On Work Time
            </Text>
            <Timer time={this.state.currWorkTime} />
          </View>
        ) : (
          <View>
            <Text style={{ fontSize: 25, textAlign: "center" }}>
              On Break Time
            </Text>
            <Timer time={this.state.currBreakTime}></Timer>
          </View>
        )}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignSelf: "center",
          }}
        >
          <View style={{ width: 60, margin: 5 }}>
            <Button
              style={{ width: "" }}
              onPress={(e) => this.startTimer(e)}
              title="Start"
            />
          </View>
          <View style={{ width: 60, margin: 5 }}>
            <Button onPress={(e) => this.stopTimer(e)} title="Stop" />
          </View>
          <View style={{ width: 60, margin: 5 }}>
            <Button onPress={(e) => this.resetTimer(e)} title="Reset" />
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignSelf: "center",
          }}
        >
         <View style={{ width: 60, margin: 5 }}>
          <Button style={{margin:5}}
            onPress={(e) => this.handleSetTime(5, 2, e)}
            title="Set 5/2"
          ></Button>
          </View>
          <View style={{ width: 60, margin: 5 }}>
          <Button style={{margin:5, width: 60}}
            onPress={(e) => this.handleSetTime(10, 5, e)}
            title="Set 10/5"
          ></Button>
          </View>
        </View>
        <Text style={{ fontSize: 25, textAlign: "center" }}>
          Set your own times
        </Text>
        <Text style={{ textAlign: "center" }}>Set values in Minutes Below</Text>
        <KeyboardAvoidingView keyboardVerticalOffset={40}>
          <TextInput
            style={{
              fontSize: 25,
              alignSelf: "center",
              textAlign: "center",
              width: 120,
            }}
            keyboardType="number-pad"
            onChangeText={(e) => this.setWorkTimer(e)}
            placeholder={"WorkTime"}
          ></TextInput>
          <TextInput
            style={{
              fontSize: 25,
              alignSelf: "center",
              textAlign: "center",
              width: 120,
            }}
            keyboardType="number-pad"
            onChangeText={(e) => this.setBreakTimer(e)}
            placeholder={"BreakTime"}
          ></TextInput>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
        paddingBottom:50 , 

    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
    padding: 8,
  }
});
