import { Link } from "react-router-dom";

const NonTrouvee = () => (
  <div style={{ textAlign: "center", marginTop: "3rem" }}>
    <h2>Page introuvable</h2>
    <Link to="/">Retour à l'accueil</Link>
  </div>
);

export default NonTrouvee;