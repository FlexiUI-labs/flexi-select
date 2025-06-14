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
  value='id'
  label='name'
  (selected)='onUserSelected($event)'>
</flexi-select>
```

- `data`: array of items
- `value`: property key for option value
- `label`: property key for display text
- `(selected)`: emits the selected `value`

---

### 3. Multiple Select

```html
<flexi-select
  [data]='tags'
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
  [(ngModel)]='selectedId'
  name='selectedId'
  [data]='cities'
  value='id'
  label='name'>
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
  formControlName='country'
  name='country'
  [data]='countries'
  value='iso'
  label='name'>
</flexi-select>
```

---

## Inputs & Outputs

| Input                  | Type                       | Default    | Description                                 |
|------------------------|----------------------------|------------|---------------------------------------------|
| `data`                 | `any[]`                    | `[]`       | Options data                                |
| `value`                | `string`                   | —          | Key for option value                        |
| `label`                | `string`                   | —          | Key for option display text                 |
| `multiple`             | `boolean`                  | `false`    | Enable multiple selection                   |
| `closeAfterSelect`     | `boolean`                  | `false`    | Close on each select in multi-mode          |
| `itemsPerPage`         | `number`                   | `30`       | Page size for infinite scroll               |
| `clientHeight`         | `number`                   | `180`      | Scrollable list height (px)                 |
| `height`               | `string`                   | `100%`     | Height of the main select box               |
| `tabindex`             | `number`                   | `0`        | `tabindex` for focus                        |
| `themeClass`           | `'light' \| 'dark'`         | `'light'`  | Theme via CSS variable                      |
| `language`             | `'tr' \| 'en' \| 'bg'`      | `'en'`     | Locale for search lower-casing              |
| `name`                 | `string`                   | auto-gen   | Unique name/id for ARIA & forms             |

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
