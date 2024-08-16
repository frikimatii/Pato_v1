import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from "react-native";

import {
  doc,
  updateDoc,
  increment,
  getDocs,
  query,
  where,
  collection,
} from "firebase/firestore";
import { auth, db } from "../../database/firebase_cong";

const COLORS = [
  "#FF5733", // Rojo Naranja
  "#C70039", // Rojo Intenso
  "#900C3F", // Vino
  "#FFC300", // Amarillo Intenso
  "#DAF7A6", // Verde Claro
  "#581845", // Púrpura Oscuro
  "#28B463", // Verde Esmeralda
  "#1F618D", // Azul Marino
  "#FF33F6", // Rosa Brillante
  "#8E44AD", // Púrpura
  "#2980B9", // Azul Brillante
  "#F39C12", // Naranja
  "#DFFF00", // Amarillo Lima
  "#FF6F61", // Coral
  "#D4AC0D", // Oro
  "#7D3C98", // Morado
  "#45B39D", // Verde Agua
  "#154360", // Azul Profundo
  "#F4D03F", // Amarillo Mostaza
  "#117A65", // Verde Turquesa
  "#FF1493", // Rosa Profundo
  "#FF4500", // Rojo Fuego
  "#00FF7F", // Verde Primavera
  "#8B008B", // Magenta Oscuro
  "#00CED1", // Turquesa Oscuro
  "#FFD700", // Dorado Brillante
  "#FF6347", // Tomate
  "#00BFFF", // Azul Cielo
  "#ADFF2F", // Verde Amarillo
  "#FF00FF", // Magenta Fluorescente
  "#40E0D0", // Turquesa
];

export default function Game4() {
  const pan = useRef(new Animated.ValueXY()).current;
  const [coin, setCoin] = useState(0);
  const [color, setColor] = useState(COLORS[0]);
  const [userDocId, setUserDocId] = useState(null);

  useEffect(() => {
    const loadUserPoints = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const q = query(
            collection(db, "User_new"),
            where("email", "==", user.email)
          );
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            setCoin(userDoc.data().moneda4 || 0);
            setUserDocId(userDoc.id);
          } else {
            console.log("No user Data found");
          }
        } catch (error) {
          console.error("Error fetching user Data", error)``;
        }
      } else {
        Alert.alert("Error", "No encontro un usuario autenticado");
      }
    };
    loadUserPoints();
  }, []);

  const cambiarColor = () => {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  };

  const posicionAleatoria = (max) => {
    return Math.floor(Math.random() * max);
  };

  const actualizarPoint = async () => {
    if (userDocId) {
      try {
        const userRef = doc(db, "User_new", userDocId);
        await updateDoc(userRef, {
          moneda4: increment(1),
        });
        setCoin(coin + 1);
      } catch (error) {
        console.error("Error updating points: ", error);
      }
    }
  };

  const Press = () => {
    const newColor = cambiarColor();
    setColor(newColor);

    const x = posicionAleatoria(360);
    const y = posicionAleatoria(490);

    Animated.spring(pan, {
      toValue: { x, y },
      useNativeDriver: false,
    }).start();

    actualizarPoint();
  };

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <Text style={styles.title}>Encontrame</Text>
      </View>
      <View style={styles.cajaJuego}>
        <Animated.View style={[pan.getLayout()]}>
          <TouchableOpacity
            onPress={Press}
            style={[styles.boton, { backgroundColor: color }]}
          />
        </Animated.View>
      </View>
      <Text style={styles.point}>Point: </Text>
      <Text style={styles.moneda}>{coin}</Text>
    </View>
  );
}
const styles = StyleSheet.create({ 
  container: {
  flex: 1,
  alignItems: "center",
  backgroundColor: "#1e1f26",
},
nav: {
  backgroundColor: "#ffffff",
  width: "100%",
  paddingVertical: 30,
  alignItems: "center",
  borderBottomRightRadius: 100,
  borderBottomLeftRadius: 100,
  marginBottom: 10,
},
title: {
  fontSize: 32,
  fontWeight: "bold",
  color: "#333333",
},
  cajaJuego: {
    marginTop: 20,
    height: 510,
    width: 380,
    backgroundColor: "#FFF8DB",
    borderRadius: 20,
  },
  boton: {
    width: 30,
    height: 30,
    backgroundColor: "#33e323",
  },
  point: {
    textAlign: "center",
    fontSize: 20,
    marginTop: 20,
    color: "#fff",
    fontWeight: "600",
  },
  moneda:{
    fontSize: 30,
    color: "#fff",
    fontWeight: "900"
  }
});
