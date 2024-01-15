import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Start from "../screens/Start";
import Login from "../screens/Login";
import Register from "../screens/Register";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useEffect} from "react";



const Stack = createNativeStackNavigator();

export function AuthNavigator({ navigation }) {
    const isLogged = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                navigation.navigate("Home");
            }
        } catch (e) {

        }
    }

    useEffect(() => {
        isLogged();
    }, []);

    return (
        <Stack.Navigator>
            <Stack.Screen options={{ headerShown: false }} name="Start" component={Start} />
            <Stack.Screen options={{headerShown: false}} name="Login" component={Login} />
            <Stack.Screen options={{headerShown: false}} name="Register" component={Register} />
        </Stack.Navigator>
    );
}

const StackMain = createNativeStackNavigator();
export function MainNavigator() {

    return(
        <StackMain.Navigator>
            <StackMain.Screen options={{headerShown: false}} name="Auth" component={AuthNavigator} />
        </StackMain.Navigator>
    )
}