import { Context, Hono } from 'hono';
export { Context, Hono } from 'hono';

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD";
type RoutePattern = `${Method} ${string}`;
interface ControllerApp<Deps> {
    readonly deps: Deps;
}
type Controller<Deps> = (app: ControllerApp<Deps>, context: Context) => Response | Promise<Response>;
type ControllerWrapper<Deps> = (next: Controller<Deps>) => Controller<Deps>;
type RouteTable<Deps> = Readonly<Partial<Record<RoutePattern, Controller<Deps>>>>;
type Routes<Deps> = (table: RouteTable<Deps>) => void;
interface SiteSetup<Deps> {
    /** The underlying Hono application. Register middleware here before routes run. */
    readonly app: Hono;
    readonly routes: Routes<Deps>;
}
type Site = Hono;

/** Provide contextual typing for a controller factory. */
declare function ctrl<Deps>(controller: Controller<Deps>): Controller<Deps>;
/** Create a reusable wrapper for individual controllers. */
declare function wrap<Deps>(wrapper: ControllerWrapper<Deps>): (controller: Controller<Deps>) => Controller<Deps>;

/** Create a Hono application whose routes are closure-first controllers. */
declare function site<Deps>(setup: (context: SiteSetup<Deps>) => Deps): Site;

export { type Controller, type ControllerApp, type ControllerWrapper, type Method, type RoutePattern, type RouteTable, type Routes, type Site, type SiteSetup, ctrl, site, wrap };
