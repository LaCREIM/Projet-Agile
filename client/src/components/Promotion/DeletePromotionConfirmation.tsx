import {toast} from "react-toastify";
import {Promotion, PromotionId} from "../../types/types";
import {useAppDispatch} from "../../hook/hooks";
import React from "react";
import {deletePromotionAsync, getPromotionAsync} from "../../features/PromotionSlice.ts";

interface DeleteProps {
    promotion: Promotion;
}

const DeletepromotionConfirmation = ({
                                         promotion
                                     }: DeleteProps) => {
    const dispatch = useAppDispatch();

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const response = await dispatch(
            deletePromotionAsync({
                anneeUniversitaire: promotion.anneeUniversitaire,
                codeFormation: promotion.codeFormation,
            } as PromotionId)
        );
        console.log(response)
        if (response.type === "promotions/deleteEtudiantAsync/rejected") {
            console.log(response.payload)
            toast.error((response.payload as unknown as {error:string}).error);
        } else if (response.type === "promotions/deleteEtudiantAsync/fulfilled") {
            toast.success("Promotion supprimée avec succès");
        }
        dispatch(getPromotionAsync());
    };

    return (
        <>
            <div className="modal-box">
                <h3 className="font-bold text-lg">Cette action est irréversible.</h3>
                <p className="py-4">Êtes-vous sûr de vouloir supprimer cette promotion?</p>
                <div className="modal-action">
                    <form method="dialog" className=" space-x-4">
                        <button className="btn btn-error text-white" onClick={handleDelete}>
                            Supprimer
                        </button>
                        <button className="btn">Annuler</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default DeletepromotionConfirmation;
