import React, { useState } from "react";
import { motion } from "framer-motion";
import { Chercheur, Enseignant } from "../../types/types";

interface ChercheurInfoProps {
  setChercheur: (c: Chercheur) => void;
  setEnseignant: (e: (prevEnseignant: Enseignant) => Enseignant) => void;
}

const FormVariant = {
  initial: {
    opacity: 0,
    x: 50,
  },
  final: (d: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      delay: 0.1 * d,
    },
  }),
};

const ChercheurInfo = ({ setChercheur, setEnseignant }: ChercheurInfoProps) => {
  const [chercheurInfo, setChercheurInfo] = useState<Chercheur>({
    encUboEmail: "",
    encUboTel: "",
    encPersoEmail: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Mise à jour locale de l'état chercheur
    setChercheurInfo((prev) => {
      const updatedInfo = { ...prev, [name]: value };

      // Mise à jour de l'état parent pour chercheur
      setChercheur(updatedInfo);

      // Synchronisation explicite avec l'objet enseignant
      setEnseignant((prevEnseignant) => ({
        ...prevEnseignant,
        emailUbo: updatedInfo.encUboEmail,
        emailPerso: updatedInfo.encPersoEmail,
        telephone: updatedInfo.encUboTel,
      }));

      return updatedInfo;
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <motion.label
        className="input input-bordered flex items-center gap-2"
        variants={FormVariant}
        initial="initial"
        animate={FormVariant.final(1)}
      >
        <span className="font-semibold">Email UBO</span>
        <input
          required
          type="email"
          name="encUboEmail"
          value={chercheurInfo.encUboEmail}
          onChange={handleChange}
          className="grow"
          placeholder="Ex: JohnDoe@univ-brest.fr"
        />
      </motion.label>
      <motion.label
        className="input input-bordered flex items-center gap-2"
        variants={FormVariant}
        initial="initial"
        animate={FormVariant.final(2)}
      >
        <span className="font-semibold">Email Personnel</span>
        <input
          type="email"
          name="encPersoEmail"
          value={chercheurInfo.encPersoEmail}
          onChange={handleChange}
          className="grow"
          placeholder="Ex: JohnDoe@gmail.com"
        />
      </motion.label>
      <motion.label
        className="input input-bordered flex items-center gap-2"
        variants={FormVariant}
        initial="initial"
        animate={FormVariant.final(3)}
      >
        <span className="font-semibold">Numéro téléphone</span>
        <input
          type="tel"
          name="encUboTel"
          value={chercheurInfo.encUboTel}
          onChange={handleChange}
          className="grow"
          placeholder="Ex: 0700000000"
          pattern="[0-9]{10}"
        />
      </motion.label>
    </div>
  );
};

export default ChercheurInfo;
