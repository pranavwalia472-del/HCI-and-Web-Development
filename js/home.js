// --- Hero water surface effect ---
// The cursor acts like a stick tip touching water: moving it cuts a wake,
// holding still sends out gentle rings, clicking makes a splash.
// Uses a small 2D wave simulation drawn as light/shadow on a canvas.
(function heroWater() {
    const hero = document.querySelector('.hero');
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Tuned to stay subtle so it never competes with the page content
    const CELL = 5;            // px per simulation cell (higher = softer, less detail)
    const DAMPING = 0.96;      // how quickly waves die out (closer to 1 = longer)
    const WAKE = 0.22;         // strength of the wake while moving
    const TIP = 0.25;          // strength of the rings when the cursor rests
    const TIP_EVERY = 50;      // frames between resting rings
    const SPLASH = 1.4;        // strength of a click splash
    const SHADE = 0.3;         // slope -> opacity
    const MAX_ALPHA = 0.2;     // strongest highlight/shadow opacity

    const canvas = document.createElement('canvas');
    canvas.className = 'hero-water';
    canvas.setAttribute('aria-hidden', 'true');
    hero.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let w, h, cur, prev, img, pix;
    let pointer = null;        // current pointer in grid coords, null when outside
    let last = null;           // previous pointer position
    let movedThisFrame = false;
    let frame = 0, idleFrames = 0, running = false;

    function resize() {
        w = Math.max(3, Math.ceil(hero.clientWidth / CELL));
        h = Math.max(3, Math.ceil(hero.clientHeight / CELL));
        canvas.width = w;
        canvas.height = h;
        cur = new Float32Array(w * h);
        prev = new Float32Array(w * h);
        img = ctx.createImageData(w, h);
        pix = new Uint32Array(img.data.buffer);
    }

    // Push the water surface down around (cx, cy) with a smooth falloff
    function disturb(cx, cy, r, strength) {
        const x0 = Math.round(cx), y0 = Math.round(cy);
        for (let dy = -r; dy <= r; dy++) {
            for (let dx = -r; dx <= r; dx++) {
                const x = x0 + dx, y = y0 + dy;
                if (x < 1 || y < 1 || x >= w - 1 || y >= h - 1) continue;
                const d = Math.hypot(dx, dy);
                if (d > r) continue;
                cur[y * w + x] -= strength * (0.5 + 0.5 * Math.cos(Math.PI * d / r));
            }
        }
    }

    function step() {
        for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
                const i = y * w + x;
                const v = (cur[i - 1] + cur[i + 1] + cur[i - w] + cur[i + w]) * 0.5 - prev[i];
                prev[i] = v * DAMPING;
            }
        }
        const t = cur; cur = prev; prev = t;
    }

    function render() {
        for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
                const i = y * w + x;
                // Slope toward a light source at the top-left
                const s = (cur[i - 1] - cur[i + 1]) + (cur[i - w] - cur[i + w]);
                const a = Math.min(Math.abs(s) * SHADE, MAX_ALPHA) * 255 | 0;
                // Pixel format is ABGR: white highlights, deep navy shadows
                pix[i] = s > 0 ? (a << 24) | 0xffffff : (a << 24) | 0x231408;
            }
        }
        ctx.putImageData(img, 0, 0);
    }

    function loop() {
        frame++;
        if (pointer && !movedThisFrame && frame % TIP_EVERY === 0) {
            disturb(pointer.x, pointer.y, 2, TIP);  // resting stick tip
        }
        movedThisFrame = false;

        step();
        render();

        idleFrames = pointer ? 0 : idleFrames + 1;
        if (idleFrames > 180) {               // waves have settled, so stop and save CPU
            running = false;
            ctx.clearRect(0, 0, w, h);
            cur.fill(0); prev.fill(0);
            return;
        }
        requestAnimationFrame(loop);
    }

    function start() {
        if (!running) { running = true; requestAnimationFrame(loop); }
    }

    function toGrid(e) {
        const rect = hero.getBoundingClientRect();
        return { x: (e.clientX - rect.left) / CELL, y: (e.clientY - rect.top) / CELL };
    }

    hero.addEventListener('pointermove', (e) => {
        const p = toGrid(e);
        if (last) {
            // Cut a continuous line through the water from the last point to this one
            const dist = Math.hypot(p.x - last.x, p.y - last.y);
            const steps = Math.min(Math.ceil(dist), 60);
            for (let s = 1; s <= steps; s++) {
                disturb(last.x + (p.x - last.x) * s / steps, last.y + (p.y - last.y) * s / steps, 2, WAKE);
            }
        }
        last = p;
        pointer = p;
        movedThisFrame = true;
        start();
    });

    hero.addEventListener('pointerleave', () => { pointer = null; last = null; });

    hero.addEventListener('pointerdown', (e) => {
        const p = toGrid(e);
        disturb(p.x, p.y, 5, SPLASH);
        start();
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 150);
    });

    resize();
})();
