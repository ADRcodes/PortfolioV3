import { useState } from "react";
import emailjs from "@emailjs/browser";
import { AlertCircle, CheckCircle2, LoaderCircle, Send } from "lucide-react";
import AnimatedPage from "../components/ui/AnimatedPage.jsx";
import LinkButton from "../components/ui/LinkButton.jsx";
import { contactLinks } from "../data/navigation.js";

const emailServiceId = "service_119lqg7";
const emailTemplateId = "template_f8d6noz";
const emailPublicKey = "_rSpqJBYqopPqe0dz";
const fieldPlaceholders = {
  name: "Cody Appleseed",
  message: "I love your work. Please work on a project with me, you can name your price",
  email: "cody.appleseed@example.com",
};

const getEmailErrorMessage = (error) => {
  const detail = error?.text || error?.message;

  if (!detail) {
    return "EmailJS rejected the request. Check the browser console for details.";
  }

  return `EmailJS rejected the request: ${detail}`;
};

function EditablePhraseField({ ariaLabel, className = "", field, maxWidth, onChange, placeholder, resetKey }) {
  const handleInput = (event) => {
    onChange(field, event.currentTarget.textContent || "");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  return (
    <span
      aria-label={ariaLabel}
      className={`editable-phrase-field ${className}`}
      contentEditable
      data-placeholder={placeholder}
      key={`${field}-${resetKey}`}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      role="textbox"
      style={{ maxWidth }}
      suppressContentEditableWarning
    />
  );
}

export default function Contact() {
  const [fields, setFields] = useState({
    name: "",
    message: "",
    email: "",
  });
  const [resetKey, setResetKey] = useState(0);
  const [status, setStatus] = useState("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const updateField = (field, value) => {
    setFields((currentFields) => ({
      ...currentFields,
      [field]: value,
    }));
    setStatus("idle");
    setStatusMessage("");
  };

  const sendEmail = (event) => {
    event.preventDefault();

    const name = fields.name.trim();
    const message = fields.message.trim();
    const email = fields.email.trim();

    if (!name || !message || !email) {
      return;
    }

    setStatus("sending");
    setStatusMessage("");

    emailjs
      .send(
        emailServiceId,
        emailTemplateId,
        {
          user_name: name,
          user_email: email,
          from_name: name,
          from_email: email,
          reply_to: email,
          email,
          message,
        },
        {
          publicKey: emailPublicKey,
        },
      )
      .then(() => {
        setFields({
          name: "",
          message: "",
          email: "",
        });
        setResetKey((currentKey) => currentKey + 1);
        setStatus("success");
        setStatusMessage("Message sent. I'll get back to you soon.");
      })
      .catch((error) => {
        console.error("EmailJS send failed", error);
        setStatus("error");
        setStatusMessage(getEmailErrorMessage(error));
      });
  };

  const isSending = status === "sending";
  const hasName = fields.name.trim().length > 0;
  const hasMessage = fields.message.trim().length > 0;
  const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim());
  const isReadyToSend = hasName && hasMessage && hasValidEmail;

  return (
    <AnimatedPage className="flex min-h-[calc(100svh-5rem)] flex-col justify-center">
      <section className="w-full">
        <form
          id="contact-form"
          onSubmit={sendEmail}
          className="mx-auto max-w-6xl px-3 py-10 text-center sm:px-6 sm:py-16 lg:px-10"
        >
          <div className="text-[clamp(2rem,4.1vw,4.25rem)] font-semibold leading-[1.16] tracking-normal text-ink">
            <span className="text-clay">You:</span>
            <span> "Hi, I'm</span>
            <EditablePhraseField
              aria-label="Your name"
              className="max-w-[15ch]"
              field="name"
              onChange={updateField}
              placeholder={fieldPlaceholders.name}
              resetKey={resetKey}
            />
            <span>, I wanted to say</span>
            <EditablePhraseField
              aria-label="Your message"
              className="max-w-[38ch]"
              field="message"
              onChange={updateField}
              placeholder={fieldPlaceholders.message}
              resetKey={resetKey}
            />
            <span>.</span>
            <div className="mt-5">
              <span>You can email me back at</span>
              <EditablePhraseField
                aria-label="Your email"
                className="max-w-[27ch]"
                field="email"
                onChange={updateField}
                placeholder={fieldPlaceholders.email}
                resetKey={resetKey}
              />
              <span>"</span>
            </div>
          </div>

          <div className="mt-10 flex min-h-12 justify-center">
            {isReadyToSend ? (
              <button
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-paper shadow-[0_14px_34px_rgb(31_42_36_/_0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-moss-dark disabled:cursor-not-allowed disabled:opacity-65 disabled:hover:translate-y-0 disabled:hover:bg-ink"
                type="submit"
                disabled={isSending}
              >
                {isSending ? (
                  <LoaderCircle aria-hidden="true" className="animate-spin" size={17} />
                ) : (
                  <Send aria-hidden="true" size={17} />
                )}
                {isSending ? "Sending" : "Send message"}
              </button>
            ) : null}
          </div>

          {statusMessage ? (
            <p
              className={`mt-5 flex items-center justify-center gap-2 text-sm font-semibold ${status === "success" ? "text-moss-dark" : "text-clay"
                }`}
              role="status"
            >
              {status === "success" ? (
                <CheckCircle2 aria-hidden="true" size={17} />
              ) : (
                <AlertCircle aria-hidden="true" size={17} />
              )}
              {statusMessage}
            </p>
          ) : null}
        </form>
      </section>

      <section className="mt-20">
        <div className="flex flex-wrap justify-center gap-3">
          {contactLinks.map((link) => (
            <LinkButton key={link.label} href={link.href} variant="secondary">
              {link.label}
            </LinkButton>
          ))}
        </div>
      </section>
    </AnimatedPage>
  );
}
