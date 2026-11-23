// Values that change every frame (scroll, pointer) live here instead of in React state,
// so scrolling never re-renders React. The 3D scene reads them inside its frame loop.
export const world = {
  progress: 0, // 0 to 1 along the camera path
  push: 0, // 0 to 1 during the doorway push
  active: -1, // index of the artefact the visitor is pointing at, or -1
  pointerX: 0, // -1 to 1
  pointerY: 0,
}

// The 3D chunk registers the push animation here. Without 3D it stays null and links just navigate.
export const doorway: { run: (() => Promise<void>) | null } = { run: null }
