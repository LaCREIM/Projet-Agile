import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hook/hooks';
import { fetchStatistiquesAsync } from '@/features/EvaluationSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState } from '@/api/store';
import { IoMdArrowBack } from 'react-icons/io';
import { Bar } from 'react-chartjs-2';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatistiquesEvaluation: React.FC = () => {
    const dispatch = useAppDispatch();
    const { evaluationId } = useParams<{ evaluationId: string }>();
    const stats = useAppSelector((state: RootState) => state.evaluations.statistiques);
    const navigate = useNavigate();

    useEffect(() => {
        if (evaluationId) {
            dispatch(fetchStatistiquesAsync(Number(evaluationId)));
        }
    }, [dispatch, evaluationId]);

    return (
        <div className="w-full min-h-screen p-6 bg-gray-50 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between bg-white shadow-md rounded-lg p-6">
                <button
                    className="flex items-center text-gray-600 hover:text-gray-800 transition duration-300"
                    onClick={() => navigate(`/user/home/evaluations`)}
                >
                    <IoMdArrowBack size={25} className="mr-2" />
                    <span className="text-lg font-medium">Retour</span>
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Statistiques de l'évaluation</h1>
                <div></div>
            </div>

            {/* Statistics Cards */}
            <div className="mt-8 space-y-6">
                {stats.map((stat) => (
                    <div key={stat.idQuestion} className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                            {/*{stat.designation} : {stat.intitule}*/}
                            {stat.intitule}
                        </h3>
                        <div className="grid grid-cols-2 gap-6 text-gray-700">
                            <p><strong>Moyenne Positionnement:</strong> {stat.moyennePositionnement}</p>
                            <p><strong>Maximal:</strong> {stat.maximal}</p>
                            <p><strong>Minimal:</strong> {stat.minimal}</p>
                            <p><strong>Nombre de Réponses:</strong> {stat.nbReponses}</p>
                        </div>
                        {/* Bar Chart */}
                        <div className="mt-4">
                            <h4 className="font-semibold text-gray-800 mb-2">Total Positionnements</h4>
                            <Bar
                                height={60}
                                data={{
                                    labels: stat.totalPositionnements.map((_, index) => `Position ${index + 1}`),
                                    datasets: [
                                        {
                                            label: 'Total Positionnements',
                                            data: stat.totalPositionnements,
                                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                                            borderColor: 'rgba(75, 192, 192, 1)',
                                            borderWidth: 1,
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            display: false,
                                        },
                                        title: {
                                            display: false,
                                        },
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatistiquesEvaluation;
