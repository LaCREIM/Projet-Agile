// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* tslint:disable */
/* eslint-disable */

// Generated using typescript-generator version 3.2.1263 on 2025-02-05 16:17:29.

export interface Authentification {
    id: number;
    role: string;
    loginConnection: string;
    pseudoConnection: string;
    motPasse: string;
    noEnseignant: Enseignant;
    noEtudiant: Etudiant;
}

export interface PromotionDetails {
    anneeUniversitaire: string;
    codeFormation: string;
}

export interface Candidat {
    noCandidat: string;
    promotion: Promotion;
    nom: string;
    prenom: string;
    sexe: string;
    dateNaissance: Date;
    lieuNaissance: string;
    nationalite: string;
    telephone: string;
    mobile: string;
    email: string;
    adresse: string;
    codePostal: string;
    ville: string;
    paysOrigine: string;
    universiteOrigine: string;
    listeSelection: string;
    selectionNoOrdre: number;
    confirmationCandidat: boolean;
    dateReponseCandidat: Date;
}

export interface CgRefCode {
    id: number;
    rvDomain: string;
    rvLowValue: string;
    rvHighValue: string;
    rvAbbreviation: string;
    rvMeaning: string;
}

export interface DroitId extends Serializable {
    idEvaluation: number;
    noEnseignant: number;
}

export interface Droit {
    idEvaluation: number;
    idEnseignant: number;
    consultation: string;
    duplication: string;
    nom: string;
    prenom: string;
}


export interface Enseignant {
    password: string;
    id: number;
    nom: string;
    prenom: string;
    sexe: string;
    type: string;
    ville: string;
    pays: string;
    mobile: string;
    telephone: string;
    codePostal: string;
    adresse: string;
    emailUbo: string;
    emailPerso: string;
    motPasse: string;
}

export interface EnseignantJn {
    jnOperation: string;
    jnOracleUser: string;
    jnDatetime: Date;
    jnNotes: string;
    jnAppln: string;
    jnSession: number;
    noEnseignant: number;
    type: string;
    sexe: string;
    nom: string;
    prenom: string;
    adresse: string;
    codePostal: string;
    ville: string;
    pays: string;
    mobile: string;
    telephone: string;
    emailUbo: string;
    emailPerso: string;
}

export interface Chercheur {
    encUboEmail: string,
    encUboTel: string,
    encPersoEmail: string,
}

export interface Intervenant {
    intFonction: string;
    intNoInsee: number;
    intSocNom: string;
}

export interface Etudiant {
    noEtudiant: string;
    anneeUniversitaire: string;
    codeFormation: string;
    nom: string;
    prenom: string;
    motPasse: "";
    sexe: string;
    dateNaissance: Date | null;
    lieuNaissance: string;
    nationalite: string;
    telephone: string;
    mobile: string;
    email: string;
    emailUbo: string;
    adresse: string;
    codePostal: string;
    ville: string;
    paysOrigine: string;
    universiteOrigine: string;
    groupeTp: number | null;
    groupeAnglais: number | null;
    [key: string]: any;
}

export interface ElementConstitutif {
    id: ElementConstitutifId;
    uniteEnseignement: UniteEnseignement;
    noEnseignant: Enseignant;
    designation: string;
    description: string;
    nbhCm: number;
    nbhTd: number;
    nbhTp: number;
}


export interface EvaluationDTO {
    idEvaluation: number;
    noEnseignant: number;
    nomEnseignant: string;
    prenomEnseignant: string;
    designationEC: string;
    designationUE: string;
    anneeUniversitaire: string;
    codeFormation: string;
    nomFormation: string;
    designation: string;
    etat: string;
    periode: string;
    debutReponse: string;
    finReponse: string;
    rubriques: RubriqueEvaluation[];
    codeUE:string;
    noEvaluation: number;
}

export interface GetEvaluationDTO {
    evaluation: EvaluationDTO
    droit: Droit
}


interface Evaluation {
    noEvaluation: number;
    codeUE: string; 
    designation: string; 
    debutReponse: string; 
    finReponse: string; 
    etat: string; 
    periode: string; 
};

export interface EtudiantEvaluation{
    anneeUniversitaire: string;
    nomFormation: string;
    evaluations: Evaluation[];
}

export interface Formation {
    codeFormation: string;
    diplome: string;
    n0Annee: boolean;
    nomFormation: string;
    doubleDiplome: boolean;
    debutAccreditation: Date;
    finAccreditation: Date;
}

export interface PromotionId extends Serializable {
    anneeUniversitaire: string;
    codeFormation: string;
}

export interface Promotion {
    id: PromotionId;
    noEnseignant: string;
    siglePromotion: string | null;
    nbMaxEtudiant: number;
    dateReponseLp: Date | null;
    dateReponseLalp: Date | null;
    dateRentree: Date | null;
    lieuRentree: string;
    processusStage: string;
    commentaire: string;
    anneeUniversitaire: string;
    diplome: string;
    nomFormation: string;
    codeFormation: string;
    nom: string;
    prenom: string;
    type: string;
    emailEnseignant: string;
    [key: string]: any;
}

export interface PromotionCreate {
    noEnseignant: string;
    siglePromotion: string;
    nbMaxEtudiant: number;
    dateReponseLp: Date | null;
    dateReponseLalp: Date | null;
    dateRentree: Date | null;
    lieuRentree: string;
    processusStage: string;
    commentaire: string | null;
    anneeUniversitaire: string;
    diplome: string;
    nomFormation: string;
    codeFormation: string;
}

export interface Qualificatif {
    id: number;
    maximal: string;
    minimal: string;
}

export interface QuestionEvaluation {
    id: number;
    idRubriqueEvaluation: RubriqueEvaluation;
    idQuestion: Question;
    qualificatif: Qualificatif;
    ordre: number;
    intitule: string;
}
export interface QuestionP {
    //id: number;4    noEnseignant: Enseignant;
    noEnseignant: number;
   // type: string;
    intitule: string;
    idQualificatif: number;
    maxQualificatif: string;
    minQualificatif: string;
}
export interface Question {
    id: number;
    idQuestion: number;
    noEnseignant: number;
    idQualificatif: Qualificatif;
    maxQualificatif: string;
    minQualificatif: string;
    intitule: string;
    type: string;
}

export interface ReponseEvaluation {
    id: number;
    idEvaluation: Evaluation;
    noEtudiant: Etudiant;
    commentaire: string;
    nom: string;
    prenom: string;
}

export interface ReponseQuestionId extends Serializable {
    idReponseEvaluation: number;
    idQuestionEvaluation: number;
}

export interface ReponseQuestion {
    id: ReponseQuestionId;
    idReponseEvaluation: ReponseEvaluation;
    idQuestionEvaluation: QuestionEvaluation;
    positionnement: number;
}

export interface RubriqueEvaluation {
    id: number;
    idEvaluation: Evaluation;
    idRubrique: Rubrique;
    ordre: number;
    designation: string;
    questions: QuestionEvaluation[];
}

export interface Rubrique {
    id: number;
    type: string;
    noEnseignant: number;
    designation: string;
    ordre: number;
    questions: Question[];
}

export interface RubriqueQuestionId extends Serializable {
    idRubrique: number;
    idQuestion: number;
}

export interface RubriqueQuestion {
    id: RubriqueQuestionId;
    idRubrique: Rubrique;
    idQuestion: Question;
    ordre: number;
}



export interface Serializable {
}

export interface UniteEnseignement {
    codeUE: string;
    codeFormation: Formation;
    noEnseignant: Enseignant;
    designationUE: string;
    semestre: string;
    description: string;
    nbhCm: number;
    nbhTd: number;
    nbhTp: number;
}


export interface PromotionDetails {
    anneePro: string;
    siglePro: string;
}


interface GetReponseEvaluation {
    idReponseEvaluation: number;
    idEvaluation: number;
    commentaire: string;
    nomFormation: string;
    promotion: string;
    idEtudiant: string;
}


export interface StatistiquesDTO {
    idQuestion: number;
    moyennePositionnement: number;
    medianPositionnement: number;
    maximal: string;
    minimal: string;
    nbReponses: number;
    intitule: string;
    designation: string;
    totalPositionnements: number[];
}

export interface ReponseEvaluationDTO {
    idEvaluation: number;
    idEtudiant: string;
    commentaire: string;
    noEnseignant: number;
    nomEnseignant: string;
    prenomEnseignant: string;
    codeFormation: string;
    anneeUniversitaire: string;
    codeUE: string;
    designationUE: string;
    nomFormation: string;
    noEvaluation: number;
    designation: string;
    etat: string;
    periode: string;
    debutReponse: string;
    finReponse: string;
    rubriques: {
        idRubriqueEvaluation: number;
        idRubrique: number;
        designation: string;
        questions: {
            idQuestion: number;
            positionnement: number;
            intitule: string;
            qualificatif: {
                maximal: string;
                minimal: string;
            };
        }[];
    }[];
}