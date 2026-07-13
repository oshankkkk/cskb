---
Title: Notes on ThinkDSP by Allen Downey
date: 2026-07-11
---
## ThinkDSP 

| Chapter    | Topic                                | Priority  | Details                                                                                                                           |
| ---------- | ------------------------------------ | --------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 1          | Sounds and Signals                   | Core      | Learn sampling rate, waveforms, and the fundamentals of digital audio. (fundamentals)                                             |
| 2          | Harmonics                            | Core      | Understand spectra and frequency decomposition. The key mental shift from "audio = waveform" to "audio = mixture of frequencies." |
| 3          | Non-periodic Signals                 | Skim/Skip | Useful intuition, but not essential for this project.                                                                             |
| 4          | Noise                                | Skim/Skip | Nice background knowledge, but not load-bearing.                                                                                  |
| 5          | Autocorrelation                      | Core      | Directly relevant to tempo detection. Correlating a signal with delayed copies reveals periodicity and beats.                     |
| 6          | Discrete Cosine Transform (DCT)      | Skip      | More relevant to audio compression (MP3) and MFCCs for speech/genre classification than tempo, key detection, or time-stretching. |
| 7          | Discrete Fourier Transform (DFT/FFT) | Core      | Essential. The mathematical foundation of spectrograms and the phase vocoder.                                                     |
| 8          | Filtering and Convolution            | Core      | Important for onset detection, filtering, and understanding windowing before applying the FFT.                                    |
| 9          | Differentiation & Integration        | Skip      | Good DSP knowledge for the future, but not required for AutoMix.                                                                  |
| 10<br><br> | Linear Time-Invariant (LTI) Systems  | Skip      | Valuable later as a DSP engineer, but unnecessary to complete AutoMix.                                                            |

> The book mentions stuff quickly and moves on. Asked Claude to read each chapter and give me the actual theory underneath each sentence, including the stuff the book assumes you already know.

### Chapter 01 summery

- A signal is a measured quantity varying over time (or space), and it can be looked at two equivalent ways: as a shape over time (waveform, time domain) or as a mixture of frequencies (spectrum, frequency domain).

- Any signal, however complex its waveform, can be decomposed into a sum of simple sine waves of different frequencies and amplitudes, and reassembled from them. This is Fourier's theorem, computed efficiently via the FFT.

- Real vibrating objects naturally produce energy at whole-number multiples of a fundamental frequency (harmonics), because of physical constraints like fixed string endpoints, and this harmonic structure is what human ears interpret as timbre.

- Since computers can't store continuous, infinite-precision signals, everything practical works on discrete samples taken at some framerate, and how densely you sample relative to a signal's frequency content determines whether you can faithfully capture (and later reconstruct) that signal, a topic the book expands on properly in chapter 2 with aliasing.
### Chapter 02 summery

- Waveform shape directly determines harmonic content. Whether a wave contains only odd harmonics or both even and odd ones is governed by the waveform's symmetry properties, and how quickly the harmonic amplitudes shrink as frequency rises is governed by how smooth or abrupt the waveform's transitions are (a discontinuity like a square wave's vertical jump decays slowly at 1/f, a mere sharp corner like a triangle wave's zigzag decays faster at 1/f^2).

- Digital sampling has a hard, mathematically provable limit: the Nyquist frequency, exactly half your sampling rate. Any true frequency content above that limit doesn't get lost cleanly, it gets disguised as (folded into) a lower, false frequency, an effect called aliasing, and this folding can bounce repeatedly if the true frequency is high enough.

- The FFT's output is naturally complex-valued because each frequency component genuinely needs two numbers to describe it (amplitude and phase), and complex numbers are simply the standard, convenient mathematical container for exactly that kind of amplitude-and-phase pair.

- A Spectrum can be directly edited as an array of these complex values (scaling amplitudes, zeroing out ranges of frequencies), and this direct manipulation is the actual mechanism underneath the filtering operations introduced in chapter 1.
### Chapter 05 summery

- Correlation is a precise, computable measure of how much knowing one variable tells you about another, built from covariance (do two variables move together) normalized by their individual spreads (standard deviations), always landing between -1 and 1.

- Serial correlation and autocorrelation apply this same idea to a single signal compared against shifted copies of itself, revealing how strongly a signal's past predicts its future, and this behaves very differently across noise types: near zero for uncorrelated (white) noise, near one for Brownian noise, and smoothly in between for pink noise depending on its beta parameter.

- Autocorrelation is a genuinely superior tool for estimating the pitch of a periodic signal compared to reading a peak off a plain spectrum, because it sidesteps the fundamental time-versus-frequency resolution tradeoff (the Gabor limit) that a short segment's spectrum suffers from, by measuring self-similarity at different time shifts instead of frequency content directly.

- Correlation, once you strip away mean-centering and standardization, is mathematically identical to a vector dot product, and a dot product between two normalized vectors is exactly the cosine of the angle between them, which is the deep reason a sine wave's correlation with a phase-shifted copy of itself traces out a cosine curve as that phase offset changes.
