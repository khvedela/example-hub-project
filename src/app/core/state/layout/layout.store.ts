import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed } from '@angular/core';

export const LayoutStore = signalStore(
  { providedIn: 'root' },
  withState(() => {
    const savedMode = typeof localStorage !== 'undefined'
      ? localStorage.getItem('darkMode') === 'true'
      : false;

    return {
      darkMode: savedMode
    };
  }),
  withComputed(({ darkMode }) => ({
    mode: computed(() => darkMode() ? 'dark' : ''),
    isDark: computed(() => darkMode()),
    isLight: computed(() => !darkMode())
  })),
  withMethods((store) => ({
    toggleDarkMode: () => {
      const newMode = !store.darkMode();
      patchState(store, { darkMode: newMode });

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('darkMode', newMode.toString());
        const element = document.querySelector('html');
        if (element) {
          if (newMode) {
            element.classList.add('dark');
          } else {
            element.classList.remove('dark');
          }
        }
      }
    },
    setDarkMode: (enabled: boolean) => {
      patchState(store, { darkMode: enabled });
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('darkMode', enabled.toString());
        const element = document.querySelector('html');
        if (element) {
          if (enabled) {
            element.classList.add('dark');
          } else {
            element.classList.remove('dark');
          }
        }
      }
    }
  }))
);
