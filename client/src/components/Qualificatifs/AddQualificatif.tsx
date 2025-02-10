import  { useState } from 'react';
import {
  fetchQualificatifsAsync,
  createQualificatifAsync,
} from "../../features/QualificatifSlice";
import { useAppDispatch } from '../../hook/hooks';
const AddQualificatif = () => {
  const [qualificatif, setQualificatif] = useState({
    id: 0,
    maximal: '',
    minimal: '',
  });
  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQualificatif((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ⚠️ Empêcher le rechargement de la page
    if (!canSave) {
      console.error("Tous les champs requis doivent être remplis correctement.");
    }

    if (
      qualificatif.maximal &&
      qualificatif.maximal) {
      await dispatch(createQualificatifAsync(qualificatif));
      dispatch(fetchQualificatifsAsync());
    } else {
      console.error("Tous les champs requis doivent être remplis.");
    }
  };

  const canSave = qualificatif.maximal && qualificatif.minimal;

  return (
    <div className="flex justify-center items-center w-full h-screen backdrop-blur-sm">
      <div className="modal-box w-[50em] max-w-5xl">
        <h3 className="font-bold text-lg my-4">Ajouter un qualificatif</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
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
            <button type="button" className="btn">Annuler</button>
            <button
              type="submit"
              className="btn btn-neutral disabled:cursor-not-allowed"
              disabled={!canSave}
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQualificatif;
