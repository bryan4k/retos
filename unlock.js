const UnlockManager = (function () {
  'use strict';

  const sequences = {
    practice: {},
    reading: {},
    logic: {}
  };

  function groupKey(c, app) {
    if (app === 'logic') return `logica::${c.level}`;
    return `${c.tech}::${c.level}`;
  }

  function sortChallenges(items) {
    return [...items].sort((a, b) => {
      const na = parseInt((a.id.match(/(\d+)$/) || [0, 0])[1], 10);
      const nb = parseInt((b.id.match(/(\d+)$/) || [0, 0])[1], 10);
      if (na !== nb) return na - nb;
      return a.id.localeCompare(b.id);
    });
  }

  function buildSequences(app, pool) {
    const groups = {};
    pool.forEach((c) => {
      const key = groupKey(c, app);
      if (!groups[key]) groups[key] = [];
      groups[key].push(c);
    });
    Object.entries(groups).forEach(([key, items]) => {
      sequences[app][key] = sortChallenges(items).map((c) => c.id);
    });
  }

  function init(practicePool, readingPool, logicPool) {
    buildSequences('practice', practicePool);
    buildSequences('reading', readingPool);
    buildSequences('logic', logicPool);
  }

  function getSequence(app, challenge) {
    const key = groupKey(challenge, app);
    return sequences[app][key] || [];
  }

  function isUnlocked(app, challenge, progress) {
    const seq = getSequence(app, challenge);
    if (!seq.length) return true;
    const idx = seq.indexOf(challenge.id);
    if (idx <= 0) return true;
    for (let i = 0; i < idx; i++) {
      if (!progress[seq[i]]) return false;
    }
    return true;
  }

  function getUnlockIndex(app, challenge) {
    const seq = getSequence(app, challenge);
    return Math.max(0, seq.indexOf(challenge.id));
  }

  function nextLockedReason(app, challenge, progress) {
    const seq = getSequence(app, challenge);
    const idx = seq.indexOf(challenge.id);
    if (idx <= 0) return null;
    for (let i = idx - 1; i >= 0; i--) {
      if (!progress[seq[i]]) {
        const prev = challengeFromId(app, seq[i]);
        return prev ? `Completa primero: «${prev.title}»` : 'Completa el reto anterior de esta serie.';
      }
    }
    return null;
  }

  function challengeFromId(app, id) {
    const pool = app === 'practice' ? CHALLENGES
      : app === 'logic' ? LOGIC_CHALLENGES : READING_CHALLENGES;
    return pool.find((c) => c.id === id);
  }

  function firstUnlocked(app, pool, levelsPlan, progress) {
    const inPlan = pool.filter((c) => levelsPlan[c.level] !== false);
    return sortChallenges(inPlan).find((c) => isUnlocked(app, c, progress) && !progress[c.id])
      || sortChallenges(inPlan).find((c) => isUnlocked(app, c, progress))
      || null;
  }

  return {
    init,
    isUnlocked,
    getUnlockIndex,
    nextLockedReason,
    firstUnlocked,
    getSequence
  };
})();