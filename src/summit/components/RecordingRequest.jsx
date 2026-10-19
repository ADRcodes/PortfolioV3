import { needsRecordingRequest } from '../lib/attendance.js';
import '../styles/recording-request.css';

export default function RecordingRequest({ session, sessions }) {
  if (!needsRecordingRequest(session, sessions)) return null;
  return <aside className="summit-recording-request" aria-labelledby="summit-recording-request-title">
    <h2 id="summit-recording-request-title">Help capture this session</h2>
    <p>I won’t be able to attend this one, but I’d love to include its insights on the site. If you’re going, a recording or transcript would be a huge help!</p>
    <p>You can use the Voice Memos app on your iPhone to record the presentation and generate a transcript (on supported devices). Then email the transcript to <a href="mailto:alexrussellria@gmail.com">alexrussellria@gmail.com</a>.</p>
    <p className="summit-recording-permissions">Please respect the speaker’s and event’s recording permissions, and send transcripts rather than public recording links.</p>
  </aside>;
}
