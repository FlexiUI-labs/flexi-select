# Flexi Select

Lightweight, customizable Angular select component with search, infinite scroll, single/multiple selection and full keyboard & ARIA support.

---

## Live Demo

[![Edit in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://stackblitz.com/edit/stackblitz-starters-c3dvmx7v?file=src%2Fmain.ts)

## Features

- 🔍 Built-in search/filter
- ✅ Single & multiple select modes
- 📜 Infinite scroll / lazy load (`itemsPerPage`, `clientHeight`)
- 🎨 Theme support (`themeClass='light' | 'dark'`)
- 🔧 Full customization through inputs & CSS variables
- ⚙️ Angular Forms & `ngModel` integration
- ♿️ ARIA roles & keyboard navigation

---

## Installation

```bash
npm install flexi-select
```

---

## Usage

### 1. Import

<details>
<summary>Standalone (recommended)</summary>

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { FlexiSelectModule } from 'flexi-select';

bootstrapApplication(AppComponent, {
  imports: [FlexiSelectModule]
});
```
</details>

<details>
<summary>NgModule</summary>

```ts
import { NgModule } from '@angular/core';
import { FlexiSelectModule } from 'flexi-select';

@NgModule({
  imports: [FlexiSelectModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
```
</details>

---

### 2. Basic Single Select

```html
<flexi-select
  [data]='users'
  [loading]='loading'
  value='id'
  label='name'
  (selected)='onUserSelected($event)'>
</flexi-select>
```
- `data`: array of items (object[])
- `value`: property key for option value
- `label`: property key for display text
- `(selected)`: emits the selected `value`

```html
<flexi-select
  [data]='users'
  [loading]='loading'
  (selected)='onUserSelected($event)'>
</flexi-select>
```
- `data`: array of items (string[], number[], boolean[] etc.)
- `(selected)`: emits the selected `value`

---

### 3. Multiple Select

```html
<flexi-select
  [data]='tags'
  [loading]='loading'
  value='tagId'
  label='tagName'
  [multiple]='true'
  [closeAfterSelect]='false'
  (selected)='onTagsSelected($event)'>
</flexi-select>
```

- `[multiple]`: enable multi-select
- `[closeAfterSelect]`: keep dropdown open on each pick

---

### 4. Using `<flexi-option>`

```html
<flexi-select
  value='code'
  label='viewValue'
  (selected)='onCodeSelected($event)'>
  <flexi-option value='A1'>Option A1</flexi-option>
  <flexi-option value='B2'>Option B2</flexi-option>
  <flexi-option value='C3'>Option C3</flexi-option>
</flexi-select>
```

Child `<flexi-option>` elements auto-generate the `data` array.

---

### 5. Angular Forms

**Template-driven:**

```html
<flexi-select
  [data]='cities'
  [loading]='loading'
  value='id'
  label='name'
  [(ngModel)]='selectedId'
  name='selectedId'
  >
</flexi-select>
```

**Reactive Forms:**

_In component:_

```bash
form = new FormGroup({
  country: new FormControl(null)
});
```

_In template:_

```html
<flexi-select
  [data]='countries'
  [loading]='loading'
  value='iso'
  label='name'
  formControlName='country'
  name='country'
  >
</flexi-select>
```

## Disabled State

```html
<flexi-select
  [data]='users'
  [loading]='loading'
  value='id'
  label='name'
  [disabled]='true'>
</flexi-select>
```

- `[disabled]`: Makes the select non-interactive with visual styling
- Automatically handles cursor, focus, and click events
- Supports both light and dark themes

---

## Form Validation

### Basic Required Validation

```html
<form [formGroup]='myForm'>
  <flexi-select
    [data]='countries'
    [loading]='loading'
    formControlName='country'
    value='id'
    label='name'
    [required]='true'
    [showValidationErrors]='true'
    [customValidationMessage]='"Please select a country"'>
  </flexi-select>
</form>
```

### Multiple Selection with Min/Max Validation

```html
<flexi-select
  [data]='cities'
  [loading]='loading'
  formControlName='cities'
  value='id'
  label='name'
  [multiple]='true'
  [required]='true'
  [minSelections]='2'
  [maxSelections]='5'
  [showValidationErrors]='true'
  language='en'>
</flexi-select>
```

**Validation features:**
- Required field validation
- Min/max selections for multiple mode
- Custom validation messages
- Built-in error display with proper ARIA attributes
- Multi-language support (tr, en, bg)
- Visual feedback with red borders and validation states

---

## Additional Inputs (Validation & State)

| Input                      | Type      | Default     | Description                                    |
|----------------------------|-----------|-------------|------------------------------------------------|
| `disabled`                 | `boolean` | `false`     | Disable the select component                   |
| `required`                 | `boolean` | `false`     | Mark field as required for validation          |
| `minSelections`            | `number`  | `0`         | Minimum selections (multiple mode only)        |
| `maxSelections`            | `number`  | `Infinity`  | Maximum selections (multiple mode only)        |
| `showValidationErrors`     | `boolean` | `true`      | Display validation error messages              |
| `customValidationMessage`  | `string`  | `""`        | Custom required field error message            |

## Inputs & Outputs

| Input                  | Type                       | Default    | Description                                 |
|------------------------|----------------------------|------------|---------------------------------------------|
| `data`                 | `any[]`                    | `[]`       | Options data                                |
| `value`                | `string`                   | —          | Key for option value                        |
| `label`                | `string`                   | —          | Key for option display text                 |
| `fontSize`             | `string`                   | `13px`     | Font size for all text                      |
| `multiple`             | `boolean`                  | `false`    | Enable multiple selection                   |
| `closeAfterSelect`     | `boolean`                  | `false`    | Close on each select in multi-mode          |
| `itemsPerPage`         | `number`                   | `30`       | Page size for infinite scroll               |
| `clientHeight`         | `number`                   | `180`      | Scrollable list height (px)                 |
| `height`               | `string`                   | `100%`     | Height of the main select box               |
| `tabindex`             | `number`                   | `0`        | `tabindex` for focus                        |
| `themeClass`           | `'light' \| 'dark'`        | `'light'`  | Theme via CSS variable                      |
| `language`             | `'tr' \| 'en' \| 'bg'`     | `'en'`     | Locale for search lower-casing              |
| `name`                 | `string`                   | auto-gen   | Unique name/id for ARIA & forms             |
| `loading`              | `boolean`                  | `false`    | loading                                     |


| Output                 | Type                       | Description                                 |
|------------------------|----------------------------|---------------------------------------------|
| `selected`             | `any \| any[]`             | Emits single `value` or array of values     |

---

## CSS Customization

```css
:root {
  --flexi-select-background-color: '#fff';
  --flexi-select-text-color: '#000';
  --flexi-select-active-background-color: '#ebf5ff';
  --flexi-select-active-text-color: '#212529';
  --flexi-select-border-color: '#dee2e6';
  --flexi-select-input-border-color: '#dee2e6';
  --flexi-success: '#47D764';
  --flexi-select-multiple-value-text: '#212529';
}
```
Toggle dark mode:

```html
<flexi-select themeClass='dark'></flexi-select>
```

---

## Accessibility & Keyboard

- `role='combobox'` with proper `aria-expanded`, `aria-owns`, `aria-controls`
- Type‐to‐search, arrow navigation, `Enter` to select, `Esc` to close
- Click outside to close (via `@HostListener('document:click')`)

---

## License

MIT © Taner Saydam / Flexi UI

> Crafted with ❤ for easy, flexible selects in Angular.
