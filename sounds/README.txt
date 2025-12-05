Place your audio files here (these are NOT included in the repo).

Filenames expected by the app (drop into `public/sounds/`):
- `intro.mp3`        -> Intro/menu background music (loops)
- `school.mp3`       -> School / teacher / principal background music (loops)
- `evil.mp3`         -> Evil corporate / Victor background music (loops)
- `typing.wav`       -> Short 8-bit typing SFX used while text types
- `transition.wav`   -> Short transition FX played when scenes change

Tips:
- Use short, low-latency WAV/OGG for SFX (typing, transition) and MP3/OGG for BGM.
- Keep volumes reasonable; the app sets sensible defaults but you can tweak files.
- After adding files, just reload the dev server page to test.

Example: `public/sounds/typing.wav` -> referenced as `/sounds/typing.wav` in the app.

Browser autoplay note:
- Modern browsers block audio playback with sound until the user interacts with the page (click, tap, or keyboard).
- The app listens for your first click/tap and will start background music and SFX after that gesture.
- If you still don't hear audio, make sure you've added the files above and reload the page, then click anywhere.
