import * as React from 'react';
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginComponent from "./LoginComponent";
import RegisterComponent from "./RegisterComponent";
import MainMenuComponent from "./MainMenuComponent";
import SplashComponent from "./SplashComponent";
import ShareLiveComponent from "./ShareLiveComponent";
import MuxComponent from "./muxComponent";
import ContactComponent from "./ContactComponent";
import ShareLinkComponent from "./ShareLinkComponent";
import SelectContactComponent from "./SelectContactComponent";
import ViewLiveComponent from "./ViewLiveComponent";
import QrCodeComponent from "./QRCode";
import ScanScreen from "./QRCodeReader";
const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={"Splash"}>
                <Stack.Screen
                    name="Splash"
                    component={SplashComponent}
                    options={{headerShown: false}}/>
                <Stack.Screen
                    name="Login"
                    component={LoginComponent}
                    options={{headerShown: false}}/>
                <Stack.Screen
                    name="Register"
                    component={RegisterComponent}
                    options={{headerShown: false}}/>
                <Stack.Screen
                    name="MainMenu"
                    component={MainMenuComponent}
                    options={{headerShown: false}}/>
                <Stack.Screen
                    name="ShareLive"
                    component={ShareLiveComponent}
                    options={{headerShown: false}}/>
                <Stack.Screen
                    name="Mux"
                    component={MuxComponent}
                    options={{headerShown: false}}/>
                <Stack.Screen
                    name="Contact"
                    component={ContactComponent}
                    options={{headerShown: false}}/>
                <Stack.Screen
                    name="ShareLink"
                    component={ShareLinkComponent}
                    options={{headerShown: false}}/>
                <Stack.Screen
                    name="SelectContact"
                    component={SelectContactComponent}
                    options={{headerShown: false}}/>
                <Stack.Screen
                    name="LiveStream"
                    component={ViewLiveComponent}
                    options={{headerShown: false}}/>
                <Stack.Screen
                    name="QRCode"
                    component={QrCodeComponent}
                    options={{headerShown: false}}/>
                <Stack.Screen
                    name="QRCodeScanner"
                    component={ScanScreen}
                    options={{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}
