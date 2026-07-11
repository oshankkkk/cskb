---
Title: Notes on ThinkDSP by Allen Downey
date: 2026-07-11
---
#### Core
Ch 1 — Sounds and signals: sampling rate, what a waveform is. Foundation, don't skip.
Ch 2 — Harmonics: what a spectrum is, how sounds decompose into frequencies. This is where the mental shift from "audio = wiggly line" to "audio = mixture of frequencies" happens — that shift is the whole ballgame.
Ch 5 — Autocorrelation: directly relevant to tempo detection. Understanding "how does a signal correlate with a delayed copy of itself" is literally the mechanism behind finding periodicity/beat.
Ch 7 — Discrete Fourier Transform (DFT/FFT): non-negotiable. This is the math behind the spectrogram and the phase vocoder both.
Ch 8 — Filtering and Convolution: useful for onset detection and understanding windowing (why you chop audio into overlapping chunks before FFT-ing).
#### Skim or skip
Ch 3 (non-periodic signals), Ch 4 (noise): nice intuition-builders but not load-bearing for this project.
Ch 6 (Discrete Cosine Transform): that's more relevant to audio compression (MP3) and MFCCs (speech/genre classification), not tempo/key/time-stretch. Skip.
Ch 9 (differentiation/integration), Ch 10 (LTI systems): good to know eventually as a DSP person, not required to ship AutoMix.

> The book mentions stuff quickly and moves on. Asked Claude to read each chapter and give me the actual theory underneath each sentence, including the stuff the book assumes you already know.
### Chapter 01 summery

- A signal is a measured quantity varying over time (or space), and it can be looked at two equivalent ways: as a shape over time (waveform, time domain) or as a mixture of frequencies (spectrum, frequency domain).
- Any signal, however complex its waveform, can be decomposed into a sum of simple sine waves of different frequencies and amplitudes, and reassembled from them. This is Fourier's theorem, computed efficiently via the FFT.
- Real vibrating objects naturally produce energy at whole-number multiples of a fundamental frequency (harmonics), because of physical constraints like fixed string endpoints, and this harmonic structure is what human ears interpret as timbre.
- Since computers can't store continuous, infinite-precision signals, everything practical works on discrete samples taken at some framerate, and how densely you sample relative to a signal's frequency content determines whether you can faithfully capture (and later reconstruct) that signal, a topic the book expands on properly in chapter 2 with aliasing.
