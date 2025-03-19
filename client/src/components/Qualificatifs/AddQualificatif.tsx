import { useState } from "react";
import {
  createQualificatifAsync,
  fetchQualificatifsAsync,
  fetchQualificatifsPagedAsync,
} from "../../features/QualificatifSlice";
import { useAppDispatch } from "../../hook/hooks";
import { toast } from "react-toastify";
import AlertError from "../ui/alert-error";

interface AddQualificatifProps {
  currentPage: number;
  onClose: () => void;
}
const AddQualificatif = ({ currentPage, onClose }: AddQualificatifProps) => {
  const [qualificatif, setQualificatif] = useState({
    id: 0,
    maximal: "",
    minimal: "",
  });
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setQualificatif((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const canSave = qualificatif.maximal != "" && qualificatif.minimal != "";

  const handleSubmit = async (e: React.FormEvent) => {

    if(qualificatif.maximal === qualificatif.minimal){
      setError("les valeurs de qualificatid maximal et minimal doivent être différents");
      return;
    }else{
    e.preventDefault();
    if (canSave) {
      const response = await dispatch(createQualificatifAsync(qualificatif));
      if ((response?.type as string) === "qualificatifs/create/rejected") {
        setError(response.payload as string);
      } else if (
        (response?.type as string) === "qualificatifs/create/fulfilled"
      ) {
        dispatch(fetchQualificatifsAsync());
        toast.success(response.payload as string);
        handleClose();
      }
    }
  }
  };

  const handleClose = () => {
    setQualificatif({
      id: 0,
      maximal: "",
      minimal: "",
    });
    setError(null);
    onClose();
  };

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="modal-box w-[40%] max-w-5xl">
        <h3 className="font-bold text-lg my-4">Ajouter un qualificatif</h3>

        <div className="flex flex-row justify-center items-center gap-5">
          <label className="input input-bordered flex items-center gap-2">
            <span className="font-semibold">Minimal</span>
            <input
              required
              type="text"
              name="minimal"
              value={qualificatif.minimal}
              onChange={handleChange}
              className="grow"
              placeholder="Ex: Insuffisant"
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <span className="font-semibold">Maximal</span>
            <input
              required
              type="text"
              name="maximal"
              value={qualificatif.maximal}
              onChange={handleChange}
              className="grow"
              placeholder="Ex: Excellent"
            />
          </label>
        </div>
        {error && <AlertError error={error} />}

        <div className="modal-action">
          <button className="btn" type="button" onClick={() => handleClose()}>
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="btn btn-neutral disabled:cursor-not-allowed"
            disabled={!canSave}
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQualificatif;
