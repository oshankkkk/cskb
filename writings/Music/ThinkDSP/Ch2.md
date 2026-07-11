---
Title: Different waves
date: 2026-07-11
---
## 1. Triangle waves

![[Ch2-1783757447952.webp]]


> Why we use triangle signals or you can make different kinds of signals with spaces and they produce is slielty different fundamantal sound?

A sinusoid has exactly one frequency, so its spectrum is a single spike. The chapter's first move is to look at a waveform that isn't a pure sinusoid at all, a triangle wave, which looks like a straight-line zigzag between a peak and a trough instead of a smooth curve.

```python
class TriangleSignal(Sinusoid):
    def evaluate(self, ts):
        cycles = self.freq * ts + self.offset / PI2
        frac, _ = np.modf(cycles)
        ys = np.abs(frac - 0.5)
        ys = normalize(unbias(ys), self.amp)
        return ys
```

![[Ch2-1783758840255.webp]]



The book explains this in three quick steps but glosses over what each NumPy call actually does, so here it is broken down properly.

cycles is, same as in chapter 1, the number of cycles elapsed since the start time (frequency times time, plus a phase offset term).

np.modf splits a number into its fractional part and integer part. For example, modf(3.7) gives you 0.7 and 3. Here, only the fractional part (frac) is kept, and the integer part is thrown away (the underscore variable name is a Python convention meaning "I don't need this value"). Since cycles keeps growing forever as time passes, frac is what's left after removing the whole completed cycles, so frac is a value that repeatedly ramps from 0 up to 1, then resets back to 0 and ramps up again, once per cycle. This ramp is the raw building block of the triangle shape.

Subtracting 0.5 from frac shifts that ramp so it goes from -0.5 up to 0.5 instead of 0 to 1. Then np.abs (absolute value) folds the negative half back up to positive, so instead of a rising ramp that suddenly drops, you get a shape that rises from 0.5 down to 0 and back up to 0.5, over and over. That folded ramp is exactly the zigzag shape of a triangle wave.

unbias then shifts the whole thing down so it's centered on zero instead of centered on 0.25 (since the zigzag currently sits between 0 and 0.5). normalize then stretches or squashes it so its peak matches self.amp, the requested amplitude. The book doesn't show these two functions' code, but conceptually they're just: subtract the average value (to center the wave at zero), then multiply by a scaling factor (to hit the desired amplitude).

So the whole evaluate method is really just: count elapsed cycles, keep only the fractional/repeating part, fold it into a zigzag with abs, then recenter and rescale. No trigonometry at all, it's pure arithmetic, which is part of why triangle waves are cheap to generate compared to true sinusoids.

```python
class TriangleSignal(Sinusoid):
    def evaluate(self, ts):
        cycles = self.freq * ts + self.offset / PI2
        frac, _ = np.modf(cycles)
        ys = np.abs(frac - 0.5)
        ys = normalize(unbias(ys), self.amp)
        return ys
```

The book explains this in three quick steps but glosses over what each NumPy call actually does, so here it is broken down properly.

cycles is, same as in chapter 1, the number of cycles elapsed since the start time (frequency times time, plus a phase offset term).

np.modf splits a number into its fractional part and integer part. For example, modf(3.7) gives you 0.7 and 3. Here, only the fractional part (frac) is kept, and the integer part is thrown away (the underscore variable name is a Python convention meaning "I don't need this value"). Since cycles keeps growing forever as time passes, frac is what's left after removing the whole completed cycles, so frac is a value that repeatedly ramps from 0 up to 1, then resets back to 0 and ramps up again, once per cycle. This ramp is the raw building block of the triangle shape.

Subtracting 0.5 from frac shifts that ramp so it goes from -0.5 up to 0.5 instead of 0 to 1. Then np.abs (absolute value) folds the negative half back up to positive, so instead of a rising ramp that suddenly drops, you get a shape that rises from 0.5 down to 0 and back up to 0.5, over and over. That folded ramp is exactly the zigzag shape of a triangle wave.

unbias then shifts the whole thing down so it's centered on zero instead of centered on 0.25 (since the zigzag currently sits between 0 and 0.5). normalize then stretches or squashes it so its peak matches self.amp, the requested amplitude. The book doesn't show these two functions' code, but conceptually they're just: subtract the average value (to center the wave at zero), then multiply by a scaling factor (to hit the desired amplitude).

So the whole evaluate method is really just: count elapsed cycles, keep only the fractional/repeating part, fold it into a zigzag with abs, then recenter and rescale. No trigonometry at all, it's pure arithmetic, which is part of why triangle waves are cheap to generate compared to true sinusoids.

### What its spectrum shows

Generating a 200 Hz triangle wave and taking its spectrum shows a tall spike at the fundamental (200 Hz), and then more spikes at 600, 1000, 1400 Hz, and so on. Two things are worth noticing, and the book states both as facts without explaining why they're true:

Only odd multiples of the fundamental appear (600 = 3x200, 1000 = 5x200, 1400 = 7x200), never even ones like 400 or 800. This isn't a coincidence or a limitation of the algorithm, it's a real mathematical property that comes from symmetry. A triangle wave has a property called half-wave symmetry: the second half of each cycle is just the first half flipped upside down and shifted. Whenever a periodic wave has this exact kind of symmetry, its Fourier decomposition can only contain odd harmonics, because even harmonics would break that symmetry pattern if you tried to add them in. Square waves (covered next) have the same symmetry, which is why they also only have odd harmonics.

The amplitude of each harmonic drops off proportional to frequency squared (going from the 200 Hz component to the 600 Hz component, frequency triples, and amplitude drops by roughly 9x, which is 3 squared). This also isn't arbitrary. There's a general rule in Fourier analysis: the smoother a waveform is, the faster its harmonic amplitudes shrink as frequency increases. A triangle wave is continuous (no sudden jumps) but has sharp corners, meaning its slope changes abruptly at each corner even though the wave's value doesn't jump. That specific kind of mild sharpness (smooth value, sharp corners) is exactly what produces a 1/f^2 dropoff. This detail matters for the next section, since square waves are less smooth than triangle waves, and their spectra behave differently as a direct result.

## 2. Square waves

```python
class SquareSignal(Sinusoid):
    def evaluate(self, ts):
        cycles = self.freq * ts + self.offset / PI2
        frac, _ = np.modf(cycles)
        ys = self.amp * np.sign(unbias(frac))
        return ys
```

Same setup as the triangle wave (elapsed cycles, keep the fractional ramp), but instead of folding it with abs, this uses unbias(frac) to shift the ramp so it goes from -0.5 to 0.5, then applies np.sign, a function that just returns -1 for any negative input and +1 for any positive input, discarding all the actual ramp shape entirely. The result jumps instantly between -amp and +amp with no in-between values at all, which is exactly what a square wave looks like: a flat high value, then an instant vertical drop to a flat low value, repeating.

### What its spectrum shows

Like the triangle wave, only odd harmonics appear (100 Hz fundamental, then 300, 500, 700 Hz...), for the same half-wave symmetry reason described above.

But the amplitude drop is slower this time: proportional to 1/f instead of 1/f^2. This connects directly back to the smoothness rule mentioned above. A square wave isn't just sharp-cornered, it has an actual discontinuity: the signal's value itself jumps instantly from -amp to +amp with no continuous transition at all. That's a more extreme kind of sharpness than the triangle wave's mere corners, and more abruptness in the time domain translates to a slower falloff in the frequency domain. This is a general and important pattern in signal processing: sharp, sudden features in a waveform always show up as significant energy at very high frequencies in its spectrum, since only a sum of many high frequencies can create a truly instantaneous jump. That's part of why square waves sound harsher or buzzier than triangle waves at the same pitch, they genuinely carry more high-frequency energy.

## 3. Aliasing

The chapter is upfront that this section is deliberately confusing, and it's really the intellectual centerpiece of chapter 2.

Setup: take a triangle wave at 1100 Hz, sampled at 10,000 frames per second. Its harmonics should appear at 3300, 5500, 7700, 9900 Hz (odd multiples of 1100). But the actual computed spectrum shows peaks at 1100, 3300, 4500, 2300, and 100 Hz instead of the expected values. The 5500 Hz harmonic shows up at 4500. The 7700 Hz harmonic shows up at 2300. The 9900 Hz harmonic shows up at 100 Hz. Something is systematically distorting the higher harmonics while leaving the lower ones intact.

### Why this happens

The explanation given is that sampling at discrete points in time throws away information about what the signal was doing between those points. For low-frequency components, this isn't a problem because there are many samples captured within a single cycle, so the shape is well represented. But as frequency increases, fewer and fewer samples land within each cycle, until eventually there aren't enough samples left to tell the true shape apart from a completely different, slower wave.

The book demonstrates this concretely: generate a cosine at 4500 Hz and a separate cosine at 5500 Hz, both sampled at 10,000 frames per second. Despite being genuinely different signals, their sampled versions turn out to be identical, sample for sample. This is the actual mechanism behind aliasing, not a rounding error or a bug: two different continuous signals can produce the exact same list of discrete sample values, and once you only have those numbers, there is no way to tell which original signal produced them. The higher-frequency one has been indistinguishably disguised as the lower one.

This effect is called aliasing because the sampled data looks exactly like it came from a lower frequency wave: it has taken on a false identity, an alias.

### The Nyquist frequency, explained more fully than the book does

With a sampling rate of 10,000 Hz, the highest frequency that can be captured without this ambiguity is 5000 Hz, exactly half the sampling rate. This value has two names introduced in the chapter: the folding frequency and the Nyquist frequency.

Here's the intuitive reason it lands at exactly half the sample rate. To distinguish any wave shape from a flat line or a slower wave, you need at minimum two samples within a single cycle, one to catch it near a peak and one to catch it near a trough. If you're sampling 10,000 times per second, the fastest cycle you can still capture at least twice within is one that completes 5,000 times per second. Try to sample anything faster than that, and you no longer get at least two samples per cycle, so multiple different fast waves start looking identical once sampled. This is a real, precisely provable result called the Nyquist-Shannon sampling theorem: to faithfully capture a signal, your sampling rate must be more than twice the highest frequency present in that signal.

The word folding describes what happens to frequencies above this limit. If a true frequency is somewhat above the Nyquist frequency, it doesn't just disappear, it reappears mirrored back down, as if the frequency axis were folded like a piece of paper at the 5000 Hz mark. A signal at 5500 Hz (which is 500 Hz above the 5000 Hz fold line) reappears at 4500 Hz (500 Hz below the fold line), a mirror reflection around 5000. This is exactly the 4500/5500 mixup demonstrated earlier.

The chapter notes the folding can happen more than once if a frequency is high enough. The triangle wave's fifth harmonic sits at 12,100 Hz. Folding once at the 5000 Hz line would place it at negative 2100 Hz, but negative frequencies aren't physically meaningful for a real signal, so it folds again at the 0 Hz line, landing back at positive 2100 Hz, which matches the small peak actually observed in the real spectrum plot. So folding is a repeating, mirror-bounce process between 0 Hz and the Nyquist frequency, not a single one-time reflection.

The practical consequence, which the book leaves implicit: before you can trust any digital recording or analysis, the sampling rate has to be chosen high enough (more than double) relative to the highest frequency you actually care about capturing. This is exactly why standard audio formats use rates like 44,100 Hz, since human hearing tops out around 20,000 Hz, and 44,100 comfortably clears twice that with margin.

## 4. Computing the spectrum (what the FFT is actually returning)

Earlier chapters treated make_spectrum as a black box. This section opens it up.

```python
from np.fft import rfft, rfftfreq

def make_spectrum(self):
    n = len(self.ys)
    d = 1 / self.framerate
    hs = rfft(self.ys)
    fs = rfftfreq(n, d)
    return Spectrum(hs, fs, self.framerate)
```

n is simply how many samples are in the wave. d is the time gap between consecutive samples (the timestep introduced in chapter 1, just 1 divided by the framerate).

rfft stands for real FFT, used specifically because the input (self.ys) is a plain array of real numbers, not complex numbers. A regular, full FFT is built to handle inputs that may themselves be complex, and for a real-valued input its output ends up containing redundant, mirrored information. rfft is an optimized version that skips computing that redundant half, since it's not needed when the input is real, making it faster and more memory-efficient for ordinary audio signals.

rfftfreq generates the matching list of frequency labels (fs) that correspond to each value returned by rfft, so you know which frequency each entry of hs actually refers to.

### Why the output is a list of complex numbers, and what that means

hs, the array rfft returns, is full of complex numbers, and the book gives two equivalent ways to think about what a complex number is, which is worth unpacking further since this is genuinely one of the more conceptually loaded parts of the chapter.

The first way: a complex number is a pair of two real numbers glued together, written x + iy, where x is called the real part and y is called the imaginary part, and i is defined as the square root of -1 (a quantity that doesn't exist among ordinary numbers, but is useful as a bookkeeping device). You can think of x and y as coordinates on a 2D plane, an ordinary horizontal and vertical position, which is why this is called the Cartesian view.

The second way: the exact same complex number can instead be described by a magnitude A (how far it is from the origin of that 2D plane) and an angle phi (its direction from the origin), written A times e to the power of i*phi. This is called the polar view, and A and phi play the role of polar coordinates instead of x/y coordinates. Both descriptions, Cartesian and polar, refer to the identical point on the plane, they're just two different coordinate systems for describing it.

Why does the FFT return numbers in this form at all? Because for each frequency, there are genuinely two independent pieces of information needed to fully describe that frequency's contribution to the signal: how strong is it (amplitude), and where in its cycle does it start relative to the others (phase offset, same concept as the offset parameter from chapter 1's Sinusoid class). A single ordinary real number can only store one piece of information, but a complex number naturally stores exactly two (either as real+imaginary, or equivalently as magnitude+phase), which is precisely the two things needed here. That's the actual reason the DFT/FFT produces complex-valued output: it's not an arbitrary mathematical quirk, it's the natural container for amplitude-and-phase pairs.

Spectrum exposes this conveniently through two read-only properties: amps (the magnitudes, i.e. the A values, polar view) and angles (the phi values). When you call spectrum.plot(), you are normally plotting amps against fs, amplitude versus frequency, which is the familiar spiky chart used throughout the chapter. Plotting angles against fs instead shows phase information, which matters less often but is sometimes useful.

The book explicitly recommends not digging into the raw real and imaginary parts of hs directly, and instead just thinking of the whole Spectrum as a list of frequencies, each with an amplitude and a phase, with the complex number representation being an implementation detail underneath that.

### Editing a spectrum directly vs using its methods

Since hs is just a NumPy array, you can edit it by hand:

```python
spectrum.hs *= 2
spectrum.hs[spectrum.fs > cutoff] = 0
```

The first line doubles every value in hs, which scales up the amplitude of every frequency component simultaneously (doubling the volume, roughly speaking). The second line uses a boolean condition (spectrum.fs > cutoff) to select only the entries whose frequency exceeds some cutoff, and sets those entries to zero, silencing every frequency above the cutoff. That second line is literally what a low-pass filter is doing internally.

Spectrum also wraps these same operations in cleaner named methods:

```python
spectrum.scale(2)
spectrum.low_pass(cutoff)
```

which do the identical thing, just with clearer intent and less risk of making an indexing mistake.
## 6. Summary of the true foundational takeaways


Ready to move to chapter 3 whenever you'd like, at this same depth.