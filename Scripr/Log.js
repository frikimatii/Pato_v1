import React, { useState } from "react";
import { View, Text, Button, TextInput, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../database/firebase_cong";

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
        <View>
            <Text>Log In</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secureTextEntry}
            />
            <Button title="Mostrar/Ocultar Contraseña" onPress={toggleSecureEntry} />
            <Button title="Iniciar Sesión" onPress={Ingresar} />
            <Button title="Crear Cuenta" onPress={() => navigation.navigate("Sign")} />
        </View>
    );
}
