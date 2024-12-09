const setCssVariables = (node, variables) => {
  for (const name in variables) {
    if (variables[name]) {
      node.style.setProperty(`--${name}`, variables[name]);
    }
  }
};

export const cssVars = (node, variables) => {
  setCssVariables(node, variables);

  return {
    update(variables) {
      setCssVariables(node, variables);
    }
  };
};
