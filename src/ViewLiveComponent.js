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
    Alert, ToastAndroid,
} from 'react-native';
import {Button} from 'react-native-paper'
import {NodeCameraView, NodePlayerView} from 'react-native-nodemediaclient';
import MapboxGL from "@react-native-mapbox-gl/maps";
import axios from "axios";
import firestore from "@react-native-firebase/firestore";

const ViewLiveComponent = ({route}) =>{
    const link = route.params.link;
    const [url, setUrl] = useState("");
    const [data, setData] = useState({});
    const [coordinates, setCoordinates] = useState([0, 0]);
    useEffect(()=>{
        async function fetchData() {
            await firestore().collection('Live').doc(link).onSnapshot(doc=>{
                setUrl("https://stream.mux.com/" + doc.data()?.playbackId?.id + ".m3u8");
                setData(doc.data());
                setCoordinates(doc.data().endCoordinates);
            })
        }
        //console.log(url);
        fetchData();
    },[])
    return(
        <View style={styles.page}>
            <View style={styles.topView}>
                <View style={styles.logoView}>
                    <Text style={styles.logoTextFirst}>Share</Text>
                    <Text style={styles.logoTextSecond}>Cam.</Text>
                </View>
            </View>
            <View style={{flex:2, height:'100%',width:'100%', backgroundColor:'red'}}>
                <NodePlayerView
                    style={styles.nodeCameraView}
                    inputUrl={url}
                    scaleMode={"ScaleAspectFit"}
                    bufferTime={300}
                    maxBufferTime={1000}
                    autoplay={true}
                />
            </View>
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
        </View>
    )
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
export default ViewLiveComponent;
