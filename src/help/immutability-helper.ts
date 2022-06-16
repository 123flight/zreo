declare let process: any;


function stringifiable(obj: any) {
  // Safely stringify Object.create(null)
  /* istanbul ignore next */
  return typeof obj === 'object' && !('toString' in obj) ?
    Object.prototype.toString.call(obj).slice(8, -1) :
    obj;
}

// 生产环境判断
const isProduction = typeof process === 'object' && process.env.NODE_ENV === 'production';

// ？？？
export function invariant(condition: boolean, message: () => string) {
  if (!condition) {
    /* istanbul ignore next */
    if (isProduction) {
      throw new Error('Invariant failed');
    }
    throw new Error(message());
  }
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
const splice = Array.prototype.splice;

const toString = Object.prototype.toString;

function type<T>(obj: T) {
  return (toString.call(obj) as string).slice(8, -1);
}

const assign = Object.assign || /* istanbul ignore next */ (<T, S>(target: T & any, source: S & Record<string, any>) => {
  getAllKeys(source).forEach(key => {
    if (hasOwnProperty.call(source, key)) {
      target[key] = source[key] ;
    }
  });
  return target as T & S;
});

const getAllKeys = typeof Object.getOwnPropertySymbols === 'function'
  ? (obj: Record<string, any>) => Object.keys(obj).concat(Object.getOwnPropertySymbols(obj) as any)
  /* istanbul ignore next */
  : (obj: Record<string, any>) => Object.keys(obj);

// 浅拷贝
function copy<T, U, K, V, X>(
  object: T extends ReadonlyArray<U>
    ? ReadonlyArray<U>
    : T extends Map<K, V>
      ? Map<K, V>
      : T extends Set<X>
        ? Set<X>
        : T extends object
          ? T
          : any,
) {
  return Array.isArray(object)
    ? assign(object.constructor(object.length), object)
    : (type(object) === 'Map')
      ? new Map(object as Map<K, V>)
      : (type(object) === 'Set')
        ? new Set(object as Set<X>)
        : (object && typeof object === 'object')
          ? assign(Object.create(Object.getPrototypeOf(object)), object) as T
          /* istanbul ignore next */
          : object as T;
}

export class Context {
  /**
   * 导入所有默认命令
   * @private
   */
  private commands: Record<string, any> = assign({}, defaultCommands);
  constructor() {
    this.update = this.update.bind(this);
    // Deprecated: update.extend, update.isEquals and update.newContext
    (this.update as any).extend = this.extend = this.extend.bind(this);
    (this.update as any).isEquals = (x: any, y: any) => x === y;
    (this.update as any).newContext = () => new Context().update;
  }
  get isEquals() {
    return (this.update as any).isEquals;
  }
  set isEquals(value: (x: any, y: any) => boolean) {
    (this.update as any).isEquals = value;
  }
  public extend<T>(directive: string, fn: (param: any, old: T) => T) {
    this.commands[directive] = fn;
  }
  public update<T, C extends CustomCommands<object> = never>(
    object: T,
    $spec: Spec<T, C>,
  ): T {
    // 是否为函数
    const spec = (typeof $spec === 'function') ? { $apply: $spec } : $spec;

    if (!(Array.isArray(object) && Array.isArray(spec))) {
      invariant(
        !Array.isArray(spec),
        () => `update(): You provided an invalid spec to update(). The spec may ` +
          `not contain an array except as the value of $set, $push, $unshift, ` +
          `$splice or any custom command allowing an array value.`,
      );
    }

    invariant(
      typeof spec === 'object' && spec !== null,
      () => `update(): You provided an invalid spec to update(). The spec and ` +
        `every included key path must be plain objects containing one of the ` +
        `following commands: ${Object.keys(this.commands).join(', ')}.`,

    );

    let nextObject = object;
    getAllKeys(spec).forEach((key: string) => {
      if (hasOwnProperty.call(this.commands, key)) {
        const objectWasNextObject = object === nextObject;
        nextObject = this.commands[key]((spec as any)[key], nextObject, spec, object);
        // 如果两者相等，直接会滚
        if (objectWasNextObject && this.isEquals(nextObject, object)) {
          nextObject = object;
        }
      } else {
        const nextValueForKey =
          type(object) === 'Map'
            ? this.update((object as any as Map<any, any>).get(key), (spec as any)[key])
            : this.update((object as any)[key], (spec as any)[key]);
        const nextObjectValue =
          type(nextObject) === 'Map'
            ? (nextObject as any as Map<any, any>).get(key)
            : (nextObject as any)[key] as any;
        if (!this.isEquals(nextValueForKey, nextObjectValue)
          || typeof nextValueForKey === 'undefined'
          && !hasOwnProperty.call(object, key)
        ) {
          if (nextObject === object) {
            nextObject = copy(object as any);
          }
          if (type(nextObject) === 'Map') {
            (nextObject as any as Map<any, any>).set(key, nextValueForKey);
          } else {
            (nextObject as any)[key] = nextValueForKey;
          }
        }
      }
    });
    return nextObject;
  }
}

const defaultCommands = {
  $push(value: any, nextObject: any, spec: any) {
    invariantPushAndUnshift(nextObject, spec, '$push');
    return value.length ? nextObject.concat(value) : nextObject;
  },
  $unshift(value: any, nextObject: any, spec: any) {
    invariantPushAndUnshift(nextObject, spec, '$unshift');
    return value.length ? value.concat(nextObject) : nextObject;
  },
  $splice(value: any, nextObject: any, spec: any, originalObject: any) {
    invariantSplices(nextObject, spec);
    value.forEach((args: any) => {
      invariantSplice(args);
      if (nextObject === originalObject && args.length) {
        nextObject = copy(originalObject);
      }
      splice.apply(nextObject, args);
    });
    return nextObject;
  },
  $set(value: any, _nextObject: any, spec: any) {
    invariantSet(spec);
    return value;
  },
  $toggle(targets: any, nextObject: any) {
    invariantSpecArray(targets, '$toggle');
    const nextObjectCopy = targets.length ? copy(nextObject) : nextObject;

    targets.forEach((target: any) => {
      nextObjectCopy[target] = !nextObject[target];
    });

    return nextObjectCopy;
  },
  $unset(value: any, nextObject: any, _spec: any, originalObject: any) {
    invariantSpecArray(value, '$unset');
    value.forEach((key: any) => {
      if (Object.hasOwnProperty.call(nextObject, key)) {
        if (nextObject === originalObject) {
          nextObject = copy(originalObject);
        }
        delete nextObject[key];
      }
    });
    return nextObject;
  },
  $add(values: any, nextObject: any, _spec: any, originalObject: any) {
    invariantMapOrSet(nextObject, '$add');
    invariantSpecArray(values, '$add');
    if (type(nextObject) === 'Map') {
      values.forEach(([key, value]: any) => {
        if (nextObject === originalObject && nextObject.get(key) !== value) {
          nextObject = copy(originalObject);
        }
        nextObject.set(key, value);
      });
    } else {
      values.forEach((value: any) => {
        if (nextObject === originalObject && !nextObject.has(value)) {
          nextObject = copy(originalObject);
        }
        nextObject.add(value);
      });
    }
    return nextObject;
  },
  $remove(value: any, nextObject: any, _spec: any, originalObject: any) {
    invariantMapOrSet(nextObject, '$remove');
    invariantSpecArray(value, '$remove');
    value.forEach((key: any) => {
      if (nextObject === originalObject && nextObject.has(key)) {
        nextObject = copy(originalObject);
      }
      nextObject.delete(key);
    });
    return nextObject;
  },
  $merge(value: any, nextObject: any, _spec: any, originalObject: any) {
    invariantMerge(nextObject, value);
    getAllKeys(value).forEach((key: any) => {
      if (value[key] !== nextObject[key]) {
        if (nextObject === originalObject) {
          nextObject = copy(originalObject);
        }
        nextObject[key] = value[key];
      }
    });
    return nextObject;
  },
  $apply(value: any, original: any) {
    invariantApply(value);
    return value(original);
  },
};

const defaultContext = new Context();
export const isEquals = (defaultContext.update as any).isEquals;
export const extend = defaultContext.extend;
export default defaultContext.update;

// @ts-ignore
exports.default.default = module.exports = assign(exports.default, exports);

// invariants

function invariantPushAndUnshift(value: any, spec: any, command: any) {
  invariant(
    Array.isArray(value),
    () => `update(): expected target of ${stringifiable(command)} to be an array; got ${stringifiable(value)}.`,
  );
  invariantSpecArray(spec[command], command);
}

function invariantSpecArray(spec: any, command: any) {
  invariant(
    Array.isArray(spec),
    () => `update(): expected spec of ${stringifiable(command)} to be an array; got ${stringifiable(spec)}. ` +
      `Did you forget to wrap your parameter in an array?`,
  );
}

function invariantSplices(value: any, spec: any) {
  invariant(
    Array.isArray(value),
    () => `Expected $splice target to be an array; got ${stringifiable(value)}`,
  );
  invariantSplice(spec.$splice);
}

function invariantSplice(value: any) {
  invariant(
    Array.isArray(value),
    () => `update(): expected spec of $splice to be an array of arrays; got ${stringifiable(value)}. ` +
      `Did you forget to wrap your parameters in an array?`,
  );
}

function invariantApply(fn: any) {
  invariant(
    typeof fn === 'function',
    () => `update(): expected spec of $apply to be a function; got ${stringifiable(fn)}.`,
  );
}

function invariantSet(spec: any) {
  invariant(
    Object.keys(spec).length === 1,
    () => `Cannot have more than one key in an object with $set`,
  );
}

function invariantMerge(target: any, specValue: any) {
  invariant(
    specValue && typeof specValue === 'object',
    () => `update(): $merge expects a spec of type 'object'; got ${stringifiable(specValue)}`,
  );
  invariant(
    target && typeof target === 'object',
    () => `update(): $merge expects a target of type 'object'; got ${stringifiable(target)}`,
  );
}

function invariantMapOrSet(target: any, command: any) {
  const typeOfTarget = type(target);
  invariant(
    typeOfTarget === 'Map' || typeOfTarget === 'Set',
    () => `update(): ${stringifiable(command)} expects a target of type Set or Map; got ${stringifiable(typeOfTarget)}`,
  );
}

// Usage with custom commands is as follows:
//
//   interface MyCommands {
//     $foo: string;
//   }
//
//    update<Foo, CustomCommands<MyCommands>>(..., { $foo: "bar" });
//
// It is suggested that if you use custom commands frequently, you wrap and re-export a
// properly-typed version of `update`:
//
//   function myUpdate<T>(object: T, spec: Spec<T, CustomCommands<MyCommands>>) {
//     return update(object, spec);
//   }
//
// See https://github.com/kolodny/immutability-helper/pull/108 for explanation of why this
// type exists.
export type CustomCommands<T> = T & { __noInferenceCustomCommandsBrand: any };

export type Spec<T, C extends CustomCommands<object> = never> =
  | (
  T extends (Array<infer U> | ReadonlyArray<infer U>) ? ArraySpec<U, C> :
    T extends (Map<infer K, infer V> | ReadonlyMap<infer K, infer V>) ? MapSpec<K, V, C> :
      T extends (Set<infer X> | ReadonlySet<infer X>) ? SetSpec<X> :
        T extends object ? ObjectSpec<T, C> :
          never
  )
  | { $set: T }
  | { $apply: (v: T) => T }
  | ((v: T) => T)
  | (C extends CustomCommands<infer O> ? O : never);

type ArraySpec<T, C extends CustomCommands<object>> =
  | { $push: ReadonlyArray<T> }
  | { $unshift: ReadonlyArray<T> }
  | { $splice: ReadonlyArray<[number, number?] | [number, number, ...T[]]> }
  | { [index: string]: Spec<T, C> }; // Note that this does not type check properly if index: number.

type MapSpec<K, V, C extends CustomCommands<object>> =
  | { $add: ReadonlyArray<[K, V]> }
  | { $remove: ReadonlyArray<K> }
  | { [key: string]: Spec<V, C> };

type SetSpec<T> =
  | { $add: ReadonlyArray<T> }
  | { $remove: ReadonlyArray<T> };

type ObjectSpec<T, C extends CustomCommands<object>> =
  | { $toggle: ReadonlyArray<keyof T> }
  | { $unset: ReadonlyArray<keyof T> }
  | { $merge: Partial<T> }
  | { [K in keyof T]?: Spec<T[K], C> };

const initialArray = [1, 2, 3];

const newArray = defaultContext.update(initialArray, {$push: [4]});
console.log(newArray)

export const objectTraps: ProxyHandler<ProxyState> = {
  get(state, prop) {
    // PROXY_STATE是一个symbol值，有两个作用，一是便于判断对象是不是已经代理过，二是帮助proxy拿到对应state的值
    // 如果对象没有代理过，直接返回
    if (prop === DRAFT_STATE) return state

    // 获取数据的备份？如果有，否则获取元数据
    const source = latest(state)

    // 如果当前数据不存在，获取原型上数据
    if (!has(source, prop)) {
      return readPropFromProto(state, source, prop)
    }
    const value = source[prop]

    // 当前代理对象已经改回了数值或者改数据是 null，直接返回
    if (state.finalized_ || !isDraftable(value)) {
      return value
    }
    // 创建代理数据
    if (value === peek(state.base_, prop)) {
      prepareCopy(state)
      return (state.copy_![prop as any] = createProxy(
        state.scope_.immer_,
        value,
        state
      ))
    }
    return value
  },
  // 当前数据是否有该属性
  has(state, prop) {
    return prop in latest(state)
  },
  set(
    state: ProxyObjectState,
    prop: string /* strictly not, but helps TS */,
    value
  ) {
    const desc = getDescriptorFromProto(latest(state), prop)

    // 如果当前有 set 属性，意味当前操作项是代理，直接设置即可
    if (desc?.set) {
      desc.set.call(state.draft_, value)
      return true
    }

    // 当前没有修改过，建立副本 copy，等待使用 get 时创建代理
    if (!state.modified_) {
      const current = peek(latest(state), prop)

      const currentState: ProxyObjectState = current?.[DRAFT_STATE]
      if (currentState && currentState.base_ === value) {
        state.copy_![prop] = value
        state.assigned_[prop] = false
        return true
      }
      if (is(value, current) && (value !== undefined || has(state.base_, prop)))
        return true
      prepareCopy(state)
      markChanged(state)
    }

    state.copy_![prop] = value
    state.assigned_[prop] = true
    return true
  },
  defineProperty() {
    die(11)
  },
  getPrototypeOf(state) {
    return Object.getPrototypeOf(state.base_)
  },
  setPrototypeOf() {
    die(12)
  }
}

// 数组的代理，把当前对象的代理拷贝过去，再修改 deleteProperty 和 set
const arrayTraps: ProxyHandler<[ProxyArrayState]> = {}
each(objectTraps, (key, fn) => {
  // @ts-ignore
  arrayTraps[key] = function() {
    arguments[0] = arguments[0][0]
    return fn.apply(this, arguments)
  }
})
arrayTraps.deleteProperty = function(state, prop) {
  if (__DEV__ && isNaN(parseInt(prop as any))) die(13)
  return objectTraps.deleteProperty!.call(this, state[0], prop)
}
arrayTraps.set = function(state, prop, value) {
  if (__DEV__ && prop !== "length" && isNaN(parseInt(prop as any))) die(14)
  return objectTraps.set!.call(this, state[0], prop, value, state[0])
}