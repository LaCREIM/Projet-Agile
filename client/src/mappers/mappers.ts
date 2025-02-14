export const diplomeMapper = (diplome : string) =>{
    const mapping: Record<string, string> = {
        M: "Master",
        L: "Licence",
        D: "Doctorat",
    };

    return mapping[diplome] || "Inconnu";
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