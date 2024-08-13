import React, { useState } from "react";
import { View, Text, Button, TextInput, Alert, StyleSheet, ImageBackground } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../database/firebase_cong";
import fondo from '../img/Fondo.jpg'

export default function Log({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    const Ingresar = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Todos los campos son obligatorios");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert("Error", "El correo electrónico no es válido");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.navigate("Dashboard");
        } catch (error) {
            Alert.alert("Error", "Contraseña incorrecta");
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={fondo} resizeMode="cover" style={styles.imagen}>
                <View style={styles.innerContainer}>
                    <Text style={styles.titulo}>Log In</Text>
                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={secureTextEntry}
                        style={styles.input}
                    />
                    <Button title="Mostrar/Ocultar Contraseña" onPress={toggleSecureEntry} />
                    <Button title="Iniciar Sesión" onPress={Ingresar} />
                    <Button title="Crear Cuenta" onPress={() => navigation.navigate("Sign")} />
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imagen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerContainer: {
        width: '85%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 12,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        backgroundColor: '#fff',
    },
});
