export const previewImages = {
  "hirag-personal-ai": "/images/projects/hirag-home.png",
  "out-and-about-events": "/images/projects/outandabout-homepage.png",
  "spiritual-retreat-centre": "/images/portfolio-v2/TOLscreenshot.png",
  "erco-homes-clone": "/images/portfolio-v2/ErcoWebsitePic.png",
  "movie-night": "/images/portfolio-v2/movie-site-screenshot.png",
};

export const projectNotes = {
  "hirag-personal-ai": "Document intelligence, retrieval, and source-backed answers.",
  "out-and-about-events": "A calmer interface for finding local events and making plans.",
  "ai-builders-club": "A demo-and-discussion format for people building practical AI tools.",
  "portfolio-ai-dev-workflow": "A live testbed for portfolio systems and assisted development.",
  "spiritual-retreat-centre": "Client website delivery with familiar publishing workflows.",
  "erco-homes-clone": "A no-framework frontend exercise built in HTML, CSS, and JavaScript.",
  "movie-night": "A watchlist and discovery concept for film browsing.",
};

export function getProjectPath(project) {
  return `/projects/${project.id}`;
}

export function getProjectPreviewImage(project) {
  return previewImages[project.id] || project.image || null;
}

export function getProjectNote(project) {
  return projectNotes[project.id] || project.subtitle;
}
