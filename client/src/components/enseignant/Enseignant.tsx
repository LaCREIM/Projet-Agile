import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { getEnseignants, createEnseignant, removeEnseignant } from "../../redux/EnseignantSlice";

const EnseignantList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { enseignants, loading, error } = useSelector((state: RootState) => state.enseignants);

    const [newEnseignant, setNewEnseignant] = useState({
        noEnseignant: 0,
        type: "",
        nom: "",
        prenom: "",
        sexe: "",
        adresse: "",
        email: "",
        cp: "",
        telPort: "",
        pays: "",
        encUboTel: 0,
        encUboEmail: "",
        encPersoEmail: "",
        intFonction: "",
        intNoInsee: 0,
        intSocNom: "",
    });

    useEffect(() => {
        dispatch(getEnseignants()); // Charger les enseignants au montage
    }, [dispatch]);

    const handleAddEnseignant = () => {
        if (newEnseignant.nom && newEnseignant.prenom) {
            dispatch(createEnseignant(newEnseignant));
            setNewEnseignant({
                noEnseignant: 0,
                type: "",
                nom: "",
                prenom: "",
                sexe: "",
                adresse: "",
                email: "",
                cp: "",
                telPort: "",
                pays: "",
                encUboTel: 0,
                encUboEmail: "",
                encPersoEmail: "",
                intFonction: "",
                intNoInsee: 0,
                intSocNom: "",
            });
            
        }
    };

    const handleDelete = (id: number) => {
        dispatch(removeEnseignant(id));
    };

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>Erreur : {error}</p>;

    return (
        <div>
            <h2>Liste des Enseignants</h2>
            <ul>
                {enseignants.map((ens) => (
                    <li key={ens.noEnseignant}>
                        {ens.nom} {ens.prenom} - {ens.email}
                        <button onClick={() => handleDelete(ens.noEnseignant)}>Supprimer</button>
                    </li>
                ))}
            </ul>

            <h3>Ajouter un Enseignant</h3>
            <input
                type="text"
                placeholder="Nom"
                value={newEnseignant.nom}
                onChange={(e) => setNewEnseignant({ ...newEnseignant, nom: e.target.value })}
            />
            <input
                type="text"
                placeholder="Prénom"
                value={newEnseignant.prenom}
                onChange={(e) => setNewEnseignant({ ...newEnseignant, prenom: e.target.value })}
            />
            <input
                type="email"
                placeholder="Email"
                value={newEnseignant.email}
                onChange={(e) => setNewEnseignant({ ...newEnseignant, email: e.target.value })}
            />
            <button onClick={handleAddEnseignant}>Ajouter</button>
        </div>
    );
};

export default EnseignantList;
