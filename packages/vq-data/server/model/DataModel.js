const CLARITY_API_BASE = 'https://www.clarity.ms/export-data/api/v1';

/**
 * fetchClarityData
 * @param {*} token
 * @param {*} numOfDays
 * @returns
 */
exports.fetchClarityData = async (token, numOfDays) => {
  const params = new URLSearchParams({ numOfDays: String(numOfDays) });
  const url = `${CLARITY_API_BASE}/project-live-insights?${params}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return res.json();
};
