// Copyright 2022 (c) Microsoft Corporation.
// Licensed under the MIT license.
export async function fetchJson<JSON = unknown>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
  const response = await fetch(input, init);

  const data = await response.json();

  if (response.ok) {
    return data;
  }

  throw response;
}
