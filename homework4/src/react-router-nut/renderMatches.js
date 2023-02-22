import { RouteContext } from "./context";

export default function renderMatches(matches) {
  return matches.reduceRight(
    (outlet, match) => (
      <RouteContext.Provider value={{ outlet, matches, match }}>
        {match.route.element || outlet}
      </RouteContext.Provider>
    ),
    null
  );
}
