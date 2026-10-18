import test from 'node:test';
import assert from 'node:assert/strict';
import { descriptionPreview } from './preview.js';
test('compact copy keeps short biographies and prefers complete sentences without mutating source', () => {
  assert.equal(descriptionPreview('A complete short biography.'), 'A complete short biography.');
  const biography = 'A first sentence. ' + 'More context about the person and their work. '.repeat(10);
  const preview = descriptionPreview(biography);
  assert.ok(preview.length <= 180);
  assert.ok(preview.endsWith('.'));
  assert.ok(biography.length > 180);
  assert.ok(descriptionPreview('One long sentence without punctuation describing professional work '.repeat(5)).endsWith('…'));
});
