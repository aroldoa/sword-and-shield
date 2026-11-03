import {defineMiddleware} from 'astro:middleware'
import {loadSiteContent} from './lib/content'
import {getDraftModeProps} from './sanity/lib/draft-mode'

export const onRequest = defineMiddleware(async (context, next) => {
  const {perspectiveCookie} = getDraftModeProps(context.cookies)
  context.locals.site = await loadSiteContent(perspectiveCookie)
  context.locals.draftMode = Boolean(perspectiveCookie)
  return next()
})
