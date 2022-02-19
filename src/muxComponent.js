import React, {useState, useEffect} from 'react';
import axios from "axios";
import {
    SafeAreaView,
    View,
    Text,
    Button,
    StyleSheet,
    Image,
    PermissionsAndroid,
    Platform,
    Alert, ToastAndroid,
} from 'react-native';
import {  NodeCameraView } from 'react-native-nodemediaclient';

const MUX_TOKEN_ID = "a798af76-e85a-4357-b2fc-c96d6c5531af"
const MUX_TOKEN_SECRET = "s7BP7+tk0Hr2Yl1rNjYojOd/MVtyI1EsVGXNT31nvCDzF/PpjaePiVqAPRe76zC/aoj1ghl//dH";

const styles = StyleSheet.create({
    nodeCameraView: {
        height:'100%',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});
const MuxComponent = () => {
    const [stream, setStream] = useState(false);
    const [streamKey, setStreamKey] = useState("");
  return(
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
          <Text>TEST</Text>
          <Button title={'Test'} onPress={async () => {
              try {
                  const granted = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.CAMERA,PermissionsAndroid.PERMISSIONS.RECORD_AUDIO],
                      {
                          title: "Cool Photo App Camera And Microphone Permission",
                          message:
                              "Cool Photo App needs access to your camera " +
                              "so you can take awesome pictures.",
                          buttonNeutral: "Ask Me Later",
                          buttonNegative: "Cancel",
                          buttonPositive: "OK"
                      }
                  );
                  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                      console.log("You can use the camera");
                  } else {
                      console.log("Camera permission denied");
                  }
              } catch (err) {
                  console.warn(err);
              }
              const mux_instance = axios.create({
                  baseURL: 'https://api.mux.com',
                  method: 'post',
                  headers: { 'Content-Type': 'application/json' },
                  auth: {
                      username: MUX_TOKEN_ID,
                      password: MUX_TOKEN_SECRET
                  }
              });
              //console.log(mux_instance);
              const mux_response = await mux_instance.post("/video/v1/live-streams", {
                  "playback_policy": ["public"],
                  "new_asset_settings": {
                      "playback_policy": ["public"]
                  }
              });
              console.log(mux_response.data.data.stream_key);
              console.log(mux_response.data.data.playback_ids[0]);
              setStreamKey(mux_response.data.data.stream_key);
              setStream(true);
          }

          }/>
          {stream && (
              <View>
                  <NodeCameraView
                      style={styles.nodeCameraView}
                      ref={(vb) => { this.vb = vb }}
                      outputUrl = {"rtmps://global-live.mux.com:443/app/" + streamKey}
                      camera={{ cameraId: 0, cameraFrontMirror: true }}
                      audio={{ bitrate: 32000, profile: 1, samplerate: 44100 }}
                      video={{ preset: 12, bitrate: 400000, profile: 1, fps: 15, videoFrontMirror: false }}
                      autopreview={true}
                      onStatus={(code, msg) => {
                          console.log("onStatus=" + code + " msg=" + msg);
                      }}
                  />
                  <Button title={'Start'} onPress={() => {
                      this.vb.start();
                  }}/>
                  <Button title={'Stop'} onPress={() => {
                      this.vb.stop();
                  }}/>
              </View>
          )}
      </View>
  )
}
export default MuxComponent;
