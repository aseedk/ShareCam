import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    Image,
    PermissionsAndroid,
    Platform,
    Alert, ToastAndroid,
} from 'react-native';
import {Button} from 'react-native-paper'
import Geolocation from '@react-native-community/geolocation';
let watchID;
import MapboxGL, {Logger} from "@react-native-mapbox-gl/maps";
import {Headline} from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
MapboxGL.setAccessToken('pk.eyJ1IjoiYXNlZWRrIiwiYSI6ImNreXdkZzZlaTAxZnEydXF2NGJpZWxxbWsifQ.AaZxXeDyG8DX55ajg8Nwog');

Logger.setLogCallback(log => {
    const { message } = log;
    return !!(message.match('Request failed due to a permanent error: Canceled') ||
        message.match('Request failed due to a permanent error: Socket Closed'));

});

const App =({navigation, route})=> {
    const user = route.params?.user;
    let [liveId, setLiveId] = useState('');
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
        requestLocationPermission().then();
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
                    console.log(liveId);
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
                console.log(error.message);
            },
            {
                enableHighAccuracy: false,
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
            <View style={styles.container}>
                <MapboxGL.MapView style={styles.map}>
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
            <View style={{flex:2}}>
                <Button
                    mode={'contained'}
                    style={styles.loginButton}
                    onPress={()=>{
                        console.log(user.id);
                        //getOneTimeLocation();
                        firestore()
                            .collection('Live')
                            .add({
                                sender: user.id.toString(),
                                receivers: ['y56J4Lmp61MUpnhJ6SUAIZ7NPvt2'],
                                startCoordinates: coordinates,
                                startTime: new Date(),
                                historyCoordinates: [{longitude: coordinates[0], latitude: coordinates[1]}],
                                endCoordinates: coordinates,
                                endTime: new Date()
                            })
                            .then((doc) => {
                                console.log(doc.id);
                                setLiveId(doc.id);
                                setShareCheck(true);
                            })
                            .catch(e => console.log(e))
                        ;
                    }}
                >
                    <Text style={styles.loginButtonText}>Share Live</Text>
                </Button>
            </View>
            <View style={{flex: 1, flexDirection:'row'}}>
                <Button
                    mode={'contained'}
                    style={styles.loginButton}
                >
                    <Text style={styles.loginButtonText}>Health Care</Text>
                </Button>
                <Button
                    mode={'contained'}
                    style={styles.loginButton}
                >
                    <Text style={styles.loginButtonText}>Security</Text>
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
        flex: 2
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
