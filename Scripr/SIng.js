import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../database/firebase_cong";

export default function Sign({ navigation }) {
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
      Alert.alert(
        "Error",
        "La contraseña debe tener al menos 8 caracteres, una letra y un número"
      );
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
        active: true,
      });
      Alert.alert("Registro Exitoso", "Tu cuenta fue creada");
      navigation.navigate("Log");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Image style={styles.logo} source={require("../img/logo.jpg")} />
        <Text style={styles.title}>Crear Cuenta</Text>
        <Text style={styles.subtitle}>
          ¿Ya tienes una cuenta? Inicia sesión aquí
        </Text>
        <View style={styles.formulario}>
          <TextInput
            placeholder="Usuario"
            value={user}
            onChangeText={setUser}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            placeholder="Confirmar Contraseña"
            value={confirmpassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
          />
          <TouchableOpacity onPress={CrearCuenta} style={styles.button}>
            <Text style={styles.buttonText}>Crear Cuenta</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Log")}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#a213a1",
  },
  box: {
    marginTop: 120,
    backgroundColor: "#ffffff",
    borderTopEndRadius: 100,
    padding: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    paddingBottom: 100,
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  formulario: {
    width: "100%",

  },
  input: {
    backgroundColor: "#EFEFEF",
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    alignItems: "center",
  },
  backButtonText: {
    color: "#1E90FF",
    fontSize: 16,
  },
});
