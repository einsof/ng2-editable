import {
  Component, Input, Output, EventEmitter, ElementRef, ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import { EditableComponent } from './editable.component';

@Component({
  moduleId: 'ng2-editable-custom',
  selector: 'ng2-textarea-editable',
  template: `
    {{isActive ? '' : value}}
    <textarea *ngIf="isActive" value="{{value}}" placeholder="{{placeholder}}" class="ng2-editable" [formControl]="control"></textarea>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextareaEditableComponent extends EditableComponent {

  @Input() public placeholder = '';
  @Output() public textChange = new EventEmitter<string>();

  private originalText: string = '';

  constructor (
    cdRef: ChangeDetectorRef,
    elem: ElementRef
  ) {
    super(cdRef, elem);
  }

  protected createToggleEvent = () => ({
    isActive: this.active,
    isChanged: this.value !== this.originalText
  })

  protected handleStateChange = () => {
    if (this.active) {
      this.originalText = this.value;
    } else {
      if (this.value !== this.originalText) {
        this.textChange.emit(this.value);
      }
    }
  }

  protected resetToDefaultState = () => {
    this.value = this.originalText;
    this.active = false;
  }

  protected saveChanges = () => {
    this.originalText = this.value;
    this.active = false;
    this.textChange.emit(this.value);
  }
}