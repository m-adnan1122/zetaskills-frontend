# ZetaSkills chatbot setup

The assistant uses the website's course data in `data/courses.json` and the contact information in `lib/contact.ts`. It does not read enrollment records. Without a Gemini API key, it answers a limited set of common questions from local data; it is not a general AI conversation in that mode.

## Enable Gemini

1. Use Node.js 20 or newer. Create a Google Gemini API key in Google AI Studio for the organization's intended project. Check the account's billing, quotas and provider data policy before use.
2. Add `GEMINI_API_KEY` to the server-only `.env` or `.env.local` file. Optionally set `CHAT_MODEL` to an available Gemini model; the default is `gemini-2.5-flash`. Never use `NEXT_PUBLIC_` for the key, and never commit or paste it in chat.
3. Restart the development server. For production, add the variables in the deployment environment and redeploy. Confirm the key and chosen model are available to that project.
4. Test a course question, a follow-up, an unknown fee and a question outside the supplied website information. AI can make mistakes: review the results and the draft course syllabi before launch. If Gemini fails, the assistant falls back to basic answers; server logs do not include chat contents.

## Voice and privacy

Microphone input uses the browser's speech recognition where supported. The user must request microphone access; speech recognition support, Urdu support and processing location depend on the browser/device, and audio may be sent to the browser's speech provider. The Listen button uses device/browser speech synthesis; available voices vary. Both features require testing on target devices. Text chat remains available without voice.

When Gemini is configured, recent chat messages and public course information are sent to Google for processing. Chat history is kept only in the open widget's browser memory by this implementation and is not stored in the enrollment database. Users are asked not to enter CNIC, passwords or payment details; a pattern check blocks common CNIC formats, but it is not comprehensive privacy filtering. Set a suitable privacy notice and provider agreement before launch.

The included request limit is per server instance and not a reliable distributed production limiter. Before enabling a paid public AI endpoint, add a shared rate limit, usage monitoring and budget controls. Review and update the documented institute details and syllabi, and verify answers against approved content. Existing Next.js dependencies have npm audit advisories that should be addressed before launch.
