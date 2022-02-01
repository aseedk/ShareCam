import * as React from 'react';
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginComponent from "./LoginComponent";
import RegisterComponent from "./RegisterComponent";
import MainMenuComponent from "./MainMenuComponent";
import SplashComponent from "./SplashComponent";
import ShareLiveComponent from "./ShareLiveComponent";
const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={"ShareLive"}>
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
            </Stack.Navigator>
        </NavigationContainer>
    );
}
