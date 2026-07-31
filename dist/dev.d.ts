import { Context, MiddlewareHandler } from 'hono';

interface LiveReloadOptions {
    /** Internal endpoint prefix. Defaults to `/__site` and must begin with `/`. */
    readonly path?: string;
    /** Browser polling interval in milliseconds. Defaults to 500. */
    readonly interval?: number;
    /** Skip injection for selected requests. HTMX requests are skipped by default. */
    readonly ignore?: (context: Context) => boolean;
}
/** Inject browser live reload into full HTML responses during development. */
declare function liveReload(options?: LiveReloadOptions): MiddlewareHandler;

export { type LiveReloadOptions, liveReload };
