const axios = require("axios");
const fetch = require("node-fetch");

const query = `
  query getUserProfile($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      username
      contributions {
        points
      }
      profile {
        reputation
        ranking
        realName
        aboutMe
        userAvatar
        location
        skillTags
        websites
        company
        school
        starRating
      }
      submissionCalendar
      submitStats {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
        }
      }
      badges {
        id
        displayName
        icon
        creationDate
      }
    }
    recentSubmissionList(username: $username, limit: 20) {
      title
      titleSlug
      timestamp
      statusDisplay
      lang
      runtime
      memory
      url
      __typename
    }
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      totalParticipants
      topPercentage
      badge {
        name
        icon
      }
    }
  }
`;

const formatData = (data) => {
    let sendData = {
        username: data.matchedUser.username,
        totalSolved: data.matchedUser.submitStats.acSubmissionNum[0].count,
        totalSubmissions: data.matchedUser.submitStats.totalSubmissionNum[0].count,
        totalQuestions: data.allQuestionsCount[0].count,
        easySolved: data.matchedUser.submitStats.acSubmissionNum[1].count,
        totalEasy: data.allQuestionsCount[1].count,
        mediumSolved: data.matchedUser.submitStats.acSubmissionNum[2].count,
        totalMedium: data.allQuestionsCount[2].count,
        hardSolved: data.matchedUser.submitStats.acSubmissionNum[3].count,
        totalHard: data.allQuestionsCount[3].count,
        ranking: data.matchedUser.profile.ranking,
        contributionPoints: data.matchedUser.contributions.points,
        reputation: data.matchedUser.profile.reputation,
        submissionCalendar: JSON.parse(data.matchedUser.submissionCalendar),
        recentSubmissions: data.recentSubmissionList,
        profile: {
            realName: data.matchedUser.profile.realName,
            aboutMe: data.matchedUser.profile.aboutMe,
            userAvatar: data.matchedUser.profile.userAvatar,
            location: data.matchedUser.profile.location,
            skillTags: data.matchedUser.profile.skillTags,
            websites: data.matchedUser.profile.websites,
            company: data.matchedUser.profile.company,
            school: data.matchedUser.profile.school,
            starRating: data.matchedUser.profile.starRating,
        },
        badges: data.matchedUser.badges,
        contestRanking: data.userContestRanking,
    };
    return sendData;
};

exports.fetchLeetcodeData = async (usernames) => {
    // try {
    //     const response = await axios.post(process.env.LEETSCAN_API_URL, { usernames });
    //     console.log(response.data);
    //     return response.data;
    // } catch (error) {
    //     console.error("Error fetching LeetCode data:", error);
    //     throw error;
    // }

    if (!usernames || !Array.isArray(usernames)) {
        return res.status(400).json({ error: "Usernames must be an array" });
    }

    try {
        const profilePromises = usernames.map((username) =>
            fetch("https://leetcode.com/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Referer: "https://leetcode.com",
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                },
                body: JSON.stringify({
                    query: query,
                    variables: { username: username },
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.errors) {
                        return { username, error: "User not found or API error", details: data.errors };
                    } else {
                        return { username, profile: formatData(data.data) };
                    }
                })
                .catch((err) => {
                    console.error("Error fetching profile for", username, err);
                    return { username, error: "Internal server error", details: err.message };
                })
        );

        const profiles = await Promise.all(profilePromises);

        return profiles;
    } catch (err) {
        console.error("Error fetching LeetCode data:", error);
        throw error;
    }
};

const QuestionCache = require("../models/QuestionCache");

exports.fetchQuestionDifficulty = async (titleSlug) => {
    let cachedQuestion = await QuestionCache.findOne({ titleSlug });

    if (cachedQuestion) {
        return cachedQuestion.difficulty;
    }

    const difficulty = await fetchFromLeetCodeAPI(titleSlug);

    await QuestionCache.create({ titleSlug, difficulty });

    return difficulty;
};

async function fetchFromLeetCodeAPI(titleSlug) {
    try {
        const response = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
          query questionData($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
              difficulty
            }
          }
        `,
                variables: {
                    titleSlug: titleSlug,
                },
            }),
        });
        const data = await response.json();
        return data.data.question.difficulty;
    } catch (error) {
        console.error("Error fetching question difficulty:", error);
        throw error;
    }
}
