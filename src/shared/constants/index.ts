// textarea-valid attributes only: no type, pattern, min, max or step
const TEXTAREA_FORWARDED = [
  "placeholder",
  "disabled",
  "readonly",
  "required",
  "name",
  "rows",
  "cols",
  "wrap",
  "minlength",
  "maxlength",
  "autocomplete",
  "spellcheck",
  "inputmode",
];

// plain attributes copied to the inner <input>
const FORWARDED = [
  "accept",
  "align",
  "alt",
  "type",
  "capture",
  "checked",
  "placeholder",
  "disabled",
  "readonly",
  "required",
  "dirname",
  "name",
  "value",
  "min",
  "max",
  "minlength",
  "maxlength",
  "pattern",
  "step",
  "autocomplete",
  "inputmode",
  "formaction",
  "formenctype",
  "formmethod",
  "formnovalidate",
  "formtarget",
  "height",
  "multiple",
  "size",
  "src",
  "usemap",
  "width",
  "webkitdirectory",
];

// events usable as c-on<event> -> on<event> on the inner input
const INNER_EVENTS = [
  "input",
  "change",
  "beforeinput",
  "keydown",
  "keyup",
  "focus",
  "blur",
  "select",
  "invalid",
  "paste",
  "cut",
  "copy",
];
const HANDLER_ATTRS = INNER_EVENTS.map((e) => `c-on${e}`);

export { FORWARDED, TEXTAREA_FORWARDED, INNER_EVENTS, HANDLER_ATTRS };
