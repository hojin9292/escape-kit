/** 빌드된 에셋(public/assets/) 로더 — atlas.json 기반 */

export interface AtlasEntry {
  file: string;
  w: number;
  h: number;
  /** 표시 배율 (픽셀아트 — 정수 스케일, 기본 1) */
  scale?: number;
}

/** 로드된 스프라이트 — gameScale은 atlas의 표시 배율 */
export interface GameSprite extends HTMLImageElement {
  gameScale?: number;
}

export type Sprites = Record<string, GameSprite>;

// base(배포 경로)에 맞춘 상대 URL — vite.config base:"./" 및 서브경로 배포 대응
const BASE = import.meta.env.BASE_URL;
const asset = (p: string) => `${BASE}${p.replace(/^\//, "")}`;

let atlasPromise: Promise<Record<string, AtlasEntry>> | null = null;

function loadAtlas(): Promise<Record<string, AtlasEntry>> {
  atlasPromise ??= fetch(asset("assets/atlas.json")).then((r) => {
    if (!r.ok) throw new Error("atlas.json 로드 실패 — `npm run assets` 먼저 실행하세요");
    return r.json();
  });
  return atlasPromise;
}

/**
 * 요청한 스프라이트만 디코딩한다. 이름을 생략하면 전체를 읽는 기존 동작을 유지한다.
 * 방 배경과 퍼즐 도구 그림을 한꺼번에 디코딩하면 태블릿에서 수십 MB의 이미지 메모리를
 * 시작부터 점유하므로, 게임은 현재 방에 필요한 이름만 넘긴다.
 */
export async function loadSprites(names?: Iterable<string>): Promise<Sprites> {
  const atlas = await loadAtlas();
  const entries = names
    ? [...new Set(names)].flatMap((name) => atlas[name] ? [[name, atlas[name]] as const] : [])
    : Object.entries(atlas);

  const sprites: Sprites = {};
  await Promise.all(
    entries.map(async ([name, entry]) => {
      const img: GameSprite = new Image();
      img.src = asset(entry.file);
      await img.decode();
      if (entry.scale && entry.scale !== 1) img.gameScale = entry.scale;
      sprites[name] = img;
    })
  );
  return sprites;
}
