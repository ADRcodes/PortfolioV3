// Temporary test/browser fixtures only; never discovered as production articles.
export function recapFixture(overrides = {}) {
  return {
    id: 'recap-test-evidence', slug: 'test-evidence', title: 'Connecting the evidence across discussions',
    description: 'A temporary editorial fixture for verifying article layout and navigation.',
    excerpt: 'A fixture exploring how contrasting examples can clarify a shared question without turning interpretation into a speaker’s claim.',
    publishedAt: '2026-10-21T12:00:00Z', updatedAt: '2026-10-21T13:00:00Z', status: 'published',
    relatedSessionSlugs: ['assumption-trap', 'internal-innovation'], speakerIds: [],
    highlightedInsight: { heading: 'Keep evidence and interpretation distinct', explanation: 'This is fixture text used to verify the highlighted insight treatment.' },
    sections: [
      { heading: 'Start with the question, then compare the evidence', paragraphs: ['A cross-session article should connect arguments without treating every speaker as if they reached the same conclusion. This temporary fixture contains no reporting or claims about the real Summit.', 'These paragraphs exercise a comfortable reading width, clear spacing and the relationship between a section heading and its supporting ideas. The actual articles will be written and verified separately.'], sessionSlugs: ['assumption-trap'] },
      { heading: 'Make the connection useful without erasing the differences', paragraphs: ['This second section verifies that supporting session links remain distinct from the editorial interpretation. Readers can return to the published session notes to explore the evidence in context.'], bullets: ['Preserve the speaker’s qualifications.', 'Label synthesis as editorial interpretation.'] },
    ],
    ...overrides,
  };
}
