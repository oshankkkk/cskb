---
Title: Understanding Music Infomation Retrieval (MIR)
date: 2026-07-06
---
> https://youtu.be/gHT4d3Ep_M0?si=HtgRxNQELXCGL_MG
> https://youtu.be/oGGVvTgHMHw?si=t7c3eKIQ136-GvPK

![[MIR-1783279772162.webp|643]]
### What is MIR

![[MIR-1783281437946.webp|476]]



**Stage 1 — Seeing sound: the spectrogram**
Once Fourier transforms click, the next idea is the **STFT (Short-Time Fourier Transform)** — chopping audio into small overlapping windows and doing an FFT on each one, so you get a 2D picture of frequency-over-time (a spectrogram). This single data structure is the backbone of almost everything else here: onset detection, tempo, key, and the phase vocoder all start from it.
- Use **librosa** here purely as a magnifying glass, not a shortcut: load a real song, plot its spectrogram, look at it, understand what you're seeing. You're not writing code to ship yet, you're building intuition.

**Stage 2 — Onset detection ("when do things happen")**
From the spectrogram, you can detect *onsets* — moments where new sound events start (a drum hit, a note). This is usually done by measuring how much the spectrum changes frame-to-frame (spectral flux) and finding peaks in that curve.

**Stage 3 — Tempo & beat tracking ("what's the pulse")**
Once you have onsets, you look for the periodicity in them (autocorrelation, or a "tempogram") to estimate BPM, then use something like Ellis's dynamic-programming beat tracker to fit an actual beat grid on top — not just "this song is roughly 120 BPM" but "here is beat 1, beat 2, beat 3..." exactly in time.

**Stage 4 — Key detection ("what notes matter")**
Separately from rhythm, you fold the spectrogram's frequency bins into 12 pitch classes (chroma features — literally "how much energy is in all the C's, all the C#'s," etc., regardless of octave), then match that profile against templates for each major/minor key (Krumhansl-Schmuckler).

**Stage 5 — Phase vocoder ("stretch time without breaking pitch")**
This is the one that actually needs the STFT understanding from Stage 1 to be non-magic: you stretch the *time* axis of the spectrogram while carefully preserving phase relationships between frequency bins frame-to-frame (this phase-preservation step is the whole trick — naive stretching is what causes the "warbly" or chipmunk artifacts).

**Stage 6 — Putting it together**
Beat grid + key + phase-vocoder time-stretch + a crossfade curve = AutoMix. This part is mostly engineering once Stages 1–5 are solid concepts in your head.

**The one-book spine once you're past Stage 1:** *"Fundamentals of Music Processing" by Meinard Müller* covers Stages 2–4 rigorously and has free companion Python notebooks (the FMP notebooks) showing real implementations — great for checking your own code against a reference once you've tried it yourself.

Want me to point you to the specific chapters/sections of Müller's book that map to each stage, or start actually digging into Stage 0/1 concepts right now?

> https://www.audiolabs-erlangen.de/resources/MIR/FMP/C0/C0.html

##### Chapter 1
- A lot of music theory.

