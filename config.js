// ─────────────────────────────────────────────────────────────
//  EDIT THIS FILE ONLY
// ─────────────────────────────────────────────────────────────

export const CONFIG = {
  // What your avatar says.
  greeting:
    "Hey hi, I'm Kumara Vijay. I'm a freelancer who can work as a data analyst, " +
    "in gen AI, and even build front end and back end applications using AI. " +
    "Welcome to my portfolio.",

  // Voice priority (automatic, no setting needed):
  //  1. public/avatar-talking.mp4  → talking VIDEO of your photo with exact
  //     ML lip sync (make free at heygen.com or d-id.com — see README)
  //  2. public/audio/greeting.mp3  → natural male voice over your photo
  //     (make free at elevenlabs.io)
  //  3. Browser's built-in male voice → works with zero setup
  browserVoice: {
    preferredNames: ["Google UK English Male", "Microsoft Ravi", "Daniel", "en-IN", "Male"],
    rate: 0.98,
    pitch: 0.92,
  },
};
