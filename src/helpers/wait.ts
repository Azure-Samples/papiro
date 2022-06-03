// Copyright 2022 (c) Microsoft Corporation.
// Licensed under the MIT license.
export function wait(timeout: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}
