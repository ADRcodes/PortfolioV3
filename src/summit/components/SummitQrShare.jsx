import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Copy, Download, QrCode, Share2, X } from 'lucide-react';
import { copyPublicLink, sharePublicLink, SUMMIT_QR_ASSET, SUMMIT_QR_DOWNLOAD, SUMMIT_SHARE_URL } from '../lib/share.js';
import '../styles/qr-share.css';

export default function SummitQrShare() {
  const dialog = useRef(null);
  const [host, setHost] = useState(null);
  const [open, setOpen] = useState(false);
  const [nativeShare, setNativeShare] = useState(false);
  const [status, setStatus] = useState('idle');
  useEffect(() => {
    setHost(document.querySelector('.summit-app'));
    setNativeShare(typeof navigator.share === 'function');
    return () => { dialog.current?.close(); };
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    const padding = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const position = { top: window.scrollY, left: window.scrollX, behavior: 'instant' };
    const entry = window.history.state?.key;
    const url = window.location.href;
    if (scrollbar) document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + scrollbar}px`;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
      document.body.style.paddingRight = padding;
      // Restore after native dialog focus and scrollbar layout have settled.
      requestAnimationFrame(() => {
        if (!dialog.current?.open && window.location.href === url && window.history.state?.key === entry) window.scrollTo(position);
      });
    };
  }, [open]);
  const messages = { copied: 'Link copied.', shared: 'Link shared.', cancelled: 'Sharing cancelled.', manual: 'Could not copy automatically. Select and copy the link below.' };
  return <>
    <button className="summit-qr-nav" type="button" aria-label="Share Summit QR code" aria-haspopup="dialog" aria-controls="summit-qr-dialog" disabled={!host} onClick={() => {
      setStatus('idle');
      dialog.current.showModal();
      setOpen(true);
    }}><QrCode size={23} aria-hidden="true" /></button>
    {host && createPortal(<dialog ref={dialog} id="summit-qr-dialog" className="summit-qr-dialog" aria-labelledby="summit-qr-title" aria-describedby="summit-qr-description" onClose={() => setOpen(false)} onClick={event => {
      if (event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.current.close();
    }}>
      <button className="summit-qr-close" type="button" aria-label="Close QR code" autoFocus onClick={() => dialog.current.close()}><X size={23} aria-hidden="true" /></button>
      <h2 id="summit-qr-title">Share the Summit</h2>
      <p id="summit-qr-description">Scan to open the agenda and session notes.</p>
      <img className="summit-qr-image" src={SUMMIT_QR_ASSET} width="280" height="280" alt="QR code linking to https://alexrussell.info/technlsummit" />
      <a className="summit-qr-url" href={SUMMIT_SHARE_URL}>alexrussell.info/technlsummit</a>
      <div className="summit-qr-actions">
        <button type="button" disabled={status === 'sharing'} onClick={async () => setStatus(await copyPublicLink(SUMMIT_SHARE_URL))}>{status === 'copied' ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}<span>Copy Link</span></button>
        {nativeShare && <button type="button" disabled={status === 'sharing'} onClick={async () => {
          setStatus('sharing');
          setStatus(await sharePublicLink({ title: 'techNL Summit 2026 | Independent companion', url: SUMMIT_SHARE_URL }));
        }}><Share2 size={18} aria-hidden="true" /><span>Share Link</span></button>}
      </div>
      <p className="summit-qr-feedback" role="status" aria-live="polite">{messages[status] ?? ''}</p>
      {status === 'manual' && <label className="summit-qr-manual">Website link<input readOnly value={SUMMIT_SHARE_URL} onFocus={event => event.target.select()} /></label>}
      <a className="summit-qr-download" href={SUMMIT_QR_DOWNLOAD} download="techNL-Summit-QR.png"><Download size={17} aria-hidden="true" />Save high-resolution QR</a>
    </dialog>, host)}
  </>;
}
