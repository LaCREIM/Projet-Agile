import { useState } from "react";
import {
  fetchQualificatifsAsync,
  createQualificatifAsync,
  fetchQualificatifsPagedAsync,
} from "../../features/QualificatifSlice";
import { useAppDispatch } from "../../hook/hooks";
import { toast } from "react-toastify";

interface AddQualifivcatifProps {
  currentPage: number;
}
const AddQualificatif = ({ currentPage }: number) => {
  const [qualificatif, setQualificatif] = useState({
    id: 0,
    maximal: "",
    minimal: "",
  });
  const dispatch = useAppDispatch();

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
    console.log(e);

    if (canSave) {
      const response = await dispatch(createQualificatifAsync(qualificatif));
      
      console.log(response);
      
      if ((response?.type as string) === "qualificatifs/create/rejected") {
        toast.error(response.payload as string);
        
      } else if (
        (response?.type as string) === "qualificatifs/create/fulfilled"
      ) {
        dispatch(fetchQualificatifsPagedAsync({ page: currentPage, size: 5 }));
        toast.success(response.payload as string);
      }
      setQualificatif({
        id: 0,
        maximal: "",
        minimal: "",
      });
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen backdrop-blur-sm">
      <div className="modal-box w-[40%] max-w-5xl">
        <h3 className="font-bold text-lg my-4">Ajouter un qualificatif</h3>
        <div className="flex flex-row justify-center items-center gap-5">
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
        </div>

        <div className="modal-action">
          <form method="dialog" className="flex flex-row gap-5">
            <button className="btn">Annuler</button>
            <button
              onClick={handleSubmit}
              className="btn btn-neutral disabled:cursor-not-allowed"
              disabled={!canSave}
            >
              Ajouter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddQualificatif;
