import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '@/hook/hooks';
import {fetchStatistiquesAsync} from '@/features/EvaluationSlice';
import {useNavigate, useParams} from 'react-router-dom';
import {RootState} from '@/api/store';
import {IoMdArrowBack} from 'react-icons/io';
import {Bar, Line} from 'react-chartjs-2';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

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
                {stats.map((stat) => {
                    // Déterminer la couleur en fonction de la moyenne
                    const getColor = (value: number) => {
                        if (value < 3) return 'rgba(255, 0, 0, 0.7)'; // Rouge intense
                        if (value >= 4) return 'rgba(0, 400, 0, 0.7)'; // Vert intense
                        return 'rgba(255, 165, 0, 0.7)'; // Orange pour 3 <= moyenne < 4
                    };

                    return (
                        <div key={stat.idQuestion} className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                                {stat.designation} : {stat.intitule}
                            </h3>
                            <div className="grid grid-cols-2 gap-6 text-gray-700">
                                <p><strong>Maximal:</strong> {stat.maximal}</p>
                                <p><strong>Minimal:</strong> {stat.minimal}</p>
                                <p><strong>Moyenne positionnement:</strong> {stat.moyennePositionnement}</p>
                                <p><strong>Nombre de réponses:</strong> {stat.nbReponses}</p>
                            </div>
                            <div className={"flex flex-row  justify-around gap-2"}>
                            {/* Graphique en barres - Moyenne Positionnement */}
                            <div className="mt-4">
                                <h4 className="font-semibold text-gray-800 mb-2">Moyenne de Positionnement</h4>
                                <Bar
                                    height={150}
                                    width={500}
                                    data={{
                                        labels: [stat.intitule],
                                        datasets: [
                                            {
                                                label: 'Moyenne Positionnement',
                                                data: [stat.moyennePositionnement],
                                                backgroundColor: getColor(stat.moyennePositionnement),
                                                borderColor: 'rgba(0, 0, 0, 0.2)',
                                                borderWidth: 1,
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {display: false},
                                            title: {display: false},
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                suggestedMax: 5,
                                            },
                                        },
                                    }}
                                />
                            </div>

                            {/* Bar Chart - Total Positionnements */}
                            {/*<div className="mt-6">*/}
                            {/*    <h4 className="font-semibold text-gray-800 mb-2">Total Positionnements</h4>*/}
                            {/*    <Bar*/}
                            {/*        height={150}*/}
                            {/*        width={500}*/}
                            {/*        data={{*/}
                            {/*            labels: stat.totalPositionnements.map((_, index) => `Position ${index + 1}`),*/}
                            {/*            datasets: [*/}
                            {/*                {*/}
                            {/*                    label: 'Total Positionnements',*/}
                            {/*                    data: stat.totalPositionnements,*/}
                            {/*                    backgroundColor: 'rgba(75, 192, 192, 0.5)',*/}
                            {/*                    borderColor: 'rgba(75, 192, 192, 1)',*/}
                            {/*                    borderWidth: 1,*/}
                            {/*                },*/}
                            {/*            ],*/}
                            {/*        }}*/}
                            {/*        options={{*/}
                            {/*            responsive: true,*/}
                            {/*            plugins: {*/}
                            {/*                legend: {display: false},*/}
                            {/*                title: {display: false},*/}
                            {/*            },*/}
                            {/*            scales: {*/}
                            {/*                y: {*/}
                            {/*                    beginAtZero: true,*/}
                            {/*                    suggestedMax: 5,*/}
                            {/*                    ticks: {*/}
                            {/*                        stepSize: 1, // Force des valeurs entières*/}
                            {/*                        precision: 0 // Supprime les décimales*/}
                            {/*                    }*/}
                            {/*                },*/}
                            {/*            },*/}
                            {/*        }}*/}
                            {/*    />*/}
                            {/*</div>*/}

                            {/* Line Chart - Evolution de la Moyenne */}
                            <div className="mt-6">
                                <h4 className="font-semibold text-gray-800 mb-2">Évolution de la Moyenne de
                                    Positionnement</h4>
                                <Line
                                    height={150}
                                    width={500}
                                    data={{
                                        labels: stat.totalPositionnements.map((_, index) => `Position ${index + 1}`),
                                        datasets: [
                                            {
                                                label: 'Moyenne Positionnement',
                                                data: stat.totalPositionnements,
                                                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                                borderColor: 'rgba(255, 99, 132, 1)',
                                                borderWidth: 2,
                                                fill: true,
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {display: false},
                                            title: {display: false},
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                suggestedMax: 5,
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StatistiquesEvaluation;
