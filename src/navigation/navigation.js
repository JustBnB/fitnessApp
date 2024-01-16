import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Start from "../screens/Start";
import Login from "../screens/Login";
import Register from "../screens/Register";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NewTraining from "../screens/NewTraining";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useNavigation} from "@react-navigation/native";
import {useEffect} from "react";
import Settings from "../screens/Settings";


const Stack = createNativeStackNavigator();
export function AuthNavigator() {
    const navigation = useNavigation();
    const isLogged = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                navigation.navigate("Home");
            }
        }catch (e) {
        }
    }
    useEffect(() => {
        isLogged();
    }, []);
    return (
            <Stack.Navigator>
                <Stack.Screen options={{headerShown: false}} name="Start" component={Start} />
                <Stack.Screen options={{headerShown: false}} name="Login" component={Login} />
                <Stack.Screen options={{headerShown: false}} name="Register" component={Register} />
            </Stack.Navigator>
    );
}

const Tab = createBottomTabNavigator();
export function TabNavigator() {
    return (
        <Tab.Navigator>
            <Tab.Screen options={{
                headerShown: false,
                tabBarLabel: 'Nowy trening',
                tabBarIcon: ({ color, size }) => (
                    <Icon name="weight-lifter" color={color} size={size} />
                ),
            }} name="NewTraining" component={NewTraining} />
        </Tab.Navigator>
    );
}

const StackHome = createNativeStackNavigator();
export function HomeNavigator() {
    return (
        <StackHome.Navigator screenOptions={{headerShown: false}}>
            <StackHome.Screen name="Tab" component={TabNavigator} />

        </StackHome.Navigator>
    );
}

const StackMain = createNativeStackNavigator();
export function MainNavigator() {

    return(
        <StackMain.Navigator>
            <StackMain.Screen options={{headerShown: false}} name="Auth" component={AuthNavigator} />
            <StackMain.Screen options={{headerShown: false}} name="Home" component={HomeNavigator} />
        </StackMain.Navigator>
    )
}
