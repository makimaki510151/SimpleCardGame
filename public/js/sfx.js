/**
 * Web Audio API で生成する軽量SE（外部ファイル不要）。
 * ブラウザの自動再生制限のため、最初のユーザー操作後に resume() が有効になります。
 */
(function (global) {
  let ctx = null;

  function getCtx() {
    if (!ctx) {
      const AC =
        global.AudioContext || global.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    return ctx;
  }

  function resume() {
    const c = getCtx();
    if (!c || c.state !== "suspended") return;
    c.resume().catch(() => {});
  }

  function bindUnlockOnce() {
    const go = () => {
      resume();
    };
    global.addEventListener("pointerdown", go, { once: true, passive: true });
    global.addEventListener("keydown", go, { once: true });
  }

  bindUnlockOnce();

  function tone({
    freq,
    dur = 0.08,
    type = "sine",
    gain = 0.12,
    attack = 0.002,
    slide = 0,
  }) {
    const c = getCtx();
    if (!c) return;
    const t0 = c.currentTime;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slide !== 0) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(40, freq + slide),
        t0 + dur
      );
    }
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  function noiseBurst(dur = 0.06, gain = 0.06) {
    const c = getCtx();
    if (!c) return;
    const t0 = c.currentTime;
    const len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    }
    const src = c.createBufferSource();
    src.buffer = buf;
    const g = c.createGain();
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(g);
    g.connect(c.destination);
    src.start(t0);
  }

  const ScgSfx = {
    resume,

    uiTap() {
      tone({ freq: 520, dur: 0.045, type: "triangle", gain: 0.07, slide: 80 });
    },

    uiHover() {
      tone({ freq: 640, dur: 0.028, type: "sine", gain: 0.028, slide: 40 });
    },

    uiPrimary() {
      tone({ freq: 380, dur: 0.055, type: "sine", gain: 0.1, slide: 120 });
    },

    uiClose() {
      tone({ freq: 420, dur: 0.035, type: "triangle", gain: 0.04, slide: -50 });
    },

    cardHover() {
      tone({ freq: 720, dur: 0.022, type: "sine", gain: 0.03, slide: 30 });
    },

    cardClick() {
      tone({ freq: 580, dur: 0.038, type: "triangle", gain: 0.05, slide: 100 });
    },

    cardDenied() {
      tone({ freq: 260, dur: 0.06, type: "square", gain: 0.032, slide: -35 });
    },

    cardPreview() {
      tone({ freq: 660, dur: 0.06, type: "sine", gain: 0.08, slide: -90 });
    },

    playCard() {
      const c = getCtx();
      if (!c) return;
      const t0 = c.currentTime;
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(220, t0);
      osc.frequency.exponentialRampToValueAtTime(880, t0 + 0.1);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.11, t0 + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.14);
      osc.connect(g);
      g.connect(c.destination);
      osc.start(t0);
      osc.stop(t0 + 0.16);
    },

    oppPlay() {
      tone({ freq: 300, dur: 0.08, type: "sine", gain: 0.065, slide: 200 });
    },

    lockConfirm() {
      const c = getCtx();
      if (!c) return;
      const t0 = c.currentTime;
      [392, 523.25, 659.25].forEach((f, i) => {
        const o = c.createOscillator();
        const g = c.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(f, t0 + i * 0.055);
        g.gain.setValueAtTime(0.0001, t0 + i * 0.055);
        g.gain.exponentialRampToValueAtTime(0.075, t0 + i * 0.055 + 0.004);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + i * 0.055 + 0.11);
        o.connect(g);
        g.connect(c.destination);
        o.start(t0 + i * 0.055);
        o.stop(t0 + i * 0.055 + 0.14);
      });
    },

    clashHit() {
      noiseBurst(0.14, 0.11);
      tone({ freq: 95, dur: 0.2, type: "sawtooth", gain: 0.05, slide: -20 });
    },

    clashTie() {
      tone({ freq: 280, dur: 0.12, type: "sine", gain: 0.06, slide: -40 });
    },

    negate() {
      tone({ freq: 180, dur: 0.14, type: "square", gain: 0.045, slide: -60 });
    },

    heal() {
      tone({ freq: 440, dur: 0.1, type: "sine", gain: 0.085, slide: 180 });
    },

    selfHurt() {
      tone({ freq: 200, dur: 0.15, type: "sawtooth", gain: 0.07, slide: -80 });
    },

    dealDamage() {
      tone({ freq: 360, dur: 0.1, type: "triangle", gain: 0.08, slide: -120 });
    },

    attackTick() {
      tone({ freq: 740, dur: 0.04, type: "sine", gain: 0.055, slide: 40 });
    },

    roundSystem() {
      tone({ freq: 330, dur: 0.12, type: "sine", gain: 0.06, slide: 90 });
    },

    yourTurnStart() {
      const c = getCtx();
      if (!c) return;
      const t0 = c.currentTime;
      [523.25, 659.25, 783.99].forEach((f, i) => {
        const o = c.createOscillator();
        const g = c.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(f, t0 + i * 0.065);
        g.gain.setValueAtTime(0.0001, t0 + i * 0.065);
        g.gain.exponentialRampToValueAtTime(0.055, t0 + i * 0.065 + 0.006);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + i * 0.065 + 0.12);
        o.connect(g);
        g.connect(c.destination);
        o.start(t0 + i * 0.065);
        o.stop(t0 + i * 0.065 + 0.14);
      });
    },

    toastOk() {
      tone({ freq: 600, dur: 0.05, type: "sine", gain: 0.055, slide: 50 });
    },

    toastWarn() {
      tone({ freq: 220, dur: 0.1, type: "square", gain: 0.04, slide: -40 });
    },

    toastNeutral() {
      tone({ freq: 480, dur: 0.04, type: "triangle", gain: 0.04 });
    },

    gameWin() {
      const c = getCtx();
      if (!c) return;
      const t0 = c.currentTime;
      const seq = [523, 659, 784, 1046];
      seq.forEach((f, i) => {
        const o = c.createOscillator();
        const g = c.createGain();
        o.type = "triangle";
        o.frequency.setValueAtTime(f, t0 + i * 0.07);
        g.gain.setValueAtTime(0.0001, t0 + i * 0.07);
        g.gain.exponentialRampToValueAtTime(0.07, t0 + i * 0.07 + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + i * 0.07 + 0.16);
        o.connect(g);
        g.connect(c.destination);
        o.start(t0 + i * 0.07);
        o.stop(t0 + i * 0.07 + 0.2);
      });
    },

    gameLose() {
      tone({ freq: 180, dur: 0.25, type: "sawtooth", gain: 0.07, slide: -70 });
    },
  };

  global.ScgSfx = ScgSfx;
})(typeof window !== "undefined" ? window : self);
