// Minimal preload bridge. No direct Node APIs exposed by default.
import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  // expose safe helpers here if needed in future
});
