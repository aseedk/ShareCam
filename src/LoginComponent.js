import * as React from 'react';
import { StyleSheet, View,ScrollView, ToastAndroid, TouchableOpacity} from 'react-native';
import {Text, Button, TextInput, HelperText} from 'react-native-paper'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function LoginComponent({navigation}){
    const [email, setEmail] = React.useState('test@viewer.com');
    const [emailError, setEmailError] = React.useState(false);
    const [password, setPassword] = React.useState('viewer1234');
    const [passwordError, setPasswordError] = React.useState(false);
    const [eye, setEye] = React.useState(true);

    return(
        <View style={styles.mainView}>
            <View style={styles.logoView}>
                <Text style={styles.logoTextFirst}>Share</Text>
                <Text style={styles.logoTextSecond}>Cam.</Text>
            </View>
            <ScrollView>
                <TextInput
                    label="Email or Phone Number"
                    placeholder={"Enter Your Email or Phone Number"}
                    mode={'outlined'}
                    activeOutlineColor={'#05A3D9'}
                    value={email}
                    error={emailError}
                    onChangeText={email => setEmail(email)}
                />
                <HelperText type="error" visible={emailError}>
                    Email address is invalid!
                </HelperText>
                <TextInput
                    label={"Password"}
                    placeholder={"Enter Your Password"}
                    mode={"outlined"}
                    activeOutlineColor={'#05A3D9'}
                    value={password}
                    onChangeText={password => setPassword(password)}
                    secureTextEntry={eye}
                    error={passwordError}
                    right={<TextInput.Icon name="eye"  onPress={()=>{setEye(!eye)}}/>}
                />
                <HelperText type="error" visible={passwordError}>
                    Password Syntax is invalid
                </HelperText>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                <Button
                    mode={'contained'}
                    style={styles.loginButton}
                    onPress={()=>{
                        if (
                            email !== "" && password !== "" &&
                            !emailError && !passwordError
                        ){
                            auth().signInWithEmailAndPassword(email, password)
                                .then((user) => {
                                    firestore().collection('Users').doc(user.user.uid).get()
                                        .then((userDoc)=>{
                                            navigation.navigate("MainMenu", {
                                                user: userDoc
                                            })
                                            ToastAndroid.show('User account signed in!', ToastAndroid.SHORT);
                                        });
                                })
                                .catch(function(error) {
                                    const errorCode = error.code;
                                    const errorMessage = error.message;
                                    if (errorCode === 'auth/wrong-password') {
                                        ToastAndroid.show('Incorrect password', ToastAndroid.LONG);
                                    } else if(errorCode === 'auth/user-not-found') {
                                        ToastAndroid.show('User account doesnt exists', ToastAndroid.LONG);
                                    } else if (errorCode === 'auth/invalid-email') {
                                        ToastAndroid.show('That email address is invalid!', ToastAndroid.LONG);
                                    } else if (errorCode === 'auth/user-disabled') {
                                        ToastAndroid.show('That user account is disabled', ToastAndroid.LONG);
                                    }
                                    else {
                                        alert(errorMessage);
                                    }
                                    console.log(error);
                                });
                        } else {
                            ToastAndroid.show('Check login fields', ToastAndroid.SHORT);
                        }

                    }}
                >
                    <Text style={styles.loginButtonText}>Login</Text>
                </Button>
                <TouchableOpacity style={styles.signUpView} onPress={()=> navigation.navigate('Register')}>
                    <Text>Dont have an account? </Text>
                    <Text style={styles.color}>Sign Up</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    mainView: {
        justifyContent: 'center',
        padding: 10,
        margin: 10,
    },
    logoView: {
        marginTop: '25%',
        marginBottom:'25%',
        flexDirection: 'row',
        justifyContent: 'center'},
    logoTextFirst:{
        fontSize: 60,
        fontWeight: '800',
        fontStyle:'normal',
        fontFamily:'Roboto',
        color:'#05A3D9'
    },
    logoTextSecond:{
        fontSize: 60,
        fontWeight: '200',
        fontStyle:'italic',
        fontFamily:'Roboto',
        color:'#05A3D9'
    },
    forgotPasswordText:{
        textAlign: 'right',
        fontWeight:'bold',
        marginBottom:20,
        color:'#05A3D9'
    },
    loginButton:{
        padding: 10,
        backgroundColor:'#05A3D9'
    },
    loginButtonText:{
        color:'#fff',
        fontSize:18,
        fontWeight:'bold'
    },
    signUpView:{
        flexDirection:'row',
        marginTop:40,
        justifyContent:'center'
    },
    color:{color:'#05A3D9'}
})
