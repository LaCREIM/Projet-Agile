export const diplomeMapper = (diplome : string) =>{
    const mapping: Record<string, string> = {
        M: "Master",
        L: "Licence",
        D: "Doctorat",
    };

    return mapping[diplome] || "Inconnu";
}
export const sexeMapper = (sexe : string) =>{
    const mapping: Record<string, string> = {
        H: "Homme",
        M: "Homme",
        F: "Femme",
    };

    return mapping[sexe] || "Inconnu";
}
export const processusmapper = (pros: string)=>{
    const mapping: Record<string, string> = {
        TUT: "Tutteurs attribués",
        SOUT: "Sessions de soutenance définies",
        RECH: "Recherche en cours",
        EVAL: "Stage évalué",
        EC: "Stage en cours",
    };

    return mapping[pros] || "Inconnu";
}

export const universiteMapper = (code: string): string => {
    const mapping: Record<string, string> = {
        UAE: "Université Abdelmalek Essaâdi",
        UCAM: "Université Cadi Ayyad",
        UCD: "Université Chouaïb Doukkali",
        UH1: "Université Hassan 1er",
        UH2M: "Université Hassan II Mohammedia",
        UIT: "Université Ibn Tofail",
        UIZ: "Université Ibn Zohr",
        UM5A: "Université Mohammed V Agdal",
        USMBA: "Université Sidi Mohammed Ben Abdellah",
    };

    return mapping[code] || "Inconnu";
};

export const etatEvaluationMapper = (etat: string) => {
    const mapping: Record<string, string> = {
        ELA: "En cours d'élaboration",
        CLO: "Clôturée",
        DIS: "Mise en disposition",
    };

    return mapping[etat] || "Inconnu";
}

export const typeQuestionMapper = (type: string) => {
    const mapping: Record<string, string> = {
        QUS: "Standard",
        QUP: "Personnelle",
    };

    return mapping[type] || "Inconnu";
}

export const enseignantMapper = (type: string): string => {
    const mapping: Record<string, string> = {
      MCF: "Maître de Conférences",
      INT: "Intervenant-Extérieur",
      PR: "Professeur des Universités",
      PRAST: "Professionnel Associé",
      PRAG: "Professeur Agrégé",
    };
  
    return mapping[type] || "Type d'enseignant inconnu";
  };
  