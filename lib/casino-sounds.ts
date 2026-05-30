// Web Audio API sound synthesizer — no audio files, 100% programmatic
// AudioContext is created lazily on first user interaction (browser requirement)

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    if (!ctx) ctx = new AudioContext()
    if (ctx.state === 'suspended') ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function tone(
  audioCtx: AudioContext,
  freq: number,
  start: number,
  duration: number,
  gainValue = 0.25,
  type: OscillatorType = 'sine',
  freqEnd?: number
) {
  const osc  = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.connect(gain)
  gain.connect(audioCtx.destination)
  osc.type = type
  osc.frequency.setValueAtTime(freq, start)
  if (freqEnd !== undefined) {
    osc.frequency.linearRampToValueAtTime(freqEnd, start + duration)
  }
  gain.gain.setValueAtTime(gainValue, start)
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration)
  osc.start(start)
  osc.stop(start + duration + 0.01)
}

// Rapid random blips during the 750ms spin
export function playSpin() {
  const ac = getCtx()
  if (!ac) return
  const now = ac.currentTime
  for (let i = 0; i < 10; i++) {
    const freq = 180 + Math.random() * 500
    tone(ac, freq, now + i * 0.07, 0.055, 0.07, 'square')
  }
}

// Small win: two quick ascending tones
export function playWin() {
  const ac = getCtx()
  if (!ac) return
  const now = ac.currentTime
  tone(ac, 440, now,        0.15, 0.28, 'sine')
  tone(ac, 554, now + 0.13, 0.20, 0.28, 'sine')
}

// Big Win fanfare: 4 ascending notes
export function playBigWin() {
  const ac = getCtx()
  if (!ac) return
  const now   = ac.currentTime
  const notes = [523, 659, 784, 1047]
  notes.forEach((f, i) => tone(ac, f, now + i * 0.16, 0.28, 0.32, 'sine'))
}

// Loss: short descending sawtooth
export function playLose() {
  const ac = getCtx()
  if (!ac) return
  const now = ac.currentTime
  tone(ac, 220, now, 0.32, 0.18, 'sawtooth', 100)
}

// Rupture: deep bass impact + white noise burst
export function playRupture() {
  const ac = getCtx()
  if (!ac) return
  const now = ac.currentTime

  // Bass thud
  tone(ac, 90, now, 0.55, 0.5, 'sine', 28)

  // White noise burst
  const samples = Math.floor(ac.sampleRate * 0.35)
  const buf     = ac.createBuffer(1, samples, ac.sampleRate)
  const data    = buf.getChannelData(0)
  for (let i = 0; i < samples; i++) data[i] = (Math.random() * 2 - 1) * 0.45

  const src       = ac.createBufferSource()
  src.buffer      = buf
  const noiseGain = ac.createGain()
  src.connect(noiseGain)
  noiseGain.connect(ac.destination)
  noiseGain.gain.setValueAtTime(0.32, now)
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
  src.start(now)
}
