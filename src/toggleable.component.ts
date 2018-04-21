import { Component, ElementRef, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { EditableComponent } from './editable.component';

@Component({
  moduleId: 'ng2-editable-custom',
  selector: 'ng2-toggleable',
  template: `
    {{isActive ? '' : (value ? '\u2713' : (showFalse ? '\u2717' : ''))}}
    <input *ngIf="isActive" type="checkbox" class="ng2-editable" value="{{value}}" (focus)="onFocus($event)" (blur)="onBlur($event)">
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleableComponent extends EditableComponent {

  @Output() public valueChange = new EventEmitter<boolean>();

  @Input() public showFalse = true;

  private originalValue: boolean | undefined = undefined;

  constructor (
    cdRef: ChangeDetectorRef,
    elem: ElementRef
  ) {
    super(cdRef, elem);
  }

  public onFocus (event: FocusEvent) {
    this.focused = true;
  }

  public onBlur (event: FocusEvent) {
    this.focused = false;
  }

  protected createToggleEvent = () => ({
    isActive: this.active,
    isChanged: this.control.value !== this.originalValue
  })

  protected handleStateChange = () => {
    if (this.active) {
      this.originalValue = this.value;
      this.control.setValue(this.value);
    } else {
      if (this.control.value !== this.originalValue) {
        this.valueChange.emit(this.control.value);
      }
    }
  }

  protected resetToDefaultState = () => {
    this.control.setValue(this.originalValue === undefined ? false : this.originalValue);
    this.active = false;
  }

  protected saveChanges = () => {
    this.originalValue = this.control.value;
    this.active = false;
    this.valueChange.emit(this.control.value);
  }
}