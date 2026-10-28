import { useState, useCallback } from "react";
import {
  View, Text, TextInput, Pressable, StyleSheet, FlatList,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import {
  seConnecter, sInscrire, seDeconnecter, mesInscriptions,
} from "@senevent/shared";
import { useAuth } from "../../context/AuthContext";

export default function Profil() {
  const { session, chargement } = useAuth();

  // Si la session est encore en cours de chargement
  if (chargement) {
    return (
      <ActivityIndicator size="large" color="#1a3a5c" style={styles.centre} />
    );
  }

  // Si connecte : email + inscriptions + deconnexion
  if (session) {
    return <ProfilConnecte session={session} />;
  }

  // Sinon : le formulaire de connexion / inscription
  return <FormulaireAuth />;
}

function ProfilConnecte({ session }) {
  const router = useRouter();
  const [inscriptions, setInscriptions] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  // Recharger a chaque fois que l'onglet redevient visible
  useFocusEffect(
    useCallback(() => {
      const charger = async () => {
        try {
          const data = await mesInscriptions(session.user.id);
          setInscriptions(data);
          setErreur(null);
        } catch (e) {
          setErreur(e.message);
        } finally {
          setChargement(false);
        }
      };
      charger();
    }, [session.user.id])
  );

  const formaterDate = (iso) =>
    iso ? new Date(iso).toLocaleString("fr-FR") : "Date non precisee";

  return (
    <View style={styles.containerHaut}>
      <Text style={styles.titre}>Mon profil</Text>
      <Text style={styles.email}>{session.user.email}</Text>

      <Text style={styles.sousTitre}>Mes inscriptions</Text>

      {chargement ? (
        <ActivityIndicator color="#1a3a5c" style={styles.marge} />
      ) : erreur ? (
        <Text style={styles.erreur}>{erreur}</Text>
      ) : (
        <FlatList
          style={styles.liste}
          data={inscriptions}
          keyExtractor={(item) => item.evenement_id.toString()}
          ListEmptyComponent={
            <Text style={styles.vide}>
              Vous n'etes inscrite a aucun evenement.
            </Text>
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.carte}
              onPress={() => router.push(`/evenement/${item.evenement_id}`)}
            >
              <Text style={styles.carteTitre}>
                {item.evenements?.titre ?? "Evenement supprime"}
              </Text>
              <Text style={styles.carteDate}>
                {formaterDate(item.evenements?.date_debut)}
              </Text>
            </Pressable>
          )}
        />
      )}

      <Pressable style={styles.boutonDeco} onPress={() => seDeconnecter()}>
        <Text style={styles.boutonTexte}>Se deconnecter</Text>
      </Pressable>
      <Text style={styles.auteur}>Realise par Ramatoulaye Diallo</Text>
    </View>
  );
}

function FormulaireAuth() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState(null);
  const [enCours, setEnCours] = useState(false);

  const soumettre = async () => {
    setErreur(null);
    setEnCours(true);
    try {
      if (mode === "signup") {
        await sInscrire(email, motDePasse);
      } else {
        await seConnecter(email, motDePasse);
      }
      // La session se met a jour toute seule via onAuthStateChange
    } catch (e) {
      setErreur(e.message);
    } finally {
      setEnCours(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.titre}>
        {mode === "signup" ? "Creer un compte" : "Se connecter"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={motDePasse}
        onChangeText={setMotDePasse}
      />

      {erreur && <Text style={styles.erreur}>{erreur}</Text>}

      <Pressable style={styles.bouton} onPress={soumettre} disabled={enCours}>
        <Text style={styles.boutonTexte}>
          {enCours
            ? "..."
            : mode === "signup"
            ? "Creer le compte"
            : "Se connecter"}
        </Text>
      </Pressable>

      <Pressable onPress={() => setMode(mode === "signup" ? "login" : "signup")}>
        <Text style={styles.basculer}>
          {mode === "signup"
            ? "Deja un compte ? Se connecter"
            : "Pas de compte ? En creer un"}
        </Text>
      </Pressable>

      <Text style={styles.auteur}>Realise par Ramatoulaye Diallo</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#f0f4f8",
  },
  containerHaut: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f0f4f8",
  },
  centre: { marginTop: 40 },
  marge: { marginVertical: 20 },
  titre: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a3a5c",
    marginBottom: 12,
    textAlign: "center",
  },
  email: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  sousTitre: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a3a5c",
    marginBottom: 8,
  },
  liste: { flexGrow: 0, maxHeight: 320, marginBottom: 20 },
  carte: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#ea7d2b",
  },
  carteTitre: { fontSize: 15, fontWeight: "600", color: "#1a3a5c" },
  carteDate: { fontSize: 13, color: "#666", marginTop: 2 },
  vide: {
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 16,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  bouton: {
    backgroundColor: "#1a3a5c",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
  },
  boutonDeco: {
    backgroundColor: "#ea7d2b",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  boutonTexte: { color: "#fff", fontSize: 16, fontWeight: "600" },
  basculer: { color: "#3949ab", textAlign: "center", marginTop: 16 },
  erreur: { color: "#a01a1a", textAlign: "center", marginBottom: 12 },
  auteur: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginTop: 32,
  },
});
