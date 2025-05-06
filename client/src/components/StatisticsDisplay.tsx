import React from "react";
import { Chart } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface StatisticsDisplayProps {
  stats: {
    voteStats: Array<{
      cardinalId: number;
      name: string;
      title: string;
      count: number;
      percentage: number;
    }>;
    totalVotes: number;
    uniqueVotersCount: number;
    recentVotes: Array<{
      id: number;
      userName: string;
      userTitle: string;
      cardinalName: string;
      timestamp: string;
    }>;
    leadingCandidate: {
      cardinalId: number;
      name: string;
      count: number;
      percentage: number;
    } | null;
  };
}

const StatisticsDisplay: React.FC<StatisticsDisplayProps> = ({ stats }) => {
  // Prepare data for chart
  const chartData = {
    labels: stats.voteStats.map((stat) => stat.name),
    datasets: [
      {
        label: "Votes",
        data: stats.voteStats.map((stat) => stat.count),
        backgroundColor: [
          "#c41e3a", // cardinal-red
          "#d4af37", // vatican-gold
          "#702963", // papal-purple
          "#e63946", // lighter cardinal-red
          "#f2cc8f", // lighter vatican-gold
          "#8d0b93", // lighter papal-purple
        ],
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Main voting ranking with progress bars */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-cinzel text-cardinal-red">
            Classifica della Corsa Papale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.voteStats
              .sort((a, b) => b.count - a.count)
              .map((cardinal, index) => (
                <div key={cardinal.cardinalId} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-lora font-medium text-papal-purple">
                      {index + 1}. {cardinal.name}
                    </span>
                    <span className="font-cinzel text-cardinal-red font-bold">
                      {cardinal.count} {cardinal.count === 1 ? "voto" : "voti"}{" "}
                      ({cardinal.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${cardinal.percentage}%`,
                        backgroundColor:
                          index === 0
                            ? "#d4af37"
                            : index === 1
                              ? "#c0c0c0"
                              : index === 2
                                ? "#cd7f32"
                                : "#c41e3a",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Secondary stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-cinzel text-cardinal-red">
            Analisi Divina
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Top candidate indicator */}
            {stats.leadingCandidate && (
              <div className="bg-parchment p-4 rounded-lg">
                <h4 className="font-cinzel text-lg text-papal-purple mb-2">
                  Candidato in Testa
                </h4>
                <div className="flex items-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mr-4 bg-gray-200">
                    <img
                      src={
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9qegsxcXYMThjl6DRKHGtrB3LL7MksUjJaw&s"
                      }
                      alt={stats.leadingCandidate.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to a default image on error
                        e.currentTarget.src =
                          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Coat_of_arms_Holy_See.svg/800px-Coat_of_arms_Holy_See.svg.png";
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-bold font-lora text-cardinal-red">
                      {stats.leadingCandidate.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      In testa con {stats.leadingCandidate.count}{" "}
                      {stats.leadingCandidate.count === 1 ? "voto" : "voti"} (
                      {stats.leadingCandidate.percentage}%)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Voting activity */}
            <div>
              <h4 className="font-cinzel text-lg text-papal-purple mb-2">
                Attività di Voto Recente
              </h4>
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded">
                {stats.recentVotes && stats.recentVotes.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {stats.recentVotes.map((vote) => (
                      <li key={vote.id} className="p-3 hover:bg-gray-50">
                        <p className="font-lora text-sm">
                          <span className="font-semibold">{vote.userName}</span>{" "}
                          ha votato per{" "}
                          <span className="text-cardinal-red">
                            {vote.cardinalName}
                          </span>
                          <span className="block text-gray-500 text-xs mt-1">
                            {formatDistanceToNow(new Date(vote.timestamp), {
                              addSuffix: true,
                            })}
                          </span>
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="p-4 text-center text-gray-500 font-lora">
                    Nessun voto ancora espresso.
                  </p>
                )}
              </div>
            </div>

            {/* Fun stat counters */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-vatican-gold bg-opacity-20 p-3 rounded-lg text-center">
                <p className="text-3xl font-bold font-cinzel text-cardinal-red">
                  {stats.totalVotes}
                </p>
                <p className="text-sm font-lora text-gray-700">
                  Voti Totali Espressi
                </p>
              </div>
              <div className="bg-cardinal-red bg-opacity-20 p-3 rounded-lg text-center">
                <p className="text-3xl font-bold font-cinzel text-papal-purple">
                  {stats.uniqueVotersCount}
                </p>
                <p className="text-sm font-lora text-gray-700">
                  Partecipanti al Conclave
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsDisplay;
