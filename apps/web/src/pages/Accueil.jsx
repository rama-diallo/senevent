import { useState, useEffect } from "react";
import EvenementCarte from "../components/EvenementCarte";
import SearchBar from "../components/SearchBar";
import EtatChargement from "../components/EtatChargement";
import styles from "./Accueil.module.css";

const Accueil = ({ evenements, chargement, erreur, onReessayer }) => {
  const [recherche, setRecherche] = useState("");

  const evenementsFiltres = evenements.filter(ev =>
    ev.titre.toLowerCase().includes(recherche.toLowerCase())
  );

  useEffect(() => {
    if (evenementsFiltres.length > 0) {
      document.title = `(${evenementsFiltres.length}) SenEvent`;
    } else {
      document.title = "SenEvent";
    }
  }, [evenementsFiltres.length]);

  // Bonus : mesurer le temps passé sur la page
  useEffect(() => {
    const debut = Date.now();
    return () => {
      const duree = Date.now() - debut;
      console.log("Temps sur la page :", duree, "ms");
    };
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.titre}>SenEvent — Evenements a Dakar</h1>
      <EtatChargement
        chargement={chargement}
        erreur={erreur}
        onReessayer={onReessayer}
      />
      {!chargement && !erreur && (
        <>
          <SearchBar recherche={recherche} onRecherche={setRecherche} />
          <p className={styles.compteur}>
            {evenementsFiltres.length} evenement(s) trouve(s)
          </p>
          {evenementsFiltres.length === 0 ? (
            <p className={styles.messageVide}>
              Aucun evenement ne correspond.
            </p>
          ) : (
            evenementsFiltres.map(ev => (
              <EvenementCarte key={ev.id} ev={ev} afficherDetails={true} />
            ))
          )}
        </>
      )}
    </div>
  );
};

export default Accueil;