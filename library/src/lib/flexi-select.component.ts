import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, ElementRef, HostListener, OnChanges, OnInit, QueryList, SimpleChanges, ViewChildren, ViewEncapsulation, forwardRef, inject, signal, viewChildren, output, input, viewChild, linkedSignal, computed } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { FlexiOptionComponent } from './flexi-option.component';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'flexi-select',
  standalone: true,
  imports: [NgStyle, NgClass],
  templateUrl: "./flexi-select.component.html",
  styleUrl: "./flexi-select.component.css",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FlexiSelectComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FlexiSelectComponent),
      multi: true
    }
  ]
})
export class FlexiSelectComponent implements OnChanges, OnInit {
  readonly data = input<any[]>([]);
  readonly value = input<any>();
  readonly label = input<any>();
  readonly name = input<any>();
  readonly language = input<"tr" | "en" | "bg">("en");
  readonly themeClass = input<string>("light");
  readonly itemsPerPage = input<number>(30);
  readonly clientHeight = input<number>(180);
  readonly multiple = input<boolean>(false);
  readonly closeAfterSelect = input<boolean>(false);
  readonly height = input<string>("100%");
  readonly tabindex = input<number>(0);
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);

  readonly required = input<boolean>(false);
  readonly minSelections = input<number>(0);
  readonly maxSelections = input<number>(Infinity);
  readonly showValidationErrors = input<boolean>(true);
  readonly showValidationErrorMessages = input<boolean>(true);
  readonly customValidationMessage = input<string>("");

  readonly selected = output<any>({ alias: 'selected' });

  readonly isValid = signal<boolean>(true);
  readonly validationErrors = signal<string[]>([]);
  readonly isTouched = signal<boolean>(false);

  @ContentChildren(forwardRef(() => FlexiOptionComponent)) options!: QueryList<FlexiOptionComponent>;

  readonly searchInput = viewChild<ElementRef<HTMLInputElement>>("searchInput");
  readonly flexiSelectContainer = viewChild.required<ElementRef>('flexiSelectContainer');
  readonly flexiSelectDiv = viewChild.required<ElementRef>('flexiSelectDiv');
  readonly flexiSelectDropDownDiv = viewChild.required<ElementRef>("flexiSelectDropDownDiv");
  readonly flexiSelectUl = viewChild.required<ElementRef>("flexiSelectUl");

  private onChange = (value: any) => { };
  private onTouched = () => { };

  readonly filteredData = signal<any[]>([]);
  readonly selectedItem = signal<any>({});
  readonly selectedItems = signal<any[]>([]);
  readonly isOpen = signal<boolean>(false);
  initialState: any;
  readonly uniqueName = signal<string>("");
  readonly closedAfterSelect = signal<boolean>(false);
  readonly currentHighlightIndex = signal<number>(0);

  readonly dataSignal = linkedSignal(() => this.data());
  readonly labelSignal = linkedSignal(() => this.label());
  readonly valueSignal = linkedSignal(() => this.value());
  readonly clientHeightSignal = linkedSignal(() => this.clientHeight());
  readonly noData = linkedSignal<string>(() => this.translateNoData());
  readonly selectOneText = linkedSignal<string>(() => this.translateSelectOne());
  readonly maxLimitReachedText = computed<string>(() => this.translateMaxLimitReached());
  readonly noSelectionText = computed<string>(() => this.noSelection());
  readonly loadingText = computed<string>(() => this.loadingTextMethod());

  readonly #cdr = inject(ChangeDetectorRef);
  readonly #elementRef = inject(ElementRef);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["data"] && changes["data"].currentValue) {
      this.dataSignal.set([...changes["data"].currentValue]);
      if (!this.multiple()) {
        this.addPlaceholderToData();
      }
    }

    if (changes["language"]) {
      this.noData.set(this.translateNoData());
      this.selectOneText.set(this.translateSelectOne());
    }

    this.filteredData.set(this.data().slice(0, this.itemsPerPage()));
    this.currentHighlightIndex.set(0);
    this.selectFirstOne();
    this.selectInitialStateValue();
    this.#cdr.detectChanges();
  }

  ngOnInit(): void {
    this.uniqueName.set(this.name() || this.generateUniqueName());
  }

  ngAfterContentInit() {
    this.options.changes.subscribe(() => {
      if (this.options && this.options.length) {
        const optionData = this.options.map(option => ({
          value: option.value(),
          label: option.viewValue
        }));
        this.dataSignal.set(optionData);
        this.filteredData.set(this.data().slice(0, this.itemsPerPage()));
        this.selectFirstOne();
        this.labelSignal.set("label")
        this.valueSignal.set("value");
        this.selectInitialStateValue();
      }
    });
  }

  translateNoData() {
    switch (this.language()) {
      case "en": return "No records found";
      case "tr": return "Kayıt bulunamadı";
      case "bg": return "Няма намерени записи";
      default: return "";
    }
  }

  translateSelectOne() {
    switch (this.language()) {
      case "en": return "Select one";
      case "tr": return "Seçim yapınız";
      case "bg": return "Моля, изберете";
      default: return "Select one";
    }
  }

  translateMaxLimitReached() {
    switch (this.language()) {
      case "en": return "Max limit reached";
      case "tr": return "Maksimum seçime ulaştınız";
      case "bg": return "Достигнахте максималния брой избори";
      default: return "Max limit reached";
    }
  }

  noSelection() {
    switch (this.language()) {
      case "en": return "No selection";
      case "tr": return "Seçim yapılmamış";
      case "bg": return "Няма избор";
      default: return "No selection";
    }
  }

  loadingTextMethod() {
    switch (this.language()) {
      case "en": return "Loading";
      case "tr": return "Yükleniyor";
      case "bg": return "Зарежда се";
      default: return "Loading";
    }
  }

  addPlaceholderToData() {
    const placeholder = this.label() ? { [this.value()]: null, [this.label()]: this.selectOneText() } : this.selectOneText();
    const data = this.data();

    const exists = data.some(item =>
      this.label() 
        ? item[this.value()] === null && item[this.label()] === this.selectOneText()
        : item === this.selectOneText()
    );

    if (this.data().length > 0 && !exists) {
      data.unshift(placeholder);
    }
  }

  trackByFn() {
    return 'id-' + (Date.now() * Math.random());
  }

  private generateUniqueName(): string {
    return `flexi-select-${Date.now() * Math.random()}`;
  }

  selectInitialStateValue() {
    if (this.data().length > 0 && this.initialState) {
      if (this.multiple()) {
        const list: any[] = [];
        for (const val of this.initialState) {
          const d = this.data().find(p => p[this.value()] === val);
          if (d) {
            const item = {
              [this.label()]: d[this.label()],
              [this.value()]: val
            };
            list.push(item);
          }
        }
        this.selectedItems.set(list);
        this.initialState = undefined;
      } else {
        const val = this.data().find(p => p[this.value()] === this.initialState);
        if (val) {
          this.selectedItem.set({ [this.label()]: val[this.label()], [this.value()]: val[this.value()] });
          this.initialState = undefined;
        }
      }
    }
  }

  loadMoreData() {
    const val = this.searchInput()!.nativeElement.value.toString().toLocaleLowerCase("tr");
    let newData = val === "" ? this.data() : this.data().filter(p => p[this.label()].toString().toLocaleLowerCase("tr").includes(val));
    newData = newData.slice(this.filteredData().length, this.filteredData().length + this.itemsPerPage());
    this.filteredData.set([...this.filteredData(), ...newData]);
    this.clientHeightSignal.set(this.clientHeightSignal() + 180);
  }

  onScroll(event: any) {
    const element = event.target;

    if (element.scrollHeight - element.scrollTop < 200) {
      this.loadMoreData();
    }
  }

  selectFirstOne() {
    if (this.filteredData().length === 0) {
      return;
    }
    if (!this.multiple()) {
      this.selectedItem.set(this.filteredData()[0]);
    }
  }


  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.flexi-select')) {
      this.isOpen.set(false);
    }
  }

  search() {
    try {
      const val = this.searchInput()!.nativeElement.value.toString().toLocaleLowerCase("tr");
      const filtered = this.data().filter(p => (this.label() ? p[this.label()] : p).toString().toLocaleLowerCase("tr").includes(val)).slice(0, this.itemsPerPage());
      this.filteredData.set(filtered);
      this.currentHighlightIndex.set(0);
      if (!this.multiple()) {
        this.selectFirstOne();
      }
    } catch (error) {
      const filtered: any[] = [];
      this.filteredData.set(filtered);
    }
  }

  setLiClass(item: any, index: number) {
    let classes = "flexi-select-li";
    if (this.multiple()) {
      if (this.selectedItems().some(selected => this.value() ? (selected[this.value()] === item[this.value()]) : selected === item)) {
        classes += " flexi-active";
      }
    } else {
      if (this.selectedItem() && this.value() ? (item[this.value()] === this.selectedItem()[this.value()]) : item === this.selectedItem()) {
        classes += " flexi-active";
      }
    }
    if (index === this.currentHighlightIndex() && !this.multiple()) {
      classes += " flexi-highlighted";
    }
    return classes;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.disabled()) {
      return null; // Disabled ise validation yapma
    }

    const errors: ValidationErrors = {};
    const value = control.value;

    // Required validation
    if (this.required()) {
      if (this.multiple()) {
        if (!value || !Array.isArray(value) || value.length === 0) {
          errors['required'] = { message: this.getRequiredMessage() };
        }
      } else {
        if (!value || value === null || value === undefined || value === '') {
          errors['required'] = { message: this.getRequiredMessage() };
        }
      }
    }

    // Multiple selection validations
    if (this.multiple() && value && Array.isArray(value)) {
      // Min selections
      if (this.minSelections() > 0 && value.length < this.minSelections()) {
        errors['minSelections'] = {
          message: this.getMinSelectionsMessage(),
          requiredSelections: this.minSelections(),
          actualSelections: value.length
        };
      }

      // Max selections
      if (this.maxSelections() !== Infinity && value.length > this.maxSelections()) {
        errors['maxSelections'] = {
          message: this.getMaxSelectionsMessage(),
          maxSelections: this.maxSelections(),
          actualSelections: value.length
        };
      }
    }

    // Update validation state
    const isValid = Object.keys(errors).length === 0;
    this.isValid.set(isValid);

    if (!isValid) {
      const errorMessages = Object.values(errors).map((error: any) => error.message);
      this.validationErrors.set(errorMessages);
    } else {
      this.validationErrors.set([]);
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  // Validation mesajları
  getRequiredMessage(): string {
    if (this.customValidationMessage()) {
      return this.customValidationMessage();
    }

    switch (this.language()) {
      case "tr": return "Bu alan zorunludur";
      case "en": return "This field is required";
      case "bg": return "Това поле е задължително";
      default: return "This field is required";
    }
  }

  getMinSelectionsMessage(): string {
    switch (this.language()) {
      case "tr": return `En az ${this.minSelections()} seçim yapmalısınız`;
      case "en": return `You must select at least ${this.minSelections()} item(s)`;
      case "bg": return `Трябва да изберете поне ${this.minSelections()} елемент(а)`;
      default: return `You must select at least ${this.minSelections()} item(s)`;
    }
  }

  getMaxSelectionsMessage(): string {
    switch (this.language()) {
      case "tr": return `En fazla ${this.maxSelections()} seçim yapabilirsiniz`;
      case "en": return `You can select maximum ${this.maxSelections()} item(s)`;
      case "bg": return `Можете да изберете максимум ${this.maxSelections()} елемент(а)`;
      default: return `You can select maximum ${this.maxSelections()} item(s)`;
    }
  }

  onFocus() { }

  onBlur() {
    this.isTouched.set(true);
    this.closedAfterSelect.set(false);
    this.onTouched();
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.target === this.searchInput()?.nativeElement) {
      return; // Input alanından geliyorsa işlemi sonlandır
    }
    if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
      event.preventDefault();
      this.handleAlphabeticInput(event.key.toLowerCase());
    }
  }

  scrollDown() {
    setTimeout(() => {
      const element = this.flexiSelectDropDownDiv().nativeElement;
      const rect = element.getBoundingClientRect();

      const isElementNotFullyVisible = rect.top < 0 || rect.bottom > window.innerHeight;

      if (isElementNotFullyVisible) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  handleAlphabeticInput(char: string) {
    if (this.disabled()) {
      return;
    }

    if (!this.isOpen()) {
      this.isOpen.set(true);
      setTimeout(() => {
        const searchInput = this.searchInput();
        searchInput!.nativeElement.value += char;
        searchInput!.nativeElement.focus();
        this.currentHighlightIndex.set(0); // currentHighlightIndex'i sıfırla
        this.scrollDown();
      }, 100);
    }
  }

  toggleDropdown() {
    if (this.disabled()) {
      return;
    }
    this.isOpen.set(!this.isOpen());

    if (this.isOpen()) {
      setTimeout(() => {
        this.searchInput()!.nativeElement.focus();
        this.scrollDown();
      }, 100);
    }
  }

  onKeyDownForMainDiv(event: KeyboardEvent) {
    if (this.disabled()) {
      return;
    }

    if (event.key === 'ArrowDown') {
      if (!this.isOpen()) {
        this.toggleDropdown();
      }
    } else if (event.code === 'Space') {
      if (this.isOpen()) {
        setTimeout(() => {
          this.searchInput()!.nativeElement.focus();
          this.scrollDown();
        }, 100);
      }
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!this.isOpen()) {
        this.toggleDropdown();
      }
      if (this.currentHighlightIndex() < this.filteredData().length - 1) {
        this.currentHighlightIndex.update(index => index + 1);
        this.scrollToElement(this.currentHighlightIndex());
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.currentHighlightIndex() > 0) {
        this.currentHighlightIndex.update(index => index - 1);
        this.scrollToElement(this.currentHighlightIndex());
      }
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const item = this.filteredData()[this.currentHighlightIndex()];
      if (item) {
        this.select(item);
      }
      if (!this.multiple()) {
        this.moveToNextElement();
      }
    } else if (event.key === 'Tab') {
      const item = this.filteredData()[this.currentHighlightIndex()];
      if (item) {
        this.select(item);
      }
      this.moveToNextElement();
      this.isOpen.set(false);
    }
    else if (event.key === 'Escape') {
      this.isOpen.set(false);
      this.closedAfterSelect.set(true);
      this.flexiSelectDiv().nativeElement.focus();
    } else if (event.key === 'Space') {
      if (!this.isOpen()) {
        this.toggleDropdown();
      }
    }
  }

  moveToNextElement() {
    setTimeout(() => {
      const currentElement = this.#elementRef.nativeElement;
      const nextElement = this.findNextFocusableElement(currentElement);
      if (nextElement) {
        nextElement.focus();
      }
    });
  }

  private findNextFocusableElement(element: HTMLElement): HTMLElement | null {
    const currentTabIndex = this.tabindex();
    const nextTabIndex = currentTabIndex + 1;

    // Tüm belgeyi dolaşarak bir sonraki tabindex'e sahip elementi bul
    const allElements = document.querySelectorAll('*');
    for (let i = 0; i < allElements.length; i++) {
      const el = allElements[i] as HTMLElement;
      const elTabIndex = parseInt(el.getAttribute('tabindex') || '-1', 10);

      if (elTabIndex === nextTabIndex && this.isFocusable(el)) {
        return el;
      }
    }

    // Eğer bir sonraki tabindex bulunamazsa, en düşük pozitif tabindex'i bul
    let lowestPositiveTabIndex = Infinity;
    let elementWithLowestTabIndex: HTMLElement | null = null;

    for (let i = 0; i < allElements.length; i++) {
      const el = allElements[i] as HTMLElement;
      const elTabIndex = parseInt(el.getAttribute('tabindex') || '-1', 10);

      if (elTabIndex > 0 && elTabIndex < lowestPositiveTabIndex && this.isFocusable(el)) {
        lowestPositiveTabIndex = elTabIndex;
        elementWithLowestTabIndex = el;
      }
    }

    return elementWithLowestTabIndex;
  }

  isFocusable(element: HTMLElement): boolean {
    const focusableTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
    return focusableTags.includes(element.tagName) || element.tabIndex >= 0;
  }

  scrollToElement(index: number) {
    const ulElement = this.flexiSelectUl().nativeElement;
    const liElement = ulElement.children[index];
    if (liElement) {
      liElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  selectForMultiple(item: any) {
    if (!this.isItemSelectableInMultiple(item)) {
      // Max limite ulaşıldı ve item seçili değilse, yeni seçim yapılmasın
      return;
    }

    const selectedItem = {
      [this.label()]: item[this.label()],
      [this.value()]: item[this.value()]
    };

    const existingIndex = this.selectedItems().findIndex(existingItem => existingItem[this.value()] === selectedItem[this.value()]);

    if (existingIndex > -1) {
      this.selectedItems.update(prev => {
        const updatedItems = [...prev];
        updatedItems.splice(existingIndex, 1);
        return updatedItems;
      });
    } else {
      this.selectedItems.update(prev => [...prev, selectedItem]);
    }

    if (this.closeAfterSelect()) {
      this.isOpen.set(false);
    }

    const selectedItemsForNgModel = this.selectedItems().map(val => val[this.value()]);
    this.selected.emit(selectedItemsForNgModel);
    this.onChange(selectedItemsForNgModel);

    this.searchInput()!.nativeElement.select();
  }

  selectSingle(item: any) {
    this.selectedItem.set(item);
    this.isOpen.set(false);
    this.closedAfterSelect.set(false);

    let value = this.value() ? item[this.value()] : item;
    if(value === this.selectOneText()){
      value = null
    }
    this.selected.emit(value);
    this.onChange(value);
    this.searchInput()!.nativeElement.select();
  }

  select(item: any) {
    if (this.multiple()) {
      this.selectForMultiple(item);
      if (this.closeAfterSelect()) {
        this.moveToNextElement();
      }
    } else {
      this.selectSingle(item);
      this.moveToNextElement();
    }

  }

  selectOption(option: FlexiOptionComponent) {
    const selectedItem = {
      [this.value()]: option.value(),
      [this.label()]: option.viewValue
    };
    this.select(selectedItem);
  }

  writeValue(value: any): void {
    if (value) {
      this.initialState = value;
      this.selectInitialStateValue();
    } else {
      this.selectedItem.set({});
      this.selectFirstOne();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Implement if needed
  }

  removeSelectedItemFromSelectedItems(index: number, item: any) {
    this.selectedItems.update(prev => {
      const updatedItems = [...prev];
      updatedItems.splice(index, 1);
      return updatedItems;
    });

    const selectedItemsForNgModel = this.selectedItems().map(val => val[this.value()]);
    this.selected.emit(selectedItemsForNgModel);
    this.onChange(selectedItemsForNgModel);

    this.isOpen.set(true);

    this.scrollDown();
  }

  getSelectContainerClass(): string {
    let classes = "flexi-select";

    if (this.disabled()) {
      classes += " flexi-select-disabled";
    }

    if (this.isTouched() && !this.isValid() && this.showValidationErrors()) {
      classes += " flexi-select-invalid";
    }

    return classes;
  }

  hasMaxSelectionLimit(): boolean {
    return this.maxSelections() !== Infinity && this.maxSelections() > 0;
  }

  isMaxSelectionReached(): boolean {
    return this.hasMaxSelectionLimit() && this.selectedItems().length >= this.maxSelections();
  }

  canSelectMoreItems(): boolean {
    return !this.hasMaxSelectionLimit() || this.selectedItems().length < this.maxSelections();
  }

  isItemSelectableInMultiple(item: any): boolean {
    if (!this.multiple()) return true;

    // Zaten seçili olan item'lar her zaman tıklanabilir (remove için)
    const isAlreadySelected = this.selectedItems().some(selected => selected[this.value()] === item[this.value()]);
    if (isAlreadySelected) return true;

    // Max limite ulaşılmışsa yeni seçim yapılamaz
    return this.canSelectMoreItems();
  }

  // Validation durumunu manuel olarak sıfırlama
  resetValidation() {
    this.isTouched.set(false);
    this.isValid.set(true);
    this.validationErrors.set([]);
  }
}