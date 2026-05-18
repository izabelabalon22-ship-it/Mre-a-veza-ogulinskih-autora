/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Author {
  id: string;
  name: string;
  bio: string;
  period: string;
  years?: string;
  genres?: string[];
  roles: string[];
  motives: string[];
  works: string[];
  imageUrl?: string;
}

export interface Connection {
  source: string;
  target: string;
  type: 'influence' | 'theme' | 'collaboration';
  description: string;
}

export interface Legend {
  id: string;
  name: string;
  description: string;
  identityImpact: string;
  era?: string;
}

export interface NetworkData {
  authors: Author[];
  connections: Connection[];
  legends?: Legend[];
}
