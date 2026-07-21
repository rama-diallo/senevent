import { useState, useEffect } from "react";
import { estInscrit, inscrire, desinscrire } from "@senevent/shared";
import styles from "./BoutonInscription.module.css";

const BoutonInscription = ({ evenementId, session }) => {
  const [inscrit, setInscrit] = useState(false);
  const [chargement, setChargement] = useState(true);

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

  const sInscrireClick = async () => {
    try {
      await inscrire(evenementId, session.user.id);
      setInscrit(true);
    } catch (error) {
      console.error(error);
    }
  };

  const seDesinscrireClick = async () => {
    try {
      await desinscrire(evenementId, session.user.id);
      setInscrit(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (!session) {
    return <p className={styles.info}>Connectez-vous pour vous inscrire.</p>;
  }

  if (chargement) {
    return <p className={styles.info}>...</p>;
  }

  return inscrit ? (
    <button onClick={seDesinscrireClick} className={styles.desinscrire}>
      Se désinscrire
    </button>
  ) : (
    <button onClick={sInscrireClick} className={styles.inscrire}>
      S'inscrire
    </button>
  );
};

export default BoutonInscription;
