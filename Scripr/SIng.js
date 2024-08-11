import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../database/firebase_cong";

export default function Sing({ navigation }) {
    const [user, setUser] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");

    const CrearCuenta = async () => {
        if (!user || !email || !password || !confirmpassword) {
            Alert.alert("Error", "Todos los campos son obligatorios");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert("Error", "El correo electrónico no es válido");
            return;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            Alert.alert("Error", "La contraseña debe tener al menos 8 caracteres, una letra y un número");
            return;
        }

        if (password !== confirmpassword) {
            Alert.alert("Error", "Las contraseñas no coinciden");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            await addDoc(collection(db, "User_new"), {
                user: user,
                email: email,
                moneda1: 0,
                moneda2: 0,
                moneda3: 0,
                moneda4: 0,
                moneda5: 0,
                date: new Date(),
                active: true
            });
            Alert.alert("Registro Exitoso", "Tu cuenta fue creada");
            navigation.navigate("Log");
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View>
            <Text>Crear Cuenta</Text>
            <TextInput
                placeholder="Usuario"
                value={user}
                onChangeText={setUser}
            />
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                placeholder="Confirmar Contraseña"
                value={confirmpassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            <Button
                title="Crear"
                onPress={CrearCuenta}
            />
            <Button
                title="Volver"
                onPress={() => navigation.navigate("Log")}
            />
        </View>
    );
}
