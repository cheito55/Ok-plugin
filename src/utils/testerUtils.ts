export interface VideoItemTest {
  id: string;
  name: string;
  parsedSeason?: number;
  parsedChapter?: number | null;
}

export function cleanText(s: string): string {
  if (!s) return "";
  return s
    .replace(/<[^>]*>/g, " ")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export function chapterOrderKey(title: string): { s: number; c: number | null } {
  const t = cleanText(title);
  let season = 1;
  let ch: number | null = null;

  // 1. Temporada (S01, T02, Temporada 2, Season 1, 2x04)
  const sm =
    t.match(/\b(?:S|T)(\d{1,2})\s*(?:[-_ ]?\s*(?:E|Ep|Cap)\s*\d|x\d)/i) ||
    t.match(/\b(\d{1,2})x\d{1,3}\b/i) ||
    t.match(/(?:temporada|temp\.?|season|сезон)\s*#?\s*(\d{1,2})/i);
  if (sm) {
    season = parseInt(sm[1], 10);
  }

  // 2. Formato 1x04
  const xMatch = t.match(/\b\d{1,2}x(\d{1,3})\b/i);
  if (xMatch) {
    ch = parseInt(xMatch[1], 10);
  }

  // 3. Capítulos con prefijos (Cap, Ep, Episodio, Серия, Выпуск, Parte)
  if (ch === null) {
    const cm =
      t.match(
        /(?:\b(?:cap[ií]tulos?|cap\.?|episodios?|epis\.?|ep\.?|episode|серия|эпизод|выпуск|parte|part|pt\.?))\s*[:#.\-]?\s*(\d{1,4})/i
      ) ||
      t.match(/\bS\d{1,2}\s*E(\d{1,3})/i) ||
      t.match(/#\s*(\d{1,4})/);
    if (cm) {
      ch = parseInt(cm[1], 10);
    }
  }

  // 4. Fracciones: 04/24 o 04 de 24
  if (ch === null) {
    const fm = t.match(/\b(\d{1,4})\s*(?:\/|de)\s*\d{1,4}\b/i);
    if (fm) {
      ch = parseInt(fm[1], 10);
    }
  }

  // 5. Corchetes o paréntesis: [05], (05)
  if (ch === null) {
    const bm = t.match(/[\[\(](\d{1,3})[\]\)]/);
    if (bm) {
      ch = parseInt(bm[1], 10);
    }
  }

  // 6. Guión final: "Serie - 04"
  if (ch === null) {
    const dm = t.match(/(?:^|[-–—:])\s*(\d{1,3})(?:\s*\([\s\S]*\))?\s*$/);
    if (dm) {
      ch = parseInt(dm[1], 10);
    }
  }

  // 7. Fallback: número suelto no año
  if (ch === null) {
    const re = /\d+/g;
    let x: RegExpExecArray | null;
    while ((x = re.exec(t)) !== null) {
      const n = parseInt(x[0], 10);
      if (x[0].length === 4 && n >= 1900 && n <= 2099) continue;
      if (x[0].length > 4) continue;
      ch = n;
    }
  }

  return { s: season, c: ch };
}

export function sortVideosByChapter(
  list: VideoItemTest[],
  desc: boolean = false
): VideoItemTest[] {
  const arr = list.map((v, i) => {
    const k = chapterOrderKey(v.name);
    return {
      v: { ...v, parsedSeason: k.s, parsedChapter: k.c },
      i,
      k,
    };
  });

  arr.sort((a, b) => {
    const an = a.k.c === null;
    const bn = b.k.c === null;
    if (an !== bn) return an ? 1 : -1;
    if (an && bn) return a.i - b.i;
    if (a.k.s !== b.k.s) return desc ? b.k.s - a.k.s : a.k.s - b.k.s;
    const chapterA = a.k.c ?? 0;
    const chapterB = b.k.c ?? 0;
    if (chapterA !== chapterB) return desc ? chapterB - chapterA : chapterA - chapterB;
    return a.i - b.i;
  });

  return arr.map((x) => x.v);
}

export function isGenericTitle(t: string): boolean {
  const s = cleanText(t || "").toLowerCase().replace(/[.\u2026:!]+$/g, "").trim();
  if (!s || s.length < 2) return true;
  if (/^[\d:\s]+$/.test(s)) return true;
  if (/^(image|video|videos|more|next|previous|menu|play|share|like|comment)$/.test(s)) return true;
  if (
    /^(view|views|ver|watch|play|reproducir|mirar|смотреть|посмотреть|просмотр|просмотры|открыть|открыть видео)(?:\s+(video|vídeo|видео|ролик))?$/.test(
      s
    )
  )
    return true;
  if (
    /^(view|views|ver|watch|play|reproducir|mirar|смотреть|посмотреть|просмотр|просмотры|открыть)\s+\d/.test(
      s
    ) &&
    s.length <= 40
  )
    return true;
  return false;
}

export const PRESET_SERIES_TESTS: VideoItemTest[] = [
  { id: "1", name: "La Reina del Sur - T2 Cap 14" },
  { id: "2", name: "La Reina del Sur - T1 Cap 02" },
  { id: "3", name: "La Reina del Sur - T1 Cap 01" },
  { id: "4", name: "La Reina del Sur - T2 Cap 01" },
  { id: "5", name: "La Reina del Sur - T1 Cap 10" },
  { id: "6", name: "Dragon Ball Z 1x04 [Sub Español]" },
  { id: "7", name: "Dragon Ball Z 1x02 [Sub Español]" },
  { id: "8", name: "Dragon Ball Z 1x01 [Sub Español]" },
  { id: "9", name: "Кухня - Серия 3 (HD)" },
  { id: "10", name: "Кухня - Серия 1 (HD)" },
  { id: "11", name: "Кухня - Серия 2 (HD)" },
  { id: "12", name: "Trailer Promocional Especial (Sin capítulo)" },
];
