import { needsRecordingRequest } from '../lib/attendance.js';
import '../styles/recording-request.css';

export default function RecordingRequest({ session, sessions }) {
  if (!needsRecordingRequest(session, sessions)) return null;
  return <aside className="summit-recording-request" aria-labelledby="summit-recording-request-title">
    <h2 id="summit-recording-request-title">Help capture this session</h2>
    <p>I missed this session and would love to include its insights here. If you attended and have a transcript you’re allowed to share, it would be a huge help!</p>
    <p>If you already have a recording, Voice Memos can generate a transcript (on supported devices). Email the transcript to <a href="mailto:alexrussellria@gmail.com">alexrussellria@gmail.com</a>.</p>
    <p className="summit-recording-permissions">Please respect the speaker’s and event’s recording permissions, and send transcripts rather than public recording links.</p>
  </aside>;
}
