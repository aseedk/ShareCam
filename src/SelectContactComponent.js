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
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

const SelectContactComponent = ({route, navigation}) =>{
    const link = route.params?.link;
    const [myContacts, setMyContacts] = useState([]);
    const [selectedContactsId, setSelectedContactsId] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [contacts, setContacts] = useState([]);
    useEffect(() => {
        async function fetchData() {
            let tempMyContacts = [];
            let tempContacts = [];
            await firestore().collection('Users').doc(auth().currentUser.uid).get().then(r => {
                if (r.data().contacts !== undefined) {
                    tempMyContacts = r.data().contacts;
                    setMyContacts(tempMyContacts);
                } else {
                    setMyContacts([]);
                }
            });
            for (let contact of tempMyContacts) {
                await firestore().collection('Users').doc(contact).get().then(r => {
                    if (r.data() !== undefined) {
                        tempContacts.push(r.data());
                    }
                });
            }
            setContacts(tempContacts);
        }
        fetchData().then(r => console.log(r));
    }, []);
    return(
        <View style={styles.container}>
            {contacts.map((val, ind) => {
                    return(
                        <View key={ind} style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Image source={{uri: 'https://www.trustedclothes.com/blog/wp-content/uploads/2019/02/anonymous-person-221117.jpg'}}
                                       style={{width: 50, height: 50, borderRadius: 25}}/>
                                <Text style={{marginLeft: 10}}>{val.name}</Text>
                            </View>
                            <Button onPress={()=> {
                                setSelectedContactsId([...selectedContactsId, myContacts[ind]]);
                                setSelectedContacts([...selectedContacts, contacts[ind]]);
                            }}>
                                Select
                            </Button>
                        </View>
                    )
            })}
            {selectedContacts.map((val, ind) => {
                return(
                    <View key={ind} style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={{uri: 'https://www.trustedclothes.com/blog/wp-content/uploads/2019/02/anonymous-person-221117.jpg'}}
                                   style={{width: 50, height: 50, borderRadius: 25}}/>
                            <Text style={{marginLeft: 10}}>{val.name}</Text>
                        </View>
                        <Button onPress={()=> {
                            setSelectedContactsId(selectedContactsId.filter(val => val !== myContacts[ind]));
                            setSelectedContacts(selectedContacts.filter(val => val !== contacts[ind]));
                        }}>
                            Remove
                        </Button>
                    </View>
                )
            })}
            <Button onPress={async () => {
                await firestore().collection('Users').doc(auth().currentUser.uid).update({
                    liveStream: firestore.FieldValue.arrayUnion(link)
                });
                for (let contactsId of selectedContactsId) {
                    await firestore().collection('Users').doc(contactsId).update({
                        liveStream: firestore.FieldValue.arrayUnion(link)
                    });
                }
                navigation.navigate('LiveStream', {
                    link: link,
                });
            }}>
                Next
            </Button>
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
export default SelectContactComponent;
