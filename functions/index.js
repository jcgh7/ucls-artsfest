const { onValueWritten } = require("firebase-functions/v2/database");

/**
 * Logs only the changed keys and new values anywhere in the database
 */
exports.logDBChanges = onValueWritten(
  "/*",
  (event) => {
    const before = event.data.before.val() || {};
    const after = event.data.after.val() || {};

    // Compute the shallow diff
    const diff = {};
    for (const key of Object.keys(after)) {
      if (before[key] !== after[key]) {
        diff[key] = after[key];
      }
    }

    // If nothing changed (rare with recursive triggers), skip logging
    if (Object.keys(diff).length === 0) return;

    console.log("RTDB CHANGE", {
      path: event.ref.toString(),
      params: event.params,
      changes: diff,
      timestamp: new Date().toISOString(),
    });
  }
);
