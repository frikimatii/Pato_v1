import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
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

import cara from "../../img/moneda_cara.png";
import seca from "../../img/moneda_seca.png";
import estadoimg from "../../img/moneda.png";

export default function Game3({ navigation }) {
  const [point, setPoints] = useState(0);
  const [userDocId, setUserDocId] = useState(null);

  const [elegido, setElegido] = useState(null);
  const [estado, setEstado] = useState(estadoimg);
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);

  const moneda = ["cara", "seca"];
  const NumRan = () => Math.floor(Math.random() * 2);

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
            setPoints(userDoc.data().moneda3 || 0);
            setUserDocId(userDoc.id);
          } else {
            console.log("No User Data found");
          }
        } catch (error) {
          console.error("Error fetching user Data", error);
        }
      } else {
        Alert.alert("Error", "No se encontró un usuario autenticado");
      }
    };
    loadUserPoints();
  }, [navigation]);

  const TirarMoneda = async () => {
    setCargando(true);
    setResultado(null);

    setTimeout(async () => {
      const d = moneda[NumRan()];
      const resultadoCoincide = d === elegido;

      setEstado(d === "cara" ? cara : seca);

      if (resultadoCoincide && userDocId) {
        try {
          const userRef = doc(db, "User_new", userDocId);
          await updateDoc(userRef, {
            moneda3: increment(10),
          });
          setPoints(point + 10);
          setResultado("¡Ganaste! Se te han otorgado 10 monedas");
        } catch (error) {
          console.error("Error Updating Points", error);
          Alert.alert("Error", "Hubo un problema al actualizar");
        }
      } else {
        setResultado(`Perdiste, cayó en ${d}. Inténtalo de nuevo`);
      }

      setTimeout(() => {
        resetGamer();
      }, 3000);

      setCargando(false);
    }, 3000);
  };

  const resetGamer = () => {
    setElegido(null);
    setEstado(estadoimg);
    setResultado(null);
    setCargando(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <Text style={styles.title}>Ruleta</Text>
        <Text style={styles.subtitle}>Gira la ruleta y gana puntos</Text>
      </View>
      <View style={styles.imagecontainer}>
        {estado && <Image source={estado} style={styles.image} />}
      </View>
      <Text style={styles.result}>{resultado}</Text>
      <View style={styles.buttoncontainer}>
        <TouchableOpacity
          style={[
            styles.button,
            elegido === "cara" ? styles.buttonSelected : null,
          ]}
          onPress={() => setElegido("cara")}
          disabled={cargando}
        >
          <Text style={styles.buttonText}>Cara</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            elegido === "seca" ? styles.buttonSelected : null,
          ]}
          onPress={() => setElegido("seca")}
          disabled={cargando}
        >
          <Text style={styles.buttonText}>Seca</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[
          styles.playButton,
          !elegido || cargando ? styles.buttonDisabled : null,
        ]}
        onPress={TirarMoneda}
        disabled={!elegido || cargando}
      >
        <Text style={styles.playButtonText}>Jugar</Text>
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
  text: {
    fontSize: 20,
    color: "#FFD700",
    marginBottom: 20,
  },
  imagecontainer: {
    marginTop: 150,
    marginBottom: 30,
  },
  image: {
    width: 120,
    height: 120,
  },
  result: {
    fontSize: 20,
    color: "#fff",
    marginVertical: 20,
    textAlign: "center",
  },
  buttoncontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 10,
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSelected: {
    backgroundColor: "#0056b3",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  playButton: {
    paddingVertical: 15,
    paddingHorizontal: 50,
    backgroundColor: "#28a745",
    borderRadius: 10,
    elevation: 5,
  },
  playButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: "#6c757d",
  },
});
