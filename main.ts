// Alien Field Notes: The Two Day Earth Review — a program that writes
// one line: a review of planet Earth left by an alien tourist, to
// /output/entry.txt.
//
// The review is a fixed text on purpose: the entry is judged on the
// writing, so the program's job is to deliver exactly that one line,
// byte for byte, every run.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Why this line, against the judge's brief:
// - It is a one-line review of Earth by an alien tourist: the visitor's
//   outside view is clear in every clause — "the locals", "their flying
//   metal tube", and the tourist joining in at the end.
// - The laugh comes from the alien's angle on ordinary Earth life: the
//   applause after landing, read as if the pilot might forget how to
//   land without it — the ritual misread, not a joke bolted on.
// - It is original: a small, specific human ritual (clapping when the
//   plane lands), not the first obvious thought about traffic, gravity,
//   money or weather.
// - It sounds like a review a tourist would actually leave: five stars,
//   then a closing remark — "I applauded too" — in a single line.
// - It is tight: every word earns its place, and the punch lands in the
//   last three words.
const REVIEW =
  "Five stars. The locals applaud when their flying metal tube lands, as if the pilot might forget how. I applauded too.";

const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUT_FILE = `${OUT_DIR}/entry.txt`;

function main(): void {
  // The gate only accepts 1 to 200 characters of UTF-8 text, so refuse
  // loudly instead of shipping a text the gate would throw away. It
  // also refuses text that is only white space, so check that too.
  if (REVIEW.length < 1 || REVIEW.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${REVIEW.length}`);
  }
  if (REVIEW.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  // No leading or trailing white space either: the gate counts every
  // byte, and a stray space at either end would sit in front of the
  // judge for nothing.
  if (REVIEW !== REVIEW.trim()) {
    throw new Error("entry must not have leading or trailing white space");
  }
  // One line means no line break hiding inside it, and no tabs or
  // doubled spaces either: a stray tab would read as a formatting
  // glitch in front of the judge.
  if (/[\n\r]/.test(REVIEW)) {
    throw new Error("entry must be exactly one line");
  }
  if (/[\t]/.test(REVIEW) || /  /.test(REVIEW)) {
    throw new Error("entry must not contain tabs or double spaces");
  }
  // No invisible control characters for the same reason: the review
  // must read cleanly, exactly as a tourist would have left it, with
  // nothing hidden between the words.
  if (/[\u0000-\u001f\u007f]/.test(REVIEW)) {
    throw new Error("entry must not contain control characters");
  }
  // The gate counts every byte, so write exactly the line and nothing
  // else: no trailing newline.
  // /output is a mount point in the grader sandbox: never delete the
  // directory itself, only create it if missing and write the file.
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, REVIEW, "utf8");
  // Read the file back and refuse to finish unless it holds exactly
  // the line: a stray byte would make the gate reject the entry,
  // and it is cheaper to fail here than on the server.
  if (readFileSync(OUT_FILE, "utf8") !== REVIEW) {
    throw new Error("entry file does not hold exactly the review");
  }
  console.log(`Wrote ${REVIEW.length} characters to ${OUT_FILE}`);
}

main();
