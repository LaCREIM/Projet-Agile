import React, { useState } from "react";
import { Intervenant } from "../../types/types";
import { motion } from "framer-motion";

interface IntervenantInfoProps {
  setIntervenant: (c: Intervenant) => void;
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

const IntervenantInfo = ({ setIntervenant }: IntervenantInfoProps) => {
  const [intervenantInfo, setIntervenantInfo] = useState<Intervenant>({
    intFonction: "",
    intNoInsee: 0,
    intSocNom: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setIntervenantInfo((prev) => ({ ...prev, [name]: value }));
    setIntervenant(intervenantInfo as Intervenant);
  };
  return (
    <div className="flex flex-col gap-5">
      <motion.label
        className="input input-bordered flex items-center gap-2"
        variants={FormVariant}
        initial="initial"
        animate={FormVariant.final(1)}
      >
        <span className="font-semibold">No INSEE</span>
        <input
          required
          type="number"
          name="intNoInsee"
          value={intervenantInfo.intNoInsee}
          onChange={handleChange}
          className="grow"
          placeholder="Ex: 09639"
        />
      </motion.label>
      <motion.label
        variants={FormVariant}
        initial="initial"
        animate={FormVariant.final(2)}
        className="input input-bordered flex items-center gap-2"
      >
        <span className="font-semibold">Fonction</span>
        <input
          required
          type="string"
          name="intFonction"
          value={intervenantInfo.intFonction}
          onChange={handleChange}
          className="grow"
          placeholder="Ex: Enseignant"
        />
      </motion.label>

      <motion.label
        variants={FormVariant}
        initial="initial"
        animate={FormVariant.final(3)}
        className="input input-bordered flex items-center gap-2"
      >
        <span className="font-semibold">Société</span>
        <input
          required
          type="text"
          name="intSocNom"
          value={intervenantInfo.intSocNom}
          onChange={handleChange}
          className="grow"
          placeholder="Ex: 29200"
        />
      </motion.label>
    </div>
  );
};

export default IntervenantInfo;
