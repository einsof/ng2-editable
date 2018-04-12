import {
  Component, Input, Output, EventEmitter, ElementRef, ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import { EditableComponent } from './editable.component';

@Component({
  moduleId: 'ng2-editable-custom',
  selector: 'ng2-textarea-editable',
  template: `
    {{isActive ? '' : text}}
    <textarea *ngIf="isActive" [(ngModel)]="text"></textarea>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextareaEditableComponent extends EditableComponent {

  @Input() public text = '';
  @Output() public textChange = new EventEmitter<string>();

  private originalText = '';

  constructor (
    cdRef: ChangeDetectorRef,
    elem: ElementRef
  ) {
    super(cdRef, elem);
  }

  protected createToggleEvent = () => ({
    isActive: this.active,
    isChanged: this.text !== this.originalText
  });

  protected handleStateChange = () => {
    if (this.active) {
      this.originalText = this.text;
    } else {
      if (this.text !== this.originalText) {
        this.textChange.emit(this.text);
      }
    }
  }
}
