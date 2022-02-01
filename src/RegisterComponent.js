import * as React from 'react';
import {StyleSheet, View, ToastAndroid, ScrollView, TouchableOpacity} from 'react-native';
import {Text, Button, TextInput, HelperText} from 'react-native-paper'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
export default function RegisterComponent({navigation}){
    const [firstName, setFirstName] = React.useState('');
    const [firstNameError, setFirstNameError] = React.useState(false);
    const [lastName, setLastName] = React.useState('');
    const [lastNameError, setLastNameError] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [emailError, setEmailError] = React.useState(false);
    const [phone, setPhone] = React.useState('');
    const [phoneError, setPhoneError] = React.useState(false);
    const [password, setPassword] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [confirmPasswordError, setConfirmPasswordError] = React.useState(false);
    const [referralCode, setReferralCode] = React.useState('');
    const [eye, setEye] = React.useState(true);
    const [cEye, setCEye] = React.useState(true);
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const validateName = (name) => {
        const re = /^[ a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`\-]+$/;
        return re.test(name);
    };
    const validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };
    const validatePhone = (phone) => {
        const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
        return re.test(phone);
    };
    const validatePassword = (password) => {
        const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return re.test(password);
    };
    return(
        <ScrollView style={styles.mainView}>
            <View style={styles.logoView}>
                <Text style={styles.logoTextFirst}>Share</Text>
                <Text style={styles.logoTextSecond}>Cam.</Text>
            </View>
            <View>
                <View style={{flexDirection:'row', justifyContent:'space-evenly', width:'100%'}}>
                    <TextInput
                        label="First Name"
                        placeholder={"First Name"}
                        mode={'outlined'}
                        activeOutlineColor={'#05A3D9'}
                        value={firstName}
                        error={firstNameError}
                        style={{width:'50%'}}
                        onChangeText={async firstName => {
                            setFirstName(firstName);
                            await delay(1000);
                            if (firstName === "") {
                                setFirstNameError(false);
                            } else if (!validateName(firstName)) {
                                setFirstNameError(true);
                            } else {
                                setFirstNameError(false);
                            }
                        }}
                    />
                    <TextInput
                        label="Last Name"
                        placeholder={"Last Name"}
                        mode={'outlined'}
                        activeOutlineColor={'#05A3D9'}
                        value={lastName}
                        error={lastNameError}
                        style={{width:'50%'}}
                        onChangeText={async lastName => {
                            setLastName(lastName);
                            await delay(1000);
                            if (lastName === ""){
                                setLastNameError(false);
                            }else if (!validateName(lastName)){
                                setLastNameError(true);
                            }else {
                                setLastNameError(false);
                            }
                        }}
                    />
                </View>
                <HelperText type="error" visible={firstNameError || lastNameError}>
                    Name syntax is invalid!
                </HelperText>
                <TextInput
                    label="Email Address"
                    placeholder={"Enter Your Email Address"}
                    mode={'outlined'}
                    activeOutlineColor={'#05A3D9'}
                    value={email}
                    error={emailError}
                    onChangeText={async email => {
                        setEmail(email);
                        await delay(1000);
                        if (email === ""){
                            setEmailError(false);
                        }else if(!validateEmail(email)){
                            setEmailError(true);
                        }else {
                            setEmailError(false)
                        }
                    }}
                />
                <HelperText type="error" visible={emailError}>
                    Email Address is invalid
                </HelperText>
                <TextInput
                    label="Phone Number"
                    placeholder={"Enter Your Phone Number"}
                    mode={'outlined'}
                    activeOutlineColor={'#05A3D9'}
                    value={phone}
                    error={phoneError}
                    onChangeText={async phone => {
                        setPhone(phone);
                        await delay(1000);
                        if (phone === ""){
                            setPhoneError(false);
                        }else if(!validatePhone(phone)){
                            setPhoneError(true);
                        }else {
                            setPhoneError(false);
                        }
                    }}
                />
                <HelperText type="error" visible={phoneError}>
                    Phone Number is invalid
                </HelperText>
                <TextInput
                    label={"Password"}
                    placeholder={"Enter Your Password"}
                    mode={"outlined"}
                    activeOutlineColor={'#05A3D9'}
                    value={password}
                    error={passwordError}
                    onChangeText={async password => {
                        setPassword(password);
                        await delay(1000);
                        if (password === ''){
                            setPasswordError(false);
                        }else if(!validatePassword(password)){
                            setPasswordError(true);
                        }else {
                            setPasswordError(false);
                        }
                    }}
                    secureTextEntry={eye}
                    right={<TextInput.Icon name="eye"  onPress={()=>{setEye(!eye)}}/>}
                />
                <HelperText type="error" visible={passwordError}>
                    Password must contain at least 8 letters and 1 digit!
                </HelperText>
                <TextInput
                    label={"Confirm Password"}
                    placeholder={"Enter Your Password Again"}
                    mode={"outlined"}
                    activeOutlineColor={'#05A3D9'}
                    value={confirmPassword}
                    error={confirmPasswordError}
                    onChangeText={async confirmPassword => {
                        setConfirmPassword(confirmPassword);
                        await delay(1000);
                        if (confirmPassword === ""){
                            setConfirmPasswordError(false);
                        }else if(confirmPassword !== password){
                            setConfirmPasswordError(true);
                        }else {
                            setConfirmPasswordError(false);
                        }
                    }}
                    secureTextEntry={cEye}
                    right={<TextInput.Icon name="eye"  onPress={()=>{setCEye(!cEye)}}/>}
                />
                <HelperText type="error" visible={confirmPasswordError}>
                    Password mismatch
                </HelperText>
                <TextInput
                    label="Referral Code"
                    placeholder={"Enter Referral Code"}
                    mode={'outlined'}
                    activeOutlineColor={'#05A3D9'}
                    value={referralCode}
                    onChangeText={referralCode => setReferralCode(referralCode)}
                />
                <HelperText type="error" visible={false}>
                    Referral Code is invalid
                </HelperText>
                <Button
                    mode={'contained'}
                    style={styles.loginButton}
                    onPress={()=>{
                        if (
                            firstName !== "" &&
                            lastName !== "" &&
                            email !== "" &&
                            phone !== "" &&
                            password !== "" &&
                            confirmPassword !== "" &&
                            !firstNameError &&
                            !lastNameError &&
                            !emailError &&
                            !phoneError &&
                            !passwordError &&
                            !confirmPasswordError
                        ){
                            auth()
                                .createUserWithEmailAndPassword(email, password)
                                .then((user) => {
                                    firestore()
                                        .collection('Users')
                                        .doc(user.user.uid)
                                        .set({
                                            name: firstName + " " + lastName,
                                            email: email,
                                            phoneNumber: phone,
                                            referralCode: referralCode
                                        })
                                        .then(async () => {
                                            ToastAndroid.show('User Registered Successfully', ToastAndroid.SHORT);
                                            const userDoc = await firestore().collection('Users').doc(user.user.uid).get();
                                            navigation.navigate("MainMenu", {
                                                user: userDoc
                                            })
                                        });
                                })
                                .catch(error => {
                                    if (error.code === 'auth/email-already-in-use') {
                                        ToastAndroid.show('That email address is already in use!', ToastAndroid.SHORT);
                                    }
                                    if (error.code === 'auth/invalid-email') {
                                        ToastAndroid.show('That email address is invalid!', ToastAndroid.SHORT);
                                    }
                                    if (error.code === 'auth/operation-not-allowed') {
                                        ToastAndroid.show('That email address is invalid!', ToastAndroid.SHORT);
                                    }
                                    if (error.code === 'auth/weak-password') {
                                        ToastAndroid.show('auth/weak-password', ToastAndroid.SHORT);
                                    }
                                    ToastAndroid.show(error);
                                });
                        }else {
                            ToastAndroid.show("Fix Registration Form", ToastAndroid.LONG)
                        }

                    }}
                >
                    <Text style={styles.loginButtonText}>Register</Text>
                </Button>
                <TouchableOpacity style={styles.signUpView} onPress={()=> navigation.navigate('Login')}>
                    <Text>Already have an account? </Text>
                    <Text style={styles.color}>Sign In</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    mainView: {
        contentContainerStyle: 'center',
        padding: 10,
        margin: 10,
    },
    logoView: {
        marginTop: '5%',
        marginBottom:'5%',
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
        justifyContent:'center',
        marginBottom:20
    },
    color:{color:'#05A3D9'}
})
