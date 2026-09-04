"use client";

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
  type UseThemeProps,
  useTheme,
} from "next-themes";

function ThemeProvider({
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  storageKey = "lai-theme",
  disableTransitionOnChange = true,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      storageKey={storageKey}
      disableTransitionOnChange={disableTransitionOnChange}
      {...props}
    />
  );
}

export { ThemeProvider, useTheme };
export type { ThemeProviderProps, UseThemeProps };
