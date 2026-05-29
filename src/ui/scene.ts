export function renderScene(stars: HTMLElement | null, buildings: HTMLElement | null, trees: HTMLElement | null): void {
  renderStars(stars);
  renderBuildings(buildings);
  renderTrees(trees);
}

function renderStars(container: HTMLElement | null): void {
  if (!container) return;
  container.innerHTML = '';

  for (let i = 0; i < 80; i += 1) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 60}%;--d:${2 + Math.random() * 4}s;opacity:${0.2 + Math.random() * 0.6}`;
    container.appendChild(star);
  }
}

function renderBuildings(container: HTMLElement | null): void {
  if (!container) return;
  container.innerHTML = '';

  const configs = [
    { l: 5, b: 60, w: 20, h: 45 },
    { l: 22, b: 60, w: 14, h: 35 },
    { l: 34, b: 60, w: 18, h: 55 },
    { l: 50, b: 60, w: 12, h: 42 },
    { l: 60, b: 60, w: 16, h: 60 },
    { l: 73, b: 60, w: 22, h: 38 },
    { l: 90, b: 60, w: 14, h: 50 }
  ];

  configs.forEach(({ l, b, w, h }) => {
    const building = document.createElement('div');
    building.style.cssText = `position:absolute;left:${l}%;bottom:${b}px;width:${w}px;height:${h}px;background:#0b0d1a;border-top:1px solid #1a1f35`;
    const rows = Math.floor(h / 10);
    const cols = Math.floor(w / 8);

    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        if (Math.random() > 0.5) {
          const windowLight = document.createElement('div');
          windowLight.className = 'window-light';
          windowLight.style.cssText = `left:${c * 8 + 2}px;bottom:${r * 10 + 1}px;--fd:${2 + Math.random() * 5}s`;
          building.appendChild(windowLight);
        }
      }
    }

    container.appendChild(building);
  });
}

function renderTrees(container: HTMLElement | null): void {
  if (!container) return;
  container.innerHTML = '';

  [
    [15, '16px', '10px'],
    [28, '12px', '8px'],
    [45, '20px', '12px'],
    [67, '14px', '9px'],
    [82, '18px', '11px'],
    [96, '13px', '8px']
  ].forEach(([left, height, width]) => {
    const tree = document.createElement('div');
    tree.className = 'tree';
    tree.style.cssText = `left:${left}%;--h:${height};--w:${width}`;
    container.appendChild(tree);
  });
}
