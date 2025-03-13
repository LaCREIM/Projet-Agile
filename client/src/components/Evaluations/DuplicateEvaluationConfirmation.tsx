import React from 'react';
import { GetEvaluationDTO } from '../../types/types';

interface DuplicateEvaluationConfirmationProps {
  evaluation: GetEvaluationDTO['evaluation'];
  onClose: () => void;
  onConfirm: () => void;
}

const DuplicateEvaluationConfirmation: React.FC<DuplicateEvaluationConfirmationProps> = ({ evaluation, onClose, onConfirm }) => {
  return (
    <div className="modal-box">
      <h3 className="font-bold text-lg">Confirmer la duplication</h3>
      <p className="py-4">Êtes-vous sûr de vouloir dupliquer l'évaluation "{evaluation.designation}" ?</p>
      <p className="py-4 text-red">Il est impératif de modifier le numéro d'évaluation attribué par défaut après la duplication !</p>
      <div className="modal-action">
        <button className="btn" onClick={onClose}>Annuler</button>
        <button className="btn btn-neutral" onClick={onConfirm}>Confirmer</button>
      </div>
    </div>
  );
};

export default DuplicateEvaluationConfirmation;