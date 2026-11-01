function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=60"
    }
  });
}

function notFound() {
  return json({ error: "Not found" }, 404);
}

async function getRaces(db, season) {
  const { results } = await db.prepare(`
    SELECT *
    FROM races
    WHERE season = ?
    ORDER BY CAST(round AS INTEGER)
  `).bind(season).all();

  return results.map((race) => ({
    _id: `${race.season}-${race.round}`,
    season: race.season,
    round: String(race.round),
    raceName: race.race_name,
    circuit: {
      circuitId: race.circuit_id,
      name: race.circuit_name,
      locality: race.locality,
      country: race.country
    },
    date: `${race.race_date}T00:00:00.000Z`,
    time: race.race_time,
    sessions: JSON.parse(race.sessions_json)
  }));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (!path.startsWith("/api/")) {
      return env.ASSETS.fetch(request);
    }

    if (request.method !== "GET") {
      return json({ error: "Method not allowed" }, 405);
    }

    try {
      const season = url.searchParams.get("season") || "2026";

      if (path === "/api/health") {
        return json({ status: "ok" });
      }

      if (path === "/api/races") {
        return json(await getRaces(env.DB, season));
      }

      if (path === "/api/drivers") {
        const { results } = await env.DB.prepare(`
          SELECT
            driver_id AS driverId,
            permanent_number AS permanentNumber,
            code,
            given_name AS givenName,
            family_name AS familyName,
            date_of_birth AS dateOfBirth,
            nationality
          FROM drivers
          ORDER BY family_name
        `).all();

        return json(results);
      }

      if (path === "/api/constructors") {
        const { results } = await env.DB.prepare(`
          SELECT
            constructor_id AS constructorId,
            name,
            nationality
          FROM constructors
          ORDER BY name
        `).all();

        return json(results);
      }

      if (path === "/api/driver-standings") {
        const { results } = await env.DB.prepare(`
          SELECT payload_json
          FROM driver_standings
          WHERE season = ?
          ORDER BY position
        `).bind(season).all();

        return json(results.map((row) => JSON.parse(row.payload_json)));
      }

      if (path === "/api/constructor-standings") {
        const { results } = await env.DB.prepare(`
          SELECT payload_json
          FROM constructor_standings
          WHERE season = ?
          ORDER BY position
        `).bind(season).all();

        return json(results.map((row) => JSON.parse(row.payload_json)));
      }

      if (path === "/api/circuits/current") {
        const { results } = await env.DB.prepare(`
          SELECT *
          FROM circuits
          ORDER BY circuit_id
        `).all();

        return json(results.map((circuit) => ({
          id: circuit.circuit_id,
          name: circuit.name,
          country: circuit.country,
          layoutId: circuit.layout_id,
          svgPath: `/assets/circuits/${circuit.layout_id}.svg`,
          length: circuit.length,
          laps: circuit.laps,
          fastestLap: JSON.parse(circuit.fastest_lap_json)
        })));
      }

      if (path === "/api/results") {
        const { results } = await env.DB.prepare(`
          SELECT
            rr.season,
            rr.round,
            rr.result_key AS resultKey,
            r.race_name AS raceName,
            rr.results_json
          FROM race_results rr
          LEFT JOIN races r
            ON r.season = rr.season AND r.round = rr.round
          WHERE rr.season = ?
          ORDER BY rr.round
        `).bind(season).all();

        return json(results.map((row) => {
          const resultData = JSON.parse(row.results_json);

          return {
            season: row.season,
            round: row.round,
            resultKey: row.resultKey,
            raceName: row.raceName,
            has_sprint: resultData.has_sprint
          };
        }));
      }

      const resultMatch = path.match(
        /^\/api\/results\/(\d{4})\/(\d+)$/
      );

      if (resultMatch) {
        const resultSeason = resultMatch[1];
        const round = Number(resultMatch[2]);

        const result = await env.DB.prepare(`
          SELECT results_json
          FROM race_results
          WHERE season = ? AND round = ?
        `).bind(resultSeason, round).first();

        if (!result) return notFound();

        return json(JSON.parse(result.results_json));
      }

      return notFound();
    } catch (error) {
      console.error("API error:", error);
      return json({ error: "Internal server error" }, 500);
    }
  }
};