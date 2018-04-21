import {
  Component, Input, Output, EventEmitter, ElementRef, ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import { EditableComponent } from './editable.component';

@Component({
  moduleId: 'ng2-editable-custom',
  selector: 'ng2-input-editable',
  template: `
    {{isActive ? '' : value}}
    <input type="text" *ngIf="isActive" value="{{value}}" placeholder="{{placeholder}}" class="ng2-editable no-validate"
           [formControl]="control" (focus)="onFocus($event)" (blur)="onBlur($event)">
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputEditableComponent extends EditableComponent {

  @Input() public placeholder = '';
  @Output() public textChange = new EventEmitter<string>();

  private originalText: string = '';

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
    isChanged: this.control.value !== this.originalText
  })

  protected handleStateChange = () => {
    if (this.active) {
      this.originalText = this.value;
      this.control.setValue(this.value);
    } else {
      if (this.control.value !== this.originalText) {
        this.textChange.emit(this.control.value);
      }
    }
  }

  protected resetToDefaultState = () => {
    this.control.setValue(this.originalText);
    this.active = false;
  }

  protected saveChanges = () => {
    this.originalText = this.control.value;
    this.active = false;
    this.textChange.emit(this.control.value);
  }
}
