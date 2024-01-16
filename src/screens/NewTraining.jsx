import {StyleSheet, TouchableOpacity, View} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {Button, Text} from "@rneui/themed";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {useNavigation} from "@react-navigation/native";
import * as React from "react";
import { Input } from "@rneui/base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {useEffect, useState} from "react";
import * as Location from "expo-location";

export default function NewTraining() {
    const navigation = useNavigation();
    const onStartTraining = (trainingType) => {
        navigation.navigate("CurrentTraining", {trainingType})
    }
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);


    return (
        <SafeAreaProvider>
            <View style={styles.container}>
                <View style={{flex: 1,marginVertical:40,marginHorizontal: 16,borderRadius: 20, alignItems: 'center', justifyContent: 'space-between', padding: 16}}>
                    <View style={{justifyContent: 'center',alignItems: 'center'}}>
                        <Text h1 style={{textAlign: 'center'}}>Wybierz rodzja treningu:</Text>
                    </View>
                    <View style={{gap: 32}}>
                        <TouchableOpacity onPress={() => onStartTraining("bike")} style={{justifyContent: 'center', alignItems: 'center', borderRadius: 12, borderWidth: 2, borderColor:'#64B5F6', padding: 12}}>
                            <MaterialIcons name="directions-bike" size={120} color="#1976D2" />
                            <Text h4 style={{textAlign: 'center'}}>Kolarstwo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onStartTraining("run")} style={{justifyContent: 'center', alignItems: 'center', borderRadius: 12, borderWidth: 2, borderColor:'#64B5F6', padding: 12}}>
                            <MaterialCommunityIcons name="run-fast" size={120} color="#1976D2" />
                            <Text h4 style={{textAlign: 'center'}}>Bieganie</Text>
                        </TouchableOpacity>
                    </View>
                    <View />
                </View>
            </View>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heading: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
});
