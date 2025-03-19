import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '@/hook/hooks';
import {fetchStatistiquesAsync} from '@/features/EvaluationSlice';
import {useNavigate, useParams} from 'react-router-dom';
import {RootState} from '@/api/store';
import {IoMdArrowBack} from 'react-icons/io';
import {Line} from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
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

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, annotationPlugin);

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

    // Group statistics by designation
    const groupedStats = stats.reduce((acc, stat) => {
        if (!acc[stat.designation]) {
            acc[stat.designation] = [];
        }
        acc[stat.designation].push(stat);
        return acc;
    }, {} as Record<string, typeof stats>);

    return (
        <div className="w-full min-h-screen p-6 bg-gray-50 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between bg-white shadow-md rounded-lg p-6">
                <button
                    className="flex items-center text-gray-600 hover:text-gray-800 transition duration-300 hover:cursor-pointer"
                    onClick={() => navigate(`/user/home/evaluations`)}
                >
                    <IoMdArrowBack size={25} className="mr-2" />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Statistiques de l'évaluation</h1>
                <div></div>
            </div>

            {/* Accordion UI */}
            <div className="mt-8 space-y-4">
                {Object.entries(groupedStats).map(([designation, questions]) => (
                    <div className="collapse collapse-arrow bg-white shadow-md rounded-lg">
                        <input type="checkbox"/>
                        <div className="collapse-title text-xl font-medium text-gray-800">
                            {designation}
                        </div>
                        <div className="collapse-content">
                            {questions.map((stat) => (
                                <div key={stat.idQuestion} className="bg-gray-100 p-6 rounded-lg shadow-sm mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                        {stat.intitule}
                                    </h3>
                                    <div className="grid grid-cols-2 gap-6 text-gray-700">
                                        <p><strong>Minimal:</strong> {stat.minimal}</p>
                                        <p><strong>Maximal:</strong> {stat.maximal}</p>
                                        <p><strong>Moyenne:</strong> {stat.moyennePositionnement.toFixed(2)}</p>
                                        <p><strong>Median:</strong> {stat.medianPositionnement.toFixed(2)}</p>
                                        <p><strong>Nombre de réponses:</strong> {stat.nbReponses}</p>
                                    </div>

                                    {/* Charts */}
                                    <div className="w-[50%] mx-auto mt-6">
                                            <Line
                                                height={75}
                                                data={{
                                                    labels: stat.totalPositionnements.map((_, index) => `Position ${index + 1}`),
                                                    datasets: [{
                                                        label: 'Évolution Moyenne',
                                                        data: stat.totalPositionnements,
                                                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                                        borderColor: 'rgba(255, 99, 132, 1)',
                                                        borderWidth: 2,
                                                        fill: true,
                                                    }],
                                                }}
                                                options={{
                                                    responsive: true,
                                                    plugins: {
                                                        legend: {display: false},
                                                        title: {
                                                            display: true,
                                                            text: `Le nombre de réponses pour chaque positionnement`
                                                        },
                                                        annotation: {
                                                            annotations: {
                                                                line1: {
                                                                    type: 'line',
                                                                    xMin: stat.moyennePositionnement - 1,
                                                                    xMax: stat.moyennePositionnement - 1,
                                                                    borderColor: 'rgba(75, 192, 192, 1)',
                                                                    borderWidth: 2,
                                                                    label: {
                                                                        content: 'Moyenne',
                                                                        position: 'center'
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    },
                                                    scales: {
                                                        x: {
                                                            title: {
                                                                display: true,
                                                                text: `${stat.minimal} - ${stat.maximal}`
                                                            }
                                                        },
                                                        y: {
                                                            title: {
                                                                display: true,
                                                                text: "Nombre de réponses"
                                                            },
                                                            beginAtZero: true,
                                                            suggestedMax: 5,
                                                            ticks: {
                                                                stepSize: 1,
                                                                callback: function (value) {
                                                                    if (Number.isInteger(value)) {
                                                                        return value;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    },
                                                }}
                                            />
                                        </div>
                                    </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatistiquesEvaluation;