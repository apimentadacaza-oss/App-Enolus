// Progresso volátil só p/ o Lab — não mexe no estado real
type SandboxState = {
  completed: Record<string, boolean>; // slug -> done
  xp: number;
};

const KEY = 'lab:sandbox:v1';

function read(): SandboxState {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { completed: {}, xp: 0 };
}

function write(s: SandboxState) {
  sessionStorage.setItem(KEY, JSON.stringify(s));
}

export const sandboxProgress = {
  get() { return read(); },
  reset() { write({ completed: {}, xp: 0 }); },
  complete(slug: string, xpGain = 10) {
    const s = read();
    if (!s.completed[slug]) {
      s.completed[slug] = true;
      s.xp += xpGain;
      write(s);
    }
    return s;
  }
};
