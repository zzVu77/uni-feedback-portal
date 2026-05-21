(() => {
  "use strict";
  let e,
    t,
    a,
    s = {
      googleAnalytics: "googleAnalytics",
      precache: "precache-v2",
      prefix: "serwist",
      runtime: "runtime",
      suffix: "undefined" != typeof registration ? registration.scope : "",
    },
    r = (e) =>
      [s.prefix, e, s.suffix].filter((e) => e && e.length > 0).join("-"),
    n = {
      updateDetails: (e) => {
        var t = (t) => {
          let a = e[t];
          "string" == typeof a && (s[t] = a);
        };
        for (let e of Object.keys(s)) t(e);
      },
      getGoogleAnalyticsName: (e) => e || r(s.googleAnalytics),
      getPrecacheName: (e) => e || r(s.precache),
      getRuntimeName: (e) => e || r(s.runtime),
    };
  var i = class extends Error {
    details;
    constructor(e, t) {
      (super(
        ((e, ...t) => {
          let a = e;
          return (t.length > 0 && (a += ` :: ${JSON.stringify(t)}`), a);
        })(e, t),
      ),
        (this.name = e),
        (this.details = t));
    }
  };
  function c(e) {
    return new Promise((t) => setTimeout(t, e));
  }
  let o = new Set();
  function l(e, t) {
    let a = new URL(e);
    for (let e of t) a.searchParams.delete(e);
    return a.href;
  }
  async function h(e, t, a, s) {
    let r = l(t.url, a);
    if (t.url === r) return e.match(t, s);
    let n = { ...s, ignoreSearch: !0 };
    for (let i of await e.keys(t, n))
      if (r === l(i.url, a)) return e.match(i, s);
  }
  var u = class {
    promise;
    resolve;
    reject;
    constructor() {
      this.promise = new Promise((e, t) => {
        ((this.resolve = e), (this.reject = t));
      });
    }
  };
  let d = async () => {
      for (let e of o) await e();
    },
    m = "-precache-",
    g = async (e, t = m) => {
      let a = (await self.caches.keys()).filter(
        (a) => a.includes(t) && a.includes(self.registration.scope) && a !== e,
      );
      return (await Promise.all(a.map((e) => self.caches.delete(e))), a);
    },
    f = (e, t) => {
      let a = t();
      return (e.waitUntil(a), a);
    },
    w = (e, t) => t.some((t) => e instanceof t),
    p = new WeakMap(),
    y = new WeakMap(),
    _ = new WeakMap(),
    x = {
      get(e, t, a) {
        if (e instanceof IDBTransaction) {
          if ("done" === t) return p.get(e);
          if ("store" === t)
            return a.objectStoreNames[1]
              ? void 0
              : a.objectStore(a.objectStoreNames[0]);
        }
        return b(e[t]);
      },
      set: (e, t, a) => ((e[t] = a), !0),
      has: (e, t) =>
        (e instanceof IDBTransaction && ("done" === t || "store" === t)) ||
        t in e,
    };
  function b(e) {
    if (e instanceof IDBRequest) {
      let t = new Promise((t, a) => {
        let s = () => {
            (e.removeEventListener("success", r),
              e.removeEventListener("error", n));
          },
          r = () => {
            (t(b(e.result)), s());
          },
          n = () => {
            (a(e.error), s());
          };
        (e.addEventListener("success", r), e.addEventListener("error", n));
      });
      return (_.set(t, e), t);
    }
    if (y.has(e)) return y.get(e);
    let s = (function (e) {
      if ("function" == typeof e)
        return (
          a ||
          (a = [
            IDBCursor.prototype.advance,
            IDBCursor.prototype.continue,
            IDBCursor.prototype.continuePrimaryKey,
          ])
        ).includes(e)
          ? function (...t) {
              return (e.apply(v(this), t), b(this.request));
            }
          : function (...t) {
              return b(e.apply(v(this), t));
            };
      return (e instanceof IDBTransaction &&
        (function (e) {
          if (p.has(e)) return;
          let t = new Promise((t, a) => {
            let s = () => {
                (e.removeEventListener("complete", r),
                  e.removeEventListener("error", n),
                  e.removeEventListener("abort", n));
              },
              r = () => {
                (t(), s());
              },
              n = () => {
                (a(e.error || new DOMException("AbortError", "AbortError")),
                  s());
              };
            (e.addEventListener("complete", r),
              e.addEventListener("error", n),
              e.addEventListener("abort", n));
          });
          p.set(e, t);
        })(e),
      w(
        e,
        t ||
          (t = [
            IDBDatabase,
            IDBObjectStore,
            IDBIndex,
            IDBCursor,
            IDBTransaction,
          ]),
      ))
        ? new Proxy(e, x)
        : e;
    })(e);
    return (s !== e && (y.set(e, s), _.set(s, e)), s);
  }
  let v = (e) => _.get(e);
  function R(
    e,
    t,
    { blocked: a, upgrade: s, blocking: r, terminated: n } = {},
  ) {
    let i = indexedDB.open(e, t),
      c = b(i);
    return (
      s &&
        i.addEventListener("upgradeneeded", (e) => {
          s(b(i.result), e.oldVersion, e.newVersion, b(i.transaction), e);
        }),
      a &&
        i.addEventListener("blocked", (e) => a(e.oldVersion, e.newVersion, e)),
      c
        .then((e) => {
          (n && e.addEventListener("close", () => n()),
            r &&
              e.addEventListener("versionchange", (e) =>
                r(e.oldVersion, e.newVersion, e),
              ));
        })
        .catch(() => {}),
      c
    );
  }
  let E = ["get", "getKey", "getAll", "getAllKeys", "count"],
    q = ["put", "add", "delete", "clear"],
    S = new Map();
  function D(e, t) {
    if (!(e instanceof IDBDatabase && !(t in e) && "string" == typeof t))
      return;
    if (S.get(t)) return S.get(t);
    let a = t.replace(/FromIndex$/, ""),
      s = t !== a,
      r = q.includes(a);
    if (
      !(a in (s ? IDBIndex : IDBObjectStore).prototype) ||
      !(r || E.includes(a))
    )
      return;
    let n = async function (e, ...t) {
      let n = this.transaction(e, r ? "readwrite" : "readonly"),
        i = n.store;
      return (
        s && (i = i.index(t.shift())),
        (await Promise.all([i[a](...t), r && n.done]))[0]
      );
    };
    return (S.set(t, n), n);
  }
  x = ((e) => ({
    ...e,
    get: (t, a, s) => D(t, a) || e.get(t, a, s),
    has: (t, a) => !!D(t, a) || e.has(t, a),
  }))(x);
  let N = ["continue", "continuePrimaryKey", "advance"],
    C = {},
    P = new WeakMap(),
    T = new WeakMap(),
    A = {
      get(e, t) {
        if (!N.includes(t)) return e[t];
        let a = C[t];
        return (
          a ||
            (a = C[t] =
              function (...e) {
                P.set(this, T.get(this)[t](...e));
              }),
          a
        );
      },
    };
  async function* k(...e) {
    let t = this;
    if ((t instanceof IDBCursor || (t = await t.openCursor(...e)), !t)) return;
    let a = new Proxy(t, A);
    for (T.set(a, t), _.set(a, v(t)); t; )
      (yield a, (t = await (P.get(a) || t.continue())), P.delete(a));
  }
  function I(e, t) {
    return (
      (t === Symbol.asyncIterator &&
        w(e, [IDBIndex, IDBObjectStore, IDBCursor])) ||
      ("iterate" === t && w(e, [IDBIndex, IDBObjectStore]))
    );
  }
  x = ((e) => ({
    ...e,
    get: (t, a, s) => (I(t, a) ? k : e.get(t, a, s)),
    has: (t, a) => I(t, a) || e.has(t, a),
  }))(x);
  let U = async (t, a) => {
      let s = null;
      if ((t.url && (s = new URL(t.url).origin), s !== self.location.origin))
        throw new i("cross-origin-copy-response", { origin: s });
      let r = t.clone(),
        n = {
          headers: new Headers(r.headers),
          status: r.status,
          statusText: r.statusText,
        },
        c = a ? a(n) : n,
        o = !(function () {
          if (void 0 === e) {
            let t = new Response("");
            if ("body" in t)
              try {
                (new Response(t.body), (e = !0));
              } catch {
                e = !1;
              }
            e = !1;
          }
          return e;
        })()
          ? await r.blob()
          : r.body;
      return new Response(o, c);
    },
    L = "requests",
    F = "queueName";
  var M = class {
      _db = null;
      async addEntry(e) {
        let t = (await this.getDb()).transaction(L, "readwrite", {
          durability: "relaxed",
        });
        (await t.store.add(e), await t.done);
      }
      async getFirstEntryId() {
        return (await (await this.getDb()).transaction(L).store.openCursor())
          ?.value.id;
      }
      async getAllEntriesByQueueName(e) {
        return (
          (await (
            await this.getDb()
          ).getAllFromIndex(L, F, IDBKeyRange.only(e))) || []
        );
      }
      async getEntryCountByQueueName(e) {
        return (await this.getDb()).countFromIndex(L, F, IDBKeyRange.only(e));
      }
      async deleteEntry(e) {
        await (await this.getDb()).delete(L, e);
      }
      async getFirstEntryByQueueName(e) {
        return await this.getEndEntryFromIndex(IDBKeyRange.only(e), "next");
      }
      async getLastEntryByQueueName(e) {
        return await this.getEndEntryFromIndex(IDBKeyRange.only(e), "prev");
      }
      async getEndEntryFromIndex(e, t) {
        return (
          await (await this.getDb())
            .transaction(L)
            .store.index(F)
            .openCursor(e, t)
        )?.value;
      }
      async getDb() {
        return (
          this._db ||
            (this._db = await R("serwist-background-sync", 3, {
              upgrade: this._upgradeDb,
            })),
          this._db
        );
      }
      _upgradeDb(e, t) {
        (t > 0 &&
          t < 3 &&
          e.objectStoreNames.contains(L) &&
          e.deleteObjectStore(L),
          e
            .createObjectStore(L, { autoIncrement: !0, keyPath: "id" })
            .createIndex(F, F, { unique: !1 }));
      }
    },
    O = class {
      _queueName;
      _queueDb;
      constructor(e) {
        ((this._queueName = e), (this._queueDb = new M()));
      }
      async pushEntry(e) {
        (delete e.id,
          (e.queueName = this._queueName),
          await this._queueDb.addEntry(e));
      }
      async unshiftEntry(e) {
        let t = await this._queueDb.getFirstEntryId();
        (t ? (e.id = t - 1) : delete e.id,
          (e.queueName = this._queueName),
          await this._queueDb.addEntry(e));
      }
      async popEntry() {
        return this._removeEntry(
          await this._queueDb.getLastEntryByQueueName(this._queueName),
        );
      }
      async shiftEntry() {
        return this._removeEntry(
          await this._queueDb.getFirstEntryByQueueName(this._queueName),
        );
      }
      async getAll() {
        return await this._queueDb.getAllEntriesByQueueName(this._queueName);
      }
      async size() {
        return await this._queueDb.getEntryCountByQueueName(this._queueName);
      }
      async deleteEntry(e) {
        await this._queueDb.deleteEntry(e);
      }
      async _removeEntry(e) {
        return (e && (await this.deleteEntry(e.id)), e);
      }
    };
  let B = [
    "method",
    "referrer",
    "referrerPolicy",
    "mode",
    "credentials",
    "cache",
    "redirect",
    "integrity",
    "keepalive",
  ];
  var K = class e {
    _requestData;
    static async fromRequest(t) {
      let a = { url: t.url, headers: {} };
      for (let e of ("GET" !== t.method &&
        (a.body = await t.clone().arrayBuffer()),
      t.headers.forEach((e, t) => {
        a.headers[t] = e;
      }),
      B))
        void 0 !== t[e] && (a[e] = t[e]);
      return new e(a);
    }
    constructor(e) {
      ("navigate" === e.mode && (e.mode = "same-origin"),
        (this._requestData = e));
    }
    toObject() {
      let e = Object.assign({}, this._requestData);
      return (
        (e.headers = Object.assign({}, this._requestData.headers)),
        e.body && (e.body = e.body.slice(0)),
        e
      );
    }
    toRequest() {
      return new Request(this._requestData.url, this._requestData);
    }
    clone() {
      return new e(this.toObject());
    }
  };
  let W = "serwist-background-sync",
    j = new Set(),
    $ = (e) => {
      let t = {
        request: new K(e.requestData).toRequest(),
        timestamp: e.timestamp,
      };
      return (e.metadata && (t.metadata = e.metadata), t);
    };
  var H = class {
      _name;
      _onSync;
      _maxRetentionTime;
      _queueStore;
      _forceSyncFallback;
      _syncInProgress = !1;
      _requestsAddedDuringSync = !1;
      constructor(
        e,
        { forceSyncFallback: t, onSync: a, maxRetentionTime: s } = {},
      ) {
        if (j.has(e)) throw new i("duplicate-queue-name", { name: e });
        (j.add(e),
          (this._name = e),
          (this._onSync = a || this.replayRequests),
          (this._maxRetentionTime = s || 10080),
          (this._forceSyncFallback = !!t),
          (this._queueStore = new O(this._name)),
          this._addSyncListener());
      }
      get name() {
        return this._name;
      }
      async pushRequest(e) {
        await this._addRequest(e, "push");
      }
      async unshiftRequest(e) {
        await this._addRequest(e, "unshift");
      }
      async popRequest() {
        return this._removeRequest("pop");
      }
      async shiftRequest() {
        return this._removeRequest("shift");
      }
      async getAll() {
        let e = await this._queueStore.getAll(),
          t = Date.now(),
          a = [];
        for (let s of e) {
          let e = 60 * this._maxRetentionTime * 1e3;
          t - s.timestamp > e
            ? await this._queueStore.deleteEntry(s.id)
            : a.push($(s));
        }
        return a;
      }
      async size() {
        return await this._queueStore.size();
      }
      async _addRequest(
        { request: e, metadata: t, timestamp: a = Date.now() },
        s,
      ) {
        let r = {
          requestData: (await K.fromRequest(e.clone())).toObject(),
          timestamp: a,
        };
        switch ((t && (r.metadata = t), s)) {
          case "push":
            await this._queueStore.pushEntry(r);
            break;
          case "unshift":
            await this._queueStore.unshiftEntry(r);
        }
        this._syncInProgress
          ? (this._requestsAddedDuringSync = !0)
          : await this.registerSync();
      }
      async _removeRequest(e) {
        let t,
          a = Date.now();
        switch (e) {
          case "pop":
            t = await this._queueStore.popEntry();
            break;
          case "shift":
            t = await this._queueStore.shiftEntry();
        }
        if (t) {
          let s = 60 * this._maxRetentionTime * 1e3;
          return a - t.timestamp > s ? this._removeRequest(e) : $(t);
        }
      }
      async replayRequests() {
        let e;
        for (; (e = await this.shiftRequest()); )
          try {
            await fetch(e.request.clone());
          } catch {
            throw (
              await this.unshiftRequest(e),
              new i("queue-replay-failed", { name: this._name })
            );
          }
      }
      async registerSync() {
        if ("sync" in self.registration && !this._forceSyncFallback)
          try {
            await self.registration.sync.register(`${W}:${this._name}`);
          } catch (e) {}
      }
      _addSyncListener() {
        "sync" in self.registration && !this._forceSyncFallback
          ? self.addEventListener("sync", (e) => {
              if (e.tag === `${W}:${this._name}`) {
                let t = async () => {
                  let t;
                  this._syncInProgress = !0;
                  try {
                    await this._onSync({ queue: this });
                  } catch (e) {
                    if (e instanceof Error) throw e;
                  } finally {
                    (this._requestsAddedDuringSync &&
                      !(t && !e.lastChance) &&
                      (await this.registerSync()),
                      (this._syncInProgress = !1),
                      (this._requestsAddedDuringSync = !1));
                  }
                };
                e.waitUntil(t());
              }
            })
          : this._onSync({ queue: this });
      }
      static get _queueNames() {
        return j;
      }
    },
    G = class {
      _queue;
      constructor(e, t) {
        this._queue = new H(e, t);
      }
      async fetchDidFail({ request: e }) {
        await this._queue.pushRequest({ request: e });
      }
    };
  let Q = {
    cacheWillUpdate: async ({ response: e }) =>
      200 === e.status || 0 === e.status ? e : null,
  };
  function V(e) {
    return "string" == typeof e ? new Request(e) : e;
  }
  var z = class {
      event;
      request;
      url;
      params;
      _cacheKeys = {};
      _strategy;
      _handlerDeferred;
      _extendLifetimePromises;
      _plugins;
      _pluginStateMap;
      constructor(e, t) {
        for (let a of ((this.event = t.event),
        (this.request = t.request),
        t.url && ((this.url = t.url), (this.params = t.params)),
        (this._strategy = e),
        (this._handlerDeferred = new u()),
        (this._extendLifetimePromises = []),
        (this._plugins = [...e.plugins]),
        (this._pluginStateMap = new Map()),
        this._plugins))
          this._pluginStateMap.set(a, {});
        this.event.waitUntil(this._handlerDeferred.promise);
      }
      async fetch(e) {
        let { event: t } = this,
          a = V(e),
          s = await this.getPreloadResponse();
        if (s) return s;
        let r = this.hasCallback("fetchDidFail") ? a.clone() : null;
        try {
          for (let e of this.iterateCallbacks("requestWillFetch"))
            a = await e({ request: a.clone(), event: t });
        } catch (e) {
          if (e instanceof Error)
            throw new i("plugin-error-request-will-fetch", {
              thrownErrorMessage: e.message,
            });
        }
        let n = a.clone();
        try {
          let e;
          for (let s of ((e = await fetch(
            a,
            "navigate" === a.mode ? void 0 : this._strategy.fetchOptions,
          )),
          this.iterateCallbacks("fetchDidSucceed")))
            e = await s({ event: t, request: n, response: e });
          return e;
        } catch (e) {
          throw (
            r &&
              (await this.runCallbacks("fetchDidFail", {
                error: e,
                event: t,
                originalRequest: r.clone(),
                request: n.clone(),
              })),
            e
          );
        }
      }
      async fetchAndCachePut(e) {
        let t = await this.fetch(e),
          a = t.clone();
        return (this.waitUntil(this.cachePut(e, a)), t);
      }
      async cacheMatch(e) {
        let t,
          a = V(e),
          { cacheName: s, matchOptions: r } = this._strategy,
          n = await this.getCacheKey(a, "read"),
          i = { ...r, cacheName: s };
        for (let e of ((t = await caches.match(n, i)),
        this.iterateCallbacks("cachedResponseWillBeUsed")))
          t =
            (await e({
              cacheName: s,
              matchOptions: r,
              cachedResponse: t,
              request: n,
              event: this.event,
            })) || void 0;
        return t;
      }
      async cachePut(e, t) {
        let a = V(e);
        await c(0);
        let s = await this.getCacheKey(a, "write");
        if (!t)
          throw new i("cache-put-with-no-response", {
            url: new URL(String(s.url), location.href).href.replace(
              RegExp(`^${location.origin}`),
              "",
            ),
          });
        let r = await this._ensureResponseSafeToCache(t);
        if (!r) return !1;
        let { cacheName: n, matchOptions: o } = this._strategy,
          l = await self.caches.open(n),
          u = this.hasCallback("cacheDidUpdate"),
          m = u ? await h(l, s.clone(), ["__WB_REVISION__"], o) : null;
        try {
          await l.put(s, u ? r.clone() : r);
        } catch (e) {
          if (e instanceof Error)
            throw ("QuotaExceededError" === e.name && (await d()), e);
        }
        for (let e of this.iterateCallbacks("cacheDidUpdate"))
          await e({
            cacheName: n,
            oldResponse: m,
            newResponse: r.clone(),
            request: s,
            event: this.event,
          });
        return !0;
      }
      async getCacheKey(e, t) {
        let a = `${e.url} | ${t}`;
        if (!this._cacheKeys[a]) {
          let s = e;
          for (let e of this.iterateCallbacks("cacheKeyWillBeUsed"))
            s = V(
              await e({
                mode: t,
                request: s,
                event: this.event,
                params: this.params,
              }),
            );
          this._cacheKeys[a] = s;
        }
        return this._cacheKeys[a];
      }
      hasCallback(e) {
        for (let t of this._strategy.plugins) if (e in t) return !0;
        return !1;
      }
      async runCallbacks(e, t) {
        for (let a of this.iterateCallbacks(e)) await a(t);
      }
      *iterateCallbacks(e) {
        for (let t of this._strategy.plugins)
          if ("function" == typeof t[e]) {
            let a = this._pluginStateMap.get(t),
              s = (s) => {
                let r = { ...s, state: a };
                return t[e](r);
              };
            yield s;
          }
      }
      waitUntil(e) {
        return (this._extendLifetimePromises.push(e), e);
      }
      async doneWaiting() {
        let e;
        for (; (e = this._extendLifetimePromises.shift()); ) await e;
      }
      destroy() {
        this._handlerDeferred.resolve(null);
      }
      async getPreloadResponse() {
        if (
          this.event instanceof FetchEvent &&
          "navigate" === this.event.request.mode &&
          "preloadResponse" in this.event
        )
          try {
            let e = await this.event.preloadResponse;
            if (e) return e;
          } catch (e) {
            return;
          }
      }
      async _ensureResponseSafeToCache(e) {
        let t = e,
          a = !1;
        for (let e of this.iterateCallbacks("cacheWillUpdate"))
          if (
            ((t =
              (await e({
                request: this.request,
                response: t,
                event: this.event,
              })) || void 0),
            (a = !0),
            !t)
          )
            break;
        return (!a && t && 200 !== t.status && (t = void 0), t);
      }
    },
    J = class {
      cacheName;
      plugins;
      fetchOptions;
      matchOptions;
      constructor(e = {}) {
        ((this.cacheName = n.getRuntimeName(e.cacheName)),
          (this.plugins = e.plugins || []),
          (this.fetchOptions = e.fetchOptions),
          (this.matchOptions = e.matchOptions));
      }
      handle(e) {
        let [t] = this.handleAll(e);
        return t;
      }
      handleAll(e) {
        e instanceof FetchEvent && (e = { event: e, request: e.request });
        let t = e.event,
          a = "string" == typeof e.request ? new Request(e.request) : e.request,
          s = new z(
            this,
            e.url
              ? { event: t, request: a, url: e.url, params: e.params }
              : { event: t, request: a },
          ),
          r = this._getResponse(s, a, t);
        return [r, this._awaitComplete(r, s, a, t)];
      }
      async _getResponse(e, t, a) {
        let s;
        await e.runCallbacks("handlerWillStart", { event: a, request: t });
        try {
          if (
            ((s = await this._handle(t, e)), void 0 === s || "error" === s.type)
          )
            throw new i("no-response", { url: t.url });
        } catch (r) {
          if (r instanceof Error) {
            for (let n of e.iterateCallbacks("handlerDidError"))
              if (void 0 !== (s = await n({ error: r, event: a, request: t })))
                break;
          }
          if (!s) throw r;
        }
        for (let r of e.iterateCallbacks("handlerWillRespond"))
          s = await r({ event: a, request: t, response: s });
        return s;
      }
      async _awaitComplete(e, t, a, s) {
        let r, n;
        try {
          r = await e;
        } catch {}
        try {
          (await t.runCallbacks("handlerDidRespond", {
            event: s,
            request: a,
            response: r,
          }),
            await t.doneWaiting());
        } catch (e) {
          e instanceof Error && (n = e);
        }
        if (
          (await t.runCallbacks("handlerDidComplete", {
            event: s,
            request: a,
            response: r,
            error: n,
          }),
          t.destroy(),
          n)
        )
          throw n;
      }
    },
    X = class extends J {
      _networkTimeoutSeconds;
      constructor(e = {}) {
        (super(e),
          this.plugins.some((e) => "cacheWillUpdate" in e) ||
            this.plugins.unshift(Q),
          (this._networkTimeoutSeconds = e.networkTimeoutSeconds || 0));
      }
      async _handle(e, t) {
        let a,
          s = [],
          r = [];
        if (this._networkTimeoutSeconds) {
          let { id: n, promise: i } = this._getTimeoutPromise({
            request: e,
            logs: s,
            handler: t,
          });
          ((a = n), r.push(i));
        }
        let n = this._getNetworkPromise({
          timeoutId: a,
          request: e,
          logs: s,
          handler: t,
        });
        r.push(n);
        let c = await t.waitUntil(
          (async () => (await t.waitUntil(Promise.race(r))) || (await n))(),
        );
        if (!c) throw new i("no-response", { url: e.url });
        return c;
      }
      _getTimeoutPromise({ request: e, logs: t, handler: a }) {
        let s;
        return {
          promise: new Promise((t) => {
            s = setTimeout(async () => {
              t(await a.cacheMatch(e));
            }, 1e3 * this._networkTimeoutSeconds);
          }),
          id: s,
        };
      }
      async _getNetworkPromise({
        timeoutId: e,
        request: t,
        logs: a,
        handler: s,
      }) {
        let r, n;
        try {
          n = await s.fetchAndCachePut(t);
        } catch (e) {
          e instanceof Error && (r = e);
        }
        return (
          e && clearTimeout(e),
          (r || !n) && (n = await s.cacheMatch(t)),
          n
        );
      }
    },
    Y = class extends J {
      _networkTimeoutSeconds;
      constructor(e = {}) {
        (super(e),
          (this._networkTimeoutSeconds = e.networkTimeoutSeconds || 0));
      }
      async _handle(e, t) {
        let a, s;
        try {
          let a = [t.fetch(e)];
          if (this._networkTimeoutSeconds) {
            let e = c(1e3 * this._networkTimeoutSeconds);
            a.push(e);
          }
          if (!(s = await Promise.race(a)))
            throw Error(
              `Timed out the network response after ${this._networkTimeoutSeconds} seconds.`,
            );
        } catch (e) {
          e instanceof Error && (a = e);
        }
        if (!s) throw new i("no-response", { url: e.url, error: a });
        return s;
      }
    };
  let Z = (e) => (e && "object" == typeof e ? e : { handle: e });
  var ee = class {
      handler;
      match;
      method;
      catchHandler;
      constructor(e, t, a = "GET") {
        ((this.handler = Z(t)), (this.match = e), (this.method = a));
      }
      setCatchHandler(e) {
        this.catchHandler = Z(e);
      }
    },
    et = class e extends J {
      _fallbackToNetwork;
      static defaultPrecacheCacheabilityPlugin = {
        cacheWillUpdate: async ({ response: e }) =>
          !e || e.status >= 400 ? null : e,
      };
      static copyRedirectedCacheableResponsesPlugin = {
        cacheWillUpdate: async ({ response: e }) =>
          e.redirected ? await U(e) : e,
      };
      constructor(t = {}) {
        ((t.cacheName = n.getPrecacheName(t.cacheName)),
          super(t),
          (this._fallbackToNetwork = !1 !== t.fallbackToNetwork),
          this.plugins.push(e.copyRedirectedCacheableResponsesPlugin));
      }
      async _handle(e, t) {
        let a = await t.getPreloadResponse();
        if (a) return a;
        let s = await t.cacheMatch(e);
        return (
          s ||
          (t.event && "install" === t.event.type
            ? await this._handleInstall(e, t)
            : await this._handleFetch(e, t))
        );
      }
      async _handleFetch(e, t) {
        let a,
          s = t.params || {};
        if (this._fallbackToNetwork) {
          let r = s.integrity,
            n = e.integrity,
            i = !n || n === r;
          ((a = await t.fetch(
            new Request(e, {
              integrity: "no-cors" !== e.mode ? n || r : void 0,
            }),
          )),
            r &&
              i &&
              "no-cors" !== e.mode &&
              (this._useDefaultCacheabilityPluginIfNeeded(),
              await t.cachePut(e, a.clone())));
        } else
          throw new i("missing-precache-entry", {
            cacheName: this.cacheName,
            url: e.url,
          });
        return a;
      }
      async _handleInstall(e, t) {
        this._useDefaultCacheabilityPluginIfNeeded();
        let a = await t.fetch(e);
        if (!(await t.cachePut(e, a.clone())))
          throw new i("bad-precaching-response", {
            url: e.url,
            status: a.status,
          });
        return a;
      }
      _useDefaultCacheabilityPluginIfNeeded() {
        let t = null,
          a = 0;
        for (let [s, r] of this.plugins.entries())
          r !== e.copyRedirectedCacheableResponsesPlugin &&
            (r === e.defaultPrecacheCacheabilityPlugin && (t = s),
            r.cacheWillUpdate && a++);
        0 === a
          ? this.plugins.push(e.defaultPrecacheCacheabilityPlugin)
          : a > 1 && null !== t && this.plugins.splice(t, 1);
      }
    },
    ea = class extends ee {
      _allowlist;
      _denylist;
      constructor(e, { allowlist: t = [/./], denylist: a = [] } = {}) {
        (super((e) => this._match(e), e),
          (this._allowlist = t),
          (this._denylist = a));
      }
      _match({ url: e, request: t }) {
        if (t && "navigate" !== t.mode) return !1;
        let a = e.pathname + e.search;
        for (let e of this._denylist) if (e.test(a)) return !1;
        return !!this._allowlist.some((e) => e.test(a));
      }
    },
    es = class extends ee {
      constructor(e, t, a) {
        super(
          ({ url: t }) => {
            let a = e.exec(t.href);
            if (a)
              return t.origin !== location.origin && 0 !== a.index
                ? void 0
                : a.slice(1);
          },
          t,
          a,
        );
      }
    };
  let er = (e) => {
    if (!e) throw new i("add-to-cache-list-unexpected-type", { entry: e });
    if ("string" == typeof e) {
      let t = new URL(e, location.href);
      return { cacheKey: t.href, url: t.href };
    }
    let { revision: t, url: a } = e;
    if (!a) throw new i("add-to-cache-list-unexpected-type", { entry: e });
    if (!t) {
      let e = new URL(a, location.href);
      return { cacheKey: e.href, url: e.href };
    }
    let s = new URL(a, location.href),
      r = new URL(a, location.href);
    return (
      s.searchParams.set("__WB_REVISION__", t),
      { cacheKey: s.href, url: r.href }
    );
  };
  var en = class {
    updatedURLs = [];
    notUpdatedURLs = [];
    handlerWillStart = async ({ request: e, state: t }) => {
      t && (t.originalRequest = e);
    };
    cachedResponseWillBeUsed = async ({
      event: e,
      state: t,
      cachedResponse: a,
    }) => {
      if (
        "install" === e.type &&
        t?.originalRequest &&
        t.originalRequest instanceof Request
      ) {
        let e = t.originalRequest.url;
        a ? this.notUpdatedURLs.push(e) : this.updatedURLs.push(e);
      }
      return a;
    };
  };
  let ei = async (e, t, a) => {
    let s = t.map((e, t) => ({ index: t, item: e })),
      r = async (e) => {
        let t = [];
        for (;;) {
          let r = s.pop();
          if (!r) return e(t);
          let n = await a(r.item);
          t.push({ result: n, index: r.index });
        }
      },
      n = Array.from({ length: e }, () => new Promise(r));
    return (await Promise.all(n))
      .flat()
      .sort((e, t) => (e.index < t.index ? -1 : 1))
      .map((e) => e.result);
  };
  "undefined" != typeof navigator &&
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  let ec = "cache-entries",
    eo = (e) => {
      let t = new URL(e, location.href);
      return ((t.hash = ""), t.href);
    };
  var el = class {
      _cacheName;
      _db = null;
      constructor(e) {
        this._cacheName = e;
      }
      _getId(e) {
        return `${this._cacheName}|${eo(e)}`;
      }
      _upgradeDb(e) {
        let t = e.createObjectStore(ec, { keyPath: "id" });
        (t.createIndex("cacheName", "cacheName", { unique: !1 }),
          t.createIndex("timestamp", "timestamp", { unique: !1 }));
      }
      _upgradeDbAndDeleteOldDbs(e) {
        (this._upgradeDb(e),
          this._cacheName &&
            (function (e, { blocked: t } = {}) {
              let a = indexedDB.deleteDatabase(e);
              (t && a.addEventListener("blocked", (e) => t(e.oldVersion, e)),
                b(a).then(() => void 0));
            })(this._cacheName));
      }
      async setTimestamp(e, t) {
        e = eo(e);
        let a = {
            id: this._getId(e),
            cacheName: this._cacheName,
            url: e,
            timestamp: t,
          },
          s = (await this.getDb()).transaction(ec, "readwrite", {
            durability: "relaxed",
          });
        (await s.store.put(a), await s.done);
      }
      async getTimestamp(e) {
        return (await (await this.getDb()).get(ec, this._getId(e)))?.timestamp;
      }
      async expireEntries(e, t) {
        let a = await (await this.getDb())
            .transaction(ec, "readwrite")
            .store.index("timestamp")
            .openCursor(null, "prev"),
          s = [],
          r = 0;
        for (; a; ) {
          let n = a.value;
          (n.cacheName === this._cacheName &&
            ((e && n.timestamp < e) || (t && r >= t)
              ? (a.delete(), s.push(n.url))
              : r++),
            (a = await a.continue()));
        }
        return s;
      }
      async getDb() {
        return (
          this._db ||
            (this._db = await R("serwist-expiration", 1, {
              upgrade: this._upgradeDbAndDeleteOldDbs.bind(this),
            })),
          this._db
        );
      }
    },
    eh = class {
      _isRunning = !1;
      _rerunRequested = !1;
      _maxEntries;
      _maxAgeSeconds;
      _matchOptions;
      _cacheName;
      _timestampModel;
      constructor(e, t = {}) {
        ((this._maxEntries = t.maxEntries),
          (this._maxAgeSeconds = t.maxAgeSeconds),
          (this._matchOptions = t.matchOptions),
          (this._cacheName = e),
          (this._timestampModel = new el(e)));
      }
      async expireEntries() {
        if (this._isRunning) {
          this._rerunRequested = !0;
          return;
        }
        this._isRunning = !0;
        let e = this._maxAgeSeconds
            ? Date.now() - 1e3 * this._maxAgeSeconds
            : 0,
          t = await this._timestampModel.expireEntries(e, this._maxEntries),
          a = await self.caches.open(this._cacheName);
        for (let e of t) await a.delete(e, this._matchOptions);
        ((this._isRunning = !1),
          this._rerunRequested &&
            ((this._rerunRequested = !1), this.expireEntries()));
      }
      async updateTimestamp(e) {
        await this._timestampModel.setTimestamp(e, Date.now());
      }
      async isURLExpired(e) {
        if (!this._maxAgeSeconds) return !1;
        let t = await this._timestampModel.getTimestamp(e),
          a = Date.now() - 1e3 * this._maxAgeSeconds;
        return void 0 === t || t < a;
      }
      async delete() {
        ((this._rerunRequested = !1),
          await this._timestampModel.expireEntries(1 / 0));
      }
    },
    eu = class {
      _config;
      _cacheExpirations;
      constructor(e = {}) {
        var t;
        ((this._config = e),
          (this._cacheExpirations = new Map()),
          this._config.maxAgeFrom || (this._config.maxAgeFrom = "last-fetched"),
          this._config.purgeOnQuotaError &&
            ((t = () => this.deleteCacheAndMetadata()), o.add(t)));
      }
      _getCacheExpiration(e) {
        if (e === n.getRuntimeName()) throw new i("expire-custom-caches-only");
        let t = this._cacheExpirations.get(e);
        return (
          t ||
            ((t = new eh(e, this._config)), this._cacheExpirations.set(e, t)),
          t
        );
      }
      cachedResponseWillBeUsed({
        event: e,
        cacheName: t,
        request: a,
        cachedResponse: s,
      }) {
        if (!s) return null;
        let r = this._isResponseDateFresh(s),
          n = this._getCacheExpiration(t),
          i = "last-used" === this._config.maxAgeFrom,
          c = (async () => {
            (i && (await n.updateTimestamp(a.url)), await n.expireEntries());
          })();
        try {
          e.waitUntil(c);
        } catch {}
        return r ? s : null;
      }
      _isResponseDateFresh(e) {
        if ("last-used" === this._config.maxAgeFrom) return !0;
        let t = Date.now();
        if (!this._config.maxAgeSeconds) return !0;
        let a = this._getDateHeaderTimestamp(e);
        return null === a || a >= t - 1e3 * this._config.maxAgeSeconds;
      }
      _getDateHeaderTimestamp(e) {
        if (!e.headers.has("date")) return null;
        let t = new Date(e.headers.get("date")).getTime();
        return Number.isNaN(t) ? null : t;
      }
      async cacheDidUpdate({ cacheName: e, request: t }) {
        let a = this._getCacheExpiration(e);
        (await a.updateTimestamp(t.url), await a.expireEntries());
      }
      async deleteCacheAndMetadata() {
        for (let [e, t] of this._cacheExpirations)
          (await self.caches.delete(e), await t.delete());
        this._cacheExpirations = new Map();
      }
    };
  let ed = /^\/(\w+\/)?collect/,
    em = ({ serwist: e, cacheName: t, ...a }) => {
      let s = n.getGoogleAnalyticsName(t),
        r = new G("serwist-google-analytics", {
          maxRetentionTime: 2880,
          onSync: (
            (e) =>
            async ({ queue: t }) => {
              let a;
              for (; (a = await t.shiftRequest()); ) {
                let { request: s, timestamp: r } = a,
                  n = new URL(s.url);
                try {
                  let t =
                      "POST" === s.method
                        ? new URLSearchParams(await s.clone().text())
                        : n.searchParams,
                    a = r - (Number(t.get("qt")) || 0),
                    i = Date.now() - a;
                  if ((t.set("qt", String(i)), e.parameterOverrides))
                    for (let a of Object.keys(e.parameterOverrides)) {
                      let s = e.parameterOverrides[a];
                      t.set(a, s);
                    }
                  ("function" == typeof e.hitFilter &&
                    e.hitFilter.call(null, t),
                    await fetch(
                      new Request(n.origin + n.pathname, {
                        body: t.toString(),
                        method: "POST",
                        mode: "cors",
                        credentials: "omit",
                        headers: { "Content-Type": "text/plain" },
                      }),
                    ));
                } catch (e) {
                  throw (await t.unshiftRequest(a), e);
                }
              }
            }
          )(a),
        });
      for (let t of [
        new ee(
          ({ url: e }) =>
            "www.googletagmanager.com" === e.hostname &&
            "/gtm.js" === e.pathname,
          new X({ cacheName: s }),
          "GET",
        ),
        new ee(
          ({ url: e }) =>
            "www.google-analytics.com" === e.hostname &&
            "/analytics.js" === e.pathname,
          new X({ cacheName: s }),
          "GET",
        ),
        new ee(
          ({ url: e }) =>
            "www.googletagmanager.com" === e.hostname &&
            "/gtag/js" === e.pathname,
          new X({ cacheName: s }),
          "GET",
        ),
        ...((e) => {
          let t = ({ url: e }) =>
              "www.google-analytics.com" === e.hostname && ed.test(e.pathname),
            a = new Y({ plugins: [e] });
          return [new ee(t, a, "GET"), new ee(t, a, "POST")];
        })(r),
      ])
        e.registerRoute(t);
    };
  var eg = class {
    _fallbackUrls;
    _serwist;
    constructor({ fallbackUrls: e, serwist: t }) {
      ((this._fallbackUrls = e), (this._serwist = t));
    }
    async handlerDidError(e) {
      for (let t of this._fallbackUrls)
        if ("string" == typeof t) {
          let e = await this._serwist.matchPrecache(t);
          if (void 0 !== e) return e;
        } else if (t.matcher(e)) {
          let e = await this._serwist.matchPrecache(t.url);
          if (void 0 !== e) return e;
        }
    }
  };
  let ef = async (e, t) => {
    try {
      if (206 === t.status) return t;
      let a = e.headers.get("range");
      if (!a) throw new i("no-range-header");
      let s = ((e) => {
          let t = e.trim().toLowerCase();
          if (!t.startsWith("bytes="))
            throw new i("unit-must-be-bytes", { normalizedRangeHeader: t });
          if (t.includes(","))
            throw new i("single-range-only", { normalizedRangeHeader: t });
          let a = /(\d*)-(\d*)/.exec(t);
          if (!a || !(a[1] || a[2]))
            throw new i("invalid-range-values", { normalizedRangeHeader: t });
          return {
            start: "" === a[1] ? void 0 : Number(a[1]),
            end: "" === a[2] ? void 0 : Number(a[2]),
          };
        })(a),
        r = await t.blob(),
        n = ((e, t, a) => {
          let s,
            r,
            n = e.size;
          if ((a && a > n) || (t && t < 0))
            throw new i("range-not-satisfiable", { size: n, end: a, start: t });
          return (
            void 0 !== t && void 0 !== a
              ? ((s = t), (r = a + 1))
              : void 0 !== t && void 0 === a
                ? ((s = t), (r = n))
                : void 0 !== a && void 0 === t && ((s = n - a), (r = n)),
            { start: s, end: r }
          );
        })(r, s.start, s.end),
        c = r.slice(n.start, n.end),
        o = c.size,
        l = new Response(c, {
          status: 206,
          statusText: "Partial Content",
          headers: t.headers,
        });
      return (
        l.headers.set("Content-Length", String(o)),
        l.headers.set(
          "Content-Range",
          `bytes ${n.start}-${n.end - 1}/${r.size}`,
        ),
        l
      );
    } catch (e) {
      return new Response("", {
        status: 416,
        statusText: "Range Not Satisfiable",
      });
    }
  };
  var ew = class {
      cachedResponseWillBeUsed = async ({ request: e, cachedResponse: t }) =>
        t && e.headers.has("range") ? await ef(e, t) : t;
    },
    ep = class extends J {
      async _handle(e, t) {
        let a,
          s = await t.cacheMatch(e);
        if (s);
        else
          try {
            s = await t.fetchAndCachePut(e);
          } catch (e) {
            e instanceof Error && (a = e);
          }
        if (!s) throw new i("no-response", { url: e.url, error: a });
        return s;
      }
    },
    ey = class extends J {
      constructor(e = {}) {
        (super(e),
          this.plugins.some((e) => "cacheWillUpdate" in e) ||
            this.plugins.unshift(Q));
      }
      async _handle(e, t) {
        let a,
          s = t.fetchAndCachePut(e).catch(() => {});
        t.waitUntil(s);
        let r = await t.cacheMatch(e);
        if (r);
        else
          try {
            r = await s;
          } catch (e) {
            e instanceof Error && (a = e);
          }
        if (!r) throw new i("no-response", { url: e.url, error: a });
        return r;
      }
    },
    e_ = class extends ee {
      constructor(e, t) {
        super(({ request: a }) => {
          let s = e.getUrlsToPrecacheKeys();
          for (let r of (function* (
            e,
            {
              directoryIndex: t = "index.html",
              ignoreURLParametersMatching: a = [/^utm_/, /^fbclid$/],
              cleanURLs: s = !0,
              urlManipulation: r,
            } = {},
          ) {
            let n = new URL(e, location.href);
            ((n.hash = ""), yield n.href);
            let i = ((e, t = []) => {
              for (let a of [...e.searchParams.keys()])
                t.some((e) => e.test(a)) && e.searchParams.delete(a);
              return e;
            })(n, a);
            if ((yield i.href, t && i.pathname.endsWith("/"))) {
              let e = new URL(i.href);
              ((e.pathname += t), yield e.href);
            }
            if (s) {
              let e = new URL(i.href);
              ((e.pathname += ".html"), yield e.href);
            }
            if (r) for (let e of r({ url: n })) yield e.href;
          })(a.url, t)) {
            let t = s.get(r);
            if (t)
              return {
                cacheKey: t,
                integrity: e.getIntegrityForPrecacheKey(t),
              };
          }
        }, e.precacheStrategy);
      }
    },
    ex = class {
      _precacheController;
      constructor({ precacheController: e }) {
        this._precacheController = e;
      }
      cacheKeyWillBeUsed = async ({ request: e, params: t }) => {
        let a =
          t?.cacheKey || this._precacheController.getPrecacheKeyForUrl(e.url);
        return a ? new Request(a, { headers: e.headers }) : e;
      };
    },
    eb = class {
      _urlsToCacheKeys = new Map();
      _urlsToCacheModes = new Map();
      _cacheKeysToIntegrities = new Map();
      _concurrentPrecaching;
      _precacheStrategy;
      _routes;
      _defaultHandlerMap;
      _catchHandler;
      _requestRules;
      constructor({
        precacheEntries: e,
        precacheOptions: t,
        skipWaiting: a = !1,
        importScripts: s,
        navigationPreload: r = !1,
        cacheId: i,
        clientsClaim: c = !1,
        runtimeCaching: o,
        offlineAnalyticsConfig: l,
        disableDevLogs: h = !1,
        fallbacks: u,
        requestRules: d,
      } = {}) {
        var m, f;
        let {
          precacheStrategyOptions: w,
          precacheRouteOptions: p,
          precacheMiscOptions: y,
        } = ((e, t = {}) => {
          let {
            cacheName: a,
            plugins: s = [],
            fetchOptions: r,
            matchOptions: i,
            fallbackToNetwork: c,
            directoryIndex: o,
            ignoreURLParametersMatching: l,
            cleanURLs: h,
            urlManipulation: u,
            cleanupOutdatedCaches: d,
            concurrency: m = 10,
            navigateFallback: g,
            navigateFallbackAllowlist: f,
            navigateFallbackDenylist: w,
          } = t ?? {};
          return {
            precacheStrategyOptions: {
              cacheName: n.getPrecacheName(a),
              plugins: [...s, new ex({ precacheController: e })],
              fetchOptions: r,
              matchOptions: i,
              fallbackToNetwork: c,
            },
            precacheRouteOptions: {
              directoryIndex: o,
              ignoreURLParametersMatching: l,
              cleanURLs: h,
              urlManipulation: u,
            },
            precacheMiscOptions: {
              cleanupOutdatedCaches: d,
              concurrency: m,
              navigateFallback: g,
              navigateFallbackAllowlist: f,
              navigateFallbackDenylist: w,
            },
          };
        })(this, t);
        if (
          ((this._concurrentPrecaching = y.concurrency),
          (this._precacheStrategy = new et(w)),
          (this._routes = new Map()),
          (this._defaultHandlerMap = new Map()),
          (this._requestRules = d),
          (this.handleInstall = this.handleInstall.bind(this)),
          (this.handleActivate = this.handleActivate.bind(this)),
          (this.handleFetch = this.handleFetch.bind(this)),
          (this.handleCache = this.handleCache.bind(this)),
          s && s.length > 0 && self.importScripts(...s),
          r &&
            self.registration?.navigationPreload &&
            self.addEventListener("activate", (e) => {
              e.waitUntil(
                self.registration.navigationPreload.enable().then(() => {}),
              );
            }),
          void 0 !== i && ((m = { prefix: i }), n.updateDetails(m)),
          a
            ? self.skipWaiting()
            : self.addEventListener("message", (e) => {
                e.data && "SKIP_WAITING" === e.data.type && self.skipWaiting();
              }),
          c && self.addEventListener("activate", () => self.clients.claim()),
          e && e.length > 0 && this.addToPrecacheList(e),
          y.cleanupOutdatedCaches &&
            ((f = w.cacheName),
            self.addEventListener("activate", (e) => {
              e.waitUntil(g(n.getPrecacheName(f)).then((e) => {}));
            })),
          this.registerRoute(new e_(this, p)),
          y.navigateFallback &&
            this.registerRoute(
              new ea(this.createHandlerBoundToUrl(y.navigateFallback), {
                allowlist: y.navigateFallbackAllowlist,
                denylist: y.navigateFallbackDenylist,
              }),
            ),
          void 0 !== l &&
            ("boolean" == typeof l
              ? l && em({ serwist: this })
              : em({ ...l, serwist: this })),
          void 0 !== o)
        ) {
          if (void 0 !== u) {
            let e = new eg({ fallbackUrls: u.entries, serwist: this });
            o.forEach((t) => {
              t.handler instanceof J &&
                !t.handler.plugins.some((e) => "handlerDidError" in e) &&
                t.handler.plugins.push(e);
            });
          }
          for (let e of o) this.registerCapture(e.matcher, e.handler, e.method);
        }
        h && (self.__WB_DISABLE_DEV_LOGS = !0);
      }
      get precacheStrategy() {
        return this._precacheStrategy;
      }
      get routes() {
        return this._routes;
      }
      addEventListeners() {
        (self.addEventListener("install", this.handleInstall),
          self.addEventListener("activate", this.handleActivate),
          self.addEventListener("fetch", this.handleFetch),
          self.addEventListener("message", this.handleCache));
      }
      addToPrecacheList(e) {
        let t = [];
        for (let a of e) {
          "string" == typeof a
            ? t.push(a)
            : a && !a.integrity && void 0 === a.revision && t.push(a.url);
          let { cacheKey: e, url: s } = er(a),
            r = "string" != typeof a && a.revision ? "reload" : "default";
          if (
            this._urlsToCacheKeys.has(s) &&
            this._urlsToCacheKeys.get(s) !== e
          )
            throw new i("add-to-cache-list-conflicting-entries", {
              firstEntry: this._urlsToCacheKeys.get(s),
              secondEntry: e,
            });
          if ("string" != typeof a && a.integrity) {
            if (
              this._cacheKeysToIntegrities.has(e) &&
              this._cacheKeysToIntegrities.get(e) !== a.integrity
            )
              throw new i("add-to-cache-list-conflicting-integrities", {
                url: s,
              });
            this._cacheKeysToIntegrities.set(e, a.integrity);
          }
          (this._urlsToCacheKeys.set(s, e), this._urlsToCacheModes.set(s, r));
        }
        t.length > 0 &&
          console.warn(`Serwist is precaching URLs without revision info: ${t.join(", ")}
This is generally NOT safe. Learn more at https://bit.ly/wb-precache`);
      }
      handleInstall(e) {
        return (
          this.registerRequestRules(e),
          f(e, async () => {
            let t = new en();
            (this.precacheStrategy.plugins.push(t),
              await ei(
                this._concurrentPrecaching,
                Array.from(this._urlsToCacheKeys.entries()),
                async ([t, a]) => {
                  let s = this._cacheKeysToIntegrities.get(a),
                    r = this._urlsToCacheModes.get(t),
                    n = new Request(t, {
                      integrity: s,
                      cache: r,
                      credentials: "same-origin",
                    });
                  await Promise.all(
                    this.precacheStrategy.handleAll({
                      event: e,
                      request: n,
                      url: new URL(n.url),
                      params: { cacheKey: a },
                    }),
                  );
                },
              ));
            let { updatedURLs: a, notUpdatedURLs: s } = t;
            return { updatedURLs: a, notUpdatedURLs: s };
          })
        );
      }
      async registerRequestRules(e) {
        if (this._requestRules && e?.addRoutes)
          try {
            (await e.addRoutes(this._requestRules),
              (this._requestRules = void 0));
          } catch (e) {
            throw e;
          }
      }
      handleActivate(e) {
        return f(e, async () => {
          let e = await self.caches.open(this.precacheStrategy.cacheName),
            t = await e.keys(),
            a = new Set(this._urlsToCacheKeys.values()),
            s = [];
          for (let r of t) a.has(r.url) || (await e.delete(r), s.push(r.url));
          return { deletedCacheRequests: s };
        });
      }
      handleFetch(e) {
        let { request: t } = e,
          a = this.handleRequest({ request: t, event: e });
        a && e.respondWith(a);
      }
      handleCache(e) {
        if (e.data && "CACHE_URLS" === e.data.type) {
          let { payload: t } = e.data,
            a = Promise.all(
              t.urlsToCache.map((t) => {
                let a;
                return (
                  (a =
                    "string" == typeof t ? new Request(t) : new Request(...t)),
                  this.handleRequest({ request: a, event: e })
                );
              }),
            );
          (e.waitUntil(a),
            e.ports?.[0] && a.then(() => e.ports[0].postMessage(!0)));
        }
      }
      setDefaultHandler(e, t = "GET") {
        this._defaultHandlerMap.set(t, Z(e));
      }
      setCatchHandler(e) {
        this._catchHandler = Z(e);
      }
      registerCapture(e, t, a) {
        let s = ((e, t, a) => {
          if ("string" == typeof e) {
            let s = new URL(e, location.href);
            return new ee(({ url: e }) => e.href === s.href, t, a);
          }
          if (e instanceof RegExp) return new es(e, t, a);
          if ("function" == typeof e) return new ee(e, t, a);
          if (e instanceof ee) return e;
          throw new i("unsupported-route-type", {
            moduleName: "serwist",
            funcName: "parseRoute",
            paramName: "capture",
          });
        })(e, t, a);
        return (this.registerRoute(s), s);
      }
      registerRoute(e) {
        (this._routes.has(e.method) || this._routes.set(e.method, []),
          this._routes.get(e.method).push(e));
      }
      unregisterRoute(e) {
        if (!this._routes.has(e.method))
          throw new i("unregister-route-but-not-found-with-method", {
            method: e.method,
          });
        let t = this._routes.get(e.method).indexOf(e);
        if (t > -1) this._routes.get(e.method).splice(t, 1);
        else throw new i("unregister-route-route-not-registered");
      }
      getUrlsToPrecacheKeys() {
        return this._urlsToCacheKeys;
      }
      getPrecachedUrls() {
        return [...this._urlsToCacheKeys.keys()];
      }
      getPrecacheKeyForUrl(e) {
        let t = new URL(e, location.href);
        return this._urlsToCacheKeys.get(t.href);
      }
      getIntegrityForPrecacheKey(e) {
        return this._cacheKeysToIntegrities.get(e);
      }
      async matchPrecache(e) {
        let t = e instanceof Request ? e.url : e,
          a = this.getPrecacheKeyForUrl(t);
        if (a)
          return (
            await self.caches.open(this.precacheStrategy.cacheName)
          ).match(a);
      }
      createHandlerBoundToUrl(e) {
        let t = this.getPrecacheKeyForUrl(e);
        if (!t) throw new i("non-precached-url", { url: e });
        return (a) => (
          (a.request = new Request(e)),
          (a.params = { cacheKey: t, ...a.params }),
          this.precacheStrategy.handle(a)
        );
      }
      handleRequest({ request: e, event: t }) {
        let a,
          s = new URL(e.url, location.href);
        if (!s.protocol.startsWith("http")) return;
        let r = s.origin === location.origin,
          { params: n, route: i } = this.findMatchingRoute({
            event: t,
            request: e,
            sameOrigin: r,
            url: s,
          }),
          c = i?.handler,
          o = e.method;
        if (
          (!c &&
            this._defaultHandlerMap.has(o) &&
            (c = this._defaultHandlerMap.get(o)),
          !c)
        )
          return;
        try {
          a = c.handle({ url: s, request: e, event: t, params: n });
        } catch (e) {
          a = Promise.reject(e);
        }
        let l = i?.catchHandler;
        return (
          a instanceof Promise &&
            (this._catchHandler || l) &&
            (a = a.catch(async (a) => {
              if (l)
                try {
                  return await l.handle({
                    url: s,
                    request: e,
                    event: t,
                    params: n,
                  });
                } catch (e) {
                  e instanceof Error && (a = e);
                }
              if (this._catchHandler)
                return this._catchHandler.handle({
                  url: s,
                  request: e,
                  event: t,
                });
              throw a;
            })),
          a
        );
      }
      findMatchingRoute({ url: e, sameOrigin: t, request: a, event: s }) {
        for (let r of this._routes.get(a.method) || []) {
          let n,
            i = r.match({ url: e, sameOrigin: t, request: a, event: s });
          if (i)
            return (
              (Array.isArray((n = i)) && 0 === n.length) ||
              (i.constructor === Object && 0 === Object.keys(i).length)
                ? (n = void 0)
                : "boolean" == typeof i && (n = void 0),
              { route: r, params: n }
            );
        }
        return {};
      }
    };
  let ev = {
      rscPrefetch: "pages-rsc-prefetch",
      rsc: "pages-rsc",
      html: "pages",
    },
    eR = [
      {
        matcher: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
        handler: new ep({
          cacheName: "google-fonts-webfonts",
          plugins: [
            new eu({
              maxEntries: 4,
              maxAgeSeconds: 31536e3,
              maxAgeFrom: "last-used",
            }),
          ],
        }),
      },
      {
        matcher: /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
        handler: new ey({
          cacheName: "google-fonts-stylesheets",
          plugins: [
            new eu({
              maxEntries: 4,
              maxAgeSeconds: 604800,
              maxAgeFrom: "last-used",
            }),
          ],
        }),
      },
      {
        matcher: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
        handler: new ey({
          cacheName: "static-font-assets",
          plugins: [
            new eu({
              maxEntries: 4,
              maxAgeSeconds: 604800,
              maxAgeFrom: "last-used",
            }),
          ],
        }),
      },
      {
        matcher: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
        handler: new ey({
          cacheName: "static-image-assets",
          plugins: [
            new eu({
              maxEntries: 64,
              maxAgeSeconds: 2592e3,
              maxAgeFrom: "last-used",
            }),
          ],
        }),
      },
      {
        matcher: /\/_next\/static.+\.js$/i,
        handler: new ep({
          cacheName: "next-static-js-assets",
          plugins: [
            new eu({
              maxEntries: 64,
              maxAgeSeconds: 86400,
              maxAgeFrom: "last-used",
            }),
          ],
        }),
      },
      {
        matcher: /\/_next\/image\?url=.+$/i,
        handler: new ey({
          cacheName: "next-image",
          plugins: [
            new eu({
              maxEntries: 64,
              maxAgeSeconds: 86400,
              maxAgeFrom: "last-used",
            }),
          ],
        }),
      },
      {
        matcher: /\.(?:mp3|wav|ogg)$/i,
        handler: new ep({
          cacheName: "static-audio-assets",
          plugins: [
            new eu({
              maxEntries: 32,
              maxAgeSeconds: 86400,
              maxAgeFrom: "last-used",
            }),
            new ew(),
          ],
        }),
      },
      {
        matcher: /\.(?:mp4|webm)$/i,
        handler: new ep({
          cacheName: "static-video-assets",
          plugins: [
            new eu({
              maxEntries: 32,
              maxAgeSeconds: 86400,
              maxAgeFrom: "last-used",
            }),
            new ew(),
          ],
        }),
      },
      {
        matcher: /\.(?:js)$/i,
        handler: new ey({
          cacheName: "static-js-assets",
          plugins: [
            new eu({
              maxEntries: 48,
              maxAgeSeconds: 86400,
              maxAgeFrom: "last-used",
            }),
          ],
        }),
      },
      {
        matcher: /\.(?:css|less)$/i,
        handler: new ey({
          cacheName: "static-style-assets",
          plugins: [
            new eu({
              maxEntries: 32,
              maxAgeSeconds: 86400,
              maxAgeFrom: "last-used",
            }),
          ],
        }),
      },
      {
        matcher: /\/_next\/data\/.+\/.+\.json$/i,
        handler: new X({
          cacheName: "next-data",
          plugins: [
            new eu({
              maxEntries: 32,
              maxAgeSeconds: 86400,
              maxAgeFrom: "last-used",
            }),
          ],
        }),
      },
      {
        matcher: /\.(?:json|xml|csv)$/i,
        handler: new X({
          cacheName: "static-data-assets",
          plugins: [
            new eu({
              maxEntries: 32,
              maxAgeSeconds: 86400,
              maxAgeFrom: "last-used",
            }),
          ],
        }),
      },
      {
        matcher: /\/api\/auth\/.*/,
        handler: new Y({ networkTimeoutSeconds: 10 }),
      },
      {
        matcher: ({ sameOrigin: e, url: { pathname: t } }) =>
          e && t.startsWith("/api/"),
        method: "GET",
        handler: new X({
          cacheName: "apis",
          plugins: [
            new eu({
              maxEntries: 16,
              maxAgeSeconds: 86400,
              maxAgeFrom: "last-used",
            }),
          ],
          networkTimeoutSeconds: 10,
        }),
      },
      {
        matcher: ({ request: e, url: { pathname: t }, sameOrigin: a }) =>
          "1" === e.headers.get("RSC") &&
          "1" === e.headers.get("Next-Router-Prefetch") &&
          a &&
          !t.startsWith("/api/"),
        handler: new X({
          cacheName: ev.rscPrefetch,
          plugins: [new eu({ maxEntries: 32, maxAgeSeconds: 86400 })],
        }),
      },
      {
        matcher: ({ request: e, url: { pathname: t }, sameOrigin: a }) =>
          "1" === e.headers.get("RSC") && a && !t.startsWith("/api/"),
        handler: new X({
          cacheName: ev.rsc,
          plugins: [new eu({ maxEntries: 32, maxAgeSeconds: 86400 })],
        }),
      },
      {
        matcher: ({ request: e, url: { pathname: t }, sameOrigin: a }) =>
          e.headers.get("Content-Type")?.includes("text/html") &&
          a &&
          !t.startsWith("/api/"),
        handler: new X({
          cacheName: ev.html,
          plugins: [new eu({ maxEntries: 32, maxAgeSeconds: 86400 })],
        }),
      },
      {
        matcher: ({ url: { pathname: e }, sameOrigin: t }) =>
          t && !e.startsWith("/api/"),
        handler: new X({
          cacheName: "others",
          plugins: [new eu({ maxEntries: 32, maxAgeSeconds: 86400 })],
        }),
      },
      {
        matcher: ({ sameOrigin: e }) => !e,
        handler: new X({
          cacheName: "cross-origin",
          plugins: [new eu({ maxEntries: 32, maxAgeSeconds: 3600 })],
          networkTimeoutSeconds: 10,
        }),
      },
      { matcher: /.*/i, method: "GET", handler: new Y() },
    ];
  new eb({
    precacheEntries: [
      { revision: "3e5df346fd8c0867bac65e8a215771dd", url: "/Roboto\\OFL.txt" },
      {
        revision: "7a80b1a8138dd117b450fc6fe8179cd6",
        url: "/Roboto\\README.txt",
      },
      {
        revision: "43fb825d0d4ccba74fab0cb44d86c2db",
        url: "/Roboto\\Roboto-Italic-VariableFont_wdth,wght.ttf",
      },
      {
        revision: "d02795fd319584c202657937630846c6",
        url: "/Roboto\\Roboto-VariableFont_wdth,wght.ttf",
      },
      {
        revision: "39d75021a9ebff6db81f340516f8c9ff",
        url: "/Roboto\\static\\Roboto-Black.ttf",
      },
      {
        revision: "dc9df14caf191cd4c86a6c635c663b28",
        url: "/Roboto\\static\\Roboto-BlackItalic.ttf",
      },
      {
        revision: "2dd437af13b14eb2f3b5de2e79523e65",
        url: "/Roboto\\static\\Roboto-Bold.ttf",
      },
      {
        revision: "91d8f5ecd6513a291df005de7f165109",
        url: "/Roboto\\static\\Roboto-BoldItalic.ttf",
      },
      {
        revision: "188393ba08e4f99b1a277babfde5a333",
        url: "/Roboto\\static\\Roboto-ExtraBold.ttf",
      },
      {
        revision: "297fe031a5d54808a19c75bd6db61918",
        url: "/Roboto\\static\\Roboto-ExtraBoldItalic.ttf",
      },
      {
        revision: "cbc0b9732c73a12a7c9d8597c517763e",
        url: "/Roboto\\static\\Roboto-ExtraLight.ttf",
      },
      {
        revision: "9c167605f1c452245e849d116b272088",
        url: "/Roboto\\static\\Roboto-ExtraLightItalic.ttf",
      },
      {
        revision: "f1364eda6a9b2589f69fcc6a890c6447",
        url: "/Roboto\\static\\Roboto-Italic.ttf",
      },
      {
        revision: "12c992e825981ac45c64f58dc24d6f82",
        url: "/Roboto\\static\\Roboto-Light.ttf",
      },
      {
        revision: "f7b49d44089d3089b0a1b9390bb701c9",
        url: "/Roboto\\static\\Roboto-LightItalic.ttf",
      },
      {
        revision: "21030564b3bbea7711315b1670eca626",
        url: "/Roboto\\static\\Roboto-Medium.ttf",
      },
      {
        revision: "42049a5d115ca814a49affb6d72eb69f",
        url: "/Roboto\\static\\Roboto-MediumItalic.ttf",
      },
      {
        revision: "678ba85b47044ac65031832c80bdfe4a",
        url: "/Roboto\\static\\Roboto-Regular.ttf",
      },
      {
        revision: "6f0903b5854df8a1210605cab77364eb",
        url: "/Roboto\\static\\Roboto-SemiBold.ttf",
      },
      {
        revision: "7842d336163077dfe2eeccd82805ae02",
        url: "/Roboto\\static\\Roboto-SemiBoldItalic.ttf",
      },
      {
        revision: "74d284590703cedbb7b17cf11f91004f",
        url: "/Roboto\\static\\Roboto-Thin.ttf",
      },
      {
        revision: "239fe757621a9e0e5adf7a4b32fa6a9f",
        url: "/Roboto\\static\\Roboto-ThinItalic.ttf",
      },
      {
        revision: "5c2cf0f096857689e6913646c243dfe1",
        url: "/Roboto\\static\\Roboto_Condensed-Black.ttf",
      },
      {
        revision: "e112a68b39a46696c5b335f8430082e2",
        url: "/Roboto\\static\\Roboto_Condensed-BlackItalic.ttf",
      },
      {
        revision: "ae3713c3fddc1e50f79973efa30d05a5",
        url: "/Roboto\\static\\Roboto_Condensed-Bold.ttf",
      },
      {
        revision: "a9a3c21062c2e4aa940946c0c81ca6bf",
        url: "/Roboto\\static\\Roboto_Condensed-BoldItalic.ttf",
      },
      {
        revision: "c44e8fce0c4d9ea467428986b932fbc0",
        url: "/Roboto\\static\\Roboto_Condensed-ExtraBold.ttf",
      },
      {
        revision: "5c90098ed8523bc398a3d5504cc07859",
        url: "/Roboto\\static\\Roboto_Condensed-ExtraBoldItalic.ttf",
      },
      {
        revision: "b540dbb8feb4b3d8ef89170bb375d665",
        url: "/Roboto\\static\\Roboto_Condensed-ExtraLight.ttf",
      },
      {
        revision: "aa11227e5f9791adc4b78c7cceccd232",
        url: "/Roboto\\static\\Roboto_Condensed-ExtraLightItalic.ttf",
      },
      {
        revision: "0dc4c17359e3f43cc0b0849224365746",
        url: "/Roboto\\static\\Roboto_Condensed-Italic.ttf",
      },
      {
        revision: "d8fab5d28ea7eb5748d31d8293289c6e",
        url: "/Roboto\\static\\Roboto_Condensed-Light.ttf",
      },
      {
        revision: "75f4c47e7333fbb6769f7825e410d65a",
        url: "/Roboto\\static\\Roboto_Condensed-LightItalic.ttf",
      },
      {
        revision: "a2b32e080b3e0fd3fc24d348174f4019",
        url: "/Roboto\\static\\Roboto_Condensed-Medium.ttf",
      },
      {
        revision: "7ce79b2ba1790aaa4d2b9cf0266b6b8a",
        url: "/Roboto\\static\\Roboto_Condensed-MediumItalic.ttf",
      },
      {
        revision: "dfc1ae64a82e449d6b9ccfe324e72cee",
        url: "/Roboto\\static\\Roboto_Condensed-Regular.ttf",
      },
      {
        revision: "9fe26f0deb1094353838236db1cdf4ea",
        url: "/Roboto\\static\\Roboto_Condensed-SemiBold.ttf",
      },
      {
        revision: "e98af24b17b9b089c53cf495b6773aa7",
        url: "/Roboto\\static\\Roboto_Condensed-SemiBoldItalic.ttf",
      },
      {
        revision: "f3be16240ac2d4268c521ab0bfc1db55",
        url: "/Roboto\\static\\Roboto_Condensed-Thin.ttf",
      },
      {
        revision: "cbe7bb3d52d75fd8aeb9dfb953b2f759",
        url: "/Roboto\\static\\Roboto_Condensed-ThinItalic.ttf",
      },
      {
        revision: "5136f254af8a73d67bd8490d81c57e60",
        url: "/Roboto\\static\\Roboto_SemiCondensed-Black.ttf",
      },
      {
        revision: "a26df91cfe798c43f622f60f7f6bd9f6",
        url: "/Roboto\\static\\Roboto_SemiCondensed-BlackItalic.ttf",
      },
      {
        revision: "77edf55cac2bb20688b9962f041f65c2",
        url: "/Roboto\\static\\Roboto_SemiCondensed-Bold.ttf",
      },
      {
        revision: "7001acda5791714e1b0f75beea3aa3f5",
        url: "/Roboto\\static\\Roboto_SemiCondensed-BoldItalic.ttf",
      },
      {
        revision: "5ed471e8ba9e856a6b0ab7afe411a0e1",
        url: "/Roboto\\static\\Roboto_SemiCondensed-ExtraBold.ttf",
      },
      {
        revision: "f1e759ea3a288b283ff5af72f45bb28a",
        url: "/Roboto\\static\\Roboto_SemiCondensed-ExtraBoldItalic.ttf",
      },
      {
        revision: "7806f55c23667c76f913488e4625eff7",
        url: "/Roboto\\static\\Roboto_SemiCondensed-ExtraLight.ttf",
      },
      {
        revision: "8135c4e457b64da9ff85ae7a1523bba9",
        url: "/Roboto\\static\\Roboto_SemiCondensed-ExtraLightItalic.ttf",
      },
      {
        revision: "44d70f89ff5b884f427e4959813cdbe4",
        url: "/Roboto\\static\\Roboto_SemiCondensed-Italic.ttf",
      },
      {
        revision: "c82fce399ecf39008c3d3c6a4b560ebc",
        url: "/Roboto\\static\\Roboto_SemiCondensed-Light.ttf",
      },
      {
        revision: "1c53f99ca5d78be7cbaadfbfa30ae694",
        url: "/Roboto\\static\\Roboto_SemiCondensed-LightItalic.ttf",
      },
      {
        revision: "09b581f8ac353ab1ba03c39c4c2ce810",
        url: "/Roboto\\static\\Roboto_SemiCondensed-Medium.ttf",
      },
      {
        revision: "e7758f6b24ebd21dad20167b9c14888e",
        url: "/Roboto\\static\\Roboto_SemiCondensed-MediumItalic.ttf",
      },
      {
        revision: "0c9467735322289c1a1ab447ec8aab5a",
        url: "/Roboto\\static\\Roboto_SemiCondensed-Regular.ttf",
      },
      {
        revision: "fbd5d7077a814807328d91f37ddaab5a",
        url: "/Roboto\\static\\Roboto_SemiCondensed-SemiBold.ttf",
      },
      {
        revision: "8b9c43a5e665b7607b7e165f3311007b",
        url: "/Roboto\\static\\Roboto_SemiCondensed-SemiBoldItalic.ttf",
      },
      {
        revision: "6ff7030a868fc1a4b4d529c2d1ec6e9f",
        url: "/Roboto\\static\\Roboto_SemiCondensed-Thin.ttf",
      },
      {
        revision: "4026bd4454c821d3324c968595df04f6",
        url: "/Roboto\\static\\Roboto_SemiCondensed-ThinItalic.ttf",
      },
      { revision: null, url: "/_next/static/chunks/1065-9732abbf0eb58f20.js" },
      { revision: null, url: "/_next/static/chunks/1166-8a31ebc696ab8f3b.js" },
      { revision: null, url: "/_next/static/chunks/12.06a7f14bd6716249.js" },
      { revision: null, url: "/_next/static/chunks/1340-8cc123995b3419b3.js" },
      { revision: null, url: "/_next/static/chunks/1432-6f9fd35e781a786e.js" },
      { revision: null, url: "/_next/static/chunks/1586-cebcc097c307606d.js" },
      { revision: null, url: "/_next/static/chunks/159-586dcfa7348f8dda.js" },
      { revision: null, url: "/_next/static/chunks/1597-c04459820a0cfee9.js" },
      { revision: null, url: "/_next/static/chunks/1680-91a3989d0bc59eb4.js" },
      {
        revision: null,
        url: "/_next/static/chunks/1f05e44c-30bf46ced532fc36.js",
      },
      { revision: null, url: "/_next/static/chunks/2115-402804c7b92bf3d1.js" },
      { revision: null, url: "/_next/static/chunks/2132-27e6bb419841a4c7.js" },
      { revision: null, url: "/_next/static/chunks/252-3a27a8dcb1ae636f.js" },
      { revision: null, url: "/_next/static/chunks/3008.561e79dd817af508.js" },
      { revision: null, url: "/_next/static/chunks/3030-297c1320dfcd9f50.js" },
      { revision: null, url: "/_next/static/chunks/3238-d1e44c7a66fab911.js" },
      {
        revision: null,
        url: "/_next/static/chunks/3f8f5523-c19d064f002c77ea.js",
      },
      { revision: null, url: "/_next/static/chunks/4042-5c7801924197e142.js" },
      { revision: null, url: "/_next/static/chunks/4211-596a8846d71410cf.js" },
      { revision: null, url: "/_next/static/chunks/4320-ca3de809453129eb.js" },
      { revision: null, url: "/_next/static/chunks/4342-d8ec046d57d7a940.js" },
      {
        revision: null,
        url: "/_next/static/chunks/434f2b4d.5c9bc049514bb2af.js",
      },
      { revision: null, url: "/_next/static/chunks/4682-8b5db9983bae1956.js" },
      { revision: null, url: "/_next/static/chunks/4719-e81b1607c2a8f81a.js" },
      { revision: null, url: "/_next/static/chunks/4770-8254e2f353bc5555.js" },
      { revision: null, url: "/_next/static/chunks/4827-5139e3b5457b2cf3.js" },
      { revision: null, url: "/_next/static/chunks/4899.7f7689bc509b0a34.js" },
      { revision: null, url: "/_next/static/chunks/4961-1f345e3edfa957bf.js" },
      {
        revision: null,
        url: "/_next/static/chunks/54aecf4a-343eaf8cb69e963b.js",
      },
      { revision: null, url: "/_next/static/chunks/564-3efec488d798df10.js" },
      { revision: null, url: "/_next/static/chunks/5710-5069550f25f9dafa.js" },
      { revision: null, url: "/_next/static/chunks/5715-72d2a69d23e18b60.js" },
      { revision: null, url: "/_next/static/chunks/578-aeb27b57e346c37f.js" },
      { revision: null, url: "/_next/static/chunks/5952-4085543ff2c7a15f.js" },
      { revision: null, url: "/_next/static/chunks/5981-aec95e67f3ac923c.js" },
      { revision: null, url: "/_next/static/chunks/6156-c399a6aac4572d01.js" },
      { revision: null, url: "/_next/static/chunks/6350-2e9216b52dcd686b.js" },
      { revision: null, url: "/_next/static/chunks/6353-c8a7ce46a37fed98.js" },
      { revision: null, url: "/_next/static/chunks/6790-fbb88861e7bc17f4.js" },
      { revision: null, url: "/_next/static/chunks/7240-166e41291630fbb5.js" },
      { revision: null, url: "/_next/static/chunks/7489.395193bf37b80884.js" },
      { revision: null, url: "/_next/static/chunks/754-291d329f17a6ca4a.js" },
      { revision: null, url: "/_next/static/chunks/7755-4abd4b95fe627e86.js" },
      { revision: null, url: "/_next/static/chunks/8197-bcfd6998d8ff090f.js" },
      { revision: null, url: "/_next/static/chunks/8200-a8ee7afed7ca25b6.js" },
      {
        revision: null,
        url: "/_next/static/chunks/86bc33f4-b5c422d979985594.js",
      },
      { revision: null, url: "/_next/static/chunks/8726-da84d32d087b6cf7.js" },
      { revision: null, url: "/_next/static/chunks/8833-64c5753f2f65db95.js" },
      { revision: null, url: "/_next/static/chunks/9419-812bc386924ec223.js" },
      { revision: null, url: "/_next/static/chunks/9567-fd4b4afe0c3e3e7f.js" },
      { revision: null, url: "/_next/static/chunks/9680-51a82fd571801539.js" },
      { revision: null, url: "/_next/static/chunks/9730-55c9c84549bec3a4.js" },
      { revision: null, url: "/_next/static/chunks/9794-9ff6de79275e6d39.js" },
      {
        revision: null,
        url: "/_next/static/chunks/app/(layout)/admin/category-management/page-8dbc1dd775fa17ab.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/(layout)/admin/dashboard/page-045d09f592a0aff0.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/(layout)/admin/feedbacks-management/%5Bid%5D/page-d63d1f0bd979f153.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/(layout)/admin/feedbacks-management/page-ad61302dea8d4bd8.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/(layout)/admin/page-1800cc22c2d56372.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/(layout)/admin/reported-comment-management/page-19637235d9e31c22.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/(layout)/admin/social-listening/page-f381cf8bbb1634fb.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/(layout)/department/%5Bid%5D/page-b985d2508d4506ec.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/(layout)/forum/announcements/%5Bid%5D/page-f35c4465831d5bc1.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/(layout)/forum/page-0ff7adc6959148c2.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/(layout)/forum/posts/%5Bid%5D/page-d0052a14d7b2c408.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/(layout)/layout-d4ba1c067b67aa24.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/(layout)/notifications/page-f05bbb55773cfee4.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/(layout)/profile/page-801723d1bf239706.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/(layout)/staff/announcement-management/create/page-a837508b16446e52.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/(layout)/staff/announcement-management/edit/%5Bid%5D/page-51f377335d8fd4fd.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/(layout)/staff/announcement-management/page-83b75bb6641fa1a0.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/(layout)/staff/dashboard/page-04519c8e4d1b9a65.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/(layout)/staff/list-feedbacks/%5Bid%5D/page-44f1f7ce34b57976.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/(layout)/staff/list-feedbacks/page-3f2256e40fc222db.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/(layout)/staff/page-1800cc22c2d56372.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/(layout)/student/create-new-feedback/page-ee830ae6e8f97105.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/(layout)/student/my-feedbacks/%5Bid%5D/edit/page-f9c1a6e7738962d5.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/(layout)/student/my-feedbacks/%5Bid%5D/page-859f67f2e692e06e.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/(layout)/student/my-feedbacks/page-9305ca16818ba13b.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/(layout)/student/page-1800cc22c2d56372.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/(unlayout)/change-password/page-14754a0611efbc7a.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/(unlayout)/forgot-password/page-fe2cb193ea74463a.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/(unlayout)/login/page-84d059ba63918db3.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/_not-found/page-1800cc22c2d56372.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/api/auth/refresh/route-1800cc22c2d56372.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/layout-39298e104d4cd415.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/manifest.webmanifest/route-1800cc22c2d56372.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/not-found-22dfc476fab85eca.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/c7879cf7-fabe25011515220e.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/f5439c6a-d20ec2a635c165aa.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/framework-9c44215346649ba1.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/main-app-cef27e0ca341cfa8.js",
      },
      { revision: null, url: "/_next/static/chunks/main-c3f6aa3c104d49e7.js" },
      {
        revision: null,
        url: "/_next/static/chunks/pages/_app-5b348989bba3d570.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/pages/_error-cf88c6d2cc5868d7.js",
      },
      {
        revision: "846118c33b2c0e922d7b3a7676f81f6f",
        url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/webpack-290d7112d26106dc.js",
      },
      { revision: null, url: "/_next/static/css/2fdaf5ffea9bd407.css" },
      { revision: null, url: "/_next/static/css/4b7ede318d584484.css" },
      { revision: null, url: "/_next/static/css/84edd78de243cde6.css" },
      {
        revision: "7ffd9af8193278e5330da4a0abc2ee71",
        url: "/_next/static/media/0f1bdadaf30e2d5f-s.woff2",
      },
      {
        revision: "f4634c3bc1fa7cb53247e1f2872adb5a",
        url: "/_next/static/media/22a5144ee8d83bca-s.p.woff2",
      },
      {
        revision: "677f33f1c7ed560d5885e21734cd8ce5",
        url: "/_next/static/media/2c34d62a75506231-s.woff2",
      },
      {
        revision: "c2bc2ad5f509be48ce8974180a3dbd47",
        url: "/_next/static/media/601f5c280d60caca-s.woff2",
      },
      {
        revision: "9a45f5a5937490fac6d4f5043a36c125",
        url: "/_next/static/media/9766a7e9e2e0ad5a-s.woff2",
      },
      {
        revision: "ef57990a371e9f21bacdef1e62efa44c",
        url: "/_next/static/media/a115172161b307bb-s.woff2",
      },
      {
        revision: "49215a3bccaeb5d483f4cf8fceb24776",
        url: "/_next/static/media/aa016aab0e6d1295-s.woff2",
      },
      {
        revision: "dea7cff2e11a000dc4e0e913992f9c21",
        url: "/_next/static/media/b66cf8e69499582a-s.woff2",
      },
      {
        revision: "faf6ccaa8812142c4dad31d50bc2b24f",
        url: "/_next/static/media/d100b2a099e34044-s.woff2",
      },
      {
        revision: "075226e68ad06f734d7920a0fcd35b39",
        url: "/_next/static/media/f5271587012faf78-s.p.woff2",
      },
      {
        revision: "f4a75186954722ca80df35984adf581d",
        url: "/_next/static/media/f639721981034f88-s.woff2",
      },
      {
        revision: "1d75d889626cb37660539e8b83a9fc0c",
        url: "/_next/static/mpKwfENWjdU3wWzbylSmI/_buildManifest.js",
      },
      {
        revision: "b6652df95db52feb4daf4eca35380933",
        url: "/_next/static/mpKwfENWjdU3wWzbylSmI/_ssgManifest.js",
      },
      {
        revision: "9989b28a76ab91c5bb4fdc817df72a20",
        url: "/favicon\\apple-touch-icon.png",
      },
      {
        revision: "65929de41bbf34784ba1fcb5a68973bf",
        url: "/favicon\\favicon-96x96.png",
      },
      {
        revision: "56b493dfeafdb985b5492caffb9087da",
        url: "/favicon\\favicon.ico",
      },
      {
        revision: "47d4eac9476ba75d85b05fa0280ab65f",
        url: "/favicon\\favicon.svg",
      },
      {
        revision: "9090e674d41e265d5f03c180fe5f6721",
        url: "/favicon\\site.webmanifest",
      },
      {
        revision: "60842d6855828b064547d737b0868f25",
        url: "/favicon\\web-app-manifest-192x192.png",
      },
      {
        revision: "84a0cb439f6cb6b07ce2b52111d0807a",
        url: "/favicon\\web-app-manifest-512x512.png",
      },
      { revision: "d09f95206c3fa0bb9bd9fefabfd0ea71", url: "/file.svg" },
      { revision: "2aaafa6a49b6563925fe440891e32717", url: "/globe.svg" },
      { revision: "ebaa49ce10d760ec803708789d14c144", url: "/logo-hcmute.png" },
      { revision: "8e061864f388b47f33a1c3780831193e", url: "/next.svg" },
      { revision: "8cb564c31bd6a18883cc1f7303c39f6b", url: "/ute_logo.png" },
      { revision: "c0af2f507b369b085b35ef4bbe3bcf1e", url: "/vercel.svg" },
      { revision: "a2760511c65806022ad20adf74370ff3", url: "/window.svg" },
    ],
    skipWaiting: !0,
    clientsClaim: !0,
    navigationPreload: !0,
    runtimeCaching: eR,
  }).addEventListeners();
})();
