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
import {Button, TextInput} from 'react-native-paper'

const ShareLinkComponent = ({navigation})=>{
    const [link, setLink] = useState('');
    return(
        <View style={styles.container}>
            <TextInput
                label="Live Id"
                placeholder={"Enter Live Id"}
                mode={'outlined'}
                activeOutlineColor={'#05A3D9'}
                value={link}
                style={{width:'95%'}}
                onChangeText={setLink}
            />
            <Button
                mode={'contained'}
                style={styles.loginButton}
                onPress={()=>{
                    navigation.navigate(
                        'QRCodeScanner'
                    )
                }}
            >
                <Text>Scan QR</Text>
            </Button>
            <Button
                mode={'contained'}
                style={styles.loginButton}
                onPress={()=> navigation.navigate('SelectContact', {
                    link: link
                })}
            >
                <Text>Share Live</Text>
            </Button>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
        justifyContent:'center',
        alignItems:'center',
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
export default ShareLinkComponent;
