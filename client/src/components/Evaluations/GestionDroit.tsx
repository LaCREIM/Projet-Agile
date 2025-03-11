import { useState } from "react";
import { MdCheck } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

// Définir les types
type Enseignant = {
  id: number;
  nom: string;
  duplication: boolean;
  consultation: boolean;
};

type EnseignantDisponible = {
  id: number;
  nom: string;
};

interface GestionDroitProps {
    onClose: () => void;
}

const GestionDroit = ({ onClose} : GestionDroitProps) => {
  const [enseignants, setEnseignants] = useState<Enseignant[]>([
    { id: 1, nom: "Enseignant 1", duplication: true, consultation: false },
    { id: 2, nom: "Enseignant 2", duplication: false, consultation: true },
    { id: 3, nom: "Enseignant 3", duplication: true, consultation: true },
  ]);

  // Liste des enseignants disponibles pour l'ajout
  const [enseignantsDisponibles, setEnseignantsDisponibles] = useState<
    EnseignantDisponible[]
  >([
    { id: 4, nom: "Enseignant 4" },
    { id: 5, nom: "Enseignant 5" },
    { id: 6, nom: "Enseignant 6" },
  ]);

  const [editionMode, setEditionMode] = useState<boolean>(false);
  const [enseignantSelectionne, setEnseignantSelectionne] =
    useState<EnseignantDisponible | null>(null);
  const [droitsAjout, setDroitsAjout] = useState<{
    duplication: boolean;
    consultation: boolean;
  }>({
    duplication: false,
    consultation: false,
  });

  const toggleEditionMode = () => {
    setEditionMode(!editionMode);
  };

  const handleClose  = () => {
    setEditionMode(!editionMode);
    onClose();
  }

  

  const handleDroitChange = (id: number, droit: keyof Enseignant) => {
    const updatedEnseignants = enseignants.map((ens) =>
      ens.id === id ? { ...ens, [droit]: !ens[droit] } : ens
    );
    setEnseignants(updatedEnseignants);
  };

  const validerModifications = () => {
    setEditionMode(false);
    console.log("Modifications validées:", enseignants);
  };

  const annulerModifications = () => {
    setEditionMode(false);
    onClose();
    console.log("Modifications annulées");
  };

  const handleAjoutEnseignant = () => {
    if (enseignantSelectionne) {
      const nouvelEnseignant: Enseignant = {
        id: enseignantSelectionne.id,
        nom: enseignantSelectionne.nom,
        duplication: droitsAjout.duplication,
        consultation: droitsAjout.consultation,
      };
      setEnseignants([...enseignants, nouvelEnseignant]);
      setEnseignantsDisponibles(
        enseignantsDisponibles.filter(
          (ens) => ens.id !== enseignantSelectionne.id
        )
      );
      setEnseignantSelectionne(null);
      setDroitsAjout({ duplication: false, consultation: false });
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="modal-box w-[50em] max-w-5xl">
        <h3 className="font-bold text-lg my-4">Gérer les droits d'accès</h3>

        {/* Section pour ajouter un enseignant */}
        <div className="flex flex-row gap-3 w-full justify-between items-center mb-4">
          <select
            className="select select-bordered w-full max-w-xs"
            value={enseignantSelectionne ? enseignantSelectionne.id : ""}
            onChange={(e) => {
              const selectedId = parseInt(e.target.value);
              const selectedEnseignant = enseignantsDisponibles.find(
                (ens) => ens.id === selectedId
              );
              setEnseignantSelectionne(selectedEnseignant || null);
            }}
          >
            <option value="" disabled>
              Sélectionnez un enseignant
            </option>
            {enseignantsDisponibles.map((ens) => (
              <option key={ens.id} value={ens.id}>
                {ens.nom}
              </option>
            ))}
          </select>

          <div className="flex flex-row gap-10 w-full">
            <label className="label cursor-pointer">
              <span className="label-text mr-2">Duplication</span>
              <input
                type="checkbox"
                disabled={!enseignantSelectionne}
                checked={droitsAjout.duplication}
                onChange={(e) =>
                  setDroitsAjout({
                    ...droitsAjout,
                    duplication: e.target.checked,
                  })
                }
                className="checkbox checkbox-sm"
              />
            </label>
            <label className="label cursor-pointer">
              <span className="label-text mr-2">Consultation</span>
              <input
                type="checkbox"
                disabled={!enseignantSelectionne}
                checked={droitsAjout.consultation}
                onChange={(e) =>
                  setDroitsAjout({
                    ...droitsAjout,
                    consultation: e.target.checked,
                  })
                }
                className="checkbox checkbox-sm"
              />
            </label>
          </div>

          <button
            className="btn btn-circle btn-sm"
            onClick={handleAjoutEnseignant}
            disabled={!enseignantSelectionne}
          >
            +
          </button>
        </div>

        {/* Tableau des enseignants */}
        <table className="table w-full">
          <thead>
            <tr>
              <th>Enseignant</th>
              <th>Duplication</th>
              <th>Consultation</th>
            </tr>
          </thead>
          <tbody>
            {enseignants.map((ens) => (
              <tr key={ens.id}>
                <td>{ens.nom}</td>
                <td>
                  {editionMode ? (
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={ens.duplication}
                      onChange={() => handleDroitChange(ens.id, "duplication")}
                    />
                  ) : ens.duplication ? (
                    <MdCheck size={20} className="font-bold" />
                  ) : (
                    <RxCross2 size={20} className="font-bold" />
                  )}
                </td>
                <td>
                  {editionMode ? (
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={ens.consultation}
                      onChange={() => handleDroitChange(ens.id, "consultation")}
                    />
                  ) : ens.consultation ? (
                    <MdCheck size={20} className="font-bold" />
                  ) : (
                    <RxCross2 size={20} className="font-bold" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Boutons de gestion */}
        <div className="modal-action flex flex-row gap-3 justify-end mt-4">
          {editionMode ? (
            <>
              <button
                className="btn btn-neutral"
                onClick={validerModifications}
              >
                Valider
              </button>
              <button className="btn" onClick={annulerModifications}>
                Annuler
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-neutral" onClick={toggleEditionMode}>
                Modifier les droits
              </button>
              <button className="btn" onClick={handleClose}>
                Fermer
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionDroit;
