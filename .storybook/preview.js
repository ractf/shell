import React from "react";

import { ThemeLoader } from "@ractf/ui-kit";

import "@ractf/ui-kit/Base.scss";


export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};

export const decorators = [
  (Story) => (
    <>
      <ThemeLoader root={[":root", "#root"]} />
      <ThemeLoader root={[":root", "#docs-root"]} />
      <Story />
    </>
  )
];
