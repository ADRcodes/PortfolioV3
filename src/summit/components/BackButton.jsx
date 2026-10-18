import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function BackButton({ fallback }) {
  const navigate = useNavigate();
  const back = () => {
    // BrowserRouter marks in-app history entries. A direct visit needs a safe
    // local fallback rather than sending the visitor out of the companion.
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate(fallback, { replace: true });
  };
  return <button className="summit-header-back" type="button" aria-label="Go back" title="Go back" onClick={back}><ArrowLeft size={24} aria-hidden="true" /></button>;
}
