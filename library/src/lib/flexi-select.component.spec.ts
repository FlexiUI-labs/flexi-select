import { TestBed } from '@angular/core/testing';
import { FlexiSelectComponent } from './flexi-select.component';

describe('FlexiSelectComponent', () => {
  it('closes the list and ignores keyboard selection when disabled while open', () => {
    const fixture = TestBed.createComponent(FlexiSelectComponent);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('data', ['Draft', 'Confirmed']);
    fixture.detectChanges();
    component.writeValue('Draft');
    component.isOpen.set(true);
    fixture.detectChanges();

    const selected: unknown[] = [];
    component.selected.subscribe(value => selected.push(value));

    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    component.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    component.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    component.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(component.isOpen()).toBe(false);
    expect(component.modelValue()).toBe('Draft');
    expect(selected).toEqual([]);
  });
});
