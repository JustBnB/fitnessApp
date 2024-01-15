import {StyleSheet, ToastAndroid, View} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {Button, Text} from "@rneui/themed";
import { Header as HeaderRNE} from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import {SafeAreaProvider} from "react-native-safe-area-context";
import {useNavigation} from "@react-navigation/native";
import * as React from "react";
import { Input } from "@rneui/base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import {useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
    const navigation = useNavigation();
    const onBack = () => {navigation.goBack()}
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    const onLogin = async () => {
        try {
            const response = await axios.post('https://api-trening-a88d49778f06.herokuapp.com/login', {
                email,
                password
            });
            if (response.status === 200) {
                await AsyncStorage.setItem('token', response.data.token);
                ToastAndroid.show('Witaj!', ToastAndroid.SHORT);
                navigation.navigate('Home')
            }
        }catch (e) {
            ToastAndroid.show('Błąd!', ToastAndroid.SHORT);
        }

    }


    return (
        <SafeAreaProvider>
            <HeaderRNE
                leftComponent={
                <Ionicons name="arrow-back-circle" size={29} color="#fff" onPress={onBack} />
            }
                centerComponent={{ text: 'Logowanie', style: styles.heading }}
            />
        <View style={styles.container}>
            <View style={{flex: 1,marginVertical:40,marginHorizontal: 16,borderRadius: 20, alignItems: 'center', justifyContent: 'space-between', padding: 16}}>
                <View style={{justifyContent: 'center',alignItems: 'center'}}>
                    <MaterialIcons name="directions-bike" size={120} color="#1976D2" />
                    <Text h1 style={{textAlign: 'center'}}>Trening</Text>
                </View>
                <View style={{gap: 32}}>
                    <Input
                    containerStyle={{width: 260}}
                    disabledInputStyle={{ background: "#ddd" }}
                    inputContainerStyle={{}}
                    errorStyle={{}}
                    errorProps={{}}
                    inputStyle={{}}
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    labelStyle={{color: '#1976D2'}}
                    labelProps={{}}
                    leftIcon={<Icon name="account-outline" color="#1976D2" size={20} />}
                />
                    <Input
                        containerStyle={{width: 260}}
                        disabledInputStyle={{ background: "#ddd" }}
                        inputContainerStyle={{}}
                        errorStyle={{}}
                        errorProps={{}}
                        inputStyle={{}}
                        secureTextEntry={true}
                        value={password}
                        onChangeText={setPassword}
                        label="Hasło"
                        labelStyle={{color: '#1976D2'}}
                        labelProps={{}}
                        leftIcon={<Icon name="form-textbox-password" color="#1976D2" size={20} />}
                    />
                </View>
                <Button onPress={onLogin} type="outline" buttonStyle={{width: 200, borderWidth: 2}} size="lg">Zaloguj</Button>
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
