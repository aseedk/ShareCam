import * as React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function SplashComponent({navigation}) {
    const delay = ms => new Promise(res => setTimeout(res, ms));
    React.useEffect(()=>{
        async function  splash(){
            await delay(2000);
            //navigation.navigate("Login");
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        }
        splash().then(() => console.log("App loaded"));
    })
    return(
        <View style={{justifyContent: 'center',flexDirection:'row', alignItems:'center', backgroundColor: '#05A3D9', height:'100%', width:'100%'}}>
            <Text style={styles.logoTextFirst}>Share</Text>
            <Text style={styles.logoTextSecond}>Cam.</Text>
        </View>
    )
}
const styles= StyleSheet.create({
    logoTextFirst:{
        fontSize: 60,
        fontWeight: '800',
        fontStyle:'normal',
        fontFamily:'Roboto',
        color:'#fff'
    },
    logoTextSecond:{
        fontSize: 60,
        fontWeight: '200',
        fontStyle:'italic',
        fontFamily:'Roboto',
        color:'#fff'
    },
})
