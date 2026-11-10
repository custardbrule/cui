import * as React from "react";
import type { Button as ButtonV1Element } from "@/components/buttons/v1/element";
import type { Card as CardV1Element } from "@/components/cards/v1/element";
import type { Card as CardV2Element } from "@/components/cards/v2/element";
import type { Card as CardV3Element } from "@/components/cards/v3/element";
import type { Checkbox as CheckboxV1Element } from "@/components/checkboxes/v1/element";
import type { Checkbox as CheckboxV2Element } from "@/components/checkboxes/v2/element";
import type { Header as HeaderV1Element } from "@/components/headers/v1/element";
import type { Input as InputV1Element } from "@/components/inputs/v1/element";
import type { Radio as RadioV1Element } from "@/components/radios/v1/element";
import type { Select as SelectV1Element } from "@/components/selects/v1/element";
import type { Textarea as TextareaV1Element } from "@/components/textareas/v1/element";

export type {
  ButtonV1Element,
  CardV1Element,
  CardV2Element,
  CardV3Element,
  CheckboxV1Element,
  CheckboxV2Element,
  HeaderV1Element,
  InputV1Element,
  RadioV1Element,
  SelectV1Element,
  TextareaV1Element,
};

type CustomEventHandler<E extends HTMLElement> = (
  event: Event & { currentTarget: E; target: E },
) => void;

type WrapperProps<E extends HTMLElement, P extends object> = P &
  Omit<
    React.HTMLAttributes<E>,
    "children" | "className" | "onChange" | "onInput" | "onInvalid"
  > & {
    children?: React.ReactNode;
    className?: string;
    ref?: React.Ref<E>;
    onChange?: CustomEventHandler<E>;
    onInput?: CustomEventHandler<E>;
    onInvalid?: CustomEventHandler<E>;
  };

type WrapOptions = {
  attributes?: Record<string, string>;
  properties?: readonly string[];
  events?: Record<string, string>;
};

let corePromise: Promise<unknown> | undefined;

function loadCore() {
  corePromise ??= import("./index").catch((error: unknown) => {
    corePromise = undefined;
    throw error;
  });
  return corePromise;
}

export function wrap<E extends HTMLElement, P extends object = {}>(
  tag: string,
  { attributes = {}, properties = [], events = {} }: WrapOptions = {},
): React.FunctionComponent<WrapperProps<E, P>> {
  const propertyProps = new Set<string>(properties);
  const eventProps = new Set(Object.keys(events));

  function Wrapped(props: WrapperProps<E, P>) {
    const element = React.useRef<E | null>(null);
    const latestProps = React.useRef(props);
    const values = props as unknown as Record<string, unknown>;
    const [defined, setDefined] = React.useState(false);
    latestProps.current = props;

    React.useEffect(() => {
      let active = true;
      loadCore()
        .then(() => customElements.whenDefined(tag))
        .then(() => {
          if (active) setDefined(true);
        })
        .catch((error: unknown) => {
          console.error(`Failed to load custom element <${tag}>`, error);
        });

      return () => {
        active = false;
      };
    }, []);

    React.useEffect(() => {
      const node = element.current;
      if (!node) return;

      const cleanups = Object.entries(events).map(([prop, eventName]) => {
        if (!eventName) return () => {};
        const listener = (event: Event) => {
          const handler = (latestProps.current as Record<string, unknown>)[
            prop
          ];
          if (typeof handler === "function") handler(event);
        };
        node.addEventListener(eventName, listener);
        return () => node.removeEventListener(eventName, listener);
      });

      return () => cleanups.forEach((cleanup) => cleanup());
    }, []);

    React.useEffect(() => {
      const node = element.current;
      if (!defined || !node) return;

      for (const prop of properties) {
        const value = values[prop];
        const target = node as unknown as Record<string, unknown>;
        if (value !== undefined && target[prop] !== value) target[prop] = value;
      }
    }, [defined, ...properties.map((prop) => values[prop])]);

    const { children, className, ref, ...rest } = props;
    const hostProps: Record<string, unknown> = {};

    for (const [prop, value] of Object.entries(rest)) {
      if (eventProps.has(prop)) continue;
      const attribute = attributes[prop] ?? prop;
      if (value === undefined || value === null || value === false) continue;
      hostProps[attribute] = value === true ? "" : value;
    }

    if (className !== undefined) hostProps.class = className;

    const setRef = (node: E | null) => {
      element.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    return React.createElement(tag, { ...hostProps, ref: setRef }, children);
  }

  Wrapped.displayName = tag;
  return Wrapped;
}

type InputProps = Omit<
  React.InputHTMLAttributes<InputV1Element>,
  | "checked"
  | "defaultChecked"
  | "defaultValue"
  | "onChange"
  | "onInput"
  | "onInvalid"
  | "ref"
  | "value"
> & {
  checked?: boolean;
  defaultChecked?: boolean;
  defaultValue?: string;
  label?: string;
  value?: string;
  webkitdirectory?: boolean;
};

const inputAttributes = {
  label: "label",
  accept: "accept",
  autoComplete: "autocomplete",
  capture: "capture",
  checked: "checked",
  defaultChecked: "checked",
  defaultValue: "value",
  dirName: "dirname",
  disabled: "disabled",
  form: "form",
  formAction: "formaction",
  formEncType: "formenctype",
  formMethod: "formmethod",
  formNoValidate: "formnovalidate",
  formTarget: "formtarget",
  height: "height",
  inputMode: "inputmode",
  max: "max",
  maxLength: "maxlength",
  min: "min",
  minLength: "minlength",
  multiple: "multiple",
  name: "name",
  pattern: "pattern",
  placeholder: "placeholder",
  readOnly: "readonly",
  required: "required",
  size: "size",
  src: "src",
  step: "step",
  type: "type",
  useMap: "usemap",
  value: "value",
  webkitdirectory: "webkitdirectory",
  width: "width",
};

export const InputV1 = wrap<InputV1Element, InputProps>("sample-input-v1", {
  attributes: inputAttributes,
  properties: ["checked", "value"],
  events: { onChange: "input", onInput: "input", onInvalid: "invalid" },
});

type TextareaProps = Omit<
  React.TextareaHTMLAttributes<TextareaV1Element>,
  "defaultValue" | "onChange" | "onInput" | "onInvalid" | "ref" | "value"
> & {
  defaultValue?: string;
  label?: string;
  value?: string;
};

export const TextareaV1 = wrap<TextareaV1Element, TextareaProps>(
  "sample-textarea-v1",
  {
    attributes: {
      label: "label",
      autoComplete: "autocomplete",
      cols: "cols",
      defaultValue: "value",
      disabled: "disabled",
      form: "form",
      maxLength: "maxlength",
      minLength: "minlength",
      name: "name",
      placeholder: "placeholder",
      readOnly: "readonly",
      required: "required",
      rows: "rows",
      wrap: "wrap",
      value: "value",
    },
    properties: ["value"],
    events: { onChange: "input", onInput: "input", onInvalid: "invalid" },
  },
);

type SelectProps = Omit<
  React.SelectHTMLAttributes<SelectV1Element>,
  "defaultValue" | "onChange" | "onInput" | "onInvalid" | "ref" | "value"
> & {
  defaultValue?: string;
  label?: string;
  placeholder?: string;
  value?: string;
};

export const SelectV1 = wrap<SelectV1Element, SelectProps>("sample-select-v1", {
  attributes: {
    label: "label",
    defaultValue: "value",
    value: "value",
    disabled: "disabled",
    form: "form",
    multiple: "multiple",
    name: "name",
    placeholder: "placeholder",
    required: "required",
  },
  properties: ["defaultValue", "value"],
  events: { onChange: "change", onInput: "input", onInvalid: "invalid" },
});

type CheckboxProps<E extends HTMLElement> = Omit<
  React.InputHTMLAttributes<E>,
  | "checked"
  | "defaultChecked"
  | "defaultValue"
  | "onChange"
  | "onInput"
  | "onInvalid"
  | "ref"
  | "type"
  | "value"
> & {
  checked?: boolean;
  defaultChecked?: boolean;
  defaultValue?: string;
  label?: string;
  value?: string;
};

const checkboxAttributes = {
  ...inputAttributes,
  defaultValue: "value",
};

const checkboxProperties = ["checked", "value"] as const;
const checkboxEvents = {
  onChange: "change",
  onInput: "input",
  onInvalid: "invalid",
};

export const CheckboxV1 = wrap<
  CheckboxV1Element,
  CheckboxProps<CheckboxV1Element>
>("sample-checkbox-v1", {
  attributes: checkboxAttributes,
  properties: checkboxProperties,
  events: checkboxEvents,
});

export const CheckboxV2 = wrap<
  CheckboxV2Element,
  CheckboxProps<CheckboxV2Element>
>("sample-checkbox-v2", {
  attributes: checkboxAttributes,
  properties: checkboxProperties,
  events: checkboxEvents,
});

type RadioProps = Omit<
  React.InputHTMLAttributes<RadioV1Element>,
  | "defaultChecked"
  | "defaultValue"
  | "onChange"
  | "onInput"
  | "onInvalid"
  | "ref"
  | "type"
> & {
  defaultChecked?: boolean;
  defaultValue?: string;
  label?: string;
};

export const RadioV1 = wrap<RadioV1Element, RadioProps>("sample-radio-v1", {
  attributes: {
    checked: "checked",
    defaultChecked: "checked",
    defaultValue: "value",
    disabled: "disabled",
    label: "label",
    name: "name",
    required: "required",
    value: "value",
  },
  events: { onChange: "change", onInput: "input", onInvalid: "invalid" },
});

type ButtonProps = Omit<
  React.ButtonHTMLAttributes<ButtonV1Element>,
  "onChange" | "onInput" | "onInvalid" | "ref" | "size"
> & {
  commandFor?: string;
  popoverTarget?: string;
  popoverTargetAction?: "hide" | "show" | "toggle";
  size?: "sm" | "lg";
  variant?: "primary" | "secondary" | "outline" | string;
};

export const ButtonV1 = wrap<ButtonV1Element, ButtonProps>("sample-button-v1", {
  attributes: {
    commandFor: "commandfor",
    formAction: "formaction",
    formEncType: "formenctype",
    formMethod: "formmethod",
    formNoValidate: "formnovalidate",
    formTarget: "formtarget",
    popoverTarget: "popovertarget",
    popoverTargetAction: "popovertargetaction",
    size: "size",
    variant: "variant",
  },
});

type CardProps<E extends HTMLElement> = {
  description?: string;
  detail?: string;
  onCardBtnClick?: CustomEventHandler<E>;
  title?: string;
};

export const CardV1 = wrap<CardV1Element, CardProps<CardV1Element>>(
  "sample-card-v1",
  {
    attributes: {
      title: "title",
      description: "description",
      detail: "detail",
    },
    events: { onCardBtnClick: "card-btn-click" },
  },
);

type CardV2Props = CardProps<CardV2Element> & {
  buttonLabel?: string;
  state?: unknown;
};

export const CardV2 = wrap<CardV2Element, CardV2Props>("sample-card-v2", {
  attributes: {
    title: "title",
    description: "description",
    detail: "detail",
    buttonLabel: "button-label",
  },
  properties: ["state"],
  events: { onCardBtnClick: "card-btn-click" },
});

export const CardV3 = wrap<CardV3Element, CardProps<CardV3Element>>(
  "sample-card-v3",
  { events: { onCardBtnClick: "card-btn-click" } },
);

export const HeaderV1 = wrap<HeaderV1Element, { title?: string }>(
  "sample-header-v1",
  { attributes: { title: "title" } },
);
