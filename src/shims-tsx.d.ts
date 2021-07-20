import Vue, { CreateElement, RenderContext, VNode } from 'vue';
/* import {
  DefaultComputed,
  DefaultData,
  DefaultMethods,
  DefaultProps,
  PropsDefinition,
} from 'vue/types/options';

interface VNode {
  children?: VNode[] | unknown;
}

interface ComponentOptions<
  V extends Vue,
  Data = DefaultData<V>,
  Methods = DefaultMethods<V>,
  Computed = DefaultComputed,
  PropsDef = PropsDefinition<DefaultProps>,
  Props = DefaultProps
> {
  render?(
    createElement: CreateElement,
    hack: RenderContext<Props>
  ): VNode & {
    children?: VNode[] | unknown;
  };
} */

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}
