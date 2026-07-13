## 1. What correlation actually means, mathematically


rho = sum over i of (x_i - mean_x)(y_i - mean_y), divided by (N times std_x times std_y)

This formula is doing something very specific, and it's worth taking apart piece by piece since the book states it and moves on.

x_i - mean_x is how far a given x value sits above or below the average of all the x values. Same for y_i - mean_y. If x and y tend to be above their averages at the same time, and below their averages at the same time, then multiplying these two deviations together gives a positive number most of the time (positive times positive is positive, negative times negative is also positive). If x tends to be above average exactly when y is below average, the product tends to be negative. Summing these products across every pair of points and looking at whether the total leans positive or negative is exactly how you detect whether two variables move together or move oppositely. This sum of products of deviations is called covariance, and it's the numerator of the formula.

Dividing by N (the number of data points) turns the sum into an average, so the result doesn't just get bigger the more data points you have.

Dividing further by std_x times std_y (the standard deviations of x and y, a measure of how spread out each variable's own values are) rescales the result so it no longer depends on the units or absolute scale of x and y. This division is what forces the final rho to always land between -1 and +1, no matter what the original signals looked like.

Once computed, rho's sign and size tell you two different things. The sign tells you the direction of the relationship: positive means when one variable is high, the other tends to also be high; negative means when one is high, the other tends to be low. The magnitude tells you the strength: a value near 1 or -1 means the relationship is very tight (knowing one variable lets you predict the other almost exactly), while a value near 0 means there's little to no linear relationship. The book flags an important caveat here: a rho near zero only rules out a linear relationship, there could still be a real but nonlinear relationship that this particular formula simply isn't built to detect. That's a genuine limitation of Pearson's coefficient, not a flaw in the data.

## 2. Correlation between two sine waves at different phase offsets

To make this concrete, the chapter builds two identical 440 Hz sine waves but gives them different phase offsets (recall from chapter 1: offset shifts where in the cycle a sinusoid starts). One starts at offset 0, the other at offset 1 radian.

```python
def make_sine(offset):
    signal = thinkdsp.SinSignal(freq=440, offset=offset)
    wave = signal.make_wave(duration=0.5, framerate=10000)
    return wave

wave1 = make_sine(offset=0)
wave2 = make_sine(offset=1)
```

Feeding both waves' sample arrays into np.corrcoef gives back a correlation matrix, a small grid showing the correlation of every variable with every other variable you passed in, including itself:

```python
corr_matrix = np.corrcoef(wave1.ys, wave2.ys, ddof=0)
```

The diagonal entries are always 1 (anything is perfectly correlated with itself). The off-diagonal entry, 0.54 in this example, is the actual number of interest: how correlated wave1 is with wave2. The ddof=0 option matters because np.corrcoef by default divides by N-1 rather than N (a statistical convention called Bessel's correction, used when estimating a population's variance from a limited sample). Passing ddof=0 forces it to match the plain formula given above, dividing by N exactly.

As you slide the phase offset from 0 up toward 2*pi radians (a full circle, matching the earlier chapters' point that one cycle equals 2*pi radians), the correlation traces out a curve: starting at 1 (identical waves, offset 0), dropping to -1 when the waves are perfectly out of phase (180 degrees, or pi radians apart, meaning one is at its peak exactly when the other is at its trough), then rising back to 1 once the offset completes a full 360-degree loop. The book points out this curve is itself a cosine function. This isn't a coincidental resemblance, it's an exact mathematical result, and section 5.5 later explains precisely why.

thinkdsp wraps all this in a convenience method: wave1.corr(wave2) returns the same 0.54 directly, without you needing to build and index into a full matrix.

## 3. Serial correlation

Real-world measured signals (like sound, or any signal sampled repeatedly over time) tend to show correlation with themselves over time, meaning a given sample tends to be similar to the sample right before or after it. This specific kind of self-correlation is called serial correlation.

Computing it is, instead of correlating two different signals, take one signal and correlate it against a shifted copy of itself

```python
def serial_corr(wave, lag=1):
    n = len(wave)
    y1 = wave.ys[lag:]
    y2 = wave.ys[:n-lag]
    corr = np.corrcoef(y1, y2, ddof=0)[0, 1]
    return corr
```

lag is how many positions you shift by. y1 is everything from position lag onward y2 is everything from the start up to n-lag positions before the end. These two slices are the same length and line up sample i of y1 with sample i+lag of the original wave, and sample i of y2 with sample i of the original wave, so correlating y1 against y2 is really asking: how similar is each value to the value lag steps ahead of it?

To test this, the book runs it against three noise types from chapter 4. Since we skipped that chapter, here's what each one actually is:

Uncorrelated Gaussian noise (referred to as UU noise in the text) is a signal where every single sample is an independent random draw from a normal (Gaussian, bell-curve) distribution, with no relationship at all to any other sample. This is the digital-audio equivalent of white noise, the hissing static sound with no pitch, because every frequency is present in roughly equal strength and no sample tells you anything about its neighbors. Running serial_corr on it gives a value close to 0 (0.006 in the book's run), exactly as expected, since by construction each value has nothing to do with the ones around it.

Brownian noise is built differently: each value is the previous value plus a small random step (this is literally a random walk, the same math used to model things like particle diffusion or stock price wandering). Because every value is built directly from the one before it, consecutive values are almost identical to each other, just nudged slightly. Running serial_corr on Brownian noise gives a value greater than 0.999, essentially perfect correlation, which matches the construction: knowing one sample tells you almost exactly what the next one will be.

Pink noise sits conceptually between these two extremes. It's generated with a tunable parameter called beta, where beta=0 reproduces uncorrelated white noise and beta=2 reproduces Brownian noise, with values in between blending the two behaviors. Pink noise is a real, physically common phenomenon, lots of natural processes (many environmental sounds, some biological signals, some financial time series) show this 1/f-like intermediate pattern, which is part of why the book bothers introducing it. At beta=1, serial correlation comes out around 0.851, sitting appropriately between the near-zero white noise value and the near-one Brownian value, and the chapter shows a figure plotting serial correlation smoothly rising as beta rises from 0 to 2. This confirms the parameter is behaving exactly as its name suggests: it's literally a dial controlling how much each sample depends on its predecessor.

## 4. Autocorrelation: sweeping across every possible lag

Serial correlation as defined above only checks one specific lag (how correlated is each value with the very next one, or the one two steps away, etc). Autocorrelation generalizes this by computing serial correlation across every possible lag and treating the whole result as a function:

```python
def autocorr(wave):
    lags = range(len(wave.ys)//2)
    corrs = [serial_corr(wave, lag) for lag in lags]
    return lags, corrs
```

This produces a curve: for each lag value (0, 1, 2, 3...), how correlated is the signal with a version of itself shifted by that many samples. Plotting this for pink noise at different beta values shows a clear pattern: low beta (closer to white noise) makes the autocorrelation function drop to zero almost immediately, since values quickly stop having any relationship to distant past values. High beta (closer to Brownian) makes it drop off very slowly, staying strongly correlated even across long lags, a property the chapter names long-range dependence, meaning a given value is still meaningfully influenced by values far in its past, not just its immediate neighbor.

## 5. Autocorrelation of periodic signals: the actual practical payoff

This section is where autocorrelation earns its keep as a real tool, not just a statistical curiosity. The example is a recording of someone singing a chirp, a note that glides continuously from around 500 Hz down to around 300 Hz.

To visualize how frequency content changes over time, the book shows a spectrogram. Since this concept comes from chapter 3 (which we skipped), here's what it is: a normal spectrum (from chapter 1) is a single snapshot showing which frequencies are present across an entire signal, with no sense of when they occurred. A spectrogram fixes this by chopping the signal into many short, overlapping segments, computing a separate spectrum for each one, and stacking these spectra side by side, so you get a 2D plot with time on one axis, frequency on the other axis, and color/brightness showing the strength of each frequency at each moment. It's essentially a movie of the spectrum changing over time, and it's the natural tool for a signal like a chirp where pitch is actively gliding.

The problem the chapter demonstrates: if you try to just grab a short segment (0.01 seconds) and compute its regular spectrum to estimate the pitch at that instant, the result is blurry. The specific number given is a segment of 441 samples at 44,100 Hz producing a frequency resolution of 100 Hz, meaning the true pitch could be anywhere within a 100 Hz-wide window and you can't narrow it down further from that spectrum alone. This traces back to a concept from chapter 3 called the Gabor limit (referenced as "Section 3.5" in the text): there's an inescapable tradeoff between how precisely you can localize a signal in time versus in frequency. A short segment pins down when something happened very precisely but blurs out exactly what frequency it was; a long segment nails down the frequency precisely but blurs out when, or in this chirp's case, blends together the start pitch and end pitch as the note glides, producing what the book calls motion blur. Frequency resolution improves roughly as 1 divided by the segment's duration, so a longer segment sharpens the frequency estimate, but a chirp's pitch is actively changing, so a longer segment just averages together several different true pitches instead of pinning down one clean value. You're stuck between two kinds of blur and can't eliminate both by adjusting segment length alone.

Autocorrelation sidesteps this problem entirely, using a different principle. If a signal is truly periodic with some period T, then shifting it by exactly one period should make it line up almost perfectly with itself again, since the signal is, by definition, repeating on that interval. So the autocorrelation function should show a sharp spike right at the lag corresponding to the true period, even from a fairly short segment, because you're not measuring frequency directly at all, you're measuring self-similarity at various time shifts, which is a fundamentally different question that doesn't suffer from the same time/frequency tradeoff.

The book demonstrates this by overlaying two segments from the chirp recording, one starting 0.0023 seconds after the other, and finding they're strikingly similar (correlation 0.99), suggesting the true period is right around 0.0023 seconds, corresponding to roughly 435 Hz. Automating this with the full autocorr function, the first strong peak in the autocorrelation curve lands at lag 101 samples. Converting a lag (a sample count) into a period (a time) and then into a frequency:

```python
period = lag / segment.framerate
frequency = 1 / period
```

gives an estimated pitch of 437 Hz. Checking neighboring lags (100 and 102) gives 432 and 441 Hz, a spread of under 10 Hz, dramatically tighter than the roughly 100 Hz uncertainty the plain spectrum approach gave for the same segment length. In musical terms, the book notes this corresponds to an error of about 30 cents (a cent being 1/100th of a semitone), versus roughly 5 semitones of uncertainty from the spectrum method, a night-and-day difference in precision for pitch detection specifically.

## 6. Why the correlation-vs-phase-offset curve is exactly a cosine

Section 5.5 circles back to explain the earlier observation (that correlation between phase-shifted sine waves traces out a cosine curve) using a cleaner, more geometric version of the correlation formula.

The full Pearson formula subtracts means and divides by standard deviations. But in signal processing, you're frequently working with signals that are already unbiased (their average value is 0, meaning no constant offset) and normalized (their standard deviation is exactly 1, meaning a consistent overall scale). Under those two conditions, all the subtracting-the-mean and dividing-by-standard-deviation machinery in the Pearson formula becomes unnecessary, since the mean is already 0 and the standard deviation is already 1, and the formula collapses down to just:

rho = (1/N) times the sum of x_i times y_i

Simplifying even further by dropping the 1/N averaging factor entirely gives:

r = sum of x_i times y_i

This exact formula, summing up the products of corresponding elements of two lists of numbers, is what's called a dot product when x and y are thought of as vectors (an ordered list of numbers representing a point or direction in space) rather than as data samples. The dot product is a standard operation in geometry and linear algebra, and it has a well known geometric meaning: for two normalized vectors (each with length 1), their dot product exactly equals the cosine of the angle between them.

This is the actual reason the phase-offset correlation curve is a cosine: sliding the phase offset of one sine wave relative to another is, in this vector framing, literally rotating one vector relative to the other by that same angle, and the dot product of two vectors at angle theta apart is, by definition, cos(theta). So the earlier empirical observation (the curve looks like a cosine) turns out to be a direct, exact consequence of what correlation geometrically is, not a coincidence at all.

## 7. Computing autocorrelation with NumPy directly

The chapter closes out the technical content by showing NumPy's built-in np.correlate function as an alternative to the手 hand-written autocorr:

```python
corrs2 = np.correlate(segment.ys, segment.ys, mode='same')
```

The mode='same' option controls which range of lags gets computed; here it produces results for lags ranging from -N/2 to N/2 (both negative and positive shifts), where N is the length of the array. This produces a symmetric curve, since correlating a signal with itself is directionally symmetric: shifting it forward by k samples has an identical effect to shifting it backward by k samples, when the signal is being compared to itself.

To compare against the earlier autocorr results (which only used non-negative lags), you take just the second half of this symmetric output:

```python
N = len(corrs2)
half = corrs2[N//2:]
```

There's a subtlety worth stating explicitly: np.correlate's raw output isn't standardized the way the earlier rho-based formula was. As the lag increases, there's less and less overlap between the shifted and unshifted versions of the array (a shift of, say, 90 percent of the array's length only leaves a small overlapping region to compare), so the raw sum-of-products naturally shrinks simply because fewer terms are being summed, independent of whether the signal is actually less self-similar at that lag. The book corrects for this two ways: dividing by the actual number of overlapping samples at each lag (lengths), and then dividing everything by the value at lag 0 to force that first entry to exactly 1, matching the standardized convention used everywhere else in the chapter:

```python
lengths = range(N, N//2, -1)
half /= lengths
half /= half[0]
```

After these corrections, the NumPy-based result and the original hand-written autocorr function agree to within 1-2 percent, a small remaining difference that comes down to a minor technical detail (autocorr standardizes each lag independently, while this NumPy approach standardizes everything using a single value applied at the end), which the book explicitly says isn't important to dwell on.

