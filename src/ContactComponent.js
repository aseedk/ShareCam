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
    Alert, ToastAndroid, ScrollView,
} from 'react-native';
import {Headline, TextInput} from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

const ContactComponent = () => {
    const [contacts, setContacts] = useState([]);
    const [myContacts, setMyContacts] = useState([]);
    const [search, setSearch] = useState('');
    useEffect(() => {
        async function fetchData (){
            await firestore().collection('Users').get().then(r => setContacts(r.docs));
            await firestore().collection('Users').doc(auth().currentUser.uid).get().then(r => {
                if (r.data().contacts !== undefined) {
                    setMyContacts(r.data().contacts)
                } else {
                    setMyContacts([])
                }
            });
        }
        fetchData();
    }, [contacts, myContacts]);
    return(
        <View style={styles.container}>
            <View style={{justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1}}>
                <TextInput
                    label="Search"
                    placeholder={"Search Contact"}
                    mode={'outlined'}
                    activeOutlineColor={'#05A3D9'}
                    value={search}
                    style={{width:'95%'}}
                    onChangeText={setSearch}
                />
            </View>
            <View>
                <Headline style={{textAlign: 'center', marginBottom: 10}}>Add Contacts</Headline>
                <ScrollView>
                    {contacts.map((val, ind) => {
                        if(val.data().name.toLowerCase().includes(search.toLowerCase()) && val.id !== auth().currentUser.uid && !myContacts.includes(val.id)){
                            return(
                                <View key={ind} style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Image source={{uri: 'https://www.trustedclothes.com/blog/wp-content/uploads/2019/02/anonymous-person-221117.jpg'}}
                                               style={{width: 50, height: 50, borderRadius: 25}}/>
                                        <Text style={{marginLeft: 10}}>{val.data().name}</Text>
                                    </View>
                                    <Button title={'Add'} onPress={() => {
                                        console.log(val);
                                        Alert.alert(
                                            'Add Contact',
                                            'Are you sure you want to add this contact?',
                                            [
                                                {
                                                    text: 'Cancel',
                                                    onPress: () => console.log('Cancel Pressed'),
                                                    style: 'cancel',
                                                },
                                                {text: 'OK', onPress: () => {
                                                        firestore().collection('Users').doc(val.id).update({
                                                            contacts: firestore.FieldValue.arrayUnion(auth().currentUser.uid)
                                                        }).then(() => {
                                                            firestore().collection('Users').doc(auth().currentUser.uid).update({
                                                                contacts: firestore.FieldValue.arrayUnion(val.id)
                                                            }).then(() => {
                                                                ToastAndroid.show('Contact Added', ToastAndroid.SHORT);
                                                            })
                                                        })
                                                    }},
                                            ],
                                            {cancelable: false},
                                        );
                                    }}/>
                                </View>
                            )
                        }
                    })}
                </ScrollView>

            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
        height: '100%',
    },
});
export default ContactComponent;
