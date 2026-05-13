var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e2) => e2.name !== markName) : this._entries.filter((e2) => e2.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e2) => e2.name !== measureName) : this._entries.filter((e2) => e2.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e2) => e2.entryType !== "resource" || e2.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e2) => e2.name === name && (!type || e2.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e2) => e2.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
if (!("__unenv__" in performance)) {
  const proto = Performance.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance, key, desc);
      }
    }
  }
}
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir4, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env3) {
    return 1;
  }
  hasColors(count4, env3) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process2 extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process2.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd3) {
    this.#cwd = cwd3;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  _channel,
  _debugEnd,
  _debugProcess,
  _disconnect,
  _events,
  _eventsCount,
  _exiting,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _handleQueue,
  _kill,
  _linkedBinding,
  _maxListeners,
  _pendingMessage,
  _preload_modules,
  _rawDebug,
  _send,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  assert: assert2,
  availableMemory,
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  disconnect,
  dlopen,
  domain,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  hrtime: hrtime3,
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  mainModule,
  memoryUsage,
  moduleLoadList,
  nextTick,
  off,
  on,
  once,
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// .wrangler/tmp/pages-z4C2af/functionsWorker-0.12778263028433368.mjs
import { Writable as Writable2 } from "node:stream";
import { EventEmitter as EventEmitter2 } from "node:events";
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
// @__NO_SIDE_EFFECTS__
function createNotImplementedError2(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError2, "createNotImplementedError");
__name2(createNotImplementedError2, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented2(name) {
  const fn = /* @__PURE__ */ __name2(() => {
    throw /* @__PURE__ */ createNotImplementedError2(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented2, "notImplemented");
__name2(notImplemented2, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass2(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass2, "notImplementedClass");
__name2(notImplementedClass2, "notImplementedClass");
var _timeOrigin2 = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow2 = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin2;
var nodeTiming2 = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry2 = class {
  static {
    __name(this, "PerformanceEntry");
  }
  static {
    __name2(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow2();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow2() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark3 = class PerformanceMark22 extends PerformanceEntry2 {
  static {
    __name(this, "PerformanceMark2");
  }
  static {
    __name2(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure2 = class extends PerformanceEntry2 {
  static {
    __name(this, "PerformanceMeasure");
  }
  static {
    __name2(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming2 = class extends PerformanceEntry2 {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  static {
    __name2(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList2 = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  static {
    __name2(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance2 = class {
  static {
    __name(this, "Performance");
  }
  static {
    __name2(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin2;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw /* @__PURE__ */ createNotImplementedError2("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming2;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming2("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin2) {
      return _performanceNow2();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e2) => e2.name !== markName) : this._entries.filter((e2) => e2.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e2) => e2.name !== measureName) : this._entries.filter((e2) => e2.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e2) => e2.entryType !== "resource" || e2.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e2) => e2.name === name && (!type || e2.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e2) => e2.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark3(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure2(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw /* @__PURE__ */ createNotImplementedError2("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw /* @__PURE__ */ createNotImplementedError2("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw /* @__PURE__ */ createNotImplementedError2("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver2 = class {
  static {
    __name(this, "PerformanceObserver");
  }
  static {
    __name2(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw /* @__PURE__ */ createNotImplementedError2("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw /* @__PURE__ */ createNotImplementedError2("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance2 = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance2();
if (!("__unenv__" in performance2)) {
  const proto = Performance2.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance2)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance2, key, desc);
      }
    }
  }
}
globalThis.performance = performance2;
globalThis.Performance = Performance2;
globalThis.PerformanceEntry = PerformanceEntry2;
globalThis.PerformanceMark = PerformanceMark3;
globalThis.PerformanceMeasure = PerformanceMeasure2;
globalThis.PerformanceObserver = PerformanceObserver2;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList2;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming2;
var noop_default2 = Object.assign(() => {
}, { __unenv__: true });
var _console2 = globalThis.console;
var _ignoreErrors2 = true;
var _stderr2 = new Writable2();
var _stdout2 = new Writable2();
var log3 = _console2?.log ?? noop_default2;
var info3 = _console2?.info ?? log3;
var trace3 = _console2?.trace ?? info3;
var debug3 = _console2?.debug ?? log3;
var table3 = _console2?.table ?? log3;
var error3 = _console2?.error ?? log3;
var warn3 = _console2?.warn ?? error3;
var createTask3 = _console2?.createTask ?? /* @__PURE__ */ notImplemented2("console.createTask");
var clear3 = _console2?.clear ?? noop_default2;
var count3 = _console2?.count ?? noop_default2;
var countReset3 = _console2?.countReset ?? noop_default2;
var dir3 = _console2?.dir ?? noop_default2;
var dirxml3 = _console2?.dirxml ?? noop_default2;
var group3 = _console2?.group ?? noop_default2;
var groupEnd3 = _console2?.groupEnd ?? noop_default2;
var groupCollapsed3 = _console2?.groupCollapsed ?? noop_default2;
var profile3 = _console2?.profile ?? noop_default2;
var profileEnd3 = _console2?.profileEnd ?? noop_default2;
var time3 = _console2?.time ?? noop_default2;
var timeEnd3 = _console2?.timeEnd ?? noop_default2;
var timeLog3 = _console2?.timeLog ?? noop_default2;
var timeStamp3 = _console2?.timeStamp ?? noop_default2;
var Console2 = _console2?.Console ?? /* @__PURE__ */ notImplementedClass2("console.Console");
var _times2 = /* @__PURE__ */ new Map();
var _stdoutErrorHandler2 = noop_default2;
var _stderrErrorHandler2 = noop_default2;
var workerdConsole2 = globalThis["console"];
var {
  assert: assert3,
  clear: clear22,
  // @ts-expect-error undocumented public API
  context: context2,
  count: count22,
  countReset: countReset22,
  // @ts-expect-error undocumented public API
  createTask: createTask22,
  debug: debug22,
  dir: dir22,
  dirxml: dirxml22,
  error: error22,
  group: group22,
  groupCollapsed: groupCollapsed22,
  groupEnd: groupEnd22,
  info: info22,
  log: log22,
  profile: profile22,
  profileEnd: profileEnd22,
  table: table22,
  time: time22,
  timeEnd: timeEnd22,
  timeLog: timeLog22,
  timeStamp: timeStamp22,
  trace: trace22,
  warn: warn22
} = workerdConsole2;
Object.assign(workerdConsole2, {
  Console: Console2,
  _ignoreErrors: _ignoreErrors2,
  _stderr: _stderr2,
  _stderrErrorHandler: _stderrErrorHandler2,
  _stdout: _stdout2,
  _stdoutErrorHandler: _stdoutErrorHandler2,
  _times: _times2
});
var console_default2 = workerdConsole2;
globalThis.console = console_default2;
var hrtime4 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name2(/* @__PURE__ */ __name(function hrtime22(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime2"), "hrtime"), { bigint: /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function bigint2() {
  return BigInt(Date.now() * 1e6);
}, "bigint"), "bigint") });
var ReadStream2 = class {
  static {
    __name(this, "ReadStream");
  }
  static {
    __name2(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};
var WriteStream2 = class {
  static {
    __name(this, "WriteStream");
  }
  static {
    __name2(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir32, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env22) {
    return 1;
  }
  hasColors(count32, env22) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};
var NODE_VERSION2 = "22.14.0";
var Process2 = class _Process extends EventEmitter2 {
  static {
    __name(this, "_Process");
  }
  static {
    __name2(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter2.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream2(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream2(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream2(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd22) {
    this.#cwd = cwd22;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION2}`;
  }
  get versions() {
    return { node: NODE_VERSION2 };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw /* @__PURE__ */ createNotImplementedError2("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw /* @__PURE__ */ createNotImplementedError2("process.getActiveResourcesInfo");
  }
  exit() {
    throw /* @__PURE__ */ createNotImplementedError2("process.exit");
  }
  reallyExit() {
    throw /* @__PURE__ */ createNotImplementedError2("process.reallyExit");
  }
  kill() {
    throw /* @__PURE__ */ createNotImplementedError2("process.kill");
  }
  abort() {
    throw /* @__PURE__ */ createNotImplementedError2("process.abort");
  }
  dlopen() {
    throw /* @__PURE__ */ createNotImplementedError2("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw /* @__PURE__ */ createNotImplementedError2("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw /* @__PURE__ */ createNotImplementedError2("process.loadEnvFile");
  }
  disconnect() {
    throw /* @__PURE__ */ createNotImplementedError2("process.disconnect");
  }
  cpuUsage() {
    throw /* @__PURE__ */ createNotImplementedError2("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw /* @__PURE__ */ createNotImplementedError2("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw /* @__PURE__ */ createNotImplementedError2("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw /* @__PURE__ */ createNotImplementedError2("process.initgroups");
  }
  openStdin() {
    throw /* @__PURE__ */ createNotImplementedError2("process.openStdin");
  }
  assert() {
    throw /* @__PURE__ */ createNotImplementedError2("process.assert");
  }
  binding() {
    throw /* @__PURE__ */ createNotImplementedError2("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented2("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented2("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented2("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented2("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented2("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented2("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name2(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};
var globalProcess2 = globalThis["process"];
var getBuiltinModule2 = globalProcess2.getBuiltinModule;
var workerdProcess2 = getBuiltinModule2("node:process");
var unenvProcess2 = new Process2({
  env: globalProcess2.env,
  hrtime: hrtime4,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess2.nextTick
});
var { exit: exit2, features: features2, platform: platform2 } = workerdProcess2;
var {
  _channel: _channel2,
  _debugEnd: _debugEnd2,
  _debugProcess: _debugProcess2,
  _disconnect: _disconnect2,
  _events: _events2,
  _eventsCount: _eventsCount2,
  _exiting: _exiting2,
  _fatalException: _fatalException2,
  _getActiveHandles: _getActiveHandles2,
  _getActiveRequests: _getActiveRequests2,
  _handleQueue: _handleQueue2,
  _kill: _kill2,
  _linkedBinding: _linkedBinding2,
  _maxListeners: _maxListeners2,
  _pendingMessage: _pendingMessage2,
  _preload_modules: _preload_modules2,
  _rawDebug: _rawDebug2,
  _send: _send2,
  _startProfilerIdleNotifier: _startProfilerIdleNotifier2,
  _stopProfilerIdleNotifier: _stopProfilerIdleNotifier2,
  _tickCallback: _tickCallback2,
  abort: abort2,
  addListener: addListener2,
  allowedNodeEnvironmentFlags: allowedNodeEnvironmentFlags2,
  arch: arch2,
  argv: argv2,
  argv0: argv02,
  assert: assert22,
  availableMemory: availableMemory2,
  binding: binding2,
  channel: channel2,
  chdir: chdir2,
  config: config2,
  connected: connected2,
  constrainedMemory: constrainedMemory2,
  cpuUsage: cpuUsage2,
  cwd: cwd2,
  debugPort: debugPort2,
  disconnect: disconnect2,
  dlopen: dlopen2,
  domain: domain2,
  emit: emit2,
  emitWarning: emitWarning2,
  env: env2,
  eventNames: eventNames2,
  execArgv: execArgv2,
  execPath: execPath2,
  exitCode: exitCode2,
  finalization: finalization2,
  getActiveResourcesInfo: getActiveResourcesInfo2,
  getegid: getegid2,
  geteuid: geteuid2,
  getgid: getgid2,
  getgroups: getgroups2,
  getMaxListeners: getMaxListeners2,
  getuid: getuid2,
  hasUncaughtExceptionCaptureCallback: hasUncaughtExceptionCaptureCallback2,
  hrtime: hrtime32,
  initgroups: initgroups2,
  kill: kill2,
  listenerCount: listenerCount2,
  listeners: listeners2,
  loadEnvFile: loadEnvFile2,
  mainModule: mainModule2,
  memoryUsage: memoryUsage2,
  moduleLoadList: moduleLoadList2,
  nextTick: nextTick2,
  off: off2,
  on: on2,
  once: once2,
  openStdin: openStdin2,
  permission: permission2,
  pid: pid2,
  ppid: ppid2,
  prependListener: prependListener2,
  prependOnceListener: prependOnceListener2,
  rawListeners: rawListeners2,
  reallyExit: reallyExit2,
  ref: ref2,
  release: release2,
  removeAllListeners: removeAllListeners2,
  removeListener: removeListener2,
  report: report2,
  resourceUsage: resourceUsage2,
  send: send2,
  setegid: setegid2,
  seteuid: seteuid2,
  setgid: setgid2,
  setgroups: setgroups2,
  setMaxListeners: setMaxListeners2,
  setSourceMapsEnabled: setSourceMapsEnabled2,
  setuid: setuid2,
  setUncaughtExceptionCaptureCallback: setUncaughtExceptionCaptureCallback2,
  sourceMapsEnabled: sourceMapsEnabled2,
  stderr: stderr2,
  stdin: stdin2,
  stdout: stdout2,
  throwDeprecation: throwDeprecation2,
  title: title2,
  traceDeprecation: traceDeprecation2,
  umask: umask2,
  unref: unref2,
  uptime: uptime2,
  version: version2,
  versions: versions2
} = unenvProcess2;
var _process2 = {
  abort: abort2,
  addListener: addListener2,
  allowedNodeEnvironmentFlags: allowedNodeEnvironmentFlags2,
  hasUncaughtExceptionCaptureCallback: hasUncaughtExceptionCaptureCallback2,
  setUncaughtExceptionCaptureCallback: setUncaughtExceptionCaptureCallback2,
  loadEnvFile: loadEnvFile2,
  sourceMapsEnabled: sourceMapsEnabled2,
  arch: arch2,
  argv: argv2,
  argv0: argv02,
  chdir: chdir2,
  config: config2,
  connected: connected2,
  constrainedMemory: constrainedMemory2,
  availableMemory: availableMemory2,
  cpuUsage: cpuUsage2,
  cwd: cwd2,
  debugPort: debugPort2,
  dlopen: dlopen2,
  disconnect: disconnect2,
  emit: emit2,
  emitWarning: emitWarning2,
  env: env2,
  eventNames: eventNames2,
  execArgv: execArgv2,
  execPath: execPath2,
  exit: exit2,
  finalization: finalization2,
  features: features2,
  getBuiltinModule: getBuiltinModule2,
  getActiveResourcesInfo: getActiveResourcesInfo2,
  getMaxListeners: getMaxListeners2,
  hrtime: hrtime32,
  kill: kill2,
  listeners: listeners2,
  listenerCount: listenerCount2,
  memoryUsage: memoryUsage2,
  nextTick: nextTick2,
  on: on2,
  off: off2,
  once: once2,
  pid: pid2,
  platform: platform2,
  ppid: ppid2,
  prependListener: prependListener2,
  prependOnceListener: prependOnceListener2,
  rawListeners: rawListeners2,
  release: release2,
  removeAllListeners: removeAllListeners2,
  removeListener: removeListener2,
  report: report2,
  resourceUsage: resourceUsage2,
  setMaxListeners: setMaxListeners2,
  setSourceMapsEnabled: setSourceMapsEnabled2,
  stderr: stderr2,
  stdin: stdin2,
  stdout: stdout2,
  title: title2,
  throwDeprecation: throwDeprecation2,
  traceDeprecation: traceDeprecation2,
  umask: umask2,
  uptime: uptime2,
  version: version2,
  versions: versions2,
  // @ts-expect-error old API
  domain: domain2,
  initgroups: initgroups2,
  moduleLoadList: moduleLoadList2,
  reallyExit: reallyExit2,
  openStdin: openStdin2,
  assert: assert22,
  binding: binding2,
  send: send2,
  exitCode: exitCode2,
  channel: channel2,
  getegid: getegid2,
  geteuid: geteuid2,
  getgid: getgid2,
  getgroups: getgroups2,
  getuid: getuid2,
  setegid: setegid2,
  seteuid: seteuid2,
  setgid: setgid2,
  setgroups: setgroups2,
  setuid: setuid2,
  permission: permission2,
  mainModule: mainModule2,
  _events: _events2,
  _eventsCount: _eventsCount2,
  _exiting: _exiting2,
  _maxListeners: _maxListeners2,
  _debugEnd: _debugEnd2,
  _debugProcess: _debugProcess2,
  _fatalException: _fatalException2,
  _getActiveHandles: _getActiveHandles2,
  _getActiveRequests: _getActiveRequests2,
  _kill: _kill2,
  _preload_modules: _preload_modules2,
  _rawDebug: _rawDebug2,
  _startProfilerIdleNotifier: _startProfilerIdleNotifier2,
  _stopProfilerIdleNotifier: _stopProfilerIdleNotifier2,
  _tickCallback: _tickCallback2,
  _disconnect: _disconnect2,
  _handleQueue: _handleQueue2,
  _pendingMessage: _pendingMessage2,
  _channel: _channel2,
  _send: _send2,
  _linkedBinding: _linkedBinding2
};
var process_default2 = _process2;
globalThis.process = process_default2;
var __create = Object.create;
var __defProp22 = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __pow = Math.pow;
var __defNormalProp = /* @__PURE__ */ __name2((obj, key, value) => key in obj ? __defProp22(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value, "__defNormalProp");
var __spreadValues = /* @__PURE__ */ __name2((a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
}, "__spreadValues");
var __spreadProps = /* @__PURE__ */ __name2((a, b) => __defProps(a, __getOwnPropDescs(b)), "__spreadProps");
var __esm = /* @__PURE__ */ __name2((fn, res) => /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
}, "__init"), "__init"), "__esm");
var __commonJS = /* @__PURE__ */ __name2((cb, mod) => /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
}, "__require"), "__require"), "__commonJS");
var __export = /* @__PURE__ */ __name2((target, all) => {
  for (var name in all)
    __defProp22(target, name, { get: all[name], enumerable: true });
}, "__export");
var __copyProps = /* @__PURE__ */ __name2((to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp22(to, key, { get: /* @__PURE__ */ __name2(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
}, "__copyProps");
var __toESM = /* @__PURE__ */ __name2((mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp22(target, "default", { value: mod, enumerable: true }) : target,
  mod
)), "__toESM");
var __async = /* @__PURE__ */ __name2((__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = /* @__PURE__ */ __name2((value) => {
      try {
        step(generator.next(value));
      } catch (e2) {
        reject(e2);
      }
    }, "fulfilled");
    var rejected = /* @__PURE__ */ __name2((value) => {
      try {
        step(generator.throw(value));
      } catch (e2) {
        reject(e2);
      }
    }, "rejected");
    var step = /* @__PURE__ */ __name2((x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected), "step");
    step((generator = generator.apply(__this, __arguments)).next());
  });
}, "__async");
var init_process = __esm({
  "shims/process.js"() {
    "use strict";
  }
});
var require_jsrsasign = __commonJS({
  "../../node_modules/.pnpm/jsrsasign@11.1.1/node_modules/jsrsasign/lib/jsrsasign.js"(exports) {
    init_process();
    var navigator = {};
    navigator.userAgent = false;
    var window2 = {};
    var VERSION = "11.1.1";
    var VERSION_FULL = "jsrsasign(all) 11.1.1 (2026-02-21) (c) 2010-2023 Kenji Urushima | kjur.github.io/jsrsasign/license";
    var CryptoJS = CryptoJS || (function(e2, g) {
      var a = {};
      var b = a.lib = {};
      var j = b.Base = /* @__PURE__ */ (function() {
        function n2() {
        }
        __name(n2, "n2");
        __name2(n2, "n2");
        return { extend: /* @__PURE__ */ __name2(function(p) {
          n2.prototype = this;
          var o2 = new n2();
          if (p) {
            o2.mixIn(p);
          }
          if (!o2.hasOwnProperty("init")) {
            o2.init = function() {
              o2.$super.init.apply(this, arguments);
            };
          }
          o2.init.prototype = o2;
          o2.$super = this;
          return o2;
        }, "extend"), create: /* @__PURE__ */ __name2(function() {
          var o2 = this.extend();
          o2.init.apply(o2, arguments);
          return o2;
        }, "create"), init: /* @__PURE__ */ __name2(function() {
        }, "init"), mixIn: /* @__PURE__ */ __name2(function(p) {
          for (var o2 in p) {
            if (p.hasOwnProperty(o2)) {
              this[o2] = p[o2];
            }
          }
          if (p.hasOwnProperty("toString")) {
            this.toString = p.toString;
          }
        }, "mixIn"), clone: /* @__PURE__ */ __name2(function() {
          return this.init.prototype.extend(this);
        }, "clone") };
      })();
      var l = b.WordArray = j.extend({ init: /* @__PURE__ */ __name2(function(o2, n2) {
        o2 = this.words = o2 || [];
        if (n2 != g) {
          this.sigBytes = n2;
        } else {
          this.sigBytes = o2.length * 4;
        }
      }, "init"), toString: /* @__PURE__ */ __name2(function(n2) {
        return (n2 || h).stringify(this);
      }, "toString"), concat: /* @__PURE__ */ __name2(function(t3) {
        var q = this.words;
        var p = t3.words;
        var n2 = this.sigBytes;
        var s = t3.sigBytes;
        this.clamp();
        if (n2 % 4) {
          for (var r2 = 0; r2 < s; r2++) {
            var o2 = p[r2 >>> 2] >>> 24 - r2 % 4 * 8 & 255;
            q[n2 + r2 >>> 2] |= o2 << 24 - (n2 + r2) % 4 * 8;
          }
        } else {
          for (var r2 = 0; r2 < s; r2 += 4) {
            q[n2 + r2 >>> 2] = p[r2 >>> 2];
          }
        }
        this.sigBytes += s;
        return this;
      }, "concat"), clamp: /* @__PURE__ */ __name2(function() {
        var o2 = this.words;
        var n2 = this.sigBytes;
        o2[n2 >>> 2] &= 4294967295 << 32 - n2 % 4 * 8;
        o2.length = e2.ceil(n2 / 4);
      }, "clamp"), clone: /* @__PURE__ */ __name2(function() {
        var n2 = j.clone.call(this);
        n2.words = this.words.slice(0);
        return n2;
      }, "clone"), random: /* @__PURE__ */ __name2(function(p) {
        var o2 = [];
        for (var n2 = 0; n2 < p; n2 += 4) {
          o2.push(e2.random() * 4294967296 | 0);
        }
        return new l.init(o2, p);
      }, "random") });
      var m = a.enc = {};
      var h = m.Hex = { stringify: /* @__PURE__ */ __name2(function(p) {
        var r2 = p.words;
        var o2 = p.sigBytes;
        var q = [];
        for (var n2 = 0; n2 < o2; n2++) {
          var s = r2[n2 >>> 2] >>> 24 - n2 % 4 * 8 & 255;
          q.push((s >>> 4).toString(16));
          q.push((s & 15).toString(16));
        }
        return q.join("");
      }, "stringify"), parse: /* @__PURE__ */ __name2(function(p) {
        var n2 = p.length;
        var q = [];
        for (var o2 = 0; o2 < n2; o2 += 2) {
          q[o2 >>> 3] |= parseInt(p.substr(o2, 2), 16) << 24 - o2 % 8 * 4;
        }
        return new l.init(q, n2 / 2);
      }, "parse") };
      var d = m.Latin1 = { stringify: /* @__PURE__ */ __name2(function(q) {
        var r2 = q.words;
        var p = q.sigBytes;
        var n2 = [];
        for (var o2 = 0; o2 < p; o2++) {
          var s = r2[o2 >>> 2] >>> 24 - o2 % 4 * 8 & 255;
          n2.push(String.fromCharCode(s));
        }
        return n2.join("");
      }, "stringify"), parse: /* @__PURE__ */ __name2(function(p) {
        var n2 = p.length;
        var q = [];
        for (var o2 = 0; o2 < n2; o2++) {
          q[o2 >>> 2] |= (p.charCodeAt(o2) & 255) << 24 - o2 % 4 * 8;
        }
        return new l.init(q, n2);
      }, "parse") };
      var c = m.Utf8 = { stringify: /* @__PURE__ */ __name2(function(n2) {
        try {
          return decodeURIComponent(escape(d.stringify(n2)));
        } catch (o2) {
          throw new Error("Malformed UTF-8 data");
        }
      }, "stringify"), parse: /* @__PURE__ */ __name2(function(n2) {
        return d.parse(unescape(encodeURIComponent(n2)));
      }, "parse") };
      var i = b.BufferedBlockAlgorithm = j.extend({ reset: /* @__PURE__ */ __name2(function() {
        this._data = new l.init();
        this._nDataBytes = 0;
      }, "reset"), _append: /* @__PURE__ */ __name2(function(n2) {
        if (typeof n2 == "string") {
          n2 = c.parse(n2);
        }
        this._data.concat(n2);
        this._nDataBytes += n2.sigBytes;
      }, "_append"), _process: /* @__PURE__ */ __name2(function(w) {
        var q = this._data;
        var x = q.words;
        var n2 = q.sigBytes;
        var t3 = this.blockSize;
        var v = t3 * 4;
        var u = n2 / v;
        if (w) {
          u = e2.ceil(u);
        } else {
          u = e2.max((u | 0) - this._minBufferSize, 0);
        }
        var s = u * t3;
        var r2 = e2.min(s * 4, n2);
        if (s) {
          for (var p = 0; p < s; p += t3) {
            this._doProcessBlock(x, p);
          }
          var o2 = x.splice(0, s);
          q.sigBytes -= r2;
        }
        return new l.init(o2, r2);
      }, "_process"), clone: /* @__PURE__ */ __name2(function() {
        var n2 = j.clone.call(this);
        n2._data = this._data.clone();
        return n2;
      }, "clone"), _minBufferSize: 0 });
      var f = b.Hasher = i.extend({ cfg: j.extend(), init: /* @__PURE__ */ __name2(function(n2) {
        this.cfg = this.cfg.extend(n2);
        this.reset();
      }, "init"), reset: /* @__PURE__ */ __name2(function() {
        i.reset.call(this);
        this._doReset();
      }, "reset"), update: /* @__PURE__ */ __name2(function(n2) {
        this._append(n2);
        this._process();
        return this;
      }, "update"), finalize: /* @__PURE__ */ __name2(function(n2) {
        if (n2) {
          this._append(n2);
        }
        var o2 = this._doFinalize();
        return o2;
      }, "finalize"), blockSize: 512 / 32, _createHelper: /* @__PURE__ */ __name2(function(n2) {
        return function(p, o2) {
          return new n2.init(o2).finalize(p);
        };
      }, "_createHelper"), _createHmacHelper: /* @__PURE__ */ __name2(function(n2) {
        return function(p, o2) {
          return new k.HMAC.init(n2, o2).finalize(p);
        };
      }, "_createHmacHelper") });
      var k = a.algo = {};
      return a;
    })(Math);
    (function(g) {
      var a = CryptoJS, f = a.lib, e2 = f.Base, h = f.WordArray, a = a.x64 = {};
      a.Word = e2.extend({ init: /* @__PURE__ */ __name2(function(b, c) {
        this.high = b;
        this.low = c;
      }, "init") });
      a.WordArray = e2.extend({ init: /* @__PURE__ */ __name2(function(b, c) {
        b = this.words = b || [];
        this.sigBytes = c != g ? c : 8 * b.length;
      }, "init"), toX32: /* @__PURE__ */ __name2(function() {
        for (var b = this.words, c = b.length, a2 = [], d = 0; d < c; d++) {
          var e3 = b[d];
          a2.push(e3.high);
          a2.push(e3.low);
        }
        return h.create(a2, this.sigBytes);
      }, "toX32"), clone: /* @__PURE__ */ __name2(function() {
        for (var b = e2.clone.call(this), c = b.words = this.words.slice(0), a2 = c.length, d = 0; d < a2; d++) c[d] = c[d].clone();
        return b;
      }, "clone") });
    })();
    CryptoJS.lib.Cipher || (function(u) {
      var g = CryptoJS, f = g.lib, k = f.Base, l = f.WordArray, q = f.BufferedBlockAlgorithm, r2 = g.enc.Base64, v = g.algo.EvpKDF, n2 = f.Cipher = q.extend({ cfg: k.extend(), createEncryptor: /* @__PURE__ */ __name2(function(a, b) {
        return this.create(this._ENC_XFORM_MODE, a, b);
      }, "createEncryptor"), createDecryptor: /* @__PURE__ */ __name2(function(a, b) {
        return this.create(this._DEC_XFORM_MODE, a, b);
      }, "createDecryptor"), init: /* @__PURE__ */ __name2(function(a, b, c) {
        this.cfg = this.cfg.extend(c);
        this._xformMode = a;
        this._key = b;
        this.reset();
      }, "init"), reset: /* @__PURE__ */ __name2(function() {
        q.reset.call(this);
        this._doReset();
      }, "reset"), process: /* @__PURE__ */ __name2(function(a) {
        this._append(a);
        return this._process();
      }, "process"), finalize: /* @__PURE__ */ __name2(function(a) {
        a && this._append(a);
        return this._doFinalize();
      }, "finalize"), keySize: 4, ivSize: 4, _ENC_XFORM_MODE: 1, _DEC_XFORM_MODE: 2, _createHelper: /* @__PURE__ */ __name2(function(a) {
        return { encrypt: /* @__PURE__ */ __name2(function(b, c, d) {
          return ("string" == typeof c ? s : j).encrypt(a, b, c, d);
        }, "encrypt"), decrypt: /* @__PURE__ */ __name2(function(b, c, d) {
          return ("string" == typeof c ? s : j).decrypt(a, b, c, d);
        }, "decrypt") };
      }, "_createHelper") });
      f.StreamCipher = n2.extend({ _doFinalize: /* @__PURE__ */ __name2(function() {
        return this._process(true);
      }, "_doFinalize"), blockSize: 1 });
      var m = g.mode = {}, t3 = /* @__PURE__ */ __name2(function(a, b, c) {
        var d = this._iv;
        d ? this._iv = u : d = this._prevBlock;
        for (var e2 = 0; e2 < c; e2++) a[b + e2] ^= d[e2];
      }, "t3"), h = (f.BlockCipherMode = k.extend({ createEncryptor: /* @__PURE__ */ __name2(function(a, b) {
        return this.Encryptor.create(a, b);
      }, "createEncryptor"), createDecryptor: /* @__PURE__ */ __name2(function(a, b) {
        return this.Decryptor.create(a, b);
      }, "createDecryptor"), init: /* @__PURE__ */ __name2(function(a, b) {
        this._cipher = a;
        this._iv = b;
      }, "init") })).extend();
      h.Encryptor = h.extend({ processBlock: /* @__PURE__ */ __name2(function(a, b) {
        var c = this._cipher, d = c.blockSize;
        t3.call(this, a, b, d);
        c.encryptBlock(a, b);
        this._prevBlock = a.slice(b, b + d);
      }, "processBlock") });
      h.Decryptor = h.extend({ processBlock: /* @__PURE__ */ __name2(function(a, b) {
        var c = this._cipher, d = c.blockSize, e2 = a.slice(b, b + d);
        c.decryptBlock(
          a,
          b
        );
        t3.call(this, a, b, d);
        this._prevBlock = e2;
      }, "processBlock") });
      m = m.CBC = h;
      h = (g.pad = {}).Pkcs7 = { pad: /* @__PURE__ */ __name2(function(a, b) {
        for (var c = 4 * b, c = c - a.sigBytes % c, d = c << 24 | c << 16 | c << 8 | c, e2 = [], f2 = 0; f2 < c; f2 += 4) e2.push(d);
        c = l.create(e2, c);
        a.concat(c);
      }, "pad"), unpad: /* @__PURE__ */ __name2(function(a) {
        a.sigBytes -= a.words[a.sigBytes - 1 >>> 2] & 255;
      }, "unpad") };
      f.BlockCipher = n2.extend({ cfg: n2.cfg.extend({ mode: m, padding: h }), reset: /* @__PURE__ */ __name2(function() {
        n2.reset.call(this);
        var a = this.cfg, b = a.iv, a = a.mode;
        if (this._xformMode == this._ENC_XFORM_MODE) var c = a.createEncryptor;
        else c = a.createDecryptor, this._minBufferSize = 1;
        this._mode = c.call(a, this, b && b.words);
      }, "reset"), _doProcessBlock: /* @__PURE__ */ __name2(function(a, b) {
        this._mode.processBlock(a, b);
      }, "_doProcessBlock"), _doFinalize: /* @__PURE__ */ __name2(function() {
        var a = this.cfg.padding;
        if (this._xformMode == this._ENC_XFORM_MODE) {
          a.pad(this._data, this.blockSize);
          var b = this._process(true);
        } else b = this._process(true), a.unpad(b);
        return b;
      }, "_doFinalize"), blockSize: 4 });
      var p = f.CipherParams = k.extend({ init: /* @__PURE__ */ __name2(function(a) {
        this.mixIn(a);
      }, "init"), toString: /* @__PURE__ */ __name2(function(a) {
        return (a || this.formatter).stringify(this);
      }, "toString") }), m = (g.format = {}).OpenSSL = { stringify: /* @__PURE__ */ __name2(function(a) {
        var b = a.ciphertext;
        a = a.salt;
        return (a ? l.create([1398893684, 1701076831]).concat(a).concat(b) : b).toString(r2);
      }, "stringify"), parse: /* @__PURE__ */ __name2(function(a) {
        a = r2.parse(a);
        var b = a.words;
        if (1398893684 == b[0] && 1701076831 == b[1]) {
          var c = l.create(b.slice(2, 4));
          b.splice(0, 4);
          a.sigBytes -= 16;
        }
        return p.create({ ciphertext: a, salt: c });
      }, "parse") }, j = f.SerializableCipher = k.extend({ cfg: k.extend({ format: m }), encrypt: /* @__PURE__ */ __name2(function(a, b, c, d) {
        d = this.cfg.extend(d);
        var e2 = a.createEncryptor(c, d);
        b = e2.finalize(b);
        e2 = e2.cfg;
        return p.create({
          ciphertext: b,
          key: c,
          iv: e2.iv,
          algorithm: a,
          mode: e2.mode,
          padding: e2.padding,
          blockSize: a.blockSize,
          formatter: d.format
        });
      }, "encrypt"), decrypt: /* @__PURE__ */ __name2(function(a, b, c, d) {
        d = this.cfg.extend(d);
        b = this._parse(b, d.format);
        return a.createDecryptor(c, d).finalize(b.ciphertext);
      }, "decrypt"), _parse: /* @__PURE__ */ __name2(function(a, b) {
        return "string" == typeof a ? b.parse(a, this) : a;
      }, "_parse") }), g = (g.kdf = {}).OpenSSL = { execute: /* @__PURE__ */ __name2(function(a, b, c, d) {
        d || (d = l.random(8));
        a = v.create({ keySize: b + c }).compute(a, d);
        c = l.create(a.words.slice(b), 4 * c);
        a.sigBytes = 4 * b;
        return p.create({ key: a, iv: c, salt: d });
      }, "execute") }, s = f.PasswordBasedCipher = j.extend({ cfg: j.cfg.extend({ kdf: g }), encrypt: /* @__PURE__ */ __name2(function(a, b, c, d) {
        d = this.cfg.extend(d);
        c = d.kdf.execute(c, a.keySize, a.ivSize);
        d.iv = c.iv;
        a = j.encrypt.call(this, a, b, c.key, d);
        a.mixIn(c);
        return a;
      }, "encrypt"), decrypt: /* @__PURE__ */ __name2(function(a, b, c, d) {
        d = this.cfg.extend(d);
        b = this._parse(b, d.format);
        c = d.kdf.execute(c, a.keySize, a.ivSize, b.salt);
        d.iv = c.iv;
        return j.decrypt.call(this, a, b, c.key, d);
      }, "decrypt") });
    })();
    (function() {
      for (var q = CryptoJS, x = q.lib.BlockCipher, r2 = q.algo, j = [], y = [], z2 = [], A = [], B = [], C = [], s = [], u = [], v = [], w = [], g = [], k = 0; 256 > k; k++) g[k] = 128 > k ? k << 1 : k << 1 ^ 283;
      for (var n2 = 0, l = 0, k = 0; 256 > k; k++) {
        var f = l ^ l << 1 ^ l << 2 ^ l << 3 ^ l << 4, f = f >>> 8 ^ f & 255 ^ 99;
        j[n2] = f;
        y[f] = n2;
        var t3 = g[n2], D = g[t3], E = g[D], b = 257 * g[f] ^ 16843008 * f;
        z2[n2] = b << 24 | b >>> 8;
        A[n2] = b << 16 | b >>> 16;
        B[n2] = b << 8 | b >>> 24;
        C[n2] = b;
        b = 16843009 * E ^ 65537 * D ^ 257 * t3 ^ 16843008 * n2;
        s[f] = b << 24 | b >>> 8;
        u[f] = b << 16 | b >>> 16;
        v[f] = b << 8 | b >>> 24;
        w[f] = b;
        n2 ? (n2 = t3 ^ g[g[g[E ^ t3]]], l ^= g[g[l]]) : n2 = l = 1;
      }
      var F = [
        0,
        1,
        2,
        4,
        8,
        16,
        32,
        64,
        128,
        27,
        54
      ], r2 = r2.AES = x.extend({ _doReset: /* @__PURE__ */ __name2(function() {
        for (var c = this._key, e2 = c.words, a = c.sigBytes / 4, c = 4 * ((this._nRounds = a + 6) + 1), b2 = this._keySchedule = [], h = 0; h < c; h++) if (h < a) b2[h] = e2[h];
        else {
          var d = b2[h - 1];
          h % a ? 6 < a && 4 == h % a && (d = j[d >>> 24] << 24 | j[d >>> 16 & 255] << 16 | j[d >>> 8 & 255] << 8 | j[d & 255]) : (d = d << 8 | d >>> 24, d = j[d >>> 24] << 24 | j[d >>> 16 & 255] << 16 | j[d >>> 8 & 255] << 8 | j[d & 255], d ^= F[h / a | 0] << 24);
          b2[h] = b2[h - a] ^ d;
        }
        e2 = this._invKeySchedule = [];
        for (a = 0; a < c; a++) h = c - a, d = a % 4 ? b2[h] : b2[h - 4], e2[a] = 4 > a || 4 >= h ? d : s[j[d >>> 24]] ^ u[j[d >>> 16 & 255]] ^ v[j[d >>> 8 & 255]] ^ w[j[d & 255]];
      }, "_doReset"), encryptBlock: /* @__PURE__ */ __name2(function(c, e2) {
        this._doCryptBlock(c, e2, this._keySchedule, z2, A, B, C, j);
      }, "encryptBlock"), decryptBlock: /* @__PURE__ */ __name2(function(c, e2) {
        var a = c[e2 + 1];
        c[e2 + 1] = c[e2 + 3];
        c[e2 + 3] = a;
        this._doCryptBlock(c, e2, this._invKeySchedule, s, u, v, w, y);
        a = c[e2 + 1];
        c[e2 + 1] = c[e2 + 3];
        c[e2 + 3] = a;
      }, "decryptBlock"), _doCryptBlock: /* @__PURE__ */ __name2(function(c, e2, a, b2, h, d, j2, m) {
        for (var n3 = this._nRounds, f2 = c[e2] ^ a[0], g2 = c[e2 + 1] ^ a[1], k2 = c[e2 + 2] ^ a[2], p = c[e2 + 3] ^ a[3], l2 = 4, t4 = 1; t4 < n3; t4++) var q2 = b2[f2 >>> 24] ^ h[g2 >>> 16 & 255] ^ d[k2 >>> 8 & 255] ^ j2[p & 255] ^ a[l2++], r3 = b2[g2 >>> 24] ^ h[k2 >>> 16 & 255] ^ d[p >>> 8 & 255] ^ j2[f2 & 255] ^ a[l2++], s2 = b2[k2 >>> 24] ^ h[p >>> 16 & 255] ^ d[f2 >>> 8 & 255] ^ j2[g2 & 255] ^ a[l2++], p = b2[p >>> 24] ^ h[f2 >>> 16 & 255] ^ d[g2 >>> 8 & 255] ^ j2[k2 & 255] ^ a[l2++], f2 = q2, g2 = r3, k2 = s2;
        q2 = (m[f2 >>> 24] << 24 | m[g2 >>> 16 & 255] << 16 | m[k2 >>> 8 & 255] << 8 | m[p & 255]) ^ a[l2++];
        r3 = (m[g2 >>> 24] << 24 | m[k2 >>> 16 & 255] << 16 | m[p >>> 8 & 255] << 8 | m[f2 & 255]) ^ a[l2++];
        s2 = (m[k2 >>> 24] << 24 | m[p >>> 16 & 255] << 16 | m[f2 >>> 8 & 255] << 8 | m[g2 & 255]) ^ a[l2++];
        p = (m[p >>> 24] << 24 | m[f2 >>> 16 & 255] << 16 | m[g2 >>> 8 & 255] << 8 | m[k2 & 255]) ^ a[l2++];
        c[e2] = q2;
        c[e2 + 1] = r3;
        c[e2 + 2] = s2;
        c[e2 + 3] = p;
      }, "_doCryptBlock"), keySize: 8 });
      q.AES = x._createHelper(r2);
    })();
    (function() {
      function j(b, c) {
        var a = (this._lBlock >>> b ^ this._rBlock) & c;
        this._rBlock ^= a;
        this._lBlock ^= a << b;
      }
      __name(j, "j");
      __name2(j, "j");
      function l(b, c) {
        var a = (this._rBlock >>> b ^ this._lBlock) & c;
        this._lBlock ^= a;
        this._rBlock ^= a << b;
      }
      __name(l, "l");
      __name2(l, "l");
      var h = CryptoJS, e2 = h.lib, n2 = e2.WordArray, e2 = e2.BlockCipher, g = h.algo, q = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4], p = [
        14,
        17,
        11,
        24,
        1,
        5,
        3,
        28,
        15,
        6,
        21,
        10,
        23,
        19,
        12,
        4,
        26,
        8,
        16,
        7,
        27,
        20,
        13,
        2,
        41,
        52,
        31,
        37,
        47,
        55,
        30,
        40,
        51,
        45,
        33,
        48,
        44,
        49,
        39,
        56,
        34,
        53,
        46,
        42,
        50,
        36,
        29,
        32
      ], r2 = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28], s = [{
        "0": 8421888,
        268435456: 32768,
        536870912: 8421378,
        805306368: 2,
        1073741824: 512,
        1342177280: 8421890,
        1610612736: 8389122,
        1879048192: 8388608,
        2147483648: 514,
        2415919104: 8389120,
        2684354560: 33280,
        2952790016: 8421376,
        3221225472: 32770,
        3489660928: 8388610,
        3758096384: 0,
        4026531840: 33282,
        134217728: 0,
        402653184: 8421890,
        671088640: 33282,
        939524096: 32768,
        1207959552: 8421888,
        1476395008: 512,
        1744830464: 8421378,
        2013265920: 2,
        2281701376: 8389120,
        2550136832: 33280,
        2818572288: 8421376,
        3087007744: 8389122,
        3355443200: 8388610,
        3623878656: 32770,
        3892314112: 514,
        4160749568: 8388608,
        1: 32768,
        268435457: 2,
        536870913: 8421888,
        805306369: 8388608,
        1073741825: 8421378,
        1342177281: 33280,
        1610612737: 512,
        1879048193: 8389122,
        2147483649: 8421890,
        2415919105: 8421376,
        2684354561: 8388610,
        2952790017: 33282,
        3221225473: 514,
        3489660929: 8389120,
        3758096385: 32770,
        4026531841: 0,
        134217729: 8421890,
        402653185: 8421376,
        671088641: 8388608,
        939524097: 512,
        1207959553: 32768,
        1476395009: 8388610,
        1744830465: 2,
        2013265921: 33282,
        2281701377: 32770,
        2550136833: 8389122,
        2818572289: 514,
        3087007745: 8421888,
        3355443201: 8389120,
        3623878657: 0,
        3892314113: 33280,
        4160749569: 8421378
      }, {
        "0": 1074282512,
        16777216: 16384,
        33554432: 524288,
        50331648: 1074266128,
        67108864: 1073741840,
        83886080: 1074282496,
        100663296: 1073758208,
        117440512: 16,
        134217728: 540672,
        150994944: 1073758224,
        167772160: 1073741824,
        184549376: 540688,
        201326592: 524304,
        218103808: 0,
        234881024: 16400,
        251658240: 1074266112,
        8388608: 1073758208,
        25165824: 540688,
        41943040: 16,
        58720256: 1073758224,
        75497472: 1074282512,
        92274688: 1073741824,
        109051904: 524288,
        125829120: 1074266128,
        142606336: 524304,
        159383552: 0,
        176160768: 16384,
        192937984: 1074266112,
        209715200: 1073741840,
        226492416: 540672,
        243269632: 1074282496,
        260046848: 16400,
        268435456: 0,
        285212672: 1074266128,
        301989888: 1073758224,
        318767104: 1074282496,
        335544320: 1074266112,
        352321536: 16,
        369098752: 540688,
        385875968: 16384,
        402653184: 16400,
        419430400: 524288,
        436207616: 524304,
        452984832: 1073741840,
        469762048: 540672,
        486539264: 1073758208,
        503316480: 1073741824,
        520093696: 1074282512,
        276824064: 540688,
        293601280: 524288,
        310378496: 1074266112,
        327155712: 16384,
        343932928: 1073758208,
        360710144: 1074282512,
        377487360: 16,
        394264576: 1073741824,
        411041792: 1074282496,
        427819008: 1073741840,
        444596224: 1073758224,
        461373440: 524304,
        478150656: 0,
        494927872: 16400,
        511705088: 1074266128,
        528482304: 540672
      }, {
        "0": 260,
        1048576: 0,
        2097152: 67109120,
        3145728: 65796,
        4194304: 65540,
        5242880: 67108868,
        6291456: 67174660,
        7340032: 67174400,
        8388608: 67108864,
        9437184: 67174656,
        10485760: 65792,
        11534336: 67174404,
        12582912: 67109124,
        13631488: 65536,
        14680064: 4,
        15728640: 256,
        524288: 67174656,
        1572864: 67174404,
        2621440: 0,
        3670016: 67109120,
        4718592: 67108868,
        5767168: 65536,
        6815744: 65540,
        7864320: 260,
        8912896: 4,
        9961472: 256,
        11010048: 67174400,
        12058624: 65796,
        13107200: 65792,
        14155776: 67109124,
        15204352: 67174660,
        16252928: 67108864,
        16777216: 67174656,
        17825792: 65540,
        18874368: 65536,
        19922944: 67109120,
        20971520: 256,
        22020096: 67174660,
        23068672: 67108868,
        24117248: 0,
        25165824: 67109124,
        26214400: 67108864,
        27262976: 4,
        28311552: 65792,
        29360128: 67174400,
        30408704: 260,
        31457280: 65796,
        32505856: 67174404,
        17301504: 67108864,
        18350080: 260,
        19398656: 67174656,
        20447232: 0,
        21495808: 65540,
        22544384: 67109120,
        23592960: 256,
        24641536: 67174404,
        25690112: 65536,
        26738688: 67174660,
        27787264: 65796,
        28835840: 67108868,
        29884416: 67109124,
        30932992: 67174400,
        31981568: 4,
        33030144: 65792
      }, {
        "0": 2151682048,
        65536: 2147487808,
        131072: 4198464,
        196608: 2151677952,
        262144: 0,
        327680: 4198400,
        393216: 2147483712,
        458752: 4194368,
        524288: 2147483648,
        589824: 4194304,
        655360: 64,
        720896: 2147487744,
        786432: 2151678016,
        851968: 4160,
        917504: 4096,
        983040: 2151682112,
        32768: 2147487808,
        98304: 64,
        163840: 2151678016,
        229376: 2147487744,
        294912: 4198400,
        360448: 2151682112,
        425984: 0,
        491520: 2151677952,
        557056: 4096,
        622592: 2151682048,
        688128: 4194304,
        753664: 4160,
        819200: 2147483648,
        884736: 4194368,
        950272: 4198464,
        1015808: 2147483712,
        1048576: 4194368,
        1114112: 4198400,
        1179648: 2147483712,
        1245184: 0,
        1310720: 4160,
        1376256: 2151678016,
        1441792: 2151682048,
        1507328: 2147487808,
        1572864: 2151682112,
        1638400: 2147483648,
        1703936: 2151677952,
        1769472: 4198464,
        1835008: 2147487744,
        1900544: 4194304,
        1966080: 64,
        2031616: 4096,
        1081344: 2151677952,
        1146880: 2151682112,
        1212416: 0,
        1277952: 4198400,
        1343488: 4194368,
        1409024: 2147483648,
        1474560: 2147487808,
        1540096: 64,
        1605632: 2147483712,
        1671168: 4096,
        1736704: 2147487744,
        1802240: 2151678016,
        1867776: 4160,
        1933312: 2151682048,
        1998848: 4194304,
        2064384: 4198464
      }, {
        "0": 128,
        4096: 17039360,
        8192: 262144,
        12288: 536870912,
        16384: 537133184,
        20480: 16777344,
        24576: 553648256,
        28672: 262272,
        32768: 16777216,
        36864: 537133056,
        40960: 536871040,
        45056: 553910400,
        49152: 553910272,
        53248: 0,
        57344: 17039488,
        61440: 553648128,
        2048: 17039488,
        6144: 553648256,
        10240: 128,
        14336: 17039360,
        18432: 262144,
        22528: 537133184,
        26624: 553910272,
        30720: 536870912,
        34816: 537133056,
        38912: 0,
        43008: 553910400,
        47104: 16777344,
        51200: 536871040,
        55296: 553648128,
        59392: 16777216,
        63488: 262272,
        65536: 262144,
        69632: 128,
        73728: 536870912,
        77824: 553648256,
        81920: 16777344,
        86016: 553910272,
        90112: 537133184,
        94208: 16777216,
        98304: 553910400,
        102400: 553648128,
        106496: 17039360,
        110592: 537133056,
        114688: 262272,
        118784: 536871040,
        122880: 0,
        126976: 17039488,
        67584: 553648256,
        71680: 16777216,
        75776: 17039360,
        79872: 537133184,
        83968: 536870912,
        88064: 17039488,
        92160: 128,
        96256: 553910272,
        100352: 262272,
        104448: 553910400,
        108544: 0,
        112640: 553648128,
        116736: 16777344,
        120832: 262144,
        124928: 537133056,
        129024: 536871040
      }, {
        "0": 268435464,
        256: 8192,
        512: 270532608,
        768: 270540808,
        1024: 268443648,
        1280: 2097152,
        1536: 2097160,
        1792: 268435456,
        2048: 0,
        2304: 268443656,
        2560: 2105344,
        2816: 8,
        3072: 270532616,
        3328: 2105352,
        3584: 8200,
        3840: 270540800,
        128: 270532608,
        384: 270540808,
        640: 8,
        896: 2097152,
        1152: 2105352,
        1408: 268435464,
        1664: 268443648,
        1920: 8200,
        2176: 2097160,
        2432: 8192,
        2688: 268443656,
        2944: 270532616,
        3200: 0,
        3456: 270540800,
        3712: 2105344,
        3968: 268435456,
        4096: 268443648,
        4352: 270532616,
        4608: 270540808,
        4864: 8200,
        5120: 2097152,
        5376: 268435456,
        5632: 268435464,
        5888: 2105344,
        6144: 2105352,
        6400: 0,
        6656: 8,
        6912: 270532608,
        7168: 8192,
        7424: 268443656,
        7680: 270540800,
        7936: 2097160,
        4224: 8,
        4480: 2105344,
        4736: 2097152,
        4992: 268435464,
        5248: 268443648,
        5504: 8200,
        5760: 270540808,
        6016: 270532608,
        6272: 270540800,
        6528: 270532616,
        6784: 8192,
        7040: 2105352,
        7296: 2097160,
        7552: 0,
        7808: 268435456,
        8064: 268443656
      }, {
        "0": 1048576,
        16: 33555457,
        32: 1024,
        48: 1049601,
        64: 34604033,
        80: 0,
        96: 1,
        112: 34603009,
        128: 33555456,
        144: 1048577,
        160: 33554433,
        176: 34604032,
        192: 34603008,
        208: 1025,
        224: 1049600,
        240: 33554432,
        8: 34603009,
        24: 0,
        40: 33555457,
        56: 34604032,
        72: 1048576,
        88: 33554433,
        104: 33554432,
        120: 1025,
        136: 1049601,
        152: 33555456,
        168: 34603008,
        184: 1048577,
        200: 1024,
        216: 34604033,
        232: 1,
        248: 1049600,
        256: 33554432,
        272: 1048576,
        288: 33555457,
        304: 34603009,
        320: 1048577,
        336: 33555456,
        352: 34604032,
        368: 1049601,
        384: 1025,
        400: 34604033,
        416: 1049600,
        432: 1,
        448: 0,
        464: 34603008,
        480: 33554433,
        496: 1024,
        264: 1049600,
        280: 33555457,
        296: 34603009,
        312: 1,
        328: 33554432,
        344: 1048576,
        360: 1025,
        376: 34604032,
        392: 33554433,
        408: 34603008,
        424: 0,
        440: 34604033,
        456: 1049601,
        472: 1024,
        488: 33555456,
        504: 1048577
      }, {
        "0": 134219808,
        1: 131072,
        2: 134217728,
        3: 32,
        4: 131104,
        5: 134350880,
        6: 134350848,
        7: 2048,
        8: 134348800,
        9: 134219776,
        10: 133120,
        11: 134348832,
        12: 2080,
        13: 0,
        14: 134217760,
        15: 133152,
        2147483648: 2048,
        2147483649: 134350880,
        2147483650: 134219808,
        2147483651: 134217728,
        2147483652: 134348800,
        2147483653: 133120,
        2147483654: 133152,
        2147483655: 32,
        2147483656: 134217760,
        2147483657: 2080,
        2147483658: 131104,
        2147483659: 134350848,
        2147483660: 0,
        2147483661: 134348832,
        2147483662: 134219776,
        2147483663: 131072,
        16: 133152,
        17: 134350848,
        18: 32,
        19: 2048,
        20: 134219776,
        21: 134217760,
        22: 134348832,
        23: 131072,
        24: 0,
        25: 131104,
        26: 134348800,
        27: 134219808,
        28: 134350880,
        29: 133120,
        30: 2080,
        31: 134217728,
        2147483664: 131072,
        2147483665: 2048,
        2147483666: 134348832,
        2147483667: 133152,
        2147483668: 32,
        2147483669: 134348800,
        2147483670: 134217728,
        2147483671: 134219808,
        2147483672: 134350880,
        2147483673: 134217760,
        2147483674: 134219776,
        2147483675: 0,
        2147483676: 133120,
        2147483677: 2080,
        2147483678: 131104,
        2147483679: 134350848
      }], t3 = [4160749569, 528482304, 33030144, 2064384, 129024, 8064, 504, 2147483679], m = g.DES = e2.extend({ _doReset: /* @__PURE__ */ __name2(function() {
        for (var b = this._key.words, c = [], a = 0; 56 > a; a++) {
          var f = q[a] - 1;
          c[a] = b[f >>> 5] >>> 31 - f % 32 & 1;
        }
        b = this._subKeys = [];
        for (f = 0; 16 > f; f++) {
          for (var d = b[f] = [], e3 = r2[f], a = 0; 24 > a; a++) d[a / 6 | 0] |= c[(p[a] - 1 + e3) % 28] << 31 - a % 6, d[4 + (a / 6 | 0)] |= c[28 + (p[a + 24] - 1 + e3) % 28] << 31 - a % 6;
          d[0] = d[0] << 1 | d[0] >>> 31;
          for (a = 1; 7 > a; a++) d[a] >>>= 4 * (a - 1) + 3;
          d[7] = d[7] << 5 | d[7] >>> 27;
        }
        c = this._invSubKeys = [];
        for (a = 0; 16 > a; a++) c[a] = b[15 - a];
      }, "_doReset"), encryptBlock: /* @__PURE__ */ __name2(function(b, c) {
        this._doCryptBlock(b, c, this._subKeys);
      }, "encryptBlock"), decryptBlock: /* @__PURE__ */ __name2(function(b, c) {
        this._doCryptBlock(b, c, this._invSubKeys);
      }, "decryptBlock"), _doCryptBlock: /* @__PURE__ */ __name2(function(b, c, a) {
        this._lBlock = b[c];
        this._rBlock = b[c + 1];
        j.call(this, 4, 252645135);
        j.call(this, 16, 65535);
        l.call(this, 2, 858993459);
        l.call(this, 8, 16711935);
        j.call(this, 1, 1431655765);
        for (var f = 0; 16 > f; f++) {
          for (var d = a[f], e3 = this._lBlock, h2 = this._rBlock, g2 = 0, k = 0; 8 > k; k++) g2 |= s[k][((h2 ^ d[k]) & t3[k]) >>> 0];
          this._lBlock = h2;
          this._rBlock = e3 ^ g2;
        }
        a = this._lBlock;
        this._lBlock = this._rBlock;
        this._rBlock = a;
        j.call(this, 1, 1431655765);
        l.call(this, 8, 16711935);
        l.call(this, 2, 858993459);
        j.call(this, 16, 65535);
        j.call(this, 4, 252645135);
        b[c] = this._lBlock;
        b[c + 1] = this._rBlock;
      }, "_doCryptBlock"), keySize: 2, ivSize: 2, blockSize: 2 });
      h.DES = e2._createHelper(m);
      g = g.TripleDES = e2.extend({ _doReset: /* @__PURE__ */ __name2(function() {
        var b = this._key.words;
        this._des1 = m.createEncryptor(n2.create(b.slice(0, 2)));
        this._des2 = m.createEncryptor(n2.create(b.slice(2, 4)));
        this._des3 = m.createEncryptor(n2.create(b.slice(4, 6)));
      }, "_doReset"), encryptBlock: /* @__PURE__ */ __name2(function(b, c) {
        this._des1.encryptBlock(b, c);
        this._des2.decryptBlock(b, c);
        this._des3.encryptBlock(b, c);
      }, "encryptBlock"), decryptBlock: /* @__PURE__ */ __name2(function(b, c) {
        this._des3.decryptBlock(b, c);
        this._des2.encryptBlock(b, c);
        this._des1.decryptBlock(b, c);
      }, "decryptBlock"), keySize: 6, ivSize: 2, blockSize: 2 });
      h.TripleDES = e2._createHelper(g);
    })();
    (function() {
      var h = CryptoJS, j = h.lib.WordArray;
      h.enc.Base64 = { stringify: /* @__PURE__ */ __name2(function(b) {
        var e2 = b.words, f = b.sigBytes, c = this._map;
        b.clamp();
        b = [];
        for (var a = 0; a < f; a += 3) for (var d = (e2[a >>> 2] >>> 24 - 8 * (a % 4) & 255) << 16 | (e2[a + 1 >>> 2] >>> 24 - 8 * ((a + 1) % 4) & 255) << 8 | e2[a + 2 >>> 2] >>> 24 - 8 * ((a + 2) % 4) & 255, g = 0; 4 > g && a + 0.75 * g < f; g++) b.push(c.charAt(d >>> 6 * (3 - g) & 63));
        if (e2 = c.charAt(64)) for (; b.length % 4; ) b.push(e2);
        return b.join("");
      }, "stringify"), parse: /* @__PURE__ */ __name2(function(b) {
        var e2 = b.length, f = this._map, c = f.charAt(64);
        c && (c = b.indexOf(c), -1 != c && (e2 = c));
        for (var c = [], a = 0, d = 0; d < e2; d++) if (d % 4) {
          var g = f.indexOf(b.charAt(d - 1)) << 2 * (d % 4), h2 = f.indexOf(b.charAt(d)) >>> 6 - 2 * (d % 4);
          c[a >>> 2] |= (g | h2) << 24 - 8 * (a % 4);
          a++;
        }
        return j.create(c, a);
      }, "parse"), _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" };
    })();
    (function(E) {
      function h(a2, f, g, j, p, h2, k2) {
        a2 = a2 + (f & g | ~f & j) + p + k2;
        return (a2 << h2 | a2 >>> 32 - h2) + f;
      }
      __name(h, "h");
      __name2(h, "h");
      function k(a2, f, g, j, p, h2, k2) {
        a2 = a2 + (f & j | g & ~j) + p + k2;
        return (a2 << h2 | a2 >>> 32 - h2) + f;
      }
      __name(k, "k");
      __name2(k, "k");
      function l(a2, f, g, j, h2, k2, l2) {
        a2 = a2 + (f ^ g ^ j) + h2 + l2;
        return (a2 << k2 | a2 >>> 32 - k2) + f;
      }
      __name(l, "l");
      __name2(l, "l");
      function n2(a2, f, g, j, h2, k2, l2) {
        a2 = a2 + (g ^ (f | ~j)) + h2 + l2;
        return (a2 << k2 | a2 >>> 32 - k2) + f;
      }
      __name(n2, "n2");
      __name2(n2, "n2");
      for (var r2 = CryptoJS, q = r2.lib, F = q.WordArray, s = q.Hasher, q = r2.algo, a = [], t3 = 0; 64 > t3; t3++) a[t3] = 4294967296 * E.abs(E.sin(t3 + 1)) | 0;
      q = q.MD5 = s.extend({
        _doReset: /* @__PURE__ */ __name2(function() {
          this._hash = new F.init([1732584193, 4023233417, 2562383102, 271733878]);
        }, "_doReset"),
        _doProcessBlock: /* @__PURE__ */ __name2(function(m, f) {
          for (var g = 0; 16 > g; g++) {
            var j = f + g, p = m[j];
            m[j] = (p << 8 | p >>> 24) & 16711935 | (p << 24 | p >>> 8) & 4278255360;
          }
          var g = this._hash.words, j = m[f + 0], p = m[f + 1], q2 = m[f + 2], r3 = m[f + 3], s2 = m[f + 4], t4 = m[f + 5], u = m[f + 6], v = m[f + 7], w = m[f + 8], x = m[f + 9], y = m[f + 10], z2 = m[f + 11], A = m[f + 12], B = m[f + 13], C = m[f + 14], D = m[f + 15], b = g[0], c = g[1], d = g[2], e2 = g[3], b = h(b, c, d, e2, j, 7, a[0]), e2 = h(e2, b, c, d, p, 12, a[1]), d = h(d, e2, b, c, q2, 17, a[2]), c = h(c, d, e2, b, r3, 22, a[3]), b = h(b, c, d, e2, s2, 7, a[4]), e2 = h(e2, b, c, d, t4, 12, a[5]), d = h(d, e2, b, c, u, 17, a[6]), c = h(c, d, e2, b, v, 22, a[7]), b = h(b, c, d, e2, w, 7, a[8]), e2 = h(e2, b, c, d, x, 12, a[9]), d = h(d, e2, b, c, y, 17, a[10]), c = h(c, d, e2, b, z2, 22, a[11]), b = h(b, c, d, e2, A, 7, a[12]), e2 = h(e2, b, c, d, B, 12, a[13]), d = h(d, e2, b, c, C, 17, a[14]), c = h(c, d, e2, b, D, 22, a[15]), b = k(b, c, d, e2, p, 5, a[16]), e2 = k(e2, b, c, d, u, 9, a[17]), d = k(d, e2, b, c, z2, 14, a[18]), c = k(c, d, e2, b, j, 20, a[19]), b = k(b, c, d, e2, t4, 5, a[20]), e2 = k(e2, b, c, d, y, 9, a[21]), d = k(d, e2, b, c, D, 14, a[22]), c = k(c, d, e2, b, s2, 20, a[23]), b = k(b, c, d, e2, x, 5, a[24]), e2 = k(e2, b, c, d, C, 9, a[25]), d = k(d, e2, b, c, r3, 14, a[26]), c = k(c, d, e2, b, w, 20, a[27]), b = k(b, c, d, e2, B, 5, a[28]), e2 = k(
            e2,
            b,
            c,
            d,
            q2,
            9,
            a[29]
          ), d = k(d, e2, b, c, v, 14, a[30]), c = k(c, d, e2, b, A, 20, a[31]), b = l(b, c, d, e2, t4, 4, a[32]), e2 = l(e2, b, c, d, w, 11, a[33]), d = l(d, e2, b, c, z2, 16, a[34]), c = l(c, d, e2, b, C, 23, a[35]), b = l(b, c, d, e2, p, 4, a[36]), e2 = l(e2, b, c, d, s2, 11, a[37]), d = l(d, e2, b, c, v, 16, a[38]), c = l(c, d, e2, b, y, 23, a[39]), b = l(b, c, d, e2, B, 4, a[40]), e2 = l(e2, b, c, d, j, 11, a[41]), d = l(d, e2, b, c, r3, 16, a[42]), c = l(c, d, e2, b, u, 23, a[43]), b = l(b, c, d, e2, x, 4, a[44]), e2 = l(e2, b, c, d, A, 11, a[45]), d = l(d, e2, b, c, D, 16, a[46]), c = l(c, d, e2, b, q2, 23, a[47]), b = n2(b, c, d, e2, j, 6, a[48]), e2 = n2(e2, b, c, d, v, 10, a[49]), d = n2(
            d,
            e2,
            b,
            c,
            C,
            15,
            a[50]
          ), c = n2(c, d, e2, b, t4, 21, a[51]), b = n2(b, c, d, e2, A, 6, a[52]), e2 = n2(e2, b, c, d, r3, 10, a[53]), d = n2(d, e2, b, c, y, 15, a[54]), c = n2(c, d, e2, b, p, 21, a[55]), b = n2(b, c, d, e2, w, 6, a[56]), e2 = n2(e2, b, c, d, D, 10, a[57]), d = n2(d, e2, b, c, u, 15, a[58]), c = n2(c, d, e2, b, B, 21, a[59]), b = n2(b, c, d, e2, s2, 6, a[60]), e2 = n2(e2, b, c, d, z2, 10, a[61]), d = n2(d, e2, b, c, q2, 15, a[62]), c = n2(c, d, e2, b, x, 21, a[63]);
          g[0] = g[0] + b | 0;
          g[1] = g[1] + c | 0;
          g[2] = g[2] + d | 0;
          g[3] = g[3] + e2 | 0;
        }, "_doProcessBlock"),
        _doFinalize: /* @__PURE__ */ __name2(function() {
          var a2 = this._data, f = a2.words, g = 8 * this._nDataBytes, j = 8 * a2.sigBytes;
          f[j >>> 5] |= 128 << 24 - j % 32;
          var h2 = E.floor(g / 4294967296);
          f[(j + 64 >>> 9 << 4) + 15] = (h2 << 8 | h2 >>> 24) & 16711935 | (h2 << 24 | h2 >>> 8) & 4278255360;
          f[(j + 64 >>> 9 << 4) + 14] = (g << 8 | g >>> 24) & 16711935 | (g << 24 | g >>> 8) & 4278255360;
          a2.sigBytes = 4 * (f.length + 1);
          this._process();
          a2 = this._hash;
          f = a2.words;
          for (g = 0; 4 > g; g++) j = f[g], f[g] = (j << 8 | j >>> 24) & 16711935 | (j << 24 | j >>> 8) & 4278255360;
          return a2;
        }, "_doFinalize"),
        clone: /* @__PURE__ */ __name2(function() {
          var a2 = s.clone.call(this);
          a2._hash = this._hash.clone();
          return a2;
        }, "clone")
      });
      r2.MD5 = s._createHelper(q);
      r2.HmacMD5 = s._createHmacHelper(q);
    })(Math);
    (function() {
      var k = CryptoJS, b = k.lib, m = b.WordArray, l = b.Hasher, d = [], b = k.algo.SHA1 = l.extend({ _doReset: /* @__PURE__ */ __name2(function() {
        this._hash = new m.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
      }, "_doReset"), _doProcessBlock: /* @__PURE__ */ __name2(function(n2, p) {
        for (var a = this._hash.words, e2 = a[0], f = a[1], h = a[2], j = a[3], b2 = a[4], c = 0; 80 > c; c++) {
          if (16 > c) d[c] = n2[p + c] | 0;
          else {
            var g = d[c - 3] ^ d[c - 8] ^ d[c - 14] ^ d[c - 16];
            d[c] = g << 1 | g >>> 31;
          }
          g = (e2 << 5 | e2 >>> 27) + b2 + d[c];
          g = 20 > c ? g + ((f & h | ~f & j) + 1518500249) : 40 > c ? g + ((f ^ h ^ j) + 1859775393) : 60 > c ? g + ((f & h | f & j | h & j) - 1894007588) : g + ((f ^ h ^ j) - 899497514);
          b2 = j;
          j = h;
          h = f << 30 | f >>> 2;
          f = e2;
          e2 = g;
        }
        a[0] = a[0] + e2 | 0;
        a[1] = a[1] + f | 0;
        a[2] = a[2] + h | 0;
        a[3] = a[3] + j | 0;
        a[4] = a[4] + b2 | 0;
      }, "_doProcessBlock"), _doFinalize: /* @__PURE__ */ __name2(function() {
        var b2 = this._data, d2 = b2.words, a = 8 * this._nDataBytes, e2 = 8 * b2.sigBytes;
        d2[e2 >>> 5] |= 128 << 24 - e2 % 32;
        d2[(e2 + 64 >>> 9 << 4) + 14] = Math.floor(a / 4294967296);
        d2[(e2 + 64 >>> 9 << 4) + 15] = a;
        b2.sigBytes = 4 * d2.length;
        this._process();
        return this._hash;
      }, "_doFinalize"), clone: /* @__PURE__ */ __name2(function() {
        var b2 = l.clone.call(this);
        b2._hash = this._hash.clone();
        return b2;
      }, "clone") });
      k.SHA1 = l._createHelper(b);
      k.HmacSHA1 = l._createHmacHelper(b);
    })();
    (function(k) {
      for (var g = CryptoJS, h = g.lib, v = h.WordArray, j = h.Hasher, h = g.algo, s = [], t3 = [], u = function(q) {
        return 4294967296 * (q - (q | 0)) | 0;
      }, l = 2, b = 0; 64 > b; ) {
        var d;
        a: {
          d = l;
          for (var w = k.sqrt(d), r2 = 2; r2 <= w; r2++) if (!(d % r2)) {
            d = false;
            break a;
          }
          d = true;
        }
        d && (8 > b && (s[b] = u(k.pow(l, 0.5))), t3[b] = u(k.pow(l, 1 / 3)), b++);
        l++;
      }
      var n2 = [], h = h.SHA256 = j.extend({ _doReset: /* @__PURE__ */ __name2(function() {
        this._hash = new v.init(s.slice(0));
      }, "_doReset"), _doProcessBlock: /* @__PURE__ */ __name2(function(q, h2) {
        for (var a = this._hash.words, c = a[0], d2 = a[1], b2 = a[2], k2 = a[3], f = a[4], g2 = a[5], j2 = a[6], l2 = a[7], e2 = 0; 64 > e2; e2++) {
          if (16 > e2) n2[e2] = q[h2 + e2] | 0;
          else {
            var m = n2[e2 - 15], p = n2[e2 - 2];
            n2[e2] = ((m << 25 | m >>> 7) ^ (m << 14 | m >>> 18) ^ m >>> 3) + n2[e2 - 7] + ((p << 15 | p >>> 17) ^ (p << 13 | p >>> 19) ^ p >>> 10) + n2[e2 - 16];
          }
          m = l2 + ((f << 26 | f >>> 6) ^ (f << 21 | f >>> 11) ^ (f << 7 | f >>> 25)) + (f & g2 ^ ~f & j2) + t3[e2] + n2[e2];
          p = ((c << 30 | c >>> 2) ^ (c << 19 | c >>> 13) ^ (c << 10 | c >>> 22)) + (c & d2 ^ c & b2 ^ d2 & b2);
          l2 = j2;
          j2 = g2;
          g2 = f;
          f = k2 + m | 0;
          k2 = b2;
          b2 = d2;
          d2 = c;
          c = m + p | 0;
        }
        a[0] = a[0] + c | 0;
        a[1] = a[1] + d2 | 0;
        a[2] = a[2] + b2 | 0;
        a[3] = a[3] + k2 | 0;
        a[4] = a[4] + f | 0;
        a[5] = a[5] + g2 | 0;
        a[6] = a[6] + j2 | 0;
        a[7] = a[7] + l2 | 0;
      }, "_doProcessBlock"), _doFinalize: /* @__PURE__ */ __name2(function() {
        var d2 = this._data, b2 = d2.words, a = 8 * this._nDataBytes, c = 8 * d2.sigBytes;
        b2[c >>> 5] |= 128 << 24 - c % 32;
        b2[(c + 64 >>> 9 << 4) + 14] = k.floor(a / 4294967296);
        b2[(c + 64 >>> 9 << 4) + 15] = a;
        d2.sigBytes = 4 * b2.length;
        this._process();
        return this._hash;
      }, "_doFinalize"), clone: /* @__PURE__ */ __name2(function() {
        var b2 = j.clone.call(this);
        b2._hash = this._hash.clone();
        return b2;
      }, "clone") });
      g.SHA256 = j._createHelper(h);
      g.HmacSHA256 = j._createHmacHelper(h);
    })(Math);
    (function() {
      var b = CryptoJS, d = b.lib.WordArray, a = b.algo, c = a.SHA256, a = a.SHA224 = c.extend({ _doReset: /* @__PURE__ */ __name2(function() {
        this._hash = new d.init([3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428]);
      }, "_doReset"), _doFinalize: /* @__PURE__ */ __name2(function() {
        var a2 = c._doFinalize.call(this);
        a2.sigBytes -= 4;
        return a2;
      }, "_doFinalize") });
      b.SHA224 = c._createHelper(a);
      b.HmacSHA224 = c._createHmacHelper(a);
    })();
    (function() {
      function a() {
        return d.create.apply(d, arguments);
      }
      __name(a, "a");
      __name2(a, "a");
      for (var n2 = CryptoJS, r2 = n2.lib.Hasher, e2 = n2.x64, d = e2.Word, T = e2.WordArray, e2 = n2.algo, ea = [
        a(1116352408, 3609767458),
        a(1899447441, 602891725),
        a(3049323471, 3964484399),
        a(3921009573, 2173295548),
        a(961987163, 4081628472),
        a(1508970993, 3053834265),
        a(2453635748, 2937671579),
        a(2870763221, 3664609560),
        a(3624381080, 2734883394),
        a(310598401, 1164996542),
        a(607225278, 1323610764),
        a(1426881987, 3590304994),
        a(1925078388, 4068182383),
        a(2162078206, 991336113),
        a(2614888103, 633803317),
        a(3248222580, 3479774868),
        a(3835390401, 2666613458),
        a(4022224774, 944711139),
        a(264347078, 2341262773),
        a(604807628, 2007800933),
        a(770255983, 1495990901),
        a(1249150122, 1856431235),
        a(1555081692, 3175218132),
        a(1996064986, 2198950837),
        a(2554220882, 3999719339),
        a(2821834349, 766784016),
        a(2952996808, 2566594879),
        a(3210313671, 3203337956),
        a(3336571891, 1034457026),
        a(3584528711, 2466948901),
        a(113926993, 3758326383),
        a(338241895, 168717936),
        a(666307205, 1188179964),
        a(773529912, 1546045734),
        a(1294757372, 1522805485),
        a(
          1396182291,
          2643833823
        ),
        a(1695183700, 2343527390),
        a(1986661051, 1014477480),
        a(2177026350, 1206759142),
        a(2456956037, 344077627),
        a(2730485921, 1290863460),
        a(2820302411, 3158454273),
        a(3259730800, 3505952657),
        a(3345764771, 106217008),
        a(3516065817, 3606008344),
        a(3600352804, 1432725776),
        a(4094571909, 1467031594),
        a(275423344, 851169720),
        a(430227734, 3100823752),
        a(506948616, 1363258195),
        a(659060556, 3750685593),
        a(883997877, 3785050280),
        a(958139571, 3318307427),
        a(1322822218, 3812723403),
        a(1537002063, 2003034995),
        a(1747873779, 3602036899),
        a(1955562222, 1575990012),
        a(2024104815, 1125592928),
        a(2227730452, 2716904306),
        a(2361852424, 442776044),
        a(2428436474, 593698344),
        a(2756734187, 3733110249),
        a(3204031479, 2999351573),
        a(3329325298, 3815920427),
        a(3391569614, 3928383900),
        a(3515267271, 566280711),
        a(3940187606, 3454069534),
        a(4118630271, 4000239992),
        a(116418474, 1914138554),
        a(174292421, 2731055270),
        a(289380356, 3203993006),
        a(460393269, 320620315),
        a(685471733, 587496836),
        a(852142971, 1086792851),
        a(1017036298, 365543100),
        a(1126000580, 2618297676),
        a(
          1288033470,
          3409855158
        ),
        a(1501505948, 4234509866),
        a(1607167915, 987167468),
        a(1816402316, 1246189591)
      ], v = [], w = 0; 80 > w; w++) v[w] = a();
      e2 = e2.SHA512 = r2.extend({ _doReset: /* @__PURE__ */ __name2(function() {
        this._hash = new T.init([new d.init(1779033703, 4089235720), new d.init(3144134277, 2227873595), new d.init(1013904242, 4271175723), new d.init(2773480762, 1595750129), new d.init(1359893119, 2917565137), new d.init(2600822924, 725511199), new d.init(528734635, 4215389547), new d.init(1541459225, 327033209)]);
      }, "_doReset"), _doProcessBlock: /* @__PURE__ */ __name2(function(a2, d2) {
        for (var f = this._hash.words, F = f[0], e3 = f[1], n3 = f[2], r3 = f[3], G = f[4], H = f[5], I = f[6], f = f[7], w2 = F.high, J = F.low, X = e3.high, K = e3.low, Y = n3.high, L = n3.low, Z = r3.high, M = r3.low, $ = G.high, N = G.low, aa = H.high, O = H.low, ba = I.high, P = I.low, ca = f.high, Q = f.low, k = w2, g = J, z2 = X, x = K, A = Y, y = L, U = Z, B = M, l = $, h = N, R = aa, C = O, S = ba, D = P, V = ca, E = Q, m = 0; 80 > m; m++) {
          var s = v[m];
          if (16 > m) var j = s.high = a2[d2 + 2 * m] | 0, b = s.low = a2[d2 + 2 * m + 1] | 0;
          else {
            var j = v[m - 15], b = j.high, p = j.low, j = (b >>> 1 | p << 31) ^ (b >>> 8 | p << 24) ^ b >>> 7, p = (p >>> 1 | b << 31) ^ (p >>> 8 | b << 24) ^ (p >>> 7 | b << 25), u = v[m - 2], b = u.high, c = u.low, u = (b >>> 19 | c << 13) ^ (b << 3 | c >>> 29) ^ b >>> 6, c = (c >>> 19 | b << 13) ^ (c << 3 | b >>> 29) ^ (c >>> 6 | b << 26), b = v[m - 7], W = b.high, t3 = v[m - 16], q = t3.high, t3 = t3.low, b = p + b.low, j = j + W + (b >>> 0 < p >>> 0 ? 1 : 0), b = b + c, j = j + u + (b >>> 0 < c >>> 0 ? 1 : 0), b = b + t3, j = j + q + (b >>> 0 < t3 >>> 0 ? 1 : 0);
            s.high = j;
            s.low = b;
          }
          var W = l & R ^ ~l & S, t3 = h & C ^ ~h & D, s = k & z2 ^ k & A ^ z2 & A, T2 = g & x ^ g & y ^ x & y, p = (k >>> 28 | g << 4) ^ (k << 30 | g >>> 2) ^ (k << 25 | g >>> 7), u = (g >>> 28 | k << 4) ^ (g << 30 | k >>> 2) ^ (g << 25 | k >>> 7), c = ea[m], fa = c.high, da = c.low, c = E + ((h >>> 14 | l << 18) ^ (h >>> 18 | l << 14) ^ (h << 23 | l >>> 9)), q = V + ((l >>> 14 | h << 18) ^ (l >>> 18 | h << 14) ^ (l << 23 | h >>> 9)) + (c >>> 0 < E >>> 0 ? 1 : 0), c = c + t3, q = q + W + (c >>> 0 < t3 >>> 0 ? 1 : 0), c = c + da, q = q + fa + (c >>> 0 < da >>> 0 ? 1 : 0), c = c + b, q = q + j + (c >>> 0 < b >>> 0 ? 1 : 0), b = u + T2, s = p + s + (b >>> 0 < u >>> 0 ? 1 : 0), V = S, E = D, S = R, D = C, R = l, C = h, h = B + c | 0, l = U + q + (h >>> 0 < B >>> 0 ? 1 : 0) | 0, U = A, B = y, A = z2, y = x, z2 = k, x = g, g = c + b | 0, k = q + s + (g >>> 0 < c >>> 0 ? 1 : 0) | 0;
        }
        J = F.low = J + g;
        F.high = w2 + k + (J >>> 0 < g >>> 0 ? 1 : 0);
        K = e3.low = K + x;
        e3.high = X + z2 + (K >>> 0 < x >>> 0 ? 1 : 0);
        L = n3.low = L + y;
        n3.high = Y + A + (L >>> 0 < y >>> 0 ? 1 : 0);
        M = r3.low = M + B;
        r3.high = Z + U + (M >>> 0 < B >>> 0 ? 1 : 0);
        N = G.low = N + h;
        G.high = $ + l + (N >>> 0 < h >>> 0 ? 1 : 0);
        O = H.low = O + C;
        H.high = aa + R + (O >>> 0 < C >>> 0 ? 1 : 0);
        P = I.low = P + D;
        I.high = ba + S + (P >>> 0 < D >>> 0 ? 1 : 0);
        Q = f.low = Q + E;
        f.high = ca + V + (Q >>> 0 < E >>> 0 ? 1 : 0);
      }, "_doProcessBlock"), _doFinalize: /* @__PURE__ */ __name2(function() {
        var a2 = this._data, d2 = a2.words, f = 8 * this._nDataBytes, e3 = 8 * a2.sigBytes;
        d2[e3 >>> 5] |= 128 << 24 - e3 % 32;
        d2[(e3 + 128 >>> 10 << 5) + 30] = Math.floor(f / 4294967296);
        d2[(e3 + 128 >>> 10 << 5) + 31] = f;
        a2.sigBytes = 4 * d2.length;
        this._process();
        return this._hash.toX32();
      }, "_doFinalize"), clone: /* @__PURE__ */ __name2(function() {
        var a2 = r2.clone.call(this);
        a2._hash = this._hash.clone();
        return a2;
      }, "clone"), blockSize: 32 });
      n2.SHA512 = r2._createHelper(e2);
      n2.HmacSHA512 = r2._createHmacHelper(e2);
    })();
    (function() {
      var c = CryptoJS, a = c.x64, b = a.Word, e2 = a.WordArray, a = c.algo, d = a.SHA512, a = a.SHA384 = d.extend({ _doReset: /* @__PURE__ */ __name2(function() {
        this._hash = new e2.init([new b.init(3418070365, 3238371032), new b.init(1654270250, 914150663), new b.init(2438529370, 812702999), new b.init(355462360, 4144912697), new b.init(1731405415, 4290775857), new b.init(2394180231, 1750603025), new b.init(3675008525, 1694076839), new b.init(1203062813, 3204075428)]);
      }, "_doReset"), _doFinalize: /* @__PURE__ */ __name2(function() {
        var a2 = d._doFinalize.call(this);
        a2.sigBytes -= 16;
        return a2;
      }, "_doFinalize") });
      c.SHA384 = d._createHelper(a);
      c.HmacSHA384 = d._createHmacHelper(a);
    })();
    (function() {
      var q = CryptoJS, d = q.lib, n2 = d.WordArray, p = d.Hasher, d = q.algo, x = n2.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13]), y = n2.create([5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11]), z2 = n2.create([
        11,
        14,
        15,
        12,
        5,
        8,
        7,
        9,
        11,
        13,
        14,
        15,
        6,
        7,
        9,
        8,
        7,
        6,
        8,
        13,
        11,
        9,
        7,
        15,
        7,
        12,
        15,
        9,
        11,
        7,
        13,
        12,
        11,
        13,
        6,
        7,
        14,
        9,
        13,
        15,
        14,
        8,
        13,
        6,
        5,
        12,
        7,
        5,
        11,
        12,
        14,
        15,
        14,
        15,
        9,
        8,
        9,
        14,
        5,
        6,
        8,
        6,
        5,
        12,
        9,
        15,
        5,
        11,
        6,
        8,
        13,
        12,
        5,
        12,
        13,
        14,
        11,
        8,
        5,
        6
      ]), A = n2.create([8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11]), B = n2.create([0, 1518500249, 1859775393, 2400959708, 2840853838]), C = n2.create([
        1352829926,
        1548603684,
        1836072691,
        2053994217,
        0
      ]), d = d.RIPEMD160 = p.extend({ _doReset: /* @__PURE__ */ __name2(function() {
        this._hash = n2.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
      }, "_doReset"), _doProcessBlock: /* @__PURE__ */ __name2(function(e2, v) {
        for (var b = 0; 16 > b; b++) {
          var c = v + b, f = e2[c];
          e2[c] = (f << 8 | f >>> 24) & 16711935 | (f << 24 | f >>> 8) & 4278255360;
        }
        var c = this._hash.words, f = B.words, d2 = C.words, n3 = x.words, q2 = y.words, p2 = z2.words, w = A.words, t3, g, h, j, r2, u, k, l, m, s;
        u = t3 = c[0];
        k = g = c[1];
        l = h = c[2];
        m = j = c[3];
        s = r2 = c[4];
        for (var a, b = 0; 80 > b; b += 1) a = t3 + e2[v + n3[b]] | 0, a = 16 > b ? a + ((g ^ h ^ j) + f[0]) : 32 > b ? a + ((g & h | ~g & j) + f[1]) : 48 > b ? a + (((g | ~h) ^ j) + f[2]) : 64 > b ? a + ((g & j | h & ~j) + f[3]) : a + ((g ^ (h | ~j)) + f[4]), a |= 0, a = a << p2[b] | a >>> 32 - p2[b], a = a + r2 | 0, t3 = r2, r2 = j, j = h << 10 | h >>> 22, h = g, g = a, a = u + e2[v + q2[b]] | 0, a = 16 > b ? a + ((k ^ (l | ~m)) + d2[0]) : 32 > b ? a + ((k & m | l & ~m) + d2[1]) : 48 > b ? a + (((k | ~l) ^ m) + d2[2]) : 64 > b ? a + ((k & l | ~k & m) + d2[3]) : a + ((k ^ l ^ m) + d2[4]), a |= 0, a = a << w[b] | a >>> 32 - w[b], a = a + s | 0, u = s, s = m, m = l << 10 | l >>> 22, l = k, k = a;
        a = c[1] + h + m | 0;
        c[1] = c[2] + j + s | 0;
        c[2] = c[3] + r2 + u | 0;
        c[3] = c[4] + t3 + k | 0;
        c[4] = c[0] + g + l | 0;
        c[0] = a;
      }, "_doProcessBlock"), _doFinalize: /* @__PURE__ */ __name2(function() {
        var e2 = this._data, d2 = e2.words, b = 8 * this._nDataBytes, c = 8 * e2.sigBytes;
        d2[c >>> 5] |= 128 << 24 - c % 32;
        d2[(c + 64 >>> 9 << 4) + 14] = (b << 8 | b >>> 24) & 16711935 | (b << 24 | b >>> 8) & 4278255360;
        e2.sigBytes = 4 * (d2.length + 1);
        this._process();
        e2 = this._hash;
        d2 = e2.words;
        for (b = 0; 5 > b; b++) c = d2[b], d2[b] = (c << 8 | c >>> 24) & 16711935 | (c << 24 | c >>> 8) & 4278255360;
        return e2;
      }, "_doFinalize"), clone: /* @__PURE__ */ __name2(function() {
        var d2 = p.clone.call(this);
        d2._hash = this._hash.clone();
        return d2;
      }, "clone") });
      q.RIPEMD160 = p._createHelper(d);
      q.HmacRIPEMD160 = p._createHmacHelper(d);
    })(Math);
    (function() {
      var c = CryptoJS, k = c.enc.Utf8;
      c.algo.HMAC = c.lib.Base.extend({ init: /* @__PURE__ */ __name2(function(a, b) {
        a = this._hasher = new a.init();
        "string" == typeof b && (b = k.parse(b));
        var c2 = a.blockSize, e2 = 4 * c2;
        b.sigBytes > e2 && (b = a.finalize(b));
        b.clamp();
        for (var f = this._oKey = b.clone(), g = this._iKey = b.clone(), h = f.words, j = g.words, d = 0; d < c2; d++) h[d] ^= 1549556828, j[d] ^= 909522486;
        f.sigBytes = g.sigBytes = e2;
        this.reset();
      }, "init"), reset: /* @__PURE__ */ __name2(function() {
        var a = this._hasher;
        a.reset();
        a.update(this._iKey);
      }, "reset"), update: /* @__PURE__ */ __name2(function(a) {
        this._hasher.update(a);
        return this;
      }, "update"), finalize: /* @__PURE__ */ __name2(function(a) {
        var b = this._hasher;
        a = b.finalize(a);
        b.reset();
        return b.finalize(this._oKey.clone().concat(a));
      }, "finalize") });
    })();
    (function() {
      var b = CryptoJS, a = b.lib, d = a.Base, m = a.WordArray, a = b.algo, q = a.HMAC, l = a.PBKDF2 = d.extend({ cfg: d.extend({ keySize: 4, hasher: a.SHA1, iterations: 1 }), init: /* @__PURE__ */ __name2(function(a2) {
        this.cfg = this.cfg.extend(a2);
      }, "init"), compute: /* @__PURE__ */ __name2(function(a2, b2) {
        for (var c = this.cfg, f = q.create(c.hasher, a2), g = m.create(), d2 = m.create([1]), l2 = g.words, r2 = d2.words, n2 = c.keySize, c = c.iterations; l2.length < n2; ) {
          var h = f.update(b2).finalize(d2);
          f.reset();
          for (var j = h.words, s = j.length, k = h, p = 1; p < c; p++) {
            k = f.finalize(k);
            f.reset();
            for (var t3 = k.words, e2 = 0; e2 < s; e2++) j[e2] ^= t3[e2];
          }
          g.concat(h);
          r2[0]++;
        }
        g.sigBytes = 4 * n2;
        return g;
      }, "compute") });
      b.PBKDF2 = function(a2, b2, c) {
        return l.create(c).compute(a2, b2);
      };
    })();
    var b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var b64pad = "=";
    function hex2b64(d) {
      var b;
      var e2;
      var a = "";
      for (b = 0; b + 3 <= d.length; b += 3) {
        e2 = parseInt(d.substring(b, b + 3), 16);
        a += b64map.charAt(e2 >> 6) + b64map.charAt(e2 & 63);
      }
      if (b + 1 == d.length) {
        e2 = parseInt(d.substring(b, b + 1), 16);
        a += b64map.charAt(e2 << 2);
      } else {
        if (b + 2 == d.length) {
          e2 = parseInt(d.substring(b, b + 2), 16);
          a += b64map.charAt(e2 >> 2) + b64map.charAt((e2 & 3) << 4);
        }
      }
      if (b64pad) {
        while ((a.length & 3) > 0) {
          a += b64pad;
        }
      }
      return a;
    }
    __name(hex2b64, "hex2b64");
    __name2(hex2b64, "hex2b64");
    function b64tohex(f) {
      var d = "";
      var e2;
      var b = 0;
      var c;
      var a;
      for (e2 = 0; e2 < f.length; ++e2) {
        if (f.charAt(e2) == b64pad) {
          break;
        }
        a = b64map.indexOf(f.charAt(e2));
        if (a < 0) {
          continue;
        }
        if (b == 0) {
          d += int2char(a >> 2);
          c = a & 3;
          b = 1;
        } else {
          if (b == 1) {
            d += int2char(c << 2 | a >> 4);
            c = a & 15;
            b = 2;
          } else {
            if (b == 2) {
              d += int2char(c);
              d += int2char(a >> 2);
              c = a & 3;
              b = 3;
            } else {
              d += int2char(c << 2 | a >> 4);
              d += int2char(a & 15);
              b = 0;
            }
          }
        }
      }
      if (b == 1) {
        d += int2char(c << 2);
      }
      return d;
    }
    __name(b64tohex, "b64tohex");
    __name2(b64tohex, "b64tohex");
    function b64toBA(e2) {
      var d = b64tohex(e2);
      var c;
      var b = new Array();
      for (c = 0; 2 * c < d.length; ++c) {
        b[c] = parseInt(d.substring(2 * c, 2 * c + 2), 16);
      }
      return b;
    }
    __name(b64toBA, "b64toBA");
    __name2(b64toBA, "b64toBA");
    var dbits;
    var canary = 244837814094590;
    var j_lm = (canary & 16777215) == 15715070;
    function BigInteger(e2, d, f) {
      if (e2 != null) {
        if ("number" == typeof e2) {
          this.fromNumber(e2, d, f);
        } else {
          if (d == null && "string" != typeof e2) {
            this.fromString(e2, 256);
          } else {
            this.fromString(e2, d);
          }
        }
      }
    }
    __name(BigInteger, "BigInteger");
    __name2(BigInteger, "BigInteger");
    function nbi() {
      return new BigInteger(null);
    }
    __name(nbi, "nbi");
    __name2(nbi, "nbi");
    function am1(f, a, b, e2, h, g) {
      while (--g >= 0) {
        var d = a * this[f++] + b[e2] + h;
        h = Math.floor(d / 67108864);
        b[e2++] = d & 67108863;
      }
      return h;
    }
    __name(am1, "am1");
    __name2(am1, "am1");
    function am2(f, q, r2, e2, o2, a) {
      var k = q & 32767, p = q >> 15;
      while (--a >= 0) {
        var d = this[f] & 32767;
        var g = this[f++] >> 15;
        var b = p * d + g * k;
        d = k * d + ((b & 32767) << 15) + r2[e2] + (o2 & 1073741823);
        o2 = (d >>> 30) + (b >>> 15) + p * g + (o2 >>> 30);
        r2[e2++] = d & 1073741823;
      }
      return o2;
    }
    __name(am2, "am2");
    __name2(am2, "am2");
    function am3(f, q, r2, e2, o2, a) {
      var k = q & 16383, p = q >> 14;
      while (--a >= 0) {
        var d = this[f] & 16383;
        var g = this[f++] >> 14;
        var b = p * d + g * k;
        d = k * d + ((b & 16383) << 14) + r2[e2] + o2;
        o2 = (d >> 28) + (b >> 14) + p * g;
        r2[e2++] = d & 268435455;
      }
      return o2;
    }
    __name(am3, "am3");
    __name2(am3, "am3");
    if (j_lm && navigator.appName == "Microsoft Internet Explorer") {
      BigInteger.prototype.am = am2;
      dbits = 30;
    } else {
      if (j_lm && navigator.appName != "Netscape") {
        BigInteger.prototype.am = am1;
        dbits = 26;
      } else {
        BigInteger.prototype.am = am3;
        dbits = 28;
      }
    }
    BigInteger.prototype.DB = dbits;
    BigInteger.prototype.DM = (1 << dbits) - 1;
    BigInteger.prototype.DV = 1 << dbits;
    var BI_FP = 52;
    BigInteger.prototype.FV = Math.pow(2, BI_FP);
    BigInteger.prototype.F1 = BI_FP - dbits;
    BigInteger.prototype.F2 = 2 * dbits - BI_FP;
    var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
    var BI_RC = new Array();
    var rr;
    var vv;
    rr = "0".charCodeAt(0);
    for (vv = 0; vv <= 9; ++vv) {
      BI_RC[rr++] = vv;
    }
    rr = "a".charCodeAt(0);
    for (vv = 10; vv < 36; ++vv) {
      BI_RC[rr++] = vv;
    }
    rr = "A".charCodeAt(0);
    for (vv = 10; vv < 36; ++vv) {
      BI_RC[rr++] = vv;
    }
    function int2char(a) {
      return BI_RM.charAt(a);
    }
    __name(int2char, "int2char");
    __name2(int2char, "int2char");
    function intAt(b, a) {
      var d = BI_RC[b.charCodeAt(a)];
      return d == null ? -1 : d;
    }
    __name(intAt, "intAt");
    __name2(intAt, "intAt");
    function bnpCopyTo(b) {
      for (var a = this.t - 1; a >= 0; --a) {
        b[a] = this[a];
      }
      b.t = this.t;
      b.s = this.s;
    }
    __name(bnpCopyTo, "bnpCopyTo");
    __name2(bnpCopyTo, "bnpCopyTo");
    function bnpFromInt(a) {
      this.t = 1;
      this.s = a < 0 ? -1 : 0;
      if (a > 0) {
        this[0] = a;
      } else {
        if (a < -1) {
          this[0] = a + this.DV;
        } else {
          this.t = 0;
        }
      }
    }
    __name(bnpFromInt, "bnpFromInt");
    __name2(bnpFromInt, "bnpFromInt");
    function nbv(a) {
      var b = nbi();
      b.fromInt(a);
      return b;
    }
    __name(nbv, "nbv");
    __name2(nbv, "nbv");
    function bnpFromString(h, c) {
      var e2;
      if (c == 16) {
        e2 = 4;
      } else {
        if (c == 8) {
          e2 = 3;
        } else {
          if (c == 256) {
            e2 = 8;
          } else {
            if (c == 2) {
              e2 = 1;
            } else {
              if (c == 32) {
                e2 = 5;
              } else {
                if (c == 4) {
                  e2 = 2;
                } else {
                  this.fromRadix(h, c);
                  return;
                }
              }
            }
          }
        }
      }
      this.t = 0;
      this.s = 0;
      var g = h.length, d = false, f = 0;
      while (--g >= 0) {
        var a = e2 == 8 ? h[g] & 255 : intAt(h, g);
        if (a < 0) {
          if (h.charAt(g) == "-") {
            d = true;
          }
          continue;
        }
        d = false;
        if (f == 0) {
          this[this.t++] = a;
        } else {
          if (f + e2 > this.DB) {
            this[this.t - 1] |= (a & (1 << this.DB - f) - 1) << f;
            this[this.t++] = a >> this.DB - f;
          } else {
            this[this.t - 1] |= a << f;
          }
        }
        f += e2;
        if (f >= this.DB) {
          f -= this.DB;
        }
      }
      if (e2 == 8 && (h[0] & 128) != 0) {
        this.s = -1;
        if (f > 0) {
          this[this.t - 1] |= (1 << this.DB - f) - 1 << f;
        }
      }
      this.clamp();
      if (d) {
        BigInteger.ZERO.subTo(this, this);
      }
    }
    __name(bnpFromString, "bnpFromString");
    __name2(bnpFromString, "bnpFromString");
    function bnpClamp() {
      var a = this.s & this.DM;
      while (this.t > 0 && this[this.t - 1] == a) {
        --this.t;
      }
    }
    __name(bnpClamp, "bnpClamp");
    __name2(bnpClamp, "bnpClamp");
    function bnToString(c) {
      if (this.s < 0) {
        return "-" + this.negate().toString(c);
      }
      var e2;
      if (c == 16) {
        e2 = 4;
      } else {
        if (c == 8) {
          e2 = 3;
        } else {
          if (c == 2) {
            e2 = 1;
          } else {
            if (c == 32) {
              e2 = 5;
            } else {
              if (c == 4) {
                e2 = 2;
              } else {
                return this.toRadix(c);
              }
            }
          }
        }
      }
      var g = (1 << e2) - 1, l, a = false, h = "", f = this.t;
      var j = this.DB - f * this.DB % e2;
      if (f-- > 0) {
        if (j < this.DB && (l = this[f] >> j) > 0) {
          a = true;
          h = int2char(l);
        }
        while (f >= 0) {
          if (j < e2) {
            l = (this[f] & (1 << j) - 1) << e2 - j;
            l |= this[--f] >> (j += this.DB - e2);
          } else {
            l = this[f] >> (j -= e2) & g;
            if (j <= 0) {
              j += this.DB;
              --f;
            }
          }
          if (l > 0) {
            a = true;
          }
          if (a) {
            h += int2char(l);
          }
        }
      }
      return a ? h : "0";
    }
    __name(bnToString, "bnToString");
    __name2(bnToString, "bnToString");
    function bnNegate() {
      var a = nbi();
      BigInteger.ZERO.subTo(this, a);
      return a;
    }
    __name(bnNegate, "bnNegate");
    __name2(bnNegate, "bnNegate");
    function bnAbs() {
      return this.s < 0 ? this.negate() : this;
    }
    __name(bnAbs, "bnAbs");
    __name2(bnAbs, "bnAbs");
    function bnCompareTo(b) {
      var d = this.s - b.s;
      if (d != 0) {
        return d;
      }
      var c = this.t;
      d = c - b.t;
      if (d != 0) {
        return this.s < 0 ? -d : d;
      }
      while (--c >= 0) {
        if ((d = this[c] - b[c]) != 0) {
          return d;
        }
      }
      return 0;
    }
    __name(bnCompareTo, "bnCompareTo");
    __name2(bnCompareTo, "bnCompareTo");
    function nbits(a) {
      var c = 1, b;
      if ((b = a >>> 16) != 0) {
        a = b;
        c += 16;
      }
      if ((b = a >> 8) != 0) {
        a = b;
        c += 8;
      }
      if ((b = a >> 4) != 0) {
        a = b;
        c += 4;
      }
      if ((b = a >> 2) != 0) {
        a = b;
        c += 2;
      }
      if ((b = a >> 1) != 0) {
        a = b;
        c += 1;
      }
      return c;
    }
    __name(nbits, "nbits");
    __name2(nbits, "nbits");
    function bnBitLength() {
      if (this.t <= 0) {
        return 0;
      }
      return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM);
    }
    __name(bnBitLength, "bnBitLength");
    __name2(bnBitLength, "bnBitLength");
    function bnpDLShiftTo(c, b) {
      var a;
      for (a = this.t - 1; a >= 0; --a) {
        b[a + c] = this[a];
      }
      for (a = c - 1; a >= 0; --a) {
        b[a] = 0;
      }
      b.t = this.t + c;
      b.s = this.s;
    }
    __name(bnpDLShiftTo, "bnpDLShiftTo");
    __name2(bnpDLShiftTo, "bnpDLShiftTo");
    function bnpDRShiftTo(c, b) {
      for (var a = c; a < this.t; ++a) {
        b[a - c] = this[a];
      }
      b.t = Math.max(this.t - c, 0);
      b.s = this.s;
    }
    __name(bnpDRShiftTo, "bnpDRShiftTo");
    __name2(bnpDRShiftTo, "bnpDRShiftTo");
    function bnpLShiftTo(j, e2) {
      var b = j % this.DB;
      var a = this.DB - b;
      var g = (1 << a) - 1;
      var f = Math.floor(j / this.DB), h = this.s << b & this.DM, d;
      for (d = this.t - 1; d >= 0; --d) {
        e2[d + f + 1] = this[d] >> a | h;
        h = (this[d] & g) << b;
      }
      for (d = f - 1; d >= 0; --d) {
        e2[d] = 0;
      }
      e2[f] = h;
      e2.t = this.t + f + 1;
      e2.s = this.s;
      e2.clamp();
    }
    __name(bnpLShiftTo, "bnpLShiftTo");
    __name2(bnpLShiftTo, "bnpLShiftTo");
    function bnpRShiftTo(g, d) {
      d.s = this.s;
      var e2 = Math.floor(g / this.DB);
      if (e2 >= this.t) {
        d.t = 0;
        return;
      }
      var b = g % this.DB;
      var a = this.DB - b;
      var f = (1 << b) - 1;
      d[0] = this[e2] >> b;
      for (var c = e2 + 1; c < this.t; ++c) {
        d[c - e2 - 1] |= (this[c] & f) << a;
        d[c - e2] = this[c] >> b;
      }
      if (b > 0) {
        d[this.t - e2 - 1] |= (this.s & f) << a;
      }
      d.t = this.t - e2;
      d.clamp();
    }
    __name(bnpRShiftTo, "bnpRShiftTo");
    __name2(bnpRShiftTo, "bnpRShiftTo");
    function bnpSubTo(d, f) {
      var e2 = 0, g = 0, b = Math.min(d.t, this.t);
      while (e2 < b) {
        g += this[e2] - d[e2];
        f[e2++] = g & this.DM;
        g >>= this.DB;
      }
      if (d.t < this.t) {
        g -= d.s;
        while (e2 < this.t) {
          g += this[e2];
          f[e2++] = g & this.DM;
          g >>= this.DB;
        }
        g += this.s;
      } else {
        g += this.s;
        while (e2 < d.t) {
          g -= d[e2];
          f[e2++] = g & this.DM;
          g >>= this.DB;
        }
        g -= d.s;
      }
      f.s = g < 0 ? -1 : 0;
      if (g < -1) {
        f[e2++] = this.DV + g;
      } else {
        if (g > 0) {
          f[e2++] = g;
        }
      }
      f.t = e2;
      f.clamp();
    }
    __name(bnpSubTo, "bnpSubTo");
    __name2(bnpSubTo, "bnpSubTo");
    function bnpMultiplyTo(c, e2) {
      var b = this.abs(), f = c.abs();
      var d = b.t;
      e2.t = d + f.t;
      while (--d >= 0) {
        e2[d] = 0;
      }
      for (d = 0; d < f.t; ++d) {
        e2[d + b.t] = b.am(0, f[d], e2, d, 0, b.t);
      }
      e2.s = 0;
      e2.clamp();
      if (this.s != c.s) {
        BigInteger.ZERO.subTo(e2, e2);
      }
    }
    __name(bnpMultiplyTo, "bnpMultiplyTo");
    __name2(bnpMultiplyTo, "bnpMultiplyTo");
    function bnpSquareTo(d) {
      var a = this.abs();
      var b = d.t = 2 * a.t;
      while (--b >= 0) {
        d[b] = 0;
      }
      for (b = 0; b < a.t - 1; ++b) {
        var e2 = a.am(b, a[b], d, 2 * b, 0, 1);
        if ((d[b + a.t] += a.am(b + 1, 2 * a[b], d, 2 * b + 1, e2, a.t - b - 1)) >= a.DV) {
          d[b + a.t] -= a.DV;
          d[b + a.t + 1] = 1;
        }
      }
      if (d.t > 0) {
        d[d.t - 1] += a.am(b, a[b], d, 2 * b, 0, 1);
      }
      d.s = 0;
      d.clamp();
    }
    __name(bnpSquareTo, "bnpSquareTo");
    __name2(bnpSquareTo, "bnpSquareTo");
    function bnpDivRemTo(n2, h, g) {
      var w = n2.abs();
      if (w.t <= 0) {
        return;
      }
      var k = this.abs();
      if (k.t < w.t) {
        if (h != null) {
          h.fromInt(0);
        }
        if (g != null) {
          this.copyTo(g);
        }
        return;
      }
      if (g == null) {
        g = nbi();
      }
      var d = nbi(), a = this.s, l = n2.s;
      var v = this.DB - nbits(w[w.t - 1]);
      if (v > 0) {
        w.lShiftTo(v, d);
        k.lShiftTo(v, g);
      } else {
        w.copyTo(d);
        k.copyTo(g);
      }
      var p = d.t;
      var b = d[p - 1];
      if (b == 0) {
        return;
      }
      var o2 = b * (1 << this.F1) + (p > 1 ? d[p - 2] >> this.F2 : 0);
      var A = this.FV / o2, z2 = (1 << this.F1) / o2, x = 1 << this.F2;
      var u = g.t, s = u - p, f = h == null ? nbi() : h;
      d.dlShiftTo(s, f);
      if (g.compareTo(f) >= 0) {
        g[g.t++] = 1;
        g.subTo(f, g);
      }
      BigInteger.ONE.dlShiftTo(p, f);
      f.subTo(d, d);
      while (d.t < p) {
        d[d.t++] = 0;
      }
      while (--s >= 0) {
        var c = g[--u] == b ? this.DM : Math.floor(g[u] * A + (g[u - 1] + x) * z2);
        if ((g[u] += d.am(0, c, g, s, 0, p)) < c) {
          d.dlShiftTo(s, f);
          g.subTo(f, g);
          while (g[u] < --c) {
            g.subTo(f, g);
          }
        }
      }
      if (h != null) {
        g.drShiftTo(p, h);
        if (a != l) {
          BigInteger.ZERO.subTo(h, h);
        }
      }
      g.t = p;
      g.clamp();
      if (v > 0) {
        g.rShiftTo(v, g);
      }
      if (a < 0) {
        BigInteger.ZERO.subTo(g, g);
      }
    }
    __name(bnpDivRemTo, "bnpDivRemTo");
    __name2(bnpDivRemTo, "bnpDivRemTo");
    function bnMod(b) {
      var c = nbi();
      this.abs().divRemTo(b, null, c);
      if (this.s < 0 && c.compareTo(BigInteger.ZERO) > 0) {
        b.subTo(c, c);
      }
      return c;
    }
    __name(bnMod, "bnMod");
    __name2(bnMod, "bnMod");
    function Classic(a) {
      this.m = a;
    }
    __name(Classic, "Classic");
    __name2(Classic, "Classic");
    function cConvert(a) {
      if (a.s < 0 || a.compareTo(this.m) >= 0) {
        return a.mod(this.m);
      } else {
        return a;
      }
    }
    __name(cConvert, "cConvert");
    __name2(cConvert, "cConvert");
    function cRevert(a) {
      return a;
    }
    __name(cRevert, "cRevert");
    __name2(cRevert, "cRevert");
    function cReduce(a) {
      a.divRemTo(this.m, null, a);
    }
    __name(cReduce, "cReduce");
    __name2(cReduce, "cReduce");
    function cMulTo(a, c, b) {
      a.multiplyTo(c, b);
      this.reduce(b);
    }
    __name(cMulTo, "cMulTo");
    __name2(cMulTo, "cMulTo");
    function cSqrTo(a, b) {
      a.squareTo(b);
      this.reduce(b);
    }
    __name(cSqrTo, "cSqrTo");
    __name2(cSqrTo, "cSqrTo");
    Classic.prototype.convert = cConvert;
    Classic.prototype.revert = cRevert;
    Classic.prototype.reduce = cReduce;
    Classic.prototype.mulTo = cMulTo;
    Classic.prototype.sqrTo = cSqrTo;
    function bnpInvDigit() {
      if (this.t < 1) {
        return 0;
      }
      var a = this[0];
      if ((a & 1) == 0) {
        return 0;
      }
      var b = a & 3;
      b = b * (2 - (a & 15) * b) & 15;
      b = b * (2 - (a & 255) * b) & 255;
      b = b * (2 - ((a & 65535) * b & 65535)) & 65535;
      b = b * (2 - a * b % this.DV) % this.DV;
      return b > 0 ? this.DV - b : -b;
    }
    __name(bnpInvDigit, "bnpInvDigit");
    __name2(bnpInvDigit, "bnpInvDigit");
    function Montgomery(a) {
      this.m = a;
      this.mp = a.invDigit();
      this.mpl = this.mp & 32767;
      this.mph = this.mp >> 15;
      this.um = (1 << a.DB - 15) - 1;
      this.mt2 = 2 * a.t;
    }
    __name(Montgomery, "Montgomery");
    __name2(Montgomery, "Montgomery");
    function montConvert(a) {
      var b = nbi();
      a.abs().dlShiftTo(this.m.t, b);
      b.divRemTo(this.m, null, b);
      if (a.s < 0 && b.compareTo(BigInteger.ZERO) > 0) {
        this.m.subTo(b, b);
      }
      return b;
    }
    __name(montConvert, "montConvert");
    __name2(montConvert, "montConvert");
    function montRevert(a) {
      var b = nbi();
      a.copyTo(b);
      this.reduce(b);
      return b;
    }
    __name(montRevert, "montRevert");
    __name2(montRevert, "montRevert");
    function montReduce(a) {
      while (a.t <= this.mt2) {
        a[a.t++] = 0;
      }
      for (var c = 0; c < this.m.t; ++c) {
        var b = a[c] & 32767;
        var d = b * this.mpl + ((b * this.mph + (a[c] >> 15) * this.mpl & this.um) << 15) & a.DM;
        b = c + this.m.t;
        a[b] += this.m.am(0, d, a, c, 0, this.m.t);
        while (a[b] >= a.DV) {
          a[b] -= a.DV;
          a[++b]++;
        }
      }
      a.clamp();
      a.drShiftTo(this.m.t, a);
      if (a.compareTo(this.m) >= 0) {
        a.subTo(this.m, a);
      }
    }
    __name(montReduce, "montReduce");
    __name2(montReduce, "montReduce");
    function montSqrTo(a, b) {
      a.squareTo(b);
      this.reduce(b);
    }
    __name(montSqrTo, "montSqrTo");
    __name2(montSqrTo, "montSqrTo");
    function montMulTo(a, c, b) {
      a.multiplyTo(c, b);
      this.reduce(b);
    }
    __name(montMulTo, "montMulTo");
    __name2(montMulTo, "montMulTo");
    Montgomery.prototype.convert = montConvert;
    Montgomery.prototype.revert = montRevert;
    Montgomery.prototype.reduce = montReduce;
    Montgomery.prototype.mulTo = montMulTo;
    Montgomery.prototype.sqrTo = montSqrTo;
    function bnpIsEven() {
      return (this.t > 0 ? this[0] & 1 : this.s) == 0;
    }
    __name(bnpIsEven, "bnpIsEven");
    __name2(bnpIsEven, "bnpIsEven");
    function bnpExp(h, j) {
      if (h > 4294967295 || h < 1) {
        return BigInteger.ONE;
      }
      var f = nbi(), a = nbi(), d = j.convert(this), c = nbits(h) - 1;
      d.copyTo(f);
      while (--c >= 0) {
        j.sqrTo(f, a);
        if ((h & 1 << c) > 0) {
          j.mulTo(a, d, f);
        } else {
          var b = f;
          f = a;
          a = b;
        }
      }
      return j.revert(f);
    }
    __name(bnpExp, "bnpExp");
    __name2(bnpExp, "bnpExp");
    function bnModPowInt(b, a) {
      var c;
      if (b < 256 || a.isEven()) {
        c = new Classic(a);
      } else {
        c = new Montgomery(a);
      }
      return this.exp(b, c);
    }
    __name(bnModPowInt, "bnModPowInt");
    __name2(bnModPowInt, "bnModPowInt");
    BigInteger.prototype.copyTo = bnpCopyTo;
    BigInteger.prototype.fromInt = bnpFromInt;
    BigInteger.prototype.fromString = bnpFromString;
    BigInteger.prototype.clamp = bnpClamp;
    BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
    BigInteger.prototype.drShiftTo = bnpDRShiftTo;
    BigInteger.prototype.lShiftTo = bnpLShiftTo;
    BigInteger.prototype.rShiftTo = bnpRShiftTo;
    BigInteger.prototype.subTo = bnpSubTo;
    BigInteger.prototype.multiplyTo = bnpMultiplyTo;
    BigInteger.prototype.squareTo = bnpSquareTo;
    BigInteger.prototype.divRemTo = bnpDivRemTo;
    BigInteger.prototype.invDigit = bnpInvDigit;
    BigInteger.prototype.isEven = bnpIsEven;
    BigInteger.prototype.exp = bnpExp;
    BigInteger.prototype.toString = bnToString;
    BigInteger.prototype.negate = bnNegate;
    BigInteger.prototype.abs = bnAbs;
    BigInteger.prototype.compareTo = bnCompareTo;
    BigInteger.prototype.bitLength = bnBitLength;
    BigInteger.prototype.mod = bnMod;
    BigInteger.prototype.modPowInt = bnModPowInt;
    BigInteger.ZERO = nbv(0);
    BigInteger.ONE = nbv(1);
    function bnClone() {
      var a = nbi();
      this.copyTo(a);
      return a;
    }
    __name(bnClone, "bnClone");
    __name2(bnClone, "bnClone");
    function bnIntValue() {
      if (this.s < 0) {
        if (this.t == 1) {
          return this[0] - this.DV;
        } else {
          if (this.t == 0) {
            return -1;
          }
        }
      } else {
        if (this.t == 1) {
          return this[0];
        } else {
          if (this.t == 0) {
            return 0;
          }
        }
      }
      return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0];
    }
    __name(bnIntValue, "bnIntValue");
    __name2(bnIntValue, "bnIntValue");
    function bnByteValue() {
      return this.t == 0 ? this.s : this[0] << 24 >> 24;
    }
    __name(bnByteValue, "bnByteValue");
    __name2(bnByteValue, "bnByteValue");
    function bnShortValue() {
      return this.t == 0 ? this.s : this[0] << 16 >> 16;
    }
    __name(bnShortValue, "bnShortValue");
    __name2(bnShortValue, "bnShortValue");
    function bnpChunkSize(a) {
      return Math.floor(Math.LN2 * this.DB / Math.log(a));
    }
    __name(bnpChunkSize, "bnpChunkSize");
    __name2(bnpChunkSize, "bnpChunkSize");
    function bnSigNum() {
      if (this.s < 0) {
        return -1;
      } else {
        if (this.t <= 0 || this.t == 1 && this[0] <= 0) {
          return 0;
        } else {
          return 1;
        }
      }
    }
    __name(bnSigNum, "bnSigNum");
    __name2(bnSigNum, "bnSigNum");
    function bnpToRadix(c) {
      if (c == null) {
        c = 10;
      }
      if (this.signum() == 0 || c < 2 || c > 36) {
        return "0";
      }
      var f = this.chunkSize(c);
      var e2 = Math.pow(c, f);
      var i = nbv(e2), j = nbi(), h = nbi(), g = "";
      this.divRemTo(i, j, h);
      while (j.signum() > 0) {
        g = (e2 + h.intValue()).toString(c).substr(1) + g;
        j.divRemTo(i, j, h);
      }
      return h.intValue().toString(c) + g;
    }
    __name(bnpToRadix, "bnpToRadix");
    __name2(bnpToRadix, "bnpToRadix");
    function bnpFromRadix(m, h) {
      this.fromInt(0);
      if (h == null) {
        h = 10;
      }
      var f = this.chunkSize(h);
      var g = Math.pow(h, f), e2 = false, a = 0, l = 0;
      for (var c = 0; c < m.length; ++c) {
        var k = intAt(m, c);
        if (k < 0) {
          if (m.charAt(c) == "-" && this.signum() == 0) {
            e2 = true;
          }
          continue;
        }
        l = h * l + k;
        if (++a >= f) {
          this.dMultiply(g);
          this.dAddOffset(l, 0);
          a = 0;
          l = 0;
        }
      }
      if (a > 0) {
        this.dMultiply(Math.pow(h, a));
        this.dAddOffset(l, 0);
      }
      if (e2) {
        BigInteger.ZERO.subTo(this, this);
      }
    }
    __name(bnpFromRadix, "bnpFromRadix");
    __name2(bnpFromRadix, "bnpFromRadix");
    function bnpFromNumber(f, e2, h) {
      if ("number" == typeof e2) {
        if (f < 2) {
          this.fromInt(1);
        } else {
          this.fromNumber(f, h);
          if (!this.testBit(f - 1)) {
            this.bitwiseTo(BigInteger.ONE.shiftLeft(f - 1), op_or, this);
          }
          if (this.isEven()) {
            this.dAddOffset(1, 0);
          }
          while (!this.isProbablePrime(e2)) {
            this.dAddOffset(2, 0);
            if (this.bitLength() > f) {
              this.subTo(BigInteger.ONE.shiftLeft(f - 1), this);
            }
          }
        }
      } else {
        var d = new Array(), g = f & 7;
        d.length = (f >> 3) + 1;
        e2.nextBytes(d);
        if (g > 0) {
          d[0] &= (1 << g) - 1;
        } else {
          d[0] = 0;
        }
        this.fromString(d, 256);
      }
    }
    __name(bnpFromNumber, "bnpFromNumber");
    __name2(bnpFromNumber, "bnpFromNumber");
    function bnToByteArray() {
      var b = this.t, c = new Array();
      c[0] = this.s;
      var e2 = this.DB - b * this.DB % 8, f, a = 0;
      if (b-- > 0) {
        if (e2 < this.DB && (f = this[b] >> e2) != (this.s & this.DM) >> e2) {
          c[a++] = f | this.s << this.DB - e2;
        }
        while (b >= 0) {
          if (e2 < 8) {
            f = (this[b] & (1 << e2) - 1) << 8 - e2;
            f |= this[--b] >> (e2 += this.DB - 8);
          } else {
            f = this[b] >> (e2 -= 8) & 255;
            if (e2 <= 0) {
              e2 += this.DB;
              --b;
            }
          }
          if ((f & 128) != 0) {
            f |= -256;
          }
          if (a == 0 && (this.s & 128) != (f & 128)) {
            ++a;
          }
          if (a > 0 || f != this.s) {
            c[a++] = f;
          }
        }
      }
      return c;
    }
    __name(bnToByteArray, "bnToByteArray");
    __name2(bnToByteArray, "bnToByteArray");
    function bnEquals(b) {
      return this.compareTo(b) == 0;
    }
    __name(bnEquals, "bnEquals");
    __name2(bnEquals, "bnEquals");
    function bnMin(b) {
      return this.compareTo(b) < 0 ? this : b;
    }
    __name(bnMin, "bnMin");
    __name2(bnMin, "bnMin");
    function bnMax(b) {
      return this.compareTo(b) > 0 ? this : b;
    }
    __name(bnMax, "bnMax");
    __name2(bnMax, "bnMax");
    function bnpBitwiseTo(c, h, e2) {
      var d, g, b = Math.min(c.t, this.t);
      for (d = 0; d < b; ++d) {
        e2[d] = h(this[d], c[d]);
      }
      if (c.t < this.t) {
        g = c.s & this.DM;
        for (d = b; d < this.t; ++d) {
          e2[d] = h(this[d], g);
        }
        e2.t = this.t;
      } else {
        g = this.s & this.DM;
        for (d = b; d < c.t; ++d) {
          e2[d] = h(g, c[d]);
        }
        e2.t = c.t;
      }
      e2.s = h(this.s, c.s);
      e2.clamp();
    }
    __name(bnpBitwiseTo, "bnpBitwiseTo");
    __name2(bnpBitwiseTo, "bnpBitwiseTo");
    function op_and(a, b) {
      return a & b;
    }
    __name(op_and, "op_and");
    __name2(op_and, "op_and");
    function bnAnd(b) {
      var c = nbi();
      this.bitwiseTo(b, op_and, c);
      return c;
    }
    __name(bnAnd, "bnAnd");
    __name2(bnAnd, "bnAnd");
    function op_or(a, b) {
      return a | b;
    }
    __name(op_or, "op_or");
    __name2(op_or, "op_or");
    function bnOr(b) {
      var c = nbi();
      this.bitwiseTo(b, op_or, c);
      return c;
    }
    __name(bnOr, "bnOr");
    __name2(bnOr, "bnOr");
    function op_xor(a, b) {
      return a ^ b;
    }
    __name(op_xor, "op_xor");
    __name2(op_xor, "op_xor");
    function bnXor(b) {
      var c = nbi();
      this.bitwiseTo(b, op_xor, c);
      return c;
    }
    __name(bnXor, "bnXor");
    __name2(bnXor, "bnXor");
    function op_andnot(a, b) {
      return a & ~b;
    }
    __name(op_andnot, "op_andnot");
    __name2(op_andnot, "op_andnot");
    function bnAndNot(b) {
      var c = nbi();
      this.bitwiseTo(b, op_andnot, c);
      return c;
    }
    __name(bnAndNot, "bnAndNot");
    __name2(bnAndNot, "bnAndNot");
    function bnNot() {
      var b = nbi();
      for (var a = 0; a < this.t; ++a) {
        b[a] = this.DM & ~this[a];
      }
      b.t = this.t;
      b.s = ~this.s;
      return b;
    }
    __name(bnNot, "bnNot");
    __name2(bnNot, "bnNot");
    function bnShiftLeft(b) {
      var a = nbi();
      if (b < 0) {
        this.rShiftTo(-b, a);
      } else {
        this.lShiftTo(b, a);
      }
      return a;
    }
    __name(bnShiftLeft, "bnShiftLeft");
    __name2(bnShiftLeft, "bnShiftLeft");
    function bnShiftRight(b) {
      var a = nbi();
      if (b < 0) {
        this.lShiftTo(-b, a);
      } else {
        this.rShiftTo(b, a);
      }
      return a;
    }
    __name(bnShiftRight, "bnShiftRight");
    __name2(bnShiftRight, "bnShiftRight");
    function lbit(a) {
      if (a == 0) {
        return -1;
      }
      var b = 0;
      if ((a & 65535) == 0) {
        a >>= 16;
        b += 16;
      }
      if ((a & 255) == 0) {
        a >>= 8;
        b += 8;
      }
      if ((a & 15) == 0) {
        a >>= 4;
        b += 4;
      }
      if ((a & 3) == 0) {
        a >>= 2;
        b += 2;
      }
      if ((a & 1) == 0) {
        ++b;
      }
      return b;
    }
    __name(lbit, "lbit");
    __name2(lbit, "lbit");
    function bnGetLowestSetBit() {
      for (var a = 0; a < this.t; ++a) {
        if (this[a] != 0) {
          return a * this.DB + lbit(this[a]);
        }
      }
      if (this.s < 0) {
        return this.t * this.DB;
      }
      return -1;
    }
    __name(bnGetLowestSetBit, "bnGetLowestSetBit");
    __name2(bnGetLowestSetBit, "bnGetLowestSetBit");
    function cbit(a) {
      var b = 0;
      while (a != 0) {
        a &= a - 1;
        ++b;
      }
      return b;
    }
    __name(cbit, "cbit");
    __name2(cbit, "cbit");
    function bnBitCount() {
      var c = 0, a = this.s & this.DM;
      for (var b = 0; b < this.t; ++b) {
        c += cbit(this[b] ^ a);
      }
      return c;
    }
    __name(bnBitCount, "bnBitCount");
    __name2(bnBitCount, "bnBitCount");
    function bnTestBit(b) {
      var a = Math.floor(b / this.DB);
      if (a >= this.t) {
        return this.s != 0;
      }
      return (this[a] & 1 << b % this.DB) != 0;
    }
    __name(bnTestBit, "bnTestBit");
    __name2(bnTestBit, "bnTestBit");
    function bnpChangeBit(c, b) {
      var a = BigInteger.ONE.shiftLeft(c);
      this.bitwiseTo(a, b, a);
      return a;
    }
    __name(bnpChangeBit, "bnpChangeBit");
    __name2(bnpChangeBit, "bnpChangeBit");
    function bnSetBit(a) {
      return this.changeBit(a, op_or);
    }
    __name(bnSetBit, "bnSetBit");
    __name2(bnSetBit, "bnSetBit");
    function bnClearBit(a) {
      return this.changeBit(a, op_andnot);
    }
    __name(bnClearBit, "bnClearBit");
    __name2(bnClearBit, "bnClearBit");
    function bnFlipBit(a) {
      return this.changeBit(a, op_xor);
    }
    __name(bnFlipBit, "bnFlipBit");
    __name2(bnFlipBit, "bnFlipBit");
    function bnpAddTo(d, f) {
      var e2 = 0, g = 0, b = Math.min(d.t, this.t);
      while (e2 < b) {
        g += this[e2] + d[e2];
        f[e2++] = g & this.DM;
        g >>= this.DB;
      }
      if (d.t < this.t) {
        g += d.s;
        while (e2 < this.t) {
          g += this[e2];
          f[e2++] = g & this.DM;
          g >>= this.DB;
        }
        g += this.s;
      } else {
        g += this.s;
        while (e2 < d.t) {
          g += d[e2];
          f[e2++] = g & this.DM;
          g >>= this.DB;
        }
        g += d.s;
      }
      f.s = g < 0 ? -1 : 0;
      if (g > 0) {
        f[e2++] = g;
      } else {
        if (g < -1) {
          f[e2++] = this.DV + g;
        }
      }
      f.t = e2;
      f.clamp();
    }
    __name(bnpAddTo, "bnpAddTo");
    __name2(bnpAddTo, "bnpAddTo");
    function bnAdd(b) {
      var c = nbi();
      this.addTo(b, c);
      return c;
    }
    __name(bnAdd, "bnAdd");
    __name2(bnAdd, "bnAdd");
    function bnSubtract(b) {
      var c = nbi();
      this.subTo(b, c);
      return c;
    }
    __name(bnSubtract, "bnSubtract");
    __name2(bnSubtract, "bnSubtract");
    function bnMultiply(b) {
      var c = nbi();
      this.multiplyTo(b, c);
      return c;
    }
    __name(bnMultiply, "bnMultiply");
    __name2(bnMultiply, "bnMultiply");
    function bnSquare() {
      var a = nbi();
      this.squareTo(a);
      return a;
    }
    __name(bnSquare, "bnSquare");
    __name2(bnSquare, "bnSquare");
    function bnDivide(b) {
      var c = nbi();
      this.divRemTo(b, c, null);
      return c;
    }
    __name(bnDivide, "bnDivide");
    __name2(bnDivide, "bnDivide");
    function bnRemainder(b) {
      var c = nbi();
      this.divRemTo(b, null, c);
      return c;
    }
    __name(bnRemainder, "bnRemainder");
    __name2(bnRemainder, "bnRemainder");
    function bnDivideAndRemainder(b) {
      var d = nbi(), c = nbi();
      this.divRemTo(b, d, c);
      return new Array(d, c);
    }
    __name(bnDivideAndRemainder, "bnDivideAndRemainder");
    __name2(bnDivideAndRemainder, "bnDivideAndRemainder");
    function bnpDMultiply(a) {
      this[this.t] = this.am(0, a - 1, this, 0, 0, this.t);
      ++this.t;
      this.clamp();
    }
    __name(bnpDMultiply, "bnpDMultiply");
    __name2(bnpDMultiply, "bnpDMultiply");
    function bnpDAddOffset(b, a) {
      if (b == 0) {
        return;
      }
      while (this.t <= a) {
        this[this.t++] = 0;
      }
      this[a] += b;
      while (this[a] >= this.DV) {
        this[a] -= this.DV;
        if (++a >= this.t) {
          this[this.t++] = 0;
        }
        ++this[a];
      }
    }
    __name(bnpDAddOffset, "bnpDAddOffset");
    __name2(bnpDAddOffset, "bnpDAddOffset");
    function NullExp() {
    }
    __name(NullExp, "NullExp");
    __name2(NullExp, "NullExp");
    function nNop(a) {
      return a;
    }
    __name(nNop, "nNop");
    __name2(nNop, "nNop");
    function nMulTo(a, c, b) {
      a.multiplyTo(c, b);
    }
    __name(nMulTo, "nMulTo");
    __name2(nMulTo, "nMulTo");
    function nSqrTo(a, b) {
      a.squareTo(b);
    }
    __name(nSqrTo, "nSqrTo");
    __name2(nSqrTo, "nSqrTo");
    NullExp.prototype.convert = nNop;
    NullExp.prototype.revert = nNop;
    NullExp.prototype.mulTo = nMulTo;
    NullExp.prototype.sqrTo = nSqrTo;
    function bnPow(a) {
      return this.exp(a, new NullExp());
    }
    __name(bnPow, "bnPow");
    __name2(bnPow, "bnPow");
    function bnpMultiplyLowerTo(b, f, e2) {
      var d = Math.min(this.t + b.t, f);
      e2.s = 0;
      e2.t = d;
      while (d > 0) {
        e2[--d] = 0;
      }
      var c;
      for (c = e2.t - this.t; d < c; ++d) {
        e2[d + this.t] = this.am(0, b[d], e2, d, 0, this.t);
      }
      for (c = Math.min(b.t, f); d < c; ++d) {
        this.am(0, b[d], e2, d, 0, f - d);
      }
      e2.clamp();
    }
    __name(bnpMultiplyLowerTo, "bnpMultiplyLowerTo");
    __name2(bnpMultiplyLowerTo, "bnpMultiplyLowerTo");
    function bnpMultiplyUpperTo(b, e2, d) {
      --e2;
      var c = d.t = this.t + b.t - e2;
      d.s = 0;
      while (--c >= 0) {
        d[c] = 0;
      }
      for (c = Math.max(e2 - this.t, 0); c < b.t; ++c) {
        d[this.t + c - e2] = this.am(e2 - c, b[c], d, 0, 0, this.t + c - e2);
      }
      d.clamp();
      d.drShiftTo(1, d);
    }
    __name(bnpMultiplyUpperTo, "bnpMultiplyUpperTo");
    __name2(bnpMultiplyUpperTo, "bnpMultiplyUpperTo");
    function Barrett(a) {
      this.r2 = nbi();
      this.q3 = nbi();
      BigInteger.ONE.dlShiftTo(2 * a.t, this.r2);
      this.mu = this.r2.divide(a);
      this.m = a;
    }
    __name(Barrett, "Barrett");
    __name2(Barrett, "Barrett");
    function barrettConvert(a) {
      if (a.s < 0 || a.t > 2 * this.m.t) {
        return a.mod(this.m);
      } else {
        if (a.compareTo(this.m) < 0) {
          return a;
        } else {
          var b = nbi();
          a.copyTo(b);
          this.reduce(b);
          return b;
        }
      }
    }
    __name(barrettConvert, "barrettConvert");
    __name2(barrettConvert, "barrettConvert");
    function barrettRevert(a) {
      return a;
    }
    __name(barrettRevert, "barrettRevert");
    __name2(barrettRevert, "barrettRevert");
    function barrettReduce(a) {
      a.drShiftTo(this.m.t - 1, this.r2);
      if (a.t > this.m.t + 1) {
        a.t = this.m.t + 1;
        a.clamp();
      }
      this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
      this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
      while (a.compareTo(this.r2) < 0) {
        a.dAddOffset(1, this.m.t + 1);
      }
      a.subTo(this.r2, a);
      while (a.compareTo(this.m) >= 0) {
        a.subTo(this.m, a);
      }
    }
    __name(barrettReduce, "barrettReduce");
    __name2(barrettReduce, "barrettReduce");
    function barrettSqrTo(a, b) {
      a.squareTo(b);
      this.reduce(b);
    }
    __name(barrettSqrTo, "barrettSqrTo");
    __name2(barrettSqrTo, "barrettSqrTo");
    function barrettMulTo(a, c, b) {
      a.multiplyTo(c, b);
      this.reduce(b);
    }
    __name(barrettMulTo, "barrettMulTo");
    __name2(barrettMulTo, "barrettMulTo");
    Barrett.prototype.convert = barrettConvert;
    Barrett.prototype.revert = barrettRevert;
    Barrett.prototype.reduce = barrettReduce;
    Barrett.prototype.mulTo = barrettMulTo;
    Barrett.prototype.sqrTo = barrettSqrTo;
    function bnModPow(q, f) {
      var o2 = q.bitLength(), h, b = nbv(1), v;
      if (o2 <= 0) {
        return b;
      } else {
        if (o2 < 18) {
          h = 1;
        } else {
          if (o2 < 48) {
            h = 3;
          } else {
            if (o2 < 144) {
              h = 4;
            } else {
              if (o2 < 768) {
                h = 5;
              } else {
                h = 6;
              }
            }
          }
        }
      }
      if (o2 < 8) {
        v = new Classic(f);
      } else {
        if (f.isEven()) {
          v = new Barrett(f);
        } else {
          v = new Montgomery(f);
        }
      }
      var p = new Array(), d = 3, s = h - 1, a = (1 << h) - 1;
      p[1] = v.convert(this);
      if (h > 1) {
        var A = nbi();
        v.sqrTo(p[1], A);
        while (d <= a) {
          p[d] = nbi();
          v.mulTo(A, p[d - 2], p[d]);
          d += 2;
        }
      }
      var l = q.t - 1, x, u = true, c = nbi(), y;
      o2 = nbits(q[l]) - 1;
      while (l >= 0) {
        if (o2 >= s) {
          x = q[l] >> o2 - s & a;
        } else {
          x = (q[l] & (1 << o2 + 1) - 1) << s - o2;
          if (l > 0) {
            x |= q[l - 1] >> this.DB + o2 - s;
          }
        }
        d = h;
        while ((x & 1) == 0) {
          x >>= 1;
          --d;
        }
        if ((o2 -= d) < 0) {
          o2 += this.DB;
          --l;
        }
        if (u) {
          p[x].copyTo(b);
          u = false;
        } else {
          while (d > 1) {
            v.sqrTo(b, c);
            v.sqrTo(c, b);
            d -= 2;
          }
          if (d > 0) {
            v.sqrTo(b, c);
          } else {
            y = b;
            b = c;
            c = y;
          }
          v.mulTo(c, p[x], b);
        }
        while (l >= 0 && (q[l] & 1 << o2) == 0) {
          v.sqrTo(b, c);
          y = b;
          b = c;
          c = y;
          if (--o2 < 0) {
            o2 = this.DB - 1;
            --l;
          }
        }
      }
      return v.revert(b);
    }
    __name(bnModPow, "bnModPow");
    __name2(bnModPow, "bnModPow");
    function bnGCD(c) {
      var b = this.s < 0 ? this.negate() : this.clone();
      var h = c.s < 0 ? c.negate() : c.clone();
      if (b.compareTo(h) < 0) {
        var e2 = b;
        b = h;
        h = e2;
      }
      var d = b.getLowestSetBit(), f = h.getLowestSetBit();
      if (f < 0) {
        return b;
      }
      if (d < f) {
        f = d;
      }
      if (f > 0) {
        b.rShiftTo(f, b);
        h.rShiftTo(f, h);
      }
      while (b.signum() > 0) {
        if ((d = b.getLowestSetBit()) > 0) {
          b.rShiftTo(d, b);
        }
        if ((d = h.getLowestSetBit()) > 0) {
          h.rShiftTo(d, h);
        }
        if (b.compareTo(h) >= 0) {
          b.subTo(h, b);
          b.rShiftTo(1, b);
        } else {
          h.subTo(b, h);
          h.rShiftTo(1, h);
        }
      }
      if (f > 0) {
        h.lShiftTo(f, h);
      }
      return h;
    }
    __name(bnGCD, "bnGCD");
    __name2(bnGCD, "bnGCD");
    function bnpModInt(e2) {
      if (e2 <= 0) {
        return 0;
      }
      var c = this.DV % e2, b = this.s < 0 ? e2 - 1 : 0;
      if (this.t > 0) {
        if (c == 0) {
          b = this[0] % e2;
        } else {
          for (var a = this.t - 1; a >= 0; --a) {
            b = (c * b + this[a]) % e2;
          }
        }
      }
      return b;
    }
    __name(bnpModInt, "bnpModInt");
    __name2(bnpModInt, "bnpModInt");
    function bnModInverse(f) {
      var j = f.isEven();
      if (this.isEven() && j || f.signum() == 0) {
        return BigInteger.ZERO;
      }
      var i = f.clone(), h = this.clone();
      var g = nbv(1), e2 = nbv(0), l = nbv(0), k = nbv(1);
      while (i.signum() != 0) {
        while (i.isEven()) {
          i.rShiftTo(1, i);
          if (j) {
            if (!g.isEven() || !e2.isEven()) {
              g.addTo(this, g);
              e2.subTo(f, e2);
            }
            g.rShiftTo(1, g);
          } else {
            if (!e2.isEven()) {
              e2.subTo(f, e2);
            }
          }
          e2.rShiftTo(1, e2);
        }
        while (h.isEven()) {
          h.rShiftTo(1, h);
          if (j) {
            if (!l.isEven() || !k.isEven()) {
              l.addTo(this, l);
              k.subTo(f, k);
            }
            l.rShiftTo(1, l);
          } else {
            if (!k.isEven()) {
              k.subTo(f, k);
            }
          }
          k.rShiftTo(1, k);
        }
        if (i.compareTo(h) >= 0) {
          i.subTo(h, i);
          if (j) {
            g.subTo(l, g);
          }
          e2.subTo(k, e2);
        } else {
          h.subTo(i, h);
          if (j) {
            l.subTo(g, l);
          }
          k.subTo(e2, k);
        }
      }
      if (h.compareTo(BigInteger.ONE) != 0) {
        return BigInteger.ZERO;
      }
      if (k.compareTo(f) >= 0) {
        return k.subtract(f);
      }
      if (k.signum() < 0) {
        k.addTo(f, k);
      } else {
        return k;
      }
      if (k.signum() < 0) {
        return k.add(f);
      } else {
        return k;
      }
    }
    __name(bnModInverse, "bnModInverse");
    __name2(bnModInverse, "bnModInverse");
    var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
    var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
    function bnIsProbablePrime(e2) {
      var d, b = this.abs();
      if (b.t == 1 && b[0] <= lowprimes[lowprimes.length - 1]) {
        for (d = 0; d < lowprimes.length; ++d) {
          if (b[0] == lowprimes[d]) {
            return true;
          }
        }
        return false;
      }
      if (b.isEven()) {
        return false;
      }
      d = 1;
      while (d < lowprimes.length) {
        var a = lowprimes[d], c = d + 1;
        while (c < lowprimes.length && a < lplim) {
          a *= lowprimes[c++];
        }
        a = b.modInt(a);
        while (d < c) {
          if (a % lowprimes[d++] == 0) {
            return false;
          }
        }
      }
      return b.millerRabin(e2);
    }
    __name(bnIsProbablePrime, "bnIsProbablePrime");
    __name2(bnIsProbablePrime, "bnIsProbablePrime");
    function bnpMillerRabin(f) {
      var g = this.subtract(BigInteger.ONE);
      var c = g.getLowestSetBit();
      if (c <= 0) {
        return false;
      }
      var h = g.shiftRight(c);
      f = f + 1 >> 1;
      if (f > lowprimes.length) {
        f = lowprimes.length;
      }
      var b = nbi();
      for (var e2 = 0; e2 < f; ++e2) {
        b.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
        var l = b.modPow(h, this);
        if (l.compareTo(BigInteger.ONE) != 0 && l.compareTo(g) != 0) {
          var d = 1;
          while (d++ < c && l.compareTo(g) != 0) {
            l = l.modPowInt(2, this);
            if (l.compareTo(BigInteger.ONE) == 0) {
              return false;
            }
          }
          if (l.compareTo(g) != 0) {
            return false;
          }
        }
      }
      return true;
    }
    __name(bnpMillerRabin, "bnpMillerRabin");
    __name2(bnpMillerRabin, "bnpMillerRabin");
    BigInteger.prototype.chunkSize = bnpChunkSize;
    BigInteger.prototype.toRadix = bnpToRadix;
    BigInteger.prototype.fromRadix = bnpFromRadix;
    BigInteger.prototype.fromNumber = bnpFromNumber;
    BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
    BigInteger.prototype.changeBit = bnpChangeBit;
    BigInteger.prototype.addTo = bnpAddTo;
    BigInteger.prototype.dMultiply = bnpDMultiply;
    BigInteger.prototype.dAddOffset = bnpDAddOffset;
    BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
    BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
    BigInteger.prototype.modInt = bnpModInt;
    BigInteger.prototype.millerRabin = bnpMillerRabin;
    BigInteger.prototype.clone = bnClone;
    BigInteger.prototype.intValue = bnIntValue;
    BigInteger.prototype.byteValue = bnByteValue;
    BigInteger.prototype.shortValue = bnShortValue;
    BigInteger.prototype.signum = bnSigNum;
    BigInteger.prototype.toByteArray = bnToByteArray;
    BigInteger.prototype.equals = bnEquals;
    BigInteger.prototype.min = bnMin;
    BigInteger.prototype.max = bnMax;
    BigInteger.prototype.and = bnAnd;
    BigInteger.prototype.or = bnOr;
    BigInteger.prototype.xor = bnXor;
    BigInteger.prototype.andNot = bnAndNot;
    BigInteger.prototype.not = bnNot;
    BigInteger.prototype.shiftLeft = bnShiftLeft;
    BigInteger.prototype.shiftRight = bnShiftRight;
    BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
    BigInteger.prototype.bitCount = bnBitCount;
    BigInteger.prototype.testBit = bnTestBit;
    BigInteger.prototype.setBit = bnSetBit;
    BigInteger.prototype.clearBit = bnClearBit;
    BigInteger.prototype.flipBit = bnFlipBit;
    BigInteger.prototype.add = bnAdd;
    BigInteger.prototype.subtract = bnSubtract;
    BigInteger.prototype.multiply = bnMultiply;
    BigInteger.prototype.divide = bnDivide;
    BigInteger.prototype.remainder = bnRemainder;
    BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
    BigInteger.prototype.modPow = bnModPow;
    BigInteger.prototype.modInverse = bnModInverse;
    BigInteger.prototype.pow = bnPow;
    BigInteger.prototype.gcd = bnGCD;
    BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
    BigInteger.prototype.square = bnSquare;
    function Arcfour() {
      this.i = 0;
      this.j = 0;
      this.S = new Array();
    }
    __name(Arcfour, "Arcfour");
    __name2(Arcfour, "Arcfour");
    function ARC4init(d) {
      var c, a, b;
      for (c = 0; c < 256; ++c) {
        this.S[c] = c;
      }
      a = 0;
      for (c = 0; c < 256; ++c) {
        a = a + this.S[c] + d[c % d.length] & 255;
        b = this.S[c];
        this.S[c] = this.S[a];
        this.S[a] = b;
      }
      this.i = 0;
      this.j = 0;
    }
    __name(ARC4init, "ARC4init");
    __name2(ARC4init, "ARC4init");
    function ARC4next() {
      var a;
      this.i = this.i + 1 & 255;
      this.j = this.j + this.S[this.i] & 255;
      a = this.S[this.i];
      this.S[this.i] = this.S[this.j];
      this.S[this.j] = a;
      return this.S[a + this.S[this.i] & 255];
    }
    __name(ARC4next, "ARC4next");
    __name2(ARC4next, "ARC4next");
    Arcfour.prototype.init = ARC4init;
    Arcfour.prototype.next = ARC4next;
    function prng_newstate() {
      return new Arcfour();
    }
    __name(prng_newstate, "prng_newstate");
    __name2(prng_newstate, "prng_newstate");
    var rng_psize = 256;
    var rng_state;
    var rng_pool;
    var rng_pptr;
    function rng_seed_int(a) {
      rng_pool[rng_pptr++] ^= a & 255;
      rng_pool[rng_pptr++] ^= a >> 8 & 255;
      rng_pool[rng_pptr++] ^= a >> 16 & 255;
      rng_pool[rng_pptr++] ^= a >> 24 & 255;
      if (rng_pptr >= rng_psize) {
        rng_pptr -= rng_psize;
      }
    }
    __name(rng_seed_int, "rng_seed_int");
    __name2(rng_seed_int, "rng_seed_int");
    function rng_seed_time() {
      rng_seed_int((/* @__PURE__ */ new Date()).getTime());
    }
    __name(rng_seed_time, "rng_seed_time");
    __name2(rng_seed_time, "rng_seed_time");
    if (rng_pool == null) {
      rng_pool = new Array();
      rng_pptr = 0;
      if (window2 !== void 0 && (window2.crypto !== void 0 || window2.msCrypto !== void 0)) {
        crypto2 = window2.crypto || window2.msCrypto;
        if (crypto2.getRandomValues) {
          ua = new Uint8Array(32);
          crypto2.getRandomValues(ua);
          for (t2 = 0; t2 < 32; ++t2) {
            rng_pool[rng_pptr++] = ua[t2];
          }
        } else {
          if (navigator.appName == "Netscape" && navigator.appVersion < "5") {
            z = window2.crypto.random(32);
            for (t2 = 0; t2 < z.length; ++t2) {
              rng_pool[rng_pptr++] = z.charCodeAt(t2) & 255;
            }
          }
        }
      }
      while (rng_pptr < rng_psize) {
        t2 = Math.floor(65536 * Math.random());
        rng_pool[rng_pptr++] = t2 >>> 8;
        rng_pool[rng_pptr++] = t2 & 255;
      }
      rng_pptr = 0;
      rng_seed_time();
    }
    var t2;
    var crypto2;
    var ua;
    var z;
    function rng_get_byte() {
      if (rng_state == null) {
        rng_seed_time();
        rng_state = prng_newstate();
        rng_state.init(rng_pool);
        for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr) {
          rng_pool[rng_pptr] = 0;
        }
        rng_pptr = 0;
      }
      return rng_state.next();
    }
    __name(rng_get_byte, "rng_get_byte");
    __name2(rng_get_byte, "rng_get_byte");
    function rng_get_bytes(b) {
      var a;
      for (a = 0; a < b.length; ++a) {
        b[a] = rng_get_byte();
      }
    }
    __name(rng_get_bytes, "rng_get_bytes");
    __name2(rng_get_bytes, "rng_get_bytes");
    function SecureRandom() {
    }
    __name(SecureRandom, "SecureRandom");
    __name2(SecureRandom, "SecureRandom");
    SecureRandom.prototype.nextBytes = rng_get_bytes;
    function parseBigInt(b, a) {
      return new BigInteger(b, a);
    }
    __name(parseBigInt, "parseBigInt");
    __name2(parseBigInt, "parseBigInt");
    function RSAKey() {
      this.n = null;
      this.e = 0;
      this.d = null;
      this.p = null;
      this.q = null;
      this.dmp1 = null;
      this.dmq1 = null;
      this.coeff = null;
    }
    __name(RSAKey, "RSAKey");
    __name2(RSAKey, "RSAKey");
    function RSASetPublic(b, a) {
      this.isPublic = true;
      this.isPrivate = false;
      if (typeof b !== "string") {
        this.n = b;
        this.e = a;
      } else {
        if (b != null && a != null && b.length > 0 && a.length > 0) {
          this.n = parseBigInt(b, 16);
          this.e = parseInt(a, 16);
        } else {
          throw "Invalid RSA public key";
        }
      }
      if (this.n == null || typeof this.n.compareTo !== "function" || this.n.compareTo(BigInteger.ONE) <= 0 || this.e == null || isNaN(this.e) || this.e <= 0) {
        throw "Invalid RSA public key";
      }
    }
    __name(RSASetPublic, "RSASetPublic");
    __name2(RSASetPublic, "RSASetPublic");
    function RSADoPublic(a) {
      return a.modPowInt(this.e, this.n);
    }
    __name(RSADoPublic, "RSADoPublic");
    __name2(RSADoPublic, "RSADoPublic");
    RSAKey.prototype.doPublic = RSADoPublic;
    RSAKey.prototype.setPublic = RSASetPublic;
    RSAKey.prototype.type = "RSA";
    function RSASetPrivate(c, a, b) {
      this.isPrivate = true;
      if (typeof c !== "string") {
        this.n = c;
        this.e = a;
        this.d = b;
      } else {
        if (c != null && a != null && c.length > 0 && a.length > 0) {
          this.n = parseBigInt(c, 16);
          this.e = parseInt(a, 16);
          this.d = parseBigInt(b, 16);
        } else {
          throw "Invalid RSA private key";
        }
      }
    }
    __name(RSASetPrivate, "RSASetPrivate");
    __name2(RSASetPrivate, "RSASetPrivate");
    function RSASetPrivateEx(g, d, e2, c, b, a, h, f) {
      this.isPrivate = true;
      this.isPublic = false;
      if (g == null) {
        throw "RSASetPrivateEx N == null";
      }
      if (d == null) {
        throw "RSASetPrivateEx E == null";
      }
      if (g.length == 0) {
        throw "RSASetPrivateEx N.length == 0";
      }
      if (d.length == 0) {
        throw "RSASetPrivateEx E.length == 0";
      }
      if (g != null && d != null && g.length > 0 && d.length > 0) {
        this.n = parseBigInt(g, 16);
        this.e = parseInt(d, 16);
        this.d = parseBigInt(e2, 16);
        this.p = parseBigInt(c, 16);
        this.q = parseBigInt(b, 16);
        this.dmp1 = parseBigInt(a, 16);
        this.dmq1 = parseBigInt(h, 16);
        this.coeff = parseBigInt(f, 16);
      } else {
        throw "Invalid RSA private key in RSASetPrivateEx";
      }
    }
    __name(RSASetPrivateEx, "RSASetPrivateEx");
    __name2(RSASetPrivateEx, "RSASetPrivateEx");
    function RSAGenerate(b, l) {
      var a = new SecureRandom();
      var g = b >> 1;
      this.e = parseInt(l, 16);
      var c = new BigInteger(l, 16);
      var d = b / 2 - 100;
      var k = BigInteger.ONE.shiftLeft(d);
      for (; ; ) {
        for (; ; ) {
          this.p = new BigInteger(b - g, 1, a);
          if (this.p.subtract(BigInteger.ONE).gcd(c).compareTo(BigInteger.ONE) == 0 && this.p.isProbablePrime(10)) {
            break;
          }
        }
        for (; ; ) {
          this.q = new BigInteger(g, 1, a);
          if (this.q.subtract(BigInteger.ONE).gcd(c).compareTo(BigInteger.ONE) == 0 && this.q.isProbablePrime(10)) {
            break;
          }
        }
        if (this.p.compareTo(this.q) <= 0) {
          var j = this.p;
          this.p = this.q;
          this.q = j;
        }
        var h = this.q.subtract(this.p).abs();
        if (h.bitLength() < d || h.compareTo(k) <= 0) {
          continue;
        }
        var i = this.p.subtract(BigInteger.ONE);
        var e2 = this.q.subtract(BigInteger.ONE);
        var f = i.multiply(e2);
        if (f.gcd(c).compareTo(BigInteger.ONE) == 0) {
          this.n = this.p.multiply(this.q);
          if (this.n.bitLength() == b) {
            this.d = c.modInverse(f);
            this.dmp1 = this.d.mod(i);
            this.dmq1 = this.d.mod(e2);
            this.coeff = this.q.modInverse(this.p);
            break;
          }
        }
      }
      this.isPrivate = true;
    }
    __name(RSAGenerate, "RSAGenerate");
    __name2(RSAGenerate, "RSAGenerate");
    function RSADoPrivate(a) {
      if (this.p == null || this.q == null) {
        return a.modPow(this.d, this.n);
      }
      var c = a.mod(this.p).modPow(this.dmp1, this.p);
      var b = a.mod(this.q).modPow(this.dmq1, this.q);
      while (c.compareTo(b) < 0) {
        c = c.add(this.p);
      }
      return c.subtract(b).multiply(this.coeff).mod(this.p).multiply(this.q).add(b);
    }
    __name(RSADoPrivate, "RSADoPrivate");
    __name2(RSADoPrivate, "RSADoPrivate");
    RSAKey.prototype.doPrivate = RSADoPrivate;
    RSAKey.prototype.setPrivate = RSASetPrivate;
    RSAKey.prototype.setPrivateEx = RSASetPrivateEx;
    RSAKey.prototype.generate = RSAGenerate;
    function ECFieldElementFp(b, a) {
      this.x = a;
      this.q = b;
    }
    __name(ECFieldElementFp, "ECFieldElementFp");
    __name2(ECFieldElementFp, "ECFieldElementFp");
    function feFpEquals(a) {
      if (a == this) {
        return true;
      }
      return this.q.equals(a.q) && this.x.equals(a.x);
    }
    __name(feFpEquals, "feFpEquals");
    __name2(feFpEquals, "feFpEquals");
    function feFpToBigInteger() {
      return this.x;
    }
    __name(feFpToBigInteger, "feFpToBigInteger");
    __name2(feFpToBigInteger, "feFpToBigInteger");
    function feFpNegate() {
      return new ECFieldElementFp(this.q, this.x.negate().mod(this.q));
    }
    __name(feFpNegate, "feFpNegate");
    __name2(feFpNegate, "feFpNegate");
    function feFpAdd(a) {
      return new ECFieldElementFp(this.q, this.x.add(a.toBigInteger()).mod(this.q));
    }
    __name(feFpAdd, "feFpAdd");
    __name2(feFpAdd, "feFpAdd");
    function feFpSubtract(a) {
      return new ECFieldElementFp(this.q, this.x.subtract(a.toBigInteger()).mod(this.q));
    }
    __name(feFpSubtract, "feFpSubtract");
    __name2(feFpSubtract, "feFpSubtract");
    function feFpMultiply(a) {
      return new ECFieldElementFp(this.q, this.x.multiply(a.toBigInteger()).mod(this.q));
    }
    __name(feFpMultiply, "feFpMultiply");
    __name2(feFpMultiply, "feFpMultiply");
    function feFpSquare() {
      return new ECFieldElementFp(this.q, this.x.square().mod(this.q));
    }
    __name(feFpSquare, "feFpSquare");
    __name2(feFpSquare, "feFpSquare");
    function feFpDivide(a) {
      return new ECFieldElementFp(this.q, this.x.multiply(a.toBigInteger().modInverse(this.q)).mod(this.q));
    }
    __name(feFpDivide, "feFpDivide");
    __name2(feFpDivide, "feFpDivide");
    ECFieldElementFp.prototype.equals = feFpEquals;
    ECFieldElementFp.prototype.toBigInteger = feFpToBigInteger;
    ECFieldElementFp.prototype.negate = feFpNegate;
    ECFieldElementFp.prototype.add = feFpAdd;
    ECFieldElementFp.prototype.subtract = feFpSubtract;
    ECFieldElementFp.prototype.multiply = feFpMultiply;
    ECFieldElementFp.prototype.square = feFpSquare;
    ECFieldElementFp.prototype.divide = feFpDivide;
    ECFieldElementFp.prototype.sqrt = function() {
      return new ECFieldElementFp(this.q, this.x.sqrt().mod(this.q));
    };
    function ECPointFp(c, a, d, b) {
      this.curve = c;
      this.x = a;
      this.y = d;
      if (b == null) {
        this.z = BigInteger.ONE;
      } else {
        this.z = b;
      }
      this.zinv = null;
    }
    __name(ECPointFp, "ECPointFp");
    __name2(ECPointFp, "ECPointFp");
    function pointFpGetX() {
      if (this.zinv == null) {
        this.zinv = this.z.modInverse(this.curve.q);
      }
      return this.curve.fromBigInteger(this.x.toBigInteger().multiply(this.zinv).mod(this.curve.q));
    }
    __name(pointFpGetX, "pointFpGetX");
    __name2(pointFpGetX, "pointFpGetX");
    function pointFpGetY() {
      if (this.zinv == null) {
        this.zinv = this.z.modInverse(this.curve.q);
      }
      return this.curve.fromBigInteger(this.y.toBigInteger().multiply(this.zinv).mod(this.curve.q));
    }
    __name(pointFpGetY, "pointFpGetY");
    __name2(pointFpGetY, "pointFpGetY");
    function pointFpEquals(a) {
      if (a == this) {
        return true;
      }
      if (this.isInfinity()) {
        return a.isInfinity();
      }
      if (a.isInfinity()) {
        return this.isInfinity();
      }
      var c, b;
      c = a.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(a.z)).mod(this.curve.q);
      if (!c.equals(BigInteger.ZERO)) {
        return false;
      }
      b = a.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(a.z)).mod(this.curve.q);
      return b.equals(BigInteger.ZERO);
    }
    __name(pointFpEquals, "pointFpEquals");
    __name2(pointFpEquals, "pointFpEquals");
    function pointFpIsInfinity() {
      if (this.x == null && this.y == null) {
        return true;
      }
      return this.z.equals(BigInteger.ZERO) && !this.y.toBigInteger().equals(BigInteger.ZERO);
    }
    __name(pointFpIsInfinity, "pointFpIsInfinity");
    __name2(pointFpIsInfinity, "pointFpIsInfinity");
    function pointFpNegate() {
      return new ECPointFp(this.curve, this.x, this.y.negate(), this.z);
    }
    __name(pointFpNegate, "pointFpNegate");
    __name2(pointFpNegate, "pointFpNegate");
    function pointFpAdd(l) {
      if (this.isInfinity()) {
        return l;
      }
      if (l.isInfinity()) {
        return this;
      }
      var p = l.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(l.z)).mod(this.curve.q);
      var o2 = l.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(l.z)).mod(this.curve.q);
      if (BigInteger.ZERO.equals(o2)) {
        if (BigInteger.ZERO.equals(p)) {
          return this.twice();
        }
        return this.curve.getInfinity();
      }
      var j = new BigInteger("3");
      var e2 = this.x.toBigInteger();
      var n2 = this.y.toBigInteger();
      var c = l.x.toBigInteger();
      var k = l.y.toBigInteger();
      var m = o2.square();
      var i = m.multiply(o2);
      var d = e2.multiply(m);
      var g = p.square().multiply(this.z);
      var a = g.subtract(d.shiftLeft(1)).multiply(l.z).subtract(i).multiply(o2).mod(this.curve.q);
      var h = d.multiply(j).multiply(p).subtract(n2.multiply(i)).subtract(g.multiply(p)).multiply(l.z).add(p.multiply(i)).mod(this.curve.q);
      var f = i.multiply(this.z).multiply(l.z).mod(this.curve.q);
      return new ECPointFp(this.curve, this.curve.fromBigInteger(a), this.curve.fromBigInteger(h), f);
    }
    __name(pointFpAdd, "pointFpAdd");
    __name2(pointFpAdd, "pointFpAdd");
    function pointFpTwice() {
      if (this.isInfinity()) {
        return this;
      }
      if (this.y.toBigInteger().signum() == 0) {
        return this.curve.getInfinity();
      }
      var g = new BigInteger("3");
      var c = this.x.toBigInteger();
      var h = this.y.toBigInteger();
      var e2 = h.multiply(this.z);
      var j = e2.multiply(h).mod(this.curve.q);
      var i = this.curve.a.toBigInteger();
      var k = c.square().multiply(g);
      if (!BigInteger.ZERO.equals(i)) {
        k = k.add(this.z.square().multiply(i));
      }
      k = k.mod(this.curve.q);
      var b = k.square().subtract(c.shiftLeft(3).multiply(j)).shiftLeft(1).multiply(e2).mod(this.curve.q);
      var f = k.multiply(g).multiply(c).subtract(j.shiftLeft(1)).shiftLeft(2).multiply(j).subtract(k.square().multiply(k)).mod(this.curve.q);
      var d = e2.square().multiply(e2).shiftLeft(3).mod(this.curve.q);
      return new ECPointFp(this.curve, this.curve.fromBigInteger(b), this.curve.fromBigInteger(f), d);
    }
    __name(pointFpTwice, "pointFpTwice");
    __name2(pointFpTwice, "pointFpTwice");
    function pointFpMultiply(d) {
      if (this.isInfinity()) {
        return this;
      }
      if (d.signum() == 0) {
        return this.curve.getInfinity();
      }
      var m = d;
      var l = m.multiply(new BigInteger("3"));
      var b = this.negate();
      var j = this;
      var q = this.curve.q.subtract(d);
      var o2 = q.multiply(new BigInteger("3"));
      var c = new ECPointFp(this.curve, this.x, this.y);
      var a = c.negate();
      var g;
      for (g = l.bitLength() - 2; g > 0; --g) {
        j = j.twice();
        var n2 = l.testBit(g);
        var f = m.testBit(g);
        if (n2 != f) {
          j = j.add(n2 ? this : b);
        }
      }
      for (g = o2.bitLength() - 2; g > 0; --g) {
        c = c.twice();
        var p = o2.testBit(g);
        var r2 = q.testBit(g);
        if (p != r2) {
          c = c.add(p ? c : a);
        }
      }
      return j;
    }
    __name(pointFpMultiply, "pointFpMultiply");
    __name2(pointFpMultiply, "pointFpMultiply");
    function pointFpMultiplyTwo(c, a, b) {
      var d;
      if (c.bitLength() > b.bitLength()) {
        d = c.bitLength() - 1;
      } else {
        d = b.bitLength() - 1;
      }
      var f = this.curve.getInfinity();
      var e2 = this.add(a);
      while (d >= 0) {
        f = f.twice();
        if (c.testBit(d)) {
          if (b.testBit(d)) {
            f = f.add(e2);
          } else {
            f = f.add(this);
          }
        } else {
          if (b.testBit(d)) {
            f = f.add(a);
          }
        }
        --d;
      }
      return f;
    }
    __name(pointFpMultiplyTwo, "pointFpMultiplyTwo");
    __name2(pointFpMultiplyTwo, "pointFpMultiplyTwo");
    ECPointFp.prototype.getX = pointFpGetX;
    ECPointFp.prototype.getY = pointFpGetY;
    ECPointFp.prototype.equals = pointFpEquals;
    ECPointFp.prototype.isInfinity = pointFpIsInfinity;
    ECPointFp.prototype.negate = pointFpNegate;
    ECPointFp.prototype.add = pointFpAdd;
    ECPointFp.prototype.twice = pointFpTwice;
    ECPointFp.prototype.multiply = pointFpMultiply;
    ECPointFp.prototype.multiplyTwo = pointFpMultiplyTwo;
    function ECCurveFp(e2, d, c) {
      this.q = e2;
      this.a = this.fromBigInteger(d);
      this.b = this.fromBigInteger(c);
      this.infinity = new ECPointFp(this, null, null);
    }
    __name(ECCurveFp, "ECCurveFp");
    __name2(ECCurveFp, "ECCurveFp");
    function curveFpGetQ() {
      return this.q;
    }
    __name(curveFpGetQ, "curveFpGetQ");
    __name2(curveFpGetQ, "curveFpGetQ");
    function curveFpGetA() {
      return this.a;
    }
    __name(curveFpGetA, "curveFpGetA");
    __name2(curveFpGetA, "curveFpGetA");
    function curveFpGetB() {
      return this.b;
    }
    __name(curveFpGetB, "curveFpGetB");
    __name2(curveFpGetB, "curveFpGetB");
    function curveFpEquals(a) {
      if (a == this) {
        return true;
      }
      return this.q.equals(a.q) && this.a.equals(a.a) && this.b.equals(a.b);
    }
    __name(curveFpEquals, "curveFpEquals");
    __name2(curveFpEquals, "curveFpEquals");
    function curveFpGetInfinity() {
      return this.infinity;
    }
    __name(curveFpGetInfinity, "curveFpGetInfinity");
    __name2(curveFpGetInfinity, "curveFpGetInfinity");
    function curveFpFromBigInteger(a) {
      return new ECFieldElementFp(this.q, a);
    }
    __name(curveFpFromBigInteger, "curveFpFromBigInteger");
    __name2(curveFpFromBigInteger, "curveFpFromBigInteger");
    function curveFpDecodePointHex(m) {
      switch (parseInt(m.substr(0, 2), 16)) {
        case 0:
          return this.infinity;
        case 2:
        case 3:
          var c = m.substr(0, 2);
          var l = m.substr(2);
          var j = this.fromBigInteger(new BigInteger(k, 16));
          var i = this.getA();
          var h = this.getB();
          var e2 = j.square().add(i).multiply(j).add(h);
          var g = e2.sqrt();
          if (c == "03") {
            g = g.negate();
          }
          return new ECPointFp(this, j, g);
        case 4:
        case 6:
        case 7:
          var d = (m.length - 2) / 2;
          var k = m.substr(2, d);
          var f = m.substr(d + 2, d);
          return new ECPointFp(this, this.fromBigInteger(new BigInteger(k, 16)), this.fromBigInteger(new BigInteger(f, 16)));
        default:
          return null;
      }
    }
    __name(curveFpDecodePointHex, "curveFpDecodePointHex");
    __name2(curveFpDecodePointHex, "curveFpDecodePointHex");
    ECCurveFp.prototype.getQ = curveFpGetQ;
    ECCurveFp.prototype.getA = curveFpGetA;
    ECCurveFp.prototype.getB = curveFpGetB;
    ECCurveFp.prototype.equals = curveFpEquals;
    ECCurveFp.prototype.getInfinity = curveFpGetInfinity;
    ECCurveFp.prototype.fromBigInteger = curveFpFromBigInteger;
    ECCurveFp.prototype.decodePointHex = curveFpDecodePointHex;
    ECFieldElementFp.prototype.getByteLength = function() {
      return Math.floor((this.toBigInteger().bitLength() + 7) / 8);
    };
    ECPointFp.prototype.getEncoded = function(c) {
      var d = /* @__PURE__ */ __name2(function(h, f) {
        var g = h.toByteArrayUnsigned();
        if (f < g.length) {
          g = g.slice(g.length - f);
        } else {
          while (f > g.length) {
            g.unshift(0);
          }
        }
        return g;
      }, "d");
      var a = this.getX().toBigInteger();
      var e2 = this.getY().toBigInteger();
      var b = d(a, 32);
      if (c) {
        if (e2.isEven()) {
          b.unshift(2);
        } else {
          b.unshift(3);
        }
      } else {
        b.unshift(4);
        b = b.concat(d(e2, 32));
      }
      return b;
    };
    ECPointFp.decodeFrom = function(g, c) {
      var f = c[0];
      var e2 = c.length - 1;
      var d = c.slice(1, 1 + e2 / 2);
      var b = c.slice(1 + e2 / 2, 1 + e2);
      d.unshift(0);
      b.unshift(0);
      var a = new BigInteger(d);
      var h = new BigInteger(b);
      return new ECPointFp(g, g.fromBigInteger(a), g.fromBigInteger(h));
    };
    ECPointFp.decodeFromHex = function(g, c) {
      var f = c.substr(0, 2);
      var e2 = c.length - 2;
      var d = c.substr(2, e2 / 2);
      var b = c.substr(2 + e2 / 2, e2 / 2);
      var a = new BigInteger(d, 16);
      var h = new BigInteger(b, 16);
      return new ECPointFp(g, g.fromBigInteger(a), g.fromBigInteger(h));
    };
    ECPointFp.prototype.add2D = function(c) {
      if (this.isInfinity()) {
        return c;
      }
      if (c.isInfinity()) {
        return this;
      }
      if (this.x.equals(c.x)) {
        if (this.y.equals(c.y)) {
          return this.twice();
        }
        return this.curve.getInfinity();
      }
      var g = c.x.subtract(this.x);
      var e2 = c.y.subtract(this.y);
      var a = e2.divide(g);
      var d = a.square().subtract(this.x).subtract(c.x);
      var f = a.multiply(this.x.subtract(d)).subtract(this.y);
      return new ECPointFp(this.curve, d, f);
    };
    ECPointFp.prototype.twice2D = function() {
      if (this.isInfinity()) {
        return this;
      }
      if (this.y.toBigInteger().signum() == 0) {
        return this.curve.getInfinity();
      }
      var b = this.curve.fromBigInteger(BigInteger.valueOf(2));
      var e2 = this.curve.fromBigInteger(BigInteger.valueOf(3));
      var a = this.x.square().multiply(e2).add(this.curve.a).divide(this.y.multiply(b));
      var c = a.square().subtract(this.x.multiply(b));
      var d = a.multiply(this.x.subtract(c)).subtract(this.y);
      return new ECPointFp(this.curve, c, d);
    };
    ECPointFp.prototype.multiply2D = function(b) {
      if (this.isInfinity()) {
        return this;
      }
      if (b.signum() == 0) {
        return this.curve.getInfinity();
      }
      var g = b;
      var f = g.multiply(new BigInteger("3"));
      var l = this.negate();
      var d = this;
      var c;
      for (c = f.bitLength() - 2; c > 0; --c) {
        d = d.twice();
        var a = f.testBit(c);
        var j = g.testBit(c);
        if (a != j) {
          d = d.add2D(a ? this : l);
        }
      }
      return d;
    };
    ECPointFp.prototype.isOnCurve = function() {
      var d = this.getX().toBigInteger();
      var i = this.getY().toBigInteger();
      var f = this.curve.getA().toBigInteger();
      var c = this.curve.getB().toBigInteger();
      var h = this.curve.getQ();
      var e2 = i.multiply(i).mod(h);
      var g = d.multiply(d).multiply(d).add(f.multiply(d)).add(c).mod(h);
      return e2.equals(g);
    };
    ECPointFp.prototype.toString = function() {
      return "(" + this.getX().toBigInteger().toString() + "," + this.getY().toBigInteger().toString() + ")";
    };
    ECPointFp.prototype.validate = function() {
      var c = this.curve.getQ();
      if (this.isInfinity()) {
        throw new Error("Point is at infinity.");
      }
      var a = this.getX().toBigInteger();
      var b = this.getY().toBigInteger();
      if (a.compareTo(BigInteger.ONE) < 0 || a.compareTo(c.subtract(BigInteger.ONE)) > 0) {
        throw new Error("x coordinate out of bounds");
      }
      if (b.compareTo(BigInteger.ONE) < 0 || b.compareTo(c.subtract(BigInteger.ONE)) > 0) {
        throw new Error("y coordinate out of bounds");
      }
      if (!this.isOnCurve()) {
        throw new Error("Point is not on the curve.");
      }
      if (this.multiply(c).isInfinity()) {
        throw new Error("Point is not a scalar multiple of G.");
      }
      return true;
    };
    var jsonParse = (function() {
      var e2 = "(?:-?\\b(?:0|[1-9][0-9]*)(?:\\.[0-9]+)?(?:[eE][+-]?[0-9]+)?\\b)";
      var j = '(?:[^\\0-\\x08\\x0a-\\x1f"\\\\]|\\\\(?:["/\\\\bfnrt]|u[0-9A-Fa-f]{4}))';
      var i = '(?:"' + j + '*")';
      var d = new RegExp("(?:false|true|null|[\\{\\}\\[\\]]|" + e2 + "|" + i + ")", "g");
      var k = new RegExp("\\\\(?:([^u])|u(.{4}))", "g");
      var g = { '"': '"', "/": "/", "\\": "\\", b: "\b", f: "\f", n: "\n", r: "\r", t: "	" };
      function h(l, m, n2) {
        return m ? g[m] : String.fromCharCode(parseInt(n2, 16));
      }
      __name(h, "h");
      __name2(h, "h");
      var c = new String("");
      var a = "\\";
      var f = { "{": Object, "[": Array };
      var b = Object.hasOwnProperty;
      return function(u, q) {
        var p = u.match(d);
        var x;
        var v = p[0];
        var l = false;
        if ("{" === v) {
          x = {};
        } else {
          if ("[" === v) {
            x = [];
          } else {
            x = [];
            l = true;
          }
        }
        var t3;
        var r2 = [x];
        for (var o2 = 1 - l, m = p.length; o2 < m; ++o2) {
          v = p[o2];
          var w;
          switch (v.charCodeAt(0)) {
            default:
              w = r2[0];
              w[t3 || w.length] = +v;
              t3 = void 0;
              break;
            case 34:
              v = v.substring(1, v.length - 1);
              if (v.indexOf(a) !== -1) {
                v = v.replace(k, h);
              }
              w = r2[0];
              if (!t3) {
                if (w instanceof Array) {
                  t3 = w.length;
                } else {
                  t3 = v || c;
                  break;
                }
              }
              w[t3] = v;
              t3 = void 0;
              break;
            case 91:
              w = r2[0];
              r2.unshift(w[t3 || w.length] = []);
              t3 = void 0;
              break;
            case 93:
              r2.shift();
              break;
            case 102:
              w = r2[0];
              w[t3 || w.length] = false;
              t3 = void 0;
              break;
            case 110:
              w = r2[0];
              w[t3 || w.length] = null;
              t3 = void 0;
              break;
            case 116:
              w = r2[0];
              w[t3 || w.length] = true;
              t3 = void 0;
              break;
            case 123:
              w = r2[0];
              r2.unshift(w[t3 || w.length] = {});
              t3 = void 0;
              break;
            case 125:
              r2.shift();
              break;
          }
        }
        if (l) {
          if (r2.length !== 1) {
            throw new Error();
          }
          x = x[0];
        } else {
          if (r2.length) {
            throw new Error();
          }
        }
        if (q) {
          var s = /* @__PURE__ */ __name2(function(C, B) {
            var D = C[B];
            if (D && typeof D === "object") {
              var n2 = null;
              for (var z2 in D) {
                if (b.call(D, z2) && D !== C) {
                  var y = s(D, z2);
                  if (y !== void 0) {
                    D[z2] = y;
                  } else {
                    if (!n2) {
                      n2 = [];
                    }
                    n2.push(z2);
                  }
                }
              }
              if (n2) {
                for (var A = n2.length; --A >= 0; ) {
                  delete D[n2[A]];
                }
              }
            }
            return q.call(C, B, D);
          }, "s");
          x = s({ "": x }, "");
        }
        return x;
      };
    })();
    if (typeof KJUR == "undefined" || !KJUR) {
      KJUR = {};
    }
    if (typeof KJUR.asn1 == "undefined" || !KJUR.asn1) {
      KJUR.asn1 = {};
    }
    KJUR.asn1.ASN1Util = new function() {
      this.integerToByteHex = function(a) {
        var b = a.toString(16);
        if (b.length % 2 == 1) {
          b = "0" + b;
        }
        return b;
      };
      this.bigIntToMinTwosComplementsHex = function(a) {
        return twoscompl(a);
      };
      this.getPEMStringFromHex = function(a, b) {
        return hextopem(a, b);
      };
      this.newObject = function(k) {
        var F = KJUR, o2 = F.asn1, v = o2.ASN1Object, B = o2.DERBoolean, e2 = o2.DERInteger, t3 = o2.DERBitString, h = o2.DEROctetString, x = o2.DERNull, y = o2.DERObjectIdentifier, m = o2.DEREnumerated, g = o2.DERUTF8String, f = o2.DERNumericString, A = o2.DERPrintableString, w = o2.DERTeletexString, q = o2.DERIA5String, E = o2.DERUTCTime, j = o2.DERGeneralizedTime, b = o2.DERVisibleString, l = o2.DERBMPString, n2 = o2.DERSequence, c = o2.DERSet, s = o2.DERTaggedObject, p = o2.ASN1Util.newObject;
        if (k instanceof o2.ASN1Object) {
          return k;
        }
        var u = Object.keys(k);
        if (u.length != 1) {
          throw new Error("key of param shall be only one.");
        }
        var H = u[0];
        if (":asn1:bool:int:bitstr:octstr:null:oid:enum:utf8str:numstr:prnstr:telstr:ia5str:utctime:gentime:visstr:bmpstr:seq:set:tag:".indexOf(":" + H + ":") == -1) {
          throw new Error("undefined key: " + H);
        }
        if (H == "bool") {
          return new B(k[H]);
        }
        if (H == "int") {
          return new e2(k[H]);
        }
        if (H == "bitstr") {
          return new t3(k[H]);
        }
        if (H == "octstr") {
          return new h(k[H]);
        }
        if (H == "null") {
          return new x(k[H]);
        }
        if (H == "oid") {
          return new y(k[H]);
        }
        if (H == "enum") {
          return new m(k[H]);
        }
        if (H == "utf8str") {
          return new g(k[H]);
        }
        if (H == "numstr") {
          return new f(k[H]);
        }
        if (H == "prnstr") {
          return new A(k[H]);
        }
        if (H == "telstr") {
          return new w(k[H]);
        }
        if (H == "ia5str") {
          return new q(k[H]);
        }
        if (H == "utctime") {
          return new E(k[H]);
        }
        if (H == "gentime") {
          return new j(k[H]);
        }
        if (H == "visstr") {
          return new b(k[H]);
        }
        if (H == "bmpstr") {
          return new l(k[H]);
        }
        if (H == "asn1") {
          return new v(k[H]);
        }
        if (H == "seq") {
          var d = k[H];
          var G = [];
          for (var z2 = 0; z2 < d.length; z2++) {
            var D = p(d[z2]);
            G.push(D);
          }
          return new n2({ array: G });
        }
        if (H == "set") {
          var d = k[H];
          var G = [];
          for (var z2 = 0; z2 < d.length; z2++) {
            var D = p(d[z2]);
            G.push(D);
          }
          return new c({ array: G });
        }
        if (H == "tag") {
          var C = k[H];
          if (Object.prototype.toString.call(C) === "[object Array]" && C.length == 3) {
            var r2 = p(C[2]);
            return new s({ tag: C[0], explicit: C[1], obj: r2 });
          } else {
            return new s(C);
          }
        }
      };
      this.jsonToASN1HEX = function(b) {
        var a = this.newObject(b);
        return a.tohex();
      };
    }();
    KJUR.asn1.ASN1Util.oidHexToInt = function(a) {
      var j = "";
      var k = parseInt(a.substr(0, 2), 16);
      var d = Math.floor(k / 40);
      var c = k % 40;
      var j = d + "." + c;
      var e2 = "";
      for (var f = 2; f < a.length; f += 2) {
        var g = parseInt(a.substr(f, 2), 16);
        var h = ("00000000" + g.toString(2)).slice(-8);
        e2 = e2 + h.substr(1, 7);
        if (h.substr(0, 1) == "0") {
          var b = new BigInteger(e2, 2);
          j = j + "." + b.toString(10);
          e2 = "";
        }
      }
      return j;
    };
    KJUR.asn1.ASN1Util.oidIntToHex = function(f) {
      var e2 = /* @__PURE__ */ __name2(function(a) {
        var k = a.toString(16);
        if (k.length == 1) {
          k = "0" + k;
        }
        return k;
      }, "e2");
      var d = /* @__PURE__ */ __name2(function(o2) {
        var n2 = "";
        var k = new BigInteger(o2, 10);
        var a = k.toString(2);
        var l = 7 - a.length % 7;
        if (l == 7) {
          l = 0;
        }
        var q = "";
        for (var m = 0; m < l; m++) {
          q += "0";
        }
        a = q + a;
        for (var m = 0; m < a.length - 1; m += 7) {
          var p = a.substr(m, 7);
          if (m != a.length - 7) {
            p = "1" + p;
          }
          n2 += e2(parseInt(p, 2));
        }
        return n2;
      }, "d");
      if (!f.match(/^[0-9.]+$/)) {
        throw "malformed oid string: " + f;
      }
      var g = "";
      var b = f.split(".");
      var j = parseInt(b[0]) * 40 + parseInt(b[1]);
      g += e2(j);
      b.splice(0, 2);
      for (var c = 0; c < b.length; c++) {
        g += d(b[c]);
      }
      return g;
    };
    KJUR.asn1.ASN1Object = function(e2) {
      var c = true;
      var b = null;
      var d = "00";
      var f = "00";
      var a = "";
      this.params = null;
      this.getLengthHexFromValue = function() {
        if (typeof this.hV == "undefined" || this.hV == null) {
          throw new Error("this.hV is null or undefined");
        }
        if (this.hV.length % 2 == 1) {
          throw new Error("value hex must be even length: n=" + a.length + ",v=" + this.hV);
        }
        var j = this.hV.length / 2;
        var i = j.toString(16);
        if (i.length % 2 == 1) {
          i = "0" + i;
        }
        if (j < 128) {
          return i;
        } else {
          var h = i.length / 2;
          if (h > 15) {
            throw new Error("ASN.1 length too long to represent by 8x: n = " + j.toString(16));
          }
          var g = 128 + h;
          return g.toString(16) + i;
        }
      };
      this.tohex = function() {
        if (this.hTLV == null || this.isModified) {
          this.hV = this.getFreshValueHex();
          this.hL = this.getLengthHexFromValue();
          this.hTLV = this.hT + this.hL + this.hV;
          this.isModified = false;
        }
        return this.hTLV;
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      this.getValueHex = function() {
        this.tohex();
        return this.hV;
      };
      this.getFreshValueHex = function() {
        return "";
      };
      this.setByParam = function(g) {
        this.params = g;
      };
      if (e2 != void 0) {
        if (e2.tlv != void 0) {
          this.hTLV = e2.tlv;
          this.isModified = false;
        }
      }
    };
    KJUR.asn1.DERAbstractString = function(c) {
      KJUR.asn1.DERAbstractString.superclass.constructor.call(this);
      var b = null;
      var a = null;
      this.getString = function() {
        return this.s;
      };
      this.setString = function(d) {
        this.hTLV = null;
        this.isModified = true;
        this.s = d;
        this.hV = utf8tohex(this.s).toLowerCase();
      };
      this.setStringHex = function(d) {
        this.hTLV = null;
        this.isModified = true;
        this.s = null;
        this.hV = d;
      };
      this.getFreshValueHex = function() {
        return this.hV;
      };
      if (typeof c != "undefined") {
        if (typeof c == "string") {
          this.setString(c);
        } else {
          if (typeof c.str != "undefined") {
            this.setString(c.str);
          } else {
            if (typeof c.hex != "undefined") {
              this.setStringHex(c.hex);
            }
          }
        }
      }
    };
    extendClass(KJUR.asn1.DERAbstractString, KJUR.asn1.ASN1Object);
    KJUR.asn1.DERAbstractTime = function(c) {
      KJUR.asn1.DERAbstractTime.superclass.constructor.call(this);
      var b = null;
      var a = null;
      this.localDateToUTC = function(g) {
        var e2 = g.getTime() + g.getTimezoneOffset() * 6e4;
        var f = new Date(e2);
        return f;
      };
      this.formatDate = function(m, o2, e2) {
        var g = this.zeroPadding;
        var n2 = this.localDateToUTC(m);
        var p = String(n2.getFullYear());
        if (o2 == "utc") {
          p = p.substr(2, 2);
        }
        var l = g(String(n2.getMonth() + 1), 2);
        var q = g(String(n2.getDate()), 2);
        var h = g(String(n2.getHours()), 2);
        var i = g(String(n2.getMinutes()), 2);
        var j = g(String(n2.getSeconds()), 2);
        var r2 = p + l + q + h + i + j;
        if (e2 === true) {
          var f = n2.getMilliseconds();
          if (f != 0) {
            var k = g(String(f), 3);
            k = k.replace(/[0]+$/, "");
            r2 = r2 + "." + k;
          }
        }
        return r2 + "Z";
      };
      this.zeroPadding = function(e2, d) {
        if (e2.length >= d) {
          return e2;
        }
        return new Array(d - e2.length + 1).join("0") + e2;
      };
      this.setByParam = function(d) {
        this.hV = null;
        this.hTLV = null;
        this.params = d;
      };
      this.getString = function() {
        return void 0;
      };
      this.setString = function(d) {
        this.hTLV = null;
        this.isModified = true;
        if (this.params == void 0) {
          this.params = {};
        }
        this.params.str = d;
      };
      this.setByDate = function(d) {
        this.hTLV = null;
        this.isModified = true;
        if (this.params == void 0) {
          this.params = {};
        }
        this.params.date = d;
      };
      this.setByDateValue = function(h, j, e2, d, f, g) {
        var i = new Date(Date.UTC(h, j - 1, e2, d, f, g, 0));
        this.setByDate(i);
      };
      this.getFreshValueHex = function() {
        return this.hV;
      };
    };
    extendClass(KJUR.asn1.DERAbstractTime, KJUR.asn1.ASN1Object);
    KJUR.asn1.DERAbstractStructured = function(b) {
      KJUR.asn1.DERAbstractString.superclass.constructor.call(this);
      var a = null;
      this.setByASN1ObjectArray = function(c) {
        this.hTLV = null;
        this.isModified = true;
        this.asn1Array = c;
      };
      this.appendASN1Object = function(c) {
        this.hTLV = null;
        this.isModified = true;
        this.asn1Array.push(c);
      };
      this.asn1Array = new Array();
      if (typeof b != "undefined") {
        if (typeof b.array != "undefined") {
          this.asn1Array = b.array;
        }
      }
    };
    extendClass(KJUR.asn1.DERAbstractStructured, KJUR.asn1.ASN1Object);
    KJUR.asn1.DERBoolean = function(a) {
      KJUR.asn1.DERBoolean.superclass.constructor.call(this);
      this.hT = "01";
      if (a == false) {
        this.hTLV = "010100";
      } else {
        this.hTLV = "0101ff";
      }
    };
    extendClass(KJUR.asn1.DERBoolean, KJUR.asn1.ASN1Object);
    KJUR.asn1.DERInteger = function(b) {
      KJUR.asn1.DERInteger.superclass.constructor.call(this);
      this.hT = "02";
      this.params = null;
      var a = twoscompl;
      this.setByBigInteger = function(c) {
        this.isModified = true;
        this.params = { bigint: c };
      };
      this.setByInteger = function(c) {
        this.isModified = true;
        this.params = c;
      };
      this.setValueHex = function(c) {
        this.isModified = true;
        this.params = { hex: c };
      };
      this.getFreshValueHex = function() {
        var d = this.params;
        var c = null;
        if (d == null) {
          throw new Error("value not set");
        }
        if (typeof d == "object" && d.hex != void 0) {
          this.hV = d.hex;
          return this.hV;
        }
        if (typeof d == "number") {
          c = new BigInteger(String(d), 10);
        } else {
          if (d["int"] != void 0) {
            c = new BigInteger(String(d["int"]), 10);
          } else {
            if (d.bigint != void 0) {
              c = d.bigint;
            } else {
              throw new Error("wrong parameter");
            }
          }
        }
        this.hV = a(c);
        return this.hV;
      };
      if (b != void 0) {
        this.params = b;
      }
    };
    extendClass(KJUR.asn1.DERInteger, KJUR.asn1.ASN1Object);
    KJUR.asn1.DERBitString = function(b) {
      if (b !== void 0 && typeof b.obj !== "undefined") {
        var a = KJUR.asn1.ASN1Util.newObject(b.obj);
        b.hex = "00" + a.tohex();
      }
      KJUR.asn1.DERBitString.superclass.constructor.call(this);
      this.hT = "03";
      this.setHexValueIncludingUnusedBits = function(c) {
        this.hTLV = null;
        this.isModified = true;
        this.hV = c;
      };
      this.setUnusedBitsAndHexValue = function(c, e2) {
        if (c < 0 || 7 < c) {
          throw "unused bits shall be from 0 to 7: u = " + c;
        }
        var d = "0" + c;
        this.hTLV = null;
        this.isModified = true;
        this.hV = d + e2;
      };
      this.setByBinaryString = function(e2) {
        e2 = e2.replace(/0+$/, "");
        var f = 8 - e2.length % 8;
        if (f == 8) {
          f = 0;
        }
        e2 += "0000000".substr(0, f);
        var j = "";
        for (var g = 0; g < e2.length - 1; g += 8) {
          var d = e2.substr(g, 8);
          var c = parseInt(d, 2).toString(16);
          if (c.length == 1) {
            c = "0" + c;
          }
          j += c;
        }
        this.hTLV = null;
        this.isModified = true;
        this.hV = "0" + f + j;
      };
      this.setByBooleanArray = function(e2) {
        var d = "";
        for (var c = 0; c < e2.length; c++) {
          if (e2[c] == true) {
            d += "1";
          } else {
            d += "0";
          }
        }
        this.setByBinaryString(d);
      };
      this.newFalseArray = function(e2) {
        var c = new Array(e2);
        for (var d = 0; d < e2; d++) {
          c[d] = false;
        }
        return c;
      };
      this.getFreshValueHex = function() {
        return this.hV;
      };
      if (typeof b != "undefined") {
        if (typeof b == "string" && b.toLowerCase().match(/^[0-9a-f]+$/)) {
          this.setHexValueIncludingUnusedBits(b);
        } else {
          if (typeof b.hex != "undefined") {
            this.setHexValueIncludingUnusedBits(b.hex);
          } else {
            if (typeof b.bin != "undefined") {
              this.setByBinaryString(b.bin);
            } else {
              if (typeof b.array != "undefined") {
                this.setByBooleanArray(b.array);
              }
            }
          }
        }
      }
    };
    extendClass(KJUR.asn1.DERBitString, KJUR.asn1.ASN1Object);
    KJUR.asn1.DEROctetString = function(b) {
      if (b !== void 0 && typeof b.obj !== "undefined") {
        var a = KJUR.asn1.ASN1Util.newObject(b.obj);
        b.hex = a.tohex();
      }
      KJUR.asn1.DEROctetString.superclass.constructor.call(this, b);
      this.hT = "04";
    };
    extendClass(KJUR.asn1.DEROctetString, KJUR.asn1.DERAbstractString);
    KJUR.asn1.DERNull = function() {
      KJUR.asn1.DERNull.superclass.constructor.call(this);
      this.hT = "05";
      this.hTLV = "0500";
    };
    extendClass(KJUR.asn1.DERNull, KJUR.asn1.ASN1Object);
    KJUR.asn1.DERObjectIdentifier = function(a) {
      KJUR.asn1.DERObjectIdentifier.superclass.constructor.call(this);
      this.hT = "06";
      this.setValueHex = function(b) {
        this.hTLV = null;
        this.isModified = true;
        this.s = null;
        this.hV = b;
      };
      this.setValueOidString = function(b) {
        var c = oidtohex(b);
        if (c == null) {
          throw new Error("malformed oid string: " + b);
        }
        this.hTLV = null;
        this.isModified = true;
        this.s = null;
        this.hV = c;
      };
      this.setValueName = function(c) {
        var b = KJUR.asn1.x509.OID.name2oid(c);
        if (b !== "") {
          this.setValueOidString(b);
        } else {
          throw new Error("DERObjectIdentifier oidName undefined: " + c);
        }
      };
      this.setValueNameOrOid = function(b) {
        if (b.match(/^[0-2].[0-9.]+$/)) {
          this.setValueOidString(b);
        } else {
          this.setValueName(b);
        }
      };
      this.getFreshValueHex = function() {
        return this.hV;
      };
      this.setByParam = function(b) {
        if (typeof b === "string") {
          this.setValueNameOrOid(b);
        } else {
          if (b.oid !== void 0) {
            this.setValueNameOrOid(b.oid);
          } else {
            if (b.name !== void 0) {
              this.setValueNameOrOid(b.name);
            } else {
              if (b.hex !== void 0) {
                this.setValueHex(b.hex);
              }
            }
          }
        }
      };
      if (a !== void 0) {
        this.setByParam(a);
      }
    };
    extendClass(KJUR.asn1.DERObjectIdentifier, KJUR.asn1.ASN1Object);
    KJUR.asn1.DEREnumerated = function(a) {
      KJUR.asn1.DEREnumerated.superclass.constructor.call(this);
      this.hT = "0a";
      this.setByBigInteger = function(b) {
        this.hTLV = null;
        this.isModified = true;
        this.hV = twoscompl(b);
      };
      this.setByInteger = function(c) {
        var b = new BigInteger(String(c), 10);
        this.setByBigInteger(b);
      };
      this.setValueHex = function(b) {
        this.hV = b;
      };
      this.getFreshValueHex = function() {
        return this.hV;
      };
      if (typeof a != "undefined") {
        if (typeof a["int"] != "undefined") {
          this.setByInteger(a["int"]);
        } else {
          if (typeof a == "number") {
            this.setByInteger(a);
          } else {
            if (typeof a.hex != "undefined") {
              this.setValueHex(a.hex);
            }
          }
        }
      }
    };
    extendClass(KJUR.asn1.DEREnumerated, KJUR.asn1.ASN1Object);
    KJUR.asn1.DERUTF8String = function(a) {
      KJUR.asn1.DERUTF8String.superclass.constructor.call(this, a);
      this.hT = "0c";
    };
    extendClass(KJUR.asn1.DERUTF8String, KJUR.asn1.DERAbstractString);
    KJUR.asn1.DERNumericString = function(a) {
      KJUR.asn1.DERNumericString.superclass.constructor.call(this, a);
      this.hT = "12";
    };
    extendClass(KJUR.asn1.DERNumericString, KJUR.asn1.DERAbstractString);
    KJUR.asn1.DERPrintableString = function(a) {
      KJUR.asn1.DERPrintableString.superclass.constructor.call(this, a);
      this.hT = "13";
    };
    extendClass(KJUR.asn1.DERPrintableString, KJUR.asn1.DERAbstractString);
    KJUR.asn1.DERTeletexString = function(a) {
      KJUR.asn1.DERTeletexString.superclass.constructor.call(this, a);
      this.hT = "14";
    };
    extendClass(KJUR.asn1.DERTeletexString, KJUR.asn1.DERAbstractString);
    KJUR.asn1.DERIA5String = function(a) {
      KJUR.asn1.DERIA5String.superclass.constructor.call(this, a);
      this.hT = "16";
    };
    extendClass(KJUR.asn1.DERIA5String, KJUR.asn1.DERAbstractString);
    KJUR.asn1.DERVisibleString = function(a) {
      KJUR.asn1.DERIA5String.superclass.constructor.call(this, a);
      this.hT = "1a";
    };
    extendClass(KJUR.asn1.DERVisibleString, KJUR.asn1.DERAbstractString);
    KJUR.asn1.DERBMPString = function(a) {
      KJUR.asn1.DERBMPString.superclass.constructor.call(this, a);
      this.hT = "1e";
    };
    extendClass(KJUR.asn1.DERBMPString, KJUR.asn1.DERAbstractString);
    KJUR.asn1.DERUTCTime = function(a) {
      KJUR.asn1.DERUTCTime.superclass.constructor.call(this, a);
      this.hT = "17";
      this.params = void 0;
      this.getFreshValueHex = function() {
        var d = this.params;
        if (this.params == void 0) {
          d = { date: /* @__PURE__ */ new Date() };
        }
        if (typeof d == "string") {
          if (d.match(/^[0-9]{12}Z$/) || d.match(/^[0-9]{12}\.[0-9]+Z$/)) {
            this.hV = stohex(d);
          } else {
            throw new Error("malformed string for UTCTime: " + d);
          }
        } else {
          if (d.str != void 0) {
            this.hV = stohex(d.str);
          } else {
            if (d.date == void 0 && d.millis == true) {
              var c = /* @__PURE__ */ new Date();
              this.hV = stohex(this.formatDate(c, "utc", true));
            } else {
              if (d.date != void 0 && d.date instanceof Date) {
                var b = d.millis === true;
                this.hV = stohex(this.formatDate(d.date, "utc", b));
              } else {
                if (d instanceof Date) {
                  this.hV = stohex(this.formatDate(d, "utc"));
                }
              }
            }
          }
        }
        if (this.hV == void 0) {
          throw new Error("parameter not specified properly for UTCTime");
        }
        return this.hV;
      };
      if (a != void 0) {
        this.setByParam(a);
      }
    };
    extendClass(KJUR.asn1.DERUTCTime, KJUR.asn1.DERAbstractTime);
    KJUR.asn1.DERGeneralizedTime = function(a) {
      KJUR.asn1.DERGeneralizedTime.superclass.constructor.call(this, a);
      this.hT = "18";
      this.params = a;
      this.getFreshValueHex = function() {
        var d = this.params;
        if (this.params == void 0) {
          d = { date: /* @__PURE__ */ new Date() };
        }
        if (typeof d == "string") {
          if (d.match(/^[0-9]{14}Z$/) || d.match(/^[0-9]{14}\.[0-9]+Z$/)) {
            this.hV = stohex(d);
          } else {
            throw new Error("malformed string for GeneralizedTime: " + d);
          }
        } else {
          if (d.str != void 0) {
            this.hV = stohex(d.str);
          } else {
            if (d.date == void 0 && d.millis == true) {
              var c = /* @__PURE__ */ new Date();
              this.hV = stohex(this.formatDate(c, "gen", true));
            } else {
              if (d.date != void 0 && d.date instanceof Date) {
                var b = d.millis === true;
                this.hV = stohex(this.formatDate(d.date, "gen", b));
              } else {
                if (d instanceof Date) {
                  this.hV = stohex(this.formatDate(d, "gen"));
                }
              }
            }
          }
        }
        if (this.hV == void 0) {
          throw new Error("parameter not specified properly for GeneralizedTime");
        }
        return this.hV;
      };
      if (a != void 0) {
        this.setByParam(a);
      }
    };
    extendClass(KJUR.asn1.DERGeneralizedTime, KJUR.asn1.DERAbstractTime);
    KJUR.asn1.DERSequence = function(a) {
      KJUR.asn1.DERSequence.superclass.constructor.call(this, a);
      this.hT = "30";
      this.getFreshValueHex = function() {
        var c = "";
        for (var b = 0; b < this.asn1Array.length; b++) {
          var d = this.asn1Array[b];
          c += d.tohex();
        }
        this.hV = c;
        return this.hV;
      };
    };
    extendClass(KJUR.asn1.DERSequence, KJUR.asn1.DERAbstractStructured);
    KJUR.asn1.DERSet = function(a) {
      KJUR.asn1.DERSet.superclass.constructor.call(this, a);
      this.hT = "31";
      this.sortFlag = true;
      this.getFreshValueHex = function() {
        var b = new Array();
        for (var c = 0; c < this.asn1Array.length; c++) {
          var d = this.asn1Array[c];
          b.push(d.tohex());
        }
        if (this.sortFlag == true) {
          b.sort();
        }
        this.hV = b.join("");
        return this.hV;
      };
      if (typeof a != "undefined") {
        if (typeof a.sortflag != "undefined" && a.sortflag == false) {
          this.sortFlag = false;
        }
      }
    };
    extendClass(KJUR.asn1.DERSet, KJUR.asn1.DERAbstractStructured);
    KJUR.asn1.DERTaggedObject = function(f) {
      KJUR.asn1.DERTaggedObject.superclass.constructor.call(this);
      var d = KJUR.asn1, e2 = ASN1HEX, a = e2.getV, c = e2.isASN1HEX, b = d.ASN1Util.newObject;
      this.hT = "a0";
      this.hV = "";
      this.isExplicit = true;
      this.asn1Object = null;
      this.params = { tag: "a0", explicit: true };
      this.setASN1Object = function(g, h, i) {
        this.params = { tag: h, explicit: g, obj: i };
      };
      this.getFreshValueHex = function() {
        var h = this.params;
        if (h.explicit == void 0) {
          h.explicit = true;
        }
        if (h.tage != void 0) {
          h.tag = h.tage;
          h.explicit = true;
        }
        if (h.tagi != void 0) {
          h.tag = h.tagi;
          h.explicit = false;
        }
        if (h.str != void 0) {
          this.hV = utf8tohex(h.str);
        } else {
          if (h.hex != void 0) {
            this.hV = h.hex;
          } else {
            if (h.obj != void 0) {
              var g;
              if (h.obj instanceof d.ASN1Object) {
                g = h.obj.tohex();
              } else {
                if (typeof h.obj == "object") {
                  g = b(h.obj).tohex();
                }
              }
              if (h.explicit) {
                this.hV = g;
              } else {
                this.hV = a(g, 0);
              }
            } else {
              throw new Error("str, hex nor obj not specified");
            }
          }
        }
        if (h.tag == void 0) {
          h.tag = "a0";
        }
        this.hT = h.tag;
        this.hTLV = null;
        this.isModified = true;
        return this.hV;
      };
      this.setByParam = function(g) {
        this.params = g;
      };
      if (f !== void 0) {
        this.setByParam(f);
      }
    };
    extendClass(KJUR.asn1.DERTaggedObject, KJUR.asn1.ASN1Object);
    var ASN1HEX = new function() {
    }();
    ASN1HEX.getLblen = function(c, a) {
      if (c.substr(a + 2, 1) != "8") {
        return 1;
      }
      var b = parseInt(c.substr(a + 3, 1));
      if (b == 0) {
        return -1;
      }
      if (0 < b && b < 10) {
        return b + 1;
      }
      return -2;
    };
    ASN1HEX.getL = function(c, b) {
      var a = ASN1HEX.getLblen(c, b);
      if (a < 1) {
        return "";
      }
      return c.substr(b + 2, a * 2);
    };
    ASN1HEX.getVblen = function(d, a) {
      var c, b;
      c = ASN1HEX.getL(d, a);
      if (c == "") {
        return -1;
      }
      if (c.substr(0, 1) === "8") {
        b = new BigInteger(c.substr(2), 16);
      } else {
        b = new BigInteger(c, 16);
      }
      return b.intValue();
    };
    ASN1HEX.getVidx = function(c, b) {
      var a = ASN1HEX.getLblen(c, b);
      if (a < 0) {
        return a;
      }
      return b + (a + 1) * 2;
    };
    ASN1HEX.getV = function(d, a) {
      var c = ASN1HEX.getVidx(d, a);
      var b = ASN1HEX.getVblen(d, a);
      return d.substr(c, b * 2);
    };
    ASN1HEX.getTLV = function(b, a) {
      return b.substr(a, 2) + ASN1HEX.getL(b, a) + ASN1HEX.getV(b, a);
    };
    ASN1HEX.getTLVblen = function(b, a) {
      return 2 + ASN1HEX.getLblen(b, a) * 2 + ASN1HEX.getVblen(b, a) * 2;
    };
    ASN1HEX.getNextSiblingIdx = function(d, a) {
      var c = ASN1HEX.getVidx(d, a);
      var b = ASN1HEX.getVblen(d, a);
      return c + b * 2;
    };
    ASN1HEX.getChildIdx = function(e2, k) {
      var l = ASN1HEX;
      var j = [];
      var c, f, g;
      c = l.getVidx(e2, k);
      f = l.getVblen(e2, k) * 2;
      if (e2.substr(k, 2) == "03") {
        c += 2;
        f -= 2;
      }
      g = 0;
      var d = c;
      while (g <= f) {
        var b = l.getTLVblen(e2, d);
        g += b;
        if (g <= f) {
          j.push(d);
        }
        d += b;
        if (g >= f) {
          break;
        }
      }
      return j;
    };
    ASN1HEX.getNthChildIdx = function(d, b, e2) {
      var c = ASN1HEX.getChildIdx(d, b);
      return c[e2];
    };
    ASN1HEX.getIdxbyList = function(e2, d, c, i) {
      var g = ASN1HEX;
      var f, b;
      if (c.length == 0) {
        if (i !== void 0) {
          if (e2.substr(d, 2) !== i) {
            return -1;
          }
        }
        return d;
      }
      f = c.shift();
      b = g.getChildIdx(e2, d);
      if (f >= b.length) {
        return -1;
      }
      return g.getIdxbyList(e2, b[f], c, i);
    };
    ASN1HEX.getIdxbyListEx = function(f, k, b, g) {
      var m = ASN1HEX;
      var d, l;
      if (b.length == 0) {
        if (g !== void 0) {
          if (f.substr(k, 2) !== g) {
            return -1;
          }
        }
        return k;
      }
      d = b.shift();
      l = m.getChildIdx(f, k);
      var j = 0;
      for (var e2 = 0; e2 < l.length; e2++) {
        var c = f.substr(l[e2], 2);
        if (typeof d == "number" && !m.isContextTag(c) && j == d || typeof d == "string" && m.isContextTag(c, d)) {
          return m.getIdxbyListEx(f, l[e2], b, g);
        }
        if (!m.isContextTag(c)) {
          j++;
        }
      }
      return -1;
    };
    ASN1HEX.getTLVbyList = function(d, c, b, f) {
      var e2 = ASN1HEX;
      var a = e2.getIdxbyList(d, c, b, f);
      if (a == -1) {
        return null;
      }
      if (a >= d.length) {
        return null;
      }
      return e2.getTLV(d, a);
    };
    ASN1HEX.getTLVbyListEx = function(d, c, b, f) {
      var e2 = ASN1HEX;
      var a = e2.getIdxbyListEx(d, c, b, f);
      if (a == -1) {
        return null;
      }
      return e2.getTLV(d, a);
    };
    ASN1HEX.getVbyList = function(e2, c, b, g, i) {
      var f = ASN1HEX;
      var a, d;
      a = f.getIdxbyList(e2, c, b, g);
      if (a == -1) {
        return null;
      }
      if (a >= e2.length) {
        return null;
      }
      d = f.getV(e2, a);
      if (i === true) {
        d = d.substr(2);
      }
      return d;
    };
    ASN1HEX.getVbyListEx = function(b, e2, a, d, f) {
      var j = ASN1HEX;
      var g, c, i;
      g = j.getIdxbyListEx(b, e2, a, d);
      if (g == -1) {
        return null;
      }
      i = j.getV(b, g);
      if (b.substr(g, 2) == "03" && f !== false) {
        i = i.substr(2);
      }
      return i;
    };
    ASN1HEX.getInt = function(e2, b, f) {
      if (f == void 0) {
        f = -1;
      }
      try {
        var c = e2.substr(b, 2);
        if (c != "02" && c != "03") {
          return f;
        }
        var a = ASN1HEX.getV(e2, b);
        if (c == "02") {
          return parseInt(a, 16);
        } else {
          return bitstrtoint(a);
        }
      } catch (d) {
        return f;
      }
    };
    ASN1HEX.getOID = function(c, a, d) {
      if (d == void 0) {
        d = null;
      }
      try {
        if (c.substr(a, 2) != "06") {
          return d;
        }
        var e2 = ASN1HEX.getV(c, a);
        return hextooid(e2);
      } catch (b) {
        return d;
      }
    };
    ASN1HEX.getOIDName = function(d, a, f) {
      if (f == void 0) {
        f = null;
      }
      try {
        var e2 = ASN1HEX.getOID(d, a, f);
        if (e2 == f) {
          return f;
        }
        var b = KJUR.asn1.x509.OID.oid2name(e2);
        if (b == "") {
          return e2;
        }
        return b;
      } catch (c) {
        return f;
      }
    };
    ASN1HEX.getString = function(d, b, e2) {
      if (e2 == void 0) {
        e2 = null;
      }
      try {
        var a = ASN1HEX.getV(d, b);
        return hextorstr(a);
      } catch (c) {
        return e2;
      }
    };
    ASN1HEX.hextooidstr = function(e2) {
      var h = /* @__PURE__ */ __name2(function(b, a) {
        if (b.length >= a) {
          return b;
        }
        return new Array(a - b.length + 1).join("0") + b;
      }, "h");
      var l = [];
      var o2 = e2.substr(0, 2);
      var f = parseInt(o2, 16);
      l[0] = new String(Math.floor(f / 40));
      l[1] = new String(f % 40);
      var m = e2.substr(2);
      var k = [];
      for (var g = 0; g < m.length / 2; g++) {
        k.push(parseInt(m.substr(g * 2, 2), 16));
      }
      var j = [];
      var d = "";
      for (var g = 0; g < k.length; g++) {
        if (k[g] & 128) {
          d = d + h((k[g] & 127).toString(2), 7);
        } else {
          d = d + h((k[g] & 127).toString(2), 7);
          j.push(new String(parseInt(d, 2)));
          d = "";
        }
      }
      var n2 = l.join(".");
      if (j.length > 0) {
        n2 = n2 + "." + j.join(".");
      }
      return n2;
    };
    ASN1HEX.dump = function(t3, c, l, g) {
      var p = ASN1HEX;
      var j = p.getV;
      var y = p.dump;
      var w = p.getChildIdx;
      var e2 = t3;
      if (t3 instanceof KJUR.asn1.ASN1Object) {
        e2 = t3.tohex();
      }
      var q = /* @__PURE__ */ __name2(function(A, i) {
        if (A.length <= i * 2) {
          return A;
        } else {
          var v = A.substr(0, i) + "..(total " + A.length / 2 + "bytes).." + A.substr(A.length - i, i);
          return v;
        }
      }, "q");
      if (c === void 0) {
        c = { ommit_long_octet: 32 };
      }
      if (l === void 0) {
        l = 0;
      }
      if (g === void 0) {
        g = "";
      }
      var x = c.ommit_long_octet;
      var z2 = e2.substr(l, 2);
      if (z2 == "01") {
        var h = j(e2, l);
        if (h == "00") {
          return g + "BOOLEAN FALSE\n";
        } else {
          return g + "BOOLEAN TRUE\n";
        }
      }
      if (z2 == "02") {
        var h = j(e2, l);
        return g + "INTEGER " + q(h, x) + "\n";
      }
      if (z2 == "03") {
        var h = j(e2, l);
        if (p.isASN1HEX(h.substr(2))) {
          var k = g + "BITSTRING, encapsulates\n";
          k = k + y(h.substr(2), c, 0, g + "  ");
          return k;
        } else {
          return g + "BITSTRING " + q(h, x) + "\n";
        }
      }
      if (z2 == "04") {
        var h = j(e2, l);
        if (p.isASN1HEX(h)) {
          var k = g + "OCTETSTRING, encapsulates\n";
          k = k + y(h, c, 0, g + "  ");
          return k;
        } else {
          return g + "OCTETSTRING " + q(h, x) + "\n";
        }
      }
      if (z2 == "05") {
        return g + "NULL\n";
      }
      if (z2 == "06") {
        var m = j(e2, l);
        var b = KJUR.asn1.ASN1Util.oidHexToInt(m);
        var o2 = KJUR.asn1.x509.OID.oid2name(b);
        var a = b.replace(/\./g, " ");
        if (o2 != "") {
          return g + "ObjectIdentifier " + o2 + " (" + a + ")\n";
        } else {
          return g + "ObjectIdentifier (" + a + ")\n";
        }
      }
      if (z2 == "0a") {
        return g + "ENUMERATED " + parseInt(j(e2, l)) + "\n";
      }
      if (z2 == "0c") {
        return g + "UTF8String '" + hextoutf8(j(e2, l)) + "'\n";
      }
      if (z2 == "13") {
        return g + "PrintableString '" + hextoutf8(j(e2, l)) + "'\n";
      }
      if (z2 == "14") {
        return g + "TeletexString '" + hextoutf8(j(e2, l)) + "'\n";
      }
      if (z2 == "16") {
        return g + "IA5String '" + hextoutf8(j(e2, l)) + "'\n";
      }
      if (z2 == "17") {
        return g + "UTCTime " + hextoutf8(j(e2, l)) + "\n";
      }
      if (z2 == "18") {
        return g + "GeneralizedTime " + hextoutf8(j(e2, l)) + "\n";
      }
      if (z2 == "1a") {
        return g + "VisualString '" + hextoutf8(j(e2, l)) + "'\n";
      }
      if (z2 == "1e") {
        return g + "BMPString '" + ucs2hextoutf8(j(e2, l)) + "'\n";
      }
      if (z2 == "30") {
        if (e2.substr(l, 4) == "3000") {
          return g + "SEQUENCE {}\n";
        }
        var k = g + "SEQUENCE\n";
        var d = w(e2, l);
        var f = c;
        if ((d.length == 2 || d.length == 3) && e2.substr(d[0], 2) == "06" && e2.substr(d[d.length - 1], 2) == "04") {
          var o2 = p.oidname(j(e2, d[0]));
          var r2 = JSON.parse(JSON.stringify(c));
          r2.x509ExtName = o2;
          f = r2;
        }
        for (var u = 0; u < d.length; u++) {
          k = k + y(e2, f, d[u], g + "  ");
        }
        return k;
      }
      if (z2 == "31") {
        var k = g + "SET\n";
        var d = w(e2, l);
        for (var u = 0; u < d.length; u++) {
          k = k + y(e2, c, d[u], g + "  ");
        }
        return k;
      }
      var z2 = parseInt(z2, 16);
      if ((z2 & 128) != 0) {
        var n2 = z2 & 31;
        if ((z2 & 32) != 0) {
          var k = g + "[" + n2 + "]\n";
          var d = w(e2, l);
          for (var u = 0; u < d.length; u++) {
            k = k + y(e2, c, d[u], g + "  ");
          }
          return k;
        } else {
          var h = j(e2, l);
          if (ASN1HEX.isASN1HEX(h)) {
            var k = g + "[" + n2 + "]\n";
            k = k + y(h, c, 0, g + "  ");
            return k;
          } else {
            if (h.substr(0, 8) == "68747470") {
              h = hextoutf8(h);
            } else {
              if (c.x509ExtName === "subjectAltName" && n2 == 2) {
                h = hextoutf8(h);
              }
            }
          }
          var k = g + "[" + n2 + "] " + h + "\n";
          return k;
        }
      }
      return g + "UNKNOWN(" + z2 + ") " + j(e2, l) + "\n";
    };
    ASN1HEX.parse = function(x) {
      var t3 = ASN1HEX, f = t3.parse, a = t3.isASN1HEX, l = t3.getV, b = t3.getTLV, y = t3.getChildIdx, i = KJUR.asn1, e2 = i.ASN1Util.oidHexToInt, B = i.x509.OID.oid2name, k = hextoutf8, n2 = ucs2hextoutf8, q = iso88591hextoutf8;
      var c = { "0c": "utf8str", "12": "numstr", "13": "prnstr", "14": "telstr", "16": "ia5str", "17": "utctime", "18": "gentime", "1a": "visstr", "1e": "bmpstr", "30": "seq", "31": "set" };
      var u = /* @__PURE__ */ __name2(function(H) {
        var D = [];
        var E = y(H, 0);
        for (var G = 0; G < E.length; G++) {
          var s = E[G];
          var d = b(H, s);
          var F = f(d);
          D.push(F);
        }
        return D;
      }, "u");
      var C = x.substr(0, 2);
      var j = {};
      var p = l(x, 0);
      if (C == "01") {
        if (x == "0101ff") {
          return { bool: true };
        }
        return { bool: false };
      } else {
        if (C == "02") {
          return { "int": { hex: p } };
        } else {
          if (C == "03") {
            try {
              if (p.substr(0, 2) != "00") {
                throw "not encap";
              }
              var v = p.substr(2);
              if (!a(v)) {
                throw "not encap";
              }
              return { bitstr: { obj: f(v) } };
            } catch (z2) {
              var m = null;
              if (p.length <= 10) {
                m = bitstrtobinstr(p);
              }
              if (m == null) {
                return { bitstr: { hex: p } };
              } else {
                return { bitstr: { bin: m } };
              }
            }
          } else {
            if (C == "04") {
              try {
                if (!a(p)) {
                  throw "not encap";
                }
                return { octstr: { obj: f(p) } };
              } catch (z2) {
                return { octstr: { hex: p } };
              }
            } else {
              if (C == "05") {
                return { "null": "" };
              } else {
                if (C == "06") {
                  var g = e2(p);
                  var r2 = B(g);
                  if (r2 == "") {
                    return { oid: g };
                  } else {
                    return { oid: r2 };
                  }
                } else {
                  if (C == "0a") {
                    if (p.length > 4) {
                      return { "enum": { hex: p } };
                    } else {
                      return { "enum": parseInt(p, 16) };
                    }
                  } else {
                    if (C == "30" || C == "31") {
                      j[c[C]] = u(x);
                      return j;
                    } else {
                      if (C == "14") {
                        var o2 = q(p);
                        j[c[C]] = { str: o2 };
                        return j;
                      } else {
                        if (C == "1e") {
                          var o2 = n2(p);
                          j[c[C]] = { str: o2 };
                          return j;
                        } else {
                          if (":0c:12:13:16:17:18:1a:".indexOf(C) != -1) {
                            var o2 = k(p);
                            j[c[C]] = { str: o2 };
                            return j;
                          } else {
                            if (C.match(/^8[0-9]$/)) {
                              var o2 = k(p);
                              if (o2 == null | o2 == "") {
                                return { tag: { tag: C, explicit: false, hex: p } };
                              } else {
                                if (o2.match(/[\x00-\x1F\x7F-\x9F]/) != null || o2.match(/[\u0000-\u001F\u0080–\u009F]/) != null) {
                                  return { tag: { tag: C, explicit: false, hex: p } };
                                } else {
                                  return { tag: { tag: C, explicit: false, str: o2 } };
                                }
                              }
                            } else {
                              if (C.match(/^a[0-9]$/)) {
                                try {
                                  if (!a(p)) {
                                    throw new Error("not encap");
                                  }
                                  return { tag: { tag: C, explicit: true, obj: f(p) } };
                                } catch (z2) {
                                  return { tag: { tag: C, explicit: true, hex: p } };
                                }
                              } else {
                                var A = new KJUR.asn1.ASN1Object();
                                A.hV = p;
                                var w = A.getLengthHexFromValue();
                                return { asn1: { tlv: C + w + p } };
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
    ASN1HEX.isContextTag = function(c, b) {
      c = c.toLowerCase();
      var f, e2;
      try {
        f = parseInt(c, 16);
      } catch (d) {
        return -1;
      }
      if (b === void 0) {
        if ((f & 192) == 128) {
          return true;
        } else {
          return false;
        }
      }
      try {
        var a = b.match(/^\[[0-9]+\]$/);
        if (a == null) {
          return false;
        }
        e2 = parseInt(b.substr(1, b.length - 1), 10);
        if (e2 > 31) {
          return false;
        }
        if ((f & 192) == 128 && (f & 31) == e2) {
          return true;
        }
        return false;
      } catch (d) {
        return false;
      }
    };
    ASN1HEX.isASN1HEX = function(e2) {
      var d = ASN1HEX;
      if (e2.length % 2 == 1) {
        return false;
      }
      var c = d.getVblen(e2, 0);
      var b = e2.substr(0, 2);
      var f = d.getL(e2, 0);
      var a = e2.length - b.length - f.length;
      if (a == c * 2) {
        return true;
      }
      return false;
    };
    ASN1HEX.checkStrictDER = function(g, o2, d, c, r2) {
      var s = ASN1HEX;
      if (d === void 0) {
        if (typeof g != "string") {
          throw new Error("not hex string");
        }
        g = g.toLowerCase();
        if (!KJUR.lang.String.isHex(g)) {
          throw new Error("not hex string");
        }
        d = g.length;
        c = g.length / 2;
        if (c < 128) {
          r2 = 1;
        } else {
          r2 = Math.ceil(c.toString(16)) + 1;
        }
      }
      var k = s.getL(g, o2);
      if (k.length > r2 * 2) {
        throw new Error("L of TLV too long: idx=" + o2);
      }
      var n2 = s.getVblen(g, o2);
      if (n2 > c) {
        throw new Error("value of L too long than hex: idx=" + o2);
      }
      var q = s.getTLV(g, o2);
      var f = q.length - 2 - s.getL(g, o2).length;
      if (f !== n2 * 2) {
        throw new Error("V string length and L's value not the same:" + f + "/" + n2 * 2);
      }
      if (o2 === 0) {
        if (g.length != q.length) {
          throw new Error("total length and TLV length unmatch:" + g.length + "!=" + q.length);
        }
      }
      var b = g.substr(o2, 2);
      if (b === "02") {
        var a = s.getVidx(g, o2);
        if (g.substr(a, 2) == "00" && g.charCodeAt(a + 2) < 56) {
          throw new Error("not least zeros for DER INTEGER");
        }
      }
      if (parseInt(b, 16) & 32) {
        var p = s.getVblen(g, o2);
        var m = 0;
        var l = s.getChildIdx(g, o2);
        for (var e2 = 0; e2 < l.length; e2++) {
          var j = s.getTLV(g, l[e2]);
          m += j.length;
          s.checkStrictDER(g, l[e2], d, c, r2);
        }
        if (p * 2 != m) {
          throw new Error("sum of children's TLV length and L unmatch: " + p * 2 + "!=" + m);
        }
      }
    };
    ASN1HEX.oidname = function(a) {
      var c = KJUR.asn1;
      if (KJUR.lang.String.isHex(a)) {
        a = c.ASN1Util.oidHexToInt(a);
      }
      var b = c.x509.OID.oid2name(a);
      if (b === "") {
        b = a;
      }
      return b;
    };
    if (typeof KJUR == "undefined" || !KJUR) {
      KJUR = {};
    }
    if (typeof KJUR.asn1 == "undefined" || !KJUR.asn1) {
      KJUR.asn1 = {};
    }
    if (typeof KJUR.asn1.x509 == "undefined" || !KJUR.asn1.x509) {
      KJUR.asn1.x509 = {};
    }
    KJUR.asn1.x509.Certificate = function(h) {
      KJUR.asn1.x509.Certificate.superclass.constructor.call(this);
      var d = KJUR, c = d.asn1, f = c.DERBitString, b = c.DERSequence, g = c.x509, a = g.TBSCertificate, e2 = g.AlgorithmIdentifier;
      this.params = void 0;
      this.setByParam = function(i) {
        this.params = i;
      };
      this.sign = function() {
        var l = this.params;
        var k = l.sigalg;
        if (l.sigalg.name != void 0) {
          k = l.sigalg.name;
        }
        var i = l.tbsobj.tohex();
        var j = new KJUR.crypto.Signature({ alg: k });
        j.init(l.cakey);
        j.updateHex(i);
        l.sighex = j.sign();
      };
      this.getPEM = function() {
        return hextopem(this.tohex(), "CERTIFICATE");
      };
      this.tohex = function() {
        var k = this.params;
        if (k.tbsobj == void 0 || k.tbsobj == null) {
          k.tbsobj = new a(k);
        }
        if (k.sighex == void 0 && k.cakey != void 0) {
          this.sign();
        }
        if (k.sighex == void 0) {
          throw new Error("sighex or cakey parameter not defined");
        }
        var i = [];
        i.push(k.tbsobj);
        i.push(new e2({ name: k.sigalg }));
        i.push(new f({ hex: "00" + k.sighex }));
        var j = new b({ array: i });
        return j.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (h != void 0) {
        this.params = h;
      }
    };
    extendClass(KJUR.asn1.x509.Certificate, KJUR.asn1.ASN1Object);
    KJUR.asn1.x509.TBSCertificate = function(f) {
      KJUR.asn1.x509.TBSCertificate.superclass.constructor.call(this);
      var b = KJUR, i = b.asn1, d = i.x509, c = i.DERTaggedObject, h = i.DERInteger, g = i.DERSequence, l = d.AlgorithmIdentifier, e2 = d.Time, a = d.X500Name, j = d.Extensions, k = d.SubjectPublicKeyInfo;
      this.params = null;
      this.setByParam = function(m) {
        this.params = m;
      };
      this.tohex = function() {
        var n2 = [];
        var q = this.params;
        if (q.version != void 0 || q.version != 1) {
          var m = 2;
          if (q.version != void 0) {
            m = q.version - 1;
          }
          var p = new c({ obj: new h({ "int": m }) });
          n2.push(p);
        }
        n2.push(new h(q.serial));
        n2.push(new l({ name: q.sigalg }));
        n2.push(new a(q.issuer));
        n2.push(new g({ array: [new e2(q.notbefore), new e2(q.notafter)] }));
        n2.push(new a(q.subject));
        n2.push(new k(KEYUTIL.getKey(q.sbjpubkey)));
        if (q.ext !== void 0 && q.ext.length > 0) {
          n2.push(new c({ tag: "a3", obj: new j(q.ext) }));
        }
        var o2 = new KJUR.asn1.DERSequence({ array: n2 });
        return o2.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (f !== void 0) {
        this.setByParam(f);
      }
    };
    extendClass(KJUR.asn1.x509.TBSCertificate, KJUR.asn1.ASN1Object);
    KJUR.asn1.x509.Extensions = function(d) {
      KJUR.asn1.x509.Extensions.superclass.constructor.call(this);
      var c = KJUR, b = c.asn1, a = b.DERSequence, e2 = b.x509;
      this.aParam = [];
      this.setByParam = function(f) {
        this.aParam = f;
      };
      this.tohex = function() {
        var f = [];
        for (var h = 0; h < this.aParam.length; h++) {
          var l = this.aParam[h];
          var k = l.extname;
          var j = null;
          if (l.extn != void 0) {
            j = new e2.PrivateExtension(l);
          } else {
            if (k == "subjectKeyIdentifier") {
              j = new e2.SubjectKeyIdentifier(l);
            } else {
              if (k == "keyUsage") {
                j = new e2.KeyUsage(l);
              } else {
                if (k == "subjectAltName") {
                  j = new e2.SubjectAltName(l);
                } else {
                  if (k == "issuerAltName") {
                    j = new e2.IssuerAltName(l);
                  } else {
                    if (k == "basicConstraints") {
                      j = new e2.BasicConstraints(l);
                    } else {
                      if (k == "nameConstraints") {
                        j = new e2.NameConstraints(l);
                      } else {
                        if (k == "cRLDistributionPoints") {
                          j = new e2.CRLDistributionPoints(l);
                        } else {
                          if (k == "certificatePolicies") {
                            j = new e2.CertificatePolicies(l);
                          } else {
                            if (k == "policyMappings") {
                              j = new e2.PolicyMappings(l);
                            } else {
                              if (k == "policyConstraints") {
                                j = new e2.PolicyConstraints(l);
                              } else {
                                if (k == "inhibitAnyPolicy") {
                                  j = new e2.InhibitAnyPolicy(l);
                                } else {
                                  if (k == "authorityKeyIdentifier") {
                                    j = new e2.AuthorityKeyIdentifier(l);
                                  } else {
                                    if (k == "extKeyUsage") {
                                      j = new e2.ExtKeyUsage(l);
                                    } else {
                                      if (k == "authorityInfoAccess") {
                                        j = new e2.AuthorityInfoAccess(l);
                                      } else {
                                        if (k == "cRLNumber") {
                                          j = new e2.CRLNumber(l);
                                        } else {
                                          if (k == "cRLReason") {
                                            j = new e2.CRLReason(l);
                                          } else {
                                            if (k == "ocspNonce") {
                                              j = new e2.OCSPNonce(l);
                                            } else {
                                              if (k == "ocspNoCheck") {
                                                j = new e2.OCSPNoCheck(l);
                                              } else {
                                                if (k == "adobeTimeStamp") {
                                                  j = new e2.AdobeTimeStamp(l);
                                                } else {
                                                  if (k == "subjectDirectoryAttributes") {
                                                    j = new e2.SubjectDirectoryAttributes(l);
                                                  } else {
                                                    throw new Error("extension not supported:" + JSON.stringify(l));
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          if (j != null) {
            f.push(j);
          }
        }
        var g = new a({ array: f });
        return g.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (d != void 0) {
        this.setByParam(d);
      }
    };
    extendClass(KJUR.asn1.x509.Extensions, KJUR.asn1.ASN1Object);
    KJUR.asn1.x509.Extension = function(d) {
      KJUR.asn1.x509.Extension.superclass.constructor.call(this);
      var f = null, a = KJUR, e2 = a.asn1, h = e2.DERObjectIdentifier, i = e2.DEROctetString, b = e2.DERBitString, g = e2.DERBoolean, c = e2.DERSequence;
      this.tohex = function() {
        var m = new h({ oid: this.oid });
        var l = new i({ hex: this.getExtnValueHex() });
        var k = new Array();
        k.push(m);
        if (this.critical) {
          k.push(new g());
        }
        k.push(l);
        var j = new c({ array: k });
        return j.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      this.critical = false;
      if (d !== void 0) {
        if (d.critical !== void 0) {
          this.critical = d.critical;
        }
      }
    };
    extendClass(KJUR.asn1.x509.Extension, KJUR.asn1.ASN1Object);
    KJUR.asn1.x509.KeyUsage = function(c) {
      KJUR.asn1.x509.KeyUsage.superclass.constructor.call(this, c);
      var b = Error;
      var a = { digitalSignature: 0, nonRepudiation: 1, keyEncipherment: 2, dataEncipherment: 3, keyAgreement: 4, keyCertSign: 5, cRLSign: 6, encipherOnly: 7, decipherOnly: 8 };
      this.getExtnValueHex = function() {
        var d = this.getBinValue();
        this.asn1ExtnValue = new KJUR.asn1.DERBitString({ bin: d });
        return this.asn1ExtnValue.tohex();
      };
      this.getBinValue = function() {
        var d = this.params;
        if (typeof d != "object" || typeof d.names != "object" && typeof d.bin != "string") {
          throw new b("parameter not yet set");
        }
        if (d.names != void 0) {
          return namearraytobinstr(d.names, a);
        } else {
          if (d.bin != void 0) {
            return d.bin;
          } else {
            throw new b("parameter not set properly");
          }
        }
      };
      this.oid = "2.5.29.15";
      if (c !== void 0) {
        this.params = c;
      }
    };
    extendClass(KJUR.asn1.x509.KeyUsage, KJUR.asn1.x509.Extension);
    KJUR.asn1.x509.BasicConstraints = function(g) {
      KJUR.asn1.x509.BasicConstraints.superclass.constructor.call(this, g);
      var c = KJUR.asn1, e2 = c.DERBoolean, f = c.DERInteger, b = c.DERSequence;
      var a = false;
      var d = -1;
      this.getExtnValueHex = function() {
        var i = new Array();
        if (this.cA) {
          i.push(new e2());
        }
        if (this.pathLen > -1) {
          i.push(new f({ "int": this.pathLen }));
        }
        var h = new b({ array: i });
        this.asn1ExtnValue = h;
        return this.asn1ExtnValue.tohex();
      };
      this.oid = "2.5.29.19";
      this.cA = false;
      this.pathLen = -1;
      if (g !== void 0) {
        if (g.cA !== void 0) {
          this.cA = g.cA;
        }
        if (g.pathLen !== void 0) {
          this.pathLen = g.pathLen;
        }
      }
    };
    extendClass(KJUR.asn1.x509.BasicConstraints, KJUR.asn1.x509.Extension);
    KJUR.asn1.x509.CRLDistributionPoints = function(d) {
      KJUR.asn1.x509.CRLDistributionPoints.superclass.constructor.call(this, d);
      var b = KJUR, a = b.asn1, c = a.x509;
      this.getExtnValueHex = function() {
        return this.asn1ExtnValue.tohex();
      };
      this.setByDPArray = function(e2) {
        var f = [];
        for (var g = 0; g < e2.length; g++) {
          if (e2[g] instanceof KJUR.asn1.ASN1Object) {
            f.push(e2[g]);
          } else {
            var h = new c.DistributionPoint(e2[g]);
            f.push(h);
          }
        }
        this.asn1ExtnValue = new a.DERSequence({ array: f });
      };
      this.setByOneURI = function(f) {
        var e2 = new c.DistributionPoint({ fulluri: f });
        this.setByDPArray([e2]);
      };
      this.oid = "2.5.29.31";
      if (d !== void 0) {
        if (d.array !== void 0) {
          this.setByDPArray(d.array);
        } else {
          if (d.uri !== void 0) {
            this.setByOneURI(d.uri);
          }
        }
      }
    };
    extendClass(KJUR.asn1.x509.CRLDistributionPoints, KJUR.asn1.x509.Extension);
    KJUR.asn1.x509.DistributionPoint = function(e2) {
      KJUR.asn1.x509.DistributionPoint.superclass.constructor.call(this);
      var a = null, c = KJUR, b = c.asn1, d = b.x509.DistributionPointName;
      this.tohex = function() {
        var f = new b.DERSequence();
        if (this.asn1DP != null) {
          var g = new b.DERTaggedObject({ explicit: true, tag: "a0", obj: this.asn1DP });
          f.appendASN1Object(g);
        }
        this.hTLV = f.tohex();
        return this.hTLV;
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (e2 !== void 0) {
        if (e2.dpobj !== void 0) {
          this.asn1DP = e2.dpobj;
        } else {
          if (e2.dpname !== void 0) {
            this.asn1DP = new d(e2.dpname);
          } else {
            if (e2.fulluri !== void 0) {
              this.asn1DP = new d({ full: [{ uri: e2.fulluri }] });
            }
          }
        }
      }
    };
    extendClass(KJUR.asn1.x509.DistributionPoint, KJUR.asn1.ASN1Object);
    KJUR.asn1.x509.DistributionPointName = function(h) {
      KJUR.asn1.x509.DistributionPointName.superclass.constructor.call(this);
      var g = null, d = null, a = null, f = null, c = KJUR, b = c.asn1, e2 = b.DERTaggedObject;
      this.tohex = function() {
        if (this.type != "full") {
          throw new Error("currently type shall be 'full': " + this.type);
        }
        this.asn1Obj = new e2({ explicit: false, tag: this.tag, obj: this.asn1V });
        this.hTLV = this.asn1Obj.tohex();
        return this.hTLV;
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (h !== void 0) {
        if (b.x509.GeneralNames.prototype.isPrototypeOf(h)) {
          this.type = "full";
          this.tag = "a0";
          this.asn1V = h;
        } else {
          if (h.full !== void 0) {
            this.type = "full";
            this.tag = "a0";
            this.asn1V = new b.x509.GeneralNames(h.full);
          } else {
            throw new Error("This class supports GeneralNames only as argument");
          }
        }
      }
    };
    extendClass(KJUR.asn1.x509.DistributionPointName, KJUR.asn1.ASN1Object);
    KJUR.asn1.x509.CertificatePolicies = function(f) {
      KJUR.asn1.x509.CertificatePolicies.superclass.constructor.call(this, f);
      var c = KJUR, b = c.asn1, e2 = b.x509, a = b.DERSequence, d = e2.PolicyInformation;
      this.params = null;
      this.getExtnValueHex = function() {
        var j = [];
        for (var h = 0; h < this.params.array.length; h++) {
          j.push(new d(this.params.array[h]));
        }
        var g = new a({ array: j });
        this.asn1ExtnValue = g;
        return this.asn1ExtnValue.tohex();
      };
      this.oid = "2.5.29.32";
      if (f !== void 0) {
        this.params = f;
      }
    };
    extendClass(KJUR.asn1.x509.CertificatePolicies, KJUR.asn1.x509.Extension);
    KJUR.asn1.x509.PolicyInformation = function(d) {
      KJUR.asn1.x509.PolicyInformation.superclass.constructor.call(this, d);
      var c = KJUR.asn1, b = c.DERSequence, e2 = c.DERObjectIdentifier, a = c.x509.PolicyQualifierInfo;
      this.params = null;
      this.tohex = function() {
        if (this.params.policyoid === void 0 && this.params.array === void 0) {
          throw new Error("parameter oid and array missing");
        }
        var f = [new e2(this.params.policyoid)];
        if (this.params.array !== void 0) {
          var j = [];
          for (var h = 0; h < this.params.array.length; h++) {
            j.push(new a(this.params.array[h]));
          }
          if (j.length > 0) {
            f.push(new b({ array: j }));
          }
        }
        var g = new b({ array: f });
        return g.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (d !== void 0) {
        this.params = d;
      }
    };
    extendClass(KJUR.asn1.x509.PolicyInformation, KJUR.asn1.ASN1Object);
    KJUR.asn1.x509.PolicyQualifierInfo = function(e2) {
      KJUR.asn1.x509.PolicyQualifierInfo.superclass.constructor.call(this, e2);
      var c = KJUR.asn1, b = c.DERSequence, d = c.DERIA5String, f = c.DERObjectIdentifier, a = c.x509.UserNotice;
      this.params = null;
      this.tohex = function() {
        if (this.params.cps !== void 0) {
          var g = new b({ array: [new f({ oid: "1.3.6.1.5.5.7.2.1" }), new d({ str: this.params.cps })] });
          return g.tohex();
        }
        if (this.params.unotice != void 0) {
          var g = new b({ array: [new f({ oid: "1.3.6.1.5.5.7.2.2" }), new a(this.params.unotice)] });
          return g.tohex();
        }
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (e2 !== void 0) {
        this.params = e2;
      }
    };
    extendClass(KJUR.asn1.x509.PolicyQualifierInfo, KJUR.asn1.ASN1Object);
    KJUR.asn1.x509.UserNotice = function(e2) {
      KJUR.asn1.x509.UserNotice.superclass.constructor.call(this, e2);
      var a = KJUR.asn1.DERSequence, d = KJUR.asn1.DERInteger, c = KJUR.asn1.x509.DisplayText, b = KJUR.asn1.x509.NoticeReference;
      this.params = null;
      this.tohex = function() {
        var f = [];
        if (this.params.noticeref !== void 0) {
          f.push(new b(this.params.noticeref));
        }
        if (this.params.exptext !== void 0) {
          f.push(new c(this.params.exptext));
        }
        var g = new a({ array: f });
        return g.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (e2 !== void 0) {
        this.params = e2;
      }
    };
    extendClass(KJUR.asn1.x509.UserNotice, KJUR.asn1.ASN1Object);
    KJUR.asn1.x509.NoticeReference = function(d) {
      KJUR.asn1.x509.NoticeReference.superclass.constructor.call(this, d);
      var a = KJUR.asn1.DERSequence, c = KJUR.asn1.DERInteger, b = KJUR.asn1.x509.DisplayText;
      this.params = null;
      this.tohex = function() {
        var f = [];
        if (this.params.org !== void 0) {
          f.push(new b(this.params.org));
        }
        if (this.params.noticenum !== void 0) {
          var h = [];
          var e2 = this.params.noticenum;
          for (var j = 0; j < e2.length; j++) {
            h.push(new c(e2[j]));
          }
          f.push(new a({ array: h }));
        }
        if (f.length == 0) {
          throw new Error("parameter is empty");
        }
        var g = new a({ array: f });
        return g.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (d !== void 0) {
        this.params = d;
      }
    };
    extendClass(KJUR.asn1.x509.NoticeReference, KJUR.asn1.ASN1Object);
    KJUR.asn1.x509.DisplayText = function(a) {
      KJUR.asn1.x509.DisplayText.superclass.constructor.call(this, a);
      this.hT = "0c";
      if (a !== void 0) {
        if (a.type === "ia5") {
          this.hT = "16";
        } else {
          if (a.type === "vis") {
            this.hT = "1a";
          } else {
            if (a.type === "bmp") {
              this.hT = "1e";
            }
          }
        }
      }
    };
    extendClass(KJUR.asn1.x509.DisplayText, KJUR.asn1.DERAbstractString);
    KJUR.asn1.x509.PolicyMappings = function(e2) {
      KJUR.asn1.x509.PolicyMappings.superclass.constructor.call(this, e2);
      var c = KJUR, b = c.asn1, d = b.x509, a = b.ASN1Util.newObject;
      this.params = null;
      this.getExtnValueHex = function() {
        var j = this.params;
        var f = [];
        for (var g = 0; g < j.array.length; g++) {
          var h = j.array[g];
          f.push({ seq: [{ oid: h[0] }, { oid: h[1] }] });
        }
        this.asn1ExtnValue = a({ seq: f });
        return this.asn1ExtnValue.tohex();
      };
      this.oid = "2.5.29.33";
      if (e2 !== void 0) {
        this.params = e2;
      }
    };
    extendClass(KJUR.asn1.x509.PolicyMappings, KJUR.asn1.x509.Extension);
    KJUR.asn1.x509.PolicyConstraints = function(e2) {
      KJUR.asn1.x509.PolicyConstraints.superclass.constructor.call(this, e2);
      var c = KJUR, b = c.asn1, d = b.x509, a = b.ASN1Util.newObject;
      this.params = null;
      this.getExtnValueHex = function() {
        var g = this.params;
        var f = [];
        if (g.reqexp != void 0) {
          f.push({ tag: { tagi: "80", obj: { "int": g.reqexp } } });
        }
        if (g.inhibit != void 0) {
          f.push({ tag: { tagi: "81", obj: { "int": g.inhibit } } });
        }
        this.asn1ExtnValue = a({ seq: f });
        return this.asn1ExtnValue.tohex();
      };
      this.oid = "2.5.29.36";
      if (e2 !== void 0) {
        this.params = e2;
      }
    };
    extendClass(KJUR.asn1.x509.PolicyConstraints, KJUR.asn1.x509.Extension);
    KJUR.asn1.x509.InhibitAnyPolicy = function(e2) {
      KJUR.asn1.x509.InhibitAnyPolicy.superclass.constructor.call(this, e2);
      var c = KJUR, b = c.asn1, d = b.x509, a = b.ASN1Util.newObject;
      this.params = null;
      this.getExtnValueHex = function() {
        this.asn1ExtnValue = a({ "int": this.params.skip });
        return this.asn1ExtnValue.tohex();
      };
      this.oid = "2.5.29.54";
      if (e2 !== void 0) {
        this.params = e2;
      }
    };
    extendClass(KJUR.asn1.x509.InhibitAnyPolicy, KJUR.asn1.x509.Extension);
    KJUR.asn1.x509.NameConstraints = function(f) {
      KJUR.asn1.x509.NameConstraints.superclass.constructor.call(this, f);
      var c = KJUR, b = c.asn1, e2 = b.x509, a = b.ASN1Util.newObject, d = e2.GeneralSubtree;
      this.params = null;
      this.getExtnValueHex = function() {
        var l = this.params;
        var g = [];
        if (l.permit != void 0 && l.permit.length != void 0) {
          var k = [];
          for (var h = 0; h < l.permit.length; h++) {
            k.push(new d(l.permit[h]));
          }
          g.push({ tag: { tagi: "a0", obj: { seq: k } } });
        }
        if (l.exclude != void 0 && l.exclude.length != void 0) {
          var j = [];
          for (var h = 0; h < l.exclude.length; h++) {
            j.push(new d(l.exclude[h]));
          }
          g.push({ tag: { tagi: "a1", obj: { seq: j } } });
        }
        this.asn1ExtnValue = a({ seq: g });
        return this.asn1ExtnValue.tohex();
      };
      this.oid = "2.5.29.30";
      if (f !== void 0) {
        this.params = f;
      }
    };
    extendClass(KJUR.asn1.x509.NameConstraints, KJUR.asn1.x509.Extension);
    KJUR.asn1.x509.GeneralSubtree = function(e2) {
      KJUR.asn1.x509.GeneralSubtree.superclass.constructor.call(this);
      var b = KJUR.asn1, d = b.x509, c = d.GeneralName, a = b.ASN1Util.newObject;
      this.params = null;
      this.setByParam = function(f) {
        this.params = f;
      };
      this.tohex = function() {
        var h = this.params;
        var f = [new c(h)];
        if (h.min != void 0) {
          f.push({ tag: { tagi: "80", obj: { "int": h.min } } });
        }
        if (h.max != void 0) {
          f.push({ tag: { tagi: "81", obj: { "int": h.max } } });
        }
        var g = a({ seq: f });
        return g.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (e2 !== void 0) {
        this.setByParam(e2);
      }
    };
    extendClass(KJUR.asn1.x509.GeneralSubtree, KJUR.asn1.ASN1Object);
    KJUR.asn1.x509.ExtKeyUsage = function(c) {
      KJUR.asn1.x509.ExtKeyUsage.superclass.constructor.call(this, c);
      var b = KJUR, a = b.asn1;
      this.setPurposeArray = function(d) {
        this.asn1ExtnValue = new a.DERSequence();
        for (var e2 = 0; e2 < d.length; e2++) {
          var f = new a.DERObjectIdentifier(d[e2]);
          this.asn1ExtnValue.appendASN1Object(f);
        }
      };
      this.getExtnValueHex = function() {
        return this.asn1ExtnValue.tohex();
      };
      this.oid = "2.5.29.37";
      if (c !== void 0) {
        if (c.array !== void 0) {
          this.setPurposeArray(c.array);
        }
      }
    };
    extendClass(KJUR.asn1.x509.ExtKeyUsage, KJUR.asn1.x509.Extension);
    KJUR.asn1.x509.AuthorityKeyIdentifier = function(f) {
      KJUR.asn1.x509.AuthorityKeyIdentifier.superclass.constructor.call(this, f);
      var b = KJUR, a = b.asn1, d = a.DERTaggedObject, e2 = a.x509.GeneralNames, c = b.crypto.Util.isKey;
      this.asn1KID = null;
      this.asn1CertIssuer = null;
      this.asn1CertSN = null;
      this.getExtnValueHex = function() {
        var h = new Array();
        if (this.asn1KID) {
          h.push(new d({ explicit: false, tag: "80", obj: this.asn1KID }));
        }
        if (this.asn1CertIssuer) {
          h.push(new d({ explicit: false, tag: "a1", obj: new e2([{ dn: this.asn1CertIssuer }]) }));
        }
        if (this.asn1CertSN) {
          h.push(new d({ explicit: false, tag: "82", obj: this.asn1CertSN }));
        }
        var g = new a.DERSequence({ array: h });
        this.asn1ExtnValue = g;
        return this.asn1ExtnValue.tohex();
      };
      this.setKIDByParam = function(i) {
        if (i.str !== void 0 || i.hex !== void 0) {
          this.asn1KID = new KJUR.asn1.DEROctetString(i);
        } else {
          if (typeof i === "object" && KJUR.crypto.Util.isKey(i) || typeof i === "string" && i.indexOf("BEGIN ") != -1) {
            var h = i;
            if (typeof i === "string") {
              h = KEYUTIL.getKey(i);
            }
            var g = KEYUTIL.getKeyID(h);
            this.asn1KID = new KJUR.asn1.DEROctetString({ hex: g });
          }
        }
      };
      this.setCertIssuerByParam = function(g) {
        if (g.str !== void 0 || g.ldapstr !== void 0 || g.hex !== void 0 || g.certsubject !== void 0 || g.certissuer !== void 0) {
          this.asn1CertIssuer = new KJUR.asn1.x509.X500Name(g);
        } else {
          if (typeof g === "string" && g.indexOf("BEGIN ") != -1 && g.indexOf("CERTIFICATE") != -1) {
            this.asn1CertIssuer = new KJUR.asn1.x509.X500Name({ certissuer: g });
          }
        }
      };
      this.setCertSNByParam = function(i) {
        if (i.str !== void 0 || i.bigint !== void 0 || i.hex !== void 0) {
          this.asn1CertSN = new KJUR.asn1.DERInteger(i);
        } else {
          if (typeof i === "string" && i.indexOf("BEGIN ") != -1 && i.indexOf("CERTIFICATE")) {
            var g = new X509();
            g.readCertPEM(i);
            var h = g.getSerialNumberHex();
            this.asn1CertSN = new KJUR.asn1.DERInteger({ hex: h });
          }
        }
      };
      this.oid = "2.5.29.35";
      if (f !== void 0) {
        if (f.kid !== void 0) {
          this.setKIDByParam(f.kid);
        }
        if (f.issuer !== void 0) {
          this.setCertIssuerByParam(f.issuer);
        }
        if (f.sn !== void 0) {
          this.setCertSNByParam(f.sn);
        }
        if (f.issuersn !== void 0 && typeof f.issuersn === "string" && f.issuersn.indexOf("BEGIN ") != -1 && f.issuersn.indexOf("CERTIFICATE")) {
          this.setCertSNByParam(f.issuersn);
          this.setCertIssuerByParam(f.issuersn);
        }
      }
    };
    extendClass(KJUR.asn1.x509.AuthorityKeyIdentifier, KJUR.asn1.x509.Extension);
    KJUR.asn1.x509.SubjectKeyIdentifier = function(d) {
      KJUR.asn1.x509.SubjectKeyIdentifier.superclass.constructor.call(this, d);
      var b = KJUR, a = b.asn1, c = a.DEROctetString;
      this.asn1KID = null;
      this.getExtnValueHex = function() {
        this.asn1ExtnValue = this.asn1KID;
        return this.asn1ExtnValue.tohex();
      };
      this.setKIDByParam = function(g) {
        if (g.str !== void 0 || g.hex !== void 0) {
          this.asn1KID = new c(g);
        } else {
          if (typeof g === "object" && KJUR.crypto.Util.isKey(g) || typeof g === "string" && g.indexOf("BEGIN") != -1) {
            var f = g;
            if (typeof g === "string") {
              f = KEYUTIL.getKey(g);
            }
            var e2 = KEYUTIL.getKeyID(f);
            this.asn1KID = new KJUR.asn1.DEROctetString({ hex: e2 });
          }
        }
      };
      this.oid = "2.5.29.14";
      if (d !== void 0) {
        if (d.kid !== void 0) {
          this.setKIDByParam(d.kid);
        }
      }
    };
    extendClass(KJUR.asn1.x509.SubjectKeyIdentifier, KJUR.asn1.x509.Extension);
    KJUR.asn1.x509.AuthorityInfoAccess = function(a) {
      KJUR.asn1.x509.AuthorityInfoAccess.superclass.constructor.call(this, a);
      this.setAccessDescriptionArray = function(k) {
        var d = new Array(), b = KJUR, g = b.asn1, c = g.DERSequence, j = g.DERObjectIdentifier, l = g.x509.GeneralName;
        for (var f = 0; f < k.length; f++) {
          var e2;
          var h = k[f];
          if (h.ocsp !== void 0) {
            e2 = new c({ array: [new j({ oid: "1.3.6.1.5.5.7.48.1" }), new l({ uri: h.ocsp })] });
          } else {
            if (h.caissuer !== void 0) {
              e2 = new c({ array: [new j({ oid: "1.3.6.1.5.5.7.48.2" }), new l({ uri: h.caissuer })] });
            } else {
              throw new Error("unknown AccessMethod parameter: " + JSON.stringify(h));
            }
          }
          d.push(e2);
        }
        this.asn1ExtnValue = new c({ array: d });
      };
      this.getExtnValueHex = function() {
        return this.asn1ExtnValue.tohex();
      };
      this.oid = "1.3.6.1.5.5.7.1.1";
      if (a !== void 0) {
        if (a.array !== void 0) {
          this.setAccessDescriptionArray(a.array);
        }
      }
    };
    extendClass(KJUR.asn1.x509.AuthorityInfoAccess, KJUR.asn1.x509.Extension);
    KJUR.asn1.x509.SubjectAltName = function(a) {
      KJUR.asn1.x509.SubjectAltName.superclass.constructor.call(this, a);
      this.setNameArray = function(b) {
        this.asn1ExtnValue = new KJUR.asn1.x509.GeneralNames(b);
      };
      this.getExtnValueHex = function() {
        return this.asn1ExtnValue.tohex();
      };
      this.oid = "2.5.29.17";
      if (a !== void 0) {
        if (a.array !== void 0) {
          this.setNameArray(a.array);
        }
      }
    };
    extendClass(KJUR.asn1.x509.SubjectAltName, KJUR.asn1.x509.Extension);
    KJUR.asn1.x509.IssuerAltName = function(a) {
      KJUR.asn1.x509.IssuerAltName.superclass.constructor.call(this, a);
      this.setNameArray = function(b) {
        this.asn1ExtnValue = new KJUR.asn1.x509.GeneralNames(b);
      };
      this.getExtnValueHex = function() {
        return this.asn1ExtnValue.tohex();
      };
      this.oid = "2.5.29.18";
      if (a !== void 0) {
        if (a.array !== void 0) {
          this.setNameArray(a.array);
        }
      }
    };
    extendClass(KJUR.asn1.x509.IssuerAltName, KJUR.asn1.x509.Extension);
    KJUR.asn1.x509.SubjectDirectoryAttributes = function(e2) {
      KJUR.asn1.x509.SubjectDirectoryAttributes.superclass.constructor.call(this, e2);
      var c = KJUR.asn1, a = c.DERSequence, b = c.ASN1Util.newObject, d = c.x509.OID.name2oid;
      this.params = null;
      this.getExtnValueHex = function() {
        var f = [];
        for (var j = 0; j < this.params.array.length; j++) {
          var l = this.params.array[j];
          if (l.attr != void 0 && l.array != void 0) {
            var k = { seq: [{ oid: l.attr }, { set: l.array }] };
            f.push(b(k));
            continue;
          }
          var h = { seq: [{ oid: "1.2.3.4" }, { set: [{ utf8str: "DE" }] }] };
          if (l.attr == "dateOfBirth") {
            h.seq[0].oid = d(l.attr);
            h.seq[1].set[0] = { gentime: l.str };
          } else {
            if (l.attr == "placeOfBirth") {
              h.seq[0].oid = d(l.attr);
              h.seq[1].set[0] = { utf8str: l.str };
            } else {
              if (l.attr == "gender") {
                h.seq[0].oid = d(l.attr);
                h.seq[1].set[0] = { prnstr: l.str };
              } else {
                if (l.attr == "countryOfCitizenship") {
                  h.seq[0].oid = d(l.attr);
                  h.seq[1].set[0] = { prnstr: l.str };
                } else {
                  if (l.attr == "countryOfResidence") {
                    h.seq[0].oid = d(l.attr);
                    h.seq[1].set[0] = { prnstr: l.str };
                  } else {
                    throw new Error("unsupported attribute: " + l.attr);
                  }
                }
              }
            }
          }
          f.push(new b(h));
        }
        var g = new a({ array: f });
        this.asn1ExtnValue = g;
        return this.asn1ExtnValue.tohex();
      };
      this.oid = "2.5.29.9";
      if (e2 !== void 0) {
        this.params = e2;
      }
    };
    extendClass(KJUR.asn1.x509.SubjectDirectoryAttributes, KJUR.asn1.x509.Extension);
    KJUR.asn1.x509.PrivateExtension = function(f) {
      KJUR.asn1.x509.PrivateExtension.superclass.constructor.call(this, f);
      var c = KJUR, e2 = c.lang.String.isHex, b = c.asn1, d = b.x509.OID.name2oid, a = b.ASN1Util.newObject;
      this.params = null;
      this.setByParam = function(g) {
        this.oid = d(g.extname);
        this.params = g;
      };
      this.getExtnValueHex = function() {
        if (this.params.extname == void 0 || this.params.extn == void 0) {
          throw new Error("extname or extnhex not specified");
        }
        var h = this.params.extn;
        if (typeof h == "string" && e2(h)) {
          return h;
        } else {
          if (typeof h == "object") {
            try {
              return a(h).tohex();
            } catch (g) {
            }
          }
        }
        throw new Error("unsupported extn value");
      };
      if (f != void 0) {
        this.setByParam(f);
      }
    };
    extendClass(KJUR.asn1.x509.PrivateExtension, KJUR.asn1.x509.Extension);
    KJUR.asn1.x509.CRL = function(g) {
      KJUR.asn1.x509.CRL.superclass.constructor.call(this);
      var c = KJUR, b = c.asn1, a = b.DERSequence, e2 = b.DERBitString, f = b.x509, d = f.AlgorithmIdentifier, h = f.TBSCertList;
      this.params = void 0;
      this.setByParam = function(i) {
        this.params = i;
      };
      this.sign = function() {
        var j = new h(this.params).tohex();
        var k = new KJUR.crypto.Signature({ alg: this.params.sigalg });
        k.init(this.params.cakey);
        k.updateHex(j);
        var i = k.sign();
        this.params.sighex = i;
      };
      this.getPEM = function() {
        return hextopem(this.tohex(), "X509 CRL");
      };
      this.tohex = function() {
        var k = this.params;
        if (k.tbsobj == void 0) {
          k.tbsobj = new h(k);
        }
        if (k.sighex == void 0 && k.cakey != void 0) {
          this.sign();
        }
        if (k.sighex == void 0) {
          throw new Error("sighex or cakey parameter not defined");
        }
        var i = [];
        i.push(k.tbsobj);
        i.push(new d({ name: k.sigalg }));
        i.push(new e2({ hex: "00" + k.sighex }));
        var j = new a({ array: i });
        return j.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (g != void 0) {
        this.params = g;
      }
    };
    extendClass(KJUR.asn1.x509.CRL, KJUR.asn1.ASN1Object);
    KJUR.asn1.x509.TBSCertList = function(f) {
      KJUR.asn1.x509.TBSCertList.superclass.constructor.call(this);
      var b = KJUR, i = b.asn1, h = i.DERInteger, g = i.DERSequence, c = i.DERTaggedObject, k = i.DERObjectIdentifier, d = i.x509, l = d.AlgorithmIdentifier, e2 = d.Time, j = d.Extensions, a = d.X500Name;
      this.params = null;
      this.setByParam = function(m) {
        this.params = m;
      };
      this.getRevCertSequence = function() {
        var m = [];
        var n2 = this.params.revcert;
        for (var o2 = 0; o2 < n2.length; o2++) {
          var p = [new h(n2[o2].sn), new e2(n2[o2].date)];
          if (n2[o2].ext != void 0) {
            p.push(new j(n2[o2].ext));
          }
          m.push(new g({ array: p }));
        }
        return new g({ array: m });
      };
      this.tohex = function() {
        var n2 = [];
        var r2 = this.params;
        if (r2.version != void 0) {
          var m = r2.version - 1;
          var p = new h({ "int": m });
          n2.push(p);
        }
        n2.push(new l({ name: r2.sigalg }));
        n2.push(new a(r2.issuer));
        n2.push(new e2(r2.thisupdate));
        if (r2.nextupdate != void 0) {
          n2.push(new e2(r2.nextupdate));
        }
        if (r2.revcert != void 0) {
          n2.push(this.getRevCertSequence());
        }
        if (r2.ext != void 0) {
          var q = new j(r2.ext);
          n2.push(new c({ tag: "a0", explicit: true, obj: q }));
        }
        var o2 = new g({ array: n2 });
        return o2.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (f !== void 0) {
        this.setByParam(f);
      }
    };
    extendClass(KJUR.asn1.x509.TBSCertList, KJUR.asn1.ASN1Object);
    KJUR.asn1.x509.CRLEntry = function(e2) {
      KJUR.asn1.x509.CRLEntry.superclass.constructor.call(this);
      var d = null, c = null, b = KJUR, a = b.asn1;
      this.setCertSerial = function(f) {
        this.sn = new a.DERInteger(f);
      };
      this.setRevocationDate = function(f) {
        this.time = new a.x509.Time(f);
      };
      this.tohex = function() {
        var f = new a.DERSequence({ array: [this.sn, this.time] });
        this.TLV = f.tohex();
        return this.TLV;
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (e2 !== void 0) {
        if (e2.time !== void 0) {
          this.setRevocationDate(e2.time);
        }
        if (e2.sn !== void 0) {
          this.setCertSerial(e2.sn);
        }
      }
    };
    extendClass(KJUR.asn1.x509.CRLEntry, KJUR.asn1.ASN1Object);
    KJUR.asn1.x509.CRLNumber = function(a) {
      KJUR.asn1.x509.CRLNumber.superclass.constructor.call(this, a);
      this.params = void 0;
      this.getExtnValueHex = function() {
        this.asn1ExtnValue = new KJUR.asn1.DERInteger(this.params.num);
        return this.asn1ExtnValue.tohex();
      };
      this.oid = "2.5.29.20";
      if (a != void 0) {
        this.params = a;
      }
    };
    extendClass(KJUR.asn1.x509.CRLNumber, KJUR.asn1.x509.Extension);
    KJUR.asn1.x509.CRLReason = function(a) {
      KJUR.asn1.x509.CRLReason.superclass.constructor.call(this, a);
      this.params = void 0;
      this.getExtnValueHex = function() {
        this.asn1ExtnValue = new KJUR.asn1.DEREnumerated(this.params.code);
        return this.asn1ExtnValue.tohex();
      };
      this.oid = "2.5.29.21";
      if (a != void 0) {
        this.params = a;
      }
    };
    extendClass(KJUR.asn1.x509.CRLReason, KJUR.asn1.x509.Extension);
    KJUR.asn1.x509.OCSPNonce = function(a) {
      KJUR.asn1.x509.OCSPNonce.superclass.constructor.call(this, a);
      this.params = void 0;
      this.getExtnValueHex = function() {
        this.asn1ExtnValue = new KJUR.asn1.DEROctetString(this.params);
        return this.asn1ExtnValue.tohex();
      };
      this.oid = "1.3.6.1.5.5.7.48.1.2";
      if (a != void 0) {
        this.params = a;
      }
    };
    extendClass(KJUR.asn1.x509.OCSPNonce, KJUR.asn1.x509.Extension);
    KJUR.asn1.x509.OCSPNoCheck = function(a) {
      KJUR.asn1.x509.OCSPNoCheck.superclass.constructor.call(this, a);
      this.params = void 0;
      this.getExtnValueHex = function() {
        this.asn1ExtnValue = new KJUR.asn1.DERNull();
        return this.asn1ExtnValue.tohex();
      };
      this.oid = "1.3.6.1.5.5.7.48.1.5";
      if (a != void 0) {
        this.params = a;
      }
    };
    extendClass(KJUR.asn1.x509.OCSPNoCheck, KJUR.asn1.x509.Extension);
    KJUR.asn1.x509.AdobeTimeStamp = function(g) {
      KJUR.asn1.x509.AdobeTimeStamp.superclass.constructor.call(this, g);
      var c = KJUR, b = c.asn1, f = b.DERInteger, d = b.DERBoolean, a = b.DERSequence, e2 = b.x509.GeneralName;
      this.params = null;
      this.getExtnValueHex = function() {
        var i = this.params;
        var h = [new f(1)];
        h.push(new e2({ uri: i.uri }));
        if (i.reqauth != void 0) {
          h.push(new d(i.reqauth));
        }
        this.asn1ExtnValue = new a({ array: h });
        return this.asn1ExtnValue.tohex();
      };
      this.oid = "1.2.840.113583.1.1.9.1";
      if (g !== void 0) {
        this.setByParam(g);
      }
    };
    extendClass(KJUR.asn1.x509.AdobeTimeStamp, KJUR.asn1.x509.Extension);
    KJUR.asn1.x509.X500Name = function(f) {
      KJUR.asn1.x509.X500Name.superclass.constructor.call(this);
      this.asn1Array = [];
      this.paramArray = [];
      this.sRule = "utf8";
      var c = KJUR, b = c.asn1, e2 = b.x509, d = e2.RDN, a = pemtohex;
      this.setByString = function(g, l) {
        if (l !== void 0) {
          this.sRule = l;
        }
        var k = g.split("/");
        k.shift();
        var j = [];
        for (var m = 0; m < k.length; m++) {
          if (k[m].match(/^[^=]+=.+$/)) {
            j.push(k[m]);
          } else {
            var h = j.length - 1;
            j[h] = j[h] + "/" + k[m];
          }
        }
        for (var m = 0; m < j.length; m++) {
          this.asn1Array.push(new d({ str: j[m], rule: this.sRule }));
        }
      };
      this.setByLdapString = function(g, h) {
        if (h !== void 0) {
          this.sRule = h;
        }
        var i = e2.X500Name.ldapToCompat(g);
        this.setByString(i, h);
      };
      this.setByObject = function(j, i) {
        if (i !== void 0) {
          this.sRule = i;
        }
        for (var g in j) {
          if (j.hasOwnProperty(g)) {
            var h = new d({ str: g + "=" + j[g], rule: this.sRule });
            this.asn1Array ? this.asn1Array.push(h) : this.asn1Array = [h];
          }
        }
      };
      this.setByParam = function(h) {
        if (h.rule !== void 0) {
          this.sRule = h.rule;
        }
        if (h.array !== void 0) {
          this.paramArray = h.array;
        } else {
          if (h.str !== void 0) {
            this.setByString(h.str);
          } else {
            if (h.ldapstr !== void 0) {
              this.setByLdapString(h.ldapstr);
            } else {
              if (h.hex !== void 0) {
                this.hTLV = h.hex;
              } else {
                if (h.certissuer !== void 0) {
                  var g = new X509();
                  g.readCertPEM(h.certissuer);
                  this.hTLV = g.getIssuerHex();
                } else {
                  if (h.certsubject !== void 0) {
                    var g = new X509();
                    g.readCertPEM(h.certsubject);
                    this.hTLV = g.getSubjectHex();
                  } else {
                    if (typeof h === "object" && h.certsubject === void 0 && h.certissuer === void 0) {
                      this.setByObject(h);
                    }
                  }
                }
              }
            }
          }
        }
      };
      this.tohex = function() {
        if (typeof this.hTLV == "string") {
          return this.hTLV;
        }
        if (this.asn1Array.length == 0 && this.paramArray.length > 0) {
          for (var g = 0; g < this.paramArray.length; g++) {
            var k = { array: this.paramArray[g] };
            if (this.sRule != "utf8") {
              k.rule = this.sRule;
            }
            var h = new d(k);
            this.asn1Array.push(h);
          }
        }
        var j = new b.DERSequence({ array: this.asn1Array });
        this.hTLV = j.tohex();
        return this.hTLV;
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (f !== void 0) {
        this.setByParam(f);
      }
    };
    extendClass(KJUR.asn1.x509.X500Name, KJUR.asn1.ASN1Object);
    KJUR.asn1.x509.X500Name.compatToLDAP = function(d) {
      if (d.substr(0, 1) !== "/") {
        throw "malformed input";
      }
      var b = "";
      d = d.substr(1);
      var c = d.split("/");
      c.reverse();
      c = c.map(function(a) {
        return a.replace(/,/, "\\,");
      });
      return c.join(",");
    };
    KJUR.asn1.x509.X500Name.onelineToLDAP = function(a) {
      return KJUR.asn1.x509.X500Name.compatToLDAP(a);
    };
    KJUR.asn1.x509.X500Name.ldapToCompat = function(g) {
      var c = g.split(",");
      var e2 = false;
      var b = [];
      for (var f = 0; c.length > 0; f++) {
        var h = c.shift();
        if (e2 === true) {
          var d = b.pop();
          var j = (d + "," + h).replace(/\\,/g, ",");
          b.push(j);
          e2 = false;
        } else {
          b.push(h);
        }
        if (h.substr(-1, 1) === "\\") {
          e2 = true;
        }
      }
      b = b.map(function(a) {
        return a.replace("/", "\\/");
      });
      b.reverse();
      return "/" + b.join("/");
    };
    KJUR.asn1.x509.X500Name.ldapToOneline = function(a) {
      return KJUR.asn1.x509.X500Name.ldapToCompat(a);
    };
    KJUR.asn1.x509.RDN = function(b) {
      KJUR.asn1.x509.RDN.superclass.constructor.call(this);
      this.asn1Array = [];
      this.paramArray = [];
      this.sRule = "utf8";
      var a = KJUR.asn1.x509.AttributeTypeAndValue;
      this.setByParam = function(c) {
        if (c.rule !== void 0) {
          this.sRule = c.rule;
        }
        if (c.str !== void 0) {
          this.addByMultiValuedString(c.str);
        }
        if (c.array !== void 0) {
          this.paramArray = c.array;
        }
      };
      this.addByString = function(c) {
        this.asn1Array.push(new KJUR.asn1.x509.AttributeTypeAndValue({ str: c, rule: this.sRule }));
      };
      this.addByMultiValuedString = function(e2) {
        var c = KJUR.asn1.x509.RDN.parseString(e2);
        for (var d = 0; d < c.length; d++) {
          this.addByString(c[d]);
        }
      };
      this.tohex = function() {
        if (this.asn1Array.length == 0 && this.paramArray.length > 0) {
          for (var d = 0; d < this.paramArray.length; d++) {
            var f = this.paramArray[d];
            if (f.rule !== void 0 && this.sRule != "utf8") {
              f.rule = this.sRule;
            }
            var c = new a(f);
            this.asn1Array.push(c);
          }
        }
        var e2 = new KJUR.asn1.DERSet({ array: this.asn1Array });
        this.TLV = e2.tohex();
        return this.TLV;
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (b !== void 0) {
        this.setByParam(b);
      }
    };
    extendClass(KJUR.asn1.x509.RDN, KJUR.asn1.ASN1Object);
    KJUR.asn1.x509.RDN.parseString = function(m) {
      var j = m.split(/\+/);
      var h = false;
      var c = [];
      for (var g = 0; j.length > 0; g++) {
        var k = j.shift();
        if (h === true) {
          var f = c.pop();
          var d = (f + "+" + k).replace(/\\\+/g, "+");
          c.push(d);
          h = false;
        } else {
          c.push(k);
        }
        if (k.substr(-1, 1) === "\\") {
          h = true;
        }
      }
      var l = false;
      var b = [];
      for (var g = 0; c.length > 0; g++) {
        var k = c.shift();
        if (l === true) {
          var e2 = b.pop();
          if (k.match(/"$/)) {
            var d = (e2 + "+" + k).replace(/^([^=]+)="(.*)"$/, "$1=$2");
            b.push(d);
            l = false;
          } else {
            b.push(e2 + "+" + k);
          }
        } else {
          b.push(k);
        }
        if (k.match(/^[^=]+="/)) {
          l = true;
        }
      }
      return b;
    };
    KJUR.asn1.x509.AttributeTypeAndValue = function(c) {
      KJUR.asn1.x509.AttributeTypeAndValue.superclass.constructor.call(this);
      this.sRule = "utf8";
      this.sType = null;
      this.sValue = null;
      this.dsType = null;
      var a = KJUR, g = a.asn1, d = g.DERSequence, l = g.DERUTF8String, i = g.DERPrintableString, h = g.DERTeletexString, b = g.DERIA5String, e2 = g.DERVisibleString, k = g.DERBMPString, f = a.lang.String.isMail, j = a.lang.String.isPrintable;
      this.setByParam = function(o2) {
        if (o2.rule !== void 0) {
          this.sRule = o2.rule;
        }
        if (o2.ds !== void 0) {
          this.dsType = o2.ds;
        }
        if (o2.value === void 0 && o2.str !== void 0) {
          var n2 = o2.str;
          var m = n2.match(/^([^=]+)=(.+)$/);
          if (m) {
            this.sType = m[1];
            this.sValue = m[2];
          } else {
            throw new Error("malformed attrTypeAndValueStr: " + attrTypeAndValueStr);
          }
        } else {
          this.sType = o2.type;
          this.sValue = o2.value;
        }
      };
      this.setByString = function(n2, o2) {
        if (o2 !== void 0) {
          this.sRule = o2;
        }
        var m = n2.match(/^([^=]+)=(.+)$/);
        if (m) {
          this.setByAttrTypeAndValueStr(m[1], m[2]);
        } else {
          throw new Error("malformed attrTypeAndValueStr: " + attrTypeAndValueStr);
        }
      };
      this._getDsType = function() {
        var o2 = this.sType;
        var n2 = this.sValue;
        var m = this.sRule;
        if (m === "prn") {
          if (o2 == "CN" && f(n2)) {
            return "ia5";
          }
          if (j(n2)) {
            return "prn";
          }
          return "utf8";
        } else {
          if (m === "utf8") {
            if (o2 == "CN" && f(n2)) {
              return "ia5";
            }
            if (o2 == "C") {
              return "prn";
            }
            return "utf8";
          }
        }
        return "utf8";
      };
      this.setByAttrTypeAndValueStr = function(o2, n2, m) {
        if (m !== void 0) {
          this.sRule = m;
        }
        this.sType = o2;
        this.sValue = n2;
      };
      this.getValueObj = function(n2, m) {
        if (n2 == "utf8") {
          return new l({ str: m });
        }
        if (n2 == "prn") {
          return new i({ str: m });
        }
        if (n2 == "tel") {
          return new h({ str: m });
        }
        if (n2 == "ia5") {
          return new b({ str: m });
        }
        if (n2 == "vis") {
          return new e2({ str: m });
        }
        if (n2 == "bmp") {
          return new k({ str: m });
        }
        throw new Error("unsupported directory string type: type=" + n2 + " value=" + m);
      };
      this.tohex = function() {
        if (this.dsType == null) {
          this.dsType = this._getDsType();
        }
        var n2 = KJUR.asn1.x509.OID.atype2obj(this.sType);
        var m = this.getValueObj(this.dsType, this.sValue);
        var p = new d({ array: [n2, m] });
        this.TLV = p.tohex();
        return this.TLV;
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (c !== void 0) {
        this.setByParam(c);
      }
    };
    extendClass(KJUR.asn1.x509.AttributeTypeAndValue, KJUR.asn1.ASN1Object);
    KJUR.asn1.x509.SubjectPublicKeyInfo = function(f) {
      KJUR.asn1.x509.SubjectPublicKeyInfo.superclass.constructor.call(this);
      var l = null, k = null, a = KJUR, j = a.asn1, i = j.DERInteger, b = j.DERBitString, m = j.DERObjectIdentifier, e2 = j.DERSequence, h = j.ASN1Util.newObject, d = j.x509, o2 = d.AlgorithmIdentifier, g = a.crypto, n2 = g.ECDSA, c = g.DSA;
      this.getASN1Object = function() {
        if (this.asn1AlgId == null || this.asn1SubjPKey == null) {
          throw "algId and/or subjPubKey not set";
        }
        var p = new e2({ array: [this.asn1AlgId, this.asn1SubjPKey] });
        return p;
      };
      this.tohex = function() {
        var p = this.getASN1Object();
        this.hTLV = p.tohex();
        return this.hTLV;
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      this.setPubKey = function(q) {
        try {
          if (q instanceof RSAKey) {
            var u = h({ seq: [{ "int": { bigint: q.n } }, { "int": { "int": q.e } }] });
            var s = u.tohex();
            this.asn1AlgId = new o2({ name: "rsaEncryption" });
            this.asn1SubjPKey = new b({ hex: "00" + s });
          }
        } catch (p) {
        }
        try {
          if (q instanceof KJUR.crypto.ECDSA) {
            var r2 = new m({ name: q.curveName });
            this.asn1AlgId = new o2({ name: "ecPublicKey", asn1params: r2 });
            this.asn1SubjPKey = new b({ hex: "00" + q.pubKeyHex });
          }
        } catch (p) {
        }
        try {
          if (q instanceof KJUR.crypto.DSA) {
            var r2 = new h({ seq: [{ "int": { bigint: q.p } }, { "int": { bigint: q.q } }, { "int": { bigint: q.g } }] });
            this.asn1AlgId = new o2({ name: "dsa", asn1params: r2 });
            var t3 = new i({ bigint: q.y });
            this.asn1SubjPKey = new b({ hex: "00" + t3.tohex() });
          }
        } catch (p) {
        }
      };
      if (f !== void 0) {
        this.setPubKey(f);
      }
    };
    extendClass(KJUR.asn1.x509.SubjectPublicKeyInfo, KJUR.asn1.ASN1Object);
    KJUR.asn1.x509.Time = function(f) {
      KJUR.asn1.x509.Time.superclass.constructor.call(this);
      var e2 = null, a = null, d = KJUR, c = d.asn1, b = c.DERUTCTime, g = c.DERGeneralizedTime;
      this.params = null;
      this.type = null;
      this.setTimeParams = function(h) {
        this.timeParams = h;
      };
      this.setByParam = function(h) {
        this.params = h;
      };
      this.getType = function(h) {
        if (h.match(/^[0-9]{12}Z$/)) {
          return "utc";
        }
        if (h.match(/^[0-9]{14}Z$/)) {
          return "gen";
        }
        if (h.match(/^[0-9]{12}\.[0-9]+Z$/)) {
          return "utc";
        }
        if (h.match(/^[0-9]{14}\.[0-9]+Z$/)) {
          return "gen";
        }
        return null;
      };
      this.tohex = function() {
        var i = this.params;
        var h = null;
        if (typeof i == "string") {
          i = { str: i };
        }
        if (i != null && i.str && (i.type == null || i.type == void 0)) {
          i.type = this.getType(i.str);
        }
        if (i != null && i.str) {
          if (i.type == "utc") {
            h = new b(i.str);
          }
          if (i.type == "gen") {
            h = new g(i.str);
          }
        } else {
          if (this.type == "gen") {
            h = new g();
          } else {
            h = new b();
          }
        }
        if (h == null) {
          throw new Error("wrong setting for Time");
        }
        this.TLV = h.tohex();
        return this.TLV;
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (f != void 0) {
        this.setByParam(f);
      }
    };
    KJUR.asn1.x509.Time_bak = function(f) {
      KJUR.asn1.x509.Time_bak.superclass.constructor.call(this);
      var e2 = null, a = null, d = KJUR, c = d.asn1, b = c.DERUTCTime, g = c.DERGeneralizedTime;
      this.setTimeParams = function(h) {
        this.timeParams = h;
      };
      this.tohex = function() {
        var h = null;
        if (this.timeParams != null) {
          if (this.type == "utc") {
            h = new b(this.timeParams);
          } else {
            h = new g(this.timeParams);
          }
        } else {
          if (this.type == "utc") {
            h = new b();
          } else {
            h = new g();
          }
        }
        this.TLV = h.tohex();
        return this.TLV;
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      this.type = "utc";
      if (f !== void 0) {
        if (f.type !== void 0) {
          this.type = f.type;
        } else {
          if (f.str !== void 0) {
            if (f.str.match(/^[0-9]{12}Z$/)) {
              this.type = "utc";
            }
            if (f.str.match(/^[0-9]{14}Z$/)) {
              this.type = "gen";
            }
          }
        }
        this.timeParams = f;
      }
    };
    extendClass(KJUR.asn1.x509.Time, KJUR.asn1.ASN1Object);
    KJUR.asn1.x509.AlgorithmIdentifier = function(e2) {
      KJUR.asn1.x509.AlgorithmIdentifier.superclass.constructor.call(this);
      this.nameAlg = null;
      this.asn1Alg = null;
      this.asn1Params = null;
      this.paramEmpty = false;
      var b = KJUR, a = b.asn1, c = a.x509.AlgorithmIdentifier.PSSNAME2ASN1TLV;
      this.tohex = function() {
        if (this.nameAlg === null && this.asn1Alg === null) {
          throw new Error("algorithm not specified");
        }
        if (this.nameAlg !== null) {
          var f = null;
          for (var h in c) {
            if (h === this.nameAlg) {
              f = c[h];
            }
          }
          if (f !== null) {
            this.hTLV = f;
            return this.hTLV;
          }
        }
        if (this.nameAlg !== null && this.asn1Alg === null) {
          this.asn1Alg = a.x509.OID.name2obj(this.nameAlg);
        }
        var g = [this.asn1Alg];
        if (this.asn1Params !== null) {
          g.push(this.asn1Params);
        }
        var i = new a.DERSequence({ array: g });
        this.hTLV = i.tohex();
        return this.hTLV;
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (e2 !== void 0) {
        if (e2.name !== void 0) {
          this.nameAlg = e2.name;
        }
        if (e2.asn1params !== void 0) {
          this.asn1Params = e2.asn1params;
        }
        if (e2.paramempty !== void 0) {
          this.paramEmpty = e2.paramempty;
        }
      }
      if (this.asn1Params === null && this.paramEmpty === false && this.nameAlg !== null) {
        if (this.nameAlg.name !== void 0) {
          this.nameAlg = this.nameAlg.name;
        }
        var d = this.nameAlg.toLowerCase();
        if (d.substr(-7, 7) !== "withdsa" && d.substr(-9, 9) !== "withecdsa") {
          this.asn1Params = new a.DERNull();
        }
      }
    };
    extendClass(KJUR.asn1.x509.AlgorithmIdentifier, KJUR.asn1.ASN1Object);
    KJUR.asn1.x509.AlgorithmIdentifier.PSSNAME2ASN1TLV = { SHAwithRSAandMGF1: "300d06092a864886f70d01010a3000", SHA256withRSAandMGF1: "303d06092a864886f70d01010a3030a00d300b0609608648016503040201a11a301806092a864886f70d010108300b0609608648016503040201a203020120", SHA384withRSAandMGF1: "303d06092a864886f70d01010a3030a00d300b0609608648016503040202a11a301806092a864886f70d010108300b0609608648016503040202a203020130", SHA512withRSAandMGF1: "303d06092a864886f70d01010a3030a00d300b0609608648016503040203a11a301806092a864886f70d010108300b0609608648016503040203a203020140" };
    KJUR.asn1.x509.GeneralName = function(f) {
      KJUR.asn1.x509.GeneralName.superclass.constructor.call(this);
      var l = { rfc822: "81", dns: "82", dn: "a4", uri: "86", ip: "87", otherName: "a0" }, b = KJUR, h = b.asn1, d = h.x509, a = d.X500Name, g = d.OtherName, e2 = h.DERIA5String, i = h.DERPrintableString, k = h.DEROctetString, c = h.DERTaggedObject, m = h.ASN1Object, j = Error;
      this.params = null;
      this.setByParam = function(n2) {
        this.params = n2;
      };
      this.tohex = function() {
        var p = this.params;
        var A, y, q;
        var y = false;
        if (p.other !== void 0) {
          A = "a0", q = new g(p.other);
        } else {
          if (p.rfc822 !== void 0) {
            A = "81";
            q = new e2({ str: p.rfc822 });
          } else {
            if (p.dns !== void 0) {
              A = "82";
              q = new e2({ str: p.dns });
            } else {
              if (p.dn !== void 0) {
                A = "a4";
                y = true;
                if (typeof p.dn === "string") {
                  q = new a({ str: p.dn });
                } else {
                  if (p.dn instanceof KJUR.asn1.x509.X500Name) {
                    q = p.dn;
                  } else {
                    q = new a(p.dn);
                  }
                }
              } else {
                if (p.ldapdn !== void 0) {
                  A = "a4";
                  y = true;
                  q = new a({ ldapstr: p.ldapdn });
                } else {
                  if (p.certissuer !== void 0 || p.certsubj !== void 0) {
                    A = "a4";
                    y = true;
                    var n2, o2;
                    var z2 = null;
                    if (p.certsubj !== void 0) {
                      n2 = false;
                      o2 = p.certsubj;
                    } else {
                      n2 = true;
                      o2 = p.certissuer;
                    }
                    if (o2.match(/^[0-9A-Fa-f]+$/)) {
                      z2 == o2;
                    }
                    if (o2.indexOf("-----BEGIN ") != -1) {
                      z2 = pemtohex(o2);
                    }
                    if (z2 == null) {
                      throw new Error("certsubj/certissuer not cert");
                    }
                    var w = new X509();
                    w.hex = z2;
                    var s;
                    if (n2) {
                      s = w.getIssuerHex();
                    } else {
                      s = w.getSubjectHex();
                    }
                    q = new m();
                    q.hTLV = s;
                  } else {
                    if (p.uri !== void 0) {
                      A = "86";
                      q = new e2({ str: p.uri });
                    } else {
                      if (p.ip !== void 0) {
                        A = "87";
                        var v;
                        var t3 = p.ip;
                        try {
                          if (t3.match(/^[0-9a-f]+$/)) {
                            var r2 = t3.length;
                            if (r2 == 8 || r2 == 16 || r2 == 32 || r2 == 64) {
                              v = t3;
                            } else {
                              throw "err";
                            }
                          } else {
                            v = iptohex(t3);
                          }
                        } catch (u) {
                          throw new j("malformed IP address: " + p.ip + ":" + u.message);
                        }
                        q = new k({ hex: v });
                      } else {
                        throw new j("improper params");
                      }
                    }
                  }
                }
              }
            }
          }
        }
        var B = new c({ tag: A, explicit: y, obj: q });
        return B.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (f !== void 0) {
        this.setByParam(f);
      }
    };
    extendClass(KJUR.asn1.x509.GeneralName, KJUR.asn1.ASN1Object);
    KJUR.asn1.x509.GeneralNames = function(d) {
      KJUR.asn1.x509.GeneralNames.superclass.constructor.call(this);
      var a = null, c = KJUR, b = c.asn1;
      this.setByParamArray = function(g) {
        for (var e2 = 0; e2 < g.length; e2++) {
          var f = new b.x509.GeneralName(g[e2]);
          this.asn1Array.push(f);
        }
      };
      this.tohex = function() {
        var e2 = new b.DERSequence({ array: this.asn1Array });
        return e2.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      this.asn1Array = new Array();
      if (typeof d != "undefined") {
        this.setByParamArray(d);
      }
    };
    extendClass(KJUR.asn1.x509.GeneralNames, KJUR.asn1.ASN1Object);
    KJUR.asn1.x509.OtherName = function(g) {
      KJUR.asn1.x509.OtherName.superclass.constructor.call(this);
      var f = null, e2 = null, d = KJUR, c = d.asn1, h = c.DERObjectIdentifier, a = c.DERSequence, b = c.ASN1Util.newObject;
      this.params = null;
      this.setByParam = function(i) {
        this.params = i;
      };
      this.tohex = function() {
        var k = this.params;
        if (k.oid == void 0 || k.value == void 0) {
          throw new Error("oid or value not specified");
        }
        var l = new h({ oid: k.oid });
        var i = b({ tag: { tag: "a0", explicit: true, obj: k.value } });
        var j = new a({ array: [l, i] });
        return j.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (g !== void 0) {
        this.setByParam(g);
      }
    };
    extendClass(KJUR.asn1.x509.OtherName, KJUR.asn1.ASN1Object);
    KJUR.asn1.x509.OID = new function() {
      var a = KJUR.asn1.DERObjectIdentifier;
      this.name2oidList = { "aes128-CBC": "2.16.840.1.101.3.4.1.2", "aes256-CBC": "2.16.840.1.101.3.4.1.42", sha1: "1.3.14.3.2.26", sha256: "2.16.840.1.101.3.4.2.1", sha384: "2.16.840.1.101.3.4.2.2", sha512: "2.16.840.1.101.3.4.2.3", sha224: "2.16.840.1.101.3.4.2.4", md5: "1.2.840.113549.2.5", md2: "1.3.14.7.2.2.1", ripemd160: "1.3.36.3.2.1", hmacWithSHA1: "1.2.840.113549.2.7", hmacWithSHA224: "1.2.840.113549.2.8", hmacWithSHA256: "1.2.840.113549.2.9", hmacWithSHA384: "1.2.840.113549.2.10", hmacWithSHA512: "1.2.840.113549.2.11", MD2withRSA: "1.2.840.113549.1.1.2", MD4withRSA: "1.2.840.113549.1.1.3", MD5withRSA: "1.2.840.113549.1.1.4", SHA1withRSA: "1.2.840.113549.1.1.5", "pkcs1-MGF": "1.2.840.113549.1.1.8", rsaPSS: "1.2.840.113549.1.1.10", SHA224withRSA: "1.2.840.113549.1.1.14", SHA256withRSA: "1.2.840.113549.1.1.11", SHA384withRSA: "1.2.840.113549.1.1.12", SHA512withRSA: "1.2.840.113549.1.1.13", SHA1withECDSA: "1.2.840.10045.4.1", SHA224withECDSA: "1.2.840.10045.4.3.1", SHA256withECDSA: "1.2.840.10045.4.3.2", SHA384withECDSA: "1.2.840.10045.4.3.3", SHA512withECDSA: "1.2.840.10045.4.3.4", dsa: "1.2.840.10040.4.1", SHA1withDSA: "1.2.840.10040.4.3", SHA224withDSA: "2.16.840.1.101.3.4.3.1", SHA256withDSA: "2.16.840.1.101.3.4.3.2", rsaEncryption: "1.2.840.113549.1.1.1", commonName: "2.5.4.3", countryName: "2.5.4.6", localityName: "2.5.4.7", stateOrProvinceName: "2.5.4.8", streetAddress: "2.5.4.9", organizationName: "2.5.4.10", organizationalUnitName: "2.5.4.11", domainComponent: "0.9.2342.19200300.100.1.25", userId: "0.9.2342.19200300.100.1.1", surname: "2.5.4.4", givenName: "2.5.4.42", title: "2.5.4.12", distinguishedName: "2.5.4.49", emailAddress: "1.2.840.113549.1.9.1", description: "2.5.4.13", businessCategory: "2.5.4.15", postalCode: "2.5.4.17", uniqueIdentifier: "2.5.4.45", organizationIdentifier: "2.5.4.97", jurisdictionOfIncorporationL: "1.3.6.1.4.1.311.60.2.1.1", jurisdictionOfIncorporationSP: "1.3.6.1.4.1.311.60.2.1.2", jurisdictionOfIncorporationC: "1.3.6.1.4.1.311.60.2.1.3", subjectDirectoryAttributes: "2.5.29.9", subjectKeyIdentifier: "2.5.29.14", keyUsage: "2.5.29.15", subjectAltName: "2.5.29.17", issuerAltName: "2.5.29.18", basicConstraints: "2.5.29.19", cRLNumber: "2.5.29.20", cRLReason: "2.5.29.21", nameConstraints: "2.5.29.30", cRLDistributionPoints: "2.5.29.31", certificatePolicies: "2.5.29.32", anyPolicy: "2.5.29.32.0", policyMappings: "2.5.29.33", authorityKeyIdentifier: "2.5.29.35", policyConstraints: "2.5.29.36", extKeyUsage: "2.5.29.37", inhibitAnyPolicy: "2.5.29.54", authorityInfoAccess: "1.3.6.1.5.5.7.1.1", ocsp: "1.3.6.1.5.5.7.48.1", ocspBasic: "1.3.6.1.5.5.7.48.1.1", ocspNonce: "1.3.6.1.5.5.7.48.1.2", ocspNoCheck: "1.3.6.1.5.5.7.48.1.5", caIssuers: "1.3.6.1.5.5.7.48.2", anyExtendedKeyUsage: "2.5.29.37.0", serverAuth: "1.3.6.1.5.5.7.3.1", clientAuth: "1.3.6.1.5.5.7.3.2", codeSigning: "1.3.6.1.5.5.7.3.3", emailProtection: "1.3.6.1.5.5.7.3.4", timeStamping: "1.3.6.1.5.5.7.3.8", ocspSigning: "1.3.6.1.5.5.7.3.9", smtpUTF8Mailbox: "1.3.6.1.5.5.7.8.9", dateOfBirth: "1.3.6.1.5.5.7.9.1", placeOfBirth: "1.3.6.1.5.5.7.9.2", gender: "1.3.6.1.5.5.7.9.3", countryOfCitizenship: "1.3.6.1.5.5.7.9.4", countryOfResidence: "1.3.6.1.5.5.7.9.5", ecPublicKey: "1.2.840.10045.2.1", "P-256": "1.2.840.10045.3.1.7", secp256r1: "1.2.840.10045.3.1.7", secp256k1: "1.3.132.0.10", secp384r1: "1.3.132.0.34", secp521r1: "1.3.132.0.35", pkcs5PBES2: "1.2.840.113549.1.5.13", pkcs5PBKDF2: "1.2.840.113549.1.5.12", "des-EDE3-CBC": "1.2.840.113549.3.7", data: "1.2.840.113549.1.7.1", "signed-data": "1.2.840.113549.1.7.2", "enveloped-data": "1.2.840.113549.1.7.3", "digested-data": "1.2.840.113549.1.7.5", "encrypted-data": "1.2.840.113549.1.7.6", "authenticated-data": "1.2.840.113549.1.9.16.1.2", tstinfo: "1.2.840.113549.1.9.16.1.4", signingCertificate: "1.2.840.113549.1.9.16.2.12", timeStampToken: "1.2.840.113549.1.9.16.2.14", signaturePolicyIdentifier: "1.2.840.113549.1.9.16.2.15", etsArchiveTimeStamp: "1.2.840.113549.1.9.16.2.27", signingCertificateV2: "1.2.840.113549.1.9.16.2.47", etsArchiveTimeStampV2: "1.2.840.113549.1.9.16.2.48", extensionRequest: "1.2.840.113549.1.9.14", contentType: "1.2.840.113549.1.9.3", messageDigest: "1.2.840.113549.1.9.4", signingTime: "1.2.840.113549.1.9.5", counterSignature: "1.2.840.113549.1.9.6", archiveTimeStampV3: "0.4.0.1733.2.4", pdfRevocationInfoArchival: "1.2.840.113583.1.1.8", adobeTimeStamp: "1.2.840.113583.1.1.9.1", smimeMailboxLegacy: "2.23.140.1.5.1.1", smimeMailboxMulti: "2.23.140.1.5.1.2", smimeMailboxStrict: "2.23.140.1.5.1.3", smimeOrganizationLegacy: "2.23.140.1.5.2.1", smimeOrganizationMulti: "2.23.140.1.5.2.2", smimeOrganizationStrict: "2.23.140.1.5.2.3", smimeSponsorLegacy: "2.23.140.1.5.3.1", smimeSponsorMulti: "2.23.140.1.5.3.2", smimeSponsorStrict: "2.23.140.1.5.3.3", smimeIndividualLegacy: "2.23.140.1.5.4.1", smimeIndividualMulti: "2.23.140.1.5.4.2", smimeIndividualStrict: "2.23.140.1.5.4.3" };
      this.atype2oidList = { CN: "2.5.4.3", L: "2.5.4.7", ST: "2.5.4.8", O: "2.5.4.10", OU: "2.5.4.11", C: "2.5.4.6", STREET: "2.5.4.9", DC: "0.9.2342.19200300.100.1.25", UID: "0.9.2342.19200300.100.1.1", SN: "2.5.4.4", T: "2.5.4.12", GN: "2.5.4.42", DN: "2.5.4.49", E: "1.2.840.113549.1.9.1", description: "2.5.4.13", businessCategory: "2.5.4.15", postalCode: "2.5.4.17", serialNumber: "2.5.4.5", uniqueIdentifier: "2.5.4.45", organizationIdentifier: "2.5.4.97", jurisdictionOfIncorporationL: "1.3.6.1.4.1.311.60.2.1.1", jurisdictionOfIncorporationSP: "1.3.6.1.4.1.311.60.2.1.2", jurisdictionOfIncorporationC: "1.3.6.1.4.1.311.60.2.1.3" };
      this.objCache = {};
      this.name2obj = function(b) {
        if (typeof this.objCache[b] != "undefined") {
          return this.objCache[b];
        }
        if (typeof this.name2oidList[b] == "undefined") {
          throw "Name of ObjectIdentifier not defined: " + b;
        }
        var c = this.name2oidList[b];
        var d = new a({ oid: c });
        this.objCache[b] = d;
        return d;
      };
      this.atype2obj = function(b) {
        if (this.objCache[b] !== void 0) {
          return this.objCache[b];
        }
        var c;
        if (b.match(/^\d+\.\d+\.[0-9.]+$/)) {
          c = b;
        } else {
          if (this.atype2oidList[b] !== void 0) {
            c = this.atype2oidList[b];
          } else {
            if (this.name2oidList[b] !== void 0) {
              c = this.name2oidList[b];
            } else {
              throw new Error("AttributeType name undefined: " + b);
            }
          }
        }
        var d = new a({ oid: c });
        this.objCache[b] = d;
        return d;
      };
      this.registerOIDs = function(b) {
        if (!this.checkOIDs(b)) {
          return;
        }
        for (var c in b) {
          this.name2oidList[c] = b[c];
        }
      };
      this.checkOIDs = function(b) {
        try {
          var d = Object.keys(b);
          if (d.length == 0) {
            return false;
          }
          d.map(function(g, e2, h) {
            var f = this[g];
            if (!f.match(/^[0-2]\.[0-9.]+$/)) {
              throw new Error("value is not OID");
            }
          }, b);
          return true;
        } catch (c) {
          return false;
        }
      };
    }();
    KJUR.asn1.x509.OID.oid2name = function(b) {
      var c = KJUR.asn1.x509.OID.name2oidList;
      for (var a in c) {
        if (c[a] == b) {
          return a;
        }
      }
      return "";
    };
    KJUR.asn1.x509.OID.oid2atype = function(b) {
      var c = KJUR.asn1.x509.OID.atype2oidList;
      for (var a in c) {
        if (c[a] == b) {
          return a;
        }
      }
      return b;
    };
    KJUR.asn1.x509.OID.name2oid = function(a) {
      if (a.match(/^[0-9.]+$/)) {
        return a;
      }
      var b = KJUR.asn1.x509.OID.name2oidList;
      if (b[a] === void 0) {
        return "";
      }
      return b[a];
    };
    KJUR.asn1.x509.X509Util = {};
    KJUR.asn1.x509.X509Util.newCertPEM = function(e2) {
      var d = KJUR.asn1.x509, b = d.TBSCertificate, a = d.Certificate;
      var c = new a(e2);
      return c.getPEM();
    };
    if (typeof KJUR == "undefined" || !KJUR) {
      KJUR = {};
    }
    if (typeof KJUR.asn1 == "undefined" || !KJUR.asn1) {
      KJUR.asn1 = {};
    }
    if (typeof KJUR.asn1.cms == "undefined" || !KJUR.asn1.cms) {
      KJUR.asn1.cms = {};
    }
    KJUR.asn1.cms.Attribute = function(f) {
      var e2 = Error, d = KJUR, c = d.asn1, b = c.DERSequence, a = c.DERSet, g = c.DERObjectIdentifier;
      this.params = null;
      this.typeOid = null;
      this.setByParam = function(h) {
        this.params = h;
      };
      this.getValueArray = function() {
        throw new e2("not yet implemented abstract");
      };
      this.tohex = function() {
        var j = new g({ oid: this.typeOid });
        var h = new a({ array: this.getValueArray() });
        var i = new b({ array: [j, h] });
        return i.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
    };
    extendClass(KJUR.asn1.cms.Attribute, KJUR.asn1.ASN1Object);
    KJUR.asn1.cms.ContentType = function(c) {
      var b = KJUR, a = b.asn1;
      a.cms.ContentType.superclass.constructor.call(this);
      this.typeOid = "1.2.840.113549.1.9.3";
      this.getValueArray = function() {
        var d = new a.DERObjectIdentifier(this.params.type);
        return [d];
      };
      if (c != void 0) {
        this.setByParam(c);
      }
    };
    extendClass(KJUR.asn1.cms.ContentType, KJUR.asn1.cms.Attribute);
    KJUR.asn1.cms.MessageDigest = function(e2) {
      var b = KJUR, a = b.asn1, c = a.DEROctetString, d = a.cms;
      d.MessageDigest.superclass.constructor.call(this);
      this.typeOid = "1.2.840.113549.1.9.4";
      this.getValueArray = function() {
        var f = new c(this.params);
        return [f];
      };
      if (e2 != void 0) {
        this.setByParam(e2);
      }
    };
    extendClass(KJUR.asn1.cms.MessageDigest, KJUR.asn1.cms.Attribute);
    KJUR.asn1.cms.SigningTime = function(c) {
      var b = KJUR, a = b.asn1;
      a.cms.SigningTime.superclass.constructor.call(this);
      this.typeOid = "1.2.840.113549.1.9.5";
      this.getValueArray = function() {
        var d = new a.x509.Time(this.params);
        return [d];
      };
      if (c != void 0) {
        this.setByParam(c);
      }
    };
    extendClass(KJUR.asn1.cms.SigningTime, KJUR.asn1.cms.Attribute);
    KJUR.asn1.cms.SigningCertificate = function(h) {
      var e2 = Error, d = KJUR, c = d.asn1, b = c.DERSequence, g = c.cms, a = g.ESSCertID, f = d.crypto;
      g.SigningCertificate.superclass.constructor.call(this);
      this.typeOid = "1.2.840.113549.1.9.16.2.12";
      this.getValueArray = function() {
        if (this.params == null || this.params == void 0 || this.params.array == void 0) {
          throw new e2("parameter 'array' not specified");
        }
        var o2 = this.params.array;
        var k = [];
        for (var l = 0; l < o2.length; l++) {
          var n2 = o2[l];
          if (h.hasis == false && (typeof n2 == "string" && (n2.indexOf("-----BEGIN") != -1 || ASN1HEX.isASN1HEX(n2)))) {
            n2 = { cert: n2 };
          }
          if (n2.hasis != false && h.hasis == false) {
            n2.hasis = false;
          }
          k.push(new a(n2));
        }
        var j = new b({ array: k });
        var m = new b({ array: [j] });
        return [m];
      };
      if (h != void 0) {
        this.setByParam(h);
      }
    };
    extendClass(KJUR.asn1.cms.SigningCertificate, KJUR.asn1.cms.Attribute);
    KJUR.asn1.cms.ESSCertID = function(g) {
      KJUR.asn1.cms.ESSCertID.superclass.constructor.call(this);
      var d = Error, c = KJUR, b = c.asn1, f = b.DEROctetString, a = b.DERSequence, e2 = b.cms.IssuerSerial;
      this.params = null;
      this.getCertHash = function(k, h) {
        if (k.hash != void 0) {
          return k.hash;
        }
        if (typeof k == "string" && k.indexOf("-----BEGIN") == -1 && !ASN1HEX.isASN1HEX(k)) {
          return k;
        }
        var i;
        if (typeof k == "string") {
          i = k;
        } else {
          if (k.cert != void 0) {
            i = k.cert;
          } else {
            throw new d("hash nor cert unspecified");
          }
        }
        var j;
        if (i.indexOf("-----BEGIN") != -1) {
          j = pemtohex(i);
        } else {
          j = i;
        }
        if (typeof k == "string") {
          if (k.indexOf("-----BEGIN") != -1) {
            j = pemtohex(k);
          } else {
            if (ASN1HEX.isASN1HEX(k)) {
              j = k;
            }
          }
        }
        var l;
        if (k.alg != void 0) {
          l = k.alg;
        } else {
          if (h != void 0) {
            l = h;
          } else {
            throw new d("hash alg unspecified");
          }
        }
        return c.crypto.Util.hashHex(j, l);
      };
      this.tohex = function() {
        var k = this.params;
        var j = this.getCertHash(k, "sha1");
        var h = [];
        h.push(new f({ hex: j }));
        if (typeof k == "string" && k.indexOf("-----BEGIN") != -1 || k.cert != void 0 && k.hasis != false || k.issuer != void 0 && k.serial != void 0) {
          h.push(new e2(k));
        }
        var i = new a({ array: h });
        return i.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (g != void 0) {
        this.setByParam(g);
      }
    };
    extendClass(KJUR.asn1.cms.ESSCertID, KJUR.asn1.ASN1Object);
    KJUR.asn1.cms.SigningCertificateV2 = function(d) {
      var h = Error, a = KJUR, g = a.asn1, e2 = g.DERSequence, b = g.x509, i = g.cms, c = i.ESSCertIDv2, f = a.crypto;
      i.SigningCertificateV2.superclass.constructor.call(this);
      this.typeOid = "1.2.840.113549.1.9.16.2.47";
      this.getValueArray = function() {
        if (this.params == null || this.params == void 0 || this.params.array == void 0) {
          throw new h("parameter 'array' not specified");
        }
        var o2 = this.params.array;
        var l = [];
        for (var m = 0; m < o2.length; m++) {
          var n2 = o2[m];
          if ((d.alg != void 0 || d.hasis == false) && (typeof n2 == "string" && (n2.indexOf("-----BEGIN") != -1 || ASN1HEX.isASN1HEX(n2)))) {
            n2 = { cert: n2 };
          }
          if (n2.alg == void 0 && d.alg != void 0) {
            n2.alg = d.alg;
          }
          if (n2.hasis != false && d.hasis == false) {
            n2.hasis = false;
          }
          l.push(new c(n2));
        }
        var k = new e2({ array: l });
        var j = new e2({ array: [k] });
        return [j];
      };
      if (d != void 0) {
        this.setByParam(d);
      }
    };
    extendClass(KJUR.asn1.cms.SigningCertificateV2, KJUR.asn1.cms.Attribute);
    KJUR.asn1.cms.ESSCertIDv2 = function(h) {
      KJUR.asn1.cms.ESSCertIDv2.superclass.constructor.call(this);
      var d = Error, c = KJUR, b = c.asn1, f = b.DEROctetString, a = b.DERSequence, e2 = b.cms.IssuerSerial, g = b.x509.AlgorithmIdentifier;
      this.params = null;
      this.tohex = function() {
        var l = this.params;
        var k = this.getCertHash(l, "sha256");
        var i = [];
        if (l.alg != void 0 && l.alg != "sha256") {
          i.push(new g({ name: l.alg }));
        }
        i.push(new f({ hex: k }));
        if (typeof l == "string" && l.indexOf("-----BEGIN") != -1 || l.cert != void 0 && l.hasis != false || l.issuer != void 0 && l.serial != void 0) {
          i.push(new e2(l));
        }
        var j = new a({ array: i });
        return j.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (h != void 0) {
        this.setByParam(h);
      }
    };
    extendClass(KJUR.asn1.cms.ESSCertIDv2, KJUR.asn1.cms.ESSCertID);
    KJUR.asn1.cms.IssuerSerial = function(e2) {
      var i = Error, c = KJUR, h = c.asn1, g = h.DERInteger, f = h.DERSequence, j = h.cms, d = h.x509, a = d.GeneralNames, b = X509;
      j.IssuerSerial.superclass.constructor.call(this);
      this.setByParam = function(k) {
        this.params = k;
      };
      this.tohex = function() {
        var p = this.params;
        var l, r2;
        if (typeof p == "string" && p.indexOf("-----BEGIN") != -1 || p.cert != void 0) {
          var n2;
          if (p.cert != void 0) {
            n2 = p.cert;
          } else {
            n2 = p;
          }
          var k = new b();
          k.readCertPEM(n2);
          l = k.getIssuer();
          r2 = { hex: k.getSerialNumberHex() };
        } else {
          if (p.issuer != void 0 && p.serial) {
            l = p.issuer;
            r2 = p.serial;
          } else {
            throw new i("cert or issuer and serial parameter not specified");
          }
        }
        var q = new a([{ dn: l }]);
        var o2 = new g(r2);
        var m = new f({ array: [q, o2] });
        return m.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (e2 != void 0) {
        this.setByParam(e2);
      }
    };
    extendClass(KJUR.asn1.cms.IssuerSerial, KJUR.asn1.ASN1Object);
    KJUR.asn1.cms.SignerIdentifier = function(f) {
      var c = KJUR, i = c.asn1, h = i.DERInteger, g = i.DERSequence, l = i.cms, k = l.IssuerAndSerialNumber, d = l.SubjectKeyIdentifier, e2 = i.x509, a = e2.X500Name, b = X509, j = Error;
      l.SignerIdentifier.superclass.constructor.call(this);
      this.params = null;
      this.tohex = function() {
        var o2 = this.params;
        if (o2.type == "isssn") {
          var m = new k(o2);
          return m.tohex();
        } else {
          if (o2.type == "skid") {
            var n2 = new d(o2);
            return n2.tohex();
          } else {
            throw new Error("wrong property for isssn or skid");
          }
        }
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (f != void 0) {
        this.setByParam(f);
      }
    };
    extendClass(KJUR.asn1.cms.SignerIdentifier, KJUR.asn1.ASN1Object);
    KJUR.asn1.cms.IssuerAndSerialNumber = function(e2) {
      var c = KJUR, h = c.asn1, g = h.DERInteger, f = h.DERSequence, j = h.cms, d = h.x509, a = d.X500Name, b = X509, i = Error;
      j.IssuerAndSerialNumber.superclass.constructor.call(this);
      this.params = null;
      this.tohex = function() {
        var p = this.params;
        var l, r2;
        if (typeof p == "string" && p.indexOf("-----BEGIN") != -1 || p.cert != void 0) {
          var n2;
          if (p.cert != void 0) {
            n2 = p.cert;
          } else {
            n2 = p;
          }
          var k = new b();
          k.readCertPEM(n2);
          l = k.getIssuer();
          r2 = { hex: k.getSerialNumberHex() };
        } else {
          if (p.issuer != void 0 && p.serial) {
            l = p.issuer;
            r2 = p.serial;
          } else {
            throw new i("cert or issuer and serial parameter not specified");
          }
        }
        var q = new a(l);
        var o2 = new g(r2);
        var m = new f({ array: [q, o2] });
        return m.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      this.setByParam = function(k) {
        this.params = k;
      };
      if (e2 != void 0) {
        this.setByParam(e2);
      }
    };
    extendClass(KJUR.asn1.cms.IssuerAndSerialNumber, KJUR.asn1.ASN1Object);
    KJUR.asn1.cms.SubjectKeyIdentifier = function(g) {
      var d = KJUR, k = d.asn1, i = k.DERInteger, h = k.DERSequence, j = k.ASN1Util.newObject, m = k.cms, f = m.IssuerAndSerialName, c = m.SubjectKeyIdentifier, e2 = k.x509, a = e2.X500Name, b = X509, l = Error;
      m.SubjectKeyIdentifier.superclass.constructor.call(this);
      this.tohex = function() {
        var r2 = this.params;
        if (r2.cert == void 0 && r2.skid == void 0) {
          throw new l("property cert nor skid undefined");
        }
        var q;
        if (r2.cert != void 0) {
          var n2 = new b(r2.cert);
          var o2 = n2.getExtSubjectKeyIdentifier();
          q = o2.kid.hex;
        } else {
          if (r2.skid != void 0) {
            q = r2.skid;
          }
        }
        var p = j({ tag: { tage: "a0", obj: { octstr: { hex: q } } } });
        return p.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (g != void 0) {
        this.setByParam(g);
      }
    };
    extendClass(KJUR.asn1.cms.SubjectKeyIdentifier, KJUR.asn1.ASN1Object);
    KJUR.asn1.cms.AttributeList = function(f) {
      var d = Error, c = KJUR, b = c.asn1, a = b.DERSet, e2 = b.cms;
      e2.AttributeList.superclass.constructor.call(this);
      this.params = null;
      this.hTLV = null;
      this.setByParam = function(g) {
        this.params = g;
      };
      this.tohex = function() {
        var o2 = this.params;
        if (this.hTLV != null) {
          return this.hTLV;
        }
        var m = true;
        if (o2.sortflag != void 0) {
          m = o2.sortflag;
        }
        var j = o2.array;
        var g = [];
        for (var l = 0; l < j.length; l++) {
          var n2 = j[l];
          var k = n2.attr;
          if (k == "contentType") {
            g.push(new e2.ContentType(n2));
          } else {
            if (k == "messageDigest") {
              g.push(new e2.MessageDigest(n2));
            } else {
              if (k == "signingTime") {
                g.push(new e2.SigningTime(n2));
              } else {
                if (k == "signingCertificate") {
                  g.push(new e2.SigningCertificate(n2));
                } else {
                  if (k == "signingCertificateV2") {
                    g.push(new e2.SigningCertificateV2(n2));
                  } else {
                    if (k == "signaturePolicyIdentifier") {
                      g.push(new KJUR.asn1.cades.SignaturePolicyIdentifier(n2));
                    } else {
                      if (k == "signatureTimeStamp" || k == "timeStampToken") {
                        g.push(new KJUR.asn1.cades.SignatureTimeStamp(n2));
                      } else {
                        throw new d("unknown attr: " + k);
                      }
                    }
                  }
                }
              }
            }
          }
        }
        var h = new a({ array: g, sortflag: m });
        this.hTLV = h.tohex();
        return this.hTLV;
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (f != void 0) {
        this.setByParam(f);
      }
    };
    extendClass(KJUR.asn1.cms.AttributeList, KJUR.asn1.ASN1Object);
    KJUR.asn1.cms.SignerInfo = function(q) {
      var n2 = Error, r2 = KJUR, i = r2.asn1, c = i.DERInteger, f = i.DEROctetString, h = i.DERSequence, m = i.DERTaggedObject, k = i.cms, p = k.SignerIdentifier, l = k.AttributeList, g = k.ContentType, e2 = k.EncapsulatedContentInfo, d = k.MessageDigest, j = k.SignedData, a = i.x509, s = a.AlgorithmIdentifier, b = r2.crypto, o2 = KEYUTIL;
      k.SignerInfo.superclass.constructor.call(this);
      this.params = null;
      this.sign = function() {
        var y = this.params;
        var x = y.sigalg;
        var u = new l(y.sattrs).tohex();
        var v = o2.getKey(y.signkey);
        var w = new b.Signature({ alg: x });
        w.init(v);
        w.updateHex(u);
        var t3 = w.sign();
        y.sighex = t3;
      };
      this.tohex = function() {
        var w = this.params;
        var t3 = [];
        t3.push(new c({ "int": w.version }));
        t3.push(new p(w.id));
        t3.push(new s({ name: w.hashalg }));
        if (w.sattrs != void 0) {
          var x = new l(w.sattrs);
          try {
            t3.push(new m({ tag: "a0", explicit: false, obj: x }));
          } catch (v) {
            throw new n2("si sattr error: " + v);
          }
        }
        if (w.sigalgfield != void 0) {
          t3.push(new s({ name: w.sigalgfield }));
        } else {
          t3.push(new s({ name: w.sigalg }));
        }
        if (w.sighex == void 0 && w.signkey != void 0) {
          this.sign();
        }
        t3.push(new f({ hex: w.sighex }));
        if (w.uattrs != void 0) {
          var x = new l(w.uattrs);
          try {
            t3.push(new m({ tag: "a1", explicit: false, obj: x }));
          } catch (v) {
            throw new n2("si uattr error: " + v);
          }
        }
        var u = new h({ array: t3 });
        return u.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (q != void 0) {
        this.setByParam(q);
      }
    };
    extendClass(KJUR.asn1.cms.SignerInfo, KJUR.asn1.ASN1Object);
    KJUR.asn1.cms.EncapsulatedContentInfo = function(g) {
      var c = KJUR, b = c.asn1, e2 = b.DERTaggedObject, a = b.DERSequence, h = b.DERObjectIdentifier, d = b.DEROctetString, f = b.cms;
      f.EncapsulatedContentInfo.superclass.constructor.call(this);
      this.params = null;
      this.tohex = function() {
        var m = this.params;
        var i = [];
        i.push(new h(m.type));
        if (m.content != void 0 && (m.content.hex != void 0 || m.content.str != void 0) && m.isDetached != true) {
          var k = new d(m.content);
          var l = new e2({ tag: "a0", explicit: true, obj: k });
          i.push(l);
        }
        var j = new a({ array: i });
        return j.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      this.setByParam = function(i) {
        this.params = i;
      };
      if (g != void 0) {
        this.setByParam(g);
      }
    };
    extendClass(KJUR.asn1.cms.EncapsulatedContentInfo, KJUR.asn1.ASN1Object);
    KJUR.asn1.cms.ContentInfo = function(g) {
      var c = KJUR, b = c.asn1, d = b.DERTaggedObject, a = b.DERSequence, h = b.DERObjectIdentifier, f = b.x509, e2 = f.OID.name2obj;
      KJUR.asn1.cms.ContentInfo.superclass.constructor.call(this);
      this.params = null;
      this.tohex = function() {
        var l = this.params;
        var i = [];
        i.push(new h(l.type));
        var k = new d({ tag: "a0", explicit: true, obj: l.obj });
        i.push(k);
        var j = new a({ array: i });
        return j.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      this.setByParam = function(i) {
        this.params = i;
      };
      if (g != void 0) {
        this.setByParam(g);
      }
    };
    extendClass(KJUR.asn1.cms.ContentInfo, KJUR.asn1.ASN1Object);
    KJUR.asn1.cms.SignedData = function(e2) {
      var j = Error, a = KJUR, h = a.asn1, m = h.ASN1Object, g = h.DERInteger, p = h.DERSet, f = h.DERSequence, b = h.DERTaggedObject, o2 = h.cms, l = o2.EncapsulatedContentInfo, d = o2.SignerInfo, q = o2.ContentInfo, k = o2.CertificateSet, i = o2.RevocationInfoChoices, c = h.x509, n2 = c.AlgorithmIdentifier;
      KJUR.asn1.cms.SignedData.superclass.constructor.call(this);
      this.params = null;
      this.checkAndFixParam = function() {
        var r2 = this.params;
        this._setDigestAlgs(r2);
        this._setContentTypeByEContent(r2);
        this._setMessageDigestByEContent(r2);
        this._setSignerInfoVersion(r2);
        this._setSignedDataVersion(r2);
      };
      this._setDigestAlgs = function(v) {
        var u = {};
        var t3 = v.sinfos;
        for (var r2 = 0; r2 < t3.length; r2++) {
          var s = t3[r2];
          u[s.hashalg] = 1;
        }
        v.hashalgs = Object.keys(u).sort();
      };
      this._setContentTypeByEContent = function(w) {
        var u = w.econtent.type;
        var v = w.sinfos;
        for (var r2 = 0; r2 < v.length; r2++) {
          var t3 = v[r2];
          var s = this._getAttrParamByName(t3, "contentType");
          s.type = u;
        }
      };
      this._setMessageDigestByEContent = function(r2) {
        var v = r2.econtent;
        var y = r2.econtent.type;
        var x = v.content.hex;
        if (x == void 0 && v.type == "data" && v.content.str != void 0) {
          x = rstrtohex(v.content.str);
        }
        var A = r2.sinfos;
        for (var u = 0; u < A.length; u++) {
          var t3 = A[u];
          var s = t3.hashalg;
          var z2 = this._getAttrParamByName(t3, "messageDigest");
          var w = KJUR.crypto.Util.hashHex(x, s);
          z2.hex = w;
        }
      };
      this._getAttrParamByName = function(t3, s) {
        var u = t3.sattrs.array;
        for (var r2 = 0; r2 < u.length; r2++) {
          if (u[r2].attr == s) {
            return u[r2];
          }
        }
      };
      this._setSignerInfoVersion = function(v) {
        var t3 = v.sinfos;
        for (var r2 = 0; r2 < t3.length; r2++) {
          var s = t3[r2];
          var u = 1;
          if (s.id.type == "skid") {
            u = 3;
          }
          s.version = u;
        }
      };
      this._setSignedDataVersion = function(s) {
        var r2 = this._getSignedDataVersion(s);
        s.version = r2;
      };
      this._getSignedDataVersion = function(w) {
        if (w.revinfos != void 0) {
          var r2 = w.revinfos;
          for (var t3 = 0; t3 < r2.length; t3++) {
            var s = r2[t3];
            if (s.ocsp != void 0) {
              return 5;
            }
          }
        }
        var v = w.sinfos;
        for (var t3 = 0; t3 < v.length; t3++) {
          var u = w.sinfos[t3];
          if (u.version == 3) {
            return 3;
          }
        }
        if (w.econtent.type != "data") {
          return 3;
        }
        return 1;
      };
      this.tohex = function() {
        var y = this.params;
        if (this.getEncodedHexPrepare != void 0) {
          this.getEncodedHexPrepare();
        }
        if (y.fixed != true) {
          this.checkAndFixParam();
        }
        var r2 = [];
        r2.push(new g({ "int": y.version }));
        var w = [];
        for (var v = 0; v < y.hashalgs.length; v++) {
          var t3 = y.hashalgs[v];
          w.push(new n2({ name: t3 }));
        }
        r2.push(new p({ array: w }));
        r2.push(new l(y.econtent));
        if (y.certs != void 0) {
          r2.push(new k(y.certs));
        }
        if (y.revinfos != void 0) {
          r2.push(new i(y.revinfos));
        }
        var u = [];
        for (var v = 0; v < y.sinfos.length; v++) {
          var x = y.sinfos[v];
          u.push(new d(x));
        }
        r2.push(new p({ array: u }));
        var s = new f({ array: r2 });
        return s.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      this.getContentInfo = function() {
        var r2 = new q({ type: "signed-data", obj: this });
        return r2;
      };
      this.getContentInfoEncodedHex = function() {
        return this.getContentInfo().tohex();
      };
      if (e2 != void 0) {
        this.setByParam(e2);
      }
    };
    extendClass(KJUR.asn1.cms.SignedData, KJUR.asn1.ASN1Object);
    KJUR.asn1.cms.CertificateSet = function(f) {
      KJUR.asn1.cms.CertificateSet.superclass.constructor.call(this);
      var c = Error, b = KJUR.asn1, e2 = b.DERTaggedObject, a = b.DERSet, d = b.ASN1Object;
      this.params = null;
      this.tohex = function() {
        var j = this.params;
        var p = [];
        var q;
        if (j instanceof Array) {
          q = j;
        } else {
          if (j.array != void 0) {
            q = j.array;
          } else {
            throw new c("cert array not specified");
          }
        }
        for (var k = 0; k < q.length; k++) {
          var l = q[k];
          var n2 = pemtohex(l);
          var g = new d();
          g.hTLV = n2;
          p.push(g);
        }
        var m = { array: p };
        if (j.sortflag == false) {
          m.sortflag = false;
        }
        var o2 = new a(m);
        var h = new e2({ tag: "a0", explicit: false, obj: o2 });
        return h.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (f != void 0) {
        this.setByParam(f);
      }
    };
    extendClass(KJUR.asn1.cms.CertificateSet, KJUR.asn1.ASN1Object);
    KJUR.asn1.cms.RevocationInfoChoices = function(a) {
      KJUR.asn1.cms.RevocationInfoChoices.superclass.constructor.call(this);
      this.params = null;
      this.tohex = function() {
        var e2 = this.params;
        if (!e2 instanceof Array) {
          throw new Error("params is not array");
        }
        var b = [];
        for (var c = 0; c < e2.length; c++) {
          b.push(new KJUR.asn1.cms.RevocationInfoChoice(e2[c]));
        }
        var d = KJUR.asn1.ASN1Util.newObject({ tag: { tagi: "a1", obj: { set: b } } });
        return d.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (a != void 0) {
        this.setByParam(a);
      }
    };
    extendClass(KJUR.asn1.cms.RevocationInfoChoices, KJUR.asn1.ASN1Object);
    KJUR.asn1.cms.RevocationInfoChoice = function(a) {
      KJUR.asn1.cms.RevocationInfoChoice.superclass.constructor.call(this);
      this.params = null;
      this.tohex = function() {
        var d = this.params;
        if (d.crl != void 0 && typeof d.crl == "string") {
          var b = d.crl;
          if (d.crl.indexOf("-----BEGIN") != -1) {
            b = pemtohex(d.crl);
          }
          return b;
        } else {
          if (d.ocsp != void 0) {
            var c = KJUR.asn1.ASN1Util.newObject({ tag: { tagi: "a1", obj: new KJUR.asn1.cms.OtherRevocationFormat(d) } });
            return c.tohex();
          } else {
            throw new Error("property crl or ocsp undefined");
          }
        }
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (a != void 0) {
        this.setByParam(a);
      }
    };
    extendClass(KJUR.asn1.cms.RevocationInfoChoice, KJUR.asn1.ASN1Object);
    KJUR.asn1.cms.OtherRevocationFormat = function(f) {
      KJUR.asn1.cms.OtherRevocationFormat.superclass.constructor.call(this);
      var d = Error, c = KJUR, b = c.asn1, a = b.ASN1Util.newObject, e2 = c.lang.String.isHex;
      this.params = null;
      this.tohex = function() {
        var h = this.params;
        if (h.ocsp == void 0) {
          throw new d("property ocsp not specified");
        }
        if (!e2(h.ocsp) || !ASN1HEX.isASN1HEX(h.ocsp)) {
          throw new d("ocsp value not ASN.1 hex string");
        }
        var g = a({ seq: [{ oid: "1.3.6.1.5.5.7.16.2" }, { asn1: { tlv: h.ocsp } }] });
        return g.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (f != void 0) {
        this.setByParam(f);
      }
    };
    extendClass(KJUR.asn1.cms.OtherRevocationFormat, KJUR.asn1.ASN1Object);
    KJUR.asn1.cms.CMSUtil = new function() {
    }();
    KJUR.asn1.cms.CMSUtil.newSignedData = function(a) {
      return new KJUR.asn1.cms.SignedData(a);
    };
    KJUR.asn1.cms.CMSUtil.verifySignedData = function(n2) {
      var C = KJUR, p = C.asn1, s = p.cms, D = s.SignerInfo, q = s.SignedData, y = s.SigningTime, b = s.SigningCertificate, d = s.SigningCertificateV2, A = p.cades, u = A.SignaturePolicyIdentifier, i = C.lang.String.isHex, v = ASN1HEX, h = v.getVbyList, a = v.getTLVbyList, t3 = v.getIdxbyList, z2 = v.getChildIdx, c = v.getTLV, B = v.oidname, j = C.crypto.Util.hashHex;
      if (n2.cms === void 0 && !i(n2.cms)) {
      }
      var E = n2.cms;
      var g = /* @__PURE__ */ __name2(function(J, H) {
        var G;
        for (var I = 3; I < 6; I++) {
          G = t3(J, 0, [1, 0, I]);
          if (G !== void 0) {
            var F = J.substr(G, 2);
            if (F === "a0") {
              H.certsIdx = G;
            }
            if (F === "a1") {
              H.revinfosIdx = G;
            }
            if (F === "31") {
              H.signerinfosIdx = G;
            }
          }
        }
      }, "g");
      var l = /* @__PURE__ */ __name2(function(I, F) {
        var H = F.signerinfosIdx;
        if (H === void 0) {
          return;
        }
        var L = z2(I, H);
        F.signerInfoIdxList = L;
        for (var G = 0; G < L.length; G++) {
          var K = L[G];
          var J = { idx: K };
          k(I, J);
          F.signerInfos.push(J);
        }
      }, "l");
      var k = /* @__PURE__ */ __name2(function(I, J) {
        var F = J.idx;
        J.signerid_issuer1 = a(I, F, [1, 0], "30");
        J.signerid_serial1 = h(I, F, [1, 1], "02");
        J.hashalg = B(h(I, F, [2, 0], "06"));
        var H = t3(I, F, [3], "a0");
        J.idxSignedAttrs = H;
        f(I, J, H);
        var G = z2(I, F);
        var K = G.length;
        if (K < 6) {
          throw "malformed SignerInfo";
        }
        J.sigalg = B(h(I, F, [K - 2, 0], "06"));
        J.sigval = h(I, F, [K - 1], "04");
      }, "k");
      var f = /* @__PURE__ */ __name2(function(L, M, F) {
        var J = z2(L, F);
        M.signedAttrIdxList = J;
        for (var K = 0; K < J.length; K++) {
          var I = J[K];
          var G = h(L, I, [0], "06");
          var H;
          if (G === "2a864886f70d010905") {
            H = hextoutf8(h(L, I, [1, 0]));
            M.saSigningTime = H;
          } else {
            if (G === "2a864886f70d010904") {
              H = h(L, I, [1, 0], "04");
              M.saMessageDigest = H;
            }
          }
        }
      }, "f");
      var w = /* @__PURE__ */ __name2(function(G, F) {
        if (h(G, 0, [0], "06") !== "2a864886f70d010702") {
          return F;
        }
        F.cmsType = "signedData";
        F.econtent = h(G, 0, [1, 0, 2, 1, 0]);
        g(G, F);
        F.signerInfos = [];
        l(G, F);
      }, "w");
      var o2 = /* @__PURE__ */ __name2(function(J, F) {
        var G = F.parse.signerInfos;
        var L = G.length;
        var K = true;
        for (var I = 0; I < L; I++) {
          var H = G[I];
          e2(J, F, H, I);
          if (!H.isValid) {
            K = false;
          }
        }
        F.isValid = K;
      }, "o2");
      var x = /* @__PURE__ */ __name2(function(F, Q, J, P) {
        var N = Q.parse.certsIdx;
        var H;
        if (Q.certs === void 0) {
          H = [];
          Q.certkeys = [];
          var K = z2(F, N);
          for (var I = 0; I < K.length; I++) {
            var M = c(F, K[I]);
            var O = new X509();
            O.readCertHex(M);
            H[I] = O;
            Q.certkeys[I] = O.getPublicKey();
          }
          Q.certs = H;
        } else {
          H = Q.certs;
        }
        Q.cccc = H.length;
        Q.cccci = K.length;
        for (var I = 0; I < H.length; I++) {
          var L = O.getIssuerHex();
          var G = O.getSerialNumberHex();
          if (J.signerid_issuer1 === L && J.signerid_serial1 === G) {
            J.certkey_idx = I;
          }
        }
      }, "x");
      var e2 = /* @__PURE__ */ __name2(function(F, R, I, N) {
        I.verifyDetail = {};
        var Q = I.verifyDetail;
        var K = R.parse.econtent;
        var G = I.hashalg;
        var L = I.saMessageDigest;
        Q.validMessageDigest = false;
        if (j(K, G) === L) {
          Q.validMessageDigest = true;
        }
        x(F, R, I, N);
        Q.validSignatureValue = false;
        var H = I.sigalg;
        var M = "31" + c(F, I.idxSignedAttrs).substr(2);
        I.signedattrshex = M;
        var J = R.certs[I.certkey_idx].getPublicKey();
        var P = new KJUR.crypto.Signature({ alg: H });
        P.init(J);
        P.updateHex(M);
        var O = P.verify(I.sigval);
        Q.validSignatureValue_isValid = O;
        if (O === true) {
          Q.validSignatureValue = true;
        }
        I.isValid = false;
        if (Q.validMessageDigest && Q.validSignatureValue) {
          I.isValid = true;
        }
      }, "e2");
      var m = /* @__PURE__ */ __name2(function() {
      }, "m");
      var r2 = { isValid: false, parse: {} };
      w(E, r2.parse);
      o2(E, r2);
      return r2;
    };
    KJUR.asn1.cms.CMSParser = function() {
      var g = Error, a = X509, h = new a(), l = ASN1HEX, i = l.getV, b = l.getTLV, f = l.getIdxbyList, c = l.getTLVbyList, d = l.getTLVbyListEx, e2 = l.getVbyList, k = l.getVbyListEx, j = l.getChildIdx;
      this.getCMSSignedData = function(m) {
        var o2 = c(m, 0, [1, 0]);
        var n2 = this.getSignedData(o2);
        return n2;
      };
      this.getSignedData = function(o2) {
        var q = j(o2, 0);
        var v = {};
        var p = i(o2, q[0]);
        var n2 = parseInt(p, 16);
        v.version = n2;
        var r2 = b(o2, q[1]);
        v.hashalgs = this.getHashAlgArray(r2);
        var t3 = b(o2, q[2]);
        v.econtent = this.getEContent(t3);
        var m = d(o2, 0, ["[0]"]);
        if (m != null) {
          v.certs = this.getCertificateSet(m);
        }
        var u = d(o2, 0, ["[1]"]);
        if (u != null) {
        }
        var s = d(o2, 0, [3]);
        v.sinfos = this.getSignerInfos(s);
        return v;
      };
      this.getHashAlgArray = function(s) {
        var q = j(s, 0);
        var m = new a();
        var n2 = [];
        for (var r2 = 0; r2 < q.length; r2++) {
          var p = b(s, q[r2]);
          var o2 = m.getAlgorithmIdentifierName(p);
          n2.push(o2);
        }
        return n2;
      };
      this.getEContent = function(m) {
        var n2 = {};
        var p = e2(m, 0, [0]);
        var o2 = e2(m, 0, [1, 0]);
        n2.type = KJUR.asn1.x509.OID.oid2name(ASN1HEX.hextooidstr(p));
        n2.content = { hex: o2 };
        return n2;
      };
      this.getSignerInfos = function(p) {
        var r2 = [];
        var m = j(p, 0);
        for (var n2 = 0; n2 < m.length; n2++) {
          var o2 = b(p, m[n2]);
          var q = this.getSignerInfo(o2);
          r2.push(q);
        }
        return r2;
      };
      this.getSignerInfo = function(s) {
        var y = {};
        var u = j(s, 0);
        var q = l.getInt(s, u[0], -1);
        if (q != -1) {
          y.version = q;
        }
        var t3 = b(s, u[1]);
        var p = this.getIssuerAndSerialNumber(t3);
        y.id = p;
        var z2 = b(s, u[2]);
        var n2 = h.getAlgorithmIdentifierName(z2);
        y.hashalg = n2;
        var w = d(s, 0, ["[0]"]);
        if (w != null) {
          var A = this.getAttributeList(w);
          y.sattrs = A;
        }
        var m = d(s, 0, [3]);
        var x = h.getAlgorithmIdentifierName(m);
        y.sigalg = x;
        var o2 = k(s, 0, [4]);
        y.sighex = o2;
        var r2 = d(s, 0, ["[1]"]);
        if (r2 != null) {
          var v = this.getAttributeList(r2);
          y.uattrs = v;
        }
        return y;
      };
      this.getSignerIdentifier = function(m) {
        if (m.substr(0, 2) == "30") {
          return this.getIssuerAndSerialNumber(m);
        } else {
          throw new Error("SKID of signerIdentifier not supported");
        }
      };
      this.getIssuerAndSerialNumber = function(n2) {
        var o2 = { type: "isssn" };
        var m = j(n2, 0);
        var p = b(n2, m[0]);
        o2.issuer = h.getX500Name(p);
        var q = i(n2, m[1]);
        o2.serial = { hex: q };
        return o2;
      };
      this.getAttributeList = function(q) {
        var m = [];
        var n2 = j(q, 0);
        for (var o2 = 0; o2 < n2.length; o2++) {
          var p = b(q, n2[o2]);
          var r2 = this.getAttribute(p);
          m.push(r2);
        }
        return { array: m };
      };
      this.getAttribute = function(p) {
        var t3 = {};
        var q = j(p, 0);
        var o2 = l.getOID(p, q[0]);
        var m = KJUR.asn1.x509.OID.oid2name(o2);
        t3.attr = m;
        var r2 = b(p, q[1]);
        var u = j(r2, 0);
        if (u.length == 1) {
          t3.valhex = b(r2, u[0]);
        } else {
          var s = [];
          for (var n2 = 0; n2 < u.length; n2++) {
            s.push(b(r2, u[n2]));
          }
          t3.valhex = s;
        }
        if (m == "contentType") {
          this.setContentType(t3);
        } else {
          if (m == "messageDigest") {
            this.setMessageDigest(t3);
          } else {
            if (m == "signingTime") {
              this.setSigningTime(t3);
            } else {
              if (m == "signingCertificate") {
                this.setSigningCertificate(t3);
              } else {
                if (m == "signingCertificateV2") {
                  this.setSigningCertificateV2(t3);
                } else {
                  if (m == "signaturePolicyIdentifier") {
                    this.setSignaturePolicyIdentifier(t3);
                  }
                }
              }
            }
          }
        }
        return t3;
      };
      this.setContentType = function(m) {
        var n2 = l.getOIDName(m.valhex, 0, null);
        if (n2 != null) {
          m.type = n2;
          delete m.valhex;
        }
      };
      this.setSigningTime = function(o2) {
        var n2 = i(o2.valhex, 0);
        var m = hextoutf8(n2);
        o2.str = m;
        delete o2.valhex;
      };
      this.setMessageDigest = function(m) {
        var n2 = i(m.valhex, 0);
        m.hex = n2;
        delete m.valhex;
      };
      this.setSigningCertificate = function(n2) {
        var q = j(n2.valhex, 0);
        if (q.length > 0) {
          var m = b(n2.valhex, q[0]);
          var p = j(m, 0);
          var t3 = [];
          for (var o2 = 0; o2 < p.length; o2++) {
            var s = b(m, p[o2]);
            var u = this.getESSCertID(s);
            t3.push(u);
          }
          n2.array = t3;
        }
        if (q.length > 1) {
          var r2 = b(n2.valhex, q[1]);
          n2.polhex = r2;
        }
        delete n2.valhex;
      };
      this.setSignaturePolicyIdentifier = function(s) {
        var q = j(s.valhex, 0);
        if (q.length > 0) {
          var r2 = l.getOID(s.valhex, q[0]);
          s.oid = r2;
        }
        if (q.length > 1) {
          var m = new a();
          var t3 = j(s.valhex, q[1]);
          var p = b(s.valhex, t3[0]);
          var o2 = m.getAlgorithmIdentifierName(p);
          s.alg = o2;
          var n2 = i(s.valhex, t3[1]);
          s.hash = n2;
        }
        delete s.valhex;
      };
      this.setSigningCertificateV2 = function(o2) {
        var s = j(o2.valhex, 0);
        if (s.length > 0) {
          var n2 = b(o2.valhex, s[0]);
          var r2 = j(n2, 0);
          var u = [];
          for (var q = 0; q < r2.length; q++) {
            var m = b(n2, r2[q]);
            var p = this.getESSCertIDv2(m);
            u.push(p);
          }
          o2.array = u;
        }
        if (s.length > 1) {
          var t3 = b(o2.valhex, s[1]);
          o2.polhex = t3;
        }
        delete o2.valhex;
      };
      this.getESSCertID = function(o2) {
        var p = {};
        var n2 = j(o2, 0);
        if (n2.length > 0) {
          var q = i(o2, n2[0]);
          p.hash = q;
        }
        if (n2.length > 1) {
          var m = b(o2, n2[1]);
          var r2 = this.getIssuerSerial(m);
          if (r2.serial != void 0) {
            p.serial = r2.serial;
          }
          if (r2.issuer != void 0) {
            p.issuer = r2.issuer;
          }
        }
        return p;
      };
      this.getESSCertIDv2 = function(q) {
        var s = {};
        var p = j(q, 0);
        if (p.length < 1 || 3 < p.length) {
          throw new g("wrong number of elements");
        }
        var r2 = 0;
        if (q.substr(p[0], 2) == "30") {
          var o2 = b(q, p[0]);
          s.alg = h.getAlgorithmIdentifierName(o2);
          r2++;
        } else {
          s.alg = "sha256";
        }
        var n2 = i(q, p[r2]);
        s.hash = n2;
        if (p.length > r2 + 1) {
          var m = b(q, p[r2 + 1]);
          var t3 = this.getIssuerSerial(m);
          s.issuer = t3.issuer;
          s.serial = t3.serial;
        }
        return s;
      };
      this.getIssuerSerial = function(q) {
        var r2 = {};
        var n2 = j(q, 0);
        var m = b(q, n2[0]);
        var p = h.getGeneralNames(m);
        var o2 = p[0].dn;
        r2.issuer = o2;
        var s = i(q, n2[1]);
        r2.serial = { hex: s };
        return r2;
      };
      this.getCertificateSet = function(p) {
        var n2 = j(p, 0);
        var m = [];
        for (var o2 = 0; o2 < n2.length; o2++) {
          var r2 = b(p, n2[o2]);
          if (r2.substr(0, 2) == "30") {
            var q = hextopem(r2, "CERTIFICATE");
            m.push(q);
          }
        }
        return { array: m, sortflag: false };
      };
    };
    if (typeof KJUR == "undefined" || !KJUR) {
      KJUR = {};
    }
    if (typeof KJUR.asn1 == "undefined" || !KJUR.asn1) {
      KJUR.asn1 = {};
    }
    if (typeof KJUR.asn1.tsp == "undefined" || !KJUR.asn1.tsp) {
      KJUR.asn1.tsp = {};
    }
    KJUR.asn1.tsp.TimeStampToken = function(d) {
      var c = KJUR, b = c.asn1, a = b.tsp;
      a.TimeStampToken.superclass.constructor.call(this);
      this.params = null;
      this.getEncodedHexPrepare = function() {
        var e2 = new a.TSTInfo(this.params.econtent.content);
        this.params.econtent.content.hex = e2.tohex();
      };
      if (d != void 0) {
        this.setByParam(d);
      }
    };
    extendClass(KJUR.asn1.tsp.TimeStampToken, KJUR.asn1.cms.SignedData);
    KJUR.asn1.tsp.TSTInfo = function(f) {
      var m = Error, c = KJUR, j = c.asn1, g = j.DERSequence, i = j.DERInteger, l = j.DERBoolean, h = j.DERGeneralizedTime, n2 = j.DERObjectIdentifier, e2 = j.DERTaggedObject, k = j.tsp, d = k.MessageImprint, b = k.Accuracy, a = j.x509.X500Name, o2 = j.x509.GeneralName;
      k.TSTInfo.superclass.constructor.call(this);
      this.dVersion = new i({ "int": 1 });
      this.dPolicy = null;
      this.dMessageImprint = null;
      this.dSerial = null;
      this.dGenTime = null;
      this.dAccuracy = null;
      this.dOrdering = null;
      this.dNonce = null;
      this.dTsa = null;
      this.tohex = function() {
        var p = [this.dVersion];
        if (this.dPolicy == null) {
          throw new Error("policy shall be specified.");
        }
        p.push(this.dPolicy);
        if (this.dMessageImprint == null) {
          throw new Error("messageImprint shall be specified.");
        }
        p.push(this.dMessageImprint);
        if (this.dSerial == null) {
          throw new Error("serialNumber shall be specified.");
        }
        p.push(this.dSerial);
        if (this.dGenTime == null) {
          throw new Error("genTime shall be specified.");
        }
        p.push(this.dGenTime);
        if (this.dAccuracy != null) {
          p.push(this.dAccuracy);
        }
        if (this.dOrdering != null) {
          p.push(this.dOrdering);
        }
        if (this.dNonce != null) {
          p.push(this.dNonce);
        }
        if (this.dTsa != null) {
          p.push(this.dTsa);
        }
        var q = new g({ array: p });
        this.hTLV = q.tohex();
        return this.hTLV;
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (f !== void 0) {
        if (typeof f.policy == "string") {
          if (!f.policy.match(/^[0-9.]+$/)) {
            throw "policy shall be oid like 0.1.4.134";
          }
          this.dPolicy = new n2({ oid: f.policy });
        }
        if (f.messageImprint !== void 0) {
          this.dMessageImprint = new d(f.messageImprint);
        }
        if (f.serial !== void 0) {
          this.dSerial = new i(f.serial);
        }
        if (f.genTime !== void 0) {
          this.dGenTime = new h(f.genTime);
        }
        if (f.accuracy !== void 0) {
          this.dAccuracy = new b(f.accuracy);
        }
        if (f.ordering !== void 0 && f.ordering == true) {
          this.dOrdering = new l();
        }
        if (f.nonce !== void 0) {
          this.dNonce = new i(f.nonce);
        }
        if (f.tsa !== void 0) {
          this.dTsa = new e2({ tag: "a0", explicit: true, obj: new o2({ dn: f.tsa }) });
        }
      }
    };
    extendClass(KJUR.asn1.tsp.TSTInfo, KJUR.asn1.ASN1Object);
    KJUR.asn1.tsp.Accuracy = function(d) {
      var c = KJUR, b = c.asn1, a = b.ASN1Util.newObject;
      b.tsp.Accuracy.superclass.constructor.call(this);
      this.params = null;
      this.tohex = function() {
        var f = this.params;
        var e2 = [];
        if (f.seconds != void 0 && typeof f.seconds == "number") {
          e2.push({ "int": f.seconds });
        }
        if (f.millis != void 0 && typeof f.millis == "number") {
          e2.push({ tag: { tagi: "80", obj: { "int": f.millis } } });
        }
        if (f.micros != void 0 && typeof f.micros == "number") {
          e2.push({ tag: { tagi: "81", obj: { "int": f.micros } } });
        }
        return a({ seq: e2 }).tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (d != void 0) {
        this.setByParam(d);
      }
    };
    extendClass(KJUR.asn1.tsp.Accuracy, KJUR.asn1.ASN1Object);
    KJUR.asn1.tsp.MessageImprint = function(g) {
      var c = KJUR, b = c.asn1, a = b.DERSequence, d = b.DEROctetString, f = b.x509, e2 = f.AlgorithmIdentifier;
      b.tsp.MessageImprint.superclass.constructor.call(this);
      this.params = null;
      this.tohex = function() {
        var k = this.params;
        var j = new e2({ name: k.alg });
        var h = new d({ hex: k.hash });
        var i = new a({ array: [j, h] });
        return i.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (g !== void 0) {
        this.setByParam(g);
      }
    };
    extendClass(KJUR.asn1.tsp.MessageImprint, KJUR.asn1.ASN1Object);
    KJUR.asn1.tsp.TimeStampReq = function(c) {
      var a = KJUR, f = a.asn1, d = f.DERSequence, e2 = f.DERInteger, h = f.DERBoolean, j = f.ASN1Object, i = f.DERObjectIdentifier, g = f.tsp, b = g.MessageImprint;
      g.TimeStampReq.superclass.constructor.call(this);
      this.params = null;
      this.tohex = function() {
        var m = this.params;
        var k = [];
        k.push(new e2({ "int": 1 }));
        if (m.messageImprint instanceof KJUR.asn1.ASN1Object) {
          k.push(m.messageImprint);
        } else {
          k.push(new b(m.messageImprint));
        }
        if (m.policy != void 0) {
          k.push(new i(m.policy));
        }
        if (m.nonce != void 0) {
          k.push(new e2(m.nonce));
        }
        if (m.certreq == true) {
          k.push(new h());
        }
        var l = new d({ array: k });
        return l.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (c != void 0) {
        this.setByParam(c);
      }
    };
    extendClass(KJUR.asn1.tsp.TimeStampReq, KJUR.asn1.ASN1Object);
    KJUR.asn1.tsp.TimeStampResp = function(g) {
      var e2 = KJUR, d = e2.asn1, c = d.DERSequence, f = d.ASN1Object, a = d.tsp, b = a.PKIStatusInfo;
      a.TimeStampResp.superclass.constructor.call(this);
      this.params = null;
      this.tohex = function() {
        var j = this.params;
        var h = [];
        if (j.econtent != void 0 || j.tst != void 0) {
          if (j.statusinfo != void 0) {
            h.push(new b(j.statusinfo));
          } else {
            h.push(new b("granted"));
          }
          if (j.econtent != void 0) {
            h.push(new a.TimeStampToken(j).getContentInfo());
          } else {
            if (j.tst instanceof d.ASN1Object) {
              h.push(j.tst);
            } else {
              throw new Error("improper member tst value");
            }
          }
        } else {
          if (j.statusinfo != void 0) {
            h.push(new b(j.statusinfo));
          } else {
            throw new Error("parameter for token nor statusinfo not specified");
          }
        }
        var i = new c({ array: h });
        return i.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (g != void 0) {
        this.setByParam(g);
      }
    };
    extendClass(KJUR.asn1.tsp.TimeStampResp, KJUR.asn1.ASN1Object);
    KJUR.asn1.tsp.PKIStatusInfo = function(d) {
      var h = Error, a = KJUR, g = a.asn1, e2 = g.DERSequence, i = g.tsp, f = i.PKIStatus, c = i.PKIFreeText, b = i.PKIFailureInfo;
      i.PKIStatusInfo.superclass.constructor.call(this);
      this.params = null;
      this.tohex = function() {
        var l = this.params;
        var j = [];
        if (typeof l == "string") {
          j.push(new f(l));
        } else {
          if (l.status == void 0) {
            throw new h("property 'status' unspecified");
          }
          j.push(new f(l.status));
          if (l.statusstr != void 0) {
            j.push(new c(l.statusstr));
          }
          if (l.failinfo != void 0) {
            j.push(new b(l.failinfo));
          }
        }
        var k = new e2({ array: j });
        return k.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (d != void 0) {
        this.setByParam(d);
      }
    };
    extendClass(KJUR.asn1.tsp.PKIStatusInfo, KJUR.asn1.ASN1Object);
    KJUR.asn1.tsp.PKIStatus = function(g) {
      var e2 = Error, d = KJUR, c = d.asn1, f = c.DERInteger, b = c.tsp;
      b.PKIStatus.superclass.constructor.call(this);
      var a = { granted: 0, grantedWithMods: 1, rejection: 2, waiting: 3, revocationWarning: 4, revocationNotification: 5 };
      this.params = null;
      this.tohex = function() {
        var k = this.params;
        var h, j;
        if (typeof k == "string") {
          try {
            j = a[k];
          } catch (i) {
            throw new e2("undefined name: " + k);
          }
        } else {
          if (typeof k == "number") {
            j = k;
          } else {
            throw new e2("unsupported params");
          }
        }
        return new f({ "int": j }).tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (g != void 0) {
        this.setByParam(g);
      }
    };
    extendClass(KJUR.asn1.tsp.PKIStatus, KJUR.asn1.ASN1Object);
    KJUR.asn1.tsp.PKIFreeText = function(g) {
      var f = Error, e2 = KJUR, d = e2.asn1, b = d.DERSequence, c = d.DERUTF8String, a = d.tsp;
      a.PKIFreeText.superclass.constructor.call(this);
      this.params = null;
      this.tohex = function() {
        var l = this.params;
        if (!(l instanceof Array)) {
          throw new f("wrong params: not array");
        }
        var h = [];
        for (var k = 0; k < l.length; k++) {
          h.push(new c({ str: l[k] }));
        }
        var j = new b({ array: h });
        return j.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (g != void 0) {
        this.setByParam(g);
      }
    };
    extendClass(KJUR.asn1.tsp.PKIFreeText, KJUR.asn1.ASN1Object);
    KJUR.asn1.tsp.PKIFailureInfo = function(h) {
      var f = Error, e2 = KJUR, d = e2.asn1, g = d.DERBitString, b = d.tsp, c = b.PKIFailureInfo;
      var a = { badAlg: 0, badRequest: 2, badDataFormat: 5, timeNotAvailable: 14, unacceptedPolicy: 15, unacceptedExtension: 16, addInfoNotAvailable: 17, systemFailure: 25 };
      c.superclass.constructor.call(this);
      this.params = null;
      this.getBinValue = function() {
        var n2 = this.params;
        var m = 0;
        if (typeof n2 == "number" && 0 <= n2 && n2 <= 25) {
          m |= 1 << n2;
          var k = m.toString(2);
          var l = "";
          for (var j = k.length - 1; j >= 0; j--) {
            l += k[j];
          }
          return l;
        } else {
          if (typeof n2 == "string" && a[n2] != void 0) {
            return namearraytobinstr([n2], a);
          } else {
            if (typeof n2 == "object" && n2.length != void 0) {
              return namearraytobinstr(n2, a);
            } else {
              throw new f("wrong params");
            }
          }
        }
        return;
      };
      this.tohex = function() {
        var j = this.params;
        var i = this.getBinValue();
        return new g({ bin: i }).tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (h != void 0) {
        this.setByParam(h);
      }
    };
    extendClass(KJUR.asn1.tsp.PKIFailureInfo, KJUR.asn1.ASN1Object);
    KJUR.asn1.tsp.AbstractTSAAdapter = function(a) {
      this.getTSTHex = function(c, b) {
        throw "not implemented yet";
      };
    };
    KJUR.asn1.tsp.SimpleTSAAdapter = function(e2) {
      var d = KJUR, c = d.asn1, a = c.tsp, b = d.crypto.Util.hashHex;
      a.SimpleTSAAdapter.superclass.constructor.call(this);
      this.params = null;
      this.serial = 0;
      this.getTSTHex = function(g, f) {
        var i = b(g, f);
        this.params.econtent.content.messageImprint = { alg: f, hash: i };
        this.params.econtent.content.serial = { "int": this.serial++ };
        var h = Math.floor(Math.random() * 1e9);
        this.params.econtent.content.nonce = { "int": h };
        var j = new a.TimeStampToken(this.params);
        return j.getContentInfoEncodedHex();
      };
      if (e2 !== void 0) {
        this.params = e2;
      }
    };
    extendClass(KJUR.asn1.tsp.SimpleTSAAdapter, KJUR.asn1.tsp.AbstractTSAAdapter);
    KJUR.asn1.tsp.FixedTSAAdapter = function(e2) {
      var d = KJUR, c = d.asn1, a = c.tsp, b = d.crypto.Util.hashHex;
      a.FixedTSAAdapter.superclass.constructor.call(this);
      this.params = null;
      this.getTSTHex = function(g, f) {
        var h = b(g, f);
        this.params.econtent.content.messageImprint = { alg: f, hash: h };
        var i = new a.TimeStampToken(this.params);
        return i.getContentInfoEncodedHex();
      };
      if (e2 !== void 0) {
        this.params = e2;
      }
    };
    extendClass(KJUR.asn1.tsp.FixedTSAAdapter, KJUR.asn1.tsp.AbstractTSAAdapter);
    KJUR.asn1.tsp.TSPUtil = new function() {
    }();
    KJUR.asn1.tsp.TSPUtil.newTimeStampToken = function(a) {
      return new KJUR.asn1.tsp.TimeStampToken(a);
    };
    KJUR.asn1.tsp.TSPUtil.parseTimeStampReq = function(a) {
      var b = new KJUR.asn1.tsp.TSPParser();
      return b.getTimeStampReq(a);
    };
    KJUR.asn1.tsp.TSPUtil.parseMessageImprint = function(a) {
      var b = new KJUR.asn1.tsp.TSPParser();
      return b.getMessageImprint(a);
    };
    KJUR.asn1.tsp.TSPParser = function() {
      var e2 = Error, a = X509, f = new a(), k = ASN1HEX, g = k.getV, b = k.getTLV, d = k.getIdxbyList, c = k.getTLVbyListEx, i = k.getChildIdx;
      var j = ["granted", "grantedWithMods", "rejection", "waiting", "revocationWarning", "revocationNotification"];
      var h = { 0: "badAlg", 2: "badRequest", 5: "badDataFormat", 14: "timeNotAvailable", 15: "unacceptedPolicy", 16: "unacceptedExtension", 17: "addInfoNotAvailable", 25: "systemFailure" };
      this.getResponse = function(n2) {
        var l = i(n2, 0);
        if (l.length == 1) {
          return this.getPKIStatusInfo(b(n2, l[0]));
        } else {
          if (l.length > 1) {
            var o2 = this.getPKIStatusInfo(b(n2, l[0]));
            var m = b(n2, l[1]);
            var p = this.getToken(m);
            p.statusinfo = o2;
            return p;
          }
        }
      };
      this.getToken = function(m) {
        var l = new KJUR.asn1.cms.CMSParser();
        var n2 = l.getCMSSignedData(m);
        this.setTSTInfo(n2);
        return n2;
      };
      this.setTSTInfo = function(l) {
        var o2 = l.econtent;
        if (o2.type == "tstinfo") {
          var n2 = o2.content.hex;
          var m = this.getTSTInfo(n2);
          o2.content = m;
        }
      };
      this.getTSTInfo = function(r2) {
        var x = {};
        var s = i(r2, 0);
        var p = g(r2, s[1]);
        x.policy = hextooid(p);
        var o2 = b(r2, s[2]);
        x.messageImprint = this.getMessageImprint(o2);
        var u = g(r2, s[3]);
        x.serial = { hex: u };
        var y = g(r2, s[4]);
        x.genTime = { str: hextoutf8(y) };
        var q = 0;
        if (s.length > 5 && r2.substr(s[5], 2) == "30") {
          var v = b(r2, s[5]);
          x.accuracy = this.getAccuracy(v);
          q++;
        }
        if (s.length > 5 + q && r2.substr(s[5 + q], 2) == "01") {
          var z2 = g(r2, s[5 + q]);
          if (z2 == "ff") {
            x.ordering = true;
          }
          q++;
        }
        if (s.length > 5 + q && r2.substr(s[5 + q], 2) == "02") {
          var n2 = g(r2, s[5 + q]);
          x.nonce = { hex: n2 };
          q++;
        }
        if (s.length > 5 + q && r2.substr(s[5 + q], 2) == "a0") {
          var m = b(r2, s[5 + q]);
          m = "30" + m.substr(2);
          pGeneralNames = f.getGeneralNames(m);
          var t3 = pGeneralNames[0].dn;
          x.tsa = t3;
          q++;
        }
        if (s.length > 5 + q && r2.substr(s[5 + q], 2) == "a1") {
          var l = b(r2, s[5 + q]);
          l = "30" + l.substr(2);
          var w = f.getExtParamArray(l);
          x.ext = w;
          q++;
        }
        return x;
      };
      this.getAccuracy = function(q) {
        var r2 = {};
        var o2 = i(q, 0);
        for (var p = 0; p < o2.length; p++) {
          var m = q.substr(o2[p], 2);
          var l = g(q, o2[p]);
          var n2 = parseInt(l, 16);
          if (m == "02") {
            r2.seconds = n2;
          } else {
            if (m == "80") {
              r2.millis = n2;
            } else {
              if (m == "81") {
                r2.micros = n2;
              }
            }
          }
        }
        return r2;
      };
      this.getMessageImprint = function(n2) {
        if (n2.substr(0, 2) != "30") {
          throw new Error("head of messageImprint hex shall be x30");
        }
        var s = {};
        var l = i(n2, 0);
        var t3 = d(n2, 0, [0, 0]);
        var o2 = g(n2, t3);
        var p = k.hextooidstr(o2);
        var r2 = KJUR.asn1.x509.OID.oid2name(p);
        if (r2 == "") {
          throw new Error("hashAlg name undefined: " + p);
        }
        var m = r2;
        var q = d(n2, 0, [1]);
        s.alg = m;
        s.hash = g(n2, q);
        return s;
      };
      this.getPKIStatusInfo = function(o2) {
        var t3 = {};
        var r2 = i(o2, 0);
        var n2 = 0;
        try {
          var l = g(o2, r2[0]);
          var p = parseInt(l, 16);
          t3.status = j[p];
        } catch (s) {
        }
        if (r2.length > 1 && o2.substr(r2[1], 2) == "30") {
          var m = b(o2, r2[1]);
          t3.statusstr = this.getPKIFreeText(m);
          n2++;
        }
        if (r2.length > n2 && o2.substr(r2[1 + n2], 2) == "03") {
          var q = b(o2, r2[1 + n2]);
          t3.failinfo = this.getPKIFailureInfo(q);
        }
        return t3;
      };
      this.getPKIFreeText = function(n2) {
        var o2 = [];
        var l = i(n2, 0);
        for (var m = 0; m < l.length; m++) {
          o2.push(k.getString(n2, l[m]));
        }
        return o2;
      };
      this.getPKIFailureInfo = function(l) {
        var m = k.getInt(l, 0);
        if (h[m] != void 0) {
          return h[m];
        } else {
          return m;
        }
      };
      this.getTimeStampReq = function(q) {
        var p = {};
        p.certreq = false;
        var s = i(q, 0);
        if (s.length < 2) {
          throw new Error("TimeStampReq must have at least 2 items");
        }
        var n2 = b(q, s[1]);
        p.messageImprint = KJUR.asn1.tsp.TSPUtil.parseMessageImprint(n2);
        for (var o2 = 2; o2 < s.length; o2++) {
          var m = s[o2];
          var l = q.substr(m, 2);
          if (l == "06") {
            var r2 = g(q, m);
            p.policy = k.hextooidstr(r2);
          }
          if (l == "02") {
            p.nonce = g(q, m);
          }
          if (l == "01") {
            p.certreq = true;
          }
        }
        return p;
      };
    };
    if (typeof KJUR == "undefined" || !KJUR) {
      KJUR = {};
    }
    if (typeof KJUR.asn1 == "undefined" || !KJUR.asn1) {
      KJUR.asn1 = {};
    }
    if (typeof KJUR.asn1.cades == "undefined" || !KJUR.asn1.cades) {
      KJUR.asn1.cades = {};
    }
    KJUR.asn1.cades.SignaturePolicyIdentifier = function(e2) {
      var c = KJUR, b = c.asn1, a = b.cades, d = a.SignaturePolicyId;
      a.SignaturePolicyIdentifier.superclass.constructor.call(this);
      this.typeOid = "1.2.840.113549.1.9.16.2.15";
      this.params = null;
      this.getValueArray = function() {
        return [new d(this.params)];
      };
      this.setByParam = function(f) {
        this.params = f;
      };
      if (e2 != void 0) {
        this.setByParam(e2);
      }
    };
    extendClass(KJUR.asn1.cades.SignaturePolicyIdentifier, KJUR.asn1.cms.Attribute);
    KJUR.asn1.cades.SignaturePolicyId = function(e2) {
      var a = KJUR, g = a.asn1, f = g.DERSequence, i = g.DERObjectIdentifier, d = g.x509, j = d.AlgorithmIdentifier, c = g.cades, h = c.SignaturePolicyId, b = c.OtherHashAlgAndValue;
      h.superclass.constructor.call(this);
      this.params = null;
      this.tohex = function() {
        var m = this.params;
        var k = [];
        k.push(new i(m.oid));
        k.push(new b(m));
        var l = new f({ array: k });
        return l.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      this.setByParam = function(k) {
        this.params = k;
      };
      if (e2 != void 0) {
        this.setByParam(e2);
      }
    };
    extendClass(KJUR.asn1.cades.SignaturePolicyId, KJUR.asn1.ASN1Object);
    KJUR.asn1.cades.OtherHashAlgAndValue = function(e2) {
      var h = Error, a = KJUR, g = a.asn1, f = g.DERSequence, i = g.DEROctetString, d = g.x509, j = d.AlgorithmIdentifier, c = g.cades, b = c.OtherHashAlgAndValue;
      b.superclass.constructor.call(this);
      this.params = null;
      this.tohex = function() {
        var o2 = this.params;
        if (o2.alg == void 0) {
          throw new h("property 'alg' not specified");
        }
        if (o2.hash == void 0 && o2.cert == void 0) {
          throw new h("property 'hash' nor 'cert' not specified");
        }
        var m = null;
        if (o2.hash != void 0) {
          m = o2.hash;
        } else {
          if (o2.cert != void 0) {
            if (typeof o2.cert != "string") {
              throw new h("cert not string");
            }
            var n2 = o2.cert;
            if (o2.cert.indexOf("-----BEGIN") != -1) {
              n2 = pemtohex(o2.cert);
            }
            m = KJUR.crypto.Util.hashHex(n2, o2.alg);
          }
        }
        var k = [];
        k.push(new j({ name: o2.alg }));
        k.push(new i({ hex: m }));
        var l = new f({ array: k });
        return l.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (e2 != void 0) {
        this.setByParam(e2);
      }
    };
    extendClass(KJUR.asn1.cades.OtherHashAlgAndValue, KJUR.asn1.ASN1Object);
    KJUR.asn1.cades.OtherHashValue = function(g) {
      KJUR.asn1.cades.OtherHashValue.superclass.constructor.call(this);
      var d = Error, c = KJUR, f = c.lang.String.isHex, b = c.asn1, e2 = b.DEROctetString, a = c.crypto.Util.hashHex;
      this.params = null;
      this.tohex = function() {
        var j = this.params;
        if (j.hash == void 0 && j.cert == void 0) {
          throw new d("hash or cert not specified");
        }
        var h = null;
        if (j.hash != void 0) {
          h = j.hash;
        } else {
          if (j.cert != void 0) {
            if (typeof j.cert != "string") {
              throw new d("cert not string");
            }
            var i = j.cert;
            if (j.cert.indexOf("-----BEGIN") != -1) {
              i = pemtohex(j.cert);
            }
            h = KJUR.crypto.Util.hashHex(i, "sha1");
          }
        }
        return new e2({ hex: h }).tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (g != void 0) {
        this.setByParam(g);
      }
    };
    extendClass(KJUR.asn1.cades.OtherHashValue, KJUR.asn1.ASN1Object);
    KJUR.asn1.cades.SignatureTimeStamp = function(h) {
      var d = Error, c = KJUR, f = c.lang.String.isHex, b = c.asn1, e2 = b.ASN1Object, g = b.x509, a = b.cades;
      a.SignatureTimeStamp.superclass.constructor.call(this);
      this.typeOid = "1.2.840.113549.1.9.16.2.14";
      this.params = null;
      this.getValueArray = function() {
        var l = this.params;
        if (l.tst != void 0) {
          if (f(l.tst)) {
            var j = new e2();
            j.hTLV = l.tst;
            return [j];
          } else {
            if (l.tst instanceof e2) {
              return [l.tst];
            } else {
              throw new d("params.tst has wrong value");
            }
          }
        } else {
          if (l.res != void 0) {
            var k = l.res;
            if (k instanceof e2) {
              k = k.tohex();
            }
            if (typeof k != "string" || !f(k)) {
              throw new d("params.res has wrong value");
            }
            var i = ASN1HEX.getTLVbyList(k, 0, [1]);
            var j = new e2();
            j.hTLV = l.tst;
            return [j];
          }
        }
      };
      if (h != null) {
        this.setByParam(h);
      }
    };
    extendClass(KJUR.asn1.cades.SignatureTimeStamp, KJUR.asn1.cms.Attribute);
    KJUR.asn1.cades.CompleteCertificateRefs = function(h) {
      var f = Error, e2 = KJUR, d = e2.asn1, b = d.DERSequence, c = d.cades, a = c.OtherCertID, g = e2.lang.String.isHex;
      c.CompleteCertificateRefs.superclass.constructor.call(this);
      this.typeOid = "1.2.840.113549.1.9.16.2.21";
      this.params = null;
      this.getValueArray = function() {
        var o2 = this.params;
        var k = [];
        for (var m = 0; m < o2.array.length; m++) {
          var n2 = o2.array[m];
          if (typeof n2 == "string") {
            if (n2.indexOf("-----BEGIN") != -1) {
              n2 = { cert: n2 };
            } else {
              if (g(n2)) {
                n2 = { hash: n2 };
              } else {
                throw new f("unsupported value: " + n2);
              }
            }
          }
          if (o2.alg != void 0 && n2.alg == void 0) {
            n2.alg = o2.alg;
          }
          if (o2.hasis != void 0 && n2.hasis == void 0) {
            n2.hasis = o2.hasis;
          }
          var j = new a(n2);
          k.push(j);
        }
        var l = new b({ array: k });
        return [l];
      };
      if (h != void 0) {
        this.setByParam(h);
      }
    };
    extendClass(KJUR.asn1.cades.CompleteCertificateRefs, KJUR.asn1.cms.Attribute);
    KJUR.asn1.cades.OtherCertID = function(e2) {
      var a = KJUR, h = a.asn1, f = h.DERSequence, i = h.cms, g = i.IssuerSerial, c = h.cades, d = c.OtherHashValue, b = c.OtherHashAlgAndValue;
      c.OtherCertID.superclass.constructor.call(this);
      this.params = e2;
      this.tohex = function() {
        var n2 = this.params;
        if (typeof n2 == "string") {
          if (n2.indexOf("-----BEGIN") != -1) {
            n2 = { cert: n2 };
          } else {
            if (_isHex(n2)) {
              n2 = { hash: n2 };
            }
          }
        }
        var j = [];
        var m = null;
        if (n2.alg != void 0) {
          m = new b(n2);
        } else {
          m = new d(n2);
        }
        j.push(m);
        if (n2.cert != void 0 && n2.hasis == true || n2.issuer != void 0 && n2.serial != void 0) {
          var l = new g(n2);
          j.push(l);
        }
        var k = new f({ array: j });
        return k.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (e2 != void 0) {
        this.setByParam(e2);
      }
    };
    extendClass(KJUR.asn1.cades.OtherCertID, KJUR.asn1.ASN1Object);
    KJUR.asn1.cades.OtherHash = function(g) {
      var i = Error, a = KJUR, h = a.asn1, j = h.cms, c = h.cades, b = c.OtherHashAlgAndValue, e2 = c.OtherHashValue, d = a.crypto.Util.hashHex, f = a.lang.String.isHex;
      c.OtherHash.superclass.constructor.call(this);
      this.params = null;
      this.tohex = function() {
        var l = this.params;
        if (typeof l == "string") {
          if (l.indexOf("-----BEGIN") != -1) {
            l = { cert: l };
          } else {
            if (f(l)) {
              l = { hash: l };
            }
          }
        }
        var k = null;
        if (l.alg != void 0) {
          k = new b(l);
        } else {
          k = new e2(l);
        }
        return k.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (g != void 0) {
        this.setByParam(g);
      }
    };
    extendClass(KJUR.asn1.cades.OtherHash, KJUR.asn1.ASN1Object);
    KJUR.asn1.cades.CAdESUtil = new function() {
    }();
    KJUR.asn1.cades.CAdESUtil.parseSignedDataForAddingUnsigned = function(a) {
      var c = new KJUR.asn1.cms.CMSParser();
      var b = c.getCMSSignedData(a);
      return b;
    };
    KJUR.asn1.cades.CAdESUtil.parseSignerInfoForAddingUnsigned = function(g, q, c) {
      var p = ASN1HEX, s = p.getChildIdx, a = p.getTLV, l = p.getV, v = KJUR, h = v.asn1, n2 = h.ASN1Object, j = h.cms, k = j.AttributeList, w = j.SignerInfo;
      var o2 = {};
      var t3 = s(g, q);
      if (t3.length != 6) {
        throw "not supported items for SignerInfo (!=6)";
      }
      var d = t3.shift();
      o2.version = a(g, d);
      var e2 = t3.shift();
      o2.si = a(g, e2);
      var m = t3.shift();
      o2.digalg = a(g, m);
      var f = t3.shift();
      o2.sattrs = a(g, f);
      var i = t3.shift();
      o2.sigalg = a(g, i);
      var b = t3.shift();
      o2.sig = a(g, b);
      o2.sigval = l(g, b);
      var u = null;
      o2.obj = new w();
      u = new n2();
      u.hTLV = o2.version;
      o2.obj.dCMSVersion = u;
      u = new n2();
      u.hTLV = o2.si;
      o2.obj.dSignerIdentifier = u;
      u = new n2();
      u.hTLV = o2.digalg;
      o2.obj.dDigestAlgorithm = u;
      u = new n2();
      u.hTLV = o2.sattrs;
      o2.obj.dSignedAttrs = u;
      u = new n2();
      u.hTLV = o2.sigalg;
      o2.obj.dSigAlg = u;
      u = new n2();
      u.hTLV = o2.sig;
      o2.obj.dSig = u;
      o2.obj.dUnsignedAttrs = new k();
      return o2;
    };
    if (typeof KJUR.asn1.csr == "undefined" || !KJUR.asn1.csr) {
      KJUR.asn1.csr = {};
    }
    KJUR.asn1.csr.CertificationRequest = function(g) {
      var d = KJUR, c = d.asn1, e2 = c.DERBitString, b = c.DERSequence, a = c.csr, f = c.x509, h = a.CertificationRequestInfo;
      a.CertificationRequest.superclass.constructor.call(this);
      this.setByParam = function(i) {
        this.params = i;
      };
      this.sign = function() {
        var j = new h(this.params).tohex();
        var k = new KJUR.crypto.Signature({ alg: this.params.sigalg });
        k.init(this.params.sbjprvkey);
        k.updateHex(j);
        var i = k.sign();
        this.params.sighex = i;
      };
      this.getPEM = function() {
        return hextopem(this.tohex(), "CERTIFICATE REQUEST");
      };
      this.tohex = function() {
        var l = this.params;
        var j = new KJUR.asn1.csr.CertificationRequestInfo(this.params);
        var m = new KJUR.asn1.x509.AlgorithmIdentifier({ name: l.sigalg });
        if (l.sighex == void 0 && l.sbjprvkey != void 0) {
          this.sign();
        }
        if (l.sighex == void 0) {
          throw new Error("sighex or sbjprvkey parameter not defined");
        }
        var k = new e2({ hex: "00" + l.sighex });
        var i = new b({ array: [j, m, k] });
        return i.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (g !== void 0) {
        this.setByParam(g);
      }
    };
    extendClass(KJUR.asn1.csr.CertificationRequest, KJUR.asn1.ASN1Object);
    KJUR.asn1.csr.CertificationRequestInfo = function(f) {
      var b = KJUR, j = b.asn1, c = j.DERBitString, g = j.DERSequence, i = j.DERInteger, p = j.DERUTF8String, d = j.DERTaggedObject, h = j.ASN1Util.newObject, n2 = j.csr, e2 = j.x509, a = e2.X500Name, l = e2.Extensions, o2 = e2.SubjectPublicKeyInfo, k = n2.AttributeList;
      n2.CertificationRequestInfo.superclass.constructor.call(this);
      this.params = null;
      this.setByParam = function(q) {
        if (q != void 0) {
          this.params = q;
        }
      };
      this.tohex = function() {
        var v = this.params;
        var r2 = [];
        r2.push(new i({ "int": 0 }));
        r2.push(new a(v.subject));
        r2.push(new o2(KEYUTIL.getKey(v.sbjpubkey)));
        if (v.attrs != void 0) {
          var u = m(v.attrs);
          var t3 = h({ tag: { tage: "a0", obj: u } });
          r2.push(t3);
        } else {
          if (v.extreq != void 0) {
            var q = new l(v.extreq);
            var t3 = h({ tag: { tage: "a0", obj: { seq: [{ oid: "1.2.840.113549.1.9.14" }, { set: [q] }] } } });
            r2.push(t3);
          } else {
            r2.push(new d({ tag: "a0", explicit: false, obj: new p({ str: "" }) }));
          }
        }
        var s = new g({ array: r2 });
        return s.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      function m(s) {
        var w = Error, v = KJUR.asn1.x509.Extensions;
        var y = [];
        for (var u = 0; u < s.length; u++) {
          var r2 = s[u];
          var x = r2.attr;
          if (x == "extensionRequest") {
            var t3 = new v(r2.ext);
            var q = { seq: [{ oid: "1.2.840.113549.1.9.14" }, { set: [t3] }] };
            y.push(q);
          } else {
            if (x == "unstructuredName") {
              var q = { seq: [{ oid: "1.2.840.113549.1.9.2" }, { set: r2.names }] };
              y.push(q);
            } else {
              if (x == "challengePassword") {
                var q = { seq: [{ oid: "1.2.840.113549.1.9.7" }, { set: [{ utf8str: r2.password }] }] };
                y.push(q);
              } else {
                throw new w("unknown CSR attribute");
              }
            }
          }
        }
        return { set: y };
      }
      __name(m, "m");
      __name2(m, "m");
      if (f != void 0) {
        this.setByParam(f);
      }
    };
    extendClass(KJUR.asn1.csr.CertificationRequestInfo, KJUR.asn1.ASN1Object);
    KJUR.asn1.csr.AttributeList = function(b) {
      function a(c) {
      }
      __name(a, "a");
      __name2(a, "a");
    };
    extendClass(KJUR.asn1.csr.AttributeList, KJUR.asn1.ASN1Object);
    KJUR.asn1.csr.CSRUtil = new function() {
    }();
    KJUR.asn1.csr.CSRUtil.newCSRPEM = function(e2) {
      var b = KEYUTIL, a = KJUR.asn1.csr;
      var c = new a.CertificationRequest(e2);
      var d = c.getPEM();
      return d;
    };
    KJUR.asn1.csr.CSRUtil.getParam = function(d, a) {
      var m = ASN1HEX, i = m.getV, j = m.getIdxbyList, b = m.getTLVbyList, o2 = m.getTLVbyListEx, n2 = m.getVbyListEx;
      var l = /* @__PURE__ */ __name2(function(u) {
        var t3 = j(u, 0, [0, 3, 0, 0], "06");
        if (i(u, t3) != "2a864886f70d01090e") {
          return null;
        }
        return b(u, 0, [0, 3, 0, 1, 0], "30");
      }, "l");
      var g = {};
      if (d.indexOf("-----BEGIN CERTIFICATE REQUEST") == -1) {
        throw new Error("argument is not PEM file");
      }
      var e2 = pemtohex(d, "CERTIFICATE REQUEST");
      if (a) {
        g.tbs = b(e2, 0, [0]);
      }
      try {
        var p = o2(e2, 0, [0, 1]);
        if (p == "3000") {
          g.subject = {};
        } else {
          var f = new X509();
          g.subject = f.getX500Name(p);
        }
      } catch (q) {
      }
      var k = o2(e2, 0, [0, 2]);
      var r2 = KEYUTIL.getKey(k, null, "pkcs8pub");
      g.sbjpubkey = KEYUTIL.getPEM(r2, "PKCS8PUB");
      var c = l(e2);
      var f = new X509();
      if (c != null) {
        g.extreq = f.getExtParamArray(c);
      }
      try {
        var h = o2(e2, 0, [1], "30");
        var f = new X509();
        g.sigalg = f.getAlgorithmIdentifierName(h);
      } catch (q) {
      }
      try {
        var s = n2(e2, 0, [2]);
        g.sighex = s;
      } catch (q) {
      }
      return g;
    };
    KJUR.asn1.csr.CSRUtil.verifySignature = function(b) {
      try {
        var c = null;
        if (typeof b == "string" && b.indexOf("-----BEGIN CERTIFICATE REQUEST") != -1) {
          c = KJUR.asn1.csr.CSRUtil.getParam(b, true);
        } else {
          if (typeof b == "object" && b.sbjpubkey != void 0 && b.sigalg != void 0 && b.sighex != void 0 && b.tbs != void 0) {
            c = b;
          }
        }
        if (c == null) {
          return false;
        }
        var d = new KJUR.crypto.Signature({ alg: c.sigalg });
        d.init(c.sbjpubkey);
        d.updateHex(c.tbs);
        return d.verify(c.sighex);
      } catch (a) {
        alert(a);
        return false;
      }
    };
    if (typeof KJUR == "undefined" || !KJUR) {
      KJUR = {};
    }
    if (typeof KJUR.asn1 == "undefined" || !KJUR.asn1) {
      KJUR.asn1 = {};
    }
    if (typeof KJUR.asn1.ocsp == "undefined" || !KJUR.asn1.ocsp) {
      KJUR.asn1.ocsp = {};
    }
    KJUR.asn1.ocsp.DEFAULT_HASH = "sha1";
    KJUR.asn1.ocsp.OCSPResponse = function(e2) {
      KJUR.asn1.ocsp.OCSPResponse.superclass.constructor.call(this);
      var a = KJUR.asn1.DEREnumerated, b = KJUR.asn1.ASN1Util.newObject, c = KJUR.asn1.ocsp.ResponseBytes;
      var d = ["successful", "malformedRequest", "internalError", "tryLater", "_not_used_", "sigRequired", "unauthorized"];
      this.params = null;
      this._getStatusCode = function() {
        var f = this.params.resstatus;
        if (typeof f == "number") {
          return f;
        }
        if (typeof f != "string") {
          return -1;
        }
        return d.indexOf(f);
      };
      this.setByParam = function(f) {
        this.params = f;
      };
      this.tohex = function() {
        var h = this.params;
        var g = this._getStatusCode();
        if (g == -1) {
          throw new Error("responseStatus not supported: " + h.resstatus);
        }
        if (g != 0) {
          return b({ seq: [{ "enum": { "int": g } }] }).tohex();
        }
        var f = new c(h);
        return b({ seq: [{ "enum": { "int": 0 } }, { tag: { tag: "a0", explicit: true, obj: f } }] }).tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (e2 !== void 0) {
        this.setByParam(e2);
      }
    };
    extendClass(KJUR.asn1.ocsp.OCSPResponse, KJUR.asn1.ASN1Object);
    KJUR.asn1.ocsp.ResponseBytes = function(e2) {
      KJUR.asn1.ocsp.ResponseBytes.superclass.constructor.call(this);
      var b = KJUR.asn1, a = b.DERSequence, f = b.DERObjectIdentifier, c = b.DEROctetString, d = b.ocsp.BasicOCSPResponse;
      this.params = null;
      this.setByParam = function(g) {
        this.params = g;
      };
      this.tohex = function() {
        var j = this.params;
        if (j.restype != "ocspBasic") {
          throw new Error("not supported responseType: " + j.restype);
        }
        var i = new d(j);
        var g = [];
        g.push(new f({ name: "ocspBasic" }));
        g.push(new c({ hex: i.tohex() }));
        var h = new a({ array: g });
        return h.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (e2 !== void 0) {
        this.setByParam(e2);
      }
    };
    extendClass(KJUR.asn1.ocsp.ResponseBytes, KJUR.asn1.ASN1Object);
    KJUR.asn1.ocsp.BasicOCSPResponse = function(d) {
      KJUR.asn1.ocsp.BasicOCSPResponse.superclass.constructor.call(this);
      var i = Error, g = KJUR.asn1, j = g.ASN1Object, e2 = g.DERSequence, f = g.DERGeneralizedTime, c = g.DERTaggedObject, b = g.DERBitString, h = g.x509.Extensions, k = g.x509.AlgorithmIdentifier, l = g.ocsp, a = l.ResponderID;
      _SingleResponseList = l.SingleResponseList, _ResponseData = l.ResponseData;
      this.params = null;
      this.setByParam = function(m) {
        this.params = m;
      };
      this.sign = function() {
        var o2 = this.params;
        var m = o2.tbsresp.tohex();
        var n2 = new KJUR.crypto.Signature({ alg: o2.sigalg });
        n2.init(o2.reskey);
        n2.updateHex(m);
        o2.sighex = n2.sign();
      };
      this.tohex = function() {
        var t3 = this.params;
        if (t3.tbsresp == void 0) {
          t3.tbsresp = new _ResponseData(t3);
        }
        if (t3.sighex == void 0 && t3.reskey != void 0) {
          this.sign();
        }
        var n2 = [];
        n2.push(t3.tbsresp);
        n2.push(new k({ name: t3.sigalg }));
        n2.push(new b({ hex: "00" + t3.sighex }));
        if (t3.certs != void 0 && t3.certs.length != void 0) {
          var m = [];
          for (var q = 0; q < t3.certs.length; q++) {
            var s = t3.certs[q];
            var r2 = null;
            if (ASN1HEX.isASN1HEX(s)) {
              r2 = s;
            } else {
              if (s.match(/-----BEGIN/)) {
                r2 = pemtohex(s);
              } else {
                throw new i("certs[" + q + "] not hex or PEM");
              }
            }
            m.push(new j({ tlv: r2 }));
          }
          var p = new e2({ array: m });
          n2.push(new c({ tag: "a0", explicit: true, obj: p }));
        }
        var o2 = new e2({ array: n2 });
        return o2.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (d !== void 0) {
        this.setByParam(d);
      }
    };
    extendClass(KJUR.asn1.ocsp.BasicOCSPResponse, KJUR.asn1.ASN1Object);
    KJUR.asn1.ocsp.ResponseData = function(c) {
      KJUR.asn1.ocsp.ResponseData.superclass.constructor.call(this);
      var h = Error, f = KJUR.asn1, d = f.DERSequence, e2 = f.DERGeneralizedTime, b = f.DERTaggedObject, g = f.x509.Extensions, i = f.ocsp, a = i.ResponderID;
      _SingleResponseList = i.SingleResponseList;
      this.params = null;
      this.tohex = function() {
        var m = this.params;
        if (m.respid != void 0) {
          new h("respid not specified");
        }
        if (m.prodat != void 0) {
          new h("prodat not specified");
        }
        if (m.array != void 0) {
          new h("array not specified");
        }
        var j = [];
        j.push(new a(m.respid));
        j.push(new e2(m.prodat));
        j.push(new _SingleResponseList(m.array));
        if (m.ext != void 0) {
          var l = new g(m.ext);
          j.push(new b({ tag: "a1", explicit: true, obj: l }));
        }
        var k = new d({ array: j });
        return k.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      this.setByParam = function(j) {
        this.params = j;
      };
      if (c !== void 0) {
        this.setByParam(c);
      }
    };
    extendClass(KJUR.asn1.ocsp.ResponseData, KJUR.asn1.ASN1Object);
    KJUR.asn1.ocsp.ResponderID = function(g) {
      KJUR.asn1.ocsp.ResponderID.superclass.constructor.call(this);
      var d = KJUR, c = d.asn1, b = c.ASN1Util.newObject, f = c.x509.X500Name, e2 = d.lang.String.isHex, a = Error;
      this.params = null;
      this.tohex = function() {
        var m = this.params;
        if (m.key != void 0) {
          var l = null;
          if (typeof m.key == "string") {
            if (e2(m.key)) {
              l = m.key;
            }
            if (m.key.match(/-----BEGIN CERTIFICATE/)) {
              var h = new X509(m.key);
              var k = h.getExtSubjectKeyIdentifier();
              if (k != null) {
                l = k.kid.hex;
              }
            }
          } else {
            if (m.key instanceof X509) {
              var k = m.key.getExtSubjectKeyIdentifier();
              if (k != null) {
                l = k.kid.hex;
              }
            }
          }
          if (l == null) {
            throw new a("wrong key member value");
          }
          var j = b({ tag: { tag: "a2", explicit: true, obj: { octstr: { hex: l } } } });
          return j.tohex();
        } else {
          if (m.name != void 0) {
            var i = null;
            if (typeof m.name == "string" && m.name.match(/-----BEGIN CERTIFICATE/)) {
              var h = new X509(m.name);
              i = h.getSubject();
            } else {
              if (m.name instanceof X509) {
                i = m.name.getSubject();
              } else {
                if (typeof m.name == "object" && (m.name.array != void 0 || m.name.str != void 0)) {
                  i = m.name;
                }
              }
            }
            if (i == null) {
              throw new a("wrong name member value");
            }
            var j = b({ tag: { tag: "a1", explicit: true, obj: new f(i) } });
            return j.tohex();
          }
        }
        throw new a("key or name not specified");
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      this.setByParam = function(h) {
        this.params = h;
      };
      if (g !== void 0) {
        this.setByParam(g);
      }
    };
    extendClass(KJUR.asn1.ocsp.ResponderID, KJUR.asn1.ASN1Object);
    KJUR.asn1.ocsp.SingleResponseList = function(d) {
      KJUR.asn1.ocsp.SingleResponseList.superclass.constructor.call(this);
      var c = KJUR.asn1, b = c.DERSequence, a = c.ocsp.SingleResponse;
      this.params = null;
      this.tohex = function() {
        var h = this.params;
        if (typeof h != "object" || h.length == void 0) {
          throw new Error("params not specified properly");
        }
        var e2 = [];
        for (var g = 0; g < h.length; g++) {
          e2.push(new a(h[g]));
        }
        var f = new b({ array: e2 });
        return f.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      this.setByParam = function(e2) {
        this.params = e2;
      };
      if (d !== void 0) {
        this.setByParam(d);
      }
    };
    extendClass(KJUR.asn1.ocsp.SingleResponseList, KJUR.asn1.ASN1Object);
    KJUR.asn1.ocsp.SingleResponse = function(e2) {
      var k = Error, a = KJUR, i = a.asn1, f = i.DERSequence, g = i.DERGeneralizedTime, b = i.DERTaggedObject, l = i.ocsp, h = l.CertID, c = l.CertStatus, d = i.x509, j = d.Extensions;
      l.SingleResponse.superclass.constructor.call(this);
      this.params = null;
      this.tohex = function() {
        var q = this.params;
        var n2 = [];
        if (q.certid == void 0) {
          throw new k("certid unspecified");
        }
        if (q.status == void 0) {
          throw new k("status unspecified");
        }
        if (q.thisupdate == void 0) {
          throw new k("thisupdate unspecified");
        }
        n2.push(new h(q.certid));
        n2.push(new c(q.status));
        n2.push(new g(q.thisupdate));
        if (q.nextupdate != void 0) {
          var m = new g(q.nextupdate);
          n2.push(new b({ tag: "a0", explicit: true, obj: m }));
        }
        if (q.ext != void 0) {
          var p = new j(q.ext);
          n2.push(new b({ tag: "a1", explicit: true, obj: p }));
        }
        var o2 = new f({ array: n2 });
        return o2.tohex();
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      this.setByParam = function(m) {
        this.params = m;
      };
      if (e2 !== void 0) {
        this.setByParam(e2);
      }
    };
    extendClass(KJUR.asn1.ocsp.SingleResponse, KJUR.asn1.ASN1Object);
    KJUR.asn1.ocsp.CertID = function(e2) {
      var b = KJUR, i = b.asn1, l = i.DEROctetString, h = i.DERInteger, f = i.DERSequence, d = i.x509, m = d.AlgorithmIdentifier, n2 = i.ocsp, k = n2.DEFAULT_HASH, g = b.crypto, c = g.Util.hashHex, a = X509, o2 = ASN1HEX, j = o2.getVbyList;
      n2.CertID.superclass.constructor.call(this);
      this.DEFAULT_HASH = "sha1";
      this.params = null;
      this.setByValue = function(s, r2, p, q) {
        if (q == void 0) {
          q = this.DEFAULT_HASH;
        }
        this.params = { alg: q, issname: s, isskey: r2, sbjsn: p };
      };
      this.setByCert = function(p, q, r2) {
        if (r2 == void 0) {
          r2 = this.DEFAULT_HASH;
        }
        this.params = { alg: r2, issuerCert: p, subjectCert: q };
      };
      this.getParamByCerts = function(y, x, t3) {
        if (t3 == void 0) {
          t3 = this.DEFAULT_HASH;
        }
        var q = new a(y);
        var v = new a(x);
        var s = c(q.getSubjectHex(), t3);
        var u = q.getPublicKeyHex();
        var p = c(j(u, 0, [1], "03", true), t3);
        var w = v.getSerialNumberHex();
        var r2 = { alg: t3, issname: s, isskey: p, sbjsn: w };
        return r2;
      };
      this.tohex = function() {
        if (typeof this.params != "object") {
          throw new Error("params not set");
        }
        var s = this.params;
        var u, r2, y, q;
        if (s.alg == void 0) {
          q = this.DEFAULT_HASH;
        } else {
          q = s.alg;
        }
        if (s.issuerCert != void 0 && s.subjectCert != void 0) {
          var t3 = this.getParamByCerts(s.issuerCert, s.subjectCert, q);
          u = t3.issname;
          r2 = t3.isskey;
          y = t3.sbjsn;
        } else {
          if (s.issname != void 0 && s.isskey != void 0 && s.sbjsn != void 0) {
            u = s.issname;
            r2 = s.isskey;
            y = s.sbjsn;
          } else {
            throw new Error("required param members not defined");
          }
        }
        var A = new m({ name: q });
        var v = new l({ hex: u });
        var x = new l({ hex: r2 });
        var w = new h({ hex: y });
        var z2 = new f({ array: [A, v, x, w] });
        this.hTLV = z2.tohex();
        return this.hTLV;
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (e2 !== void 0) {
        this.setByParam(e2);
      }
    };
    extendClass(KJUR.asn1.ocsp.CertID, KJUR.asn1.ASN1Object);
    KJUR.asn1.ocsp.CertStatus = function(a) {
      KJUR.asn1.ocsp.CertStatus.superclass.constructor.call(this);
      this.params = null;
      this.tohex = function() {
        var d = this.params;
        if (d.status == "good") {
          return "8000";
        }
        if (d.status == "unknown") {
          return "8200";
        }
        if (d.status == "revoked") {
          var c = [{ gentime: { str: d.time } }];
          if (d.reason != void 0) {
            c.push({ tag: { tag: "a0", explicit: true, obj: { "enum": { "int": d.reason } } } });
          }
          var b = { tag: "a1", explicit: false, obj: { seq: c } };
          return KJUR.asn1.ASN1Util.newObject({ tag: b }).tohex();
        }
        throw new Error("bad status");
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      this.setByParam = function(b) {
        this.params = b;
      };
      if (a !== void 0) {
        this.setByParam(a);
      }
    };
    extendClass(KJUR.asn1.ocsp.CertStatus, KJUR.asn1.ASN1Object);
    KJUR.asn1.ocsp.Request = function(f) {
      var c = KJUR, b = c.asn1, a = b.DERSequence, d = b.ocsp;
      d.Request.superclass.constructor.call(this);
      this.dReqCert = null;
      this.dExt = null;
      this.tohex = function() {
        var g = [];
        if (this.dReqCert === null) {
          throw "reqCert not set";
        }
        g.push(this.dReqCert);
        var h = new a({ array: g });
        this.hTLV = h.tohex();
        return this.hTLV;
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (typeof f !== "undefined") {
        var e2 = new d.CertID(f);
        this.dReqCert = e2;
      }
    };
    extendClass(KJUR.asn1.ocsp.Request, KJUR.asn1.ASN1Object);
    KJUR.asn1.ocsp.TBSRequest = function(e2) {
      var c = KJUR, b = c.asn1, a = b.DERSequence, d = b.ocsp;
      d.TBSRequest.superclass.constructor.call(this);
      this.version = 0;
      this.dRequestorName = null;
      this.dRequestList = [];
      this.dRequestExt = null;
      this.setRequestListByParam = function(h) {
        var f = [];
        for (var g = 0; g < h.length; g++) {
          var j = new d.Request(h[0]);
          f.push(j);
        }
        this.dRequestList = f;
      };
      this.tohex = function() {
        var f = [];
        if (this.version !== 0) {
          throw "not supported version: " + this.version;
        }
        if (this.dRequestorName !== null) {
          throw "requestorName not supported";
        }
        var h = new a({ array: this.dRequestList });
        f.push(h);
        if (this.dRequestExt !== null) {
          throw "requestExtensions not supported";
        }
        var g = new a({ array: f });
        this.hTLV = g.tohex();
        return this.hTLV;
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (e2 !== void 0) {
        if (e2.reqList !== void 0) {
          this.setRequestListByParam(e2.reqList);
        }
      }
    };
    extendClass(KJUR.asn1.ocsp.TBSRequest, KJUR.asn1.ASN1Object);
    KJUR.asn1.ocsp.OCSPRequest = function(f) {
      var c = KJUR, b = c.asn1, a = b.DERSequence, d = b.ocsp;
      d.OCSPRequest.superclass.constructor.call(this);
      this.dTbsRequest = null;
      this.dOptionalSignature = null;
      this.tohex = function() {
        var g = [];
        if (this.dTbsRequest !== null) {
          g.push(this.dTbsRequest);
        } else {
          throw "tbsRequest not set";
        }
        if (this.dOptionalSignature !== null) {
          throw "optionalSignature not supported";
        }
        var h = new a({ array: g });
        this.hTLV = h.tohex();
        return this.hTLV;
      };
      this.getEncodedHex = function() {
        return this.tohex();
      };
      if (f !== void 0) {
        if (f.reqList !== void 0) {
          var e2 = new d.TBSRequest(f);
          this.dTbsRequest = e2;
        }
      }
    };
    extendClass(KJUR.asn1.ocsp.OCSPRequest, KJUR.asn1.ASN1Object);
    KJUR.asn1.ocsp.OCSPUtil = {};
    KJUR.asn1.ocsp.OCSPUtil.getRequestHex = function(a, b, h) {
      var d = KJUR, c = d.asn1, e2 = c.ocsp;
      if (h === void 0) {
        h = e2.DEFAULT_HASH;
      }
      var g = { alg: h, issuerCert: a, subjectCert: b };
      var f = new e2.OCSPRequest({ reqList: [g] });
      return f.tohex();
    };
    KJUR.asn1.ocsp.OCSPUtil.getOCSPResponseInfo = function(b) {
      var m = ASN1HEX, c = m.getVbyList, k = m.getVbyListEx, e2 = m.getIdxbyList, d = m.getIdxbyListEx, g = m.getV;
      var n2 = {};
      try {
        var j = k(b, 0, [0], "0a");
        n2.responseStatus = parseInt(j, 16);
      } catch (f) {
      }
      if (n2.responseStatus !== 0) {
        return n2;
      }
      try {
        var i = e2(b, 0, [1, 0, 1, 0, 0, 2, 0, 1]);
        if (b.substr(i, 2) === "80") {
          n2.certStatus = "good";
        } else {
          if (b.substr(i, 2) === "a1") {
            n2.certStatus = "revoked";
            n2.revocationTime = hextoutf8(c(b, i, [0]));
          } else {
            if (b.substr(i, 2) === "82") {
              n2.certStatus = "unknown";
            }
          }
        }
      } catch (f) {
      }
      try {
        var a = e2(b, 0, [1, 0, 1, 0, 0, 2, 0, 2]);
        n2.thisUpdate = hextoutf8(g(b, a));
      } catch (f) {
      }
      try {
        var l = e2(b, 0, [1, 0, 1, 0, 0, 2, 0, 3]);
        if (b.substr(l, 2) === "a0") {
          n2.nextUpdate = hextoutf8(c(b, l, [0]));
        }
      } catch (f) {
      }
      return n2;
    };
    KJUR.asn1.ocsp.OCSPParser = function() {
      var g = Error, a = X509, h = new a(), l = ASN1HEX, i = l.getV, b = l.getTLV, f = l.getIdxbyList, e2 = l.getVbyList, c = l.getTLVbyList, k = l.getVbyListEx, d = l.getTLVbyListEx, j = l.getChildIdx;
      this.getOCSPRequest = function(o2) {
        var n2 = j(o2, 0);
        if (n2.length != 1 && n2.length != 2) {
          throw new g("wrong number elements: " + n2.length);
        }
        var m = this.getTBSRequest(b(o2, n2[0]));
        return m;
      };
      this.getTBSRequest = function(o2) {
        var m = {};
        var n2 = d(o2, 0, [0], "30");
        m.array = this.getRequestList(n2);
        var p = d(o2, 0, ["[2]", 0], "30");
        if (p != null) {
          m.ext = h.getExtParamArray(p);
        }
        return m;
      };
      this.getRequestList = function(p) {
        var m = [];
        var n2 = j(p, 0);
        for (var o2 = 0; o2 < n2.length; o2++) {
          var p = b(p, n2[o2]);
          m.push(this.getRequest(p));
        }
        return m;
      };
      this.getRequest = function(n2) {
        var m = j(n2, 0);
        if (m.length != 1 && m.length != 2) {
          throw new g("wrong number elements: " + m.length);
        }
        var p = this.getCertID(b(n2, m[0]));
        if (m.length == 2) {
          var o2 = f(n2, 0, [1, 0]);
          p.ext = h.getExtParamArray(b(n2, o2));
        }
        return p;
      };
      this.getCertID = function(p) {
        var o2 = j(p, 0);
        if (o2.length != 4) {
          throw new g("wrong number elements: " + o2.length);
        }
        var n2 = new a();
        var m = {};
        m.alg = n2.getAlgorithmIdentifierName(b(p, o2[0]));
        m.issname = i(p, o2[1]);
        m.isskey = i(p, o2[2]);
        m.sbjsn = i(p, o2[3]);
        return m;
      };
      this.getOCSPResponse = function(r2) {
        var o2 = j(r2, 0);
        var m;
        var q = i(r2, o2[0]);
        var p = parseInt(q);
        if (o2.length == 1) {
          return { resstatus: p };
        }
        var n2 = c(r2, 0, [1, 0]);
        m = this.getResponseBytes(n2);
        m.resstatus = p;
        return m;
      };
      this.getResponseBytes = function(p) {
        var o2 = j(p, 0);
        var n2;
        var q = c(p, 0, [1, 0]);
        n2 = this.getBasicOCSPResponse(q);
        var m = i(p, o2[0]);
        n2.restype = KJUR.asn1.x509.OID.oid2name(hextooid(m));
        return n2;
      };
      this.getBasicOCSPResponse = function(q) {
        var t3 = j(q, 0);
        var v;
        v = this.getResponseData(b(q, t3[0]));
        var u = new X509();
        v.alg = u.getAlgorithmIdentifierName(b(q, t3[1]));
        var n2 = i(q, t3[2]);
        v.sighex = n2.substr(2);
        var m = k(q, 0, ["[0]"]);
        if (m != null) {
          var r2 = j(m, 0);
          var o2 = [];
          for (var p = 0; p < r2.length; p++) {
            var s = b(m, r2[p]);
            o2.push(s);
          }
          v.certs = o2;
        }
        return v;
      };
      this.getResponseData = function(q) {
        var p = j(q, 0);
        var r2 = p.length;
        var o2 = {};
        var n2 = 0;
        if (q.substr(p[0], 2) == "a0") {
          n2++;
        }
        o2.respid = this.getResponderID(b(q, p[n2++]));
        var t3 = i(q, p[n2++]);
        o2.prodat = hextoutf8(t3);
        o2.array = this.getSingleResponseList(b(q, p[n2++]));
        if (q.substr(p[r2 - 1], 2) == "a1") {
          var s = c(q, p[r2 - 1], [0]);
          var m = new X509();
          o2.ext = m.getExtParamArray(s);
        }
        return o2;
      };
      this.getResponderID = function(o2) {
        var n2 = {};
        if (o2.substr(0, 2) == "a2") {
          var p = e2(o2, 0, [0]);
          n2.key = p;
        }
        if (o2.substr(0, 2) == "a1") {
          var q = c(o2, 0, [0]);
          var m = new X509();
          n2.name = m.getX500Name(q);
        }
        return n2;
      };
      this.getSingleResponseList = function(q) {
        var n2 = j(q, 0);
        var m = [];
        for (var o2 = 0; o2 < n2.length; o2++) {
          var r2 = this.getSingleResponse(b(q, n2[o2]));
          m.push(r2);
        }
        return m;
      };
      this.getSingleResponse = function(p) {
        var t3 = j(p, 0);
        var v = {};
        var r2 = this.getCertID(b(p, t3[0]));
        v.certid = r2;
        var u = this.getCertStatus(b(p, t3[1]));
        v.status = u;
        if (p.substr(t3[2], 2) == "18") {
          var q = i(p, t3[2]);
          v.thisupdate = hextoutf8(q);
        }
        for (var o2 = 3; o2 < t3.length; o2++) {
          if (p.substr(t3[o2], 2) == "a0") {
            var m = e2(p, t3[o2], [0], "18");
            v.nextupdate = hextoutf8(m);
          }
          if (p.substr(t3[o2], 2) == "a1") {
            var s = new X509();
            var n2 = c(p, 0, [o2, 0]);
            v.ext = s.getExtParamArray(n2);
          }
        }
        return v;
      };
      this.getCertStatus = function(p) {
        var m = {};
        if (p == "8000") {
          return { status: "good" };
        }
        if (p == "8200") {
          return { status: "unknown" };
        }
        if (p.substr(0, 2) == "a1") {
          m.status = "revoked";
          var o2 = e2(p, 0, [0]);
          var n2 = hextoutf8(o2);
          m.time = n2;
        }
        return m;
      };
    };
    var KJUR;
    if (typeof KJUR == "undefined" || !KJUR) {
      KJUR = {};
    }
    if (typeof KJUR.lang == "undefined" || !KJUR.lang) {
      KJUR.lang = {};
    }
    KJUR.lang.String = function() {
    };
    function stoBA(d) {
      var b = new Array();
      for (var c = 0; c < d.length; c++) {
        b[c] = d.charCodeAt(c);
      }
      return b;
    }
    __name(stoBA, "stoBA");
    __name2(stoBA, "stoBA");
    function BAtos(b) {
      var d = "";
      for (var c = 0; c < b.length; c++) {
        d = d + String.fromCharCode(b[c]);
      }
      return d;
    }
    __name(BAtos, "BAtos");
    __name2(BAtos, "BAtos");
    function BAtohex(b) {
      var e2 = "";
      for (var d = 0; d < b.length; d++) {
        var c = b[d].toString(16);
        if (c.length == 1) {
          c = "0" + c;
        }
        e2 = e2 + c;
      }
      return e2;
    }
    __name(BAtohex, "BAtohex");
    __name2(BAtohex, "BAtohex");
    function stohex(a) {
      return BAtohex(stoBA(a));
    }
    __name(stohex, "stohex");
    __name2(stohex, "stohex");
    function stob64(a) {
      return hex2b64(stohex(a));
    }
    __name(stob64, "stob64");
    __name2(stob64, "stob64");
    function stob64u(a) {
      return b64tob64u(hex2b64(stohex(a)));
    }
    __name(stob64u, "stob64u");
    __name2(stob64u, "stob64u");
    function b64utos(a) {
      return BAtos(b64toBA(b64utob64(a)));
    }
    __name(b64utos, "b64utos");
    __name2(b64utos, "b64utos");
    function b64tob64u(a) {
      a = a.replace(/\=/g, "");
      a = a.replace(/\+/g, "-");
      a = a.replace(/\//g, "_");
      return a;
    }
    __name(b64tob64u, "b64tob64u");
    __name2(b64tob64u, "b64tob64u");
    function b64utob64(a) {
      if (a.length % 4 == 2) {
        a = a + "==";
      } else {
        if (a.length % 4 == 3) {
          a = a + "=";
        }
      }
      a = a.replace(/-/g, "+");
      a = a.replace(/_/g, "/");
      return a;
    }
    __name(b64utob64, "b64utob64");
    __name2(b64utob64, "b64utob64");
    function hextob64u(a) {
      if (a.length % 2 == 1) {
        a = "0" + a;
      }
      return b64tob64u(hex2b64(a));
    }
    __name(hextob64u, "hextob64u");
    __name2(hextob64u, "hextob64u");
    function b64utohex(a) {
      return b64tohex(b64utob64(a));
    }
    __name(b64utohex, "b64utohex");
    __name2(b64utohex, "b64utohex");
    var utf8tob64u;
    var b64utoutf8;
    if (typeof Buffer === "function") {
      utf8tob64u = /* @__PURE__ */ __name2(function(a) {
        return b64tob64u(Buffer.from(a, "utf8").toString("base64"));
      }, "utf8tob64u");
      b64utoutf8 = /* @__PURE__ */ __name2(function(a) {
        return Buffer.from(b64utob64(a), "base64").toString("utf8");
      }, "b64utoutf8");
    } else {
      utf8tob64u = /* @__PURE__ */ __name2(function(a) {
        return hextob64u(uricmptohex(encodeURIComponentAll(a)));
      }, "utf8tob64u");
      b64utoutf8 = /* @__PURE__ */ __name2(function(a) {
        return decodeURIComponent(hextouricmp(b64utohex(a)));
      }, "b64utoutf8");
    }
    function utf8tob64(a) {
      return hex2b64(uricmptohex(encodeURIComponentAll(a)));
    }
    __name(utf8tob64, "utf8tob64");
    __name2(utf8tob64, "utf8tob64");
    function b64toutf8(a) {
      return decodeURIComponent(hextouricmp(b64tohex(a)));
    }
    __name(b64toutf8, "b64toutf8");
    __name2(b64toutf8, "b64toutf8");
    function utf8tohex(a) {
      return uricmptohex(encodeURIComponentAll(a)).toLowerCase();
    }
    __name(utf8tohex, "utf8tohex");
    __name2(utf8tohex, "utf8tohex");
    function hextoutf8(b) {
      try {
        return decodeURIComponent(hextouricmp(b));
      } catch (a) {
        return null;
      }
    }
    __name(hextoutf8, "hextoutf8");
    __name2(hextoutf8, "hextoutf8");
    function iso88591hextoutf8(a) {
      return hextoutf8(iso88591hextoutf8hex(a));
    }
    __name(iso88591hextoutf8, "iso88591hextoutf8");
    __name2(iso88591hextoutf8, "iso88591hextoutf8");
    function iso88591hextoutf8hex(e2) {
      var c = e2.match(/.{1,2}/g);
      var b = [];
      for (var d = 0; d < c.length; d++) {
        var f = parseInt(c[d], 16);
        if (161 <= f && f <= 191) {
          b.push("c2");
          b.push(c[d]);
        } else {
          if (192 <= f && f <= 255) {
            b.push("c3");
            b.push((f - 64).toString(16));
          } else {
            b.push(c[d]);
          }
        }
      }
      return b.join("");
    }
    __name(iso88591hextoutf8hex, "iso88591hextoutf8hex");
    __name2(iso88591hextoutf8hex, "iso88591hextoutf8hex");
    function hextorstr(c) {
      var b = "";
      for (var a = 0; a < c.length - 1; a += 2) {
        b += String.fromCharCode(parseInt(c.substr(a, 2), 16));
      }
      return b;
    }
    __name(hextorstr, "hextorstr");
    __name2(hextorstr, "hextorstr");
    function rstrtohex(c) {
      var a = "";
      for (var b = 0; b < c.length; b++) {
        a += ("0" + c.charCodeAt(b).toString(16)).slice(-2);
      }
      return a;
    }
    __name(rstrtohex, "rstrtohex");
    __name2(rstrtohex, "rstrtohex");
    function hextob64(a) {
      return hex2b64(a);
    }
    __name(hextob64, "hextob64");
    __name2(hextob64, "hextob64");
    function hextob64nl(a) {
      return foldnl(hextob64(a), 64);
    }
    __name(hextob64nl, "hextob64nl");
    __name2(hextob64nl, "hextob64nl");
    function foldnl(a, b) {
      a = a.replace(new RegExp("(.{" + b + "})", "g"), "$1\r\n");
      a = a.replace(/\s+$/, "");
      return a;
    }
    __name(foldnl, "foldnl");
    __name2(foldnl, "foldnl");
    function b64nltohex(b) {
      var a = b.replace(/[^0-9A-Za-z\/+=]*/g, "");
      var c = b64tohex(a);
      return c;
    }
    __name(b64nltohex, "b64nltohex");
    __name2(b64nltohex, "b64nltohex");
    function b64topem(b, a) {
      return "-----BEGIN " + a + "-----\r\n" + foldnl(b, 64) + "\r\n-----END " + a + "-----\r\n";
    }
    __name(b64topem, "b64topem");
    __name2(b64topem, "b64topem");
    function hextopem(a, b) {
      return "-----BEGIN " + b + "-----\r\n" + foldnl(hextob64(a), 64) + "\r\n-----END " + b + "-----\r\n";
    }
    __name(hextopem, "hextopem");
    __name2(hextopem, "hextopem");
    function pemtohex(a, b) {
      if (a.indexOf("-----BEGIN ") == -1) {
        throw new Error("can't find PEM header");
      }
      if (b !== void 0) {
        a = a.replace(new RegExp("^[^]*-----BEGIN " + b + "-----"), "");
        a = a.replace(new RegExp("-----END " + b + "-----[^]*$"), "");
      } else {
        a = a.replace(/^[^]*-----BEGIN [^-]+-----/, "");
        a = a.replace(/-----END [^-]+-----[^]*$/, "");
      }
      return b64nltohex(a);
    }
    __name(pemtohex, "pemtohex");
    __name2(pemtohex, "pemtohex");
    function pemtob64(a) {
      if (a.indexOf("-----BEGIN ") == -1 || a.indexOf("-----END ") == -1) {
        return null;
      }
      a = a.replace(/^[\s\S]*?-----BEGIN [^-]+-----/m, "");
      a = a.replace(/-----END [\s\S]+$/m, "");
      a = a.replace(/\s+/g, "");
      return a.match(/^[0-9a-zA-Z+/=]+$/) ? a : null;
    }
    __name(pemtob64, "pemtob64");
    __name2(pemtob64, "pemtob64");
    function hextoArrayBuffer(d) {
      if (d.length % 2 != 0) {
        throw "input is not even length";
      }
      if (d.match(/^[0-9A-Fa-f]+$/) == null) {
        throw "input is not hexadecimal";
      }
      var b = new ArrayBuffer(d.length / 2);
      var a = new DataView(b);
      for (var c = 0; c < d.length / 2; c++) {
        a.setUint8(c, parseInt(d.substr(c * 2, 2), 16));
      }
      return b;
    }
    __name(hextoArrayBuffer, "hextoArrayBuffer");
    __name2(hextoArrayBuffer, "hextoArrayBuffer");
    function ArrayBuffertohex(b) {
      var d = "";
      var a = new DataView(b);
      for (var c = 0; c < b.byteLength; c++) {
        d += ("00" + a.getUint8(c).toString(16)).slice(-2);
      }
      return d;
    }
    __name(ArrayBuffertohex, "ArrayBuffertohex");
    __name2(ArrayBuffertohex, "ArrayBuffertohex");
    function zulutomsec(n2) {
      var l, j, m, e2, f, i, b, k;
      var a, h, g, c;
      n2 = timetogen(n2);
      c = n2.match(/^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)(|\.\d+)Z$/);
      if (c) {
        l = parseInt(c[1]);
        j = parseInt(c[2]) - 1;
        m = parseInt(c[3]);
        e2 = parseInt(c[4]);
        f = parseInt(c[5]);
        i = parseInt(c[6]);
        b = 0;
        h = c[7];
        if (h !== "") {
          g = (h.substr(1) + "00").substr(0, 3);
          b = parseInt(g);
        }
        return Date.UTC(l, j, m, e2, f, i, b);
      }
      throw new Error("unsupported zulu format: " + n2);
    }
    __name(zulutomsec, "zulutomsec");
    __name2(zulutomsec, "zulutomsec");
    function msectozulu(b) {
      var h = new Date(b), i = ("0000" + h.getUTCFullYear()).slice(-4), c = ("00" + (h.getUTCMonth() + 1)).slice(-2), j = ("00" + h.getUTCDate()).slice(-2), e2 = ("00" + h.getUTCHours()).slice(-2), f = ("00" + h.getUTCMinutes()).slice(-2), g = ("00" + h.getUTCSeconds()).slice(-2), a = ("000" + h.getUTCMilliseconds()).slice(-3);
      a = a.replace(/0+$/, "");
      a = a != "" ? "." + a : a;
      return i + c + j + e2 + f + g + a + "Z";
    }
    __name(msectozulu, "msectozulu");
    __name2(msectozulu, "msectozulu");
    function zulutosec(a) {
      return Math.round(zulutomsec(a) / 1e3);
    }
    __name(zulutosec, "zulutosec");
    __name2(zulutosec, "zulutosec");
    function zulutodate(a) {
      return new Date(zulutomsec(a));
    }
    __name(zulutodate, "zulutodate");
    __name2(zulutodate, "zulutodate");
    function datetozulu(g, e2, f) {
      var b;
      var a = g.getUTCFullYear();
      if (e2) {
        if (a < 1950 || 2049 < a) {
          throw "not proper year for UTCTime: " + a;
        }
        b = ("" + a).slice(-2);
      } else {
        b = ("000" + a).slice(-4);
      }
      b += ("0" + (g.getUTCMonth() + 1)).slice(-2);
      b += ("0" + g.getUTCDate()).slice(-2);
      b += ("0" + g.getUTCHours()).slice(-2);
      b += ("0" + g.getUTCMinutes()).slice(-2);
      b += ("0" + g.getUTCSeconds()).slice(-2);
      if (f) {
        var c = g.getUTCMilliseconds();
        if (c !== 0) {
          c = ("00" + c).slice(-3);
          c = c.replace(/0+$/g, "");
          b += "." + c;
        }
      }
      b += "Z";
      return b;
    }
    __name(datetozulu, "datetozulu");
    __name2(datetozulu, "datetozulu");
    function timetogen(a) {
      if (a.match(/^[0-9]{12}Z$/) || a.match(/^[0-9]{12}[.][0-9]*Z$/)) {
        return a.match(/^[0-4]/) ? "20" + a : "19" + a;
      }
      return a;
    }
    __name(timetogen, "timetogen");
    __name2(timetogen, "timetogen");
    function uricmptohex(a) {
      return a.replace(/%/g, "");
    }
    __name(uricmptohex, "uricmptohex");
    __name2(uricmptohex, "uricmptohex");
    function hextouricmp(a) {
      return a.replace(/(..)/g, "%$1");
    }
    __name(hextouricmp, "hextouricmp");
    __name2(hextouricmp, "hextouricmp");
    function ipv6tohex(g) {
      var b = "malformed IPv6 address";
      if (!g.match(/^[0-9A-Fa-f:]+$/)) {
        throw b;
      }
      g = g.toLowerCase();
      var d = g.split(":").length - 1;
      if (d < 2) {
        throw b;
      }
      var e2 = ":".repeat(7 - d + 2);
      g = g.replace("::", e2);
      var c = g.split(":");
      if (c.length != 8) {
        throw b;
      }
      for (var f = 0; f < 8; f++) {
        c[f] = ("0000" + c[f]).slice(-4);
      }
      return c.join("");
    }
    __name(ipv6tohex, "ipv6tohex");
    __name2(ipv6tohex, "ipv6tohex");
    function hextoipv6(d) {
      if (!d.match(/^[0-9A-Fa-f]{32}$/)) {
        throw new Error("malformed IPv6 address: " + d);
      }
      d = d.toLowerCase();
      var b = d.match(/.{1,4}/g);
      b = b.map(function(a) {
        return a.replace(/^0+/, "");
      });
      b = b.map(function(a) {
        return a == "" ? "0" : a;
      });
      d = ":" + b.join(":") + ":";
      var c = d.match(/:(0:){2,}/g);
      if (c == null) {
        return d.slice(1, -1);
      }
      var e2 = c.sort().slice(-1)[0];
      d = d.replace(e2.substr(0, e2.length - 1), ":");
      if (d.substr(0, 2) != "::") {
        d = d.substr(1);
      }
      if (d.substr(-2, 2) != "::") {
        d = d.substr(0, d.length - 1);
      }
      return d;
    }
    __name(hextoipv6, "hextoipv6");
    __name2(hextoipv6, "hextoipv6");
    function hextoip(b) {
      var c = new Error("malformed hex value");
      if (!b.match(/^([0-9A-Fa-f][0-9A-Fa-f]){1,}$/)) {
        throw c;
      }
      if (b.length == 8) {
        var d;
        try {
          d = parseInt(b.substr(0, 2), 16) + "." + parseInt(b.substr(2, 2), 16) + "." + parseInt(b.substr(4, 2), 16) + "." + parseInt(b.substr(6, 2), 16);
          return d;
        } catch (a) {
          throw c;
        }
      } else {
        if (b.length == 16) {
          try {
            return hextoip(b.substr(0, 8)) + "/" + ipprefixlen(b.substr(8));
          } catch (a) {
            throw c;
          }
        } else {
          if (b.length == 32) {
            return hextoipv6(b);
          } else {
            if (b.length == 64) {
              try {
                return hextoipv6(b.substr(0, 32)) + "/" + ipprefixlen(b.substr(32));
              } catch (a) {
                throw c;
              }
              return;
            } else {
              return b;
            }
          }
        }
      }
    }
    __name(hextoip, "hextoip");
    __name2(hextoip, "hextoip");
    function ipprefixlen(c) {
      var d = new Error("malformed mask");
      var a;
      try {
        a = new BigInteger(c, 16).toString(2);
      } catch (b) {
        throw d;
      }
      if (!a.match(/^1*0*$/)) {
        throw d;
      }
      return a.replace(/0+$/, "").length;
    }
    __name(ipprefixlen, "ipprefixlen");
    __name2(ipprefixlen, "ipprefixlen");
    function iptohex(g) {
      var j = new Error("malformed IP address");
      g = g.toLowerCase(g);
      if (!g.match(/^[0-9a-f.:/]+$/)) {
        throw j;
      }
      if (g.match(/^[0-9.]+$/)) {
        var b = g.split(".");
        if (b.length !== 4) {
          throw j;
        }
        var h = "";
        try {
          for (var f = 0; f < 4; f++) {
            var k = parseInt(b[f]);
            h += ("0" + k.toString(16)).slice(-2);
          }
          return h;
        } catch (e2) {
          throw j;
        }
      } else {
        if (g.match(/^[0-9.]+\/[0-9]+$/)) {
          var c = g.split("/");
          return iptohex(c[0]) + ipnetmask(parseInt(c[1]), 32);
        } else {
          if (g.match(/^[0-9a-f:]+$/) && g.indexOf(":") !== -1) {
            return ipv6tohex(g);
          } else {
            if (g.match(/^[0-9a-f:]+\/[0-9]+$/) && g.indexOf(":") !== -1) {
              var c = g.split("/");
              return ipv6tohex(c[0]) + ipnetmask(parseInt(c[1]), 128);
            } else {
              throw j;
            }
          }
        }
      }
    }
    __name(iptohex, "iptohex");
    __name2(iptohex, "iptohex");
    function ipnetmask(d, c) {
      if (c == 32 && d == 0) {
        return "00000000";
      }
      if (c == 128 && d == 0) {
        return "00000000000000000000000000000000";
      }
      var a = Array(d + 1).join("1") + Array(c - d + 1).join("0");
      return new BigInteger(a, 2).toString(16);
    }
    __name(ipnetmask, "ipnetmask");
    __name2(ipnetmask, "ipnetmask");
    function ucs2hextoutf8(d) {
      function e2(f) {
        var h = parseInt(f.substr(0, 2), 16);
        var a = parseInt(f.substr(2), 16);
        if (h == 0 & a < 128) {
          return String.fromCharCode(a);
        }
        if (h < 8) {
          var j = 192 | (h & 7) << 3 | (a & 192) >> 6;
          var i = 128 | a & 63;
          return hextoutf8(j.toString(16) + i.toString(16));
        }
        var j = 224 | (h & 240) >> 4;
        var i = 128 | (h & 15) << 2 | (a & 192) >> 6;
        var g = 128 | a & 63;
        return hextoutf8(j.toString(16) + i.toString(16) + g.toString(16));
      }
      __name(e2, "e2");
      __name2(e2, "e2");
      var c = d.match(/.{4}/g);
      var b = c.map(e2);
      return b.join("");
    }
    __name(ucs2hextoutf8, "ucs2hextoutf8");
    __name2(ucs2hextoutf8, "ucs2hextoutf8");
    function encodeURIComponentAll(a) {
      var d = encodeURIComponent(a);
      var b = "";
      for (var c = 0; c < d.length; c++) {
        if (d[c] == "%") {
          b = b + d.substr(c, 3);
          c = c + 2;
        } else {
          b = b + "%" + stohex(d[c]);
        }
      }
      return b;
    }
    __name(encodeURIComponentAll, "encodeURIComponentAll");
    __name2(encodeURIComponentAll, "encodeURIComponentAll");
    function newline_toUnix(a) {
      a = a.replace(/\r\n/mg, "\n");
      return a;
    }
    __name(newline_toUnix, "newline_toUnix");
    __name2(newline_toUnix, "newline_toUnix");
    function newline_toDos(a) {
      a = a.replace(/\r\n/mg, "\n");
      a = a.replace(/\n/mg, "\r\n");
      return a;
    }
    __name(newline_toDos, "newline_toDos");
    __name2(newline_toDos, "newline_toDos");
    KJUR.lang.String.isInteger = function(a) {
      if (a.match(/^[0-9]+$/)) {
        return true;
      } else {
        if (a.match(/^-[0-9]+$/)) {
          return true;
        } else {
          return false;
        }
      }
    };
    KJUR.lang.String.isHex = function(a) {
      return ishex(a);
    };
    function ishex(a) {
      if (a.length % 2 == 0 && (a.match(/^[0-9a-f]+$/) || a.match(/^[0-9A-F]+$/))) {
        return true;
      } else {
        return false;
      }
    }
    __name(ishex, "ishex");
    __name2(ishex, "ishex");
    KJUR.lang.String.isBase64 = function(a) {
      a = a.replace(/\s+/g, "");
      if (a.match(/^[0-9A-Za-z+\/]+={0,3}$/) && a.length % 4 == 0) {
        return true;
      } else {
        return false;
      }
    };
    KJUR.lang.String.isBase64URL = function(a) {
      if (a.match(/[+/=]/)) {
        return false;
      }
      a = b64utob64(a);
      return KJUR.lang.String.isBase64(a);
    };
    function isBase64URLDot(a) {
      if (a.match(/^[0-9A-Za-z-_.]+$/)) {
        return true;
      }
      return false;
    }
    __name(isBase64URLDot, "isBase64URLDot");
    __name2(isBase64URLDot, "isBase64URLDot");
    KJUR.lang.String.isIntegerArray = function(a) {
      a = a.replace(/\s+/g, "");
      if (a.match(/^\[[0-9,]+\]$/)) {
        return true;
      } else {
        return false;
      }
    };
    KJUR.lang.String.isPrintable = function(a) {
      if (a.match(/^[0-9A-Za-z '()+,-./:=?]*$/) !== null) {
        return true;
      }
      return false;
    };
    KJUR.lang.String.isIA5 = function(a) {
      if (a.match(/^[\x20-\x21\x23-\x7f]*$/) !== null) {
        return true;
      }
      return false;
    };
    KJUR.lang.String.isMail = function(a) {
      if (a.match(/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/) !== null) {
        return true;
      }
      return false;
    };
    function hextoposhex(a) {
      if (a.length % 2 == 1) {
        return "0" + a;
      }
      if (a.substr(0, 1) > "7") {
        return "00" + a;
      }
      return a;
    }
    __name(hextoposhex, "hextoposhex");
    __name2(hextoposhex, "hextoposhex");
    function intarystrtohex(b) {
      b = b.replace(/^\s*\[\s*/, "");
      b = b.replace(/\s*\]\s*$/, "");
      b = b.replace(/\s*/g, "");
      try {
        var c = b.split(/,/).map(function(g, e2, h) {
          var f = parseInt(g);
          if (f < 0 || 255 < f) {
            throw "integer not in range 0-255";
          }
          var d = ("00" + f.toString(16)).slice(-2);
          return d;
        }).join("");
        return c;
      } catch (a) {
        throw "malformed integer array string: " + a;
      }
    }
    __name(intarystrtohex, "intarystrtohex");
    __name2(intarystrtohex, "intarystrtohex");
    var strdiffidx = /* @__PURE__ */ __name2(function(c, a) {
      var d = c.length;
      if (c.length > a.length) {
        d = a.length;
      }
      for (var b = 0; b < d; b++) {
        if (c.charCodeAt(b) != a.charCodeAt(b)) {
          return b;
        }
      }
      if (c.length != a.length) {
        return d;
      }
      return -1;
    }, "strdiffidx");
    function oidtohex(g) {
      var f = /* @__PURE__ */ __name2(function(a) {
        var l = a.toString(16);
        if (l.length == 1) {
          l = "0" + l;
        }
        return l;
      }, "f");
      var e2 = /* @__PURE__ */ __name2(function(p) {
        var o2 = "";
        var l = parseInt(p, 10);
        var a = l.toString(2);
        var m = 7 - a.length % 7;
        if (m == 7) {
          m = 0;
        }
        var r2 = "";
        for (var n2 = 0; n2 < m; n2++) {
          r2 += "0";
        }
        a = r2 + a;
        for (var n2 = 0; n2 < a.length - 1; n2 += 7) {
          var q = a.substr(n2, 7);
          if (n2 != a.length - 7) {
            q = "1" + q;
          }
          o2 += f(parseInt(q, 2));
        }
        return o2;
      }, "e2");
      try {
        if (!g.match(/^[0-9.]+$/)) {
          return null;
        }
        var j = "";
        var b = g.split(".");
        var k = parseInt(b[0], 10) * 40 + parseInt(b[1], 10);
        j += f(k);
        b.splice(0, 2);
        for (var d = 0; d < b.length; d++) {
          j += e2(b[d]);
        }
        return j;
      } catch (c) {
        return null;
      }
    }
    __name(oidtohex, "oidtohex");
    __name2(oidtohex, "oidtohex");
    function hextooid(g) {
      if (!ishex(g)) {
        return null;
      }
      try {
        var m = [];
        var p = g.substr(0, 2);
        var e2 = parseInt(p, 16);
        m[0] = new String(Math.floor(e2 / 40));
        m[1] = new String(e2 % 40);
        var n2 = g.substr(2);
        var l = [];
        for (var f = 0; f < n2.length / 2; f++) {
          l.push(parseInt(n2.substr(f * 2, 2), 16));
        }
        var k = [];
        var d = "";
        for (var f = 0; f < l.length; f++) {
          if (l[f] & 128) {
            d = d + strpad((l[f] & 127).toString(2), 7);
          } else {
            d = d + strpad((l[f] & 127).toString(2), 7);
            k.push(new String(parseInt(d, 2)));
            d = "";
          }
        }
        var o2 = m.join(".");
        if (k.length > 0) {
          o2 = o2 + "." + k.join(".");
        }
        return o2;
      } catch (j) {
        return null;
      }
    }
    __name(hextooid, "hextooid");
    __name2(hextooid, "hextooid");
    function inttohex(b) {
      var a = new BigInteger(String(b), 10);
      return twoscompl(a);
    }
    __name(inttohex, "inttohex");
    __name2(inttohex, "inttohex");
    function twoscompl(b) {
      var g = b.toString(16);
      if (g.substr(0, 1) != "-") {
        if (g.length % 2 == 1) {
          g = "0" + g;
        } else {
          if (!g.match(/^[0-7]/)) {
            g = "00" + g;
          }
        }
        return g;
      }
      var a = g.substr(1);
      var f = a.length;
      if (f % 2 == 1) {
        f += 1;
      } else {
        if (!g.match(/^[0-7]/)) {
          f += 2;
        }
      }
      var j = "";
      for (var e2 = 0; e2 < f; e2++) {
        j += "f";
      }
      var d = new BigInteger(j, 16);
      var c = d.xor(b).add(BigInteger.ONE);
      g = c.toString(16).replace(/^-/, "");
      return g;
    }
    __name(twoscompl, "twoscompl");
    __name2(twoscompl, "twoscompl");
    var strpad = /* @__PURE__ */ __name2(function(c, b, a) {
      if (a == void 0) {
        a = "0";
      }
      if (c.length >= b) {
        return c;
      }
      return new Array(b - c.length + 1).join(a) + c;
    }, "strpad");
    function bitstrtoint(e2) {
      if (e2.length % 2 != 0) {
        return -1;
      }
      e2 = e2.toLowerCase();
      if (e2.match(/^[0-9a-f]+$/) == null) {
        return -1;
      }
      try {
        var a = e2.substr(0, 2);
        if (a == "00") {
          return parseInt(e2.substr(2), 16);
        }
        var b = parseInt(a, 16);
        if (b > 7) {
          return -1;
        }
        var g = e2.substr(2);
        var d = parseInt(g, 16).toString(2);
        if (d == "0") {
          d = "00000000";
        }
        d = d.slice(0, 0 - b);
        var f = parseInt(d, 2);
        if (f == NaN) {
          return -1;
        }
        return f;
      } catch (c) {
        return -1;
      }
    }
    __name(bitstrtoint, "bitstrtoint");
    __name2(bitstrtoint, "bitstrtoint");
    function inttobitstr(e2) {
      if (typeof e2 != "number") {
        return null;
      }
      if (e2 < 0) {
        return null;
      }
      var c = Number(e2).toString(2);
      var b = 8 - c.length % 8;
      if (b == 8) {
        b = 0;
      }
      c = c + strpad("", b, "0");
      var d = parseInt(c, 2).toString(16);
      if (d.length % 2 == 1) {
        d = "0" + d;
      }
      var a = "0" + b;
      return a + d;
    }
    __name(inttobitstr, "inttobitstr");
    __name2(inttobitstr, "inttobitstr");
    function bitstrtobinstr(g) {
      if (typeof g != "string") {
        return null;
      }
      if (g.length % 2 != 0) {
        return null;
      }
      if (!g.match(/^[0-9a-f]+$/)) {
        return null;
      }
      try {
        var c = parseInt(g.substr(0, 2), 16);
        if (c < 0 || 7 < c) {
          return null;
        }
        var j = g.substr(2);
        var f = "";
        for (var e2 = 0; e2 < j.length; e2 += 2) {
          var b = j.substr(e2, 2);
          var a = parseInt(b, 16).toString(2);
          a = ("0000000" + a).slice(-8);
          f += a;
        }
        return f.substr(0, f.length - c);
      } catch (d) {
        return null;
      }
    }
    __name(bitstrtobinstr, "bitstrtobinstr");
    __name2(bitstrtobinstr, "bitstrtobinstr");
    function binstrtobitstr(b) {
      if (typeof b != "string") {
        return null;
      }
      if (b.match(/^[01]+$/) == null) {
        return null;
      }
      try {
        var c = parseInt(b, 2);
        return inttobitstr(c);
      } catch (a) {
        return null;
      }
    }
    __name(binstrtobitstr, "binstrtobitstr");
    __name2(binstrtobitstr, "binstrtobitstr");
    function namearraytobinstr(e2, g) {
      var f = 0;
      for (var a = 0; a < e2.length; a++) {
        f |= 1 << g[e2[a]];
      }
      var b = f.toString(2);
      var c = "";
      for (var a = b.length - 1; a >= 0; a--) {
        c += b[a];
      }
      return c;
    }
    __name(namearraytobinstr, "namearraytobinstr");
    __name2(namearraytobinstr, "namearraytobinstr");
    function aryval(e2, c, d) {
      if (typeof e2 != "object") {
        return void 0;
      }
      var c = String(c).split(".");
      for (var b = 0; b < c.length && e2; b++) {
        var a = c[b];
        if (a.match(/^[0-9]+$/)) {
          a = parseInt(a);
        }
        e2 = e2[a];
      }
      return e2 || e2 === false ? e2 : d;
    }
    __name(aryval, "aryval");
    __name2(aryval, "aryval");
    function extendClass(c, a) {
      var b = /* @__PURE__ */ __name2(function() {
      }, "b");
      b.prototype = a.prototype;
      c.prototype = new b();
      c.prototype.constructor = c;
      c.superclass = a.prototype;
      if (a.prototype.constructor == Object.prototype.constructor) {
        a.prototype.constructor = a;
      }
    }
    __name(extendClass, "extendClass");
    __name2(extendClass, "extendClass");
    if (typeof KJUR == "undefined" || !KJUR) {
      KJUR = {};
    }
    if (typeof KJUR.crypto == "undefined" || !KJUR.crypto) {
      KJUR.crypto = {};
    }
    KJUR.crypto.Util = new function() {
      this.DIGESTINFOHEAD = { sha1: "3021300906052b0e03021a05000414", sha224: "302d300d06096086480165030402040500041c", sha256: "3031300d060960864801650304020105000420", sha384: "3041300d060960864801650304020205000430", sha512: "3051300d060960864801650304020305000440", md2: "3020300c06082a864886f70d020205000410", md5: "3020300c06082a864886f70d020505000410", ripemd160: "3021300906052b2403020105000414" };
      this.DEFAULTPROVIDER = { md5: "cryptojs", sha1: "cryptojs", sha224: "cryptojs", sha256: "cryptojs", sha384: "cryptojs", sha512: "cryptojs", ripemd160: "cryptojs", hmacmd5: "cryptojs", hmacsha1: "cryptojs", hmacsha224: "cryptojs", hmacsha256: "cryptojs", hmacsha384: "cryptojs", hmacsha512: "cryptojs", hmacripemd160: "cryptojs", MD5withRSA: "cryptojs/jsrsa", SHA1withRSA: "cryptojs/jsrsa", SHA224withRSA: "cryptojs/jsrsa", SHA256withRSA: "cryptojs/jsrsa", SHA384withRSA: "cryptojs/jsrsa", SHA512withRSA: "cryptojs/jsrsa", RIPEMD160withRSA: "cryptojs/jsrsa", MD5withECDSA: "cryptojs/jsrsa", SHA1withECDSA: "cryptojs/jsrsa", SHA224withECDSA: "cryptojs/jsrsa", SHA256withECDSA: "cryptojs/jsrsa", SHA384withECDSA: "cryptojs/jsrsa", SHA512withECDSA: "cryptojs/jsrsa", RIPEMD160withECDSA: "cryptojs/jsrsa", SHA1withDSA: "cryptojs/jsrsa", SHA224withDSA: "cryptojs/jsrsa", SHA256withDSA: "cryptojs/jsrsa", MD5withRSAandMGF1: "cryptojs/jsrsa", SHAwithRSAandMGF1: "cryptojs/jsrsa", SHA1withRSAandMGF1: "cryptojs/jsrsa", SHA224withRSAandMGF1: "cryptojs/jsrsa", SHA256withRSAandMGF1: "cryptojs/jsrsa", SHA384withRSAandMGF1: "cryptojs/jsrsa", SHA512withRSAandMGF1: "cryptojs/jsrsa", RIPEMD160withRSAandMGF1: "cryptojs/jsrsa" };
      this.CRYPTOJSMESSAGEDIGESTNAME = { md5: CryptoJS.algo.MD5, sha1: CryptoJS.algo.SHA1, sha224: CryptoJS.algo.SHA224, sha256: CryptoJS.algo.SHA256, sha384: CryptoJS.algo.SHA384, sha512: CryptoJS.algo.SHA512, ripemd160: CryptoJS.algo.RIPEMD160 };
      this.getDigestInfoHex = function(a, b) {
        if (typeof this.DIGESTINFOHEAD[b] == "undefined") {
          throw "alg not supported in Util.DIGESTINFOHEAD: " + b;
        }
        return this.DIGESTINFOHEAD[b] + a;
      };
      this.getPaddedDigestInfoHex = function(h, a, j) {
        var c = this.getDigestInfoHex(h, a);
        var d = j / 4;
        if (c.length + 22 > d) {
          throw "key is too short for SigAlg: keylen=" + j + "," + a;
        }
        var b = "0001";
        var k = "00" + c;
        var g = "";
        var l = d - b.length - k.length;
        for (var f = 0; f < l; f += 2) {
          g += "ff";
        }
        var e2 = b + g + k;
        return e2;
      };
      this.hashString = function(a, c) {
        var b = new KJUR.crypto.MessageDigest({ alg: c });
        return b.digestString(a);
      };
      this.hashHex = function(b, c) {
        var a = new KJUR.crypto.MessageDigest({ alg: c });
        return a.digestHex(b);
      };
      this.sha1 = function(a) {
        return this.hashString(a, "sha1");
      };
      this.sha256 = function(a) {
        return this.hashString(a, "sha256");
      };
      this.sha256Hex = function(a) {
        return this.hashHex(a, "sha256");
      };
      this.sha512 = function(a) {
        return this.hashString(a, "sha512");
      };
      this.sha512Hex = function(a) {
        return this.hashHex(a, "sha512");
      };
      this.isKey = function(a) {
        if (a instanceof RSAKey || a instanceof KJUR.crypto.DSA || a instanceof KJUR.crypto.ECDSA) {
          return true;
        } else {
          return false;
        }
      };
    }();
    KJUR.crypto.Util.md5 = function(a) {
      var b = new KJUR.crypto.MessageDigest({ alg: "md5", prov: "cryptojs" });
      return b.digestString(a);
    };
    KJUR.crypto.Util.ripemd160 = function(a) {
      var b = new KJUR.crypto.MessageDigest({ alg: "ripemd160", prov: "cryptojs" });
      return b.digestString(a);
    };
    KJUR.crypto.Util.SECURERANDOMGEN = new SecureRandom();
    KJUR.crypto.Util.getRandomHexOfNbytes = function(b) {
      var a = new Array(b);
      KJUR.crypto.Util.SECURERANDOMGEN.nextBytes(a);
      return BAtohex(a);
    };
    KJUR.crypto.Util.getRandomBigIntegerOfNbytes = function(a) {
      return new BigInteger(KJUR.crypto.Util.getRandomHexOfNbytes(a), 16);
    };
    KJUR.crypto.Util.getRandomHexOfNbits = function(d) {
      var c = d % 8;
      var a = (d - c) / 8;
      var b = new Array(a + 1);
      KJUR.crypto.Util.SECURERANDOMGEN.nextBytes(b);
      b[0] = (255 << c & 255 ^ 255) & b[0];
      return BAtohex(b);
    };
    KJUR.crypto.Util.getRandomBigIntegerOfNbits = function(a) {
      return new BigInteger(KJUR.crypto.Util.getRandomHexOfNbits(a), 16);
    };
    KJUR.crypto.Util.getRandomBigIntegerZeroToMax = function(b) {
      var a = b.bitLength();
      while (1) {
        var c = KJUR.crypto.Util.getRandomBigIntegerOfNbits(a);
        if (b.compareTo(c) >= 0) {
          return c;
        }
      }
    };
    KJUR.crypto.Util.getRandomBigIntegerMinToMax = function(e2, b) {
      var c = e2.compareTo(b);
      if (c > 0) {
        throw "biMin is greater than biMax";
      }
      if (c == 0) {
        return e2;
      }
      var a = b.subtract(e2);
      var d = KJUR.crypto.Util.getRandomBigIntegerZeroToMax(a);
      return d.add(e2);
    };
    KJUR.crypto.MessageDigest = function(c) {
      var b = null;
      var a = null;
      var d = null;
      this.setAlgAndProvider = function(g, f) {
        g = KJUR.crypto.MessageDigest.getCanonicalAlgName(g);
        if (g !== null && f === void 0) {
          f = KJUR.crypto.Util.DEFAULTPROVIDER[g];
        }
        if (":md5:sha1:sha224:sha256:sha384:sha512:ripemd160:".indexOf(g) != -1 && f == "cryptojs") {
          try {
            this.md = KJUR.crypto.Util.CRYPTOJSMESSAGEDIGESTNAME[g].create();
          } catch (e2) {
            throw "setAlgAndProvider hash alg set fail alg=" + g + "/" + e2;
          }
          this.updateString = function(h) {
            this.md.update(h);
          };
          this.updateHex = function(h) {
            var i = CryptoJS.enc.Hex.parse(h);
            this.md.update(i);
          };
          this.digest = function() {
            var h = this.md.finalize();
            return h.toString(CryptoJS.enc.Hex);
          };
          this.digestString = function(h) {
            this.updateString(h);
            return this.digest();
          };
          this.digestHex = function(h) {
            this.updateHex(h);
            return this.digest();
          };
        }
        if (":sha256:".indexOf(g) != -1 && f == "sjcl") {
          try {
            this.md = new sjcl.hash.sha256();
          } catch (e2) {
            throw "setAlgAndProvider hash alg set fail alg=" + g + "/" + e2;
          }
          this.updateString = function(h) {
            this.md.update(h);
          };
          this.updateHex = function(i) {
            var h = sjcl.codec.hex.toBits(i);
            this.md.update(h);
          };
          this.digest = function() {
            var h = this.md.finalize();
            return sjcl.codec.hex.fromBits(h);
          };
          this.digestString = function(h) {
            this.updateString(h);
            return this.digest();
          };
          this.digestHex = function(h) {
            this.updateHex(h);
            return this.digest();
          };
        }
      };
      this.updateString = function(e2) {
        throw "updateString(str) not supported for this alg/prov: " + this.algName + "/" + this.provName;
      };
      this.updateHex = function(e2) {
        throw "updateHex(hex) not supported for this alg/prov: " + this.algName + "/" + this.provName;
      };
      this.digest = function() {
        throw "digest() not supported for this alg/prov: " + this.algName + "/" + this.provName;
      };
      this.digestString = function(e2) {
        throw "digestString(str) not supported for this alg/prov: " + this.algName + "/" + this.provName;
      };
      this.digestHex = function(e2) {
        throw "digestHex(hex) not supported for this alg/prov: " + this.algName + "/" + this.provName;
      };
      if (c !== void 0) {
        if (c.alg !== void 0) {
          this.algName = c.alg;
          if (c.prov === void 0) {
            this.provName = KJUR.crypto.Util.DEFAULTPROVIDER[this.algName];
          }
          this.setAlgAndProvider(this.algName, this.provName);
        }
      }
    };
    KJUR.crypto.MessageDigest.getCanonicalAlgName = function(a) {
      if (typeof a === "string") {
        a = a.toLowerCase();
        a = a.replace(/-/, "");
      }
      return a;
    };
    KJUR.crypto.MessageDigest.getHashLength = function(c) {
      var b = KJUR.crypto.MessageDigest;
      var a = b.getCanonicalAlgName(c);
      if (b.HASHLENGTH[a] === void 0) {
        throw "not supported algorithm: " + c;
      }
      return b.HASHLENGTH[a];
    };
    KJUR.crypto.MessageDigest.HASHLENGTH = { md5: 16, sha1: 20, sha224: 28, sha256: 32, sha384: 48, sha512: 64, ripemd160: 20 };
    KJUR.crypto.Mac = function(d) {
      var f = null;
      var c = null;
      var a = null;
      var e2 = null;
      var b = null;
      this.setAlgAndProvider = function(k, i) {
        k = k.toLowerCase();
        if (k == null) {
          k = "hmacsha1";
        }
        k = k.toLowerCase();
        if (k.substr(0, 4) != "hmac") {
          throw "setAlgAndProvider unsupported HMAC alg: " + k;
        }
        if (i === void 0) {
          i = KJUR.crypto.Util.DEFAULTPROVIDER[k];
        }
        this.algProv = k + "/" + i;
        var g = k.substr(4);
        if (":md5:sha1:sha224:sha256:sha384:sha512:ripemd160:".indexOf(g) != -1 && i == "cryptojs") {
          try {
            var j = KJUR.crypto.Util.CRYPTOJSMESSAGEDIGESTNAME[g];
            this.mac = CryptoJS.algo.HMAC.create(j, this.pass);
          } catch (h) {
            throw "setAlgAndProvider hash alg set fail hashAlg=" + g + "/" + h;
          }
          this.updateString = function(l) {
            this.mac.update(l);
          };
          this.updateHex = function(l) {
            var m = CryptoJS.enc.Hex.parse(l);
            this.mac.update(m);
          };
          this.doFinal = function() {
            var l = this.mac.finalize();
            return l.toString(CryptoJS.enc.Hex);
          };
          this.doFinalString = function(l) {
            this.updateString(l);
            return this.doFinal();
          };
          this.doFinalHex = function(l) {
            this.updateHex(l);
            return this.doFinal();
          };
        }
      };
      this.updateString = function(g) {
        throw "updateString(str) not supported for this alg/prov: " + this.algProv;
      };
      this.updateHex = function(g) {
        throw "updateHex(hex) not supported for this alg/prov: " + this.algProv;
      };
      this.doFinal = function() {
        throw "digest() not supported for this alg/prov: " + this.algProv;
      };
      this.doFinalString = function(g) {
        throw "digestString(str) not supported for this alg/prov: " + this.algProv;
      };
      this.doFinalHex = function(g) {
        throw "digestHex(hex) not supported for this alg/prov: " + this.algProv;
      };
      this.setPassword = function(h) {
        if (typeof h == "string") {
          var g = h;
          if (h.length % 2 == 1 || !h.match(/^[0-9A-Fa-f]+$/)) {
            g = rstrtohex(h);
          }
          this.pass = CryptoJS.enc.Hex.parse(g);
          return;
        }
        if (typeof h != "object") {
          throw "KJUR.crypto.Mac unsupported password type: " + h;
        }
        var g = null;
        if (h.hex !== void 0) {
          if (h.hex.length % 2 != 0 || !h.hex.match(/^[0-9A-Fa-f]+$/)) {
            throw "Mac: wrong hex password: " + h.hex;
          }
          g = h.hex;
        }
        if (h.utf8 !== void 0) {
          g = utf8tohex(h.utf8);
        }
        if (h.rstr !== void 0) {
          g = rstrtohex(h.rstr);
        }
        if (h.b64 !== void 0) {
          g = b64tohex(h.b64);
        }
        if (h.b64u !== void 0) {
          g = b64utohex(h.b64u);
        }
        if (g == null) {
          throw "KJUR.crypto.Mac unsupported password type: " + h;
        }
        this.pass = CryptoJS.enc.Hex.parse(g);
      };
      if (d !== void 0) {
        if (d.pass !== void 0) {
          this.setPassword(d.pass);
        }
        if (d.alg !== void 0) {
          this.algName = d.alg;
          if (d.prov === void 0) {
            this.provName = KJUR.crypto.Util.DEFAULTPROVIDER[this.algName];
          }
          this.setAlgAndProvider(this.algName, this.provName);
        }
      }
    };
    KJUR.crypto.Signature = function(o2) {
      var q = null;
      var n2 = null;
      var r2 = null;
      var c = null;
      var l = null;
      var d = null;
      var k = null;
      var h = null;
      var p = null;
      var e2 = null;
      var b = -1;
      var g = null;
      var j = null;
      var a = null;
      var i = null;
      var f = null;
      this._setAlgNames = function() {
        var s = this.algName.match(/^(.+)with(.+)$/);
        if (s) {
          this.mdAlgName = s[1].toLowerCase();
          this.pubkeyAlgName = s[2].toLowerCase();
          if (this.pubkeyAlgName == "rsaandmgf1" && this.mdAlgName == "sha") {
            this.mdAlgName = "sha1";
          }
        }
      };
      this._zeroPaddingOfSignature = function(x, w) {
        var v = "";
        var t3 = w / 4 - x.length;
        for (var u = 0; u < t3; u++) {
          v = v + "0";
        }
        return v + x;
      };
      this.setAlgAndProvider = function(u, t3) {
        this._setAlgNames();
        if (t3 != "cryptojs/jsrsa") {
          throw new Error("provider not supported: " + t3);
        }
        if (":md5:sha1:sha224:sha256:sha384:sha512:ripemd160:".indexOf(this.mdAlgName) != -1) {
          try {
            this.md = new KJUR.crypto.MessageDigest({ alg: this.mdAlgName });
          } catch (s) {
            throw new Error("setAlgAndProvider hash alg set fail alg=" + this.mdAlgName + "/" + s);
          }
          this.init = function(w, x) {
            var y = null;
            try {
              if (x === void 0) {
                y = KEYUTIL.getKey(w);
              } else {
                y = KEYUTIL.getKey(w, x);
              }
            } catch (v) {
              throw "init failed:" + v;
            }
            if (y.isPrivate === true) {
              this.prvKey = y;
              this.state = "SIGN";
            } else {
              if (y.isPublic === true) {
                this.pubKey = y;
                this.state = "VERIFY";
              } else {
                throw "init failed.:" + y;
              }
            }
          };
          this.updateString = function(v) {
            this.md.updateString(v);
          };
          this.updateHex = function(v) {
            this.md.updateHex(v);
          };
          this.sign = function() {
            this.sHashHex = this.md.digest();
            if (this.prvKey === void 0 && this.ecprvhex !== void 0 && this.eccurvename !== void 0 && KJUR.crypto.ECDSA !== void 0) {
              this.prvKey = new KJUR.crypto.ECDSA({ curve: this.eccurvename, prv: this.ecprvhex });
            }
            if (this.prvKey instanceof RSAKey && this.pubkeyAlgName === "rsaandmgf1") {
              this.hSign = this.prvKey.signWithMessageHashPSS(this.sHashHex, this.mdAlgName, this.pssSaltLen);
            } else {
              if (this.prvKey instanceof RSAKey && this.pubkeyAlgName === "rsa") {
                this.hSign = this.prvKey.signWithMessageHash(this.sHashHex, this.mdAlgName);
              } else {
                if (this.prvKey instanceof KJUR.crypto.ECDSA) {
                  this.hSign = this.prvKey.signWithMessageHash(this.sHashHex);
                } else {
                  if (this.prvKey instanceof KJUR.crypto.DSA) {
                    this.hSign = this.prvKey.signWithMessageHash(this.sHashHex);
                  } else {
                    throw "Signature: unsupported private key alg: " + this.pubkeyAlgName;
                  }
                }
              }
            }
            return this.hSign;
          };
          this.signString = function(v) {
            this.updateString(v);
            return this.sign();
          };
          this.signHex = function(v) {
            this.updateHex(v);
            return this.sign();
          };
          this.verify = function(v) {
            this.sHashHex = this.md.digest();
            if (this.pubKey === void 0 && this.ecpubhex !== void 0 && this.eccurvename !== void 0 && KJUR.crypto.ECDSA !== void 0) {
              this.pubKey = new KJUR.crypto.ECDSA({ curve: this.eccurvename, pub: this.ecpubhex });
            }
            if (this.pubKey instanceof RSAKey && this.pubkeyAlgName === "rsaandmgf1") {
              return this.pubKey.verifyWithMessageHashPSS(this.sHashHex, v, this.mdAlgName, this.pssSaltLen);
            } else {
              if (this.pubKey instanceof RSAKey && this.pubkeyAlgName === "rsa") {
                return this.pubKey.verifyWithMessageHash(this.sHashHex, v);
              } else {
                if (KJUR.crypto.ECDSA !== void 0 && this.pubKey instanceof KJUR.crypto.ECDSA) {
                  return this.pubKey.verifyWithMessageHash(this.sHashHex, v);
                } else {
                  if (KJUR.crypto.DSA !== void 0 && this.pubKey instanceof KJUR.crypto.DSA) {
                    return this.pubKey.verifyWithMessageHash(this.sHashHex, v);
                  } else {
                    throw "Signature: unsupported public key alg: " + this.pubkeyAlgName;
                  }
                }
              }
            }
          };
        }
      };
      this.init = function(s, t3) {
        throw "init(key, pass) not supported for this alg:prov=" + this.algProvName;
      };
      this.updateString = function(s) {
        throw "updateString(str) not supported for this alg:prov=" + this.algProvName;
      };
      this.updateHex = function(s) {
        throw "updateHex(hex) not supported for this alg:prov=" + this.algProvName;
      };
      this.sign = function() {
        throw "sign() not supported for this alg:prov=" + this.algProvName;
      };
      this.signString = function(s) {
        throw "digestString(str) not supported for this alg:prov=" + this.algProvName;
      };
      this.signHex = function(s) {
        throw "digestHex(hex) not supported for this alg:prov=" + this.algProvName;
      };
      this.verify = function(s) {
        throw "verify(hSigVal) not supported for this alg:prov=" + this.algProvName;
      };
      this.initParams = o2;
      if (o2 !== void 0) {
        if (o2.alg !== void 0) {
          this.algName = o2.alg;
          if (o2.prov === void 0) {
            this.provName = KJUR.crypto.Util.DEFAULTPROVIDER[this.algName];
          } else {
            this.provName = o2.prov;
          }
          this.algProvName = this.algName + ":" + this.provName;
          this.setAlgAndProvider(this.algName, this.provName);
          this._setAlgNames();
        }
        if (o2.psssaltlen !== void 0) {
          this.pssSaltLen = o2.psssaltlen;
        }
        if (o2.prvkeypem !== void 0) {
          if (o2.prvkeypas !== void 0) {
            throw "both prvkeypem and prvkeypas parameters not supported";
          } else {
            try {
              var q = KEYUTIL.getKey(o2.prvkeypem);
              this.init(q);
            } catch (m) {
              throw "fatal error to load pem private key: " + m;
            }
          }
        }
      }
    };
    KJUR.crypto.Cipher = function(a) {
    };
    KJUR.crypto.Cipher.encrypt = function(j, i, b, c) {
      if (aryval(c, "enclag") != void 0) {
        b = c.encalg;
      }
      if (typeof b == "string" && b.substr(-4) == "-CBC") {
        var g = i;
        var e2 = j;
        if (aryval(c, "key") != void 0) {
          g = c.key;
        }
        if (aryval(c, "enc") != void 0) {
          hEnc = c.enc;
        }
        var h = CryptoJS.enc.Hex.parse(g);
        var a = CryptoJS.enc.Hex.parse(e2);
        var f = CryptoJS.enc.Hex.parse(c.iv);
        var d;
        if (b == "des-EDE3-CBC") {
          d = CryptoJS.TripleDES.encrypt(a, h, { iv: f });
        } else {
          if (b == "aes128-CBC" || b == "aes256-CBC") {
            d = CryptoJS.AES.encrypt(a, h, { iv: f });
          } else {
            throw new Error("unsupported algorithm: " + b);
          }
        }
        return d + "";
      } else {
        throw new Error("Cipher.encrypt: unsupported key or algorithm");
      }
    };
    KJUR.crypto.Cipher.decrypt = function(c, j, a, b) {
      if (aryval(b, "enclag") != void 0) {
        a = b.encalg;
      }
      if (typeof a == "string" && a.substr(-4) == "-CBC") {
        var h = j;
        var e2 = c;
        if (aryval(b, "key") != void 0) {
          h = b.key;
        }
        if (aryval(b, "enc") != void 0) {
          e2 = b.enc;
        }
        var i = CryptoJS.enc.Hex.parse(h);
        var f = CryptoJS.enc.Hex.parse(e2);
        var g = CryptoJS.enc.Hex.parse(b.iv);
        var d;
        if (a == "des-EDE3-CBC") {
          d = CryptoJS.TripleDES.decrypt({ ciphertext: f }, i, { iv: g });
        } else {
          if (a == "aes128-CBC" || a == "aes256-CBC") {
            d = CryptoJS.AES.decrypt({ ciphertext: f }, i, { iv: g });
          } else {
            throw new Error("unsupported algorithm: " + a);
          }
        }
        return CryptoJS.enc.Hex.stringify(d);
      } else {
        throw new Error("Cipher.decrypt: unsupported key or algorithm");
      }
    };
    KJUR.crypto.OID = new function() {
      this.oidhex2name = { "2a864886f70d010101": "rsaEncryption", "2a8648ce3d0201": "ecPublicKey", "2a8648ce380401": "dsa", "2a8648ce3d030107": "secp256r1", "2b8104001f": "secp192k1", "2b81040021": "secp224r1", "2b8104000a": "secp256k1", "2b81040022": "secp384r1", "2b81040023": "secp521r1", "2a8648ce380403": "SHA1withDSA", "608648016503040301": "SHA224withDSA", "608648016503040302": "SHA256withDSA" };
    }();
    if (typeof KJUR == "undefined" || !KJUR) {
      KJUR = {};
    }
    if (typeof KJUR.crypto == "undefined" || !KJUR.crypto) {
      KJUR.crypto = {};
    }
    KJUR.crypto.ECDSA = function(e2) {
      var g = "secp256r1";
      var p = null;
      var b = null;
      var i = null;
      var j = Error, f = BigInteger, h = ECPointFp, m = KJUR.crypto.ECDSA, c = KJUR.crypto.ECParameterDB, d = m.getName, q = ASN1HEX, n2 = q.getVbyListEx, k = q.isASN1HEX;
      var a = new SecureRandom();
      var o2 = null;
      this.type = "EC";
      this.isPrivate = false;
      this.isPublic = false;
      function l(x, t3, w, s) {
        var r2 = Math.max(t3.bitLength(), s.bitLength());
        var y = x.add2D(w);
        var v = x.curve.getInfinity();
        for (var u = r2 - 1; u >= 0; --u) {
          v = v.twice2D();
          v.z = f.ONE;
          if (t3.testBit(u)) {
            if (s.testBit(u)) {
              v = v.add2D(y);
            } else {
              v = v.add2D(x);
            }
          } else {
            if (s.testBit(u)) {
              v = v.add2D(w);
            }
          }
        }
        return v;
      }
      __name(l, "l");
      __name2(l, "l");
      this.getBigRandom = function(r2) {
        return new f(r2.bitLength(), a).mod(r2.subtract(f.ONE)).add(f.ONE);
      };
      this.setNamedCurve = function(r2) {
        this.ecparams = c.getByName(r2);
        this.prvKeyHex = null;
        this.pubKeyHex = null;
        this.curveName = r2;
      };
      this.setPrivateKeyHex = function(r2) {
        this.isPrivate = true;
        this.prvKeyHex = r2;
      };
      this.setPublicKeyHex = function(r2) {
        this.isPublic = true;
        this.pubKeyHex = r2;
      };
      this.getPublicKeyXYHex = function() {
        var t3 = this.pubKeyHex;
        if (t3.substr(0, 2) !== "04") {
          throw "this method supports uncompressed format(04) only";
        }
        var s = this.ecparams.keycharlen;
        if (t3.length !== 2 + s * 2) {
          throw "malformed public key hex length";
        }
        var r2 = {};
        r2.x = t3.substr(2, s);
        r2.y = t3.substr(2 + s);
        return r2;
      };
      this.getShortNISTPCurveName = function() {
        var r2 = this.curveName;
        if (r2 === "secp256r1" || r2 === "NIST P-256" || r2 === "P-256" || r2 === "prime256v1") {
          return "P-256";
        }
        if (r2 === "secp384r1" || r2 === "NIST P-384" || r2 === "P-384") {
          return "P-384";
        }
        if (r2 === "secp521r1" || r2 === "NIST P-521" || r2 === "P-521") {
          return "P-521";
        }
        return null;
      };
      this.generateKeyPairHex = function() {
        var s = this.ecparams.n;
        var u = this.getBigRandom(s);
        var r2 = this.ecparams.keycharlen;
        var t3 = ("0000000000" + u.toString(16)).slice(-r2);
        this.setPrivateKeyHex(t3);
        var v = this.generatePublicKeyHex();
        return { ecprvhex: t3, ecpubhex: v };
      };
      this.generatePublicKeyHex = function() {
        var u = new f(this.prvKeyHex, 16);
        var w = this.ecparams.G.multiply(u);
        var t3 = w.getX().toBigInteger();
        var s = w.getY().toBigInteger();
        var r2 = this.ecparams.keycharlen;
        var y = ("0000000000" + t3.toString(16)).slice(-r2);
        var v = ("0000000000" + s.toString(16)).slice(-r2);
        var x = "04" + y + v;
        this.setPublicKeyHex(x);
        return x;
      };
      this.signWithMessageHash = function(r2) {
        return this.signHex(r2, this.prvKeyHex);
      };
      this.signHex = function(x, u) {
        var A = new f(u, 16);
        var v = this.ecparams.n;
        var z2 = new f(x.substring(0, this.ecparams.keycharlen), 16);
        do {
          var w = this.getBigRandom(v);
          var B = this.ecparams.G;
          var y = B.multiply(w);
          var t3 = y.getX().toBigInteger().mod(v);
        } while (t3.compareTo(f.ZERO) <= 0);
        var C = w.modInverse(v).multiply(z2.add(A.multiply(t3))).mod(v);
        return m.biRSSigToASN1Sig(t3, C);
      };
      this.sign = function(w, B) {
        var z2 = B;
        var u = this.ecparams.n;
        var y = f.fromByteArrayUnsigned(w);
        do {
          var v = this.getBigRandom(u);
          var A = this.ecparams.G;
          var x = A.multiply(v);
          var t3 = x.getX().toBigInteger().mod(u);
        } while (t3.compareTo(BigInteger.ZERO) <= 0);
        var C = v.modInverse(u).multiply(y.add(z2.multiply(t3))).mod(u);
        return this.serializeSig(t3, C);
      };
      this.verifyWithMessageHash = function(s, r2) {
        return this.verifyHex(s, r2, this.pubKeyHex);
      };
      this.verifyHex = function(v, y, u) {
        try {
          var t3, B;
          var w = m.parseSigHex(y);
          t3 = w.r;
          B = w.s;
          var x = h.decodeFromHex(this.ecparams.curve, u);
          var z2 = new f(v.substring(0, this.ecparams.keycharlen), 16);
          return this.verifyRaw(z2, t3, B, x);
        } catch (A) {
          return false;
        }
      };
      this.verify = function(z2, A, u) {
        var w, t3;
        if (Bitcoin.Util.isArray(A)) {
          var y = this.parseSig(A);
          w = y.r;
          t3 = y.s;
        } else {
          if ("object" === typeof A && A.r && A.s) {
            w = A.r;
            t3 = A.s;
          } else {
            throw "Invalid value for signature";
          }
        }
        var v;
        if (u instanceof ECPointFp) {
          v = u;
        } else {
          if (Bitcoin.Util.isArray(u)) {
            v = h.decodeFrom(this.ecparams.curve, u);
          } else {
            throw "Invalid format for pubkey value, must be byte array or ECPointFp";
          }
        }
        var x = f.fromByteArrayUnsigned(z2);
        return this.verifyRaw(x, w, t3, v);
      };
      this.verifyRaw = function(z2, t3, E, y) {
        var x = this.ecparams.n;
        var D = this.ecparams.G;
        if (t3.compareTo(f.ONE) < 0 || t3.compareTo(x) >= 0) {
          return false;
        }
        if (E.compareTo(f.ONE) < 0 || E.compareTo(x) >= 0) {
          return false;
        }
        var A = E.modInverse(x);
        var w = z2.multiply(A).mod(x);
        var u = t3.multiply(A).mod(x);
        var B = D.multiply(w).add(y.multiply(u));
        var C = B.getX().toBigInteger().mod(x);
        return C.equals(t3);
      };
      this.serializeSig = function(v, u) {
        var w = v.toByteArraySigned();
        var t3 = u.toByteArraySigned();
        var x = [];
        x.push(2);
        x.push(w.length);
        x = x.concat(w);
        x.push(2);
        x.push(t3.length);
        x = x.concat(t3);
        x.unshift(x.length);
        x.unshift(48);
        return x;
      };
      this.parseSig = function(y) {
        var x;
        if (y[0] != 48) {
          throw new Error("Signature not a valid DERSequence");
        }
        x = 2;
        if (y[x] != 2) {
          throw new Error("First element in signature must be a DERInteger");
        }
        var w = y.slice(x + 2, x + 2 + y[x + 1]);
        x += 2 + y[x + 1];
        if (y[x] != 2) {
          throw new Error("Second element in signature must be a DERInteger");
        }
        var t3 = y.slice(x + 2, x + 2 + y[x + 1]);
        x += 2 + y[x + 1];
        var v = f.fromByteArrayUnsigned(w);
        var u = f.fromByteArrayUnsigned(t3);
        return { r: v, s: u };
      };
      this.parseSigCompact = function(w) {
        if (w.length !== 65) {
          throw "Signature has the wrong length";
        }
        var t3 = w[0] - 27;
        if (t3 < 0 || t3 > 7) {
          throw "Invalid signature type";
        }
        var x = this.ecparams.n;
        var v = f.fromByteArrayUnsigned(w.slice(1, 33)).mod(x);
        var u = f.fromByteArrayUnsigned(w.slice(33, 65)).mod(x);
        return { r: v, s: u, i: t3 };
      };
      this.readPKCS5PrvKeyHex = function(u) {
        if (k(u) === false) {
          throw new Error("not ASN.1 hex string");
        }
        var r2, t3, v;
        try {
          r2 = n2(u, 0, ["[0]", 0], "06");
          t3 = n2(u, 0, [1], "04");
          try {
            v = n2(u, 0, ["[1]", 0], "03");
          } catch (s) {
          }
        } catch (s) {
          throw new Error("malformed PKCS#1/5 plain ECC private key");
        }
        this.curveName = d(r2);
        if (this.curveName === void 0) {
          throw "unsupported curve name";
        }
        this.setNamedCurve(this.curveName);
        this.setPublicKeyHex(v);
        this.setPrivateKeyHex(t3);
        this.isPublic = false;
      };
      this.readPKCS8PrvKeyHex = function(v) {
        if (k(v) === false) {
          throw new j("not ASN.1 hex string");
        }
        var t3, r2, u, w;
        try {
          t3 = n2(v, 0, [1, 0], "06");
          r2 = n2(v, 0, [1, 1], "06");
          u = n2(v, 0, [2, 0, 1], "04");
          try {
            w = n2(v, 0, [2, 0, "[1]", 0], "03");
          } catch (s) {
          }
        } catch (s) {
          throw new j("malformed PKCS#8 plain ECC private key");
        }
        this.curveName = d(r2);
        if (this.curveName === void 0) {
          throw new j("unsupported curve name");
        }
        this.setNamedCurve(this.curveName);
        this.setPublicKeyHex(w);
        this.setPrivateKeyHex(u);
        this.isPublic = false;
      };
      this.readPKCS8PubKeyHex = function(u) {
        if (k(u) === false) {
          throw new j("not ASN.1 hex string");
        }
        var t3, r2, v;
        try {
          t3 = n2(u, 0, [0, 0], "06");
          r2 = n2(u, 0, [0, 1], "06");
          v = n2(u, 0, [1], "03");
        } catch (s) {
          throw new j("malformed PKCS#8 ECC public key");
        }
        this.curveName = d(r2);
        if (this.curveName === null) {
          throw new j("unsupported curve name");
        }
        this.setNamedCurve(this.curveName);
        this.setPublicKeyHex(v);
      };
      this.readCertPubKeyHex = function(t3, v) {
        if (k(t3) === false) {
          throw new j("not ASN.1 hex string");
        }
        var r2, u;
        try {
          r2 = n2(t3, 0, [0, 5, 0, 1], "06");
          u = n2(t3, 0, [0, 5, 1], "03");
        } catch (s) {
          throw new j("malformed X.509 certificate ECC public key");
        }
        this.curveName = d(r2);
        if (this.curveName === null) {
          throw new j("unsupported curve name");
        }
        this.setNamedCurve(this.curveName);
        this.setPublicKeyHex(u);
      };
      if (e2 !== void 0) {
        if (e2.curve !== void 0) {
          this.curveName = e2.curve;
        }
      }
      if (this.curveName === void 0) {
        this.curveName = g;
      }
      this.setNamedCurve(this.curveName);
      if (e2 !== void 0) {
        if (e2.prv !== void 0) {
          this.setPrivateKeyHex(e2.prv);
        }
        if (e2.pub !== void 0) {
          this.setPublicKeyHex(e2.pub);
        }
      }
    };
    KJUR.crypto.ECDSA.parseSigHex = function(a) {
      var b = KJUR.crypto.ECDSA.parseSigHexInHexRS(a);
      var d = new BigInteger(b.r, 16);
      var c = new BigInteger(b.s, 16);
      return { r: d, s: c };
    };
    KJUR.crypto.ECDSA.parseSigHexInHexRS = function(f) {
      var j = ASN1HEX, i = j.getChildIdx, g = j.getV;
      j.checkStrictDER(f, 0);
      if (f.substr(0, 2) != "30") {
        throw new Error("signature is not a ASN.1 sequence");
      }
      var h = i(f, 0);
      if (h.length != 2) {
        throw new Error("signature shall have two elements");
      }
      var e2 = h[0];
      var d = h[1];
      if (f.substr(e2, 2) != "02") {
        throw new Error("1st item not ASN.1 integer");
      }
      if (f.substr(d, 2) != "02") {
        throw new Error("2nd item not ASN.1 integer");
      }
      var c = g(f, e2);
      var b = g(f, d);
      return { r: c, s: b };
    };
    KJUR.crypto.ECDSA.asn1SigToConcatSig = function(d) {
      var e2 = KJUR.crypto.ECDSA.parseSigHexInHexRS(d);
      var b = e2.r;
      var a = e2.s;
      if (b.length >= 130 && b.length <= 134) {
        if (b.length % 2 != 0) {
          throw Error("unknown ECDSA sig r length error");
        }
        if (a.length % 2 != 0) {
          throw Error("unknown ECDSA sig s length error");
        }
        if (b.substr(0, 2) == "00") {
          b = b.substr(2);
        }
        if (a.substr(0, 2) == "00") {
          a = a.substr(2);
        }
        var c = Math.max(b.length, a.length);
        b = ("000000" + b).slice(-c);
        a = ("000000" + a).slice(-c);
        return b + a;
      }
      if (b.substr(0, 2) == "00" && b.length % 32 == 2) {
        b = b.substr(2);
      }
      if (a.substr(0, 2) == "00" && a.length % 32 == 2) {
        a = a.substr(2);
      }
      if (b.length % 32 == 30) {
        b = "00" + b;
      }
      if (a.length % 32 == 30) {
        a = "00" + a;
      }
      if (b.length % 32 != 0) {
        throw Error("unknown ECDSA sig r length error");
      }
      if (a.length % 32 != 0) {
        throw Error("unknown ECDSA sig s length error");
      }
      return b + a;
    };
    KJUR.crypto.ECDSA.concatSigToASN1Sig = function(a) {
      if (a.length % 4 != 0) {
        throw Error("unknown ECDSA concatinated r-s sig length error");
      }
      var c = a.substr(0, a.length / 2);
      var b = a.substr(a.length / 2);
      return KJUR.crypto.ECDSA.hexRSSigToASN1Sig(c, b);
    };
    KJUR.crypto.ECDSA.hexRSSigToASN1Sig = function(b, a) {
      var d = new BigInteger(b, 16);
      var c = new BigInteger(a, 16);
      return KJUR.crypto.ECDSA.biRSSigToASN1Sig(d, c);
    };
    KJUR.crypto.ECDSA.biRSSigToASN1Sig = function(f, d) {
      var c = KJUR.asn1;
      var b = new c.DERInteger({ bigint: f });
      var a = new c.DERInteger({ bigint: d });
      var e2 = new c.DERSequence({ array: [b, a] });
      return e2.tohex();
    };
    KJUR.crypto.ECDSA.getName = function(a) {
      if (a === "2b8104001f") {
        return "secp192k1";
      }
      if (a === "2a8648ce3d030107") {
        return "secp256r1";
      }
      if (a === "2b8104000a") {
        return "secp256k1";
      }
      if (a === "2b81040021") {
        return "secp224r1";
      }
      if (a === "2b81040022") {
        return "secp384r1";
      }
      if (a === "2b81040023") {
        return "secp521r1";
      }
      if ("|secp256r1|NIST P-256|P-256|prime256v1|".indexOf(a) !== -1) {
        return "secp256r1";
      }
      if ("|secp256k1|".indexOf(a) !== -1) {
        return "secp256k1";
      }
      if ("|secp224r1|NIST P-224|P-224|".indexOf(a) !== -1) {
        return "secp224r1";
      }
      if ("|secp384r1|NIST P-384|P-384|".indexOf(a) !== -1) {
        return "secp384r1";
      }
      if ("|secp521r1|NIST P-521|P-521|".indexOf(a) !== -1) {
        return "secp521r1";
      }
      return null;
    };
    if (typeof KJUR == "undefined" || !KJUR) {
      KJUR = {};
    }
    if (typeof KJUR.crypto == "undefined" || !KJUR.crypto) {
      KJUR.crypto = {};
    }
    KJUR.crypto.ECParameterDB = new function() {
      var b = {};
      var c = {};
      function a(d) {
        return new BigInteger(d, 16);
      }
      __name(a, "a");
      __name2(a, "a");
      this.getByName = function(e2) {
        var d = e2;
        if (typeof c[d] != "undefined") {
          d = c[e2];
        }
        if (typeof b[d] != "undefined") {
          return b[d];
        }
        throw "unregistered EC curve name: " + d;
      };
      this.regist = function(A, l, o2, g, m, e2, j, f, k, u, d, x) {
        b[A] = {};
        var s = a(o2);
        var z2 = a(g);
        var y = a(m);
        var t3 = a(e2);
        var w = a(j);
        var r2 = new ECCurveFp(s, z2, y);
        var q = r2.decodePointHex("04" + f + k);
        b[A]["name"] = A;
        b[A]["keylen"] = l;
        b[A]["keycharlen"] = Math.ceil(l / 8) * 2;
        b[A]["curve"] = r2;
        b[A]["G"] = q;
        b[A]["n"] = t3;
        b[A]["h"] = w;
        b[A]["oid"] = d;
        b[A]["info"] = x;
        for (var v = 0; v < u.length; v++) {
          c[u[v]] = A;
        }
      };
    }();
    KJUR.crypto.ECParameterDB.regist("secp128r1", 128, "FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFF", "FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFC", "E87579C11079F43DD824993C2CEE5ED3", "FFFFFFFE0000000075A30D1B9038A115", "1", "161FF7528B899B2D0C28607CA52C5B86", "CF5AC8395BAFEB13C02DA292DDED7A83", [], "", "secp128r1 : SECG curve over a 128 bit prime field");
    KJUR.crypto.ECParameterDB.regist("secp160k1", 160, "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFAC73", "0", "7", "0100000000000000000001B8FA16DFAB9ACA16B6B3", "1", "3B4C382CE37AA192A4019E763036F4F5DD4D7EBB", "938CF935318FDCED6BC28286531733C3F03C4FEE", [], "", "secp160k1 : SECG curve over a 160 bit prime field");
    KJUR.crypto.ECParameterDB.regist("secp160r1", 160, "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFF", "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFC", "1C97BEFC54BD7A8B65ACF89F81D4D4ADC565FA45", "0100000000000000000001F4C8F927AED3CA752257", "1", "4A96B5688EF573284664698968C38BB913CBFC82", "23A628553168947D59DCC912042351377AC5FB32", [], "", "secp160r1 : SECG curve over a 160 bit prime field");
    KJUR.crypto.ECParameterDB.regist("secp192k1", 192, "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFEE37", "0", "3", "FFFFFFFFFFFFFFFFFFFFFFFE26F2FC170F69466A74DEFD8D", "1", "DB4FF10EC057E9AE26B07D0280B7F4341DA5D1B1EAE06C7D", "9B2F2F6D9C5628A7844163D015BE86344082AA88D95E2F9D", []);
    KJUR.crypto.ECParameterDB.regist("secp192r1", 192, "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFF", "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFC", "64210519E59C80E70FA7E9AB72243049FEB8DEECC146B9B1", "FFFFFFFFFFFFFFFFFFFFFFFF99DEF836146BC9B1B4D22831", "1", "188DA80EB03090F67CBF20EB43A18800F4FF0AFD82FF1012", "07192B95FFC8DA78631011ED6B24CDD573F977A11E794811", []);
    KJUR.crypto.ECParameterDB.regist("secp224r1", 224, "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF000000000000000000000001", "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFE", "B4050A850C04B3ABF54132565044B0B7D7BFD8BA270B39432355FFB4", "FFFFFFFFFFFFFFFFFFFFFFFFFFFF16A2E0B8F03E13DD29455C5C2A3D", "1", "B70E0CBD6BB4BF7F321390B94A03C1D356C21122343280D6115C1D21", "BD376388B5F723FB4C22DFE6CD4375A05A07476444D5819985007E34", []);
    KJUR.crypto.ECParameterDB.regist("secp256k1", 256, "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F", "0", "7", "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141", "1", "79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798", "483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8", []);
    KJUR.crypto.ECParameterDB.regist("secp256r1", 256, "FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF", "FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFC", "5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B", "FFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551", "1", "6B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296", "4FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5", ["NIST P-256", "P-256", "prime256v1"]);
    KJUR.crypto.ECParameterDB.regist("secp384r1", 384, "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFF0000000000000000FFFFFFFF", "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFF0000000000000000FFFFFFFC", "B3312FA7E23EE7E4988E056BE3F82D19181D9C6EFE8141120314088F5013875AC656398D8A2ED19D2A85C8EDD3EC2AEF", "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFC7634D81F4372DDF581A0DB248B0A77AECEC196ACCC52973", "1", "AA87CA22BE8B05378EB1C71EF320AD746E1D3B628BA79B9859F741E082542A385502F25DBF55296C3A545E3872760AB7", "3617de4a96262c6f5d9e98bf9292dc29f8f41dbd289a147ce9da3113b5f0b8c00a60b1ce1d7e819d7a431d7c90ea0e5f", ["NIST P-384", "P-384"]);
    KJUR.crypto.ECParameterDB.regist("secp521r1", 521, "1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF", "1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFC", "051953EB9618E1C9A1F929A21A0B68540EEA2DA725B99B315F3B8B489918EF109E156193951EC7E937B1652C0BD3BB1BF073573DF883D2C34F1EF451FD46B503F00", "1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFA51868783BF2F966B7FCC0148F709A5D03BB5C9B8899C47AEBB6FB71E91386409", "1", "00C6858E06B70404E9CD9E3ECB662395B4429C648139053FB521F828AF606B4D3DBAA14B5E77EFE75928FE1DC127A2FFA8DE3348B3C1856A429BF97E7E31C2E5BD66", "011839296a789a3bc0045c8a5fb42c7d1bd998f54449579b446817afbd17273e662c97ee72995ef42640c550b9013fad0761353c7086a272c24088be94769fd16650", ["NIST P-521", "P-521"]);
    if (typeof KJUR == "undefined" || !KJUR) {
      KJUR = {};
    }
    if (typeof KJUR.crypto == "undefined" || !KJUR.crypto) {
      KJUR.crypto = {};
    }
    KJUR.crypto.DSA = function() {
      var c = ASN1HEX, g = c.getVbyList, e2 = c.getVbyListEx, a = c.isASN1HEX, d = BigInteger, b = BigInteger.ONE;
      var f = /* @__PURE__ */ __name2(function(j, i, h, k) {
        if (j == null || i == null || h == null || k == null) {
          throw new Error("invalid DSA public key");
        }
        if (b.compareTo(i) >= 0 || i.compareTo(j) >= 0) {
          throw new Error("invalid DSA public key");
        }
        if (b.compareTo(h) >= 0 || h.compareTo(j) >= 0) {
          throw new Error("invalid DSA public key");
        }
        if (b.compareTo(k) >= 0 || k.compareTo(j) >= 0) {
          throw new Error("invalid DSA public key");
        }
        if (h.modPow(i, j).compareTo(b) != 0) {
          throw new Error("invalid DSA public key");
        }
      }, "f");
      this.p = null;
      this.q = null;
      this.g = null;
      this.y = null;
      this.x = null;
      this.type = "DSA";
      this.isPrivate = false;
      this.isPublic = false;
      this.setPrivate = function(k, j, i, l, h) {
        this.isPrivate = true;
        this.p = k;
        this.q = j;
        this.g = i;
        this.y = l;
        this.x = h;
      };
      this.setPrivateHex = function(k, i, m, p, q) {
        var j, h, l, n2, o2;
        j = new BigInteger(k, 16);
        h = new BigInteger(i, 16);
        l = new BigInteger(m, 16);
        if (typeof p === "string" && p.length > 1) {
          n2 = new BigInteger(p, 16);
        } else {
          n2 = null;
        }
        o2 = new BigInteger(q, 16);
        this.setPrivate(j, h, l, n2, o2);
      };
      this.setPublic = function(j, i, h, k) {
        f(j, i, h, k);
        this.isPublic = true;
        this.p = j;
        this.q = i;
        this.g = h;
        this.y = k;
        this.x = null;
      };
      this.setPublicHex = function(m, l, k, n2) {
        var i, h, o2, j;
        i = new BigInteger(m, 16);
        h = new BigInteger(l, 16);
        o2 = new BigInteger(k, 16);
        j = new BigInteger(n2, 16);
        this.setPublic(i, h, o2, j);
      };
      this.signWithMessageHash = function(m) {
        var j = this.p;
        var i = this.q;
        var n2 = this.g;
        var t3 = this.y;
        var u = this.x;
        var v = m.substr(0, i.bitLength() / 4);
        var o2 = new BigInteger(v, 16);
        var l, h, A;
        do {
          l = KJUR.crypto.Util.getRandomBigIntegerMinToMax(BigInteger.ONE.add(BigInteger.ONE), i.subtract(BigInteger.ONE));
          h = n2.modPow(l, j).mod(i);
          A = l.modInverse(i).multiply(o2.add(u.multiply(h))).mod(i);
        } while (h.compareTo(BigInteger.ZERO) == 0 || A.compareTo(BigInteger.ZERO) == 0);
        var w = KJUR.asn1.ASN1Util.jsonToASN1HEX({ seq: [{ "int": { bigint: h } }, { "int": { bigint: A } }] });
        return w;
      };
      this.verifyWithMessageHash = function(n2, m) {
        var k = this.p;
        var i = this.q;
        var t3 = this.g;
        var x = this.y;
        var o2 = this.parseASN1Signature(m);
        var h = o2[0];
        var D = o2[1];
        var C = n2.substr(0, i.bitLength() / 4);
        var u = new BigInteger(C, 16);
        if (BigInteger.ZERO.compareTo(h) > 0 || h.compareTo(i) > 0) {
          throw "invalid DSA signature";
        }
        if (BigInteger.ZERO.compareTo(D) >= 0 || D.compareTo(i) > 0) {
          throw "invalid DSA signature";
        }
        var A = D.modInverse(i);
        var l = u.multiply(A).mod(i);
        var j = h.multiply(A).mod(i);
        var B = t3.modPow(l, k).multiply(x.modPow(j, k)).mod(k).mod(i);
        return B.compareTo(h) == 0;
      };
      this.parseASN1Signature = function(h) {
        try {
          var k = new d(e2(h, 0, [0], "02"), 16);
          var j = new d(e2(h, 0, [1], "02"), 16);
          return [k, j];
        } catch (i) {
          throw new Error("malformed ASN.1 DSA signature");
        }
      };
      this.readPKCS5PrvKeyHex = function(l) {
        var m, k, j, n2, o2;
        if (a(l) === false) {
          throw new Error("not ASN.1 hex string");
        }
        try {
          m = e2(l, 0, [1], "02");
          k = e2(l, 0, [2], "02");
          j = e2(l, 0, [3], "02");
          n2 = e2(l, 0, [4], "02");
          o2 = e2(l, 0, [5], "02");
        } catch (i) {
          throw new Error("malformed PKCS#1/5 plain DSA private key");
        }
        this.setPrivateHex(m, k, j, n2, o2);
      };
      this.readPKCS8PrvKeyHex = function(l) {
        var m, k, j, n2;
        if (a(l) === false) {
          throw new Error("not ASN.1 hex string");
        }
        try {
          m = e2(l, 0, [1, 1, 0], "02");
          k = e2(l, 0, [1, 1, 1], "02");
          j = e2(l, 0, [1, 1, 2], "02");
          n2 = e2(l, 0, [2, 0], "02");
        } catch (i) {
          throw new Error("malformed PKCS#8 plain DSA private key");
        }
        this.setPrivateHex(m, k, j, null, n2);
      };
      this.readPKCS8PubKeyHex = function(l) {
        var m, k, j, n2;
        if (a(l) === false) {
          throw new Error("not ASN.1 hex string");
        }
        try {
          m = e2(l, 0, [0, 1, 0], "02");
          k = e2(l, 0, [0, 1, 1], "02");
          j = e2(l, 0, [0, 1, 2], "02");
          n2 = e2(l, 0, [1, 0], "02");
        } catch (i) {
          throw new Error("malformed PKCS#8 DSA public key");
        }
        this.setPublicHex(m, k, j, n2);
      };
      this.readCertPubKeyHex = function(l, o2) {
        var m, k, j, n2;
        if (a(l) === false) {
          throw new Error("not ASN.1 hex string");
        }
        try {
          m = e2(l, 0, [0, 5, 0, 1, 0], "02");
          k = e2(l, 0, [0, 5, 0, 1, 1], "02");
          j = e2(l, 0, [0, 5, 0, 1, 2], "02");
          n2 = e2(l, 0, [0, 5, 1, 0], "02");
        } catch (i) {
          throw new Error("malformed X.509 certificate DSA public key");
        }
        this.setPublicHex(m, k, j, n2);
      };
    };
    var KEYUTIL = /* @__PURE__ */ (function() {
      var d = /* @__PURE__ */ __name2(function(p, r2, q) {
        return k(CryptoJS.AES, p, r2, q);
      }, "d");
      var e2 = /* @__PURE__ */ __name2(function(p, r2, q) {
        return k(CryptoJS.TripleDES, p, r2, q);
      }, "e2");
      var a = /* @__PURE__ */ __name2(function(p, r2, q) {
        return k(CryptoJS.DES, p, r2, q);
      }, "a");
      var k = /* @__PURE__ */ __name2(function(s, x, u, q) {
        var r2 = CryptoJS.enc.Hex.parse(x);
        var w = CryptoJS.enc.Hex.parse(u);
        var p = CryptoJS.enc.Hex.parse(q);
        var t3 = {};
        t3.key = w;
        t3.iv = p;
        t3.ciphertext = r2;
        var v = s.decrypt(t3, w, { iv: p });
        return CryptoJS.enc.Hex.stringify(v);
      }, "k");
      var l = /* @__PURE__ */ __name2(function(p, r2, q) {
        return g(CryptoJS.AES, p, r2, q);
      }, "l");
      var o2 = /* @__PURE__ */ __name2(function(p, r2, q) {
        return g(CryptoJS.TripleDES, p, r2, q);
      }, "o2");
      var f = /* @__PURE__ */ __name2(function(p, r2, q) {
        return g(CryptoJS.DES, p, r2, q);
      }, "f");
      var g = /* @__PURE__ */ __name2(function(t3, y, v, q) {
        var s = CryptoJS.enc.Hex.parse(y);
        var x = CryptoJS.enc.Hex.parse(v);
        var p = CryptoJS.enc.Hex.parse(q);
        var w = t3.encrypt(s, x, { iv: p });
        var r2 = CryptoJS.enc.Hex.parse(w.toString());
        var u = CryptoJS.enc.Base64.stringify(r2);
        return u;
      }, "g");
      var i = { "AES-256-CBC": { proc: d, eproc: l, keylen: 32, ivlen: 16 }, "AES-192-CBC": { proc: d, eproc: l, keylen: 24, ivlen: 16 }, "AES-128-CBC": { proc: d, eproc: l, keylen: 16, ivlen: 16 }, "DES-EDE3-CBC": { proc: e2, eproc: o2, keylen: 24, ivlen: 8 }, "DES-CBC": { proc: a, eproc: f, keylen: 8, ivlen: 8 } };
      var c = /* @__PURE__ */ __name2(function(p) {
        return i[p]["proc"];
      }, "c");
      var m = /* @__PURE__ */ __name2(function(p) {
        var r2 = CryptoJS.lib.WordArray.random(p);
        var q = CryptoJS.enc.Hex.stringify(r2);
        return q;
      }, "m");
      var n2 = /* @__PURE__ */ __name2(function(v) {
        var w = {};
        var q = v.match(new RegExp("DEK-Info: ([^,]+),([0-9A-Fa-f]+)", "m"));
        if (q) {
          w.cipher = q[1];
          w.ivsalt = q[2];
        }
        var p = v.match(new RegExp("-----BEGIN ([A-Z]+) PRIVATE KEY-----"));
        if (p) {
          w.type = p[1];
        }
        var u = -1;
        var x = 0;
        if (v.indexOf("\r\n\r\n") != -1) {
          u = v.indexOf("\r\n\r\n");
          x = 2;
        }
        if (v.indexOf("\n\n") != -1) {
          u = v.indexOf("\n\n");
          x = 1;
        }
        var t3 = v.indexOf("-----END");
        if (u != -1 && t3 != -1) {
          var r2 = v.substring(u + x * 2, t3 - x);
          r2 = r2.replace(/\s+/g, "");
          w.data = r2;
        }
        return w;
      }, "n2");
      var j = /* @__PURE__ */ __name2(function(q, y, p) {
        var v = p.substring(0, 16);
        var t3 = CryptoJS.enc.Hex.parse(v);
        var r2 = CryptoJS.enc.Utf8.parse(y);
        var u = i[q]["keylen"] + i[q]["ivlen"];
        var x = "";
        var w = null;
        for (; ; ) {
          var s = CryptoJS.algo.MD5.create();
          if (w != null) {
            s.update(w);
          }
          s.update(r2);
          s.update(t3);
          w = s.finalize();
          x = x + CryptoJS.enc.Hex.stringify(w);
          if (x.length >= u * 2) {
            break;
          }
        }
        var z2 = {};
        z2.keyhex = x.substr(0, i[q]["keylen"] * 2);
        z2.ivhex = x.substr(i[q]["keylen"] * 2, i[q]["ivlen"] * 2);
        return z2;
      }, "j");
      var b = /* @__PURE__ */ __name2(function(p, v, r2, w) {
        var s = CryptoJS.enc.Base64.parse(p);
        var q = CryptoJS.enc.Hex.stringify(s);
        var u = i[v]["proc"];
        var t3 = u(q, r2, w);
        return t3;
      }, "b");
      var h = /* @__PURE__ */ __name2(function(p, s, q, u) {
        var r2 = i[s]["eproc"];
        var t3 = r2(p, q, u);
        return t3;
      }, "h");
      return { version: "1.0.0", parsePKCS5PEM: /* @__PURE__ */ __name2(function(p) {
        return n2(p);
      }, "parsePKCS5PEM"), getKeyAndUnusedIvByPasscodeAndIvsalt: /* @__PURE__ */ __name2(function(q, p, r2) {
        return j(q, p, r2);
      }, "getKeyAndUnusedIvByPasscodeAndIvsalt"), decryptKeyB64: /* @__PURE__ */ __name2(function(p, r2, q, s) {
        return b(p, r2, q, s);
      }, "decryptKeyB64"), getDecryptedKeyHex: /* @__PURE__ */ __name2(function(y, x) {
        var q = n2(y);
        var t3 = q.type;
        var r2 = q.cipher;
        var p = q.ivsalt;
        var s = q.data;
        var w = j(r2, x, p);
        var v = w.keyhex;
        var u = b(s, r2, v, p);
        return u;
      }, "getDecryptedKeyHex"), getEncryptedPKCS5PEMFromPrvKeyHex: /* @__PURE__ */ __name2(function(x, s, A, t3, r2) {
        var p = "";
        if (typeof t3 == "undefined" || t3 == null) {
          t3 = "AES-256-CBC";
        }
        if (typeof i[t3] == "undefined") {
          throw new Error("KEYUTIL unsupported algorithm: " + t3);
        }
        if (typeof r2 == "undefined" || r2 == null) {
          var v = i[t3]["ivlen"];
          var u = m(v);
          r2 = u.toUpperCase();
        }
        var z2 = j(t3, A, r2);
        var y = z2.keyhex;
        var w = h(s, t3, y, r2);
        var q = w.replace(/(.{64})/g, "$1\r\n");
        var p = "-----BEGIN " + x + " PRIVATE KEY-----\r\n";
        p += "Proc-Type: 4,ENCRYPTED\r\n";
        p += "DEK-Info: " + t3 + "," + r2 + "\r\n";
        p += "\r\n";
        p += q;
        p += "\r\n-----END " + x + " PRIVATE KEY-----\r\n";
        return p;
      }, "getEncryptedPKCS5PEMFromPrvKeyHex"), getEncryptedPKCS8PEM: /* @__PURE__ */ __name2(function(r2, p, s) {
        var q = this.getEncryptedPKCS8Hex(r2, p, s);
        return hextopem(q, "ENCRYPTED PRIVATE KEY");
      }, "getEncryptedPKCS8PEM"), getEncryptedPKCS8Hex: /* @__PURE__ */ __name2(function(r2, p, t3) {
        var q;
        if (t3 == void 0 || t3 == null) {
          q = {};
        } else {
          q = JSON.parse(JSON.stringify(t3));
        }
        q.plain = r2;
        this.initPBES2Param(q);
        this.encryptPBES2Param(q, p);
        var s = this.generatePBES2ASN1Param(q);
        return KJUR.asn1.ASN1Util.newObject(s).tohex();
      }, "getEncryptedPKCS8Hex"), initPBES2Param: /* @__PURE__ */ __name2(function(p) {
        if (aryval(p, "encalg") == void 0) {
          p.encalg = "aes256-CBC";
        }
        if (aryval(p, "iter") == void 0) {
          p.iter = 2048;
        }
        if (aryval(p, "prf") == void 0) {
          p.prf = "hmacWithSHA256";
        }
        if (aryval(p, "salt") == void 0) {
          p.salt = CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.random(8));
        }
        if (aryval(p, "enciv") == void 0) {
          var q;
          if (p.encalg == "des-EDE3-CBC") {
            q = 8;
          }
          if (p.encalg == "aes128-CBC") {
            q = 16;
          }
          if (p.encalg == "aes256-CBC") {
            q = 16;
          }
          p.enciv = CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.random(q));
        }
      }, "initPBES2Param"), encryptPBES2Param: /* @__PURE__ */ __name2(function(p, q) {
        var t3 = KEYUTIL.getDKFromPBES2Param(p, q);
        try {
          var s = KJUR.crypto.Cipher.encrypt(p.plain, t3, p.encalg, { iv: p.enciv });
        } catch (r2) {
          throw new Error("encrypt error: " + p.plain + " " + t3 + " " + p.encalg + " " + p.enciv);
        }
        p.enc = s;
      }, "encryptPBES2Param"), generatePBES2ASN1Param: /* @__PURE__ */ __name2(function(p) {
        var q = { seq: [{ seq: [{ oid: "pkcs5PBES2" }, { seq: [{ seq: [{ oid: "pkcs5PBKDF2" }, { seq: [{ octstr: { hex: p.salt } }, { "int": { hex: inttohex(p.iter) } }] }] }, { seq: [{ oid: p.encalg }, { octstr: { hex: p.enciv } }] }] }] }, { octstr: { hex: p.enc } }] };
        if (p.prf != "hmacWithSHA1") {
          q.seq[0].seq[1].seq[0].seq[1].seq.push({ seq: [{ oid: p.prf }, { "null": "" }] });
        }
        return q;
      }, "generatePBES2ASN1Param"), parseHexOfEncryptedPKCS8: /* @__PURE__ */ __name2(function(y) {
        var B = ASN1HEX;
        var z2 = B.getChildIdx;
        var w = B.getV;
        var t3 = {};
        var r2 = z2(y, 0);
        if (r2.length != 2) {
          throw new Error("malformed format: SEQUENCE(0).items != 2: " + r2.length);
        }
        t3.ciphertext = w(y, r2[1]);
        var A = z2(y, r2[0]);
        if (A.length != 2) {
          throw new Error("malformed format: SEQUENCE(0.0).items != 2: " + A.length);
        }
        if (w(y, A[0]) != "2a864886f70d01050d") {
          throw new Error("this only supports pkcs5PBES2");
        }
        var p = z2(y, A[1]);
        if (A.length != 2) {
          throw new Error("malformed format: SEQUENCE(0.0.1).items != 2: " + p.length);
        }
        var q = z2(y, p[1]);
        if (q.length != 2) {
          throw new Error("malformed format: SEQUENCE(0.0.1.1).items != 2: " + q.length);
        }
        if (w(y, q[0]) != "2a864886f70d0307") {
          throw "this only supports TripleDES";
        }
        t3.encryptionSchemeAlg = "TripleDES";
        t3.encryptionSchemeIV = w(y, q[1]);
        var s = z2(y, p[0]);
        if (s.length != 2) {
          throw new Error("malformed format: SEQUENCE(0.0.1.0).items != 2: " + s.length);
        }
        if (w(y, s[0]) != "2a864886f70d01050c") {
          throw new Error("this only supports pkcs5PBKDF2");
        }
        var x = z2(y, s[1]);
        if (x.length < 2) {
          throw new Error("malformed format: SEQUENCE(0.0.1.0.1).items < 2: " + x.length);
        }
        t3.pbkdf2Salt = w(y, x[0]);
        var u = w(y, x[1]);
        try {
          t3.pbkdf2Iter = parseInt(u, 16);
        } catch (v) {
          throw new Error("malformed format pbkdf2Iter: " + u);
        }
        return t3;
      }, "parseHexOfEncryptedPKCS8"), getPBKDF2KeyHexFromParam: /* @__PURE__ */ __name2(function(u, p) {
        var t3 = CryptoJS.enc.Hex.parse(u.pbkdf2Salt);
        var q = u.pbkdf2Iter;
        var s = CryptoJS.PBKDF2(p, t3, { keySize: 192 / 32, iterations: q });
        var r2 = CryptoJS.enc.Hex.stringify(s);
        return r2;
      }, "getPBKDF2KeyHexFromParam"), _getPlainPKCS8HexFromEncryptedPKCS8PEM: /* @__PURE__ */ __name2(function(x, y) {
        var r2 = pemtohex(x, "ENCRYPTED PRIVATE KEY");
        var p = this.parseHexOfEncryptedPKCS8(r2);
        var u = KEYUTIL.getPBKDF2KeyHexFromParam(p, y);
        var v = {};
        v.ciphertext = CryptoJS.enc.Hex.parse(p.ciphertext);
        var t3 = CryptoJS.enc.Hex.parse(u);
        var s = CryptoJS.enc.Hex.parse(p.encryptionSchemeIV);
        var w = CryptoJS.TripleDES.decrypt(v, t3, { iv: s });
        var q = CryptoJS.enc.Hex.stringify(w);
        return q;
      }, "_getPlainPKCS8HexFromEncryptedPKCS8PEM"), parsePBES2: /* @__PURE__ */ __name2(function(z2) {
        var v = ASN1HEX.parse(z2);
        if (aryval(v, "seq.0.seq.0.oid") != "pkcs5PBES2" || aryval(v, "seq.0.seq.1.seq.0.seq.0.oid") != "pkcs5PBKDF2") {
          throw new Error("not pkcs5PBES2 and pkcs5PBKDF2 used");
        }
        var y = aryval(v, "seq.0.seq.1.seq.0.seq.1.seq");
        if (y == void 0) {
          throw new Error("PBKDF2 parameter not found");
        }
        var t3 = aryval(y, "0.octstr.hex");
        var p = aryval(y, "1.int.hex");
        var q = aryval(y, "2.seq.0.oid", "hmacWithSHA1");
        var x = -1;
        try {
          x = parseInt(p, 16);
        } catch (w) {
          throw new Error("iter not proper value");
        }
        var u = aryval(v, "seq.0.seq.1.seq.1.seq.0.oid");
        var s = aryval(v, "seq.0.seq.1.seq.1.seq.1.octstr.hex");
        var r2 = aryval(v, "seq.1.octstr.hex");
        if (u == void 0 || s == void 0 || r2 == void 0) {
          throw new Error("encalg, enciv or enc is undefined");
        }
        var A = { salt: t3, iter: x, prf: q, encalg: u, enciv: s, enc: r2 };
        return A;
      }, "parsePBES2"), getDKFromPBES2Param: /* @__PURE__ */ __name2(function(p, w) {
        var x = { hmacWithSHA1: CryptoJS.algo.SHA1, hmacWithSHA224: CryptoJS.algo.SHA224, hmacWithSHA256: CryptoJS.algo.SHA256, hmacWithSHA384: CryptoJS.algo.SHA384, hmacWithSHA512: CryptoJS.algo.SHA512 };
        var q = { "des-EDE3-CBC": 192 / 32, "aes128-CBC": 128 / 32, "aes256-CBC": 256 / 32 };
        var y = x[p.prf];
        if (y == void 0) {
          throw new Error("unsupported prf");
        }
        var r2 = q[p.encalg];
        if (r2 == void 0) {
          throw new Error("unsupported encalg");
        }
        var s = CryptoJS.enc.Hex.parse(p.salt);
        var u = p.iter;
        try {
          var v = CryptoJS.PBKDF2(w, s, { keySize: r2, iterations: u, hasher: y });
          return CryptoJS.enc.Hex.stringify(v);
        } catch (t3) {
          throw new Error("PBKDF2 error: " + t3 + " " + JSON.stringify(p) + " " + w);
        }
      }, "getDKFromPBES2Param"), getPlainHexFromEncryptedPKCS8PEM: /* @__PURE__ */ __name2(function(t3, q) {
        if (t3.indexOf("BEGIN ENCRYPTED PRIVATE KEY") == -1) {
          throw new Error("not Encrypted PKCS#8 PEM string");
        }
        var u = pemtohex(t3);
        var p;
        try {
          p = KEYUTIL.parsePBES2(u);
        } catch (r2) {
          throw new Error("malformed PBES2 format: " + r2.message);
        }
        var s = KEYUTIL.getDKFromPBES2Param(p, q);
        return KJUR.crypto.Cipher.decrypt(p.enc, s, p.encalg, { iv: p.enciv });
      }, "getPlainHexFromEncryptedPKCS8PEM"), getKeyFromEncryptedPKCS8PEM: /* @__PURE__ */ __name2(function(s, q) {
        var p = this.getPlainHexFromEncryptedPKCS8PEM(s, q);
        var r2 = this.getKeyFromPlainPrivatePKCS8Hex(p);
        return r2;
      }, "getKeyFromEncryptedPKCS8PEM"), parsePlainPrivatePKCS8Hex: /* @__PURE__ */ __name2(function(s) {
        var v = ASN1HEX;
        var u = v.getChildIdx;
        var t3 = v.getV;
        var q = {};
        q.algparam = null;
        if (s.substr(0, 2) != "30") {
          throw new Error("malformed plain PKCS8 private key(code:001)");
        }
        var r2 = u(s, 0);
        if (r2.length < 3) {
          throw new Error("malformed plain PKCS8 private key(code:002)");
        }
        if (s.substr(r2[1], 2) != "30") {
          throw new Error("malformed PKCS8 private key(code:003)");
        }
        var p = u(s, r2[1]);
        if (p.length != 2) {
          throw new Error("malformed PKCS8 private key(code:004)");
        }
        if (s.substr(p[0], 2) != "06") {
          throw new Error("malformed PKCS8 private key(code:005)");
        }
        q.algoid = t3(s, p[0]);
        if (s.substr(p[1], 2) == "06") {
          q.algparam = t3(s, p[1]);
        }
        if (s.substr(r2[2], 2) != "04") {
          throw new Error("malformed PKCS8 private key(code:006)");
        }
        q.keyidx = v.getVidx(s, r2[2]);
        return q;
      }, "parsePlainPrivatePKCS8Hex"), getKeyFromPlainPrivatePKCS8PEM: /* @__PURE__ */ __name2(function(q) {
        var p = pemtohex(q, "PRIVATE KEY");
        var r2 = this.getKeyFromPlainPrivatePKCS8Hex(p);
        return r2;
      }, "getKeyFromPlainPrivatePKCS8PEM"), getKeyFromPlainPrivatePKCS8Hex: /* @__PURE__ */ __name2(function(p) {
        var q = this.parsePlainPrivatePKCS8Hex(p);
        var r2;
        if (q.algoid == "2a864886f70d010101") {
          r2 = new RSAKey();
        } else {
          if (q.algoid == "2a8648ce380401") {
            r2 = new KJUR.crypto.DSA();
          } else {
            if (q.algoid == "2a8648ce3d0201") {
              r2 = new KJUR.crypto.ECDSA();
            } else {
              throw new Error("unsupported private key algorithm");
            }
          }
        }
        r2.readPKCS8PrvKeyHex(p);
        return r2;
      }, "getKeyFromPlainPrivatePKCS8Hex"), _getKeyFromPublicPKCS8Hex: /* @__PURE__ */ __name2(function(q) {
        var p;
        var r2 = ASN1HEX.getVbyList(q, 0, [0, 0], "06");
        if (r2 === "2a864886f70d010101") {
          p = new RSAKey();
        } else {
          if (r2 === "2a8648ce380401") {
            p = new KJUR.crypto.DSA();
          } else {
            if (r2 === "2a8648ce3d0201") {
              p = new KJUR.crypto.ECDSA();
            } else {
              throw new Error("unsupported PKCS#8 public key hex");
            }
          }
        }
        p.readPKCS8PubKeyHex(q);
        return p;
      }, "_getKeyFromPublicPKCS8Hex"), parsePublicRawRSAKeyHex: /* @__PURE__ */ __name2(function(r2) {
        var u = ASN1HEX;
        var t3 = u.getChildIdx;
        var s = u.getV;
        var p = {};
        if (r2.substr(0, 2) != "30") {
          throw new Error("malformed RSA key(code:001)");
        }
        var q = t3(r2, 0);
        if (q.length != 2) {
          throw new Error("malformed RSA key(code:002)");
        }
        if (r2.substr(q[0], 2) != "02") {
          throw new Error("malformed RSA key(code:003)");
        }
        p.n = s(r2, q[0]);
        if (r2.substr(q[1], 2) != "02") {
          throw new Error("malformed RSA key(code:004)");
        }
        p.e = s(r2, q[1]);
        return p;
      }, "parsePublicRawRSAKeyHex"), parsePublicPKCS8Hex: /* @__PURE__ */ __name2(function(t3) {
        var v = ASN1HEX;
        var u = v.getChildIdx;
        var s = v.getV;
        var q = {};
        q.algparam = null;
        var r2 = u(t3, 0);
        if (r2.length != 2) {
          throw new Error("outer DERSequence shall have 2 elements: " + r2.length);
        }
        var w = r2[0];
        if (t3.substr(w, 2) != "30") {
          throw new Error("malformed PKCS8 public key(code:001)");
        }
        var p = u(t3, w);
        if (p.length != 2) {
          throw new Error("malformed PKCS8 public key(code:002)");
        }
        if (t3.substr(p[0], 2) != "06") {
          throw new Error("malformed PKCS8 public key(code:003)");
        }
        q.algoid = s(t3, p[0]);
        if (t3.substr(p[1], 2) == "06") {
          q.algparam = s(t3, p[1]);
        } else {
          if (t3.substr(p[1], 2) == "30") {
            q.algparam = {};
            q.algparam.p = v.getVbyList(t3, p[1], [0], "02");
            q.algparam.q = v.getVbyList(t3, p[1], [1], "02");
            q.algparam.g = v.getVbyList(t3, p[1], [2], "02");
          }
        }
        if (t3.substr(r2[1], 2) != "03") {
          throw new Error("malformed PKCS8 public key(code:004)");
        }
        q.key = s(t3, r2[1]).substr(2);
        return q;
      }, "parsePublicPKCS8Hex") };
    })();
    KEYUTIL.getKey = function(l, k, n2) {
      var G = ASN1HEX, L = G.getChildIdx, v = G.getV, d = G.getVbyList, c = KJUR.crypto, i = c.ECDSA, C = c.DSA, w = RSAKey, M = pemtohex, F = KEYUTIL;
      if (typeof w != "undefined" && l instanceof w) {
        return l;
      }
      if (typeof i != "undefined" && l instanceof i) {
        return l;
      }
      if (typeof C != "undefined" && l instanceof C) {
        return l;
      }
      if (l.curve !== void 0 && l.xy !== void 0 && l.d === void 0) {
        return new i({ pub: l.xy, curve: l.curve });
      }
      if (l.curve !== void 0 && l.d !== void 0) {
        return new i({ prv: l.d, curve: l.curve });
      }
      if (l.kty === void 0 && l.n !== void 0 && l.e !== void 0 && l.d === void 0) {
        var P = new w();
        P.setPublic(l.n, l.e);
        return P;
      }
      if (l.kty === void 0 && l.n !== void 0 && l.e !== void 0 && l.d !== void 0 && l.p !== void 0 && l.q !== void 0 && l.dp !== void 0 && l.dq !== void 0 && l.co !== void 0 && l.qi === void 0) {
        var P = new w();
        P.setPrivateEx(l.n, l.e, l.d, l.p, l.q, l.dp, l.dq, l.co);
        return P;
      }
      if (l.kty === void 0 && l.n !== void 0 && l.e !== void 0 && l.d !== void 0 && l.p === void 0) {
        var P = new w();
        P.setPrivate(l.n, l.e, l.d);
        return P;
      }
      if (l.p !== void 0 && l.q !== void 0 && l.g !== void 0 && l.y !== void 0 && l.x === void 0) {
        var P = new C();
        P.setPublic(l.p, l.q, l.g, l.y);
        return P;
      }
      if (l.p !== void 0 && l.q !== void 0 && l.g !== void 0 && l.y !== void 0 && l.x !== void 0) {
        var P = new C();
        P.setPrivate(l.p, l.q, l.g, l.y, l.x);
        return P;
      }
      if (l.kty === "RSA" && l.n !== void 0 && l.e !== void 0 && l.d === void 0) {
        var P = new w();
        P.setPublic(b64utohex(l.n), b64utohex(l.e));
        return P;
      }
      if (l.kty === "RSA" && l.n !== void 0 && l.e !== void 0 && l.d !== void 0 && l.p !== void 0 && l.q !== void 0 && l.dp !== void 0 && l.dq !== void 0 && l.qi !== void 0) {
        var P = new w();
        P.setPrivateEx(b64utohex(l.n), b64utohex(l.e), b64utohex(l.d), b64utohex(l.p), b64utohex(l.q), b64utohex(l.dp), b64utohex(l.dq), b64utohex(l.qi));
        return P;
      }
      if (l.kty === "RSA" && l.n !== void 0 && l.e !== void 0 && l.d !== void 0) {
        var P = new w();
        P.setPrivate(b64utohex(l.n), b64utohex(l.e), b64utohex(l.d));
        return P;
      }
      if (l.kty === "EC" && l.crv !== void 0 && l.x !== void 0 && l.y !== void 0 && l.d === void 0) {
        var j = new i({ curve: l.crv });
        var t3 = j.ecparams.keycharlen;
        var B = ("0000000000" + b64utohex(l.x)).slice(-t3);
        var z2 = ("0000000000" + b64utohex(l.y)).slice(-t3);
        var u = "04" + B + z2;
        j.setPublicKeyHex(u);
        return j;
      }
      if (l.kty === "EC" && l.crv !== void 0 && l.x !== void 0 && l.y !== void 0 && l.d !== void 0) {
        var j = new i({ curve: l.crv });
        var t3 = j.ecparams.keycharlen;
        var B = ("0000000000" + b64utohex(l.x)).slice(-t3);
        var z2 = ("0000000000" + b64utohex(l.y)).slice(-t3);
        var u = "04" + B + z2;
        var b = ("0000000000" + b64utohex(l.d)).slice(-t3);
        j.setPublicKeyHex(u);
        j.setPrivateKeyHex(b);
        return j;
      }
      if (n2 === "pkcs5prv") {
        var J = l, G = ASN1HEX, N, P;
        N = L(J, 0);
        if (N.length === 9) {
          P = new w();
          P.readPKCS5PrvKeyHex(J);
        } else {
          if (N.length === 6) {
            P = new C();
            P.readPKCS5PrvKeyHex(J);
          } else {
            if (N.length > 2 && J.substr(N[1], 2) === "04") {
              P = new i();
              P.readPKCS5PrvKeyHex(J);
            } else {
              throw new Error("unsupported PKCS#1/5 hexadecimal key");
            }
          }
        }
        return P;
      }
      if (n2 === "pkcs8prv") {
        var P = F.getKeyFromPlainPrivatePKCS8Hex(l);
        return P;
      }
      if (n2 === "pkcs8pub") {
        return F._getKeyFromPublicPKCS8Hex(l);
      }
      if (n2 === "x509pub") {
        return X509.getPublicKeyFromCertHex(l);
      }
      if (l.indexOf("-END CERTIFICATE-", 0) != -1 || l.indexOf("-END X509 CERTIFICATE-", 0) != -1 || l.indexOf("-END TRUSTED CERTIFICATE-", 0) != -1) {
        return X509.getPublicKeyFromCertPEM(l);
      }
      if (l.indexOf("-END PUBLIC KEY-") != -1) {
        var O = pemtohex(l, "PUBLIC KEY");
        return F._getKeyFromPublicPKCS8Hex(O);
      }
      if (l.indexOf("-END RSA PRIVATE KEY-") != -1 && l.indexOf("4,ENCRYPTED") == -1) {
        var m = M(l, "RSA PRIVATE KEY");
        return F.getKey(m, null, "pkcs5prv");
      }
      if (l.indexOf("-END DSA PRIVATE KEY-") != -1 && l.indexOf("4,ENCRYPTED") == -1) {
        var I = M(l, "DSA PRIVATE KEY");
        var E = d(I, 0, [1], "02");
        var D = d(I, 0, [2], "02");
        var K = d(I, 0, [3], "02");
        var r2 = d(I, 0, [4], "02");
        var s = d(I, 0, [5], "02");
        var P = new C();
        P.setPrivate(new BigInteger(E, 16), new BigInteger(D, 16), new BigInteger(K, 16), new BigInteger(r2, 16), new BigInteger(s, 16));
        return P;
      }
      if (l.indexOf("-END EC PRIVATE KEY-") != -1 && l.indexOf("4,ENCRYPTED") == -1) {
        var m = M(l, "EC PRIVATE KEY");
        return F.getKey(m, null, "pkcs5prv");
      }
      if (l.indexOf("-END PRIVATE KEY-") != -1) {
        return F.getKeyFromPlainPrivatePKCS8PEM(l);
      }
      if (l.indexOf("-END RSA PRIVATE KEY-") != -1 && l.indexOf("4,ENCRYPTED") != -1) {
        var o2 = F.getDecryptedKeyHex(l, k);
        var H = new RSAKey();
        H.readPKCS5PrvKeyHex(o2);
        return H;
      }
      if (l.indexOf("-END EC PRIVATE KEY-") != -1 && l.indexOf("4,ENCRYPTED") != -1) {
        var I = F.getDecryptedKeyHex(l, k);
        var P = d(I, 0, [1], "04");
        var f = d(I, 0, [2, 0], "06");
        var A = d(I, 0, [3, 0], "03").substr(2);
        var e2 = "";
        if (KJUR.crypto.OID.oidhex2name[f] !== void 0) {
          e2 = KJUR.crypto.OID.oidhex2name[f];
        } else {
          throw new Error("undefined OID(hex) in KJUR.crypto.OID: " + f);
        }
        var j = new i({ curve: e2 });
        j.setPublicKeyHex(A);
        j.setPrivateKeyHex(P);
        j.isPublic = false;
        return j;
      }
      if (l.indexOf("-END DSA PRIVATE KEY-") != -1 && l.indexOf("4,ENCRYPTED") != -1) {
        var I = F.getDecryptedKeyHex(l, k);
        var E = d(I, 0, [1], "02");
        var D = d(I, 0, [2], "02");
        var K = d(I, 0, [3], "02");
        var r2 = d(I, 0, [4], "02");
        var s = d(I, 0, [5], "02");
        var P = new C();
        P.setPrivate(new BigInteger(E, 16), new BigInteger(D, 16), new BigInteger(K, 16), new BigInteger(r2, 16), new BigInteger(s, 16));
        return P;
      }
      if (l.indexOf("-END ENCRYPTED PRIVATE KEY-") != -1) {
        return F.getKeyFromEncryptedPKCS8PEM(l, k);
      }
      throw new Error("not supported argument");
    };
    KEYUTIL.generateKeypair = function(a, c) {
      if (a == "RSA") {
        var b = c;
        var h = new RSAKey();
        h.generate(b, "10001");
        h.isPrivate = true;
        h.isPublic = true;
        var f = new RSAKey();
        var e2 = h.n.toString(16);
        var i = h.e.toString(16);
        f.setPublic(e2, i);
        f.isPrivate = false;
        f.isPublic = true;
        var k = {};
        k.prvKeyObj = h;
        k.pubKeyObj = f;
        return k;
      } else {
        if (a == "EC") {
          var d = c;
          var g = new KJUR.crypto.ECDSA({ curve: d });
          var j = g.generateKeyPairHex();
          var h = new KJUR.crypto.ECDSA({ curve: d });
          h.setPublicKeyHex(j.ecpubhex);
          h.setPrivateKeyHex(j.ecprvhex);
          h.isPrivate = true;
          h.isPublic = false;
          var f = new KJUR.crypto.ECDSA({ curve: d });
          f.setPublicKeyHex(j.ecpubhex);
          f.isPrivate = false;
          f.isPublic = true;
          var k = {};
          k.prvKeyObj = h;
          k.pubKeyObj = f;
          return k;
        } else {
          throw new Error("unknown algorithm: " + a);
        }
      }
    };
    KEYUTIL.getPEM = function(b, C, x, m, p, j) {
      var E = KJUR, k = E.asn1, y = k.DERObjectIdentifier, e2 = k.DERInteger, l = k.ASN1Util.newObject, a = k.x509, B = a.SubjectPublicKeyInfo, d = E.crypto, t3 = d.DSA, q = d.ECDSA, n2 = RSAKey;
      function z2(s) {
        var G = l({ seq: [{ "int": 0 }, { "int": { bigint: s.n } }, { "int": s.e }, { "int": { bigint: s.d } }, { "int": { bigint: s.p } }, { "int": { bigint: s.q } }, { "int": { bigint: s.dmp1 } }, { "int": { bigint: s.dmq1 } }, { "int": { bigint: s.coeff } }] });
        return G;
      }
      __name(z2, "z2");
      __name2(z2, "z2");
      function A(G) {
        var s = l({ seq: [{ "int": 1 }, { octstr: { hex: G.prvKeyHex } }, { tag: ["a0", true, { oid: { name: G.curveName } }] }, { tag: ["a1", true, { bitstr: { hex: "00" + G.pubKeyHex } }] }] });
        return s;
      }
      __name(A, "A");
      __name2(A, "A");
      function w(s) {
        var G = l({ seq: [{ "int": 0 }, { "int": { bigint: s.p } }, { "int": { bigint: s.q } }, { "int": { bigint: s.g } }, { "int": { bigint: s.y } }, { "int": { bigint: s.x } }] });
        return G;
      }
      __name(w, "w");
      __name2(w, "w");
      if ((n2 !== void 0 && b instanceof n2 || t3 !== void 0 && b instanceof t3 || q !== void 0 && b instanceof q) && b.isPublic == true && (C === void 0 || C == "PKCS8PUB")) {
        var D = new B(b);
        var v = D.tohex();
        return hextopem(v, "PUBLIC KEY");
      }
      if (C == "PKCS1PRV" && n2 !== void 0 && b instanceof n2 && (x === void 0 || x == null) && b.isPrivate == true) {
        var D = z2(b);
        var v = D.tohex();
        return hextopem(v, "RSA PRIVATE KEY");
      }
      if (C == "PKCS1PRV" && q !== void 0 && b instanceof q && (x === void 0 || x == null) && b.isPrivate == true) {
        var i = new y({ name: b.curveName });
        var u = i.tohex();
        var h = A(b);
        var r2 = h.tohex();
        var o2 = "";
        o2 += hextopem(u, "EC PARAMETERS");
        o2 += hextopem(r2, "EC PRIVATE KEY");
        return o2;
      }
      if (C == "PKCS1PRV" && t3 !== void 0 && b instanceof t3 && (x === void 0 || x == null) && b.isPrivate == true) {
        var D = w(b);
        var v = D.tohex();
        return hextopem(v, "DSA PRIVATE KEY");
      }
      if (C == "PKCS5PRV" && n2 !== void 0 && b instanceof n2 && (x !== void 0 && x != null) && b.isPrivate == true) {
        var D = z2(b);
        var v = D.tohex();
        if (m === void 0) {
          m = "DES-EDE3-CBC";
        }
        return this.getEncryptedPKCS5PEMFromPrvKeyHex("RSA", v, x, m, j);
      }
      if (C == "PKCS5PRV" && q !== void 0 && b instanceof q && (x !== void 0 && x != null) && b.isPrivate == true) {
        var D = A(b);
        var v = D.tohex();
        if (m === void 0) {
          m = "DES-EDE3-CBC";
        }
        return this.getEncryptedPKCS5PEMFromPrvKeyHex("EC", v, x, m, j);
      }
      if (C == "PKCS5PRV" && t3 !== void 0 && b instanceof t3 && (x !== void 0 && x != null) && b.isPrivate == true) {
        var D = w(b);
        var v = D.tohex();
        if (m === void 0) {
          m = "DES-EDE3-CBC";
        }
        return this.getEncryptedPKCS5PEMFromPrvKeyHex("DSA", v, x, m, j);
      }
      var f = /* @__PURE__ */ __name2(function(G, H) {
        if (typeof H == "string") {
          return KEYUTIL.getEncryptedPKCS8PEM(G, H);
        } else {
          if (typeof H == "object" && aryval(H, "passcode") != void 0) {
            var I = JSON.parse(JSON.stringify(H));
            var s = I.passcode;
            delete I.passcode;
            return KEYUTIL.getEncryptedPKCS8PEM(G, s, I);
          }
        }
      }, "f");
      if (C == "PKCS8PRV" && n2 != void 0 && b instanceof n2 && b.isPrivate == true) {
        var g = z2(b);
        var c = g.tohex();
        var D = l({ seq: [{ "int": 0 }, { seq: [{ oid: { name: "rsaEncryption" } }, { "null": true }] }, { octstr: { hex: c } }] });
        var v = D.tohex();
        if (x === void 0 || x == null) {
          return hextopem(v, "PRIVATE KEY");
        } else {
          return f(v, x);
        }
      }
      if (C == "PKCS8PRV" && q !== void 0 && b instanceof q && b.isPrivate == true) {
        var F = { seq: [{ "int": 1 }, { octstr: { hex: b.prvKeyHex } }] };
        if (typeof b.pubKeyHex == "string") {
          F.seq.push({ tag: ["a1", true, { bitstr: { hex: "00" + b.pubKeyHex } }] });
        }
        var g = new l(F);
        var c = g.tohex();
        var D = l({ seq: [{ "int": 0 }, { seq: [{ oid: { name: "ecPublicKey" } }, { oid: { name: b.curveName } }] }, { octstr: { hex: c } }] });
        var v = D.tohex();
        if (x === void 0 || x == null) {
          return hextopem(v, "PRIVATE KEY");
        } else {
          return f(v, x);
        }
      }
      if (C == "PKCS8PRV" && t3 !== void 0 && b instanceof t3 && b.isPrivate == true) {
        var g = new e2({ bigint: b.x });
        var c = g.tohex();
        var D = l({ seq: [{ "int": 0 }, { seq: [{ oid: { name: "dsa" } }, { seq: [{ "int": { bigint: b.p } }, { "int": { bigint: b.q } }, { "int": { bigint: b.g } }] }] }, { octstr: { hex: c } }] });
        var v = D.tohex();
        if (x === void 0 || x == null) {
          return hextopem(v, "PRIVATE KEY");
        } else {
          return f(v, x);
        }
      }
      throw new Error("unsupported object nor format");
    };
    KEYUTIL.getKeyFromCSRPEM = function(b) {
      var a = pemtohex(b, "CERTIFICATE REQUEST");
      var c = KEYUTIL.getKeyFromCSRHex(a);
      return c;
    };
    KEYUTIL.getKeyFromCSRHex = function(a) {
      var c = KEYUTIL.parseCSRHex(a);
      var b = KEYUTIL.getKey(c.p8pubkeyhex, null, "pkcs8pub");
      return b;
    };
    KEYUTIL.parseCSRHex = function(d) {
      var i = ASN1HEX;
      var f = i.getChildIdx;
      var c = i.getTLV;
      var b = {};
      var g = d;
      if (g.substr(0, 2) != "30") {
        throw new Error("malformed CSR(code:001)");
      }
      var e2 = f(g, 0);
      if (e2.length < 1) {
        throw new Error("malformed CSR(code:002)");
      }
      if (g.substr(e2[0], 2) != "30") {
        throw new Error("malformed CSR(code:003)");
      }
      var a = f(g, e2[0]);
      if (a.length < 3) {
        throw new Error("malformed CSR(code:004)");
      }
      b.p8pubkeyhex = c(g, a[2]);
      return b;
    };
    KEYUTIL.getKeyID = function(f) {
      var c = KEYUTIL;
      var e2 = ASN1HEX;
      if (typeof f === "string" && f.indexOf("BEGIN ") != -1) {
        f = c.getKey(f);
      }
      var d = pemtohex(c.getPEM(f));
      var b = e2.getIdxbyList(d, 0, [1]);
      var a = e2.getV(d, b).substring(2);
      return KJUR.crypto.Util.hashHex(a, "sha1");
    };
    KEYUTIL.getJWK = function(d, h, g, b, f) {
      var i;
      var k = {};
      var e2;
      var c = KJUR.crypto.Util.hashHex;
      if (typeof d == "string") {
        i = KEYUTIL.getKey(d);
        if (d.indexOf("CERTIFICATE") != -1) {
          e2 = pemtohex(d);
        }
      } else {
        if (typeof d == "object") {
          if (d instanceof X509) {
            i = d.getPublicKey();
            e2 = d.hex;
          } else {
            i = d;
          }
        } else {
          throw new Error("unsupported keyinfo type");
        }
      }
      if (i instanceof RSAKey && i.isPrivate) {
        k.kty = "RSA";
        k.n = hextob64u(i.n.toString(16));
        k.e = hextob64u(i.e.toString(16));
        k.d = hextob64u(i.d.toString(16));
        k.p = hextob64u(i.p.toString(16));
        k.q = hextob64u(i.q.toString(16));
        k.dp = hextob64u(i.dmp1.toString(16));
        k.dq = hextob64u(i.dmq1.toString(16));
        k.qi = hextob64u(i.coeff.toString(16));
      } else {
        if (i instanceof RSAKey && i.isPublic) {
          k.kty = "RSA";
          k.n = hextob64u(i.n.toString(16));
          k.e = hextob64u(i.e.toString(16));
        } else {
          if (i instanceof KJUR.crypto.ECDSA && i.isPrivate) {
            var a = i.getShortNISTPCurveName();
            if (a !== "P-256" && a !== "P-384" && a !== "P-521") {
              throw new Error("unsupported curve name for JWT: " + a);
            }
            var j = i.getPublicKeyXYHex();
            k.kty = "EC";
            k.crv = a;
            k.x = hextob64u(j.x);
            k.y = hextob64u(j.y);
            k.d = hextob64u(i.prvKeyHex);
          } else {
            if (i instanceof KJUR.crypto.ECDSA && i.isPublic) {
              var a = i.getShortNISTPCurveName();
              if (a !== "P-256" && a !== "P-384" && a !== "P-521") {
                throw new Error("unsupported curve name for JWT: " + a);
              }
              var j = i.getPublicKeyXYHex();
              k.kty = "EC";
              k.crv = a;
              k.x = hextob64u(j.x);
              k.y = hextob64u(j.y);
            }
          }
        }
      }
      if (k.kty == void 0) {
        throw new Error("unsupported keyinfo");
      }
      if (!i.isPrivate && h != true) {
        k.kid = KJUR.jws.JWS.getJWKthumbprint(k);
      }
      if (e2 != void 0 && g != true) {
        k.x5c = [hex2b64(e2)];
      }
      if (e2 != void 0 && b != true) {
        k.x5t = b64tob64u(hex2b64(c(e2, "sha1")));
      }
      if (e2 != void 0 && f != true) {
        k["x5t#S256"] = b64tob64u(hex2b64(c(e2, "sha256")));
      }
      return k;
    };
    KEYUTIL.getJWKFromKey = function(a) {
      return KEYUTIL.getJWK(a, true, true, true, true);
    };
    RSAKey.getPosArrayOfChildrenFromHex = function(a) {
      return ASN1HEX.getChildIdx(a, 0);
    };
    RSAKey.getHexValueArrayOfChildrenFromHex = function(f) {
      var n2 = ASN1HEX;
      var i = n2.getV;
      var k = RSAKey.getPosArrayOfChildrenFromHex(f);
      var e2 = i(f, k[0]);
      var j = i(f, k[1]);
      var b = i(f, k[2]);
      var c = i(f, k[3]);
      var h = i(f, k[4]);
      var g = i(f, k[5]);
      var m = i(f, k[6]);
      var l = i(f, k[7]);
      var d = i(f, k[8]);
      var k = new Array();
      k.push(e2, j, b, c, h, g, m, l, d);
      return k;
    };
    RSAKey.prototype.readPrivateKeyFromPEMString = function(d) {
      var c = pemtohex(d);
      var b = RSAKey.getHexValueArrayOfChildrenFromHex(c);
      this.setPrivateEx(b[1], b[2], b[3], b[4], b[5], b[6], b[7], b[8]);
    };
    RSAKey.prototype.readPKCS5PrvKeyHex = function(c) {
      var b = RSAKey.getHexValueArrayOfChildrenFromHex(c);
      this.setPrivateEx(b[1], b[2], b[3], b[4], b[5], b[6], b[7], b[8]);
    };
    RSAKey.prototype.readPKCS8PrvKeyHex = function(e2) {
      var c, i, k, b, a, f, d, j;
      var m = ASN1HEX;
      var l = m.getVbyListEx;
      if (m.isASN1HEX(e2) === false) {
        throw new Error("not ASN.1 hex string");
      }
      try {
        c = l(e2, 0, [2, 0, 1], "02");
        i = l(e2, 0, [2, 0, 2], "02");
        k = l(e2, 0, [2, 0, 3], "02");
        b = l(e2, 0, [2, 0, 4], "02");
        a = l(e2, 0, [2, 0, 5], "02");
        f = l(e2, 0, [2, 0, 6], "02");
        d = l(e2, 0, [2, 0, 7], "02");
        j = l(e2, 0, [2, 0, 8], "02");
      } catch (g) {
        throw new Error("malformed PKCS#8 plain RSA private key");
      }
      this.setPrivateEx(c, i, k, b, a, f, d, j);
    };
    RSAKey.prototype.readPKCS5PubKeyHex = function(c) {
      var e2 = ASN1HEX;
      var b = e2.getV;
      if (e2.isASN1HEX(c) === false) {
        throw new Error("keyHex is not ASN.1 hex string");
      }
      var a = e2.getChildIdx(c, 0);
      if (a.length !== 2 || c.substr(a[0], 2) !== "02" || c.substr(a[1], 2) !== "02") {
        throw new Error("wrong hex for PKCS#5 public key");
      }
      var f = b(c, a[0]);
      var d = b(c, a[1]);
      this.setPublic(f, d);
    };
    RSAKey.prototype.readPKCS8PubKeyHex = function(b) {
      var c = ASN1HEX;
      if (c.isASN1HEX(b) === false) {
        throw new Error("not ASN.1 hex string");
      }
      if (c.getTLVbyListEx(b, 0, [0, 0]) !== "06092a864886f70d010101") {
        throw new Error("not PKCS8 RSA public key");
      }
      var a = c.getTLVbyListEx(b, 0, [1, 0]);
      this.readPKCS5PubKeyHex(a);
    };
    RSAKey.prototype.readCertPubKeyHex = function(b, d) {
      var a, c;
      a = new X509();
      a.readCertHex(b);
      c = a.getPublicKeyHex();
      this.readPKCS8PubKeyHex(c);
    };
    var _RE_HEXDECONLY = new RegExp("[^0-9a-f]", "gi");
    function _zeroPaddingOfSignature(e2, d) {
      var c = "";
      var a = d / 4 - e2.length;
      for (var b = 0; b < a; b++) {
        c = c + "0";
      }
      return c + e2;
    }
    __name(_zeroPaddingOfSignature, "_zeroPaddingOfSignature");
    __name2(_zeroPaddingOfSignature, "_zeroPaddingOfSignature");
    RSAKey.prototype.sign = function(d, a) {
      var b = /* @__PURE__ */ __name2(function(e2) {
        return KJUR.crypto.Util.hashString(e2, a);
      }, "b");
      var c = b(d);
      return this.signWithMessageHash(c, a);
    };
    RSAKey.prototype.signWithMessageHash = function(e2, c) {
      var f = KJUR.crypto.Util.getPaddedDigestInfoHex(e2, c, this.n.bitLength());
      var b = parseBigInt(f, 16);
      var d = this.doPrivate(b);
      var a = d.toString(16);
      return _zeroPaddingOfSignature(a, this.n.bitLength());
    };
    function pss_mgf1_str(c, a, e2) {
      var b = "", d = 0;
      while (b.length < a) {
        b += hextorstr(e2(rstrtohex(c + String.fromCharCode.apply(String, [(d & 4278190080) >> 24, (d & 16711680) >> 16, (d & 65280) >> 8, d & 255]))));
        d += 1;
      }
      return b;
    }
    __name(pss_mgf1_str, "pss_mgf1_str");
    __name2(pss_mgf1_str, "pss_mgf1_str");
    RSAKey.prototype.signPSS = function(e2, a, d) {
      var c = /* @__PURE__ */ __name2(function(f) {
        return KJUR.crypto.Util.hashHex(f, a);
      }, "c");
      var b = c(rstrtohex(e2));
      if (d === void 0) {
        d = -1;
      }
      return this.signWithMessageHashPSS(b, a, d);
    };
    RSAKey.prototype.signWithMessageHashPSS = function(l, a, k) {
      var b = hextorstr(l);
      var g = b.length;
      var m = this.n.bitLength() - 1;
      var c = Math.ceil(m / 8);
      var d;
      var o2 = /* @__PURE__ */ __name2(function(i) {
        return KJUR.crypto.Util.hashHex(i, a);
      }, "o2");
      if (k === -1 || k === void 0) {
        k = g;
      } else {
        if (k === -2) {
          k = c - g - 2;
        } else {
          if (k < -2) {
            throw new Error("invalid salt length");
          }
        }
      }
      if (c < g + k + 2) {
        throw new Error("data too long");
      }
      var f = "";
      if (k > 0) {
        f = new Array(k);
        new SecureRandom().nextBytes(f);
        f = String.fromCharCode.apply(String, f);
      }
      var n2 = hextorstr(o2(rstrtohex("\0\0\0\0\0\0\0\0" + b + f)));
      var j = [];
      for (d = 0; d < c - k - g - 2; d += 1) {
        j[d] = 0;
      }
      var e2 = String.fromCharCode.apply(String, j) + "" + f;
      var h = pss_mgf1_str(n2, e2.length, o2);
      var q = [];
      for (d = 0; d < e2.length; d += 1) {
        q[d] = e2.charCodeAt(d) ^ h.charCodeAt(d);
      }
      var p = 65280 >> 8 * c - m & 255;
      q[0] &= ~p;
      for (d = 0; d < g; d++) {
        q.push(n2.charCodeAt(d));
      }
      q.push(188);
      return _zeroPaddingOfSignature(this.doPrivate(new BigInteger(q)).toString(16), this.n.bitLength());
    };
    function _rsasign_getAlgNameAndHashFromHexDisgestInfo(f) {
      for (var e2 in KJUR.crypto.Util.DIGESTINFOHEAD) {
        var d = KJUR.crypto.Util.DIGESTINFOHEAD[e2];
        var b = d.length;
        if (f.substring(0, b) == d) {
          var c = [e2, f.substring(b)];
          return c;
        }
      }
      return [];
    }
    __name(_rsasign_getAlgNameAndHashFromHexDisgestInfo, "_rsasign_getAlgNameAndHashFromHexDisgestInfo");
    __name2(_rsasign_getAlgNameAndHashFromHexDisgestInfo, "_rsasign_getAlgNameAndHashFromHexDisgestInfo");
    RSAKey.prototype.verify = function(f, l) {
      l = l.toLowerCase();
      if (l.match(/^[0-9a-f]+$/) == null) {
        return false;
      }
      var b = parseBigInt(l, 16);
      var k = this.n.bitLength();
      if (b.bitLength() > k) {
        return false;
      }
      var j = this.doPublic(b);
      var i = j.toString(16);
      if (i.length + 3 != k / 4) {
        return false;
      }
      var e2 = i.replace(/^1f+00/, "");
      var g = _rsasign_getAlgNameAndHashFromHexDisgestInfo(e2);
      if (g.length == 0) {
        return false;
      }
      var d = g[0];
      var h = g[1];
      var a = /* @__PURE__ */ __name2(function(m) {
        return KJUR.crypto.Util.hashString(m, d);
      }, "a");
      var c = a(f);
      return h == c;
    };
    RSAKey.prototype.verifyWithMessageHash = function(e2, a) {
      if (a.length != Math.ceil(this.n.bitLength() / 4)) {
        return false;
      }
      var b = parseBigInt(a, 16);
      if (b.bitLength() > this.n.bitLength()) {
        return 0;
      }
      var h = this.doPublic(b);
      var g = h.toString(16).replace(/^1f+00/, "");
      var c = _rsasign_getAlgNameAndHashFromHexDisgestInfo(g);
      if (c.length == 0) {
        return false;
      }
      var d = c[0];
      var f = c[1];
      return f == e2;
    };
    RSAKey.prototype.verifyPSS = function(c, b, a, f) {
      var e2 = /* @__PURE__ */ __name2(function(g) {
        return KJUR.crypto.Util.hashHex(g, a);
      }, "e2");
      var d = e2(rstrtohex(c));
      if (f === void 0) {
        f = -1;
      }
      return this.verifyWithMessageHashPSS(d, b, a, f);
    };
    RSAKey.prototype.verifyWithMessageHashPSS = function(f, s, l, c) {
      if (s.length != Math.ceil(this.n.bitLength() / 4)) {
        return false;
      }
      var k = new BigInteger(s, 16);
      var r2 = /* @__PURE__ */ __name2(function(i) {
        return KJUR.crypto.Util.hashHex(i, l);
      }, "r2");
      var j = hextorstr(f);
      var h = j.length;
      var g = this.n.bitLength() - 1;
      var m = Math.ceil(g / 8);
      var q;
      if (c === -1 || c === void 0) {
        c = h;
      } else {
        if (c === -2) {
          c = m - h - 2;
        } else {
          if (c < -2) {
            throw new Error("invalid salt length");
          }
        }
      }
      if (m < h + c + 2) {
        throw new Error("data too long");
      }
      var a = this.doPublic(k).toByteArray();
      for (q = 0; q < a.length; q += 1) {
        a[q] &= 255;
      }
      while (a.length < m) {
        a.unshift(0);
      }
      if (a[m - 1] !== 188) {
        throw new Error("encoded message does not end in 0xbc");
      }
      a = String.fromCharCode.apply(String, a);
      var d = a.substr(0, m - h - 1);
      var e2 = a.substr(d.length, h);
      var p = 65280 >> 8 * m - g & 255;
      if ((d.charCodeAt(0) & p) !== 0) {
        throw new Error("bits beyond keysize not zero");
      }
      var n2 = pss_mgf1_str(e2, d.length, r2);
      var o2 = [];
      for (q = 0; q < d.length; q += 1) {
        o2[q] = d.charCodeAt(q) ^ n2.charCodeAt(q);
      }
      o2[0] &= ~p;
      var b = m - h - c - 2;
      for (q = 0; q < b; q += 1) {
        if (o2[q] !== 0) {
          throw new Error("leftmost octets not zero");
        }
      }
      if (o2[b] !== 1) {
        throw new Error("0x01 marker not found");
      }
      return e2 === hextorstr(r2(rstrtohex("\0\0\0\0\0\0\0\0" + j + String.fromCharCode.apply(String, o2.slice(-c)))));
    };
    RSAKey.SALT_LEN_HLEN = -1;
    RSAKey.SALT_LEN_MAX = -2;
    RSAKey.SALT_LEN_RECOVER = -2;
    function X509(v) {
      var o2 = ASN1HEX, s = o2.getChildIdx, k = o2.getV, y = o2.dump, j = o2.parse, b = o2.getTLV, c = o2.getVbyList, p = o2.getVbyListEx, a = o2.getTLVbyList, q = o2.getTLVbyListEx, l = o2.getIdxbyList, f = o2.getIdxbyListEx, n2 = o2.getVidx, x = o2.getInt, u = o2.oidname, r2 = o2.hextooidstr, d = X509, w = pemtohex, g, m = Error;
      try {
        g = KJUR.asn1.x509.AlgorithmIdentifier.PSSNAME2ASN1TLV;
      } catch (t3) {
      }
      this.HEX2STAG = { "0c": "utf8", "13": "prn", "16": "ia5", "1a": "vis", "1e": "bmp" };
      this.hex = null;
      this.version = 0;
      this.foffset = 0;
      this.aExtInfo = null;
      this.getVersion = function() {
        if (this.hex === null || this.version !== 0) {
          return this.version;
        }
        var A = a(this.hex, 0, [0, 0]);
        if (A.substr(0, 2) == "a0") {
          var B = a(A, 0, [0]);
          var z2 = x(B, 0);
          if (z2 < 0 || 2 < z2) {
            throw new Error("malformed version field");
          }
          this.version = z2 + 1;
          return this.version;
        } else {
          this.version = 1;
          this.foffset = -1;
          return 1;
        }
      };
      this.getSerialNumberHex = function() {
        return p(this.hex, 0, [0, 0], "02");
      };
      this.getSignatureAlgorithmField = function() {
        var z2 = q(this.hex, 0, [0, 1]);
        return this.getAlgorithmIdentifierName(z2);
      };
      this.getAlgorithmIdentifierName = function(z2) {
        for (var A in g) {
          if (z2 === g[A]) {
            return A;
          }
        }
        return u(p(z2, 0, [0], "06"));
      };
      this.getIssuer = function(A, z2) {
        return this.getX500Name(this.getIssuerHex(), A, z2);
      };
      this.getIssuerHex = function() {
        return a(this.hex, 0, [0, 3 + this.foffset], "30");
      };
      this.getIssuerString = function() {
        var z2 = this.getIssuer();
        return z2.str;
      };
      this.getSubject = function(A, z2) {
        return this.getX500Name(this.getSubjectHex(), A, z2);
      };
      this.getSubjectHex = function() {
        return a(this.hex, 0, [0, 5 + this.foffset], "30");
      };
      this.getSubjectString = function() {
        var z2 = this.getSubject();
        return z2.str;
      };
      this.getNotBefore = function() {
        var z2 = c(this.hex, 0, [0, 4 + this.foffset, 0]);
        z2 = z2.replace(/(..)/g, "%$1");
        z2 = decodeURIComponent(z2);
        return z2;
      };
      this.getNotAfter = function() {
        var z2 = c(this.hex, 0, [0, 4 + this.foffset, 1]);
        z2 = z2.replace(/(..)/g, "%$1");
        z2 = decodeURIComponent(z2);
        return z2;
      };
      this.getPublicKeyHex = function() {
        return this.getSPKI();
      };
      this.getSPKI = function() {
        return a(this.hex, 0, [0, 6 + this.foffset], "30");
      };
      this.getSPKIValue = function() {
        var z2 = this.getSPKI();
        if (z2 == null) {
          return null;
        }
        return c(z2, 0, [1], "03", true);
      };
      this.getPublicKeyIdx = function() {
        return l(this.hex, 0, [0, 6 + this.foffset], "30");
      };
      this.getPublicKeyContentIdx = function() {
        var z2 = this.getPublicKeyIdx();
        return l(this.hex, z2, [1, 0], "30");
      };
      this.getPublicKey = function() {
        return KEYUTIL.getKey(this.getPublicKeyHex(), null, "pkcs8pub");
      };
      this.getSignatureAlgorithmName = function() {
        var z2 = a(this.hex, 0, [1], "30");
        return this.getAlgorithmIdentifierName(z2);
      };
      this.getSignatureValueHex = function() {
        return c(this.hex, 0, [2], "03", true);
      };
      this.verifySignature = function(B) {
        var C = this.getSignatureAlgorithmField();
        var z2 = this.getSignatureValueHex();
        var A = a(this.hex, 0, [0], "30");
        var D = new KJUR.crypto.Signature({ alg: C });
        D.init(B);
        D.updateHex(A);
        return D.verify(z2);
      };
      this.parseExt = function(I) {
        var B, z2, D;
        if (I === void 0) {
          D = this.hex;
          if (this.version !== 3) {
            return -1;
          }
          B = l(D, 0, [0, 7, 0], "30");
          z2 = s(D, B);
        } else {
          D = pemtohex(I);
          var E = l(D, 0, [0, 3, 0, 0], "06");
          if (k(D, E) != "2a864886f70d01090e") {
            this.aExtInfo = new Array();
            return;
          }
          B = l(D, 0, [0, 3, 0, 1, 0], "30");
          z2 = s(D, B);
          this.hex = D;
        }
        this.aExtInfo = new Array();
        for (var C = 0; C < z2.length; C++) {
          var G = {};
          G.critical = false;
          var F = s(D, z2[C]);
          var A = 0;
          if (F.length === 3) {
            G.critical = true;
            A = 1;
          }
          G.oid = o2.hextooidstr(c(D, z2[C], [0], "06"));
          var H = l(D, z2[C], [1 + A]);
          G.vidx = n2(D, H);
          this.aExtInfo.push(G);
        }
      };
      this.getExtInfo = function(B) {
        var z2 = this.aExtInfo;
        var C = B;
        if (!B.match(/^[0-9.]+$/)) {
          C = KJUR.asn1.x509.OID.name2oid(B);
        }
        if (C === "") {
          return void 0;
        }
        for (var A = 0; A < z2.length; A++) {
          if (z2[A].oid === C) {
            return z2[A];
          }
        }
        return void 0;
      };
      this.getCriticalExtV = function(C, z2, B) {
        if (z2 != void 0) {
          return [z2, B];
        }
        var A = this.getExtInfo(C);
        if (A == void 0) {
          return [null, null];
        }
        return [b(this.hex, A.vidx), A.critical];
      };
      this.getExtBasicConstraints = function(A, E) {
        if (A === void 0 && E === void 0) {
          var C = this.getExtInfo("basicConstraints");
          if (C === void 0) {
            return void 0;
          }
          A = b(this.hex, C.vidx);
          E = C.critical;
        }
        var z2 = { extname: "basicConstraints" };
        if (E) {
          z2.critical = true;
        }
        if (A === "3000") {
          return z2;
        }
        if (A === "30030101ff") {
          z2.cA = true;
          return z2;
        }
        if (A.substr(0, 12) === "30060101ff02") {
          var D = k(A, 10);
          var B = parseInt(D, 16);
          z2.cA = true;
          z2.pathLen = B;
          return z2;
        }
        throw new Error("hExtV parse error: " + A);
      };
      this.getExtNameConstraints = function(I, G) {
        var A = this.getCriticalExtV("nameConstraints", I, G);
        I = A[0];
        G = A[1];
        if (I == null) {
          return void 0;
        }
        var K = { extname: "nameConstraints" };
        if (G) {
          K.critical = true;
        }
        var F = s(I, 0);
        for (var D = 0; D < F.length; D++) {
          var E = [];
          var B = s(I, F[D]);
          for (var C = 0; C < B.length; C++) {
            var H = b(I, B[C]);
            var z2 = this.getGeneralSubtree(H);
            E.push(z2);
          }
          var J = I.substr(F[D], 2);
          if (J == "a0") {
            K.permit = E;
          } else {
            if (J == "a1") {
              K.exclude = E;
            }
          }
        }
        return K;
      };
      this.getGeneralSubtree = function(F) {
        var D = s(F, 0);
        var C = D.length;
        if (C < 1 || 2 < C) {
          throw new Error("wrong num elements");
        }
        var B = this.getGeneralName(b(F, D[0]));
        for (var E = 1; E < C; E++) {
          var A = F.substr(D[E], 2);
          var z2 = k(F, D[E]);
          var G = parseInt(z2, 16);
          if (A == "80") {
            B.min = G;
          }
          if (A == "81") {
            B.max = G;
          }
        }
        return B;
      };
      this.getExtKeyUsage = function(A, C) {
        var B = this.getCriticalExtV("keyUsage", A, C);
        A = B[0];
        C = B[1];
        if (A == null) {
          return void 0;
        }
        var z2 = { extname: "keyUsage" };
        if (C) {
          z2.critical = true;
        }
        z2.names = this.getExtKeyUsageString(A).split(",");
        return z2;
      };
      this.getExtKeyUsageBin = function(A) {
        if (A === void 0) {
          var B = this.getExtInfo("keyUsage");
          if (B === void 0) {
            return "";
          }
          A = b(this.hex, B.vidx);
        }
        if (A.length != 8 && A.length != 10) {
          throw new Error("malformed key usage value: " + A);
        }
        var z2 = "000000000000000" + parseInt(A.substr(6), 16).toString(2);
        if (A.length == 8) {
          z2 = z2.slice(-8);
        }
        if (A.length == 10) {
          z2 = z2.slice(-16);
        }
        z2 = z2.replace(/0+$/, "");
        if (z2 == "") {
          z2 = "0";
        }
        return z2;
      };
      this.getExtKeyUsageString = function(B) {
        var C = this.getExtKeyUsageBin(B);
        var z2 = new Array();
        for (var A = 0; A < C.length; A++) {
          if (C.substr(A, 1) == "1") {
            z2.push(X509.KEYUSAGE_NAME[A]);
          }
        }
        return z2.join(",");
      };
      this.getExtSubjectKeyIdentifier = function(B, D) {
        if (B === void 0 && D === void 0) {
          var C = this.getExtInfo("subjectKeyIdentifier");
          if (C === void 0) {
            return void 0;
          }
          B = b(this.hex, C.vidx);
          D = C.critical;
        }
        var z2 = { extname: "subjectKeyIdentifier" };
        if (D) {
          z2.critical = true;
        }
        var A = k(B, 0);
        z2.kid = { hex: A };
        return z2;
      };
      this.getExtAuthorityKeyIdentifier = function(F, D) {
        if (F === void 0 && D === void 0) {
          var z2 = this.getExtInfo("authorityKeyIdentifier");
          if (z2 === void 0) {
            return void 0;
          }
          F = b(this.hex, z2.vidx);
          D = z2.critical;
        }
        var G = { extname: "authorityKeyIdentifier" };
        if (D) {
          G.critical = true;
        }
        var E = s(F, 0);
        for (var A = 0; A < E.length; A++) {
          var H = F.substr(E[A], 2);
          if (H === "80") {
            G.kid = { hex: k(F, E[A]) };
          }
          if (H === "a1") {
            var C = b(F, E[A]);
            var B = this.getGeneralNames(C);
            G.issuer = B[0]["dn"];
          }
          if (H === "82") {
            G.sn = { hex: k(F, E[A]) };
          }
        }
        return G;
      };
      this.getExtExtKeyUsage = function(C, E) {
        if (C === void 0 && E === void 0) {
          var D = this.getExtInfo("extKeyUsage");
          if (D === void 0) {
            return void 0;
          }
          C = b(this.hex, D.vidx);
          E = D.critical;
        }
        var z2 = { extname: "extKeyUsage", array: [] };
        if (E) {
          z2.critical = true;
        }
        var A = s(C, 0);
        for (var B = 0; B < A.length; B++) {
          z2.array.push(u(k(C, A[B])));
        }
        return z2;
      };
      this.getExtExtKeyUsageName = function() {
        var D = this.getExtInfo("extKeyUsage");
        if (D === void 0) {
          return D;
        }
        var z2 = new Array();
        var C = b(this.hex, D.vidx);
        if (C === "") {
          return z2;
        }
        var A = s(C, 0);
        for (var B = 0; B < A.length; B++) {
          z2.push(u(k(C, A[B])));
        }
        return z2;
      };
      this.getExtSubjectAltName = function(A, C) {
        if (A === void 0 && C === void 0) {
          var B = this.getExtInfo("subjectAltName");
          if (B === void 0) {
            return void 0;
          }
          A = b(this.hex, B.vidx);
          C = B.critical;
        }
        var z2 = { extname: "subjectAltName", array: [] };
        if (C) {
          z2.critical = true;
        }
        z2.array = this.getGeneralNames(A);
        return z2;
      };
      this.getExtIssuerAltName = function(A, C) {
        if (A === void 0 && C === void 0) {
          var B = this.getExtInfo("issuerAltName");
          if (B === void 0) {
            return void 0;
          }
          A = b(this.hex, B.vidx);
          C = B.critical;
        }
        var z2 = { extname: "issuerAltName", array: [] };
        if (C) {
          z2.critical = true;
        }
        z2.array = this.getGeneralNames(A);
        return z2;
      };
      this.getGeneralNames = function(D) {
        var B = s(D, 0);
        var z2 = [];
        for (var C = 0; C < B.length; C++) {
          var A = this.getGeneralName(b(D, B[C]));
          if (A !== void 0) {
            z2.push(A);
          }
        }
        return z2;
      };
      this.getGeneralName = function(A) {
        var z2 = A.substr(0, 2);
        var C = k(A, 0);
        var B = hextorstr(C);
        if (z2 == "81") {
          return { rfc822: B };
        }
        if (z2 == "82") {
          return { dns: B };
        }
        if (z2 == "86") {
          return { uri: B };
        }
        if (z2 == "87") {
          return { ip: hextoip(C) };
        }
        if (z2 == "a4") {
          return { dn: this.getX500Name(C) };
        }
        if (z2 == "a0") {
          return { other: this.getOtherName(A) };
        }
        return void 0;
      };
      this.getExtSubjectAltName2 = function() {
        var D, G, F;
        var E = this.getExtInfo("subjectAltName");
        if (E === void 0) {
          return E;
        }
        var z2 = new Array();
        var C = b(this.hex, E.vidx);
        var A = s(C, 0);
        for (var B = 0; B < A.length; B++) {
          F = C.substr(A[B], 2);
          D = k(C, A[B]);
          if (F === "81") {
            G = hextoutf8(D);
            z2.push(["MAIL", G]);
          }
          if (F === "82") {
            G = hextoutf8(D);
            z2.push(["DNS", G]);
          }
          if (F === "84") {
            G = X509.hex2dn(D, 0);
            z2.push(["DN", G]);
          }
          if (F === "86") {
            G = hextoutf8(D);
            z2.push(["URI", G]);
          }
          if (F === "87") {
            G = hextoip(D);
            z2.push(["IP", G]);
          }
        }
        return z2;
      };
      this.getExtCRLDistributionPoints = function(D, F) {
        if (D === void 0 && F === void 0) {
          var E = this.getExtInfo("cRLDistributionPoints");
          if (E === void 0) {
            return void 0;
          }
          D = b(this.hex, E.vidx);
          F = E.critical;
        }
        var A = { extname: "cRLDistributionPoints", array: [] };
        if (F) {
          A.critical = true;
        }
        var B = s(D, 0);
        for (var C = 0; C < B.length; C++) {
          var z2 = b(D, B[C]);
          A.array.push(this.getDistributionPoint(z2));
        }
        return A;
      };
      this.getDistributionPoint = function(E) {
        var B = {};
        var C = s(E, 0);
        for (var D = 0; D < C.length; D++) {
          var A = E.substr(C[D], 2);
          var z2 = b(E, C[D]);
          if (A == "a0") {
            B.dpname = this.getDistributionPointName(z2);
          }
        }
        return B;
      };
      this.getDistributionPointName = function(E) {
        var B = {};
        var C = s(E, 0);
        for (var D = 0; D < C.length; D++) {
          var A = E.substr(C[D], 2);
          var z2 = b(E, C[D]);
          if (A == "a0") {
            B.full = this.getGeneralNames(z2);
          }
        }
        return B;
      };
      this.getExtCRLDistributionPointsURI = function() {
        var D = this.getExtCRLDistributionPoints();
        if (D == void 0) {
          return D;
        }
        var A = D.array;
        var z2 = [];
        for (var C = 0; C < A.length; C++) {
          try {
            if (A[C].dpname.full[0].uri != void 0) {
              z2.push(A[C].dpname.full[0].uri);
            }
          } catch (B) {
          }
        }
        return z2;
      };
      this.getExtAIAInfo = function() {
        var D = this.getExtInfo("authorityInfoAccess");
        if (D === void 0) {
          return D;
        }
        var z2 = { ocsp: [], caissuer: [] };
        var A = s(this.hex, D.vidx);
        for (var B = 0; B < A.length; B++) {
          var E = c(this.hex, A[B], [0], "06");
          var C = c(this.hex, A[B], [1], "86");
          if (E === "2b06010505073001") {
            z2.ocsp.push(hextoutf8(C));
          }
          if (E === "2b06010505073002") {
            z2.caissuer.push(hextoutf8(C));
          }
        }
        return z2;
      };
      this.getExtAuthorityInfoAccess = function(G, E) {
        if (G === void 0 && E === void 0) {
          var z2 = this.getExtInfo("authorityInfoAccess");
          if (z2 === void 0) {
            return void 0;
          }
          G = b(this.hex, z2.vidx);
          E = z2.critical;
        }
        var H = { extname: "authorityInfoAccess", array: [] };
        if (E) {
          H.critical = true;
        }
        var F = s(G, 0);
        for (var A = 0; A < F.length; A++) {
          var D = p(G, F[A], [0], "06");
          var B = c(G, F[A], [1], "86");
          var C = hextoutf8(B);
          if (D == "2b06010505073001") {
            H.array.push({ ocsp: C });
          } else {
            if (D == "2b06010505073002") {
              H.array.push({ caissuer: C });
            } else {
              throw new Error("unknown method: " + D);
            }
          }
        }
        return H;
      };
      this.getExtCertificatePolicies = function(D, G) {
        if (D === void 0 && G === void 0) {
          var F = this.getExtInfo("certificatePolicies");
          if (F === void 0) {
            return void 0;
          }
          D = b(this.hex, F.vidx);
          G = F.critical;
        }
        var z2 = { extname: "certificatePolicies", array: [] };
        if (G) {
          z2.critical = true;
        }
        var A = s(D, 0);
        for (var B = 0; B < A.length; B++) {
          var E = b(D, A[B]);
          var C = this.getPolicyInformation(E);
          z2.array.push(C);
        }
        return z2;
      };
      this.getPolicyInformation = function(D) {
        var z2 = {};
        var F = c(D, 0, [0], "06");
        z2.policyoid = u(F);
        var G = f(D, 0, [1], "30");
        if (G != -1) {
          z2.array = [];
          var A = s(D, G);
          for (var B = 0; B < A.length; B++) {
            var E = b(D, A[B]);
            var C = this.getPolicyQualifierInfo(E);
            z2.array.push(C);
          }
        }
        return z2;
      };
      this.getOtherName = function(B) {
        var z2 = {};
        var A = s(B, 0);
        var D = c(B, A[0], [], "06");
        var C = c(B, A[1], []);
        z2.oid = u(D);
        z2.value = j(C);
        return z2;
      };
      this.getPolicyQualifierInfo = function(A) {
        var z2 = {};
        var B = c(A, 0, [0], "06");
        if (B === "2b06010505070201") {
          var D = p(A, 0, [1], "16");
          z2.cps = hextorstr(D);
        } else {
          if (B === "2b06010505070202") {
            var C = a(A, 0, [1], "30");
            z2.unotice = this.getUserNotice(C);
          }
        }
        return z2;
      };
      this.getUserNotice = function(B) {
        var D = null;
        var z2 = {};
        try {
          D = o2.parse(B);
          var C = this._asn1ToUnotice(D);
          return C;
        } catch (A) {
          return void 0;
        }
      };
      this._asn1ToUnotice = function(E) {
        try {
          var z2 = {};
          var A = aryval(E, "seq");
          for (var C = 0; C < A.length; C++) {
            var D = this._asn1ToNoticeRef(A[C]);
            if (D != void 0) {
              z2.noticeref = D;
            }
            var F = this.asn1ToDisplayText(A[C]);
            if (F != void 0) {
              z2.exptext = F;
            }
          }
          if (Object.keys(z2).length > 0) {
            return z2;
          }
          return void 0;
        } catch (B) {
          return void 0;
        }
      };
      this._asn1ToNoticeRef = function(F) {
        try {
          var A = {};
          var B = aryval(F, "seq");
          for (var D = 0; D < B.length; D++) {
            var E = this._asn1ToNoticeNum(B[D]);
            if (E != void 0) {
              A.noticenum = E;
            }
            var z2 = this.asn1ToDisplayText(B[D]);
            if (z2 != void 0) {
              A.org = z2;
            }
          }
          if (Object.keys(A).length > 0) {
            return A;
          }
          return void 0;
        } catch (C) {
          return void 0;
        }
      };
      this._asn1ToNoticeNum = function(E) {
        try {
          var A = aryval(E, "seq");
          var z2 = [];
          for (var C = 0; C < A.length; C++) {
            var D = A[C];
            z2.push(parseInt(aryval(D, "int.hex"), 16));
          }
          return z2;
        } catch (B) {
          return void 0;
        }
      };
      this.getDisplayText = function(A) {
        var B = { "0c": "utf8", "16": "ia5", "1a": "vis", "1e": "bmp" };
        var z2 = {};
        z2.type = B[A.substr(0, 2)];
        z2.str = hextorstr(k(A, 0));
        return z2;
      };
      this.asn1ToDisplayText = function(z2) {
        if (z2.utf8str != void 0) {
          return { type: "utf8", str: z2.utf8str.str };
        }
        if (z2.ia5str != void 0) {
          return { type: "ia5", str: z2.ia5str.str };
        }
        if (z2.visstr != void 0) {
          return { type: "vis", str: z2.visstr.str };
        }
        if (z2.bmpstr != void 0) {
          return { type: "bmp", str: z2.bmpstr.str };
        }
        if (z2.prnstr != void 0) {
          return { type: "prn", str: z2.prnstr.str };
        }
        return void 0;
      };
      this.getExtPolicyMappings = function(G, E) {
        var z2 = this.getCriticalExtV("policyMappings", G, E);
        G = z2[0];
        E = z2[1];
        if (G == null) {
          return void 0;
        }
        var I = { extname: "policyMappings" };
        if (E) {
          I.critical = true;
        }
        try {
          var A = j(G);
          var B = A.seq;
          var F = [];
          for (var C = 0; C < B.length; C++) {
            var H = B[C].seq;
            F.push([H[0].oid, H[1].oid]);
          }
          I.array = F;
        } catch (D) {
          throw new m("malformed policyMappings");
        }
        return I;
      };
      this.getExtPolicyConstraints = function(G, D) {
        var z2 = this.getCriticalExtV("policyConstraints", G, D);
        G = z2[0];
        D = z2[1];
        if (G == null) {
          return void 0;
        }
        var H = { extname: "policyConstraints" };
        if (D) {
          H.critical = true;
        }
        var A = j(G);
        try {
          var F = A.seq;
          for (var B = 0; B < F.length; B++) {
            var E = F[B].tag;
            if (E.explicit != false) {
              continue;
            }
            if (E.tag == "80") {
              H.reqexp = parseInt(E.hex, 16);
            }
            if (E.tag == "81") {
              H.inhibit = parseInt(E.hex, 16);
            }
          }
        } catch (C) {
          return new m("malformed policyConstraints value");
        }
        return H;
      };
      this.getExtInhibitAnyPolicy = function(A, D) {
        var C = this.getCriticalExtV("inhibitAnyPolicy", A, D);
        A = C[0];
        D = C[1];
        if (A == null) {
          return void 0;
        }
        var z2 = { extname: "inhibitAnyPolicy" };
        if (D) {
          z2.critical = true;
        }
        var B = x(A, 0);
        if (B == -1) {
          return new m("wrong value");
        }
        z2.skip = B;
        return z2;
      };
      this.getExtCRLNumber = function(A, B) {
        var z2 = { extname: "cRLNumber" };
        if (B) {
          z2.critical = true;
        }
        if (A.substr(0, 2) == "02") {
          z2.num = { hex: k(A, 0) };
          return z2;
        }
        throw new m("hExtV parse error: " + A);
      };
      this.getExtCRLReason = function(A, B) {
        var z2 = { extname: "cRLReason" };
        if (B) {
          z2.critical = true;
        }
        if (A.substr(0, 2) == "0a") {
          z2.code = parseInt(k(A, 0), 16);
          return z2;
        }
        throw new Error("hExtV parse error: " + A);
      };
      this.getExtOcspNonce = function(A, C) {
        var z2 = { extname: "ocspNonce" };
        if (C) {
          z2.critical = true;
        }
        var B = k(A, 0);
        z2.hex = B;
        return z2;
      };
      this.getExtOcspNoCheck = function(A, B) {
        var z2 = { extname: "ocspNoCheck" };
        if (B) {
          z2.critical = true;
        }
        return z2;
      };
      this.getExtAdobeTimeStamp = function(C, F) {
        if (C === void 0 && F === void 0) {
          var E = this.getExtInfo("adobeTimeStamp");
          if (E === void 0) {
            return void 0;
          }
          C = b(this.hex, E.vidx);
          F = E.critical;
        }
        var z2 = { extname: "adobeTimeStamp" };
        if (F) {
          z2.critical = true;
        }
        var B = s(C, 0);
        if (B.length > 1) {
          var G = b(C, B[1]);
          var A = this.getGeneralName(G);
          if (A.uri != void 0) {
            z2.uri = A.uri;
          }
        }
        if (B.length > 2) {
          var D = b(C, B[2]);
          if (D == "0101ff") {
            z2.reqauth = true;
          }
          if (D == "010100") {
            z2.reqauth = false;
          }
        }
        return z2;
      };
      this.getExtSubjectDirectoryAttributes = function(I, H) {
        if (I === void 0 && H === void 0) {
          var B = this.getExtInfo("subjectDirectoryAttributes");
          if (B === void 0) {
            return void 0;
          }
          I = b(this.hex, B.vidx);
          H = B.critical;
        }
        var J = { extname: "subjectDirectoryAttributes" };
        if (H) {
          J.critical = true;
        }
        try {
          var z2 = j(I);
          var D = [];
          for (var E = 0; E < z2.seq.length; E++) {
            var A = z2.seq[E];
            var C = aryval(A, "seq.0.oid");
            var F = aryval(A, "seq.1.set");
            if (C == void 0 || F == void 0) {
              throw "error";
            }
            D.push({ attr: C, array: F });
          }
          J.array = D;
          return J;
        } catch (G) {
          throw new Error("malformed subjectDirectoryAttributes extension value");
        }
      };
      var e2 = /* @__PURE__ */ __name2(function(E) {
        var z2 = {};
        try {
          var B = E.seq[0].oid;
          var D = KJUR.asn1.x509.OID.name2oid(B);
          z2.type = KJUR.asn1.x509.OID.oid2atype(D);
          var A = E.seq[1];
          if (A.utf8str != void 0) {
            z2.ds = "utf8";
            z2.value = A.utf8str.str;
          } else {
            if (A.numstr != void 0) {
              z2.ds = "num";
              z2.value = A.numstr.str;
            } else {
              if (A.telstr != void 0) {
                z2.ds = "tel";
                z2.value = A.telstr.str;
              } else {
                if (A.prnstr != void 0) {
                  z2.ds = "prn";
                  z2.value = A.prnstr.str;
                } else {
                  if (A.ia5str != void 0) {
                    z2.ds = "ia5";
                    z2.value = A.ia5str.str;
                  } else {
                    if (A.visstr != void 0) {
                      z2.ds = "vis";
                      z2.value = A.visstr.str;
                    } else {
                      if (A.bmpstr != void 0) {
                        z2.ds = "bmp";
                        z2.value = A.bmpstr.str;
                      } else {
                        throw "error";
                      }
                    }
                  }
                }
              }
            }
          }
          return z2;
        } catch (C) {
          throw new Erorr("improper ASN.1 parsed AttrTypeAndValue");
        }
      }, "e2");
      var i = /* @__PURE__ */ __name2(function(A) {
        try {
          return A.set.map(function(B) {
            return e2(B);
          });
        } catch (z2) {
          throw new Error("improper ASN.1 parsed RDN: " + z2);
        }
      }, "i");
      var h = /* @__PURE__ */ __name2(function(A) {
        try {
          return A.seq.map(function(B) {
            return i(B);
          });
        } catch (z2) {
          throw new Error("improper ASN.1 parsed X500Name: " + z2);
        }
      }, "h");
      this.getX500NameRule = function(z2) {
        var G = true;
        var K = true;
        var J = false;
        var A = "";
        var D = "";
        var M = null;
        var H = [];
        for (var C = 0; C < z2.length; C++) {
          var E = z2[C];
          for (var B = 0; B < E.length; B++) {
            H.push(E[B]);
          }
        }
        for (var C = 0; C < H.length; C++) {
          var L = H[C];
          var N = L.ds;
          var I = L.value;
          var F = L.type;
          A += ":" + N;
          if (N != "prn" && N != "utf8" && N != "ia5") {
            return "mixed";
          }
          if (N == "ia5") {
            if (F != "CN") {
              return "mixed";
            } else {
              if (!KJUR.lang.String.isMail(I)) {
                return "mixed";
              } else {
                continue;
              }
            }
          }
          if (F == "C") {
            if (N == "prn") {
              continue;
            } else {
              return "mixed";
            }
          }
          D += ":" + N;
          if (M == null) {
            M = N;
          } else {
            if (M !== N) {
              return "mixed";
            }
          }
        }
        if (M == null) {
          return "prn";
        } else {
          return M;
        }
      };
      this.getAttrTypeAndValue = function(z2) {
        var A = j(z2);
        return e2(A);
      };
      this.getRDN = function(z2) {
        var A = j(z2);
        return i(A);
      };
      this.getX500NameArray = function(z2) {
        var A = j(z2);
        return h(A);
      };
      this.getX500Name = function(C, E, D) {
        var A = this.getX500NameArray(C);
        var B = this.dnarraytostr(A);
        var z2 = { str: B };
        z2.array = A;
        if (D == true) {
          z2.hex = C;
        }
        if (E == true) {
          z2.canon = this.c14nRDNArray(A);
        }
        return z2;
      };
      this.readCertPEM = function(z2) {
        this.readCertHex(w(z2));
      };
      this.readCertHex = function(z2) {
        this.hex = z2;
        this.getVersion();
        try {
          l(this.hex, 0, [0, 7], "a3");
          this.parseExt();
        } catch (A) {
        }
      };
      this.getParam = function(A) {
        var z2 = {};
        if (A == void 0) {
          A = {};
        }
        z2.version = this.getVersion();
        z2.serial = { hex: this.getSerialNumberHex() };
        z2.sigalg = this.getSignatureAlgorithmField();
        z2.issuer = this.getIssuer(A.dncanon, A.dnhex);
        z2.notbefore = this.getNotBefore();
        z2.notafter = this.getNotAfter();
        z2.subject = this.getSubject(A.dncanon, A.dnhex);
        z2.sbjpubkey = hextopem(this.getPublicKeyHex(), "PUBLIC KEY");
        if (this.aExtInfo != void 0 && this.aExtInfo.length > 0) {
          z2.ext = this.getExtParamArray();
        }
        z2.sighex = this.getSignatureValueHex();
        if (A.tbshex == true) {
          z2.tbshex = a(this.hex, 0, [0]);
        }
        if (A.nodnarray == true) {
          delete z2.issuer.array;
          delete z2.subject.array;
        }
        return z2;
      };
      this.getExtParamArray = function(A) {
        if (A == void 0) {
          var C = f(this.hex, 0, [0, "[3]"]);
          if (C != -1) {
            A = q(this.hex, 0, [0, "[3]", 0], "30");
          }
        }
        var z2 = [];
        var B = s(A, 0);
        for (var D = 0; D < B.length; D++) {
          var F = b(A, B[D]);
          var E = this.getExtParam(F);
          if (E != null) {
            z2.push(E);
          }
        }
        return z2;
      };
      this.getExtParam = function(A) {
        var I = {};
        var C = s(A, 0);
        var E = C.length;
        if (E != 2 && E != 3) {
          throw new Error("wrong number elements in Extension: " + E + " " + A);
        }
        var B = r2(c(A, 0, [0], "06"));
        var G = false;
        if (E == 3 && a(A, 0, [1]) == "0101ff") {
          G = true;
        }
        var H = a(A, 0, [E - 1, 0]);
        var F = void 0;
        if (B == "2.5.29.14") {
          F = this.getExtSubjectKeyIdentifier(H, G);
        } else {
          if (B == "2.5.29.15") {
            F = this.getExtKeyUsage(H, G);
          } else {
            if (B == "2.5.29.17") {
              F = this.getExtSubjectAltName(H, G);
            } else {
              if (B == "2.5.29.18") {
                F = this.getExtIssuerAltName(H, G);
              } else {
                if (B == "2.5.29.19") {
                  F = this.getExtBasicConstraints(H, G);
                } else {
                  if (B == "2.5.29.30") {
                    F = this.getExtNameConstraints(H, G);
                  } else {
                    if (B == "2.5.29.31") {
                      F = this.getExtCRLDistributionPoints(H, G);
                    } else {
                      if (B == "2.5.29.32") {
                        F = this.getExtCertificatePolicies(H, G);
                      } else {
                        if (B == "2.5.29.33") {
                          F = this.getExtPolicyMappings(H, G);
                        } else {
                          if (B == "2.5.29.35") {
                            F = this.getExtAuthorityKeyIdentifier(H, G);
                          } else {
                            if (B == "2.5.29.36") {
                              F = this.getExtPolicyConstraints(H, G);
                            } else {
                              if (B == "2.5.29.37") {
                                F = this.getExtExtKeyUsage(H, G);
                              } else {
                                if (B == "2.5.29.54") {
                                  F = this.getExtInhibitAnyPolicy(H, G);
                                } else {
                                  if (B == "1.3.6.1.5.5.7.1.1") {
                                    F = this.getExtAuthorityInfoAccess(H, G);
                                  } else {
                                    if (B == "2.5.29.20") {
                                      F = this.getExtCRLNumber(H, G);
                                    } else {
                                      if (B == "2.5.29.21") {
                                        F = this.getExtCRLReason(H, G);
                                      } else {
                                        if (B == "2.5.29.9") {
                                          F = this.getExtSubjectDirectoryAttributes(H, G);
                                        } else {
                                          if (B == "1.3.6.1.5.5.7.48.1.2") {
                                            F = this.getExtOcspNonce(H, G);
                                          } else {
                                            if (B == "1.3.6.1.5.5.7.48.1.5") {
                                              F = this.getExtOcspNoCheck(H, G);
                                            } else {
                                              if (B == "1.2.840.113583.1.1.9.1") {
                                                F = this.getExtAdobeTimeStamp(H, G);
                                              } else {
                                                if (X509.EXT_PARSER[B] != void 0) {
                                                  F = X509.EXT_PARSER[B](B, G, H);
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        if (F != void 0) {
          return F;
        }
        var z2 = { extname: B, extn: H };
        try {
          z2.extn = j(H);
        } catch (D) {
        }
        if (G) {
          z2.critical = true;
        }
        return z2;
      };
      this.findExt = function(A, B) {
        for (var z2 = 0; z2 < A.length; z2++) {
          if (A[z2].extname == B) {
            return A[z2];
          }
        }
        return null;
      };
      this.updateExtCDPFullURI = function(D, z2) {
        var C = this.findExt(D, "cRLDistributionPoints");
        if (C == null) {
          return;
        }
        if (C.array == void 0) {
          return;
        }
        var F = C.array;
        for (var B = 0; B < F.length; B++) {
          if (F[B].dpname == void 0) {
            continue;
          }
          if (F[B].dpname.full == void 0) {
            continue;
          }
          var G = F[B].dpname.full;
          for (var A = 0; A < G.length; A++) {
            var E = G[B];
            if (E.uri == void 0) {
              continue;
            }
            E.uri = z2;
          }
        }
      };
      this.updateExtAIAOCSP = function(D, A) {
        var C = this.findExt(D, "authorityInfoAccess");
        if (C == null) {
          return;
        }
        if (C.array == void 0) {
          return;
        }
        var z2 = C.array;
        for (var B = 0; B < z2.length; B++) {
          if (z2[B].ocsp != void 0) {
            z2[B].ocsp = A;
          }
        }
      };
      this.updateExtAIACAIssuer = function(D, A) {
        var C = this.findExt(D, "authorityInfoAccess");
        if (C == null) {
          return;
        }
        if (C.array == void 0) {
          return;
        }
        var z2 = C.array;
        for (var B = 0; B < z2.length; B++) {
          if (z2[B].caissuer != void 0) {
            z2[B].caissuer = A;
          }
        }
      };
      this.dnarraytostr = function(B) {
        function z2(C) {
          return C.map(function(D) {
            return A(D).replace(/\+/, "\\+");
          }).join("+");
        }
        __name(z2, "z2");
        __name2(z2, "z2");
        function A(C) {
          return C.type + "=" + C.value;
        }
        __name(A, "A");
        __name2(A, "A");
        return "/" + B.map(function(C) {
          return z2(C).replace(/\//, "\\/");
        }).join("/");
      };
      this.setCanonicalizedDN = function(A) {
        var C;
        if (A.str != void 0 && A.array == void 0) {
          var B = new KJUR.asn1.x509.X500Name({ str: A.str });
          var z2 = B.tohex();
          C = this.getX500NameArray(z2);
        } else {
          C = A.array;
        }
        if (A.canon == void 0) {
          A.canon = this.c14nRDNArray(C);
        }
      };
      this.c14nRDNArray = function(G) {
        var A = [];
        for (var C = 0; C < G.length; C++) {
          var E = G[C];
          var z2 = [];
          for (var B = 0; B < E.length; B++) {
            var D = E[B];
            var F = D.value;
            F = F.replace(/^\s*/, "");
            F = F.replace(/\s*$/, "");
            F = F.replace(/\s+/g, " ");
            F = F.toLowerCase();
            z2.push(D.type.toLowerCase() + "=" + F);
          }
          A.push(z2.join("+"));
        }
        return "/" + A.join("/");
      };
      this.getInfo = function() {
        var A = /* @__PURE__ */ __name2(function(W) {
          var ac = "";
          var U = "    ";
          var Y = "\n";
          var Z = W.array;
          for (var X = 0; X < Z.length; X++) {
            var V = Z[X];
            if (V.dn != void 0) {
              ac += U + "dn: " + V.dn.str + Y;
            }
            if (V.ip != void 0) {
              ac += U + "ip: " + V.ip + Y;
            }
            if (V.rfc822 != void 0) {
              ac += U + "rfc822: " + V.rfc822 + Y;
            }
            if (V.dns != void 0) {
              ac += U + "dns: " + V.dns + Y;
            }
            if (V.uri != void 0) {
              ac += U + "uri: " + V.uri + Y;
            }
            if (V.other != void 0) {
              var ab = V.other.oid;
              var aa = JSON.stringify(V.other.value).replace(/\"/g, "");
              ac += U + "other: " + ab + "=" + aa + Y;
            }
          }
          ac = ac.replace(/\n$/, "");
          return ac;
        }, "A");
        var H = /* @__PURE__ */ __name2(function(aa) {
          var Y = "";
          var U = aa.array;
          for (var X = 0; X < U.length; X++) {
            var Z = U[X];
            Y += "    policy oid: " + Z.policyoid + "\n";
            if (Z.array === void 0) {
              continue;
            }
            for (var W = 0; W < Z.array.length; W++) {
              var V = Z.array[W];
              if (V.cps !== void 0) {
                Y += "    cps: " + V.cps + "\n";
              }
            }
          }
          return Y;
        }, "H");
        var K = /* @__PURE__ */ __name2(function(Y) {
          var X = "";
          var U = Y.array;
          for (var W = 0; W < U.length; W++) {
            var Z = U[W];
            try {
              if (Z.dpname.full[0].uri !== void 0) {
                X += "    " + Z.dpname.full[0].uri + "\n";
              }
            } catch (V) {
            }
            try {
              if (Z.dname.full[0].dn.hex !== void 0) {
                X += "    " + X509.hex2dn(Z.dpname.full[0].dn.hex) + "\n";
              }
            } catch (V) {
            }
          }
          return X;
        }, "K");
        var I = /* @__PURE__ */ __name2(function(Y) {
          var X = "";
          var U = Y.array;
          for (var V = 0; V < U.length; V++) {
            var W = U[V];
            if (W.caissuer !== void 0) {
              X += "    caissuer: " + W.caissuer + "\n";
            }
            if (W.ocsp !== void 0) {
              X += "    ocsp: " + W.ocsp + "\n";
            }
          }
          return X;
        }, "I");
        var B = X509;
        var M, L, T;
        M = "Basic Fields\n";
        M += "  serial number: " + this.getSerialNumberHex() + "\n";
        M += "  signature algorithm: " + this.getSignatureAlgorithmField() + "\n";
        M += "  issuer: " + this.getIssuerString() + "\n";
        M += "  notBefore: " + this.getNotBefore() + "\n";
        M += "  notAfter: " + this.getNotAfter() + "\n";
        M += "  subject: " + this.getSubjectString() + "\n";
        M += "  subject public key info: \n";
        L = this.getPublicKey();
        M += "    key algorithm: " + L.type + "\n";
        if (L.type === "RSA") {
          M += "    n=" + hextoposhex(L.n.toString(16)).substr(0, 16) + "...\n";
          M += "    e=" + hextoposhex(L.e.toString(16)) + "\n";
        }
        T = this.aExtInfo;
        if (T !== void 0 && T !== null) {
          M += "X509v3 Extensions:\n";
          for (var P = 0; P < T.length; P++) {
            var R = T[P];
            var z2 = KJUR.asn1.x509.OID.oid2name(R.oid);
            if (z2 === "") {
              z2 = R.oid;
            }
            var O = "";
            if (R.critical === true) {
              O = "CRITICAL";
            }
            M += "  " + z2 + " " + O + ":\n";
            if (z2 === "basicConstraints") {
              var C = this.getExtBasicConstraints();
              if (C.cA === void 0) {
                M += "    {}\n";
              } else {
                M += "    cA=true";
                if (C.pathLen !== void 0) {
                  M += ", pathLen=" + C.pathLen;
                }
                M += "\n";
              }
            } else {
              if (z2 == "policyMappings") {
                var S = this.getExtPolicyMappings().array;
                var G = S.map(function(U) {
                  var V = U;
                  return V[0] + ":" + V[1];
                }).join(", ");
                M += "    " + G + "\n";
              } else {
                if (z2 == "policyConstraints") {
                  var N = this.getExtPolicyConstraints();
                  M += "    ";
                  if (N.reqexp != void 0) {
                    M += " reqexp=" + N.reqexp;
                  }
                  if (N.inhibit != void 0) {
                    M += " inhibit=" + N.inhibit;
                  }
                  M += "\n";
                } else {
                  if (z2 == "inhibitAnyPolicy") {
                    var N = this.getExtInhibitAnyPolicy();
                    M += "    skip=" + N.skip + "\n";
                  } else {
                    if (z2 == "keyUsage") {
                      M += "    " + this.getExtKeyUsageString() + "\n";
                    } else {
                      if (z2 == "subjectKeyIdentifier") {
                        M += "    " + this.getExtSubjectKeyIdentifier().kid.hex + "\n";
                      } else {
                        if (z2 == "authorityKeyIdentifier") {
                          var D = this.getExtAuthorityKeyIdentifier();
                          if (D.kid !== void 0) {
                            M += "    kid=" + D.kid.hex + "\n";
                          }
                        } else {
                          if (z2 == "extKeyUsage") {
                            var Q = this.getExtExtKeyUsage().array;
                            M += "    " + Q.join(", ") + "\n";
                          } else {
                            if (z2 == "subjectAltName") {
                              var E = A(this.getExtSubjectAltName());
                              M += E + "\n";
                            } else {
                              if (z2 == "cRLDistributionPoints") {
                                var J = this.getExtCRLDistributionPoints();
                                M += K(J);
                              } else {
                                if (z2 == "authorityInfoAccess") {
                                  var F = this.getExtAuthorityInfoAccess();
                                  M += I(F);
                                } else {
                                  if (z2 == "certificatePolicies") {
                                    M += H(this.getExtCertificatePolicies());
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        M += "signature algorithm: " + this.getSignatureAlgorithmName() + "\n";
        M += "signature: " + this.getSignatureValueHex().substr(0, 16) + "...\n";
        return M;
      };
      if (typeof v == "string") {
        if (v.indexOf("-----BEGIN") != -1) {
          this.readCertPEM(v);
        } else {
          if (KJUR.lang.String.isHex(v)) {
            this.readCertHex(v);
          }
        }
      }
    }
    __name(X509, "X509");
    __name2(X509, "X509");
    X509.EXT_PARSER = {};
    X509.registExtParser = function(b, a) {
      X509.EXT_PARSER[b] = a;
    };
    X509.hex2dn = function(e2, b) {
      if (b === void 0) {
        b = 0;
      }
      var a = new X509();
      var c = ASN1HEX.getTLV(e2, b);
      var d = a.getX500Name(e2);
      return d.str;
    };
    X509.hex2rdn = function(f, b) {
      if (b === void 0) {
        b = 0;
      }
      if (f.substr(b, 2) !== "31") {
        throw new Error("malformed RDN");
      }
      var c = new Array();
      var d = ASN1HEX.getChildIdx(f, b);
      for (var e2 = 0; e2 < d.length; e2++) {
        c.push(X509.hex2attrTypeValue(f, d[e2]));
      }
      c = c.map(function(a) {
        return a.replace("+", "\\+");
      });
      return c.join("+");
    };
    X509.hex2attrTypeValue = function(d, i) {
      var j = ASN1HEX;
      var h = j.getV;
      if (i === void 0) {
        i = 0;
      }
      if (d.substr(i, 2) !== "30") {
        throw new Error("malformed attribute type and value");
      }
      var g = j.getChildIdx(d, i);
      if (g.length !== 2 || d.substr(g[0], 2) !== "06") {
        "malformed attribute type and value";
      }
      var b = h(d, g[0]);
      var f = KJUR.asn1.ASN1Util.oidHexToInt(b);
      var e2 = KJUR.asn1.x509.OID.oid2atype(f);
      var a = h(d, g[1]);
      var c = hextorstr(a);
      return e2 + "=" + c;
    };
    X509.getPublicKeyFromCertHex = function(b) {
      var a = new X509();
      a.readCertHex(b);
      return a.getPublicKey();
    };
    X509.getPublicKeyFromCertPEM = function(b) {
      var a = new X509();
      a.readCertPEM(b);
      return a.getPublicKey();
    };
    X509.getPublicKeyInfoPropOfCertPEM = function(c) {
      var e2 = ASN1HEX;
      var g = e2.getVbyList;
      var b = {};
      var a, f, d;
      b.algparam = null;
      a = new X509();
      a.readCertPEM(c);
      f = a.getPublicKeyHex();
      b.keyhex = g(f, 0, [1], "03").substr(2);
      b.algoid = g(f, 0, [0, 0], "06");
      if (b.algoid === "2a8648ce3d0201") {
        b.algparam = g(f, 0, [0, 1], "06");
      }
      return b;
    };
    X509.KEYUSAGE_NAME = ["digitalSignature", "nonRepudiation", "keyEncipherment", "dataEncipherment", "keyAgreement", "keyCertSign", "cRLSign", "encipherOnly", "decipherOnly"];
    var X509CRL = /* @__PURE__ */ __name2(function(e2) {
      var a = KJUR, f = a.lang.String.isHex, m = ASN1HEX, k = m.getV, b = m.getTLV, h = m.getVbyList, c = m.getTLVbyList, d = m.getTLVbyListEx, i = m.getIdxbyList, g = m.getIdxbyListEx, l = m.getChildIdx, j = new X509();
      this.hex = null;
      this.posSigAlg = null;
      this.posRevCert = null;
      this.parsed = null;
      this._setPos = function() {
        var o2 = i(this.hex, 0, [0, 0]);
        var n2 = this.hex.substr(o2, 2);
        if (n2 == "02") {
          this.posSigAlg = 1;
        } else {
          if (n2 == "30") {
            this.posSigAlg = 0;
          } else {
            throw new Error("malformed 1st item of TBSCertList: " + n2);
          }
        }
        var s = i(this.hex, 0, [0, this.posSigAlg + 3]);
        var r2 = this.hex.substr(s, 2);
        if (r2 == "17" || r2 == "18") {
          var q, p;
          q = i(this.hex, 0, [0, this.posSigAlg + 4]);
          this.posRevCert = null;
          if (q != -1) {
            p = this.hex.substr(q, 2);
            if (p == "30") {
              this.posRevCert = this.posSigAlg + 4;
            }
          }
        } else {
          if (r2 == "30") {
            this.posRevCert = this.posSigAlg + 3;
          } else {
            if (r2 == "a0") {
              this.posRevCert = null;
            } else {
              throw new Error("malformed nextUpdate or revCert tag: " + r2);
            }
          }
        }
      };
      this.getVersion = function() {
        if (this.posSigAlg == 0) {
          return null;
        }
        return parseInt(h(this.hex, 0, [0, 0], "02"), 16) + 1;
      };
      this.getSignatureAlgorithmField = function() {
        var n2 = c(this.hex, 0, [0, this.posSigAlg], "30");
        return j.getAlgorithmIdentifierName(n2);
      };
      this.getIssuer = function() {
        return j.getX500Name(this.getIssuerHex());
      };
      this.getIssuerHex = function() {
        return c(this.hex, 0, [0, this.posSigAlg + 1], "30");
      };
      this.getThisUpdate = function() {
        var n2 = h(this.hex, 0, [0, this.posSigAlg + 2]);
        return result = hextorstr(n2);
      };
      this.getNextUpdate = function() {
        var o2 = i(this.hex, 0, [0, this.posSigAlg + 3]);
        var n2 = this.hex.substr(o2, 2);
        if (n2 != "17" && n2 != "18") {
          return null;
        }
        return hextorstr(k(this.hex, o2));
      };
      this.getRevCertArray = function() {
        if (this.posRevCert == null) {
          return null;
        }
        var o2 = [];
        var n2 = i(this.hex, 0, [0, this.posRevCert]);
        var p = l(this.hex, n2);
        for (var q = 0; q < p.length; q++) {
          var r2 = b(this.hex, p[q]);
          o2.push(this.getRevCert(r2));
        }
        return o2;
      };
      this.getRevCert = function(p) {
        var o2 = {};
        var n2 = l(p, 0);
        o2.sn = { hex: h(p, 0, [0], "02") };
        o2.date = hextorstr(h(p, 0, [1]));
        if (n2.length == 3) {
          o2.ext = j.getExtParamArray(c(p, 0, [2]));
        }
        return o2;
      };
      this.findRevCert = function(p) {
        var n2 = new X509(p);
        var o2 = n2.getSerialNumberHex();
        return this.findRevCertBySN(o2);
      };
      this.findRevCertBySN = function(o2) {
        if (this.parsed == null) {
          this.getParam();
        }
        if (this.parsed.revcert == null) {
          return null;
        }
        var n2 = this.parsed.revcert;
        for (var p = 0; p < n2.length; p++) {
          if (o2 == n2[p].sn.hex) {
            return n2[p];
          }
        }
        return null;
      };
      this.getSignatureValueHex = function() {
        return h(this.hex, 0, [2], "03", true);
      };
      this.verifySignature = function(o2) {
        var p = this.getSignatureAlgorithmField();
        var n2 = this.getSignatureValueHex();
        var q = c(this.hex, 0, [0], "30");
        var r2 = new KJUR.crypto.Signature({ alg: p });
        r2.init(o2);
        r2.updateHex(q);
        return r2.verify(n2);
      };
      this.getParam = function(r2) {
        var n2 = {};
        var p = this.getVersion();
        if (p != null) {
          n2.version = p;
        }
        n2.sigalg = this.getSignatureAlgorithmField();
        n2.issuer = this.getIssuer();
        n2.thisupdate = this.getThisUpdate();
        var q = this.getNextUpdate();
        if (q != null) {
          n2.nextupdate = q;
        }
        var t3 = this.getRevCertArray();
        if (t3 != null) {
          n2.revcert = t3;
        }
        var s = g(this.hex, 0, [0, "[0]"]);
        if (s != -1) {
          var o2 = d(this.hex, 0, [0, "[0]", 0]);
          n2.ext = j.getExtParamArray(o2);
        }
        n2.sighex = this.getSignatureValueHex();
        this.parsed = n2;
        if (typeof r2 == "object") {
          if (r2.tbshex == true) {
            n2.tbshex = c(this.hex, 0, [0]);
          }
          if (r2.nodnarray == true) {
            delete n2.issuer.array;
          }
        }
        return n2;
      };
      if (typeof e2 == "string") {
        if (f(e2)) {
          this.hex = e2;
        } else {
          if (e2.match(/-----BEGIN X509 CRL/)) {
            this.hex = pemtohex(e2);
          }
        }
        this._setPos();
      }
    }, "X509CRL");
    if (typeof KJUR == "undefined" || !KJUR) {
      KJUR = {};
    }
    if (typeof KJUR.jws == "undefined" || !KJUR.jws) {
      KJUR.jws = {};
    }
    KJUR.jws.JWS = function() {
      var b = KJUR, a = b.jws.JWS, c = a.isSafeJSONString;
      this.parseJWS = function(g, j) {
        if (this.parsedJWS !== void 0 && (j || this.parsedJWS.sigvalH !== void 0)) {
          return;
        }
        var i = g.match(/^([^.]+)\.([^.]+)\.([^.]+)$/);
        if (i == null) {
          throw "JWS signature is not a form of 'Head.Payload.SigValue'.";
        }
        var k = i[1];
        var e2 = i[2];
        var l = i[3];
        var n2 = k + "." + e2;
        this.parsedJWS = {};
        this.parsedJWS.headB64U = k;
        this.parsedJWS.payloadB64U = e2;
        this.parsedJWS.sigvalB64U = l;
        this.parsedJWS.si = n2;
        if (!j) {
          var h = b64utohex(l);
          var f = parseBigInt(h, 16);
          this.parsedJWS.sigvalH = h;
          this.parsedJWS.sigvalBI = f;
        }
        var d = b64utoutf8(k);
        var m = b64utoutf8(e2);
        this.parsedJWS.headS = d;
        this.parsedJWS.payloadS = m;
        if (!c(d, this.parsedJWS, "headP")) {
          throw "malformed JSON string for JWS Head: " + d;
        }
      };
    };
    KJUR.jws.JWS.sign = function(j, w, z2, A, a) {
      var x = KJUR, n2 = x.jws, r2 = n2.JWS, h = r2.readSafeJSONString, q = r2.isSafeJSONString, d = x.crypto, l = d.ECDSA, p = d.Mac, c = d.Signature, u = JSON;
      var t3, k, o2;
      if (typeof w != "string" && typeof w != "object") {
        throw "spHeader must be JSON string or object: " + w;
      }
      if (typeof w == "object") {
        k = w;
        t3 = u.stringify(k);
      }
      if (typeof w == "string") {
        t3 = w;
        if (!q(t3)) {
          throw "JWS Head is not safe JSON string: " + t3;
        }
        k = h(t3);
      }
      o2 = z2;
      if (typeof z2 == "object") {
        o2 = u.stringify(z2);
      }
      if ((j == "" || j == null) && k.alg !== void 0) {
        j = k.alg;
      }
      if (j != "" && j != null && k.alg === void 0) {
        k.alg = j;
        t3 = u.stringify(k);
      }
      if (j !== k.alg) {
        throw "alg and sHeader.alg doesn't match: " + j + "!=" + k.alg;
      }
      var s = null;
      if (r2.jwsalg2sigalg[j] === void 0) {
        throw "unsupported alg name: " + j;
      } else {
        s = r2.jwsalg2sigalg[j];
      }
      var e2 = utf8tob64u(t3);
      var m = utf8tob64u(o2);
      var b = e2 + "." + m;
      var y = "";
      if (s.substr(0, 4) == "Hmac") {
        if (A === void 0) {
          throw "mac key shall be specified for HS* alg";
        }
        var i = new p({ alg: s, prov: "cryptojs", pass: A });
        i.updateString(b);
        y = i.doFinal();
      } else {
        if (s.indexOf("withECDSA") != -1) {
          var f = new c({ alg: s });
          f.init(A, a);
          f.updateString(b);
          var g = f.sign();
          y = KJUR.crypto.ECDSA.asn1SigToConcatSig(g);
        } else {
          if (s != "none") {
            var f = new c({ alg: s });
            f.init(A, a);
            f.updateString(b);
            y = f.sign();
          }
        }
      }
      var v = hextob64u(y);
      return b + "." + v;
    };
    KJUR.jws.JWS.verify = function(w, B, n2) {
      var x = KJUR, q = x.jws, t3 = q.JWS, i = t3.readSafeJSONString, e2 = x.crypto, p = e2.ECDSA, s = e2.Mac, d = e2.Signature, m;
      if (typeof RSAKey !== void 0) {
        m = RSAKey;
      }
      if (!isBase64URLDot(w)) {
        return false;
      }
      var y = w.split(".");
      if (y.length !== 3) {
        return false;
      }
      var f = y[0];
      var r2 = y[1];
      var c = f + "." + r2;
      var A = b64utohex(y[2]);
      var l = i(b64utoutf8(y[0]));
      var k = null;
      var z2 = null;
      if (l.alg === void 0) {
        throw "algorithm not specified in header";
      } else {
        k = l.alg;
        z2 = k.substr(0, 2);
      }
      if (n2 != null && Object.prototype.toString.call(n2) === "[object Array]" && n2.length > 0) {
        var b = ":" + n2.join(":") + ":";
        if (b.indexOf(":" + k + ":") == -1) {
          throw "algorithm '" + k + "' not accepted in the list";
        }
      }
      if (k != "none" && B === null) {
        throw "key shall be specified to verify.";
      }
      if (typeof B == "string" && B.indexOf("-----BEGIN ") != -1) {
        B = KEYUTIL.getKey(B);
      }
      if (z2 == "RS" || z2 == "PS") {
        if (!(B instanceof m)) {
          throw "key shall be a RSAKey obj for RS* and PS* algs";
        }
      }
      if (z2 == "ES") {
        if (!(B instanceof p)) {
          throw "key shall be a ECDSA obj for ES* algs";
        }
      }
      if (k == "none") {
      }
      var u = null;
      if (t3.jwsalg2sigalg[l.alg] === void 0) {
        throw "unsupported alg name: " + k;
      } else {
        u = t3.jwsalg2sigalg[k];
      }
      if (u == "none") {
        throw "not supported";
      } else {
        if (u.substr(0, 4) == "Hmac") {
          var o2 = null;
          if (B === void 0) {
            throw "hexadecimal key shall be specified for HMAC";
          }
          var j = new s({ alg: u, pass: B });
          j.updateString(c);
          o2 = j.doFinal();
          return A == o2;
        } else {
          if (u.indexOf("withECDSA") != -1) {
            var h = null;
            try {
              h = p.concatSigToASN1Sig(A);
            } catch (v) {
              return false;
            }
            var g = new d({ alg: u });
            g.init(B);
            g.updateString(c);
            return g.verify(h);
          } else {
            var g = new d({ alg: u });
            g.init(B);
            g.updateString(c);
            return g.verify(A);
          }
        }
      }
    };
    KJUR.jws.JWS.parse = function(g) {
      var c = g.split(".");
      var b = {};
      var f, e2, d;
      if (c.length != 2 && c.length != 3) {
        throw "malformed sJWS: wrong number of '.' splitted elements";
      }
      f = c[0];
      e2 = c[1];
      if (c.length == 3) {
        d = c[2];
      }
      b.headerObj = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(f));
      b.payloadObj = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(e2));
      b.headerPP = JSON.stringify(b.headerObj, null, "  ");
      if (b.payloadObj == null) {
        b.payloadPP = b64utoutf8(e2);
      } else {
        b.payloadPP = JSON.stringify(b.payloadObj, null, "  ");
      }
      if (d !== void 0) {
        b.sigHex = b64utohex(d);
      }
      return b;
    };
    KJUR.jws.JWS.verifyJWT = function(e2, l, r2) {
      var d = KJUR, j = d.jws, o2 = j.JWS, n2 = o2.readSafeJSONString, p = o2.inArray, f = o2.includedArray;
      if (!isBase64URLDot(e2)) {
        return false;
      }
      var k = e2.split(".");
      if (k.length != 3) {
        return false;
      }
      var c = k[0];
      var i = k[1];
      var q = c + "." + i;
      var m = b64utohex(k[2]);
      var h = n2(b64utoutf8(c));
      var g = n2(b64utoutf8(i));
      if (h.alg === void 0) {
        return false;
      }
      if (r2.alg === void 0) {
        throw "acceptField.alg shall be specified";
      }
      if (!p(h.alg, r2.alg)) {
        return false;
      }
      if (g.iss !== void 0 && typeof r2.iss === "object") {
        if (!p(g.iss, r2.iss)) {
          return false;
        }
      }
      if (g.sub !== void 0 && typeof r2.sub === "object") {
        if (!p(g.sub, r2.sub)) {
          return false;
        }
      }
      if (g.aud !== void 0 && typeof r2.aud === "object") {
        if (typeof g.aud == "string") {
          if (!p(g.aud, r2.aud)) {
            return false;
          }
        } else {
          if (typeof g.aud == "object") {
            if (!f(g.aud, r2.aud)) {
              return false;
            }
          }
        }
      }
      var b = j.IntDate.getNow();
      if (r2.verifyAt !== void 0 && typeof r2.verifyAt === "number") {
        b = r2.verifyAt;
      }
      if (r2.gracePeriod === void 0 || typeof r2.gracePeriod !== "number") {
        r2.gracePeriod = 0;
      }
      if (g.exp !== void 0 && typeof g.exp == "number") {
        if (g.exp + r2.gracePeriod < b) {
          return false;
        }
      }
      if (g.nbf !== void 0 && typeof g.nbf == "number") {
        if (b < g.nbf - r2.gracePeriod) {
          return false;
        }
      }
      if (g.iat !== void 0 && typeof g.iat == "number") {
        if (b < g.iat - r2.gracePeriod) {
          return false;
        }
      }
      if (g.jti !== void 0 && r2.jti !== void 0) {
        if (g.jti !== r2.jti) {
          return false;
        }
      }
      if (!o2.verify(e2, l, r2.alg)) {
        return false;
      }
      return true;
    };
    KJUR.jws.JWS.includedArray = function(b, a) {
      var c = KJUR.jws.JWS.inArray;
      if (b === null) {
        return false;
      }
      if (typeof b !== "object") {
        return false;
      }
      if (typeof b.length !== "number") {
        return false;
      }
      for (var d = 0; d < b.length; d++) {
        if (!c(b[d], a)) {
          return false;
        }
      }
      return true;
    };
    KJUR.jws.JWS.inArray = function(d, b) {
      if (b === null) {
        return false;
      }
      if (typeof b !== "object") {
        return false;
      }
      if (typeof b.length !== "number") {
        return false;
      }
      for (var c = 0; c < b.length; c++) {
        if (b[c] == d) {
          return true;
        }
      }
      return false;
    };
    KJUR.jws.JWS.jwsalg2sigalg = { HS256: "HmacSHA256", HS384: "HmacSHA384", HS512: "HmacSHA512", RS256: "SHA256withRSA", RS384: "SHA384withRSA", RS512: "SHA512withRSA", ES256: "SHA256withECDSA", ES384: "SHA384withECDSA", ES512: "SHA512withECDSA", PS256: "SHA256withRSAandMGF1", PS384: "SHA384withRSAandMGF1", PS512: "SHA512withRSAandMGF1", none: "none" };
    KJUR.jws.JWS.isSafeJSONString = function(c, b, d) {
      var e2 = null;
      try {
        e2 = jsonParse(c);
        if (typeof e2 != "object") {
          return 0;
        }
        if (e2.constructor === Array) {
          return 0;
        }
        if (b) {
          b[d] = e2;
        }
        return 1;
      } catch (a) {
        return 0;
      }
    };
    KJUR.jws.JWS.readSafeJSONString = function(b) {
      var c = null;
      try {
        c = jsonParse(b);
        if (typeof c != "object") {
          return null;
        }
        if (c.constructor === Array) {
          return null;
        }
        return c;
      } catch (a) {
        return null;
      }
    };
    KJUR.jws.JWS.getEncodedSignatureValueFromJWS = function(b) {
      var a = b.match(/^[^.]+\.[^.]+\.([^.]+)$/);
      if (a == null) {
        throw "JWS signature is not a form of 'Head.Payload.SigValue'.";
      }
      return a[1];
    };
    KJUR.jws.JWS.getJWKthumbprint = function(d) {
      if (d.kty !== "RSA" && d.kty !== "EC" && d.kty !== "oct") {
        throw "unsupported algorithm for JWK Thumprint";
      }
      var a = "{";
      if (d.kty === "RSA") {
        if (typeof d.n != "string" || typeof d.e != "string") {
          throw "wrong n and e value for RSA key";
        }
        a += '"e":"' + d.e + '",';
        a += '"kty":"' + d.kty + '",';
        a += '"n":"' + d.n + '"}';
      } else {
        if (d.kty === "EC") {
          if (typeof d.crv != "string" || typeof d.x != "string" || typeof d.y != "string") {
            throw "wrong crv, x and y value for EC key";
          }
          a += '"crv":"' + d.crv + '",';
          a += '"kty":"' + d.kty + '",';
          a += '"x":"' + d.x + '",';
          a += '"y":"' + d.y + '"}';
        } else {
          if (d.kty === "oct") {
            if (typeof d.k != "string") {
              throw "wrong k value for oct(symmetric) key";
            }
            a += '"kty":"' + d.kty + '",';
            a += '"k":"' + d.k + '"}';
          }
        }
      }
      var b = rstrtohex(a);
      var c = KJUR.crypto.Util.hashHex(b, "sha256");
      var e2 = hextob64u(c);
      return e2;
    };
    KJUR.jws.IntDate = {};
    KJUR.jws.IntDate.get = function(c) {
      var b = KJUR.jws.IntDate, d = b.getNow, a = b.getZulu;
      if (c == "now") {
        return d();
      } else {
        if (c == "now + 1hour") {
          return d() + 60 * 60;
        } else {
          if (c == "now + 1day") {
            return d() + 60 * 60 * 24;
          } else {
            if (c == "now + 1month") {
              return d() + 60 * 60 * 24 * 30;
            } else {
              if (c == "now + 1year") {
                return d() + 60 * 60 * 24 * 365;
              } else {
                if (c.match(/Z$/)) {
                  return a(c);
                } else {
                  if (c.match(/^[0-9]+$/)) {
                    return parseInt(c);
                  }
                }
              }
            }
          }
        }
      }
      throw "unsupported format: " + c;
    };
    KJUR.jws.IntDate.getZulu = function(a) {
      return zulutosec(a);
    };
    KJUR.jws.IntDate.getNow = function() {
      var a = ~~(/* @__PURE__ */ new Date() / 1e3);
      return a;
    };
    KJUR.jws.IntDate.intDate2UTCString = function(a) {
      var b = new Date(a * 1e3);
      return b.toUTCString();
    };
    KJUR.jws.IntDate.intDate2Zulu = function(e2) {
      var i = new Date(e2 * 1e3), h = ("0000" + i.getUTCFullYear()).slice(-4), g = ("00" + (i.getUTCMonth() + 1)).slice(-2), b = ("00" + i.getUTCDate()).slice(-2), a = ("00" + i.getUTCHours()).slice(-2), c = ("00" + i.getUTCMinutes()).slice(-2), f = ("00" + i.getUTCSeconds()).slice(-2);
      return h + g + b + a + c + f + "Z";
    };
    if (typeof KJUR == "undefined" || !KJUR) {
      KJUR = {};
    }
    if (typeof KJUR.jws == "undefined" || !KJUR.jws) {
      KJUR.jws = {};
    }
    KJUR.jws.JWSJS = function() {
      var c = KJUR, b = c.jws, a = b.JWS, d = a.readSafeJSONString;
      this.aHeader = [];
      this.sPayload = "";
      this.aSignature = [];
      this.init = function() {
        this.aHeader = [];
        this.sPayload = void 0;
        this.aSignature = [];
      };
      this.initWithJWS = function(f) {
        this.init();
        var e2 = f.split(".");
        if (e2.length != 3) {
          throw "malformed input JWS";
        }
        this.aHeader.push(e2[0]);
        this.sPayload = e2[1];
        this.aSignature.push(e2[2]);
      };
      this.addSignature = function(e2, h, m, k) {
        if (this.sPayload === void 0 || this.sPayload === null) {
          throw "there's no JSON-JS signature to add.";
        }
        var l = this.aHeader.length;
        if (this.aHeader.length != this.aSignature.length) {
          throw "aHeader.length != aSignature.length";
        }
        try {
          var f = KJUR.jws.JWS.sign(e2, h, this.sPayload, m, k);
          var j = f.split(".");
          var n2 = j[0];
          var g = j[2];
          this.aHeader.push(j[0]);
          this.aSignature.push(j[2]);
        } catch (i) {
          if (this.aHeader.length > l) {
            this.aHeader.pop();
          }
          if (this.aSignature.length > l) {
            this.aSignature.pop();
          }
          throw "addSignature failed: " + i;
        }
      };
      this.verifyAll = function(h) {
        if (this.aHeader.length !== h.length || this.aSignature.length !== h.length) {
          return false;
        }
        for (var g = 0; g < h.length; g++) {
          var f = h[g];
          if (f.length !== 2) {
            return false;
          }
          var e2 = this.verifyNth(g, f[0], f[1]);
          if (e2 === false) {
            return false;
          }
        }
        return true;
      };
      this.verifyNth = function(f, j, g) {
        if (this.aHeader.length <= f || this.aSignature.length <= f) {
          return false;
        }
        var h = this.aHeader[f];
        var k = this.aSignature[f];
        var l = h + "." + this.sPayload + "." + k;
        var e2 = false;
        try {
          e2 = a.verify(l, j, g);
        } catch (i) {
          return false;
        }
        return e2;
      };
      this.readJWSJS = function(g) {
        if (typeof g === "string") {
          var f = d(g);
          if (f == null) {
            throw "argument is not safe JSON object string";
          }
          this.aHeader = f.headers;
          this.sPayload = f.payload;
          this.aSignature = f.signatures;
        } else {
          try {
            if (g.headers.length > 0) {
              this.aHeader = g.headers;
            } else {
              throw "malformed header";
            }
            if (typeof g.payload === "string") {
              this.sPayload = g.payload;
            } else {
              throw "malformed signatures";
            }
            if (g.signatures.length > 0) {
              this.aSignature = g.signatures;
            } else {
              throw "malformed signatures";
            }
          } catch (e2) {
            throw "malformed JWS-JS JSON object: " + e2;
          }
        }
      };
      this.getJSON = function() {
        return { headers: this.aHeader, payload: this.sPayload, signatures: this.aSignature };
      };
      this.isEmpty = function() {
        if (this.aHeader.length == 0) {
          return 1;
        }
        return 0;
      };
    };
    exports.SecureRandom = SecureRandom;
    exports.rng_seed_time = rng_seed_time;
    exports.BigInteger = BigInteger;
    exports.RSAKey = RSAKey;
    exports.ECDSA = KJUR.crypto.ECDSA;
    exports.DSA = KJUR.crypto.DSA;
    exports.Signature = KJUR.crypto.Signature;
    exports.MessageDigest = KJUR.crypto.MessageDigest;
    exports.Mac = KJUR.crypto.Mac;
    exports.KEYUTIL = KEYUTIL;
    exports.ASN1HEX = ASN1HEX;
    exports.X509 = X509;
    exports.X509CRL = X509CRL;
    exports.CryptoJS = CryptoJS;
    exports.b64tohex = b64tohex;
    exports.b64toBA = b64toBA;
    exports.ECFieldElementFp = ECFieldElementFp;
    exports.ECPointFp = ECPointFp;
    exports.ECCurveFp = ECCurveFp;
    exports.stoBA = stoBA;
    exports.BAtos = BAtos;
    exports.BAtohex = BAtohex;
    exports.stohex = stohex;
    exports.stob64 = stob64;
    exports.stob64u = stob64u;
    exports.b64utos = b64utos;
    exports.b64tob64u = b64tob64u;
    exports.b64utob64 = b64utob64;
    exports.hex2b64 = hex2b64;
    exports.hextob64u = hextob64u;
    exports.b64utohex = b64utohex;
    exports.utf8tob64u = utf8tob64u;
    exports.b64utoutf8 = b64utoutf8;
    exports.utf8tob64 = utf8tob64;
    exports.b64toutf8 = b64toutf8;
    exports.utf8tohex = utf8tohex;
    exports.hextoutf8 = hextoutf8;
    exports.hextorstr = hextorstr;
    exports.rstrtohex = rstrtohex;
    exports.hextob64 = hextob64;
    exports.hextob64nl = hextob64nl;
    exports.b64nltohex = b64nltohex;
    exports.hextopem = hextopem;
    exports.pemtohex = pemtohex;
    exports.hextoArrayBuffer = hextoArrayBuffer;
    exports.ArrayBuffertohex = ArrayBuffertohex;
    exports.zulutomsec = zulutomsec;
    exports.msectozulu = msectozulu;
    exports.zulutosec = zulutosec;
    exports.zulutodate = zulutodate;
    exports.datetozulu = datetozulu;
    exports.uricmptohex = uricmptohex;
    exports.hextouricmp = hextouricmp;
    exports.ipv6tohex = ipv6tohex;
    exports.hextoipv6 = hextoipv6;
    exports.hextoip = hextoip;
    exports.iptohex = iptohex;
    exports.ucs2hextoutf8 = ucs2hextoutf8;
    exports.encodeURIComponentAll = encodeURIComponentAll;
    exports.newline_toUnix = newline_toUnix;
    exports.newline_toDos = newline_toDos;
    exports.hextoposhex = hextoposhex;
    exports.intarystrtohex = intarystrtohex;
    exports.strdiffidx = strdiffidx;
    exports.oidtohex = oidtohex;
    exports.hextooid = hextooid;
    exports.strpad = strpad;
    exports.bitstrtoint = bitstrtoint;
    exports.inttobitstr = inttobitstr;
    exports.bitstrtobinstr = bitstrtobinstr;
    exports.binstrtobitstr = binstrtobitstr;
    exports.isBase64URLDot = isBase64URLDot;
    exports.namearraytobinstr = namearraytobinstr;
    exports.extendClass = extendClass;
    exports.foldnl = foldnl;
    exports.b64topem = b64topem;
    exports.pemtob64 = pemtob64;
    exports.timeogen = timetogen;
    exports.aryval = aryval;
    exports.inttohex = inttohex;
    exports.twoscompl = twoscompl;
    exports.KJUR = KJUR;
    exports.crypto = KJUR.crypto;
    exports.asn1 = KJUR.asn1;
    exports.jws = KJUR.jws;
    exports.lang = KJUR.lang;
    exports.VERSION = VERSION;
    exports.VERSION_FULL = VERSION_FULL;
  }
});
init_process();
init_process();
init_process();
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
    if (!getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
  }
  return getRandomValues(rnds8);
}
__name(rng, "rng");
__name2(rng, "rng");
init_process();
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}
__name(unsafeStringify, "unsafeStringify");
__name2(unsafeStringify, "unsafeStringify");
init_process();
init_process();
var randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native_default = {
  randomUUID
};
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
__name(v4, "v4");
__name2(v4, "v4");
var v4_default = v4;
init_process();
init_process();
init_process();
init_process();
var logLevelTypes = [
  "disable",
  "error",
  "warn",
  "info",
  "debug"
];
var _Logger = class _Logger2 {
  static {
    __name(this, "_Logger2");
  }
  static {
    __name2(this, "_Logger");
  }
  /**@internal */
  constructor(prefix) {
    this.debug = (...msg) => {
      this._log("debug", ...msg);
      return Date.now();
    };
    this.info = (...msg) => {
      this._log("info", ...msg);
      return Date.now();
    };
    this.warn = (...msg) => {
      this._log("warn", ...msg);
    };
    this.error = (...msg) => {
      this._log("error", ...msg);
    };
    this.elapsed = (timestamp, ...msg) => {
      const elapsed = Date.now() - timestamp;
      this._log("info", `elapsed ms:${elapsed}`, ...msg);
    };
    this.prefix = prefix;
  }
  static formatTimestampJst(date) {
    const pad = /* @__PURE__ */ __name2((value, length) => value.toString().padStart(length, "0"), "pad");
    const jst = new Date(date.getTime() + 9 * 60 * 60 * 1e3);
    const year = jst.getUTCFullYear();
    const month = pad(jst.getUTCMonth() + 1, 2);
    const day = pad(jst.getUTCDate(), 2);
    const hour = pad(jst.getUTCHours(), 2);
    const minute = pad(jst.getUTCMinutes(), 2);
    const second = pad(jst.getUTCSeconds(), 2);
    const milliseconds = pad(jst.getUTCMilliseconds(), 3);
    return `${year}-${month}-${day}T${hour}:${minute}:${second}.${milliseconds}+09:00`;
  }
  _log(level, ...msg) {
    const logType = logLevelTypes.indexOf(level);
    const logLevel = logLevelTypes.indexOf(_Logger2.level);
    const now = /* @__PURE__ */ new Date();
    const timestamp = _Logger2.formatTimestampJst(now);
    if (logLevel >= logType) {
      const parsed = [this.prefix, ...msg].map((m) => {
        if (m instanceof Error) {
          if (m.toJSON) {
            return m.toJSON();
          }
          return { name: m.name, message: m.message, stack: m.stack };
        }
        if (typeof m === "object") {
          try {
            return JSON.parse(JSON.stringify(m));
          } catch (e2) {
            return "json error";
          }
        }
        return m;
      });
      msg = parsed;
      let log7 = [timestamp, level, ...msg];
      if (_Logger2.format === "string") {
        log7 = [`${timestamp} ${level} ${JSON.stringify(msg)}`];
      }
      switch (level) {
        case "debug":
          console.debug(...log7);
          break;
        case "info":
          console.info(...log7);
          break;
        case "warn":
          console.warn(...log7);
          break;
        case "error":
          console.error(...log7);
          break;
      }
      _Logger2.onLog({
        id: _Logger2.id,
        timestamp,
        level,
        message: msg
      });
    }
    _Logger2._onLogForAnalytics({
      id: _Logger2.id,
      timestamp,
      level,
      message: msg,
      prefix: this.prefix
    });
  }
  /**@internal */
  createBlock(info32) {
    return {
      warn: /* @__PURE__ */ __name2((...msg) => {
        this.warn(__spreadValues({}, info32), ...msg);
      }, "warn"),
      debug: /* @__PURE__ */ __name2((...msg) => {
        this.debug(__spreadValues({}, info32), ...msg);
      }, "debug"),
      info: /* @__PURE__ */ __name2((...msg) => {
        this.info(__spreadValues({}, info32), ...msg);
      }, "info"),
      error: /* @__PURE__ */ __name2((...msg) => {
        this.error(__spreadValues({}, info32), ...msg);
      }, "error")
    };
  }
};
_Logger.level = "error";
_Logger.format = "object";
_Logger.onLog = () => {
};
_Logger._onLogForAnalytics = () => {
};
_Logger.id = Math.random().toString().slice(2, 7);
var Logger = _Logger;
var log32 = new Logger("packages/common/src/error.ts");
var SkyWayError = class extends Error {
  static {
    __name(this, "SkyWayError");
  }
  static {
    __name2(this, "SkyWayError");
  }
  /**@internal */
  constructor(init, logging = true) {
    super(init.info.detail);
    this.id = Math.random().toString().slice(2, 10);
    Object.assign(this, init);
    this.name = this.info.name;
    if (logging) {
      const messages = [
        "SkyWayError",
        `name:${this.info.name}, detail:${this.info.detail}, solution:${this.info.solution}`
      ];
      if (this.path) {
        messages.push(this.path);
      }
      if (this.error) {
        messages.push(this.error);
      }
      if (this.payload) {
        messages.push(this.payload);
      }
      messages.push(this.id);
      log32.warn(...messages);
    }
  }
  toJSON() {
    return {
      id: this.id,
      info: this.info,
      path: this.path,
      payload: this.payload,
      error: this.error,
      stack: this.stack
    };
  }
};
init_process();
var log222 = new Logger("packages/common/src/event.ts");
init_process();
var log322 = new Logger("packages/common/src/http.ts");
init_process();
var log4 = new Logger("packages/common/src/promise.ts");
init_process();
var import_jsrsasign = __toESM(require_jsrsasign());
init_process();
function e(e2) {
  this.message = e2;
}
__name(e, "e");
__name2(e, "e");
e.prototype = new Error(), e.prototype.name = "InvalidCharacterError";
var r = "undefined" != typeof window && window.atob && window.atob.bind(window) || function(r2) {
  var t2 = String(r2).replace(/=+$/, "");
  if (t2.length % 4 == 1) throw new e("'atob' failed: The string to be decoded is not correctly encoded.");
  for (var n2, o2, a = 0, i = 0, c = ""; o2 = t2.charAt(i++); ~o2 && (n2 = a % 4 ? 64 * n2 + o2 : o2, a++ % 4) ? c += String.fromCharCode(255 & n2 >> (-2 * a & 6)) : 0) o2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(o2);
  return c;
};
function t(e2) {
  var t2 = e2.replace(/-/g, "+").replace(/_/g, "/");
  switch (t2.length % 4) {
    case 0:
      break;
    case 2:
      t2 += "==";
      break;
    case 3:
      t2 += "=";
      break;
    default:
      throw "Illegal base64url string!";
  }
  try {
    return (function(e3) {
      return decodeURIComponent(r(e3).replace(/(.)/g, (function(e4, r2) {
        var t3 = r2.charCodeAt(0).toString(16).toUpperCase();
        return t3.length < 2 && (t3 = "0" + t3), "%" + t3;
      })));
    })(t2);
  } catch (e3) {
    return r(t2);
  }
}
__name(t, "t");
__name2(t, "t");
function n(e2) {
  this.message = e2;
}
__name(n, "n");
__name2(n, "n");
function o(e2, r2) {
  if ("string" != typeof e2) throw new n("Invalid token specified");
  var o2 = true === (r2 = r2 || {}).header ? 0 : 1;
  try {
    return JSON.parse(t(e2.split(".")[o2]));
  } catch (e3) {
    throw new n("Invalid token specified: " + e3.message);
  }
}
__name(o, "o");
__name2(o, "o");
n.prototype = new Error(), n.prototype.name = "InvalidTokenError";
var jwt_decode_esm_default = o;
init_process();
init_process();
var external_exports = {};
__export(external_exports, {
  BRAND: /* @__PURE__ */ __name2(() => BRAND, "BRAND"),
  DIRTY: /* @__PURE__ */ __name2(() => DIRTY, "DIRTY"),
  EMPTY_PATH: /* @__PURE__ */ __name2(() => EMPTY_PATH, "EMPTY_PATH"),
  INVALID: /* @__PURE__ */ __name2(() => INVALID, "INVALID"),
  NEVER: /* @__PURE__ */ __name2(() => NEVER, "NEVER"),
  OK: /* @__PURE__ */ __name2(() => OK, "OK"),
  ParseStatus: /* @__PURE__ */ __name2(() => ParseStatus, "ParseStatus"),
  Schema: /* @__PURE__ */ __name2(() => ZodType, "Schema"),
  ZodAny: /* @__PURE__ */ __name2(() => ZodAny, "ZodAny"),
  ZodArray: /* @__PURE__ */ __name2(() => ZodArray, "ZodArray"),
  ZodBigInt: /* @__PURE__ */ __name2(() => ZodBigInt, "ZodBigInt"),
  ZodBoolean: /* @__PURE__ */ __name2(() => ZodBoolean, "ZodBoolean"),
  ZodBranded: /* @__PURE__ */ __name2(() => ZodBranded, "ZodBranded"),
  ZodCatch: /* @__PURE__ */ __name2(() => ZodCatch, "ZodCatch"),
  ZodDate: /* @__PURE__ */ __name2(() => ZodDate, "ZodDate"),
  ZodDefault: /* @__PURE__ */ __name2(() => ZodDefault, "ZodDefault"),
  ZodDiscriminatedUnion: /* @__PURE__ */ __name2(() => ZodDiscriminatedUnion, "ZodDiscriminatedUnion"),
  ZodEffects: /* @__PURE__ */ __name2(() => ZodEffects, "ZodEffects"),
  ZodEnum: /* @__PURE__ */ __name2(() => ZodEnum, "ZodEnum"),
  ZodError: /* @__PURE__ */ __name2(() => ZodError, "ZodError"),
  ZodFirstPartyTypeKind: /* @__PURE__ */ __name2(() => ZodFirstPartyTypeKind, "ZodFirstPartyTypeKind"),
  ZodFunction: /* @__PURE__ */ __name2(() => ZodFunction, "ZodFunction"),
  ZodIntersection: /* @__PURE__ */ __name2(() => ZodIntersection, "ZodIntersection"),
  ZodIssueCode: /* @__PURE__ */ __name2(() => ZodIssueCode, "ZodIssueCode"),
  ZodLazy: /* @__PURE__ */ __name2(() => ZodLazy, "ZodLazy"),
  ZodLiteral: /* @__PURE__ */ __name2(() => ZodLiteral, "ZodLiteral"),
  ZodMap: /* @__PURE__ */ __name2(() => ZodMap, "ZodMap"),
  ZodNaN: /* @__PURE__ */ __name2(() => ZodNaN, "ZodNaN"),
  ZodNativeEnum: /* @__PURE__ */ __name2(() => ZodNativeEnum, "ZodNativeEnum"),
  ZodNever: /* @__PURE__ */ __name2(() => ZodNever, "ZodNever"),
  ZodNull: /* @__PURE__ */ __name2(() => ZodNull, "ZodNull"),
  ZodNullable: /* @__PURE__ */ __name2(() => ZodNullable, "ZodNullable"),
  ZodNumber: /* @__PURE__ */ __name2(() => ZodNumber, "ZodNumber"),
  ZodObject: /* @__PURE__ */ __name2(() => ZodObject, "ZodObject"),
  ZodOptional: /* @__PURE__ */ __name2(() => ZodOptional, "ZodOptional"),
  ZodParsedType: /* @__PURE__ */ __name2(() => ZodParsedType, "ZodParsedType"),
  ZodPipeline: /* @__PURE__ */ __name2(() => ZodPipeline, "ZodPipeline"),
  ZodPromise: /* @__PURE__ */ __name2(() => ZodPromise, "ZodPromise"),
  ZodReadonly: /* @__PURE__ */ __name2(() => ZodReadonly, "ZodReadonly"),
  ZodRecord: /* @__PURE__ */ __name2(() => ZodRecord, "ZodRecord"),
  ZodSchema: /* @__PURE__ */ __name2(() => ZodType, "ZodSchema"),
  ZodSet: /* @__PURE__ */ __name2(() => ZodSet, "ZodSet"),
  ZodString: /* @__PURE__ */ __name2(() => ZodString, "ZodString"),
  ZodSymbol: /* @__PURE__ */ __name2(() => ZodSymbol, "ZodSymbol"),
  ZodTransformer: /* @__PURE__ */ __name2(() => ZodEffects, "ZodTransformer"),
  ZodTuple: /* @__PURE__ */ __name2(() => ZodTuple, "ZodTuple"),
  ZodType: /* @__PURE__ */ __name2(() => ZodType, "ZodType"),
  ZodUndefined: /* @__PURE__ */ __name2(() => ZodUndefined, "ZodUndefined"),
  ZodUnion: /* @__PURE__ */ __name2(() => ZodUnion, "ZodUnion"),
  ZodUnknown: /* @__PURE__ */ __name2(() => ZodUnknown, "ZodUnknown"),
  ZodVoid: /* @__PURE__ */ __name2(() => ZodVoid, "ZodVoid"),
  addIssueToContext: /* @__PURE__ */ __name2(() => addIssueToContext, "addIssueToContext"),
  any: /* @__PURE__ */ __name2(() => anyType, "any"),
  array: /* @__PURE__ */ __name2(() => arrayType, "array"),
  bigint: /* @__PURE__ */ __name2(() => bigIntType, "bigint"),
  boolean: /* @__PURE__ */ __name2(() => booleanType, "boolean"),
  coerce: /* @__PURE__ */ __name2(() => coerce, "coerce"),
  custom: /* @__PURE__ */ __name2(() => custom, "custom"),
  date: /* @__PURE__ */ __name2(() => dateType, "date"),
  datetimeRegex: /* @__PURE__ */ __name2(() => datetimeRegex, "datetimeRegex"),
  defaultErrorMap: /* @__PURE__ */ __name2(() => en_default, "defaultErrorMap"),
  discriminatedUnion: /* @__PURE__ */ __name2(() => discriminatedUnionType, "discriminatedUnion"),
  effect: /* @__PURE__ */ __name2(() => effectsType, "effect"),
  enum: /* @__PURE__ */ __name2(() => enumType, "enum"),
  function: /* @__PURE__ */ __name2(() => functionType, "function"),
  getErrorMap: /* @__PURE__ */ __name2(() => getErrorMap, "getErrorMap"),
  getParsedType: /* @__PURE__ */ __name2(() => getParsedType, "getParsedType"),
  instanceof: /* @__PURE__ */ __name2(() => instanceOfType, "instanceof"),
  intersection: /* @__PURE__ */ __name2(() => intersectionType, "intersection"),
  isAborted: /* @__PURE__ */ __name2(() => isAborted, "isAborted"),
  isAsync: /* @__PURE__ */ __name2(() => isAsync, "isAsync"),
  isDirty: /* @__PURE__ */ __name2(() => isDirty, "isDirty"),
  isValid: /* @__PURE__ */ __name2(() => isValid, "isValid"),
  late: /* @__PURE__ */ __name2(() => late, "late"),
  lazy: /* @__PURE__ */ __name2(() => lazyType, "lazy"),
  literal: /* @__PURE__ */ __name2(() => literalType, "literal"),
  makeIssue: /* @__PURE__ */ __name2(() => makeIssue, "makeIssue"),
  map: /* @__PURE__ */ __name2(() => mapType, "map"),
  nan: /* @__PURE__ */ __name2(() => nanType, "nan"),
  nativeEnum: /* @__PURE__ */ __name2(() => nativeEnumType, "nativeEnum"),
  never: /* @__PURE__ */ __name2(() => neverType, "never"),
  null: /* @__PURE__ */ __name2(() => nullType, "null"),
  nullable: /* @__PURE__ */ __name2(() => nullableType, "nullable"),
  number: /* @__PURE__ */ __name2(() => numberType, "number"),
  object: /* @__PURE__ */ __name2(() => objectType, "object"),
  objectUtil: /* @__PURE__ */ __name2(() => objectUtil, "objectUtil"),
  oboolean: /* @__PURE__ */ __name2(() => oboolean, "oboolean"),
  onumber: /* @__PURE__ */ __name2(() => onumber, "onumber"),
  optional: /* @__PURE__ */ __name2(() => optionalType, "optional"),
  ostring: /* @__PURE__ */ __name2(() => ostring, "ostring"),
  pipeline: /* @__PURE__ */ __name2(() => pipelineType, "pipeline"),
  preprocess: /* @__PURE__ */ __name2(() => preprocessType, "preprocess"),
  promise: /* @__PURE__ */ __name2(() => promiseType, "promise"),
  quotelessJson: /* @__PURE__ */ __name2(() => quotelessJson, "quotelessJson"),
  record: /* @__PURE__ */ __name2(() => recordType, "record"),
  set: /* @__PURE__ */ __name2(() => setType, "set"),
  setErrorMap: /* @__PURE__ */ __name2(() => setErrorMap, "setErrorMap"),
  strictObject: /* @__PURE__ */ __name2(() => strictObjectType, "strictObject"),
  string: /* @__PURE__ */ __name2(() => stringType, "string"),
  symbol: /* @__PURE__ */ __name2(() => symbolType, "symbol"),
  transformer: /* @__PURE__ */ __name2(() => effectsType, "transformer"),
  tuple: /* @__PURE__ */ __name2(() => tupleType, "tuple"),
  undefined: /* @__PURE__ */ __name2(() => undefinedType, "undefined"),
  union: /* @__PURE__ */ __name2(() => unionType, "union"),
  unknown: /* @__PURE__ */ __name2(() => unknownType, "unknown"),
  util: /* @__PURE__ */ __name2(() => util, "util"),
  void: /* @__PURE__ */ __name2(() => voidType, "void")
});
init_process();
init_process();
init_process();
init_process();
init_process();
var util;
(function(util2) {
  util2.assertEqual = (_) => {
  };
  function assertIs(_arg) {
  }
  __name(assertIs, "assertIs");
  __name2(assertIs, "assertIs");
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  __name(assertNever, "assertNever");
  __name2(assertNever, "assertNever");
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e2) {
      return obj[e2];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  __name(joinValues, "joinValues");
  __name2(joinValues, "joinValues");
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return __spreadValues(__spreadValues({}, first), second);
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = /* @__PURE__ */ __name2((data) => {
  const t2 = typeof data;
  switch (t2) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
}, "getParsedType");
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = /* @__PURE__ */ __name2((obj) => {
  const json2 = JSON.stringify(obj, null, 2);
  return json2.replace(/"([^"]+)":/g, "$1:");
}, "quotelessJson");
var ZodError = class _ZodError extends Error {
  static {
    __name(this, "_ZodError");
  }
  static {
    __name2(this, "_ZodError");
  }
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = /* @__PURE__ */ __name2((error32) => {
      for (const issue of error32.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    }, "processError");
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
        fieldErrors[sub.path[0]].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error32 = new ZodError(issues);
  return error32;
};
var errorMap = /* @__PURE__ */ __name2((issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
}, "errorMap");
var en_default = errorMap;
var overrideErrorMap = en_default;
function setErrorMap(map) {
  overrideErrorMap = map;
}
__name(setErrorMap, "setErrorMap");
__name2(setErrorMap, "setErrorMap");
function getErrorMap() {
  return overrideErrorMap;
}
__name(getErrorMap, "getErrorMap");
__name2(getErrorMap, "getErrorMap");
init_process();
var makeIssue = /* @__PURE__ */ __name2((params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = __spreadProps(__spreadValues({}, issueData), {
    path: fullPath
  });
  if (issueData.message !== void 0) {
    return __spreadProps(__spreadValues({}, issueData), {
      path: fullPath,
      message: issueData.message
    });
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return __spreadProps(__spreadValues({}, issueData), {
    path: fullPath,
    message: errorMessage
  });
}, "makeIssue");
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default ? void 0 : en_default
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
__name(addIssueToContext, "addIssueToContext");
__name2(addIssueToContext, "addIssueToContext");
var ParseStatus = class _ParseStatus {
  static {
    __name(this, "_ParseStatus");
  }
  static {
    __name2(this, "_ParseStatus");
  }
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static mergeObjectAsync(status, pairs) {
    return __async(this, null, function* () {
      const syncPairs = [];
      for (const pair of pairs) {
        const key = yield pair.key;
        const value = yield pair.value;
        syncPairs.push({
          key,
          value
        });
      }
      return _ParseStatus.mergeObjectSync(status, syncPairs);
    });
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = /* @__PURE__ */ __name2((value) => ({ status: "dirty", value }), "DIRTY");
var OK = /* @__PURE__ */ __name2((value) => ({ status: "valid", value }), "OK");
var isAborted = /* @__PURE__ */ __name2((x) => x.status === "aborted", "isAborted");
var isDirty = /* @__PURE__ */ __name2((x) => x.status === "dirty", "isDirty");
var isValid = /* @__PURE__ */ __name2((x) => x.status === "valid", "isValid");
var isAsync = /* @__PURE__ */ __name2((x) => typeof Promise !== "undefined" && x instanceof Promise, "isAsync");
init_process();
init_process();
init_process();
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message == null ? void 0 : message.message;
})(errorUtil || (errorUtil = {}));
var ParseInputLazyPath = class {
  static {
    __name(this, "ParseInputLazyPath");
  }
  static {
    __name2(this, "ParseInputLazyPath");
  }
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult = /* @__PURE__ */ __name2((ctx, result2) => {
  if (isValid(result2)) {
    return { success: true, data: result2.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error32 = new ZodError(ctx.common.issues);
        this._error = error32;
        return this._error;
      }
    };
  }
}, "handleResult");
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = /* @__PURE__ */ __name2((iss, ctx) => {
    var _a, _b;
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message != null ? message : ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: (_a = message != null ? message : required_error) != null ? _a : ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: (_b = message != null ? message : invalid_type_error) != null ? _b : ctx.defaultError };
  }, "customMap");
  return { errorMap: customMap, description };
}
__name(processCreateParams, "processCreateParams");
__name2(processCreateParams, "processCreateParams");
var ZodType = class {
  static {
    __name(this, "ZodType");
  }
  static {
    __name2(this, "ZodType");
  }
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result2 = this._parse(input);
    if (isAsync(result2)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result2;
  }
  _parseAsync(input) {
    const result2 = this._parse(input);
    return Promise.resolve(result2);
  }
  parse(data, params) {
    const result2 = this.safeParse(data, params);
    if (result2.success)
      return result2.data;
    throw result2.error;
  }
  safeParse(data, params) {
    var _a;
    const ctx = {
      common: {
        issues: [],
        async: (_a = params == null ? void 0 : params.async) != null ? _a : false,
        contextualErrorMap: params == null ? void 0 : params.errorMap
      },
      path: (params == null ? void 0 : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result2 = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result2);
  }
  "~validate"(data) {
    var _a, _b;
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result2 = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result2) ? {
          value: result2.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if ((_b = (_a = err == null ? void 0 : err.message) == null ? void 0 : _a.toLowerCase()) == null ? void 0 : _b.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result2) => isValid(result2) ? {
      value: result2.value
    } : {
      issues: ctx.common.issues
    });
  }
  parseAsync(data, params) {
    return __async(this, null, function* () {
      const result2 = yield this.safeParseAsync(data, params);
      if (result2.success)
        return result2.data;
      throw result2.error;
    });
  }
  safeParseAsync(data, params) {
    return __async(this, null, function* () {
      const ctx = {
        common: {
          issues: [],
          contextualErrorMap: params == null ? void 0 : params.errorMap,
          async: true
        },
        path: (params == null ? void 0 : params.path) || [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data,
        parsedType: getParsedType(data)
      };
      const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
      const result2 = yield isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult);
      return handleResult(ctx, result2);
    });
  }
  refine(check, message) {
    const getIssueProperties = /* @__PURE__ */ __name2((val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    }, "getIssueProperties");
    return this._refinement((val, ctx) => {
      const result2 = check(val);
      const setError = /* @__PURE__ */ __name2(() => ctx.addIssue(__spreadValues({
        code: ZodIssueCode.custom
      }, getIssueProperties(val))), "setError");
      if (typeof Promise !== "undefined" && result2 instanceof Promise) {
        return result2.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result2) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: /* @__PURE__ */ __name2((data) => this["~validate"](data), "validate")
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects(__spreadProps(__spreadValues({}, processCreateParams(this._def)), {
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    }));
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault(__spreadProps(__spreadValues({}, processCreateParams(this._def)), {
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    }));
  }
  brand() {
    return new ZodBranded(__spreadValues({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this
    }, processCreateParams(this._def)));
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch(__spreadProps(__spreadValues({}, processCreateParams(this._def)), {
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    }));
  }
  describe(description) {
    const This = this.constructor;
    return new This(__spreadProps(__spreadValues({}, this._def), {
      description
    }));
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
__name(timeRegexSource, "timeRegexSource");
__name2(timeRegexSource, "timeRegexSource");
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
__name(timeRegex, "timeRegex");
__name2(timeRegex, "timeRegex");
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
__name(datetimeRegex, "datetimeRegex");
__name2(datetimeRegex, "datetimeRegex");
function isValidIP(ip, version22) {
  if ((version22 === "v4" || !version22) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version22 === "v6" || !version22) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
__name(isValidIP, "isValidIP");
__name2(isValidIP, "isValidIP");
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && (decoded == null ? void 0 : decoded.typ) !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch (e2) {
    return false;
  }
}
__name(isValidJWT, "isValidJWT");
__name2(isValidJWT, "isValidJWT");
function isValidCidr(ip, version22) {
  if ((version22 === "v4" || !version22) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version22 === "v6" || !version22) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
__name(isValidCidr, "isValidCidr");
__name2(isValidCidr, "isValidCidr");
var ZodString = class _ZodString extends ZodType {
  static {
    __name(this, "_ZodString");
  }
  static {
    __name2(this, "_ZodString");
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch (e2) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), __spreadValues({
      validation,
      code: ZodIssueCode.invalid_string
    }, errorUtil.errToObj(message)));
  }
  _addCheck(check) {
    return new _ZodString(__spreadProps(__spreadValues({}, this._def), {
      checks: [...this._def.checks, check]
    }));
  }
  email(message) {
    return this._addCheck(__spreadValues({ kind: "email" }, errorUtil.errToObj(message)));
  }
  url(message) {
    return this._addCheck(__spreadValues({ kind: "url" }, errorUtil.errToObj(message)));
  }
  emoji(message) {
    return this._addCheck(__spreadValues({ kind: "emoji" }, errorUtil.errToObj(message)));
  }
  uuid(message) {
    return this._addCheck(__spreadValues({ kind: "uuid" }, errorUtil.errToObj(message)));
  }
  nanoid(message) {
    return this._addCheck(__spreadValues({ kind: "nanoid" }, errorUtil.errToObj(message)));
  }
  cuid(message) {
    return this._addCheck(__spreadValues({ kind: "cuid" }, errorUtil.errToObj(message)));
  }
  cuid2(message) {
    return this._addCheck(__spreadValues({ kind: "cuid2" }, errorUtil.errToObj(message)));
  }
  ulid(message) {
    return this._addCheck(__spreadValues({ kind: "ulid" }, errorUtil.errToObj(message)));
  }
  base64(message) {
    return this._addCheck(__spreadValues({ kind: "base64" }, errorUtil.errToObj(message)));
  }
  base64url(message) {
    return this._addCheck(__spreadValues({
      kind: "base64url"
    }, errorUtil.errToObj(message)));
  }
  jwt(options) {
    return this._addCheck(__spreadValues({ kind: "jwt" }, errorUtil.errToObj(options)));
  }
  ip(options) {
    return this._addCheck(__spreadValues({ kind: "ip" }, errorUtil.errToObj(options)));
  }
  cidr(options) {
    return this._addCheck(__spreadValues({ kind: "cidr" }, errorUtil.errToObj(options)));
  }
  datetime(options) {
    var _a, _b;
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck(__spreadValues({
      kind: "datetime",
      precision: typeof (options == null ? void 0 : options.precision) === "undefined" ? null : options == null ? void 0 : options.precision,
      offset: (_a = options == null ? void 0 : options.offset) != null ? _a : false,
      local: (_b = options == null ? void 0 : options.local) != null ? _b : false
    }, errorUtil.errToObj(options == null ? void 0 : options.message)));
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck(__spreadValues({
      kind: "time",
      precision: typeof (options == null ? void 0 : options.precision) === "undefined" ? null : options == null ? void 0 : options.precision
    }, errorUtil.errToObj(options == null ? void 0 : options.message)));
  }
  duration(message) {
    return this._addCheck(__spreadValues({ kind: "duration" }, errorUtil.errToObj(message)));
  }
  regex(regex, message) {
    return this._addCheck(__spreadValues({
      kind: "regex",
      regex
    }, errorUtil.errToObj(message)));
  }
  includes(value, options) {
    return this._addCheck(__spreadValues({
      kind: "includes",
      value,
      position: options == null ? void 0 : options.position
    }, errorUtil.errToObj(options == null ? void 0 : options.message)));
  }
  startsWith(value, message) {
    return this._addCheck(__spreadValues({
      kind: "startsWith",
      value
    }, errorUtil.errToObj(message)));
  }
  endsWith(value, message) {
    return this._addCheck(__spreadValues({
      kind: "endsWith",
      value
    }, errorUtil.errToObj(message)));
  }
  min(minLength, message) {
    return this._addCheck(__spreadValues({
      kind: "min",
      value: minLength
    }, errorUtil.errToObj(message)));
  }
  max(maxLength, message) {
    return this._addCheck(__spreadValues({
      kind: "max",
      value: maxLength
    }, errorUtil.errToObj(message)));
  }
  length(len, message) {
    return this._addCheck(__spreadValues({
      kind: "length",
      value: len
    }, errorUtil.errToObj(message)));
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new _ZodString(__spreadProps(__spreadValues({}, this._def), {
      checks: [...this._def.checks, { kind: "trim" }]
    }));
  }
  toLowerCase() {
    return new _ZodString(__spreadProps(__spreadValues({}, this._def), {
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    }));
  }
  toUpperCase() {
    return new _ZodString(__spreadProps(__spreadValues({}, this._def), {
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    }));
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString.create = (params) => {
  var _a;
  return new ZodString(__spreadValues({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: (_a = params == null ? void 0 : params.coerce) != null ? _a : false
  }, processCreateParams(params)));
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / __pow(10, decCount);
}
__name(floatSafeRemainder, "floatSafeRemainder");
__name2(floatSafeRemainder, "floatSafeRemainder");
var ZodNumber = class _ZodNumber extends ZodType {
  static {
    __name(this, "_ZodNumber");
  }
  static {
    __name2(this, "_ZodNumber");
  }
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodNumber(__spreadProps(__spreadValues({}, this._def), {
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    }));
  }
  _addCheck(check) {
    return new _ZodNumber(__spreadProps(__spreadValues({}, this._def), {
      checks: [...this._def.checks, check]
    }));
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = (params) => {
  return new ZodNumber(__spreadValues({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: (params == null ? void 0 : params.coerce) || false
  }, processCreateParams(params)));
};
var ZodBigInt = class _ZodBigInt extends ZodType {
  static {
    __name(this, "_ZodBigInt");
  }
  static {
    __name2(this, "_ZodBigInt");
  }
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch (e2) {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodBigInt(__spreadProps(__spreadValues({}, this._def), {
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    }));
  }
  _addCheck(check) {
    return new _ZodBigInt(__spreadProps(__spreadValues({}, this._def), {
      checks: [...this._def.checks, check]
    }));
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt.create = (params) => {
  var _a;
  return new ZodBigInt(__spreadValues({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: (_a = params == null ? void 0 : params.coerce) != null ? _a : false
  }, processCreateParams(params)));
};
var ZodBoolean = class extends ZodType {
  static {
    __name(this, "ZodBoolean");
  }
  static {
    __name2(this, "ZodBoolean");
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean(__spreadValues({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: (params == null ? void 0 : params.coerce) || false
  }, processCreateParams(params)));
};
var ZodDate = class _ZodDate extends ZodType {
  static {
    __name(this, "_ZodDate");
  }
  static {
    __name2(this, "_ZodDate");
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate(__spreadProps(__spreadValues({}, this._def), {
      checks: [...this._def.checks, check]
    }));
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate(__spreadValues({
    checks: [],
    coerce: (params == null ? void 0 : params.coerce) || false,
    typeName: ZodFirstPartyTypeKind.ZodDate
  }, processCreateParams(params)));
};
var ZodSymbol = class extends ZodType {
  static {
    __name(this, "ZodSymbol");
  }
  static {
    __name2(this, "ZodSymbol");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol(__spreadValues({
    typeName: ZodFirstPartyTypeKind.ZodSymbol
  }, processCreateParams(params)));
};
var ZodUndefined = class extends ZodType {
  static {
    __name(this, "ZodUndefined");
  }
  static {
    __name2(this, "ZodUndefined");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined(__spreadValues({
    typeName: ZodFirstPartyTypeKind.ZodUndefined
  }, processCreateParams(params)));
};
var ZodNull = class extends ZodType {
  static {
    __name(this, "ZodNull");
  }
  static {
    __name2(this, "ZodNull");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull(__spreadValues({
    typeName: ZodFirstPartyTypeKind.ZodNull
  }, processCreateParams(params)));
};
var ZodAny = class extends ZodType {
  static {
    __name(this, "ZodAny");
  }
  static {
    __name2(this, "ZodAny");
  }
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny(__spreadValues({
    typeName: ZodFirstPartyTypeKind.ZodAny
  }, processCreateParams(params)));
};
var ZodUnknown = class extends ZodType {
  static {
    __name(this, "ZodUnknown");
  }
  static {
    __name2(this, "ZodUnknown");
  }
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown(__spreadValues({
    typeName: ZodFirstPartyTypeKind.ZodUnknown
  }, processCreateParams(params)));
};
var ZodNever = class extends ZodType {
  static {
    __name(this, "ZodNever");
  }
  static {
    __name2(this, "ZodNever");
  }
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever(__spreadValues({
    typeName: ZodFirstPartyTypeKind.ZodNever
  }, processCreateParams(params)));
};
var ZodVoid = class extends ZodType {
  static {
    __name(this, "ZodVoid");
  }
  static {
    __name2(this, "ZodVoid");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid(__spreadValues({
    typeName: ZodFirstPartyTypeKind.ZodVoid
  }, processCreateParams(params)));
};
var ZodArray = class _ZodArray extends ZodType {
  static {
    __name(this, "_ZodArray");
  }
  static {
    __name2(this, "_ZodArray");
  }
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result3) => {
        return ParseStatus.mergeArray(status, result3);
      });
    }
    const result2 = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result2);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new _ZodArray(__spreadProps(__spreadValues({}, this._def), {
      minLength: { value: minLength, message: errorUtil.toString(message) }
    }));
  }
  max(maxLength, message) {
    return new _ZodArray(__spreadProps(__spreadValues({}, this._def), {
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    }));
  }
  length(len, message) {
    return new _ZodArray(__spreadProps(__spreadValues({}, this._def), {
      exactLength: { value: len, message: errorUtil.toString(message) }
    }));
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray(__spreadValues({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray
  }, processCreateParams(params)));
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject(__spreadProps(__spreadValues({}, schema._def), {
      shape: /* @__PURE__ */ __name2(() => newShape, "shape")
    }));
  } else if (schema instanceof ZodArray) {
    return new ZodArray(__spreadProps(__spreadValues({}, schema._def), {
      type: deepPartialify(schema.element)
    }));
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
__name(deepPartialify, "deepPartialify");
__name2(deepPartialify, "deepPartialify");
var ZodObject = class _ZodObject extends ZodType {
  static {
    __name(this, "_ZodObject");
  }
  static {
    __name2(this, "_ZodObject");
  }
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") {
      } else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(() => __async(this, null, function* () {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = yield pair.key;
          const value = yield pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      })).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new _ZodObject(__spreadValues(__spreadProps(__spreadValues({}, this._def), {
      unknownKeys: "strict"
    }), message !== void 0 ? {
      errorMap: /* @__PURE__ */ __name2((issue, ctx) => {
        var _a, _b, _c, _d;
        const defaultError = (_c = (_b = (_a = this._def).errorMap) == null ? void 0 : _b.call(_a, issue, ctx).message) != null ? _c : ctx.defaultError;
        if (issue.code === "unrecognized_keys")
          return {
            message: (_d = errorUtil.errToObj(message).message) != null ? _d : defaultError
          };
        return {
          message: defaultError
        };
      }, "errorMap")
    } : {}));
  }
  strip() {
    return new _ZodObject(__spreadProps(__spreadValues({}, this._def), {
      unknownKeys: "strip"
    }));
  }
  passthrough() {
    return new _ZodObject(__spreadProps(__spreadValues({}, this._def), {
      unknownKeys: "passthrough"
    }));
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject(__spreadProps(__spreadValues({}, this._def), {
      shape: /* @__PURE__ */ __name2(() => __spreadValues(__spreadValues({}, this._def.shape()), augmentation), "shape")
    }));
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: /* @__PURE__ */ __name2(() => __spreadValues(__spreadValues({}, this._def.shape()), merging._def.shape()), "shape"),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject(__spreadProps(__spreadValues({}, this._def), {
      catchall: index
    }));
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject(__spreadProps(__spreadValues({}, this._def), {
      shape: /* @__PURE__ */ __name2(() => shape, "shape")
    }));
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject(__spreadProps(__spreadValues({}, this._def), {
      shape: /* @__PURE__ */ __name2(() => shape, "shape")
    }));
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new _ZodObject(__spreadProps(__spreadValues({}, this._def), {
      shape: /* @__PURE__ */ __name2(() => newShape, "shape")
    }));
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new _ZodObject(__spreadProps(__spreadValues({}, this._def), {
      shape: /* @__PURE__ */ __name2(() => newShape, "shape")
    }));
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject(__spreadValues({
    shape: /* @__PURE__ */ __name2(() => shape, "shape"),
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject
  }, processCreateParams(params)));
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject(__spreadValues({
    shape: /* @__PURE__ */ __name2(() => shape, "shape"),
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject
  }, processCreateParams(params)));
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject(__spreadValues({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject
  }, processCreateParams(params)));
};
var ZodUnion = class extends ZodType {
  static {
    __name(this, "ZodUnion");
  }
  static {
    __name2(this, "ZodUnion");
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result2 of results) {
        if (result2.result.status === "valid") {
          return result2.result;
        }
      }
      for (const result2 of results) {
        if (result2.result.status === "dirty") {
          ctx.common.issues.push(...result2.ctx.common.issues);
          return result2.result;
        }
      }
      const unionErrors = results.map((result2) => new ZodError(result2.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    __name(handleResults, "handleResults");
    __name2(handleResults, "handleResults");
    if (ctx.common.async) {
      return Promise.all(options.map((option) => __async(this, null, function* () {
        const childCtx = __spreadProps(__spreadValues({}, ctx), {
          common: __spreadProps(__spreadValues({}, ctx.common), {
            issues: []
          }),
          parent: null
        });
        return {
          result: yield option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      }))).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = __spreadProps(__spreadValues({}, ctx), {
          common: __spreadProps(__spreadValues({}, ctx.common), {
            issues: []
          }),
          parent: null
        });
        const result2 = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result2.status === "valid") {
          return result2;
        } else if (result2.status === "dirty" && !dirty) {
          dirty = { result: result2, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types, params) => {
  return new ZodUnion(__spreadValues({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion
  }, processCreateParams(params)));
};
var getDiscriminator = /* @__PURE__ */ __name2((type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
}, "getDiscriminator");
var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  static {
    __name(this, "_ZodDiscriminatedUnion");
  }
  static {
    __name2(this, "_ZodDiscriminatedUnion");
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new _ZodDiscriminatedUnion(__spreadValues({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap
    }, processCreateParams(params)));
  }
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = __spreadValues(__spreadValues({}, a), b);
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
__name(mergeValues, "mergeValues");
__name2(mergeValues, "mergeValues");
var ZodIntersection = class extends ZodType {
  static {
    __name(this, "ZodIntersection");
  }
  static {
    __name2(this, "ZodIntersection");
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = /* @__PURE__ */ __name2((parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    }, "handleParsed");
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection(__spreadValues({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection
  }, processCreateParams(params)));
};
var ZodTuple = class _ZodTuple extends ZodType {
  static {
    __name(this, "_ZodTuple");
  }
  static {
    __name2(this, "_ZodTuple");
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple(__spreadProps(__spreadValues({}, this._def), {
      rest
    }));
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple(__spreadValues({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null
  }, processCreateParams(params)));
};
var ZodRecord = class _ZodRecord extends ZodType {
  static {
    __name(this, "_ZodRecord");
  }
  static {
    __name2(this, "_ZodRecord");
  }
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new _ZodRecord(__spreadValues({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord
      }, processCreateParams(third)));
    }
    return new _ZodRecord(__spreadValues({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord
    }, processCreateParams(second)));
  }
};
var ZodMap = class extends ZodType {
  static {
    __name(this, "ZodMap");
  }
  static {
    __name2(this, "ZodMap");
  }
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(() => __async(this, null, function* () {
        for (const pair of pairs) {
          const key = yield pair.key;
          const value = yield pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      }));
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap(__spreadValues({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap
  }, processCreateParams(params)));
};
var ZodSet = class _ZodSet extends ZodType {
  static {
    __name(this, "_ZodSet");
  }
  static {
    __name2(this, "_ZodSet");
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    __name(finalizeSet, "finalizeSet");
    __name2(finalizeSet, "finalizeSet");
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new _ZodSet(__spreadProps(__spreadValues({}, this._def), {
      minSize: { value: minSize, message: errorUtil.toString(message) }
    }));
  }
  max(maxSize, message) {
    return new _ZodSet(__spreadProps(__spreadValues({}, this._def), {
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    }));
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet(__spreadValues({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet
  }, processCreateParams(params)));
};
var ZodFunction = class _ZodFunction extends ZodType {
  static {
    __name(this, "_ZodFunction");
  }
  static {
    __name2(this, "_ZodFunction");
  }
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error32) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error32
        }
      });
    }
    __name(makeArgsIssue, "makeArgsIssue");
    __name2(makeArgsIssue, "makeArgsIssue");
    function makeReturnsIssue(returns, error32) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error32
        }
      });
    }
    __name(makeReturnsIssue, "makeReturnsIssue");
    __name2(makeReturnsIssue, "makeReturnsIssue");
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(function(...args) {
        return __async(this, null, function* () {
          const error32 = new ZodError([]);
          const parsedArgs = yield me._def.args.parseAsync(args, params).catch((e2) => {
            error32.addIssue(makeArgsIssue(args, e2));
            throw error32;
          });
          const result2 = yield Reflect.apply(fn, this, parsedArgs);
          const parsedReturns = yield me._def.returns._def.type.parseAsync(result2, params).catch((e2) => {
            error32.addIssue(makeReturnsIssue(result2, e2));
            throw error32;
          });
          return parsedReturns;
        });
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result2 = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result2, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result2, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction(__spreadProps(__spreadValues({}, this._def), {
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    }));
  }
  returns(returnType) {
    return new _ZodFunction(__spreadProps(__spreadValues({}, this._def), {
      returns: returnType
    }));
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new _ZodFunction(__spreadValues({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction
    }, processCreateParams(params)));
  }
};
var ZodLazy = class extends ZodType {
  static {
    __name(this, "ZodLazy");
  }
  static {
    __name2(this, "ZodLazy");
  }
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy(__spreadValues({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy
  }, processCreateParams(params)));
};
var ZodLiteral = class extends ZodType {
  static {
    __name(this, "ZodLiteral");
  }
  static {
    __name2(this, "ZodLiteral");
  }
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value, params) => {
  return new ZodLiteral(__spreadValues({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral
  }, processCreateParams(params)));
};
function createZodEnum(values, params) {
  return new ZodEnum(__spreadValues({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum
  }, processCreateParams(params)));
}
__name(createZodEnum, "createZodEnum");
__name2(createZodEnum, "createZodEnum");
var ZodEnum = class _ZodEnum extends ZodType {
  static {
    __name(this, "_ZodEnum");
  }
  static {
    __name2(this, "_ZodEnum");
  }
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, __spreadValues(__spreadValues({}, this._def), newDef));
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), __spreadValues(__spreadValues({}, this._def), newDef));
  }
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  static {
    __name(this, "ZodNativeEnum");
  }
  static {
    __name2(this, "ZodNativeEnum");
  }
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum(__spreadValues({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum
  }, processCreateParams(params)));
};
var ZodPromise = class extends ZodType {
  static {
    __name(this, "ZodPromise");
  }
  static {
    __name2(this, "ZodPromise");
  }
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise(__spreadValues({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise
  }, processCreateParams(params)));
};
var ZodEffects = class extends ZodType {
  static {
    __name(this, "ZodEffects");
  }
  static {
    __name2(this, "ZodEffects");
  }
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: /* @__PURE__ */ __name2((arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      }, "addIssue"),
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then((processed2) => __async(this, null, function* () {
          if (status.value === "aborted")
            return INVALID;
          const result2 = yield this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result2.status === "aborted")
            return INVALID;
          if (result2.status === "dirty")
            return DIRTY(result2.value);
          if (status.value === "dirty")
            return DIRTY(result2.value);
          return result2;
        }));
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result2 = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result2.status === "aborted")
          return INVALID;
        if (result2.status === "dirty")
          return DIRTY(result2.value);
        if (status.value === "dirty")
          return DIRTY(result2.value);
        return result2;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = /* @__PURE__ */ __name2((acc) => {
        const result2 = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result2);
        }
        if (result2 instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      }, "executeRefinement");
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return INVALID;
        const result2 = effect.transform(base.value, checkCtx);
        if (result2 instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result2 };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return INVALID;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result2) => ({
            status: status.value,
            value: result2
          }));
        });
      }
    }
    util.assertNever(effect);
  }
};
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects(__spreadValues({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect
  }, processCreateParams(params)));
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects(__spreadValues({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects
  }, processCreateParams(params)));
};
var ZodOptional = class extends ZodType {
  static {
    __name(this, "ZodOptional");
  }
  static {
    __name2(this, "ZodOptional");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional(__spreadValues({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional
  }, processCreateParams(params)));
};
var ZodNullable = class extends ZodType {
  static {
    __name(this, "ZodNullable");
  }
  static {
    __name2(this, "ZodNullable");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable(__spreadValues({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable
  }, processCreateParams(params)));
};
var ZodDefault = class extends ZodType {
  static {
    __name(this, "ZodDefault");
  }
  static {
    __name2(this, "ZodDefault");
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type, params) => {
  return new ZodDefault(__spreadValues({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default
  }, processCreateParams(params)));
};
var ZodCatch = class extends ZodType {
  static {
    __name(this, "ZodCatch");
  }
  static {
    __name2(this, "ZodCatch");
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = __spreadProps(__spreadValues({}, ctx), {
      common: __spreadProps(__spreadValues({}, ctx.common), {
        issues: []
      })
    });
    const result2 = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: __spreadValues({}, newCtx)
    });
    if (isAsync(result2)) {
      return result2.then((result3) => {
        return {
          status: "valid",
          value: result3.status === "valid" ? result3.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result2.status === "valid" ? result2.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type, params) => {
  return new ZodCatch(__spreadValues({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch
  }, processCreateParams(params)));
};
var ZodNaN = class extends ZodType {
  static {
    __name(this, "ZodNaN");
  }
  static {
    __name2(this, "ZodNaN");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN(__spreadValues({
    typeName: ZodFirstPartyTypeKind.ZodNaN
  }, processCreateParams(params)));
};
var BRAND = /* @__PURE__ */ Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  static {
    __name(this, "ZodBranded");
  }
  static {
    __name2(this, "ZodBranded");
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  static {
    __name(this, "_ZodPipeline");
  }
  static {
    __name2(this, "_ZodPipeline");
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = /* @__PURE__ */ __name2(() => __async(this, null, function* () {
        const inResult = yield this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      }), "handleAsync");
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new _ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly = class extends ZodType {
  static {
    __name(this, "ZodReadonly");
  }
  static {
    __name2(this, "ZodReadonly");
  }
  _parse(input) {
    const result2 = this._def.innerType._parse(input);
    const freeze = /* @__PURE__ */ __name2((data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    }, "freeze");
    return isAsync(result2) ? result2.then((data) => freeze(data)) : freeze(result2);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly.create = (type, params) => {
  return new ZodReadonly(__spreadValues({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly
  }, processCreateParams(params)));
};
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
__name(cleanParams, "cleanParams");
__name2(cleanParams, "cleanParams");
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      var _a, _b;
      const r2 = check(data);
      if (r2 instanceof Promise) {
        return r2.then((r3) => {
          var _a2, _b2;
          if (!r3) {
            const params = cleanParams(_params, data);
            const _fatal = (_b2 = (_a2 = params.fatal) != null ? _a2 : fatal) != null ? _b2 : true;
            ctx.addIssue(__spreadProps(__spreadValues({ code: "custom" }, params), { fatal: _fatal }));
          }
        });
      }
      if (!r2) {
        const params = cleanParams(_params, data);
        const _fatal = (_b = (_a = params.fatal) != null ? _a : fatal) != null ? _b : true;
        ctx.addIssue(__spreadProps(__spreadValues({ code: "custom" }, params), { fatal: _fatal }));
      }
      return;
    });
  return ZodAny.create();
}
__name(custom, "custom");
__name2(custom, "custom");
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = /* @__PURE__ */ __name2((cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params), "instanceOfType");
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = /* @__PURE__ */ __name2(() => stringType().optional(), "ostring");
var onumber = /* @__PURE__ */ __name2(() => numberType().optional(), "onumber");
var oboolean = /* @__PURE__ */ __name2(() => booleanType().optional(), "oboolean");
var coerce = {
  string: /* @__PURE__ */ __name2(((arg) => ZodString.create(__spreadProps(__spreadValues({}, arg), { coerce: true }))), "string"),
  number: /* @__PURE__ */ __name2(((arg) => ZodNumber.create(__spreadProps(__spreadValues({}, arg), { coerce: true }))), "number"),
  boolean: /* @__PURE__ */ __name2(((arg) => ZodBoolean.create(__spreadProps(__spreadValues({}, arg), {
    coerce: true
  }))), "boolean"),
  bigint: /* @__PURE__ */ __name2(((arg) => ZodBigInt.create(__spreadProps(__spreadValues({}, arg), { coerce: true }))), "bigint"),
  date: /* @__PURE__ */ __name2(((arg) => ZodDate.create(__spreadProps(__spreadValues({}, arg), { coerce: true }))), "date")
};
var NEVER = INVALID;
init_process();
var log5 = new Logger("packages/token/src/util.ts");
function matchId(queryId = "*", id) {
  if (queryId === "*") {
    return true;
  }
  if (id === void 0) {
    return false;
  }
  return queryId === id;
}
__name(matchId, "matchId");
__name2(matchId, "matchId");
function matchName(tokenVersion, queryName = "*", name) {
  if (queryName === "*") {
    return true;
  }
  switch (tokenVersion) {
    case 1:
      if (name === void 0) {
        return false;
      }
      return queryName === name;
    case 2:
    case 3:
      return matchVersion2ScopeName(queryName, name);
    default: {
      throw new SkyWayError({
        path: log5.prefix,
        info: tokenErrors.invalidParameter,
        error: new Error(
          `invalid token version: version ${tokenVersion} is not supported.`
        )
      });
    }
  }
}
__name(matchName, "matchName");
__name2(matchName, "matchName");
function matchVersion2ScopeName(query, name) {
  const m = query.match(/\*/g);
  if (m && m.length > 8) {
    return false;
  }
  if (name === void 0) {
    if (query.match(/^\**$/)) {
      return true;
    }
    return false;
  }
  const replacedName = query.replace(/\./g, "\\.").replace(/\*/g, ".*").replace(/\\\.\*/g, "\\*");
  const regex = new RegExp(`^${replacedName}$`);
  return regex.test(name);
}
__name(matchVersion2ScopeName, "matchVersion2ScopeName");
__name2(matchVersion2ScopeName, "matchVersion2ScopeName");
function matchScopeIdentifier(query, channelIdentifier, tokenVersion) {
  return matchId(channelIdentifier.id, query.id) && matchName(tokenVersion, channelIdentifier.name, query.name);
}
__name(matchScopeIdentifier, "matchScopeIdentifier");
__name2(matchScopeIdentifier, "matchScopeIdentifier");
var log6 = new Logger("packages/token/src/encoder.ts");
var SkyWayAuthToken = class _SkyWayAuthToken {
  static {
    __name(this, "_SkyWayAuthToken");
  }
  static {
    __name2(this, "_SkyWayAuthToken");
  }
  constructor(props) {
    let parsedProps;
    try {
      parsedProps = AuthTokenSchema.parse(props);
    } catch (error32) {
      if (error32 instanceof external_exports.ZodError) {
        throw new SkyWayError({
          path: log6.prefix,
          info: tokenErrors.invalidParameter,
          error: new Error(
            "Received invalid token. Please check your SkyWayAuthToken."
          )
        });
      } else {
        throw new SkyWayError({
          path: log6.prefix,
          info: tokenErrors.invalidParameter,
          error: new Error(
            "Received invalid token. Please check your SkyWayAuthToken."
          )
        });
      }
    }
    Object.assign(this, parsedProps);
  }
  static Decode(token) {
    try {
      const props = jwt_decode_esm_default(token);
      const authToken = new _SkyWayAuthToken(props);
      authToken.tokenString = token;
      return authToken;
    } catch (error32) {
      throw new SkyWayError({
        path: log6.prefix,
        info: tokenErrors.invalidParameter,
        error: error32
      });
    }
  }
  encode(secret) {
    const payload = {
      jti: this.jti,
      iat: this.iat,
      exp: this.exp,
      scope: this.scope,
      version: this.version
    };
    this.tokenString = import_jsrsasign.default.KJUR.jws.JWS.sign(
      "HS256",
      JSON.stringify({ alg: "HS256", typ: "JWT" }),
      JSON.stringify(payload),
      secret
    );
    return this.tokenString;
  }
  /**@internal */
  toJSON() {
    return {
      jti: this.jti,
      iat: this.iat,
      exp: this.exp,
      scope: this.scope,
      encoded: this.tokenString,
      version: this.version
    };
  }
  /**@internal */
  getAppId() {
    switch (this.version) {
      case void 0:
      case 1:
      case 2: {
        const scope = this.scope;
        return scope.app.id;
      }
      case 3: {
        const scope = this.scope;
        return scope.appId;
      }
      default:
        throw new SkyWayError({
          path: log6.prefix,
          info: tokenErrors.invalidParameter,
          error: new Error(
            `invalid token version: version ${this.version} is not supported.`
          )
        });
    }
  }
  /**@internal */
  getAnalyticsEnabled() {
    var _a, _b, _c;
    switch (this.version) {
      case void 0:
      case 1:
      case 2: {
        const scope = this.scope;
        return (_a = scope.app.analytics) != null ? _a : false;
      }
      case 3: {
        const scope = this.scope;
        return (_c = (_b = scope.analytics) == null ? void 0 : _b.enabled) != null ? _c : true;
      }
      default:
        throw new SkyWayError({
          path: log6.prefix,
          info: tokenErrors.invalidParameter,
          error: new Error(
            `invalid token version: version ${this.version} is not supported.`
          )
        });
    }
  }
  /**@internal */
  isSfuCreateBotEnabled(channel22) {
    var _a;
    switch (this.version) {
      case void 0:
      case 1:
      case 2: {
        const scope = this.scope;
        if (!scope.app.channels) {
          return false;
        }
        const channelsScope = scope.app.channels;
        const channelScope = channelsScope.find((c) => {
          return matchScopeIdentifier(channel22, c, this.version);
        });
        if (!channelScope) {
          return false;
        }
        const sfuBotsScope = channelScope.sfuBots;
        if (!sfuBotsScope || sfuBotsScope.length === 0) {
          return false;
        }
        return sfuBotsScope.some((sfuBotScope) => {
          return sfuBotScope.actions.includes("create") || sfuBotScope.actions.includes("write");
        });
      }
      case 3: {
        const scope = this.scope;
        if (!scope.rooms) {
          return false;
        }
        const roomsScope = scope.rooms;
        const roomScope = roomsScope.find((r2) => {
          return matchScopeIdentifier(channel22, r2, this.version);
        });
        if (!roomScope) {
          return false;
        }
        if (!roomScope.sfu) {
          return true;
        }
        return (_a = roomScope.sfu.enabled) != null ? _a : true;
      }
      default:
        throw new SkyWayError({
          path: log6.prefix,
          info: tokenErrors.invalidParameter,
          error: new Error(
            `invalid token version: version ${this.version} is not supported.`
          )
        });
    }
  }
};
init_process();
var forwardingActions = ["create", "write", "delete"];
var forwardingScopeSchema = external_exports.object({
  /**
   * 以下を複数指定可能
   * - write: Forwarding のすべての操作
   * - create: Forwarding の作成 (任意のメディアをSFU経由で新たに転送することができる)
   * - delete: Forwarding の削除 (SFU経由でのメディア転送を取りやめることができる)
   */
  actions: external_exports.array(
    // 型補完のため enum で定義しておく
    external_exports.enum(forwardingActions).refine((arg) => {
      return typeof arg === "string";
    })
  )
}).passthrough();
var sfuBotActions = ["create", "write", "delete"];
var sfuScopeSchema = external_exports.object({
  /**
   * 以下を複数指定可能
   * - write: SFU Bot のすべての操作をすることができる
   * - create: SFU Bot の作成ができる
   * - delete: SFU Bot の削除ができる
   */
  actions: external_exports.array(
    // 型補完のため enum で定義しておく
    external_exports.enum(sfuBotActions).refine((arg) => {
      return typeof arg === "string";
    })
  ),
  /**forwarding リソースに関するオブジェクトを指定（forwardingオブジェクトについては後述） */
  forwardings: external_exports.array(forwardingScopeSchema)
}).passthrough();
init_process();
var publicationActions = [
  "write",
  "create",
  "delete",
  "updateMetadata",
  "enable",
  "disable"
];
var publicationScopeSchema = external_exports.object({
  /**
   * 以下を複数指定可能
   * - write: すべて可能
   * - create: publish（publish時に publication が作成される）
   * - delete: unpublish（unpublish時に publication が削除される）
   * - updateMetadata: metadata の編集
   * - enable: enable
   * - disable: disable
   */
  actions: external_exports.array(
    // 型補完のため enum で定義しておく
    external_exports.enum(publicationActions).refine((arg) => {
      return typeof arg === "string";
    })
  )
}).passthrough();
var subscriptionActions = ["write", "create", "delete"];
var subscriptionScopeSchema = external_exports.object({
  /**
   * 以下を複数指定可能
   * - write: すべて可能
   * - create: subscribe（subscribe時に subscription が作成される）
   * - delete: unsubscribe（unsubscribe時に subscription が削除される）
   */
  actions: external_exports.array(
    // 型補完のため enum で定義しておく
    external_exports.enum(subscriptionActions).refine((arg) => {
      return typeof arg === "string";
    })
  )
}).passthrough();
var memberActions = [
  "write",
  "create",
  "delete",
  "updateMetadata",
  "signal"
];
var memberScopeSchemaBase = external_exports.object({
  /**
   * id (id または name のどちらかが必須 *)
   * - id で対象の member を指定
   * - '*' を指定することで、すべての member を指定
   */
  id: external_exports.string().optional(),
  /**
   * name (id または name のどちらかが必須 *)
   * - name で対象の channel を指定
   * - '*' を指定することで、すべての member を指定
   */
  name: external_exports.string().optional()
}).refine((arg) => arg.id !== void 0 || arg.name !== void 0, {
  message: "Either id or name is required."
});
var memberScopeSchema = external_exports.intersection(
  memberScopeSchemaBase,
  external_exports.object({
    /**
     * 以下を複数指定可能
     * - write: すべて可能
     * - create: 入室（入室時に member が作成される）
     * - delete: 退室（入室時に member が削除される）
     * - signal: シグナリング情報のやり取り (p2p通信を利用する際に必須)
     * - updateMetadata: metadata の編集
     */
    actions: external_exports.array(
      // 型補完のため enum で定義しておく
      external_exports.enum(memberActions).refine((arg) => {
        return typeof arg === "string";
      })
    ),
    /**publication リソースに関するオブジェクトを指定*/
    publication: publicationScopeSchema.optional(),
    /**subscription リソースに関するオブジェクトを指定*/
    subscription: subscriptionScopeSchema.optional()
  }).passthrough()
);
var channelActions = [
  "write",
  "read",
  "create",
  "delete",
  "updateMetadata"
];
var channelScopeSchemaBase = external_exports.object({
  /**
   * id (id または name のどちらかが必須 *)
   * - id で対象の member を指定
   * - '*' を指定することで、すべての member を指定
   */
  id: external_exports.string().optional(),
  /**
   * name (id または name のどちらかが必須 *)
   * - name で対象の channel を指定
   * - '*' を指定することで、すべての member を指定
   */
  name: external_exports.string().optional()
}).refine((arg) => arg.id !== void 0 || arg.name !== void 0, {
  message: "Either id or name is required."
});
var channelScopeSchema = external_exports.intersection(
  channelScopeSchemaBase,
  external_exports.object({
    /**
     * 以下を複数指定可能
     * - write: すべて可能
     * - read: 参照
     * - create: 作成
     * - delete: 削除
     * - updateMetadata: metadata の編集
     */
    actions: external_exports.array(
      // 型補完のため enum で定義しておく
      external_exports.enum(channelActions).refine((arg) => {
        return typeof arg === "string";
      })
    ),
    /**member リソースに関するオブジェクトを配列で指定 */
    members: external_exports.array(memberScopeSchema),
    /**sfuBot リソースに関するオブジェクトを配列で指定 */
    sfuBots: external_exports.array(sfuScopeSchema).optional()
  }).passthrough()
  // [key: string]: unknown; として他のkeyを許容していた部分
);
var appActions = ["read"];
var appScopeSchema = external_exports.object({
  /**アプリケーションIDを指定 */
  id: external_exports.string(),
  /**AnalyticsDashboardへのデータ送信をするかどうかの設定 */
  analytics: external_exports.boolean().optional(),
  /**アプリケーション自体に関する権限。現在は'read'固定 */
  actions: external_exports.array(
    // 型補完のため enum で定義しておく
    external_exports.enum(appActions).refine((arg) => {
      return typeof arg === "string";
    })
  ).optional(),
  /**channelリソースに関するオブジェクトを配列で指定*/
  channels: external_exports.array(channelScopeSchema).optional(),
  /**falseの場合はTurnサーバを経由してメディア通信を行いません。 */
  turn: external_exports.boolean().optional()
}).passthrough();
init_process();
var memberMethods = ["publish", "subscribe", "updateMetadata"];
var memberScopeV3SchemaBase = external_exports.object({
  /**
   * id (id または name のどちらかが必須 *)
   * - id で対象の member を指定
   * - '*' を指定することで、すべての member を指定
   */
  id: external_exports.string().optional(),
  /**
   * name (id または name のどちらかが必須 *)
   * - name で対象の member を指定
   * - '*' を指定することで、すべての member を指定
   */
  name: external_exports.string().optional()
}).refine((arg) => arg.id !== void 0 || arg.name !== void 0, {
  message: "Either id or name is required."
});
var memberScopeV3Schema = external_exports.intersection(
  memberScopeV3SchemaBase,
  external_exports.object({
    /**
     * 以下を複数指定可能
     * - publish: media/dataのpublish
     * - subscribe: media/dataのsubscribe
     * - updateMetadata: metadata の編集
     */
    methods: external_exports.array(
      // 型補完のため enum で定義しておく
      external_exports.enum(memberMethods).refine((arg) => {
        return typeof arg === "string";
      })
    )
  }).passthrough()
);
var roomMethods = ["create", "close", "updateMetadata"];
var roomScopeV3SchemaBase = external_exports.object({
  /**
   * - id または name のどちらかが必須。
   * - id で対象の room を指定。
   * - '*' を指定することで、すべての room を指定。
   * */
  id: external_exports.string().optional(),
  /**
   * - id または name のどちらかが必須。
   * - name で対象の room を指定。
   * - '*' を指定することで、すべての room を指定。
   * */
  name: external_exports.string().optional()
}).refine((arg) => arg.id !== void 0 || arg.name !== void 0, {
  message: "Either id or name is required."
});
var roomScopeV3Schema = external_exports.intersection(
  roomScopeV3SchemaBase,
  external_exports.object({
    /**
     * 以下を複数指定可能
     * - create: 作成
     * - close: 削除
     * - updateMetadata: metadata の編集
     */
    methods: external_exports.array(
      // 型補完のため enum で定義しておく
      external_exports.enum(roomMethods).refine((arg) => {
        return typeof arg === "string";
      })
    ),
    /** memberリソースに関するオブジェクトを指定 */
    member: memberScopeV3Schema.optional(),
    sfu: external_exports.object({
      /**SFUサーバーの利用有無。enabledがfalseの場合はSFUサーバーを利用したメディア通信を行わない。指定しない場合は enabled: true として扱われる。 */
      enabled: external_exports.boolean().optional(),
      /**maxSubscribersの上限値の設定。指定しない場合はSFUサーバー側において設定可能な上限値になる。*/
      maxSubscribersLimit: external_exports.number().optional()
    }).optional(),
    stt: external_exports.object({
      /**文字起こし機能の利用有無。enabledがfalseの場合は文字起こし機能を利用できない。指定しない場合は enabled: true として扱われる。 */
      enabled: external_exports.boolean().optional()
    }).optional()
  }).passthrough()
);
var scopeV3Schema = external_exports.object({
  /**アプリケーションIDを指定 */
  appId: external_exports.string(),
  /**AnalyticsDashboardへのデータ送信をするかどうかの設定。指定しない場合は enabled: true として扱われる。 */
  analytics: external_exports.object({
    enabled: external_exports.boolean().optional()
  }).optional(),
  /**AI Noise Cancellerの認可を有効化するかどうかの設定。設定しない場合は enabled: true として扱われる。 */
  noiseCancelling: external_exports.object({
    enabled: external_exports.boolean().optional()
  }).optional(),
  /**TURNサーバー利用の設定。enabledがfalseの場合はTURNサーバーを経由してメディア通信を行わない。指定しない場合は enabled: true として扱われる。 */
  turn: external_exports.object({
    enabled: external_exports.boolean().optional()
  }).optional(),
  /**roomリソースに関するオブジェクトを配列で指定*/
  rooms: external_exports.array(roomScopeV3Schema)
}).passthrough();
init_process();
var authTokenBaseSchema = external_exports.object({
  /** トークンのユニークなid(uuid) */
  jti: external_exports.string().uuid(),
  /** トークンが発行された日時(UNIX timestamp) */
  iat: external_exports.number().nonnegative(),
  /** このトークンが無効になる時間を表すタイムスタンプ(UNIX timestamp) */
  exp: external_exports.number().nonnegative()
});
var authTokenV1_2Schema = external_exports.intersection(
  authTokenBaseSchema,
  external_exports.object({
    /**
     * tokenの権限を表すクレーム[version:1,2,undefined]
     * */
    scope: external_exports.object({
      app: appScopeSchema
    }),
    /**
     * tokenのバージョン[version:1,2,undefined]
     * - 未指定やundefinedの場合は1として扱われます。
     * - 3の場合とでscopeの構造に違いがあります。
     * */
    version: external_exports.union([external_exports.literal(1), external_exports.literal(2), external_exports.literal(void 0)]).optional()
  })
);
var authTokenV3Schema = external_exports.intersection(
  authTokenBaseSchema,
  external_exports.object({
    /**
     * tokenの権限を表すクレーム[version:3]
     * */
    scope: scopeV3Schema,
    /**
     * tokenのバージョン[version:3]
     * - 2以下の場合とでscopeの構造に違いがあります。
     * */
    version: external_exports.literal(3)
  })
);
var AuthTokenSchema = external_exports.union([
  authTokenV1_2Schema,
  authTokenV3Schema
]);
init_process();
var tokenErrors = {
  invalidParameter: {
    name: "invalidParameter",
    detail: "failed to decode token",
    solution: "Use the correct token according to the specification"
  },
  invalidAppIdParameter: {
    name: "invalidAppIdParameter",
    detail: "failed to get AppId",
    solution: "Use the correct token according to the specification"
  },
  invalidAnalyticsParameter: {
    name: "invalidAnalyticsParameter",
    detail: "failed to get analytics scope",
    solution: "Use the correct token according to the specification"
  }
};
var uuidV4 = v4_default;
var ROOM_RE = /^scg_[A-Z0-9]{6}$/;
var cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, "Content-Type": "application/json" }
  });
}
__name(json, "json");
__name2(json, "json");
async function onRequestOptions() {
  return new Response(null, { status: 204, headers: { ...cors } });
}
__name(onRequestOptions, "onRequestOptions");
__name2(onRequestOptions, "onRequestOptions");
async function onRequestPost(context22) {
  try {
    const appId = context22.env.SKYWAY_APP_ID;
    const secretKey = context22.env.SKYWAY_SECRET_KEY;
    if (!appId || !secretKey) {
      return json(
        {
          error: "SKYWAY_APP_ID / SKYWAY_SECRET_KEY \u304C Pages \u306E\u74B0\u5883\u5909\u6570\u306B\u3042\u308A\u307E\u305B\u3093\u3002"
        },
        503
      );
    }
    const body = await context22.request.json().catch(() => ({}));
    const roomName = body.roomName;
    if (!roomName || !ROOM_RE.test(String(roomName))) {
      return json({ error: "roomName \u304C\u4E0D\u6B63\u3067\u3059\uFF08scg_XXXXXX \u5F62\u5F0F\uFF09\u3002" }, 400);
    }
    const iat = Math.floor(Date.now() / 1e3);
    const exp = iat + 60 * 60 * 12;
    const token = new SkyWayAuthToken({
      jti: uuidV4(),
      iat,
      exp,
      version: 3,
      scope: {
        appId,
        turn: { enabled: true },
        rooms: [
          {
            name: roomName,
            methods: ["create", "close", "updateMetadata"],
            member: {
              name: "*",
              methods: ["publish", "subscribe", "updateMetadata"]
            }
          }
        ]
      }
    });
    return json({ token: token.encode(secretKey) });
  } catch (e2) {
    return json({ error: String(e2?.message || e2) }, 500);
  }
}
__name(onRequestPost, "onRequestPost");
__name2(onRequestPost, "onRequestPost");
var routes = [
  {
    routePath: "/api/skyway-token",
    mountPath: "/api",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions]
  },
  {
    routePath: "/api/skyway-token",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  }
];
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count32 = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count32--;
          if (count32 === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count32++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count32)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
__name2(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result2 = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name2(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name2(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name2(function() {
    var result3 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result3 += value2;
    }
    return result3;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name2(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name2(function(prefix2) {
    var prev = result2[result2.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result2.push(path);
        path = "";
      }
      result2.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result2.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result2.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result2;
}
__name(parse, "parse");
__name2(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
__name2(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name2(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
__name2(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
__name2(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
__name2(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
__name2(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
__name2(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
__name2(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
__name2(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");
__name2(pathToRegexp, "pathToRegexp");
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
__name2(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env22, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name2(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result2 = handlerIterator.next();
      if (result2.done === false) {
        const { handler, params, path } = result2.value;
        const context22 = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env: env22,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name2(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context22);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env22["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error32) {
      if (isFailOpen) {
        const response = await env22["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error32;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name2((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
var drainBody = /* @__PURE__ */ __name2(async (request, env22, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env22);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e2) {
      console.error("Failed to drain the unused request body.", e2);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;
function reduceError(e2) {
  return {
    name: e2?.name,
    message: e2?.message ?? String(e2),
    stack: e2?.stack,
    cause: e2?.cause === void 0 ? void 0 : reduceError(e2.cause)
  };
}
__name(reduceError, "reduceError");
__name2(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name2(async (request, env22, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env22);
  } catch (e2) {
    const error32 = reduceError(e2);
    return Response.json(error32, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
__name2(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env22, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env22, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
__name2(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env22, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env22, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");
__name2(__facade_invoke__, "__facade_invoke__");
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  static {
    __name(this, "___Facade_ScheduledController__");
  }
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name2(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name2(function(request, env22, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env22, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env22, ctx) {
      const dispatcher = /* @__PURE__ */ __name2(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env22, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env22, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
__name2(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name2((request, env22, ctx) => {
      this.env = env22;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name2((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
__name2(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody2 = /* @__PURE__ */ __name(async (request, env3, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env3);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e2) {
      console.error("Failed to drain the unused request body.", e2);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default2 = drainBody2;

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError2(e2) {
  return {
    name: e2?.name,
    message: e2?.message ?? String(e2),
    stack: e2?.stack,
    cause: e2?.cause === void 0 ? void 0 : reduceError2(e2.cause)
  };
}
__name(reduceError2, "reduceError");
var jsonError2 = /* @__PURE__ */ __name(async (request, env3, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env3);
  } catch (e2) {
    const error4 = reduceError2(e2);
    return Response.json(error4, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default2 = jsonError2;

// .wrangler/tmp/bundle-83NWQI/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__2 = [
  middleware_ensure_req_body_drained_default2,
  middleware_miniflare3_json_error_default2
];
var middleware_insertion_facade_default2 = middleware_loader_entry_default;

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__2 = [];
function __facade_register__2(...args) {
  __facade_middleware__2.push(...args.flat());
}
__name(__facade_register__2, "__facade_register__");
function __facade_invokeChain__2(request, env3, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__2(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env3, ctx, middlewareCtx);
}
__name(__facade_invokeChain__2, "__facade_invokeChain__");
function __facade_invoke__2(request, env3, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__2(request, env3, ctx, dispatch, [
    ...__facade_middleware__2,
    finalMiddleware
  ]);
}
__name(__facade_invoke__2, "__facade_invoke__");

// .wrangler/tmp/bundle-83NWQI/middleware-loader.entry.ts
var __Facade_ScheduledController__2 = class ___Facade_ScheduledController__2 {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__2)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler2(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env3, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env3, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env3, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__2(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env3, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__2(request, env3, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler2, "wrapExportedHandler");
function wrapWorkerEntrypoint2(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env3, ctx) => {
      this.env = env3;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__2(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__2(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint2, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY2;
if (typeof middleware_insertion_facade_default2 === "object") {
  WRAPPED_ENTRY2 = wrapExportedHandler2(middleware_insertion_facade_default2);
} else if (typeof middleware_insertion_facade_default2 === "function") {
  WRAPPED_ENTRY2 = wrapWorkerEntrypoint2(middleware_insertion_facade_default2);
}
var middleware_loader_entry_default2 = WRAPPED_ENTRY2;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__2 as __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default2 as default
};
/*! Bundled license information:

@skyway-sdk/token/dist/index.mjs:
  (*! Bundled license information:
  
  jsrsasign/lib/jsrsasign.js:
    (*! CryptoJS v3.1.2 core-fix.js
     * code.google.com/p/crypto-js
     * (c) 2009-2013 by Jeff Mott. All rights reserved.
     * code.google.com/p/crypto-js/wiki/License
     * THIS IS FIX of 'core.js' to fix Hmac issue.
     * https://code.google.com/p/crypto-js/issues/detail?id=84
     * https://crypto-js.googlecode.com/svn-history/r667/branches/3.x/src/core.js
     *)
    (*! (c) Tom Wu | http://www-cs-students.stanford.edu/~tjw/jsbn/
     *)
    (*! (c) Tom Wu, Kenji Urushima | http://www-cs-students.stanford.edu/~tjw/jsbn/
     *)
    (*! (c) Stefan Thomas | https://github.com/bitcoinjs/bitcoinjs-lib
     *)
    (*! Mike Samuel (c) 2009 | code.google.com/p/json-sans-eval
     *)
  *)
*/
//# sourceMappingURL=functionsWorker-0.12778263028433368.js.map
