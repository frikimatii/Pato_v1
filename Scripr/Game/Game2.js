import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
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

import Cara1 from "../../img/dado1.png";
import Cara2 from "../../img/dado2.png";
import Cara3 from "../../img/dado3.png";
import Cara4 from "../../img/dado4.png";
import Cara5 from "../../img/dado5.png";
import Cara6 from "../../img/dado6.png";

const list = [Cara1, Cara2, Cara3, Cara4, Cara5, Cara6];

const NumRan = () => Math.floor(Math.random() * 6) + 1;

export default function Game2({ navigation }) {
  const [resultado, setResultado] = useState(0);
  const [moneda2, setMoneda2] = useState(0);
  const [dado1, setDado1] = useState(null);
  const [dado2, setDado2] = useState(null);
  const [dado3, setDado3] = useState(null);
  const [userDocId, setUserDocId] = useState(null);

  useEffect(() => {
    const loadUserMoneda2 = async () => {
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
            setMoneda2(userDoc.data().moneda2 || 0);
            setUserDocId(userDoc.id);
          } else {
            console.log("No user data found");
          }
        } catch (error) {
          console.error("Error fetching user data", error);
        }
      } else {
        Alert.alert("Error", "No se encontró un usuario autenticado.");
        navigation.navigate("Log");
      }
    };

    loadUserMoneda2();
  }, [navigation]);

  const Tirar = async () => {
    const n1 = NumRan();
    const n2 = NumRan();
    const n3 = NumRan();
    const total = n1 + n2 + n3;

    setResultado(total);
    setDado1(list[n1 - 1]);
    setDado2(list[n2 - 1]);
    setDado3(list[n3 - 1]);

    if (userDocId) {
      try {
        const userRef = doc(db, "User_new", userDocId);
        await updateDoc(userRef, {
          moneda2: increment(total),
        });
        setMoneda2((prevMoneda2) => prevMoneda2 + total);
      } catch (error) {
        console.error("Error updating moneda2: ", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <Text style={styles.title}>Ruleta</Text>
        <Text style={styles.subtitle}>Gira la ruleta y gana puntos</Text>
      </View>
      <View style={styles.caja}>
        <Image style={styles.dado} source={dado1 || Cara1} />
        <Image style={styles.dado} source={dado2 || Cara2} />
        <Image style={styles.dado} source={dado3 || Cara3} />
      </View>
      <View style={styles.resultados}>
        <Text style={styles.textoResultado}>Resultado: {resultado}</Text>
        <Text style={styles.textoResultado}>Puntos Totales: {moneda2}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={Tirar}>
        <Text style={styles.buttonText}>TIRA</Text>
      </TouchableOpacity>
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
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    marginTop: 5,
  },
  caja: {
    marginTop: 230,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  dado: {
    margin: 10,
    height: 100,
    width: 100,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    padding: 10,
    elevation: 5,
  },
  resultados: {
    alignItems: "center",
    marginBottom: 40,
  },
  textoResultado: {
    color: "#FFD700", // Dorado
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 5,
  },
  button: {
    backgroundColor: "#28a745", // Verde
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
