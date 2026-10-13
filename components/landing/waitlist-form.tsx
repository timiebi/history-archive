"use client";

import { useState } from "react";

export function WaitlistForm() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <form
        className="waitlist-form waitlist-form-wide"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        <label className="sr-only" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          autoComplete="email"
          required
          disabled={sent}
        />
        <label className="sr-only" htmlFor="role">
          I am a
        </label>
        <select id="role" name="role" defaultValue="traveler" required disabled={sent}>
          <option value="traveler">Traveler</option>
          <option value="contributor">Contributor</option>
          <option value="partner">Tourism partner</option>
        </select>
        <label className="sr-only" htmlFor="country">
          Country or region
        </label>
        <input
          id="country"
          name="country"
          type="text"
          placeholder="Country or region"
          autoComplete="country-name"
          disabled={sent}
        />
        <button type="submit" className="btn btn-platform-primary" disabled={sent}>
          {sent ? "Received" : "Send"}
        </button>
      </form>
      {sent ? (
        <p className="form-success" role="status">
          Thank you — we&apos;ll be in touch.
        </p>
      ) : null}
    </>
  );
}
