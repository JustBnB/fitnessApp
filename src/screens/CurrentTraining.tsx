import { Dimensions, StyleSheet, ToastAndroid, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Button, Text } from "@rneui/themed";
import { Header as HeaderRNE } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as React from "react";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRef, useState } from "react";
import MapView, { Geojson } from 'react-native-maps';
import { point, distance as calDistance, lineString } from "@turf/turf";
import axios from "axios/index";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CurrentTraining({ navigation, route }) {
    const intervalRef = useRef(null);
    const mapRef = useRef();
    const [time, setTime] = useState(0);
    const [playVisible, setPlayVisible] = useState(true);
    const [pauseVisible, setPauseVisible] = useState(false);
    const [stopVisible, setStopVisible] = useState(false);
    const [trace, setTrace] = useState([]);
    const { trainingType } = route.params;

    const secondsToHMS = seconds => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        const formattedHours = hours < 10 ? `0${hours}` : hours;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    };

    const onBack = () => { navigation.goBack() }

    const onPlay = () => {
        setPlayVisible(false);
        setPauseVisible(true);
        setStopVisible(true);
        intervalRef.current = setInterval(() => {
            setTime(prevState => prevState + 1);
        }, 1000)
    }

    const onPause = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        setPlayVisible(true);
        setPauseVisible(false);
        setStopVisible(true);
    }

    const onStop = async () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        const token = await AsyncStorage.getItem('token');
        try {
            const response = await axios.post('https://api-trening-a88d49778f06.herokuapp.com/trainings', {
                time,
                date: Date.now(),
                route: trace,
                type: trainingType,
            }, { headers: { Authorization: token } });
            if (response.status === 201) {

                ToastAndroid.show('Zapisano trening!', ToastAndroid.SHORT);
            }
        } catch (e) {
            ToastAndroid.show('Błąd!', ToastAndroid.SHORT);
        }

        setTime(0);
        setTrace([]);
        setPlayVisible(true);
        setPauseVisible(false);
        setStopVisible(false);
    }

    function calculateTotalDistance(points) {
        if (points.length < 2) {
            return 0;
        }

        let totalDistance = 0;
        if (points.length > 1) {
            for (let i = 0; i < points.length - 1; i++) {
                const startPoint = point([points[i].longitude, points[i].latitude]);
                const endPoint = point([points[i + 1].longitude, points[i + 1].latitude]);

                const distance = calDistance(startPoint, endPoint, { units: 'kilometers' });

                if (distance) {
                    totalDistance += distance;
                }
            }
            return parseFloat(totalDistance?.toFixed(2)) || 0;
        } else {
            return 0;
        }
    }


    const calculateSpeed = (points) => {
        return parseFloat((points?.reduce((sum, point) => sum + (point.speed || 0), 0) / (points.length || 1))?.toFixed(2)) || 0;
    }

    const prepareTraceLine = (pointsArray) => {
        let objects = pointsArray.map(point => [point.longitude, point.latitude]);
        const traceLine = {
            "type": "FeatureCollection",
            "features": [lineString(objects, { name: 'line' })]
        };
        return traceLine;
    }

    return (
        <SafeAreaProvider>
            <HeaderRNE
                leftComponent={
                    <Ionicons name="arrow-back-circle" size={29} color="#fff" onPress={onBack} />
                }
                centerComponent={{ text: trainingType === 'bike' ? 'Trening Kolarski' : "Trening Biegowy", style: styles.heading }}
            />
            <View style={styles.container}>
                <View style={{ flex: 1, marginVertical: 40, marginHorizontal: 16, borderRadius: 20, alignItems: 'center', justifyContent: 'space-between', padding: 16 }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text h1 style={{ textAlign: 'center' }}>{secondsToHMS(time)}</Text>
                        <View style={{ flexDirection: 'row', gap: 16 }}>
                            {stopVisible &&
                                <TouchableOpacity onPress={onStop}>
                                    <MaterialCommunityIcons name="stop-circle-outline" size={120} color="#DD2C00" />
                                </TouchableOpacity>
                            }
                            {pauseVisible &&
                                <TouchableOpacity onPress={onPause}>
                                    <MaterialIcons name="pause-circle-outline" size={120} color="#FFC107" />
                                </TouchableOpacity>}
                            {playVisible &&
                                <TouchableOpacity onPress={onPlay}>
                                    <MaterialIcons name="play-circle-outline" size={120} color="#00C853" />
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                    <View style={{ gap: 32 }}>
                        <View style={styles.mapBorder}>
                            <Text h4 style={{ textAlign: 'center' }}>Dystans: {calculateTotalDistance(trace)} KM</Text>
                            <Text h4 style={{ textAlign: 'center' }}>Srednia prędkość: {calculateSpeed(trace)} KM/H</Text>
                            <MapView
                                style={styles.map}
                                ref={mapRef}
                                showsUserLocation
                                followsUserLocation
                                scrollEnabled={false}
                                zoomEnabled={false}
                                pitchEnabled={false}
                                showsMyLocationButton
                                userLocationPriority={'high'}
                                onUserLocationChange={({ nativeEvent }) => {
                                    mapRef?.current?.setCamera({
                                        center: {
                                            latitude: nativeEvent.coordinate.latitude,
                                            longitude: nativeEvent.coordinate.longitude
                                        }, heading: 0, zoom: 18
                                    })
                                    if (!playVisible) {
                                        setTrace((prevState) => {
                                            const updatedTrace = [...prevState];
                                            updatedTrace.push(nativeEvent.coordinate);
                                            return updatedTrace;
                                        })
                                    }
                                }}
                            >
                                {trace !== [] && trace.length > 1 &&
                                    <Geojson geojson={prepareTraceLine(trace)} strokeColor={"red"} strokeWidth={2} />
                                }
                            </MapView>
                        </View>
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
    map: {
        width: Dimensions.get('screen').width - 48,
        height: 300,
    },
    mapBorder: {
        padding: 4,
        borderWidth: 2,
        borderRadius: 12,
        borderColor: '#1976D2'
    }
});
