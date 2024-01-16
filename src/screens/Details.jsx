import { View, Text, Dimensions } from "react-native";
import React, { useRef } from 'react'
import MapView, { Geojson } from "react-native-maps";
import { lineString, center, point as makePoint, point, distance as calDistance } from "@turf/turf";
import { Header as HeaderRNE, Card } from '@rneui/themed';
import { Ionicons } from "@expo/vector-icons";

export default function Details({ route, navigation }) {
    const mapRef = useRef();
    const training = route.params;

    const prepareTraceLine = (pointsArray) => {
        let objects = pointsArray.map(point => [point.longitude, point.latitude]);
        const traceLine = {
            "type": "FeatureCollection",
            "features": [lineString(objects, { name: 'traceLine' })]
        };
        return traceLine;
    }

    const getCenter = (pointsArray) => {
        let objects = pointsArray.map(point => makePoint([point.longitude, point.latitude]));
        const points = {
            "type": "FeatureCollection",
            "features": objects
        }
        const centerPoint = center(points);
        return { longitude: centerPoint?.geometry?.coordinates[0], latitude: centerPoint?.geometry?.coordinates[1] }
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
        return parseFloat((points?.reduce((sum, point) => sum + (point.speed || 0), 0) / points.length)?.toFixed(2)) || 0;
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

    function formatTimestampToDDMMYYYY(timestamp) {
        var date = new Date(timestamp);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var formattedDate = (day < 10 ? '0' : '') + day + '.' + (month < 10 ? '0' : '') + month + '.' + year;

        return formattedDate;
    }

    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
            <HeaderRNE
                leftComponent={
                    <Ionicons name="arrow-back-circle" size={29} color="#fff" onPress={() => navigation.goBack()} />
                }
                centerComponent={{ text: 'Szczegóły treningu', style: { color: 'white', fontSize: 22, fontWeight: 'bold' } }}
            />
            <View style={{ alignItems: 'center' }}>
                <MapView
                    style={{ width: Dimensions.get('screen').width - 48, height: 300 }}
                    ref={mapRef}
                    showsMyLocationButton
                    initialCamera={{
                        center: getCenter(training.route),
                        pitch: 0,
                        heading: 0,
                        zoom: 15
                    }}
                >
                    <Geojson geojson={prepareTraceLine(training.route)} strokeColor={"red"} strokeWidth={2} />
                </MapView>
                <Card>
                    <Card.Title style={{ fontSize: 20 }}>Dane treningu:</Card.Title>
                    <Card.Divider color={'#1976D2'} />
                    <Text style={{ marginBottom: 10, fontSize: 18 }}>
                        {`Data: ${formatTimestampToDDMMYYYY(training.date)}`}
                    </Text>
                    <Text style={{ marginBottom: 10, fontSize: 18 }}>
                        {`Dystans: ${calculateTotalDistance(training.route)} KM`}
                    </Text>
                    <Text style={{ marginBottom: 10, fontSize: 18 }}>
                        {`Średnia prędkość: ${calculateSpeed(training.route)} KM/H`}
                    </Text>
                    <Text style={{ marginBottom: 10, fontSize: 18 }}>
                        {`Czas treningu: ${secondsToHMS(training.time)}`}
                    </Text>
                    <Text style={{ marginBottom: 10, fontSize: 18 }}>
                        {`Typ treningu: ${training.type === 'bike' ? 'Kolarstwo' : 'Bieg'}`}
                    </Text>
                </Card>
            </View>
        </View>
    )
}
