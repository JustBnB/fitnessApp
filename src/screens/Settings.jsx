import {ToastAndroid, View} from "react-native";
import {Header as HeaderRNE, Text, Button,Card} from "@rneui/themed-edge";
import * as React from "react";
import {Input} from "@rneui/base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function Settings({navigation}){
    const [oldPassword,setOldPassword] = useState('');
    const [newPassword,setNewPassword] = useState('');

    const onLogout = async () => {
    try {
        await AsyncStorage.removeItem('@token');
        navigation.navigate("Auth");
    } catch (e) {
        navigation.navigate("Auth");
    }
}
    const onChangePassword = async ()  => {
        try{
            const token = await AsyncStorage.getItem('token');
            const response = await axios.put('https://api-trening-a88d49778f06.herokuapp.com/change-password',{
                oldPassword,
                newPassword
            },{headers: {Authorization: token}});
            setNewPassword('');
            setOldPassword('');
            console.log(response.status);
            ToastAndroid.show('Hasło zostało zmienione', ToastAndroid.SHORT);
        }catch (e) {
            ToastAndroid.show('Błąd!', ToastAndroid.SHORT);
        }
    }

    return(
    <View style={{flex: 1, backgroundColor: 'white', justifyContent: 'space-between', alignItems: 'center'}}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <HeaderRNE
            centerComponent={{ text: 'Ustawienia', style: {
                color: 'white',
                    fontSize: 22,
                    fontWeight: 'bold',} }}
        />
            <Card wrapperStyle={{gap: 16, alignItems: 'center'}}>
        <Text h3 style={{textAlign: 'center', marginTop: 20}}>Zmień hasło:</Text>
                <Input
                    containerStyle={{width: 260}}
                    disabledInputStyle={{ background: "#ddd" }}
                    inputContainerStyle={{}}
                    errorStyle={{}}
                    errorProps={{}}
                    inputStyle={{}}
                    secureTextEntry={true}
                    value={oldPassword}
                    onChangeText={setOldPassword}
                    label="Stare hasło"
                    labelStyle={{color: '#1976D2'}}
                    labelProps={{}}
                    leftIcon={<Icon name="form-textbox-password" color="#1976D2" size={20} />}
                />
                <Input
                    containerStyle={{width: 260}}
                    disabledInputStyle={{ background: "#ddd" }}
                    inputContainerStyle={{}}
                    errorStyle={{}}
                    errorProps={{}}
                    inputStyle={{}}
                    secureTextEntry={true}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    label="Nowe hasło"
                    labelStyle={{color: '#1976D2'}}
                    labelProps={{}}
                    leftIcon={<Icon name="form-textbox-password" color="#1976D2" size={20} />}
                />
            <Button onPress={onChangePassword} type="outline" buttonStyle={{width: 200, borderWidth: 2,marginBottom: 20}} size="lg">Zapisz nowe hasło</Button>
            </Card>
        </View>
        <Button onPress={onLogout} type="outline" buttonStyle={{width: 200, borderWidth: 2,marginBottom: 20}} size="lg">Wyloguj</Button>
    </View>
    )
}
