import React, {FormEvent, useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks/hooks";
import {
    getFormationAsync,
    postPromotionsAsync,
    getFormations,
    getDomaineLieuEntreeAsync,
    Domaine,
    getSalles,
    getProcessusStages,
    getDomaineProcessusStageAsync,
    getDomaineDiplomeAsync,
    anneesUniv,
} from "../../features/PromotionSlice";

import {Enseignant, Formation, PromotionCreate} from "../../types/types";

interface AddPromotionProps {
    dispatchPromotion: () => void;
    enseignants: Enseignant[];
    onClose: () => void;
}

const initialErrors = {
    dateError: null as string | null,
    telephoneError: null as string | null,
    mobileError: null as string | null,
    groupeTpError: null as string | null,
    groupeAnglaisError: null as string | null,
    emailError: null as string | null,
    emailUboError: null as string | null,
}

const AddPromotion = ({
                          dispatchPromotion,
                          enseignants,
                          onClose,
                      }: AddPromotionProps) => {
    const dispatch = useAppDispatch();

    const formations = useAppSelector<Formation[]>(getFormations);
    const salles = useAppSelector<Domaine[]>(getSalles);
    const processusStage = useAppSelector<Domaine[]>(getProcessusStages);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState(initialErrors);

    const initialPromotionState: PromotionCreate = {
        noEnseignant: "",
        siglePromotion: "",
        nbMaxEtudiant: 0,
        dateReponseLp: null,
        dateReponseLalp: null,
        dateRentree: null,
        lieuRentree: "",
        processusStage: "",
        commentaire: "",
        anneeUniversitaire: "",
        diplome: "",
        codeFormation: "",
        nomFormation: "",
    };

    const [promotion, setPromotion] = useState<PromotionCreate>(
        initialPromotionState
    );

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const {name, value} = e.target;
        setPromotion({...promotion, [name]: value});
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const requiredFields = [
            "siglePromotion",
            "nbMaxEtudiant",
            "anneeUniversitaire",
            "codeFormation",
        ];

        const newErrors = {
            dateError: null,
            telephoneError: null,
            mobileError: null,
            groupeTpError: null,
            groupeAnglaisError: null,
            emailError: null,
            emailUboError: null,
        };

        const emptyFields = requiredFields.filter((field) => !promotion[field]);

        if (emptyFields.length > 0) {
            newErrors.dateError = "Merci de remplir tous les champs obligatoires";
        }

        const dateReponseLp = promotion.dateReponseLp
            ? new Date(promotion.dateReponseLp)
            : null;
        const dateRentree = promotion.dateRentree
            ? new Date(promotion.dateRentree)
            : null;
        const dateReponseLalp = promotion.dateReponseLalp
            ? new Date(promotion.dateReponseLalp)
            : null;
        const today = new Date();

        if (dateReponseLp && dateReponseLp <= today) {
            newErrors.dateError =
                "La date limite de réponse pour la liste principale doit être dans le futur ou le présent.";
        }

        if (dateRentree && dateRentree < today) {
            newErrors.dateError =
                "La date de rentrée doit être dans le futur ou le présent.";
        }

        if (dateReponseLalp && dateReponseLalp < today) {
            newErrors.dateError =
                "La date limite de réponse pour la liste d'attente doit être dans le futur ou le présent.";
        }
        if (promotion.nbMaxEtudiant < 0 || promotion.nbMaxEtudiant > 1000) {
            newErrors.telephoneError =
                "Le nombre maximal d'étudiants doit être compris entre 0 et 1000.";
        }

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error !== null)) {
            return;
        }

        const response = await dispatch(postPromotionsAsync(promotion));
        if (response.meta.requestStatus === "rejected") {
            const errorMessage = Object.values(response.payload).join(", ");
            setError(errorMessage);
        }
        dispatchPromotion();
        setPromotion(initialPromotionState);
        setErrors({
            dateError: null,
            telephoneError: null,
            mobileError: null,
            groupeTpError: null,
            groupeAnglaisError: null,
            emailError: null,
            emailUboError: null,
        });
        onClose();
    };

    useEffect(() => {
        dispatch(getFormationAsync());
        dispatch(getDomaineLieuEntreeAsync());
        dispatch(getDomaineProcessusStageAsync());
        dispatch(getDomaineDiplomeAsync());
    }, [dispatch]);

    console.log(errors)

    const formatDate = (date: string | Date | null) => {
        if (date === null) return "";
        return date instanceof Date ? date.toISOString().split("T")[0] : date;
    };

    function handleClose() {
        onClose()
        setErrors(initialErrors)
        setError(null)
        setPromotion(initialPromotionState);
    }

    return (
        <>
            <div className="flex justify-center items-center w-full h-screen backdrop-blur-sm">
                <div className="modal-box w-[50em] max-w-5xl">
                    <h3 className="font-bold text-lg my-4 text-center">
                        Ajouter une promotion
                    </h3>
                    <form onSubmit={handleSubmit}>

                        <div className="flex flex-col gap-5">
                            <div className="flex flex-row justify-between">
                                <label className="input input-bordered flex items-center gap-2">
                                    <span className="font-semibold">Sigle </span>
                                    <span className="text-red-500">*</span>
                                    <input
                                        required
                                        type="text"
                                        name="siglePromotion"
                                        value={promotion.siglePromotion}
                                        onChange={handleChange}
                                        className="grow"
                                        placeholder="Ex: DOSI"
                                    />
                                </label>
                            </div>
                            <div className="flex flex-row justify-between">
                                <label className="input input-bordered flex items-center gap-2">
                  <span className="font-semibold">
                    Nombre des étudiants <span className="text-red-500">*</span>
                  </span>
                                    <input
                                        min={0}
                                        max={1000}
                                        required
                                        type="number"
                                        name="nbMaxEtudiant"
                                        value={promotion.nbMaxEtudiant}
                                        onChange={handleChange}
                                        className="grow"
                                        placeholder="Ex: 25"
                                    />
                                </label>

                                <label className="input input-bordered flex items-center gap-2">
                                    <span className="font-semibold">Date rentrée</span>
                                    <input
                                        type="date"
                                        name="dateRentree"
                                        value={formatDate(promotion.dateRentree)}
                                        onChange={handleChange}
                                        className="grow"
                                        placeholder="Ex: 2022-09-01"
                                    />
                                </label>
                            </div>
                            <label className="flex flex-row items-center gap-2">
                <span className="font-semibold w-[15%]">
                  Année<span className="text-red-500"> *</span>
                </span>
                                <select
                                    className="select w-[80%] max-w-full"
                                    name="anneeUniversitaire"
                                    required
                                    value={promotion.anneeUniversitaire}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>
                                        Sélectionnez une année universitaire
                                    </option>
                                    {anneesUniv.map((a, idx) => (
                                        <option key={idx} value={a}>
                                            {a}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="flex flex-row items-center gap-2">
                                <span className="font-semibold w-[15%]">Lieu rentrée</span>
                                <select
                                    className="select w-[80%] max-w-full"
                                    name="lieuRentree"
                                    value={promotion.lieuRentree}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>
                                        Sélectionnez une salle
                                    </option>
                                    {salles.map((salle) => (
                                        <option key={salle.rvLowValue} value={salle.rvLowValue}>
                                            {salle.rvMeaning}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="flex flex-row items-center gap-2">
                <span className="font-semibold w-[15%]">
                  Formation <span className="text-red-500">*</span>
                </span>
                                <select
                                    className="select w-[80%] max-w-full"
                                    name="codeFormation"
                                    value={promotion.codeFormation}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>
                                        Sélectionnez une formation
                                    </option>
                                    {formations.map((formation) => (
                                        <option
                                            key={formation.codeFormation}
                                            value={formation.codeFormation}
                                        >
                                            {formation.nomFormation}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="flex flex-row items-center gap-2">
                                <span className="font-semibold w-[15%]">Responsable</span>
                                <select
                                    className="select w-[80%] max-w-full"
                                    name="noEnseignant"
                                    value={promotion.noEnseignant}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>
                                        Sélectionnez un responsable
                                    </option>
                                    {enseignants.map((ens) => (
                                        <option key={ens.id} value={ens.id}>
                                            {ens.nom.toUpperCase()} {ens.prenom}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="flex flex-row items-center gap-2">
                                <span className="font-semibold w-[15%]">Stage</span>
                                <select
                                    className="select w-[80%] max-w-full"
                                    name="processusStage"
                                    value={promotion.processusStage}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>
                                        Sélectionnez un état
                                    </option>
                                    {processusStage.map((ps) => (
                                        <option key={ps.rvLowValue} value={ps.rvLowValue}>
                                            {ps.rvMeaning}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <div className="flex flex-col gap-2 border-2 border-gray-300 rounded-lg  p-2">
                                <label className="font-semibold text-center">
                                    Date limite de réponse pour la liste
                                </label>
                                <div className="flex flex-row items-center gap-2">
                                    <span className="font-semibold w-[15%]">Principale</span>
                                    <input
                                        type="date"
                                        name="dateReponseLp"
                                        value={formatDate(promotion.dateReponseLp)}
                                        onChange={handleChange}
                                        className="input input-bordered w-[80%] max-w-full"
                                    />
                                </div>
                                <div className="flex flex-row items-center gap-2">
                                    <span className="font-semibold w-[15%]">Attente</span>
                                    <input
                                        type="date"
                                        name="dateReponseLalp"
                                        value={formatDate(promotion.dateReponseLalp)}
                                        onChange={handleChange}
                                        className="input input-bordered w-[80%] max-w-full"
                                    />
                                </div>
                            </div>
                            <label className="flex flex-row items-center gap-2">
                                <span className="font-semibold w-[15%]">Commentaire</span>
                                <textarea
                                    name="commentaire"
                                    value={promotion.commentaire}
                                    onChange={handleChange}
                                    className="textarea textarea-bordered w-[80%] max-w-full"
                                    placeholder="Ajoutez un commentaire"
                                    maxLength={255}
                                />
                            </label>
                        </div>
                    </form>
                    {/* Affichage des erreurs */}
                    {error && <div className="text-red-500 text-sm mb-4 mt-2">{error}</div>}
                    <div className="modal-action">
                        <button className="btn" onClick={handleClose}>Annuler</button>
                        <button
                            className="btn btn-neutral"
                            onClick={handleSubmit}
                            disabled={Object.values(errors).some((error) => error !== null)}
                        >
                            Ajouter
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddPromotion;