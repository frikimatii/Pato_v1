import React, { useEffect, useState } from "react";
import { View, Text, Image, Button, StyleSheet, Alert } from "react-native";
import { doc, updateDoc, increment, getDocs, query, where, collection } from "firebase/firestore";
import { auth, db } from "../../database/firebase_cong";

import moneyVerde from "../../img/verde.png"
import moneyred from "../../img/red.png"

const cara = moneyVerde;
const seca = moneyred


export default function Game3({ navigation }) {
    const [point, setPoints] = useState(0)
    const [userDocId, setUserDocId] = useState(null)

    const [elegido, setElegido] = useState(null)
    const [estado, setEstado] = useState(null)
    const [resultado, setResultado] = useState(null)
    const [cargando, setCargando] = useState(false)



    const moneda = ["cara", "seca"]
    const NumRan = () => Math.floor(Math.random() * 2);


    useEffect(() => {
        const loadUserPoints = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    const q = query(collection(db, "User_new"), where("email", "==", user.email))
                    const querySnapshot = await getDocs(q)
                    if (!querySnapshot.empty) {
                        const userDoc = querySnapshot.docs[0]
                        setPoints(userDoc.data().moneda3 || 0)
                        setUserDocId(userDoc.id)
                    } else {
                        console.log("No User Data found")
                    }
                } catch (error) {
                    console.error("Error fetching user Data", error)
                }
            } else {
                Alert.alert("Error", " No se encontro un usuario autenticado")
            }
        };
        loadUserPoints()
    }, [navigation])

    const TirarMoneda = async () => {
        setCargando(true)
        setResultado(null)


        setTimeout(async () => {
            const d = moneda[NumRan()]
            const resultadoCoincide = d === elegido

            if (d === "cara ") {
                setEstado(cara)
            } else {
                setEstado(seca)
            }

            if(resultadoCoincide && userDocId){
                try{
                    const userRef = doc(db, "User_new" ,  userDocId)
                    await updateDoc(userRef, {
                        moneda3: increment(10)
                    })
                    setPoints(point + 10)
                    setResultado("Ganaste se te han otortoga 10 monedas")
                } catch (error) {
                    console.error("Error Updating Points", error)
                    Alert.alert("Error", "Hubo un Problema al actualizar")
                }
            } else{
                setResultado(`Perdiste, cayo en ${d}. intentalo denuevo`)
            }


            setTimeout(()=>{
                resetGamer()
            }, 3000)
            
            setCargando(false)
        }, 5000)
    }


    const resetGamer = () =>{{
        setElegido(null);
        setEstado(null);
        setResultado(null);
        setCargando(false)
    }}


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cara O Seca </Text>
            <Text style={styles.text}>Moneda: {point}</Text>
            <View style={styles.imagecontainer}>
                {estado && <Image source={estado} style={styles.image} />}
            </View>
            <Text style={styles.result}>{resultado}</Text>
            <View style={styles.buttoncontainer}>
                <Button
                    title="Cara"
                    onPress={() => setElegido("cara")}
                    disabled={elegido === "seca" || cargando} />
                <Button
                    title="Seca"
                    onPress={() => setElegido("seca")}
                    disabled={elegido === "cara" || cargando} />
            </View>
            <Button
                title="Jugar"
                onPress={TirarMoneda}
                disabled={!elegido || cargando}
            />
        </View>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#f0f025",
        padding: 20
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    text: {
        fontSize: 18
    }, 
    imagecontainer: {
        marginVertical: 20,
    },
    image: {
        width: 100, 
        height: 100
    },
    result: {
        fontSize: 20,
        marginVertical:20,
    },
    buttoncontainer: {
        flexDirection: "row",
        justifyContent: 'space-between',
        width: "60%",
        marginBottom: 20
    }


    
})