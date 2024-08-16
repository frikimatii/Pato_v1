import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image } from "react-native";
import { getDocs, query, where, collection } from "firebase/firestore";
import { auth, db } from "../database/firebase_cong";

import dadouser from "../img/dado.jpg";


export default function Scoore({ navigation }) {
  const [userDocId, setUserDocId] = useState(null);
  const [moneda1, setMoneda1] = useState(0);
  const [moneda2, setMoneda2] = useState(0);
  const [moneda3, setMoneda3] = useState(0);
  const [moneda4, setMoneda4] = useState(0);
  const [moneda5, setMoneda5] = useState(0);
  const [loading, setLoading] = useState(true);

  const totalCoins = moneda1 + moneda2 + moneda3 + moneda4 + moneda5;

  useEffect(() => {
    const loadUserPoints = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const q = query(collection(db, "User_new"), where("email", "==", user.email));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            setMoneda1(userDoc.data().moneda1 ?? 0);
            setMoneda2(userDoc.data().moneda2 ?? 0);
            setMoneda3(userDoc.data().moneda3 ?? 0);
            setMoneda4(userDoc.data().moneda4 ?? 0);
            setMoneda5(userDoc.data().moneda5 ?? 0);
            setUserDocId(userDoc.id);
          } else {
            console.log("No user data found");
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
    loadUserPoints();
  }, [navigation]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#a000ff" style={styles.loader} />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>SCOORE</Text>
      <View style={styles.userInfo}>
      <Image source={dadouser} style={styles.perfil} />
        <Text style={styles.label}>
          Usuario ID: <Text style={styles.value}>{userDocId}</Text>
        </Text>
      </View>
      <View style={styles.scoreSection}>
        <Text style={styles.scoreLabel}>Puntuación</Text>
        <View style={styles.gameScores}>
          <Text style={styles.gameText}>Game 1: {moneda1}</Text>
          <Text style={styles.gameText}>Game 2: {moneda2}</Text>
          <Text style={styles.gameText}>Game 3: {moneda3}</Text>
          <Text style={styles.gameText}>Game 4: {moneda4}</Text>
          <Text style={styles.gameText}>Game 5: {moneda5}</Text>
        </View>
        <Text style={styles.totalText}>Total de Coin: {totalCoins}</Text>
      </View>
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
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  perfil: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
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
  scoreSection: {
    width: "100%",
    backgroundColor: "#0f3460",
    marginBottom: 30,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  scoreLabel: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f0f0f0",
    marginBottom: 15,
    textAlign: "center",
  },
  gameScores: {
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  gameText: {
    fontSize: 18,
    marginBottom: 5,
    color: "#ffffff",
  },
  totalText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#ffffff",
  },
});
