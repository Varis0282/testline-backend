const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const quizEndpointData = require("./quizEndpoint.json");
const quizSubmissionData = require("./quizSubmissionData.json");
const apiEndPoint = require("./apiendpoint.json");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// API Endpoints
const QUIZ_ENDPOINT = "https://www.jsonkeeper.com/b/LLQT";  // Quiz metadata
const QUIZ_SUBMISSION_DATA = "https://api.jsonserve.com/rJvd7g"; // User submissions
const API_ENDPOINT = "https://api.jsonserve.com/XgAgFJ"; // Historical data
const collegeCutoffs = [
    { college: "AIIMS Delhi", rankRange: [1, 100] },
    { college: "Maulana Azad Medical College", rankRange: [101, 500] },
    { college: "King George’s Medical University", rankRange: [501, 1000] },
    { college: "Grant Medical College", rankRange: [1001, 3000] },
    { college: "Madras Medical College", rankRange: [3001, 5000] },
    { college: "Bangalore Medical College", rankRange: [5001, 8000] },
    { college: "Government Medical College Nagpur", rankRange: [8001, 12000] },
    { college: "Other Govt. Medical Colleges", rankRange: [12001, 20000] },
    { college: "Seth GS Medical College, Mumbai", rankRange: [2001, 5000] },
    { college: "Vardhman Mahavir Medical College, Delhi", rankRange: [1501, 4000] },
    { college: "Dr. RML Hospital, Delhi", rankRange: [2501, 6000] },
    { college: "University College of Medical Sciences, Delhi", rankRange: [500, 2000] },
    { college: "Government Stanley Medical College, Chennai", rankRange: [5001, 9000] },
    { college: "Sardar Patel Medical College, Bikaner", rankRange: [9001, 13000] },
    { college: "Government Medical College, Thiruvananthapuram", rankRange: [4000, 8000] },
    { college: "Topiwala National Medical College, Mumbai", rankRange: [3001, 7000] },
    { college: "Lokmanya Tilak Municipal Medical College, Mumbai", rankRange: [3001, 7000] },
    { college: "Institute of Medical Sciences, BHU", rankRange: [800, 2500] },
    { college: "Osmania Medical College, Hyderabad", rankRange: [2000, 5000] },
    { college: "Gandhi Medical College, Hyderabad", rankRange: [5000, 10000] },
    { college: "BJ Government Medical College, Pune", rankRange: [1000, 3500] },
    { college: "Indira Gandhi Medical College, Shimla", rankRange: [7000, 12000] },
    { college: "Medical College, Kolkata", rankRange: [1000, 3500] },
    { college: "NRS Medical College, Kolkata", rankRange: [3000, 7000] },
    { college: "R. G. Kar Medical College, Kolkata", rankRange: [3500, 7500] },
    { college: "Calcutta National Medical College", rankRange: [5000, 10000] },
    { college: "Sri Venkateswara Medical College, Tirupati", rankRange: [6000, 11000] },
    { college: "Shri B. M. Patil Medical College, Bijapur", rankRange: [9000, 15000] },
    { college: "Kasturba Medical College, Manipal", rankRange: [2000, 8000] },
    { college: "Kasturba Medical College, Mangalore", rankRange: [4000, 10000] },
    { college: "Jawaharlal Nehru Medical College, Belgaum", rankRange: [5000, 12000] },
    { college: "JJM Medical College, Davangere", rankRange: [7000, 15000] },
    { college: "Sri Devraj Urs Medical College, Kolar", rankRange: [8000, 16000] },
    { college: "Government Medical College, Kozhikode", rankRange: [3000, 7000] },
    { college: "Government Medical College, Ernakulam", rankRange: [7000, 13000] },
    { college: "Kottayam Medical College", rankRange: [5000, 11000] },
    { college: "Tirunelveli Medical College, Tamil Nadu", rankRange: [9000, 15000] },
    { college: "Annamalai University, Chidambaram", rankRange: [11000, 18000] },
    { college: "Government Medical College, Amritsar", rankRange: [4000, 9000] },
    { college: "Government Medical College, Patiala", rankRange: [3500, 8500] },
    { college: "Government Medical College, Jammu", rankRange: [5000, 11000] },
    { college: "Sher-I-Kashmir Institute of Medical Sciences, Srinagar", rankRange: [6000, 12000] },
    { college: "Government Medical College, Chandigarh", rankRange: [1000, 3000] },
    { college: "Pt. B. D. Sharma PGIMS, Rohtak", rankRange: [4000, 9000] },
    { college: "Hamdard Institute of Medical Sciences, Delhi", rankRange: [2000, 6000] },
    { college: "Manipal Medical College, Jaipur", rankRange: [7000, 14000] },
    { college: "Pacific Medical College, Udaipur", rankRange: [10000, 20000] },
    { college: "Sree Balaji Medical College, Chennai", rankRange: [12000, 20000] }
];

// Fetch data from all 3 APIs
const fetchAllQuizData = async () => {
    try {
        // const [quizRes, submissionRes, historyRes] = await Promise.all([
        //     axios.get(QUIZ_ENDPOINT),
        //     axios.get(QUIZ_SUBMISSION_DATA),
        //     axios.get(API_ENDPOINT)
        // ]);
        // console.log("Data fetched successfully");
        // use the downloaded data instead of fetching from the API
        return {
            quizzes: quizEndpointData, // Metadata of quizzes
            submissions: quizSubmissionData, // User responses
            history: apiEndPoint // Historical quiz performance
        };
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};

// Analyze performance per user
const analyzeUserPerformance = (data) => {
    const { history } = data;
    let userStats = {};

    history.forEach((quiz) => {
        const userId = quiz.user_id;

        if (!userStats[userId]) {
            userStats[userId] = {
                totalScore: 0,
                totalQuestions: 0,
                accuracySum: 0,
                quizCount: 0,
                topicWise: {},
                mistakesCorrected: 0,
                initialMistakeCount: 0,
                difficultyStats: { Easy: 0, Medium: 0, Hard: 0, totalQuestions: 0 },
                topicHistory: {} // Stores accuracy trend per topic
            };
        }

        const user = userStats[userId];

        user.totalScore += parseFloat(quiz.final_score);
        user.totalQuestions += quiz.total_questions;
        user.accuracySum += parseFloat(quiz.accuracy.replace("%", ""));
        user.quizCount += 1;
        user.mistakesCorrected += quiz.mistakes_corrected;
        user.initialMistakeCount += quiz.initial_mistake_count;

        let topic = quiz.quiz?.topic || "Unknown";
        if (!user.topicWise[topic]) {
            user.topicWise[topic] = { correct: 0, total: 0 };
            user.topicHistory[topic] = []; // Initialize topic history
        }

        user.topicWise[topic].total += quiz.total_questions;
        user.topicWise[topic].correct += quiz.correct_answers;

        // Store accuracy trend per topic
        let quizAccuracy = (quiz.correct_answers / quiz.total_questions) * 100;
        user.topicHistory[topic].push(quizAccuracy);

        // Infer difficulty based on accuracy
        let difficulty = quiz.quiz?.difficulty_level || (quizAccuracy > 80 ? "Easy" : quizAccuracy > 50 ? "Medium" : "Hard");
        user.difficultyStats[difficulty] += quiz.total_questions;
        user.difficultyStats.totalQuestions += quiz.total_questions;
    });

    // Final calculations for each user
    Object.keys(userStats).forEach(userId => {
        let user = userStats[userId];

        user.accuracy = user.quizCount > 0 ? user.accuracySum / user.quizCount : 0;
        user.totalScore = (user.totalScore / user.totalQuestions) * 720;

        user.topicInsights = Object.keys(user.topicWise).map(topic => {
            let accuracy = (user.topicWise[topic].correct / user.topicWise[topic].total) * 100;
            return { topic, accuracy };
        });

        user.difficultyDistribution = {
            Easy: (user.difficultyStats.Easy / user.difficultyStats.totalQuestions) * 100,
            Medium: (user.difficultyStats.Medium / user.difficultyStats.totalQuestions) * 100,
            Hard: (user.difficultyStats.Hard / user.difficultyStats.totalQuestions) * 100
        };

        user.weakAreas = user.topicInsights
            .filter(t => t.accuracy < 50)
            .map(t => ({
                topic: t.topic,
                accuracy: t.accuracy,
                severity: t.accuracy < 30 ? "Critical" : "Moderate"
            }));

        user.improvementTrends = Object.keys(user.topicHistory).map(topic => {
            let accuracyHistory = user.topicHistory[topic];
            if (accuracyHistory.length < 2) return null; // Need at least two attempts

            let firstAttempt = accuracyHistory[0];
            let lastAttempt = accuracyHistory[accuracyHistory.length - 1];
            let improvement = lastAttempt - firstAttempt;

            return improvement > 15 ? { topic, improvement: `${improvement.toFixed(2)}%` } : null;
        }).filter(Boolean); // Remove null values

        user.performanceGaps = Object.keys(user.topicHistory).map(topic => {
            let accuracyHistory = user.topicHistory[topic];
            if (accuracyHistory.length < 3) return null; // Need at least three attempts to check fluctuation

            let maxAcc = Math.max(...accuracyHistory);
            let minAcc = Math.min(...accuracyHistory);
            let fluctuation = maxAcc - minAcc;

            let lastTwoDrop = accuracyHistory.length > 1 ? accuracyHistory[accuracyHistory.length - 2] - accuracyHistory[accuracyHistory.length - 1] : 0;

            return fluctuation > 20 || lastTwoDrop > 10
                ? { topic, fluctuation: `${fluctuation.toFixed(2)}%`, recentDrop: lastTwoDrop.toFixed(2) }
                : null;
        }).filter(Boolean);

        // Cleanup
        delete user.accuracySum;
        delete user.quizCount;
        delete user.topicHistory;
    });

    return userStats;
};

// Rank Prediction Algorithm
const predictRank = (performance) => {
    const { totalScore, accuracy, mistakesCorrected, initialMistakeCount } = performance;

    let scoreWeight = totalScore * 2;
    let accuracyWeight = accuracy * 1.5;
    let mistakePenalty = (initialMistakeCount - mistakesCorrected) * 5;
    let finalScore = scoreWeight + accuracyWeight - mistakePenalty;

    let predictedRank;
    if (finalScore > 9000) predictedRank = 500;
    else if (finalScore > 8000) predictedRank = 2000;
    else if (finalScore > 7000) predictedRank = 5000;
    else if (finalScore > 6000) predictedRank = 8000;
    else predictedRank = 12000;

    return predictedRank;
};

const predictCollege = (predictedRank) => {
    // Get all colleges that match the rank range
    let suggestedColleges = collegeCutoffs.filter(college =>
        predictedRank >= college.rankRange[0] && predictedRank <= college.rankRange[1]
    );

    return suggestedColleges.map(college => college.college);
};

// API: Get Performance Insights Per User
app.get("/insights", async (req, res) => {
    const data = await fetchAllQuizData();
    if (!data) return res.status(500).json({ error: "Failed to fetch data" });

    const insights = analyzeUserPerformance(data);
    res.json(insights);
});

// API: Predict Rank Per User
app.get("/predict-rank", async (req, res) => {
    const data = await fetchAllQuizData();
    if (!data) return res.status(500).json({ error: "Failed to fetch data" });

    const insights = analyzeUserPerformance(data);
    let rankPredictions = {};

    Object.keys(insights).forEach(userId => {
        rankPredictions[userId] = {
            predictedRank: predictRank(insights[userId]),
            accuracy: insights[userId].accuracy,
            totalScore: insights[userId].totalScore
        };
    });

    res.json(rankPredictions);
});

// API: Predict College Per User
app.get("/predict-college/:userId", async (req, res) => {
    const userId = req.params.userId;
    const data = await fetchAllQuizData();
    if (!data) return res.status(500).json({ error: "Failed to fetch data" });

    const insights = analyzeUserPerformance(data);

    if (!insights[userId]) {
        return res.status(404).json({ error: "User not found" });
    }

    let predictedRank = predictRank(insights[userId]);
    let suggestedColleges = predictCollege(predictedRank);

    res.json({
        userId,
        predictedRank,
        suggestedColleges
    });
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
