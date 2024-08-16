import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../database/firebase_cong";
import logo from "../img/logo.jpg";

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
      Alert.alert("Error", "Correo electrónico o contraseña incorrectos");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Iniciar Seccion</Text>
        <Text style={styles.subtitle}>Ingesas tus Datos para Ingresar</Text>
        <View style={styles.formulario}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Ingrese su Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
          />
          <Text style={styles.label}>Contraseña </Text>
          <TextInput
            placeholder="Ingresa tu Contrase;a"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureTextEntry}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={toggleSecureEntry}
            style={styles.toggleButton}
          >
            <Text style={styles.toggleButtonText}>
              {secureTextEntry ? "Mostrar Contrase;a" : "Ocultar Contrase;a "}
            </Text>
          </TouchableOpacity>
        </View>
        <Button title="Iniciar Sesion" onPress={Ingresar} />
        <TouchableOpacity onPress={() => navigation.navigate("Sign")}>
          <Text style={styles.signUpText}>No Tenes Cuenta ? Registrate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#a213a1",
  },
  box: {
    marginTop: 160,
    backgroundColor: "#ffffff",
    borderTopStartRadius: 100,
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
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 28,
  },
  formulario: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
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
  toggleButton: {
    color: "#1e90ff",
    fontSize: 14,
  },
  signUpText: {
    marginTop: 20,
    fontSize: 14,
    color: "#1e90ff",
  },
});
