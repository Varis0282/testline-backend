# TestLine Backend Assignment

## Overview
This project is a **NEET Student Rank Predictor** that analyzes quiz performance data to predict a student's rank based on historical NEET exam results. It also provides insights into student performance trends and predicts potential medical colleges based on the predicted rank.
<br>
Develop a solution to analyze testline quiz performance and predict student rank based on past year neet exam results. (You can use any tech-stack of your choice)

## Features
- Fetches and analyzes quiz performance data from API endpoints.
- Provides performance insights, highlighting weak areas and improvement trends.
- Predicts a student's NEET rank based on quiz scores and accuracy.
- Suggests potential medical colleges based on the predicted rank.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Data Handling**: Axios, JSON-based datasets

## API Endpoints
### 1. Get Performance Insights
**Endpoint:** `GET /insights`
**Description:** Analyzes user quiz performance and provides insights on accuracy, weak areas, improvement trends, and performance gaps.
**Response Example:**
```json
{
  "user123": {
    "totalScore": 650,
    "accuracy": 85,
    "weakAreas": [{"topic": "Physics", "accuracy": 45, "severity": "Critical"}],
    "improvementTrends": [{"topic": "Biology", "improvement": "20%"}]
  }
}
```

### 2. Predict Student Rank
**Endpoint:** `GET /predict-rank`
**Description:** Predicts a student's NEET rank based on their quiz performance.
**Response Example:**
```json
{
  "user123": {
    "predictedRank": 5000,
    "accuracy": 85,
    "totalScore": 650
  }
}
```

### 3. Predict Colleges Based on Rank
**Endpoint:** `GET /predict-college/:userId`
**Description:** Suggests medical colleges a student could get admission to based on their predicted NEET rank.
**Response Example:**
```json
{
  "userId": "user123",
  "predictedRank": 5000,
  "suggestedColleges": [
    "Grant Medical College",
    "Madras Medical College"
  ]
}
```

## Setup Instructions
### Prerequisites
- Install [Node.js](https://nodejs.org/) and npm.

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/Varis0282/testline-backend.git
   cd testline-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   npm start
   ```
4. Access the APIs at `http://localhost:3000`

## Approach Description
1. **Data Collection:**
   - The application fetches quiz metadata, user submissions, and historical performance data.
   - Alternatively, it uses JSON files for local testing.

2. **Performance Analysis:**
   - Calculates total scores, accuracy, mistake corrections, and topic-wise strengths/weaknesses.
   - Tracks improvement trends and identifies performance gaps.

3. **Rank Prediction:**
   - Uses a weighted scoring system considering total scores, accuracy, and mistake corrections.
   - Predicts a rank based on previous NEET results data.

4. **College Prediction:**
   - Maps predicted rank ranges to medical colleges and suggests potential admission opportunities.

## Bonus Features
- Identifies weak areas and performance gaps.
- Provides improvement trends to help students focus on weak subjects.
- Suggests medical colleges based on predicted ranks.

## Submission Requirements
- Source code is available on GitHub.
- Screenshots of insights and rank prediction results.
- A demo video explaining the API functionality.

## Contributors
- **Your Name**
- **Your Contact Info**

