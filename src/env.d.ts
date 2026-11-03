/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />

declare namespace App {
  interface Locals {
    site: import('./lib/content').SiteContent
    draftMode: boolean
  }
}
