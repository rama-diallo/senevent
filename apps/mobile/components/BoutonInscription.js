import { useState, useEffect } from "react";
import { Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";
import { estInscrit, inscrire, desinscrire } from "@senevent/shared";
import { useAuth } from "../context/AuthContext";

export default function BoutonInscription({ evenementId }) {
  const { session } = useAuth();
  const [inscrit, setInscrit] = useState(false);
  const [chargement, setChargement] = useState(true);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    const verifier = async () => {
      if (!session) {
        setChargement(false);
        return;
      }
      const resultat = await estInscrit(evenementId, session.user.id);
      setInscrit(resultat);
      setChargement(false);
    };
    verifier();
  }, [evenementId, session]);

  if (!session) {
    return (
      <Text style={styles.info}>
        Connectez-vous (onglet Profil) pour vous inscrire.
      </Text>
    );
  }

  if (chargement) {
    return <ActivityIndicator color="#1a3a5c" style={styles.marge} />;
  }

  const basculer = async () => {
    setErreur(null);
    setEnCours(true);
    try {
      if (inscrit) {
        await desinscrire(evenementId, session.user.id);
        setInscrit(false);
      } else {
        await inscrire(evenementId, session.user.id);
        setInscrit(true);
      }
    } catch (e) {
      setErreur(e.message);
    } finally {
      setEnCours(false);
    }
  };

  return (
    <>
      <Pressable
        style={[styles.bouton, inscrit ? styles.desinscrire : styles.inscrire]}
        onPress={basculer}
        disabled={enCours}
      >
        <Text style={styles.texte}>
          {enCours
            ? "..."
            : inscrit
            ? "Se desinscrire"
            : "S'inscrire a cet evenement"}
        </Text>
      </Pressable>
      {erreur && <Text style={styles.erreur}>{erreur}</Text>}
    </>
  );
}

const styles = StyleSheet.create({
  bouton: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  inscrire: { backgroundColor: "#1f6b2c" },
  desinscrire: { backgroundColor: "#ea7d2b" },
  texte: { color: "#fff", fontSize: 16, fontWeight: "600" },
  info: {
    color: "#666",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
  marge: { marginTop: 20 },
  erreur: { color: "#a01a1a", textAlign: "center", marginTop: 12 },
});
