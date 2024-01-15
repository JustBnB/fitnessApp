import { StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Button, Text } from "@rneui/themed";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";

export default function Start() {
    const navigation = useNavigation();


    const onRegister = () => {
        navigation.navigate("Register");
    }

    return (
        <View style={styles.container}>
            <View style={{height: '60%',marginVertical:40,marginHorizontal: 16, borderWidth: 4, borderColor: '#64B5F6', width: '80%', borderRadius: 20, alignItems: 'center', justifyContent: 'space-between', padding: 16,backgroundColor: '#fff'}}>
                <View style={{justifyContent: 'center',alignItems: 'center'}}>
                    <MaterialIcons name="directions-bike" size={120} color="#1976D2" />
                    <Text h1 style={{textAlign: 'center'}}>Trening</Text>
                </View>
                <Text h4 style={{textAlign: 'center'}}>Rejestruj swoje wyniki i przeglądaj trasy!</Text>
                <View style={{gap: 32}}>
                    <Button onPress={onRegister} type="outline" buttonStyle={{width: 200, borderWidth: 2}} size="lg">Rejestracja</Button>
                    
                </View>
                <StatusBar style="auto" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2979FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
