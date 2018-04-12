import { Component, ElementRef, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { EditableComponent } from './editable.component';

@Component({
  moduleId: 'ng2-editable-custom',
  selector: 'ng2-toggleable',
  template: `
    {{isActive ? '' : (value ? '\u2713' : (showFalse ? '\u2717' : ''))}}
    <input *ngIf="isActive" type="checkbox" [(ngModel)]="value"
      style="margin-left: auto; margin-right: auto;">
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleableComponent extends EditableComponent {

  @Input() public value: boolean;
  @Output() public valueChange = new EventEmitter<boolean>();

  @Input() public showFalse = true;

  private originalValue: boolean | undefined = undefined;

  constructor (
    cdRef: ChangeDetectorRef,
    elem: ElementRef
  ) {
    super(cdRef, elem);
  }

  protected createToggleEvent = () => ({
    isActive: this.active,
    isChanged: this.value !== this.originalValue
  });

  protected handleStateChange = () => {
    if (this.active) {
      this.originalValue = this.value;
    } else {
      if (this.value !== this.originalValue) {
        this.valueChange.emit(this.value);
      }
    }
  };

  protected resetToDefaultState = () => {
    this.value = this.originalValue === undefined ? false : this.originalValue;
    this.active = false;
  };

}