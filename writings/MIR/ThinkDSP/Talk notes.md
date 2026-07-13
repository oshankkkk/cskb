>[!question]
>What is fourier transform and how does it work?

The Fourier transform takes a signal that's plotted as amplitude vs. time and re-expresses it as amplitude vs. frequency. 
- Time domain - Shows the signal value at each moment in time 
- Frequency domain answers - Shows which pure tones (sine waves) is this signal built from, and how strong is each one is

![[Talk notes-1783767547928.webp|591]]
If you know your singal is made up of lot of different f components you can dinf the alpsute of each one by constructiong a sine wave ate each frequency.
![[Talk notes-1783768247060.webp|535x312]]
#### The thinkdsp.py code

``` python
 def make_spectrum(self, full=False):
        """Computes the spectrum using FFT.

        full: boolean, whethere to compute a full FFT
              (as opposed to a real FFT)

        returns: Spectrum
        """
        n = len(self.ys)
        d = 1 / self.framerate

        if full:
            hs = np.fft.fft(self.ys)
            fs = np.fft.fftfreq(n, d)
        else:
            hs = np.fft.rfft(self.ys)
            fs = np.fft.rfftfreq(n, d)
```
#### Understanding the fourier transform
The core idea
any sound wave, however messy it looks as a wiggly line over time, can be represented as a sum of simple sine waves at different frequencies, amplitudes, and phases. That's the entire conceptual leap — audio as "mixture of frequencies" instead of "wiggly line."

What the output actually is
when you run an FFT on a chunk of audio, you get back one complex number per frequency bin.
Each complex number encodes two things magnitude (how much of that frequency is present) and phase (where in its cycle that frequency wave currently is). 
Most beginner explanations only talk about magnitude (that's what a spectrogram visualizes as color/brightness), but phase is the part almost nobody explains well  and phase is exactly what the phase vocoder is manipulating. 
If you only understand magnitude, the phase vocoder will look like unexplainable magic.

Complex numbers as rotating vectors: 
a complex number isn't just "a weird 2D number," it's a point that can be described as spinning around a circle at a certain speed (frequency) starting from a certain angle (phase). Once that clicks, "phase" stops being abstract  it's just "what angle is this particular frequency's needle pointing at, right now."
Windowing / STFT: 
why you can't just FFT the whole song at once — you chop it into small overlapping chunks first, because you want to know frequency content at each moment in time, not averaged over the whole song. This overlapping-chunk structure is also exactly the machinery you reuse for the phase vocoder.
https://youtu.be/jemW4C_3_-M?si=-mj_7V6lU6lHMzNa

#### Filtering
Lowpass filter


