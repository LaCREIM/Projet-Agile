import React, {FormEvent, useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks/hooks";
import {
    anneesUniv,
    Domaine,
    getDomaineDiplomeAsync,
    getDomaineLieuEntreeAsync,
    getDomaineProcessusStageAsync,
    getFormationAsync,
    getFormations,
    getProcessusStages,
    getSalles,
    postPromotionsAsync,
} from "../../features/PromotionSlice";

import {Enseignant, Formation, PromotionCreate} from "../../types/types";
import AlertError from "../ui/alert-error.tsx";

interface AddPromotionProps {
    dispatchPromotion: () => void;
    enseignants: Enseignant[];
    onClose: () => void;
}

const initialErrors = {
    dateError: null as string | null,
    nombreEtudiantMax: null as string | null,
    mobileError: null as string | null,
    groupeTpError: null as string | null,
    groupeAnglaisError: null as string | null,
    emailError: null as string | null,
    emailUboError: null as string | null,
    siglePromotionError: null as string | null,
};

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
        processusStage: "RECH",
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

        const newErrors = {...errors};

        if (name === "siglePromotion") {
            const alphanumericRegex = /^[a-zA-Z0-9]*$/;
            if (!alphanumericRegex.test(value)) {
                newErrors.siglePromotionError = "Seuls les caractères alphanumériques sont autorisés.";
            } else {
                newErrors.siglePromotionError = null;
            }
        }

        if (name === "nbMaxEtudiant") {
            const nbMaxEtudiant = Number(value); // Convert value to number

            if (!Number.isInteger(nbMaxEtudiant)) {
                newErrors.nombreEtudiantMax = "Le nombre maximal d'étudiants doit être un entier.";
            } else if (nbMaxEtudiant < 0 || nbMaxEtudiant > 1000) {
                newErrors.nombreEtudiantMax = "Le nombre maximal d'étudiants doit être compris entre 0 et 1000.";
            } else {
                newErrors.nombreEtudiantMax = null;
            }
        }

        if (name === "dateReponseLp" || name === "dateRentree" || name === "dateReponseLalp") {
            const dateValue = new Date(value);
            const today = new Date();
            if (dateValue <= today) {
                newErrors.dateError = "La date doit être dans le futur ou le présent.";
            } else {
                newErrors.dateError = null;
            }
        }

        setErrors(newErrors);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (Object.values(errors).some((error) => error !== null)) {
            return;
        }

        const response = await dispatch(postPromotionsAsync(promotion));
        if (response.meta.requestStatus === "rejected") {
            const errorMessage = Object.values(response.payload).join(" et ");
            setError(errorMessage);
            return
        }
        dispatchPromotion();
        setPromotion(initialPromotionState);
        setErrors(initialErrors);
        setError(null)
        onClose();
    };

    useEffect(() => {
        dispatch(getFormationAsync());
        dispatch(getDomaineLieuEntreeAsync());
        dispatch(getDomaineProcessusStageAsync());
        dispatch(getDomaineDiplomeAsync());
    }, [dispatch]);

    const formatDate = (date: string | Date | null) => {
        if (date === null) return "";
        return date instanceof Date ? date.toISOString().split("T")[0] : date;
    };

    function handleClose() {
        onClose();
        setErrors(initialErrors);
        setError(null);
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
                            <div className="flex flex-col gap-1">
                                <label className="input input-bordered flex items-center gap-2 w-[95%]">
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
                                {errors.siglePromotionError && (
                                    <p className="text-red-500 text-sm">{errors.siglePromotionError}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-1 ">
                                <label className="input input-bordered flex items-center gap-2 w-[95%]">
                  <span className="font-semibold">
                    Nombre d'étudiants <span className="text-red-500">*</span>
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
                                {errors.nombreEtudiantMax && (
                                    <p className="text-red-500 text-sm">{errors.nombreEtudiantMax}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="input input-bordered flex items-center gap-2 w-[95%]">
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
                                {errors.dateError && (
                                    <p className="text-red-500 text-sm">{errors.dateError}</p>
                                )}
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
                                <span className="font-semibold w-[15%]">Lieu de rentrée</span>
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
                                    {/*<option value="" disabled>*/}
                                    {/*    Sélectionnez un état*/}
                                    {/*</option>*/}
                                    {/*<option value="RECH">Recherche en cours</option>*/}
                                    {processusStage.map((ps) => (
                                        <option key={ps.rvLowValue} value={ps.rvLowValue}>
                                            {ps.rvMeaning}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <div className="flex flex-col gap-2 border-2 border-gray-300 rounded-lg p-3 w-[95%]">
                                <label className="font-semibold text-center">
                                    Date limite de réponse pour la liste
                                </label>
                                <div className="flex flex-row gap-2 ">
                                    <div className="flex flex-col gap-1 w-[50%] ">
                                        <label className="input input-bordered flex items-center gap-2">
                                            <span className="font-semibold w-[20%]">Principale</span>
                                            <input
                                                type="date"
                                                name="dateReponseLp"
                                                value={formatDate(promotion.dateReponseLp)}
                                                onChange={handleChange}
                                                className="input input-bordered w-[80%] max-w-full"
                                            />
                                        </label>
                                        {errors.dateError && (
                                            <p className="text-red-500 text-sm">{errors.dateError}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1 w-[50%]">
                                        <label className="input input-bordered flex items-center gap-2">
                                            <span className="font-semibold w-[15%]">Attente</span>
                                            <input
                                                type="date"
                                                name="dateReponseLalp"
                                                value={formatDate(promotion.dateReponseLalp)}
                                                onChange={handleChange}
                                                className="input input-bordered w-[80%] max-w-full"
                                            />
                                        </label>
                                        {errors.dateError && (
                                            <p className="text-red-500 text-sm">{errors.dateError}</p>
                                        )}
                                    </div>
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
                    <div className={"mt-2"}>
                        {error && <AlertError error={error}/>}
                    </div>
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