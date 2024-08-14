import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { doc, updateDoc, increment, getDocs, query, where, collection } from "firebase/firestore";
import { auth , db} from "../database/firebase_cong";


export default function Scoore() {
    const [userDocId, setUserDocId] = useState(null);
    const [moneda1, setMoneda1] = useState(0)
    const [moneda2, setMoneda2] = useState(0)
    const [moneda3, setMoneda3] = useState(0)
    const [moneda4, setMoneda4] = useState(0)
    const [moneda5, setMoneda5] = useState(0)

    const rest = [moneda1 + moneda2 + moneda3 + moneda4 + moneda5]

    useEffect(() =>{
        const loadUserPoints = async () =>{
            const user = auth.currentUser
            if (user){
                try{
                    const q = query(collection(db, "User_new"), where("email", "==", user.email))
                    const querySnapshot = await getDocs(q)
                    if (!querySnapshot.empty){
                        const userDoc = querySnapshot.docs[0]
                        setMoneda1(userDoc.data().moneda1 || 0)
                        setMoneda2(userDoc.data().moneda2 || 0)
                        setMoneda3(userDoc.data().moneda3 || 0)
                        setMoneda4(userDoc.data().moneda4 || 0)
                        setMoneda5(userDoc.data().moneda5 || 0)
                        setUserDocId(userDoc.data().user)
                    } else { 
                        console.log("No user Data found")
                    }
                }catch (error){
                    console.error("Error Fetching  user data", error)
                }
            }else {
                Alert.alert("Errro", "No se encontro un usuario autenticado")
            }
        }
        loadUserPoints()
    },[])


    return (
        <View styles={styles.color}>
            <Text >SCOORE</Text>
            <View>
                <Text>User: {userDocId}</Text>
                <Text>Puntuacion</Text>
                <View>
                    <Text>Game 1: {moneda1}</Text>
                    <Text>Game 2: {moneda2}</Text>
                    <Text>Game 3: {moneda3}</Text>
                    <Text>Game 4: {moneda4}</Text>
                    <Text>Game 5: {moneda1}</Text>
                    <Text>Total de Coin: {rest}</Text>
                </View>
            </View>
            
        </View>

    )
}
const styles = StyleSheet.create({
    color:{
        backgroundColor: "#ff1002"
    }
})