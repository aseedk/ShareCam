import * as React from 'react';
import {StyleSheet, View, Image, ScrollView, TouchableOpacity} from 'react-native';
import {Text, Card, Paragraph, Avatar} from 'react-native-paper'

export default function MainMenuComponent({route, navigation}){
    let user = route.params?.user;
    return(
        <View style={styles.mainView}>
            <View style={styles.topView}>
                <View style={styles.logoView}>
                    <Text style={styles.logoTextFirst}>Share</Text>
                    <Text style={styles.logoTextSecond}>Cam.</Text>
                </View>
                <View style={styles.profileDisplay}>
                    <Image
                        source={{
                            uri: 'https://www.trustedclothes.com/blog/wp-content/uploads/2019/02/anonymous-person-221117.jpg'
                        }}
                        style={styles.profileImage}
                    />
                    <View style={styles.profileText}>
                        <Text>Good Afternoon</Text>
                        <Text>{user.get('name')}</Text>
                    </View>
                </View>
            </View>
            <ScrollView style={styles.dashboard}>
                <View style={styles.cardRow}>
                    <TouchableOpacity style={styles.card}
                                      onPress={()=> navigation.navigate('Contact',{
                                          user: user
                                      })}
                    >
                        <Card>
                            <Card.Title
                                left={(props) =>
                                    <Avatar.Icon {...props}
                                                 color={'#05A3D9'}
                                                 size={75}
                                                 style={styles.cardBackground}
                                                 icon="account" />}
                            />
                            <Card.Content>
                                <Text style={styles.cardContentText}>Add/Remove Contact</Text>
                                <Paragraph style={styles.cardContentParagraph}>Add or remove contact to your sharing list</Paragraph>
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>

                    <Card style={styles.card}>
                        <Card.Title
                            left={(props) =>
                                <Avatar.Icon {...props}
                                             color={'#05A3D9'}
                                             size={75}
                                             style={styles.cardBackground}
                                             icon="credit-card-outline" />}
                        />
                        <Card.Content>
                            <Text style={styles.cardContentText}>Bills</Text>
                            <Paragraph style={styles.cardContentParagraph}>Payment/Transactions </Paragraph>
                        </Card.Content>
                    </Card>
                </View>
                <View style={styles.cardRow}>
                    <Card style={styles.card}>
                        <Card.Title
                            left={(props) =>
                                <Avatar.Icon {...props}
                                             color={'#05A3D9'}
                                             size={75}
                                             style={styles.cardBackground}
                                             icon="history" />}
                        />
                        <Card.Content>
                            <Text style={styles.cardContentText}>Shared History</Text>
                            <Paragraph style={styles.cardContentParagraph}>View all of your shared videos</Paragraph>
                        </Card.Content>
                    </Card>
                    <Card style={styles.card}>
                        <Card.Title
                            left={(props) =>
                                <Avatar.Icon {...props}
                                             color={'#05A3D9'}
                                             size={75}
                                             style={styles.cardBackground}
                                             icon="wan" />}
                        />
                        <Card.Content>
                            <Text style={styles.cardContentText}>Network</Text>
                            <Paragraph style={styles.cardContentParagraph}>View my sharing network </Paragraph>
                        </Card.Content>
                    </Card>
                </View>
                <View style={[styles.cardRow,{marginBottom:50}]}>
                    <TouchableOpacity
                        style={styles.card}
                        onPress={()=> navigation.navigate('ShareLive',{
                        user: user
                    })}>
                        <Card>
                            <Card.Title
                                left={(props) =>
                                    <Avatar.Icon {...props}
                                                 color={'#05A3D9'}
                                                 size={75}
                                                 style={styles.cardBackground}
                                                 icon="video-outline" />}
                            />
                            <Card.Content>
                                <Text style={styles.cardContentText}>Share Camera Now</Text>
                                <Paragraph style={styles.cardContentParagraph}>Share your camera with your friends</Paragraph>
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>
                    <Card style={styles.card}>
                        <Card.Title
                            left={(props) =>
                                <Avatar.Icon {...props}
                                             color={'#05A3D9'}
                                             size={75}
                                             style={styles.cardBackground}
                                             icon="clipboard-list-outline" />}
                        />
                        <Card.Content>
                            <Text style={styles.cardContentText}>Shared Requests</Text>
                            <Paragraph style={styles.cardContentParagraph}>View other people shared cameras </Paragraph>
                        </Card.Content>
                    </Card>
                </View>
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    mainView: {
        justifyContent: 'center',
        backgroundColor:'#fff'
    },
    topView: {
        padding: 10
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
    profileDisplay:{
        flexDirection:'row',
        padding:10
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 50/ 2,
        margin:10
    },
    profileText: {
        flex:3,
        margin:10
    },
    dashboard: {
        backgroundColor:"rgba(229, 229, 229, 0.3)",
        padding:10
    },
    cardRow: {
        flexDirection:'row',
        justifyContent:'space-evenly'
    },
    card: {
        width: "50%",
        marginRight:20,
        marginLeft:20,
        marginBottom:10,
        marginTop:10
    },
    cardBackground: {
        backgroundColor: "#FFF"
    },
    cardContentText: {
        fontStyle:'normal',
        fontWeight:'800',
        fontFamily:'Roboto'
    },
    cardContentParagraph: {
        fontWeight: "800",
        fontStyle:'normal',
        fontFamily:'Open Sans',
        color:'rgba(0, 0, 0, 0.5)',
        opacity:0.7
    },
    color:{color:'#05A3D9'}
})
