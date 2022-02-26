import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    Image,
    PermissionsAndroid,
    Platform,
    Clipboard,
    Alert, ToastAndroid, Dimensions,
} from 'react-native';
import {Button} from 'react-native-paper'
import axios from "axios";
import {  NodeCameraView } from 'react-native-nodemediaclient';

const MUX_TOKEN_ID = "a798af76-e85a-4357-b2fc-c96d6c5531af"
const MUX_TOKEN_SECRET = "s7BP7+tk0Hr2Yl1rNjYojOd/MVtyI1EsVGXNT31nvCDzF/PpjaePiVqAPRe76zC/aoj1ghl//dH";
import QRCode from 'react-native-qrcode-svg';
import Geolocation from '@react-native-community/geolocation';
let watchID;
import MapboxGL, {Logger} from "@react-native-mapbox-gl/maps";
import {Headline} from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
MapboxGL.setAccessToken('pk.eyJ1IjoiYXNlZWRrIiwiYSI6ImNremF6MTN4YTA4NTEydW50cmxnYmRodnIifQ.CZl7Mza55vy7J8tYdy4eyg');

Logger.setLogCallback(log => {
    const { message } = log;
    return !!(message.match('Request failed due to a permanent error: Canceled') ||
        message.match('Request failed due to a permanent error: Socket Closed'));

});

const App =({navigation, route})=> {
    const user = route.params?.user;
    const [qrCode, setQrCode] = useState(false);
    const [streamKey, setStreamKey] = useState("");
    let [liveId, setLiveId] = useState('test.com');
    let [shareCheck, setShareCheck] = useState(false);
    const [coordinates, setCoordinates] = useState([0, 0]);
    useEffect(() => {
        const requestLocationPermission = async () => {
            if (Platform.OS === 'ios') {
                subscribeLocationLocation();
            } else {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            title: 'Location Access Required',
                            message: 'This App needs to Access your location',
                        },
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        subscribeLocationLocation();
                    } else {
                        console.log("error");
                    }
                } catch (err) {
                    console.warn(err);
                }
            }
        };
        const requestCameraPermission = async ()=>{
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
        }
        requestLocationPermission().then();
        requestCameraPermission().then();
        return () => {
            Geolocation.clearWatch(watchID);
        };
    }, [coordinates]);
    const subscribeLocationLocation = () => {
        watchID = Geolocation.watchPosition(
            (position) => {
                console.log(position);
                const currentLongitude =
                    JSON.stringify(position.coords.longitude);
                const currentLatitude =
                    JSON.stringify(position.coords.latitude);
                setCoordinates([parseFloat(currentLongitude), parseFloat(currentLatitude)])
                if (shareCheck){
                    firestore()
                        .collection('Live')
                        .doc(liveId)
                        .update({
                            endCoordinates: coordinates,
                            historyCoordinates: firestore.FieldValue.arrayUnion({longitude: parseFloat(currentLongitude), latitude: parseFloat(currentLatitude)}),
                            endTime: new Date()
                        })
                        .then(() => {
                            console.log('Live updated!');
                        });
                }
            },
            (error) => {
                console.log(error.message);
            },
            {
                enableHighAccuracy: false,
                maximumAge: 0,
                distanceFilter: 0
            },
        );

    };
    const getOneTimeLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                console.log(position)
                const currentLongitude =
                    JSON.stringify(position.coords.longitude);
                const currentLatitude =
                    JSON.stringify(position.coords.latitude);
                setCoordinates([parseFloat(currentLongitude), parseFloat(currentLatitude)])
            },
            (error) => {
                console.log("ateaf");
                console.log(error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            },
        );
    };
    return (
        <View style={styles.page}>
            <View style={styles.topView}>
                <View style={styles.logoView}>
                    <Text style={styles.logoTextFirst}>Share</Text>
                    <Text style={styles.logoTextSecond}>Cam.</Text>
                </View>
            </View>
            <View style={{flex:2, height:'100%',width:'100%', backgroundColor:'red'}}>
                <NodeCameraView
                    style={[styles.nodeCameraView, {visibility: qrCode ? 'hidden' : 'visible'}]}
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
                </View>

            {qrCode && (
                <View style={{flex: 3}}>
                    <QRCode
                        value={liveId}
                        size={300}
                    />
                </View>
            )}
            {!qrCode && (
                <View style={styles.container}>
                    <MapboxGL.MapView
                        style={styles.map}
                    >
                        <MapboxGL.Camera
                            zoomLevel={16}
                            centerCoordinate={coordinates}
                        />
                        <MapboxGL.MarkerView
                            id={"marker"}
                            coordinate={coordinates}>
                            <View>
                                <Image
                                    source={require("./location.jpg")}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 50,
                                        backgroundColor: "red",
                                        resizeMode: "cover",
                                        borderColor: "#05A3D9",
                                        borderWidth: 3,
                                    }}
                                />
                            </View>
                        </MapboxGL.MarkerView>
                    </MapboxGL.MapView>
                </View>
            )}

            <View style={{flex:1, flexDirection:'row'}}>
                <Button
                    mode={'contained'}
                    style={styles.loginButton}
                    onPress={async () => {
                        //console.log(user.id);
                        //getOneTimeLocation();
                        const mux_instance = axios.create({
                            baseURL: 'https://api.mux.com',
                            method: 'post',
                            headers: {'Content-Type': 'application/json'},
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
                        /*console.log(mux_response.data.data.stream_key);
                        console.log(mux_response.data.data);*/
                        setStreamKey(mux_response.data.data.stream_key);
                        firestore()
                            .collection('Live')
                            .add({
                                sender: user.id.toString(),
                                receivers: [],
                                startCoordinates: coordinates,
                                startTime: new Date(),
                                historyCoordinates: [{longitude: coordinates[0], latitude: coordinates[1]}],
                                endCoordinates: coordinates,
                                playbackId: mux_response.data.data.playback_ids[0],
                                endTime: new Date()
                            })
                            .then((doc) => {
                                console.log(doc.id);
                                setLiveId(doc.id);
                                setShareCheck(true);
                                this.vb.start();
                            })
                            .catch(e => console.log(e))
                        ;
                    }}
                >
                    <Text style={styles.loginButtonText}>Share Live</Text>
                </Button>
                <Button mode={'contained'}
                        style={styles.loginButton}
                        onPress={() => {
                            setQrCode(!qrCode);
                        }}
                >
                    <Text>QR</Text>
                </Button>

                <Button
                    mode={'contained'}
                    style={styles.loginButton}
                    onPress = {() => {
                        // Clipboard.setString(liveId);
                        getOneTimeLocation();
                    }}

                >
                    <Text>Copy</Text>
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    nodeCameraView: {
        height:'100%',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    mainView: {
        justifyContent: 'center',
        backgroundColor:'#fff'
    },
    topView: {
        padding: 10,
        flex: 1
    },
    logoView: {
        marginTop: '1%',
        marginBottom:'1%',
        flexDirection: 'row',
        justifyContent: 'center'},
    logoTextFirst:{
        fontSize: 72,
        fontWeight: '800',
        fontStyle:'normal',
        fontFamily:'Roboto',
        color:'#05A3D9'
    },
    logoTextSecond:{
        fontSize: 72,
        fontWeight: '200',
        fontStyle:'italic',
        fontFamily:'Roboto',
        color:'#05A3D9'
    },
    page: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    },
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: 'blue',
        flex: 1.5
    },
    map: {
        width: '100%',
        height: '100%'
    },
    markerContainer: {
        alignItems: "center",
        width: 60,
        backgroundColor: "transparent",
        height: 70,
    },
    textContainer: {
        backgroundColor: "white",
        borderRadius: 10,
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    text: {
        textAlign: "center",
        paddingHorizontal: 5,
        flex: 1,
    },
    loginButton:{
        padding: 10,
        margin: 10,
        backgroundColor:'#05A3D9',
        height: 70
    },
    loginButtonText:{
        color:'#fff',
        fontSize:18,
        fontWeight:'bold'
    },
});

export default App;
