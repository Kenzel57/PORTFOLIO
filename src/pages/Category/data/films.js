// All films in a category (used by the Category page).
// The list comes straight from categories.js, so nothing is made up.
export function getFilms(cat) {
  return cat.films;
}

// One film plus everything the Film page needs (used by the Film page).
// The gallery only contains this film's OWN stills and short shots.
export function getFilm(cat, n) {
  const films = cat.films;
  const i = films.findIndex((f) => f.n === n);
  if (i === -1) return null;

  const film = films[i];

  const stills = film.stills.map((name) => ({
    type: "image",
    src: `/stills/${cat.slug}/${film.file}/${name}`,
  }));
  const shots = film.shots.map((name) => ({
    type: "video",
    src: `/videos/shots/${cat.slug}/${film.file}/${name}`,
  }));

  // alternate still, shot, still, shot ...
  const gallery = [];
  const len = Math.max(stills.length, shots.length);
  for (let k = 0; k < len; k++) {
    if (stills[k]) gallery.push(stills[k]);
    if (shots[k]) gallery.push(shots[k]);
  }

  return {
    ...film,
    credit: "Written, filmed and edited by Kenzel",
    award: "", // for example "Vimeo Staff Pick 2025", leave empty to hide
    gallery,
    prev: films[(i - 1 + films.length) % films.length],
    next: films[(i + 1) % films.length],
    hasSiblings: films.length > 1,
  };
}