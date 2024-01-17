import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    ToastAndroid,
    TouchableOpacity,
    View
} from "react-native";
import {FontAwesome5} from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import * as React from "react";
import { useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ListItem } from '@rneui/themed';
import {MaterialIcons} from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import {point, distance as calDistance} from "@turf/turf";
import {Header as HeaderRNE} from "@rneui/themed-edge";

export default function Trainings() {
    const [list,setList] = useState([]);
    const [loading,setLoading] = useState(false);
    const navigation = useNavigation();
    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                setLoading(true);
                const token = await AsyncStorage.getItem('token');
                try {
                    const response = await axios.get('https://api-trening-a88d49778f06.herokuapp.com/trainings',{headers: {Authorization: token}});
                    setList(response.data.trainings);
                }catch (e) {
                    ToastAndroid.show('Błąd!', ToastAndroid.SHORT);
                    setLoading(false);
                }
                setLoading(false);
            })()
        }, [])
    );


    function formatTimestampToDDMMYYYY(timestamp) {
        var date = new Date(timestamp);

        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();

        var formattedDate = (day < 10 ? '0' : '') + day + '.' + (month < 10 ? '0' : '') + month + '.' + year;

        return formattedDate;
    }

    const secondsToHMS = seconds => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        const formattedHours = hours < 10 ? `0${hours}` : hours;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    };

    function calculateTotalDistance(points) {
        if (points.length < 2) {
            return 0;
        }

        let totalDistance = 0;
        if(points.length > 1) {
            for (let i = 0; i < points.length - 1; i++) {
                const startPoint = point([points[i].longitude, points[i].latitude]);
                const endPoint = point([points[i + 1].longitude, points[i + 1].latitude]);

                const distance = calDistance(startPoint, endPoint, {units: 'kilometers'});

                if (distance) {
                    totalDistance += distance;
                }
            }
            return parseFloat(totalDistance?.toFixed(2)) || 0;
        }else{
            return 0;
        }
    }


    return (
        <View style={styles.container}>
            <HeaderRNE
                centerComponent={{ text: 'Historia treningu', style: {
                    color: 'white',
                        fontSize: 22,
                        fontWeight: 'bold',} }}
            />
                <ScrollView contentContainerStyle={{flexGrow: 1,gap: 16,marginVertical:40,borderRadius: 20, alignItems: 'center', justifyContent: 'flex-start', padding: 16}}>
                    {list.length > 0 && list.map((training) => (
                        <ListItem
                            key={training._id}
                            linearGradientProps={{
                                colors: ["#90CAF9", "#0D47A1"],
                                start: { x: 1, y: 0 },
                                end: { x: 0.2, y: 0 },
                                width: Dimensions.get('screen').width -32
                            }}
                            ViewComponent={LinearGradient}
                        >
                            {training.type === 'bike' ? <MaterialIcons name="directions-bike" size={40} color="#fff" /> :
                            <MaterialCommunityIcons name="run-fast" size={40} color="#fff" />}
                            <ListItem.Content style={{flexDirection: 'column', gap: 8, justifyContent: 'center',alignItems: 'flex-start'}}>
                                <View style={{flexDirection: 'row',justifyContent: 'flex-start',alignItems: 'center',gap: 4}}>
                                <ListItem.Title style={{ color: "white", fontWeight: "bold" }}>
                                    {formatTimestampToDDMMYYYY(training.date)}
                                </ListItem.Title>
                                </View>
                                <View style={{flexDirection: 'row',gap: 12}}>
                                <View style={{flexDirection: 'row',justifyContent: 'flex-start',alignItems: 'center',gap: 4}}>
                                <MaterialCommunityIcons name="clock-fast" size={28} color="white" />
                                <ListItem.Subtitle style={{ color: "white" }}>
                                    {secondsToHMS(training.time)}
                                </ListItem.Subtitle>
                                </View>
                                <View style={{flexDirection: 'row',justifyContent: 'flex-start',alignItems: 'center',gap: 4}}>
                                <FontAwesome5 name="route" size={20} color="white" />
                                <ListItem.Subtitle style={{ color: "white" }}>
                                    {calculateTotalDistance(training.route)} KM
                                </ListItem.Subtitle>
                                </View>
                                </View>
                            </ListItem.Content>
                            <TouchableOpacity onPress={() => {
                                navigation.navigate("Details", training);
                            }} style={{padding:12, borderWidth: 1, borderRadius: 99, borderColor: 'white'}}>
                            <MaterialCommunityIcons name="map-search-outline" size={24} color="white" />
                            </TouchableOpacity>
                        </ListItem>
                    ) )}
                    {loading && <ActivityIndicator size="large" color={"#90CAF9"} />}
                </ScrollView>
        </View>
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
