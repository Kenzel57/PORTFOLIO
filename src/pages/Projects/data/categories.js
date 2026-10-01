export const categories = [
  { id: 1, slug: "weddings", title: "Weddings", aspect: "16/9", autoplay: true,
    d: { row: 1, col: 1, span: 4, mt: 0 }, m: { w: 62, x: 0, mt: 0 },
    films: [{ file: "marriage", title: "Marriage" }] },

  { id: 2, slug: "conferences", title: "Conferences", aspect: "16/10", autoplay: false,
    d: { row: 1, col: 7, span: 6, mt: 64 }, m: { w: 68, x: 32, mt: 48 },
    films: [{ file: "conference", title: "Conference" }] },

  { id: 3, slug: "restaurants", title: "Restaurants", aspect: "3/4", autoplay: true,
    d: { row: 2, col: 2, span: 3, mt: 40 }, m: { w: 48, x: 6, mt: 56 },
    films: [{ file: "restaurant", title: "Restaurant" }] },

  { id: 4, slug: "nightlife", title: "Clubs & Nightlife", aspect: "16/9", autoplay: true,
    d: { row: 2, col: 7, span: 5, mt: 140 }, m: { w: 70, x: 30, mt: 48 },
    films: [{ file: "club", title: "Club Night" }] },

  { id: 5, slug: "barbershops", title: "Barbershops", aspect: "16/9", autoplay: false,
    d: { row: 3, col: 1, span: 5, mt: 0 }, m: { w: 64, x: 4, mt: 56 },
    films: [{ file: "barbershop", title: "Barbershop" }] },

  { id: 6, slug: "beauty-salons", title: "Beauty Salons", aspect: "1/1", autoplay: true,
    d: { row: 3, col: 9, span: 3, mt: 90 }, m: { w: 46, x: 54, mt: 48 },
    films: [{ file: "beauty-salon", title: "Beauty Salon" }] },

  { id: 7, slug: "nail-studios", title: "Nail Studios", aspect: "16/9", autoplay: true,
    d: { row: 4, col: 3, span: 6, mt: 30 }, m: { w: 78, x: 10, mt: 56 },
    films: [{ file: "nail-salon", title: "Nail Salon" }] },

  { id: 8, slug: "gaming", title: "Gaming", aspect: "4/5", autoplay: false,
    d: { row: 4, col: 10, span: 3, mt: 0 }, m: { w: 50, x: 0, mt: 48 },
    films: [{ file: "games", title: "Games" }] },

  { id: 9, slug: "landmarks", title: "Landmarks", aspect: "16/9", autoplay: true,
    d: { row: 5, col: 4, span: 5, mt: 60 }, m: { w: 66, x: 6, mt: 56 },
    films: [{ file: "monument", title: "Monument" }] },
].map((c) => {
  const films = c.films.map((f, i) => ({
    n: String(i + 1).padStart(2, "0"),
    type: "Film",
    year: null,
    stills: [],
    shots: [],
    ...f,
    video: `/videos/work/${c.slug}/${f.file}.mp4`,
    poster: `/posters/work/${c.slug}/${f.file}.jpg`,
  }));

  return {
    ...c,
    films,
    // the category tile previews its first film
    video: films[0].video,
    poster: films[0].poster,
    meta: `${films.length} ${films.length === 1 ? "film" : "films"}`,
  };
});