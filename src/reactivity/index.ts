import { extend } from "../shared"


const targetMap = new WeakMap
export function track(target: any, key: any) {
  if (!isTracking()) return
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map
    targetMap.set(target, depsMap)
  }
  let depsSet = depsMap.get(key)
  if (!depsSet) {
    depsSet = new Set
    depsMap.set(key, depsSet)
  }
  trackEffect(depsSet)
}

export function isTracking() {
  return !!activeEffect
}

export function trackEffect(depsSet: any) {
  if (depsSet.has(activeEffect)) return
  depsSet.add(activeEffect)
  activeEffect.deps.push(depsSet)
}

export function triger(target: any, key: any) {
  const depsMap = targetMap.get(target)
  const depsSet = depsMap.get(key)
  trigerEffects(depsSet)
}

export function trigerEffects(depsSet: any) {
  for (const effect of depsSet) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

let activeEffect: any;
export function effect(fn: any, options: any = {}) {
  const { scheduler } = options
  const _effect = new ReactiveEffect(fn, scheduler)
  extend(_effect, options)
  _effect.run()
  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

export class ReactiveEffect {
  public deps = []
  private active = false
  private onStop?: () => void

  constructor(private _fn: any, public scheduler?: any) {
  }

  public run() {
    if (this.active) {
      return this._fn()
    }
    activeEffect = this
    const result = this._fn()
    activeEffect = null
    return result
  }

  public stop() {
    if (this.active) return
    this.active = true
    if (this.onStop) this.onStop()
    clearupeffect(this)
  }
}

function clearupeffect(effect: any) {
  effect.deps.forEach((depSet: any) => {
    depSet.delete(effect)
  });
}

export function stop(runner: any) {
  runner.effect.stop()
}