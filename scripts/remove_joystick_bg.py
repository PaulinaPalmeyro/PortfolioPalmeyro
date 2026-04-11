"""
Quita el fondo del Joystick.png:
1) Flood-fill desde las 4 esquinas (misma familia de color que el borde).
2) Pasa complementaria: grises/blancos planos (alta luminosidad, poca saturación).
No toca verdes ni beiges con saturación media (cruz del D-pad).
"""
from collections import deque

import numpy as np
from PIL import Image

path = "public/Joystick.png"


def flood_from(
    arr: np.ndarray, sy: int, sx: int, tol: float, vis: np.ndarray
) -> None:
    h, w = arr.shape[:2]
    ref = arr[sy, sx, :3].astype(np.float32)
    dq: deque[tuple[int, int]] = deque([(sy, sx)])
    while dq:
        y, x = dq.popleft()
        if y < 0 or y >= h or x < 0 or x >= w or vis[y, x]:
            continue
        if np.linalg.norm(arr[y, x, :3].astype(np.float32) - ref) > tol:
            continue
        vis[y, x] = True
        for dy, dx in ((0, 1), (0, -1), (1, 0), (-1, 0)):
            dq.append((y + dy, x + dx))


def main() -> None:
    img = Image.open(path).convert("RGBA")
    arr = np.array(img)
    h, w = arr.shape[:2]

    # --- 1) Unión de floods desde esquinas (fila, columna)
    union = np.zeros((h, w), dtype=bool)
    for sy, sx in ((0, 0), (0, w - 1), (h - 1, 0), (h - 1, w - 1)):
        vis = np.zeros((h, w), dtype=bool)
        flood_from(arr, sy, sx, tol=52.0, vis=vis)
        union |= vis

    out = arr.copy()
    out[:, :, 3] = np.where(union, 0, out[:, :, 3])

    # --- 2) Restos de gris/blanco plano (sin comer el verde ni el beige de la cruz)
    r = out[:, :, 0].astype(np.float32)
    g = out[:, :, 1].astype(np.float32)
    b = out[:, :, 2].astype(np.float32)
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    sat = mx - mn
    lum = (r + g + b) / 3.0

    # Casi blanco
    near_white = (r > 232) & (g > 232) & (b > 232)
    # Gris claro / papel (poca saturación, luminoso)
    flat_light = (sat < 38.0) & (lum > 158.0) & (lum < 252.0)

    kill = (out[:, :, 3] > 0) & (near_white | flat_light)
    out[:, :, 3] = np.where(kill, 0, out[:, :, 3])

    Image.fromarray(out).save(path, optimize=True)
    tr = (out[:, :, 3] == 0).sum()
    print("OK", path, "transparent_pixels", int(tr), f"({100.0 * tr / (h * w):.1f}%)")


if __name__ == "__main__":
    main()
