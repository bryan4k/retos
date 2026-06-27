const CHALLENGES = ChallengeGenerator.generateAll().map((c) => LearnContent.enrich(c));
const LOGIC_CHALLENGES = LogicGenerator.generateAll().map((c) => LearnContent.enrich(c));
const READING_CHALLENGES = ReadingGenerator.generateAll().map((c) => LearnContent.enrich(c));

const CHALLENGE_STATS = {
  practice: CHALLENGES.length,
  reading: READING_CHALLENGES.length,
  logic: LOGIC_CHALLENGES.length,
  perGroup: ChallengeGenerator.PER_GROUP
};