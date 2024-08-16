import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../database/firebase_cong";
import dadouser from "../img/dado.jpg";
import ruletacolor from "../img/ruedacolor.png";
import dado from "../img/dado6.png"
import siete from '../img/siete.png'
import moneda from '../img/moneda.png'
import clickme from '../img/clickme.png'

export default function Dashboard({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const q = query(
            collection(db, "User_new"),
            where("email", "==", user.email)
          );
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0].data();
            setUserData(userDoc);
          } else {
            console.log("No Such Document!");
          }
        } catch (error) {
          console.error("Error fetching user data", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log("No authenticated user found.");
        navigation.navigate("Log");
      }
    };
    fetchUserData();
  }, [auth, navigation]);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.navigate("Log");
      })
      .catch((error) => {
        console.error("Error Signing Out: ", error);
      });
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#a000ff" style={styles.loader} />
    );
  }

  if (!userData) {
    return <Text style={styles.errorText}>No user data found</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <View style={styles.userInfo}>
        <Image source={dadouser} style={styles.perfil} />
        <Text style={styles.label}>Información del Usuario</Text>
        <Text style={styles.value}>Usuario: {userData.user}</Text>
        <Text style={styles.value}>Email: {userData.email}</Text>
      </View>
      <View style={styles.gameSection}>
        <Text style={styles.gameTitle}>Juegos Disponibles</Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.gameName}>Ruleta</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Game-1", { userData })}>
              <Image source={ruletacolor} style={styles.gameImage} />
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <Text style={styles.gameName}>Dados</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Game-2", { userData })}>
              <Image source={dado} style={styles.gameImage} />
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <Text style={styles.gameName}>Cara o Cruz</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Game-3", { userData })}>
              <Image source={moneda} style={styles.gameImage} />
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <Text style={styles.gameName}>Encuéntrame</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Game-4", { userData })}>
              <Image source={clickme} style={styles.gameImage} />
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <Text style={styles.gameName}>Tragamonedas</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Game-5", { userData })}>
              <Image source={siete} style={styles.gameImage} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
      <Button title="Ver Puntuaciones" onPress={() => navigation.navigate("Scoore")} color="#28a745" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#d9534f",
    textAlign: "center",
    marginTop: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  userInfo: {
    width: "90%",
    marginBottom: 20,
    padding: 20,
    backgroundColor: "#16213e",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  perfil: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  label: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#e94560",
    marginBottom: 10,
  },
  value: {
    fontSize: 18,
    color: "#f0f0f0",
    marginBottom: 5,
  },
  gameSection: {
    width: "100%",
    backgroundColor: "#0f3460",
    marginBottom: 30,
    padding: 10,
    borderRadius: 10,
  },
  gameTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f0f0f0",
    marginBottom: 15,
    textAlign: "center",
  },
  card: {
    alignItems: "center",
    marginRight: 20,
    backgroundColor: '#e94560',
    padding: 15,
    borderRadius: 15,
  },
  gameName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 10,
  },
  gameImage: {
    width: 100,
    height: 100,
  },
  signOutButton: {
    backgroundColor: "#e94560",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  signOutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
