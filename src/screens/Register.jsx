import {StyleSheet, View, ScrollView,ToastAndroid} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {Button, Text} from "@rneui/themed";
import { Header as HeaderRNE} from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import {SafeAreaProvider} from "react-native-safe-area-context";
import {useNavigation} from "@react-navigation/native";
import * as React from "react";
import {CheckBox, Input} from "@rneui/base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {useState} from "react";
import axios from "axios";


export default function Register() {
    const navigation = useNavigation();
    const onBack = () => {
        navigation.goBack()
    }

    const [selectedIndex, setIndex] = React.useState(0);
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [firstName,setFirstName] = useState('');
    const [lastName,setLastName] = useState('');
    const [weight,setWeight] = useState('');
    const [height,setHeight] = useState('');

    const onCreateAccount  = async () => {
      const response =   await axios.post('https://api-trening-a88d49778f06.herokuapp.com/register', {
            email,
            password,
            firstName,
            lastName,
            weight,
            height,
            gender: selectedIndex
        })
        if(response.status === 201) {
            ToastAndroid.show('Konto stworzone!', ToastAndroid.SHORT);
            navigation.goBack();
        }else{
            ToastAndroid.show('Błąd!', ToastAndroid.SHORT);
        }
    }

    return (
        <SafeAreaProvider>
            <HeaderRNE
                leftComponent={
                    <Ionicons name="arrow-back-circle" size={29} color="#fff" onPress={onBack} />
                }
                centerComponent={{ text: 'Rejestracja', style: styles.heading }}
            />
            <ScrollView style={{flex: 1}} contentContainerStyle={styles.container}>
                <View style={{flex: 1,marginVertical:40,marginHorizontal: 16,borderRadius: 20, alignItems: 'center', justifyContent: 'space-between', padding: 16}}>
                    <View style={{justifyContent: 'center',alignItems: 'center',paddingBottom: 32}}>
                        <MaterialIcons name="directions-bike" size={120} color="#1976D2" />
                        <Text h1 style={{textAlign: 'center'}}>Trening</Text>
                    </View>
                    <View style={{gap: 24}}>
                        <Input
                            containerStyle={{width: 260}}
                            disabledInputStyle={{ background: "#ddd" }}
                            inputContainerStyle={{}}
                            errorStyle={{}}
                            errorProps={{}}
                            inputStyle={{}}
                            label="Email"
                            labelStyle={{color: '#1976D2'}}
                            labelProps={{}}
                            value={email}
                            onChangeText={setEmail}
                            leftIcon={<Icon name="email" color="#1976D2" size={20} />}
                        />
                        <Input
                            containerStyle={{width: 260}}
                            disabledInputStyle={{ background: "#ddd" }}
                            inputContainerStyle={{}}
                            errorStyle={{}}
                            errorProps={{}}
                            inputStyle={{}}
                            label="Hasło"
                            labelStyle={{color: '#1976D2'}}
                            labelProps={{}}
                            value={password}
                            onChangeText={setPassword}
                            leftIcon={<Icon name="form-textbox-password" color="#1976D2" size={20} />}
                        />
                        <Input
                            containerStyle={{width: 260}}
                            disabledInputStyle={{ background: "#ddd" }}
                            inputContainerStyle={{}}
                            errorStyle={{}}
                            errorProps={{}}
                            inputStyle={{}}
                            label="Imie"
                            labelStyle={{color: '#1976D2'}}
                            labelProps={{}}
                            value={firstName}
                            onChangeText={setFirstName}
                            leftIcon={<Icon name="account-outline" color="#1976D2" size={20} />}
                        />
                        <Input
                            containerStyle={{width: 260}}
                            disabledInputStyle={{ background: "#ddd" }}
                            inputContainerStyle={{}}
                            errorStyle={{}}
                            errorProps={{}}
                            inputStyle={{}}
                            label="Naziwsko"
                            labelStyle={{color: '#1976D2'}}
                            labelProps={{}}
                            value={lastName}
                            onChangeText={setLastName}
                            leftIcon={<Icon name="account-outline" color="#1976D2" size={20} />}
                        />
                        <Input
                            containerStyle={{width: 260}}
                            disabledInputStyle={{ background: "#ddd" }}
                            inputContainerStyle={{}}
                            errorStyle={{}}
                            errorProps={{}}
                            inputStyle={{}}
                            label="Wzrost"
                            labelStyle={{color: '#1976D2'}}
                            labelProps={{}}
                            value={height}
                            onChangeText={setHeight}
                            leftIcon={<Icon name="human-male-height" color="#1976D2" size={20} />}
                        />
                        <Input
                            containerStyle={{width: 260}}
                            disabledInputStyle={{ background: "#ddd" }}
                            inputContainerStyle={{}}
                            errorStyle={{}}
                            errorProps={{}}
                            inputStyle={{}}
                            label="Waga"
                            labelStyle={{color: '#1976D2'}}
                            labelProps={{}}
                            value={weight}
                            onChangeText={setWeight}
                            leftIcon={<Icon name="weight-kilogram" color="#1976D2" size={20} />}
                        />
                        <View style={{flexDirection: "row", width: 260, justifyContent: 'space-between', marginBottom: 20}}>
                            <CheckBox
                                checked={selectedIndex === 0}
                                onPress={() => setIndex(0)}
                                checkedIcon="dot-circle-o"
                                uncheckedIcon="circle-o"
                                title="Mężczyzna"
                            />
                            <CheckBox
                                checked={selectedIndex === 1}
                                onPress={() => setIndex(1)}
                                checkedIcon="dot-circle-o"
                                uncheckedIcon="circle-o"
                                title="Kobieta"
                            />
                        </View>
                    </View>
                    <Button type="outline" buttonStyle={{width: 200, borderWidth: 2}} size="lg" onPress={onCreateAccount}>Stwórz konto</Button>
                </View>
            </ScrollView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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
